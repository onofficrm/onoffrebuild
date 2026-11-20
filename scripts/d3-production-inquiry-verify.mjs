#!/usr/bin/env node
/**
 * D3 — 운영 GNUBoard 실DB 상담 1건 검증 (승인된 QA 전용).
 * 스테이징 격리 가드(d3-staging-*)와 무관한 별도 경로.
 *
 * Usage (1 POST only):
 *   export D3_PRODUCTION_INQUIRY_CONFIRM=1
 *   node scripts/d3-production-inquiry-verify.mjs
 *
 * Secrets never written to repo — results under ~/.local/share/onoffmarketing/d3-production-inquiry/
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const BASE = (process.env.D3_PRODUCTION_BASE || 'https://onoff.icrm.co.kr').replace(/\/$/, '');
const OUT_DIR = path.join(
  process.env.HOME || '/tmp',
  '.local/share/onoffmarketing/d3-production-inquiry',
);
const UA = 'ONOFF-D3-ProdVerify/1.0';

if (process.env.D3_PRODUCTION_INQUIRY_CONFIRM !== '1') {
  console.error('Set D3_PRODUCTION_INQUIRY_CONFIRM=1 to run (single POST).');
  process.exit(2);
}

fs.mkdirSync(OUT_DIR, { recursive: true, mode: 0o700 });

const now = new Date();
const pad = (n) => String(n).padStart(2, '0');
const stamp = `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}-${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}`;
const marker = `[ONOFF-QA-D3-${stamp}] 운영 DB 상담 저장 검증을 위한 테스트 기록입니다. 고객 문의가 아니며 검증 후 정리 예정입니다.`;

const jar = new Map();

function parseSetCookie(headers) {
  const raw = headers.getSetCookie ? headers.getSetCookie() : [];
  for (const line of raw) {
    const part = line.split(';')[0];
    const idx = part.indexOf('=');
    if (idx > 0) {
      jar.set(part.slice(0, idx).trim(), part.slice(idx + 1).trim());
    }
  }
}

function cookieHeader() {
  if (jar.size === 0) return '';
  return [...jar.entries()].map(([k, v]) => `${k}=${v}`).join('; ');
}

async function http(method, urlPath, body) {
  const headers = {
    Accept: 'application/json',
    'User-Agent': UA,
  };
  const ch = cookieHeader();
  if (ch) headers.Cookie = ch;
  const opts = { method, headers, redirect: 'follow' };
  if (body != null) {
    headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
    opts.body = body;
  }
  const res = await fetch(`${BASE}${urlPath}`, opts);
  parseSetCookie(res.headers);
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = null;
  }
  return { status: res.status, text, json };
}

const report = {
  base: BASE,
  executed_at_utc: now.toISOString(),
  marker,
  token_http: null,
  submit_http: null,
  submit_success: null,
  submit_message: null,
  redirect_url: null,
  post_count: 1,
};

const tok = await http('GET', '/proc/inquiry-token.php');
report.token_http = tok.status;
const token = tok.json?.token || '';
report.token_present = Boolean(token);
if (!token) {
  const outPath = path.join(OUT_DIR, `verify-${stamp}.json`);
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2));
  console.error('Token failed', tok.status, tok.text.slice(0, 200));
  process.exit(4);
}

const fields = new URLSearchParams({
  onoff_inquiry_token: token,
  name: 'ONOFF-QA-테스트',
  phone: '010-2000-0001',
  email: 'onoff-qa@example.invalid',
  message: marker,
  privacy_agree: '1',
  website_url: '',
  referer_page: `${BASE}/contact`,
});

const sub = await http('POST', '/proc/inquiry-submit.php', fields.toString());
report.submit_http = sub.status;
report.submit_success = sub.json?.success === true;
report.submit_message = sub.json?.message || '';
report.redirect_url = sub.json?.redirect_url || '';

const outPath = path.join(OUT_DIR, `verify-${stamp}.json`);
fs.writeFileSync(outPath, JSON.stringify(report, null, 2));

console.log(
  JSON.stringify(
    {
      ok: report.submit_success,
      marker,
      token_http: report.token_http,
      submit_http: report.submit_http,
      message: report.submit_message,
      result_file: outPath,
    },
    null,
    2,
  ),
);

process.exit(report.submit_success ? 0 : 5);