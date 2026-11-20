#!/usr/bin/env bash
# Ensure the revision worker is alive; log queue pressure; scan SLA via API.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"
HOME_STATE="$HOME/Library/Application Support/onoff-revision-worker/state"
HOME_LOG_DIR="$HOME/Library/Application Support/onoff-revision-worker/logs"
VOL_LOG_DIR="$ROOT/data/revision_agent_worker"
LOG_DIR="$HOME_STATE"
mkdir -p "$LOG_DIR" "$HOME_LOG_DIR" "$VOL_LOG_DIR"
HEALTH_LOG="$HOME_LOG_DIR/health.log"
ts() { date -u +%Y-%m-%dT%H:%M:%SZ; }

if [[ -f "$HOME/.config/onoffmarketing/cursor-api.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "$HOME/.config/onoffmarketing/cursor-api.env"
  set +a
fi
if [[ -z "${ONOFF_CRM_CONTRACT_API_TOKEN:-}" ]]; then
  TOKEN="$(ssh -o BatchMode=yes -i "$HOME/.ssh/onoff_server_ed25519" root@icrm.co.kr \
    'grep ^ONOFF_CRM_CONTRACT_API_TOKEN= /var/www/crm-icrm/shared/.env | cut -d= -f2-' 2>/dev/null || true)"
  export ONOFF_CRM_CONTRACT_API_TOKEN="${TOKEN:-}"
fi
if [[ -z "${SEOSYS300_REVISION_SITE_CWD_MAP:-}" && -f "$HOME/.config/onoffmarketing/revision-site-cwd.map.json" ]]; then
  export SEOSYS300_REVISION_SITE_CWD_MAP="$(cat "$HOME/.config/onoffmarketing/revision-site-cwd.map.json")"
fi

API="${ONOFF_REVISIONS_API_URL:-https://onoff.icrm.co.kr/api/crm/revisions.php}"
restarted=0
before="$(pgrep -f 'node .*(revision-cursor-agent|onoff-revision-worker/agent)/worker\.mjs' | head -1 || true)"
ensure_out="$("$ROOT/scripts/revision-cursor-agent/ensure-worker.sh" 30 2>&1 || true)"
after="$(pgrep -f 'node .*(revision-cursor-agent|onoff-revision-worker/agent)/worker\.mjs' | head -1 || true)"
if [[ -z "$before" && -n "$after" ]]; then
  restarted=1
fi
echo "$(ts) ensure ${ensure_out}" | tee -a "$HEALTH_LOG"

queued=0
failed=0
sla=0
deploy_queued=0
if [[ -n "${ONOFF_CRM_CONTRACT_API_TOKEN:-}" ]]; then
  body="$(curl -sS --max-time 20 "$API?status=open" \
    -H "Accept: application/json" \
    -H "X-ONOFF-Contract-Token: $ONOFF_CRM_CONTRACT_API_TOKEN" || true)"
  queued="$(php -r '$j=json_decode(stream_get_contents(STDIN),true); $n=0; foreach(($j["items"]??[]) as $t){ $d=$t["cursorPackage"]["dispatchStatus"]??""; if($d==="queued") $n++; } echo $n;' <<<"$body" 2>/dev/null || echo 0)"
  failed="$(php -r '$j=json_decode(stream_get_contents(STDIN),true); $n=0; foreach(($j["items"]??[]) as $t){ $d=$t["cursorPackage"]["dispatchStatus"]??""; if($d==="failed") $n++; } echo $n;' <<<"$body" 2>/dev/null || echo 0)"
  sla="$(php -r '$j=json_decode(stream_get_contents(STDIN),true); $n=0; foreach(($j["items"]??[]) as $t){ if(($t["sla"]["ok"]??true)===false) $n++; } echo $n;' <<<"$body" 2>/dev/null || echo 0)"
  deploy_queued="$(php -r '$j=json_decode(stream_get_contents(STDIN),true); $n=0; foreach(($j["items"]??[]) as $t){ if(($t["deployPlan"]["status"]??"")==="queued") $n++; } echo $n;' <<<"$body" 2>/dev/null || echo 0)"
  # Token-auth SLA scan (no Cafe24 cron key required).
  curl -sS --max-time 20 -X POST "$API" \
    -H "Accept: application/json" \
    -H "Content-Type: application/json" \
    -H "X-ONOFF-Contract-Token: $ONOFF_CRM_CONTRACT_API_TOKEN" \
    -d '{"action":"sla_scan"}' >/dev/null 2>&1 || true

  # Drain deploy queue on this Mac (dry-run unless SEOSYS300_REVISION_AUTO_DEPLOY=1 + ftp.env).
  if [[ "${deploy_queued:-0}" -gt 0 ]]; then
    echo "$(ts) process deploy_queue count=$deploy_queued" | tee -a "$HEALTH_LOG"
    node "$ROOT/scripts/revision-cursor-agent/process-deploy-queue.mjs" --limit=3 \
      >>"$HOME_LOG_DIR/deploy-queue.log" 2>&1 || true
  fi
fi

alive=0
pgrep -f 'node .*(revision-cursor-agent|onoff-revision-worker/agent)/worker\.mjs' >/dev/null && alive=1

# Publish Mac operator truth (worker + per-domain FTP) so CRM UI is not stuck on null.
if [[ -n "${ONOFF_CRM_CONTRACT_API_TOKEN:-}" ]]; then
  domains_json="$(php -r '
    $mapFile = getenv("HOME") . "/.config/onoffmarketing/revision-site-cwd.map.json";
    $map = is_file($mapFile) ? json_decode(file_get_contents($mapFile), true) : [];
    if (!is_array($map)) $map = [];
    $out = [];
    foreach ($map as $domain => $cwd) {
      $domain = strtolower(trim((string)$domain));
      $cwd = (string)$cwd;
      if ($domain === "" || $cwd === "") continue;
      $ftp = rtrim($cwd, "/") . "/ops/ftp.env";
      $homeFtp = getenv("HOME") . "/.config/onoffmarketing/sites/" . $domain . ".ftp.env";
      $ok = false;
      foreach ([$ftp, $homeFtp] as $path) {
        if (!is_file($path)) continue;
        $raw = @file_get_contents($path);
        if (!is_string($raw)) continue;
        if (preg_match("/^\\s*FTP_SERVER\\s*=\\s*\\S+/m", $raw)
          && preg_match("/^\\s*FTP_USERNAME\\s*=\\s*\\S+/m", $raw)
          && preg_match("/^\\s*FTP_PASSWORD\\s*=\\s*\\S+/m", $raw)) {
          $ok = true;
          break;
        }
      }
      $out[$domain] = ["ftpConfigured" => $ok, "cwd" => $cwd];
    }
    echo json_encode($out, JSON_UNESCAPED_SLASHES);
  ' 2>/dev/null || echo '{}')"
  curl -sS --max-time 20 -X POST "$API" \
    -H "Accept: application/json" \
    -H "Content-Type: application/json" \
    -H "X-ONOFF-Contract-Token: $ONOFF_CRM_CONTRACT_API_TOKEN" \
    -d "$(php -r 'echo json_encode(["action"=>"operator_status","workerAlive"=>(bool)(int)$argv[1],"domains"=>json_decode($argv[2], true) ?: new stdClass()], JSON_UNESCAPED_SLASHES);' "$alive" "$domains_json")" \
    >/dev/null 2>&1 || true
fi

echo "$(ts) alive=$alive restarted=$restarted queued=$queued failed=$failed sla=$sla deploy_queued=$deploy_queued" | tee -a "$HEALTH_LOG"

if [[ "$failed" -gt 0 || "$queued" -gt 3 || "$sla" -gt 0 ]]; then
  echo "$(ts) WARN queue pressure queued=$queued failed=$failed sla=$sla" >>"$HEALTH_LOG"
fi
exit 0
