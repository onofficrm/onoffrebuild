#!/usr/bin/env bash
# E-RETRY: assets+img+src first, then HTML. No --delete.
# Never upload index.html alone after a new Vite build — hashed /assets/*.js must match HTML or SPA shows a blank screen.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LOCAL="$ROOT/plugin/onoff-builder-bridge/imports/onoff-builder-official"
REMOTE="plugin/onoff-builder-bridge/imports/onoff-builder-official"
REMOTE_ROOT="${FTP_REMOTE_ROOT:-/public_html}"
PORT="${FTP_PORT:-21}"

for v in FTP_SERVER FTP_USERNAME FTP_PASSWORD; do
  [[ -n "${!v:-}" ]] || { echo "missing $v"; exit 2; }
done

log() { printf '%s\n' "$*"; }

log "[e-retry-sync] phase1 assets+src"
lftp -u "$FTP_USERNAME","$FTP_PASSWORD" -p "$PORT" "$FTP_SERVER" <<EOF
set ftp:ssl-allow no
set net:timeout 180
cd $REMOTE_ROOT
mirror -R --overwrite --no-perms --exclude-glob '._*' $LOCAL/assets $REMOTE/assets
mirror -R --overwrite --no-perms --exclude-glob '._*' $LOCAL/img $REMOTE/img
mirror -R --overwrite --no-perms --exclude-glob '._*' $LOCAL/src $REMOTE/src
bye
EOF

log "[e-retry-sync] phase1b ensure route dirs exist"
{
  echo "set ftp:ssl-allow no"
  echo "set net:timeout 180"
  echo "cd $REMOTE_ROOT"
  while IFS= read -r rel; do
    dir=$(dirname "$rel")
    [[ "$dir" == "." ]] && continue
    echo "mkdir -p -f $REMOTE/$dir"
  done < <(find "$LOCAL" -name '*.html' -type f ! -name '._*' | sed "s#^$LOCAL/##" | sort -u)
  echo "bye"
} | lftp -u "$FTP_USERNAME","$FTP_PASSWORD" -p "$PORT" "$FTP_SERVER"

log "[e-retry-sync] phase2 html only (per-file put; avoid mirror include-glob skip)"
{
  echo "set ftp:ssl-allow no"
  echo "set net:timeout 180"
  find "$LOCAL" -name '*.html' -type f ! -name '._*' | sort | while IFS= read -r abs; do
  rel="${abs#$LOCAL/}"
  dir=$(dirname "$rel")
  base=$(basename "$abs")
  if [[ "$dir" == "." ]]; then
    echo "cd $REMOTE_ROOT/$REMOTE"
    echo "lcd $LOCAL"
  else
    echo "cd $REMOTE_ROOT/$REMOTE/$dir"
    echo "lcd $LOCAL/$dir"
  fi
  echo "put -O . $base"
  done
  echo "bye"
} | lftp -u "$FTP_USERNAME","$FTP_PASSWORD" -p "$PORT" "$FTP_SERVER"

log "[e-retry-sync] complete"