import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  Bot,
  CalendarClock,
  Check,
  FileText,
  Globe2,
  Layers,
  Link2,
  Mail,
  MessageSquare,
  MonitorSmartphone,
  PenLine,
  Search,
  Settings2,
  Share2,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';
import {
  CORE_INCLUDED_TOOL_POLICY,
  OPERATIONAL_STATUS_META,
  SEPARATE_MARKETING_SERVICES,
  THREE_AUTOMATION_TOOLS,
  WEBSITE_BASE_OFFERINGS,
  type CoreCapabilitySlug,
} from '../../data/platformCapabilities';
import { DetailDisclosure } from '../ui/DetailDisclosure';

/* ========================================================================= */
/* 1. Three Distinct Automation UI Previews (~70% visual area per card)      */
/* ========================================================================= */

/** 01. 루틴 자동발행 — 콘텐츠 캘린더와 발행 상태 */
export function RoutinePreviewGraphic() {
  const days = [
    { day: '월', date: '12', active: false },
    { day: '화', date: '13', active: true },
    { day: '수', date: '14', active: false },
    { day: '목', date: '15', active: true },
    { day: '금', date: '16', active: false },
  ];

  return (
    <div
      aria-label="루틴 자동발행 콘텐츠 캘린더 시연 화면"
      className="flex h-full w-full flex-col justify-between p-4 sm:p-5"
    >
      <div className="flex items-center justify-between text-[11px]">
        <span className="flex items-center gap-1.5 font-semibold text-slate-950">
          <CalendarClock className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" />
          발행 캘린더
        </span>
        <span className="text-slate-400">시연 화면</span>
      </div>

      {/* Mini Weekly Calendar Strip */}
      <div className="mt-3 grid grid-cols-5 gap-1.5">
        {days.map((item) => (
          <div
            key={item.day}
            className={`flex flex-col items-center rounded-[10px] border py-2 text-center ${
              item.active
                ? 'border-[#2563EB]/30 bg-blue-50 text-blue-600'
                : 'border-slate-200 bg-white text-slate-500'
            }`}
          >
            <span className="text-[10px] font-medium">{item.day}</span>
            <span
              className={`mt-0.5 text-[12px] font-bold tabular-metrics ${
                item.active ? 'text-blue-600' : 'text-slate-950'
              }`}
            >
              {item.date}
            </span>
          </div>
        ))}
      </div>

      {/* Scheduled Publishing Rows */}
      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between gap-2 rounded-[10px] border border-slate-200 bg-white px-3 py-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <FileText className="h-3.5 w-3.5 shrink-0 text-blue-600" aria-hidden="true" />
            <span className="truncate text-[12px] font-medium text-slate-950">
              화 · 서비스 도입 가이드
            </span>
          </div>
          <span className="shrink-0 text-[11px] font-semibold text-blue-600">검수 완료</span>
        </div>

        <div className="flex items-center justify-between gap-2 rounded-[10px] border border-slate-200 bg-white px-3 py-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <FileText className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
            <span className="truncate text-[12px] font-medium text-slate-600">
              목 · 자주 묻는 운영 질문
            </span>
          </div>
          <span className="shrink-0 text-[11px] font-medium text-slate-500">예약 대기</span>
        </div>
      </div>
    </div>
  );
}

/** 02. 스텝메일 — 3~4단계 이메일 연결 흐름 */
export function StepmailPreviewGraphic() {
  const steps = [
    { code: 'D+0', label: '접수 확인 · 소개서 안내', active: true },
    { code: 'D+2', label: '업종별 활용 사례 요약', active: false },
    { code: 'D+5', label: '1:1 맞춤 상담 일정 제안', active: false },
  ];

  return (
    <div
      aria-label="스텝메일 단계별 이메일 연결 흐름 시연 화면"
      className="flex h-full w-full flex-col justify-between p-4 sm:p-5"
    >
      <div className="flex items-center justify-between text-[11px]">
        <span className="flex items-center gap-1.5 font-semibold text-slate-950">
          <Mail className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" />
          단계별 메일 시퀀스
        </span>
        <span className="text-slate-400">시연 화면</span>
      </div>

      {/* Trigger Node */}
      <div className="mt-3 rounded-[10px] border border-[#101828]/15 bg-slate-950 px-3 py-2 text-center text-[11.5px] font-medium text-white">
        홈페이지 문의 · 수신 동의 접수
      </div>

      {/* Connected 3-Step Flow */}
      <div className="relative mt-2.5 space-y-2 pl-4">
        <span
          aria-hidden="true"
          className="absolute top-1 bottom-2 left-[6px] w-px bg-[#D0D5DD]"
        />
        {steps.map((step) => (
          <div
            key={step.code}
            className={`relative flex items-center justify-between gap-2 rounded-[10px] border px-3 py-2 ${
              step.active
                ? 'border-[#2563EB]/30 bg-white shadow-[0_2px_8px_rgba(37,99,235,0.06)]'
                : 'border-slate-200 bg-white'
            }`}
          >
            <span
              aria-hidden="true"
              className={`absolute -left-[13px] h-2 w-2 rounded-full ${
                step.active ? 'bg-[#2563EB]' : 'bg-[#CBD5E1]'
              }`}
            />
            <div className="flex items-center gap-2 min-w-0">
              <span className="min-w-[28px] text-[11px] font-bold tabular-metrics text-blue-600">
                {step.code}
              </span>
              <span className="truncate text-[12px] font-medium text-slate-950">{step.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** 03. 오토포스터 — 홈페이지 게시글 → SNS 채널 미리보기 */
export function AutoposterPreviewGraphic() {
  const channels = [
    { name: 'Instagram', preview: '핵심 3줄 카드 요약', status: '검수' },
    { name: 'LinkedIn', preview: 'B2B 인사이트 + 원문 링크', status: '예약' },
    { name: 'Blog / SNS', preview: '소제목 요약 + 상담 연결', status: '대기' },
  ];

  return (
    <div
      aria-label="오토포스터 홈페이지 게시글 SNS 배포 시연 화면"
      className="flex h-full w-full flex-col justify-between p-4 sm:p-5"
    >
      <div className="flex items-center justify-between text-[11px]">
        <span className="flex items-center gap-1.5 font-semibold text-slate-950">
          <Share2 className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" />
          원문 → 채널 배포
        </span>
        <span className="text-slate-400">시연 화면</span>
      </div>

      {/* Source Website Post Card */}
      <div className="mt-3 flex items-center gap-3 rounded-[10px] border border-[#2563EB]/25 bg-white p-2.5">
        <div
          aria-hidden="true"
          className="h-10 w-12 shrink-0 rounded-[7px] bg-blue-50 flex items-center justify-center text-[10px] font-bold text-blue-600"
        >
          WEB
        </div>
        <div className="min-w-0">
          <p className="text-[10.5px] font-semibold text-blue-600">홈페이지 원본 글</p>
          <p className="truncate text-[12px] font-semibold text-slate-950">
            신규 서비스 안내 및 사례 정리
          </p>
        </div>
      </div>

      {/* Channel Preview Stack */}
      <div className="mt-2.5 space-y-1.5">
        {channels.map((ch) => (
          <div
            key={ch.name}
            className="flex items-center justify-between gap-2 rounded-[10px] border border-slate-200 bg-white px-3 py-2"
          >
            <div className="min-w-0">
              <span className="text-[11.5px] font-semibold text-slate-950">{ch.name}</span>
              <span className="mx-1.5 text-[#D0D5DD]" aria-hidden="true">
                ·
              </span>
              <span className="truncate text-[11px] text-slate-500">{ch.preview}</span>
            </div>
            <span className="shrink-0 text-[10.5px] font-medium text-blue-600">{ch.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const SHORT_BENEFIT_BY_SLUG: Record<string, string> = {
  routine: '정해진 주기에 맞춰 초안·검수·발행을 이어갑니다.',
  stepmail: '문의 고객에게 단계별 안내 메일을 연결합니다.',
  'sns-marketing': '홈페이지 글을 채널별 SNS 배포 흐름으로 잇습니다.',
};

function renderAutomationVisual(slug: CoreCapabilitySlug) {
  if (slug === 'routine') return <RoutinePreviewGraphic />;
  if (slug === 'stepmail') return <StepmailPreviewGraphic />;
  return <AutoposterPreviewGraphic />;
}

const AUTOMATION_CARD_THEME: Record<
  string,
  { icon: typeof CalendarClock; iconClass: string; visualClass: string; hoverClass: string }
> = {
  routine: {
    icon: CalendarClock,
    iconClass: 'bg-blue-50 text-blue-600 ring-[#BFDBFE]',
    visualClass: 'bg-gradient-to-br from-[#EFF6FF] via-[#F8FAFC] to-white',
    hoverClass: 'hover:border-[#93C5FD]',
  },
  stepmail: {
    icon: Mail,
    iconClass: 'bg-[#F0FDFA] text-[#0F766E] ring-[#99F6E4]',
    visualClass: 'bg-gradient-to-br from-[#F0FDFA] via-[#F8FAFC] to-white',
    hoverClass: 'hover:border-[#5EEAD4]',
  },
  'sns-marketing': {
    icon: Share2,
    iconClass: 'bg-[#F5F3FF] text-[#7C3AED] ring-[#DDD6FE]',
    visualClass: 'bg-gradient-to-br from-[#F5F3FF] via-[#F8FAFC] to-white',
    hoverClass: 'hover:border-[#C4B5FD]',
  },
};

export function AutomationFeatureCardsGrid({
  showSubscriptionZeroLabel = false,
}: {
  showSubscriptionZeroLabel?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {THREE_AUTOMATION_TOOLS.map((tool) => {
        const status = OPERATIONAL_STATUS_META[tool.operationalStatus];
        const isStepmailOrSns = tool.slug === 'stepmail' || tool.slug === 'sns-marketing';
        const theme = AUTOMATION_CARD_THEME[tool.slug] ?? AUTOMATION_CARD_THEME.routine;
        const ToolIcon = theme.icon;

        return (
          <Link
            key={tool.slug}
            to={tool.activeRoute}
            className={`group flex flex-col overflow-hidden rounded-[18px] border border-slate-200 bg-white transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,23,42,0.09)] ${theme.hoverClass}`}
          >
            {/* Visual UI Preview (~70% of card) */}
            <div className={`relative min-h-[240px] overflow-hidden border-b border-slate-200 ${theme.visualClass}`}>
              <span
                className={`absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-[12px] ring-1 ${theme.iconClass}`}
              >
                <ToolIcon className="h-5 w-5" aria-hidden="true" />
              </span>
              {renderAutomationVisual(tool.slug as CoreCapabilitySlug)}
            </div>

            {/* Concise Copy (~30% of card: Name + 1-line benefit + detail link) */}
            <div className="flex flex-1 flex-col justify-between gap-4 p-5 sm:p-6">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-[19px] font-bold tracking-[-0.02em] text-slate-950 group-hover:text-blue-600 transition-colors">
                    {tool.name}
                  </h3>
                  <span className="shrink-0 text-[11.5px] font-medium text-slate-500">
                    {status.shortLabel}
                  </span>
                </div>
                <p className="mt-1.5 text-[14px] leading-[1.55] text-slate-600">
                  {SHORT_BENEFIT_BY_SLUG[tool.slug] ?? tool.tagline}
                </p>
                {showSubscriptionZeroLabel && (
                  <p className="mt-2 text-[12.5px] font-semibold text-blue-600">
                    {isStepmailOrSns
                      ? CORE_INCLUDED_TOOL_POLICY.additionalSubscriptionZeroLabel
                      : CORE_INCLUDED_TOOL_POLICY.subscriptionFeeLabel}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-[#F2F4F7] pt-3.5 text-[13.5px] font-semibold text-slate-950 group-hover:text-blue-600 transition-colors">
                <span>자세히 보기</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

/* ========================================================================= */
/* 2. Big '0원' Included Value Banner (Clear Status + Pricing Link)          */
/* ========================================================================= */

export function IncludedZeroValueBanner({
  variant = 'featured',
}: {
  variant?: 'featured' | 'compact';
}) {
  if (variant === 'compact') {
    return (
      <div className="rounded-[16px] border border-slate-200 bg-white px-6 py-6 sm:px-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:gap-6">
          <div className="shrink-0">
            <span className="text-[40px] sm:text-[48px] font-bold leading-none tracking-[-0.04em] text-blue-600 tabular-metrics">
              0원
            </span>
          </div>
          <div>
            <p className="text-[17px] sm:text-[18px] font-bold tracking-[-0.02em] text-slate-950">
              3대 자동화 도구, 별도 솔루션 구독료 0원.
            </p>
            <p className="mt-1 text-[13.5px] leading-[1.55] text-slate-600">
              ONOFF Builder 기본 제공 · 현재 플랫폼 직접 연동은{' '}
              <span className="font-semibold text-slate-950">연동 준비 중</span> 상태입니다.
            </p>
          </div>
        </div>

        <Link
          to="/pricing"
          className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-blue-600 hover:text-blue-700 whitespace-nowrap shrink-0"
        >
          <span>비용 구분 · 요금 정책 보기</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="rounded-[18px] border border-slate-200 bg-white px-6 py-7 sm:px-9 sm:py-8 shadow-[var(--shadow-subtle)]">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
          {/* Dominant 0원 Metric */}
          <div className="lg:col-span-4 flex items-baseline gap-3">
            <span className="text-[clamp(3.25rem,6vw,4.5rem)] font-bold leading-none tracking-[-0.045em] text-blue-600 tabular-metrics">
              0원
            </span>
            <span className="text-[13px] font-semibold text-slate-500">
              ONOFF Builder
              <br />
              기본 제공
            </span>
          </div>

          {/* Core Headline + Readiness + Pricing Link */}
          <div className="lg:col-span-8 space-y-2.5 lg:border-l lg:border-slate-200 lg:pl-8">
            <p className="text-[20px] sm:text-[22px] font-bold leading-[1.3] tracking-[-0.025em] text-slate-950">
              3대 자동화 도구, 별도 솔루션 구독료 0원.
            </p>
            <p className="text-[14px] leading-[1.6] text-slate-600">
              루틴·스텝메일·오토포스터 자체 기능을 홈페이지 운영 흐름에 기본 포함합니다. 현재
              플랫폼 자동발행·내장 발송·외부 SNS API 직접 게시는{' '}
              <span className="font-semibold text-slate-950">연동 준비 중</span> 상태입니다.
            </p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 text-[13px]">
              <span className="text-slate-500">
                월 운영관리비 · 제3자 발송/API 실비 · 대행 · 맞춤 개발비 별도 구분
              </span>
              <Link
                to="/pricing"
                className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700 whitespace-nowrap"
              >
                <span>요금 정책 자세히 보기</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <DetailDisclosure
        label="제공 범위 및 별도 비용 구분 기준 보기"
        summary="별도 솔루션 구독료 0원 적용 기준과 월 운영관리비·외부 실비 구분"
      >
        <div className="space-y-2">
          <p>{CORE_INCLUDED_TOOL_POLICY.managementFeeDistinction}</p>
          <p>{CORE_INCLUDED_TOOL_POLICY.costSeparationNotice}</p>
        </div>
      </DetailDisclosure>
    </div>
  );
}

/* ========================================================================= */
/* 3. Two-Column Visual Comparison: Scattered vs Unified                     */
/* ========================================================================= */

type UnifiedScenarioId = 'inquiry' | 'content' | 'edit';

interface UnifiedScenario {
  id: UnifiedScenarioId;
  tabLabel: string;
  triggerLabel: string;
  scatteredSteps: { tool: string; friction: string }[];
  scatteredSummary: string;
  activeModules: string[];
  unifiedFlow: [string, string, string];
  unifiedSummary: string;
}

const UNIFIED_SCENARIOS: UnifiedScenario[] = [
  {
    id: 'inquiry',
    tabLabel: '문의 접수 후',
    triggerLabel: '홈페이지 상담 문의 접수',
    scatteredSteps: [
      { tool: '외주 홈페이지 폼', friction: '메일함으로만 알림 도착' },
      { tool: '별도 엑셀·CRM', friction: '담당자가 수동 복사·정리' },
      { tool: '외부 이메일 솔루션', friction: '별도 구독·수동 리스트 연동' },
    ],
    scatteredSummary: '문의와 후속 이메일이 끊겨 응대 누락과 중복 구독료가 발생합니다.',
    activeModules: ['스텝메일'],
    unifiedFlow: ['홈페이지 문의 접수', '스텝메일 단계 안내 (0원)', '상담·미팅 전환'],
    unifiedSummary: '홈페이지 문의가 스텝메일 흐름으로 이어져 상담 전까지 놓치지 않습니다.',
  },
  {
    id: 'content',
    tabLabel: '콘텐츠·SNS 발행',
    triggerLabel: '신규 서비스·소식 발행',
    scatteredSteps: [
      { tool: '문서 작성 툴', friction: '초안·수정본 파일 분산' },
      { tool: '관리자 페이지', friction: '홈페이지 게시 후 작업 종료' },
      { tool: '별도 SNS 예약 툴', friction: '채널별 복사·별도 요금제' },
    ],
    scatteredSummary: '같은 원문을 여러 도구에 옮겨 적느라 정기 발행이 쉽게 중단됩니다.',
    activeModules: ['루틴 자동발행', '오토포스터'],
    unifiedFlow: ['루틴 캘린더·검수', '홈페이지 원문 게시', '오토포스터 SNS 배포'],
    unifiedSummary: '홈페이지 원문 하나로 콘텐츠 축적과 멀티 채널 확장을 함께 운영합니다.',
  },
  {
    id: 'edit',
    tabLabel: '화면 문구 수정',
    triggerLabel: '배너·버튼 문구 변경 필요',
    scatteredSteps: [
      { tool: '외주 제작사 연락', friction: '견적·일정 확인 대기' },
      { tool: '작업 요청서 정리', friction: '캡처·위치 설명 반복' },
      { tool: '수정 반영 확인', friction: '소소한 수정도 며칠 지연' },
    ],
    scatteredSummary: '작은 문구 변경에도 외주 커뮤니케이션과 대기 비용이 반복됩니다.',
    activeModules: ['쉬운 수정'],
    unifiedFlow: ['자연어 수정 요청', '미리보기 확인·검수', '운영팀 확인 후 반영'],
    unifiedSummary: '말하듯 수정 요청하고 미리보기로 확인한 뒤 안전하게 사이트에 반영합니다.',
  },
];

export function ScatteredVsUnifiedVisual() {
  const [scenarioId, setScenarioId] = useState<UnifiedScenarioId>('inquiry');
  const scenario =
    UNIFIED_SCENARIOS.find((item) => item.id === scenarioId) ?? UNIFIED_SCENARIOS[0];

  const unifiedModules = [
    { name: '루틴 자동발행', desc: '캘린더 · 검수' },
    { name: '스텝메일', desc: '문의 후속 연결' },
    { name: '오토포스터', desc: '원문 → SNS' },
    { name: '쉬운 수정', desc: '자연어 요청 반영' },
  ];

  return (
    <div className="space-y-4">
      {/* Interactive Scenario Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-[14px] border border-slate-200 bg-slate-50 p-2.5 sm:px-4">
        <div
          role="tablist"
          aria-label="통합 운영 비교 시나리오 선택"
          className="grid grid-cols-3 gap-1.5 sm:flex sm:items-center"
        >
          {UNIFIED_SCENARIOS.map((item) => {
            const active = item.id === scenarioId;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setScenarioId(item.id)}
                className={`min-h-[38px] rounded-[10px] px-3 sm:px-4 py-1.5 text-[12.5px] sm:text-[13px] font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-[#101828] text-white shadow-[var(--shadow-subtle)]'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-950'
                }`}
              >
                {item.tabLabel}
              </button>
            );
          })}
        </div>
        <p className="px-1 text-[12px] text-slate-500">
          시나리오: <strong className="font-semibold text-slate-950">{scenario.triggerLabel}</strong>
        </p>
      </div>

      {/* Side-by-Side Architecture Flow Comparison */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Left: Scattered */}
        <figure
          role="region"
          aria-label="여러 도구에 흩어진 운영 구조 도식"
          className="flex flex-col justify-between rounded-[18px] border border-slate-200 bg-slate-50 p-5 sm:p-7"
        >
          <div>
            <div className="flex items-center justify-between gap-2">
              <p className="text-[15px] font-bold text-slate-600">여러 도구에 흩어진 운영</p>
              <span className="text-[12px] text-slate-400">분산 · 수동 연결</span>
            </div>

            <div className="mt-5 space-y-2.5">
              {scenario.scatteredSteps.map((step, idx) => (
                <div key={step.tool}>
                  <div className="flex items-center justify-between gap-3 rounded-[12px] border border-dashed border-slate-300 bg-white/85 px-4 py-3">
                    <div className="min-w-0">
                      <p className="text-[13.5px] font-semibold text-[#344054]">{step.tool}</p>
                      <p className="mt-0.5 text-[12px] text-slate-500">{step.friction}</p>
                    </div>
                    <span className="shrink-0 text-[11px] font-medium text-slate-400">
                      별도 관리 {idx + 1}
                    </span>
                  </div>
                  {idx < scenario.scatteredSteps.length - 1 && (
                    <div
                      aria-hidden="true"
                      className="flex items-center justify-center py-1 text-[11px] text-slate-400"
                    >
                      <span className="border-l border-dashed border-slate-300 pl-2">
                        수동 이동 · 단절
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <figcaption className="mt-5 border-t border-slate-200 pt-4 text-[13px] text-slate-500">
            {scenario.scatteredSummary}
          </figcaption>
        </figure>

        {/* Right: Unified */}
        <figure
          role="region"
          aria-label="ONOFF Builder 한 화면 통합 운영 구조 도식"
          className="flex flex-col justify-between rounded-[18px] border border-[#2563EB]/30 bg-white p-5 sm:p-7 shadow-[var(--shadow-stage)]"
        >
          <div>
            <div className="flex items-center justify-between gap-2">
              <p className="text-[15px] font-bold text-slate-950">한 화면의 통합 운영</p>
              <span className="text-[12px] font-semibold text-blue-600">ONOFF Builder</span>
            </div>

            <div className="mt-5 rounded-[14px] border border-slate-200 bg-slate-50 p-4">
              {/* Hub Bar */}
              <div className="flex items-center justify-between rounded-[10px] bg-slate-950 px-4 py-2.5 text-white">
                <span className="flex items-center gap-2 text-[13px] font-semibold">
                  <Layers className="h-4 w-4 text-[#93C5FD]" aria-hidden="true" />
                  관리형 공식 홈페이지
                </span>
                <span className="text-[11px] text-slate-300">단일 운영 기준</span>
              </div>

              {/* 4 Integrated Modules (Active Highlighted for Selected Scenario) */}
              <div className="mt-3 grid grid-cols-2 gap-2">
                {unifiedModules.map((mod) => {
                  const isHighlighted = scenario.activeModules.includes(mod.name);
                  return (
                    <div
                      key={mod.name}
                      className={`rounded-[10px] border px-3 py-2.5 transition-colors ${
                        isHighlighted
                          ? 'border-[#2563EB] bg-blue-50/70'
                          : 'border-slate-200 bg-white opacity-75'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1.5">
                        <p
                          className={`text-[12.5px] font-semibold ${
                            isHighlighted ? 'text-blue-600' : 'text-slate-950'
                          }`}
                        >
                          {mod.name}
                        </p>
                        {isHighlighted && (
                          <Check className="h-3.5 w-3.5 shrink-0 text-blue-600" aria-hidden="true" />
                        )}
                      </div>
                      <p className="mt-0.5 text-[11px] text-slate-500">{mod.desc}</p>
                    </div>
                  );
                })}
              </div>

              {/* Connected 3-Step Flow Strip */}
              <div className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-3 border-t border-slate-200 pt-3">
                {scenario.unifiedFlow.map((node, idx) => (
                  <div
                    key={node}
                    className="flex items-center justify-between sm:justify-center gap-1.5 rounded-[8px] border border-[#2563EB]/20 bg-white px-2.5 py-2 text-[11.5px] font-semibold text-slate-950"
                  >
                    <span className="truncate">{node}</span>
                    {idx < 2 && (
                      <ArrowRight
                        className="h-3 w-3 shrink-0 text-blue-600 sm:hidden"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <figcaption className="mt-5 border-t border-slate-200 pt-4 text-[13px] font-medium text-slate-950">
            {scenario.unifiedSummary}
          </figcaption>
        </figure>
      </div>
    </div>
  );
}

/* ========================================================================= */
/* 4. Easy Edit Wide Before / After Visual Stage                             */
/* ========================================================================= */

export function EasyEditWideVisual({ compact = false }: { compact?: boolean }) {
  return (
    <figure
      role="region"
      aria-label="쉬운 홈페이지 수정 전후 비교 시연 화면"
      className="overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-[var(--shadow-stage)]"
    >
      {/* Top Request Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-slate-50 px-5 py-3.5">
        <div className="flex items-center gap-2 min-w-0">
          <MessageSquare className="h-4 w-4 shrink-0 text-blue-600" aria-hidden="true" />
          <p className="truncate text-[13px] font-medium text-slate-950">
            “메인 제목을 신규 서비스 기준으로 바꾸고 상담 버튼을 강조해 주세요.”
          </p>
        </div>
        <span className="shrink-0 text-[11.5px] font-medium text-slate-400">시연 화면</span>
      </div>

      {/* Before / After Side-by-Side Preview */}
      <div
        className={`grid grid-cols-1 gap-4 bg-slate-50/50 p-5 sm:p-6 ${
          compact ? '' : 'md:grid-cols-2 md:gap-6 md:p-7'
        }`}
      >
        {/* BEFORE */}
        <div className="rounded-[14px] border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between border-b border-[#F2F4F7] pb-2.5 text-[11.5px]">
            <span className="font-semibold text-slate-500">수정 전</span>
            <span className="text-slate-400">기존 화면</span>
          </div>
          <div className="mt-4 space-y-2.5 opacity-75">
            <p className="text-[11px] font-medium text-slate-400">STANDARD CORP</p>
            <p className="text-[17px] font-bold leading-[1.3] text-slate-600">
              기업 소개 홈페이지입니다.
            </p>
            <p className="text-[12.5px] text-slate-500">
              회사 연혁과 일반 문의를 확인하실 수 있습니다.
            </p>
            <div className="pt-1.5">
              <span className="inline-block rounded-[8px] border border-slate-300 px-3 py-1.5 text-[11.5px] font-medium text-slate-500">
                문의하기
              </span>
            </div>
          </div>
        </div>

        {/* AFTER */}
        <div className="rounded-[14px] border border-[#2563EB]/30 bg-white p-5 shadow-[0_6px_20px_rgba(37,99,235,0.05)]">
          <div className="flex items-center justify-between border-b border-[#F2F4F7] pb-2.5 text-[11.5px]">
            <span className="font-semibold text-blue-600">수정 후 · 검수 반영</span>
            <span className="flex items-center gap-1 text-blue-600">
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
              반응형 유지
            </span>
          </div>
          <div className="mt-4 space-y-2.5">
            <p className="text-[11px] font-semibold text-blue-600">NEW SERVICE LAUNCH</p>
            <p className="text-[17px] font-bold leading-[1.3] text-slate-950">
              통합 운영까지 연결되는 공식 웹사이트
            </p>
            <p className="text-[12.5px] text-slate-600">
              신규 서비스 구성과 도입 일정을 바로 상담해 보세요.
            </p>
            <div className="pt-1.5">
              <span className="inline-block rounded-[8px] bg-[#2563EB] px-3.5 py-1.5 text-[11.5px] font-semibold text-white">
                신규 서비스 상담 신청
              </span>
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
}

/* ========================================================================= */
/* 5. AI Feature Development: Idea Input → Interactive Feature Preview       */
/* ========================================================================= */

type AiPresetKey = 'quote' | 'booking' | 'filter';

const AI_PRESETS: Record<
  AiPresetKey,
  {
    label: string;
    prompt: string;
    previewTitle: string;
    rows: { key: string; value: string }[];
    ctaLabel: string;
  }
> = {
  quote: {
    label: '견적 계산기',
    prompt:
      '“업종과 페이지 규모를 선택하면 상담 전에 예상 구성과 항목이 정리되는 견적 계산기를 추가해 주세요.”',
    previewTitle: '맞춤 견적 구성 미리보기',
    rows: [
      { key: '업종 유형', value: '기업 · B2B 소개' },
      { key: '페이지 규모', value: '기본 8~10페이지 + 상담 폼' },
      { key: '연계 기능', value: '자동화 기본 구조 포함' },
    ],
    ctaLabel: '선택 조건으로 견적 상담',
  },
  booking: {
    label: '예약 폼',
    prompt:
      '“고객이 원하는 날짜와 상담 분야를 선택해 바로 예약 신청할 수 있는 화면을 홈페이지에 넣어 주세요.”',
    previewTitle: '방문 · 화상 상담 예약 화면',
    rows: [
      { key: '상담 분야', value: '신규 구축 · 리뉴얼' },
      { key: '희망 일정', value: '평일 오전 10:00 / 오후 14:00' },
      { key: '접수 방식', value: '필수 항목 검증 후 담당자 전달' },
    ],
    ctaLabel: '상담 일정 예약하기',
  },
  filter: {
    label: '맞춤 필터',
    prompt:
      '“시공 사례와 제품 사양을 업종·면적·예산 조건별로 빠르게 찾는 필터 검색 화면을 만들어 주세요.”',
    previewTitle: '포트폴리오 조건 필터 탐색',
    rows: [
      { key: '카테고리', value: '오피스 · 병원 · 리테일' },
      { key: '정렬 기준', value: '최신 사례 · 면적별 보기' },
      { key: '상세 연결', value: '사례별 바로 견적 문의 연동' },
    ],
    ctaLabel: '조건 일치 사례 보기',
  },
};

export function AiDevPreviewVisual({ compact = false }: { compact?: boolean }) {
  const [selectedPreset, setSelectedPreset] = useState<AiPresetKey>('quote');
  const current = AI_PRESETS[selectedPreset];

  return (
    <figure
      role="region"
      aria-label="AI 기능 개발 아이디어 입력 및 기능 미리보기 시연 화면"
      className="overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-[var(--shadow-stage)]"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-slate-50 px-5 py-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" />
          <span className="text-[12.5px] font-semibold text-slate-950">
            아이디어 입력 → 기능 미리보기
          </span>
        </div>
        <span className="text-[11.5px] font-medium text-slate-400">시연 화면</span>
      </div>

      <div
        className={`grid grid-cols-1 gap-5 p-5 sm:p-6 ${
          compact ? '' : 'lg:grid-cols-12 lg:items-stretch lg:p-7'
        }`}
      >
        {/* Left: Idea Prompt Input */}
        <div
          className={`${
            compact ? '' : 'lg:col-span-5'
          } flex flex-col justify-between rounded-[14px] border border-slate-200 bg-slate-50 p-4 sm:p-5`}
        >
          <div>
            <p className="text-[11.5px] font-semibold text-blue-600">아이디어 입력</p>
            <p className="mt-2.5 text-[13.5px] font-medium leading-[1.6] text-slate-950">
              {current.prompt}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5 border-t border-slate-200 pt-3.5">
            {(Object.keys(AI_PRESETS) as AiPresetKey[]).map((key) => {
              const active = selectedPreset === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedPreset(key)}
                  className={`min-h-[32px] cursor-pointer rounded-[8px] px-3 py-1 text-[12px] font-medium transition-colors ${
                    active
                      ? 'bg-[#101828] text-white'
                      : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-950'
                  }`}
                >
                  {AI_PRESETS[key].label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Generated Functional UI Preview */}
        <div
          className={`${
            compact ? '' : 'lg:col-span-7'
          } flex flex-col justify-between rounded-[14px] border border-[#2563EB]/25 bg-white p-4 sm:p-5`}
        >
          <div>
            <div className="flex items-center justify-between border-b border-[#F2F4F7] pb-3">
              <span className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-950">
                <SlidersHorizontal className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" />
                {current.previewTitle}
              </span>
              <span className="text-[11px] font-medium text-blue-600">프로토타입 예시</span>
            </div>

            <div className="mt-3 divide-y divide-[#F2F4F7]">
              {current.rows.map((row) => (
                <div
                  key={row.key}
                  className="flex items-center justify-between gap-3 py-2.5 text-[12.5px]"
                >
                  <span className="text-slate-500">{row.key}</span>
                  <span className="font-semibold text-slate-950 text-right">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#F2F4F7] pt-3.5">
            <span className="text-[11.5px] text-slate-500">엔지니어 보안·품질 검수 후 배포</span>
            <span className="shrink-0 rounded-[8px] bg-[#2563EB] px-3.5 py-1.5 text-[11.5px] font-medium text-white">
              {current.ctaLabel}
            </span>
          </div>
        </div>
      </div>
    </figure>
  );
}

/* ========================================================================= */
/* 6. Clean Menu-Style Showcase for Separate Professional Services           */
/* ========================================================================= */

export function SeparateServicesShowcase() {
  const serviceIcons: Record<string, typeof MonitorSmartphone> = {
    website: MonitorSmartphone,
    management: Settings2,
    seo: Search,
    geo: Bot,
    backlink: Link2,
    traffic: Activity,
    domain: Globe2,
    content: PenLine,
  };

  return (
    <div className="space-y-4">
      {/* Base Managed Website Offerings (2-col compact row) */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {WEBSITE_BASE_OFFERINGS.map((svc) => (
          <Link
            key={svc.slug}
            to={svc.activeRoute}
            className="group flex items-center justify-between gap-4 rounded-[16px] border border-slate-200 bg-gradient-to-br from-[#F8FAFC] to-white px-5 py-5 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-[#BFDBFE] hover:shadow-[0_14px_35px_rgba(15,23,42,0.07)]"
          >
            <div className="flex min-w-0 items-center gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[13px] bg-blue-50 text-blue-600 ring-1 ring-[#DBEAFE]">
                {(() => {
                  const Icon = serviceIcons[svc.slug] ?? MonitorSmartphone;
                  return <Icon className="h-5 w-5" aria-hidden="true" />;
                })()}
              </span>
              <div className="min-w-0">
                <p className="text-[11.5px] font-semibold text-blue-600">홈페이지 제작 · 운영</p>
                <p className="mt-0.5 text-[16px] font-semibold text-slate-950 group-hover:text-blue-600 transition-colors">
                  {svc.name}
                </p>
                <p className="mt-0.5 truncate text-[13px] text-slate-500">{svc.subtitle}</p>
              </div>
            </div>
            <ArrowRight
              className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-blue-600 transition-colors"
              aria-hidden="true"
            />
          </Link>
        ))}
      </div>

      {/* Separate Marketing Services (Clean 3-col menu list) */}
      <div className="overflow-hidden rounded-[16px] border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-slate-50 px-5 py-3">
          <span className="text-[12.5px] font-semibold text-slate-950">
            별도 전문 마케팅 서비스
          </span>
          <span className="text-[12px] text-slate-500">
            ONOFF Builder 기본 기능과 별도 계약 · 선택 연계
          </span>
        </div>

        <div className="grid grid-cols-1 divide-y divide-[#EAECF0] sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-3">
          {SEPARATE_MARKETING_SERVICES.map((svc, idx) => (
            <Link
              key={svc.slug}
              to={svc.activeRoute}
              className={[
                'group flex items-center justify-between gap-3 px-5 py-4 transition-colors duration-150 hover:bg-slate-50',
                idx >= 2 ? 'sm:border-t sm:border-slate-200' : '',
                idx >= 3 ? 'lg:border-t lg:border-slate-200' : 'lg:border-t-0',
                idx % 2 === 1 ? 'sm:border-l sm:border-slate-200' : '',
                idx % 3 === 0 ? 'lg:border-l-0' : 'lg:border-l lg:border-slate-200',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[11px] bg-slate-50 text-slate-600 ring-1 ring-[#EAECF0] transition-colors group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:ring-[#DBEAFE]">
                  {(() => {
                    const Icon = serviceIcons[svc.slug] ?? Sparkles;
                    return <Icon className="h-[18px] w-[18px]" aria-hidden="true" />;
                  })()}
                </span>
                <div className="min-w-0">
                  <p className="text-[15px] font-semibold text-slate-950 group-hover:text-blue-600 transition-colors">
                    {svc.name}
                  </p>
                  <p className="mt-0.5 truncate text-[12.5px] text-slate-500">{svc.subtitle}</p>
                </div>
              </div>
              <ArrowRight
                className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-blue-600 transition-colors"
                aria-hidden="true"
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
