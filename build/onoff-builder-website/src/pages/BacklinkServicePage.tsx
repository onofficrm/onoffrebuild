import {
  CoreServicePageTemplate,
  type CoreFaqItem,
  type CoreFeatureItem,
  type CoreProcessStep,
  type CoreReasonItem,
} from '../components/services/CoreServicePageTemplate';
import { BacklinkPreviewShowcase } from '../components/services/BacklinkPreviewShowcase';

const BACKLINK_PROBLEMS: CoreReasonItem[] = [
  {
    number: '01',
    title: '무분별한 링크 작업에 대한 신뢰 저하 우려',
    description:
      '출처나 맥락을 고려하지 않은 대량 링크 작업은 오히려 브랜드 도메인의 신뢰도에 부담이 될 수 있습니다. 어떤 기준으로 외부 링크를 설계해야 할지 판단하기 어렵습니다.',
  },
  {
    number: '02',
    title: '내부 사이트 점검 없이 진행되는 비효율',
    description:
      '도착할 페이지의 구조나 SEO 기초가 정비되지 않은 상태에서 외부 링크만 늘리면 기대한 시너지를 내기 어렵습니다. 먼저 사이트 상태를 객관적으로 분석해야 합니다.',
  },
  {
    number: '03',
    title: '예산 대비 적정한 캠페인 범위 판단의 어려움',
    description:
      '업종 경쟁도와 도메인 단계마다 필요한 전략과 속도가 다르기 때문에, 획일적인 상품 대신 현재 사이트에 맞는 예산과 우선순위를 함께 검토할 기준이 필요합니다.',
  },
];

const BACKLINK_VALUES: CoreFeatureItem[] = [
  {
    number: '01',
    title: '사이트 현황 분석',
    scopeNote: '사전 진단 단계',
    description:
      '현재 도메인의 기본 이력, 핵심 랜딩 페이지 준비도, 온페이지 SEO 정합성을 먼저 살펴 백링크 전략이 작동할 수 있는 토대를 점검합니다.',
  },
  {
    number: '02',
    title: '맞춤 링크 전략 수립',
    scopeNote: '전략 설계 단계',
    description:
      '메인 페이지에만 편중되지 않도록 핵심 서비스·정보 페이지로 목적지 URL과 문맥을 자연스럽게 배분하는 링크 전략을 설계합니다.',
  },
  {
    number: '03',
    title: '단계별 예산 검토',
    scopeNote: '상담 협의 기준',
    description:
      '단기 과열 투입 대신 기업의 현재 규모와 목표에 맞춰 무리 없이 이어갈 수 있는 합리적인 예산 범위와 우선 페이지를 함께 검토합니다.',
  },
  {
    number: '04',
    title: '투명한 캠페인 안내',
    scopeNote: '운영 공유 기준',
    description:
      '캠페인 진행 기준, 적용 방향, 주의해야 할 요소를 사전에 알기 쉽게 안내하고 진행 과정을 투명하게 공유합니다.',
  },
  {
    number: '05',
    title: '브랜드 안전성 우선 원칙',
    scopeNote: '운영 정책',
    description:
      '검색엔진 가이드라인에 어긋나는 무리한 편법이나 스팸성 노출을 지양하고, 기업 공식 도메인의 장기적 신뢰를 지키는 방향을 우선합니다.',
  },
  {
    number: '06',
    title: 'SEO·콘텐츠·도메인 연계',
    scopeNote: '확장 연계 가능',
    description:
      '백링크 단독 실행에 그치지 않고 ONOFF Builder의 SEO, 도메인 설정, 콘텐츠 운영 흐름과 일관되게 조율할 수 있습니다.',
  },
];

const BACKLINK_PROCESS: CoreProcessStep[] = [
  {
    step: '01',
    title: '사이트 및 도메인 분석',
    description:
      '현재 웹사이트 주소와 핵심 사업 영역을 바탕으로 도메인 상태와 내부 페이지 준비도를 점검합니다.',
  },
  {
    step: '02',
    title: '링크 전략 및 예산 검토',
    description:
      '우선 연결할 핵심 URL, 문맥 기준, 현실적인 예산과 진행 속도를 상담을 통해 협의합니다.',
  },
  {
    step: '03',
    title: '캠페인 안내 및 실행',
    description:
      '합의된 전략과 기준에 따라 백링크 캠페인을 차근차근 실행하며 주요 진행 사항을 안내합니다.',
  },
  {
    step: '04',
    title: '점검 및 후속 연계',
    description:
      '진행 내역을 정리하고, 필요 시 SEO 구조 보완이나 신규 콘텐츠 페이지 확장과 연계합니다.',
  },
];

const BACKLINK_FAQS: CoreFaqItem[] = [
  {
    question: '백링크 캠페인을 진행하면 특정 검색 순위가 보장되나요?',
    answer:
      '아니요. 검색 순위는 검색엔진 알고리즘, 내부 콘텐츠 품질, 업종 경쟁 강도 등 복합적인 요인으로 결정되므로 특정 순위나 단기 상승을 보장하지 않습니다. 대신 사이트 분석을 바탕으로 장기적 도메인 신뢰를 해치지 않는 정석적인 링크 전략을 설계합니다.',
  },
  {
    question: '홈페이지를 새로 오픈한 직후 바로 백링크를 진행해도 괜찮을까요?',
    answer:
      '먼저 기본 홈페이지 구조, 핵심 서비스 페이지, SEO 기본 설정과 색인 상태가 안정적으로 갖춰졌는지 확인한 뒤 단계적으로 시작하는 것을 권장합니다. 상담 시 현재 사이트 상태를 보고 적합한 시점을 안내해 드립니다.',
  },
  {
    question: '정해진 패키지 금액이 따로 있나요?',
    answer:
      '업종 경쟁도, 대상 페이지 수, 현재 도메인 상태에 따라 적합한 전략과 범위가 다릅니다. 획일화된 정액 상품 대신 상담 과정에서 예산과 목표를 함께 검토해 맞춤 캠페인 범위를 안내합니다.',
  },
  {
    question: 'ONOFF Builder로 제작한 홈페이지가 아니어도 상담할 수 있나요?',
    answer:
      '가능합니다. 기존에 운영 중인 웹사이트 주소를 알려주시면 사이트 분석을 통해 백링크 캠페인 적합 여부와 함께 사전에 보완하면 좋은 내부 SEO 요소를 안내해 드립니다.',
  },
];

export function BacklinkServicePage() {
  return (
    <CoreServicePageTemplate
      kicker="서비스 · BACKLINK"
      headline="백링크도 전략이 필요합니다."
      heroDescription="무작정 링크 수만 늘리는 방식은 기업 도메인에 위험이 될 수 있습니다. 현재 사이트 분석부터 목적에 맞는 링크 전략, 현실적인 예산 검토와 캠페인 안내까지 차분하고 체계적으로 접근합니다."
      primaryCtaLabel="백링크 상담하기"
      primaryCtaTo="/contact?service=backlink"
      secondaryCtaLabel="서비스 가치 살펴보기"
      secondaryCtaHref="#features"
      reasonsKicker="고객이 자주 겪는 문제"
      reasonsHeading="기준 없는 백링크는 효과보다 우려가 더 큽니다"
      reasonsLead="외부 링크는 공식 홈페이지의 신뢰를 뒷받침하는 보조 전략입니다. 사이트 준비 상태와 방향을 먼저 점검해야 시행착오를 줄일 수 있습니다."
      reasons={BACKLINK_PROBLEMS}
      featuresKicker="서비스 가치"
      featuresHeading="사이트 분석부터 링크 전략, 예산 검토, 캠페인 안내까지"
      featuresLead="기업 도메인의 장기적 신뢰를 지키는 원칙 아래 단계별로 명확하게 협업합니다."
      featuresNotice="안내: 백링크 서비스는 특정 검색 순위나 단기 유입 수치를 보장하지 않습니다. 사이트 현황과 예산에 맞는 합리적인 캠페인 범위를 상담으로 협의하여 진행합니다."
      features={BACKLINK_VALUES}
      previewKicker="구체적 활용"
      previewHeading="사이트 분석과 링크 전략은 이렇게 구조화됩니다"
      previewLead="사전 점검 항목, 핵심 페이지 URL 배분 방식, 예산·캠페인 검토 기준을 예시로 확인해 보세요."
      previewComponent={<BacklinkPreviewShowcase />}
      processKicker="진행 절차"
      processHeading="사전 분석부터 캠페인 안내까지 투명한 4단계"
      processLead="불명확한 일괄 작업 대신 각 단계의 기준을 확인하며 진행합니다."
      processSteps={BACKLINK_PROCESS}
      relatedLinks={[
        {
          label: 'SEO',
          description: '외부 링크의 기반이 되는 내부 검색 구조와 메타정보, 콘텐츠 전략을 정비합니다.',
          to: '/services/seo',
        },
        {
          label: 'DOMAIN',
          description: '대표 도메인 설정, HTTPS 보안 및 기존 도메인 연결 상태를 깔끔하게 관리합니다.',
          to: '/domain',
        },
        {
          label: 'TRAFFIC',
          description: '핵심 서비스 페이지로 향하는 전략적 방문 흐름과 도착 화면을 함께 설계합니다.',
          to: '/traffic',
        },
      ]}
      faqs={BACKLINK_FAQS}
      ctaTitle={
        <>
          우리 사이트에 맞는 백링크 전략,
          <br />
          현황 분석과 예산 검토부터 시작하세요.
        </>
      }
      ctaDescription="현재 운영 중인 웹사이트 주소를 남겨주시면 사전 점검 기준과 캠페인 방향을 상담으로 안내해 드립니다."
      ctaButtonLabel="백링크 상담하기"
      ctaButtonTo="/contact?service=backlink"
    />
  );
}
