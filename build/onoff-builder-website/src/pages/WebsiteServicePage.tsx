import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import {
  CoreServicePageTemplate,
  type CoreFaqItem,
  type CoreFeatureItem,
  type CoreProcessStep,
  type CoreReasonItem,
} from '../components/services/CoreServicePageTemplate';
import { WebsitePreviewShowcase } from '../components/services/WebsitePreviewShowcase';

const WEBSITE_REASONS: CoreReasonItem[] = [
  {
    number: '01',
    title: '템플릿 끼워 맞추기가 아닌 사업 구조 기반 기획',
    description:
      '업종과 영업 방식이 다른데 같은 구조를 쓰면 설득력이 떨어집니다. 방문자가 가장 먼저 확인하는 정보와 상담 흐름을 기준으로 처음부터 설계합니다.',
  },
  {
    number: '02',
    title: '직접 편집하는 부담 없이 완성도를 지키는 전담 제작',
    description:
      '편집 툴을 익히고 화면을 조립하는 데 내부 인력을 소모하지 않아도 됩니다. 온오프마케팅이 기획·디자인·구현·배포를 책임지고 고객은 검수에 집중합니다.',
  },
  {
    number: '03',
    title: '오픈 이후 운영과 마케팅 확장까지 고려한 기반',
    description:
      '일회성 구축으로 끝나지 않도록 기본 SEO 구조와 확장 가능한 컴포넌트 체계를 갖춰, 추후 운영관리·SEO·GEO·콘텐츠 확장이 자연스럽게 이어집니다.',
  },
];

const WEBSITE_FEATURES: CoreFeatureItem[] = [
  {
    number: '01',
    title: '브랜드 맞춤 기획 및 디자인',
    scopeNote: '핵심 구축 범위',
    description:
      '기업의 정체성과 타깃 고객층에 어울리는 정보 구조(IA), 타이포그래피, 컬러 및 레이아웃을 맞춤 설계합니다.',
  },
  {
    number: '02',
    title: 'PC·모바일 반응형 홈페이지',
    scopeNote: '핵심 구축 범위',
    description:
      '데스크톱, 태블릿, 모바일 화면 크기에 맞춰 가독성과 상담 버튼 접근성이 유지되도록 반응형으로 구현합니다.',
  },
  {
    number: '03',
    title: '회사소개 및 서비스 소개',
    scopeNote: '프로젝트별 구성',
    description:
      '기업 개요, 핵심 사업 영역, 서비스 상세 구조, 진행 프로세스를 방문자가 빠르게 이해할 수 있게 구성합니다.',
  },
  {
    number: '04',
    title: '게시판, 자료실, 공지사항',
    scopeNote: '필요 시 선택 구성',
    description:
      '기업 소식, 공지사항, 브로슈어·문서 자료실 등 정기적인 정보 게시가 필요한 경우 목적에 맞게 설계합니다.',
  },
  {
    number: '05',
    title: '고객 문의 및 견적 요청',
    scopeNote: '목적별 맞춤 설계',
    description:
      '업종에 맞는 필수 입력 항목과 상담 유형 선택 구조를 구성해 실질적인 문의 접수로 이어지도록 설계합니다.',
  },
  {
    number: '06',
    title: 'SEO 기본 구조',
    scopeNote: '기본 토대 반영',
    description:
      '검색엔진이 페이지 구조를 올바르게 해석할 수 있도록 시맨틱 마크업, 타이틀·메타 설명, 깔끔한 URL 구조를 적용합니다.',
  },
  {
    number: '07',
    title: '프로젝트별 맞춤 기능 개발',
    scopeNote: '별도 협의 범위',
    description:
      '사업 모델상 필요한 특수 계산, 필터링, 외부 채널 연동 등 맞춤형 기능은 상담 단계에서 범위와 일정을 별도 협의해 개발합니다.',
  },
];

interface IndustryExample {
  id: string;
  label: string;
  headline: string;
  summary: string;
  pages: string[];
  optionalNote: string;
}

const INDUSTRY_EXAMPLES: IndustryExample[] = [
  {
    id: 'b2b-manufacturing',
    label: '제조 · B2B 기업',
    headline: '신뢰도와 기술 사양을 체계적으로 전달하는 공식 사이트',
    summary:
      '거래처와 바이어가 회사 규모, 설비·기술 역량, 제품군을 빠르게 검토하고 견적을 문의할 수 있도록 구성합니다.',
    pages: ['회사소개 · 연혁', '제품·기술 분야 소개', '카탈로그 자료실 (선택)', 'B2B 견적 문의'],
    optionalNote: '다국어 구성이나 제품 사양 필터는 프로젝트 협의 범위로 확장할 수 있습니다.',
  },
  {
    id: 'consulting',
    label: '컨설팅 · 법무 · 전문직',
    headline: '전문 영역과 상담 절차를 명료하게 안내하는 전환 중심 사이트',
    summary:
      '복잡한 전문 서비스를 고객 눈높이로 정리하고, 자주 묻는 질문과 1:1 상담 접수 동선을 간결하게 연결합니다.',
    pages: ['핵심 전문 분야 안내', '진행 절차 및 기준', '인사이트·공지 (선택)', '맞춤 상담 신청'],
    optionalNote: '검색 유입을 고려한 전문 칼럼 구조는 SEO·AI 콘텐츠 서비스와 연계할 수 있습니다.',
  },
  {
    id: 'it-solution',
    label: 'IT · 솔루션 · 스타트업',
    headline: '제품 가치와 도입 시나리오를 직관적으로 설명하는 B2B 사이트',
    summary:
      '솔루션의 핵심 차별점, 도입 대상별 활용 방식, 요금 기준 및 데모·도입 상담 흐름을 설득력 있게 설계합니다.',
    pages: ['솔루션 개요 및 특징', '활용 시나리오', '요금·도입 안내', '도입 상담 요청'],
    optionalNote: '신규 기능 출시나 캠페인에 맞춘 랜딩 페이지 추가는 운영관리와 연동할 수 있습니다.',
  },
  {
    id: 'medical-edu',
    label: '교육 · 기관 · 클리닉',
    headline: '방문자가 필요한 안내와 일정을 쉽게 찾는 정보 친화 사이트',
    summary:
      '모바일 방문 비중이 높은 환경을 고려해 프로그램·진료 분야, 공지사항, 오시는 길 및 문의 동선을 정돈합니다.',
    pages: ['기관·프로그램 소개', '공지사항 · 자주 묻는 질문', '오시는 길 및 이용 안내', '상담·예약 문의'],
    optionalNote: '예약 연동 등 특수 외부 시스템 연결 여부는 초기 상담에서 가능 범위를 확인합니다.',
  },
];

const WEBSITE_PROCESS: CoreProcessStep[] = [
  {
    step: '01',
    title: '상담 및 범위 기획',
    description:
      '사업 목적, 타깃 고객, 필요한 페이지와 기능 범위를 상담으로 정리하고 메뉴 구조를 확정합니다.',
  },
  {
    step: '02',
    title: '디자인 및 퍼블리싱',
    description:
      '브랜드 톤에 맞춘 UI 시안을 제안하고, 확정된 방향을 PC·모바일 반응형 웹으로 구현합니다.',
  },
  {
    step: '03',
    title: '고객 검수 및 보완',
    description:
      '테스트 환경에서 문구, 화면 배치, 문의 동작과 기본 SEO 항목을 고객과 함께 꼼꼼히 검수합니다.',
  },
  {
    step: '04',
    title: '도메인 연결 및 오픈',
    description:
      '도메인·SSL 보안 연결과 호스팅 배포를 마치고 오픈하며, 필요 시 운영관리·마케팅으로 연결합니다.',
  },
];

const WEBSITE_FAQS: CoreFaqItem[] = [
  {
    question: '페이지에 소개된 모든 기능이 기본 제작에 전부 포함되나요?',
    answer:
      '아닙니다. 모든 기능을 일괄 강제하지 않고, 기업 목적에 꼭 필요한 구성을 상담을 통해 조합합니다. 브랜드 맞춤 기획·디자인과 반응형 구현, 기본 SEO 구조를 바탕으로 게시판·자료실·견적 폼·맞춤 기능 개발 등은 프로젝트 범위에 따라 협의하여 반영합니다.',
  },
  {
    question: '회사 소개서나 문구 자료가 완벽히 준비되지 않았는데 상담할 수 있나요?',
    answer:
      '가능합니다. 현재 보유하신 간단한 소개 자료나 사업 방향만 공유해 주셔도 상담 과정에서 필요한 페이지 구조와 준비 항목을 함께 정리해 드립니다. 원고 정리가 필요한 경우 AI 콘텐츠 서비스 연계도 안내해 드립니다.',
  },
  {
    question: '고객이 직접 드래그 앤 드롭으로 화면을 편집하는 방식인가요?',
    answer:
      '아닙니다. ONOFF Builder는 고객이 편집 도구를 익혀 직접 제작하는 DIY 빌더가 아니라, 온오프마케팅이 기획·디자인·구현·배포를 전담하고 고객은 방향 공유와 검수에 집중하는 관리형 제작 서비스입니다.',
  },
  {
    question: '기존에 쓰던 도메인이나 홈페이지가 있어도 새로 제작할 수 있나요?',
    answer:
      '네, 기존 도메인과 회사 이메일 연동을 유지한 상태에서 새로운 홈페이지로 안전하게 리뉴얼 및 전환할 수 있습니다. 기존 사이트 주소를 상담 시 알려주시면 구조 점검 후 안내합니다.',
  },
  {
    question: '제작 기간과 비용은 어떻게 확인할 수 있나요?',
    answer:
      '페이지 규모, 게시판·자료실 및 맞춤 기능 포함 여부, 운영관리·마케팅 연계 범위에 따라 달라집니다. 제작 상담을 통해 요구사항을 확인한 뒤 명확한 항목별 제안서와 예상 일정을 안내해 드립니다.',
  },
];

function IndustryUseCasesSection() {
  const [selectedId, setSelectedId] = useState<string>(INDUSTRY_EXAMPLES[0].id);
  const current =
    INDUSTRY_EXAMPLES.find((item) => item.id === selectedId) ?? INDUSTRY_EXAMPLES[0];

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8 lg:p-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-[580px]">
          <p className="text-[13px] font-semibold text-blue-600">업종별 활용 예시</p>
          <h3 className="mt-2.5 text-[22px] sm:text-[26px] font-bold leading-snug tracking-[-0.02em] text-slate-950">
            사업 특성에 따라 페이지와 기능 구성을 다르게 설계합니다
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {INDUSTRY_EXAMPLES.map((industry) => {
            const active = industry.id === selectedId;
            return (
              <button
                key={industry.id}
                type="button"
                onClick={() => setSelectedId(industry.id)}
                className={`min-h-[38px] rounded-lg px-3.5 py-1.5 text-[13px] font-medium whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer ${
                  active
                    ? 'bg-[#101828] text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-950'
                }`}
              >
                {industry.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 rounded-xl border border-slate-200 bg-white p-6 sm:p-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="text-[13px] font-semibold text-slate-500">{current.label} 구성 예시</p>
          <h4 className="mt-2 text-[20px] font-semibold leading-snug text-slate-950">
            {current.headline}
          </h4>
          <p className="mt-3 text-[15px] leading-[1.68] text-slate-600">{current.summary}</p>
          <p className="mt-5 text-[13px] leading-[1.6] text-slate-500">{current.optionalNote}</p>
        </div>

        <div className="lg:col-span-5 lg:border-l lg:border-slate-200 lg:pl-8 flex flex-col justify-between">
          <div>
            <p className="text-[13px] font-semibold text-slate-950">대표 페이지 구성 예시</p>
            <ul className="mt-4 divide-y divide-[#EAECF0]">
              {current.pages.map((page, idx) => (
                <li key={page} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <span className="text-[12px] font-semibold tabular-nums text-blue-600">
                    0{idx + 1}
                  </span>
                  <span className="text-[14px] font-medium text-slate-950">{page}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200">
            <Link
              to="/contact?service=website"
              className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-blue-600 hover:text-blue-700"
            >
              <span>이 업종으로 상담하기</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function WebsiteServicePage() {
  return (
    <CoreServicePageTemplate
      kicker="서비스 · 홈페이지 제작"
      headline={
        <>
          우리 사업에 맞는 홈페이지,
          <br />
          처음부터 다르게.
        </>
      }
      heroDescription="정형화된 템플릿에 회사를 끼워 맞추지 않습니다. 브랜드 맞춤 기획과 디자인, PC·모바일 반응형 구현, 상담 동선과 SEO 기본 구조까지 온오프마케팅이 전담해 완성합니다."
      primaryCtaLabel="상담하기"
      primaryCtaTo="/contact?service=website"
      secondaryCtaLabel="제공 기능 살펴보기"
      secondaryCtaHref="#features"
      reasonsKicker="왜 처음부터 제대로 만들어야 하나요"
      reasonsHeading="홈페이지는 기업의 첫인상이자, 가장 오래 일하는 영업 창구입니다"
      reasonsLead="처음 구조를 제대로 잡지 못하면 오픈 직후부터 수정과 재구축 비용이 반복됩니다. ONOFF Builder는 사업 목적에 맞춘 완성도와 장기 확장성을 함께 설계합니다."
      reasons={WEBSITE_REASONS}
      featuresKicker="제공 기능 및 활용 방식"
      featuresHeading="프로젝트 목적에 맞춰 필요한 구성을 조합해 제작합니다"
      featuresLead="기본 기업 소개부터 자료실, 상담 접수, 프로젝트별 맞춤 기능까지 사업 단계에 알맞은 범위로 설계합니다."
      featuresNotice="안내: 아래 항목은 ONOFF Builder로 구현 가능한 주요 구성 요소입니다. 모든 기능이 기본으로 일괄 제공되는 방식이 아니라, 상담을 통해 프로젝트 목적과 예산에 맞는 범위를 선택·협의하여 구축합니다."
      features={WEBSITE_FEATURES}
      featuresExtraSection={<IndustryUseCasesSection />}
      previewKicker="제품·기능 화면 예시"
      previewHeading="실제 기업 환경에 어울리는 정돈된 화면 구조"
      previewLead="회사 소개, 게시판·자료실, 견적 요청 등 주요 페이지가 어떤 정보 위계로 설계되는지 예시 화면으로 확인해 보세요."
      previewComponent={<WebsitePreviewShowcase />}
      processKicker="서비스 진행 절차"
      processHeading="상담부터 오픈까지 단계별 검수로 투명하게 진행합니다"
      processLead="고객은 복잡한 개발 용어 대신 각 단계의 핵심 의사결정과 화면 검수에만 집중하시면 됩니다."
      processSteps={WEBSITE_PROCESS}
      relatedLinks={[
        {
          label: '운영관리',
          description: '오픈 이후 콘텐츠 수정, 페이지 추가, 호스팅·유지보수를 지속적으로 맡길 수 있습니다.',
          to: '/management',
        },
        {
          label: 'SEO',
          description: '기본 구조를 넘어 업종 키워드와 검색 의도에 맞춘 본격적인 검색 최적화를 연결합니다.',
          to: '/services/seo',
        },
        {
          label: 'DOMAIN',
          description: '브랜드 도메인 구성, 기존 메일 보호, DNS 설정 및 HTTPS 보안을 깔끔하게 연동합니다.',
          to: '/domain',
        },
      ]}
      faqs={WEBSITE_FAQS}
      ctaTitle={
        <>
          우리 사업에 꼭 맞는 홈페이지 구조,
          <br />
          상담으로 먼저 정리해 보세요.
        </>
      }
      ctaDescription="필요한 페이지 구성과 선택 기능 범위를 함께 검토해 현실적인 제작 방향을 제안해 드립니다."
      ctaButtonLabel="상담하기"
      ctaButtonTo="/contact?service=website"
    />
  );
}
