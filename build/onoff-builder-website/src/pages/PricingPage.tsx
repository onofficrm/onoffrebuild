import { useRef, useState, type KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers, Plus, SlidersHorizontal, Wrench } from 'lucide-react';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { DetailDisclosure } from '../components/ui/DetailDisclosure';
import { FadeIn } from '../components/ui/FadeIn';
import {
  DisplayHeading,
  LeadText,
  SectionHeading,
  SectionKicker,
} from '../components/ui/Typography';
import { ConsultationFaqSection } from '../components/shared/ConsultationFaqSection';

interface CostPillar {
  number: string;
  type: string;
  title: string;
  summary: string;
  includes: string[];
  quoteNote: string;
  ctaLabel: string;
  ctaTo: string;
  highlighted?: boolean;
}

const INCLUDED_POLICY_TOOLS = [
  {
    name: '루틴 자동발행',
    path: '/features/routine',
    policyLabel: 'ONOFF Builder 기본 제공',
    feeLabel: '별도 솔루션 구독료 0원',
    readinessLabel: '직접 자동발행 연동 준비 중',
    summary:
      '홈페이지 콘텐츠 기획·초안·검수·예약 흐름을 ONOFF Builder 기본 제공 운영 도구로 통합합니다.',
  },
  {
    name: '스텝메일',
    path: '/features/step-mail',
    policyLabel: 'ONOFF Builder 기본 제공',
    feeLabel: '추가 라이선스 구독료 0원',
    readinessLabel: '내장 발송·수신거부 연동 준비 중',
    summary:
      '별도 이메일 솔루션 구독 없이 홈페이지 문의와 연결된 단계별 이메일을 운영합니다. 제3자 발송 실비와 사용량 정책은 구분합니다.',
  },
  {
    name: '오토포스터 (SNS 마케팅)',
    path: '/features/sns-poster',
    policyLabel: 'ONOFF Builder 기본 제공',
    feeLabel: '추가 라이선스 구독료 0원',
    readinessLabel: '외부 SNS API 연동 준비 중',
    summary:
      '별도 포스터 소프트웨어 구독 없이 홈페이지 게시글과 SNS 배포 흐름을 통합 관리합니다. 미검증 외부 채널은 활성 기능으로 표기하지 않습니다.',
  },
  {
    name: '자동 댓글',
    path: '/features/auto-comment',
    policyLabel: 'ONOFF Builder 기본 제공',
    feeLabel: '추가 솔루션 구독료 0원',
    readinessLabel: '댓글 감지·승인 게시 연동 준비 중',
    summary:
      '별도 댓글 관리 솔루션 없이 홈페이지 게시글 댓글을 분류하고 AI 답변 초안을 담당자 승인 후 게시합니다. AI 사용량 초과분과 검수 대행은 구분합니다.',
  },
];

const FOUR_COST_BOUNDARIES = [
  {
    number: '01',
    title: '실제 사용 가능 여부 (운영 검증 구분)',
    status: '현행 가용 범위 투명 공개',
    description:
      '홈페이지 제작, 월 운영관리, 자연어 기반 쉬운 수정 요청은 현재 정상 운영 중입니다. 반면 루틴·스텝메일·오토포스터(SNS 마케팅)·자동 댓글의 플랫폼 직접 자동 연동은 현재 연동 준비 중 상태이며, 시점별 실제 도입 가능 범위를 상담에서 구분해 안내합니다.',
  },
  {
    number: '02',
    title: '발송량 · 사용량 정책',
    status: '별도 정책 · 협의 구분',
    description:
      '자체 도구 구독료가 0원이더라도 스텝메일 대량 발송 건수, 대용량 콘텐츠 처리 등 기준 사용량을 초과하는 구간은 확정 사용량 정책 또는 규모별 협의 기준에 따라 별도 구분될 수 있습니다.',
  },
  {
    number: '03',
    title: '제3자 이메일 발송 실비 · 유료 SNS API · 운영 대행',
    status: '실비 · 대행 별도 부담',
    description:
      '제3자 이메일 발송 실비, 외부 SNS 플랫폼의 유료 API 비용, 채널·콘텐츠 전담 운영 대행, 도메인 등록·갱신비, 온라인 결제(PG) 수수료 등은 기본 제공 소프트웨어 범위에 포함되지 않으며 별도 구분됩니다.',
  },
  {
    number: '04',
    title: 'AI 지원 맞춤 기능 개발 비용',
    status: '프로젝트별 개별 견적',
    description:
      '견적 계산기, 예약 신청, 회원 전용 자료실, 쇼핑몰·결제, 다국어, 외부 시스템 연동 등 AI 기능 개발은 기본 제공 범위가 아니며, 요구사항과 기술 난이도에 따라 사전 범위 협의 및 개별 견적으로 산정합니다.',
  },
];

const COST_PILLARS: CostPillar[] = [
  {
    number: '01',
    type: '초기 구축 비용',
    title: '홈페이지 초기 제작비',
    summary:
      '사업 목적에 맞는 기획과 디자인, 반응형 웹사이트 구현, 초기 배포까지 홈페이지를 처음 완성하는 데 소요되는 일회성 구축 비용입니다.',
    includes: [
      '사업 구조 기반 정보 설계(IA) 및 맞춤 UI 디자인',
      'PC·태블릿·모바일 반응형 프런트엔드 구현',
      '회사·서비스 소개, 기본 문의 폼, SEO 기본 구조 적용',
      '도메인 연결, HTTPS 보안(SSL) 및 실서비스 오픈',
    ],
    quoteNote: '페이지 구성 규모, 자료 준비 상태, 디자인 난이도에 따라 개별 산정',
    ctaLabel: '제작 견적 상담',
    ctaTo: '/contact?service=website',
  },
  {
    number: '02',
    type: '월 유지 · 관리 비용',
    title: '월 홈페이지 운영관리비',
    summary:
      '오픈 이후 호스팅·보안(SSL)·장애 점검·쉬운 홈페이지 수정 요청 처리 등 홈페이지 자체를 지속적으로 유지·관리하기 위한 월 운영 비용입니다. 기본 제공 도구(스텝메일·오토포스터·루틴)의 별도 소프트웨어 구독료(0원)와는 서로 다른 비용 항목입니다.',
    includes: [
      '호스팅·배포 환경 유지 및 기본 기술·SSL 보안 점검',
      '자연어 기반 쉬운 홈페이지 수정 요청(협의 범위 내 일상 수정)',
      '신규 페이지 확장 및 운영 고도화 사전 상담 지원',
      'ONOFF Builder 기본 제공 도구(별도 구독료 0원 · 연동 준비 중) 연계 기반 유지',
    ],
    quoteNote: '사이트 규모, 예상 수정 빈도, 월 운영 지원 범위에 따라 개별 산정',
    ctaLabel: '운영관리 상담',
    ctaTo: '/contact?service=management',
    highlighted: true,
  },
  {
    number: '03',
    type: '별도 서비스 · 맞춤 개발 · 실비',
    title: '맞춤 개발 · 별도 전문 서비스 · 외부 실비',
    summary:
      '비즈니스 특화 기능 개발, 전문 검색·유입 마케팅, 제3자 이메일 발송 실비·유료 SNS API·운영 대행처럼 개별 범위가 명확한 항목을 필요에 따라 별도 구성합니다.',
    includes: [
      'AI 기능 개발 (견적 계산기 · 예약 · 회원 전용 자료실 · 다국어)',
      '별도 전문 서비스 (SEO · GEO · BACKLINK · TRAFFIC · DOMAIN · AI 콘텐츠)',
      '제3자 이메일 발송 실비, 유료 SNS API, 대행 및 기준 초과 사용량 정책 구간',
      '기존 운영 시스템(GNUBoard 등) 데이터·외부 API 연동 개발',
    ],
    quoteNote: '사전 범위·기술 검토 후 필요한 기능과 서비스만 별도 개별 견적 산정',
    ctaLabel: '맞춤 개발 · 마케팅 상담',
    ctaTo: '/contact?service=ai-dev',
  },
];

type ComparisonTab = 'scope' | 'policy' | 'operation';

const COMPARISON_TABS: { id: ComparisonTab; label: string; subtitle: string }[] = [
  {
    id: 'scope',
    label: '비용 3영역 비교',
    subtitle:
      '홈페이지 초기 제작비, 월 홈페이지 운영관리비(기본 도구 별도 구독료 0원과 구분), 맞춤 개발·별도 전문 서비스의 범위를 비교합니다.',
  },
  {
    id: 'policy',
    label: '기본 제공 vs 별도 비용',
    subtitle:
      'ONOFF Builder 기본 제공(별도 솔루션 구독료 0원) 영역과 실제 연동 상태, 외부 실비·대행·사용량·맞춤 개발비의 경계를 정리했습니다.',
  },
  {
    id: 'operation',
    label: '운영 방식 비교',
    subtitle:
      '초기 제작 중심, 월 운영관리+쉬운 수정, 통합 자동화·전문 마케팅 연계 시의 실무 차이를 비교합니다.',
  },
];

const COMPARISON_DATA: Record<
  ComparisonTab,
  {
    col1Header: string;
    col2Header: string;
    col3Header: string;
    rows: { item: string; col1: string; col2: string; col3: string }[];
  }
> = {
  scope: {
    col1Header: '01. 홈페이지 초기 제작비',
    col2Header: '02. 월 홈페이지 운영관리비',
    col3Header: '03. 맞춤 개발 · 별도 서비스 · 실비',
    rows: [
      {
        item: '발생 시점',
        col1: '최초 구축 또는 리뉴얼 시 산정',
        col2: '오픈 이후 홈페이지 지속 관리 이용 시 산정',
        col3: '맞춤 기능 개발·마케팅·외부 실비 발생 시 별도 산정',
      },
      {
        item: '핵심 성격',
        col1: '브랜드에 맞는 공식 홈페이지 구축 비용',
        col2: '호스팅·보안·쉬운 수정 등 홈페이지 유지관리비 (기본 도구 별도 구독료 0원과 별개 항목)',
        col3: '업종 특화 기능 구현, 전문 검색·유입 확장 및 외부 실비',
      },
      {
        item: '주요 포함 영역',
        col1: '기획·디자인·반응형 구현·기본 SEO·오픈',
        col2: '호스팅·SSL·쉬운 수정 · 기본 제공 도구(별도 구독료 0원) 연계 환경 관리',
        col3: 'AI 기능 개발·SEO·GEO·백링크·트래픽·제3자 발송/유료 SNS API 실비·대행',
      },
      {
        item: '견적 결정 요인',
        col1: '페이지 수, 정보 구조, 보유 자료 수준',
        col2: '수정 빈도, 관리 규모, 월 운영 지원 범위',
        col3: '기능 복잡도, 외부 연동, 사용량·대행·마케팅 캠페인 범위',
      },
    ],
  },
  policy: {
    col1Header: 'ONOFF Builder 기본 제공',
    col2Header: '현행 운영 상태 (투명 구분)',
    col3Header: '별도 비용 · 협의 구분',
    rows: [
      {
        item: '루틴 자동발행',
        col1: 'ONOFF Builder 기본 제공 · 별도 솔루션 구독료 0원',
        col2: '플랫폼 직접 자동발행 연동 준비 중 (현행: 기획·검수 연계 상담)',
        col3: '대량 원고 제작 대행(AI 콘텐츠 별도 서비스) 및 외부 도구 실비',
      },
      {
        item: '스텝메일',
        col1: 'ONOFF Builder 기본 제공 · 추가 라이선스 구독료 0원',
        col2: '내장 발송·수신거부·발신 인증 연동 준비 중',
        col3: '제3자 이메일 발송 실비, 기준 초과 사용량 정책, 운영 대행 및 맞춤 개발비',
      },
      {
        item: '오토포스터 (SNS 마케팅)',
        col1: 'ONOFF Builder 기본 제공 · 추가 라이선스 구독료 0원',
        col2: '외부 SNS API 직접 게시 연동 준비 중 (미검증 채널 비활성)',
        col3: '유료 SNS API 실비, 채널별 연결 승인, 전담 운영 대행 및 맞춤 개발비',
      },
      {
        item: '쉬운 수정 · AI 기능 개발',
        col1: '일상 수정(쉬운 수정)은 월 홈페이지 운영관리비 플랜 협의 포함',
        col2: '자연어 요청 → AI 분석·수정 → 검수 배포 정상 운영 중',
        col3: '견적 계산기·예약·회원 자료실 등 AI 기능 개발은 별도 견적',
      },
    ],
  },
  operation: {
    col1Header: '초기 제작 중심',
    col2Header: '제작 + 월 운영관리 · 쉬운 수정',
    col3Header: '통합 플랫폼 + 전문 확장',
    rows: [
      {
        item: '문구·배너 수정',
        col1: '필요 시 건별 협의 또는 자체 처리 검토',
        col2: '자연어로 요청 → AI 분석·수정 → 미리보기 검수 후 배포',
        col3: '일상 수정과 신규 기능·랜딩 보완을 유기적으로 연계',
      },
      {
        item: '자동화 도구 연계',
        col1: '기본 홈페이지 구축 및 문의 폼 중심',
        col2: '루틴·스텝메일·오토포스터 기본 제공(별도 구독료 0원)에 따라 순차 연계 검토',
        col3: '현행 운영·외부 연계 상담부터 향후 플랫폼 통합 연동까지 확장',
      },
      {
        item: '신규 기능 · 마케팅',
        col1: '추가 필요 시 별도 프로젝트 상담',
        col2: '기존 디자인 시스템에 맞춰 확장 범위 사전 협의',
        col3: 'AI 기능 개발 + SEO·GEO·BACKLINK 등 별도 전문 서비스 결합',
      },
      {
        item: '권장 조직 유형',
        col1: '정보 변경이 적은 기본 공식 소개 사이트',
        col2: '내부 웹 담당자 없이 꾸준히 관리할 기업',
        col3: '홈페이지 하나로 운영·자동화·검색 성장을 함께 연결할 기업',
      },
    ],
  },
};

export function PricingPage() {
  const [activeTab, setActiveTab] = useState<ComparisonTab>('scope');
  const comparisonTabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const currentTabMeta =
    COMPARISON_TABS.find((t) => t.id === activeTab) ?? COMPARISON_TABS[0];
  const currentTable = COMPARISON_DATA[activeTab];

  const handleComparisonTabKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    currentIdx: number
  ) => {
    let nextIdx: number | null = null;
    if (event.key === 'ArrowRight') nextIdx = (currentIdx + 1) % COMPARISON_TABS.length;
    else if (event.key === 'ArrowLeft')
      nextIdx = (currentIdx - 1 + COMPARISON_TABS.length) % COMPARISON_TABS.length;
    else if (event.key === 'Home') nextIdx = 0;
    else if (event.key === 'End') nextIdx = COMPARISON_TABS.length - 1;

    if (nextIdx !== null) {
      event.preventDefault();
      setActiveTab(COMPARISON_TABS[nextIdx].id);
      comparisonTabRefs.current[nextIdx]?.focus();
    }
  };

  return (
    <>
      {/* 1. Hero — 간단한 3영역 요금 구조 시각화 */}
      <section className="bg-white pt-10 pb-14 sm:pt-14 sm:pb-16 lg:pt-16 lg:pb-20">
        <Container>
          <FadeIn immediate>
            <div className="max-w-[740px]">
              <SectionKicker>요금안내 · 상품 정책</SectionKicker>
              <DisplayHeading className="mt-3">
                홈페이지 제작·운영에,
                <br className="hidden sm:inline" /> 기본 도구를 더합니다.
              </DisplayHeading>
              <LeadText className="mt-3.5 max-w-[600px]">
                초기 제작비·월 운영관리비(별도 견적), 기본 도구(자체 구독료 0원), 선택 비용을
                세 영역으로 명확히 구분해 안내합니다.
              </LeadText>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Button to="/contact" size="lg" className="w-full sm:w-auto">
                  <span>견적 상담하기</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button
                  href="#pricing-policies"
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  자세한 약관 · 정책 보기
                </Button>
              </div>
            </div>

            {/* Simple 3-Zone Visual Pricing Architecture */}
            <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-5">
              {/* Zone 1: 홈페이지 제작·운영 (유료 · 별도 견적) */}
              <div className="flex flex-col justify-between rounded-[18px] border border-slate-200 bg-white p-6 shadow-[var(--shadow-subtle)]">
                <div>
                  <div className="flex items-center justify-between gap-2 text-[12px]">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-slate-950">
                      <Layers className="h-4 w-4 text-slate-600" aria-hidden="true" />
                      01 · 홈페이지 제작·운영
                    </span>
                    <span className="font-semibold text-slate-950">별도 견적</span>
                  </div>

                  <p className="mt-4 text-[22px] font-bold leading-tight tracking-[-0.02em] text-slate-950">
                    초기 제작비 / 월 운영관리비
                  </p>
                  <p className="mt-1.5 text-[13.5px] leading-[1.55] text-slate-600">
                    맞춤 구축, 호스팅·SSL 보안, 자연어 쉬운 수정(협의 범위)
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-2 text-[12.5px]">
                    <div className="rounded-[10px] border border-slate-200 bg-slate-50 px-3 py-2.5">
                      <p className="font-semibold text-slate-950">초기 제작비</p>
                      <p className="mt-0.5 text-[11.5px] text-slate-500">구축 규모별 견적</p>
                    </div>
                    <div className="rounded-[10px] border border-slate-200 bg-slate-50 px-3 py-2.5">
                      <p className="font-semibold text-slate-950">월 운영관리비</p>
                      <p className="mt-0.5 text-[11.5px] text-slate-500">유지·수정 월 관리</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-3.5 text-[12.5px]">
                  <span className="text-slate-500">현재 정상 운영 중</span>
                  <Link
                    to="/contact?service=website"
                    className="inline-flex items-center gap-1 font-semibold text-slate-950 hover:text-blue-600 transition-colors whitespace-nowrap"
                  >
                    <span>견적 상담</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>

              {/* Zone 2: 기본 도구 (자체 구독료 0원, 플랫폼 직접 연동 준비 중) */}
              <div className="relative flex flex-col justify-between rounded-[18px] border border-[#2563EB]/35 bg-blue-50/45 p-6 shadow-[var(--shadow-stage)]">
                <span
                  aria-hidden="true"
                  className="hidden lg:flex absolute -left-[18px] top-1/2 -translate-y-1/2 z-10 h-7 w-7 items-center justify-center rounded-full border border-[#2563EB]/30 bg-white text-blue-600"
                >
                  <Plus className="h-3.5 w-3.5" />
                </span>

                <div>
                  <div className="flex items-center justify-between gap-2 text-[12px]">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-blue-600">
                      <Wrench className="h-4 w-4 text-blue-600" aria-hidden="true" />
                      02 · 기본 도구
                    </span>
                    <span className="font-medium text-slate-600">직접 연동 준비 중</span>
                  </div>

                  <div className="mt-4 flex items-baseline gap-2.5">
                    <span className="text-[34px] sm:text-[38px] font-bold leading-none tracking-[-0.03em] tabular-metrics text-blue-600">
                      0원
                    </span>
                    <span className="text-[15px] font-bold text-slate-950">자체 구독료</span>
                  </div>
                  <p className="mt-1.5 text-[13px] text-slate-600">
                    플랫폼 직접 연동 준비 중 · 월 운영관리비와 별개 항목
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-1.5 text-center">
                    {[
                      { label: '루틴', to: '/features/routine' },
                      { label: '스텝메일', to: '/features/step-mail' },
                      { label: '오토포스터', to: '/features/sns-poster' },
                      { label: '자동 댓글', to: '/features/auto-comment' },
                    ].map((tool) => (
                      <Link
                        key={tool.label}
                        to={tool.to}
                        className="rounded-[10px] border border-[#2563EB]/20 bg-white px-2 py-2.5 text-[12.5px] font-semibold text-slate-950 hover:border-[#2563EB] hover:text-blue-600 transition-colors"
                      >
                        {tool.label}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-[#2563EB]/15 pt-3.5 text-[12.5px]">
                  <span className="text-slate-600">ONOFF Builder 기본 제공</span>
                  <Link
                    to="/features"
                    className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700 transition-colors whitespace-nowrap"
                  >
                    <span>기능 보기</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>

              {/* Zone 3: 선택 비용 */}
              <div className="flex flex-col justify-between rounded-[18px] border border-slate-200 bg-slate-50 p-6">
                <div>
                  <div className="flex items-center justify-between gap-2 text-[12px]">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-slate-600">
                      <SlidersHorizontal className="h-4 w-4 text-slate-500" aria-hidden="true" />
                      03 · 선택 비용
                    </span>
                    <span className="font-medium text-slate-500">필요 시 별도</span>
                  </div>

                  <p className="mt-4 text-[22px] font-bold leading-tight tracking-[-0.02em] text-slate-950">
                    외부 실비 · 대행 · 맞춤 개발
                  </p>
                  <p className="mt-1.5 text-[13.5px] leading-[1.55] text-slate-600">
                    기본 도구 범위를 넘는 실비·대행·기능 개발은 별도 구분
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-2 text-[12px] font-semibold text-[#344054]">
                    <span className="rounded-[10px] border border-dashed border-slate-300 bg-white px-3 py-2.5">
                      외부 발송 실비
                    </span>
                    <span className="rounded-[10px] border border-dashed border-slate-300 bg-white px-3 py-2.5">
                      유료 SNS API
                    </span>
                    <span className="rounded-[10px] border border-dashed border-slate-300 bg-white px-3 py-2.5">
                      전담 운영 대행
                    </span>
                    <span className="rounded-[10px] border border-dashed border-slate-300 bg-white px-3 py-2.5">
                      맞춤 기능 개발
                    </span>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-3.5 text-[12.5px]">
                  <span className="text-slate-500">임의 가격·할인 미표기</span>
                  <Link
                    to="/contact?service=ai-dev"
                    className="inline-flex items-center gap-1 font-semibold text-slate-950 hover:text-blue-600 transition-colors whitespace-nowrap"
                  >
                    <span>맞춤 상담</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Clear Non-Free Anti-Misunderstanding Banner */}
            <div className="mt-5 rounded-[14px] border border-slate-200 bg-slate-950 px-5 py-3.5 text-[13px] leading-[1.6] text-slate-200">
              <strong className="font-semibold text-white">안내:</strong> 전체 홈페이지 무료 제공이
              아닙니다. <strong className="font-semibold text-[#93C5FD]">홈페이지 초기 제작비와 월 운영관리비는 별도 견적</strong>
              이며, 기본 도구(루틴·스텝메일·오토포스터·자동 댓글)의 자체 솔루션 구독료만 0원입니다.
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* 2. Collapsible Detailed Policies, Terms & Comparison Matrix */}
      <section
        id="pricing-policies"
        className="scroll-mt-20 border-t border-slate-200 bg-slate-50 py-14 sm:py-20"
      >
        <Container>
          <FadeIn>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div className="max-w-[680px]">
                <SectionKicker>자세한 약관 · 정책 · 비교 기준</SectionKicker>
                <SectionHeading className="mt-2.5">
                  필요한 세부 정책만 펼쳐서 확인하세요
                </SectionHeading>
                <LeadText className="mt-2.5">
                  기본 도구 운영 상태, 4가지 별도 비용 약관, 3영역 상세 구성과 비교표를 접힘형으로
                  정리했습니다.
                </LeadText>
              </div>
              <Link
                to="/features"
                className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-blue-600 hover:text-blue-700 whitespace-nowrap shrink-0"
              >
                <span>기본 기능 전체 보기</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="mt-8 space-y-4">
              {/* Disclosure 1: 4가지 별도 비용·약관 기준 + 기본 도구별 현재 상태 */}
              <DetailDisclosure
                label="01. 자세한 요금 정책 · 약관 및 4가지 별도 비용 구분 기준"
                summary="실제 운영 검증 상태, 발송량·사용량 정책, 제3자 발송 실비·유료 SNS API·운영 대행, AI 맞춤 개발비 구분"
              >
                <div className="space-y-6">
                  {/* Included Tools Readiness Summary */}
                  <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
                    {INCLUDED_POLICY_TOOLS.map((tool, idx) => (
                      <Link
                        key={tool.name}
                        to={tool.path}
                        className="group flex flex-col justify-between rounded-[14px] border border-slate-200 bg-slate-50 p-4 transition-colors hover:border-slate-300 hover:bg-white"
                      >
                        <div>
                          <div className="flex flex-wrap items-center justify-between gap-2 text-[11.5px]">
                            <span className="font-semibold tabular-metrics text-blue-600">
                              0{idx + 1} · {tool.feeLabel}
                            </span>
                            <span className="text-slate-500">{tool.readinessLabel}</span>
                          </div>
                          <p className="mt-2 text-[15.5px] font-bold text-slate-950 group-hover:text-blue-600 transition-colors">
                            {tool.name}
                          </p>
                          <p className="mt-1 text-[13px] leading-[1.55] text-slate-600">
                            {tool.summary}
                          </p>
                        </div>
                        <span className="mt-3 inline-flex items-center gap-1 text-[12.5px] font-semibold text-slate-950 group-hover:text-blue-600">
                          <span>상세 보기</span>
                          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </span>
                      </Link>
                    ))}
                  </div>

                  {/* 4 Explicit Boundaries */}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 border-t border-slate-200 pt-5">
                    {FOUR_COST_BOUNDARIES.map((item) => (
                      <div
                        key={item.number}
                        className="rounded-[12px] border border-slate-200 bg-slate-50 p-4"
                      >
                        <div className="flex items-center justify-between gap-2 text-[12px]">
                          <span className="font-semibold tabular-metrics text-blue-600">
                            {item.number}
                          </span>
                          <span className="font-medium text-slate-500">{item.status}</span>
                        </div>
                        <h3 className="mt-1.5 text-[14.5px] font-semibold text-slate-950">
                          {item.title}
                        </h3>
                        <p className="mt-1.5 text-[13px] leading-[1.6] text-slate-600">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </DetailDisclosure>

              {/* Disclosure 2: 3가지 비용 구성 세부 항목 */}
              <DetailDisclosure
                label="02. 항목별 상세 견적 구성 (초기 제작비 · 월 운영관리비 · 선택 비용)"
                summary="각 비용 항목에 포함되는 실무 범위와 개별 견적 산정 기준 안내"
              >
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                  {COST_PILLARS.map((pillar) => (
                    <div
                      key={pillar.number}
                      className={`flex flex-col justify-between rounded-[16px] border bg-white p-5 sm:p-6 ${
                        pillar.highlighted
                          ? 'border-[#2563EB]/40 shadow-[var(--shadow-subtle)]'
                          : 'border-slate-200'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between text-[12px]">
                          <span
                            className={`font-semibold tabular-metrics ${
                              pillar.highlighted ? 'text-blue-600' : 'text-slate-500'
                            }`}
                          >
                            {pillar.number} · {pillar.type}
                          </span>
                          <span className="text-slate-500">개별 견적</span>
                        </div>

                        <h3 className="mt-3 text-[18px] font-bold tracking-[-0.02em] text-slate-950">
                          {pillar.title}
                        </h3>
                        <p className="mt-2 text-[13px] leading-[1.6] text-slate-600">
                          {pillar.summary}
                        </p>

                        <ul className="mt-4 space-y-2 border-t border-slate-200 pt-4 text-[13px] leading-[1.55] text-slate-950">
                          {pillar.includes.map((line, idx) => (
                            <li key={line} className="flex items-start gap-2">
                              <span className="mt-0.5 text-[11px] font-semibold tabular-metrics text-blue-600">
                                0{idx + 1}
                              </span>
                              <span>{line}</span>
                            </li>
                          ))}
                        </ul>

                        <p className="mt-4 rounded-[10px] border border-slate-200 bg-slate-50 p-3 text-[12px] leading-[1.55] text-slate-600">
                          <strong className="font-semibold text-slate-950">견적 기준: </strong>
                          {pillar.quoteNote}
                        </p>
                      </div>

                      <div className="mt-5">
                        <Button
                          to={pillar.ctaTo}
                          variant={pillar.highlighted ? 'primary' : 'secondary'}
                          size="md"
                          className="w-full"
                        >
                          <span>{pillar.ctaLabel}</span>
                          <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </DetailDisclosure>

              {/* Disclosure 3: Interactive Comparison Matrix */}
              <DetailDisclosure
                label="03. 서비스 범위 · 기본 제공 vs 별도 비용 · 운영 방식 상세 비교표"
                summary="비용 3영역, 기본 제공 도구별 운영 상태, 초기 제작·운영관리·통합 플랫폼 운영 방식 비교"
              >
                <div className="space-y-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-[13px] text-slate-600">{currentTabMeta.subtitle}</p>
                    <div
                      role="tablist"
                      aria-label="비용 및 서비스 범위 비교 탭"
                      className="inline-flex flex-wrap items-center gap-1 rounded-[12px] border border-slate-200 bg-slate-50 p-1 shrink-0"
                    >
                      {COMPARISON_TABS.map((tab, idx) => {
                        const selected = activeTab === tab.id;
                        return (
                          <button
                            key={tab.id}
                            id={`pricing-compare-tab-${tab.id}`}
                            ref={(el) => {
                              comparisonTabRefs.current[idx] = el;
                            }}
                            type="button"
                            role="tab"
                            tabIndex={selected ? 0 : -1}
                            aria-selected={selected}
                            aria-controls={`pricing-compare-panel-${tab.id}`}
                            onClick={() => setActiveTab(tab.id)}
                            onKeyDown={(e) => handleComparisonTabKeyDown(e, idx)}
                            className={`min-h-[40px] rounded-[8px] px-3 py-1.5 text-[12.5px] font-semibold whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
                              selected
                                ? 'bg-[#101828] text-white'
                                : 'text-slate-600 hover:text-slate-950'
                            }`}
                          >
                            {tab.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Desktop Comparison Matrix */}
                  <div
                    id={`pricing-compare-panel-${activeTab}`}
                    role="tabpanel"
                    aria-labelledby={`pricing-compare-tab-${activeTab}`}
                  >
                    <div className="hidden md:block overflow-hidden rounded-[14px] border border-slate-200 bg-white">
                      <div className="grid grid-cols-12 border-b border-slate-200 bg-slate-50 px-5 py-3.5 text-[12.5px] font-semibold">
                        <div className="col-span-3 text-slate-500">비교 항목</div>
                        <div className="col-span-3 text-slate-950">{currentTable.col1Header}</div>
                        <div className="col-span-3 text-blue-600">{currentTable.col2Header}</div>
                        <div className="col-span-3 text-slate-950">{currentTable.col3Header}</div>
                      </div>
                      <div className="divide-y divide-[#EAECF0]">
                        {currentTable.rows.map((row) => (
                          <div
                            key={row.item}
                            className="grid grid-cols-12 gap-4 px-5 py-3.5 text-[13px] leading-[1.6]"
                          >
                            <div className="col-span-3 font-semibold text-slate-950">{row.item}</div>
                            <div className="col-span-3 text-slate-600">{row.col1}</div>
                            <div className="col-span-3 font-medium text-slate-950">{row.col2}</div>
                            <div className="col-span-3 text-slate-600">{row.col3}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Mobile Stacked Comparison Cards */}
                    <div className="space-y-3 md:hidden">
                      {currentTable.rows.map((row) => (
                        <div
                          key={row.item}
                          className="rounded-[12px] border border-slate-200 bg-slate-50 p-4 space-y-2.5"
                        >
                          <p className="text-[14px] font-bold text-slate-950 border-b border-slate-200 pb-2">
                            {row.item}
                          </p>
                          <div className="space-y-2 text-[13px]">
                            <div>
                              <p className="text-[11.5px] font-semibold text-slate-500">
                                {currentTable.col1Header}
                              </p>
                              <p className="mt-0.5 leading-[1.55] text-slate-600">{row.col1}</p>
                            </div>
                            <div>
                              <p className="text-[11.5px] font-semibold text-blue-600">
                                {currentTable.col2Header}
                              </p>
                              <p className="mt-0.5 leading-[1.55] font-medium text-slate-950">
                                {row.col2}
                              </p>
                            </div>
                            <div>
                              <p className="text-[11.5px] font-semibold text-slate-500">
                                {currentTable.col3Header}
                              </p>
                              <p className="mt-0.5 leading-[1.55] text-slate-600">{row.col3}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </DetailDisclosure>
            </div>

            {/* Related Internal Links Strip */}
            <div className="mt-8 rounded-[16px] border border-slate-200 bg-white p-5 sm:p-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <p className="text-[13.5px] leading-[1.6] text-slate-600">
                <span className="font-semibold text-slate-950">개별 견적 안내 · </span>
                사업 유형, 페이지 규모, 월 운영관리 범위, 자동화 연계 및 맞춤 개발 필요성을 확인해
                항목별 견적안을 안내합니다.
              </p>
              <div className="flex flex-wrap items-center gap-4 shrink-0">
                <Link
                  to="/features/easy-edit"
                  className="inline-flex items-center gap-1 text-[13.5px] font-semibold text-slate-950 hover:text-blue-600 whitespace-nowrap"
                >
                  <span>쉬운 홈페이지 수정</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
                <Link
                  to="/features/ai-development"
                  className="inline-flex items-center gap-1 text-[13.5px] font-semibold text-blue-600 hover:text-blue-700 whitespace-nowrap"
                >
                  <span>AI 기능 개발 보기</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* 5. Comprehensive FAQ */}
      <ConsultationFaqSection bgClass="bg-white" />

      {/* 6. Deep Navy Closing CTA */}
      <section className="bg-slate-950 py-20 sm:py-24 text-white">
        <Container>
          <FadeIn>
            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <div className="max-w-[600px]">
                <p className="text-[13px] font-semibold tracking-[0.02em] text-[#93C5FD]">
                  ONOFF BUILDER 개별 견적
                </p>
                <h2 className="mt-3 text-[clamp(1.75rem,3.2vw,2.5rem)] font-bold leading-[1.22] tracking-[-0.025em] text-white">
                  필요한 범위만 정확하게 담아
                  <br />
                  맞춤 견적을 받아보세요.
                </h2>
                <p className="mt-3.5 text-[15.5px] leading-[1.6] text-[#CBD5E1]">
                  초기 제작비, 월 운영관리, 기본 도구 도입 계획, 맞춤 개발과 별도 전문 서비스 중
                  필요한 조합을 상담으로 정리합니다.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Button to="/contact" size="lg" className="w-full sm:w-auto">
                  <span>상담하기</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </FadeIn>
        </Container>
      </section>
    </>
  );
}
