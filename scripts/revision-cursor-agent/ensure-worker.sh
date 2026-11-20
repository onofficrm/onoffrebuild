#!/usr/bin/env bash
# Ensure a single long-lived revision worker is running.
# Launch via a nested login shell + nohup/disown so Cursor/cron session exit
# does not tear the worker down.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
# Prefer home-disk state (LaunchAgent cannot reliably write /Volumes).
HOME_STATE="$HOME/Library/Application Support/onoff-revision-worker/state"
HOME_LOG_DIR="$HOME/Library/Application Support/onoff-revision-worker/logs"
VOL_LOG_DIR="$ROOT/data/revision_agent_worker"
LOG_DIR="$HOME_STATE"
PID_FILE="$LOG_DIR/worker.pid"
LOG="$HOME_LOG_DIR/worker.log"
mkdir -p "$HOME_STATE" "$HOME_LOG_DIR" "$VOL_LOG_DIR"
INTERVAL="${1:-30}"
mkdir -p "$LOG_DIR"

find_worker_pid() {
  pgrep -f "node .*(revision-cursor-agent|onoff-revision-worker/agent)/worker\\.mjs" 2>/dev/null | head -1 || true
}

alive_pid="$(find_worker_pid)"
if [[ -n "$alive_pid" ]] && kill -0 "$alive_pid" 2>/dev/null; then
  echo "$alive_pid" >"$PID_FILE"
  echo "worker_alive pid=$alive_pid"
  exit 0
fi

# Also accept a live pidfile even if pgrep regex differs on some macOS builds.
if [[ -f "$PID_FILE" ]]; then
  cand="$(tr -d '[:space:]' <"$PID_FILE" || true)"
  if [[ "$cand" =~ ^[0-9]+$ ]] && kill -0 "$cand" 2>/dev/null; then
    cmd="$(ps -p "$cand" -o command= 2>/dev/null || true)"
    if [[ "$cmd" == *worker.mjs* ]]; then
      echo "worker_alive pid=$cand"
      exit 0
    fi
  fi
fi

rm -f "$PID_FILE"
AGENT_JS="$HOME/Library/Application Support/onoff-revision-worker/agent/worker.mjs"
if [[ ! -f "$AGENT_JS" ]]; then
  AGENT_JS="$ROOT/scripts/revision-cursor-agent/worker.mjs"
fi
/bin/bash -lc "
  set -euo pipefail
  set -a
  if [[ -f \"\$HOME/.config/onoffmarketing/cursor-api.env\" ]]; then
    # shellcheck disable=SC1091
    source \"\$HOME/.config/onoffmarketing/cursor-api.env\"
  fi
  if [[ -f \"\$HOME/.config/onoffmarketing/revision-worker.env\" ]]; then
    # shellcheck disable=SC1091
    source \"\$HOME/.config/onoffmarketing/revision-worker.env\"
  fi
  set +a
  if [[ -z \"\${ONOFF_CRM_CONTRACT_API_TOKEN:-}\" ]]; then
    TOKEN=\"\$(ssh -o BatchMode=yes -i \"\$HOME/.ssh/onoff_server_ed25519\" root@icrm.co.kr \
      'grep ^ONOFF_CRM_CONTRACT_API_TOKEN= /var/www/crm-icrm/shared/.env | cut -d= -f2-' 2>/dev/null || true)\"
    export ONOFF_CRM_CONTRACT_API_TOKEN=\"\${TOKEN:-}\"
  fi
  if [[ -z \"\${SEOSYS300_REVISION_SITE_CWD_MAP:-}\" && -f \"\$HOME/.config/onoffmarketing/revision-site-cwd.map.json\" ]]; then
    export SEOSYS300_REVISION_SITE_CWD_MAP=\"\$(cat \"\$HOME/.config/onoffmarketing/revision-site-cwd.map.json\")\"
  fi
  if [[ -z \"\${CURSOR_API_KEY:-}\" ]]; then
    echo 'CURSOR_API_KEY missing' >&2
    exit 1
  fi
  if [[ -z \"\${ONOFF_CRM_CONTRACT_API_TOKEN:-}\" ]]; then
    echo 'ONOFF_CRM_CONTRACT_API_TOKEN missing' >&2
    exit 1
  fi
  export ONOFF_PLATFORM_ROOT=\"$ROOT\"
  cd \"$ROOT\"
  nohup node \"$AGENT_JS\" --interval=${INTERVAL} >>\"$LOG\" 2>&1 </dev/null &
  echo \$! >\"$PID_FILE\"
  disown || true
" >/tmp/onoff-revision-ensure-worker.out 2>&1

sleep 2
alive_pid="$(find_worker_pid)"
if [[ -z "$alive_pid" && -f "$PID_FILE" ]]; then
  alive_pid="$(tr -d '[:space:]' <"$PID_FILE" || true)"
fi
if [[ -n "$alive_pid" ]] && kill -0 "$alive_pid" 2>/dev/null; then
  echo "$alive_pid" >"$PID_FILE"
  echo "worker_started pid=$alive_pid"
  exit 0
fi
echo "worker_start_failed" >&2
[[ -f /tmp/onoff-revision-ensure-worker.out ]] && cat /tmp/onoff-revision-ensure-worker.out >&2 || true
exit 1
