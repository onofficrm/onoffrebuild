/**
 * 요금안내 — 서비스 포인트 사용처 (홍보 페이지용)
 * 포인트 결제·차감 API는 변경하지 않으며, 운영 문서에 근거한 안내만 노출합니다.
 *
 * 근거: lib/onoff-homepage-point-obligation.lib.php
 * — 충전 포인트는 「콘텐츠·백링크·트래픽 등」 서비스 요금에 사용 가능하다고 안내.
 * GEO는 공식 소개·상담 경로(/geo)는 운영 중이나, 위 obligation 문구에 직접 명시되지 않아
 * 카드에 `redeemClarification`으로 차감 범위 확인 안내를 붙입니다.
 */

export interface PointRedeemServiceCard {
  id: string;
  name: string;
  effect: string;
  path: string;
  /** 포인트 자동 차감이 문서에 명시되지 않은 서비스에만 표시 */
  redeemClarification?: string;
}

export const SERVICE_POINT_SECTION = {
  title: '서비스 포인트, 어디에 사용할 수 있나요?',
  lead:
    '홈페이지 제작 후 받은 서비스 포인트로 필요한 온라인 마케팅 서비스를 선택해 이용하세요.',
  pointBenefitNote:
    '포인트는 제작비 할인이나 현금 환급이 아니라, 별도로 지급되는 마케팅 서비스 이용 혜택입니다. 현금 전환·환불·유효기간 등은 회원 포인트 정책 및 상담 시 확인이 필요합니다.',
  policyNote:
    '아래는 공식 홈페이지에서 안내하는 대표 서비스입니다. 실제 차감·신청 방식은 로그인 후 포인트 정책과 상담 안내를 따릅니다.',
} as const;

/** 대표 사용처 3종 — 운영 중인 서비스 소개 페이지 경로 */
export const POINT_REDEEM_SERVICE_CARDS: PointRedeemServiceCard[] = [
  {
    id: 'traffic',
    name: '트래픽',
    effect: '홈페이지 방문 트래픽 서비스',
    path: '/traffic',
  },
  {
    id: 'backlink',
    name: '백링크',
    effect: '외부 링크 구축을 위한 백링크 서비스',
    path: '/backlink',
  },
  {
    id: 'geo',
    name: 'GEO',
    effect: 'AI 검색 대응을 위한 최적화 서비스',
    path: '/geo',
    redeemClarification: '포인트 사용·차감 범위는 회원 정책 및 상담으로 확인',
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
    body: '회원 포인트로 트래픽·백링크·GEO 등 필요한 온오프마케팅 서비스를 선택해 신청·운영합니다. 항목별 차감 방식은 포인트 정책과 상담을 따릅니다.',
  },
] as const;