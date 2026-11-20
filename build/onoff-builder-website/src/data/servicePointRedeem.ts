/**
 * 요금안내 — 서비스 포인트 사용처 (홍보 페이지용)
 * 포인트 결제·차감 API는 변경하지 않으며, 운영 문서에 근거한 안내만 노출합니다.
 *
 * 근거: lib/onoff-homepage-point-obligation.lib.php, lib/onoff-education.lib.php
 * — 충전 포인트는 「콘텐츠·백링크·트래픽 등」 서비스 요금에 사용 가능하다고 안내.
 * SEO·GEO는 별도 전문 상담 서비스이며, 패키지 포인트 자동 결제 연동은 코드에서 확인되지 않아 목록에서 제외.
 */

export interface PointRedeemServiceCard {
  id: string;
  name: string;
  effect: string;
  path: string;
}

export const SERVICE_POINT_SECTION = {
  title: '서비스 포인트로 어떤 서비스를 이용할 수 있나요?',
  lead: [
    '홈페이지 제작 후에도 마케팅은 계속되어야 합니다.',
    '온오프마케팅에서 제공하는 서비스 포인트로 필요한 온라인 마케팅 서비스를 선택해 이용하세요.',
  ],
  pointBenefitNote:
    '포인트는 제작비 할인이 아니라, 별도로 지급되는 마케팅 서비스 이용 혜택입니다. 현금 전환·환불·유효기간 등은 회원 포인트 정책 및 상담 시 확인이 필요합니다.',
  policyNote:
    '아래는 공식 홈페이지에서 안내하는 대표 서비스입니다. 실제 차감·신청 방식은 로그인 후 포인트 정책과 상담 안내를 따릅니다.',
} as const;

/** 운영 문서에 명시된 서비스 요금 결제 대상 + 동일 경로의 공식 소개 페이지 */
export const POINT_REDEEM_SERVICE_CARDS: PointRedeemServiceCard[] = [
  {
    id: 'backlink',
    name: 'BACKLINK',
    effect: '검색 경쟁력 강화를 위한 외부 링크·참조 전략을 업종에 맞게 설계합니다.',
    path: '/backlink',
  },
  {
    id: 'traffic',
    name: 'TRAFFIC',
    effect: '홈페이지 목적에 맞는 방문 유입 전략과 도착 페이지 전환 구조를 함께 점검합니다.',
    path: '/traffic',
  },
  {
    id: 'content',
    name: 'AI 콘텐츠',
    effect: '기획·AI 초안·검수 워크플로로 브랜드에 맞는 콘텐츠를 꾸준히 운영합니다.',
    path: '/content',
  },
];

export const POINT_USAGE_STEPS = [
  {
    step: '01',
    title: '홈페이지 제작 신청',
    body: '원하는 홈페이지 제작 상품(STARTER·BUSINESS·PREMIUM)을 선택하고 상담을 신청합니다.',
  },
  {
    step: '02',
    title: '서비스 포인트 지급',
    body: '계약·납품 조건에 따라 해당 패키지의 서비스 포인트(30만·70만·120만 원 상당)가 지급됩니다. 지급 시점과 회원 계정 연동 방식은 상담·약관을 기준으로 안내합니다.',
  },
  {
    step: '03',
    title: '마케팅 서비스 이용',
    body: '회원 포인트로 이용 가능한 온오프마케팅 서비스(콘텐츠·백링크·트래픽 등) 중 필요한 항목을 선택해 신청·운영합니다.',
  },
] as const;