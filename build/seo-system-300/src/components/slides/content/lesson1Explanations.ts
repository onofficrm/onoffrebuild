import type { SlideLearningContent } from './types';

export const LESSON_1_EXPLANATIONS: Record<string, SlideLearningContent> = {
  cover: {
    id: 'lesson-1-slide-01', lessonId: 'lesson-1', order: 1,
    shortTitle: '8단계 실전 프로세스',
    visualKeywords: ['DOMAIN', 'WEBSITE', 'CONTENT', 'MEASURE', 'GEO'],
    explanation: {
      details: [
        { heading: '한 장의 의미', body: [
          '단순 웹사이트 제작이나 일회성 글쓰기로는 성과가 나지 않습니다.',
          '인프라 구축부터 데이터 피드백, 그리고 생성형 AI 인용(GEO)까지 8개 단계가 맞물려 돌아가는 하나의 기술 시스템을 학습합니다.',
        ]},
        { heading: '두 엔진', body: [
          'ENGINE 01 SEO 자산: 도메인과 전환 사이트, 검색의도 글과 색인 검증, 신뢰 백링크와 유입.',
          'ENGINE 02 GEO 확장: 퍼널 측정과 병목 제거, AI 답변 출처 인용.',
          'SEO 자산이 없으면 GEO 인용도 불가능합니다.',
        ]},
      ],
      summary: 'SEO와 GEO를 개별 기술이 아니라 하나의 연결된 실행 파이프라인으로 이해하는 강의입니다.',
      why: ['전체 지도를 먼저 알아야 현재 막힌 단계와 다음 행동을 정확히 선택할 수 있습니다.'],
      onoffUse: ['온오프마케팅의 강의, 도구, 프로젝트, 리포트는 이 8단계 흐름을 기준으로 연결됩니다.'],
      action: ['내 프로젝트가 현재 어느 단계에 있는지 떠올려 봅니다.', '강의가 끝날 때 가장 먼저 실행할 한 단계를 정합니다.'],
    },
    relatedLabel: '전체 로드맵 보기', relatedTab: 'roadmap',
  },
  'why-process': {
    id: 'lesson-1-slide-02', lessonId: 'lesson-1', order: 2,
    shortTitle: '프로세스가 먼저',
    visualKeywords: ['SYSTEM', 'CONNECTION', 'BOTTLENECK', 'FLOW'],
    explanation: {
      details: [
        { heading: '파편화된 접근', body: [
          '도메인 따로, 글쓰기 따로, 링크 따로 생각하면 병목이 어디서 발생하는지 알 수 없습니다.',
          '신규 도메인만 만들거나, 검색의도를 무시한 글을 양산하거나, 무작위 링크를 사면 각 요소가 고립됩니다.',
          '시간과 비용을 쓰고도 성과는 0에 가깝게 수렴할 수 있습니다.',
        ]},
        { heading: '연결된 파이프라인', body: [
          '검증 도메인, 전환형 사이트, 의도 답변 글, 색인 검증, 권위 백링크, 진성 트래픽, 퍼널 측정, GEO 인용이 맞물립니다.',
          '연결되면 병목 지점을 찾고 그다음 단계로 넘어갈 수 있습니다.',
        ]},
      ],
      summary: '검색 성과는 한 가지 작업이 아니라 여러 단계가 연결될 때 만들어집니다.',
      why: ['콘텐츠만 늘리거나 링크만 추가하면 실제 병목을 놓쳐 시간과 비용이 낭비될 수 있습니다.'],
      onoffUse: ['프로젝트 현황과 리포트를 함께 보며 어느 단계에서 성과가 막혔는지 판단합니다.'],
      action: ['지금 반복하고 있지만 성과가 나지 않는 작업을 한 가지 적습니다.', '그 작업의 앞 단계와 뒤 단계를 함께 점검합니다.'],
    },
  },
  philosophy: {
    id: 'lesson-1-slide-03', lessonId: 'lesson-1', order: 3,
    shortTitle: '결과물이 수료',
    visualKeywords: ['LEARN', 'EXECUTE', 'ASSET', 'RESULT'],
    explanation: {
      details: [
        { heading: '4단계 실행 고리', body: [
          'WATCH: 지식 암기가 아니라 무엇을 해야 하는지 판단 기준을 익힙니다. 약 10~15분.',
          'DO: 온오프 플랫폼 도구로 내 실제 프로젝트에 바로 적용합니다.',
          'VERIFY: 색인, 백링크 신호, 트래픽 유입 같은 객관적 지표를 확인합니다.',
          'IMPROVE: 안 되는 단계를 수정해 다음 단계로 들어갑니다.',
        ]},
        { heading: '수료 기준', body: [
          '강의 시청, 도구 실행, 산출물 저장이 한 세트입니다.',
          '8개 미션 산출물이 내 프로젝트에 생성되어야 수료로 봅니다.',
          '눈으로만 보는 강의는 끝났을 때 아무것도 남지 않습니다.',
        ]},
      ],
      summary: '이 과정은 시청 시간이 아니라 자신의 사업에 남긴 실행 결과로 완료 여부를 판단합니다.',
      why: ['지식은 잊히지만 도메인, 사이트, 콘텐츠와 측정 데이터는 사업 자산으로 남습니다.'],
      onoffUse: ['강의별 미션과 프로젝트 기록을 통해 학습 내용을 실제 결과물로 전환합니다.'],
      action: ['이번 과정에서 반드시 완성할 결과물 하나를 정합니다.', '완료 기준을 숫자나 파일 형태로 구체화합니다.'],
    },
    relatedLabel: '내 프로젝트 확인', relatedTab: 'projects',
  },
  'pipeline-overview': {
    id: 'lesson-1-slide-04', lessonId: 'lesson-1', order: 4,
    shortTitle: '8단계 파이프라인',
    visualKeywords: ['INFRA', 'ASSET', 'AUTHORITY', 'GROWTH', 'AI'],
    explanation: {
      details: [
        { heading: '순서', body: [
          '도메인 인프라에서 시작해 GEO까지 4개 구간, 8개 단계로 이어집니다.',
          '01에서 시작해 08까지 완료될 때 지속적으로 개선하는 마케팅 자산이 됩니다.',
          '앞 단계가 준비되지 않으면 뒤 단계의 효율이 떨어집니다.',
        ]},
      ],
      summary: '도메인에서 시작해 웹사이트, 콘텐츠, 색인, 신뢰, 유입, 측정, GEO로 확장되는 전체 순서입니다.',
      why: ['앞 단계가 준비되지 않으면 뒤 단계의 효율이 떨어지므로 실행 순서가 중요합니다.'],
      onoffUse: ['로드맵에서 단계별 완료 조건과 필요한 도구를 확인할 수 있습니다.'],
      action: ['8단계 중 완료한 단계와 아직 시작하지 않은 단계를 표시합니다.', '가장 앞에 있는 미완료 단계를 우선 과제로 선택합니다.'],
    },
    relatedLabel: 'SEO 로드맵 열기', relatedTab: 'roadmap',
  },
  'step01-domain': {
    id: 'lesson-1-slide-05', lessonId: 'lesson-1', order: 5,
    shortTitle: '낙장도메인',
    visualKeywords: ['HISTORY', 'LINKS', 'RELEVANCE', 'RISK'],
    explanation: {
      details: [
        { heading: '왜 출발점인가', body: [
          '신규 도메인은 신뢰와 색인이 쌓이는 데 시간이 걸릴 수 있습니다.',
          '과거 이력과 도메인 신호를 검증해 시간 비용을 줄이는 출발점 후보로 봅니다.',
          '과거 신호는 잔존 가능성이며, 결과 자체는 보장되지 않습니다.',
        ]},
        { heading: '확인할 것', body: [
          '정상 비즈니스 이력, 공공·언론 링크 여부를 외부 원본으로 교차 확인합니다.',
          '위험 신호가 보이면 보류하거나 제외하고 근거를 기록합니다.',
          '실습은 domain.icrm.co.kr에서 내 분야에 맞는 안전 도메인 1개를 고르는 것입니다.',
        ]},
      ],
      summary: '낙장도메인은 과거 이력과 링크 관계를 검토할 가치가 있는 출발점 후보입니다.',
      why: ['과거 운영 이력이 긍정적 자산일 수도 있고 스팸·변조 같은 위험 신호일 수도 있어 반드시 분석해야 합니다.'],
      onoffUse: ['domain.icrm.co.kr에서 후보와 요약을 확인하고, 이력·앵커·링크·위험 신호는 외부 원본 자료에서 교차 검증합니다.'],
      action: ['내 비즈니스와 관련된 후보 도메인을 찾습니다.', '과거 이력, 앵커, 링크 상태를 확인합니다.'],
    },
    relatedLabel: '도메인 도구 열기', relatedTab: 'tools', relatedSubTab: 'catchdomain',
  },
  'step02-website': {
    id: 'lesson-1-slide-06', lessonId: 'lesson-1', order: 6,
    shortTitle: '성과형 홈페이지',
    visualKeywords: ['STRUCTURE', 'SPEED', 'MOBILE', 'CONVERSION'],
    explanation: {
      details: [
        { heading: '사이트의 조건', body: [
          '화려하기만 한 사이트는 검색엔진이 읽지 못하고 이탈만 만들 수 있습니다.',
          '검색엔진이 읽는 구조(시맨틱 제목, 논리적 URL)와 고객이 바로 문의하는 전환 경로가 함께 있어야 합니다.',
        ]},
        { heading: '네 가지 점검', body: [
          '구조: H1~H3와 사일로 URL.',
          '속도: 모바일 Core Web Vitals.',
          '반응형: 모바일 레이아웃.',
          '전환: 1초 안에 이해되는 제안과 문의 버튼.',
          '실습은 온오프빌더로 검색 표준에 맞는 전환 사이트 1개를 만드는 것입니다.',
        ]},
      ],
      summary: '홈페이지는 검색엔진이 이해하는 기술 구조와 방문자가 행동하는 전환 구조를 함께 갖춰야 합니다.',
      why: ['노출이 되어도 속도가 느리거나 행동 동선이 없으면 방문이 문의와 매출로 이어지지 않습니다.'],
      onoffUse: ['홈페이지 제작 현황에서 준비 자료, 구축 단계와 수정 요청을 관리합니다.'],
      action: ['모바일에서 내 사이트의 첫 화면과 속도를 확인합니다.', '방문자가 취해야 할 핵심 행동 버튼을 하나로 정리합니다.'],
    },
    relatedLabel: '홈페이지 제작 보기', relatedTab: 'website', relatedSubTab: 'status',
  },
  'step03-content': {
    id: 'lesson-1-slide-07', lessonId: 'lesson-1', order: 7,
    shortTitle: '검색 의도 콘텐츠',
    visualKeywords: ['PILLAR', 'CLUSTER', 'INTENT', 'E-E-A-T'],
    explanation: {
      details: [
        { heading: '글의 기준', body: [
          '키워드 반복보다 검색 의도를 다루는 완결형 글이 노출과 전환에 유리할 수 있습니다.',
          '경험, 전문성, 권위, 신뢰를 보여주는 구조로 씁니다.',
        ]},
        { heading: '만드는 순서', body: [
          '수요가 있는 질문을 찾고, 정보형인지 상업형인지 의도를 나눕니다.',
          'H1~H3로 답을 정리하고, 관련 글을 묶어 전문성을 보강합니다.',
          '상담·문의·구매로 이어지는 행동을 글 안에 둡니다.',
          '실습은 content.icrm.co.kr에서 완결형 글 1편을 작성하는 것입니다.',
        ]},
      ],
      summary: '사용자의 질문과 검색 의도를 해결하는 콘텐츠를 주제별로 연결해 장기 검색 자산을 만듭니다.',
      why: ['독립된 글을 무작정 늘리는 것보다 핵심 주제와 세부 질문을 연결해야 전문성과 탐색성이 높아집니다.'],
      onoffUse: ['content.icrm.co.kr에서 핵심 주제, 질문, 글 구조와 내부 링크 계획을 정리합니다.'],
      action: ['고객이 자주 묻는 질문 10개를 수집합니다.', '질문을 하나의 핵심 주제와 하위 주제로 묶습니다.'],
    },
    relatedLabel: '콘텐츠 도구 열기', relatedTab: 'tools', relatedSubTab: 'content',
  },
  'step04-indexing': {
    id: 'lesson-1-slide-08', lessonId: 'lesson-1', order: 8,
    shortTitle: '색인 검증',
    visualKeywords: ['CRAWL', 'INDEX', 'GSC', 'VISIBLE'],
    explanation: {
      details: [
        { heading: '색인까지의 길', body: [
          '글을 썼다고 바로 검색되지는 않습니다. 미색인은 자산 낭비에 가깝습니다.',
          '페이지 발행, 사이트맵 제출, 봇 크롤링, 데이터베이스 등재, 그다음 검색 노출입니다.',
          '노출된 뒤의 순위는 별도 평가입니다.',
        ]},
        { heading: '실습', body: [
          'Search Console URL 검사로 발행한 글의 색인 완료 여부를 확인합니다.',
          '색인이 확인되지 않은 글은 검색 결과에 없는 것과 같습니다.',
        ]},
      ],
      summary: '콘텐츠는 검색엔진 데이터베이스에 색인되어야 검색 결과에 노출될 기회를 얻습니다.',
      why: ['발행된 페이지가 크롤링되지 않거나 색인에서 제외되면 콘텐츠 품질과 무관하게 검색 유입이 발생하지 않습니다.'],
      onoffUse: ['Search Console 데이터와 리포트에서 색인 상태와 노출 변화를 확인합니다.'],
      action: ['최근 발행한 URL의 색인 여부를 검사합니다.', '미색인 페이지의 기술적 원인과 콘텐츠 품질을 점검합니다.'],
    },
    relatedLabel: '성과 리포트 보기', relatedTab: 'reports',
  },
  'step05-backlink': {
    id: 'lesson-1-slide-09', lessonId: 'lesson-1', order: 9,
    shortTitle: '신뢰 링크',
    visualKeywords: ['AUTHORITY', 'RELEVANCE', 'CONTEXT', 'ANCHOR'],
    explanation: {
      details: [
        { heading: '차이나는 링크', body: [
          '내가 좋다고 말하는 것과 남이 추천하는 것은 다릅니다.',
          '관련 있는 외부 출처의 자연스러운 인용은 신뢰 신호가 될 수 있습니다.',
          '스팸성 대량 링크는 품질 위험 신호입니다.',
        ]},
        { heading: '우선하는 출처', body: [
          '산업 매체, 관련 분야 글, 공식 디렉토리, 공공·교육 기관 인용을 먼저 봅니다.',
          '실습은 backlink.icrm.co.kr에서 분야에 맞는 링크 프로필을 점검하는 것입니다.',
        ]},
      ],
      summary: '백링크는 개수보다 출처의 신뢰도, 주제 관련성과 연결 문맥이 중요합니다.',
      why: ['대량의 자동 링크는 위험 신호가 될 수 있지만 관련 분야의 자연스러운 인용은 사이트 신뢰를 강화합니다.'],
      onoffUse: ['backlink.icrm.co.kr에서 참조 도메인, 링크 문맥과 앵커 분포를 점검합니다.'],
      action: ['현재 링크 중 관련성이 높은 출처와 낮은 출처를 구분합니다.', '인용될 가치가 있는 원본 자료를 기획합니다.'],
    },
    relatedLabel: '백링크 도구 열기', relatedTab: 'tools', relatedSubTab: 'backlink',
  },
  'step06-traffic': {
    id: 'lesson-1-slide-10', lessonId: 'lesson-1', order: 10,
    shortTitle: '실사용자 유입',
    visualKeywords: ['VISIT', 'ENGAGE', 'DWELL', 'RETURN'],
    explanation: {
      details: [
        { heading: '방문의 흐름', body: [
          '검색 후 클릭, 콘텐츠 체류, 내부 글 탐색, 상담 문의로 이어지는 여정을 봅니다.',
          '체류, 스크롤, 상호작용은 사용자 행동을 읽는 참고 데이터입니다.',
        ]},
        { heading: '무효와 유효', body: [
          '숫자만 부풀린 유입은 바로 이탈하면 의미가 없습니다.',
          '자연스러운 체류와 상호작용이 있는 유입을 신호로 봅니다.',
          '실습은 traffic.icrm.co.kr에서 체류형 검색 유입을 확인하는 것입니다.',
        ]},
      ],
      summary: '사이트가 준비되면 실제 사용자의 방문과 행동 데이터를 축적해야 개선 방향을 판단할 수 있습니다.',
      why: ['노출 수만으로는 콘텐츠가 사용자의 문제를 해결했는지 알 수 없으며 체류와 전환 행동을 함께 봐야 합니다.'],
      onoffUse: ['traffic.icrm.co.kr과 분석 리포트에서 유입 경로와 주요 행동을 비교합니다.'],
      action: ['핵심 페이지의 유입 경로와 이탈 지점을 확인합니다.', '사용자가 다음에 이동할 내부 링크를 보강합니다.'],
    },
    relatedLabel: '트래픽 도구 열기', relatedTab: 'tools', relatedSubTab: 'traffic',
  },
  'step07-analytics': {
    id: 'lesson-1-slide-11', lessonId: 'lesson-1', order: 11,
    shortTitle: '성과 측정',
    visualKeywords: ['IMPRESSION', 'CLICK', 'SESSION', 'CONVERSION'],
    explanation: {
      details: [
        { heading: '퍼널', body: [
          '노출, 클릭, 체류, 전환을 한 줄로 놓고 가장 크게 떨어지는 구간을 찾습니다.',
          '예시 화면의 숫자는 읽는 법을 보여 주는 참고이며, 내 프로젝트 수치로 대체합니다.',
          '클릭률이 병목이면 제목과 설명을 고친 뒤 다시 측정합니다.',
        ]},
        { heading: '실습', body: [
          '대시보드에서 내 프로젝트의 1순위 병목 한 곳을 찾습니다.',
          '어디가 막혔는지 알면 다음에 손댈 곳이 정해집니다.',
        ]},
      ],
      summary: '노출에서 전환까지의 데이터를 연결해 성과를 막는 가장 큰 병목을 찾습니다.',
      why: ['느낌으로 모든 단계를 동시에 수정하면 원인을 알 수 없고 개선 효과도 측정하기 어렵습니다.'],
      onoffUse: ['GA4, Search Console과 온오프 플랫폼 데이터를 함께 활용해 노출부터 전환까지 비교합니다.'],
      action: ['지난 기간 대비 가장 크게 떨어진 지표를 찾습니다.', '그 지표에 직접 영향을 주는 한 가지 작업만 우선 실행합니다.'],
    },
    relatedLabel: '성과 리포트 보기', relatedTab: 'reports',
  },
  'step08-geo': {
    id: 'lesson-1-slide-12', lessonId: 'lesson-1', order: 12,
    shortTitle: 'AI 인용 확장',
    visualKeywords: ['QUESTION', 'ENTITY', 'CITATION', 'BRAND'],
    explanation: {
      details: [
        { heading: 'SEO와 GEO', body: [
          '전통 SEO의 목표는 검색 결과 노출입니다.',
          'GEO는 그 자산을 바탕으로 AI 답변의 인용 후보가 되게 하는 확장입니다.',
          '관련 근거와 출처가 충분할 때 내 브랜드가 답변의 인용 후보가 될 수 있습니다.',
        ]},
        { heading: '실습', body: [
          'geo-up.icrm.co.kr에서 내 브랜드의 AI 인용 상태를 진단합니다.',
        ]},
      ],
      summary: 'GEO는 검색 자산을 기반으로 생성형 AI 답변에서 신뢰할 수 있는 출처로 선택되게 하는 확장 단계입니다.',
      why: ['AI는 일관된 브랜드 정보, 명확한 사실과 외부 검증이 있는 출처를 더 안정적으로 활용합니다.'],
      onoffUse: ['geo.icrm.co.kr에서 현재 상태를 진단하고 geo-up.icrm.co.kr에서 개선 과정을 관리합니다.'],
      action: ['고객이 AI에 물을 핵심 질문을 작성합니다.', '그 질문에 답하는 명확한 근거 페이지가 있는지 확인합니다.'],
    },
  },
  'seo-and-geo': {
    id: 'lesson-1-slide-13', lessonId: 'lesson-1', order: 13,
    shortTitle: 'SEO에서 GEO로',
    visualKeywords: ['SEO ASSET', 'FACT', 'ENTITY', 'AI CITATION'],
    explanation: {
      details: [
        { heading: '아래층 SEO', body: [
          '안전한 도메인과 구조적 사이트, 검색의도 콘텐츠와 색인, 고품질 링크와 실제 체류가 기초 체력입니다.',
        ]},
        { heading: '위층 GEO', body: [
          'AI가 웹을 볼 때 브랜드를 신뢰 출처로 고르게 하려면 엔티티, 질문에 대한 답, 출처 인용이 필요합니다.',
          'SEO 자산이 부실하면 AI는 인용할 데이터가 없어 브랜드를 언급하지 못할 수 있습니다.',
        ]},
      ],
      summary: 'SEO와 GEO는 별개가 아니라 검색에서 검증된 정보 자산이 AI 인용으로 확장되는 관계입니다.',
      why: ['기반 콘텐츠와 브랜드 신뢰 없이 AI 노출만 따로 만들려 하면 답변의 근거가 부족해집니다.'],
      onoffUse: ['검색 성과가 있는 콘텐츠를 중심으로 사실, 출처와 브랜드 엔터티 정보를 강화합니다.'],
      action: ['검색 유입이 좋은 콘텐츠 3개를 고릅니다.', '각 콘텐츠의 핵심 사실과 출처 표시를 보강합니다.'],
    },
  },
  'flywheel-loop': {
    id: 'lesson-1-slide-14', lessonId: 'lesson-1', order: 14,
    shortTitle: '성장 플라이휠',
    visualKeywords: ['EXECUTE', 'MEASURE', 'IMPROVE', 'REPEAT'],
    explanation: {
      details: [
        { heading: '반복', body: [
          '실행, 측정, 개선, 재실행이 한 바퀴입니다.',
          '1회로 끝나지 않고 돌릴수록 검색에서 다루는 범위와 근거가 쌓입니다.',
        ]},
        { heading: '피드백', body: [
          '07 측정에서 보인 병목을 03 콘텐츠와 05 백링크에 다시 넣습니다.',
          '도메인, 웹사이트, 콘텐츠, 색인, 백링크, 유입, 측정, GEO가 닫힌 고리로 돕니다.',
        ]},
      ],
      summary: '8단계는 한 번 끝나는 직선 과정이 아니라 측정 결과를 다시 실행에 반영하는 반복 성장 구조입니다.',
      why: ['시장과 검색 환경이 계속 변하므로 구축 후 방치하면 성과가 정체됩니다.'],
      onoffUse: ['로드맵과 리포트를 오가며 완료한 단계도 데이터에 따라 다시 개선합니다.'],
      action: ['최근 실행한 작업의 측정 지표를 정합니다.', '다음 반복에서 바꿀 한 가지를 기록합니다.'],
    },
    relatedLabel: '로드맵 진행 확인', relatedTab: 'roadmap',
  },
  'platform-ecosystem': {
    id: 'lesson-1-slide-15', lessonId: 'lesson-1', order: 15,
    shortTitle: '통합 실행 환경',
    visualKeywords: ['LEARN', 'TOOLS', 'PROJECT', 'REPORT'],
    explanation: {
      details: [
        { heading: '연결된 도구', body: [
          '도메인, 빌더, 콘텐츠, 색인, 백링크, 트래픽, 측정, GEO-UP이 같은 실습실에 있습니다.',
          '교육 화면 옆에 도구를 띄우고 강의마다 실제 데이터를 만듭니다.',
          '이론만 듣고 끝나지 않도록 매 단계의 결과를 프로젝트에 남깁니다.',
        ]},
      ],
      summary: '온오프 교육 플랫폼은 강의와 실행 도구, 프로젝트, 성과 기록을 하나의 흐름으로 연결합니다.',
      why: ['학습과 실행 도구가 분리되면 배운 내용을 실제 업무로 옮기는 과정에서 누락이 생깁니다.'],
      onoffUse: ['슬라이드에서 이해하고 도구에서 실행한 뒤 프로젝트와 리포트에 결과를 남깁니다.'],
      action: ['현재 사용할 수 있는 메뉴와 도구를 확인합니다.', '강의별 실행 결과를 저장할 위치를 정합니다.'],
    },
  },
  'student-journey': {
    id: 'lesson-1-slide-16', lessonId: 'lesson-1', order: 16,
    shortTitle: '수강생 실행 흐름',
    visualKeywords: ['WATCH', 'APPLY', 'RECORD', 'FEEDBACK'],
    explanation: {
      details: [
        { heading: '한 강의의 순서', body: [
          '시청으로 기준을 익히고, 오늘 할 미션 하나를 확인합니다.',
          '도구로 실행하고, 색인·링크·유입을 검증한 뒤 대시보드에 기록합니다.',
          '병목이 풀리면 다음 단계로 갑니다.',
        ]},
        { heading: '완료 원칙', body: [
          '다음 강의를 이어 보기 전에 현재 강의의 미션 결과물이 있어야 합니다.',
          '몰아서 듣기보다 1강당 자산 1개를 만듭니다.',
        ]},
      ],
      summary: '수강생은 강의를 본 뒤 자신의 프로젝트에 적용하고 결과를 기록하며 다음 단계로 이동합니다.',
      why: ['보기만 하는 학습보다 실행과 피드백을 반복해야 판단 기준이 자신의 역량으로 남습니다.'],
      onoffUse: ['강의실, 오늘의 미션, 프로젝트와 리포트를 순서대로 활용합니다.'],
      action: ['이번 강의 직후 수행할 작업 시간을 확보합니다.', '완료 결과를 캡처하거나 문서로 기록합니다.'],
    },
  },
  'project-outcomes': {
    id: 'lesson-1-slide-17', lessonId: 'lesson-1', order: 17,
    shortTitle: '남는 프로젝트 자산',
    visualKeywords: ['DOMAIN', 'SITE', 'CONTENT', 'DATA', 'PROOF'],
    explanation: {
      details: [
        { heading: '남는 것', body: [
          '안전 도메인, 전환 사이트, 검색의도 글, 색인 확인, 링크 프로필, 체류 데이터, 병목 보고서, AI 인용 진단입니다.',
          '배운 메모가 아니라 프로젝트에 만든 파일이 남습니다.',
          '결과물은 교육이 끝난 뒤에도 고치며 쓸 수 있습니다.',
        ]},
      ],
      summary: '강의가 진행될수록 사업에 실제로 남고 작동하는 디지털 자산이 누적됩니다.',
      why: ['실물 결과물이 있어야 이후 성과를 측정하고 다른 사람과 협업할 수 있습니다.'],
      onoffUse: ['프로젝트 화면에서 결과물, 진행 단계와 활동 기록을 한곳에 모읍니다.'],
      action: ['현재 보유한 결과물과 부족한 결과물을 구분합니다.', '완료한 작업의 링크나 파일을 프로젝트에 기록합니다.'],
    },
    relatedLabel: '내 프로젝트 보기', relatedTab: 'projects',
  },
  'lesson1-mission': {
    id: 'lesson-1-slide-18', lessonId: 'lesson-1', order: 18,
    shortTitle: '현재 위치 진단',
    visualKeywords: ['CURRENT', 'GAP', 'PRIORITY', 'NEXT'],
    explanation: {
      details: [
        { heading: '세 가지 질문', body: [
          '진행 위치: 8단계 중 어디인가. 백지인지, 글은 있는데 색인과 유입이 멈췄는지.',
          '핵심 병목: 색인이 안 되는지, 방문은 있는데 문의가 없는지. 문제 하나만 고릅니다.',
          '최우선 과제: 이번 주 실행할 행동 하나. 여러 개를 동시에 벌리지 않습니다.',
        ]},
        { heading: '기록', body: [
          '실습 워크스페이스에 세 답변을 남깁니다.',
        ]},
      ],
      summary: '1강 미션은 내 프로젝트가 8단계 중 어디에 있고 무엇을 먼저 해야 하는지 결정하는 것입니다.',
      why: ['현재 위치를 모르면 쉬운 일이나 익숙한 일만 반복하게 됩니다.'],
      onoffUse: ['로드맵에서 단계별 상태를 확인하고 오늘 실행할 우선 과제를 선택합니다.'],
      action: ['완료, 진행 중, 시작 전 단계를 구분합니다.', '가장 앞선 미완료 단계의 첫 작업을 시작합니다.'],
    },
    relatedLabel: '오늘의 로드맵 열기', relatedTab: 'roadmap',
  },
  'completion-criteria': {
    id: 'lesson-1-slide-19', lessonId: 'lesson-1', order: 19,
    shortTitle: '1강 완료 기준',
    visualKeywords: ['EXPLAIN', 'LOCATE', 'DECIDE'],
    explanation: {
      details: [
        { heading: '완료로 보는 기준', body: [
          '왜 한 가지 작업만으로는 성과가 나지 않는지, 도메인부터 GEO까지 순서가 필요한지 설명할 수 있다.',
          '내 프로젝트가 몇 단계에 있고, 색인·링크·유입 중 1순위 문제가 어디인지 짚었다.',
          '2강으로 가기 전에 당장 할 인프라 과제 하나를 정했다.',
        ]},
      ],
      summary: '8단계를 설명하고 현재 프로젝트의 위치와 다음 행동을 선택할 수 있으면 1강을 완료한 것입니다.',
      why: ['용어를 기억하는 것보다 실제 상황에서 우선순위를 판단하는 능력이 중요합니다.'],
      onoffUse: ['로드맵 상태와 선택한 우선 과제를 기준으로 1강 학습 결과를 확인합니다.'],
      action: ['8단계를 자신의 말로 설명합니다.', '현재 병목과 다음 행동을 한 문장으로 적습니다.'],
    },
  },
  'next-preview': {
    id: 'lesson-1-slide-20', lessonId: 'lesson-1', order: 20,
    shortTitle: '2강 예고',
    visualKeywords: ['RELEVANCE', 'HISTORY', 'BACKLINK', 'SPAM', 'DECISION'],
    explanation: {
      details: [
        { heading: '2강에서 보는 것', body: [
          '신뢰 신호와 아카이브의 정상 이력을 읽는 법.',
          '위험 이력과 앵커는 외부 자료로 교차 검증해 스팸 도메인을 걸러 냅니다.',
          '실습 목표는 내 비즈니스에 맞는 안전 도메인 1개를 고르는 것입니다.',
          '1강 실습을 마친 뒤 2강으로 이동합니다.',
        ]},
      ],
      summary: '2강에서는 낙장도메인을 단일 수치가 아니라 주제, 이력, 링크와 위험 신호를 함께 보고 판단합니다.',
      why: ['좋아 보이는 수치만 믿고 구매하면 과거 스팸 이력과 무관한 링크까지 함께 떠안을 수 있습니다.'],
      onoffUse: ['도메인 분석 도구로 후보를 찾고 동일한 기준표로 비교합니다.'],
      action: ['분석할 후보 3개를 준비합니다.', '구매가 아니라 활용·보류·제외 판단을 목표로 둡니다.'],
    },
    relatedLabel: '2강 슬라이드 시작',
  },
};
