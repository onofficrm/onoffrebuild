import type { ServiceSlug } from './navigation';

/**
 * ONOFF Builder 2.0 리포지셔닝 브랜드 중심 정의
 * - 기존 중심: 홈페이지 제작 · SEO 서비스
 * - 신규 중심: 홈페이지 + 3대 자동화 도구 + 쉬운 수정 + AI 기능 개발
 * - 기존 SEO, GEO, BACKLINK, TRAFFIC, DOMAIN 등은 별도 전문 서비스로 유지
 */
export const BRAND_POSITIONING = {
  coreFormula: '홈페이지 + 3대 자동화 도구 + 쉬운 수정 + AI 기능 개발',
  shortSummary:
    '관리형 홈페이지 구축을 기반으로 루틴·스텝메일·오토포스터(SNS 마케팅) 3대 자동화 도구, 자연어 기반 쉬운 수정, AI 지원 맞춤 기능 개발까지 확장하는 비즈니스 웹 플랫폼',
  pillars: [
    { id: 'website', label: '관리형 홈페이지', summary: '기획·디자인·제작·호스팅·보안 일원화' },
    {
      id: 'automation-3',
      label: '3대 자동화 도구',
      summary: '루틴(콘텐츠 자동발행) · 스텝메일 · 오토포스터(SNS 마케팅)',
    },
    { id: 'easy-edit', label: '쉬운 홈페이지 수정', summary: '자연어로 요청하고 검수 후 반영' },
    { id: 'ai-dev', label: 'AI 기능 개발', summary: 'AI 지원 워크플로 기반 맞춤 기능 개발' },
  ],
} as const;

/**
 * 기능 분류 체계
 */
export type CapabilityCategory =
  | 'website_base'       // 홈페이지 기반 (제작 · 운영관리)
  | 'automation_suite'   // 3대 자동화 도구 (루틴 · 스텝메일 · SNS 마케팅)
  | 'comment_automation' // 자동 댓글 (홈페이지 게시글 댓글 AI 응대·관리)
  | 'easy_editing'       // 쉬운 홈페이지 수정 (자연어 수정 요청)
  | 'ai_development'     // AI 기능 개발 (AI 지원 맞춤 기능 개발)
  | 'separate_marketing'; // 기존 온오프마케팅 별도 전문 서비스 (SEO · GEO · BACKLINK · TRAFFIC · DOMAIN · AI 콘텐츠)

/**
 * 제공 정책 (계약·비용·포함 범위 구분)
 * - 모든 기능이 기본 포함처럼 오해되지 않도록 정책을 코드 레벨에서 강제 구분
 */
export type ProvisionPolicy =
  | 'included_core'         // 기본 구축·운영 핵심 포함 범위
  | 'included_with_builder' // ONOFF Builder 기본 제공 (별도 솔루션 구독료 0원)
  | 'included_plan'         // 운영·관리 플랜 조건부 포함 (범위 협의)
  | 'optional_addon'        // 선택형 추가 기능 (필요 시 별도 도입)
  | 'custom_project'        // 프로젝트별 맞춤 개발 별도 견적
  | 'separate_service';     // 온오프마케팅 별도 전문 서비스

/**
 * 실제 운영 상태 (현재 제공 가능 여부 vs 연동·개발 준비 상태 구분)
 * - 미구현 기능을 이미 운영 중인 자동화처럼 허위 표기하지 않기 위한 단일 진실 소스
 */
export type OperationalStatus =
  | 'live'                    // 현재 정상 운영·제공 중
  | 'consultation_scoped'     // 상담 후 범위 확정하여 제공 (운영자 협업/관리형 포함)
  | 'beta_pilot'              // 시범 운영 / 단계적 적용 중
  | 'integration_in_progress' // 플랫폼 연동 및 자동화 고도화 준비 중
  | 'planned';                // 향후 확장 예정 (로드맵)

export type CoreCapabilitySlug =
  | 'routine'
  | 'stepmail'
  | 'sns-marketing'
  | 'auto-comment'
  | 'easy-edit'
  | 'ai-dev';

export type OfferingSlug = ServiceSlug | CoreCapabilitySlug;

export interface ProvisionPolicyMeta {
  code: ProvisionPolicy;
  label: string;
  shortLabel: string;
  description: string;
}

export interface OperationalStatusMeta {
  code: OperationalStatus;
  label: string;
  shortLabel: string;
  description: string;
  /** UI에서 "현재 완전 자동 제공 중"으로 표기 가능 여부 */
  isSelfServeLive: boolean;
}

export const PROVISION_POLICY_META: Record<ProvisionPolicy, ProvisionPolicyMeta> = {
  included_core: {
    code: 'included_core',
    label: '기본 핵심 범위',
    shortLabel: '기본 범위',
    description: '홈페이지 구축 및 기본 운영 계약의 핵심 구성으로 협의·반영됩니다.',
  },
  included_with_builder: {
    code: 'included_with_builder',
    label: 'ONOFF Builder 기본 제공',
    shortLabel: '기본 제공 · 구독료 0원',
    description:
      '온오프빌더 고객에게 홈페이지와 함께 기본 제공되며 별도 솔루션 구독료는 0원입니다. 단, 제3자 발송·API 실비, 기준 초과 사용량 비용 및 맞춤 기능 개발비는 별도 구분합니다.',
  },
  included_plan: {
    code: 'included_plan',
    label: '운영 플랜 협의 포함',
    shortLabel: '플랜 협의',
    description: '월 운영관리 또는 도입 플랜 조건에 따라 제공 범위와 횟수를 협의합니다.',
  },
  optional_addon: {
    code: 'optional_addon',
    label: '선택형 추가 기능',
    shortLabel: '선택 추가',
    description: '비즈니스 필요에 따라 선택적으로 추가 도입하는 옵션 기능입니다.',
  },
  custom_project: {
    code: 'custom_project',
    label: '맞춤 개발 별도 협의',
    shortLabel: '맞춤 개발',
    description: '요구사항과 기능 복잡도에 따라 범위·일정·견적을 개별 산정합니다.',
  },
  separate_service: {
    code: 'separate_service',
    label: '별도 전문 서비스',
    shortLabel: '별도 서비스',
    description: '온오프마케팅의 전문 마케팅 서비스로 홈페이지와 연계해 별도 도입할 수 있습니다.',
  },
};

export const OPERATIONAL_STATUS_META: Record<OperationalStatus, OperationalStatusMeta> = {
  live: {
    code: 'live',
    label: '정상 제공 중',
    shortLabel: '제공 중',
    description: '현재 실제 운영 프로세스로 안정적으로 제공되고 있습니다.',
    isSelfServeLive: true,
  },
  consultation_scoped: {
    code: 'consultation_scoped',
    label: '상담 후 범위 제공',
    shortLabel: '상담 제공',
    description: '고객 요구사항을 확인한 뒤 담당자 협업 및 관리형 절차로 제공합니다.',
    isSelfServeLive: false,
  },
  beta_pilot: {
    code: 'beta_pilot',
    label: '단계적 적용 중',
    shortLabel: '단계 적용',
    description: '선정된 프로젝트 또는 협의 고객 대상으로 순차 적용·검증 중입니다.',
    isSelfServeLive: false,
  },
  integration_in_progress: {
    code: 'integration_in_progress',
    label: '연동 준비 중',
    shortLabel: '연동 준비 중',
    description: 'ONOFF Builder 플랫폼 통합 자동화 연동이 준비 중인 단계입니다.',
    isSelfServeLive: false,
  },
  planned: {
    code: 'planned',
    label: '확장 예정',
    shortLabel: '확장 예정',
    description: '향후 플랫폼 로드맵에 따라 순차 공개될 예정입니다.',
    isSelfServeLive: false,
  },
};

export interface PlatformOffering {
  slug: OfferingSlug;
  order: number;
  name: string;
  subtitle: string;
  tagline: string;
  summary: string;
  category: CapabilityCategory;
  /** 향후 전용 상세 페이지 경로 (기존 운영 URL과 충돌 없음) */
  dedicatedRoute: string;
  /** 현재 활성 라우트 (신규 페이지 생성 전까지 기존 운영 경로로 안전하게 연결) */
  activeRoute: string;
  /** /contact?service=... 사전 선택 파라미터 값 */
  contactQueryKey: OfferingSlug;
  /** 제공 정책 */
  provisionPolicy: ProvisionPolicy;
  policyDetail: string;
  /** 별도 솔루션 구독료 정책 요약 (예: 별도 솔루션 구독료 0원) */
  separateSubscriptionFeeLabel?: string;
  /** 별도 구독료와 제3자 발송·API 실비, 사용량 초과 비용, 맞춤 개발비 구분 안내 */
  costBoundaryNote?: string;
  /** 실제 운영 상태 */
  operationalStatus: OperationalStatus;
  statusDetail: string;
  /** 현재 실제 제공 방식 (과장 방지용 내부·UI 공통 기준) */
  currentDeliveryMode: string;
  /** 핵심 포인트 */
  highlights: string[];
  /** 과장·허위 표기 방지를 위한 명시적 안내 문구 */
  guardrailNote: string;
}

/**
 * 스텝메일 · 오토포스터(SNS 마케팅) 기본 제공 공통 정책 및 표준 표현 (단일 원천)
 * - 금지 표현: 'Mailchimp 무료 제공', 'FS Poster 무료 제공', '모든 기능 포함', '완전 무료', '즉시 자동 발행 가능'
 */
export const CORE_INCLUDED_TOOL_POLICY = {
  badgeLabel: 'ONOFF Builder 기본 제공',
  subscriptionFeeLabel: '별도 솔루션 구독료 0원',
  additionalSubscriptionZeroLabel: '추가 솔루션 구독료 0원',
  mainBannerHeadline: '루틴 · 스텝메일 · 오토포스터 — ONOFF Builder 기본 제공',
  mainBannerSubtext: '별도의 자동화 솔루션 구독료 없이 홈페이지와 함께 시작하세요.',
  valueProposition:
    '외부 이메일·SNS 전문 도구를 따로 구독할 필요 없이 홈페이지 운영 흐름에 통합',
  summaryNotice:
    '온오프빌더 고객에게 루틴·스텝메일·오토포스터(SNS 마케팅) 자체 기능은 홈페이지와 함께 기본 제공되며, 별도의 솔루션 라이선스 또는 도구 구독료는 0원입니다.',
  managementFeeDistinction:
    '기본 제공 기능의 별도 소프트웨어 구독료(0원)와 월 홈페이지 운영관리비는 서로 다른 비용 항목입니다. 월 운영관리비는 호스팅·보안·일상 수정 등 홈페이지 자체의 지속 관리 비용이며, 스텝메일·오토포스터 자체 기능에 대한 추가 라이선스 구독료는 부과되지 않습니다.',
  costSeparationNotice:
    '별도 솔루션 구독료 0원 정책은 ONOFF Builder 자체 도구 사용 권한 기준이며, 제3자 이메일 발송 실비, 유료 SNS API, 운영 대행, 기준 초과 사용량 정책, AI 지원 맞춤 기능 개발비는 별도 구분됩니다.',
  readinessNotice:
    '플랫폼 내장 자동 발송·외부 SNS API 직접 자동 게시는 현재 연동 준비 중 상태이며, 미검증 채널이나 미연동 기능을 즉시 자동 발행 가능으로 표기하지 않습니다.',
  separatedCostItems: [
    {
      id: 'third-party-api',
      label: '제3자 이메일 발송 실비 · 유료 SNS API · 대행',
      detail:
        '외부 이메일 발송 인프라, 외부 SNS 플랫폼의 유료 API 이용료 및 전담 운영 대행 범위는 별도 비용 기준으로 구분됩니다.',
    },
    {
      id: 'usage-overage',
      label: '기준 초과 발송량 · 사용량 정책',
      detail:
        '기본 제공 범위를 초과하는 대량 이메일 발송량이나 대규모 처리 구간은 확정 사용량 정책 또는 규모별 협의 기준에 따라 구분됩니다.',
    },
    {
      id: 'custom-development',
      label: '맞춤 기능 개발비',
      detail:
        '외부 CRM·ERP 연동, 특수 조건 분기 로직, 회원 자료실·예약·견적 계산기 등 개별 맞춤 개발은 사전 범위 협의 및 별도 견적으로 산정합니다.',
    },
  ],
} as const;

/**
 * 비교 대상 외부 전문 제품 공식 정보 (정확한 포지션 구분 및 공식 사이트 기준)
 */
export const COMPARISON_PRODUCTS = {
  mailchimp: {
    name: 'Mailchimp',
    officialUrl: 'https://mailchimp.com/',
    categoryLabel: '폭넓은 이메일·마케팅 자동화 전문 제품',
    distinctionSummary:
      'Mailchimp는 대규모 뉴스레터·세그먼트·다변량 캠페인에 강한 전문 제품이며, ONOFF Builder 스텝메일은 Mailchimp의 모든 기능을 대체하는 대신 홈페이지와 연결된 핵심 단계별 이메일 운영을 별도 솔루션 구독료 0원으로 통합하는 데 집중합니다.',
  },
  fsPoster: {
    name: 'FS Poster',
    officialUrl: 'https://www.fs-poster.com/',
    categoryLabel: 'WordPress 기반 SNS 자동 게시 전문 플러그인',
    distinctionSummary:
      'FS Poster는 WordPress 기반 사이트에 설치해 다수 SNS 계정으로 자동 게시하는 전문 플러그인이며, ONOFF Builder SNS 마케팅(오토포스터)은 별도 솔루션 구독료 0원으로 관리형 홈페이지와 SNS 배포·예약 흐름을 하나의 체계로 연결하는 데 집중합니다.',
  },
} as const;

/**
 * 6대 핵심 기능 (홈페이지 기반 위에 결합되는 신규 브랜드 중심 축)
 * 1. 루틴 — 콘텐츠 자동발행
 * 2. 스텝메일 — 단계별 이메일 자동화
 * 3. SNS 마케팅 — SNS 배포·예약·관리
 * 4. 자동 댓글 — 홈페이지 게시글 댓글 AI 응대·관리
 * 5. 쉬운 홈페이지 수정 — 자연어로 수정 요청
 * 6. AI 기능 개발 — AI 지원 맞춤 기능 개발
 */
export const CORE_CAPABILITIES: PlatformOffering[] = [
  {
    slug: 'routine',
    order: 1,
    name: '루틴 자동발행',
    subtitle: '콘텐츠 자동발행',
    tagline: '정해진 주기와 기준에 맞춰 홈페이지 콘텐츠를 꾸준히 발행합니다.',
    summary:
      '콘텐츠 주제 기획부터 초안 생성, 검수 승인, 예약 발행까지 반복되는 운영 루틴을 자동화 워크플로로 정리해 홈페이지가 멈추지 않고 쌓이도록 돕습니다.',
    category: 'automation_suite',
    dedicatedRoute: '/features/routine',
    activeRoute: '/features/routine',
    contactQueryKey: 'routine',
    provisionPolicy: 'included_with_builder',
    separateSubscriptionFeeLabel: '별도 솔루션 구독료 0원',
    policyDetail:
      'ONOFF Builder 기본 제공 기능으로 별도 솔루션 구독료는 0원입니다. 단, 플랫폼 직접 자동발행 연동 가용 여부와 대량 원고 제작 대행(AI 콘텐츠 별도 서비스) 범위는 구분합니다.',
    costBoundaryNote:
      '별도 솔루션 구독료 0원(자체 도구 기준) · 월 홈페이지 운영관리비, 원고 대행(AI 콘텐츠), 외부 도구 실비는 별도 구분',
    operationalStatus: 'integration_in_progress',
    statusDetail: 'ONOFF Builder 플랫폼 직접 자동발행 연동은 준비 중이며, 현재는 기획·AI 초안·검수·담당자 반영 방식으로 상담 가능합니다.',
    currentDeliveryMode: '현행: 기획·초안·검수 후 운영자 반영 / 고도화: 플랫폼 예약 자동발행 연동 준비 중',
    highlights: [
      'ONOFF Builder 기본 제공 · 별도 솔루션 구독료 0원 (원고 대행·외부 실비 구분)',
      '업종·키워드 기반 콘텐츠 발행 주기(루틴) 설계 및 담당자 사실 검수 결합',
      '홈페이지 게시판·인사이트 영역 중심의 일관된 누적 발행',
    ],
    guardrailNote:
      '무검수 자동 발행이나 검색 상위 노출을 보장하지 않으며, ONOFF Builder 완전 자동 연동은 현재 연동 준비 중입니다.',
  },
  {
    slug: 'stepmail',
    order: 2,
    name: '스텝메일',
    subtitle: '단계별 이메일 자동화',
    tagline: '문의·자료 요청 이후 고객 여정에 맞춰 단계별 이메일을 자동 발송합니다.',
    summary:
      '외부 이메일·SNS 전문 도구를 따로 구독할 필요 없이 홈페이지 운영 흐름에 통합해, 유입 고객에게 첫 안내·서비스 소개·상담 제안까지 단계별 시퀀스를 체계적으로 관리합니다.',
    category: 'automation_suite',
    dedicatedRoute: '/features/step-mail',
    activeRoute: '/features/step-mail',
    contactQueryKey: 'stepmail',
    provisionPolicy: 'included_with_builder',
    separateSubscriptionFeeLabel: '추가 솔루션 구독료 0원',
    policyDetail:
      'ONOFF Builder 기본 제공 기능으로 별도 솔루션 구독료는 0원입니다. 외부 이메일 전문 도구를 따로 구독할 필요 없이 홈페이지 운영 흐름에 통합됩니다. 단, 제3자 이메일 발송 실비, 기준 초과 발송량·사용량 정책, 운영 대행 및 별도 맞춤 기능 개발비는 구분됩니다.',
    costBoundaryNote:
      '별도 솔루션 구독료 0원(자체 도구 기준) · 월 홈페이지 운영관리비, 제3자 이메일 발송 실비, 사용량 정책 초과 비용, 맞춤 기능 개발비 별도 구분',
    operationalStatus: 'integration_in_progress',
    statusDetail:
      'ONOFF Builder 내장 스텝메일 자동 발송·수신거부·발신 인증 연동은 현재 준비 중이며, 시나리오 설계 및 검증된 외부 발송 도구 연계 범위는 상담으로 안내합니다.',
    currentDeliveryMode:
      '현행: 시나리오 기획 및 검증된 외부 발송 도구 연계 상담 / 고도화: 플랫폼 내장 자동화 연동 준비 중',
    highlights: [
      'ONOFF Builder 기본 제공 · 추가 솔루션 구독료 0원 (제3자 발송 실비·사용량 정책 구분)',
      '상담 신청·자료 요청 등 홈페이지 접점과 연결된 단계별 메일 시나리오',
      '수신 동의(옵트인)·수신 거부·발신 인증 기준을 고려한 안전한 운영 설계',
    ],
    guardrailNote:
      '외부 이메일 전문 제품의 모든 기능을 대체하거나 제한 없는 일괄 발송을 의미하지 않습니다. 내장 발송 연동은 현재 연동 준비 중이며, 제3자 이메일 발송 실비·사용량 정책·대행·맞춤 개발비는 별도 구분됩니다.',
  },
  {
    slug: 'sns-marketing',
    order: 3,
    name: '오토포스터 (SNS 마케팅)',
    subtitle: 'SNS 배포·예약·관리',
    tagline: '홈페이지 소식과 콘텐츠를 주요 SNS 채널로 일관되게 배포·예약·관리합니다.',
    summary:
      '외부 이메일·SNS 전문 도구를 따로 구독할 필요 없이 홈페이지 운영 흐름에 통합해, 홈페이지에 발행된 공지와 콘텐츠의 SNS 배포·예약·운영 흐름을 한 체계로 연결합니다.',
    category: 'automation_suite',
    dedicatedRoute: '/features/sns-poster',
    activeRoute: '/features/sns-poster',
    contactQueryKey: 'sns-marketing',
    provisionPolicy: 'included_with_builder',
    separateSubscriptionFeeLabel: '추가 솔루션 구독료 0원',
    policyDetail:
      'ONOFF Builder 기본 제공 기능(오토포스터)으로 별도 솔루션 구독료는 0원입니다. 외부 SNS 전문 도구를 따로 구독할 필요 없이 홈페이지 운영 흐름에 통합됩니다. 단, 유료 SNS API 실비, 채널별 연결 승인, 운영 대행, 사용량 정책 및 별도 맞춤 기능 개발비는 구분됩니다.',
    costBoundaryNote:
      '별도 솔루션 구독료 0원(자체 도구 기준) · 월 홈페이지 운영관리비, 유료 SNS API 실비, 운영 대행, 맞춤 기능 개발비 별도 구분',
    operationalStatus: 'integration_in_progress',
    statusDetail:
      '외부 SNS 플랫폼 API 직접 자동 게시는 현재 연동 준비 중이며, 검증되지 않은 채널은 활성 기능으로 표기하지 않습니다. 현행은 채널별 원고·일정 운영 범위로 상담합니다.',
    currentDeliveryMode:
      '현행: 홈페이지 원본 기반 SNS 원고·일정 운영 상담 / 고도화: 외부 SNS API 배포·예약 연동 준비 중',
    highlights: [
      'ONOFF Builder 기본 제공 · 추가 솔루션 구독료 0원 (유료 SNS API·대행·맞춤 개발비 구분)',
      '홈페이지 원본 게시글에서 이어지는 채널별 요약 문구·검수·예약 흐름',
      'SNS 유입을 홈페이지 상세·상담 페이지로 되돌리는 전환 동선 연결',
    ],
    guardrailNote:
      '지금 모든 채널로 즉시 자동 발행 가능하다는 의미가 아니며, 외부 SNS 직접 자동 게시는 현재 연동 준비 중입니다. 유료 SNS API 실비, 운영 대행, 사용량 정책 및 맞춤 기능 개발비는 별도 구분됩니다.',
  },
  {
    slug: 'auto-comment',
    order: 4,
    name: '자동 댓글',
    subtitle: 'AI 댓글 응대·관리',
    tagline: '홈페이지 게시글에 달린 고객 댓글에 빠르고 일관된 답변을 이어 줍니다.',
    summary:
      '홈페이지 공지·블로그·자료실 게시글에 새 댓글이 달리면 질문·문의·스팸을 분류하고, 브랜드 응대 규칙에 맞춘 AI 답변 초안을 만들어 담당자 승인 후 게시합니다. 상담이 필요한 댓글은 상담하기·스텝메일 흐름으로 연결합니다.',
    category: 'comment_automation',
    dedicatedRoute: '/features/auto-comment',
    activeRoute: '/features/auto-comment',
    contactQueryKey: 'auto-comment',
    provisionPolicy: 'included_with_builder',
    separateSubscriptionFeeLabel: '추가 솔루션 구독료 0원',
    policyDetail:
      'ONOFF Builder 기본 제공 기능으로 별도 댓글 관리 솔루션 구독료는 0원입니다. 단, AI 사용량 정책 초과분, 운영 대행(답변 검수 대행), 외부 플랫폼 연동 및 맞춤 기능 개발비는 별도 구분됩니다.',
    costBoundaryNote:
      '별도 솔루션 구독료 0원(자체 도구 기준) · 월 홈페이지 운영관리비, AI 사용량 초과분, 답변 검수 대행, 맞춤 기능 개발비 별도 구분',
    operationalStatus: 'integration_in_progress',
    statusDetail:
      '게시판 댓글 자동 감지·AI 답변 초안·승인 게시 기능은 현재 플랫폼 연동 준비 중입니다. 현행은 응대 규칙·금칙어·답변 톤 설계와 운영관리 연계 댓글 응대 범위로 상담합니다.',
    currentDeliveryMode:
      '현행: 댓글 응대 규칙·답변 템플릿 설계 + 운영관리 연계 응대 / 고도화: 댓글 감지·AI 초안·승인 게시 플랫폼 연동 준비 중',
    highlights: [
      'ONOFF Builder 기본 제공 · 추가 솔루션 구독료 0원 (AI 사용량 초과분·대행·맞춤 개발비 구분)',
      '질문·상담 문의·칭찬·스팸 댓글 자동 분류와 브랜드 톤 AI 답변 초안',
      '담당자 승인 후 게시 원칙 · 상담이 필요한 댓글은 상담하기·스텝메일로 연결',
    ],
    guardrailNote:
      '내 홈페이지 게시글에 달린 댓글 응대 기능이며, 타 사이트·블로그·카페·SNS에 홍보성 댓글을 대량 작성하는 기능이 아닙니다. 무검수 자동 게시를 지양하고, 플랫폼 연동은 현재 준비 중입니다.',
  },
  {
    slug: 'easy-edit',
    order: 5,
    name: '쉬운 홈페이지 수정',
    subtitle: '자연어로 수정 요청',
    tagline: '복잡한 편집기 대신 말하듯 자연어로 요청하면 확인 후 안전하게 반영합니다.',
    summary:
      '드래그 앤 드롭 도구를 배우거나 코드를 만질 필요 없이 "메인 문구를 이렇게 바꿔주세요", "새 공지 배너를 추가해 주세요"처럼 자연어로 요청하면 검토·작업·검수를 거쳐 반영됩니다.',
    category: 'easy_editing',
    dedicatedRoute: '/features/easy-edit',
    activeRoute: '/features/easy-edit',
    contactQueryKey: 'easy-edit',
    provisionPolicy: 'included_plan',
    policyDetail: '월 운영관리 플랜 범위 내 일상 수정으로 포함되며, 신규 페이지·구조 개편은 별도 협의합니다.',
    operationalStatus: 'consultation_scoped',
    statusDetail: '현재 전담 운영 채널을 통한 자연어 수정 요청·작업·검수·반영 방식으로 정상 운영 중이며, AI 보조 요청 접수 인터페이스는 단계적으로 고도화 중입니다.',
    currentDeliveryMode: '현행: 담당 채널 자연어 요청 → 검토·작업 → 고객 검수 → 반영 / 고도화: 전용 요청 UI 단계 적용',
    highlights: [
      'DIY 편집 툴 학습 없이 자연어 문장만으로 수정 요청 전달',
      '브랜드 디자인 시스템과 반응형 레이아웃을 깨뜨리지 않는 전문 반영',
      '사전 검수 확인 후 실서비스 배포로 오탈자·화면 깨짐 방지',
    ],
    guardrailNote:
      '고객이 직접 화면을 편집하는 DIY 빌더가 아니며, 무검수 실시간 자동 배포 대신 안전 검수 후 반영을 원칙으로 합니다.',
  },
  {
    slug: 'ai-dev',
    order: 6,
    name: 'AI 기능 개발',
    subtitle: 'AI 지원 맞춤 기능 개발',
    tagline: 'AI 지원 개발 워크플로로 우리 사업에 꼭 필요한 맞춤 기능을 빠르게 구현합니다.',
    summary:
      '견적 계산기, 예약·상담 분기 폼, 업종 특화 검색·필터, 외부 데이터 연동 등 기성 템플릿에 없는 기능을 AI 지원 설계·개발과 엔지니어 검수로 안정적으로 구축합니다.',
    category: 'ai_development',
    dedicatedRoute: '/features/ai-development',
    activeRoute: '/features/ai-development',
    contactQueryKey: 'ai-dev',
    provisionPolicy: 'custom_project',
    policyDetail: '모든 홈페이지에 기본 포함되지 않으며, 기능 명세와 연동 난이도에 따라 프로젝트별 맞춤 견적으로 진행합니다.',
    operationalStatus: 'consultation_scoped',
    statusDetail: 'AI 지원 설계·개발 워크플로와 전문 엔지니어의 코드 리뷰·테스트를 결합해 프로젝트별 맞춤 개발로 제공합니다.',
    currentDeliveryMode: '현행: 요구사항 분석 → AI 지원 신속 프로토타이핑·개발 → 엔지니어 보안/품질 검수 → 배포',
    highlights: [
      '예약, 계산기, 맞춤 필터, 다국어, 외부 API 연동 등 업종 특화 기능 구현',
      'AI 지원 워크플로로 프로토타입 검증과 개발 리드타임 단축',
      '엔지니어의 아키텍처·보안·반응형 검수를 거친 안정적 운영 배포',
    ],
    guardrailNote:
      '복잡한 결제(PG)·외부 기간계 연동 등은 별도 기술 검토와 일정 협의가 필요하며, 모든 기능이 기본 제작비에 포함되지 않습니다.',
  },
];

/**
 * 3대 자동화 도구 묶음 (루틴 · 스텝메일 · SNS 마케팅)
 */
export const THREE_AUTOMATION_TOOLS: PlatformOffering[] = CORE_CAPABILITIES.filter(
  (item) => item.category === 'automation_suite'
);

/**
 * 홈페이지 기반 서비스 (기존 /website, /management 유지)
 */
export const WEBSITE_BASE_OFFERINGS: PlatformOffering[] = [
  {
    slug: 'website',
    order: 0,
    name: '홈페이지 제작',
    subtitle: '관리형 기업 홈페이지 구축',
    tagline: '브랜드 맞춤 기획·디자인·반응형 제작부터 기본 SEO 구조까지 전담 구축합니다.',
    summary:
      'ONOFF Builder의 중심이 되는 관리형 홈페이지 제작 서비스로, 추후 3대 자동화 도구와 쉬운 수정·AI 기능 개발을 얹을 수 있는 탄탄한 웹 기반을 구축합니다.',
    category: 'website_base',
    dedicatedRoute: '/website',
    activeRoute: '/website',
    contactQueryKey: 'website',
    provisionPolicy: 'included_core',
    policyDetail: '초기 제작비 산정 대상이며, 페이지 규모와 선택 구성에 따라 개별 견적을 안내합니다.',
    operationalStatus: 'live',
    statusDetail: '현재 온오프마케팅 전담 기획·디자인·개발 프로세스로 정상 제공 중입니다.',
    currentDeliveryMode: '전담 기획 → UI 디자인 → 반응형 구현 → 고객 검수 → 도메인·SSL 오픈',
    highlights: [
      '사업 구조 기반 맞춤 기획 및 PC·모바일 반응형 UI',
      '회사·서비스 소개, 게시판·자료실, 문의 폼, SEO 기본 구조',
      '3대 자동화 도구 및 맞춤 기능 확장을 고려한 모듈형 구조',
    ],
    guardrailNote: '모든 선택 기능(예약·결제·다국어 등)이 기본 제작에 일괄 포함되지 않습니다.',
  },
  {
    slug: 'management',
    order: 0,
    name: '운영관리',
    subtitle: '호스팅·보안·유지보수 전담',
    tagline: '오픈 이후에도 호스팅, SSL 보안, 수정 요청과 기술 점검을 지속적으로 관리합니다.',
    summary:
      '홈페이지가 오픈 후 방치되지 않도록 인프라 유지보수와 일상 수정(쉬운 홈페이지 수정 포함), 신규 페이지 확장을 한곳에서 지속 관리합니다.',
    category: 'website_base',
    dedicatedRoute: '/management',
    activeRoute: '/management',
    contactQueryKey: 'management',
    provisionPolicy: 'included_plan',
    policyDetail: '월 운영관리 비용 산정 대상이며, 사이트 규모와 수정 빈도에 따라 관리 범위를 협의합니다.',
    operationalStatus: 'live',
    statusDetail: '현재 온오프마케팅 관리형 운영 체계로 정상 제공 중입니다.',
    currentDeliveryMode: '호스팅·SSL·보안 유지 + 전담 채널 수정 요청 접수·검수·반영',
    highlights: [
      '코드·서버·호스팅 직접 관리 부담 제거',
      '자연어 수정 요청 기반의 일상 콘텐츠·이미지 업데이트',
      '도메인·SSL·레이아웃 정합성 지속 점검',
    ],
    guardrailNote: '신규 대규모 페이지 신설이나 별도 기능 개발은 사전 범위 협의를 거칩니다.',
  },
];

/**
 * 기존 온오프마케팅 별도 전문 서비스 (모든 기존 URL 및 페이지 유지)
 */
export const SEPARATE_MARKETING_SERVICES: PlatformOffering[] = [
  {
    slug: 'seo',
    order: 1,
    name: 'SEO',
    subtitle: '검색엔진 최적화',
    tagline: '검색에 발견되는 홈페이지 구조와 콘텐츠 전략을 설계합니다.',
    summary:
      '홈페이지 제작 단계의 기본 SEO 설정을 넘어, 키워드 구조·메타정보·내부링크·콘텐츠 전략과 성과 점검을 별도 전문 서비스로 지원합니다.',
    category: 'separate_marketing',
    dedicatedRoute: '/services/seo',
    activeRoute: '/services/seo',
    contactQueryKey: 'seo',
    provisionPolicy: 'separate_service',
    policyDetail: '제작 시 기본 SEO 구조와 구분되는 별도 전문 SEO 운영 서비스입니다.',
    operationalStatus: 'consultation_scoped',
    statusDetail: '사이트 현황 진단 후 업종·경쟁도에 맞는 운영 범위를 상담으로 확정해 제공합니다.',
    currentDeliveryMode: '사이트 구조 진단 → 온페이지·내부링크 전략 → 콘텐츠 개선 → 검색 성과 확인',
    highlights: [
      '검색엔진 친화적 페이지 계층·타이틀·메타정보 정비',
      '모바일 최적화 및 내부링크 구조 설계',
      '검색 의도 기반 콘텐츠 전략 연계',
    ],
    guardrailNote: '특정 키워드 검색 순위 1위나 고정 트래픽 수치를 보장하지 않습니다.',
  },
  {
    slug: 'geo',
    order: 2,
    name: 'GEO',
    subtitle: 'AI 검색 최적화',
    tagline: '생성형 AI 검색 환경에 대비해 사이트와 콘텐츠 구조를 진단·개선합니다.',
    summary:
      'GEO Analyzer 기반 현황 진단과 개선 방향 제안, 재측정 캠페인을 통해 AI 검색 환경에서 브랜드 정보가 명확히 이해되도록 돕습니다.',
    category: 'separate_marketing',
    dedicatedRoute: '/geo',
    activeRoute: '/geo',
    contactQueryKey: 'geo',
    provisionPolicy: 'separate_service',
    policyDetail: 'GEO UP 분석·개선 캠페인과 실제 홈페이지 소스 수정·배포는 구분하여 별도 협의합니다.',
    operationalStatus: 'consultation_scoped',
    statusDetail: '진단·개선 제안 캠페인 범위로 상담 제공하며, 실시간 셀프 진단 웹앱은 별도 연동 영역입니다.',
    currentDeliveryMode: 'GEO 현황 진단 → 콘텐츠·구조 개선안 제시 → 반영(운영관리/자체) → 재측정',
    highlights: [
      'AI 검색 환경 변화에 맞춘 정보 구조·질문응답 명확화',
      'GEO 진단 기준 기반의 콘텐츠·사이트 구조 점검',
      '개선 반영 후 재측정 및 단계적 보완',
    ],
    guardrailNote: '특정 AI 모델 답변 인용이나 노출 순위를 보장하지 않습니다.',
  },
  {
    slug: 'backlink',
    order: 3,
    name: 'BACKLINK',
    subtitle: '외부 링크 전략',
    tagline: '사전 사이트 분석과 업종 맥락에 맞는 건강한 링크 전략을 설계합니다.',
    summary:
      '무분별한 대량 링크를 지양하고, 도메인 이력·랜딩 완성도 분석과 합리적인 예산 검토를 바탕으로 외부 참조 전략을 안내합니다.',
    category: 'separate_marketing',
    dedicatedRoute: '/backlink',
    activeRoute: '/backlink',
    contactQueryKey: 'backlink',
    provisionPolicy: 'separate_service',
    policyDetail: '별도 전문 마케팅 캠페인으로 예산과 사이트 단계에 맞춰 개별 협의합니다.',
    operationalStatus: 'consultation_scoped',
    statusDetail: '사전 사이트 분석 및 적합성 검토 후 캠페인 범위를 안내합니다.',
    currentDeliveryMode: '사전 사이트 진단 → URL 배분·링크 전략 설계 → 예산 검토 → 캠페인 진행',
    highlights: [
      '도메인 이력 및 핵심 랜딩 완성도 사전 진단',
      '브랜드·서비스 맥락에 맞는 URL 배분 전략',
      '무리 없는 속도와 예산 범위 중심의 캠페인 설계',
    ],
    guardrailNote: '단기 순위 급상승이나 특정 검색 순위 결과를 보장하지 않습니다.',
  },
  {
    slug: 'traffic',
    order: 4,
    name: 'TRAFFIC',
    subtitle: '웹사이트 유입 전략',
    tagline: '목적과 전환 구조에 맞는 전략적 웹사이트 유입을 설계합니다.',
    summary:
      '유입 목적, 운영 방식, 활용 조건과 유의사항을 투명하게 정리해 홈페이지 상담 전환 구조와 함께 작동하는 트래픽 전략을 안내합니다.',
    category: 'separate_marketing',
    dedicatedRoute: '/traffic',
    activeRoute: '/traffic',
    contactQueryKey: 'traffic',
    provisionPolicy: 'separate_service',
    policyDetail: '별도 전문 유입 서비스로 목적·조건·유의사항을 사전 확인 후 협의합니다.',
    operationalStatus: 'consultation_scoped',
    statusDetail: '도착 페이지 준비 상태와 활용 조건을 사전 검토한 뒤 상담으로 진행합니다.',
    currentDeliveryMode: '유입 목적·조건 검토 → 도착 페이지 점검 → 운영 방식 안내 → 결과 점검',
    highlights: [
      '홈페이지 전환 구조와 연계한 유입 목적 정의',
      '서비스 방식과 활용 조건의 사전 투명 안내',
      '검색·콘텐츠 전략과의 균형 있는 병행 검토',
    ],
    guardrailNote: '단순 방문 수치 확대만으로 매출이나 순위 상승을 보장하지 않습니다.',
  },
  {
    slug: 'domain',
    order: 5,
    name: 'DOMAIN',
    subtitle: '도메인 선택·연결·전략',
    tagline: '브랜드 도메인 선택부터 기존 메일 보존 연결, HTTPS 보안까지 관리합니다.',
    summary:
      '신규 브랜드 도메인 선정, 기존 도메인 이력 분석, 기업 메일(MX·SPF) 레코드를 보호하는 무중단 DNS 연결 및 SSL 보안 설정을 지원합니다.',
    category: 'separate_marketing',
    dedicatedRoute: '/domain',
    activeRoute: '/domain',
    contactQueryKey: 'domain',
    provisionPolicy: 'separate_service',
    policyDetail: '기본 도메인 연결은 제작·운영과 함께 지원하며, 도메인 전략 분석·이관 컨설팅은 별도 협의합니다.',
    operationalStatus: 'live',
    statusDetail: '도메인 연결, 메일 레코드 보존, HTTPS SSL 설정 및 도메인 전략 상담을 정상 제공합니다.',
    currentDeliveryMode: '도메인·DNS 현황 점검 → 메일 레코드 보호 설정 → 웹 연결·SSL 적용',
    highlights: [
      '브랜드 신뢰와 검색을 고려한 도메인 선정·분석',
      '기존 회사 이메일(MX·SPF) 무손상 DNS 연결',
      'HTTPS 보안 인증서(SSL) 및 표준 주소 정규화',
    ],
    guardrailNote: '도메인 자체의 등록·갱신 비용 및 소유권은 고객사 명의 기준을 원칙으로 합니다.',
  },
  {
    slug: 'content',
    order: 6,
    name: 'AI 콘텐츠',
    subtitle: '콘텐츠 제작·검수 워크플로',
    tagline: '기획·AI 초안·담당자 검수 흐름으로 콘텐츠 운영 시간을 줄입니다.',
    summary:
      '기업 자료 기반의 콘텐츠 기획과 AI 초안, 담당자 사실 검수 워크플로를 제공하며 향후 루틴(콘텐츠 자동발행) 도구와 유기적으로 연결됩니다.',
    category: 'separate_marketing',
    dedicatedRoute: '/content',
    activeRoute: '/content',
    contactQueryKey: 'content',
    provisionPolicy: 'separate_service',
    policyDetail: '콘텐츠 제작 분량과 검수·반영 방식에 따라 별도 제공 범위 상담으로 진행합니다.',
    operationalStatus: 'consultation_scoped',
    statusDetail: '기획·AI 초안·담당자 검수 워크플로는 상담 제공 가능하며, 완전 자동 연동 및 외부 SNS 자동 게시는 연동 준비 중입니다.',
    currentDeliveryMode: '주제 기획 → AI 초안 → 담당자·고객사 사실 검수 → 원고 납품/운영관리 반영',
    highlights: [
      '브랜드 어조와 사실 정확도를 지키는 검수 중심 워크플로',
      'SEO·GEO 친화적 소제목·요약·FAQ 구조화',
      '루틴(콘텐츠 자동발행) 및 운영관리와 연계 가능한 확장 기반',
    ],
    guardrailNote:
      'ONOFF Builder 완전 자동 연동 및 외부 SNS 자동 게시는 현재 연동 준비 중이며, 무검수 자동 발행을 지양합니다.',
  },
];

/**
 * 전체 제공 항목 통합 레지스트리
 */
export const ALL_PLATFORM_OFFERINGS: PlatformOffering[] = [
  ...WEBSITE_BASE_OFFERINGS,
  ...CORE_CAPABILITIES,
  ...SEPARATE_MARKETING_SERVICES,
];

const OFFERING_MAP = new Map<OfferingSlug, PlatformOffering>(
  ALL_PLATFORM_OFFERINGS.map((item) => [item.slug, item])
);

export function getOfferingBySlug(slug: OfferingSlug): PlatformOffering | undefined {
  return OFFERING_MAP.get(slug);
}

export function getOfferingsByCategory(category: CapabilityCategory): PlatformOffering[] {
  return ALL_PLATFORM_OFFERINGS.filter((item) => item.category === category);
}

export function getOfferingsByStatus(status: OperationalStatus): PlatformOffering[] {
  return ALL_PLATFORM_OFFERINGS.filter((item) => item.operationalStatus === status);
}
