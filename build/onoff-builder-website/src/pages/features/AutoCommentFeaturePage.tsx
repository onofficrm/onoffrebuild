import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BellRing,
  ChevronDown,
  Filter,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { DetailDisclosure } from '../../components/ui/DetailDisclosure';
import { FadeIn } from '../../components/ui/FadeIn';
import { Section, SectionHeader } from '../../components/ui/Section';
import { DisplayHeading, LeadText, MetaLine, SectionKicker } from '../../components/ui/Typography';
import { FeaturePolicyStatusCard } from '../../components/features/FeaturePolicyStatusCard';
import { AutoCommentDemo } from '../../components/features/AutoCommentDemo';
import { getOfferingBySlug } from '../../data/platformCapabilities';

const OFFERING = getOfferingBySlug('auto-comment')!;

const FOUR_STEP_PROCESS = [
  {
    step: '01',
    title: '댓글 감지',
    caption: '공지·블로그·자료실 새 댓글 알림',
    icon: BellRing,
  },
  {
    step: '02',
    title: '자동 분류',
    caption: '상담 문의 · 질문 · 후기 · 스팸 구분',
    icon: Filter,
  },
  {
    step: '03',
    title: 'AI 답변 초안',
    caption: '브랜드 톤·응대 규칙에 맞춘 초안',
    icon: Sparkles,
  },
  {
    step: '04',
    title: '승인 후 게시',
    caption: '담당자 확인·수정 후 답변 게시',
    icon: UserCheck,
  },
] as const;

const RULE_CARDS = [
  {
    title: '응대 규칙·답변 톤',
    body: '존댓말 수준, 브랜드 호칭, 가격·의료·법률 등 단정하면 안 되는 표현을 응대 규칙으로 정해 AI 초안에 일관되게 적용합니다.',
  },
  {
    title: '스팸·광고 필터',
    body: '금칙어, 반복 문구, 의심 외부 링크가 포함된 댓글은 답변 없이 숨김 처리하고 관리자 확인 목록으로 보냅니다.',
  },
  {
    title: '상담 전환 연결',
    body: '견적·도입 문의 댓글에는 상담하기 링크를 안내하고, 연락처를 남긴 고객은 스텝메일 후속 안내 흐름과 연결합니다.',
  },
] as const;

const AUTO_COMMENT_FAQS = [
  {
    question: '다른 블로그나 카페, SNS에 홍보 댓글을 자동으로 달아 주는 기능인가요?',
    answer:
      '아닙니다. 자동 댓글은 내 홈페이지 게시글에 달린 고객 댓글에 응대하는 기능입니다. 타 사이트·블로그·카페·SNS에 홍보성 댓글을 대량으로 작성하는 기능은 플랫폼 정책 위반과 브랜드 신뢰 하락 위험이 있어 제공하지 않습니다.',
  },
  {
    question: 'AI가 만든 답변이 검수 없이 바로 게시되나요?',
    answer:
      '무검수 자동 게시를 지양합니다. AI는 분류와 답변 초안만 준비하고, 담당자가 확인·수정·승인한 답변만 게시하는 것을 원칙으로 합니다. 감사 인사처럼 위험도가 낮은 유형의 자동 게시 여부는 운영 규칙으로 따로 협의합니다.',
  },
  {
    question: '지금 바로 사용할 수 있나요?',
    answer:
      '게시판 댓글 자동 감지·AI 답변 초안·승인 게시의 플랫폼 연동은 현재 준비 중입니다. 지금은 응대 규칙·금칙어·답변 템플릿 설계와 운영관리 연계 댓글 응대 범위로 상담해 드립니다.',
  },
  {
    question: '별도 비용이 드나요?',
    answer:
      'ONOFF Builder 기본 제공 기능으로 별도 댓글 관리 솔루션 구독료는 0원입니다. 월 홈페이지 운영관리비, AI 사용량 정책 초과분, 답변 검수 대행, 외부 연동·맞춤 개발비는 별도로 구분됩니다.',
  },
];

const RELATED_LINKS = [
  { label: '스텝메일', meta: '상담 댓글 후속 안내', to: '/features/step-mail' },
  { label: '루틴 자동발행', meta: '댓글이 모이는 정기 콘텐츠', to: '/features/routine' },
  { label: '오토포스터 (SNS 마케팅)', meta: '게시글 SNS 배포', to: '/features/sns-poster' },
  { label: '운영관리', meta: '응대 검수 운영 지원', to: '/management' },
];

export function AutoCommentFeaturePage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  return (
    <>
      {/* SECTION 1 — HERO + 댓글 응대 시연 */}
      <section className="bg-white pt-10 pb-14 sm:pt-14 sm:pb-20 lg:pt-16 lg:pb-24">
        <Container size="wide">
          <FadeIn immediate>
            <div className="mx-auto max-w-[680px] text-left sm:text-center">
              <SectionKicker>자동 댓글 · 기본 제공 (추가 솔루션 구독료 0원)</SectionKicker>
              <DisplayHeading className="mt-3">댓글 응대는, 놓치지 않게.</DisplayHeading>
              <LeadText className="mt-3 sm:mx-auto max-w-[500px]">
                홈페이지 게시글에 달린 고객 댓글을 AI가 분류하고 답변 초안을 준비합니다. 담당자는
                확인하고 승인만 하세요.
              </LeadText>
              <MetaLine className="mt-2.5">
                내 홈페이지 댓글 응대 전용 · 승인 후 게시 · 플랫폼 연동 준비 중
              </MetaLine>

              <div className="mt-7 flex flex-wrap items-center justify-start sm:justify-center gap-3">
                <Button to="/contact?service=auto-comment" size="lg">
                  <span>자동 댓글 상담하기</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button to="/features" variant="secondary" size="lg">
                  기본 기능 전체 보기
                </Button>
              </div>
            </div>

            <div className="mx-auto mt-10 max-w-[1040px] sm:mt-12">
              <AutoCommentDemo />
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* SECTION 2 — 4단계 응대 흐름 + 운영 규칙 */}
      <Section surface="subtle">
        <FadeIn>
          <SectionHeader
            kicker="4단계 댓글 응대 흐름"
            title="감지부터 승인 게시까지."
            subtitle="반복되는 댓글 응대는 AI가 준비하고, 게시 결정은 담당자가 내립니다."
          />

          <div className="mt-8 rounded-[18px] border border-slate-200 bg-white p-4 sm:p-6 shadow-[var(--shadow-subtle)]">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
              {FOUR_STEP_PROCESS.map((item) => {
                const Icon = item.icon;
                const isHighlight = item.step === '03';

                return (
                  <div
                    key={item.step}
                    className={`flex flex-col justify-between rounded-[14px] border p-5 ${
                      isHighlight ? 'border-[#2563EB]/30 bg-blue-50/40' : 'border-slate-200 bg-slate-50'
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
                      <h3 className="text-[17px] font-bold tracking-[-0.02em] text-slate-950">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-[13.5px] text-slate-600">{item.caption}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {RULE_CARDS.map((card) => (
              <div key={card.title} className="rounded-[14px] border border-slate-200 bg-white p-5">
                <p className="flex items-center gap-1.5 text-[15px] font-bold tracking-[-0.02em] text-slate-950">
                  <ShieldCheck className="h-4 w-4 text-blue-600" aria-hidden="true" />
                  {card.title}
                </p>
                <p className="mt-2 text-[13.5px] leading-[1.65] text-slate-600">{card.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-[13px] text-slate-500">
              <p>
                내 홈페이지 댓글 응대 기능이며, 외부 사이트에 홍보 댓글을 작성하지 않습니다. 플랫폼
                연동은 현재 준비 중입니다.
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
              label="제공 정책 및 현재 운영 상태 상세 보기"
              summary="별도 솔루션 구독료 0원 기준과 AI 사용량·검수 대행 비용 구분"
            >
              <FeaturePolicyStatusCard offering={OFFERING} />
            </DetailDisclosure>
          </div>
        </FadeIn>
      </Section>

      {/* SECTION 3 — FAQ & 관련 기능 */}
      <Section surface="white">
        <FadeIn>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionKicker>자주 묻는 질문</SectionKicker>
              <h2 className="mt-2 text-[22px] font-bold leading-[1.28] tracking-[-0.02em] text-slate-950">
                자동 댓글 도입 전 확인하세요
              </h2>
              <p className="mt-2 text-[14px] text-slate-600">
                응대 범위와 검수 원칙, 비용 기준을 간결하게 정리했습니다.
              </p>
            </div>

            <div className="lg:col-span-8 divide-y divide-[#EAECF0] rounded-[16px] border border-slate-200 bg-white px-5 sm:px-7">
              {AUTO_COMMENT_FAQS.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                const panelId = `auto-comment-faq-panel-${idx}`;
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
                  ONOFF BUILDER · 자동 댓글 상담
                </p>
                <h2 className="mt-3 text-[clamp(1.75rem,3.2vw,2.5rem)] font-bold leading-[1.22] tracking-[-0.025em] text-white">
                  답이 빠른 홈페이지가
                  <br />
                  상담으로 이어집니다.
                </h2>
                <p className="mt-3.5 text-[15.5px] leading-[1.6] text-[#CBD5E1]">
                  자주 받는 댓글 유형과 응대 기준을 알려주시면 적용 범위와 운영 방식을 안내합니다.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Button to="/contact?service=auto-comment" size="lg">
                  <span>자동 댓글 상담하기</span>
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
