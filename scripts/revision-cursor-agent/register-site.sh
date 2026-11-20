#!/usr/bin/env bash
# Register a customer site for revision agent cwd + FTP deploy.
#
# Usage:
#   ./scripts/revision-cursor-agent/register-site.sh \
#     --domain=bizontop.co.kr \
#     --cwd=/Volumes/onoff/cursor/sites/bizontop
#
# Creates:
#   - ~/.config/onoffmarketing/revision-site-cwd.map.json entry
#   - plugin config map entry (bundled fallback)
#   - $cwd/ops/ftp.env.example (fill real FTP secrets)
#   - ~/.config/onoffmarketing/sites/<domain>.ftp.env.example
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
DOMAIN=""
CWD=""
for arg in "$@"; do
  case "$arg" in
    --domain=*) DOMAIN="${arg#*=}" ;;
    --cwd=*) CWD="${arg#*=}" ;;
  esac
done
DOMAIN="$(echo "$DOMAIN" | tr '[:upper:]' '[:lower:]' | sed -E 's#^https?://##; s#/.*##; s#^www\.##')"
if [[ -z "$DOMAIN" || -z "$CWD" ]]; then
  echo "usage: $0 --domain=example.com --cwd=/Volumes/onoff/cursor/sites/example" >&2
  exit 1
fi
if [[ ! -d "$CWD" ]]; then
  mkdir -p "$CWD"
  echo "created cwd $CWD"
fi
mkdir -p "$CWD/ops" "$HOME/.config/onoffmarketing/sites" "$ROOT/plugin/seo-system-300/config"

MAP_HOME="$HOME/.config/onoffmarketing/revision-site-cwd.map.json"
MAP_PLUGIN="$ROOT/plugin/seo-system-300/config/revision-site-cwd.map.json"
php -r '
$domain = $argv[1];
$cwd = $argv[2];
foreach (array_slice($argv, 3) as $file) {
  $map = [];
  if (is_file($file)) {
    $decoded = json_decode((string) file_get_contents($file), true);
    if (is_array($decoded)) $map = $decoded;
  }
  $map[$domain] = $cwd;
  $map["www." . $domain] = $cwd;
  ksort($map);
  file_put_contents($file, json_encode($map, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n");
  echo "updated $file\n";
}
' "$DOMAIN" "$CWD" "$MAP_HOME" "$MAP_PLUGIN"

EXAMPLE="$CWD/ops/ftp.env.example"
if [[ ! -f "$EXAMPLE" ]]; then
  cat >"$EXAMPLE" <<EOF
# Copy to ftp.env and fill real Cafe24 (or host) FTP credentials.
# deploy-site.mjs reads \$cwd/ops/ftp.env first.
FTP_SERVER=example.cafe24.com
FTP_USERNAME=
FTP_PASSWORD=
FTP_PORT=21
FTP_REMOTE_ROOT=/public_html
EOF
  echo "wrote $EXAMPLE"
fi
HOME_EXAMPLE="$HOME/.config/onoffmarketing/sites/${DOMAIN}.ftp.env.example"
if [[ ! -f "$HOME_EXAMPLE" ]]; then
  cp "$EXAMPLE" "$HOME_EXAMPLE"
  echo "wrote $HOME_EXAMPLE"
fi
if [[ ! -f "$CWD/ops/ftp.env" ]]; then
  echo "NEXT: copy $EXAMPLE → $CWD/ops/ftp.env and fill credentials"
else
  echo "ftp.env already present at $CWD/ops/ftp.env"
fi
echo "registered $DOMAIN → $CWD"
