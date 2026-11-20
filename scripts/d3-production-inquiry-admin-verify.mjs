#!/usr/bin/env node
/**
 * D3 closure — admin session read-only search for QA marker (no POST inquiry).
 * Credentials: ~/.config/onoffmarketing/onoff-edu-superadmin.credentials.json
 * Output: ~/.local/share/onoffmarketing/d3-production-inquiry/closure-admin-evidence.json
 */
import fs from 'node:fs';
import path from 'node:path';

const CREDS = path.join(
  process.env.HOME || '',
  '.config/onoffmarketing/onoff-edu-superadmin.credentials.json',
);
const OUT_DIR = path.join(
  process.env.HOME || '/tmp',
  '.local/share/onoffmarketing/d3-production-inquiry',
);
const BASE = 'https://onoff.icrm.co.kr';
const MARKER_NEEDLE = process.env.D3_QA_MARKER || 'ONOFF-QA-D3';
const UA = 'ONOFF-D3-Closure-AdminVerify/1.0';

if (!fs.existsSync(CREDS)) {
  console.error('NO_CREDS');
  process.exit(3);
}

const creds = JSON.parse(fs.readFileSync(CREDS, 'utf8'));
const jar = new Map();

function parseSetCookie(headers) {
  const raw = headers.getSetCookie ? headers.getSetCookie() : [];
  for (const line of raw) {
    const part = line.split(';')[0];
    const i = part.indexOf('=');
    if (i > 0) jar.set(part.slice(0, i).trim(), part.slice(i + 1).trim());
  }
}

function cookieHeader() {
  return [...jar.entries()].map(([k, v]) => `${k}=${v}`).join('; ');
}

async function fetchHtml(url, opts = {}) {
  const headers = { 'User-Agent': UA, ...(opts.headers || {}) };
  const ch = cookieHeader();
  if (ch) headers.Cookie = ch;
  const res = await fetch(url, { ...opts, headers, redirect: 'follow' });
  parseSetCookie(res.headers);
  const text = await res.text();
  return { status: res.status, text, url: res.url };
}

fs.mkdirSync(OUT_DIR, { recursive: true, mode: 0o700 });

const loginPage = await fetchHtml(`${BASE}/bbs/login.php`);
const tokenMatch = loginPage.text.match(/name="url"\s+value="([^"]*)"/);
const urlField = tokenMatch ? tokenMatch[1] : '';

const body = new URLSearchParams({
  mb_id: creds.mb_id,
  mb_password: creds.password,
  url: urlField || '',
});
const login = await fetchHtml(`${BASE}/bbs/login_check.php`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: body.toString(),
});

const loggedIn = login.text.includes('location.replace') || login.url.includes('login') === false;
const searchUrl = `${BASE}/bbs/board.php?bo_table=inquiry&sfl=wr_subject%7C%7Cwr_content&stx=${encodeURIComponent(MARKER_NEEDLE)}`;
const board = await fetchHtml(searchUrl);

const wrIds = [...board.text.matchAll(/wr_id=(\d+)/g)].map((m) => m[1]);
const uniqueWr = [...new Set(wrIds)];
const hasMarker = board.text.includes(MARKER_NEEDLE);
const hasName = board.text.includes('ONOFF-QA-테스트');

let wrId = '';
let subjectSnippet = '';
if (hasMarker) {
  const row = board.text.match(
    new RegExp(`wr_id=(\\d+)[^>]*>[\\s\\S]{0,400}?${MARKER_NEEDLE.slice(0, 20)}`, 'i'),
  );
  if (row) wrId = row[1];
  const sub = board.text.match(/class="bo_tit"[^>]*>[\s\S]*?<a[^>]*>([^<]{0,120})/);
  if (sub) subjectSnippet = sub[1].trim();
}

const evidence = {
  checked_at_utc: new Date().toISOString(),
  base: BASE,
  marker_needle: MARKER_NEEDLE,
  login_http: login.status,
  login_ok: loggedIn,
  board_http: board.status,
  board_has_marker: hasMarker,
  board_has_qa_name: hasName,
  wr_id_candidates: uniqueWr.slice(0, 5),
  wr_id_matched: wrId || null,
  subject_snippet: subjectSnippet || null,
  bo_table: 'inquiry',
};

const outPath = path.join(OUT_DIR, 'closure-admin-evidence.json');
fs.writeFileSync(outPath, JSON.stringify(evidence, null, 2));

console.log(
  JSON.stringify(
    {
      login_ok: evidence.login_ok,
      board_has_marker: evidence.board_has_marker,
      wr_id: evidence.wr_id_matched,
      wr_id_candidates: evidence.wr_id_candidates,
      out: outPath,
    },
    null,
    2,
  ),
);

process.exit(evidence.board_has_marker && evidence.wr_id_matched ? 0 : evidence.login_ok ? 4 : 5);