export const SITE_ORIGIN = 'https://onoff.icrm.co.kr';
export const SITE_NAME = 'ONOFF Builder 2.0';

export interface SeoFaqItem {
  question: string;
  answer: string;
}

export interface SeoInternalLink {
  label: string;
  path: string;
}

export interface RouteSeoMeta {
  path: string;
  title: string;
  description: string;
  canonical: string;
  ogType: 'website';
  robots: 'index, follow' | 'noindex, nofollow';
  changefreq?: 'weekly' | 'monthly';
  priority?: string;
  keywords?: string[];
  internalLinks?: SeoInternalLink[];
  faqSchema?: SeoFaqItem[];
}

/**
 * 기존 운영 13개 정규 라우트 SEO 메타데이터
 * (기존 운영 URL 및 canonical 100% 보존)
 */
export const ROUTE_SEO_LIST: RouteSeoMeta[] = [
  {
    path: '/',
    title: 'ONOFF Builder 2.0 | 홈페이지 · 3대 자동화 · 자동 댓글 · 쉬운 수정 · AI 기능 개발',
    description:
      '루틴·스텝메일·오토포스터(SNS 마케팅)·자동 댓글 — ONOFF Builder 기본 제공(별도 솔루션 구독료 0원). 홈페이지 제작부터 쉬운 수정, AI 기능 개발까지 하나의 플랫폼으로 연결합니다.',
    canonical: `${SITE_ORIGIN}/`,
    ogType: 'website',
    robots: 'index, follow',
    changefreq: 'weekly',
    priority: '1.0',
    keywords: [
      'ONOFF Builder',
      '홈페이지 제작',
      '루틴 자동발행',
      '스텝메일',
      '오토포스터',
      'SNS 마케팅',
      '자동 댓글',
      '쉬운 홈페이지 수정',
      'AI 기능 개발',
    ],
    internalLinks: [
      { label: '기본 기능 전체 보기', path: '/features' },
      { label: '루틴 자동발행', path: '/features/routine' },
      { label: '스텝메일', path: '/features/step-mail' },
      { label: '오토포스터 (SNS 마케팅)', path: '/features/sns-poster' },
      { label: '자동 댓글', path: '/features/auto-comment' },
      { label: '요금안내', path: '/pricing' },
    ],
  },
  {
    path: '/website',
    title: '홈페이지 제작 | ONOFF Builder 2.0',
    description:
      '브랜드 맞춤 기획과 디자인, PC·모바일 반응형, 게시판·자료실·문의 폼, 자동화·AI 기능 확장을 고려한 관리형 홈페이지 제작 서비스입니다.',
    canonical: `${SITE_ORIGIN}/website`,
    ogType: 'website',
    robots: 'index, follow',
    changefreq: 'monthly',
    priority: '0.9',
  },
  {
    path: '/management',
    title: '운영관리 | ONOFF Builder 2.0',
    description:
      '오픈 이후에도 호스팅, SSL 보안, 자연어 기반 쉬운 수정 요청, 장애 점검과 페이지 확장을 전담 운영자가 지속적으로 관리합니다.',
    canonical: `${SITE_ORIGIN}/management`,
    ogType: 'website',
    robots: 'index, follow',
    changefreq: 'monthly',
    priority: '0.9',
  },
  {
    path: '/services/seo',
    title: 'SEO 최적화 | 온오프마케팅 별도 서비스 · ONOFF Builder 2.0',
    description:
      '검색엔진 친화적인 웹사이트 구조, 타이틀·메타정보, 모바일 최적화, 내부링크 및 콘텐츠 전략으로 검색 유입 기반을 설계하는 별도 전문 서비스입니다.',
    canonical: `${SITE_ORIGIN}/services/seo`,
    ogType: 'website',
    robots: 'index, follow',
    changefreq: 'monthly',
    priority: '0.8',
  },
  {
    path: '/geo',
    title: 'GEO 최적화 | 온오프마케팅 별도 서비스 · ONOFF Builder 2.0',
    description:
      'AI 검색 시대에 대비해 GEO Analyzer 진단, 콘텐츠·사이트 구조 분석, 개선 방향 제안 및 재측정까지 지원하는 별도 전문 서비스입니다.',
    canonical: `${SITE_ORIGIN}/geo`,
    ogType: 'website',
    robots: 'index, follow',
    changefreq: 'monthly',
    priority: '0.8',
  },
  {
    path: '/backlink',
    title: 'BACKLINK 전략 | 온오프마케팅 별도 서비스 · ONOFF Builder 2.0',
    description:
      '사전 사이트 분석, 업종 맥락에 맞는 링크 전략, 합리적인 예산 검토와 캠페인 안내를 통해 건강한 외부 참조 구조를 설계하는 별도 전문 서비스입니다.',
    canonical: `${SITE_ORIGIN}/backlink`,
    ogType: 'website',
    robots: 'index, follow',
    changefreq: 'monthly',
    priority: '0.7',
  },
  {
    path: '/traffic',
    title: 'TRAFFIC 유입 전략 | 온오프마케팅 별도 서비스 · ONOFF Builder 2.0',
    description:
      '웹사이트 유입 목적과 운영 방식, 활용 조건과 유의사항을 명확히 정리해 홈페이지 전환 구조와 연계하는 별도 트래픽 서비스입니다.',
    canonical: `${SITE_ORIGIN}/traffic`,
    ogType: 'website',
    robots: 'index, follow',
    changefreq: 'monthly',
    priority: '0.7',
  },
  {
    path: '/domain',
    title: 'DOMAIN 연결·전략 | 온오프마케팅 별도 서비스 · ONOFF Builder 2.0',
    description:
      '브랜드 도메인 선택, 기존 도메인 분석 및 무중단 DNS·메일 보존 연결, HTTPS SSL 설정과 검색 고려사항까지 지원하는 서비스입니다.',
    canonical: `${SITE_ORIGIN}/domain`,
    ogType: 'website',
    robots: 'index, follow',
    changefreq: 'monthly',
    priority: '0.7',
  },
  {
    path: '/content',
    title: 'AI 콘텐츠 운영 | 온오프마케팅 별도 서비스 · ONOFF Builder 2.0',
    description:
      '콘텐츠 기획, AI 초안 작성, 담당자 검수 및 발행 워크플로로 브랜드 톤을 유지하면서 콘텐츠 운영 시간을 줄입니다.',
    canonical: `${SITE_ORIGIN}/content`,
    ogType: 'website',
    robots: 'index, follow',
    changefreq: 'monthly',
    priority: '0.7',
  },
  {
    path: '/use-cases',
    title: '업종별 활용사례 | ONOFF Builder 2.0',
    description:
      '병원·전문직, 인테리어·시공, 기업·소상공인, 교육·컨설팅, 커뮤니티, 관광·지역정보 플랫폼까지 업종별 홈페이지 구성과 운영 방식을 안내합니다.',
    canonical: `${SITE_ORIGIN}/use-cases`,
    ogType: 'website',
    robots: 'index, follow',
    changefreq: 'monthly',
    priority: '0.8',
  },
  {
    path: '/portfolio',
    title: '제작사례 | ONOFF Builder 2.0',
    description:
      'ONOFF Builder의 기업, 전문직, 커뮤니티, 랜딩페이지 디자인 기준과 콘셉트 예시 및 공개 협의 완료 제작사례를 확인하세요.',
    canonical: `${SITE_ORIGIN}/portfolio`,
    ogType: 'website',
    robots: 'index, follow',
    changefreq: 'weekly',
    priority: '0.8',
  },
  {
    path: '/pricing',
    title: '요금안내 — 홈페이지와 함께 기본 제공하는 강력한 운영 도구 | ONOFF Builder 2.0',
    description:
      '온오프빌더 고객에게 루틴·스텝메일·오토포스터(SNS 마케팅) 자체 기능은 ONOFF Builder 기본 제공(별도 솔루션 구독료 0원)이며, 홈페이지 초기 제작비·월 홈페이지 운영관리비 및 제3자 발송·유료 SNS API 실비·대행·사용량 정책·맞춤 개발비를 투명하게 구분해 안내합니다.',
    canonical: `${SITE_ORIGIN}/pricing`,
    ogType: 'website',
    robots: 'index, follow',
    changefreq: 'monthly',
    priority: '0.85',
    keywords: ['ONOFF Builder 요금', '홈페이지 제작 견적', '별도 솔루션 구독료 0원', '월 홈페이지 운영관리비'],
    internalLinks: [
      { label: '기본 기능 안내', path: '/features' },
      { label: '루틴 자동발행', path: '/features/routine' },
      { label: '스텝메일', path: '/features/step-mail' },
      { label: '오토포스터 (SNS 마케팅)', path: '/features/sns-poster' },
      { label: '상담하기', path: '/contact' },
    ],
    faqSchema: [
      {
        question: '루틴·스텝메일·오토포스터(SNS 마케팅)는 홈페이지에 기본 제공되나요?',
        answer:
          '네. 온오프빌더 고객에게 루틴·스텝메일·오토포스터(SNS 마케팅) 자체 기능은 ONOFF Builder 기본 제공이며 별도 솔루션 구독료는 0원입니다. 월 홈페이지 운영관리비와는 서로 다른 항목이며, 플랫폼 직접 자동 연동은 현재 연동 준비 중입니다. 제3자 발송 실비, 유료 SNS API, 대행, 사용량 정책, 맞춤 기능 개발비는 별도 구분됩니다.',
      },
      {
        question: '확정된 정액 요금표 대신 개별 견적을 산정하는 이유는 무엇인가요?',
        answer:
          '업종, 페이지 구성 규모, 월 홈페이지 운영관리 범위, 맞춤 기능 개발 여부가 기업마다 다르기 때문입니다. 불필요한 항목을 묶지 않고 필요한 구성만 항목별 견적으로 안내합니다.',
      },
    ],
  },
  {
    path: '/community',
    title: '커뮤니티 — 공지 · FAQ · 유튜브 | ONOFF Builder 2.0',
    description:
      'ONOFF Builder 공지사항·자주 묻는 질문·유튜브 콘텐츠 게시판으로 연결됩니다. 기존 GNUBoard 데이터와 권한은 그대로 유지됩니다.',
    canonical: `${SITE_ORIGIN}/community`,
    ogType: 'website',
    robots: 'index, follow',
    changefreq: 'weekly',
    priority: '0.75',
    keywords: ['ONOFF Builder 커뮤니티', '공지사항', 'FAQ', '유튜브'],
    internalLinks: [
      { label: '공지사항', path: '/notice' },
      { label: '자주 묻는 질문', path: '/faq' },
      { label: '상담하기', path: '/contact' },
    ],
  },
  {
    path: '/contact',
    title: '상담하기 — 홈페이지 · 기본 기능 · 카카오·화상 문의 | ONOFF Builder 2.0',
    description:
      '카카오톡 즉시 상담과 Google Meet 1:1 화상 상담 예약을 이용할 수 있습니다. 홈페이지 제작·운영, 루틴·스텝메일·SNS, 쉬운 수정, AI 기능 개발 문의를 남겨 주세요.',
    canonical: `${SITE_ORIGIN}/contact`,
    ogType: 'website',
    robots: 'index, follow',
    changefreq: 'monthly',
    priority: '0.9',
    keywords: [
      '홈페이지 상담',
      'ONOFF Builder 문의',
      'Google Meet 화상 상담',
      '카카오톡 상담',
      '맞춤 기능 개발 상담',
    ],
    internalLinks: [
      { label: '요금안내', path: '/pricing' },
      { label: '기본 기능 전체 보기', path: '/features' },
      { label: '업종별 활용사례', path: '/use-cases' },
    ],
  },
];

/**
 * 기본 기능 개요(/features) 및 6대 핵심 기능 상세 라우트 SEO·Canonical·내부링크·FAQ 구조화 데이터
 */
export const CORE_FEATURE_SEO_LIST: RouteSeoMeta[] = [
  {
    path: '/features',
    title: '기본 기능 — 루틴 · 스텝메일 · 오토포스터 · 자동 댓글 · 쉬운 수정 · AI 기능 개발 | ONOFF Builder 2.0',
    description:
      'ONOFF Builder 기본 제공(추가 솔루션 구독료 0원) 스텝메일·오토포스터(SNS 마케팅)·자동 댓글과 루틴 자동발행, 쉬운 홈페이지 수정, AI 기능 개발의 제공 정책 및 현재 운영 상태를 투명하게 확인하세요.',
    canonical: `${SITE_ORIGIN}/features`,
    ogType: 'website',
    robots: 'index, follow',
    changefreq: 'weekly',
    priority: '0.9',
    keywords: ['ONOFF Builder 기본 기능', '루틴 자동발행', '스텝메일', '오토포스터', '자동 댓글', '추가 솔루션 구독료 0원', '쉬운 수정', 'AI 기능 개발'],
    internalLinks: [
      { label: '루틴 자동발행', path: '/features/routine' },
      { label: '스텝메일', path: '/features/step-mail' },
      { label: '오토포스터 (SNS 마케팅)', path: '/features/sns-poster' },
      { label: '자동 댓글', path: '/features/auto-comment' },
      { label: '쉬운 홈페이지 수정', path: '/features/easy-edit' },
      { label: 'AI 기능 개발', path: '/features/ai-development' },
      { label: '요금안내', path: '/pricing' },
    ],
    faqSchema: [
      {
        question: 'ONOFF Builder의 기본 기능 6가지는 무엇인가요?',
        answer:
          '루틴 자동발행, 스텝메일, SNS 마케팅 3대 운영 자동화 도구와 홈페이지 댓글 AI 응대(자동 댓글), 자연어 기반 쉬운 홈페이지 수정, AI 지원 맞춤 기능 개발로 구성됩니다. 각 기능의 실제 운영 검증 상태와 제공 정책은 상세 페이지에서 구분해 안내합니다.',
      },
      {
        question: '기존 SEO, GEO, BACKLINK 등의 서비스와는 어떻게 다른가요?',
        answer:
          '기존 SEO, GEO, BACKLINK, TRAFFIC, DOMAIN, AI 콘텐츠는 온오프마케팅의 별도 전문 서비스로 유지되며, 홈페이지 기본 기능과 목적에 맞게 선택 연계할 수 있습니다.',
      },
    ],
  },
  {
    path: '/features/routine',
    title: '루틴 자동발행 — 꾸준한 콘텐츠 운영을 루틴으로 | ONOFF Builder 2.0',
    description:
      '주제 및 규칙 설정, 콘텐츠 초안 생성, 담당자 검수, 예약 및 발행, 결과 확인까지 홈페이지 콘텐츠 운영을 체계화하는 ONOFF Builder 루틴 안내입니다.',
    canonical: `${SITE_ORIGIN}/features/routine`,
    ogType: 'website',
    robots: 'index, follow',
    changefreq: 'monthly',
    priority: '0.85',
    keywords: ['루틴 자동발행', '홈페이지 콘텐츠 운영', '콘텐츠 캘린더', '담당자 검수 발행'],
    internalLinks: [
      { label: '스텝메일', path: '/features/step-mail' },
      { label: 'SNS 마케팅', path: '/features/sns-poster' },
      { label: '홈페이지 제작', path: '/website' },
      { label: 'AI 콘텐츠 (별도 서비스)', path: '/content' },
      { label: '요금안내', path: '/pricing' },
    ],
    faqSchema: [
      {
        question: '루틴 자동발행 대시보드는 실제 서버 발행과 연결되어 있나요?',
        answer:
          '페이지 내 대시보드는 콘텐츠 캘린더, 검수 대기, 발행 상태, 진행 이력 흐름을 미리 확인하는 시연 화면입니다. 플랫폼 직접 자동발행 연동은 현재 준비 중이며, 현행은 기획·AI 초안·담당자 검수 후 운영관리 연계 반영으로 상담 가능합니다.',
      },
      {
        question: '담당자 검수 없이 글이 자동으로 게시될 위험은 없나요?',
        answer:
          '무검수 자동 발행을 지양합니다. 5단계 흐름 중 담당자 사실 확인 및 승인 단계를 거친 원고만 예약·발행 대상으로 확정하는 것을 원칙으로 합니다.',
      },
    ],
  },
  {
    path: '/features/step-mail',
    title: '스텝메일 — 고객을 놓치지 않는 단계별 자동 이메일 | ONOFF Builder 2.0',
    description:
      'ONOFF Builder 기본 제공(별도 솔루션 구독료 0원). 외부 이메일 전문 도구를 따로 구독할 필요 없이 홈페이지 문의와 연결된 단계별 자동 이메일 흐름과 Mailchimp 비교를 안내합니다.',
    canonical: `${SITE_ORIGIN}/features/step-mail`,
    ogType: 'website',
    robots: 'index, follow',
    changefreq: 'monthly',
    priority: '0.85',
    keywords: ['스텝메일', '단계별 자동 이메일', 'ONOFF Builder 기본 제공', 'Mailchimp 비교'],
    internalLinks: [
      { label: '루틴 자동발행', path: '/features/routine' },
      { label: 'SNS 마케팅', path: '/features/sns-poster' },
      { label: 'DOMAIN (별도 서비스)', path: '/domain' },
      { label: '홈페이지 제작', path: '/website' },
      { label: '요금안내', path: '/pricing' },
    ],
    faqSchema: [
      {
        question: 'Mailchimp의 모든 마케팅 기능을 대체하는 제품인가요?',
        answer:
          '아닙니다. Mailchimp는 대규모 뉴스레터와 다변량 캠페인에 강한 전문 제품이며, ONOFF Builder 스텝메일은 별도 솔루션 구독료 0원으로 홈페이지 문의와 연결된 핵심 단계별 후속 이메일 운영을 통합하는 데 집중합니다.',
      },
      {
        question: '실제 메일 발송, 수신거부, 발신 인증과 별도 비용 구분은 어떻게 되나요?',
        answer:
          '자체 스텝메일 기능은 ONOFF Builder 기본 제공(별도 솔루션 구독료 0원) 정책이지만, 플랫폼 내장 자동 발송·수신거부·발신 인증 연동은 현재 준비 중입니다. 제3자 발송·API 실비, 기준 초과 발송량 비용, 맞춤 기능 개발비는 별도 구분됩니다.',
      },
    ],
  },
  {
    path: '/features/sns-poster',
    title: '오토포스터 (SNS 마케팅) — FS Poster 같은 SNS 자동화, 별도 솔루션 구독료 없이 | ONOFF Builder 2.0',
    description:
      'ONOFF Builder 기본 제공(별도 솔루션 구독료 0원). 외부 SNS 전문 도구를 따로 구독할 필요 없이 홈페이지 게시글과 SNS 배포·예약 흐름을 연결하는 오토포스터(SNS 마케팅)와 FS Poster 비교 안내입니다.',
    canonical: `${SITE_ORIGIN}/features/sns-poster`,
    ogType: 'website',
    robots: 'index, follow',
    changefreq: 'monthly',
    priority: '0.85',
    keywords: ['SNS 마케팅', '오토포스터', 'ONOFF Builder 기본 제공', 'FS Poster 비교'],
    internalLinks: [
      { label: '루틴 자동발행', path: '/features/routine' },
      { label: '스텝메일', path: '/features/step-mail' },
      { label: 'TRAFFIC (별도 서비스)', path: '/traffic' },
      { label: '홈페이지 제작', path: '/website' },
      { label: '요금안내', path: '/pricing' },
    ],
    faqSchema: [
      {
        question: '외부 SNS 채널 자동 게시는 지금 바로 활성화되어 있나요?',
        answer:
          '자체 오토포스터(SNS 마케팅) 기능은 ONOFF Builder 기본 제공(별도 솔루션 구독료 0원) 정책이지만, 실제 연동과 외부 발행이 검증되지 않은 채널은 활성 기능으로 표시하지 않습니다. 현재 외부 SNS 플랫폼 API 직접 자동 게시는 연동 준비 중이며, 제3자 유료 API 실비와 맞춤 개발비는 별도 구분됩니다.',
      },
      {
        question: 'FS Poster와는 어떤 차이가 있나요?',
        answer:
          'FS Poster는 WordPress 기반 SNS 자동 게시 전문 플러그인이며, ONOFF Builder는 별도 솔루션 구독료 0원으로 플러그인 유지보수 부담 없이 관리형 홈페이지와 콘텐츠·SNS 운영을 하나의 흐름으로 통합 관리하는 데 집중합니다.',
      },
    ],
  },
  {
    path: '/features/auto-comment',
    title: '자동 댓글 — 홈페이지 댓글에 AI가 답변 초안을, 담당자가 승인을 | ONOFF Builder 2.0',
    description:
      'ONOFF Builder 기본 제공(별도 솔루션 구독료 0원). 홈페이지 게시글 댓글을 질문·상담·스팸으로 분류하고 브랜드 톤 AI 답변 초안을 담당자 승인 후 게시하는 자동 댓글 응대 기능 안내입니다.',
    canonical: `${SITE_ORIGIN}/features/auto-comment`,
    ogType: 'website',
    robots: 'index, follow',
    changefreq: 'monthly',
    priority: '0.85',
    keywords: ['자동 댓글', '댓글 자동 응대', 'AI 댓글 답변', '홈페이지 댓글 관리', '스팸 댓글 필터', 'ONOFF Builder 기본 제공'],
    internalLinks: [
      { label: '루틴 자동발행', path: '/features/routine' },
      { label: '스텝메일', path: '/features/step-mail' },
      { label: '오토포스터 (SNS 마케팅)', path: '/features/sns-poster' },
      { label: '운영관리 (서비스)', path: '/management' },
      { label: '요금안내', path: '/pricing' },
    ],
    faqSchema: [
      {
        question: '다른 블로그나 카페, SNS에 홍보 댓글을 자동으로 달아 주는 기능인가요?',
        answer:
          '아닙니다. 자동 댓글은 내 홈페이지 게시글에 달린 고객 댓글에 응대하는 기능입니다. 타 사이트·블로그·카페·SNS에 홍보성 댓글을 대량 작성하는 기능은 제공하지 않습니다.',
      },
      {
        question: 'AI가 만든 답변이 검수 없이 바로 게시되나요?',
        answer:
          '무검수 자동 게시를 지양합니다. AI는 응대 규칙에 맞춘 답변 초안과 분류만 준비하고, 담당자가 확인·수정·승인한 답변만 게시하는 것을 원칙으로 합니다. 댓글 감지·승인 게시 플랫폼 연동은 현재 준비 중입니다.',
      },
      {
        question: '별도 비용이 드나요?',
        answer:
          'ONOFF Builder 기본 제공 기능으로 별도 솔루션 구독료는 0원입니다. 월 홈페이지 운영관리비, AI 사용량 정책 초과분, 답변 검수 대행, 맞춤 기능 개발비는 별도로 구분됩니다.',
      },
    ],
  },
  {
    path: '/features/easy-edit',
    title: '쉬운 홈페이지 수정 — 수정하고 싶은 내용을 말하면 홈페이지가 바뀝니다 | ONOFF Builder 2.0',
    description:
      '자연어로 수정 요청을 작성하면 운영팀이 AI로 변경 내용을 분석해 수정·미리보기·검수 후 안전하게 배포하는 ONOFF Builder 쉬운 홈페이지 수정 안내입니다.',
    canonical: `${SITE_ORIGIN}/features/easy-edit`,
    ogType: 'website',
    robots: 'index, follow',
    changefreq: 'monthly',
    priority: '0.85',
    keywords: ['쉬운 홈페이지 수정', '자연어 수정 요청', '관리형 홈페이지 유지보수'],
    internalLinks: [
      { label: 'AI 기능 개발', path: '/features/ai-development' },
      { label: '운영관리 (서비스)', path: '/management' },
      { label: '루틴 자동발행', path: '/features/routine' },
      { label: '요금안내', path: '/pricing' },
    ],
    faqSchema: [
      {
        question: '수정 요청을 적으면 AI가 실시간으로 운영 서버를 바로 수정하나요?',
        answer:
          '아닙니다. 무검수 자동 덮어쓰기 대신 운영팀이 AI로 변경 내용을 분석·수정하고, 미리보기 확인과 고객 검수를 거친 뒤 실서비스에 안전하게 배포합니다.',
      },
      {
        question: '일상 수정과 별도 협의 작업은 어떻게 구분되나요?',
        answer:
          '기존 페이지 내 문구·연락처·공지 변경과 이미지 교체는 월 운영관리 플랜 협의 범위로 처리하며, 신규 페이지 대량 추가나 맞춤 기능 개발은 사전 범위·견적 협의로 진행합니다.',
      },
    ],
  },
  {
    path: '/features/ai-development',
    title: 'AI 기능 개발 — 생각한 기능을 말로 설명하세요 | ONOFF Builder 2.0',
    description:
      '견적 계산기, 예약 신청, 회원 전용 자료실 등 맞춤 기능을 고객 아이디어·AI 지원 설계·전문팀 개발·테스트·적용 절차와 명확한 범위 협의로 구현합니다.',
    canonical: `${SITE_ORIGIN}/features/ai-development`,
    ogType: 'website',
    robots: 'index, follow',
    changefreq: 'monthly',
    priority: '0.85',
    keywords: ['AI 기능 개발', '맞춤 기능 개발', '견적 계산기 개발', '예약 기능 개발', '회원 전용 자료실'],
    internalLinks: [
      { label: '쉬운 홈페이지 수정', path: '/features/easy-edit' },
      { label: '홈페이지 제작', path: '/website' },
      { label: '업종별 활용사례', path: '/use-cases' },
      { label: '요금안내', path: '/pricing' },
    ],
    faqSchema: [
      {
        question: 'AI 기능 개발은 즉시 자동 개발되거나 기본 구성에 무제한 포함되나요?',
        answer:
          '아닙니다. 즉시 무검수 자동 개발이나 기본 제공 범위가 아니며, 사전 범위·견적 협의를 거쳐 AI 지원 설계와 전문 개발팀의 구현·보안 테스트·고객 검수 후 안전하게 적용합니다.',
      },
      {
        question: '어떤 기능을 맞춤 개발로 의뢰할 수 있나요?',
        answer:
          '새로운 견적 계산기 추가, 예약 신청 기능 개발, 회원 전용 자료실 구축, 다국어·결제(PG)·기존 운영 시스템 연동 등을 사전 기술 검토 후 프로젝트별 개별 견적으로 진행합니다.',
      },
    ],
  },
];

export const NOT_FOUND_SEO: RouteSeoMeta = {
  path: '*',
  title: '페이지를 찾을 수 없습니다 | ONOFF Builder 2.0',
  description: '요청하신 페이지를 찾을 수 없습니다. ONOFF Builder 주요 서비스 메뉴를 이용해 주세요.',
  canonical: `${SITE_ORIGIN}/`,
  ogType: 'website',
  robots: 'noindex, nofollow',
};

/**
 * 구버전 신규 기능 별칭 경로 -> 정규 canonical 경로 매핑
 */
const SEO_PATH_ALIASES: Record<string, string> = {
  '/features/stepmail': '/features/step-mail',
  '/features/sns': '/features/sns-poster',
  '/features/ai-dev': '/features/ai-development',
  '/seo': '/services/seo',
};

const ROUTE_SEO_MAP = new Map<string, RouteSeoMeta>(
  [...ROUTE_SEO_LIST, ...CORE_FEATURE_SEO_LIST].map((item) => [item.path, item])
);

export function getRouteSeo(pathname: string): RouteSeoMeta {
  const normalized = pathname !== '/' && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  const canonicalPath = SEO_PATH_ALIASES[normalized] ?? normalized;
  return ROUTE_SEO_MAP.get(canonicalPath) ?? NOT_FOUND_SEO;
}

/**
 * Sitemap 생성 기준 전체 인덱싱 대상 목록 (19개 정규 라우트)
 */
export const ALL_INDEXABLE_SEO_ROUTES: RouteSeoMeta[] = [
  ...ROUTE_SEO_LIST,
  ...CORE_FEATURE_SEO_LIST,
];
