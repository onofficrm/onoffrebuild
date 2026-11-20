import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ChevronDown, Eye, MessageSquareText } from 'lucide-react';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { DetailDisclosure } from '../../components/ui/DetailDisclosure';
import { FadeIn } from '../../components/ui/FadeIn';
import { Section, SectionHeader } from '../../components/ui/Section';
import { DisplayHeading, LeadText, MetaLine, SectionKicker } from '../../components/ui/Typography';
import { FeaturePolicyStatusCard } from '../../components/features/FeaturePolicyStatusCard';
import { EasyEditBeforeAfterDemo } from '../../components/features/EasyEditBeforeAfterDemo';
import { getOfferingBySlug } from '../../data/platformCapabilities';

const OFFERING = getOfferingBySlug('easy-edit')!;

const THREE_STEP_PROCESS = [
  {
    step: '01',
    title: '요청',
    caption: '편한 말로 변경 내용과 자료 전달',
    icon: MessageSquareText,
  },
  {
    step: '02',
    title: '미리보기·검수',
    caption: 'AI 지원 수정 후 PC·모바일 화면 확인',
    icon: Eye,
  },
  {
    step: '03',
    title: '반영',
    caption: '승인된 변경만 실서비스 안전 배포',
    icon: CheckCircle2,
  },
] as const;

const EASY_EDIT_FAQS = [
  {
    question: '채팅으로 입력하면 실제 운영 홈페이지가 즉시 자동 수정되나요?',
    answer:
      '아니요. 무검수 자동 반영은 화면 깨짐이나 오탈자 위험이 큽니다. 고객이 자연어로 요청하면 운영팀이 AI를 활용해 수정하고, 미리보기 검수와 승인을 거쳐 안전하게 반영합니다.',
  },
  {
    question: '편집기나 서버 코드를 직접 배워야 하나요?',
    answer:
      '배울 필요가 없습니다. 고객이 직접 서버 코드나 DIY 편집기를 다루지 않고, 평소 쓰시는 말로 수정 내용과 자료만 전달하시면 운영팀이 디자인 일관성을 유지하며 반영합니다.',
  },
  {
    question: '모든 수정이 무료로 무제한 포함되나요?',
    answer:
      '지원 범위에 따라 비용 기준이 구분됩니다. 일상적인 문구·이미지·버튼 변경은 월 운영관리 플랜 협의 범위로 진행하며, 신규 페이지 신설이나 기능 개발·외부 연동은 사전 안내 후 별도 비용이 발생할 수 있습니다.',
  },
  {
    question: '수정 요청은 어떻게 전달하면 되나요?',
    answer:
      '“메인 배너를 바꾸고 상담 버튼을 넣어주세요.”처럼 바꾸고 싶은 위치와 의도를 전담 채널로 적어 주시고, 교체할 이미지나 참고 자료가 있다면 함께 보내주시면 됩니다.',
  },
];

const RELATED_LINKS = [
  { label: 'AI 기능 개발', meta: '맞춤 기능 별도 협의', to: '/features/ai-development' },
  { label: '운영관리', meta: '호스팅·보안·일상 수정', to: '/management' },
  { label: '루틴 자동발행', meta: '콘텐츠 정기 발행', to: '/features/routine' },
  { label: '홈페이지 제작', meta: '관리형 웹 기반 구축', to: '/website' },
];

export function EasyEditFeaturePage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  return (
    <>
      {/* SECTION 1 — HERO (70% Interactive Before / After Stage) */}
      <section className="bg-white pt-10 pb-14 sm:pt-14 sm:pb-20 lg:pt-16 lg:pb-24">
        <Container size="wide">
          <FadeIn immediate>
            <div className="mx-auto max-w-[680px] text-left sm:text-center">
              <SectionKicker>쉬운 홈페이지 수정 · 관리형 운영</SectionKicker>
              <DisplayHeading className="mt-3">수정은, 말 한마디로.</DisplayHeading>
              <LeadText className="mt-3 sm:mx-auto max-w-[460px]">
                원하는 변경을 요청하고, 확인한 뒤 반영하세요.
              </LeadText>
              <MetaLine className="mt-2.5">
                운영팀 AI 지원 수정 · 검수 후 안전 반영
              </MetaLine>

              <div className="mt-7 flex flex-wrap items-center justify-start sm:justify-center gap-3">
                <Button to="/contact?service=easy-edit" size="lg">
                  <span>운영 상담하기</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button to="/pricing" variant="secondary" size="lg">
                  요금안내 보기
                </Button>
              </div>
            </div>

            {/* ~70% Hero Centerpiece: Interactive Before / After Comparison */}
            <div className="mt-10 sm:mt-12">
              <EasyEditBeforeAfterDemo />
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* SECTION 2 — 3단계 과정 (요청 → 미리보기·검수 → 반영) */}
      <Section surface="subtle">
        <FadeIn>
          <SectionHeader
            kicker="3단계 수정 과정"
            title="요청부터 미리보기·반영까지."
            subtitle="운영팀이 AI로 변경 범위를 분석·수정하고, 확인 후 안전하게 배포합니다."
          />

          <div className="mt-8 rounded-[18px] border border-slate-200 bg-white p-4 sm:p-6 shadow-[var(--shadow-subtle)]">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
              {THREE_STEP_PROCESS.map((item, idx) => {
                const Icon = item.icon;
                const isLast = idx === THREE_STEP_PROCESS.length - 1;
                const isMid = item.step === '02';

                return (
                  <div key={item.step} className="relative flex items-stretch">
                    <div
                      className={`flex w-full flex-col justify-between rounded-[14px] border p-5 ${
                        isMid
                          ? 'border-[#2563EB]/30 bg-blue-50/40'
                          : 'border-slate-200 bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`flex h-8 w-8 items-center justify-center rounded-[9px] ${
                            isMid
                              ? 'bg-[#2563EB] text-white'
                              : 'border border-slate-200 bg-white text-blue-600'
                          }`}
                        >
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <span className="text-[11px] font-bold tabular-metrics text-slate-500">
                          {item.step}
                        </span>
                      </div>

                      <div className="mt-4">
                        <h3 className="text-[17px] font-bold tracking-[-0.02em] text-slate-950">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-[13.5px] text-slate-600">{item.caption}</p>
                      </div>
                    </div>

                    {!isLast && (
                      <div
                        aria-hidden="true"
                        className="hidden sm:flex items-center justify-center -mr-4 w-4 z-10 text-slate-400"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Concise Scope & Cost Boundary Note + Collapsible Policy Detail */}
          <div className="mt-6 space-y-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-[13px] text-slate-500">
              <p>
                일상 수정은 월 운영관리 플랜 협의 범위로 진행하며, 신규 페이지·구조 개편 등 지원
                범위에 따라 별도 비용이 발생할 수 있습니다.
              </p>
              <Link
                to="/pricing"
                className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700 whitespace-nowrap shrink-0"
              >
                <span>요금 기준 보기</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>

            <DetailDisclosure
              label="제공 정책 및 수정 지원 범위 상세 보기"
              summary="일상 운영 수정과 신규 페이지·기능 개발 협의 범위 구분"
            >
              <FeaturePolicyStatusCard offering={OFFERING} />
            </DetailDisclosure>
          </div>
        </FadeIn>
      </Section>

      {/* SECTION 3 — COLLAPSED FAQ & COMPACT RELATED LINKS */}
      <Section surface="white">
        <FadeIn>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionKicker>자주 묻는 질문</SectionKicker>
              <h2 className="mt-2 text-[22px] font-bold leading-[1.28] tracking-[-0.02em] text-slate-950">
                쉬운 수정 도입 전 확인하세요
              </h2>
              <p className="mt-2 text-[14px] text-slate-600">
                수정 절차와 지원 범위·비용 기준을 간결하게 정리했습니다.
              </p>
            </div>

            <div className="lg:col-span-8 divide-y divide-[#EAECF0] rounded-[16px] border border-slate-200 bg-white px-5 sm:px-7">
              {EASY_EDIT_FAQS.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                const panelId = `easy-edit-faq-panel-${idx}`;
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

          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {RELATED_LINKS.map((rel) => (
              <Link
                key={rel.to}
                to={rel.to}
                className="group flex items-center justify-between gap-3 rounded-[14px] border border-slate-200 bg-slate-50 px-4 py-3.5 transition-[border-color,background-color] duration-150 hover:border-slate-300 hover:bg-white"
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

      {/* SECTION 4 — DEEP NAVY CONSULTATION CTA */}
      <section className="bg-slate-950 py-20 sm:py-24 text-white">
        <Container>
          <FadeIn>
            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <div className="max-w-[600px]">
                <p className="text-[13px] font-semibold tracking-[0.02em] text-[#93C5FD]">
                  ONOFF BUILDER · 쉬운 홈페이지 수정 상담
                </p>
                <h2 className="mt-3 text-[clamp(1.75rem,3.2vw,2.5rem)] font-bold leading-[1.22] tracking-[-0.025em] text-white">
                  수정 때문에 멈추지 않는 홈페이지,
                  <br />
                  관리형 운영으로 시작하세요.
                </h2>
                <p className="mt-3.5 text-[15.5px] leading-[1.6] text-[#CBD5E1]">
                  예상 수정 빈도와 운영 범위를 알려주시면 적합한 플랜과 협업 방식을 안내합니다.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Button to="/contact?service=easy-edit" size="lg">
                  <span>운영 상담하기</span>
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
