import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  FileText,
  Globe,
  KeyRound,
  Layers,
  Link2,
  Share2,
} from 'lucide-react';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { DetailDisclosure } from '../../components/ui/DetailDisclosure';
import { FadeIn } from '../../components/ui/FadeIn';
import { Section, SectionHeader } from '../../components/ui/Section';
import { DisplayHeading, LeadText, MetaLine, SectionKicker } from '../../components/ui/Typography';
import { FeaturePolicyStatusCard } from '../../components/features/FeaturePolicyStatusCard';
import { SnsPosterDashboardMockup } from '../../components/features/SnsPosterDashboardMockup';
import {
  COMPARISON_PRODUCTS,
  getOfferingBySlug,
  OPERATIONAL_STATUS_META,
} from '../../data/platformCapabilities';

const OFFERING = getOfferingBySlug('sns-marketing')!;
const STATUS_META = OPERATIONAL_STATUS_META[OFFERING.operationalStatus];
const FS_POSTER_URL = COMPARISON_PRODUCTS.fsPoster.officialUrl;

const FOUR_FLOW_SCENES = [
  {
    step: '01',
    title: '작성',
    caption: '홈페이지 원문 발행',
    icon: FileText,
  },
  {
    step: '02',
    title: '검수',
    caption: '채널별 요약·링크 확인',
    icon: ClipboardCheck,
  },
  {
    step: '03',
    title: '예약',
    caption: '배포 캘린더 일정 등록',
    icon: CalendarClock,
  },
  {
    step: '04',
    title: '배포 상태',
    caption: '이력 기록·상담 회귀',
    icon: CheckCircle2,
  },
] as const;

const SNS_FAQS = [
  {
    question: 'FS Poster 플러그인 라이선스를 무료로 제공하나요?',
    answer:
      '아니요. FS Poster 라이선스를 지급하는 것이 아니라 ONOFF Builder 자체 오토포스터 기능을 기본 제공하는 정책입니다. 자체 오토포스터 구독료는 0원이며, 외부 유료 SNS API, 채널 계정 권한 승인, 운영 대행, 맞춤 개발비는 별도 조건이 적용될 수 있습니다.',
  },
  {
    question: 'SNS 자동 게시가 지금 모든 채널에서 바로 되나요?',
    answer:
      '아니요. 현재 외부 SNS 플랫폼 API 직접 자동 게시는 연동 준비 중 상태입니다. 운영 검증 전 채널은 모두 연동 준비 중으로 표기하며, 현행은 홈페이지 원문 기반 채널별 요약 원고·일정 운영 범위로 상담합니다.',
  },
  {
    question: 'FS Poster와 ONOFF 오토포스터는 어떤 차이가 있나요?',
    answer:
      'FS Poster는 WordPress 사이트에 설치해 쓰는 소셜 자동 게시 전문 플러그인입니다. ONOFF 오토포스터는 플러그인 관리 대신 관리형 홈페이지·루틴·스텝메일·SNS 운영을 하나의 흐름으로 통합합니다.',
  },
  {
    question: '외부 SNS 정책이 바뀌면 자동 게시 범위도 달라지나요?',
    answer:
      '네. Instagram, Facebook, LinkedIn, X 등 외부 플랫폼은 API 심사·권한·과금 기준을 수시로 변경합니다. 검증 완료된 연동만 순차 반영하며, 정책 변동 시에도 홈페이지 원본 자산은 안전하게 유지됩니다.',
  },
  {
    question: 'SNS에서 유입된 방문자는 어떻게 상담으로 이어지나요?',
    answer:
      '모든 배포는 홈페이지 원본 게시글을 출발점으로 삼아, SNS에서 관심을 끈 뒤 상세 설명과 상담 폼이 정리된 홈페이지로 자연스럽게 되돌아오도록 연결합니다.',
  },
];

const RELATED_LINKS = [
  { label: '루틴 자동발행', meta: 'SNS 원문 콘텐츠 축적', to: '/features/routine' },
  { label: '스텝메일', meta: '문의 후속 이메일 자동화', to: '/features/step-mail' },
  { label: 'TRAFFIC', meta: '유입 전략 별도 서비스', to: '/traffic' },
  { label: '홈페이지 제작', meta: '관리형 공식 웹 기반', to: '/website' },
];

export function SnsMarketingFeaturePage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  return (
    <>
      {/* SECTION 1 — HERO + 홈페이지 게시글 → SNS 채널 분기 대형 비주얼 */}
      <section className="bg-white pt-10 pb-14 sm:pt-14 sm:pb-20 lg:pt-16 lg:pb-24">
        <Container size="wide">
          <FadeIn immediate>
            <div className="mx-auto max-w-[700px] text-left sm:text-center">
              <SectionKicker>오토포스터 (SNS 마케팅) · ONOFF Builder 기본 제공</SectionKicker>
              <DisplayHeading className="mt-3">한 번의 콘텐츠, 여러 채널로.</DisplayHeading>
              <LeadText className="mt-3 sm:mx-auto max-w-[460px]">
                홈페이지와 SNS를 하나의 흐름으로.
              </LeadText>
              <MetaLine className="mt-2.5">
                자체 솔루션 구독료 0원 · 현재 상태: {STATUS_META.label}
              </MetaLine>

              <div className="mt-7 flex flex-wrap items-center justify-start sm:justify-center gap-3">
                <Button to="/contact?service=sns-marketing" size="lg">
                  <span>오토포스터 상담하기</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button href="#sns-dashboard" variant="secondary" size="lg">
                  대시보드 체험하기
                </Button>
              </div>
            </div>

            {/* Hero Centerpiece Visual: Website Post → Multi-Channel SNS Queue Cards */}
            <div className="mt-10 sm:mt-12">
              <SnsHeroBranchVisual />
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* SECTION 2 — 4단계 작동 흐름 (작성 → 검수 → 예약 → 배포 상태) */}
      <Section surface="subtle">
        <FadeIn>
          <SectionHeader
            kicker="4단계 작동 흐름"
            title="작성부터 검수·예약·배포 상태까지."
            subtitle="홈페이지 원문을 기준으로 검수와 예약을 거쳐 채널별 배포 흐름을 정리합니다."
          />

          <div className="mt-8 rounded-[18px] border border-slate-200 bg-white p-4 sm:p-6 shadow-[var(--shadow-subtle)]">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
              {FOUR_FLOW_SCENES.map((scene, idx) => {
                const Icon = scene.icon;
                const isLast = idx === FOUR_FLOW_SCENES.length - 1;
                const isReview = scene.step === '02';

                return (
                  <div key={scene.step} className="relative flex items-stretch">
                    <div
                      className={`flex w-full flex-col justify-between rounded-[14px] border p-4 sm:p-5 ${
                        isReview
                          ? 'border-[#2563EB]/30 bg-blue-50/40'
                          : 'border-slate-200 bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`flex h-8 w-8 items-center justify-center rounded-[9px] ${
                            isReview
                              ? 'bg-[#2563EB] text-white'
                              : 'border border-slate-200 bg-white text-blue-600'
                          }`}
                        >
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <span className="text-[11px] font-bold tabular-metrics text-slate-500">
                          {scene.step}
                        </span>
                      </div>

                      <div className="mt-4">
                        <h3 className="text-[16px] font-bold tracking-[-0.02em] text-slate-950">
                          {scene.title}
                        </h3>
                        <p className="mt-1 text-[13px] text-slate-600">{scene.caption}</p>
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
        </FadeIn>
      </Section>

      {/* SECTION 3 — 대형 오토포스터 대시보드 시연 */}
      <Section id="sns-dashboard" surface="white" containerSize="wide" className="scroll-mt-20">
        <FadeIn>
          <SectionHeader
            kicker="오토포스터 대시보드 시연"
            title="대기열·채널·예약을 한 화면에서."
            subtitle="게시글과 채널을 직접 선택해 검수·예약 흐름을 확인하세요. (실제 외부 미발행)"
          />

          <div className="mt-8">
            <SnsPosterDashboardMockup />
          </div>
        </FadeIn>
      </Section>

      {/* SECTION 4 — FS POSTER 비교 (2개 시각 카드 + 공식 링크 + 비용·상태 안내) */}
      <Section surface="subtle">
        <FadeIn>
          <SectionHeader
            kicker="FS Poster 비교"
            title="별도 플러그인 대신, 홈페이지와 함께."
            subtitle="WordPress용 전문 플러그인과 홈페이지 중심 통합 운영의 역할을 구분해 안내합니다."
            action={
              <a
                href={FS_POSTER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-[10px] border border-slate-300 bg-white px-4 py-2 text-[13.5px] font-semibold text-slate-950 hover:border-[#98A2B3] hover:text-blue-600 transition-colors whitespace-nowrap"
              >
                <span>FS Poster 공식 홈페이지</span>
                <ArrowUpRight className="h-4 w-4 text-slate-500" aria-hidden="true" />
              </a>
            }
          />

          {/* 2-Column Visual Flow Comparison Cards */}
          <div className="mt-9 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Left Card: FS Poster (External Plugin Tool — 3 Nodes: 연결 / 계정 / 도구) */}
            <div className="flex flex-col justify-between rounded-[18px] border border-slate-200 bg-white p-6 sm:p-8">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <a
                    href={FS_POSTER_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[21px] font-bold tracking-[-0.02em] text-slate-950 hover:text-blue-600 transition-colors"
                  >
                    <span>FS Poster</span>
                    <ArrowUpRight className="h-4 w-4 text-slate-500" aria-hidden="true" />
                  </a>
                  <span className="text-[12px] font-medium text-slate-500">WordPress 플러그인</span>
                </div>

                <div className="mt-4 pb-5 border-b border-slate-200">
                  <p className="text-[17px] font-bold tracking-[-0.015em] text-slate-950">
                    WordPress용 전문 소셜 자동 게시 플러그인
                  </p>
                  <p className="mt-1 text-[13.5px] text-slate-600">
                    별도 유료 라이선스 구입 후 직접 설치·업데이트·API 관리
                  </p>
                </div>

                {/* 3-Node Visual Flow: 연결 -> 계정 -> 도구 */}
                <div className="mt-6">
                  <p className="text-[12px] font-semibold text-slate-500">
                    외부 전문 플러그인 기반 운영 흐름
                  </p>
                  <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                    {[
                      {
                        step: '연결',
                        title: '플러그인 설치',
                        desc: 'WordPress 사이트 연동',
                        icon: Link2,
                      },
                      {
                        step: '계정',
                        title: '라이선스 · API 키',
                        desc: '권한·만료 직접 관리',
                        icon: KeyRound,
                      },
                      {
                        step: '도구',
                        title: '소셜 자동 게시',
                        desc: '다수 채널 직접 배포',
                        icon: Share2,
                      },
                    ].map((node, idx) => {
                      const Icon = node.icon;
                      return (
                        <div key={node.step} className="relative flex flex-col">
                          <div className="flex h-full flex-col justify-between rounded-[12px] border border-dashed border-slate-300 bg-slate-50 p-3.5">
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
                                className="hidden sm:flex absolute -right-[11px] top-1/2 -translate-y-1/2 z-10 h-5 w-5 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400"
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
                  WordPress를 직접 운영하며 플러그인 업데이트와 채널 API 설정을 자체 관리하는 환경에 적합합니다.
                </p>
              </div>

              <div className="mt-6 border-t border-slate-200 pt-4 flex items-center justify-between gap-2">
                <span className="text-[12px] text-slate-500">공식 사이트에서 지원 범위 확인</span>
                <a
                  href={FS_POSTER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[13px] font-semibold text-slate-950 hover:text-blue-600 transition-colors whitespace-nowrap"
                >
                  <span>fs-poster.com</span>
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* Right Card: ONOFF 오토포스터 (ONOFF Builder Native — 3 Nodes + Large 0원 Display) */}
            <div className="flex flex-col justify-between rounded-[18px] border border-[#2563EB]/30 bg-white p-6 sm:p-8 shadow-[var(--shadow-stage)]">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-[21px] font-bold tracking-[-0.02em] text-slate-950">
                    ONOFF 오토포스터
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
                        홈페이지 통합 기본 제공
                      </span>
                    </div>
                  </div>
                  <p className="text-[12px] font-medium text-slate-500">
                    SNS API 직접 게시:{' '}
                    <strong className="font-semibold text-slate-950">{STATUS_META.label}</strong>
                  </p>
                </div>

                {/* 3-Node Visual Flow: 홈페이지 원문 -> 자체 검수·예약 -> 상담 회귀 */}
                <div className="mt-6">
                  <p className="text-[12px] font-semibold text-blue-600">
                    ONOFF Builder 자체 제공 운영 흐름
                  </p>
                  <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                    {[
                      {
                        step: '01 · 원문',
                        title: '홈페이지 게시글',
                        desc: '공식 원문 1회 작성',
                        icon: Globe,
                        dark: true,
                      },
                      {
                        step: '02 · 자체 흐름',
                        title: '요약 · 검수 · 예약',
                        desc: '채널별 대기열 통합',
                        icon: Layers,
                        dark: false,
                      },
                      {
                        step: '03 · 회귀',
                        title: '홈페이지 상담 유입',
                        desc: '원문·문의로 연결',
                        icon: CheckCircle2,
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
                  FS Poster 라이선스 무상 제공이 아닌, 홈페이지 원문 중심 자체 오토포스터를 기본 제공합니다.
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4 text-[13px]">
                <span className="font-medium text-slate-500">
                  현재 상태: <strong className="text-slate-950">{STATUS_META.label}</strong>
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

          {/* Explicit External API / Account / Agency / Separate Cost Notice */}
          <p className="mt-4 text-[13px] leading-[1.6] text-slate-500">
            별도 비용 구분: 외부 유료 SNS API 실비, 채널 계정 권한 승인, 운영 대행, 맞춤 개발, 월
            홈페이지 운영관리비는 환경과 범위에 따라 별도 발생할 수 있습니다. 오토포스터 SNS API
            직접 자동 게시는 현재 {STATUS_META.label}입니다.
          </p>

          {/* Compact Operational Status Strip + Collapsible Full Policy */}
          <div className="mt-5">
            <DetailDisclosure
              label={`제공 정책 및 운영 상태(${STATUS_META.label}) 세부 기준 보기`}
              summary="별도 솔루션 구독료 0원 기준, 외부 SNS API 검증 원칙 및 현행 상담 범위"
            >
              <FeaturePolicyStatusCard offering={OFFERING} />
            </DetailDisclosure>
          </div>
        </FadeIn>
      </Section>

      {/* SECTION 5 — COLLAPSED FAQ & COMPACT RELATED LINKS */}
      <Section surface="white">
        <FadeIn>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionKicker>자주 묻는 질문</SectionKicker>
              <h2 className="mt-2 text-[22px] font-bold leading-[1.28] tracking-[-0.02em] text-slate-950">
                오토포스터 도입 전 확인하세요
              </h2>
              <p className="mt-2 text-[14px] text-slate-600">
                기본 제공 정책과 외부 채널 연동 준비 현황을 정리했습니다.
              </p>
            </div>

            <div className="lg:col-span-8 divide-y divide-[#EAECF0] rounded-[16px] border border-slate-200 bg-white px-5 sm:px-7">
              {SNS_FAQS.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                const panelId = `sns-faq-panel-${idx}`;
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

          {/* Compact Related Links */}
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

      {/* SECTION 6 — DEEP NAVY CONSULTATION CTA */}
      <section className="bg-slate-950 py-20 sm:py-24 text-white">
        <Container>
          <FadeIn>
            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <div className="max-w-[600px]">
                <p className="text-[13px] font-semibold tracking-[0.02em] text-[#93C5FD]">
                  ONOFF BUILDER · 오토포스터 (SNS 마케팅) 상담
                </p>
                <h2 className="mt-3 text-[clamp(1.75rem,3.2vw,2.5rem)] font-bold leading-[1.22] tracking-[-0.025em] text-white">
                  홈페이지 콘텐츠와 SNS 운영을
                  <br />
                  별도 구독료 없이 하나로.
                </h2>
                <p className="mt-3.5 text-[15.5px] leading-[1.6] text-[#CBD5E1]">
                  운영 중인 채널과 발행 목표를 알려주시면 현행 운영 범위와 연동 준비 현황을
                  안내합니다.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Button to="/contact?service=sns-marketing" size="lg">
                  <span>오토포스터 상담하기</span>
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
/* Hero Large Visual: 1 Homepage Source Post → Multiple SNS Queue Cards      */
/* ------------------------------------------------------------------------- */

function SnsHeroBranchVisual() {
  const channelCards = [
    {
      channel: 'Instagram',
      format: '카드 요약 · 핵심 3줄',
      excerpt: '홈페이지 리뉴얼 전 반드시 확인해야 할 5가지 구조 기준 요약.',
      status: '연동 준비 중',
    },
    {
      channel: 'LinkedIn 페이지',
      format: 'B2B 인사이트 · 원문 링크',
      excerpt: '디자인보다 먼저 점검해야 할 첫 화면 정보 구조와 모바일 상담 동선.',
      status: '연동 준비 중',
    },
    {
      channel: 'Facebook / 브랜드 채널',
      format: '링크 카드 · 상담 회귀',
      excerpt: '공식 홈페이지 인사이트 전문 보기 → /website',
      status: '연동 준비 중',
    },
  ];

  return (
    <figure
      role="region"
      aria-label="홈페이지 원본 게시글이 여러 SNS 배포 대기 카드로 나뉘는 오토포스터 시연 화면"
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
            홈페이지 원문 → SNS 배포 대기열 분기
          </span>
        </div>
        <span className="text-[11.5px] font-medium text-slate-500">
          외부 미발행 · 시연 화면
        </span>
      </div>

      {/* Split Branch Diagram */}
      <div className="grid grid-cols-1 gap-5 p-5 sm:p-7 lg:grid-cols-12 lg:items-center lg:gap-6">
        {/* Source Homepage Article Card (5 cols) */}
        <div className="lg:col-span-5 rounded-[16px] border border-[#2563EB]/30 bg-white p-5 shadow-[0_6px_20px_rgba(37,99,235,0.05)]">
          <div className="flex items-center justify-between text-[11.5px]">
            <span className="inline-flex items-center gap-1.5 font-semibold text-blue-600">
              <Globe className="h-3.5 w-3.5" aria-hidden="true" />
              홈페이지 원본 게시글
            </span>
            <span className="font-mono text-slate-500">/website</span>
          </div>

          <div className="mt-4 rounded-[12px] border border-slate-200 bg-slate-50 p-4 space-y-2.5">
            <p className="text-[11px] font-semibold text-blue-600">인사이트 · 발행 완료 예시</p>
            <p className="text-[16px] font-bold leading-[1.35] tracking-[-0.02em] text-slate-950">
              기업 홈페이지 리뉴얼 전
              <br />
              점검해야 할 5가지 구조 기준
            </p>
            <p className="text-[12.5px] leading-[1.55] text-slate-600">
              첫 화면 정보 구조, 모바일 상담 동선, 오픈 이후 운영 체계를 한눈에 정리했습니다.
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between text-[12px] text-slate-500">
            <span>원문 1건 작성</span>
            <span className="font-semibold text-blue-600">채널별 대기 카드 생성 →</span>
          </div>
        </div>

        {/* Center Branch Indicator (1 col on lg) */}
        <div
          aria-hidden="true"
          className="hidden lg:flex lg:col-span-1 items-center justify-center"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-blue-600 shadow-[var(--shadow-subtle)]">
            <Share2 className="h-4 w-4" />
          </span>
        </div>

        {/* Multi-Channel SNS Queue Cards (6 cols) */}
        <div className="lg:col-span-6 space-y-3">
          {channelCards.map((card) => (
            <div
              key={card.channel}
              className="rounded-[14px] border border-slate-200 bg-white p-4 transition-colors hover:border-slate-300"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-[12px]">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-950">{card.channel}</span>
                  <span className="text-[#D0D5DD]" aria-hidden="true">
                    ·
                  </span>
                  <span className="text-slate-500">{card.format}</span>
                </div>
                <span className="text-[11px] font-semibold text-blue-600">{card.status}</span>
              </div>
              <p className="mt-1.5 text-[13px] leading-[1.5] text-slate-600">{card.excerpt}</p>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}
