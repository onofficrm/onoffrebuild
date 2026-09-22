#!/usr/bin/env bash
# Deploy seo-system-300 SPA to production FTP with forced web-readable perms.
#
# Why: repo lives on exFAT (/Volumes/onoff) where Unix modes are ignored, so
# local files/dirs look like 700. lftp mirror may sync those modes to the server.
# If `.htaccess` lands as 700, Apache cannot read it and returns 403 for the
# *entire* /seo-system-300/ tree (not just assets).
#
# This script:
#   1) mirrors with --no-perms (do not copy local 700 to remote)
#   2) SITE CHMOD dirs 755 / files 644 including .htaccess (NLST-hidden)
#   3) fails unless live index + hashed assets return HTTP 200
#
# Usage:
#   set -a; source ~/.config/onoffmarketing/ftp.env; set +a
#   ./scripts/deploy-seo-system-300.sh
#   SKIP_BUILD=1 ./scripts/deploy-seo-system-300.sh   # upload existing seo-system-300/
#   DRY_RUN=1 ./scripts/deploy-seo-system-300.sh

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REMOTE_ROOT="${FTP_REMOTE_ROOT:-/public_html}"
PORT="${FTP_PORT:-21}"
DRY="${DRY_RUN:-0}"
SKIP_BUILD="${SKIP_BUILD:-0}"
LIVE_BASE="${LIVE_BASE:-https://onoff.icrm.co.kr}"
TARGET_REL="seo-system-300"
LOCAL="$ROOT/$TARGET_REL"

for v in FTP_SERVER FTP_USERNAME FTP_PASSWORD; do
  if [[ -z "${!v:-}" ]]; then
    echo "ERROR: $v is not set (source ~/.config/onoffmarketing/ftp.env)"
    exit 2
  fi
done

if ! command -v lftp >/dev/null 2>&1; then
  echo "ERROR: lftp required"
  exit 2
fi

if [[ "$SKIP_BUILD" != "1" ]]; then
  echo "[deploy-seo300] building…"
  (cd "$ROOT/build/seo-system-300" && npm run build:deploy)
fi

if [[ ! -f "$LOCAL/index.html" ]]; then
  echo "ERROR: missing $LOCAL/index.html — run build:deploy first"
  exit 2
fi

# Drop AppleDouble junk that exFAT/macOS may create beside assets.
find "$LOCAL" -name '._*' -type f -delete 2>/dev/null || true
find "$LOCAL" -name '.DS_Store' -type f -delete 2>/dev/null || true

echo "[deploy-seo300] DRY_RUN=$DRY remote=$REMOTE_ROOT/$TARGET_REL"
# --no-perms: never push exFAT 700 modes to Cafe24 (breaks .htaccess → whole-tree 403)
MIRROR_FLAGS="--reverse --delete --no-perms --verbose=1 --exclude-glob=._* --exclude-glob=.DS_Store"
if [[ "$DRY" == "1" ]]; then
  MIRROR_FLAGS="$MIRROR_FLAGS --dry-run"
fi

{
  echo 'set ftp:ssl-allow no'
  echo 'set net:max-retries 2'
  echo 'set net:timeout 90'
  echo 'set mirror:set-permissions no'
  echo "cd $REMOTE_ROOT"
  echo "mirror $MIRROR_FLAGS $LOCAL $TARGET_REL"
  if [[ "$DRY" != "1" ]]; then
    # Re-put entrypoints after mirror so .htaccess is never left stale/700-only.
    echo "put -O $TARGET_REL $LOCAL/index.html"
    if [[ -f "$LOCAL/.htaccess" ]]; then
      echo "put -O $TARGET_REL $LOCAL/.htaccess"
    fi
  fi
  echo 'bye'
} | lftp -u "$FTP_USERNAME","$FTP_PASSWORD" -p "$PORT" "ftp://$FTP_SERVER"

if [[ "$DRY" == "1" ]]; then
  echo "[deploy-seo300] dry-run complete (no chmod / verify)"
  exit 0
fi

echo "[deploy-seo300] forcing remote web perms (incl. .htaccess)…"
python3 "$ROOT/scripts/ftp-chmod-tree.py" "$TARGET_REL" --remote-root "$REMOTE_ROOT"

echo "[deploy-seo300] verifying live assets…"
python3 - <<PY
import re, ssl, sys, urllib.error, urllib.request
base = "${LIVE_BASE}".rstrip("/")
ctx = ssl._create_unverified_context()
ua = {"User-Agent": "seo300-deploy-verify"}

def fetch(url):
    req = urllib.request.Request(url, headers=ua)
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=30) as r:
            return r.status, r.read()
    except urllib.error.HTTPError as e:
        return e.code, e.read()

st, html = fetch(f"{base}/seo-system-300/")
if st != 200:
    print(f"FAIL index status={st} (often .htaccess mode 700 → whole-tree 403)", file=sys.stderr)
    sys.exit(1)
text = html.decode("utf-8", "replace")
# Vite may emit relative assets/… or absolute /seo-system-300/assets/…
assets = re.findall(r"""(?:src|href)=["']((?:/seo-system-300/)?assets/[^"']+)["']""", text)
# Normalize to path under /seo-system-300/
norm = []
for rel in assets:
    rel = rel.lstrip("/")
    if rel.startswith("seo-system-300/"):
        rel = rel[len("seo-system-300/") :]
    if rel not in norm:
        norm.append(rel)
if not norm:
    print("FAIL no assets referenced in index.html", file=sys.stderr)
    sys.exit(1)
failed = []
for rel in norm:
    url = f"{base}/seo-system-300/{rel}"
    st, body = fetch(url)
    print(f"{'OK' if st == 200 else 'FAIL'} {st} {len(body)} {rel}")
    if st != 200:
        failed.append((rel, st))
if failed:
    print("FAIL asset verify", failed, file=sys.stderr)
    sys.exit(1)
print("[deploy-seo300] verify PASS")
PY

echo "[deploy-seo300] done"
