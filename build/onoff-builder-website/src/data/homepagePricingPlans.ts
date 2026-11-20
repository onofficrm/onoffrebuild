import { CORE_CAPABILITIES, OPERATIONAL_STATUS_META, type CoreCapabilitySlug } from './platformCapabilities';

export type HomepagePlanId = 'starter' | 'business' | 'premium';

export interface HomepagePlanFeature {
  slug?: CoreCapabilitySlug;
  label: string;
  /** 카드·비교표에 표시할 운영 상태 (미출시 기능은 연동 준비 중 등) */
  statusNote: string;
}

export interface HomepagePlan {
  id: HomepagePlanId;
  name: string;
  subtitle: string;
  priceLabel: string;
  priceAmount: number;
  description: string;
  pointLabel: string;
  pointAmount: number;
  ctaLabel: string;
  contactPlanQuery: HomepagePlanId;
  highlighted?: boolean;
  features: HomepagePlanFeature[];
}

function cap(slug: CoreCapabilitySlug) {
  return CORE_CAPABILITIES.find((c) => c.slug === slug);
}

function statusNoteForSlug(slug: CoreCapabilitySlug): string {
  const item = cap(slug);
  if (!item) return '';
  const meta = OPERATIONAL_STATUS_META[item.operationalStatus];
  if (item.operationalStatus === 'integration_in_progress') {
    return meta.shortLabel;
  }
  if (slug === 'ai-dev') {
    return '프로젝트별 견적';
  }
  if (slug === 'easy-edit') {
    return '운영 연계 제공';
  }
  return meta.shortLabel;
}

function featureRow(slug: CoreCapabilitySlug, label: string): HomepagePlanFeature {
  return { slug, label, statusNote: statusNoteForSlug(slug) };
}

export const HOMEPAGE_COMMON_INCLUDES = [
  'AI 기반 홈페이지 제작',
  'PC·태블릿·모바일 반응형 최적화',
  '기본 SEO 구조 및 문의·상담 연결',
  '쉬운 홈페이지 수정(자연어 요청·검수 후 반영)',
] as const;

export const HOMEPAGE_PRICING_PLANS: HomepagePlan[] = [
  {
    id: 'starter',
    name: 'STARTER',
    subtitle: '홈페이지 제작형',
    priceLabel: '150만 원',
    priceAmount: 1_500_000,
    description: '사업에 필요한 홈페이지를 만들고, 쉽고 편하게 수정·관리하세요.',
    pointLabel: '마케팅 서비스 포인트 30만 원 제공',
    pointAmount: 300_000,
    ctaLabel: '150만 원 상품 상담하기',
    contactPlanQuery: 'starter',
    features: [
      featureRow('easy-edit', '쉬운 홈페이지 수정'),
      featureRow('ai-dev', 'AI 개발'),
    ],
  },
  {
    id: 'business',
    name: 'BUSINESS',
    subtitle: '콘텐츠 자동화형',
    priceLabel: '200만 원',
    priceAmount: 2_000_000,
    description: '기본 홈페이지 기능에 콘텐츠 발행과 댓글 운영 자동화를 더하세요.',
    pointLabel: '마케팅 서비스 포인트 70만 원 제공',
    pointAmount: 700_000,
    ctaLabel: '200만 원 상품 상담하기',
    contactPlanQuery: 'business',
    features: [
      { label: 'STARTER 전체 기능', statusNote: '' },
      featureRow('routine', '루틴 자동발행'),
      featureRow('auto-comment', '자동 댓글'),
    ],
  },
  {
    id: 'premium',
    name: 'PREMIUM',
    subtitle: '마케팅 자동화형',
    priceLabel: '300만 원',
    priceAmount: 3_000_000,
    description: '콘텐츠 운영을 넘어 고객 관리와 SNS 배포까지 연결하세요.',
    pointLabel: '마케팅 서비스 포인트 120만 원 제공',
    pointAmount: 1_200_000,
    ctaLabel: '300만 원 상품 상담하기',
    contactPlanQuery: 'premium',
    highlighted: true,
    features: [
      { label: 'BUSINESS 전체 기능', statusNote: '' },
      featureRow('stepmail', '스텝메일'),
      featureRow('sns-marketing', 'SNS 자동배포'),
    ],
  },
];

export type PlanComparisonRowId =
  | 'quality'
  | 'easy-edit'
  | 'ai-dev'
  | 'routine'
  | 'auto-comment'
  | 'stepmail'
  | 'sns'
  | 'points';

export interface PlanComparisonRow {
  id: PlanComparisonRowId;
  label: string;
  starter: string;
  business: string;
  premium: string;
  footnote?: string;
}

export const HOMEPAGE_PLAN_COMPARISON: PlanComparisonRow[] = [
  {
    id: 'quality',
    label: 'AI 제작 · 반응형 · 기본 SEO',
    starter: '동일 제공',
    business: '동일 제공',
    premium: '동일 제공',
  },
  {
    id: 'easy-edit',
    label: '쉬운 홈페이지 수정',
    starter: '포함',
    business: '포함',
    premium: '포함',
    footnote: statusNoteForSlug('easy-edit'),
  },
  {
    id: 'ai-dev',
    label: 'AI 개발',
    starter: '포함',
    business: '포함',
    premium: '포함',
    footnote: statusNoteForSlug('ai-dev'),
  },
  {
    id: 'routine',
    label: '루틴 자동발행',
    starter: '—',
    business: `포함 · ${statusNoteForSlug('routine')}`,
    premium: `포함 · ${statusNoteForSlug('routine')}`,
  },
  {
    id: 'auto-comment',
    label: '자동 댓글',
    starter: '—',
    business: `포함 · ${statusNoteForSlug('auto-comment')}`,
    premium: `포함 · ${statusNoteForSlug('auto-comment')}`,
  },
  {
    id: 'stepmail',
    label: '스텝메일',
    starter: '—',
    business: '—',
    premium: `포함 · ${statusNoteForSlug('stepmail')}`,
  },
  {
    id: 'sns',
    label: 'SNS 자동배포',
    starter: '—',
    business: '—',
    premium: `포함 · ${statusNoteForSlug('sns-marketing')}`,
  },
  {
    id: 'points',
    label: '서비스 포인트 제공 총액',
    starter: '30만 원',
    business: '70만 원',
    premium: '120만 원',
  },
];

export const HOMEPAGE_PLAN_FAQ = [
  {
    question: '세 요금제의 홈페이지 디자인·모바일 최적화 품질은 동일한가요?',
    answer:
      '네. AI 기반 제작, 반응형 모바일 최적화, 기본 SEO 구조는 모든 요금제에서 동일한 기준으로 제공합니다. 차등은 마케팅 자동화 기능 범위와 서비스 포인트 총액입니다.',
  },
  {
    question: '서비스 포인트는 어디에 사용할 수 있나요?',
    answer:
      '각 상품에 안내된 총액(30만·70만·120만 원)의 마케팅 서비스 포인트가 제공됩니다. 사용 가능한 서비스·차감 기준·유효기간 등 세부 정책은 운영 약관 및 상담 시 확인이 필요합니다.',
  },
  {
    question: 'BUSINESS·PREMIUM에 하위 기능이 모두 포함되나요?',
    answer:
      '네. BUSINESS는 STARTER 기능 전체에 루틴 자동발행·자동 댓글을, PREMIUM은 BUSINESS 전체에 스텝메일·SNS 배포 범위를 추가한 구성입니다.',
  },
  {
    question: '자동화 기능은 지금 바로 모두 사용할 수 있나요?',
    answer:
      '쉬운 홈페이지 수정은 운영 채널을 통한 요청·검수 후 반영으로 제공 중입니다. 루틴·자동 댓글·스텝메일·SNS 자동배포는 ONOFF Builder 플랫폼 직접 연동이 준비 중이며, 현재는 기획·검수·운영 연계 범위로 상담합니다.',
  },
  {
    question: '월 유지관리비·부가세·포인트 실구매가 계산은 어떻게 되나요?',
    answer:
      '표시된 금액은 홈페이지 제작비이며, 월 운영관리비·부가세·맞춤 개발비는 별도 견적입니다. 포인트는 제공 총액 안내이며 “제작비 − 포인트 = 실구매가” 식의 할인 계산을 표기하지 않습니다.',
  },
] as const;

export function planContactPath(planId: HomepagePlanId): string {
  return `/contact?service=website&plan=${planId}`;
}