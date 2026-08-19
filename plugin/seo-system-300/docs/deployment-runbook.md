# SEO SYSTEM 300 — Deployment runbook

**This runbook was not executed** during launch-readiness. Do not merge `main` or trigger FTP from this branch as part of verification.

## Actual CI/CD in this repository

File: `.github/workflows/deploy.yml`

| Trigger | Behavior |
|---------|----------|
| `push` to **`main`** | Checkout, then `SamKirkland/FTP-Deploy-Action@v4.3.5` |
| `workflow_dispatch` | Same FTP job |

FTP target:

- `server-dir`: `/public_html/`
- `local-dir`: repository root `./`
- Secrets: `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`, `FTP_PORT`
- Protocol: `ftp`
- Concurrency group: `onoffrebuild-ftp-deploy` (cancels in-progress)

**Excluded from FTP** (among others): `.git*`, `.github/**`, `build/**`, `data/dbconfig.php`, `data/dbconfig.local.php`, `data/icrm.config.php`, `data/onoff_private_keys.php`, runtime `data/cache|session|file|log|tmp`, `.env*`, `plugin/auto_comment/packages/**`.

**Included if present in git:** `plugin/seo-system-300/**` (except gitignored `config.local.php`), compiled `seo-system-300/` SPA, root `.htaccess`.

There is **no** GitHub Action that runs PHP migrations. Schema is a **manual ops step** after files are on the server (see `production-migration-plan.md`).

React source lives in `build/seo-system-300/`. Production serves `seo-system-300/` (copied by `npm run build:deploy` in that package). Operators must commit/push the dist (or generate it in CI — **this workflow does not currently run `npm`**). If dist is stale on `main`, FTP will ship a stale SPA.

## Recommended production sequence (future)

### 1. Merge to `main`

Only after Core E2E PASS on an isolated development DB and a reviewed PR.  
**Not done in the current verification step.**

### 2. GitHub Actions FTP

Push to `main` (or `workflow_dispatch`) deploys the tree to `/public_html/`. Watch the Actions log. Confirm excludes still skip `dbconfig.php`.

### 3. PHP plugin

Confirm on server:

- `plugin/seo-system-300/api/` reachable
- `plugin/seo-system-300/config.local.php` exists (created on server; never from git)

### 4. React dist

Confirm `seo-system-300/index.html` and hashed assets match the intended build.  
Root `.htaccess` already rewrites `^seo-system-300(/.*)?$` to `/seo-system-300/index.html` **after** existing-file short-circuit, so `/plugin/seo-system-300/` and GNUBoard paths are not captured.

### 5. Config

Copy from `plugin/seo-system-300/config.local.php.example`. Set only what this environment needs. Leave Google/AI/tool URLs empty until credentials/URLs are real.

Standing production config must **not** keep migration unlock flags. Set them only for a documented window:

- `SEOSYS300_ENV=production`
- `SEOSYS300_DB_ALLOWLIST` / `SEOSYS300_DB_HOST_ALLOWLIST` (exact values from `dbconfig.php`, never committed)
- `SEOSYS300_ALLOW_MIGRATION=1`
- `SEOSYS300_BACKUP_CONFIRMED=1`
- `SEOSYS300_PRODUCTION_CONFIRM=SEO-SYSTEM-300-PRODUCTION`

Never set `SEOSYS300_E2E=1` on production. Do not set `SEOSYS300_ENV=development` on the production host to bypass guards.

### 6. Migration

1. Launch OFF  
2. Whole DB backup  
3. Confirm DB host/name from `data/dbconfig.php`  
4. Allowlist those exact values  
5. `SEOSYS300_BACKUP_CONFIRMED=1`  
6. `php plugin/seo-system-300/migrations/run.php --status`  
7. Production confirmation env + CLI `--confirm-production=SEO-SYSTEM-300-PRODUCTION`  
8. `php plugin/seo-system-300/migrations/run.php --apply --confirm-production=SEO-SYSTEM-300-PRODUCTION`  
9. `--status` (001→005 APPLIED)  
10. `php plugin/seo-system-300/migrations/verify.php`  
11. Smoke (below)

See `docs/production-migration-plan.md`. The runner never prints DB passwords. Failed files stop the batch; no automatic DOWN.

### 7. Smoke test (after migrate)

- Logged-out `/seo-system-300/dashboard` → login required
- Member dashboard loads (no SQL/PHP dumped to UI)
- Member `/seo-system-300/admin` forbidden
- Admin kanban loads for super admin
- Existing `/`, `/seo-system`, `/adm`, `/notice`, `/faq`, `/youtube`, GNUBoard login unchanged
- Tools show NOT_CONFIGURED or LINK_ONLY — no fake KPIs
- AI shows not configured — no fake coach copy

### 8. Rollback

1. FTP previous known-good commit (or restore files from backup).
2. If migration applied and must be undone: restore DB dump **or** reverse `005`→`001` down SQL (data loss).
3. `config.local.php` is not in git; restore from ops backup if overwritten.

## Local / development

- `data/dbconfig.php` is gitignored and **was not present** in the verification workspace.
- Isolated development DB + `SEOSYS300_ENV=development` + allowlist is required before `php plugin/seo-system-300/migrations/run.php --apply`.
- Allowed isolated names: `seosys300_dev` (local Docker) or `seosys300_rehearsal` (fresh rehearsal Docker). Host must be `db`.
- Do not point the runner at production MySQL (`SEOSYS300_DB_ALLOWLIST` + local host checks).
