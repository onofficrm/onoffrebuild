import { SeoServiceItem, PipelineStep, CaseStudy } from '../types';

/** Canonical external product URLs — single source for SEO Platform pages. */
export const SERVICE_URLS = {
  catchDomain: 'https://domain.icrm.co.kr/',
  contentTraffic: 'https://icrm.co.kr/',
  seoflow: 'https://backlink.icrm.co.kr/',
  seoSystem300: 'https://onoff.icrm.co.kr/seo-system/',
} as const;

export const CORE_SERVICES: SeoServiceItem[] = [
  {
    id: 'catchdomain',
    name: 'CatchDomain (캐치도메인)',
    subName: '고품질 만료·낙장 도메인 선점 시스템',
    badge: 'STEP 1. 도메인 기초 체력',
    role: '도메인 권위(DA) 확보 & 히스토리 선점',
    url: SERVICE_URLS.catchDomain,
    iconName: 'Globe',
    color: 'from-blue-600 to-indigo-600',
    accentColor: 'text-blue-400',
    tagline: '신규 도메인의 샌드박스 기간을 건너뛰고 강력한 출발선에서 시작합니다.',
    description: '구글 및 주요 검색엔진에서 신뢰도가 이미 검증된 만료·낙장 도메인을 실시간으로 추적 및 분석하여 상위 랭킹에 가장 유리한 도메인을 발굴하고 선점할 수 있도록 지원합니다.',
    problemSolved: '0부터 시작하는 신규 도메인은 신뢰도를 쌓는데 6개월~1년 이상 소요됩니다. 캐치도메인은 기존 축적된 백링크 히스토리와 높은 DA를 가진 도메인을 확보해 랭킹 진입 속도를 극대화합니다.',
    keyFeatures: [
      {
        title: '실시간 낙장 도메인 크롤링 & 감지',
        desc: '전 세계 및 국내 만료 예정 도메인을 초 단위로 모니터링하여 가치 있는 도메인을 놓치지 않고 포착합니다.'
      },
      {
        title: '백링크 히스토리 & 스팸 스코어 정밀 검증',
        desc: '과거 유해 스팸 이력이나 패널티 이력이 없는 클린하고 건강한 백링크 프로필만 엄선합니다.'
      },
      {
        title: 'DA/DR & 유기적 트래픽 이력 분석',
        desc: '검색엔진 도메인 권위 지수(DA/DR), 이전 색인 수, 트래픽 추세를 종합 검증하여 최적의 도메인을 추천합니다.'
      },
      {
        title: '원클릭 등록 및 네임서버 빠른 연결',
        desc: '발굴한 도메인을 신속하게 낙찰/등록하고 즉시 온오프마케팅 SEO 시스템에 연동합니다.'
      }
    ],
    processStep: 1,
    stats: [
      { label: '평균 랭킹 진입 속도 단축', value: '4.2배 단축', change: '+320%' },
      { label: '스팸 필터링 신뢰도', value: '99.8%', change: '안전성 검증' },
      { label: '실시간 모니터링 풀', value: '150,000+', change: '일일 갱신' }
    ],
    checklist: [
      '스팸 히스토리(Wayback Machine) 정밀 검수 완료',
      '기존 오가닉 백링크 도메인 분산도 확인',
      '도메인 연령(Age) 및 브랜드 키워드 적합성 판정',
      'DNS 및 호스팅 즉각 연결 준비'
    ]
  },
  {
    id: 'seo300',
    name: 'SEO System 300',
    subName: '300단계 전방위 SEO 테크니컬 프로세스',
    badge: 'STEP 2. 사이트 구조 & 온페이지 최적화',
    role: '검색엔진 친화적 사이트 설계 & 테크니컬 SEO',
    url: SERVICE_URLS.seoSystem300,
    iconName: 'Cpu',
    color: 'from-cyan-600 to-blue-600',
    accentColor: 'text-cyan-400',
    tagline: '300가지 정밀 체크리스트로 검색엔진 크롤러가 가장 좋아하는 완벽한 사이트를 구축합니다.',
    description: '구글의 코어 웹 바이탈(Core Web Vitals), 색인 구조, 스키마 마크업, 사이트맵, 내부 링크 계층, 모바일 최적화 등 300가지 필수 테크니컬 SEO 요소를 빈틈없이 튜닝하는 전방위 실행 솔루션입니다.',
    problemSolved: '콘텐츠를 아무리 많이 써도 웹사이트의 테크니컬 구조가 무너져 있으면 검색엔진 로봇이 제대로 크롤링 및 색인하지 못합니다. 300단계 최적화로 색인율 100%와 최적의 크롤링 효율을 만듭니다.',
    keyFeatures: [
      {
        title: '300가지 테크니컬 온페이지 체크리스트 실행',
        desc: 'Title, Meta Description, H1~H6 헤딩 계층, Canonical 태그, Robots.txt, Sitemap.xml을 완벽하게 재정비합니다.'
      },
      {
        title: 'Core Web Vitals & 로딩 속도 극대화',
        desc: 'LCP, INP, CLS 지표를 최상위 그린 존(Green Zone)으로 최적화하여 사용자 경험 및 구글 랭킹 점수를 극대화합니다.'
      },
      {
        title: 'Schema.org 구조화 데이터 마크업',
        desc: '조직, 기사, FAQ, 제품, 리뷰 등 검색엔진 리치 스니펫(Rich Snippets) 노출을 위한 구조화 코드를 완벽 주입합니다.'
      },
      {
        title: '내부 사일로(Silo) 링크 아키텍처 구축',
        desc: '관련성 높은 문서끼리 내부 링크를 체계적으로 연결하여 검색엔진에 페이지별 가중치를 정확히 전달합니다.'
      }
    ],
    processStep: 2,
    stats: [
      { label: '평균 크롤링 & 색인 반영율', value: '99.4%', change: '+85% 개선' },
      { label: '모바일 페이지 속도 점수', value: '95점+', change: 'Lighthouse 기준' },
      { label: '체크포인트 전수 정밀 점검', value: '300 항목', change: '완벽 커버리지' }
    ],
    checklist: [
      'SSL/HTTPS 보안 및 리다이렉트 체인 제거',
      '시맨틱 HTML 태그 및 모바일 뷰포트 최적화',
      'OpenGraph 및 Twitter Card 메타데이터 완성',
      '404 오류 제거 및 301 영구 이전 구조화'
    ]
  },
  {
    id: 'content_traffic',
    name: '트래픽·콘텐츠 제작 (icrm.co.kr)',
    subName: '검색 의도 기반 고품질 콘텐츠 & 실질 트래픽 부스팅',
    badge: 'STEP 3. 콘텐츠 빌딩 & 트래픽 가동',
    role: '검색 의도(Search Intent) 최적화 & 유입 확대',
    url: SERVICE_URLS.contentTraffic,
    iconName: 'PenTool',
    color: 'from-amber-500 to-orange-600',
    accentColor: 'text-amber-400',
    tagline: '실제 검색자의 질문에 답하는 E-E-A-T 기반 고품질 콘텐츠로 유기적 트래픽을 끌어올립니다.',
    description: '타겟 키워드 분석, LSI(잠재 의미) 키워드 클러스터링, 전문적이고 깊이 있는 콘텐츠 기획 및 제작, 그리고 실제 타겟 사용자들의 체류 시간을 유도하는 체계적인 콘텐츠 & 트래픽 빌드업을 실행합니다.',
    problemSolved: '의미 없는 키워드 도배성 글은 구글 유용한 콘텐츠 업데이트(Helpful Content)에서 패널티를 받습니다. icrm.co.kr은 진짜 사용자가 읽고 반응하는 고밀도 전문 콘텐츠를 공급합니다.',
    keyFeatures: [
      {
        title: '키워드 검색 의도 & 서치 인텐트 분석',
        desc: '정보형, 상업형, 탐색형, 거래형 검색 의도를 분리하여 사용자가 원하는 해답을 즉각 제공하는 구조로 기획합니다.'
      },
      {
        title: 'Google E-E-A-T 기준 전문 콘텐츠 작성',
        desc: '경험(Experience), 전문성(Expertise), 권위(Authoritativeness), 신뢰도(Trustworthiness)를 충족하는 글을 완성합니다.'
      },
      {
        title: '키워드 클러스터링 & 주제 권위(Topic Authority)',
        desc: '메인 필라(Pillar) 콘텐츠와 서브 클러스터 콘텐츠를 연동하여 특정 분야의 압도적 전문가 사이트로 인정받게 합니다.'
      },
      {
        title: '체류시간 및 전환율(CTR) 최적화',
        desc: '가독성 높은 포맷, 시각적 인포그래픽, 명확한 CTA 배치를 통해 이탈률을 낮추고 체류시간을 비약적으로 늘립니다.'
      }
    ],
    processStep: 3,
    stats: [
      { label: '평균 페이지 체류 시간', value: '3분 45초', change: '+210%' },
      { label: '키워드 랭킹 상위 진입율', value: '88.7%', change: '1페이지 노출' },
      { label: '오가닉 오디언스 유입량', value: '지속 우상향', change: '장기 누적 효과' }
    ],
    checklist: [
      '타겟 키워드 검색량 및 경쟁도 매핑',
      '롱테일 키워드 50~100개 세부 분할 콘텐츠화',
      '표, 목록, FAQ 블록 등 가독성 UI 구조화',
      '내부 전환 링크 및 마이크로 인터랙션 배치'
    ]
  },
  {
    id: 'seoflow',
    name: 'SEOFLOW',
    subName: '외부 SEO · 백링크 (Backlink & Off-page SEO)',
    badge: 'STEP 4. 오프페이지 권위 부스팅',
    role: '고품질 백링크 네트워크 & 도메인 신뢰도 증폭',
    url: SERVICE_URLS.seoflow,
    iconName: 'Link2',
    color: 'from-emerald-500 to-teal-600',
    accentColor: 'text-emerald-400',
    tagline: '구글 최신 스팸 업데이트에 대응하는 정밀하고 자연스러운 백링크를 구축합니다.',
    description: '단순 대량 생성형 저품질 링크가 아닌, 실제 연관성 높은 고권위 미디어 및 업계 웹사이트로부터 문맥상 자연스러운(Contextual) Do-Follow 백링크를 구축하여 사이트의 전반적 도메인 파워를 상승시킵니다.',
    problemSolved: '검색엔진은 외부에서 해당 사이트를 얼마나 신뢰하고 추천(링크)하는지 평가합니다. SEOFLOW는 앵커 텍스트 분산과 안전한 Tier 구조로 페널티 없는 강력한 백링크 파워를 주입합니다.',
    keyFeatures: [
      {
        title: '고신뢰도 DA 40~90+ 미디어 네트워크 연계',
        desc: '검색엔진에서 높은 평가를 받는 실제 사이트 및 전문 매체로부터 고품질 백링크를 확보합니다.'
      },
      {
        title: '자연스러운 앵커 텍스트 비율 최적화',
        desc: '브랜드명, URL, 일반형, 타겟 키워드가 자연스러운 비율로 배분되어 알고리즘 패널티를 원천 차단합니다.'
      },
      {
        title: 'Tier 1 & Tier 2 구조적 링크 파워 전이',
        desc: '직접 연결되는 Tier 1 링크와 이를 보강하는 Tier 2 인덱싱 링크를 결합하여 링크 영속성과 파워를 극대화합니다.'
      },
      {
        title: '실시간 색인 상태 및 백링크 대시보드 리포트',
        desc: '구축된 모든 백링크의 색인 상태와 활성화 여부를 투명하게 모니터링하고 보고서를 제공합니다.'
      }
    ],
    processStep: 4,
    stats: [
      { label: '백링크 색인 성공률', value: '96.5%', change: 'Ahrefs/Moz 검증' },
      { label: '도메인 권위(DA/DR) 평균 상승', value: '+18~35pt', change: '3개월 평균' },
      { label: '알고리즘 패널티 발생률', value: '0.0%', change: '안전성 100%' }
    ],
    checklist: [
      '문맥 연관성(Contextual Relevance) 기반 매칭',
      'Do-Follow 및 No-Follow 비율 최적 밸런스 유지',
      'Ahrefs, Semrush 기준 지표 전수 실시간 트래킹',
      '정기적 링크 이탈 방지 모니터링'
    ]
  }
];

export const PIPELINE_STEPS: PipelineStep[] = [
  {
    step: 1,
    title: '고품질 도메인 탐색 & 선점',
    serviceName: 'CatchDomain',
    serviceUrl: SERVICE_URLS.catchDomain,
    keyAction: '신뢰도 높은 만료/낙장 도메인 발굴, 스팸 이력 검증, 도메인 권위(DA) 기반 선점',
    whyCrucial: '검색엔진의 신규 사이트 샌드박스 유예 기간을 단축하고, 초기부터 강력한 도메인 히스토리 점수를 확보합니다.',
    skipRisk: '신규 일반 도메인은 신뢰도 획득에만 최소 6개월 이상 소요되며, 초기 순위 진입 장벽이 매우 높습니다.',
    output: '검증된 클린 히스토리 & 높은 신뢰도 도메인 확보'
  },
  {
    step: 2,
    title: '300단계 온페이지 & 테크니컬 최적화',
    serviceName: 'SEO System 300',
    serviceUrl: SERVICE_URLS.seoSystem300,
    keyAction: 'Core Web Vitals, 스키마 마크업, 사이트 구조, 메타태그, 모바일 호환성 300가지 항목 전수 튜닝',
    whyCrucial: '검색 로봇이 사이트의 모든 페이지를 1초 이내에 오류 없이 완벽하게 색인하고 가치를 매길 수 있도록 만듭니다.',
    skipRisk: '아무리 좋은 글을 써도 테크니컬 오류로 검색 로봇이 페이지를 읽지 못하거나 색인에서 누락됩니다.',
    output: '색인율 100% 달성 & 검색엔진 친화적 테크니컬 아키텍처 완성'
  },
  {
    step: 3,
    title: '검색 의도 맞춤형 고품질 콘텐츠 제작',
    serviceName: 'icrm.co.kr (트래픽·콘텐츠)',
    serviceUrl: SERVICE_URLS.contentTraffic,
    keyAction: '타겟 키워드 클러스터링, E-E-A-T 가이드라인 충족 전문 글 작성, 체류시간 극대화 레이아웃',
    whyCrucial: '검색 사용자의 의도를 정확히 해결하여 이탈률을 낮추고, 주제 권위성(Topic Authority)을 확립합니다.',
    skipRisk: '알맹이 없는 스팸성 콘텐츠는 구글 Helpful Content Update에서 순위 급락 및 색인 삭제를 초래합니다.',
    output: '롱테일/메인 키워드 상위 랭킹 & 지속적인 오가닉 트래픽 유입'
  },
  {
    step: 4,
    title: '안전하고 강력한 프리미엄 백링크 구축',
    serviceName: 'SEOFLOW',
    serviceUrl: SERVICE_URLS.seoflow,
    keyAction: '고권위 Do-Follow 미디어 백링크 공급, 자연스러운 앵커 텍스트 분산, Tier 링크 파워 전달',
    whyCrucial: '타 사이트들의 신뢰 추천 신호를 검색엔진에 전달하여 최종 1페이지 최상단 랭킹을 굳히고 유지합니다.',
    skipRisk: '외부 백링크 추천이 없으면 경쟁도가 높은 메인 키워드에서 대형 경쟁사를 앞서기 어렵습니다.',
    output: '도메인 권위(DA) 급상승 & 최상위 순위 장기 독점'
  }
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'case-1',
    clientCategory: 'B2B SaaS 솔루션 (예시)',
    title: '[SAMPLE] 신규 런칭 기업의 메인 키워드 노출·유입 성장 프레임워크',
    period: '예시 기간',
    challenge: '예시: 경쟁이 치열한 키워드 시장에서 신규 도메인으로 런칭하여 초기 검색 노출이 정체된 상태.',
    solution: 'CatchDomain → SEO System 300 → icrm.co.kr 콘텐츠 → SEOFLOW 백링크 파이프라인 연계 (예시 시나리오).',
    results: [
      { label: '월간 유기적 트래픽', before: '예시', after: '예시', increase: 'SAMPLE' },
      { label: '주요 키워드 1페이지 진입', before: '예시', after: '예시', increase: 'SAMPLE' },
      { label: '도메인 권위 지수(DA)', before: '예시', after: '예시', increase: 'SAMPLE' }
    ],
    appliedServices: ['CatchDomain', 'SEO System 300', 'icrm.co.kr', 'SEOFLOW']
  },
  {
    id: 'case-2',
    clientCategory: '전문 직종 (예시)',
    title: '[SAMPLE] 지역 기반 키워드 전환·상담 문의 성장 프레임워크',
    period: '예시 기간',
    challenge: '예시: 모바일 최적화 미흡 및 콘텐츠 부족으로 검색 노출이 낮은 상태.',
    solution: 'SEO System 300 + icrm.co.kr 콘텐츠 + SEOFLOW 연계 (예시 시나리오).',
    results: [
      { label: '월간 온라인 상담 문의', before: '예시', after: '예시', increase: 'SAMPLE' },
      { label: '평균 페이지 체류시간', before: '예시', after: '예시', increase: 'SAMPLE' },
      { label: '월 유료 광고비', before: '예시', after: '예시', increase: 'SAMPLE' }
    ],
    appliedServices: ['SEO System 300', 'icrm.co.kr', 'SEOFLOW']
  },
  {
    id: 'case-3',
    clientCategory: '글로벌 커머스 / D2C (예시)',
    title: '[SAMPLE] 글로벌 검색 최적화·오가닉 매출 성장 프레임워크',
    period: '예시 기간',
    challenge: '예시: 해외 검색엔진 색인·현지 백링크 부족으로 트래픽 정체.',
    solution: 'CatchDomain + SEO System 300 + icrm + SEOFLOW 연계 (예시 시나리오).',
    results: [
      { label: '글로벌 구글 오가닉 매출', before: '예시', after: '예시', increase: 'SAMPLE' },
      { label: '구글 색인 페이지 수', before: '예시', after: '예시', increase: 'SAMPLE' },
      { label: '해외 유입 키워드 수', before: '예시', after: '예시', increase: 'SAMPLE' }
    ],
    appliedServices: ['CatchDomain', 'SEO System 300', 'icrm.co.kr', 'SEOFLOW']
  }
];

export const SYSTEM_FAQ = [
  {
    q: '왜 SEO를 개별 단품이 아닌 "ONOFF SEO SYSTEM"으로 진행해야 하나요?',
    a: 'SEO는 어느 한 가지만 잘한다고 성공하지 않습니다. 백링크만 많아도 사이트 구조(테크니컬)가 깨져있으면 색인이 안 되고, 도메인이 좋아도 읽을 만한 콘텐츠가 없으면 유저는 3초 만에 이탈합니다. 온오프마케팅의 ONOFF SEO SYSTEM은 [도메인 기초 ➔ 테크니컬 최적화 ➔ 콘텐츠 생성 ➔ SEOFLOW 백링크]의 필수 퍼즐을 연결하는 통합 체계입니다.'
  },
  {
    q: '기존 운영 중인 제 사이트가 있는데, 도메인을 꼭 새로 사야 하나요?',
    a: '아닙니다. 이미 운영 중인 사이트가 있다면 [SEO System 300 온페이지 최적화]와 [icrm.co.kr 콘텐츠 빌딩], [SEOFLOW] 단계부터 즉시 투입할 수 있습니다. 반면, 완전히 새로운 신규 프로젝트를 런칭하거나 서브 블로그/랜딩페이지를 빠르게 키우고 싶으실 때 [CatchDomain]을 병행하시면 시너지가 발생합니다.'
  },
  {
    q: '각 서비스(CatchDomain, icrm, SEOFLOW, SEO System 300)는 개별 이용도 가능한가요?',
    a: '네, 물론입니다. 각 서비스는 해당 분야 전문 독립 플랫폼(domain.icrm.co.kr, icrm.co.kr, backlink.icrm.co.kr, onoff.icrm.co.kr/seo-system)으로 운영되어 필요에 따라 단독 이용도 가능하며, 통합 패키지로 진행 시 전체적인 유기적 연계 컨설팅을 제공합니다.'
  },
  {
    q: '성과 측정과 진행 상황 보고는 어떻게 이루어지나요?',
    a: '전담 SEO 매니저가 배정되어 키워드 순위 변동, Google Search Console 데이터, 백링크 색인 현황, Core Web Vitals 지표를 대시보드와 정기 보고서로 제공합니다.'
  }
];
