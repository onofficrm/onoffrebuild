import {
  CoreServicePageTemplate,
  type CoreFaqItem,
  type CoreFeatureItem,
  type CoreProcessStep,
  type CoreReasonItem,
} from '../components/services/CoreServicePageTemplate';
import { TrafficPreviewShowcase } from '../components/services/TrafficPreviewShowcase';

const TRAFFIC_PROBLEMS: CoreReasonItem[] = [
  {
    number: '01',
    title: '홈페이지를 열었지만 방문 흐름이 형성되지 않는 고민',
    description:
      '공식 홈페이지를 새로 제작하거나 리뉴얼했는데도 초기 방문자가 적어 서비스가 제대로 알려지지 않고, 화면 개선의 실마리도 잡기 어려운 경우가 많습니다.',
  },
  {
    number: '02',
    title: '도착 화면 점검 없이 유입만 늘릴 때 생기는 이탈',
    description:
      '방문자가 기대한 메시지와 실제 도착 페이지 내용이 어긋나거나 모바일 화면이 불편하면 유입이 상담이나 탐색으로 이어지지 않습니다.',
  },
  {
    number: '03',
    title: '트래픽 서비스의 역할과 한계에 대한 혼동',
    description:
      '트래픽 서비스가 어떤 목적에 적합하고, 어떤 조건이 갖춰졌을 때 의미가 있는지 명확한 기준 없이 시작하면 기대치와 결과가 어긋나기 쉽습니다.',
  },
];

const TRAFFIC_VALUES: CoreFeatureItem[] = [
  {
    number: '01',
    title: '명확한 서비스 목적 설정',
    scopeNote: '기획 협의 단계',
    description:
      '신규 사이트 초기 인지, 특정 서비스 랜딩 연결, 리뉴얼 이후 화면 반응 확인 등 트래픽 활용 목적을 분명히 정하고 시작합니다.',
  },
  {
    number: '02',
    title: '목적에 맞춘 서비스 방식 안내',
    scopeNote: '운영 방식 안내',
    description:
      '대상 페이지, 기간, 운영 흐름을 복잡한 용어 대신 기업 담당자가 이해하기 쉬운 기준으로 설명하고 협의된 방식에 따라 진행합니다.',
  },
  {
    number: '03',
    title: '활용 조건 사전 점검',
    scopeNote: '사전 체크 항목',
    description:
      '모바일 가독성, 명확한 서비스 안내, 정상 작동하는 문의 경로, HTTPS 보안 연결 등 방문자를 맞이할 기본 조건을 먼저 확인합니다.',
  },
  {
    number: '04',
    title: '도착 페이지 메시지 정렬',
    scopeNote: '랜딩 연계 점검',
    description:
      '방문자가 처음 마주하는 헤드라인과 상담 동선이 유입 목적과 자연스럽게 연결되는지 점검하고 필요한 보완 방향을 안내합니다.',
  },
  {
    number: '05',
    title: '투명한 유의사항 고지',
    scopeNote: '정직한 운영 원칙',
    description:
      '트래픽 운영만으로 확정 매출이나 검색 순위가 보장되지 않음을 사전에 명확히 안내하여 무리한 기대나 오해를 방지합니다.',
  },
  {
    number: '06',
    title: 'SEO·운영관리와의 균형 운영',
    scopeNote: '장기 확장 연계',
    description:
      '단기 유입에 그치지 않고 검색엔진 최적화(SEO), 콘텐츠 보강, 홈페이지 수정 반영과 함께 장기 성장 구조로 이어갈 수 있습니다.',
  },
];

const TRAFFIC_PROCESS: CoreProcessStep[] = [
  {
    step: '01',
    title: '유입 목적 및 대상 페이지 확인',
    description:
      '어떤 페이지로 어떤 목적의 방문 흐름을 만들고 싶은지 상담을 통해 정리합니다.',
  },
  {
    step: '02',
    title: '활용 조건 및 도착 화면 점검',
    description:
      '모바일 표시, 문의 폼 작동, 메시지 명확성 등 유입 전 필요한 기본 조건을 확인합니다.',
  },
  {
    step: '03',
    title: '서비스 방식 협의 및 실행',
    description:
      '유의사항과 운영 범위를 합의한 뒤 정해진 일정에 맞춰 트래픽 캠페인을 진행합니다.',
  },
  {
    step: '04',
    title: '결과 검토 및 홈페이지 보완',
    description:
      '운영 과정에서 확인되는 개선 필요 지점을 정리해 홈페이지 수정이나 SEO 전략에 반영합니다.',
  },
];

const TRAFFIC_FAQS: CoreFaqItem[] = [
  {
    question: '트래픽 서비스를 이용하면 매출 증가나 검색 순위 상승이 보장되나요?',
    answer:
      '아니요. 트래픽 서비스는 웹사이트 방문 흐름을 전략적으로 연결하는 수단이며, 실제 상담 전환이나 매출은 서비스 경쟁력, 가격 조건, 도착 페이지 설득력에 따라 달라집니다. 또한 특정 검색 순위 상승을 보장하지 않습니다.',
  },
  {
    question: '어떤 상태의 홈페이지에서 트래픽 서비스를 활용하는 것이 좋나요?',
    answer:
      '핵심 서비스 설명이 분명하고 모바일에서 깨지지 않으며, 문의 폼이나 연락 수단이 정상 작동하는 상태에서 시작하는 것이 좋습니다. 도착 화면 정비가 필요하다면 사전에 보완 방향을 함께 안내합니다.',
  },
  {
    question: '트래픽 서비스만 단독으로 진행할 수도 있나요?',
    answer:
      '가능합니다. 다만 유입 후 화면 개선이 필요할 때 ONOFF Builder 운영관리나 SEO·콘텐츠 서비스와 함께 연결하면 장기적인 효율을 높이는 데 도움이 됩니다.',
  },
  {
    question: '진행 방식과 비용은 어떻게 안내받을 수 있나요?',
    answer:
      '대상 페이지와 목적, 희망 기간에 따라 구성이 달라지므로 임의 정액표를 두지 않고 상담을 통해 적합한 범위와 유의사항을 상세히 안내해 드립니다.',
  },
];

export function TrafficServicePage() {
  return (
    <CoreServicePageTemplate
      kicker="서비스 · TRAFFIC"
      headline="웹사이트 유입을 더 전략적으로."
      heroDescription="무조건 방문 수만 늘리는 것이 아니라, 왜 유입이 필요한지 목적을 정리하고 도착 화면의 준비 조건과 유의사항을 확인한 뒤 현실적인 방식으로 웹사이트 방문 흐름을 연결합니다."
      primaryCtaLabel="트래픽 상담하기"
      primaryCtaTo="/contact?service=traffic"
      secondaryCtaLabel="서비스 방식 살펴보기"
      secondaryCtaHref="#features"
      reasonsKicker="고객이 자주 겪는 문제"
      reasonsHeading="도착 화면과 목적 없는 유입은 오래 남지 않습니다"
      reasonsLead="홈페이지가 방문자를 맞이할 준비를 갖추고 명확한 목적 아래 유입을 연결해야 비로소 의미 있는 마케팅 자산이 됩니다."
      reasons={TRAFFIC_PROBLEMS}
      featuresKicker="서비스 가치"
      featuresHeading="목적, 서비스 방식, 활용 조건, 유의사항까지 투명하게"
      featuresLead="어려운 광고 전문 용어 대신 기업 담당자가 바로 판단할 수 있도록 현실적인 기준을 중심으로 안내합니다."
      featuresNotice="유의사항: 트래픽 서비스는 특정 매출, 상담 건수, 검색 순위를 보장하지 않습니다. 도착 페이지의 완성도와 SEO·콘텐츠 운영이 함께 맞물릴 때 가장 건강한 효과를 기대할 수 있습니다."
      features={TRAFFIC_VALUES}
      previewKicker="구체적 활용"
      previewHeading="유입 흐름과 사전 활용 조건을 한눈에 확인하세요"
      previewLead="방문 유입이 도착 화면과 어떻게 연결되는지, 시작 전 어떤 조건과 유의사항을 확인하는지 구조 예시로 정리했습니다."
      previewComponent={<TrafficPreviewShowcase />}
      processKicker="진행 절차"
      processHeading="사전 점검부터 실행, 화면 보완까지 4단계로 진행합니다"
      processLead="준비되지 않은 상태에서 무리하게 시작하지 않고 단계별 확인을 거칩니다."
      processSteps={TRAFFIC_PROCESS}
      relatedLinks={[
        {
          label: '홈페이지 제작',
          description: '유입된 방문자가 5초 안에 이해하고 상담으로 이동하도록 도착 페이지를 설계합니다.',
          to: '/website',
        },
        {
          label: 'SEO',
          description: '캠페인 종료 이후에도 검색을 통해 꾸준히 발견되는 자연 유입 구조를 만듭니다.',
          to: '/services/seo',
        },
        {
          label: '운영관리',
          description: '유입 운영 중 필요한 문구 조정과 랜딩 화면 보완을 신속히 반영합니다.',
          to: '/management',
        },
      ]}
      faqs={TRAFFIC_FAQS}
      ctaTitle={
        <>
          우리 홈페이지에 맞는 유입 전략,
          <br />
          도착 화면 점검부터 함께 시작해 보세요.
        </>
      }
      ctaDescription="현재 운영 중인 홈페이지 주소와 홍보 목적을 남겨주시면 활용 조건과 적합한 진행 방식을 안내해 드립니다."
      ctaButtonLabel="트래픽 상담하기"
      ctaButtonTo="/contact?service=traffic"
    />
  );
}
