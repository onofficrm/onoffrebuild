import { useMemo, useState } from 'react';
import {
  CalendarClock,
  Check,
  ClipboardList,
  ExternalLink,
  History,
  Link2,
  RotateCcw,
  Share2,
  ShieldAlert,
} from 'lucide-react';

type SnsTab = 'queue' | 'channels' | 'schedule' | 'history';
type QueueStage = '대기열 등록' | '검수 대기' | '예약 확정(시연)' | '기록 예시';
type ScheduleFilter = '전체' | QueueStage;

interface ChannelSpec {
  id: string;
  name: string;
  formatSummary: string;
  connectionStatus: '연동 준비 중' | '연동 정책 검토 중';
  policyNote: string;
}

interface SnsQueueItem {
  id: string;
  sourcePostTitle: string;
  sourcePath: string;
  publishedDate: string;
  selectedChannels: string[];
  scheduledSlot: string;
  stage: QueueStage;
  captionDraft: string;
  checks: {
    messageChecked: boolean;
    linkChecked: boolean;
    policyChecked: boolean;
  };
}

interface DistributionLogEntry {
  id: string;
  timestamp: string;
  stageLabel: string;
  title: string;
  channelsLabel: string;
  note: string;
}

const CHANNEL_SPECS: ChannelSpec[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    formatSummary: '카드 요약 · 정사각/세로 이미지',
    connectionStatus: '연동 준비 중',
    policyNote: '비즈니스 계정 권한 및 Meta API 기준 검증 후 순차 지원 예정',
  },
  {
    id: 'facebook',
    name: 'Facebook 페이지',
    formatSummary: '원문 링크 카드 · 핵심 2~3문장',
    connectionStatus: '연동 준비 중',
    policyNote: '페이지 권한 인증 및 외부 자동 게시 연동 검증 준비 중',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn 페이지',
    formatSummary: 'B2B 인사이트 요약 · 원문 연결',
    connectionStatus: '연동 준비 중',
    policyNote: '조직 페이지 API 연동 및 검수 흐름 연결 준비 중',
  },
  {
    id: 'x',
    name: 'X (구 Twitter)',
    formatSummary: '핵심 1~2줄 요약 · 짧은 링크',
    connectionStatus: '연동 정책 검토 중',
    policyNote: '유료 API 과금·정책 변동성 기준으로 제공 방식 검토 중',
  },
  {
    id: 'threads',
    name: 'Threads',
    formatSummary: '대화형 핵심 요약 · 원문 안내',
    connectionStatus: '연동 정책 검토 중',
    policyNote: '채널 API 안정화 및 기업 활용도 기준 순차 검토 중',
  },
  {
    id: 'naver-blog',
    name: '네이버 브랜드 채널',
    formatSummary: '원문 기반 요약 안내 · 유입 연결',
    connectionStatus: '연동 정책 검토 중',
    policyNote: '공식 자동 게시 API 제약으로 검수 원고·수동 연계 상담',
  },
];

const INITIAL_QUEUE_ITEMS: SnsQueueItem[] = [
  {
    id: 'SNS-201',
    sourcePostTitle: '기업 홈페이지 리뉴얼 전 점검해야 할 5가지 구조 기준',
    sourcePath: '/website',
    publishedDate: '2026.11.04',
    selectedChannels: ['instagram', 'linkedin'],
    scheduledSlot: '11.05 10:00 (예시)',
    stage: '기록 예시',
    captionDraft:
      '홈페이지 리뉴얼은 디자인보다 정보 구조 점검이 먼저입니다. 첫 화면 메시지, 모바일 상담 동선, 오픈 이후 운영 방식까지 5가지 체크포인트를 정리했습니다.',
    checks: { messageChecked: true, linkChecked: true, policyChecked: true },
  },
  {
    id: 'SNS-202',
    sourcePostTitle: '모바일 문의 전환을 높이는 상담 폼 설계 가이드',
    sourcePath: '/contact',
    publishedDate: '2026.11.11',
    selectedChannels: ['linkedin', 'facebook'],
    scheduledSlot: '11.12 14:00 (예시)',
    stage: '예약 확정(시연)',
    captionDraft:
      '방문자가 모바일에서 문의를 포기하지 않도록 필수 항목과 선택 항목을 구분하는 상담 폼 설계 원칙을 정리했습니다.',
    checks: { messageChecked: true, linkChecked: true, policyChecked: true },
  },
  {
    id: 'SNS-203',
    sourcePostTitle: '도메인 이전 시 기업 이메일 중단 없이 연결하는 체크리스트',
    sourcePath: '/domain',
    publishedDate: '2026.11.18',
    selectedChannels: ['instagram', 'linkedin'],
    scheduledSlot: '11.19 09:30 (예정)',
    stage: '검수 대기',
    captionDraft:
      '홈페이지를 옮길 때 가장 걱정되는 기존 회사 이메일 중단 문제. MX·SPF 레코드 사전 확인부터 HTTPS 보안 적용까지 안전한 연결 기준을 정리했습니다.',
    checks: { messageChecked: true, linkChecked: false, policyChecked: false },
  },
  {
    id: 'SNS-204',
    sourcePostTitle: 'AI 검색 환경에 대비한 서비스 소개 문장 작성 기준',
    sourcePath: '/geo',
    publishedDate: '2026.11.21',
    selectedChannels: ['linkedin'],
    scheduledSlot: '11.22 11:00 (예정)',
    stage: '대기열 등록',
    captionDraft:
      '추상적인 홍보 문구 대신 제공 범위, 대상, 진행 절차를 명확하게 쓰는 서비스 소개 문장 구조를 정리했습니다.',
    checks: { messageChecked: false, linkChecked: false, policyChecked: false },
  },
];

const INITIAL_LOGS: DistributionLogEntry[] = [
  {
    id: 'SLOG-04',
    timestamp: '11.18 10:15',
    stageLabel: '대기열 등록',
    title: '도메인 이전 시 기업 이메일 중단 없이 연결하는 체크리스트',
    channelsLabel: 'Instagram · LinkedIn (연동 준비 중)',
    note: '홈페이지 원문 연계 시연 → SNS 요약 초안 및 검수 대기 등록',
  },
  {
    id: 'SLOG-03',
    timestamp: '11.11 16:20',
    stageLabel: '검수 승인 · 예약',
    title: '모바일 문의 전환을 높이는 상담 폼 설계 가이드',
    channelsLabel: 'LinkedIn · Facebook (연동 준비 중)',
    note: '담당자 문구·원문 링크 검수 완료 → 시연 예약 일정 등록',
  },
  {
    id: 'SLOG-02',
    timestamp: '11.05 10:00',
    stageLabel: '배포 기록 예시',
    title: '기업 홈페이지 리뉴얼 전 점검해야 할 5가지 구조 기준',
    channelsLabel: 'Instagram · LinkedIn (시연 샘플)',
    note: '홈페이지 원문 회귀 링크 기록 구조 예시 (실제 외부 API 발행 아님)',
  },
];

const NAV_TABS: { id: SnsTab; label: string; icon: typeof ClipboardList }[] = [
  { id: 'queue', label: '배포 대기열', icon: ClipboardList },
  { id: 'channels', label: '채널 연동 현황', icon: Link2 },
  { id: 'schedule', label: '예약 일정', icon: CalendarClock },
  { id: 'history', label: '배포 기록', icon: History },
];

const SCHEDULE_FILTERS: ScheduleFilter[] = [
  '전체',
  '대기열 등록',
  '검수 대기',
  '예약 확정(시연)',
  '기록 예시',
];

function getStageColor(stage: QueueStage): string {
  switch (stage) {
    case '기록 예시':
      return 'text-[#15803D]';
    case '예약 확정(시연)':
      return 'text-blue-600';
    case '검수 대기':
      return 'text-[#B45309]';
    default:
      return 'text-slate-600';
  }
}

export function SnsPosterDashboardMockup() {
  const [activeTab, setActiveTab] = useState<SnsTab>('queue');
  const [queueItems, setQueueItems] = useState<SnsQueueItem[]>(INITIAL_QUEUE_ITEMS);
  const [logs, setLogs] = useState<DistributionLogEntry[]>(INITIAL_LOGS);
  const [selectedId, setSelectedId] = useState<string>('SNS-203');
  const [scheduleFilter, setScheduleFilter] = useState<ScheduleFilter>('전체');
  const [demoNotice, setDemoNotice] = useState<string | null>(null);

  const selectedItem =
    queueItems.find((item) => item.id === selectedId) ?? queueItems[0];

  const counts = useMemo(
    () => ({
      total: queueItems.length,
      reviewing: queueItems.filter(
        (i) => i.stage === '대기열 등록' || i.stage === '검수 대기'
      ).length,
      scheduled: queueItems.filter((i) => i.stage === '예약 확정(시연)').length,
      activeLiveChannels: 0,
    }),
    [queueItems]
  );

  const filteredScheduleItems = useMemo(() => {
    if (scheduleFilter === '전체') return queueItems;
    return queueItems.filter((item) => item.stage === scheduleFilter);
  }, [queueItems, scheduleFilter]);

  const handleToggleChannel = (itemId: string, channelId: string) => {
    setQueueItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        const exists = item.selectedChannels.includes(channelId);
        const nextChannels = exists
          ? item.selectedChannels.filter((c) => c !== channelId)
          : [...item.selectedChannels, channelId];
        return {
          ...item,
          selectedChannels: nextChannels.length > 0 ? nextChannels : [channelId],
        };
      })
    );
  };

  const handleToggleCheck = (
    itemId: string,
    key: keyof SnsQueueItem['checks']
  ) => {
    setQueueItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              checks: {
                ...item.checks,
                [key]: !item.checks[key],
              },
            }
          : item
      )
    );
  };

  const handleDemoSchedule = (item: SnsQueueItem) => {
    const channelNames = item.selectedChannels
      .map((id) => CHANNEL_SPECS.find((c) => c.id === id)?.name ?? id)
      .join(' · ');

    setQueueItems((prev) =>
      prev.map((entry) =>
        entry.id === item.id
          ? {
              ...entry,
              stage: '예약 확정(시연)',
              checks: { messageChecked: true, linkChecked: true, policyChecked: true },
            }
          : entry
      )
    );
    setLogs((prev) => [
      {
        id: `SLOG-DEMO-${Date.now()}`,
        timestamp: '방금 전 (시연)',
        stageLabel: '검수 승인 · 시연 예약',
        title: item.sourcePostTitle,
        channelsLabel: `${channelNames} (연동 준비 중)`,
        note: '브라우저 시연 화면에서만 예약 확정으로 이동했으며 실제 SNS로 발행되지 않습니다.',
      },
      ...prev,
    ]);
    setDemoNotice(
      `"${item.sourcePostTitle}" 항목이 시연 화면에서 '예약 확정(시연)'으로 이동했습니다. 실제 외부 SNS에는 게시되지 않습니다.`
    );
  };

  const handleReset = () => {
    setQueueItems(INITIAL_QUEUE_ITEMS);
    setLogs(INITIAL_LOGS);
    setSelectedId('SNS-203');
    setScheduleFilter('전체');
    setDemoNotice('시연 데이터를 초기 상태로 되돌렸습니다.');
  };

  const isModified = queueItems !== INITIAL_QUEUE_ITEMS;

  return (
    <figure
      role="region"
      aria-label="오토포스터 SNS 배포 관리 대시보드 시연 화면"
      className="w-full overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-[var(--shadow-stage)]"
    >
      {/* Unified Top Chrome */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 sm:px-6 py-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="hidden sm:flex items-center gap-1.5 shrink-0" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-[#D0D5DD]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#D0D5DD]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#D0D5DD]" />
          </div>
          <span className="text-[13px] font-semibold text-slate-950 truncate">
            오토포스터 운영 워크스페이스
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[12px] font-medium text-blue-600">
            외부 발행 미연동 · 시연 UI
          </span>
          {isModified && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex min-h-[30px] items-center gap-1 rounded-[8px] border border-slate-200 bg-white px-2.5 py-1 text-[11.5px] font-medium text-slate-600 hover:border-slate-300 hover:text-slate-950 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" aria-hidden="true" />
              <span>초기화</span>
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Tab Bar + Compact Status Metrics */}
      <div className="flex flex-col gap-3 border-b border-slate-200 bg-white px-4 sm:px-6 py-3 lg:flex-row lg:items-center lg:justify-between">
        <nav
          aria-label="오토포스터 시연 탭"
          className="flex items-center gap-1 overflow-x-auto rounded-[10px] border border-slate-200 bg-slate-50 p-1"
        >
          {NAV_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex min-h-[34px] items-center gap-1.5 rounded-[8px] px-3 py-1 text-[12.5px] font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-white text-slate-950 shadow-[0_1px_2px_rgba(16,24,40,0.06)]'
                    : 'text-slate-500 hover:text-slate-950'
                }`}
              >
                <Icon
                  className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`}
                  aria-hidden="true"
                />
                <span>{tab.label}</span>
                {tab.id === 'queue' && (
                  <span className="text-[11px] font-bold tabular-metrics text-[#B45309]">
                    {counts.reviewing}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-slate-500">
          <span>
            예시 게시글 <strong className="tabular-metrics text-slate-950">{counts.total}</strong>
          </span>
          <span>
            예약 시연 <strong className="tabular-metrics text-blue-600">{counts.scheduled}</strong>
          </span>
          <span>
            실연동 채널{' '}
            <strong className="tabular-metrics text-slate-600">
              {counts.activeLiveChannels}개 (연동 준비 중)
            </strong>
          </span>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="p-4 sm:p-6 lg:p-7 bg-white">
        {demoNotice && (
          <div
            role="status"
            className="mb-5 flex items-center justify-between gap-4 rounded-[10px] border border-[#2563EB]/25 bg-blue-50/60 px-4 py-2.5 text-[12.5px] text-slate-950"
          >
            <span>{demoNotice}</span>
            <button
              type="button"
              onClick={() => setDemoNotice(null)}
              className="text-[12px] font-semibold text-blue-600 hover:underline whitespace-nowrap shrink-0 cursor-pointer"
            >
              닫기
            </button>
          </div>
        )}

        {/* VIEW 1: DISTRIBUTION QUEUE */}
        {activeTab === 'queue' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Left Source Post Queue */}
            <div className="lg:col-span-5 space-y-2">
              {queueItems.map((item) => {
                const active = item.id === selectedItem.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    className={`w-full rounded-[12px] border p-4 text-left transition-[border-color,background-color] cursor-pointer ${
                      active
                        ? 'border-[#2563EB] bg-blue-50/40'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-[11.5px]">
                      <span className="font-mono tabular-metrics text-slate-500">
                        {item.sourcePath}
                      </span>
                      <span className={`font-semibold ${getStageColor(item.stage)}`}>
                        {item.stage}
                      </span>
                    </div>
                    <p className="mt-1.5 text-[14px] font-semibold leading-snug text-slate-950">
                      {item.sourcePostTitle}
                    </p>
                    <p className="mt-1 text-[11.5px] tabular-metrics text-slate-500">
                      {item.scheduledSlot}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Right Channel & Approval Canvas */}
            <div className="lg:col-span-7 space-y-5 rounded-[14px] border border-slate-200 bg-slate-50/50 p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-blue-600">
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  홈페이지 원문: {selectedItem.sourcePath}
                </span>
                <span className={`text-[12px] font-semibold ${getStageColor(selectedItem.stage)}`}>
                  {selectedItem.stage}
                </span>
              </div>

              {/* Channel Selector (Explicitly Marked 연동 준비 중) */}
              <div className="space-y-2">
                <p className="text-[12px] font-semibold text-slate-500">
                  배포 대상 채널 선택 (모든 외부 채널 연동 준비 중)
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CHANNEL_SPECS.map((ch) => {
                    const checked = selectedItem.selectedChannels.includes(ch.id);
                    return (
                      <button
                        key={ch.id}
                        type="button"
                        onClick={() => handleToggleChannel(selectedItem.id, ch.id)}
                        className={`rounded-[10px] border px-3 py-2 text-left transition-colors cursor-pointer ${
                          checked
                            ? 'border-[#2563EB] bg-white text-slate-950'
                            : 'border-slate-200 bg-white/70 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <p className="text-[12px] font-semibold truncate">{ch.name}</p>
                        <p className="mt-0.5 text-[10.5px] text-slate-500 truncate">
                          {ch.connectionStatus}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SNS Caption Draft */}
              <div className="rounded-[12px] border border-slate-200 bg-white p-4 space-y-2">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="inline-flex items-center gap-1.5 font-semibold text-slate-950">
                    <Share2 className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" />
                    채널 요약 초안
                  </span>
                  <span className="tabular-metrics text-slate-500">
                    {selectedItem.scheduledSlot}
                  </span>
                </div>
                <p className="text-[13.5px] leading-[1.6] text-[#344054]">
                  {selectedItem.captionDraft}
                </p>
                <p className="text-[11.5px] font-mono text-blue-600">
                  onoff.icrm.co.kr{selectedItem.sourcePath}
                </p>
              </div>

              {/* Compact Review Checks */}
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {(
                  [
                    { key: 'messageChecked', label: '문구·사실 검수' },
                    { key: 'linkChecked', label: '원문 링크 확인' },
                    { key: 'policyChecked', label: '일정·정책 확인' },
                  ] as const
                ).map((chk) => {
                  const done = selectedItem.checks[chk.key];
                  return (
                    <button
                      key={chk.key}
                      type="button"
                      onClick={() => handleToggleCheck(selectedItem.id, chk.key)}
                      className="flex items-center gap-2 rounded-[10px] border border-slate-200 bg-white px-3 py-2 text-left text-[12.5px] hover:border-slate-300 transition-colors cursor-pointer"
                    >
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                          done
                            ? 'border-[#2563EB] bg-[#2563EB] text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                        aria-hidden="true"
                      >
                        {done && <Check className="h-3 w-3" />}
                      </span>
                      <span className={done ? 'font-medium text-slate-950' : 'text-slate-600'}>
                        {chk.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-t border-slate-200 pt-4">
                <span className="text-[11.5px] text-slate-500">
                  시연 전용 버튼 · 실제 외부 SNS로 발행되지 않습니다.
                </span>
                <button
                  type="button"
                  onClick={() => handleDemoSchedule(selectedItem)}
                  className="inline-flex min-h-[38px] items-center justify-center rounded-[10px] bg-[#2563EB] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#1D4ED8] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  승인 · 예약 등록 (시연)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: CHANNEL READINESS TABLE (BEHIND TAB) */}
        {activeTab === 'channels' && (
          <div className="space-y-4">
            <div className="flex items-start gap-2.5 rounded-[12px] border border-slate-200 bg-slate-50 p-4 text-[13px] text-slate-600">
              <ShieldAlert className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" aria-hidden="true" />
              <p>
                외부 발행 운영 검증이 완료되지 않은 채널은 모두{' '}
                <strong className="text-slate-950">연동 준비 중</strong> 또는 정책 검토 상태로
                표기합니다.
              </p>
            </div>

            {/* Mobile Channel Cards (< sm) */}
            <div className="block sm:hidden space-y-2.5">
              {CHANNEL_SPECS.map((ch) => (
                <div
                  key={ch.id}
                  className="rounded-[12px] border border-slate-200 bg-white p-4 space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[14px] font-bold text-slate-950">{ch.name}</span>
                    <span className="text-[12px] font-semibold text-blue-600">
                      {ch.connectionStatus}
                    </span>
                  </div>
                  <p className="text-[12.5px] text-slate-600">{ch.formatSummary}</p>
                  <p className="text-[11.5px] text-slate-500">{ch.policyNote}</p>
                </div>
              ))}
            </div>

            <div className="hidden sm:block overflow-x-auto rounded-[12px] border border-slate-200">
              <table className="w-full min-w-[560px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[12px] font-semibold text-slate-500">
                    <th className="py-3 pl-4 pr-3">채널</th>
                    <th className="py-3 px-3">상태</th>
                    <th className="py-3 px-3">변환 형식</th>
                    <th className="py-3 pl-3 pr-4">안내</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAECF0] text-[13px]">
                  {CHANNEL_SPECS.map((ch) => (
                    <tr key={ch.id} className="align-top hover:bg-slate-50/60">
                      <td className="py-3.5 pl-4 pr-3 font-semibold text-slate-950 whitespace-nowrap">
                        {ch.name}
                      </td>
                      <td className="py-3.5 px-3 font-medium text-blue-600 whitespace-nowrap">
                        {ch.connectionStatus}
                      </td>
                      <td className="py-3.5 px-3 text-slate-600">{ch.formatSummary}</td>
                      <td className="py-3.5 pl-3 pr-4 text-[12px] text-slate-500">
                        {ch.policyNote}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 3: SCHEDULE TABLE (BEHIND TAB) */}
        {activeTab === 'schedule' && (
          <div className="space-y-4">
            <div
              role="tablist"
              aria-label="예약 상태 필터"
              className="inline-flex flex-wrap items-center gap-1 rounded-[10px] border border-slate-200 bg-slate-50 p-1"
            >
              {SCHEDULE_FILTERS.map((filter) => {
                const active = scheduleFilter === filter;
                return (
                  <button
                    key={filter}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setScheduleFilter(filter)}
                    className={`min-h-[32px] rounded-[7px] px-3 py-1 text-[12px] font-medium transition-colors whitespace-nowrap cursor-pointer ${
                      active
                        ? 'bg-white text-slate-950 shadow-[0_1px_2px_rgba(16,24,40,0.06)]'
                        : 'text-slate-500 hover:text-slate-950'
                    }`}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>

            {/* Mobile Schedule Cards (< sm) */}
            <div className="block sm:hidden space-y-2.5">
              {filteredScheduleItems.map((item) => {
                const chNames = item.selectedChannels
                  .map((id) => CHANNEL_SPECS.find((c) => c.id === id)?.name ?? id)
                  .join(', ');
                return (
                  <div
                    key={item.id}
                    className="rounded-[12px] border border-slate-200 bg-white p-4 space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2 text-[12px]">
                      <span className={`font-semibold ${getStageColor(item.stage)}`}>
                        {item.stage}
                      </span>
                      <span className="font-mono text-[11.5px] tabular-metrics text-slate-500">
                        {item.scheduledSlot}
                      </span>
                    </div>
                    <p className="text-[13.5px] font-semibold text-slate-950">
                      {item.sourcePostTitle}
                    </p>
                    <p className="text-[12px] text-slate-500">선택 채널(준비 중): {chNames}</p>
                  </div>
                );
              })}
            </div>

            <div className="hidden sm:block overflow-x-auto rounded-[12px] border border-slate-200">
              <table className="w-full min-w-[560px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[12px] font-semibold text-slate-500">
                    <th className="py-3 pl-4 pr-3">게시글</th>
                    <th className="py-3 px-3">선택 채널 (준비 중)</th>
                    <th className="py-3 px-3">상태</th>
                    <th className="py-3 pl-3 pr-4 text-right">예약 일시</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAECF0] text-[13px]">
                  {filteredScheduleItems.map((item) => {
                    const chNames = item.selectedChannels
                      .map((id) => CHANNEL_SPECS.find((c) => c.id === id)?.name ?? id)
                      .join(', ');
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/60">
                        <td className="py-3.5 pl-4 pr-3 font-medium text-slate-950">
                          {item.sourcePostTitle}
                        </td>
                        <td className="py-3.5 px-3 text-slate-600">{chNames}</td>
                        <td
                          className={`py-3.5 px-3 font-semibold whitespace-nowrap ${getStageColor(
                            item.stage
                          )}`}
                        >
                          {item.stage}
                        </td>
                        <td className="py-3.5 pl-3 pr-4 text-right font-mono text-[12px] tabular-metrics text-slate-600 whitespace-nowrap">
                          {item.scheduledSlot}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 4: HISTORY LOG */}
        {activeTab === 'history' && (
          <div className="divide-y divide-[#EAECF0] rounded-[12px] border border-slate-200">
            {logs.map((entry) => (
              <div
                key={entry.id}
                className="flex flex-col gap-1.5 px-4 sm:px-5 py-3.5 sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-[12px]">
                    <span className="font-semibold text-blue-600">{entry.stageLabel}</span>
                    <span className="text-[#D0D5DD]" aria-hidden="true">
                      ·
                    </span>
                    <span className="text-slate-500">{entry.channelsLabel}</span>
                  </div>
                  <p className="text-[13.5px] font-medium text-slate-950">{entry.title}</p>
                  <p className="text-[12px] text-slate-500">{entry.note}</p>
                </div>
                <span className="font-mono text-[12px] tabular-metrics text-slate-500 shrink-0">
                  {entry.timestamp}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </figure>
  );
}
