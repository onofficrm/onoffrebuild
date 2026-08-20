# HeidiSQL Production Procedure — Migration 005 only

**Gate:** Do not `git push origin main` / FTP deploy until Backup + Migration 005 + Postflight PASS.

Production host (web): `https://onoff.icrm.co.kr/`  
Deploy path (FTP): `/public_html/` via `.github/workflows/deploy.yml` on `main`  
SSH: not required for this path.

## 0. Confirm DB target

1. Open HeidiSQL.
2. Connect using the **production** profile (credentials from server `data/dbconfig.php` — never commit).
3. Select the same database name as `G5_MYSQL_DB`.
4. Run:

```sql
SELECT DATABASE() AS current_database;
SHOW TABLES LIKE 'g5_seosys300_website_orders';
```

If the table is missing, stop — apply 001–004 first per `docs/production-migration-plan.md`. Do not run 005 alone.

## 1. Full backup

1. HeidiSQL → Tools → Export database as SQL  
   or right-click database → Export database as SQL.
2. Include **schema + data** for the whole production DB (not only SEO tables).
3. Save outside `public_html`, filename with timestamp, e.g.  
   `onoff-prod-backup-YYYYMMDDHHMM.sql` (ZIP OK).
4. Confirm file size > 0 and file opens.

Reply in chat with: `DB_BACKUP_CONFIRMED=<filename> size=<bytes>`  
(Do not paste credentials.)

**Until then: WAITING_FOR_DB_BACKUP_CONFIRMATION — Migration and push forbidden.**

## 2. Preflight

Load and run:

`plugin/seo-system-300/migrations/ops_005_heidi_preflight.sql`

Record:

| Check | Expected before 005 |
|------|---------------------|
| `order_no` column | missing |
| `extra_json` column | missing |
| `wizard_step` | exists (likely `varchar(20)`) |
| index `order_no` | missing |
| row count | note number |

If `order_no` / `extra_json` **already exist**, do **not** re-run 005 ADD COLUMN. Jump to postflight and treat as already applied.

## 3. Migration 005 (once)

Load and run **exactly once**:

`plugin/seo-system-300/migrations/005_website_order_wizard.sql`

Never run `005_website_order_wizard.down.sql` unless a restore decision is made.

SQL is additive:

- ADD `order_no` varchar(32) NULL + UNIQUE
- ADD `extra_json` mediumtext NULL
- MODIFY `wizard_step` varchar(32) NOT NULL DEFAULT 'intro'
- UPDATE empty `extra_json` → `'{}'`

No DROP / DELETE / TRUNCATE of business rows.

## 4. Postflight

Load and run:

`plugin/seo-system-300/migrations/ops_005_heidi_postflight.sql`

Expect:

- `order_no` Null=YES, UNIQUE
- `extra_json` present
- `wizard_step` varchar(32)
- row count unchanged vs preflight
- zero duplicate non-null `order_no`

Reply: `MIGRATION_005_APPLIED=YES` with postflight summary (no secrets).

## 5. After migration success

Only then:

1. Ensure QA commit is on local `main` (SPA `seo-system-300/` + plugin docs/SQL ops).
2. `git push origin main` → GitHub Action FTP to `/public_html/`.
3. Confirm production HTML asset hash changed from previous `index-CN9J5Gvh.js`.
4. Browser smoke (no live customer submit).
