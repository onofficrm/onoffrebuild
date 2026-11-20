import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Layers3, ShieldCheck, Sparkles } from 'lucide-react';
import { EDITORIAL_IMAGES } from '../data/assets';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { EditorialImage } from '../components/ui/EditorialImage';
import { FadeIn } from '../components/ui/FadeIn';
import { Section, SectionHeader } from '../components/ui/Section';
import { DisplayHeading, LeadText } from '../components/ui/Typography';
import { HomeProductMockup } from '../components/home/HomeProductMockup';
import { UnifiedOperationsFlowVisual } from '../components/home/UnifiedOperationsFlowVisual';
import { AutoCommentDemo } from '../components/features/AutoCommentDemo';
import {
  AiDevPreviewVisual,
  AutomationFeatureCardsGrid,
  EasyEditWideVisual,
  IncludedZeroValueBanner,
  SeparateServicesShowcase,
} from '../components/features/PlatformPreviewCards';

const HOME_USE_CASES = [
  {
    id: 'medical',
    industry: '병원 · 치과 · 전문직',
    title: '진료 안내와 상담 후속 연결',
    description: '신뢰 중심 정보 구성과 스텝메일·쉬운 수정 연계.',
    image: EDITORIAL_IMAGES.conceptMedical.src,
    alt: '병원·치과·전문직 홈페이지 활용 예시 공간 이미지',
  },
  {
    id: 'interior',
    industry: '인테리어 · 시공업체',
    title: '포트폴리오 탐색과 견적 문의',
    description: '시공 사례 탐색과 맞춤 견적 폼·SNS 연계.',
    image: EDITORIAL_IMAGES.conceptInterior.src,
    alt: '인테리어·시공업체 홈페이지 활용 예시 공간 이미지',
  },
  {
    id: 'corporate',
    industry: '기업 · B2B · 컨설팅',
    title: '사업 소개와 단계별 리드 관리',
    description: '공식 기업 소개·자료실과 루틴·스텝메일 구조.',
    image: EDITORIAL_IMAGES.digitalInfrastructure.src,
    alt: '기업 및 B2B 홈페이지 활용 예시 건축 이미지',
  },
  {
    id: 'community',
    industry: '커뮤니티 · 정보 플랫폼',
    title: '콘텐츠 아카이브와 맞춤 필터',
    description: '게시판 중심 정보 축적과 AI 맞춤 기능 확장.',
    image: EDITORIAL_IMAGES.conceptEditorial.src,
    alt: '커뮤니티·정보 플랫폼 활용 예시 공간 이미지',
  },
];

export function HomePage() {
  return (
    <>
      {/* SECTION 1 — HERO + 제품 쇼케이스 */}
      <section className="relative isolate overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-slate-50/90 via-white to-white pt-10 pb-14 sm:pt-14 sm:pb-20 lg:pt-16 lg:pb-24">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(circle_at_22%_12%,rgba(37,99,235,0.14),transparent_38%),radial-gradient(circle_at_78%_8%,rgba(59,130,246,0.1),transparent_32%)]"
        />
        <Container size="wide">
          <FadeIn immediate>
            <div className="mx-auto max-w-[720px] text-left sm:text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50 px-3.5 py-1.5 text-[12px] font-bold tracking-wider text-blue-700">
                <Sparkles className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" />
                ONOFF BUILDER 2.0
              </span>
              <DisplayHeading className="mt-4">
                홈페이지 하나로,{' '}
                <span className="text-blue-600">운영까지.</span>
              </DisplayHeading>
              <LeadText className="mt-3.5 sm:mx-auto max-w-[520px]">
                콘텐츠·이메일·SNS 자동화와 AI 기능 확장을 하나로.
              </LeadText>

              <div className="mt-7 flex flex-wrap items-center justify-start sm:justify-center gap-3">
                <Button to="/contact" size="lg">
                  <span>상담하기</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button to="/features" variant="secondary" size="lg">
                  기능 살펴보기
                </Button>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-start gap-x-5 gap-y-2.5 text-[12.5px] font-semibold text-slate-600 sm:justify-center">
                {[
                  { icon: Layers3, label: '홈페이지·자동화 통합' },
                  { icon: ShieldCheck, label: '검수 후 안전한 반영' },
                  { icon: CheckCircle2, label: '별도 솔루션 구독료 0원' },
                ].map(({ icon: Icon, label }) => (
                  <span key={label} className="inline-flex items-center gap-1.5">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative mt-10 sm:mt-12 lg:mt-14">
              <div
                aria-hidden="true"
                className="absolute -inset-6 -z-10 rounded-[36px] bg-gradient-to-r from-blue-600/10 via-transparent to-blue-400/10 blur-2xl"
              />
              <HomeProductMockup />
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* SECTION 2 — 3대 자동화 도구 + 기본 제공 0원 가치 */}
      <Section id="core-automation" surface="subtle" className="scroll-mt-20">
        <FadeIn>
          <SectionHeader
            kicker="3대 자동화 도구"
            title="콘텐츠·이메일·SNS를 한 흐름으로."
            subtitle="홈페이지 운영에 필요한 3가지 자동화 도구를 제품 화면으로 확인하세요."
            action={
              <Link
                to="/features"
                className="inline-flex items-center gap-1.5 text-[14px] font-bold text-blue-600 hover:text-blue-700 whitespace-nowrap"
              >
                <span>기본 기능 전체 보기</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            }
          />

          <div className="mt-9">
            <AutomationFeatureCardsGrid />
          </div>

          <div className="mt-8">
            <IncludedZeroValueBanner variant="featured" />
          </div>
        </FadeIn>
      </Section>

      {/* SECTION 3 — 통합 운영 흐름 인터랙티브 시각화 */}
      <Section surface="white" containerSize="wide">
        <FadeIn>
          <SectionHeader
            kicker="통합 운영 구조"
            title="흩어진 도구 대신, 한 화면에서."
            subtitle="루틴·스텝메일·오토포스터의 4단계 운영 흐름을 탭으로 전환해 확인하세요."
          />

          <div className="mt-9">
            <UnifiedOperationsFlowVisual />
          </div>
        </FadeIn>
      </Section>

      {/* SECTION 4 — 자동 댓글 (댓글 분류 → AI 답변 초안 → 승인 게시) */}
      <Section id="auto-comment" surface="subtle" className="scroll-mt-20">
        <FadeIn>
          <SectionHeader
            kicker="자동 댓글 · 기본 제공"
            title="댓글 응대도, 놓치지 않게."
            subtitle="게시글 댓글을 AI가 분류하고 답변 초안을 준비합니다. 담당자는 승인만 하세요."
            action={
              <Button to="/features/auto-comment" variant="secondary" size="md">
                <span>자세히 보기</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            }
          />

          <div className="mt-9">
            <AutoCommentDemo />
          </div>

          <p className="mt-4 text-[12.5px] text-slate-500">
            추가 솔루션 구독료 0원 · 내 홈페이지 게시글 댓글 응대 전용 (외부 사이트 홍보 댓글 작성
            아님) · 승인 후 게시 원칙 · 플랫폼 연동 준비 중
          </p>
        </FadeIn>
      </Section>

      {/* SECTION 5 — 쉬운 홈페이지 수정 (수정 전/후 와이드 비주얼) */}
      <Section surface="white">
        <FadeIn>
          <SectionHeader
            kicker="쉬운 홈페이지 수정"
            title="수정하고 싶다면, 말로 요청하세요."
            subtitle="복잡한 편집기 대신 자연어로 요청하면 검수 후 안전하게 반영합니다."
            action={
              <Button to="/features/easy-edit" variant="secondary" size="md">
                <span>자세히 보기</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            }
          />

          <div className="mt-9">
            <EasyEditWideVisual />
          </div>

          <p className="mt-4 text-[12.5px] text-slate-500">
            월 운영관리 플랜 협의 포함 · 사전 검수 후 실서비스 반영 (DIY 직접 편집 방식이 아닙니다)
          </p>
        </FadeIn>
      </Section>

      {/* SECTION 6 — AI 기능 개발 (아이디어 입력 → 기능 미리보기) */}
      <Section surface="subtle">
        <FadeIn>
          <SectionHeader
            kicker="AI 기능 개발"
            title="필요한 기능도, AI와 함께."
            subtitle="견적 계산기·예약 폼·맞춤 필터를 AI 지원 개발과 엔지니어 검수로 구현합니다."
            action={
              <Button to="/features/ai-development" variant="secondary" size="md">
                <span>자세히 보기</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            }
          />

          <div className="mt-9">
            <AiDevPreviewVisual />
          </div>

          <p className="mt-4 text-[12.5px] text-slate-500">
            프로젝트별 맞춤 개발 별도 협의 · 요구사항 분석, AI 지원 프로토타입 구현, 전문 엔지니어
            보안·품질 검수 후 배포
          </p>
        </FadeIn>
      </Section>

      {/* SECTION 7 — 업종별 활용사례 (이미지 중심 컴팩트 카드) */}
      <Section surface="white">
        <FadeIn>
          <SectionHeader
            kicker="업종별 활용사례"
            title="업종마다 가장 알맞은 조합으로."
            subtitle="대표 업종별 홈페이지 구조와 자동화·기능 조합 예시입니다."
            action={
              <Link
                to="/use-cases"
                className="inline-flex items-center gap-1.5 text-[14px] font-bold text-blue-600 hover:text-blue-700 whitespace-nowrap"
              >
                <span>전체 활용사례 보기</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            }
          />

          <div className="mt-9 grid grid-cols-1 gap-5 md:grid-cols-2">
            {HOME_USE_CASES.map((item) => (
              <Link
                key={item.id}
                to="/use-cases"
                className="group flex flex-col overflow-hidden rounded-[16px] border border-slate-200 bg-white transition-[border-color,box-shadow] duration-150 hover:border-slate-300 hover:shadow-[var(--shadow-card-hover)]"
              >
                <EditorialImage
                  src={item.image}
                  alt={item.alt}
                  aspectClass="aspect-[16/9] w-full"
                  fallbackTitle={item.industry}
                  className="rounded-none border-x-0 border-t-0"
                />
                <div className="p-5 sm:p-6">
                  <p className="text-[12px] font-semibold text-blue-600">{item.industry}</p>
                  <h3 className="mt-1.5 text-[18px] font-semibold leading-snug tracking-[-0.02em] text-slate-950 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-[13.5px] text-slate-600">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </FadeIn>
      </Section>

      {/* SECTION 8 — 별도 전문 서비스 (메뉴형 쇼케이스) */}
      <Section surface="subtle">
        <FadeIn>
          <SectionHeader
            kicker="별도 전문 서비스"
            title="제작·운영부터 검색 마케팅까지."
            subtitle="ONOFF Builder 기본 기능과 별개로 목적에 맞는 전문 서비스를 선택 연계합니다."
            action={
              <Link
                to="/pricing"
                className="inline-flex items-center gap-1.5 text-[14px] font-bold text-blue-600 hover:text-blue-700 whitespace-nowrap"
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

      {/* SECTION 9 — 제작 상담 CTA (짙은 네이비) */}
      <section className="bg-slate-950 py-24 sm:py-28 lg:py-32 text-white">
        <Container>
          <FadeIn>
            <div className="mx-auto max-w-[740px] text-left sm:text-center">
              <p className="text-[12px] font-bold tracking-wider uppercase text-blue-400">
                ONOFF BUILDER 2.0
              </p>
              <h2 className="mt-4 text-[clamp(1.875rem,3.6vw,3rem)] font-extrabold leading-[1.18] tracking-tight text-white">
                홈페이지 제작부터 운영 자동화까지,
                <br />
                <span className="text-blue-400">우리 사업에 맞게</span> 시작해 보세요.
              </h2>
              <p className="mt-5 text-[16px] sm:text-[17px] leading-relaxed text-slate-300 sm:mx-auto max-w-[560px]">
                현재 바로 도입 가능한 범위와 향후 자동화 확장 구성을 상담에서 투명하게 정리해
                드립니다.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-start sm:justify-center gap-3">
                <Button to="/contact" size="lg">
                  <span>상담하기</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Link
                  to="/pricing"
                  className="inline-flex min-h-[50px] items-center justify-center rounded-lg border border-white/20 px-6 py-3 text-[15px] font-medium text-white hover:bg-white/10 transition-colors whitespace-nowrap shrink-0"
                >
                  요금안내 보기
                </Link>
              </div>
            </div>
          </FadeIn>
        </Container>
      </section>
    </>
  );
}
