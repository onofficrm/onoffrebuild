# SEO SYSTEM 300 — Production migration plan

**Do not execute this plan from `feat/seo-system-300` without an explicit production change window.**  
This document is a runbook only. Production migration was **not** run in the launch-readiness work.

Prefix: GNUBoard `G5_TABLE_PREFIX` (usually `g5_`). All tables are `{$prefix}seosys300_*`.

## 1. Preconditions

- [ ] Full MySQL dump of the production database (not only SEO SYSTEM tables).
- [ ] Confirm `data/dbconfig.php` on the server is the intended production instance.
- [ ] Plugin PHP (`plugin/seo-system-300/`) and React dist (`seo-system-300/`) already deployed **or** deployed in the same window **before** members hit new APIs that require tables.
- [ ] `plugin/seo-system-300/config.local.php` present on the server (gitignored). Secrets never in git.
- [ ] Maintenance: **recommended but not strictly required** if traffic is low. New tables are additive (`CREATE TABLE IF NOT EXISTS`). Existing GNUBoard tables are not altered.
- [ ] Do **not** set `SEOSYS300_ALLOW_MIGRATION=1` on production. Apply SQL via a controlled DBA/ops session, not the guarded CLI runner (the runner refuses production hostnames).

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

## 3. Execution order

Run **exactly** this order. Stop on first error.

| Order | File | Purpose |
|------:|------|---------|
| 1 | `plugin/seo-system-300/migrations/001_projects_and_website.sql` | Projects, website order, files |
| 2 | `plugin/seo-system-300/migrations/002_roadmap_missions_activity_admin.sql` | Roadmap catalog + per-project tasks, missions, activity, admin notes |
| 3 | `plugin/seo-system-300/migrations/003_google_metrics.sql` | GSC/GA4 connections and daily metrics |
| 4 | `plugin/seo-system-300/migrations/004_tools_ai.sql` | Tool integrations, AI runs/cache |

Optional ops-only (created automatically by the **dev** CLI runner; production may create the same table if you want apply history):

```sql
CREATE TABLE IF NOT EXISTS `g5_seosys300_migrations` (
  `migration` varchar(80) NOT NULL DEFAULT '',
  `applied_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `checksum` varchar(64) NOT NULL DEFAULT '',
  PRIMARY KEY (`migration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

002 uses `INSERT IGNORE` for step/task seeds (`UNIQUE` on `step_key` / `task_key`). Re-running 002 must not duplicate catalog rows.

## 4. Expected impact

- **Reads/writes:** no change to GNUBoard `g5_member` or board tables.
- **Downtime:** none expected if `CREATE TABLE` only; brief lock on empty new tables.
- **App:** APIs already return `503 tables_missing` until these tables exist. After apply, Core features can go live. Google/AI stay `NOT_CONFIGURED` until env is filled.

## 5. Verification SQL (after 001–004)

```sql
SHOW TABLES LIKE 'g5_seosys300_%';

SELECT COUNT(*) AS steps FROM g5_seosys300_roadmap_steps; -- expect 10
SELECT step_key FROM g5_seosys300_roadmap_steps ORDER BY sort_order;
-- project_setup, website, domain, technical_seo, keywords,
-- content, backlink, traffic, analytics, growth

SELECT COUNT(*) AS tasks FROM g5_seosys300_roadmap_tasks;
SELECT task_key, COUNT(*) c FROM g5_seosys300_roadmap_tasks GROUP BY task_key HAVING c > 1;
```

Expect zero duplicate `task_key` rows.

Spot-check groups:

- Core: `projects`, `project_keywords`, `website_orders`, `website_menu`, `website_features`, `website_references`, `website_files`, `website_status_history`
- Roadmap: `roadmap_steps`, `roadmap_tasks`, `project_roadmap_tasks`, `task_results`, `daily_missions`, `activities`, `admin_notes`
- Google: `google_connections`, `project_integrations`, `gsc_daily`, `gsc_queries`, `gsc_pages`, `ga4_daily`, `sync_runs`
- Tools/AI: `tool_integrations`, `ai_runs`, `ai_analysis_cache`

(All names prefixed with `g5_seosys300_` unless prefix differs.)

## 6. Rollback

Each numbered SQL has a matching `00N_*.down.sql`. Rollback **reverse order**: 004 → 003 → 002 → 001.

**Warning:** `DROP TABLE` destroys any student/admin data in those tables. Prefer restore-from-dump if 001–004 already received live rows.

Down files do not restore GNUBoard data (they never touched it).

## 7. Failure handling

1. Stop applying further files.
2. Capture MySQL error and the file/statement that failed.
3. Restore from the pre-migration dump if any partial objects are inconsistent.
4. Do not “fix forward” on production without a second backup.
5. Keep `feat/seo-system-300` off `main` until Core E2E has passed on an isolated development database.

## 8. What this branch must not do

- No `main` merge as part of this readiness step.
- No GitHub Actions FTP deploy (workflow runs on `main` push only).
- No production `mysqldump` / migrate from a developer laptop unless ops explicitly owns that window.
