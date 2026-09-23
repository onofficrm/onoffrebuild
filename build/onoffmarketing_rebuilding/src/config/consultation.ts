export type ConsultationMode = 'PREVIEW' | 'LIVE';

/**
 * OFF: 계약 단계 없음
 * MANUAL: 요약·약관만 (서명 없음, 담당자 후속)
 * SELF: 사이트 내 서명 패드 (기본 — SaaS 불필요)
 */
export type ContractMode = 'OFF' | 'MANUAL' | 'SELF';

export type ContractPackageId =
  | 'general'
  | 'education'
  | 'marketing'
  | 'education-marketing'
  | 'backlink'
  | 'traffic'
  | 'content'
  | 'domain'
  | 'geo';

export interface ContractPackage {
  id: ContractPackageId;
  title: string;
  scope: string[];
  period: string;
  feeNote: string;
  topicKeys: string[];
}

export interface ConsultationConfig {
  mode: ConsultationMode;
  endpoint: string;
  tokenEndpoint: string;
  privacyPolicyUrl: string;
  termsUrl: string;
  contractMode: ContractMode;
  contractPackages: Record<ContractPackageId, ContractPackage>;
  defaultPackageId: ContractPackageId;
  liveReadyChecklist: string[];
}

/**
 * Option 2 + 자체 서명: 신청 1단계 → 계약 요약·약관·서명 2단계 → 접수
 * 서명 PNG는 /proc/inquiry-submit.php 의 signature_data 로 저장.
 */
export const CONSULTATION_CONFIG: ConsultationConfig = {
  mode: 'LIVE',
  endpoint: '/proc/inquiry-submit.php',
  tokenEndpoint: '/proc/inquiry-token.php',
  privacyPolicyUrl: 'https://onoff.icrm.co.kr/bbs/content.php?co_id=privacy',
  termsUrl: 'https://onoff.icrm.co.kr/bbs/content.php?co_id=provision',
  contractMode: 'SELF',
  defaultPackageId: 'general',
  contractPackages: {
    general: {
      id: 'general',
      title: '온오프마케팅 서비스 신청·계약',
      scope: [
        '검색·AI 노출(SEO/GEO) 진단 및 실행 방향 제안',
        '선택한 서비스(홈페이지·콘텐츠·백링크 등) 범위 협의',
        '킥오프 일정 및 담당자 배정',
      ],
      period: '계약서 기재 기간 (통상 1~3개월, 협의)',
      feeNote: '서비스·규모에 따라 상담 후 확정',
      topicKeys: ['SEO', '홈페이지', '잘 모르겠습니다'],
    },
    education: {
      id: 'education',
      title: '온오프 아카데미 수강·제작 신청',
      scope: [
        'SEO·GEO 실무 커리큘럼 수강',
        '실습·피드백 및 클래스룸 안내',
        '맞춤 제작이 필요한 경우 별도 범위 협의',
      ],
      period: '과정 일정에 따름 (수강 안내서 기준)',
      feeNote: '과정·옵션에 따라 상담 후 확정',
      topicKeys: ['EDUCATION'],
    },
    marketing: {
      id: 'marketing',
      title: '온오프마케팅 의뢰 신청',
      scope: [
        'SEO·GEO·홈페이지·콘텐츠·백링크·트래픽 등 마케팅 실행 범위 협의',
        '전담 매니저 배정 및 킥오프·진행 리포트',
        '교육 플랫폼을 통한 프로젝트·주문·수정요청 관리',
      ],
      period: '계약서 기재 기간 (통상 1~3개월, 협의)',
      feeNote: '서비스·규모에 따라 상담 후 확정',
      topicKeys: ['MARKETING'],
    },
    'education-marketing': {
      id: 'education-marketing',
      title: '온오프 아카데미 수강 + 마케팅 의뢰',
      scope: [
        'SEO·GEO 실무 커리큘럼 수강 및 클래스룸 안내',
        '마케팅 실행(홈페이지·콘텐츠·백링크·트래픽 등) 범위 협의',
        '교육 플랫폼을 통한 학습·프로젝트·주문 통합 관리',
      ],
      period: '수강·의뢰 일정에 따름 (안내서·견적 기준)',
      feeNote: '수강료·마케팅 비용은 상담 후 각각 확정',
      topicKeys: ['EDUCATION_MARKETING'],
    },
    backlink: {
      id: 'backlink',
      title: 'BACKLINK 파트너·플레이스먼트 신청',
      scope: [
        'Publisher·Placement 매칭 및 캠페인 운영',
        '게재 현황·리포트 공유',
        '브랜드 가이드라인 준수',
      ],
      period: '캠페인 단위 또는 월 단위 (협의)',
      feeNote: '물량·매체 등급에 따라 상담 후 확정',
      topicKeys: ['BACKLINK'],
    },
    traffic: {
      id: 'traffic',
      title: 'TRAFFIC 유입·캠페인 신청',
      scope: [
        '유입 채널·캠페인 설계 및 실행',
        '성과 지표 모니터링',
        '랜딩·전환 개선 방향 제안',
      ],
      period: '캠페인 기간 (협의)',
      feeNote: '예산·채널에 따라 상담 후 확정',
      topicKeys: ['TRAFFIC'],
    },
    content: {
      id: 'content',
      title: 'CONTENT 제작·배포 신청',
      scope: [
        '검색·AI 노출을 고려한 콘텐츠 기획·제작',
        '배포·검수 프로세스',
        '저작권·활용 범위는 계약서에 명시',
      ],
      period: '제작 일정에 따름 (협의)',
      feeNote: '분량·형식에 따라 상담 후 확정',
      topicKeys: ['CONTENT'],
    },
    domain: {
      id: 'domain',
      title: 'DOMAIN 조사·확보 신청',
      scope: [
        'SEO 관점 도메인 조사·후보 제시',
        '확보·이전 절차 안내',
        '리스크·히스토리 체크 결과 공유',
      ],
      period: '조사·확보 건별 (협의)',
      feeNote: '도메인 시세·조사 범위에 따라 상담 후 확정',
      topicKeys: ['DOMAIN'],
    },
    geo: {
      id: 'geo',
      title: 'GEO / AI 노출 컨설팅 신청',
      scope: [
        'AI·검색 노출 진단',
        '개선 우선순위 및 실행 로드맵',
        '필요 시 연계 서비스(콘텐츠·백링크 등) 제안',
      ],
      period: '진단·컨설팅 기간 (협의)',
      feeNote: '범위에 따라 상담 후 확정',
      topicKeys: ['GEO / AI 노출'],
    },
  },
  liveReadyChecklist: [
    'CSRF token from GET /proc/inquiry-token.php',
    'POST FormData to /proc/inquiry-submit.php',
    'Required: name, phone, message, privacy_agree, onoff_inquiry_token',
    'SELF mode: signature_data (PNG base64) required',
    'Optional: email, referer_page',
    'Honeypot website_url must be empty',
    'JSON { success: true } required — never trust HTTP 200 alone',
    'Verify inquiry board row + signature file only in non-production / staging DB',
  ],
};

export function resolveContractPackage(topics: string[]): ContractPackage {
  const { contractPackages, defaultPackageId } = CONSULTATION_CONFIG;
  for (const topic of topics) {
    for (const pkg of Object.values(contractPackages)) {
      if (pkg.topicKeys.includes(topic)) {
        return pkg;
      }
    }
  }
  return contractPackages[defaultPackageId];
}

/** Course IDs used by enrollment / contract signing pages. */
export const SERVICE_COURSE_IDS = {
  education: 'seo-geo-master',
  marketing: 'marketing-service',
  combined: 'education-marketing',
} as const;

export function courseIdForPackage(packageId: ContractPackageId | string): string {
  if (packageId === 'marketing') return SERVICE_COURSE_IDS.marketing;
  if (packageId === 'education-marketing') return SERVICE_COURSE_IDS.combined;
  if (packageId === 'education') return SERVICE_COURSE_IDS.education;
  return SERVICE_COURSE_IDS.education;
}

export function contractPathForCourse(courseId: string): string {
  if (courseId === SERVICE_COURSE_IDS.marketing || courseId === SERVICE_COURSE_IDS.combined) {
    return '/seo-system-300/contract';
  }
  return '/education/contract';
}

export function resolveContractMode(): ContractMode {
  return CONSULTATION_CONFIG.contractMode;
}

/** SELF 모드에서는 사이트 내 서명 필수 */
export function requiresInAppSignature(): boolean {
  return resolveContractMode() === 'SELF';
}
