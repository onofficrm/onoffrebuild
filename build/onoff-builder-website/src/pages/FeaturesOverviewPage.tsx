import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { FadeIn } from '../components/ui/FadeIn';
import { Section, SectionHeader } from '../components/ui/Section';
import { DisplayHeading, LeadText, SectionKicker } from '../components/ui/Typography';
import {
  AiDevPreviewVisual,
  AutomationFeatureCardsGrid,
  EasyEditWideVisual,
  IncludedZeroValueBanner,
  SeparateServicesShowcase,
} from '../components/features/PlatformPreviewCards';
import { AutoCommentDemo } from '../components/features/AutoCommentDemo';

export function FeaturesOverviewPage() {
  return (
    <>
      {/* 1. Compact Visual-First Hero */}
      <Section surface="white" spacing="hero" bordered={false}>
        <FadeIn immediate>
          <div className="max-w-[740px]">
            <SectionKicker>ONOFF BUILDER · 기본 기능</SectionKicker>
            <DisplayHeading className="mt-3">
              홈페이지에 자동화와
              <br />
              쉬운 수정을 더합니다.
            </DisplayHeading>
            <LeadText className="mt-4 max-w-[540px]">
              3대 자동화 도구와 자동 댓글, 자연어 수정, AI 기능 확장을 한눈에 확인하세요.
            </LeadText>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button to="/contact" size="lg">
                <span>기능 상담하기</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button href="#automation-tools" variant="secondary" size="lg">
                6대 핵심 기능 보기
              </Button>
            </div>
          </div>

          {/* Concise Policy & Status Transparency Banner */}
          <div className="mt-9">
            <IncludedZeroValueBanner variant="compact" />
          </div>
        </FadeIn>
      </Section>

      {/* 2. 3대 자동화 도구 (Shared Visual Cards + 추가 솔루션 구독료 0원 표기) */}
      <Section id="automation-tools" surface="subtle" className="scroll-mt-20">
        <FadeIn>
          <SectionHeader
            kicker="3대 자동화 도구"
            title="루틴 · 스텝메일 · 오토포스터."
            subtitle="각 카드를 눌러 상세 작동 흐름, 비교 기준, 운영 상태를 확인하세요."
          />

          <div className="mt-9">
            <AutomationFeatureCardsGrid showSubscriptionZeroLabel />
          </div>
        </FadeIn>
      </Section>

      {/* 3. 자동 댓글 (설명 + Compact 댓글 응대 시연) */}
      <Section id="auto-comment" surface="white" className="scroll-mt-20">
        <FadeIn>
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-5">
              <SectionKicker>자동 댓글 · 추가 솔루션 구독료 0원</SectionKicker>
              <h2 className="mt-2 text-[clamp(1.5rem,2.6vw,2rem)] font-bold leading-[1.25] tracking-[-0.025em] text-slate-950">
                댓글에 답하는 시간까지
                <br />
                줄여 드립니다.
              </h2>
              <p className="mt-3 text-[15px] leading-[1.65] text-slate-600">
                공지·블로그·자료실 게시글의 새 댓글을 상담 문의·질문·후기·스팸으로 분류하고, 브랜드
                톤에 맞춘 AI 답변 초안을 준비합니다. 담당자가 승인한 답변만 게시됩니다.
              </p>
              <ul className="mt-4 space-y-1.5 text-[13.5px] text-slate-600">
                <li>· 스팸·홍보 링크 댓글 자동 숨김</li>
                <li>· 상담 문의 댓글은 상담하기·스텝메일로 연결</li>
                <li>· 내 홈페이지 댓글 응대 전용 · 플랫폼 연동 준비 중</li>
              </ul>
              <Link
                to="/features/auto-comment"
                className="mt-5 inline-flex items-center gap-1 text-[14px] font-semibold text-blue-600 hover:text-blue-700"
              >
                <span>자동 댓글 자세히 보기</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="lg:col-span-7">
              <AutoCommentDemo compact />
            </div>
          </div>
        </FadeIn>
      </Section>

      {/* 4. 쉬운 홈페이지 수정 · AI 기능 개발 (2-Column Compact Visual Composition) */}
      <Section surface="subtle">
        <FadeIn>
          <SectionHeader
            kicker="수정 및 맞춤 확장"
            title="말로 수정하고, AI로 확장합니다."
            subtitle="일상 운영 수정은 자연어 요청으로, 업종 특화 기능은 AI 지원 개발로 연결합니다."
          />

          <div className="mt-9 grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Easy Edit Compact Column */}
            <div className="flex flex-col justify-between gap-4">
              <EasyEditWideVisual compact />
              <div className="flex items-end justify-between gap-4 px-1">
                <div>
                  <h3 className="text-[19px] font-bold tracking-[-0.02em] text-slate-950">
                    쉬운 홈페이지 수정
                  </h3>
                  <p className="mt-1 text-[13.5px] text-slate-600">
                    자연어 요청 · 검수 후 반영 (월 운영관리 플랜 협의)
                  </p>
                </div>
                <Link
                  to="/features/easy-edit"
                  className="inline-flex items-center gap-1 text-[13.5px] font-semibold text-blue-600 hover:text-blue-700 whitespace-nowrap shrink-0"
                >
                  <span>자세히 보기</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>

            {/* AI Dev Compact Column */}
            <div className="flex flex-col justify-between gap-4">
              <AiDevPreviewVisual compact />
              <div className="flex items-end justify-between gap-4 px-1">
                <div>
                  <h3 className="text-[19px] font-bold tracking-[-0.02em] text-slate-950">
                    AI 기능 개발
                  </h3>
                  <p className="mt-1 text-[13.5px] text-slate-600">
                    맞춤 개발 별도 협의 · 엔지니어 검수 후 배포
                  </p>
                </div>
                <Link
                  to="/features/ai-development"
                  className="inline-flex items-center gap-1 text-[13.5px] font-semibold text-blue-600 hover:text-blue-700 whitespace-nowrap shrink-0"
                >
                  <span>자세히 보기</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>
      </Section>

      {/* 5. 별도 전문 서비스 구분 (Shared Compact Menu Showcase) */}
      <Section surface="white">
        <FadeIn>
          <SectionHeader
            kicker="서비스 구분 안내"
            title="제작·운영과 별도 전문 서비스."
            subtitle="ONOFF Builder 기본 기능과 별개로 전문 마케팅 서비스를 선택 연계합니다."
            action={
              <Link
                to="/pricing"
                className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-blue-600 hover:text-blue-700 whitespace-nowrap"
              >
                <span>요금안내 보기</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            }
          />

          <div className="mt-9">
            <SeparateServicesShowcase />
          </div>
        </FadeIn>
      </Section>

      {/* 6. Deep Navy CTA */}
      <section className="bg-slate-950 py-20 sm:py-24 text-white">
        <Container>
          <FadeIn>
            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <div className="max-w-[600px]">
                <p className="text-[13px] font-semibold tracking-[0.02em] text-[#93C5FD]">
                  ONOFF BUILDER 상담
                </p>
                <h2 className="mt-3 text-[clamp(1.75rem,3.2vw,2.5rem)] font-bold leading-[1.22] tracking-[-0.025em] text-white">
                  우리 사업에 맞는 기능 조합을
                  <br />
                  상담으로 설계해 보세요.
                </h2>
                <p className="mt-3.5 text-[15.5px] leading-[1.6] text-[#CBD5E1]">
                  현재 도입 가능한 범위와 향후 자동화 확장 구성을 투명하게 안내해 드립니다.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Button to="/contact" size="lg">
                  <span>상담하기</span>
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
