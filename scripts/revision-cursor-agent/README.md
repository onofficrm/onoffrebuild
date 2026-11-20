# Homepage revision Cursor agent

## Files
- `run.mjs` — download package, run agent, post feedback (requires confirm URL)
- `worker.mjs` — poll `queued` (+ auto-retry `failed`), run tickets
- `ensure-worker.sh` — keep one supervised worker alive (cron-safe)
- `healthcheck.sh` — ensure worker + queue/SLA counters
- `deploy-site.mjs` — FTP changed files after checklist ready
- `register-site.sh` — add domain→cwd map + FTP env example
- `start-worker.sh` — load local secrets and start the worker
- `site-cwd-map.example.json` — domain → local customer workspace map

## Secrets
- `~/.config/onoffmarketing/cursor-api.env` → `CURSOR_API_KEY`
- `~/.config/onoffmarketing/revision-worker.env` → `ONOFF_CRM_CONTRACT_API_TOKEN` (0600; written by `install-home-launchd.sh` because LaunchAgent cannot SSH)
- `~/.config/onoffmarketing/revision-site-cwd.map.json` → domain cwd map
- Customer FTP: `$cwd/ops/ftp.env` (from `ftp.env.example`)

## Customer workspaces
```bash
./scripts/revision-cursor-agent/register-site.sh \
  --domain=bizontop.co.kr \
  --cwd=/Volumes/onoff/cursor/sites/bizontop
# then fill /Volumes/onoff/cursor/sites/bizontop/ops/ftp.env
```
`run.mjs` refuses to use the ONOFF platform repo as cwd for customer domains.

## Commands
```bash
# one poll
./scripts/revision-cursor-agent/start-worker.sh --once

# keep worker alive (preferred; used by healthcheck cron)
./scripts/revision-cursor-agent/ensure-worker.sh 30

# KeepAlive LaunchAgent (mirrors agent to ~/Library/.../onoff-revision-worker/agent;
# never uses /Volumes as LaunchAgent cwd — Node ESM can hang there)
./scripts/revision-cursor-agent/install-home-launchd.sh

# queue / process health (cron every 5 min on /Volumes checkouts)
#   */5 * * * * .../scripts/revision-cursor-agent/healthcheck.sh
./scripts/revision-cursor-agent/healthcheck.sh

# deploy changed files for a ticket
node scripts/revision-cursor-agent/deploy-site.mjs --ticketId=5 --dry-run
node scripts/revision-cursor-agent/deploy-site.mjs --ticketId=5

# drain CRM deploy queue (dry-run unless SEOSYS300_REVISION_AUTO_DEPLOY=1 + ftp.env)
node scripts/revision-cursor-agent/process-deploy-queue.mjs
```
Live FTP for bizontop requires filling
`/Volumes/onoff/cursor/sites/bizontop/ops/ftp.env` (Cafe24). The shared
`~/.config/onoffmarketing/ftp.env` is the platform host and must not be reused.


## Auto-retry
Failed dispatches are retried up to `SEOSYS300_REVISION_AUTO_RETRY_MAX` (default 2)
after `SEOSYS300_REVISION_AUTO_RETRY_AFTER_SEC` (default 300).

## Service loop
1. Customer creates revision (pageUrl defaults to site URL)
2. CRM triage → 정리 완료 → **무료 진행 · 에이전트 대기열** (auto-dispatch)
3. Worker marks `running`, runs agent, posts feedback (or `failed` → auto-retry)
4. Staff runs deploy command / deploy queue when checklist is ready
5. Customer confirms in SEO System 300
