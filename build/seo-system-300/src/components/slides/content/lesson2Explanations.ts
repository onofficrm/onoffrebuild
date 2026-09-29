import type { SlideLearningContent } from './types';
import { EXPIRED_DOMAIN_TIPS } from './expiredDomainTips';

export const LESSON_2_EXPLANATIONS: Record<string, SlideLearningContent> = {
  'l2-cover': {
    id: 'lesson-2-slide-01', lessonId: 'lesson-2', order: 1,
    shortTitle: '낙장도메인 분석',
    visualKeywords: ['FIND', 'VERIFY', 'COMPARE', 'DECIDE'],
    explanation: {
      details: [
        { heading: '이 강의의 세 축', body: [
          '검증 도구로 후보를 보고, 위험 도메인을 미리 거릅니다.',
          '수료 기준은 구매 개수가 아니라 스스로 판단할 수 있는 것입니다.',
          '좋음과 위험은 검증 후에 나뉩니다.',
        ]},
      ],
      summary: '2강의 목표는 도메인을 많이 찾는 것이 아니라 안전성과 활용 가치를 스스로 판단하는 것입니다.',
      why: ['낙장도메인은 과거의 긍정적 자산과 부정적 이력을 모두 이어받을 수 있습니다.'],
      onoffUse: ['플랫폼 요약과 공통 체크리스트로 후보를 좁히고, 상세 이력과 링크는 외부 원본 자료로 검증합니다.'],
      action: ['분석 대상 후보 3개를 준비합니다.', '매수보다 근거 있는 판단을 목표로 설정합니다.'],
    },
    relatedLabel: '도메인 도구 열기', relatedTab: 'tools', relatedSubTab: 'catchdomain',
  },
  'l2-what-is-expired': {
    id: 'lesson-2-slide-02', lessonId: 'lesson-2', order: 2,
    shortTitle: '낙장도메인이란',
    visualKeywords: ['EXPIRED', 'DELETED', 'AVAILABLE', 'HISTORY'],
    explanation: {
      details: [
        { heading: '생애 주기', body: [
          '운영 중이던 도메인이 만료되고, 삭제된 뒤 다시 등록할 수 있게 된 이름입니다.',
          '새 소유자는 이름과 함께 검색엔진과 외부 사이트에 남은 과거 흔적의 영향도 받을 수 있습니다.',
        ]},
      ],
      summary: '낙장도메인은 과거 등록자가 사용했지만 등록이 종료되어 다시 등록 가능한 상태가 된 도메인입니다.',
      why: ['새 소유자는 이름만 얻는 것이 아니라 검색엔진과 외부 사이트에 남은 과거 흔적의 영향도 받을 수 있습니다.'],
      onoffUse: ['후보의 등록 가능 여부와 함께 과거 운영 이력과 링크 관계를 확인합니다.'],
      action: ['신규 도메인과 낙장도메인의 차이를 설명해 봅니다.', '후보의 최초 등록과 최근 사용 흔적을 확인합니다.'],
    },
  },
  'l2-why-analyze': {
    id: 'lesson-2-slide-03', lessonId: 'lesson-2', order: 3,
    shortTitle: '분석이 필요한 이유',
    visualKeywords: ['TRUST', 'INDEX', 'SANDBOX', 'RISK'],
    explanation: {
      details: [
        { heading: '신규와 비교', body: [
          '신규 도메인은 초기 이력이 없고, 색인·노출에 시간이 필요하며 외부 권위 링크가 없습니다.',
          '검증된 낙장도메인은 과거 신호가 남아 있을 수 있고, 공공·언론 링크가 있을 수 있습니다.',
          '빠른 색인·노출은 가능성이며 결과는 보장되지 않습니다. 상대적 출발 조건을 비교하는 슬라이드입니다.',
        ]},
      ],
      summary: '분석 목적은 과거 신뢰 자산을 활용할 가능성과 함께 숨은 위험을 확인하는 것입니다.',
      why: ['좋은 이력이 있으면 출발이 유리할 수 있지만 문제가 있는 이력은 새 프로젝트의 성과를 방해합니다.'],
      onoffUse: ['도구의 지표를 후보 선별 신호로 사용하고 최종 판단은 이력과 맥락을 함께 보고 내립니다.'],
      action: ['후보마다 기대 이점과 예상 위험을 각각 적습니다.', '검증되지 않은 장점을 사실처럼 단정하지 않습니다.'],
    },
  },
  'l2-holistic-eval': {
    id: 'lesson-2-slide-04', lessonId: 'lesson-2', order: 4,
    shortTitle: '입체 평가',
    visualKeywords: ['RELEVANCE', 'HISTORY', 'LINKS', 'ANCHOR', 'SPAM', 'POLICY'],
    explanation: {
      details: [
        { heading: '여섯 신호', body: [
          '운영 이력, 주제 맥락, 링크 품질, 앵커 분포, 스팸 신호, 상표 리스크를 함께 봅니다.',
          '종합 품질은 PASS, HOLD, DROP으로 나눕니다.',
          '한 개 지표가 높아도 다른 위험이 가려질 수 있습니다.',
        ]},
      ],
      summary: 'DA나 DR 같은 단일 점수가 아니라 여러 품질 축을 교차 검증해 후보의 전체 맥락을 판단합니다.',
      why: ['하나의 높은 수치는 조작되거나 다른 위험을 가릴 수 있어 구매 결정의 충분한 근거가 아닙니다.'],
      onoffUse: ['주제, 이력, 백링크, 앵커, 스팸과 정책 위험을 같은 체크리스트로 기록합니다.'],
      action: ['후보마다 6개 평가 축을 빠짐없이 채웁니다.', '점수와 실제 이력이 충돌하면 이력을 우선 확인합니다.'],
    },
  },
  'l2-check01-relevance': {
    id: 'lesson-2-slide-05', lessonId: 'lesson-2', order: 5,
    shortTitle: '주제 관련성',
    visualKeywords: ['PAST TOPIC', 'BUSINESS FIT', 'CONTEXT', 'MATCH'],
    explanation: {
      details: [
        { heading: '일치 예', body: [
          '과거가 골프 장비 리뷰이고 계획이 골프 레슨이면 주제 맥락이 이어집니다.',
        ]},
        { heading: '불일치 예', body: [
          '과거가 중고차 매매이고 계획이 피부과이면 주제가 끊기고 기존 링크의 기대와 맞지 않습니다.',
          '도메인 글자보다 과거 주제 일치를 먼저 봅니다.',
        ]},
      ],
      summary: '과거 사이트의 주제와 앞으로 운영할 사업의 맥락이 자연스럽게 연결되는지 확인합니다.',
      why: ['주제가 단절되면 기존 링크와 방문자의 기대가 새 콘텐츠와 맞지 않아 신뢰 자산으로 활용하기 어렵습니다.'],
      onoffUse: ['Wayback 화면과 과거 페이지 제목을 확인해 업종과 콘텐츠 주제를 분류합니다.'],
      action: ['과거 업종과 현재 업종을 한 문장씩 적습니다.', '두 주제가 같은 이용자 문제를 다루는지 판단합니다.'],
    },
  },
  'l2-check02-history': {
    id: 'lesson-2-slide-06', lessonId: 'lesson-2', order: 6,
    shortTitle: '과거 이력',
    visualKeywords: ['WAYBACK', 'TIMELINE', 'CHANGE', 'INTEGRITY'],
    explanation: {
      details: [
        { heading: '시간 순서', body: [
          '정상 운영, 운영 중단, 스팸 변조, 삭제를 연도별로 봅니다.',
          '스팸 변조 흔적이 한 번이라도 있으면 제외합니다.',
          '설명할 수 없는 업종 변화가 있으면 보류합니다.',
        ]},
      ],
      summary: '웹 아카이브에서 정상 운영, 소유권 변화, 방치와 스팸 변조 흔적을 시간순으로 확인합니다.',
      why: ['짧은 기간이라도 도박·성인·피싱 등으로 변조된 이력은 재사용 위험을 크게 높입니다.'],
      onoffUse: ['연도별 스냅샷을 열어 업종 변화와 비정상 페이지가 등장한 시점을 기록합니다.'],
      action: ['최초·중간·최근 시점의 화면을 각각 확인합니다.', '설명할 수 없는 업종 변화가 있으면 보류합니다.'],
    },
  },
  'l2-check03-backlinks': {
    id: 'lesson-2-slide-07', lessonId: 'lesson-2', order: 7,
    shortTitle: '백링크 품질',
    visualKeywords: ['SOURCE', 'CONTEXT', 'RD', 'TOXIC'],
    explanation: {
      details: [
        { heading: '두 네트워크', body: [
          '신뢰 네트워크: 공공·언론, 관련 업계의 자연 인용.',
          '조작 네트워크: 자동 생성, 무관한 급증, 유해 출처. 이것은 리스크입니다.',
          '상위 참조 도메인을 직접 열어 좋은 링크와 유해 가능 링크를 나눕니다.',
        ]},
      ],
      summary: '링크 수보다 어떤 사이트가 어떤 이유와 문맥으로 연결했는지를 확인합니다.',
      why: ['공공기관이나 관련 업계의 자연 인용은 가치가 있지만 자동 생성 링크는 검색 위험을 키울 수 있습니다.'],
      onoffUse: ['참조 도메인의 종류, 관련성, 링크 문맥과 비정상 집중 여부를 비교합니다.'],
      action: ['상위 참조 도메인 10개를 직접 확인합니다.', '좋은 링크와 유해 가능 링크를 구분해 기록합니다.'],
    },
  },
  'l2-check04-anchors': {
    id: 'lesson-2-slide-08', lessonId: 'lesson-2', order: 8,
    shortTitle: '앵커 텍스트',
    visualKeywords: ['BRAND', 'NATURAL', 'COMMERCIAL', 'SPAM'],
    explanation: {
      details: [
        { heading: '분포', body: [
          '자연 앵커는 브랜드명, URL, 일반 문구가 중심입니다.',
          '스팸 앵커는 도박·대출 같은 상업 키워드가 비정상적으로 많습니다.',
          '업종과 무관한 스팸 앵커가 보이면 조작이나 해킹 이력을 추가로 조사합니다.',
        ]},
      ],
      summary: '앵커 텍스트 분포는 과거 이용자가 도메인을 어떤 이름과 목적으로 인식했는지 보여줍니다.',
      why: ['도박·대출 같은 상업성 키워드가 비정상적으로 많으면 조작이나 해킹 이력을 의심해야 합니다.'],
      onoffUse: ['브랜드, URL, 일반 문구와 상업·스팸 키워드의 비율을 나눠 확인합니다.'],
      action: ['상위 앵커 20개를 유형별로 분류합니다.', '업종과 무관한 스팸 앵커가 보이면 추가 이력을 조사합니다.'],
    },
  },
  'l2-check05-spam': {
    id: 'lesson-2-slide-09', lessonId: 'lesson-2', order: 9,
    shortTitle: '스팸 신호',
    visualKeywords: ['GAMBLING', 'ADULT', 'PHARMA', 'HACK', 'REDIRECT'],
    explanation: {
      details: [
        { heading: '다섯 신호', body: [
          '도박·성인, 문서 복제, 링크 급증, 주제 변조, 상표·리디렉션.',
          '하나라도 보이면 멈추고 아카이브, 앵커, 링크, 검색 결과로 교차 검증합니다.',
          '확인되면 보류하거나 제외하고 근거 화면을 남깁니다.',
        ]},
      ],
      summary: '치명적인 위험 신호를 발견하면 낙관적으로 해석하지 말고 추가 검증 후 보류하거나 제외합니다.',
      why: ['스팸 흔적은 검색 신뢰뿐 아니라 브랜드 안전과 사용자 보안에도 영향을 줄 수 있습니다.'],
      onoffUse: ['아카이브, 앵커, 링크 출처와 검색 결과를 함께 확인해 단일 오탐 가능성을 줄입니다.'],
      action: ['위험 신호 체크리스트를 모두 확인합니다.', '하나라도 발견되면 근거 URL이나 화면을 기록합니다.'],
    },
  },
  'l2-expired-domain-abuse': {
    id: 'lesson-2-slide-10', lessonId: 'lesson-2', order: 10,
    shortTitle: '정상 활용과 악용',
    visualKeywords: ['USER VALUE', 'RELEVANCE', 'MANIPULATION', 'POLICY'],
    explanation: {
      details: [
        { heading: '정상과 악용', body: [
          '정상 활용은 과거 주제와 이어지고, 사용자에게 줄 가치가 있으며, 정식 서비스로 오래 운영하는 경우입니다.',
          '정책 악용은 사용자 가치 없이 기존 신뢰만 빌려 순위를 노리는 경우입니다.',
          '과거 주제와 무관하게 바꾸려면 다른 도메인을 검토합니다.',
        ]},
      ],
      summary: '만료 도메인 재등록 자체가 문제가 아니라 과거 평판을 이용해 검색 순위를 조작하는 방식이 위험합니다.',
      why: ['Google은 사용자 가치 없이 기존 신뢰만 편취하는 저품질 활용을 스팸 정책 대상으로 볼 수 있습니다.'],
      onoffUse: ['과거 주제와 새 서비스의 연속성, 실제 사용자 가치와 장기 운영 계획을 함께 검토합니다.'],
      action: ['새 사이트가 사용자에게 제공할 독립적인 가치를 설명합니다.', '과거 주제와 무관한 전환이라면 다른 도메인을 검토합니다.'],
    },
  },
  'l2-tool-dashboard': {
    id: 'lesson-2-slide-11', lessonId: 'lesson-2', order: 11,
    shortTitle: '분석 화면 읽기',
    visualKeywords: ['OVERVIEW', 'HISTORY', 'BACKLINK', 'ANCHOR', 'RISK'],
    explanation: {
      details: [
        { heading: '다섯 구역', body: [
          '도메인 기본(TLD, 등록 가능), 과거 운영 이력, 백링크 품질, 앵커 텍스트, 리스크.',
          '도구의 1차 분류 다음에 사람이 최종 판단합니다.',
          '상세 이력·링크·앵커·위험은 외부 원본에서 다시 확인합니다.',
        ]},
      ],
      summary: '도메인 분석 화면에서는 핵심 영역을 정해진 순서로 확인하고 최종 판단 근거를 남깁니다.',
      why: ['많은 숫자를 무작위로 보면 중요한 위험 신호를 놓치고 높은 점수에만 끌릴 수 있습니다.'],
      onoffUse: ['교육 플랫폼에서는 선택 도메인과 후보 수를 확인하고, 상세 이력·링크·앵커·위험 정보는 외부 원본 서비스에서 직접 검증합니다.'],
      action: ['분석 화면의 5개 영역을 차례로 확인합니다.', '도구의 1차 분류와 내 판단이 다른 이유를 기록합니다.'],
    },
    expiredDomainTips: EXPIRED_DOMAIN_TIPS,
    expiredDomainTipsMode: 'guide',
    relatedLabel: '도메인 도구 열기', relatedTab: 'tools', relatedSubTab: 'catchdomain',
  },
  'l2-analysis-pipeline': {
    id: 'lesson-2-slide-12', lessonId: 'lesson-2', order: 12,
    shortTitle: '분석 순서',
    visualKeywords: ['DISCOVER', 'FILTER', 'VERIFY', 'COMPARE', 'DECIDE'],
    explanation: {
      details: [
        { heading: '8단계', body: [
          '후보 검색, 주제 관련성, 아카이브, 백링크, 앵커, 스팸 위험, 후보 비교, 최종 판정.',
          '앞 단계에서 치명적 탈락 사유가 나오면 그 후보는 멈추고 다음 후보로 갑니다.',
          '통과한 후보만 비교표에 올립니다.',
        ]},
      ],
      summary: '후보 수집부터 빠른 제외, 상세 검증, 비교와 최종 결정까지 분석 절차를 표준화합니다.',
      why: ['매번 다른 순서로 분석하면 기준이 흔들리고 이미 탈락한 후보에 시간을 낭비하게 됩니다.'],
      onoffUse: ['동일한 체크리스트와 비교표를 사용해 모든 후보를 같은 기준으로 처리합니다.'],
      action: ['앞 단계에서 치명적 탈락 사유가 나오면 분석을 중단합니다.', '통과 후보만 상세 비교표에 올립니다.'],
    },
  },
  'l2-compare-three': {
    id: 'lesson-2-slide-13', lessonId: 'lesson-2', order: 13,
    shortTitle: '후보 3개 비교',
    visualKeywords: ['A USE', 'B REJECT', 'C HOLD', 'EVIDENCE'],
    explanation: {
      details: [
        { heading: '예시 판정', body: [
          'A 활용: 주제 일치, 지표 균형, 공공·언론 링크, 정상 운영 이력.',
          'B 제외: 주제 불일치, 편향 지표, 도박성 링크, 변조 이력.',
          'C 보류: 주제는 보통, 링크는 있으나 운영 공백이 있어 추가 확인.',
          '개별 후보만 보면 장점이 커 보이므로 같은 칸에 놓고 비교합니다.',
        ]},
      ],
      summary: '세 후보를 동일한 기준으로 나란히 놓고 활용, 제외, 조건부 보류로 구분합니다.',
      why: ['개별 후보만 보면 장점이 과대평가되지만 대조하면 상대적인 위험과 활용성이 명확해집니다.'],
      onoffUse: ['후보 비교표에 각 판단의 근거와 확인이 필요한 항목을 함께 기록합니다.'],
      action: ['후보별 장점과 치명적 위험을 한 줄씩 적습니다.', '최종 선택보다 제외와 보류 근거부터 확정합니다.'],
    },
    expiredDomainTips: EXPIRED_DOMAIN_TIPS,
    expiredDomainTipsMode: 'checklist',
  },
  'l2-pass-is-also-good': {
    id: 'lesson-2-slide-14', lessonId: 'lesson-2', order: 14,
    shortTitle: 'PASS도 좋은 판단',
    visualKeywords: ['SAFE', 'HOLD', 'REJECT', 'NO FORCE'],
    explanation: {
      details: [
        { heading: '선별 퍼널', body: [
          '다수 후보를 모으고, 지표로 1차 거르고, 이력·링크로 정밀 검증한 뒤 안전 후보만 남깁니다.',
          '애매하면 PASS하고 신규 도메인도 비교합니다.',
          '억지 구매는 복구와 브랜드 위험이 비용보다 클 수 있습니다.',
        ]},
      ],
      summary: '안전하고 관련성 높은 후보가 없다면 구매하지 않는 것이 가장 좋은 결과일 수 있습니다.',
      why: ['애매한 자산을 억지로 구매하면 비용보다 복구와 브랜드 위험이 더 커질 수 있습니다.'],
      onoffUse: ['활용·보류·제외 기준을 분명히 하고 적합한 후보가 없으면 신규 도메인도 비교합니다.'],
      action: ['구매하지 않을 조건을 먼저 정합니다.', '보류 후보는 추가 확인 항목과 재검토 날짜를 기록합니다.'],
    },
  },
  'l2-mission': {
    id: 'lesson-2-slide-15', lessonId: 'lesson-2', order: 15,
    shortTitle: '3후보 실전 판정',
    visualKeywords: ['3 CANDIDATES', '5 CHECKS', 'USE', 'HOLD', 'REJECT'],
    explanation: {
      details: [
        { heading: '미션', body: [
          '후보 3개에 대해 이력, 백링크, 앵커, 스팸을 확인하고 활용·보류·제외로 판정합니다.',
          '도구에서 본 값과 외부에서 확인한 근거를 구분해서 적습니다.',
          '매수보다 근거 있는 판정이 목표입니다.',
        ]},
      ],
      summary: '후보 3개를 핵심 항목으로 교차 점검하고 객관적 근거를 바탕으로 최종 분류합니다.',
      why: ['직접 판단해 봐야 지표를 읽는 지식이 실제 선별 능력으로 바뀝니다.'],
      onoffUse: ['도구에서 확인 가능한 실제 값과 외부 검증 근거를 구분해 분석표에 기록합니다.'],
      action: ['후보 3개와 분석 근거를 준비합니다.', '각 후보를 활용·보류·제외 중 하나로 분류합니다.'],
    },
    expiredDomainTips: EXPIRED_DOMAIN_TIPS,
    expiredDomainTipsMode: 'mission',
    relatedLabel: '도메인 도구에서 실습', relatedTab: 'tools', relatedSubTab: 'catchdomain',
  },
  'l2-outcomes': {
    id: 'lesson-2-slide-16', lessonId: 'lesson-2', order: 16,
    shortTitle: '미션 결과물',
    visualKeywords: ['CANDIDATES', 'SCORECARD', 'EVIDENCE', 'DECISION'],
    explanation: {
      details: [
        { heading: '4가지 결과물', body: [
          '타겟과 연결된 후보 3개 목록.',
          '5개 지표를 채운 분석표.',
          '제외·보류 근거.',
          '1개 채택 또는 PASS를 적은 최종 결정.',
          '근거 기반의 매수 또는 패스가 수료 기준입니다.',
        ]},
      ],
      summary: '2강의 결과물은 후보 목록, 비교 분석표, 제외 근거와 최종 결정 보고서입니다.',
      why: ['판단 과정을 기록해야 나중에 결정을 검토하고 다른 사람에게 근거를 설명할 수 있습니다.'],
      onoffUse: ['분석 결과를 프로젝트 자료로 보관하고 후속 구축 여부를 결정할 때 활용합니다.'],
      action: ['후보별 근거 링크와 화면을 저장합니다.', '최종 결정과 그 이유를 한 문단으로 작성합니다.'],
    },
  },
  'l2-completion': {
    id: 'lesson-2-slide-17', lessonId: 'lesson-2', order: 17,
    shortTitle: '2강 완료 기준',
    visualKeywords: ['DEFINE', 'CHECK', 'COMPARE', 'EXPLAIN', 'DECIDE'],
    explanation: {
      details: [
        { heading: '완료 기준', body: [
          '낙장도메인을 정의하고, 5개 체크로 가치와 위험을 볼 수 있다.',
          '후보를 비교해 왜 활용·보류·제외인지 설명할 수 있다.',
          '판매자 설명 없이도 구매 여부를 결정하고 이유를 말할 수 있다.',
        ]},
      ],
      summary: '도메인의 가치와 위험을 점검하고 구매 여부를 근거와 함께 설명할 수 있으면 2강을 완료한 것입니다.',
      why: ['최종 목표는 좋은 도메인을 우연히 찾는 것이 아니라 반복 가능한 판단 능력을 갖추는 것입니다.'],
      onoffUse: ['공통 체크리스트와 결과 보고서로 판단 과정이 재현 가능한지 확인합니다.'],
      action: ['다른 후보에도 같은 기준을 적용할 수 있는지 확인합니다.', '판매자의 설명 없이도 결정을 내리고 이유를 말해 봅니다.'],
    },
  },
  'l2-completion-course': {
    id: 'lesson-2-slide-18', lessonId: 'lesson-2', order: 18,
    shortTitle: '기초 과정 완료',
    visualKeywords: ['EXECUTE', 'MEASURE', 'IMPROVE', 'REPEAT'],
    explanation: {
      details: [
        { heading: '여기까지', body: [
          '1강에서 전체 프로세스를 이해하고, 2강에서 낙장도메인을 실전 분석했습니다.',
          '교육이 끝나면 실행이 시작됩니다. 배운 내용보다 실행하고 측정한 결과를 남깁니다.',
          '이번 주 첫 작업과 측정 지표, 기록 위치를 정합니다.',
        ]},
      ],
      summary: '전체 실행 구조와 안전한 출발점 판단 기준을 익혔으며 이제 실제 프로젝트 실행을 시작할 단계입니다.',
      why: ['교육의 가치는 기억한 내용보다 실행하고 측정한 결과에서 만들어집니다.'],
      onoffUse: ['로드맵에서 다음 과제를 선택하고 프로젝트와 리포트에 실행 결과를 누적합니다.'],
      action: ['이번 주에 완료할 첫 작업을 선택합니다.', '실행 결과를 측정할 지표와 기록 위치를 정합니다.'],
    },
    relatedLabel: 'SEO 로드맵 시작', relatedTab: 'roadmap',
  },
};
