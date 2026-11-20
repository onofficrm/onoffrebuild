#!/usr/bin/env bash
# Deploy ONOFF Builder official website import (NOT seo-system-300).
# Separate from scripts/deploy-seo-system-300.sh — do not merge.
#
# Uploads ONLY (when DEPLOY_APPROVED=1):
#   plugin/onoff-builder-bridge/imports/onoff-builder-official/  (or IMPORT_ID)
#   Metadata via IMPORTS_META_FILE only — NOT raw imports.json by default
#
# Does NOT:
#   - change home_builder_bridge_id / _site.config.php / .htaccess
#   - overwrite imports/onoffmarketing/
#
# Required env (never commit / never log values):
#   FTP_SERVER FTP_USERNAME FTP_PASSWORD
#
# Optional:
#   FTP_PORT (default 21)
#   FTP_REMOTE_ROOT (default /public_html)
#   DRY_RUN=1              — read-only remote checks + plan output, no put/mirror
#   DEPLOY_APPROVED=1      — required for real upload (A-stage explicit approval)
#   IMPORT_ID=onoff-builder-official|onoff-builder-official-staging
#   IMPORTS_META_FILE=...  (default: imports.merged-candidate.json)
#   REMOTE_IMPORTS_SNAPSHOT=... (default: imports.remote-preflight-snapshot.json)
#
# Usage:
#   set -a; source ~/.config/onoffmarketing/ftp.env; set +a
#   DRY_RUN=1 ./scripts/deploy-builder-official.sh
#
# APPROVAL REQUIRED before non-dry production upload.

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REMOTE_ROOT="${FTP_REMOTE_ROOT:-/public_html}"
PORT="${FTP_PORT:-21}"
DRY="${DRY_RUN:-0}"
DEPLOY_APPROVED="${DEPLOY_APPROVED:-0}"
IMPORT_ID="${IMPORT_ID:-onoff-builder-official}"

DATA_DIR="$ROOT/plugin/onoff-builder-bridge/data"
IMPORTS_META_FILE="${IMPORTS_META_FILE:-$DATA_DIR/imports.merged-candidate.json}"
REMOTE_SNAPSHOT="${REMOTE_IMPORTS_SNAPSHOT:-$DATA_DIR/imports.remote-preflight-snapshot.json}"

LOCAL_IMPORT="$ROOT/plugin/onoff-builder-bridge/imports/$IMPORT_ID"
REMOTE_IMPORT="plugin/onoff-builder-bridge/imports/$IMPORT_ID"
REMOTE_IMPORTS_JSON="plugin/onoff-builder-bridge/data/imports.json"

REMOTE_SNAPSHOT="$(cd "$(dirname "$REMOTE_SNAPSHOT")" && pwd)/$(basename "$REMOTE_SNAPSHOT")"
IMPORTS_META_FILE="$(cd "$(dirname "$IMPORTS_META_FILE")" && pwd)/$(basename "$IMPORTS_META_FILE")"
LOCAL_IMPORT="$(cd "$(dirname "$LOCAL_IMPORT")" && pwd)/$(basename "$LOCAL_IMPORT")"

log() { printf '%s\n' "$*"; }
die() { log "ERROR: $*"; exit 2; }

for v in FTP_SERVER FTP_USERNAME FTP_PASSWORD; do
  if [[ -z "${!v:-}" ]]; then
    die "$v is not set. Provide FTP credentials via env (not via git)."
  fi
done

if ! command -v lftp >/dev/null 2>&1; then
  die "lftp is required"
fi
if ! command -v python3 >/dev/null 2>&1; then
  die "python3 is required for metadata validation"
fi

case "$IMPORT_ID" in
  onoff-builder-official|onoff-builder-official-staging) ;;
  *) die "IMPORT_ID must be onoff-builder-official or onoff-builder-official-staging" ;;
esac

if [[ ! -d "$LOCAL_IMPORT" ]]; then
  die "missing $LOCAL_IMPORT — run: cd build/onoff-builder-website && npm run build && npm run sync:official"
fi
if [[ ! -f "$LOCAL_IMPORT/index.html" ]]; then
  die "missing $LOCAL_IMPORT/index.html"
fi
if [[ ! -f "$IMPORTS_META_FILE" ]]; then
  die "metadata file missing: $IMPORTS_META_FILE (set IMPORTS_META_FILE or create imports.merged-candidate.json)"
fi
if [[ ! -f "$REMOTE_SNAPSHOT" ]]; then
  die "remote snapshot missing: $REMOTE_SNAPSHOT"
fi

# Scope guard: metadata must stay under plugin/onoff-builder-bridge/data/
case "$IMPORTS_META_FILE" in
  "$ROOT"/plugin/onoff-builder-bridge/data/*) ;;
  *) die "IMPORTS_META_FILE outside allowed data dir: $IMPORTS_META_FILE" ;;
esac

log "[deploy-builder-official] import=$IMPORT_ID dry=$DRY approved=$DEPLOY_APPROVED"
log "[deploy-builder-official] local_import=$LOCAL_IMPORT"
log "[deploy-builder-official] metadata=$IMPORTS_META_FILE"
log "[deploy-builder-official] WILL NOT touch imports/onoffmarketing, .htaccess, _site.config.php"

WORK="$(mktemp -d "${TMPDIR:-/tmp}/onoff-official-deploy.XXXXXX")"
trap 'rm -rf "$WORK"' EXIT

validate_metadata() {
  python3 - "$IMPORTS_META_FILE" "$REMOTE_SNAPSHOT" "$IMPORT_ID" <<'PY'
import json, sys
meta_path, snap_path, import_id = sys.argv[1:4]
with open(meta_path, encoding="utf-8") as f:
    meta = json.load(f)
with open(snap_path, encoding="utf-8") as f:
    snap = json.load(f)
if not isinstance(meta, list):
    print("metadata must be a JSON array", file=sys.stderr)
    sys.exit(1)
ids = []
for i, row in enumerate(meta):
    if not isinstance(row, dict):
        sys.exit(f"row {i} is not an object")
    rid = row.get("id")
    if not rid or not isinstance(rid, str):
        sys.exit(f"row {i} missing string id")
    ids.append(rid)
for req in ("sample-landing", "onoffmarketing"):
    if req not in ids:
        sys.exit(f"metadata must preserve id={req}")
snap_ids = {r["id"] for r in snap if isinstance(r, dict) and r.get("id")}
for rid in snap_ids:
    if rid not in ids:
        sys.exit(f"metadata removed snapshot id={rid}")
# snapshot rows must match exactly on critical fields
snap_by = {r["id"]: r for r in snap}
meta_by = {r["id"]: r for r in meta if r.get("id")}
for rid in snap_ids:
    for key in ("id", "path", "entry"):
        if meta_by[rid].get(key) != snap_by[rid].get(key):
            sys.exit(f"id={rid} field {key} changed vs snapshot (forbidden)")
if import_id not in ids:
    sys.exit(f"metadata must include import id={import_id}")
added = [i for i in ids if i not in snap_ids]
print("META_OK ids=%d added=%s" % (len(ids), ",".join(added) or "(none)"))
PY
}

validate_metadata

LOCAL_COUNT="$(find "$LOCAL_IMPORT" -type f ! -name '._*' | wc -l | tr -d ' ')"
log "[deploy-builder-official] local_file_count=$LOCAL_COUNT"

fetch_remote_state() {
  local errf="$WORK/lftp.err"
  : >"$errf"
  if ! lftp -u "$FTP_USERNAME","$FTP_PASSWORD" -p "$PORT" "$FTP_SERVER" 2>>"$errf" >>"$WORK/lftp.stdout" <<EOF
set ftp:ssl-allow no
set net:timeout 45
set net:max-retries 2
set cmd:verbose false
set cmd:trace false
cd $REMOTE_ROOT
lcd $WORK
get $REMOTE_IMPORTS_JSON -o imports.remote.live.json
cls -1 $REMOTE_IMPORT
bye
EOF
  then
    log "WARN: lftp fetch partial (see $WORK/lftp.err)"
    [[ -s "$WORK/lftp.err" ]] && tail -5 "$WORK/lftp.err" >&2 || true
  fi
}

compare_remote_imports() {
  python3 - "$WORK/imports.remote.live.json" "$REMOTE_SNAPSHOT" <<'PY'
import json, sys, os
live_path, snap_path = sys.argv[1], sys.argv[2]
if not os.path.isfile(live_path):
    print("REMOTE_IMPORTS_MISSING assume empty remote registry (first deploy)")
    sys.exit(0)
with open(live_path, encoding="utf-8") as f:
    live = json.load(f)
with open(snap_path, encoding="utf-8") as f:
    snap = json.load(f)
if not isinstance(live, list):
    sys.exit("remote imports.json is not an array — abort and re-merge")
live_by = {r.get("id"): r for r in live if isinstance(r, dict) and r.get("id")}
snap_by = {r.get("id"): r for r in snap if isinstance(r, dict) and r.get("id")}
for rid, srow in snap_by.items():
    if rid not in live_by:
        sys.exit(f"remote lost expected id={rid} since preflight — abort and re-merge")
    lrow = live_by[rid]
    for key in ("id", "path", "entry", "name"):
        if lrow.get(key) != srow.get(key):
            sys.exit(f"remote id={rid} field {key!r} drifted since preflight — abort and re-merge")
extra = [i for i in live_by if i not in snap_by]
if extra:
    print("REMOTE_EXTRA_IDS", ",".join(extra))
print("REMOTE_IMPORTS_DRIFT_OK")
PY
}

plan_metadata_diff() {
  local live="$WORK/imports.remote.live.json"
  python3 - "$IMPORTS_META_FILE" "$live" <<'PY' | tee "$WORK/meta-diff.txt"
import json, sys, os
meta_path = sys.argv[1]
live_path = sys.argv[2]
with open(meta_path, encoding="utf-8") as f:
    proposed = json.load(f)
live = []
if os.path.isfile(live_path):
    with open(live_path, encoding="utf-8") as f:
        live = json.load(f)
live_ids = {r.get("id") for r in live if isinstance(r, dict)}
prop_ids = {r.get("id") for r in proposed if isinstance(r, dict)}
print("--- metadata diff (remote live → proposed) ---")
for rid in sorted(prop_ids):
    tag = "keep" if rid in live_ids else "ADD"
    name = next((r.get("name", "") for r in proposed if r.get("id") == rid), "")
    print(f"  {tag:4} {rid} {name[:50]}")
for rid in sorted(live_ids - prop_ids):
    print(f"  DROP {rid}  (proposed removes — NOT ALLOWED by validator)")
print("--- end metadata diff ---")
PY
}

fetch_remote_state
compare_remote_imports
plan_metadata_diff

REMOTE_OFFICIAL_EXISTS=0
if [[ -s "$WORK/lftp.stdout" ]]; then
  REMOTE_OFFICIAL_EXISTS=1
fi

log "--- deploy plan: official import files ---"
if [[ "$REMOTE_OFFICIAL_EXISTS" == "0" ]]; then
  log "remote_import_dir: MISSING (first deploy)"
  log "upload_new: $LOCAL_COUNT"
  log "upload_overwrite: 0"
  log "mirror_delete_remote_only: 0"
else
  log "remote_import_dir: EXISTS (re-deploy — mirror --delete may remove old hashed assets)"
  find "$LOCAL_IMPORT" -type f ! -name '._*' | while read -r f; do
    rel="${f#"$LOCAL_IMPORT"/}"
    printf '  upload %s\n' "$rel"
  done | head -40
  log "  … (see full list via find)"
  log "WARN: mirror --delete enabled on approve — orphan remote files in $REMOTE_IMPORT will be deleted"
fi

log ""
log "Limitation: remote imports.json put is not atomic; concurrent admin edits between"
log "preflight snapshot and upload require re-download and merge."

if [[ "$DRY" == "1" ]]; then
  log "[deploy-builder-official] DRY_RUN complete — no remote writes"
  exit 0
fi

if [[ "$DEPLOY_APPROVED" != "1" ]]; then
  die "upload blocked: set DEPLOY_APPROVED=1 after explicit operator approval (or use DRY_RUN=1)"
fi

# Final live fetch immediately before upload (drift guard)
fetch_remote_state
compare_remote_imports

META_BASENAME="$(basename "$IMPORTS_META_FILE")"
if [[ "$META_BASENAME" == "imports.json" ]] && [[ "$IMPORTS_META_FILE" != "$DATA_DIR/imports.merged-candidate.json" ]]; then
  die "refusing to put raw imports.json — use IMPORTS_META_FILE=imports.merged-candidate.json"
fi

cp "$IMPORTS_META_FILE" "$WORK/imports.to-upload.json"

lftp -u "$FTP_USERNAME","$FTP_PASSWORD" -p "$PORT" "$FTP_SERVER" <<EOF
set ftp:ssl-allow no
set net:max-retries 3
set net:timeout 60
set cmd:verbose true
cd $REMOTE_ROOT
mirror -R --delete --verbose --no-perms --exclude-glob '._*' $LOCAL_IMPORT $REMOTE_IMPORT
cd plugin/onoff-builder-bridge/data
lcd $WORK
put imports.to-upload.json -o imports.json
bye
EOF

log "[deploy-builder-official] upload finished"
log "[deploy-builder-official] Reminder: .htaccess OFFICIAL ROUTES only after canary (stage B)"
log "[deploy-builder-official] Reminder: CHMOD dirs 755 / files 644"
if [[ -f "$ROOT/scripts/ftp-chmod-tree.py" ]]; then
  log "[deploy-builder-official] Suggested: python3 scripts/ftp-chmod-tree.py $REMOTE_IMPORT"
fi