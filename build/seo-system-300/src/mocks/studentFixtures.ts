/**
 * DEMO FIXTURES ONLY — not GNUBoard / production data.
 * Do not import this from live API services.
 */
import {
  Project,
  WebsiteOrder,
  RevisionTicket,
  RoadmapStep,
  DailyMission,
  DomainItem,
  ContentItem,
  BacklinkItem,
  TrafficCampaign,
  AiCoachInsight,
  ActivityLog,
  CurriculumLesson,
  NotificationItem,
  TaskWorkLog,
  SeoActivityTimelineItem
} from '../types';

export interface DetailedRoadmapStep extends RoadmapStep {
  whyNeeded: string;
  completionCriteria: string;
  currentResult: string;
  lectureTitle: string;
  lectureDuration: string;
  toolName?: string;
  toolActionUrl?: string;
  ctaText: string;
}

export interface DetailedDailyMission extends DailyMission {
  estimatedTime: string;
  lectureDuration?: string;
  lectureTitle?: string;
  toolName?: string;
  actionButtonLabel: string;
}

export const INITIAL_PROJECT: Project = {
  id: 'proj-cebu-01',
  name: '세부여행 SEO 프로젝트',
  domain: 'cebutrip.co.kr',
  niche: '해외여행 / 동남아 리조트 / 액티비티',
  status: 'in_progress',
  overallProgress: 63,
  currentStep: 'STEP 5 콘텐츠',
  nextGoal: '콘텐츠 30개 발행',
  moduleProgress: {
    website: 100,
    seoSetup: 80,
    content: 42,
    backlink: 25,
    traffic: 20
  },
  metrics: {
    googleImpressions: 8240,
    impressionsGrowth: 24,
    googleClicks: 394,
    clicksGrowth: 18,
    registeredKeywords: 78,
    contentCount: 32,
    referringDomains: 18,
    organicTraffic: 1284
  },
  gscConnected: true,
  gaConnected: true,
  createdAt: '2026-07-15'
};

export const MOCK_PROJECTS: Project[] = [
  INITIAL_PROJECT,
  {
    id: 'proj-jeju-02',
    name: '제주 독채풀빌라 마스터',
    domain: 'jejustay365.com',
    niche: '국내숙박 / 펜션예약',
    status: 'in_progress',
    overallProgress: 38,
    currentStep: 'STEP 4 SEO 기본 설정',
    nextGoal: 'GSC 및 Sitemap 제출',
    moduleProgress: {
      website: 100,
      seoSetup: 60,
      content: 20,
      backlink: 10,
      traffic: 0
    },
    metrics: {
      googleImpressions: 1420,
      impressionsGrowth: 45,
      googleClicks: 68,
      clicksGrowth: 32,
      registeredKeywords: 35,
      contentCount: 12,
      referringDomains: 5,
      organicTraffic: 240
    },
    gscConnected: false,
    gaConnected: true,
    createdAt: '2026-08-01'
  },
  {
    id: 'proj-it-03',
    name: 'SaaS 솔루션 비교 허브',
    domain: 'saasreview.kr',
    niche: 'B2B IT / 업무툴 비교',
    status: 'pending',
    overallProgress: 15,
    currentStep: 'STEP 3 도메인',
    nextGoal: 'CatchDomain 고품질 도메인 낙찰',
    moduleProgress: {
      website: 30,
      seoSetup: 0,
      content: 0,
      backlink: 0,
      traffic: 0
    },
    metrics: {
      googleImpressions: 0,
      impressionsGrowth: 0,
      googleClicks: 0,
      clicksGrowth: 0,
      registeredKeywords: 15,
      contentCount: 0,
      referringDomains: 0,
      organicTraffic: 0
    },
    gscConnected: false,
    gaConnected: false,
    createdAt: '2026-08-10'
  }
];

export const INITIAL_MISSIONS: (DailyMission & {
  estimatedTime?: string;
  lectureDuration?: string;
  lectureTitle?: string;
  toolName?: string;
  actionButtonLabel?: string;
})[] = [
  {
    id: 'm-1',
    title: '첫 콘텐츠 발행하기',
    description: 'Content Automation으로 메인 타겟 키워드 롱테일 아티클 1편 제작 및 웹사이트 발행',
    category: 'content',
    stepNumber: 6,
    xpReward: 100,
    isCompleted: false,
    dueDate: '오늘 23:59까지',
    targetTab: 'tools',
    targetSubTab: 'content',
    estimatedTime: '20분',
    lectureDuration: '12분',
    lectureTitle: 'E-E-A-T 기반 AI 아티클 구조화 실습',
    toolName: 'Content Automation',
    actionButtonLabel: '콘텐츠 자동화 열기'
  },
  {
    id: 'm-2',
    title: 'CatchDomain 후보 3개 확인',
    description: '동일 카테고리 고DA 만료도메인 3개 이상 필터링 후 북마크 저장 및 스팸 지수 점검',
    category: 'tool',
    stepNumber: 3,
    xpReward: 50,
    isCompleted: false,
    dueDate: '오늘 23:59까지',
    targetTab: 'tools',
    targetSubTab: 'catchdomain',
    estimatedTime: '15분',
    lectureDuration: '8분',
    lectureTitle: '만료도메인 스팸 필터링 및 DA 분석법',
    toolName: 'CatchDomain',
    actionButtonLabel: 'CatchDomain 열기'
  },
  {
    id: 'm-3',
    title: 'GSC Index 상태 확인',
    description: '구글 서치콘솔 색인 생성 보고서에서 등록 완료된 URL 수 및 미등록 사유 점검',
    category: 'seo_setup',
    stepNumber: 4,
    xpReward: 50,
    isCompleted: true,
    dueDate: '오늘 완료',
    targetTab: 'roadmap',
    targetSubTab: '4',
    estimatedTime: '10분',
    lectureDuration: '6분',
    lectureTitle: 'GSC 색인 커버리지 에러 디버깅',
    actionButtonLabel: 'GSC 상태 확인'
  },
  {
    id: 'm-4',
    title: '백링크 앵커 비율 점검',
    description: '브랜드명, 키워드, 일반어(URL) 5:3:2 황금비율 세팅 및 Referring Domains 리스트업',
    category: 'backlink',
    stepNumber: 7,
    xpReward: 80,
    isCompleted: false,
    dueDate: '내일 마감',
    targetTab: 'tools',
    targetSubTab: 'backlink',
    estimatedTime: '10분',
    lectureDuration: '15분',
    lectureTitle: '페널티 없는 안전한 백링크 네트워크',
    toolName: 'Backlink Builder',
    actionButtonLabel: '백링크 툴 열기'
  }
];

export const INITIAL_WEBSITE_ORDER: WebsiteOrder = {
  id: 'ord-20260718-09',
  projectId: 'proj-cebu-01',
  projectName: '세부여행 SEO 프로젝트',
  siteType: 'blog',
  targetNiche: '동남아 필리핀 세부 자유여행, 호핑투어, 마사지/리조트 리뷰',
  targetKeywords: ['세부 자유여행 코스', '세부 호핑투어 추천', '막탄 리조트 가성비', '세부 환전 팁'],
  theme: '모던 매거진형 여행 테마 (SEO 최적화 고속 스킨)',
  referenceUrls: ['https://example-travel-blog.com', 'https://sample-cebu-guide.net'],
  specialRequests: '구글 코어 웹 바이탈 점수 90점 이상 유지, 반응형 모바일 최적화, 자동 목차(TOC) 플러그인 포함 희망',
  status: 'delivered',
  currentStageName: '납품 완료 (운영 중)',
  progress: 100,
  eta: '2026-07-25 납품완료',
  assignedEngineer: '박진우 수석 퍼블리셔 (SYSTEM 300 전담팀)',
  liveUrl: 'https://cebutrip.co.kr',
  orderDate: '2026-07-18',
  milestones: [
    {
      id: 'ms-1',
      title: '기획 및 키워드 구조 검토',
      description: '사이트 실로(Silo) 구조 및 카테고리 SEO 맵핑',
      status: 'completed',
      completedAt: '2026-07-19'
    },
    {
      id: 'ms-2',
      title: 'UI/UX 디자인 및 템플릿 세팅',
      description: '모바일 반응형, 가독성 높은 폰트 및 카드 레이아웃',
      status: 'completed',
      completedAt: '2026-07-21'
    },
    {
      id: 'ms-3',
      title: '퍼블리싱 및 고속 로딩 최적화',
      description: 'CSS/JS 경량화, WebP 이미지 포맷 지원',
      status: 'completed',
      completedAt: '2026-07-23'
    },
    {
      id: 'ms-4',
      title: 'SEO 기본 태그 & 인덱싱 환경 구축',
      description: 'Robots.txt, Sitemap, Canonical, Schema Markup(Article, FAQ)',
      status: 'completed',
      completedAt: '2026-07-24'
    },
    {
      id: 'ms-5',
      title: '최종 QA 및 사이트 인도',
      description: '관리자 계정 전달 및 수강생 검수 승인',
      status: 'completed',
      completedAt: '2026-07-25'
    }
  ]
};

export const INITIAL_REVISIONS: RevisionTicket[] = [
  {
    id: 'rev-01',
    orderId: 'ord-20260718-09',
    title: '모바일 상단 헤더 로고 크기 축소 및 패딩 조정',
    category: 'design',
    priority: 'medium',
    status: 'completed',
    description: '아이폰 14 화면에서 헤더 영역이 너무 커서 콘텐츠 첫 문단이 가려지는 문제 수정 요청드립니다.',
    createdAt: '2026-07-26',
    updatedAt: '2026-07-27',
    devReply: '헤더 높이를 64px에서 52px로 조절하고 로고 여백을 최적화 완료했습니다.'
  },
  {
    id: 'rev-02',
    orderId: 'ord-20260718-09',
    title: '본문 자동 목차(TOC) H2, H3 태그 색상 변경 요청',
    category: 'layout',
    priority: 'low',
    status: 'completed',
    description: '목차 박스 테두리를 연한 블루(#2563eb)로 강조하고 클릭 시 부드러운 스크롤 적용 부탁드립니다.',
    createdAt: '2026-07-28',
    updatedAt: '2026-07-29',
    devReply: 'Smooth scroll 이벤트와 CSS 스타일 반영 완료되었습니다.'
  },
  {
    id: 'rev-03',
    orderId: 'ord-20260718-09',
    title: '푸터(Footer) 사업자 정보 및 제휴 문의 폼 링크 추가',
    category: 'content',
    priority: 'low',
    status: 'in_progress',
    description: '하단 푸터에 카카오톡 상담 채널 링크와 개인정보처리방침 팝업을 추가해주세요.',
    createdAt: '2026-08-16',
    updatedAt: '2026-08-17',
    devReply: '현재 퍼블리셔가 팝업 컴포넌트 연동 작업 중입니다. 오늘 18시 전 배포 예정입니다.'
  }
];

export const ROADMAP_STEPS: (RoadmapStep & {
  whyNeeded: string;
  completionCriteria: string;
  currentResult: string;
  lectureTitle: string;
  lectureDuration: string;
  toolName?: string;
  ctaText: string;
})[] = [
  {
    id: 1,
    stepNumber: 1,
    title: 'STEP 1 프로젝트 설정',
    subTitle: '수익형 니치 시장과 타겟 고객 정의',
    description: '경쟁 강도가 낮고 클릭 단가(CPC) 및 제휴 전환율이 높은 핵심 키워드군을 분석하고 사이트 주제를 확정합니다.',
    whyNeeded: '명확한 니치와 수익 모델이 정의되지 않으면 키워드 선점과 콘텐츠 기획이 분산되어 상위노출 기간이 3배 이상 길어집니다.',
    completionCriteria: '타겟 니치 확정, 상위 5개 경쟁사 벤치마킹 완료, 메인 카테고리 3개 구조화',
    currentResult: '동남아 세부 여행 니치 확정 및 리조트/호핑/맛집 3대 카테고리 수립 완료',
    lectureTitle: '01강. 수익형 니치 선정과 검색 의도(Intent) 분석',
    lectureDuration: '18분',
    status: 'completed',
    progress: 100,
    keyOutcome: '니치 시장 정의서 및 타겟 키워드 10개 추출 완료',
    durationEst: '1~2일',
    ctaText: '설정 확인',
    checklist: [
      { id: 'c1-1', text: '수익 모델(애드센스/어필리에이트/DB수집) 결정', completed: true, required: true },
      { id: 'c1-2', text: '경쟁 사이트 상위 5개 트래픽 및 키워드 벤치마킹', completed: true, required: true },
      { id: 'c1-3', text: '사이트 대분류 / 중분류 카테고리 구조도 작성', completed: true, required: true }
    ],
    lectureModuleId: 1
  },
  {
    id: 2,
    stepNumber: 2,
    title: 'STEP 2 홈페이지 준비',
    subTitle: 'SEO 최적화 전용 웹사이트 주문 및 고속 환경 구축',
    description: 'SYSTEM 300 전담 제작팀에 코어 웹 바이탈 90점 이상, 모바일 반응형, 실로(Silo) 아키텍처 기반의 웹사이트를 주문합니다.',
    whyNeeded: '구글은 페이지 로딩 속도(LCP)와 모바일 가독성을 핵심 랭킹 요소로 평가합니다. 잘못된 테마는 인덱싱을 방해합니다.',
    completionCriteria: '제작 주문서 접수, 모바일 검수 통과, 관리자 계정 인도 완료',
    currentResult: '제작 완료 (100% 납품 완료 / cebutrip.co.kr)',
    lectureTitle: '02강. 구글 친화적 Silo 웹사이트 구조와 코어 웹 바이탈',
    lectureDuration: '24분',
    toolName: '홈페이지 제작',
    connectedTool: 'website',
    status: 'completed',
    progress: 100,
    keyOutcome: '코어 웹 바이탈 95점 반응형 웹사이트 납품 완료',
    durationEst: '3~5일',
    ctaText: '홈페이지 현황 보기',
    checklist: [
      { id: 'c2-1', text: '홈페이지 제작 주문서 제출 및 기획 전달', completed: true, required: true },
      { id: 'c2-2', text: '모바일 폰트 가독성 및 헤더/푸터 검수', completed: true, required: true },
      { id: 'c2-3', text: '최종 납품 승인 및 관리자 계정 연동', completed: true, required: true }
    ],
    lectureModuleId: 2
  },
  {
    id: 3,
    stepNumber: 3,
    title: 'STEP 3 도메인',
    subTitle: 'CatchDomain 활용 고품질 만료도메인 또는 브랜드 도메인 연결',
    description: 'CatchDomain 도구로 과거 양질의 백링크 파워가 보존된 만료도메인을 발굴하거나 깔끔한 브랜드 도메인을 네임서버에 연결합니다.',
    whyNeeded: '검증된 만료도메인은 신규 도메인 대비 샌드박스 기간을 3~6개월 단축시키고 초기 인덱싱 속도를 극대화합니다.',
    completionCriteria: 'DA 20+ 도메인 낙찰 또는 신규 등록, DNS 연결, SSL 보안인증서 활성화',
    currentResult: 'cebutrip.co.kr (DA 24 / 스팸스코어 1%) 정상 연결',
    lectureTitle: '03강. CatchDomain으로 월 100만원 가치의 만료도메인 찾는 법',
    lectureDuration: '31분',
    toolName: 'CatchDomain',
    connectedTool: 'catchdomain',
    status: 'completed',
    progress: 100,
    keyOutcome: 'DA 24 클린 만료도메인 연결 및 SSL 발급 완료',
    durationEst: '1일',
    ctaText: '도메인 정보 확인',
    checklist: [
      { id: 'c3-1', text: 'CatchDomain에서 스팸 이력 없는 히스토리 검증', completed: true, required: true },
      { id: 'c3-2', text: 'Wayback Machine으로 이전 사이트 콘텐츠 적합성 확인', completed: true, required: true },
      { id: 'c3-3', text: 'DNS 및 네임서버 호스팅 연결', completed: true, required: true }
    ],
    lectureModuleId: 3
  },
  {
    id: 4,
    stepNumber: 4,
    title: 'STEP 4 SEO 기본 설정',
    subTitle: 'GSC, GA4, Robots, Sitemap 등 테크니컬 SEO 기초',
    description: '구글 서치콘솔과 구글 애널리틱스를 완벽하게 연결하고 사이트맵 및 구조화 데이터(Schema.org)를 주입합니다.',
    whyNeeded: '구글 크롤러가 웹사이트의 모든 페이지를 빠짐없이 수집하고 색인(Index)하도록 만드는 필수 통로입니다.',
    completionCriteria: 'GSC 소유권 확인, sitemap.xml 정상 제출(성공), GA4 실시간 트래픽 연동',
    currentResult: 'GSC 연동 완료, Sitemap 제출 완료 (색인 대기 8건 점검중)',
    lectureTitle: '04강. 10분 만에 끝내는 구글 서치콘솔 & 테크니컬 SEO 세팅',
    lectureDuration: '20분',
    status: 'completed',
    progress: 100,
    keyOutcome: '구글 검색엔진 크롤러 접근 허용 및 정상 수집 승인',
    durationEst: '1일',
    ctaText: 'GSC 설정 확인',
    checklist: [
      { id: 'c4-1', text: 'Google Search Console 소유권 인증', completed: true, required: true },
      { id: 'c4-2', text: 'sitemap.xml 및 robots.txt 제출 및 색인 요청', completed: true, required: true },
      { id: 'c4-3', text: 'GA4 트래픽 추적 코드 삽입 및 이벤트 설정', completed: true, required: true },
      { id: 'c4-4', text: 'OpenGraph & Schema.org 구조화 데이터 점검', completed: true, required: false }
    ],
    lectureModuleId: 4
  },
  {
    id: 5,
    stepNumber: 5,
    title: 'STEP 5 키워드 전략',
    subTitle: '메인/서브/롱테일 키워드 300개 마인드맵 구축',
    description: '검색 의도(Search Intent)별로 유입용 롱테일과 수익용 상위 키워드를 체계적으로 클러스터링하여 콘텐츠 기획표를 완성합니다.',
    whyNeeded: '초기 사이트는 경쟁이 센 메인 키워드 대신 롱테일 키워드를 먼저 장악해야 점진적인 도메인 신뢰도를 획득합니다.',
    completionCriteria: '골든 롱테일 키워드 50개 확보, 토픽 클러스터 맵핑 완료',
    currentResult: '등록 키워드 78개 / 상위 진입 타겟 25개 모니터링 중',
    lectureTitle: '05강. 월 1,000 클릭을 만드는 황금 롱테일 키워드 발굴 공식',
    lectureDuration: '28분',
    status: 'in_progress',
    progress: 80,
    keyOutcome: '필수 롱테일 키워드 100개 및 제목 템플릿 확보',
    durationEst: '2~3일',
    ctaText: '키워드 전략 계속하기',
    checklist: [
      { id: 'c5-1', text: '골든 키워드(검색량 대비 문서수 적은 틈새 키워드) 50개 발굴', completed: true, required: true },
      { id: 'c5-2', text: '토픽 클러스터별 필라 페이지 및 서브 페이지 트리 구성', completed: true, required: true },
      { id: 'c5-3', text: '타겟 키워드 78개 Control Center 등록', completed: true, required: true },
      { id: 'c5-4', text: '상위 1~3위 경쟁사 본문 길이 및 헤딩 태그 H2/H3 분석', completed: false, required: false }
    ],
    lectureModuleId: 5
  },
  {
    id: 6,
    stepNumber: 6,
    title: 'STEP 6 콘텐츠',
    subTitle: 'Content Automation 연동 고품질 SEO 아티클 발행',
    description: 'SYSTEM 300 콘텐츠 자동화 툴을 활용하여 E-E-A-T 기준을 충족하는 아티클을 매일 일정한 주기로 자동/반자동 발행합니다.',
    whyNeeded: '지속적이고 일관된 콘텐츠 발행은 구글 크롤러의 방문 빈도를 높이고 사이트 전체의 주제 전문성을 인정받게 합니다.',
    completionCriteria: '최소 30개 이상 고품질 아티클 발행, 내부 링크 구조 완성',
    currentResult: '32개 발행 완료 (목표 60개 중 53% 달성)',
    lectureTitle: '06강. E-E-A-T를 통과하는 AI 콘텐츠 자동화 발행 파이프라인',
    lectureDuration: '35분',
    toolName: 'Content Automation',
    connectedTool: 'content',
    status: 'in_progress',
    progress: 42,
    keyOutcome: '목표 30개 중 32개 발행 완료 (다음 목표: 60개)',
    durationEst: '지속 진행 (2주~4주)',
    ctaText: '콘텐츠 자동화 열기',
    checklist: [
      { id: 'c6-1', text: 'Content Automation API / 웹훅 연결', completed: true, required: true },
      { id: 'c6-2', text: '초기 10개 핵심 콘텐츠 발행 및 구글 수동 색인 요청', completed: true, required: true },
      { id: 'c6-3', text: '내부 링크(Internal Linking) 앵커 구조 연결', completed: false, required: true, helpTip: '상위 랭킹을 위해 글과 글 사이 맥락 있는 내부 링크가 필수입니다.' },
      { id: 'c6-4', text: '주당 최소 5개 이상 정기 예약 발행 스케줄링', completed: false, required: false }
    ],
    lectureModuleId: 6
  },
  {
    id: 7,
    stepNumber: 7,
    title: 'STEP 7 백링크',
    subTitle: '안전하고 강력한 Referring Domain 확대',
    description: '고DA PBN, 전문 기고(Guest Post), 니치 디렉토리 및 Web 2.0 백링크를 체계적인 앵커 텍스트 비율로 분산 주입합니다.',
    whyNeeded: '백링크는 구글 랭킹 알고리즘에서 가장 영향력 있는 투표권입니다. 고품질 Referring Domain이 랭킹 1페이지를 결정합니다.',
    completionCriteria: 'Referring Domain 30개 이상 확보, 앵커 텍스트 5:3:2 비율 유지',
    currentResult: 'Referring Domain 18개 구축 완료 (스팸 스코어 0%)',
    lectureTitle: '07강. 구글 페널티 없이 도메인 파워를 올리는 백링크 전략',
    lectureDuration: '40분',
    toolName: 'Backlink Builder',
    connectedTool: 'backlink',
    status: 'in_progress',
    progress: 25,
    keyOutcome: 'Referring Domain 18개 확보 (목표 50개)',
    durationEst: '지속 진행 (1개월+)',
    ctaText: '백링크 툴 열기',
    checklist: [
      { id: 'c7-1', text: '자연스러운 앵커 텍스트 비율 설정 (브랜드 50% / 키워드 30% / URL 20%)', completed: true, required: true },
      { id: 'c7-2', text: 'Tier 1 고품질 백링크 10개 주입 및 인덱싱 상태 확인', completed: false, required: true },
      { id: 'c7-3', text: '경쟁사 백링크 프로필 역추적 및 동일 출처 링크 획득', completed: false, required: false }
    ],
    lectureModuleId: 7
  },
  {
    id: 8,
    stepNumber: 8,
    title: 'STEP 8 트래픽',
    subTitle: '초기 검색 신호(Search Signals) 및 CTR 부스팅',
    description: 'Traffic Booster 서비스를 통해 타겟 키워드 검색 유입과 자연스러운 체류시간 신호를 제공하여 랭킹 상승을 가속화합니다.',
    whyNeeded: '구글은 유저의 클릭률(CTR)과 체류시간(Dwell time) 데이터를 보고 상위 랭킹을 확정짓습니다.',
    completionCriteria: '타겟 키워드 유입 캠페인 가동, 평균 체류시간 2분 이상 유지',
    currentResult: '오가닉 유입 1,284명 / Traffic 캠페인 2건 활성화',
    lectureTitle: '08강. 검색 신호(User Signals)와 CTR 부스팅을 통한 1위 탈환',
    lectureDuration: '22분',
    toolName: 'Traffic Booster',
    connectedTool: 'traffic',
    status: 'in_progress',
    progress: 20,
    keyOutcome: '월간 유기적 트래픽 1,284 돌파',
    durationEst: '지속 진행',
    ctaText: 'Traffic 캠페인 관리',
    checklist: [
      { id: 'c8-1', text: 'Traffic Booster 캠페인 타겟 키워드 5개 등록', completed: true, required: true },
      { id: 'c8-2', text: '평균 체류시간 2분 이상 및 바운스 레이트 40% 미만 제어', completed: false, required: true },
      { id: 'c8-3', text: '소셜 시그널(트위터/페이스북 공유 링크) 활성화', completed: false, required: false }
    ],
    lectureModuleId: 8
  },
  {
    id: 9,
    stepNumber: 9,
    title: 'STEP 9 성과 분석',
    subTitle: '구글 노출/클릭 및 SERP 1페이지 진입 모니터링',
    description: 'GSC 데이터와 실시간 순위 변동을 매주 분석하여 트래픽이 급상승하는 효자 키워드와 정체된 키워드를 판별합니다.',
    whyNeeded: '데이터에 기반한 최적화만이 리소스를 낭비하지 않고 상위 랭킹 키워드를 계속해서 복제할 수 있습니다.',
    completionCriteria: '주간 GSC 리포트 분석 루틴 확립, 10위권 진입 키워드 10개 이상 달성',
    currentResult: 'Google 노출 8,240회 (+24%), 클릭 394회 (+18%) 기록',
    lectureTitle: '09강. 구글 서치콘솔 데이터로 2배 트래픽 만드는 리포트 분석법',
    lectureDuration: '26분',
    status: 'in_progress',
    progress: 35,
    keyOutcome: '노출 8,240회 (+24%), 클릭 394회 (+18%) 기록',
    durationEst: '매주 1회 정기 루틴',
    ctaText: '성과 리포트 보기',
    checklist: [
      { id: 'c9-1', text: '주간 GSC 노출수/클릭수 변화율 리포트 점검', completed: true, required: true },
      { id: 'c9-2', text: '4위~20위권 잠재력 키워드 리스트업', completed: false, required: true },
      { id: 'c9-3', text: 'CTR(클릭률) 낮은 타이틀 메타 태그 A/B 테스트 계획 수립', completed: false, required: false }
    ],
    lectureModuleId: 9
  },
  {
    id: 10,
    stepNumber: 10,
    title: 'STEP 10 반복 성장',
    subTitle: '수익화 파이프라인 완성 및 다중 사이트 복제',
    description: '검증된 1개 사이트의 성공 방정식을 바탕으로 두 번째, 세 번째 니치 사이트로 확장하며 패시브 트래픽 머신을 구축합니다.',
    whyNeeded: '단일 사이트 의존도를 낮추고 다각화된 니치 포트폴리오를 만들어 지속 가능한 월 300만원+ 자동 수익을 완성합니다.',
    completionCriteria: '첫 사이트 월 순익 100만원+ 달성, 2호기 신규 프로젝트 착수',
    currentResult: '1호기 안정화 단계 (목표 달성 후 2호기 등록 예정)',
    lectureTitle: '10강. 다중 니치 사이트 복제와 패시브 수익 시스템 완성',
    lectureDuration: '30분',
    status: 'pending',
    progress: 0,
    keyOutcome: '월 순수익 300만원 달성 및 신규 프로젝트 런칭',
    durationEst: '3개월 차 이후',
    ctaText: '스케일업 가이드 보기',
    checklist: [
      { id: 'c10-1', text: '1호기 사이트 월간 수익 결산 및 고정 광고주/어필리에이트 제휴', completed: false, required: true },
      { id: 'c10-2', text: '2호기 신규 SEO 프로젝트 기획 및 Onboarding Wizard 실행', completed: false, required: true },
      { id: 'c10-3', text: '도메인/콘텐츠/백링크 리소스 공유 자동화 구축', completed: false, required: false }
    ],
    lectureModuleId: 10
  }
];

export const MOCK_GSC_TIMESERIES = [
  { date: '08/01', impressions: 240, clicks: 12 },
  { date: '08/02', impressions: 290, clicks: 15 },
  { date: '08/03', impressions: 380, clicks: 18 },
  { date: '08/04', impressions: 420, clicks: 22 },
  { date: '08/05', impressions: 490, clicks: 25 },
  { date: '08/06', impressions: 550, clicks: 29 },
  { date: '08/07', impressions: 610, clicks: 31 },
  { date: '08/08', impressions: 680, clicks: 35 },
  { date: '08/09', impressions: 720, clicks: 38 },
  { date: '08/10', impressions: 790, clicks: 42 },
  { date: '08/11', impressions: 850, clicks: 46 },
  { date: '08/12', impressions: 920, clicks: 50 },
  { date: '08/13', impressions: 980, clicks: 54 },
  { date: '08/14', impressions: 1050, clicks: 58 },
  { date: '08/15', impressions: 1120, clicks: 61 },
  { date: '08/16', impressions: 1190, clicks: 65 },
  { date: '08/17', impressions: 1240, clicks: 69 },
  { date: '08/18', impressions: 1310, clicks: 74 }
];

export const MOCK_KEYWORD_SERP = [
  {
    id: 'kw-1',
    keyword: '세부 호핑투어 추천',
    currentRank: 3,
    rank: 3,
    prevRank: 7,
    change: '+4',
    searchVolume: '14,800',
    difficulty: '중간 (42)',
    impressions: 3420,
    clicks: 184,
    ctr: '5.4%',
    url: '/cebu-hopping-guide-2026',
    serpUrl: 'https://cebutrip.co.kr/cebu-hopping-guide-2026',
    status: '상승'
  },
  {
    id: 'kw-2',
    keyword: '막탄 풀빌라 추천',
    currentRank: 4,
    rank: 4,
    prevRank: 6,
    change: '+2',
    searchVolume: '8,200',
    difficulty: '중간 (38)',
    impressions: 2150,
    clicks: 98,
    ctr: '4.6%',
    url: '/mactan-villa-top5',
    serpUrl: 'https://cebutrip.co.kr/mactan-villa-top5',
    status: '상승'
  },
  {
    id: 'kw-3',
    keyword: '세부 환전 팁',
    currentRank: 2,
    rank: 2,
    prevRank: 2,
    change: '0',
    searchVolume: '5,400',
    difficulty: '쉬움 (19)',
    impressions: 1680,
    clicks: 82,
    ctr: '4.9%',
    url: '/cebu-currency-exchange-tips',
    serpUrl: 'https://cebutrip.co.kr/cebu-currency-exchange-tips',
    status: '유지'
  },
  {
    id: 'kw-4',
    keyword: '세부 자유여행 코스',
    currentRank: 8,
    rank: 8,
    prevRank: 14,
    change: '+6',
    searchVolume: '18,500',
    difficulty: '어려움 (65)',
    impressions: 990,
    clicks: 30,
    ctr: '3.0%',
    url: '/cebu-itinerary',
    serpUrl: 'https://cebutrip.co.kr/cebu-itinerary',
    status: '상승'
  }
];

export const MOCK_DOMAINS: DomainItem[] = [
  {
    id: 'dom-01',
    domain: 'travel-cebu-guide.com',
    da: 32,
    pa: 28,
    spamScore: 1,
    backlinksCount: 1420,
    referringDomainsCount: 68,
    archiveAge: '6년 (2018~)',
    niche: '여행/리조트',
    price: '₩120,000',
    status: 'available',
    seoScore: 92
  },
  {
    id: 'dom-02',
    domain: 'cebu-hopping-resort.net',
    da: 28,
    pa: 25,
    spamScore: 0,
    backlinksCount: 980,
    referringDomainsCount: 42,
    archiveAge: '4년 (2020~)',
    niche: '동남아 액티비티',
    price: '₩95,000',
    status: 'available',
    seoScore: 88
  },
  {
    id: 'dom-03',
    domain: 'best-philippines-stay.org',
    da: 24,
    pa: 22,
    spamScore: 2,
    backlinksCount: 650,
    referringDomainsCount: 31,
    archiveAge: '3년 (2021~)',
    niche: '호텔/숙박',
    price: '₩80,000',
    status: 'available',
    seoScore: 84
  },
  {
    id: 'dom-04',
    domain: 'mactan-villa-review.com',
    da: 35,
    pa: 30,
    spamScore: 1,
    backlinksCount: 2100,
    referringDomainsCount: 94,
    archiveAge: '8년 (2016~)',
    niche: '풀빌라 큐레이션',
    price: '₩180,000',
    status: 'reserved',
    seoScore: 95
  }
];

export const MOCK_CONTENTS: ContentItem[] = [
  {
    id: 'cnt-01',
    title: '2026 세부 호핑투어 완벽 가이드: 날루수안 & 힐룽뚱안 코스 비용 총정리',
    targetKeyword: '세부 호핑투어 추천',
    secondaryKeywords: ['세부 호핑 가격', '날루수안 스노클링', '세부 호핑 예약'],
    wordCount: 2450,
    seoScore: 94,
    status: 'published',
    publishDate: '2026-08-18',
    url: 'https://cebutrip.co.kr/cebu-hopping-guide-2026',
    views: 342
  },
  {
    id: 'cnt-02',
    title: '막탄 풀빌라 TOP 5 비교: 가성비부터 럭셔리 독채 숙소까지',
    targetKeyword: '막탄 풀빌라 추천',
    secondaryKeywords: ['세부 독채 풀빌라', '세부 가족여행 숙소', '막탄 가성비 풀빌라'],
    wordCount: 3120,
    seoScore: 98,
    status: 'published',
    publishDate: '2026-08-16',
    url: 'https://cebutrip.co.kr/mactan-villa-top5',
    views: 520
  },
  {
    id: 'cnt-03',
    title: '필리핀 페소 환전 팁 3가지: 공항 vs 시내 사설환전소 수수료 절약법',
    targetKeyword: '세부 환전 팁',
    secondaryKeywords: ['필리핀 페소 환전', '세부 아얄라몰 환전소', '트래블로그 세부'],
    wordCount: 1980,
    seoScore: 89,
    status: 'published',
    publishDate: '2026-08-14',
    url: 'https://cebutrip.co.kr/cebu-currency-exchange-tips',
    views: 422
  },
  {
    id: 'cnt-04',
    title: '세부 3박 5일 자유여행 황금 일정표 (초보자 맞춤형)',
    targetKeyword: '세부 자유여행 코스',
    secondaryKeywords: ['세부 3박5일 일정', '세부 4박6일 경비', '세부 여행 준비물'],
    wordCount: 2800,
    seoScore: 92,
    status: 'scheduled',
    publishDate: '2026-08-20',
    views: 0
  }
];

export const MOCK_BACKLINKS: BacklinkItem[] = [
  {
    id: 'bl-01',
    targetUrl: 'https://cebutrip.co.kr/mactan-villa-top5',
    anchorText: '막탄 풀빌라 큐레이션',
    sourceDomain: 'travel-asia-mag.org',
    sourceType: 'Editorial Guest Post',
    sourceDA: 42,
    status: 'indexed',
    placedDate: '2026-08-10',
    indexedDate: '2026-08-12'
  },
  {
    id: 'bl-02',
    targetUrl: 'https://cebutrip.co.kr/cebu-hopping-guide-2026',
    anchorText: '세부 호핑투어 코스 정보',
    sourceDomain: 'island-guide-review.net',
    sourceType: 'PBN',
    sourceDA: 36,
    status: 'indexed',
    placedDate: '2026-08-12',
    indexedDate: '2026-08-14'
  },
  {
    id: 'bl-03',
    targetUrl: 'https://cebutrip.co.kr',
    anchorText: 'cebutrip.co.kr',
    sourceDomain: 'niche-travel-directory.kr',
    sourceType: 'Niche Directory',
    sourceDA: 29,
    status: 'crawled',
    placedDate: '2026-08-15'
  },
  {
    id: 'bl-04',
    targetUrl: 'https://cebutrip.co.kr/cebu-currency-exchange-tips',
    anchorText: '필리핀 페소 환전 꿀팁',
    sourceDomain: 'finance-nomad-forum.com',
    sourceType: 'Web 2.0',
    sourceDA: 48,
    status: 'pending',
    placedDate: '2026-08-17'
  }
];

export const MOCK_TRAFFIC_CAMPAIGNS: TrafficCampaign[] = [
  {
    id: 'trf-01',
    title: '세부 호핑투어 추천 상위 CTR 부스팅',
    targetKeyword: '세부 호핑투어 추천',
    targetUrl: 'https://cebutrip.co.kr/cebu-hopping-guide-2026',
    dailyTargetVisitors: 80,
    currentVisitors: 540,
    geoTarget: '대한민국 (KR)',
    avgTimeOnSite: '3분 12초',
    bounceRateControl: '32%',
    status: 'active',
    startDate: '2026-08-10'
  },
  {
    id: 'trf-02',
    title: '막탄 풀빌라 키워드 유입 신호 생성',
    targetKeyword: '막탄 풀빌라 추천',
    targetUrl: 'https://cebutrip.co.kr/mactan-villa-top5',
    dailyTargetVisitors: 50,
    currentVisitors: 320,
    geoTarget: '대한민국 (KR)',
    avgTimeOnSite: '2분 45초',
    bounceRateControl: '38%',
    status: 'active',
    startDate: '2026-08-12'
  }
];

export const AI_COACH_INSIGHTS: AiCoachInsight[] = [
  {
    id: 'coach-01',
    title: '콘텐츠 발행량 우수, Referring Domain 보강 추천',
    summary:
      '최근 2주간 콘텐츠 발행 속도는 매우 훌륭합니다. 다만 Referring Domain 증가율이 다소 정체되어 있어 1페이지 상위 3위권 진입을 위해 백링크 10개 추가 주입을 권장합니다.',
    impact: 'high',
    category: 'backlink',
    actionRecommendations: [
      '경쟁 상위 1위 사이트 백링크 앵커텍스트 분석 후 3개 획득',
      '기존 발행된 상위 3개 아티클 간 내부 링크(Internal Linking) 보강',
      'Traffic Booster 캠페인 타겟에 서브 롱테일 키워드 2개 추가'
    ],
    recommendedSteps: [
      { title: 'Backlink Builder 열기', actionTab: 'tools', actionSubTab: 'backlink' },
      { title: '오늘의 미션 확인', actionTab: 'missions' }
    ]
  },
  {
    id: 'coach-02',
    title: '골든 롱테일 키워드 3건 발견 (빠른 상위 진입 가능)',
    summary:
      '현재 [세부 호핑 가격 비교], [막탄 독채 풀빌라 가성비], [세부 공항 새벽 입국 팁] 3개 키워드의 구글 검색 결과에 양질의 최신 문서가 부족합니다. 우선 발행 시 1주일 내 1페이지 진입이 예상됩니다.',
    impact: 'medium',
    category: 'content',
    actionRecommendations: [
      'Content Automation에서 위 3개 키워드로 아티클 생성 예약',
      'H2/H3 태그에 가격 비교 표 및 FAQ 스키마 마크업 삽입'
    ],
    recommendedSteps: [
      { title: '콘텐츠 자동화로 이동', actionTab: 'tools', actionSubTab: 'content' }
    ]
  }
];

export const RECENT_ACTIVITIES: ActivityLog[] = [
  {
    id: 'act-01',
    action: '콘텐츠 1개 발행 완료 (2026 세부 호핑투어 완벽 가이드)',
    category: 'Content',
    timestamp: '2시간 전',
    status: 'completed'
  },
  {
    id: 'act-02',
    action: '홈페이지 수정 완료 (모바일 헤더 로고 크기 조정 - 승인됨)',
    category: 'Website',
    timestamp: '5시간 전',
    status: 'completed'
  },
  {
    id: 'act-03',
    action: '미션 완료: GSC 연결 확인 및 사이트맵 제출',
    category: 'Mission',
    timestamp: '어제',
    status: 'completed'
  },
  {
    id: 'act-04',
    action: 'CatchDomain 고DA 도메인 cebutrip.co.kr DNS 연동 완료',
    category: 'Domain',
    timestamp: '3일 전',
    status: 'completed'
  }
];

export const CURRICULUM_LESSONS: CurriculumLesson[] = [
  {
    id: 1,
    stepNumber: 1,
    moduleTitle: 'MODULE 01. 수익형 니치 선정 & 기획',
    title: '01강. 수익형 니치 선정과 검색 의도(Intent) 분석',
    duration: '18분',
    completed: true,
    resources: [
      { title: '니치 시장 선정 체크리스트 템플릿', type: 'sheet', downloadUrl: '#' },
      { title: '수익 모델별 단가 비교 가이드 PDF', type: 'pdf', downloadUrl: '#' }
    ]
  },
  {
    id: 2,
    stepNumber: 2,
    moduleTitle: 'MODULE 02. SEO 홈페이지 구조 & 테마',
    title: '02강. 구글 친화적 Silo 웹사이트 구조와 코어 웹 바이탈',
    duration: '24분',
    completed: true,
    resources: [
      { title: 'Silo 카테고리 구조도 다이어그램', type: 'sheet', downloadUrl: '#' },
      { title: '홈페이지 제작 요청서 작성 가이드', type: 'template', downloadUrl: '#' }
    ]
  },
  {
    id: 3,
    stepNumber: 3,
    moduleTitle: 'MODULE 03. 만료도메인 & CatchDomain 실전',
    title: '03강. CatchDomain으로 월 100만원 가치의 만료도메인 찾는 법',
    duration: '31분',
    completed: true,
    resources: [
      { title: '스팸 스코어 판별 가이드라인', type: 'pdf', downloadUrl: '#' }
    ]
  },
  {
    id: 4,
    stepNumber: 4,
    moduleTitle: 'MODULE 04. 테크니컬 SEO & 인덱싱 마스터',
    title: '04강. 10분 만에 끝내는 구글 서치콘솔 & 테크니컬 SEO 세팅',
    duration: '20분',
    completed: true,
    resources: [
      { title: 'robots.txt & sitemap.xml 최적화 코드', type: 'template', downloadUrl: '#' }
    ]
  },
  {
    id: 5,
    stepNumber: 5,
    moduleTitle: 'MODULE 05. 황금 키워드 발굴 & 클러스터링',
    title: '05강. 월 1,000 클릭을 만드는 황금 롱테일 키워드 발굴 공식',
    duration: '28분',
    completed: true,
    resources: [
      { title: '골든 키워드 300개 추출 시트', type: 'sheet', downloadUrl: '#' }
    ]
  },
  {
    id: 6,
    stepNumber: 6,
    moduleTitle: 'MODULE 06. 콘텐츠 자동화 & E-E-A-T',
    title: '06강. E-E-A-T를 통과하는 AI 콘텐츠 자동화 발행 파이프라인',
    duration: '35분',
    completed: false,
    resources: [
      { title: '고품질 아티클 프롬프트 프레임워크', type: 'template', downloadUrl: '#' }
    ]
  },
  {
    id: 7,
    stepNumber: 7,
    moduleTitle: 'MODULE 07. 안전하고 강력한 백링크 구축',
    title: '07강. 구글 페널티 없이 도메인 파워를 올리는 백링크 전략',
    duration: '40분',
    completed: false,
    resources: [
      { title: '앵커 텍스트 분산 계산기', type: 'sheet', downloadUrl: '#' }
    ]
  },
  {
    id: 8,
    stepNumber: 8,
    moduleTitle: 'MODULE 08. 트래픽 신호 & CTR 부스팅',
    title: '08강. 검색 신호(User Signals)와 CTR 부스팅을 통한 1위 탈환',
    duration: '22분',
    completed: false,
    resources: [
      { title: 'CTR 향상 카피라이팅 20선', type: 'pdf', downloadUrl: '#' }
    ]
  },
  {
    id: 9,
    stepNumber: 9,
    moduleTitle: 'MODULE 09. GSC 데이터 성과 분석 & 개선',
    title: '09강. 구글 서치콘솔 데이터로 2배 트래픽 만드는 리포트 분석법',
    duration: '26분',
    completed: false,
    resources: [
      { title: '주간 SEO 모니터링 대시보드 시트', type: 'sheet', downloadUrl: '#' }
    ]
  },
  {
    id: 10,
    stepNumber: 10,
    moduleTitle: 'MODULE 10. 다중 사이트 복제 & 스케일업',
    title: '10강. 다중 니치 사이트 복제와 패시브 수익 시스템 완성',
    duration: '30분',
    completed: false,
    resources: [
      { title: '수익형 사이트 확장 로드맵 매뉴얼', type: 'pdf', downloadUrl: '#' }
    ]
  }
];

export const MOCK_CURRICULUM = CURRICULUM_LESSONS;

export const MOCK_TASK_WORK_LOGS: TaskWorkLog[] = [
  {
    id: 'log-1',
    taskId: 6,
    taskTitle: '첫 번째 SEO 콘텐츠 발행',
    url: 'https://cebutrip.co.kr/cebu-travel-guide-2026',
    targetKeyword: '세부여행',
    publishDate: '2026.08.19',
    notes: 'Content Automation으로 E-E-A-T 구조화 아티클 3,200자 발행 완료. 메타 타이틀/디스크립션 및 H2/H3 Silo 목차 포함.',
    screenshotUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    relatedTool: 'content',
    status: 'completed',
    createdAt: '2026.08.19 14:30'
  },
  {
    id: 'log-2',
    taskId: 7,
    taskTitle: 'Tier 1 백링크 3개 확보 및 인덱싱',
    url: 'https://cebutrip.co.kr/mactan-poolvilla-top5',
    targetKeyword: '세부 풀빌라 추천',
    publishDate: '2026.08.18',
    notes: '여행 전문 포럼 및 매거진 DA 45+ 게스트 포스트 3건 분산 주입. Googlebot 크롤링 핑 발송.',
    screenshotUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    relatedTool: 'backlink',
    status: 'completed',
    createdAt: '2026.08.18 17:15'
  },
  {
    id: 'log-3',
    taskId: 4,
    taskTitle: 'Google Search Console 연결 및 색인 요청',
    url: 'https://cebutrip.co.kr/sitemap.xml',
    targetKeyword: '사이트 전체 색인',
    publishDate: '2026.08.17',
    notes: 'DNS TXT 레코드 소유권 확인 완료. sitemap.xml 제출 및 robots.txt Allow 설정 확인.',
    relatedTool: 'gsc',
    status: 'completed',
    createdAt: '2026.08.17 11:00'
  },
  {
    id: 'log-4',
    taskId: 2,
    taskTitle: '홈페이지 오픈 및 SEO 기본 스펙 배포',
    url: 'https://cebutrip.co.kr',
    targetKeyword: '세부여행 전문 포털',
    publishDate: '2026.08.15',
    notes: 'SEO SYSTEM 300 전담팀 제작 완료. LCP 1.1s, 코어 웹 바이탈 98점 통과.',
    relatedTool: 'website',
    status: 'completed',
    createdAt: '2026.08.15 16:40'
  }
];

export const MOCK_SEO_TIMELINE_ITEMS: SeoActivityTimelineItem[] = [
  {
    id: 'act-1',
    date: '2026.08.19',
    time: '14:30',
    category: 'content',
    title: '콘텐츠 발행',
    summary: '세부 가족여행 추천',
    details: {
      url: 'https://cebutrip.co.kr/cebu-family-travel-guide',
      keyword: '세부 가족여행 추천',
      metrics: '3,200자 • SEO 96점',
      notes: 'Content Automation 엔진 활용, E-E-A-T 구조화 아티클 롱테일 키워드 발행',
      screenshotUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80'
    },
    connectedTool: 'content'
  },
  {
    id: 'act-2',
    date: '2026.08.18',
    time: '17:15',
    category: 'backlink',
    title: '백링크 3개 확보',
    summary: 'DA 45+ 여행 커뮤니티 및 매거진 백링크',
    details: {
      url: 'https://cebutrip.co.kr/mactan-poolvilla-top5',
      keyword: '세부 풀빌라 추천',
      referringDomains: 3,
      backlinksCount: 3,
      metrics: '평균 DA 48.2 • DoFollow',
      notes: 'Backlink Builder 통한 게스트 포스트 및 Tier 1 분산 주입 완료'
    },
    connectedTool: 'backlink'
  },
  {
    id: 'act-3',
    date: '2026.08.17',
    time: '11:00',
    category: 'gsc',
    title: 'GSC 연결완료',
    summary: 'Google 서치콘솔 소유권 인증 & Sitemap 제출',
    details: {
      url: 'https://cebutrip.co.kr/sitemap.xml',
      keyword: '사이트 전체 색인',
      metrics: 'Sitemap 48개 URL 제출',
      notes: '구글 검색로봇 첫 크롤링 성공 및 색인 생성 대기열 등록 완료'
    },
    connectedTool: 'gsc'
  },
  {
    id: 'act-4',
    date: '2026.08.15',
    time: '16:40',
    category: 'website',
    title: '홈페이지 오픈',
    summary: 'SYSTEM 300 전담 제작 및 라이브 배포',
    details: {
      url: 'https://cebutrip.co.kr',
      keyword: '세부여행 전문 플랫폼',
      metrics: 'LCP 1.1s • 모바일 98점',
      notes: '고속 반응형 매거진 테마 셋업 및 스키마 마크업 완비'
    },
    connectedTool: 'website'
  },
  {
    id: 'act-5',
    date: '2026.08.12',
    time: '10:20',
    category: 'catchdomain',
    title: 'CatchDomain 고품질 도메인 확보',
    summary: 'cebutrip.co.kr 만료도메인 발굴 및 네임서버 설정',
    details: {
      url: 'https://cebutrip.co.kr',
      keyword: 'DA 28 만료 도메인',
      metrics: 'DA 28 • 백링크 120개 보유',
      notes: '구글 이전 히스토리 스팸 점수 0% 클린 도메인 낙찰'
    },
    connectedTool: 'catchdomain'
  }
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: '홈페이지 1차 디자인이 완료되었습니다.',
    message: 'SEO SYSTEM 300 전담팀에서 5개 페이지 반응형 디자인 시안을 등록했습니다. 검수를 진행해주세요.',
    timeAgo: '10분 전',
    type: 'success',
    read: false,
    actionTab: 'website',
    actionSubTab: 'status'
  },
  {
    id: 'notif-2',
    title: '수정 요청 #12가 처리되었습니다.',
    message: '모바일 헤더 로고 크기 조정 및 푸터 카카오톡 채널 링크 연동 수정이 완료되어 배포되었습니다.',
    timeAgo: '45분 전',
    type: 'info',
    read: false,
    actionTab: 'website',
    actionSubTab: 'revision'
  },
  {
    id: 'notif-3',
    title: '오늘의 SEO 미션이 생성되었습니다.',
    message: 'CatchDomain 고DA 도메인 분석 및 메타태그 검수 등 오늘의 3개 미션을 수행하고 포인트를 적립하세요.',
    timeAgo: '2시간 전',
    type: 'info',
    read: false,
    actionTab: 'missions'
  },
  {
    id: 'notif-4',
    title: '🎉 콘텐츠 30개 목표를 달성했습니다.',
    message: '축하합니다! 30번째 SEO 최적화 아티클이 발행되었습니다. 이제 Referring Domain 백링크 주입 단계로 진입할 수 있습니다.',
    timeAgo: '5시간 전',
    type: 'success',
    read: true,
    actionTab: 'reports'
  },
  {
    id: 'notif-5',
    title: 'AI Coach가 새로운 개선사항을 발견했습니다.',
    message: '구글 검색 노출 데이터 분석 결과, [세부 호핑 가격 비교] 키워드의 1페이지 진입 기회를 포착했습니다.',
    timeAgo: '어제',
    type: 'info',
    read: true,
    actionTab: 'ai_coach'
  }
];
