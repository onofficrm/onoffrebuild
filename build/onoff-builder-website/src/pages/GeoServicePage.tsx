import {
  CoreServicePageTemplate,
  type CoreFaqItem,
  type CoreFeatureItem,
  type CoreProcessStep,
  type CoreReasonItem,
} from '../components/services/CoreServicePageTemplate';
import { GeoPreviewShowcase } from '../components/services/GeoPreviewShowcase';
import { SeoGeoComparisonBlock } from '../components/services/SeoGeoComparisonBlock';

const GEO_REASONS: CoreReasonItem[] = [
  {
    number: '01',
    title: 'AI 검색 환경의 변화에 먼저 대비해야 합니다',
    description:
      '이제 많은 의사결정권자가 검색창에 단어만 치지 않고 생성형 AI에게 직접 질문해 업체를 비교하고 요약 답변을 확인합니다. 공식 홈페이지가 명확할수록 정확한 정보 전달에 유리합니다.',
  },
  {
    number: '02',
    title: '추측이 아닌 GEO Analyzer 기반의 객관적 진단',
    description:
      '막연하게 문구만 고치는 대신 GEO Analyzer로 현재 웹사이트의 콘텐츠와 정보 구조를 분석해, AI가 기업의 서비스와 전문성을 어떻게 읽고 있는지 근거를 확인합니다.',
  },
  {
    number: '03',
    title: '진단에서 끝나지 않는 개선 제안과 재측정 관리',
    description:
      '일회성 보고서로 멈추지 않고 구체적인 개선 방향을 제안하며, 실제 홈페이지 반영 이후 다시 측정하여 변화 흐름을 체계적으로 관리합니다.',
  },
];

const GEO_FEATURES: CoreFeatureItem[] = [
  {
    number: '01',
    title: 'AI 검색 환경의 변화 대응',
    scopeNote: 'GEO UP 전략 기반',
    description:
      '키워드 목록 중심에서 질문·요약 중심으로 이동하는 AI 검색 흐름에 맞춰 공식 홈페이지의 정보 전달 방식을 점검합니다.',
  },
  {
    number: '02',
    title: 'GEO Analyzer를 이용한 분석',
    scopeNote: 'GEO UP 진단 영역',
    description:
      'GEO Analyzer를 활용해 현재 브랜드와 서비스 정보가 AI 검색 관점에서 누락되거나 모호하게 표현된 지점을 체계적으로 분석합니다.',
  },
  {
    number: '03',
    title: '콘텐츠와 사이트 구조 진단',
    scopeNote: 'GEO UP 진단 영역',
    description:
      '기업 정의, 서비스 범위, FAQ 구성, 제목 계층 등 사람과 AI 시스템 모두가 정확히 이해하기 위해 보완해야 할 콘텐츠와 페이지 구조를 진단합니다.',
  },
  {
    number: '04',
    title: '개선 방향 제안',
    scopeNote: 'GEO UP 캠페인 영역',
    description:
      '진단 결과를 바탕으로 우선 수정이 필요한 핵심 페이지, 보강할 질문·답변 항목, 구조 정비 우선순위를 이해하기 쉬운 제안서로 정리합니다.',
  },
  {
    number: '05',
    title: '진단 이후 재측정 및 관리',
    scopeNote: 'GEO UP 지속 관리',
    description:
      '개선안이 실제 홈페이지에 반영된 이후 GEO Analyzer로 재측정하여 보완 결과를 확인하고 후속 관리 방향을 이어갑니다.',
  },
  {
    number: '06',
    title: '실제 홈페이지 소스 반영 연계',
    scopeNote: '별도 협의 · 배포 영역',
    description:
      '제안된 개선안의 실제 코드 수정, 페이지 추가, 배포 작업은 ONOFF Builder 홈페이지 제작·운영관리 또는 고객사 개발팀과 별도로 구분해 진행합니다.',
  },
];

const GEO_PROCESS: CoreProcessStep[] = [
  {
    step: '01',
    title: 'GEO Analyzer 현황 분석',
    description:
      '현재 공식 홈페이지 주소와 핵심 사업 정보를 바탕으로 AI 검색 대응 현황을 분석합니다.',
  },
  {
    step: '02',
    title: '콘텐츠·구조 정밀 진단',
    description:
      '서비스 설명의 명확성, 질문·답변 구조, 문서 계층 등 보완이 필요한 지점을 구체적으로 정리합니다.',
  },
  {
    step: '03',
    title: '개선 방향 제안 및 반영 협의',
    description:
      '실행 가능한 개선안을 제안하고, 실제 홈페이지 소스 수정·배포 방식(운영관리 연계 또는 자체 반영)을 협의합니다.',
  },
  {
    step: '04',
    title: '재측정 및 지속 관리',
    description:
      '홈페이지 반영 이후 다시 측정해 개선 흐름을 점검하고, 변화하는 검색 환경에 맞춰 관리합니다.',
  },
];

const GEO_FAQS: CoreFaqItem[] = [
  {
    question: 'GEO UP의 분석·개선 캠페인에 실제 홈페이지 코드 수정과 배포도 자동 포함되나요?',
    answer:
      '아닙니다. 두 영역은 명확히 구분됩니다. GEO UP은 GEO Analyzer를 활용한 현황 분석, 콘텐츠·사이트 구조 진단, 개선 방향 제안, 반영 후 재측정 및 관리를 담당합니다. 실제 홈페이지 소스 수정, 페이지 추가, 배포 작업은 ONOFF Builder 홈페이지 제작·운영관리 서비스로 별도 연계하거나 고객사 내부 개발팀이 제안안을 받아 반영하는 방식으로 진행합니다.',
  },
  {
    question: 'GEO를 진행하면 ChatGPT나 AI 검색 답변에 우리 회사가 반드시 추천·인용되나요?',
    answer:
      '아니요. 생성형 AI의 응답 기준과 모델 동작은 수시로 변하므로 특정 질문에서의 노출이나 AI 인용을 보장할 수 없습니다. GEO는 AI가 우리 기업을 오해하지 않고 정확히 이해할 수 있도록 공식 홈페이지의 정보 품질과 구조를 체계적으로 정비하는 대비 과정입니다.',
  },
  {
    question: '기존에 SEO를 하고 있는데 GEO를 따로 검토할 필요가 있나요?',
    answer:
      'SEO가 검색엔진 결과에서 사이트가 잘 발견되도록 돕는 기초라면, GEO는 문장형 질문에 답하는 AI 검색이 기업 정보를 정확히 해석하도록 돕는 보완 영역입니다. SEO 기반이 갖춰진 사이트에 GEO 진단을 더하면 변화하는 검색 환경에 더욱 균형 있게 대비할 수 있습니다.',
  },
  {
    question: 'ONOFF Builder로 제작한 홈페이지가 아니어도 GEO 진단을 받을 수 있나요?',
    answer:
      '네, 가능합니다. 기존에 운영 중인 공식 홈페이지로 GEO Analyzer 분석과 개선 방향 제안을 먼저 받아보실 수 있으며, 이후 실제 소스 수정이 필요할 때 자체 반영 또는 ONOFF Builder 연계 여부를 선택하실 수 있습니다.',
  },
  {
    question: '진단 후 재측정은 어떤 의미가 있나요?',
    answer:
      '개선 방향을 적용한 뒤 실제로 콘텐츠 명확성과 구조 지표가 보완되었는지 확인하기 위한 단계입니다. 한 번 진단하고 끝내는 것이 아니라 개선 전·후 상태를 비교하며 지속적인 관리 기준을 세웁니다.',
  },
];

function GeoUpVsSourceDeploymentDistinction() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
      <div className="max-w-[680px]">
        <p className="text-[13px] font-semibold text-blue-600">역할 및 작업 범위 구분</p>
        <h3 className="mt-2 text-[20px] sm:text-[22px] font-bold leading-snug tracking-[-0.02em] text-slate-950">
          ‘GEO UP 분석·개선 캠페인’과 ‘실제 홈페이지 소스 수정·배포’는 구분됩니다
        </h3>
        <p className="mt-2 text-[14px] leading-[1.65] text-slate-600">
          진단·전략 제안 영역과 실제 웹사이트 코드 수정·배포 영역의 경계를 명확히 안내하여
          오해 없이 투명하게 협업합니다.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="rounded-xl border border-[#2563EB]/30 bg-slate-50 p-6">
          <p className="text-[12px] font-semibold text-blue-600">
            구분 01 · GEO UP 캠페인 영역
          </p>
          <p className="mt-1.5 text-[17px] font-semibold text-slate-950">
            분석 · 진단 · 개선 제안 · 재측정
          </p>
          <ul className="mt-4 space-y-2.5 text-[14px] leading-[1.6] text-slate-950">
            <li>· GEO Analyzer 기반 웹사이트 현황 분석</li>
            <li>· 콘텐츠 명확성 및 페이지 구조 진단</li>
            <li>· 보완 우선순위와 구체적인 개선 방향 제안</li>
            <li>· 개선 반영 이후 재측정 및 추이 관리</li>
          </ul>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <p className="text-[12px] font-semibold text-slate-500">
            구분 02 · 웹사이트 구축·운영 영역 (별도 협의)
          </p>
          <p className="mt-1.5 text-[17px] font-semibold text-slate-950">
            실제 홈페이지 소스 수정 · 배포
          </p>
          <ul className="mt-4 space-y-2.5 text-[14px] leading-[1.6] text-slate-600">
            <li>· 진단 결과에 따른 실제 코드 및 구조화 마크업 수정</li>
            <li>· 신규 안내 섹션, FAQ, 콘텐츠 페이지 디자인·구현</li>
            <li>· 검수 과정을 거친 실서비스 홈페이지 배포</li>
            <li>· ONOFF Builder 운영관리 연계 또는 고객사 자체 반영 선택</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export function GeoServicePage() {
  return (
    <CoreServicePageTemplate
      kicker="서비스 · GEO (생성형 AI 검색 대응)"
      headline={
        <>
          AI 검색 시대에 대비하는
          <br />
          홈페이지.
        </>
      }
      heroDescription="고객이 AI에게 직접 질문하고 답을 얻는 시대에 맞춰, GEO Analyzer로 현재 웹사이트의 콘텐츠와 구조를 진단하고 개선 방향 제안부터 재측정까지 체계적으로 관리합니다."
      primaryCtaLabel="GEO 상담하기"
      primaryCtaTo="/contact?service=geo"
      secondaryCtaLabel="핵심 내용 살펴보기"
      secondaryCtaHref="#features"
      reasonsKicker="왜 지금 GEO를 준비해야 하나요"
      reasonsHeading="검색 습관이 바뀌는 지금, 공식 홈페이지의 정보 구조가 기준이 됩니다"
      reasonsLead="과장된 홍보 문구보다 사실에 기반해 명확히 정리된 공식 웹사이트가 변화하는 AI 검색 환경에서도 신뢰받는 출발점이 됩니다."
      reasons={GEO_REASONS}
      reasonsFootnote={<GeoUpVsSourceDeploymentDistinction />}
      featuresKicker="핵심 제공 내용"
      featuresHeading="진단부터 개선 제안, 재측정까지 단계적으로 대비합니다"
      featuresLead="어려운 이론 설명 대신 실제 우리 홈페이지에서 무엇을 확인하고 어떻게 보완해야 하는지 알기 쉽게 정리합니다."
      featuresNotice="안내: 생성형 AI 모델의 특성상 특정 AI 답변 노출이나 인용 결과를 보장하지 않습니다. GEO는 공식 웹사이트의 정보 정확성과 구조를 객관적으로 진단하고 단계적으로 개선하는 서비스입니다."
      features={GEO_FEATURES}
      featuresExtraSection={<SeoGeoComparisonBlock current="geo" />}
      previewKicker="구조 및 프로세스 시각 자료"
      previewHeading="AI 검색 변화와 GEO 진단·반영 구조를 한눈에 이해하세요"
      previewLead="고객의 질문 방식 변화, GEO Analyzer 진단 순환 구조, 그리고 GEO UP과 실제 홈페이지 소스 반영의 경계를 정리했습니다."
      previewComponent={<GeoPreviewShowcase />}
      processKicker="서비스 진행 절차"
      processHeading="분석에서 멈추지 않고 재측정까지 이어지는 4단계 관리"
      processLead="현재 웹사이트 상태를 정확히 파악한 뒤 실행 가능한 개선 순서를 함께 정합니다."
      processSteps={GEO_PROCESS}
      relatedLinks={[
        {
          label: 'SEO',
          description: '검색엔진이 사이트를 정확히 수집하고 이해하도록 기본·전문 검색 구조를 정비합니다.',
          to: '/services/seo',
        },
        {
          label: '운영관리',
          description: 'GEO 진단 결과로 도출된 문구·FAQ·페이지 수정을 실제 홈페이지에 안전하게 반영합니다.',
          to: '/management',
        },
        {
          label: 'AI 콘텐츠',
          description: '고객 질문과 기업 사실 정보에 기반한 구조화된 웹 콘텐츠를 체계적으로 확충합니다.',
          to: '/content',
        },
      ]}
      faqs={GEO_FAQS}
      ctaTitle={
        <>
          AI 검색 시대에 우리 홈페이지가
          <br />
          어떻게 읽히는지 먼저 점검해 보세요.
        </>
      }
      ctaDescription="GEO Analyzer 진단 상담부터 ONOFF Builder 홈페이지 반영 연계까지 현재 상황에 맞게 안내해 드립니다."
      ctaButtonLabel="GEO 상담하기"
      ctaButtonTo="/contact?service=geo"
    />
  );
}
