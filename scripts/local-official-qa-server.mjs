#!/usr/bin/env node
/**
 * Local dual-route QA server (no GNUBoard DB required).
 * Mirrors onoff_builder_resolve_request_project_id + .htaccess official routes.
 *
 * Usage:
 *   LOCAL_OFFICIAL_QA=1 node scripts/local-official-qa-server.mjs
 *   # listens http://127.0.0.1:8091
 *
 * Does not FTP, does not touch production DB.
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { request as httpRequest } from 'node:http';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PORT = Number(process.env.QA_PORT || 8091);
const OFFICIAL_ON = process.env.LOCAL_OFFICIAL_QA === '1';

const OFFICIAL_DIR =
  process.env.QA_OFFICIAL_IMPORT_DIR ||
  path.join(ROOT, 'plugin/onoff-builder-bridge/imports/onoff-builder-official');
const LEGACY_DIR = path.join(ROOT, 'plugin/onoff-builder-bridge/imports/onoffmarketing');
const SEO300_DIR = path.join(ROOT, 'seo-system-300');
const INQUIRY_LAB = (process.env.QA_INQUIRY_LAB || '').replace(/\/$/, '');

const LEGACY_PREFIXES = [
  '/login',
  '/signup',
  '/session-expired',
  '/password',
  '/auth',
  '/account',
  '/education',
  '/marketing',
  '/service',
  '/community',
  '/consult',
  '/seo-platform',
  '/seo-aeo',
  '/company',
  '/diy',
  '/request',
  '/platform',
  '/ai-tools',
  '/blog',
  '/cafe',
  '/onoffcpa',
  '/free-courses',
];

const OFFICIAL_EXACT = new Set([
  '/',
  '/features',
  '/features/routine',
  '/features/step-mail',
  '/features/sns-poster',
  '/features/auto-comment',
  '/features/easy-edit',
  '/features/ai-development',
  '/website',
  '/management',
  '/services/seo',
  '/geo',
  '/backlink',
  '/traffic',
  '/domain',
  '/content',
  '/use-cases',
  '/portfolio',
  '/pricing',
  '/contact',
]);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

function normalizePath(urlPath) {
  const p = decodeURIComponent(urlPath.split('?')[0] || '/');
  if (p.length > 1 && p.endsWith('/')) return p.slice(0, -1);
  return p || '/';
}

function isLegacy(p) {
  return LEGACY_PREFIXES.some((prefix) => p === prefix || p.startsWith(prefix + '/'));
}

function resolveRoot(p) {
  if (p.startsWith('/seo-system-300')) return { kind: 'seo300', dir: SEO300_DIR };
  if (isLegacy(p)) return { kind: 'legacy', dir: LEGACY_DIR };
  if (OFFICIAL_EXACT.has(p) || p.startsWith('/features/')) {
    return OFFICIAL_ON
      ? { kind: 'official', dir: OFFICIAL_DIR }
      : { kind: 'legacy', dir: LEGACY_DIR };
  }
  // default SPA shell
  return OFFICIAL_ON
    ? { kind: 'official', dir: OFFICIAL_DIR }
    : { kind: 'legacy', dir: LEGACY_DIR };
}

function safeJoin(root, rel) {
  const full = path.normalize(path.join(root, rel));
  if (!full.startsWith(root)) return null;
  return full;
}

function sendFile(res, filePath, status = 200) {
  const ext = path.extname(filePath).toLowerCase();
  const type = MIME[ext] || 'application/octet-stream';
  const buf = fs.readFileSync(filePath);
  res.writeHead(status, {
    'Content-Type': type,
    'Cache-Control': 'no-store',
    'X-QA-File': path.relative(ROOT, filePath),
  });
  res.end(buf);
}

function findHtml(dir, routePath) {
  if (routePath === '/') {
    const idx = path.join(dir, 'index.html');
    return fs.existsSync(idx) ? idx : null;
  }
  const nested = path.join(dir, routePath.replace(/^\//, ''), 'index.html');
  if (fs.existsSync(nested)) return nested;
  const fallback = path.join(dir, 'index.html');
  return fs.existsSync(fallback) ? fallback : null;
}

const assetHint = new Map(); // connection-ish: last SPA kind by IP+UA not needed; use Referer

function proxyInquiryLab(req, res, pathname, search) {
  if (!INQUIRY_LAB) {
    res.writeHead(503, { 'Content-Type': 'text/plain' });
    res.end('QA_INQUIRY_LAB not set');
    return;
  }
  const target = new URL(`${INQUIRY_LAB}${pathname}${search || ''}`);
  const proxyReq = httpRequest(
    {
      hostname: target.hostname,
      port: target.port || 80,
      path: `${target.pathname}${target.search}`,
      method: req.method,
      headers: { ...req.headers, host: target.host },
    },
    (proxyRes) => {
      res.writeHead(proxyRes.statusCode || 502, proxyRes.headers);
      proxyRes.pipe(res);
    },
  );
  proxyReq.on('error', () => {
    res.writeHead(502, { 'Content-Type': 'text/plain' });
    res.end('inquiry lab proxy error');
  });
  req.pipe(proxyReq);
}

const server = http.createServer((req, res) => {
  const raw = req.url || '/';
  const search = raw.includes('?') ? raw.slice(raw.indexOf('?')) : '';
  let p = normalizePath(raw);

  if (
    INQUIRY_LAB &&
    (p === '/proc/inquiry-token.php' || p === '/proc/inquiry-submit.php')
  ) {
    proxyInquiryLab(req, res, p, search);
    return;
  }

  // GNUBoard /seo 교육 게시판 (운영과 분리 — 공식 /services/seo 와 충돌 방지 QA mock)
  if (p === '/seo') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end(
      '<!DOCTYPE html><html lang="ko"><head><meta name="onoff-qa-import" content="legacy">' +
        '<title>SEO교육  페이지 | 온오프마케팅 (QA GNUBoard mock)</title></head>' +
        '<body><h1>SEO교육 게시판 목록 (mock)</h1><p>Official SEO service page: <a href="/services/seo">/services/seo</a></p></body></html>',
    );
    return;
  }

  // feature aliases (301)
  const aliases = {
    '/features/stepmail': '/features/step-mail',
    '/features/sns': '/features/sns-poster',
    '/features/ai-dev': '/features/ai-development',
  };
  if (aliases[p]) {
    res.writeHead(301, { Location: aliases[p] });
    res.end();
    return;
  }

  // seo-system-300 SPA
  if (p === '/seo-system-300' || p.startsWith('/seo-system-300/')) {
    const rel = p.replace(/^\/seo-system-300\/?/, '') || 'index.html';
    const file = safeJoin(SEO300_DIR, rel === '' ? 'index.html' : rel);
    if (file && fs.existsSync(file) && fs.statSync(file).isFile()) {
      sendFile(res, file);
      return;
    }
    const idx = path.join(SEO300_DIR, 'index.html');
    if (fs.existsSync(idx)) {
      sendFile(res, idx);
      return;
    }
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('seo-system-300 missing');
    return;
  }

  // Assets: pick tree from Referer path when possible
  if (p.startsWith('/assets/') || p.startsWith('/src/assets/')) {
    const referer = req.headers.referer || '';
    let refPath = '/';
    try {
      refPath = normalizePath(new URL(referer).pathname);
    } catch {
      /* ignore */
    }
    const { dir, kind } = resolveRoot(refPath);
    assetHint.set('last', kind);
    const rel = p.replace(/^\//, '');
    let file = safeJoin(dir, rel);
    if (!file || !fs.existsSync(file)) {
      // try both imports
      file = safeJoin(OFFICIAL_DIR, rel) || safeJoin(LEGACY_DIR, rel);
      if (file && !fs.existsSync(file)) file = null;
      if (!file || !fs.existsSync(file)) {
        const other = kind === 'official' ? LEGACY_DIR : OFFICIAL_DIR;
        file = safeJoin(other, rel);
      }
    }
    if (file && fs.existsSync(file)) {
      sendFile(res, file);
      return;
    }
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('asset 404 ' + p);
    return;
  }

  const { dir, kind } = resolveRoot(p);
  const html = findHtml(dir, OFFICIAL_EXACT.has(p) || isLegacy(p) || p.startsWith('/features/') ? p : '/');
  if (!html) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`QA 404: no shell for ${p} (${kind})`);
    return;
  }

  // unknown routes → official/legacy SPA 404 shell if present
  const known =
    OFFICIAL_EXACT.has(p) ||
    isLegacy(p) ||
    p.startsWith('/features/') ||
    p === '/';
  const status = known ? 200 : 200; // SPA client handles 404 UI
  res.writeHead(status, {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-QA-Import': kind,
    'X-QA-Official-Gate': OFFICIAL_ON ? 'on' : 'off',
    'X-QA-Route': p,
  });
  let body = fs.readFileSync(html, 'utf8');
  // inject gate marker for automated asserts
  body = body.replace(
    '</head>',
    `<meta name="onoff-qa-import" content="${kind}" /><meta name="onoff-qa-gate" content="${OFFICIAL_ON ? 'on' : 'off'}" /></head>`
  );
  res.end(body);
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`[local-official-qa] http://127.0.0.1:${PORT}`);
  console.log(`[local-official-qa] LOCAL_OFFICIAL_QA=${OFFICIAL_ON ? '1' : '0'}`);
  console.log(`[local-official-qa] official=${OFFICIAL_DIR}`);
  console.log(`[local-official-qa] legacy=${LEGACY_DIR}`);
  if (INQUIRY_LAB) console.log(`[local-official-qa] inquiry_lab_proxy=${INQUIRY_LAB}`);
});
