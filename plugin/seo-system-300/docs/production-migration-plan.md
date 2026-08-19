# SEO SYSTEM 300 — Production migration plan

**Do not execute this plan from `feat/seo-system-300` without an explicit production change window.**  
This document is a runbook only. Production migration was **not** run in the launch-readiness work.

Prefix: GNUBoard `G5_TABLE_PREFIX` (usually `g5_`). All tables are `{$prefix}seosys300_*`.

## 1. Preconditions

- [ ] Launch mode is **OFF** (`SEOSYS300_LAUNCH_MODE=off`) until smoke passes.
- [ ] Full MySQL dump of the production database (not only SEO SYSTEM tables). Confirm dump size and restore-test if possible.
- [ ] Confirm `data/dbconfig.php` on the server: record the **exact** `G5_MYSQL_HOST` and `G5_MYSQL_DB` (do not put those values in git).
- [ ] Plugin PHP (`plugin/seo-system-300/`) and React dist (`seo-system-300/`) already deployed **or** deployed in the same window **before** members hit new APIs that require tables.
- [ ] `plugin/seo-system-300/config.local.php` present on the server (gitignored). Secrets never in git.
- [ ] Maintenance: **recommended but not strictly required** if traffic is low. New tables are additive (`CREATE TABLE IF NOT EXISTS`). Existing GNUBoard tables are not altered.

Do **not** disguise production as `SEOSYS300_ENV=development`. The CLI runner has an explicit production path.

## 2. Backup (production)

Example (adjust user/host/db; do not commit credentials):

```bash
mysqldump --single-transaction --routines --triggers -h "$G5_MYSQL_HOST" -u "$G5_MYSQL_USER" -p "$G5_MYSQL_DB" \
  > "seosys300-pre-mig-$(date +%Y%m%d%H%M).sql"
```

Optional table-only snapshot after identifying prefix:

```bash
mysqldump --single-transaction -h ... -u ... -p "$G5_MYSQL_DB" \
  g5_seosys300_projects g5_seosys300_website_orders \
  > seosys300-related-tables.sql
```

(First production install has none of these tables yet.)

## 3. CLI production procedure (001→005)

Run on the production app host only, after backup. Never from a laptop against production MySQL.

1. Launch OFF.
2. Whole-database backup (section 2). Set `SEOSYS300_BACKUP_CONFIRMED=1` only after the dump is verified.
3. Confirm actual `G5_MYSQL_HOST` and `G5_MYSQL_DB` from `data/dbconfig.php`.
4. Set allowlists to those exact values:
   - `SEOSYS300_ENV=production`
   - `SEOSYS300_DB_HOST_ALLOWLIST=<exact host>`
   - `SEOSYS300_DB_ALLOWLIST=<exact db>`
   - `SEOSYS300_ALLOW_MIGRATION=1` (apply window only)
5. Status (read-only if the history table is missing; does **not** `CREATE TABLE`):
   ```bash
   php plugin/seo-system-300/migrations/run.php --status
   ```
6. Production confirmation (env **and** CLI; both must equal `SEO-SYSTEM-300-PRODUCTION`):
   - `SEOSYS300_PRODUCTION_CONFIRM=SEO-SYSTEM-300-PRODUCTION`
7. Apply:
   ```bash
   php plugin/seo-system-300/migrations/run.php --apply --confirm-production=SEO-SYSTEM-300-PRODUCTION
   ```
   The runner prints ENV, HOST, DB, PREFIX, and pending files. It does not print passwords. A failed file stops the run; later files are not applied; history is written only after success; no automatic DOWN.
8. Status again: 001–005 APPLIED. Checksum mismatch aborts with `CHECKSUM_MISMATCH`.
9. Verify:
   ```bash
   php plugin/seo-system-300/migrations/verify.php
   ```
10. Smoke (deployment runbook). Then remove `SEOSYS300_ALLOW_MIGRATION`, backup, and production confirm env vars from the standing config.

## 4. Execution order (SQL files)

Run **exactly** this order. Stop on first error. The runner applies pending files in this list only.

| Order | File | Purpose |
|------:|------|---------|
| 1 | `plugin/seo-system-300/migrations/001_projects_and_website.sql` | Projects, website order, files |
| 2 | `plugin/seo-system-300/migrations/002_roadmap_missions_activity_admin.sql` | Roadmap catalog + per-project tasks, missions, activity, admin notes |
| 3 | `plugin/seo-system-300/migrations/003_google_metrics.sql` | GSC/GA4 connections and daily metrics |
| 4 | `plugin/seo-system-300/migrations/004_tools_ai.sql` | Tool integrations, AI runs/cache |
| 5 | `plugin/seo-system-300/migrations/005_website_order_wizard.sql` | Website order `order_no` (nullable UNIQUE), `extra_json`, `wizard_step` |

Optional ops-only history table (created by **development** `--status`/`--apply`, and by **production `--apply`**. Production `--status` does **not** create it if missing):

```sql
CREATE TABLE IF NOT EXISTS `g5_seosys300_migrations` (
  `migration` varchar(80) NOT NULL DEFAULT '',
  `applied_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `checksum` varchar(64) NOT NULL DEFAULT '',
  PRIMARY KEY (`migration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

002 uses `INSERT IGNORE` for step/task seeds (`UNIQUE` on `step_key` / `task_key`). Re-running 002 must not duplicate catalog rows.

## 5. Expected impact

- **Reads/writes:** no change to GNUBoard `g5_member` or board tables.
- **Downtime:** none expected if `CREATE TABLE` only; brief lock on empty new tables.
- **App:** APIs already return `503 tables_missing` until these tables exist. After apply, Core features can go live. Google/AI stay `NOT_CONFIGURED` until env is filled.

## 6. Verification SQL (after 001–005)

```sql
SHOW TABLES LIKE 'g5_seosys300_%';

SELECT COUNT(*) AS steps FROM g5_seosys300_roadmap_steps; -- expect 10
SELECT step_key FROM g5_seosys300_roadmap_steps ORDER BY sort_order;
-- project_setup, website, domain, technical_seo, keywords,
-- content, backlink, traffic, analytics, growth

SELECT COUNT(*) AS tasks FROM g5_seosys300_roadmap_tasks; -- expect 41
SELECT task_key, COUNT(*) c FROM g5_seosys300_roadmap_tasks GROUP BY task_key HAVING c > 1;

SHOW COLUMNS FROM g5_seosys300_website_orders LIKE 'order_no'; -- Null=YES
SHOW INDEX FROM g5_seosys300_website_orders WHERE Column_name='order_no'; -- Non_unique=0
SHOW COLUMNS FROM g5_seosys300_website_orders LIKE 'extra_json';
SHOW COLUMNS FROM g5_seosys300_website_orders LIKE 'wizard_step';
```

Expect zero duplicate `task_key` rows.

Spot-check groups:

- Core: `projects`, `project_keywords`, `website_orders`, `website_menu`, `website_features`, `website_references`, `website_files`, `website_status_history`
- Roadmap: `roadmap_steps`, `roadmap_tasks`, `project_roadmap_tasks`, `task_results`, `daily_missions`, `activities`, `admin_notes`
- Google: `google_connections`, `project_integrations`, `gsc_daily`, `gsc_queries`, `gsc_pages`, `ga4_daily`, `sync_runs`
- Tools/AI: `tool_integrations`, `ai_runs`, `ai_analysis_cache`

(All names prefixed with `g5_seosys300_` unless prefix differs.)

## 7. Rollback

Each numbered SQL has a matching `00N_*.down.sql`. Rollback **reverse order**: 005 → 004 → 003 → 002 → 001.

**Warning:** `DROP TABLE` / `DROP COLUMN` destroys any student/admin data in those objects. Prefer restore-from-dump if 001–005 already received live rows.

Down files do not restore GNUBoard data (they never touched it).

## 8. Failure handling

1. Stop applying further files.
2. Capture MySQL error and the file/statement that failed.
3. Restore from the pre-migration dump if any partial objects are inconsistent.
4. Do not “fix forward” on production without a second backup.
5. Keep `feat/seo-system-300` off `main` until Core E2E has passed on an isolated development database.

## 9. What this branch must not do

- No `main` merge as part of this readiness step.
- No GitHub Actions FTP deploy (workflow runs on `main` push only).
- No production `mysqldump` / migrate from a developer laptop unless ops explicitly owns that window.
