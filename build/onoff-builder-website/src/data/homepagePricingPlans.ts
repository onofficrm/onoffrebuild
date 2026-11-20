export type HomepagePlanId = 'starter' | 'business' | 'premium';

export interface HomepagePlan {
  id: HomepagePlanId;
  name: string;
  priceLabel: string;
  priceAmount: number;
  /** 카드용 짧은 한 줄 (고객 관점) */
  audienceDescription: string;
  /** 포인트 강조 표기 (예: 30만 원) */
  pointAmountLabel: string;
  pointAmount: number;
  ctaLabel: string;
  contactPlanQuery: HomepagePlanId;
  /** BUSINESS 등 시각적 강조 */
  highlighted?: boolean;
}

export const HOMEPAGE_QUALITY_NOTE =
  'AI 기반 디자인 · 모바일 최적화 · 기본 SEO는 모든 요금제에서 동일한 기준으로 제공합니다.';

export const HOMEPAGE_PRICING_PLANS: HomepagePlan[] = [
  {
    id: 'starter',
    name: 'STARTER',
    priceLabel: '150만 원',
    priceAmount: 1_500_000,
    pointAmountLabel: '30만 원',
    pointAmount: 300_000,
    audienceDescription: '홈페이지를 쉽고 편리하게 운영하고 싶은 사업자',
    ctaLabel: '150만 원 상품 상담하기',
    contactPlanQuery: 'starter',
  },
  {
    id: 'business',
    name: 'BUSINESS',
    priceLabel: '200만 원',
    priceAmount: 2_000_000,
    pointAmountLabel: '70만 원',
    pointAmount: 700_000,
    audienceDescription: '콘텐츠 운영과 반복 업무를 자동화하고 싶은 사업자',
    ctaLabel: '200만 원 상품 상담하기',
    contactPlanQuery: 'business',
    highlighted: true,
  },
  {
    id: 'premium',
    name: 'PREMIUM',
    priceLabel: '300만 원',
    priceAmount: 3_000_000,
    pointAmountLabel: '120만 원',
    pointAmount: 1_200_000,
    audienceDescription: '고객 관리와 마케팅 자동화까지 활용하고 싶은 사업자',
    ctaLabel: '300만 원 상품 상담하기',
    contactPlanQuery: 'premium',
  },
];

export const HOMEPAGE_PLAN_FAQ = [
  {
    question: '세 요금제의 홈페이지 품질은 동일한가요?',
    answer:
      '네. AI 기반 제작, 반응형 모바일 최적화, 기본 SEO 구조는 모든 요금제에서 동일합니다. 선택 기준은 제작비와 함께 제공되는 서비스 포인트 총액, 그리고 패키지에 포함된 운영·자동화 범위(상담 안내)입니다.',
  },
  {
    question: '서비스 포인트는 할인인가요?',
    answer:
      '아니요. 표시된 포인트는 제작비에서 차감되는 할인이 아니라, 별도로 지급되는 마케팅 서비스 이용 혜택입니다. 「제작비 − 포인트 = 실구매가」와 같이 계산하지 않습니다.',
  },
  {
    question: '포인트는 어디에 쓸 수 있나요?',
    answer:
      '운영 안내 기준으로 콘텐츠·백링크·트래픽 등 온오프마케팅 서비스 요금에 사용할 수 있습니다. 차감 단위·유효기간·환불 규정은 회원 포인트 정책과 상담으로 확인해 주세요.',
  },
  {
    question: '월 유지관리비·부가세는 어떻게 되나요?',
    answer:
      '표시 금액은 홈페이지 제작비입니다. 월 운영관리비·부가세·맞춤 개발비는 별도 견적이며, 포인트 지급과는 별도 항목입니다.',
  },
] as const;

export function planContactPath(planId: HomepagePlanId): string {
  return `/contact?service=website&plan=${planId}`;
}