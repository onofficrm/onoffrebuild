#!/usr/bin/env bash
# Install / reload the homepage-revision worker as a macOS LaunchAgent.
# Note: on external/exFAT volumes launchd often returns EX_CONFIG (78).
# Prefer healthcheck.sh via cron in that case.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
LABEL=com.onoff.revision-worker
SRC="$ROOT/scripts/revision-cursor-agent/com.onoff.revision-worker.plist"
DEST="$HOME/Library/LaunchAgents/${LABEL}.plist"

if [[ "$ROOT" == /Volumes/* ]]; then
  echo "warning: checkout is on /Volumes — LaunchAgent may fail to keep the worker alive." >&2
  echo "prefer: crontab '*/5 * * * * $ROOT/scripts/revision-cursor-agent/healthcheck.sh'" >&2
fi

mkdir -p "$ROOT/data/revision_agent_worker" "$HOME/Library/LaunchAgents"
# Stop any manual daemon so launchd owns the process.
pkill -f 'revision-cursor-agent/worker.mjs' 2>/dev/null || true
rm -f "$ROOT/data/revision_agent_worker/worker.pid"

cp "$SRC" "$DEST"
# Rewrite WorkingDirectory / paths if this checkout moved.
/usr/bin/sed -i '' "s|/Volumes/onoff/cursor/platform/onoff-home|${ROOT}|g" "$DEST"
/usr/bin/sed -i '' "s|<string>/Users/gimhaseong</string>|<string>${HOME}</string>|g" "$DEST"

launchctl bootout "gui/$(id -u)/${LABEL}" 2>/dev/null || true
launchctl bootstrap "gui/$(id -u)" "$DEST"
launchctl enable "gui/$(id -u)/${LABEL}" 2>/dev/null || true
launchctl kickstart -k "gui/$(id -u)/${LABEL}"

sleep 1
if pgrep -f 'revision-cursor-agent/worker.mjs' >/dev/null; then
  echo "installed ${LABEL} pid=$(pgrep -f 'revision-cursor-agent/worker.mjs' | head -1)"
else
  echo "installed ${LABEL}, but worker not yet visible — check data/revision_agent_worker/launchd.err.log" >&2
  exit 1
fi
