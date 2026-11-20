import {
  CoreServicePageTemplate,
  type CoreFaqItem,
  type CoreFeatureItem,
  type CoreProcessStep,
  type CoreReasonItem,
} from '../components/services/CoreServicePageTemplate';
import { ContentPreviewShowcase } from '../components/services/ContentPreviewShowcase';

const CONTENT_PROBLEMS: CoreReasonItem[] = [
  {
    number: '01',
    title: '콘텐츠의 중요성은 알지만 쓸 시간과 인력이 부족합니다',
    description:
      '홈페이지에 서비스 안내, 전문 정보, 공지사항을 꾸준히 쌓고 싶어도 현업 담당자가 매번 주제를 잡고 초안을 작성하기는 현실적으로 어렵습니다.',
  },
  {
    number: '02',
    title: 'AI로 바로 뽑은 글은 브랜드 신뢰와 사실 정확도가 떨어집니다',
    description:
      '검수 없이 생성한 텍스트는 어색한 표현이나 부정확한 정보가 섞이기 쉬워, 오히려 B2B 기업의 공식 홈페이지 품격을 해칠 수 있습니다.',
  },
  {
    number: '03',
    title: '작성부터 검수·발행까지 일관된 운영 흐름이 없습니다',
    description:
      '주제 선정, 초안 작성, 내부 사실 확인, 홈페이지 게시 기준이 정리되지 않으면 몇 편 올리다 중단되기 쉽습니다.',
  },
];

const CONTENT_VALUES: CoreFeatureItem[] = [
  {
    number: '01',
    title: '목적 중심 콘텐츠 기획',
    scopeNote: '제공 범위 상담',
    description:
      '잠재 고객이 자주 묻는 질문과 기업의 핵심 서비스를 기준으로, 상담과 검색에 도움이 되는 주제와 목차를 기획합니다.',
  },
  {
    number: '02',
    title: 'AI 기반 구조화 초안 작성',
    scopeNote: '제공 범위 상담',
    description:
      '기획된 개요와 기업 기초 자료를 토대로 AI 초안을 빠르게 구성하여, 백지에서 시작하는 작성 시간을 크게 줄입니다.',
  },
  {
    number: '03',
    title: '담당자 편집 및 사실 검수',
    scopeNote: '필수 품질 단계',
    description:
      '부자연스러운 문장과 과장된 표현을 정리하고, 기업 담당자의 사실 관계 확인을 거쳐 공식 홈페이지에 어울리는 문장으로 완성합니다.',
  },
  {
    number: '04',
    title: 'SEO·GEO 친화적 문서 정리',
    scopeNote: '제공 범위 상담',
    description:
      '읽기 쉬운 소제목 계층, 핵심 요약, 질문·답변(FAQ) 구조를 반영해 방문자와 검색 시스템 모두가 이해하기 쉽게 정리합니다.',
  },
  {
    number: '05',
    title: '홈페이지 발행 워크플로 연계',
    scopeNote: '운영관리 연계 상담',
    description:
      '검수 완료된 콘텐츠를 ONOFF Builder 운영관리와 연계해 홈페이지 게시판·안내 영역에 정갈하게 반영할 수 있습니다. (시스템 완전 자동 발행은 연동 준비 중입니다.)',
  },
  {
    number: '06',
    title: '외부 채널·SNS 자동 게시 구분',
    scopeNote: '연동 준비 중 / 제공 범위 상담',
    description:
      '외부 SNS나 블로그로의 자동 게시는 현재 기본 제공되지 않습니다. 원고 전달 및 확장 활용 방식은 상담 시 제공 범위를 명확히 안내합니다.',
  },
];

const CONTENT_PROCESS: CoreProcessStep[] = [
  {
    step: '01',
    title: '주제 및 톤앤매너 기획',
    description:
      '기업의 핵심 서비스, 참고 자료, 대외 표현 기준을 확인하고 우선 다룰 주제를 정리합니다.',
  },
  {
    step: '02',
    title: 'AI 초안 생성 및 1차 편집',
    description:
      '목차와 사실 기준을 반영해 AI 초안을 작성한 뒤, 자연스러운 한국어와 문서 구조로 다듬습니다.',
  },
  {
    step: '03',
    title: '담당자·고객사 검수',
    description:
      '전문 용어, 서비스 범위, 사실 관계의 정확성을 확인하고 수정 의견을 반영해 최종 원고를 확정합니다.',
  },
  {
    step: '04',
    title: '협의된 방식으로 발행 반영',
    description:
      '검수가 끝난 콘텐츠를 원고 납품 또는 운영관리 연계를 통해 홈페이지에 안전하게 게시합니다.',
  },
];

const CONTENT_FAQS: CoreFaqItem[] = [
  {
    question: 'ONOFF Builder 홈페이지에 완전 자동으로 연동 발행되나요?',
    answer:
      '아닙니다. 시스템 간 무검수 자동 발행이나 ONOFF Builder 완전 자동 연동은 현재 연동 준비 중 단계입니다. 현재는 기획·AI 초안·담당자 검수를 거쳐 원고를 확정하고, 운영관리 연계 상담을 통해 담당자가 홈페이지에 정갈하게 반영하는 방식으로 진행합니다.',
  },
  {
    question: '인스타그램이나 블로그 같은 외부 SNS에도 자동으로 게시되나요?',
    answer:
      '외부 SNS 자동 게시 기능은 현재 기본 제공되지 않으며 연동 준비 중 또는 별도 제공 범위 상담 대상입니다. 확인되지 않은 자동화 기능을 약속하지 않고, 현재 실제로 제공 가능한 제작·검수·웹 반영 범위를 투명하게 안내합니다.',
  },
  {
    question: 'AI가 작성한 글을 그대로 올리면 품질이나 사실 오류가 걱정됩니다.',
    answer:
      'AI는 초안 작성 시간을 줄이는 보조 도구로만 활용합니다. 모든 콘텐츠는 브랜드 톤 정리와 담당자·고객사의 사실 관계 검수를 거친 뒤에만 최종 확정하므로 무분별한 저품질 원고 게시를 방지합니다.',
  },
  {
    question: '콘텐츠 제작 분량과 주기는 어떻게 정하나요?',
    answer:
      '홈페이지 초기 문구 정리가 필요한 경우와 정기적인 정보 콘텐츠 확장이 필요한 경우의 범위가 다릅니다. 상담 시 업종과 내부 검수 여력을 확인해 현실적인 제공 범위를 제안합니다.',
  },
];

function IntegrationTransparencyBox() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
      <div className="max-w-[700px]">
        <p className="text-[13px] font-semibold text-blue-600">제공 범위 투명 안내</p>
        <h3 className="mt-2 text-[20px] sm:text-[22px] font-bold leading-snug tracking-[-0.02em] text-slate-950">
          현재 지원하는 제작·검수 범위와 ‘연동 준비 중’ 기능을 구분합니다
        </h3>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="rounded-xl border border-[#2563EB]/30 bg-slate-50 p-6">
          <p className="text-[12px] font-semibold text-blue-600">제공 범위 상담 가능</p>
          <p className="mt-1.5 text-[17px] font-semibold text-slate-950">
            기획 · AI 초안 · 담당자 검수 · 웹 반영 협의
          </p>
          <ul className="mt-4 space-y-2 text-[14px] leading-[1.6] text-slate-950">
            <li>· 업종 및 검색 의도에 맞춘 콘텐츠 주제·목차 기획</li>
            <li>· 기업 자료 기반 AI 초안 작성 및 브랜드 어조 편집</li>
            <li>· 고객사 최종 사실 검수 후 확정 원고 제공 및 운영관리 연계 게시</li>
          </ul>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <p className="text-[12px] font-semibold text-slate-500">연동 준비 중 / 미제공 범위</p>
          <p className="mt-1.5 text-[17px] font-semibold text-slate-950">
            완전 자동 연동 및 외부 SNS 자동 게시
          </p>
          <ul className="mt-4 space-y-2 text-[14px] leading-[1.6] text-slate-600">
            <li>· ONOFF Builder 시스템 간 완전 자동 발행 연동 (연동 준비 중)</li>
            <li>· 외부 SNS·채널 다중 자동 게시 기능 (연동 준비 중 / 제공 범위 상담)</li>
            <li>· 고객 검수 없는 무인 자동 발행은 브랜드 안전을 위해 지양합니다.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export function ContentServicePage() {
  return (
    <CoreServicePageTemplate
      kicker="서비스 · AI 콘텐츠"
      headline="콘텐츠 운영에 필요한 시간을 줄입니다."
      heroDescription="백지에서 매번 글을 쓰는 부담을 줄이되, 브랜드의 신뢰는 그대로 지킵니다. 체계적인 콘텐츠 기획과 AI 초안, 담당자 검수, 협의된 발행 워크플로로 기업 홈페이지에 필요한 콘텐츠를 차근차근 채워갑니다."
      primaryCtaLabel="콘텐츠 상담하기"
      primaryCtaTo="/contact?service=content"
      secondaryCtaLabel="워크플로 살펴보기"
      secondaryCtaHref="#features"
      reasonsKicker="고객이 자주 겪는 문제"
      reasonsHeading="꾸준한 콘텐츠 운영은 필요하지만, 품질과 시간을 동시에 챙기기 어렵습니다"
      reasonsLead="AI의 초안 효율성과 사람의 편집·검수를 결합하면 내부 리소스 부담을 줄이면서도 신뢰할 수 있는 기업 문서를 만들 수 있습니다."
      reasons={CONTENT_PROBLEMS}
      reasonsFootnote={<IntegrationTransparencyBox />}
      featuresKicker="서비스 가치"
      featuresHeading="기획부터 AI 초안, 담당자 검수, 발행 워크플로까지"
      featuresLead="실제로 제공 가능한 제작·검수 범위와 연동 준비 중인 기능을 명확히 구분해 안내합니다."
      featuresNotice="안내: AI 콘텐츠 서비스는 검색 순위나 특정 조회수 성과를 보장하지 않으며, ONOFF Builder 완전 자동 연동 및 외부 SNS 자동 게시는 현재 '연동 준비 중' 또는 '제공 범위 상담'으로 구분하여 운영합니다."
      features={CONTENT_VALUES}
      previewKicker="구체적 활용"
      previewHeading="콘텐츠 제작 흐름과 현재 연동 범위를 확인하세요"
      previewLead="기획·초안·검수·발행 단계별 역할과 현재 제공 구분, 품질 체크 기준을 구조 예시로 정리했습니다."
      previewComponent={<ContentPreviewShowcase />}
      processKicker="진행 절차"
      processHeading="기획에서 최종 검수·반영까지 4단계 워크플로"
      processLead="고객사 검수 없는 임의 발행을 하지 않으며, 확인된 원고만 안전하게 게시합니다."
      processSteps={CONTENT_PROCESS}
      relatedLinks={[
        {
          label: 'SEO',
          description: '콘텐츠가 검색엔진에서 잘 구조화되고 발견되도록 기술 토대와 내부링크를 맞춥니다.',
          to: '/services/seo',
        },
        {
          label: 'GEO',
          description: 'AI 검색 환경에 대비해 콘텐츠의 명확성과 질문·답변 구조를 진단합니다.',
          to: '/geo',
        },
        {
          label: '운영관리',
          description: '검수가 완료된 콘텐츠를 홈페이지 디자인에 맞춰 정갈하게 게시·유지합니다.',
          to: '/management',
        },
      ]}
      faqs={CONTENT_FAQS}
      ctaTitle={
        <>
          콘텐츠 기획과 초안 부담은 줄이고,
          <br />
          브랜드에 맞는 웹 자산을 꾸준히 쌓아보세요.
        </>
      }
      ctaDescription="필요한 콘텐츠 유형과 발행 주기를 공유해 주시면 현재 제공 가능한 범위와 협업 방식을 안내해 드립니다."
      ctaButtonLabel="콘텐츠 상담하기"
      ctaButtonTo="/contact?service=content"
    />
  );
}
