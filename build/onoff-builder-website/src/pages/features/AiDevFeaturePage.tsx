import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ChevronDown,
  Code2,
  Cpu,
  Lightbulb,
  ShieldCheck,
} from 'lucide-react';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { DetailDisclosure } from '../../components/ui/DetailDisclosure';
import { FadeIn } from '../../components/ui/FadeIn';
import { Section, SectionHeader } from '../../components/ui/Section';
import {
  DisplayHeading,
  LeadText,
  MetaLine,
  SectionKicker,
} from '../../components/ui/Typography';
import { FeaturePolicyStatusCard } from '../../components/features/FeaturePolicyStatusCard';
import { AiDevBlueprintDemo } from '../../components/features/AiDevBlueprintDemo';
import { getOfferingBySlug } from '../../data/platformCapabilities';

const OFFERING = getOfferingBySlug('ai-dev')!;

const FOUR_STEP_FLOW = [
  { step: '01', title: '아이디어', caption: '필요한 기능을 말로 설명', icon: Lightbulb },
  { step: '02', title: '설계', caption: 'AI 초안 · 범위와 견적 협의', icon: Cpu },
  { step: '03', title: '제작', caption: '전문 개발팀 구현·연동', icon: Code2 },
  { step: '04', title: '검수', caption: '보안·동작 확인 후 반영', icon: ShieldCheck },
] as const;

const AI_DEV_FAQS = [
  {
    question: '아이디어를 설명하면 어떤 절차로 실제 기능에 반영되나요?',
    answer:
      '말로 설명한 아이디어를 바탕으로 AI 지원 설계로 화면 구조와 흐름을 먼저 구체화합니다. 이후 기능 범위·일정·개별 견적을 합의하고, 전문 개발팀이 직접 구현·보안 테스트·고객 최종 검수를 거쳐 안전하게 반영합니다.',
  },
  {
    question: '맞춤 기능 개발 비용은 홈페이지 제작비에 포함되나요?',
    answer:
      '아니요. 견적 계산기, 예약 신청, 회원 전용 자료실, 외부 API·결제(PG) 연동 같은 맞춤 기능은 프로젝트별 범위 협의와 개별 견적으로 진행합니다.',
  },
  {
    question: '개발 명세서를 직접 작성하기 어려운데 상담이 가능한가요?',
    answer:
      '가능합니다. “조건을 고르면 상담으로 연결되는 계산기가 필요하다”, “승인 거래처 전용 자료실이 필요하다”처럼 목적만 편하게 말씀해 주시면 설계 초안과 구현 범위를 함께 정리합니다.',
  },
  {
    question: '기존 홈페이지나 그누보드(GNUBoard) 회원·게시판과 연동할 수 있나요?',
    answer:
      '사전 기술 검토를 통해 기존 회원·게시판·권한·첨부파일 구조를 먼저 점검하며, 기존 운영 데이터를 손상시키지 않는 안전한 범위 내에서 연동을 진행합니다.',
  },
];

const RELATED_LINKS = [
  { label: '쉬운 홈페이지 수정', meta: '일상 문구·배너 변경', to: '/features/easy-edit' },
  { label: '홈페이지 제작', meta: '관리형 웹 기반 구축', to: '/website' },
  { label: '업종별 활용사례', meta: '맞춤 기능 적용 예시', to: '/use-cases' },
  { label: '요금안내', meta: '제작·운영·개발 기준', to: '/pricing' },
];

export function AiDevFeaturePage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  return (
    <>
      {/* SECTION 1 — HERO (3-Scene Core Visual Showcase) */}
      <section className="bg-white pt-10 pb-14 sm:pt-14 sm:pb-20 lg:pt-16 lg:pb-24">
        <Container size="wide">
          <FadeIn immediate>
            <div className="mx-auto max-w-[680px] text-left sm:text-center">
              <SectionKicker>AI 기능 개발 · 맞춤 확장</SectionKicker>
              <DisplayHeading className="mt-3">생각한 기능을, 현실로.</DisplayHeading>
              <LeadText className="mt-3 sm:mx-auto max-w-[500px]">
                원하는 기능을 설명하면 AI와 개발팀이 함께 구현합니다.
              </LeadText>
              <MetaLine className="mt-2.5">
                별도 범위 협의 · 개별 견적 · 전문 개발팀 검수 후 반영
              </MetaLine>

              <div className="mt-7 flex flex-wrap items-center justify-start sm:justify-center gap-3">
                <Button to="/contact?service=ai-dev" size="lg">
                  <span>개발 상담하기</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button to="/pricing" variant="secondary" size="lg">
                  요금안내 보기
                </Button>
              </div>
            </div>

            {/* Core 3-Scene Interactive Graphic: 요청 입력 → AI 설계 카드 → 웹 기능 미리보기 */}
            <div className="mt-10 sm:mt-12">
              <AiDevBlueprintDemo />
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* SECTION 2 — 1-LINE 4-STEP FLOW (아이디어 → 설계 → 제작 → 검수) & POLICY */}
      <Section surface="subtle">
        <FadeIn>
          <SectionHeader
            kicker="진행 절차"
            title="아이디어 → 설계 → 제작 → 검수"
            subtitle="AI의 설계 속도와 전문 개발팀의 보안·품질 검수를 결합해 안전하게 완성합니다."
          />

          <div className="mt-8 rounded-[18px] border border-slate-200 bg-white p-4 sm:p-5 shadow-[var(--shadow-subtle)]">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
              {FOUR_STEP_FLOW.map((item, idx) => {
                const Icon = item.icon;
                const isLast = idx === FOUR_STEP_FLOW.length - 1;
                const isHighlight = item.step === '02';

                return (
                  <div key={item.step} className="relative flex items-stretch">
                    <div
                      className={`flex w-full flex-col justify-between rounded-[14px] border p-4 sm:p-5 ${
                        isHighlight
                          ? 'border-[#2563EB]/30 bg-blue-50/45'
                          : 'border-slate-200 bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`flex h-8 w-8 items-center justify-center rounded-[9px] ${
                            isHighlight
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
                        <h3 className="text-[16px] font-bold tracking-[-0.02em] text-slate-950">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-[13px] text-slate-600">{item.caption}</p>
                      </div>
                    </div>

                    {!isLast && (
                      <div
                        aria-hidden="true"
                        className="hidden lg:flex items-center justify-center -mr-4 w-4 z-10 text-slate-400"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Concise Policy & Collapsible Detail */}
          <div className="mt-6 space-y-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-[13px] text-slate-500">
              <p>
                맞춤 기능 개발은 별도 범위 협의와 개별 견적, 사전 기술 검토 및 전문 개발팀 검수를
                거쳐 실서비스에 안전하게 적용합니다.
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
              label="제공 정책 및 맞춤 개발 검수 기준 상세 보기"
              summary="별도 범위 협의 · 개별 견적 · 보안 및 기존 데이터 호환성 검수"
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
                맞춤 개발 도입 전 확인하세요
              </h2>
              <p className="mt-2 text-[14px] text-slate-600">
                협의 방식, 개별 견적 기준, 기존 시스템 연동 안전성을 정리했습니다.
              </p>
            </div>

            <div className="lg:col-span-8 divide-y divide-[#EAECF0] rounded-[16px] border border-slate-200 bg-white px-5 sm:px-7">
              {AI_DEV_FAQS.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                const panelId = `ai-dev-faq-panel-${idx}`;
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
                  ONOFF BUILDER · AI 기능 개발 상담
                </p>
                <h2 className="mt-3 text-[clamp(1.75rem,3.2vw,2.5rem)] font-bold leading-[1.22] tracking-[-0.025em] text-white">
                  우리 사업에 꼭 필요한 기능,
                  <br />
                  범위와 설계부터 함께 정리하세요.
                </h2>
                <p className="mt-3.5 text-[15.5px] leading-[1.6] text-[#CBD5E1]">
                  원하는 기능의 목적을 말씀해 주시면 실현 가능한 설계 방향과 개별 견적 기준을
                  안내합니다.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Button to="/contact?service=ai-dev" size="lg">
                  <span>개발 상담하기</span>
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
