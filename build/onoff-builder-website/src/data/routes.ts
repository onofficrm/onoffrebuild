import { SITE_ORIGIN } from './seo';

export interface AppRouteSpec {
  path: string;
  canonical: string;
  name: string;
  component: string;
  category:
    | 'main'
    | 'core_capability'
    | 'service'
    | 'separate_service'
    | 'platform'
    | 'conversion'
    | 'error';
  routeStatus: 'active' | 'planned';
  sitemapIncluded: boolean;
  gnuboardIntegrationNote: string;
}

export interface RouteRedirectSpec {
  from: string;
  to: string;
  reason: string;
}

/**
 * 현재 활성 운영 라우트 (기존 13개 URL 100% 보존 + 신규 /features 6개 정규 라우트 + 404)
 */
export const APP_ROUTES: AppRouteSpec[] = [
  {
    path: '/',
    canonical: `${SITE_ORIGIN}/`,
    name: '메인 홈페이지',
    component: 'HomePage',
    category: 'main',
    routeStatus: 'active',
    sitemapIncluded: true,
    gnuboardIntegrationNote:
      '메인 진입 페이지 — 홈페이지 + 3대 자동화 도구 + 쉬운 수정 + AI 기능 개발 통합 메시지 적용 완료',
  },
  {
    path: '/features',
    canonical: `${SITE_ORIGIN}/features`,
    name: '기본 기능 전체 안내',
    component: 'FeaturesOverviewPage',
    category: 'core_capability',
    routeStatus: 'active',
    sitemapIncluded: true,
    gnuboardIntegrationNote:
      '신규 기본 기능 개요 페이지 (루틴·스텝메일·SNS 마케팅 + 쉬운 수정 + AI 기능 개발)',
  },
  {
    path: '/features/routine',
    canonical: `${SITE_ORIGIN}/features/routine`,
    name: '루틴 자동발행',
    component: 'RoutineFeaturePage',
    category: 'core_capability',
    routeStatus: 'active',
    sitemapIncluded: true,
    gnuboardIntegrationNote:
      '기본 기능 #1 · 5단계 흐름 + 운영자 대시보드 시연 화면 (실서버 발행 미연동 명시)',
  },
  {
    path: '/features/step-mail',
    canonical: `${SITE_ORIGIN}/features/step-mail`,
    name: '스텝메일',
    component: 'StepmailFeaturePage',
    category: 'core_capability',
    routeStatus: 'active',
    sitemapIncluded: true,
    gnuboardIntegrationNote:
      '기본 기능 #2 · 5단계 흐름 + 비발송 인터랙티브 데모 + Mailchimp 비교 + 미검증 사항 구분 (/features/stepmail 리다이렉트 호환)',
  },
  {
    path: '/features/sns-poster',
    canonical: `${SITE_ORIGIN}/features/sns-poster`,
    name: 'SNS 마케팅',
    component: 'SnsMarketingFeaturePage',
    category: 'core_capability',
    routeStatus: 'active',
    sitemapIncluded: true,
    gnuboardIntegrationNote:
      '기본 기능 #3 · 6단계 흐름 + SNS 관리 대시보드 시연 + FS Poster 비교 + 미검증 채널 비활성 명시 (/features/sns 리다이렉트 호환)',
  },
  {
    path: '/features/auto-comment',
    canonical: `${SITE_ORIGIN}/features/auto-comment`,
    name: '자동 댓글',
    component: 'AutoCommentFeaturePage',
    category: 'core_capability',
    routeStatus: 'active',
    sitemapIncluded: true,
    gnuboardIntegrationNote:
      '기본 기능 #4 · 댓글 감지 → 분류·AI 답변 초안 → 담당자 승인 게시 시연 (게시판 댓글 연동 준비 중 명시, 외부 사이트 댓글 작성 아님)',
  },
  {
    path: '/features/easy-edit',
    canonical: `${SITE_ORIGIN}/features/easy-edit`,
    name: '쉬운 홈페이지 수정',
    component: 'EasyEditFeaturePage',
    category: 'core_capability',
    routeStatus: 'active',
    sitemapIncluded: true,
    gnuboardIntegrationNote:
      '기본 기능 #5 · 자연어 수정 요청 → AI 분석·수정 → 미리보기·검수·배포 + 수정 전/후 비교 데모',
  },
  {
    path: '/features/ai-development',
    canonical: `${SITE_ORIGIN}/features/ai-development`,
    name: 'AI 기능 개발',
    component: 'AiDevFeaturePage',
    category: 'core_capability',
    routeStatus: 'active',
    sitemapIncluded: true,
    gnuboardIntegrationNote:
      '기본 기능 #6 · 5단계 협업·검수 절차 + 3대 구현 예시 시연 + 범위 협의 원칙 명시 (/features/ai-dev 리다이렉트 호환)',
  },
  {
    path: '/website',
    canonical: `${SITE_ORIGIN}/website`,
    name: '홈페이지 제작',
    component: 'WebsiteServicePage',
    category: 'service',
    routeStatus: 'active',
    sitemapIncluded: true,
    gnuboardIntegrationNote: '기존 URL 유지 · 관리형 홈페이지 제작 기반 페이지',
  },
  {
    path: '/management',
    canonical: `${SITE_ORIGIN}/management`,
    name: '운영관리',
    component: 'ManagementServicePage',
    category: 'service',
    routeStatus: 'active',
    sitemapIncluded: true,
    gnuboardIntegrationNote: '기존 URL 유지 · 호스팅/보안/유지보수 및 쉬운 수정 연계',
  },
  {
    path: '/services/seo',
    canonical: `${SITE_ORIGIN}/services/seo`,
    name: 'SEO 최적화 (별도 서비스)',
    component: 'SeoServicePage',
    category: 'separate_service',
    routeStatus: 'active',
    sitemapIncluded: true,
    gnuboardIntegrationNote: '기존 URL 유지 · 온오프마케팅 별도 전문 서비스',
  },
  {
    path: '/geo',
    canonical: `${SITE_ORIGIN}/geo`,
    name: 'GEO 최적화 (별도 서비스)',
    component: 'GeoServicePage',
    category: 'separate_service',
    routeStatus: 'active',
    sitemapIncluded: true,
    gnuboardIntegrationNote: '기존 URL 유지 · 온오프마케팅 별도 전문 서비스',
  },
  {
    path: '/backlink',
    canonical: `${SITE_ORIGIN}/backlink`,
    name: 'BACKLINK 전략 (별도 서비스)',
    component: 'BacklinkServicePage',
    category: 'separate_service',
    routeStatus: 'active',
    sitemapIncluded: true,
    gnuboardIntegrationNote: '기존 URL 유지 · 온오프마케팅 별도 전문 서비스',
  },
  {
    path: '/traffic',
    canonical: `${SITE_ORIGIN}/traffic`,
    name: 'TRAFFIC 유입 전략 (별도 서비스)',
    component: 'TrafficServicePage',
    category: 'separate_service',
    routeStatus: 'active',
    sitemapIncluded: true,
    gnuboardIntegrationNote: '기존 URL 유지 · 온오프마케팅 별도 전문 서비스',
  },
  {
    path: '/domain',
    canonical: `${SITE_ORIGIN}/domain`,
    name: 'DOMAIN 연결·전략 (별도 서비스)',
    component: 'DomainServicePage',
    category: 'separate_service',
    routeStatus: 'active',
    sitemapIncluded: true,
    gnuboardIntegrationNote: '기존 URL 유지 · 온오프마케팅 별도 전문 서비스',
  },
  {
    path: '/content',
    canonical: `${SITE_ORIGIN}/content`,
    name: 'AI 콘텐츠 운영 (별도 서비스)',
    component: 'ContentServicePage',
    category: 'separate_service',
    routeStatus: 'active',
    sitemapIncluded: true,
    gnuboardIntegrationNote: '기존 URL 유지 · /features/routine과 역할 구분 및 연계 안내',
  },
  {
    path: '/use-cases',
    canonical: `${SITE_ORIGIN}/use-cases`,
    name: '업종별 활용사례',
    component: 'UseCasesPage',
    category: 'platform',
    routeStatus: 'active',
    sitemapIncluded: true,
    gnuboardIntegrationNote: '기존 URL 유지 · 6개 업종별 홈페이지 구성 및 추가 개발 안내',
  },
  {
    path: '/portfolio',
    canonical: `${SITE_ORIGIN}/portfolio`,
    name: '제작사례',
    component: 'PortfolioPage',
    category: 'platform',
    routeStatus: 'active',
    sitemapIncluded: true,
    gnuboardIntegrationNote: '기존 URL 유지 · 향후 그누보드 전용 게시판 연동 대상',
  },
  {
    path: '/pricing',
    canonical: `${SITE_ORIGIN}/pricing`,
    name: '요금안내',
    component: 'PricingPage',
    category: 'platform',
    routeStatus: 'active',
    sitemapIncluded: true,
    gnuboardIntegrationNote:
      '기존 URL 유지 · 홈페이지+기본 운영 도구 정책과 실제 가용성·발송량·외부 API·맞춤 개발 비용 구분 반영',
  },
  {
    path: '/community',
    canonical: `${SITE_ORIGIN}/community`,
    name: '커뮤니티',
    component: 'CommunityPage',
    category: 'platform',
    routeStatus: 'active',
    sitemapIncluded: true,
    gnuboardIntegrationNote:
      'GNUBoard notice/faq/youtube 게시판과 API(/api/community.php) 연동 · 글 본문·권한은 기존 유지',
  },
  {
    path: '/contact',
    canonical: `${SITE_ORIGIN}/contact`,
    name: '상담하기',
    component: 'ContactPage',
    category: 'conversion',
    routeStatus: 'active',
    sitemapIncluded: true,
    gnuboardIntegrationNote:
      '기존 URL 유지 · 기존 8개 서비스 + 신규 5대 기본 기능 멀티 선택 및 ?service= 파라미터 하위 호환 완료',
  },
  {
    path: '*',
    canonical: `${SITE_ORIGIN}/`,
    name: '404 Not Found',
    component: 'NotFoundPage',
    category: 'error',
    routeStatus: 'active',
    sitemapIncluded: false,
    gnuboardIntegrationNote:
      'Apache/Nginx ErrorDocument 404 및 SPA 폴백 (/community 등 운영 경로는 절대 가로채지 않음)',
  },
];

/**
 * 구버전 경로 호환 리다이렉트 규칙 (301/replace 권장)
 */
export const ROUTE_REDIRECT_ALIASES: RouteRedirectSpec[] = [
  {
    from: '/features/stepmail',
    to: '/features/step-mail',
    reason: '스텝메일 정규 URL 통일',
  },
  {
    from: '/features/sns',
    to: '/features/sns-poster',
    reason: 'SNS 마케팅 정규 URL 통일',
  },
  {
    from: '/features/ai-dev',
    to: '/features/ai-development',
    reason: 'AI 기능 개발 정규 URL 통일',
  },
];

/**
 * 운영 서버 절대 보호 경로 (SPA 라우터 / Rewrite 규칙이 절대 가로채면 안 되는 경로)
 */
export const PROTECTED_PRODUCTION_PATHS = [
  '/community',
  '/community/*',
  '/bbs/*',
  '/adm/*',
  '/data/*',
  '/plugin/*',
  '/extend/*',
  '/lib/*',
  '/theme/*',
] as const;
