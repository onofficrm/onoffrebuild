#!/usr/bin/env node
/**
 * Playwright local browser QA for ONOFF Builder official integration.
 * Saves screenshots under docs/qa-screenshots/official-local/
 *
 * Usage (server must already listen on QA_BASE):
 *   QA_BASE=http://127.0.0.1:8091 node scripts/local-official-browser-qa.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium, devices } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const BASE = process.env.QA_BASE || 'http://127.0.0.1:8091';
const OUT = path.join(ROOT, 'docs/qa-screenshots/official-local');

const VIEWPORTS = [
  { name: 'pc-1440', width: 1440, height: 900 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'mobile-360', width: 360, height: 800 },
];

const OFFICIAL_ROUTES = [
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
];

const LEGACY_ROUTES = ['/community', '/login', '/account', '/education', '/seo-platform', '/seo'];

fs.mkdirSync(OUT, { recursive: true });

function slug(p) {
  return p === '/' ? 'home' : p.replace(/^\//, '').replace(/\//g, '__');
}

async function collectPageSignals(page) {
  return page.evaluate(() => {
    const doc = document.documentElement;
    const body = document.body;
    const scrollWidth = Math.max(doc.scrollWidth, body?.scrollWidth || 0);
    const clientWidth = doc.clientWidth;
    const horizontalOverflow = scrollWidth > clientWidth + 2;
    const brokenImgs = Array.from(document.images)
      .filter((img) => !img.complete || img.naturalWidth === 0)
      .map((img) => img.src || img.getAttribute('src') || '(no src)')
      .slice(0, 20);
    const qaImport = document.querySelector('meta[name="onoff-qa-import"]')?.content || '';
    const qaGate = document.querySelector('meta[name="onoff-qa-gate"]')?.content || '';
    const title = document.title;
    const h1 = document.querySelector('h1')?.textContent?.trim() || '';
    const text = document.body?.innerText || '';
    return {
      title,
      h1,
      qaImport,
      qaGate,
      horizontalOverflow,
      scrollWidth,
      clientWidth,
      brokenImgs,
      hasMailchimp: /mailchimp\.com/i.test(document.documentElement.outerHTML),
      hasFsPoster: /fs-poster\.com/i.test(document.documentElement.outerHTML),
      hasZeroSubscription: /구독료\s*0\s*원|별도 솔루션 구독료/.test(text),
      hasIntegrationPending: /연동 준비|준비 중|미연동|시연/.test(text),
      hasPreviewBanner:
        /PREVIEW|서버 미연동|실제 서버로 전송되지 않았습니다|프런트엔드 시연|화상 상담 예약 접수가/.test(
          text,
        ),
      hasLiveAccepted: /접수되었습니다/.test(text),
    };
  });
}

async function main() {
  const report = {
    base: BASE,
    startedAt: new Date().toISOString(),
    viewports: {},
    consoleErrors: [],
    pageErrors: [],
    networkFailures: [],
    routeResults: [],
    contactPreview: null,
    seo300: null,
    summary: { fail: 0, warn: 0, pass: 0 },
  };

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      report.consoleErrors.push({ text: msg.text(), loc: msg.location() });
    }
  });
  page.on('pageerror', (err) => {
    report.pageErrors.push(String(err));
  });
  page.on('requestfailed', (req) => {
    report.networkFailures.push({
      url: req.url(),
      error: req.failure()?.errorText || 'failed',
    });
  });

  // Viewport sweep on home + key feature pages
  for (const vp of VIEWPORTS) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    const keyRoutes = ['/', '/features/step-mail', '/features/sns-poster', '/pricing', '/contact'];
    report.viewports[vp.name] = [];
    for (const route of keyRoutes) {
      const url = BASE + route;
      const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
      await page.waitForTimeout(500);
      const signals = await collectPageSignals(page);
      const shot = path.join(OUT, `${vp.name}__${slug(route)}.png`);
      await page.screenshot({ path: shot, fullPage: true });
      const entry = {
        route,
        status: resp?.status() || 0,
        screenshot: path.relative(ROOT, shot),
        ...signals,
      };
      report.viewports[vp.name].push(entry);
      if (signals.horizontalOverflow || signals.brokenImgs.length) report.summary.warn += 1;
      else report.summary.pass += 1;
      if (signals.qaImport !== 'official' && OFFICIAL_ROUTES.includes(route)) {
        report.summary.fail += 1;
        entry.fail = 'expected official import';
      }
    }
  }

  // Full official route check at 1440
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const route of OFFICIAL_ROUTES) {
    const resp = await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(300);
    const signals = await collectPageSignals(page);
    const shot = path.join(OUT, `route__${slug(route)}.png`);
    await page.screenshot({ path: shot, fullPage: false });
    const row = {
      route,
      status: resp?.status() || 0,
      screenshot: path.relative(ROOT, shot),
      ...signals,
    };
    if (signals.qaImport !== 'official') {
      row.fail = 'expected official';
      report.summary.fail += 1;
    } else {
      report.summary.pass += 1;
    }
    report.routeResults.push(row);
  }

  // Legacy routes should stay legacy import
  for (const route of LEGACY_ROUTES) {
    const resp = await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(400);
    const signals = await collectPageSignals(page);
    const shot = path.join(OUT, `legacy__${slug(route)}.png`);
    await page.screenshot({ path: shot, fullPage: false });
    const row = {
      route,
      status: resp?.status() || 0,
      screenshot: path.relative(ROOT, shot),
      ...signals,
    };
    if (signals.qaImport !== 'legacy') {
      row.fail = 'expected legacy';
      report.summary.fail += 1;
    } else if (
      route === '/seo-platform' &&
      !/SEO를 분석에서 실행|ONOFF SEO SYSTEM/i.test(signals.h1 || '')
    ) {
      row.fail = 'seo-platform content missing';
      report.summary.fail += 1;
    } else if (route === '/seo' && !/SEO교육/i.test(signals.title || '')) {
      row.fail = 'gnuboard seo board title missing';
      report.summary.fail += 1;
    } else {
      report.summary.pass += 1;
    }
    report.routeResults.push(row);
  }

  // seo-system-300
  {
    const resp = await page.goto(BASE + '/seo-system-300/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    const shot = path.join(OUT, 'seo-system-300.png');
    await page.screenshot({ path: shot, fullPage: false });
    report.seo300 = {
      status: resp?.status() || 0,
      title: await page.title(),
      screenshot: path.relative(ROOT, shot),
    };
  }

  // Contact PREVIEW flow (Google Meet form, no LIVE API)
  await page.goto(BASE + '/contact?service=seo', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(400);
  const before = await collectPageSignals(page);
  try {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    const dateStr = d.toISOString().slice(0, 10);
    await page.locator('input[name="hasHomepage"][value="no"]').click({ force: true });
    await page.fill('#meet-date', dateStr);
    await page.selectOption('#meet-time', { index: 1 });
    await page.fill('#meet-google-email', 'qa@example.invalid');
    await page.fill('#meet-brief', 'QA browser smoke — Meet PREVIEW 제출 검증용입니다.');
    const agree = page.locator('#google-meet-form input[type="checkbox"]');
    if (await agree.count()) await agree.check({ force: true });
    await page.locator('#google-meet-form button[type="submit"]').click();
    await page.waitForTimeout(800);
  } catch (e) {
    report.contactPreview = { error: String(e), before };
  }
  const after = await collectPageSignals(page);
  const contactShot = path.join(OUT, 'contact-preview-result.png');
  await page.screenshot({ path: contactShot, fullPage: true });
  report.contactPreview = {
    before,
    after,
    screenshot: path.relative(ROOT, contactShot),
    liveAcceptedShown: after.hasLiveAccepted,
    previewBannerShown: after.hasPreviewBanner,
    ok: after.hasPreviewBanner && !after.hasLiveAccepted,
  };
  if (!report.contactPreview.ok) report.summary.fail += 1;
  else report.summary.pass += 1;

  // Policy pages
  for (const route of ['/features/step-mail', '/features/sns-poster', '/pricing']) {
    await page.goto(BASE + route, { waitUntil: 'networkidle' });
    const s = await collectPageSignals(page);
    report.routeResults.push({
      route: `${route}#policy-check`,
      ...s,
      policyOk:
        (route.includes('step-mail') ? s.hasMailchimp : true) &&
        (route.includes('sns') ? s.hasFsPoster : true) &&
        (s.hasZeroSubscription || s.hasIntegrationPending),
    });
  }

  // 301 aliases
  for (const [from, to] of [
    ['/features/stepmail', '/features/step-mail'],
    ['/features/sns', '/features/sns-poster'],
    ['/features/ai-dev', '/features/ai-development'],
  ]) {
    const resp = await page.goto(BASE + from, { waitUntil: 'domcontentloaded', timeout: 30000 });
    report.routeResults.push({
      route: from,
      finalUrl: page.url(),
      expected: BASE + to,
      status: resp?.status() || 0,
      aliasOk: page.url().replace(/\/$/, '') === (BASE + to).replace(/\/$/, ''),
    });
  }

  await browser.close();

  report.finishedAt = new Date().toISOString();
  report.consoleErrors = report.consoleErrors.slice(0, 50);
  report.networkFailures = report.networkFailures
    .filter((n) => !n.url.includes('favicon'))
    .slice(0, 50);

  const outJson = path.join(OUT, 'qa-report.json');
  fs.writeFileSync(outJson, JSON.stringify(report, null, 2), 'utf8');
  console.log(JSON.stringify({ summary: report.summary, report: path.relative(ROOT, outJson) }, null, 2));
  if (report.summary.fail > 0) process.exitCode = 2;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
