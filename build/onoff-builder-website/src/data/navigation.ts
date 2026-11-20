export const SITE_DOMAIN = 'onoff.icrm.co.kr';
export const COMMUNITY_URL = '/community';

/**
 * 기존 운영 서비스 슬러그 (모든 기존 URL 및 쿼리 파라미터 하위 호환 유지)
 */
export type ServiceSlug =
  | 'website'
  | 'management'
  | 'seo'
  | 'geo'
  | 'backlink'
  | 'traffic'
  | 'domain'
  | 'content';

/**
 * 신규 브랜드 중심 6대 핵심 기능 슬러그
 * 1. routine — 루틴 (콘텐츠 자동발행)
 * 2. stepmail — 스텝메일 (단계별 이메일 자동화)
 * 3. sns-marketing — SNS 마케팅 (SNS 배포·예약·관리)
 * 4. easy-edit — 쉬운 홈페이지 수정 (자연어로 수정 요청)
 * 5. ai-dev — AI 기능 개발 (AI 지원 맞춤 기능 개발)
 */
export type CoreFeatureSlug =
  | 'routine'
  | 'stepmail'
  | 'sns-marketing'
  | 'auto-comment'
  | 'easy-edit'
  | 'ai-dev';

/**
 * 상담 폼(?service=...) 및 전체 서비스 탐색에서 허용되는 통합 슬러그
 */
export type InquiryServiceSlug = ServiceSlug | CoreFeatureSlug;

export interface ServiceNavItem {
  slug: ServiceSlug;
  path: string;
  label: string;
  shortDesc: string;
  group: 'core' | 'extension';
}

export interface CoreFeatureNavItem {
  slug: CoreFeatureSlug;
  path: string;
  label: string;
  subtitle: string;
  shortDesc: string;
  group: 'automation' | 'editing_ai';
}

export const FEATURES_OVERVIEW_PATH = '/features';

/**
 * 기존 서비스 내비게이션 항목 (모든 기존 운영 URL 보존)
 */
export const SERVICE_NAV_ITEMS: ServiceNavItem[] = [
  {
    slug: 'website',
    path: '/website',
    label: '홈페이지 제작',
    shortDesc: '기업 목적에 맞춘 기획·디자인·퍼블리싱 전담 구축',
    group: 'core',
  },
  {
    slug: 'management',
    path: '/management',
    label: '운영관리',
    shortDesc: '호스팅·배포·수정 요청 처리·유지보수 일원화',
    group: 'core',
  },
  {
    slug: 'seo',
    path: '/services/seo',
    label: 'SEO',
    shortDesc: '검색엔진 친화적 구조 설계와 기술적 최적화',
    group: 'extension',
  },
  {
    slug: 'geo',
    path: '/geo',
    label: 'GEO',
    shortDesc: '생성형 AI 검색 환경을 고려한 정보 구조화',
    group: 'extension',
  },
  {
    slug: 'backlink',
    path: '/backlink',
    label: 'BACKLINK',
    shortDesc: '웹사이트 신뢰도 강화를 위한 외부 연계 전략',
    group: 'extension',
  },
  {
    slug: 'traffic',
    path: '/traffic',
    label: 'TRAFFIC',
    shortDesc: '비즈니스 타깃에 맞춘 유입 채널 연계 운영',
    group: 'extension',
  },
  {
    slug: 'domain',
    path: '/domain',
    label: 'DOMAIN',
    shortDesc: '브랜드 도메인 구성, DNS 설정 및 SSL 연동',
    group: 'extension',
  },
  {
    slug: 'content',
    path: '/content',
    label: 'AI 콘텐츠',
    shortDesc: '검색과 상담 전환을 고려한 체계적 콘텐츠 제작',
    group: 'extension',
  },
];

/**
 * 기본 기능 드롭다운 및 푸터 항목 (6대 핵심 기능)
 */
export const CORE_FEATURE_NAV_ITEMS: CoreFeatureNavItem[] = [
  {
    slug: 'routine',
    path: '/features/routine',
    label: '루틴 자동발행',
    subtitle: '콘텐츠 자동발행',
    shortDesc: '정해진 주기와 검수 흐름으로 홈페이지 콘텐츠를 꾸준히 발행',
    group: 'automation',
  },
  {
    slug: 'stepmail',
    path: '/features/step-mail',
    label: '스텝메일',
    subtitle: '단계별 이메일 자동화',
    shortDesc: '문의·유입 고객에게 시나리오별 이메일을 단계적으로 자동 발송',
    group: 'automation',
  },
  {
    slug: 'sns-marketing',
    path: '/features/sns-poster',
    label: 'SNS 마케팅',
    subtitle: 'SNS 배포·예약·관리',
    shortDesc: '홈페이지 콘텐츠와 연계한 SNS 배포·예약·채널 운영 관리',
    group: 'automation',
  },
  {
    slug: 'auto-comment',
    path: '/features/auto-comment',
    label: '자동 댓글',
    subtitle: 'AI 댓글 응대·관리',
    shortDesc: '홈페이지 게시글 댓글에 AI 답변 초안·스팸 분류·승인 후 게시',
    group: 'automation',
  },
  {
    slug: 'easy-edit',
    path: '/features/easy-edit',
    label: '쉬운 홈페이지 수정',
    subtitle: '자연어로 수정 요청',
    shortDesc: '편집기 대신 자연어로 요청하면 검수 후 안전하게 반영',
    group: 'editing_ai',
  },
  {
    slug: 'ai-dev',
    path: '/features/ai-development',
    label: 'AI 기능 개발',
    subtitle: 'AI 지원 맞춤 기능 개발',
    shortDesc: 'AI 지원 개발과 엔지니어 검수로 업종 맞춤 기능 신속 구현',
    group: 'editing_ai',
  },
];

export interface TopNavLink {
  label: string;
  path: string;
  external?: boolean;
}

export const PRIMARY_NAV_LINKS: TopNavLink[] = [
  { label: '활용사례', path: '/use-cases' },
  { label: '제작사례', path: '/portfolio' },
  { label: '요금안내', path: '/pricing' },
  { label: '커뮤니티', path: COMMUNITY_URL },
];
