#!/usr/bin/env node
/**
 * /contact 상담 UX 스모크 (카카오 링크 · ?service= · Meet 폼 · PREVIEW/LIVE 신호)
 *
 * Usage:
 *   QA_BASE=http://127.0.0.1:8091 node scripts/contact-consultation-qa.mjs
 *   # 빌드 반영 후:
 *   cd build/onoff-builder-website && VITE_CONSULTATION_MODE=PREVIEW npm run build && npm run sync:official
 *   LOCAL_OFFICIAL_QA=1 node scripts/local-official-qa-server.mjs
 */

import { chromium } from 'playwright';

const BASE = process.env.QA_BASE || 'http://127.0.0.1:8091';
const KAKAO_URL = 'http://pf.kakao.com/_MTlNK/chat';

function tomorrowYmd() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const results = [];

  // 1) 기본 /contact
  await page.goto(`${BASE}/contact`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('a[href*="pf.kakao.com"]', { timeout: 45000 });
  const kakaoHref = await page.locator('a[href*="pf.kakao.com"]').first().getAttribute('href');
  const h1 = (await page.locator('h1').first().textContent())?.trim() || '';
  const title = await page.title();
  results.push({
    case: 'contact-default',
    kakaoOk: kakaoHref === KAKAO_URL,
    h1,
    titleHasConsult: /상담/.test(title),
    titleNotLegacy: !/제작 상담/.test(title),
    meetForm: await page.locator('#google-meet-form').count(),
  });

  // 2) ?service=seo
  await page.goto(`${BASE}/contact?service=seo`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('#google-meet-form', { timeout: 45000 });
  const seoChip = page.getByRole('button', { name: 'SEO' });
  const seoPressed =
    (await seoChip.count()) > 0 ? await seoChip.getAttribute('aria-pressed') : null;
  const h1Seo = (await page.locator('h1').first().textContent())?.trim() || '';
  results.push({
    case: 'contact-service-seo',
    h1Seo,
    seoChipSelected: seoPressed === 'true',
    h1MentionsSeo: /SEO/.test(h1Seo),
  });

  // 3) alias step-mail
  await page.goto(`${BASE}/contact?service=step-mail`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('#contact-service-first', { timeout: 45000 });
  const stepmailChip = page.getByRole('button', { name: '스텝메일' });
  const stepPressed =
    (await stepmailChip.count()) > 0 ? await stepmailChip.getAttribute('aria-pressed') : null;
  results.push({
    case: 'contact-service-alias',
    stepmailSelected: stepPressed === 'true',
  });

  // 4) Meet PREVIEW 제출 (LIVE 성공 문구 없어야 함)
  await page.goto(`${BASE}/contact?service=website`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('#google-meet-form', { timeout: 45000 });
  let inquiryPosts = 0;
  page.on('request', (req) => {
    if (req.method() === 'POST' && req.url().includes('inquiry-submit')) inquiryPosts += 1;
  });
  await page.locator('input[name="hasHomepage"][value="no"]').click({ force: true });
  await page.fill('#meet-date', tomorrowYmd());
  await page.selectOption('#meet-time', { index: 1 });
  await page.fill('#meet-google-email', 'qa-meet@example.invalid');
  await page.fill('#meet-brief', 'QA smoke — Meet PREVIEW or LIVE 경로 확인용 문의입니다.');
  const agreeBox = page.locator('#google-meet-form input[type="checkbox"]');
  if (await agreeBox.count()) await agreeBox.check({ force: true });
  await page.locator('#google-meet-form button[type="submit"]').click();
  await page.waitForTimeout(1200);
  const body = await page.locator('body').innerText();
  const liveSuccess = /접수되었습니다/.test(body);
  const previewMsg = /PREVIEW/.test(body);
  results.push({
    case: 'meet-submit',
    inquiryPosts,
    liveSuccess,
    previewMsg,
    okPreview:
      process.env.EXPECT_LIVE === '1'
        ? liveSuccess && inquiryPosts >= 1
        : !liveSuccess && (previewMsg || inquiryPosts === 0),
  });

  const failed = results.filter((r) => {
    if (r.case === 'contact-default') {
      return !(r.kakaoOk && r.meetForm === 1 && r.titleNotLegacy);
    }
    if (r.case === 'contact-service-seo') {
      return !(r.seoChipSelected && r.h1MentionsSeo);
    }
    if (r.case === 'contact-service-alias') {
      return !r.stepmailSelected;
    }
    if (r.case === 'meet-submit') {
      return !r.okPreview;
    }
    return false;
  });

  console.log(JSON.stringify({ base: BASE, results, pass: failed.length === 0 }, null, 2));
  await browser.close();
  if (failed.length) process.exitCode = 2;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});