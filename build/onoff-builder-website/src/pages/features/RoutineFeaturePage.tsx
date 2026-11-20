import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  CalendarClock,
  Check,
  ChevronDown,
  ClipboardCheck,
  Clock,
  FileText,
  Sparkles,
} from 'lucide-react';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { FadeIn } from '../../components/ui/FadeIn';
import { Section, SectionHeader } from '../../components/ui/Section';
import { DisplayHeading, LeadText, MetaLine, SectionKicker } from '../../components/ui/Typography';
import { FeaturePolicyStatusCard } from '../../components/features/FeaturePolicyStatusCard';
import { RoutineDashboardMockup } from '../../components/features/RoutineDashboardMockup';
import { getOfferingBySlug } from '../../data/platformCapabilities';

const OFFERING = getOfferingBySlug('routine')!;

const WORKFLOW_STEPS = [
  {
    step: '01',
    title: '주제 설정',
    caption: '발행 주기·규칙 고정',
    icon: CalendarClock,
  },
  {
    step: '02',
    title: 'AI 초안',
    caption: '규칙 기반 구조 초안',
    icon: Sparkles,
  },
  {
    step: '03',
    title: '검수',
    caption: '담당자 사실 확인',
    icon: ClipboardCheck,
  },
  {
    step: '04',
    title: '예약',
    caption: '지정 일정 대기 등록',
    icon: Clock,
  },
  {
    step: '05',
    title: '발행 현황',
    caption: '이력 확인·루틴 보완',
    icon: BarChart3,
  },
] as const;

const ROUTINE_FAQS = [
  {
    question: '페이지에 보이는 운영자 대시보드는 실제 서버와 연동되어 있나요?',
    answer:
      '아니요. 콘텐츠 캘린더, 검수 대기, 발행 상태, 진행 이력 흐름을 미리 확인하실 수 있는 시연 화면입니다. 실제 서버 발행과는 연결되지 않으며, ONOFF Builder 플랫폼 직접 자동발행 연동은 현재 준비 중입니다.',
  },
  {
    question: '현재 시점에서는 어떤 방식으로 도입하고 운영할 수 있나요?',
    answer:
      '상담을 통해 업종과 주기에 맞는 루틴 기준을 수립하고, 주제 기획·AI 초안 작성·담당자 사실 검수를 거쳐 ONOFF Builder 운영관리 체계와 연계해 홈페이지에 반영하는 방식으로 도입할 수 있습니다.',
  },
  {
    question: 'AI가 쓴 글이 담당자 확인 없이 바로 올라가지는 않나요?',
    answer:
      '무검수 자동 발행을 지양합니다. 담당자 검수 및 사실 확인 승인을 거친 원고만 예약·발행 대상으로 확정하는 것을 원칙으로 합니다.',
  },
  {
    question: '별도 서비스인 AI 콘텐츠(/content)와는 어떤 차이가 있나요?',
    answer:
      '루틴 자동발행은 홈페이지 콘텐츠를 주기적으로 축적하기 위한 ONOFF Builder 기본 제공 운영 도구 축이며, AI 콘텐츠(/content)는 원고 기획·작성·편집 제작 자체를 맡기는 별도 전문 서비스입니다.',
  },
  {
    question: '홈페이지 없이 루틴 도구만 단독으로 사용할 수 있나요?',
    answer:
      'ONOFF Builder 관리형 홈페이지와 결합했을 때 디자인 일관성과 스텝메일·오토포스터 연계 효과가 가장 큽니다. 기존 홈페이지 보유 여부에 따른 적용 범위는 상담에서 안내합니다.',
  },
];

const RELATED_LINKS = [
  { label: '홈페이지 제작', meta: '관리형 웹 기반', to: '/website' },
  { label: '스텝메일', meta: '단계별 이메일 자동화', to: '/features/step-mail' },
  { label: '오토포스터', meta: '홈페이지 연계 SNS 배포', to: '/features/sns-poster' },
  { label: 'AI 콘텐츠', meta: '원고 제작 별도 서비스', to: '/content' },
];

export function RoutineFeaturePage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  return (
    <>
      {/* SECTION 1 — HERO + 대형 제품 대시보드 스포트라이트 */}
      <section className="bg-white pt-10 pb-14 sm:pt-14 sm:pb-20 lg:pt-16 lg:pb-24">
        <Container size="wide">
          <FadeIn immediate>
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
              {/* Concise Hero Copy (5 cols) */}
              <div className="lg:col-span-5">
                <SectionKicker>루틴 자동발행 · ONOFF Builder 기본 제공</SectionKicker>
                <DisplayHeading className="mt-3">콘텐츠 운영, 루틴으로.</DisplayHeading>
                <LeadText className="mt-3.5 max-w-[440px]">
                  기획부터 검수·예약까지 하나의 흐름으로.
                </LeadText>
                <MetaLine className="mt-3">
                  별도 솔루션 구독료 0원 · 플랫폼 직접 연동 준비 중
                </MetaLine>

                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Button to="/contact?service=routine" size="lg">
                    <span>루틴 상담하기</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                  <Button href="#routine-dashboard" variant="secondary" size="lg">
                    대시보드 체험하기
                  </Button>
                </div>
              </div>

              {/* Large Product Spotlight Visual (7 cols) */}
              <div className="lg:col-span-7">
                <RoutineHeroSpotlight />
              </div>
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* SECTION 2 — 5단계 제품 UI 워크플로 */}
      <Section surface="subtle">
        <FadeIn>
          <SectionHeader
            kicker="5단계 운영 워크플로"
            title="주제 설정부터 발행 현황까지."
            subtitle="무검수 발행 대신 5단계 확인 흐름으로 공식 홈페이지 콘텐츠를 축적합니다."
          />

          {/* Horizontal Product Pipeline (PC: 5-col connected / Mobile: 2-col + step numbers) */}
          <div className="mt-8 rounded-[18px] border border-slate-200 bg-white p-4 sm:p-6 shadow-[var(--shadow-subtle)]">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-3">
              {WORKFLOW_STEPS.map((item, idx) => {
                const Icon = item.icon;
                const isLast = idx === WORKFLOW_STEPS.length - 1;
                const isReview = item.step === '03';

                return (
                  <div
                    key={item.step}
                    className={`relative flex items-stretch ${
                      isLast ? 'col-span-2 sm:col-span-1' : ''
                    }`}
                  >
                    <div
                      className={`flex w-full flex-col justify-between rounded-[14px] border p-4 ${
                        isReview
                          ? 'border-[#2563EB]/30 bg-blue-50/40'
                          : 'border-slate-200 bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`flex h-7 w-7 items-center justify-center rounded-[8px] ${
                            isReview
                              ? 'bg-[#2563EB] text-white'
                              : 'bg-white text-blue-600 border border-slate-200'
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                        </span>
                        <span className="text-[11px] font-bold tabular-metrics text-slate-500">
                          {item.step}
                        </span>
                      </div>

                      <div className="mt-3.5">
                        <h3 className="text-[15px] font-bold tracking-[-0.015em] text-slate-950">
                          {item.title}
                        </h3>
                        <p className="mt-0.5 text-[12.5px] text-slate-600">{item.caption}</p>
                      </div>
                    </div>

                    {!isLast && (
                      <div
                        aria-hidden="true"
                        className="hidden lg:flex items-center justify-center -mr-3 w-3 z-10 text-slate-400"
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </FadeIn>
      </Section>

      {/* SECTION 3 — 대형 운영자 대시보드 시연 화면 (Wide Viewport) */}
      <Section
        id="routine-dashboard"
        surface="white"
        containerSize="wide"
        className="scroll-mt-20"
      >
        <FadeIn>
          <SectionHeader
            kicker="제품 대시보드 시연"
            title="캘린더·검수·발행 상태를 한 화면에서."
            subtitle="좌측 메뉴와 검수 체크리스트를 눌러 실제 운영 흐름을 확인해 보세요."
          />

          <div className="mt-9">
            <RoutineDashboardMockup />
          </div>
        </FadeIn>
      </Section>

      {/* SECTION 4 — 하단 가치 제안 + 제공 범위/상태 + 접힌 FAQ + 관련 링크 */}
      <Section surface="subtle">
        <FadeIn>
          {/* Single-Line Value Proposition */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <SectionKicker>통합 운영 가치</SectionKicker>
              <h2 className="mt-2 text-[clamp(1.625rem,3vw,2.375rem)] font-bold leading-[1.2] tracking-[-0.025em] text-slate-950">
                콘텐츠 운영 시간을 줄입니다.
              </h2>
              <p className="mt-2 text-[15px] text-slate-600">
                홈페이지에 쌓인 검증 원고를 스텝메일과 오토포스터의 원본 자산으로 연결합니다.
              </p>
            </div>
            <Link
              to="/pricing"
              className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-blue-600 hover:text-blue-700 whitespace-nowrap shrink-0"
            >
              <span>요금 및 제공 기준 보기</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          {/* Transparent Scope & Operational Status */}
          <div className="mt-8">
            <FeaturePolicyStatusCard offering={OFFERING} />
          </div>

          {/* Collapsed FAQ Accordion */}
          <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionKicker>자주 묻는 질문</SectionKicker>
              <h3 className="mt-2 text-[22px] font-bold leading-[1.28] tracking-[-0.02em] text-slate-950">
                도입 전 자주 묻는 질문
              </h3>
              <p className="mt-2 text-[14px] text-slate-600">
                현행 운영 방식과 플랫폼 연동 상태를 확인하세요.
              </p>
            </div>

            <div className="lg:col-span-8 divide-y divide-[#EAECF0] rounded-[16px] border border-slate-200 bg-white px-5 sm:px-7">
              {ROUTINE_FAQS.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                const panelId = `routine-faq-panel-${idx}`;
                return (
                  <div key={faq.question}>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="flex min-h-[54px] w-full cursor-pointer items-center justify-between gap-4 py-4 text-left"
                    >
                      <span className="text-[14.5px] sm:text-[15.5px] font-semibold leading-snug text-slate-950">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-slate-500 transition-transform duration-150 ${
                          isOpen ? 'rotate-180 text-slate-950' : ''
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                    {isOpen && (
                      <div id={panelId} className="pb-4 pr-2 sm:pr-6">
                        <p className="text-[14px] leading-[1.68] text-slate-600">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Compact Related Links Bar */}
          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {RELATED_LINKS.map((rel) => (
              <Link
                key={rel.to}
                to={rel.to}
                className="group flex items-center justify-between gap-3 rounded-[14px] border border-slate-200 bg-white px-4 py-3.5 transition-[border-color,box-shadow] duration-150 hover:border-slate-300 hover:shadow-[var(--shadow-subtle)]"
              >
                <div className="min-w-0">
                  <p className="text-[14.5px] font-semibold text-slate-950 group-hover:text-blue-600 transition-colors">
                    {rel.label}
                  </p>
                  <p className="truncate text-[12px] text-slate-500">{rel.meta}</p>
                </div>
                <ArrowRight
                  className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-blue-600 transition-colors"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        </FadeIn>
      </Section>

      {/* SECTION 5 — DEEP NAVY CONSULTATION CTA */}
      <section className="bg-slate-950 py-20 sm:py-24 text-white">
        <Container>
          <FadeIn>
            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <div className="max-w-[600px]">
                <p className="text-[13px] font-semibold tracking-[0.02em] text-[#93C5FD]">
                  ONOFF BUILDER · 루틴 자동발행 상담
                </p>
                <h2 className="mt-3 text-[clamp(1.75rem,3.2vw,2.5rem)] font-bold leading-[1.22] tracking-[-0.025em] text-white">
                  우리 사업에 맞는 콘텐츠 루틴,
                  <br />
                  홈페이지와 함께 시작하세요.
                </h2>
                <p className="mt-3.5 text-[15.5px] leading-[1.6] text-[#CBD5E1]">
                  희망 발행 주기와 업종을 알려주시면 현행 운영 방식과 향후 연동 범위를 투명하게
                  안내합니다.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Button to="/contact?service=routine" size="lg">
                  <span>루틴 상담하기</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button to="/pricing" variant="inverseGhost" size="lg">
                  요금안내 보기
                </Button>
              </div>
            </div>
          </FadeIn>
        </Container>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------------- */
/* Hero Centerpiece Graphic: High-Clarity Routine Dashboard Spotlight        */
/* ------------------------------------------------------------------------- */

function RoutineHeroSpotlight() {
  const queueRows = [
    {
      date: '11.11',
      title: '모바일 문의 전환을 높이는 상담 폼 가이드',
      status: '예약 확정',
      statusTone: 'text-blue-600',
    },
    {
      date: '11.18',
      title: '도메인 이전 시 기업 메일 중단 없는 연결 기준',
      status: '검수 대기',
      statusTone: 'text-[#B45309]',
    },
    {
      date: '11.25',
      title: '업종별 FAQ를 홈페이지 자산으로 정리하는 방법',
      status: '초안 생성',
      statusTone: 'text-slate-500',
    },
  ];

  return (
    <figure
      role="region"
      aria-label="루틴 자동발행 대시보드 핵심 시연 화면"
      className="overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-[var(--shadow-stage)]"
    >
      {/* Top Browser/App Chrome */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-200 bg-slate-50 px-4 sm:px-5 py-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex shrink-0 items-center gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-[#D0D5DD]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#D0D5DD]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#D0D5DD]" />
          </span>
          <span className="truncate text-[12.5px] font-semibold text-slate-950">
            콘텐츠 루틴 · 발행 캘린더 &amp; 검수 대기
          </span>
        </div>
        <span className="shrink-0 text-[11px] font-medium text-slate-500">시연 화면 (미연동)</span>
      </div>

      {/* Status Summary Bar */}
      <div className="grid grid-cols-3 divide-x divide-[#EAECF0] border-b border-slate-200 bg-white text-center sm:text-left">
        <div className="px-4 py-3.5 sm:px-5">
          <p className="text-[11px] text-slate-500">월간 예정</p>
          <p className="mt-0.5 text-[18px] font-bold tabular-metrics text-slate-950">6건</p>
        </div>
        <div className="px-4 py-3.5 sm:px-5">
          <p className="text-[11px] text-slate-500">검수 대기</p>
          <p className="mt-0.5 text-[18px] font-bold tabular-metrics text-[#B45309]">2건</p>
        </div>
        <div className="px-4 py-3.5 sm:px-5">
          <p className="text-[11px] text-slate-500">예약 확정</p>
          <p className="mt-0.5 text-[18px] font-bold tabular-metrics text-blue-600">1건</p>
        </div>
      </div>

      {/* Active Queue + Checklist Preview */}
      <div className="p-4 sm:p-5 space-y-4">
        <div className="divide-y divide-[#F2F4F7] rounded-[12px] border border-slate-200 bg-white px-3.5 sm:px-4">
          {queueRows.map((row) => (
            <div key={row.date} className="flex items-center justify-between gap-3 py-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
                <span className="shrink-0 text-[11.5px] font-mono tabular-metrics text-slate-500">
                  {row.date}
                </span>
                <span className="truncate text-[13px] font-medium text-slate-950">{row.title}</span>
              </div>
              <span className={`shrink-0 text-[11.5px] font-semibold ${row.statusTone}`}>
                {row.status}
              </span>
            </div>
          ))}
        </div>

        {/* Review Gate Preview */}
        <div className="flex flex-col gap-3 rounded-[12px] border border-[#2563EB]/20 bg-slate-50 p-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-slate-600">
            <span className="inline-flex items-center gap-1.5 font-medium text-slate-950">
              <Check className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" />
              사실 확인
            </span>
            <span className="inline-flex items-center gap-1.5 font-medium text-slate-950">
              <Check className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" />
              브랜드 어조
            </span>
            <span className="inline-flex items-center gap-1.5 text-slate-500">
              내부 링크 확인 대기
            </span>
          </div>
          <a
            href="#routine-dashboard"
            className="inline-flex items-center gap-1 text-[12px] font-semibold text-blue-600 hover:text-blue-700 whitespace-nowrap shrink-0"
          >
            <span>직접 체험</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </figure>
  );
}
