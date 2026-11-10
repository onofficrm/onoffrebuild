#!/usr/bin/env bash
# Start the homepage-revision dispatch worker with local secrets.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

if [[ -f "$HOME/.config/onoffmarketing/cursor-api.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "$HOME/.config/onoffmarketing/cursor-api.env"
  set +a
fi

if [[ -z "${ONOFF_CRM_CONTRACT_API_TOKEN:-}" ]]; then
  TOKEN="$(ssh -o BatchMode=yes -i "$HOME/.ssh/onoff_server_ed25519" root@icrm.co.kr \
    'grep ^ONOFF_CRM_CONTRACT_API_TOKEN= /var/www/crm-icrm/shared/.env | cut -d= -f2-')"
  export ONOFF_CRM_CONTRACT_API_TOKEN="$TOKEN"
fi

if [[ -z "${SEOSYS300_REVISION_SITE_CWD_MAP:-}" && -f "$HOME/.config/onoffmarketing/revision-site-cwd.map.json" ]]; then
  export SEOSYS300_REVISION_SITE_CWD_MAP="$(cat "$HOME/.config/onoffmarketing/revision-site-cwd.map.json")"
fi

if [[ -z "${CURSOR_API_KEY:-}" ]]; then
  echo "CURSOR_API_KEY missing (expected in ~/.config/onoffmarketing/cursor-api.env)" >&2
  exit 1
fi
if [[ -z "${ONOFF_CRM_CONTRACT_API_TOKEN:-}" ]]; then
  echo "ONOFF_CRM_CONTRACT_API_TOKEN missing" >&2
  exit 1
fi

mkdir -p "$ROOT/data/revision_agent_worker"
LOG="$ROOT/data/revision_agent_worker/worker.log"

if [[ "${1:-}" == "--daemon" ]]; then
  shift
  nohup node scripts/revision-cursor-agent/worker.mjs "$@" >>"$LOG" 2>&1 &
  echo "started pid=$! log=$LOG"
  exit 0
fi

exec node scripts/revision-cursor-agent/worker.mjs "$@"
