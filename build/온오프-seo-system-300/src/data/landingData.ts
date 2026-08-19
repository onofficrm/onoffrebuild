import { TimelineItem, RoadmapStep, SystemItem, FaqItem } from '../types';

export const KAKAO_CHAT_URL = 'http://pf.kakao.com/_MTlNK/chat';
export const LANDING_URL = 'https://onoff.icrm.co.kr/seo-system';

/** YouTube video ID only. Empty = keep Hero placeholder. Do not invent a URL. */
export const SEO_SYSTEM_VIDEO_ID = '';
export const SEO_SYSTEM_VIDEO_URL = '';

export function systemHref(host?: string): string {
  if (!host) return '';
  if (/^https?:\/\//i.test(host)) return host;
  return `https://${host}`;
}

export const HERO_BENEFITS = [
  { id: 'site', title: '맞춤 SEO 홈페이지 제작', subtitle: '1:1 전용 사이트 구축', highlight: false },
  { id: 'domain', title: '낙장도메인 30만원 지원', subtitle: 'CatchDomain 실사용금액', highlight: true },
  { id: 'backlink', title: '백링크 70만원 지원', subtitle: 'Backlink Auto 작업금액', highlight: true },
  { id: 'traffic', title: '트래픽 100만원 지원', subtitle: '실제 충전금 제공', highlight: true },
  { id: 'meet', title: '1:1 Google Meet 실전교육', subtitle: '수강생 맞춤 일정 조율', highlight: true },
];

export const TIMELINE_DATA: TimelineItem[] = [
  {
    year: '2018',
    title: 'SEO 실전 시작',
    description: '웹사이트 제작 및 검색 상위노출 실전 작업 시작',
    tag: 'START'
  },
  {
    year: '2020',
    title: '웹사이트·키워드 실전 테스트',
    description: '수많은 사이트와 키워드를 통한 알고리즘 및 노출 메커니즘 검증',
    tag: 'TEST'
  },
  {
    year: '2022',
    title: 'SEO 실무 노하우 및 교육 경험 축적',
    description: '현업 실전 중심의 체계적인 SEO 운영 프레임워크 정립',
    tag: 'KNOW-HOW'
  },
  {
    year: '2024',
    title: 'AI·자동화를 SEO 업무에 적용',
    description: '반복적인 리서치와 콘텐츠 제작을 자동화 파이프라인으로 전환',
    tag: 'AUTOMATION'
  },
  {
    year: '2026',
    title: 'SEO 실행 시스템 직접 개발',
    description: '도메인·콘텐츠·백링크·트래픽을 직접 다루는 전용 인프라 완성',
    tag: 'SYSTEM'
  }
];

export const ROADMAP_STEPS: RoadmapStep[] = [
  {
    step: 'STEP 01',
    title: '낙장도메인을 찾습니다.',
    serviceName: 'CatchDomain',
    serviceUrl: 'domain.icrm.co.kr',
    description: 'SEO 관점에서 가치 있는 낙장도메인을 탐색·분석하여 구매하는 실무를 진행합니다.',
    benefitBadge: '30만원 사용금액 제공',
    details: [
      '낙장도메인 탐색',
      'SEO 가치 분석',
      '구매 판단'
    ]
  },
  {
    step: 'STEP 02',
    title: '내 사업에 맞는 홈페이지를 만듭니다.',
    serviceName: '맞춤 SEO 홈페이지 제작',
    description: '수강생의 사업과 목표 키워드에 맞춘 검색엔진 최적화 구조 사이트를 직접 제작해 드립니다.',
    benefitBadge: '맞춤 SEO 홈페이지 제작 포함',
    details: [
      '사업/키워드 분석',
      'SEO 사이트 구조 설계',
      '모바일 최적화'
    ]
  },
  {
    step: 'STEP 03',
    title: '콘텐츠를 자동화합니다.',
    serviceName: 'Content Automation',
    serviceUrl: 'icrm.co.kr',
    description: '전통적 SEO뿐 아니라 생성형 AI 검색(GEO)과 AI 답변 엔진(AEO)까지 자동화 파이프라인으로 구축합니다.',
    benefitBadge: 'SEO + GEO + AEO',
    details: [
      '키워드 리서치',
      'SEO + GEO + AEO',
      '콘텐츠 운영 자동화'
    ]
  },
  {
    step: 'STEP 04',
    title: '백링크를 구축합니다.',
    serviceName: 'Backlink Automation',
    serviceUrl: 'backlink.icrm.co.kr',
    description: '사이트 분석을 기반으로 최적화된 백링크 전략을 세우고 안전하게 배포합니다.',
    benefitBadge: '70만원 작업금액 제공',
    details: [
      '사이트 분석',
      '백링크 전략',
      '작업 및 결과 관리'
    ]
  },
  {
    step: 'STEP 05',
    title: '트래픽을 운영합니다.',
    serviceName: 'Traffic Automation',
    serviceUrl: 'icrm.co.kr',
    description: '목표 키워드 유입과 사용자 반응 신호를 위한 트래픽 캠페인을 설정하고 운영합니다.',
    benefitBadge: '100만원 트래픽 충전 제공',
    details: [
      '캠페인 설정',
      '트래픽 운영',
      '실행 관리'
    ]
  }
];

export const SYSTEM_LIST: SystemItem[] = [
  {
    id: 'catchdomain',
    title: 'CatchDomain',
    serviceUrl: 'domain.icrm.co.kr',
    subtitle: 'SEO를 위한 낙장도메인 탐색 시스템',
    features: [
      '낙장도메인 탐색',
      'SEO 가치 확인',
      '후보 비교 및 스팸 필터링',
      '구매 판단'
    ],
    mockupType: 'domain',
    previewStats: [
      { label: '지원 금액', value: '300,000원 제공' },
      { label: '서비스 URL', value: 'domain.icrm.co.kr' }
    ]
  },
  {
    id: 'website',
    title: 'SEO Website',
    subtitle: '수강생 맞춤형 SEO 홈페이지 제작',
    features: [
      '수강생 업종 및 비즈니스 분석',
      '시맨틱 HTML5 구조 설계',
      '모바일 퍼스트 반응형 최적화',
      '콘텐츠 확장형 구조'
    ],
    mockupType: 'website',
    previewStats: [
      { label: '제작 형태', value: '1:1 맞춤 제작 포함' },
      { label: '최적화', value: '검색엔진 규격 준수' }
    ]
  },
  {
    id: 'content_traffic',
    title: 'Content & Traffic Automation',
    serviceUrl: 'icrm.co.kr',
    subtitle: '콘텐츠와 트래픽을 반복 실행할 수 있는 자동화 환경',
    features: [
      '키워드 리서치 및 콘텐츠 자동화',
      'SEO + GEO + AEO 다층 대응',
      '트래픽 캠페인 세팅 및 운영',
      '실행 관리 콘솔'
    ],
    mockupType: 'content_traffic',
    previewStats: [
      { label: '트래픽 지원', value: '1,000,000원 충전' },
      { label: '서비스 URL', value: 'icrm.co.kr' }
    ]
  },
  {
    id: 'backlink',
    title: 'Backlink Automation',
    serviceUrl: 'backlink.icrm.co.kr',
    subtitle: '백링크 분석·선택·운영 시스템',
    features: [
      '백링크 탐색 및 사이트 분석',
      '안전한 링크 배포 전략',
      '작업 현황 대시보드 관리',
      '실행 결과 리포트'
    ],
    mockupType: 'backlink',
    previewStats: [
      { label: '지원 금액', value: '700,000원 제공' },
      { label: '서비스 URL', value: 'backlink.icrm.co.kr' }
    ]
  }
];

export const ASSET_CARDS = [
  { num: '①', title: '나의 도메인', desc: '검증된 히스토리와 가치를 지닌 실전 도메인 자산' },
  { num: '②', title: '나의 홈페이지', desc: '내 사업 키워드에 최적화된 고퀄리티 맞춤형 웹사이트' },
  { num: '③', title: '콘텐츠 운영환경', desc: 'SEO, GEO, AEO를 모두 아우르는 지속 가능한 제작 파이프라인' },
  { num: '④', title: '백링크 작업환경', desc: '직접 선택하고 모니터링할 수 있는 백링크 자동화 시스템' },
  { num: '⑤', title: '트래픽 운영환경', desc: '캠페인을 직접 세팅하고 집행할 수 있는 트래픽 콘솔' },
  { num: '⑥', title: '1:1 실전 노하우 & 자산', desc: '내 사업을 기준으로 1:1 전수받은 평생 가는 검색 최적화 역량' },
];

export const TARGET_AUDIENCE = [
  {
    title: '내 사업을 검색에서 노출시키고 싶은 대표',
    desc: '외주 대행에 의존하지 않고 내 사업만의 검색 유입 경쟁력을 구축하고 싶은 분'
  },
  {
    title: '단체강의보다 개인지도가 필요한 분',
    desc: 'SEO 경험과 사업환경이 모두 다르기 때문에 내 프로젝트를 기준으로 직접 배우고 싶은 분'
  },
  {
    title: 'SEO 대행 또는 마케팅 사업을 시작하고 싶은 분',
    desc: '도메인, 사이트, 백링크 인프라를 직접 다루며 전문 대행 서비스를 런칭할 분'
  },
  {
    title: '홈페이지로 새로운 수익모델을 만들고 싶은 분',
    desc: '검색 트래픽을 기반으로 제휴 마케팅, 리드 생성 파이프라인을 만들고 싶은 분'
  },
  {
    title: 'SEO를 배웠지만 실제 실행에서 막혔던 분',
    desc: '강의를 들어도 도메인 구매, 사이트 코딩, 백링크 세팅에서 중단했던 분'
  },
  {
    title: 'SEO에서 GEO와 AEO까지 준비하고 싶은 분',
    desc: '검색 포털뿐 아니라 ChatGPT, Perplexity 등 생성형 AI 검색까지 대비할 분'
  }
];

export const ANTI_TARGET = [
  '강의만 듣고 실행하지 않을 분',
  '단기간 검색 1위를 보장받고 싶은 분',
  '노력 없이 자동으로 수익이 발생하기를 원하는 분'
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: '강의는 어떤 방식으로 진행되나요?',
    answer: 'SEO SYSTEM 300은 녹화강의 중심의 교육이 아니라 1:1 Google Meet 실전교육으로 진행됩니다. 수강생이 가능한 시간대를 기준으로 강사와 일정을 조율한 후 Google Meet으로 만나 진행합니다. 단순히 화면을 보며 설명하는 것이 아니라 수강생의 실제 도메인, 홈페이지, 콘텐츠, 백링크, 트래픽 환경을 함께 확인하며 실전 중심으로 진행합니다.'
  },
  {
    question: '정해진 강의시간이 있나요?',
    answer: '정해진 단체 강의시간에 모든 수강생이 맞추는 방식이 아닙니다. 수강생이 가능한 시간대를 기준으로 개별 일정을 조율하여 진행합니다. 구체적인 수업 일정은 등록 후 1:1로 협의합니다.'
  },
  {
    question: '여러 명이 함께 듣는 강의인가요?',
    answer: '아닙니다. 강사와 수강생이 1:1로 진행하는 개인 실전교육입니다. 각 수강생의 사업과 SEO 프로젝트가 다르기 때문에 본인의 실제 사이트를 기준으로 진행하는 것을 원칙으로 합니다.'
  },
  {
    question: '초보자도 가능한가요?',
    answer: '네, 가능합니다. 1:1 개인 교육이므로 수강생의 수준에 맞춰 기초부터 시스템 운용까지 단계별로 밀착 지도해 드리며, 낙장도메인 선정부터 홈페이지 제작, 시스템 인프라를 모두 세팅해 드리므로 초보자도 직접 실행하실 수 있습니다.'
  },
  {
    question: '홈페이지를 제작해 주나요?',
    answer: '네, 맞습니다. 단순 샘플 템플릿이 아니라 수강생의 실제 업종, 타깃 키워드, 비즈니스 목적에 맞추어 검색엔진 크롤링과 인덱싱에 최적화된 고퀄리티 맞춤형 SEO 홈페이지를 1:1로 직접 제작하여 제공합니다.'
  },
  {
    question: '낙장도메인 30만원 사용방법은 어떻게 되나요?',
    answer: '전용 낙장도메인 탐색 시스템인 CatchDomain(domain.icrm.co.kr)에서 SEO 가치와 히스토리가 검증된 도메인을 선별하여 구매할 수 있는 실사용 금액 30만원이 지급됩니다.'
  },
  {
    question: '백링크 70만원 사용방법은 어떻게 되나요?',
    answer: 'Backlink Automation(backlink.icrm.co.kr) 시스템을 통해 제작된 홈페이지의 도메인 파워를 높이기 위한 백링크 배포 작업에 70만원 상당의 작업 크레딧을 직접 사용하실 수 있습니다.'
  },
  {
    question: '트래픽 100만원 사용방법은 어떻게 되나요?',
    answer: 'icrm.co.kr 시스템에서 사이트의 실제 검색 유입과 사용자 반응 신호를 테스트하고 활성화하기 위한 트래픽 캠페인 충전금 100만원이 지급됩니다.'
  },
  {
    question: '시스템 이용방법 및 유지 기간은 어떻게 되나요?',
    answer: '본 프로그램은 수강 후에도 제공된 도메인, 제작된 홈페이지, 시스템 계정과 인프라가 수강생 본인의 영구적인 자산으로 남도록 설계되어 있습니다.'
  },
  {
    question: '문의와 신청은 어디서 하나요?',
    answer: '모든 상담 및 참가 신청은 공식 카카오톡 채널(http://pf.kakao.com/_MTlNK/chat)을 통해 1:1로 신속하고 상세하게 진행됩니다.'
  }
];
