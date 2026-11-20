import {
  CoreServicePageTemplate,
  type CoreFaqItem,
  type CoreFeatureItem,
  type CoreProcessStep,
  type CoreReasonItem,
} from '../components/services/CoreServicePageTemplate';
import { SeoPreviewShowcase } from '../components/services/SeoPreviewShowcase';
import { SeoGeoComparisonBlock } from '../components/services/SeoGeoComparisonBlock';

const SEO_REASONS: CoreReasonItem[] = [
  {
    number: '01',
    title: '보기 좋은 홈페이지와 검색되는 홈페이지는 다릅니다',
    description:
      '디자인이 깔끔해도 페이지 제목이 비어 있거나 이미지 위주로만 구성되면 검색엔진이 무슨 일을 하는 회사인지 파악하지 못합니다. 처음부터 검색이 이해하는 구조로 설계해야 합니다.',
  },
  {
    number: '02',
    title: '광고를 멈춰도 고객이 찾아오는 장기 자산이 됩니다',
    description:
      '단기 유료 광고는 예산을 끄면 유입이 끊기지만, 검색 친화적으로 정리된 공식 홈페이지는 잠재 고객이 서비스를 찾을 때마다 꾸준히 발견되는 기반이 됩니다.',
  },
  {
    number: '03',
    title: '홈페이지 제작·운영과 한 팀으로 연결되는 효율',
    description:
      'SEO 분석 따로, 홈페이지 수정 따로 움직이면 제안서만 남고 실제 반영이 늦어집니다. ONOFF Builder는 구조 진단과 실제 화면 반영을 매끄럽게 연결합니다.',
  },
];

const SEO_FEATURES: CoreFeatureItem[] = [
  {
    number: '01',
    title: '검색엔진 친화적인 홈페이지 구조',
    scopeNote: '제작 기본 설정',
    description:
      '검색엔진이 사이트의 모든 페이지를 빠짐없이 읽고 분류할 수 있도록 표준 HTML 태그와 깔끔한 주소(URL) 구조를 설계합니다.',
  },
  {
    number: '02',
    title: '페이지 제목 및 메타정보',
    scopeNote: '제작 기본 설정',
    description:
      '검색 결과 화면에 먼저 노출되는 페이지별 제목과 요약 설명을 각 페이지의 목적에 맞게 정확히 정리합니다.',
  },
  {
    number: '03',
    title: '모바일 최적화',
    scopeNote: '제작 기본 설정',
    description:
      '검색엔진이 중요하게 평가하는 모바일 화면의 가독성, 반응형 레이아웃, 불필요한 요소 정리를 기본으로 챙깁니다.',
  },
  {
    number: '04',
    title: '콘텐츠 전략',
    scopeNote: '전문 SEO 운영',
    description:
      '잠재 고객이 실제로 궁금해하고 검색하는 주제에 맞춰 서비스 소개와 정보성 페이지를 어떤 순서로 채워갈지 기획합니다.',
  },
  {
    number: '05',
    title: '내부링크 및 페이지 구조',
    scopeNote: '기본 + 전문 확장',
    description:
      '방문자와 검색엔진이 메인에서 핵심 서비스·안내 페이지로 자연스럽게 이동하도록 페이지 간 연결 경로를 체계적으로 정비합니다.',
  },
  {
    number: '06',
    title: '검색 성과 확인',
    scopeNote: '전문 SEO 운영',
    description:
      '주요 페이지의 색인 상태와 실제 검색 노출·클릭 흐름을 주기적으로 점검해 다음 보완 방향을 데이터 기준으로 안내합니다.',
  },
];

const SEO_PROCESS: CoreProcessStep[] = [
  {
    step: '01',
    title: '현황 점검 및 목표 협의',
    description:
      '현재 홈페이지 상태와 업종 특성을 살펴보고 기본 SEO 설정이 필요한지, 전문 SEO 운영이 필요한지 정리합니다.',
  },
  {
    step: '02',
    title: '구조·메타·키워드 설계',
    description:
      '페이지별 제목과 요약 설명, 메뉴 계층, 내부링크 연결과 핵심 콘텐츠 방향을 설계합니다.',
  },
  {
    step: '03',
    title: '홈페이지 반영 및 검증',
    description:
      '설계된 SEO 요소를 실제 페이지에 적용하고 모바일 화면과 검색엔진 수집 환경을 점검합니다.',
  },
  {
    step: '04',
    title: '성과 확인 및 지속 보완',
    description:
      '전문 SEO 운영 시 검색 노출과 유입 추이를 확인하며 페이지 문구와 콘텐츠를 단계적으로 개선합니다.',
  },
];

const SEO_FAQS: CoreFaqItem[] = [
  {
    question: '홈페이지 제작 시 포함되는 기본 SEO와 별도 전문 SEO 운영은 어떻게 다른가요?',
    answer:
      '홈페이지 제작 단계의 기본 SEO는 검색엔진이 사이트를 올바르게 읽을 수 있도록 만드는 기초 공사(표준 구조, 페이지 제목·메타정보, 모바일 최적화, 사이트맵 기본 설정)입니다. 별도의 전문 SEO 운영 서비스는 배포 이후 키워드·콘텐츠 전략 수립, 내부링크 고도화, 주기적인 검색 성과 확인과 지속 보완을 전담하는 확장 서비스입니다.',
  },
  {
    question: 'SEO를 진행하면 특정 키워드 상위 노출이나 순위가 보장되나요?',
    answer:
      '아니요. 검색 순위는 검색엔진 알고리즘 변화, 업종 경쟁 강도, 도메인 이력 등 외부 요인의 영향을 받기 때문에 특정 순위나 단기 성과를 보장하지 않습니다. 대신 검색엔진 기준에 부합하는 건강한 웹사이트 구조와 지속 가능한 개선 프로세스를 정석대로 실행합니다.',
  },
  {
    question: '전문 용어를 잘 모르는데 상담을 받아도 이해할 수 있을까요?',
    answer:
      '물론입니다. 복잡한 개발·마케팅 용어를 나열하기보다 “검색 결과에서 우리 회사가 어떻게 보이는지”, “어떤 페이지를 먼저 정리해야 하는지”처럼 실제 사업 관점에서 알기 쉽게 안내해 드립니다.',
  },
  {
    question: '기존에 운영 중인 다른 홈페이지도 SEO 상담이 가능한가요?',
    answer:
      '가능합니다. 현재 운영 중인 사이트 주소를 공유해 주시면 구조적 개선으로 해결할 수 있는지, ONOFF Builder 기반 리뉴얼이 더 효율적인지 객관적으로 검토해 안내합니다.',
  },
  {
    question: 'SEO와 GEO는 둘 다 진행해야 하나요?',
    answer:
      '모든 기업이 처음부터 동시에 진행할 필요는 없습니다. 먼저 기본 SEO 구조가 탄탄한 홈페이지를 갖춘 뒤, 업종과 검색 전략에 맞춰 전문 SEO 운영이나 AI 검색 대비(GEO)를 단계적으로 연결하는 방식을 권장합니다.',
  },
];

function BasicVsManagedSeoDistinction() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
      <div className="max-w-[660px]">
        <p className="text-[13px] font-semibold text-blue-600">서비스 범위 구분 안내</p>
        <h3 className="mt-2 text-[20px] sm:text-[22px] font-bold leading-snug tracking-[-0.02em] text-slate-950">
          제작 단계의 ‘기본 SEO 설정’과 ‘전문 SEO 운영’은 구분됩니다
        </h3>
        <p className="mt-2 text-[14px] leading-[1.65] text-slate-600">
          홈페이지를 만들 때 기본적으로 챙기는 기술 토대와, 오픈 후 지속적으로 검색 유입을 키우는
          전문 운영 서비스의 역할을 투명하게 나누어 안내합니다.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
          <p className="text-[12px] font-semibold text-slate-500">구분 01 · 홈페이지 제작 단계</p>
          <p className="mt-1.5 text-[17px] font-semibold text-slate-950">기본 SEO 설정</p>
          <ul className="mt-4 space-y-2.5 text-[14px] leading-[1.6] text-slate-600">
            <li>· 검색엔진이 읽기 쉬운 시맨틱 HTML 및 깔끔한 URL 구성</li>
            <li>· 주요 페이지별 제목(Title) 및 요약 설명(Meta) 초기 적용</li>
            <li>· PC·모바일 반응형 최적화 및 기본 사이트맵 설정</li>
            <li>· 검색엔진에 사이트가 정상 등록될 수 있는 출발선 마련</li>
          </ul>
        </div>

        <div className="rounded-xl border border-[#2563EB]/30 bg-white p-6">
          <p className="text-[12px] font-semibold text-blue-600">구분 02 · 별도 연계 서비스</p>
          <p className="mt-1.5 text-[17px] font-semibold text-slate-950">전문 SEO 운영 서비스</p>
          <ul className="mt-4 space-y-2.5 text-[14px] leading-[1.6] text-slate-950">
            <li>· 업종별 검색 의도 분석 및 단계적 콘텐츠 전략 기획</li>
            <li>· 핵심 서비스와 정보 페이지를 잇는 내부링크 고도화</li>
            <li>· 검색 노출·클릭·색인 현황의 정기적인 성과 확인</li>
            <li>· 데이터 점검을 바탕으로 한 지속적인 페이지·문구 개선</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export function SeoServicePage() {
  return (
    <CoreServicePageTemplate
      kicker="서비스 · SEO (검색엔진 최적화)"
      headline={
        <>
          검색에 발견되는
          <br />
          홈페이지를 만듭니다.
        </>
      }
      heroDescription="잠재 고객이 우리 서비스를 검색했을 때 정확히 이해하고 찾아올 수 있도록, 검색엔진이 읽기 쉬운 홈페이지 구조와 페이지 정보, 지속적인 콘텐츠·성과 관리 체계를 설계합니다."
      primaryCtaLabel="SEO 상담하기"
      primaryCtaTo="/contact?service=seo"
      secondaryCtaLabel="핵심 항목 살펴보기"
      secondaryCtaHref="#features"
      reasonsKicker="왜 SEO가 필요한가요"
      reasonsHeading="잘 만든 홈페이지도 검색에서 보이지 않으면 기회를 놓칩니다"
      reasonsLead="어려운 기술 용어보다 중요한 것은 고객이 검색창에 입력하는 질문에 우리 홈페이지가 명쾌하게 답할 수 있는 구조를 갖추는 것입니다."
      reasons={SEO_REASONS}
      reasonsFootnote={<BasicVsManagedSeoDistinction />}
      featuresKicker="핵심 제공 항목"
      featuresHeading="검색엔진과 방문자 모두가 이해하기 쉬운 6가지 기준"
      featuresLead="홈페이지 제작 시 적용되는 기본 설정부터 별도 협의로 진행하는 전문 SEO 운영 항목까지 알기 쉽게 정리했습니다."
      featuresNotice="안내: SEO는 단기간에 특정 순위를 보장하는 작업이 아닙니다. 검색엔진 기준에 맞는 웹사이트 구조와 콘텐츠를 꾸준히 정비해 건강한 검색 유입 기반을 만드는 데 집중합니다."
      features={SEO_FEATURES}
      featuresExtraSection={<SeoGeoComparisonBlock current="seo" />}
      previewKicker="구조 시각 자료"
      previewHeading="검색 결과와 홈페이지 구조가 어떻게 연결되는지 확인해 보세요"
      previewLead="페이지 제목과 요약 설명, 내부링크 계층, 모바일 최적화 요소가 실제 검색 경험에 어떤 역할을 하는지 쉬운 예시로 설명합니다."
      previewComponent={<SeoPreviewShowcase />}
      processKicker="서비스 진행 절차"
      processHeading="현황 진단부터 구조 반영, 성과 확인까지 차근차근 진행합니다"
      processLead="현재 홈페이지 유무와 목표에 맞춰 필요한 단계부터 유연하게 시작할 수 있습니다."
      processSteps={SEO_PROCESS}
      relatedLinks={[
        {
          label: 'GEO',
          description: '전통 검색을 넘어 생성형 AI 검색 환경에 맞춰 웹사이트 정보를 진단하고 정비합니다.',
          to: '/geo',
        },
        {
          label: 'AI 콘텐츠',
          description: '검색 의도와 브랜드 톤을 반영한 전문 웹 콘텐츠를 체계적으로 제작·발행합니다.',
          to: '/content',
        },
        {
          label: '홈페이지 제작',
          description: '기획 단계부터 SEO 기본 구조를 품은 관리형 기업 홈페이지를 구축합니다.',
          to: '/website',
        },
      ]}
      faqs={SEO_FAQS}
      ctaTitle={
        <>
          우리 홈페이지의 검색 구조,
          <br />
          현재 상태부터 함께 점검해 보세요.
        </>
      }
      ctaDescription="신규 제작과 함께하는 기본 SEO부터 기존 사이트의 전문 SEO 운영까지 상황에 맞게 안내해 드립니다."
      ctaButtonLabel="SEO 상담하기"
      ctaButtonTo="/contact?service=seo"
    />
  );
}
