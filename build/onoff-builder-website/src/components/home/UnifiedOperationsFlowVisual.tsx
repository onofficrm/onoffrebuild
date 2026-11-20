import { useRef, useState, type KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Globe,
  Inbox,
  Mail,
  Send,
  Share2,
  SlidersHorizontal,
  Sparkles,
  UserCheck,
  type LucideIcon,
} from 'lucide-react';

type FlowTabId = 'routine' | 'stepmail' | 'autoposter';

interface FlowStep {
  number: string;
  title: string;
  shortDesc: string;
  icon: LucideIcon;
}

interface FlowTabConfig {
  id: FlowTabId;
  label: string;
  tabIcon: LucideIcon;
  detailLabel: string;
  detailTo: string;
  workspacePath: string;
  statusNote: string;
  steps: [FlowStep, FlowStep, FlowStep, FlowStep];
}

const FLOW_TABS: FlowTabConfig[] = [
  {
    id: 'routine',
    label: '루틴 자동발행',
    tabIcon: CalendarClock,
    detailLabel: '루틴 자동발행 자세히 보기',
    detailTo: '/features/routine',
    workspacePath: 'onoff.workspace / routine',
    statusNote: '시연 화면 · 실제 자동발행 미수행 · 연동 준비 중',
    steps: [
      {
        number: '01',
        title: '주제 설정',
        shortDesc: '월간 핵심 키워드·일정 등록',
        icon: CalendarClock,
      },
      {
        number: '02',
        title: 'AI 초안 작성',
        shortDesc: '브랜드 톤 기반 원고 생성',
        icon: Sparkles,
      },
      {
        number: '03',
        title: '담당자 검수',
        shortDesc: '문구·구성 확인 후 승인',
        icon: ClipboardCheck,
      },
      {
        number: '04',
        title: '예약 · 발행 현황',
        shortDesc: '캘린더 일정별 상태 관리',
        icon: CheckCircle2,
      },
    ],
  },
  {
    id: 'stepmail',
    label: '스텝메일',
    tabIcon: Mail,
    detailLabel: '스텝메일 자세히 보기',
    detailTo: '/features/step-mail',
    workspacePath: 'onoff.workspace / step-mail',
    statusNote: '시연 화면 · 실제 메일 발송 미수행 · 연동 준비 중',
    steps: [
      {
        number: '01',
        title: '고객 문의 접수',
        shortDesc: '홈페이지 폼 유입 자동 기록',
        icon: Inbox,
      },
      {
        number: '02',
        title: '환영 메일 대기',
        shortDesc: '접수 직후 기본 안내 준비',
        icon: Mail,
      },
      {
        number: '03',
        title: '단계별 안내',
        shortDesc: 'D+2 · D+5 사례·자료 연결',
        icon: Send,
      },
      {
        number: '04',
        title: '상담 CTA 연결',
        shortDesc: '미팅·견적 페이지로 전환',
        icon: UserCheck,
      },
    ],
  },
  {
    id: 'autoposter',
    label: '오토포스터',
    tabIcon: Share2,
    detailLabel: '오토포스터 자세히 보기',
    detailTo: '/features/sns-poster',
    workspacePath: 'onoff.workspace / auto-poster',
    statusNote: '시연 화면 · 실제 SNS 게시 미수행 · 연동 준비 중',
    steps: [
      {
        number: '01',
        title: '원문 작성',
        shortDesc: '홈페이지 소식·사례 등록',
        icon: FileText,
      },
      {
        number: '02',
        title: '채널별 요약',
        shortDesc: '채널 규격에 맞춘 문구 정리',
        icon: SlidersHorizontal,
      },
      {
        number: '03',
        title: '검수 · 예약',
        shortDesc: '링크·발행 일정 최종 확인',
        icon: CalendarClock,
      },
      {
        number: '04',
        title: '배포 상태 확인',
        shortDesc: '채널별 연동·대기 상태 추적',
        icon: Share2,
      },
    ],
  },
];

function RoutineDashboardPreview({ activeStep }: { activeStep: number }) {
  const calendarDays = [
    { day: '월', date: '13', shortLabel: '주제', label: '주제 등록', stepMatch: 0 },
    { day: '화', date: '14', shortLabel: '초안', label: '초안 작성', stepMatch: 1 },
    { day: '수', date: '15', shortLabel: '검수', label: '검수 대기', stepMatch: 2 },
    { day: '목', date: '16', shortLabel: '예약', label: '예약 대기', stepMatch: 3 },
    { day: '금', date: '17', shortLabel: '예정', label: '예정 일정', stepMatch: 3 },
  ];

  const queueItems = [
    {
      title: '기업 홈페이지 리뉴얼 전 체크리스트 5가지',
      date: '04.14',
      state: 'AI 초안 완료',
      stepMatch: 1,
    },
    {
      title: '문의 전환을 높이는 상담 폼 설계 기준',
      date: '04.15',
      state: '담당자 검수 대기',
      stepMatch: 2,
    },
    {
      title: '검색 노출을 위한 서비스 소개 페이지 구조',
      date: '04.16',
      state: '예약 대기 (시연)',
      stepMatch: 3,
    },
  ];

  const stepHints = [
    '월간 핵심 키워드를 등록하면 주간 캘린더에 발행 슬롯이 배치됩니다.',
    '홈페이지 문체에 맞춰 AI가 초안과 소제목 구조를 먼저 정리합니다.',
    '담당자가 문구와 이미지를 확인해 승인해야 다음 단계로 넘어갑니다.',
    '승인된 원고는 캘린더 예약 대기열에서 일정별 상태로 관리됩니다.',
  ];

  return (
    <div className="space-y-4">
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-[14px] font-bold text-slate-950">콘텐츠 루틴 캘린더</p>
          <p className="text-[12px] text-slate-500">2026년 4월 3주차 · 시연 데이터</p>
        </div>
        <div className="flex items-center gap-2.5 text-[12px] tabular-metrics text-slate-600">
          <span>주제 4</span>
          <span aria-hidden="true" className="text-[#D0D5DD]">
            ·
          </span>
          <span>검수 대기 1</span>
          <span aria-hidden="true" className="text-[#D0D5DD]">
            ·
          </span>
          <span className="font-semibold text-blue-600">예약 2</span>
        </div>
      </div>

      {/* Weekly Calendar Strip */}
      <div className="grid grid-cols-5 gap-1 sm:gap-2">
        {calendarDays.map((item) => {
          const highlighted = item.stepMatch === activeStep;
          return (
            <div
              key={item.date}
              className={`rounded-[10px] border p-1.5 sm:p-3 transition-colors ${
                highlighted
                  ? 'border-[#2563EB] bg-blue-50/75'
                  : 'border-slate-200 bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between text-[10.5px] sm:text-[11px] text-slate-500">
                <span>{item.day}</span>
                <span
                  className={`font-semibold tabular-metrics ${
                    highlighted ? 'text-blue-600' : 'text-slate-950'
                  }`}
                >
                  {item.date}
                </span>
              </div>
              <p
                className={`mt-1.5 sm:mt-2 truncate text-[10.5px] sm:text-[11.5px] font-semibold ${
                  highlighted ? 'text-blue-600' : 'text-slate-600'
                }`}
              >
                <span className="sm:hidden">{item.shortLabel}</span>
                <span className="hidden sm:inline">{item.label}</span>
              </p>
            </div>
          );
        })}
      </div>

      {/* Editorial Queue List */}
      <div className="divide-y divide-[#EAECF0] rounded-[12px] border border-slate-200 bg-white">
        {queueItems.map((row) => {
          const highlighted = row.stepMatch === activeStep || (activeStep === 0 && row.stepMatch === 1);
          return (
            <div
              key={row.title}
              className={`flex items-center justify-between gap-3 px-3.5 py-3 transition-colors ${
                highlighted ? 'bg-blue-50/45' : 'bg-white'
              }`}
            >
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-slate-950">{row.title}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2.5 text-[11.5px] tabular-metrics">
                <span className="hidden sm:inline text-slate-500">{row.date}</span>
                <span
                  className={`font-semibold ${
                    highlighted ? 'text-blue-600' : 'text-slate-600'
                  }`}
                >
                  {row.state}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Step Context Bar */}
      <div className="rounded-[10px] bg-slate-50 px-3.5 py-2.5 text-[12.5px] text-[#344054]">
        {stepHints[activeStep]}
      </div>
    </div>
  );
}

function StepMailDashboardPreview({ activeStep }: { activeStep: number }) {
  const sequenceNodes = [
    {
      timing: 'D+0',
      label: '문의 접수',
      subject: '[접수 확인] 홈페이지 제작 상담 요청이 등록되었습니다',
      body: '고객 문의 항목과 업종 정보를 자동으로 분류해 시나리오를 시작합니다.',
      cta: '접수 내역 확인',
    },
    {
      timing: 'D+0',
      label: '환영 메일',
      subject: '안녕하세요, 요청하신 ONOFF Builder 소개 자료입니다',
      body: '문의 직후 브랜드 소개서와 진행 절차 요약을 누락 없이 전달합니다.',
      cta: '소개서 보기',
    },
    {
      timing: 'D+2',
      label: '사례 안내',
      subject: '비슷한 업종은 홈페이지를 이렇게 운영하고 있습니다',
      body: '업종별 활용 사례와 자동화 구성 예시를 단계적으로 안내합니다.',
      cta: '활용사례 보기',
    },
    {
      timing: 'D+5',
      label: '상담 CTA',
      subject: '맞춤 구성안 확인을 위한 15분 상담을 예약해 보세요',
      body: '관심이 이어진 고객을 상담 일정 예약과 견적 페이지로 연결합니다.',
      cta: '상담 일정 잡기',
    },
  ];

  const currentNode = sequenceNodes[activeStep] ?? sequenceNodes[0];

  return (
    <div className="space-y-4">
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-[14px] font-bold text-slate-950">신규 문의 후속 시퀀스</p>
          <p className="text-[12px] text-slate-500">4단계 이메일 흐름 · 실제 발송 미수행</p>
        </div>
        <span className="text-[12px] font-semibold text-blue-600">구독료 0원 기본 제공</span>
      </div>

      {/* Horizontal 4-Node Sequence Flow (2x2 on 360/390px, 4-col on sm+) */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {sequenceNodes.map((node, idx) => {
          const isCurrent = idx === activeStep;
          const isPassed = idx < activeStep;
          return (
            <div
              key={node.label}
              className={`rounded-[10px] border p-2.5 sm:p-3 transition-colors ${
                isCurrent
                  ? 'border-[#2563EB] bg-blue-50/75'
                  : isPassed
                    ? 'border-slate-300 bg-white'
                    : 'border-slate-200 bg-slate-50'
              }`}
            >
              <p
                className={`text-[11px] font-semibold tabular-metrics ${
                  isCurrent ? 'text-blue-600' : 'text-slate-500'
                }`}
              >
                {node.timing}
              </p>
              <p
                className={`mt-1 truncate text-[12px] font-semibold ${
                  isCurrent ? 'text-slate-950' : 'text-slate-600'
                }`}
              >
                {node.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Active Email Preview Card */}
      <div className="rounded-[12px] border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-2.5 text-[12px]">
          <span className="font-semibold text-blue-600">
            단계 0{activeStep + 1} · {currentNode.timing} {currentNode.label}
          </span>
          <span className="text-slate-500">시연 미리보기</span>
        </div>
        <p className="mt-3 truncate text-[13.5px] font-bold text-slate-950">
          {currentNode.subject}
        </p>
        <p className="mt-1 truncate text-[12.5px] text-slate-600">{currentNode.body}</p>
        <div className="mt-3.5 flex items-center justify-between gap-2 border-t border-[#F2F4F7] pt-3">
          <span className="inline-flex items-center gap-1.5 rounded-[8px] bg-[#101828] px-3 py-1.5 text-[12px] font-semibold text-white">
            <span>{currentNode.cta}</span>
            <ArrowRight className="h-3 w-3" aria-hidden="true" />
          </span>
          <span className="text-[11.5px] text-slate-500">발송 엔진 연동 준비 중</span>
        </div>
      </div>
    </div>
  );
}

function AutoPosterDashboardPreview({ activeStep }: { activeStep: number }) {
  const channels = [
    {
      name: 'Instagram',
      summary: '핵심 요약 3줄 + 홈페이지 링크 카드 구성',
      slot: '화 10:00 예정',
      status: '연동 준비 중',
    },
    {
      name: 'Naver Blog',
      summary: '원문 구조 유지 + 대표 이미지·상담 배너 포함',
      slot: '화 14:00 예정',
      status: '연동 준비 중',
    },
    {
      name: 'LinkedIn',
      summary: 'B2B 인사이트 요약 + 공식 페이지 원문 연결',
      slot: '수 09:30 예정',
      status: '연동 준비 중',
    },
  ];

  const stepHints = [
    '홈페이지에 등록한 원본 게시글 하나가 모든 SNS 배포의 출발점이 됩니다.',
    '채널별 글자 수와 말투에 맞춰 요약 초안과 대표 링크를 자동 정리합니다.',
    '검수 화면에서 문구와 예약 시간을 확인한 뒤 배포 대기열에 올립니다.',
    '외부 SNS API 연동 검증이 완료된 채널만 순차적으로 활성화됩니다.',
  ];

  return (
    <div className="space-y-4">
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-[14px] font-bold text-slate-950">원문 기반 SNS 배포 대기열</p>
          <p className="text-[12px] text-slate-500">게시글 1건 → 3개 채널 분기 시연</p>
        </div>
        <span className="text-[12px] font-semibold text-slate-500">실제 외부 미게시</span>
      </div>

      {/* Source Website Post Card */}
      <div
        className={`flex items-center justify-between gap-3 rounded-[12px] border px-4 py-3 transition-colors ${
          activeStep === 0
            ? 'border-[#2563EB] bg-blue-50/65'
            : 'border-slate-200 bg-slate-950 text-white'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <Globe
            className={`h-4 w-4 shrink-0 ${activeStep === 0 ? 'text-blue-600' : 'text-[#93C5FD]'}`}
            aria-hidden="true"
          />
          <p
            className={`truncate text-[13px] font-semibold ${
              activeStep === 0 ? 'text-slate-950' : 'text-white'
            }`}
          >
            원문: 2026 기업 홈페이지 운영 자동화 가이드
          </p>
        </div>
        <span
          className={`shrink-0 text-[11.5px] font-medium ${
            activeStep === 0 ? 'text-blue-600' : 'text-slate-300'
          }`}
        >
          홈페이지 원본
        </span>
      </div>

      {/* Channel Queue Rows */}
      <div className="divide-y divide-[#EAECF0] rounded-[12px] border border-slate-200 bg-white">
        {channels.map((ch) => (
          <div
            key={ch.name}
            className={`flex items-center justify-between gap-3 px-3.5 py-3 transition-colors ${
              activeStep >= 1 ? 'bg-white' : 'bg-slate-50/60'
            }`}
          >
            <div className="min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
                <span className="text-[12.5px] font-bold text-slate-950 shrink-0">{ch.name}</span>
                <span
                  className={`truncate text-[12px] ${
                    activeStep === 1 ? 'font-semibold text-blue-600' : 'text-slate-600'
                  }`}
                >
                  {ch.summary}
                </span>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2.5 text-[11.5px] tabular-metrics">
              <span
                className={`hidden sm:inline ${
                  activeStep === 2 ? 'font-semibold text-blue-600' : 'text-slate-500'
                }`}
              >
                {ch.slot}
              </span>
              <span
                className={`font-semibold ${
                  activeStep === 3 ? 'text-blue-600' : 'text-slate-500'
                }`}
              >
                {ch.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Step Context Bar */}
      <div className="rounded-[10px] bg-slate-50 px-3.5 py-2.5 text-[12.5px] text-[#344054]">
        {stepHints[activeStep]}
      </div>
    </div>
  );
}

export function UnifiedOperationsFlowVisual() {
  const [activeTabId, setActiveTabId] = useState<FlowTabId>('routine');
  const [activeStep, setActiveStep] = useState<number>(1);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const currentTab = FLOW_TABS.find((t) => t.id === activeTabId) ?? FLOW_TABS[0];

  const handleTabChange = (nextTabId: FlowTabId) => {
    setActiveTabId(nextTabId);
    setActiveStep(0);
  };

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, currentIdx: number) => {
    let nextIdx: number | null = null;
    if (event.key === 'ArrowRight') nextIdx = (currentIdx + 1) % FLOW_TABS.length;
    else if (event.key === 'ArrowLeft')
      nextIdx = (currentIdx - 1 + FLOW_TABS.length) % FLOW_TABS.length;
    else if (event.key === 'Home') nextIdx = 0;
    else if (event.key === 'End') nextIdx = FLOW_TABS.length - 1;

    if (nextIdx !== null) {
      event.preventDefault();
      handleTabChange(FLOW_TABS[nextIdx].id);
      tabRefs.current[nextIdx]?.focus();
    }
  };

  return (
    <div className="overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-[var(--shadow-stage)]">
      {/* Top Interactive Tab Bar (Touch-Friendly on Mobile + Full WAI-ARIA Keyboard Support) */}
      <div className="border-b border-slate-200 bg-slate-50 p-3 sm:px-6 sm:py-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div
            role="tablist"
            aria-label="자동화 운영 흐름 선택"
            className="grid grid-cols-3 gap-1.5 sm:gap-2 lg:flex lg:items-center"
          >
            {FLOW_TABS.map((tab, idx) => {
              const Icon = tab.tabIcon;
              const isActive = tab.id === activeTabId;
              return (
                <button
                  key={tab.id}
                  id={`unified-flow-tab-${tab.id}`}
                  ref={(el) => {
                    tabRefs.current[idx] = el;
                  }}
                  type="button"
                  role="tab"
                  tabIndex={isActive ? 0 : -1}
                  aria-selected={isActive}
                  aria-controls={`unified-flow-panel-${tab.id}`}
                  onClick={() => handleTabChange(tab.id)}
                  onKeyDown={(e) => handleTabKeyDown(e, idx)}
                  className={`inline-flex min-h-[46px] items-center justify-center gap-1.5 sm:gap-2 rounded-[11px] px-1.5 sm:px-4 py-2.5 text-[12px] sm:text-[14px] font-semibold transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-1 ${
                    isActive
                      ? 'bg-[#101828] text-white shadow-[var(--shadow-subtle)]'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-950'
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 shrink-0 hidden sm:inline-block ${
                      isActive ? 'text-[#93C5FD]' : 'text-slate-500'
                    }`}
                    aria-hidden="true"
                  />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <p className="text-[12px] text-slate-500 lg:text-right">{currentTab.statusNote}</p>
        </div>
      </div>

      {/* Main Split Stage: Left 4-Step Flow | Right UI Dashboard Preview */}
      <div
        id={`unified-flow-panel-${currentTab.id}`}
        role="tabpanel"
        aria-labelledby={`unified-flow-tab-${currentTab.id}`}
        className="grid grid-cols-1 lg:grid-cols-12"
      >
        {/* Left: 4-Step Connected Operations Flow */}
        <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-slate-200 bg-white p-5 sm:p-7">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[13px] font-semibold text-slate-950">4단계 운영 흐름</p>
            <span className="text-[12px] text-slate-500">단계 선택 시 우측 연동</span>
          </div>

          <ol className="relative mt-5 space-y-2.5">
            {currentTab.steps.map((step, idx) => {
              const Icon = step.icon;
              const isSelected = activeStep === idx;
              const isLast = idx === currentTab.steps.length - 1;
              return (
                <li key={step.number} className="relative">
                  {/* Vertical Connector Line */}
                  {!isLast && (
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none absolute left-[32px] top-[50px] h-[24px] w-[1.5px] transition-colors ${
                        idx < activeStep ? 'bg-[#2563EB]' : 'bg-[#EAECF0]'
                      }`}
                    />
                  )}

                  <button
                    type="button"
                    onClick={() => setActiveStep(idx)}
                    aria-pressed={isSelected}
                    className={`group flex w-full min-h-[62px] items-center gap-3.5 rounded-[13px] border px-3.5 py-3 text-left transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
                      isSelected
                        ? 'border-[#2563EB]/45 bg-blue-50/60'
                        : 'border-transparent bg-slate-50/80 hover:border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span
                      className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border transition-colors ${
                        isSelected
                          ? 'border-[#2563EB] bg-[#2563EB] text-white'
                          : 'border-slate-200 bg-white text-slate-600 group-hover:text-slate-950'
                      }`}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[11.5px] font-semibold tabular-metrics ${
                            isSelected ? 'text-blue-600' : 'text-slate-400'
                          }`}
                        >
                          {step.number}
                        </span>
                        <span className="truncate text-[14.5px] font-bold text-slate-950">
                          {step.title}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-[12.5px] text-slate-500">
                        {step.shortDesc}
                      </p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Right: Large UI Dashboard Preview */}
        <div className="lg:col-span-7 bg-slate-50 p-5 sm:p-7 flex flex-col justify-center">
          <div className="overflow-hidden rounded-[16px] border border-slate-200 bg-white shadow-[var(--shadow-subtle)]">
            {/* Clean Workspace Chrome Bar */}
            <div className="flex items-center justify-between gap-2 border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-[11.5px]">
              <span className="font-mono text-slate-600 truncate">{currentTab.workspacePath}</span>
              <span className="shrink-0 font-medium text-slate-500">시연 UI</span>
            </div>

            <div className="p-4 sm:p-5">
              {activeTabId === 'routine' && <RoutineDashboardPreview activeStep={activeStep} />}
              {activeTabId === 'stepmail' && <StepMailDashboardPreview activeStep={activeStep} />}
              {activeTabId === 'autoposter' && (
                <AutoPosterDashboardPreview activeStep={activeStep} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Demo Notice + Feature Detail Link */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-slate-200 bg-white px-5 py-4 sm:px-7">
        <p className="text-[12.5px] text-slate-500">
          시연 프리뷰 화면이며 실제 메일 발송·SNS 게시·자동발행은 수행하지 않습니다.
        </p>
        <Link
          to={currentTab.detailTo}
          className="inline-flex min-h-[40px] items-center gap-1.5 text-[14px] font-semibold text-blue-600 hover:text-blue-700 transition-colors whitespace-nowrap shrink-0"
        >
          <span>{currentTab.detailLabel}</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
