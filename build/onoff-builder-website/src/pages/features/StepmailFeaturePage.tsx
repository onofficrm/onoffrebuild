import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  FileText,
  KeyRound,
  Layers,
  Link2,
  Mail,
  Send,
  UserCheck,
} from 'lucide-react';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { DetailDisclosure } from '../../components/ui/DetailDisclosure';
import { FadeIn } from '../../components/ui/FadeIn';
import { Section, SectionHeader } from '../../components/ui/Section';
import { DisplayHeading, LeadText, MetaLine, SectionKicker } from '../../components/ui/Typography';
import { FeaturePolicyStatusCard } from '../../components/features/FeaturePolicyStatusCard';
import { StepMailDemoMockup } from '../../components/features/StepMailDemoMockup';
import {
  COMPARISON_PRODUCTS,
  getOfferingBySlug,
  OPERATIONAL_STATUS_META,
} from '../../data/platformCapabilities';

const OFFERING = getOfferingBySlug('stepmail')!;
const STATUS_META = OPERATIONAL_STATUS_META[OFFERING.operationalStatus];
const MAILCHIMP_URL = COMPARISON_PRODUCTS.mailchimp.officialUrl;

const READINESS_ITEMS = [
  { label: '자체 메일 발송 엔진', status: '연동 준비 중' },
  { label: '수신거부(옵트아웃) 자동화', status: '연동 준비 중' },
  { label: '발신 도메인 인증 (SPF·DKIM)', status: '사전 점검 연계' },
  { label: '월 발송량 · 사용량 정책', status: '정책 수립 중' },
];

const STEPMAIL_FAQS = [
  {
    question: '데모 화면에서 버튼을 누르면 실제로 이메일이 발송되나요?',
    answer:
      '아니요. 시나리오와 단계별 메일 흐름을 미리 확인하는 브라우저 시연 UI이며, 실제 이메일을 발송하거나 외부 서버에 데이터를 저장하지 않습니다.',
  },
  {
    question: 'Mailchimp의 모든 기능을 대체하나요?',
    answer:
      '그렇지 않습니다. Mailchimp는 대규모 뉴스레터·A/B 테스트·복잡한 세그먼트 캠페인에 특화된 전문 이메일 마케팅 플랫폼입니다. ONOFF 스텝메일은 홈페이지 문의와 연결된 핵심 단계별 후속 안내에 집중합니다.',
  },
  {
    question: '실제 발송 엔진과 수신거부 자동화는 지금 바로 쓸 수 있나요?',
    answer:
      '플랫폼 내장 발송 엔진, 수신거부 자동 처리, 발신 인증 자동화는 현재 연동 준비 중입니다. 당장 운영이 필요한 경우 시나리오 설계 및 검증된 외부 발송 도구 연계 방식으로 상담합니다.',
  },
  {
    question: '별도 솔루션 구독료 0원 정책의 적용 범위는 어디까지인가요?',
    answer:
      'ONOFF Builder 자체 스텝메일 기능 사용에 추가 솔루션 구독료가 없다는 정책입니다. 발송량·외부 발송 실비·월 홈페이지 운영관리 비용·맞춤 개발비는 별도 조건이 적용될 수 있습니다.',
  },
  {
    question: '기존 회사 이메일(MX)에 영향을 주지 않나요?',
    answer:
      '기존 회사 메일(MX·SPF)을 보존하는 것을 최우선으로 하며, 실제 발송 연계 시 DOMAIN 서비스와 함께 DNS 레코드를 사전 확인한 뒤 적용합니다.',
  },
];

const RELATED_LINKS = [
  { label: '루틴 자동발행', meta: '홈페이지 콘텐츠 축적', to: '/features/routine' },
  { label: '오토포스터', meta: '홈페이지 연계 SNS 배포', to: '/features/sns-poster' },
  { label: 'DOMAIN', meta: 'MX 보존 · DNS 설정', to: '/domain' },
  { label: '홈페이지 제작', meta: '관리형 웹 기반 구축', to: '/website' },
];

export function StepmailFeaturePage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  return (
    <>
      {/* SECTION 1 — HERO (65~70% Email Automation Flow Visual) */}
      <section className="bg-white pt-10 pb-14 sm:pt-14 sm:pb-20 lg:pt-16 lg:pb-24">
        <Container size="wide">
          <FadeIn immediate>
            <div className="mx-auto max-w-[700px] text-left sm:text-center">
              <SectionKicker>스텝메일 · ONOFF Builder 기본 제공</SectionKicker>
              <DisplayHeading className="mt-3">고객을 놓치지 않는 스텝메일.</DisplayHeading>
              <LeadText className="mt-3 sm:mx-auto max-w-[480px]">
                문의 다음에도, 이메일이 이어집니다.
              </LeadText>
              <MetaLine className="mt-2.5">
                자체 솔루션 구독료 0원 · 현재 상태: {STATUS_META.label}
              </MetaLine>

              <div className="mt-7 flex flex-wrap items-center justify-start sm:justify-center gap-3">
                <Button to="/contact?service=stepmail" size="lg">
                  <span>스텝메일 상담하기</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button href="#stepmail-demo" variant="secondary" size="lg">
                  시연 화면 체험하기
                </Button>
              </div>
            </div>

            {/* Hero Centerpiece Visual (~65~70% section weight): 고객 문의 → 환영 메일 → 안내 메일 → 상담 CTA */}
            <div className="mt-10 sm:mt-12">
              <StepMailHeroFlowVisual />
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* SECTION 2 — INTERACTIVE DEMO (Streamlined StepMailDemoMockup) */}
      <Section id="stepmail-demo" surface="subtle" containerSize="wide" className="scroll-mt-20">
        <FadeIn>
          <SectionHeader
            kicker="인터랙티브 시연"
            title="시나리오와 발송 간격을 직접 눌러보세요."
            subtitle="실제 메일을 발송하지 않는 브라우저 시연 화면에서 단계별 흐름을 확인할 수 있습니다."
          />

          <div className="mt-8">
            <StepMailDemoMockup />
          </div>
        </FadeIn>
      </Section>

      {/* SECTION 3 — MAILCHIMP COMPARISON (2 Minimal Cards + Official Link + Status) */}
      <Section surface="white">
        <FadeIn>
          <SectionHeader
            kicker="Mailchimp 비교"
            title="별도 구독 전, 기본 스텝메일부터."
            subtitle="전문 이메일 마케팅 플랫폼과 홈페이지 연결 스텝메일의 역할을 구분해 안내합니다."
            action={
              <a
                href={MAILCHIMP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-[10px] border border-slate-300 bg-white px-4 py-2 text-[13.5px] font-semibold text-slate-950 hover:border-[#98A2B3] hover:text-blue-600 transition-colors whitespace-nowrap"
              >
                <span>Mailchimp 공식 홈페이지</span>
                <ArrowUpRight className="h-4 w-4 text-slate-500" aria-hidden="true" />
              </a>
            }
          />

          {/* 2-Column Visual Flow Comparison Cards */}
          <div className="mt-9 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Left Card: Mailchimp (External Professional Tool — 3 Nodes: 연결 / 계정 / 도구) */}
            <div className="flex flex-col justify-between rounded-[18px] border border-slate-200 bg-slate-50 p-6 sm:p-8">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <a
                    href={MAILCHIMP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[21px] font-bold tracking-[-0.02em] text-slate-950 hover:text-blue-600 transition-colors"
                  >
                    <span>Mailchimp</span>
                    <ArrowUpRight className="h-4 w-4 text-slate-500" aria-hidden="true" />
                  </a>
                  <span className="text-[12px] font-medium text-slate-500">외부 전문 도구</span>
                </div>

                <div className="mt-4 pb-5 border-b border-slate-200">
                  <p className="text-[17px] font-bold tracking-[-0.015em] text-slate-950">
                    전문 이메일 마케팅 플랫폼
                  </p>
                  <p className="mt-1 text-[13.5px] text-slate-600">
                    별도 계정 개설 후 외부 요금 정책에 따라 연결·운영
                  </p>
                </div>

                {/* 3-Node Visual Flow: 연결 -> 계정 -> 도구 */}
                <div className="mt-6">
                  <p className="text-[12px] font-semibold text-slate-500">
                    외부 전문 도구 기반 운영 흐름
                  </p>
                  <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                    {[
                      {
                        step: '연결',
                        title: '웹훅 · 폼 연동',
                        desc: '홈페이지와 별도 연결',
                        icon: Link2,
                      },
                      {
                        step: '계정',
                        title: '외부 계정 · 플랜',
                        desc: '독립 계약·요금 관리',
                        icon: KeyRound,
                      },
                      {
                        step: '도구',
                        title: '전문 캠페인 툴',
                        desc: '뉴스레터 · A/B 테스트',
                        icon: Mail,
                      },
                    ].map((node, idx) => {
                      const Icon = node.icon;
                      return (
                        <div key={node.step} className="relative flex flex-col">
                          <div className="flex h-full flex-col justify-between rounded-[12px] border border-dashed border-slate-300 bg-white p-3.5">
                            <div className="flex items-center justify-between gap-1.5">
                              <span className="text-[11.5px] font-semibold text-slate-500">
                                {node.step}
                              </span>
                              <Icon className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                            </div>
                            <div className="mt-2.5">
                              <p className="text-[13px] font-semibold text-slate-950">
                                {node.title}
                              </p>
                              <p className="mt-0.5 text-[11.5px] text-slate-500">{node.desc}</p>
                            </div>
                          </div>
                          {idx < 2 && (
                            <>
                              <span
                                aria-hidden="true"
                                className="hidden sm:flex absolute -right-[11px] top-1/2 -translate-y-1/2 z-10 h-5 w-5 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-400"
                              >
                                <ArrowRight className="h-3 w-3" />
                              </span>
                              <span
                                aria-hidden="true"
                                className="flex sm:hidden items-center justify-center pt-1.5 text-slate-400"
                              >
                                <ArrowDown className="h-3.5 w-3.5" />
                              </span>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <p className="mt-5 text-[13px] leading-[1.55] text-slate-600">
                  대규모 뉴스레터·세그먼트 캠페인을 전담 운영하는 팀에 적합한 외부 전문 플랫폼입니다.
                </p>
              </div>

              <div className="mt-6 border-t border-slate-200 pt-4 flex items-center justify-between gap-2">
                <span className="text-[12px] text-slate-500">공식 사이트에서 기능·정책 확인</span>
                <a
                  href={MAILCHIMP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[13px] font-semibold text-slate-950 hover:text-blue-600 transition-colors whitespace-nowrap"
                >
                  <span>mailchimp.com</span>
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* Right Card: ONOFF 스텝메일 (ONOFF Builder Native — 3 Nodes + Large 0원 Display) */}
            <div className="flex flex-col justify-between rounded-[18px] border border-[#2563EB]/30 bg-white p-6 sm:p-8 shadow-[var(--shadow-stage)]">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-[21px] font-bold tracking-[-0.02em] text-slate-950">
                    ONOFF 스텝메일
                  </h3>
                  <span className="text-[12px] font-semibold text-blue-600">
                    ONOFF Builder 기본 제공
                  </span>
                </div>

                {/* Large Prominent '별도 자체 솔루션 구독료 0원' Display */}
                <div className="mt-4 pb-5 border-b border-slate-200 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
                  <div>
                    <p className="text-[12.5px] font-semibold text-slate-600">
                      별도 자체 솔루션 구독료
                    </p>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-[36px] sm:text-[42px] font-bold leading-none tracking-[-0.03em] tabular-metrics text-blue-600">
                        0원
                      </span>
                      <span className="text-[13.5px] font-semibold text-slate-950">
                        홈페이지 연계 기본 제공
                      </span>
                    </div>
                  </div>
                  <p className="text-[12px] font-medium text-slate-500">
                    내장 발송·수신거부:{' '}
                    <strong className="font-semibold text-slate-950">{STATUS_META.label}</strong>
                  </p>
                </div>

                {/* 3-Node Visual Flow: 홈페이지 문의 -> 자체 시퀀스 -> 상담 전환 */}
                <div className="mt-6">
                  <p className="text-[12px] font-semibold text-blue-600">
                    ONOFF Builder 자체 제공 운영 흐름
                  </p>
                  <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                    {[
                      {
                        step: '01 · 유입',
                        title: '홈페이지 문의',
                        desc: '폼 접수와 즉시 연결',
                        icon: FileText,
                        dark: true,
                      },
                      {
                        step: '02 · 자체 흐름',
                        title: '단계별 시퀀스',
                        desc: '환영·안내 통합 관리',
                        icon: Layers,
                        dark: false,
                      },
                      {
                        step: '03 · 전환',
                        title: '상담 · 미팅 연결',
                        desc: '홈페이지 CTA로 회귀',
                        icon: UserCheck,
                        dark: false,
                      },
                    ].map((node, idx) => {
                      const Icon = node.icon;
                      return (
                        <div key={node.step} className="relative flex flex-col">
                          <div
                            className={`flex h-full flex-col justify-between rounded-[12px] border p-3.5 ${
                              node.dark
                                ? 'border-[#0B1220] bg-slate-950 text-white'
                                : 'border-[#2563EB]/25 bg-blue-50/45 text-slate-950'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1.5">
                              <span
                                className={`text-[11.5px] font-semibold tabular-metrics ${
                                  node.dark ? 'text-[#93C5FD]' : 'text-blue-600'
                                }`}
                              >
                                {node.step}
                              </span>
                              <Icon
                                className={`h-3.5 w-3.5 ${
                                  node.dark ? 'text-[#93C5FD]' : 'text-blue-600'
                                }`}
                                aria-hidden="true"
                              />
                            </div>
                            <div className="mt-2.5">
                              <p
                                className={`text-[13px] font-semibold ${
                                  node.dark ? 'text-white' : 'text-slate-950'
                                }`}
                              >
                                {node.title}
                              </p>
                              <p
                                className={`mt-0.5 text-[11.5px] ${
                                  node.dark ? 'text-slate-300' : 'text-slate-600'
                                }`}
                              >
                                {node.desc}
                              </p>
                            </div>
                          </div>
                          {idx < 2 && (
                            <>
                              <span
                                aria-hidden="true"
                                className="hidden sm:flex absolute -right-[11px] top-1/2 -translate-y-1/2 z-10 h-5 w-5 items-center justify-center rounded-full border border-[#2563EB]/30 bg-white text-blue-600"
                              >
                                <ArrowRight className="h-3 w-3" />
                              </span>
                              <span
                                aria-hidden="true"
                                className="flex sm:hidden items-center justify-center pt-1.5 text-blue-600"
                              >
                                <ArrowDown className="h-3.5 w-3.5" />
                              </span>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <p className="mt-5 text-[13px] leading-[1.55] text-[#344054]">
                  Mailchimp 전체 기능 대체가 아닌, 홈페이지 문의 후속 단계별 안내 구조 통합에 집중합니다.
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4 text-[13px]">
                <span className="font-medium text-slate-500">
                  현행: <strong className="text-slate-950">시나리오 설계 · 외부 연계 상담</strong>
                </span>
                <Link
                  to="/pricing"
                  className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700 whitespace-nowrap"
                >
                  <span>요금 정책</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>

          {/* Explicit Separate-Cost & Readiness Policy Line */}
          <p className="mt-4 text-[13px] leading-[1.6] text-slate-500">
            별도 비용 구분: 외부 이메일 발송 실비, 기준 초과 발송량, 운영 대행, 맞춤 개발, 월
            홈페이지 운영관리비는 별도 정책이 적용됩니다. 스텝메일 내장 발송 및 수신거부 자동화는
            현재 {STATUS_META.label}입니다.
          </p>

          {/* Collapsible Detailed Policy & Readiness Disclosure */}
          <div className="mt-4">
            <DetailDisclosure
              label="제공 정책 · 준비 항목 세부 기준 보기"
              summary="발송 엔진, 수신거부, SPF·DKIM 인증 및 별도 비용 구분 안내"
            >
              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {READINESS_ITEMS.map((entry) => (
                    <div
                      key={entry.label}
                      className="rounded-[12px] border border-slate-200 bg-slate-50 p-3.5"
                    >
                      <p className="text-[12.5px] font-semibold text-slate-950">{entry.label}</p>
                      <p className="mt-1 text-[12px] font-semibold text-blue-600">{entry.status}</p>
                    </div>
                  ))}
                </div>
                <FeaturePolicyStatusCard offering={OFFERING} />
              </div>
            </DetailDisclosure>
          </div>
        </FadeIn>
      </Section>

      {/* SECTION 4 — COLLAPSED FAQ & RELATED LINKS */}
      <Section surface="subtle">
        <FadeIn>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionKicker>자주 묻는 질문</SectionKicker>
              <h2 className="mt-2 text-[22px] font-bold leading-[1.28] tracking-[-0.02em] text-slate-950">
                스텝메일 도입 전 확인하세요
              </h2>
              <p className="mt-2 text-[14px] text-slate-600">
                비교 기준과 현재 연계 방식을 간결하게 정리했습니다.
              </p>
            </div>

            <div className="lg:col-span-8 divide-y divide-[#EAECF0] rounded-[16px] border border-slate-200 bg-white px-5 sm:px-7">
              {STEPMAIL_FAQS.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                const panelId = `stepmail-faq-panel-${idx}`;
                return (
                  <div key={faq.question}>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="flex min-h-[54px] w-full cursor-pointer items-center justify-between gap-4 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:rounded-[8px]"
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

          {/* Compact Related Menu Links */}
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
                  ONOFF BUILDER · 스텝메일 상담
                </p>
                <h2 className="mt-3 text-[clamp(1.75rem,3.2vw,2.5rem)] font-bold leading-[1.22] tracking-[-0.025em] text-white">
                  문의 이후 놓치는 고객이 없도록,
                  <br />
                  단계별 이메일 흐름을 설계하세요.
                </h2>
                <p className="mt-3.5 text-[15.5px] leading-[1.6] text-[#CBD5E1]">
                  현행 시나리오·외부 도구 연계 방식과 향후 통합 제공 일정을 투명하게 안내합니다.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Button to="/contact?service=stepmail" size="lg">
                  <span>스텝메일 상담하기</span>
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
/* Hero Centerpiece Visual: 고객 문의 → 환영 메일 → 안내 메일 → 상담 CTA      */
/* ------------------------------------------------------------------------- */

function StepMailHeroFlowVisual() {
  return (
    <figure
      role="region"
      aria-label="고객 문의에서 환영 메일, 안내 메일, 상담 CTA로 이어지는 스텝메일 자동화 흐름 시연 화면"
      className="overflow-hidden rounded-[18px] border border-slate-200 bg-slate-50 shadow-[var(--shadow-stage)]"
    >
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-white px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-[#D0D5DD]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#D0D5DD]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#D0D5DD]" />
          </span>
          <span className="text-[12.5px] font-semibold text-slate-950">
            이메일 자동화 시퀀스 흐름
          </span>
        </div>
        <span className="text-[11.5px] font-medium text-slate-500">
          실제 미발송 · 시연 화면
        </span>
      </div>

      {/* 4 Connected Visual Cards */}
      <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4 sm:p-7">
        {/* 01. 고객 문의 */}
        <div className="relative flex flex-col justify-between rounded-[14px] border border-slate-200 bg-white p-4">
          <div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 font-semibold text-blue-600">
                <UserCheck className="h-3.5 w-3.5" aria-hidden="true" />
                01 · 고객 문의
              </span>
              <span className="tabular-metrics text-slate-400">D+0</span>
            </div>
            <div className="mt-3 space-y-2 rounded-[10px] border border-[#F2F4F7] bg-slate-50 p-3">
              <div className="h-2 w-2/3 rounded bg-[#E2E8F0]" aria-hidden="true" />
              <div className="rounded-[6px] border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] text-slate-500">
                client@company.co.kr
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-950">
                <span className="flex h-3.5 w-3.5 items-center justify-center rounded bg-[#2563EB] text-white">
                  <Check className="h-2.5 w-2.5" aria-hidden="true" />
                </span>
                <span>안내 메일 수신 동의</span>
              </div>
            </div>
          </div>
          <p className="mt-3 text-[12px] font-medium text-slate-600">홈페이지 폼 접수 시 시작</p>
        </div>

        {/* 02. 환영 메일 */}
        <div className="relative flex flex-col justify-between rounded-[14px] border border-[#2563EB]/30 bg-white p-4 shadow-[0_6px_18px_rgba(37,99,235,0.05)]">
          <div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 font-semibold text-blue-600">
                <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                02 · 환영 메일
              </span>
              <span className="font-semibold text-blue-600">즉시</span>
            </div>
            <div className="mt-3 space-y-2 rounded-[10px] border border-[#EFF6FF] bg-slate-50 p-3">
              <p className="text-[12px] font-semibold leading-snug text-slate-950">
                상담이 접수되었습니다
              </p>
              <p className="text-[11px] leading-[1.5] text-slate-500">
                진행 순서와 기본 소개서를 먼저 보내드립니다.
              </p>
              <span className="inline-block rounded-[6px] bg-blue-50 px-2.5 py-1 text-[10.5px] font-semibold text-blue-600">
                소개서 바로 보기
              </span>
            </div>
          </div>
          <p className="mt-3 text-[12px] font-medium text-slate-950">접수 확인 및 첫 안내</p>
        </div>

        {/* 03. 안내 메일 */}
        <div className="relative flex flex-col justify-between rounded-[14px] border border-slate-200 bg-white p-4">
          <div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 font-semibold text-slate-950">
                <FileText className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" />
                03 · 안내 메일
              </span>
              <span className="tabular-metrics text-slate-500">D+3</span>
            </div>
            <div className="mt-3 space-y-2 rounded-[10px] border border-[#F2F4F7] bg-slate-50 p-3">
              <p className="text-[12px] font-semibold leading-snug text-slate-950">
                업종별 활용 사례 요약
              </p>
              <p className="text-[11px] leading-[1.5] text-slate-500">
                홈페이지 콘텐츠와 운영 기준을 단계별로 전달합니다.
              </p>
              <span className="inline-block rounded-[6px] border border-slate-200 bg-white px-2.5 py-1 text-[10.5px] font-medium text-slate-600">
                사례 페이지 이동
              </span>
            </div>
          </div>
          <p className="mt-3 text-[12px] font-medium text-slate-600">검토 시점 신뢰 형성</p>
        </div>

        {/* 04. 상담 CTA */}
        <div className="relative flex flex-col justify-between rounded-[14px] border border-[#0B1220]/15 bg-slate-950 p-4 text-white">
          <div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 font-semibold text-[#93C5FD]">
                <Send className="h-3.5 w-3.5" aria-hidden="true" />
                04 · 상담 CTA
              </span>
              <span className="tabular-metrics text-slate-400">D+7</span>
            </div>
            <div className="mt-3 space-y-2.5 rounded-[10px] border border-white/10 bg-white/[0.05] p-3">
              <p className="text-[12px] font-semibold leading-snug text-white">
                맞춤 범위·견적 안내
              </p>
              <p className="text-[11px] leading-[1.5] text-slate-300">
                필요한 구성만 골라 1:1 상담으로 이어집니다.
              </p>
              <span className="inline-flex items-center gap-1 rounded-[6px] bg-[#2563EB] px-2.5 py-1 text-[10.5px] font-semibold text-white">
                <span>상담하기</span>
                <ArrowRight className="h-3 w-3" aria-hidden="true" />
              </span>
            </div>
          </div>
          <p className="mt-3 text-[12px] font-medium text-slate-300">홈페이지 상담 전환 연결</p>
        </div>
      </div>
    </figure>
  );
}
