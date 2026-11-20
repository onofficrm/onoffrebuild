/**
 * Post-build prerender for ONOFF Builder official website routes.
 * Copies dist/index.html → dist/{route}/index.html and injects
 * route-specific <title>, description, canonical, og tags, FAQ JSON-LD.
 *
 * Does NOT replace React runtime — SPA still hydrates after load.
 * Source of truth for meta copy: src/data/seo.ts (mirrored below for Node).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');
const BASE = 'https://onoff.icrm.co.kr';
const SITE_NAME = 'ONOFF Builder 2.0';

/** @typedef {{ path: string, title: string, description: string, robots?: string, faqSchema?: { question: string, answer: string }[] }} PrerenderRoute */

/** @type {PrerenderRoute[]} */
const ROUTES = [
  {
    path: '/',
    title: 'ONOFF Builder 2.0 | 홈페이지 · 3대 자동화 도구 · 쉬운 수정 · AI 기능 개발',
    description:
      '루틴·스텝메일·오토포스터(SNS 마케팅) — ONOFF Builder 기본 제공(별도 솔루션 구독료 0원). 홈페이지 제작부터 쉬운 수정, AI 기능 개발까지 하나의 플랫폼으로 연결합니다.',
  },
  {
    path: '/features',
    title: '기본 기능 — 루틴 · 스텝메일 · 오토포스터 · 자동 댓글 · 쉬운 수정 · AI 기능 개발 | ONOFF Builder 2.0',
    description:
      'ONOFF Builder 기본 제공(추가 솔루션 구독료 0원) 스텝메일·오토포스터(SNS 마케팅)·자동 댓글과 루틴 자동발행, 쉬운 홈페이지 수정, AI 기능 개발의 제공 정책 및 현재 운영 상태를 투명하게 확인하세요.',
  },
  {
    path: '/features/routine',
    title: '루틴 자동발행 — 꾸준한 콘텐츠 운영을 루틴으로 | ONOFF Builder 2.0',
    description:
      '주제 및 규칙 설정, 콘텐츠 초안 생성, 담당자 검수, 예약 및 발행, 결과 확인까지 홈페이지 콘텐츠 운영을 체계화하는 ONOFF Builder 루틴 안내입니다.',
  },
  {
    path: '/features/step-mail',
    title: '스텝메일 — 고객을 놓치지 않는 단계별 자동 이메일 | ONOFF Builder 2.0',
    description:
      'ONOFF Builder 기본 제공(별도 솔루션 구독료 0원). 외부 이메일 전문 도구를 따로 구독할 필요 없이 홈페이지 문의와 연결된 단계별 자동 이메일 흐름과 Mailchimp 비교를 안내합니다.',
  },
  {
    path: '/features/sns-poster',
    title: '오토포스터 (SNS 마케팅) — FS Poster 같은 SNS 자동화, 별도 솔루션 구독료 없이 | ONOFF Builder 2.0',
    description:
      'ONOFF Builder 기본 제공(별도 솔루션 구독료 0원). 외부 SNS 전문 도구를 따로 구독할 필요 없이 홈페이지 게시글과 SNS 배포·예약 흐름을 연결하는 오토포스터(SNS 마케팅)와 FS Poster 비교 안내입니다.',
  },
  {
    path: '/features/auto-comment',
    title: '자동 댓글 — 홈페이지 댓글에 AI가 답변 초안을, 담당자가 승인을 | ONOFF Builder 2.0',
    description:
      'ONOFF Builder 기본 제공(별도 솔루션 구독료 0원). 홈페이지 게시글 댓글을 질문·상담·스팸으로 분류하고 브랜드 톤 AI 답변 초안을 담당자 승인 후 게시하는 자동 댓글 응대 기능 안내입니다.',
  },
  {
    path: '/features/easy-edit',
    title: '쉬운 홈페이지 수정 — 수정하고 싶은 내용을 말하면 홈페이지가 바뀝니다 | ONOFF Builder 2.0',
    description:
      '자연어로 수정 요청을 작성하면 운영팀이 AI로 변경 내용을 분석해 수정·미리보기·검수 후 안전하게 배포하는 ONOFF Builder 쉬운 홈페이지 수정 안내입니다.',
  },
  {
    path: '/features/ai-development',
    title: 'AI 기능 개발 — 생각한 기능을 말로 설명하세요 | ONOFF Builder 2.0',
    description:
      '견적 계산기, 예약 신청, 회원 전용 자료실 등 맞춤 기능을 고객 아이디어·AI 지원 설계·전문팀 개발·테스트·적용 절차와 명확한 범위 협의로 구현합니다.',
  },
  {
    path: '/website',
    title: '홈페이지 제작 | ONOFF Builder 2.0',
    description:
      '브랜드 맞춤 기획과 디자인, PC·모바일 반응형, 게시판·자료실·문의 폼, 자동화·AI 기능 확장을 고려한 관리형 홈페이지 제작 서비스입니다.',
  },
  {
    path: '/management',
    title: '운영관리 | ONOFF Builder 2.0',
    description:
      '오픈 이후에도 호스팅, SSL 보안, 자연어 기반 쉬운 수정 요청, 장애 점검과 페이지 확장을 전담 운영자가 지속적으로 관리합니다.',
  },
  {
    path: '/services/seo',
    title: 'SEO 최적화 | 온오프마케팅 별도 서비스 · ONOFF Builder 2.0',
    description:
      '검색엔진 친화적인 웹사이트 구조, 타이틀·메타정보, 모바일 최적화, 내부링크 및 콘텐츠 전략으로 검색 유입 기반을 설계하는 별도 전문 서비스입니다.',
  },
  {
    path: '/geo',
    title: 'GEO 최적화 | 온오프마케팅 별도 서비스 · ONOFF Builder 2.0',
    description:
      'AI 검색 시대에 대비해 GEO Analyzer 진단, 콘텐츠·사이트 구조 분석, 개선 방향 제안 및 재측정까지 지원하는 별도 전문 서비스입니다.',
  },
  {
    path: '/backlink',
    title: 'BACKLINK 전략 | 온오프마케팅 별도 서비스 · ONOFF Builder 2.0',
    description:
      '사전 사이트 분석, 업종 맥락에 맞는 링크 전략, 합리적인 예산 검토와 캠페인 안내를 통해 건강한 외부 참조 구조를 설계하는 별도 전문 서비스입니다.',
  },
  {
    path: '/traffic',
    title: 'TRAFFIC 유입 전략 | 온오프마케팅 별도 서비스 · ONOFF Builder 2.0',
    description:
      '웹사이트 유입 목적과 운영 방식, 활용 조건과 유의사항을 명확히 정리해 홈페이지 전환 구조와 연계하는 별도 트래픽 서비스입니다.',
  },
  {
    path: '/domain',
    title: 'DOMAIN 연결·전략 | 온오프마케팅 별도 서비스 · ONOFF Builder 2.0',
    description:
      '브랜드 도메인 선택, 기존 도메인 분석 및 무중단 DNS·메일 보존 연결, HTTPS SSL 설정과 검색 고려사항까지 지원하는 서비스입니다.',
  },
  {
    path: '/content',
    title: 'AI 콘텐츠 운영 | 온오프마케팅 별도 서비스 · ONOFF Builder 2.0',
    description:
      '콘텐츠 기획, AI 초안 작성, 담당자 검수 및 발행 워크플로로 브랜드 톤을 유지하면서 콘텐츠 운영 시간을 줄입니다.',
  },
  {
    path: '/use-cases',
    title: '업종별 활용사례 | ONOFF Builder 2.0',
    description:
      '병원·전문직, 인테리어·시공, 기업·소상공인, 교육·컨설팅, 커뮤니티, 관광·지역정보 플랫폼까지 업종별 홈페이지 구성과 운영 방식을 안내합니다.',
  },
  {
    path: '/portfolio',
    title: '제작사례 | ONOFF Builder 2.0',
    description:
      'ONOFF Builder의 기업, 전문직, 커뮤니티, 랜딩페이지 디자인 기준과 콘셉트 예시 및 공개 협의 완료 제작사례를 확인하세요.',
  },
  {
    path: '/pricing',
    title: '요금안내 — 홈페이지와 함께 기본 제공하는 강력한 운영 도구 | ONOFF Builder 2.0',
    description:
      '온오프빌더 고객에게 루틴·스텝메일·오토포스터(SNS 마케팅) 자체 기능은 ONOFF Builder 기본 제공(별도 솔루션 구독료 0원)이며, 홈페이지 초기 제작비·월 홈페이지 운영관리비 및 제3자 발송·유료 SNS API 실비·대행·사용량 정책·맞춤 개발비를 투명하게 구분해 안내합니다.',
  },
  {
    path: '/contact',
    title: '상담하기 — 홈페이지 · 기본 기능 · 카카오·화상 문의 | ONOFF Builder 2.0',
    description:
      '카카오톡 즉시 상담과 Google Meet 1:1 화상 상담 예약을 이용할 수 있습니다. 홈페이지 제작·운영, 루틴·스텝메일·SNS, 쉬운 수정, AI 기능 개발 문의를 남겨 주세요.',
  },
];

function escapeAttr(value) {
  return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

function fileDirForPath(routePath) {
  if (!routePath || routePath === '/') return '';
  return routePath.replace(/^\//, '');
}

/**
 * @param {string} html
 * @param {PrerenderRoute} route
 */
function injectMeta(html, route) {
  const url = route.path === '/' ? `${BASE}/` : `${BASE}${route.path}`;
  const robots = route.robots || 'index, follow';
  const canonical = `<link rel="canonical" href="${url}" />`;
  const desc = `<meta name="description" content="${escapeAttr(route.description)}" />`;
  const robotsTag = `<meta name="robots" content="${escapeAttr(robots)}" />`;
  const og = [
    `<meta property="og:title" content="${escapeAttr(route.title)}" />`,
    `<meta property="og:description" content="${escapeAttr(route.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${escapeAttr(SITE_NAME)}" />`,
  ].join('\n    ');

  const schemas = [];
  if (route.path === '/') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_NAME,
      url: `${BASE}/`,
    });
  } else {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: route.title,
      description: route.description,
      url,
      isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: `${BASE}/` },
    });
  }
  if (route.faqSchema && route.faqSchema.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: route.faqSchema.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    });
  }

  const ld = schemas
    .map(
      (schema, i) =>
        `<script type="application/ld+json" id="onoff-prerender-jsonld-${i}">${JSON.stringify(schema)}</script>`
    )
    .join('\n    ');

  let out = html.replace(/<title>[^<]*<\/title>/i, `<title>${route.title}</title>`);
  out = out.replace(/<link rel="canonical"[^>]*>/gi, '');
  out = out.replace(/<meta name="description"[^>]*>/gi, '');
  out = out.replace(/<meta name="robots"[^>]*>/gi, '');
  out = out.replace(/<meta property="og:(title|description|url|type|site_name)"[^>]*>/gi, '');
  out = out.replace(/<script type="application\/ld\+json" id="onoff-prerender-jsonld[^"]*">[\s\S]*?<\/script>/gi, '');

  out = out.replace(
    /<\/head>/i,
    `    ${canonical}\n    ${desc}\n    ${robotsTag}\n    ${og}\n    ${ld}\n  </head>`
  );
  return out;
}

function main() {
  const indexPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(indexPath)) {
    console.error('[prerender] dist/index.html missing — run vite build first');
    process.exit(1);
  }
  const baseHtml = fs.readFileSync(indexPath, 'utf8');

  for (const route of ROUTES) {
    const html = injectMeta(baseHtml, route);
    const fileDir = fileDirForPath(route.path);
    if (!fileDir) {
      fs.writeFileSync(indexPath, html, 'utf8');
      console.log('[prerender] / → dist/index.html');
      continue;
    }
    const dir = path.join(distDir, fileDir);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
    console.log(`[prerender] ${route.path} → dist/${fileDir}/index.html`);
  }

  const notFound = injectMeta(baseHtml, {
    path: '/404',
    title: '페이지를 찾을 수 없습니다 | ONOFF Builder 2.0',
    description: '요청하신 페이지를 찾을 수 없습니다. ONOFF Builder 주요 서비스 메뉴를 이용해 주세요.',
    robots: 'noindex, nofollow',
  });
  const nfDir = path.join(distDir, '404');
  fs.mkdirSync(nfDir, { recursive: true });
  fs.writeFileSync(path.join(nfDir, 'index.html'), notFound, 'utf8');
  console.log('[prerender] 404 shell written');
}

main();
