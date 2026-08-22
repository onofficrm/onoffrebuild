#!/usr/bin/env bash
# Production public-access probe for onoff.icrm.co.kr
# Exit 0 = healthy (HTTP 2xx/3xx). Exit 1 = blocked/timeout/4xx/5xx.
set -euo pipefail

BASE="${ONOFF_PROBE_BASE:-https://onoff.icrm.co.kr}"
TIMEOUT="${ONOFF_PROBE_TIMEOUT:-20}"
CONTROL="${ONOFF_PROBE_CONTROL:-https://domain.icrm.co.kr/}"

echo "egress_check: $(curl -sS --connect-timeout 5 https://api.ipify.org || echo unknown)"
echo "probe_base: $BASE"

fail=0

probe() {
  local url="$1"
  local label="$2"
  local code
  code=$(curl -sS -o /tmp/onoff_probe_body -w '%{http_code}' --connect-timeout "$TIMEOUT" --max-time "$TIMEOUT" "$url" || echo "000")
  echo "$label -> HTTP $code"
  if [[ "$code" == "000" ]]; then
    echo "  FAIL: TCP/TLS timeout or DNS failure (often iwinv IP DROP)"
    fail=1
  elif [[ "$code" == "403" || "$code" == "401" || "$code" == "500" || "$code" == "502" || "$code" == "503" ]]; then
    echo "  FAIL: unexpected status $code (host WAF / app deny / origin error)"
    head -c 200 /tmp/onoff_probe_body 2>/dev/null || true
    echo
    fail=1
  elif [[ "$code" =~ ^[23] ]]; then
    echo "  OK"
  else
    echo "  FAIL: unexpected status $code"
    fail=1
  fi
}

probe "$BASE/" "home"
probe "$BASE/access-health.php" "health"
probe "$BASE/bbs/login.php" "login"
probe "$CONTROL" "control_domain"

if [[ "$fail" -ne 0 ]]; then
  echo
  echo "REMEDIATION:"
  echo "1) iwinv panel -> 방화벽 / 해외접속차단 / 웹방화벽: 공개 웹 80·443 허용"
  echo "2) Whitelist operator IPs if using IP filter (do NOT enable 전체 해외차단)"
  echo "3) GNUBoard 환경설정: 접근가능 IP 비움 (cf_possible_ip must be empty)"
  echo "4) Do not redeploy app code to fix DROP/403 at network edge"
  exit 1
fi

echo "ALL_PROBES_OK"
exit 0
