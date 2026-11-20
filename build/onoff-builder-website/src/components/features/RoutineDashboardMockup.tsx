import { useMemo, useState } from 'react';
import {
  Calendar,
  Check,
  ClipboardCheck,
  Clock,
  FileText,
  History,
  Layers,
  RotateCcw,
} from 'lucide-react';

type DashboardTab = 'calendar' | 'review' | 'status' | 'history';
type PipelineStage = '규칙 설정' | '초안 생성' | '검수 대기' | '예약 확정' | '발행 예시';
type StatusFilter = '전체' | PipelineStage;
type HistoryFilter = '전체' | '규칙·초안' | '검수' | '예약·발행';

interface RoutineContentItem {
  id: string;
  title: string;
  category: string;
  targetSection: string;
  scheduledDate: string;
  scheduledDay: number;
  scheduledTime: string;
  ruleName: string;
  stage: PipelineStage;
  reviewer: string;
  outline: string[];
  summaryNote: string;
  checks: {
    factChecked: boolean;
    toneChecked: boolean;
    linkChecked: boolean;
  };
}

interface HistoryLogItem {
  id: string;
  timestamp: string;
  category: Exclude<HistoryFilter, '전체'>;
  action: string;
  targetTitle: string;
  actor: string;
  note: string;
}

const INITIAL_CONTENT_ITEMS: RoutineContentItem[] = [
  {
    id: 'RT-101',
    title: '기업 홈페이지 리뉴얼 전 점검해야 할 5가지 구조 기준',
    category: '홈페이지 인사이트',
    targetSection: '인사이트 게시판',
    scheduledDate: '2026.11.04',
    scheduledDay: 4,
    scheduledTime: '09:30',
    ruleName: '매주 수요일 · 서비스 가이드 루틴',
    stage: '발행 예시',
    reviewer: '운영 담당자',
    outline: [
      '방문자 첫 화면 정보 구조와 핵심 메시지 정렬 기준',
      'PC·모바일 반응형에서 상담 전환을 막는 대표 요소 점검',
      '오픈 이후 수정·콘텐츠 확장을 고려한 운영 체계 확인',
    ],
    summaryNote: '시연용 샘플 항목입니다. 발행 완료 상태의 홈페이지 게시물 구조를 보여줍니다.',
    checks: { factChecked: true, toneChecked: true, linkChecked: true },
  },
  {
    id: 'RT-102',
    title: '모바일 문의 전환을 높이는 상담 폼 설계 가이드',
    category: '운영 전략',
    targetSection: '인사이트 게시판',
    scheduledDate: '2026.11.11',
    scheduledDay: 11,
    scheduledTime: '10:00',
    ruleName: '매주 수요일 · 서비스 가이드 루틴',
    stage: '예약 확정',
    reviewer: '마케팅 담당자',
    outline: [
      '필수 입력 항목과 선택 입력 항목의 적정 균형 기준',
      '관심 서비스 사전 선택으로 고객 입력 피로도를 줄이는 방법',
      '문의 접수 이후 스텝메일 후속 안내로 연결하는 동선',
    ],
    summaryNote: '담당자 검수 확인을 마치고 지정 일정에 맞춰 예약 대기 중인 시연 항목입니다.',
    checks: { factChecked: true, toneChecked: true, linkChecked: true },
  },
  {
    id: 'RT-103',
    title: '도메인 이전 시 기업 이메일 중단 없이 연결하는 체크리스트',
    category: '기술·인프라 안내',
    targetSection: '고객 가이드',
    scheduledDate: '2026.11.18',
    scheduledDay: 18,
    scheduledTime: '09:30',
    ruleName: '격주 수요일 · 운영 체크리스트',
    stage: '검수 대기',
    reviewer: '고객사 검수 대기',
    outline: [
      '기존 DNS 레코드(MX · SPF · TXT) 사전 백업 및 확인 절차',
      '웹 호스팅 A/CNAME 전환 시 메일 수신에 영향을 주지 않는 설정 원칙',
      'SSL 인증서 적용 및 표준 대표 주소(HTTPS) 최종 점검 항목',
    ],
    summaryNote: 'AI 초안 생성이 완료되어 사실 관계·어조·내부 링크 검수를 기다리는 시연 원고입니다.',
    checks: { factChecked: true, toneChecked: true, linkChecked: false },
  },
  {
    id: 'RT-104',
    title: 'AI 검색 환경에 대비한 서비스 소개 문장 작성 기준',
    category: '검색·콘텐츠',
    targetSection: '인사이트 게시판',
    scheduledDate: '2026.11.21',
    scheduledDay: 21,
    scheduledTime: '14:00',
    ruleName: '매주 금요일 · 검색 대응 인사이트',
    stage: '검수 대기',
    reviewer: '고객사 검수 대기',
    outline: [
      '추상적 홍보 문구 대신 제공 범위·대상·절차를 명확히 쓰는 구조',
      '질문형 소제목(FAQ)으로 핵심 답변을 정리하는 방법',
      '홈페이지 구조와 별도 SEO·GEO 진단 서비스를 연계하는 순서',
    ],
    summaryNote: '브랜드 용어와 제공 범위 표현의 사실 확인이 필요한 검수 대기 시연 원고입니다.',
    checks: { factChecked: false, toneChecked: true, linkChecked: false },
  },
  {
    id: 'RT-105',
    title: '업종별 자주 묻는 질문(FAQ)을 홈페이지 자산으로 정리하는 방법',
    category: '홈페이지 인사이트',
    targetSection: '고객 가이드',
    scheduledDate: '2026.11.25',
    scheduledDay: 25,
    scheduledTime: '09:30',
    ruleName: '매주 수요일 · 서비스 가이드 루틴',
    stage: '초안 생성',
    reviewer: '초안 작성 중',
    outline: [
      '실제 상담에서 반복되는 질문 유형 4가지 분류하기',
      '가격·기간·범위 질문에 신뢰감 있게 답하는 문장 패턴',
      '정리된 FAQ를 상담 페이지와 SNS 안내로 재활용하는 방법',
    ],
    summaryNote: '설정한 루틴 규칙에 따라 구조화 초안이 생성 중인 시연 항목입니다.',
    checks: { factChecked: false, toneChecked: false, linkChecked: false },
  },
  {
    id: 'RT-106',
    title: '연말·신규 시즌 공지사항 및 서비스 안내 업데이트 기준',
    category: '운영 소식',
    targetSection: '공지·뉴스',
    scheduledDate: '2026.11.28',
    scheduledDay: 28,
    scheduledTime: '11:00',
    ruleName: '월말 정기 공지 루틴',
    stage: '규칙 설정',
    reviewer: '주제 확정 대기',
    outline: [
      '시즌 일정 안내와 상담 운영 시간 공지 템플릿 정리',
      '메인 공지 영역과 상세 페이지 링크 연결 점검',
    ],
    summaryNote: '발행 주기와 카테고리 규칙이 배정된 예정 시연 항목입니다.',
    checks: { factChecked: false, toneChecked: false, linkChecked: false },
  },
];

const INITIAL_HISTORY_LOGS: HistoryLogItem[] = [
  {
    id: 'LOG-06',
    timestamp: '2026.11.17 15:20',
    category: '규칙·초안',
    action: '구조화 초안 생성 완료 (시연)',
    targetTitle: 'AI 검색 환경에 대비한 서비스 소개 문장 작성 기준',
    actor: '루틴 워크플로',
    note: '소제목 3개 · 핵심 체크리스트 초안 생성 → 검수 대기 등록',
  },
  {
    id: 'LOG-05',
    timestamp: '2026.11.15 11:05',
    category: '규칙·초안',
    action: '구조화 초안 생성 완료 (시연)',
    targetTitle: '도메인 이전 시 기업 이메일 중단 없이 연결하는 체크리스트',
    actor: '루틴 워크플로',
    note: '기업 가이드 어조 규칙 반영 → 검수 대기로 이동',
  },
  {
    id: 'LOG-04',
    timestamp: '2026.11.10 16:40',
    category: '검수',
    action: '담당자 검수 승인 및 예약 확정 (시연)',
    targetTitle: '모바일 문의 전환을 높이는 상담 폼 설계 가이드',
    actor: '마케팅 담당자',
    note: '사실 확인·내부 상담 링크 확인 완료 · 11월 11일 10:00 예약',
  },
  {
    id: 'LOG-03',
    timestamp: '2026.11.04 09:30',
    category: '예약·발행',
    action: '홈페이지 인사이트 반영 예시 기록',
    targetTitle: '기업 홈페이지 리뉴얼 전 점검해야 할 5가지 구조 기준',
    actor: '운영 담당자',
    note: '홈페이지 인사이트 게시판 반영 및 결과 확인 체크 완료 (시연 데이터)',
  },
  {
    id: 'LOG-02',
    timestamp: '2026.11.01 10:00',
    category: '규칙·초안',
    action: '월간 콘텐츠 발행 루틴 규칙 확정',
    targetTitle: '11월 정기 콘텐츠 캘린더 (총 6건 예정)',
    actor: '운영 담당자',
    note: '주 1~2회 발행 주기 · 금지 표현 기준 · 검수 필수 단계 적용',
  },
];

const NAV_ITEMS: { id: DashboardTab; label: string; icon: typeof Calendar }[] = [
  { id: 'calendar', label: '콘텐츠 캘린더', icon: Calendar },
  { id: 'review', label: '검수 대기', icon: ClipboardCheck },
  { id: 'status', label: '발행 상태', icon: Layers },
  { id: 'history', label: '진행 이력', icon: History },
];

const STATUS_FILTERS: StatusFilter[] = [
  '전체',
  '규칙 설정',
  '초안 생성',
  '검수 대기',
  '예약 확정',
  '발행 예시',
];

const HISTORY_FILTERS: HistoryFilter[] = ['전체', '규칙·초안', '검수', '예약·발행'];

const CALENDAR_WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
// 2026년 11월: 1일이 일요일, 총 30일
const NOVEMBER_DAYS = Array.from({ length: 30 }, (_, idx) => idx + 1);

function getStageTextColor(stage: PipelineStage): string {
  switch (stage) {
    case '발행 예시':
      return 'text-[#15803D]';
    case '예약 확정':
      return 'text-blue-600';
    case '검수 대기':
      return 'text-[#B45309]';
    case '초안 생성':
      return 'text-slate-600';
    default:
      return 'text-slate-500';
  }
}

export function RoutineDashboardMockup() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('calendar');
  const [items, setItems] = useState<RoutineContentItem[]>(INITIAL_CONTENT_ITEMS);
  const [historyLogs, setHistoryLogs] = useState<HistoryLogItem[]>(INITIAL_HISTORY_LOGS);
  const [selectedCalendarId, setSelectedCalendarId] = useState<string>('RT-103');
  const [selectedReviewId, setSelectedReviewId] = useState<string>('RT-103');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('전체');
  const [historyFilter, setHistoryFilter] = useState<HistoryFilter>('전체');
  const [demoActionNotice, setDemoActionNotice] = useState<string | null>(null);

  const reviewItems = useMemo(
    () => items.filter((item) => item.stage === '검수 대기'),
    [items]
  );

  const counts = useMemo(
    () => ({
      total: items.length,
      pendingReview: items.filter((i) => i.stage === '검수 대기').length,
      scheduled: items.filter((i) => i.stage === '예약 확정').length,
      publishedSample: items.filter((i) => i.stage === '발행 예시').length,
    }),
    [items]
  );

  const selectedCalendarItem =
    items.find((item) => item.id === selectedCalendarId) ?? items[0];

  const selectedReviewItem =
    reviewItems.find((item) => item.id === selectedReviewId) ?? reviewItems[0] ?? null;

  const filteredStatusItems = useMemo(() => {
    if (statusFilter === '전체') return items;
    return items.filter((item) => item.stage === statusFilter);
  }, [items, statusFilter]);

  const filteredHistoryLogs = useMemo(() => {
    if (historyFilter === '전체') return historyLogs;
    return historyLogs.filter((log) => log.category === historyFilter);
  }, [historyLogs, historyFilter]);

  const itemsByDay = useMemo(() => {
    const map = new Map<number, RoutineContentItem>();
    for (const item of items) {
      map.set(item.scheduledDay, item);
    }
    return map;
  }, [items]);

  const handleToggleCheck = (
    itemId: string,
    key: keyof RoutineContentItem['checks']
  ) => {
    setItems((prev) =>
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

  const handleDemoApprove = (item: RoutineContentItem) => {
    setItems((prev) =>
      prev.map((entry) =>
        entry.id === item.id
          ? {
              ...entry,
              stage: '예약 확정',
              reviewer: '시연 검수 확인',
              checks: { factChecked: true, toneChecked: true, linkChecked: true },
            }
          : entry
      )
    );
    setHistoryLogs((prev) => [
      {
        id: `LOG-DEMO-${Date.now()}`,
        timestamp: '방금 전 (시연)',
        category: '검수',
        action: '시연 화면 검수 승인 → 예약 확정 이동',
        targetTitle: item.title,
        actor: '운영자 시연',
        note: '브라우저 화면 내 시연 상태만 변경되었으며 실제 서버에는 전송되지 않습니다.',
      },
      ...prev,
    ]);
    setDemoActionNotice(
      `"${item.title}" 항목이 시연 화면에서 '예약 확정' 상태로 이동했습니다. 실제 서버 발행과는 연결되지 않습니다.`
    );
  };

  const handleResetDemo = () => {
    setItems(INITIAL_CONTENT_ITEMS);
    setHistoryLogs(INITIAL_HISTORY_LOGS);
    setSelectedCalendarId('RT-103');
    setSelectedReviewId('RT-103');
    setStatusFilter('전체');
    setHistoryFilter('전체');
    setDemoActionNotice('시연 화면 데이터를 초기 예시 상태로 되돌렸습니다.');
  };

  const isModified = items !== INITIAL_CONTENT_ITEMS;

  return (
    <div className="w-full">
      {/* Top Disclosure Bar — Clear Demo Notice */}
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] leading-[1.55] text-slate-600">
          <span className="font-semibold text-slate-950">시연 화면 안내</span>
          <span className="mx-2 text-[#D0D5DD]" aria-hidden="true">
            ·
          </span>
          실제 서버 발행과 연결되지 않은 운영자 대시보드 시연 화면입니다. (ONOFF Builder 플랫폼
          직접 자동발행 연동은 준비 중)
        </p>
        {isModified && (
          <button
            type="button"
            onClick={handleResetDemo}
            className="inline-flex min-h-[34px] items-center gap-1.5 self-start sm:self-auto rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[12px] font-medium text-slate-600 hover:border-[#98A2B3] hover:text-slate-950 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>시연 초기화</span>
          </button>
        )}
      </div>

      {/* Main Operator Dashboard Shell (Single-Elevation, Hairline Border) */}
      <div className="overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-[0_20px_50px_rgba(16,24,40,0.06)]">
        {/* Top Workspace Chrome */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 sm:px-6 py-3.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="hidden sm:flex items-center gap-1.5 shrink-0" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-[#D0D5DD]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#D0D5DD]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#D0D5DD]" />
            </div>
            <span className="text-[13px] font-semibold text-slate-950 truncate">
              ONOFF Builder · 콘텐츠 루틴 운영
            </span>
            <span className="hidden md:inline text-[#D0D5DD]" aria-hidden="true">
              /
            </span>
            <span className="hidden md:inline text-[13px] text-slate-500">
              {NAV_ITEMS.find((n) => n.id === activeTab)?.label}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[12px] text-slate-500">
            <span className="tabular-nums">2026년 11월 예시</span>
            <span aria-hidden="true" className="text-[#D0D5DD]">
              ·
            </span>
            <span className="font-medium text-blue-600">시연 화면 (미연동)</span>
          </div>
        </div>

        {/* Summary KPI Strip (Clean Hairline Grid, Tabular Numerals, Zero Cards-in-Cards) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-[#EAECF0] border-b border-slate-200 bg-white">
          <div className="px-5 py-4">
            <p className="text-[12px] text-slate-500">월간 예정 루틴 (예시)</p>
            <p className="mt-1 text-[22px] font-bold tracking-[-0.02em] tabular-nums text-slate-950">
              {counts.total}건
            </p>
          </div>
          <div className="px-5 py-4">
            <p className="text-[12px] text-slate-500">담당자 검수 대기</p>
            <p className="mt-1 text-[22px] font-bold tracking-[-0.02em] tabular-nums text-[#B45309]">
              {counts.pendingReview}건
            </p>
          </div>
          <div className="px-5 py-4">
            <p className="text-[12px] text-slate-500">예약 확정 (승인 완료)</p>
            <p className="mt-1 text-[22px] font-bold tracking-[-0.02em] tabular-nums text-blue-600">
              {counts.scheduled}건
            </p>
          </div>
          <div className="px-5 py-4">
            <p className="text-[12px] text-slate-500">발행 반영 예시</p>
            <p className="mt-1 text-[22px] font-bold tracking-[-0.02em] tabular-nums text-[#15803D]">
              {counts.publishedSample}건
            </p>
          </div>
        </div>

        {/* Workspace Body: Sidebar + Main Viewport */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[540px]">
          {/* Sidebar Navigation (Desktop) / Horizontal Segmented Tabs (Mobile/Tablet) */}
          <aside className="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-slate-200 bg-slate-50/70 p-3 sm:p-4">
            <p className="hidden lg:block px-3 pb-2 text-[11px] font-semibold text-slate-500">
              운영 메뉴
            </p>
            <nav
              aria-label="루틴 운영 대시보드 시연 메뉴"
              className="flex lg:flex-col gap-1 overflow-x-auto pb-1 lg:pb-0"
            >
              {NAV_ITEMS.map((nav) => {
                const Icon = nav.icon;
                const isActive = activeTab === nav.id;
                const badgeCount = nav.id === 'review' ? counts.pendingReview : null;

                return (
                  <button
                    key={nav.id}
                    type="button"
                    onClick={() => setActiveTab(nav.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex min-h-[40px] items-center justify-between gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-white text-slate-950 shadow-[0_1px_3px_rgba(16,24,40,0.08)] ring-1 ring-[#EAECF0]'
                        : 'text-slate-600 hover:bg-white/60 hover:text-slate-950'
                    }`}
                  >
                    <span className="inline-flex items-center gap-2">
                      <Icon
                        className={`h-4 w-4 shrink-0 ${
                          isActive ? 'text-blue-600' : 'text-slate-500'
                        }`}
                        aria-hidden="true"
                      />
                      <span>{nav.label}</span>
                    </span>
                    {badgeCount !== null && (
                      <span className="text-[12px] font-semibold tabular-nums text-[#B45309]">
                        {badgeCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Active Rule Reference Summary (Desktop Sidebar Footer) */}
            <div className="hidden lg:block mt-6 border-t border-slate-200 pt-5 px-3 space-y-3">
              <p className="text-[11px] font-semibold text-slate-500">적용 중인 루틴 규칙 예시</p>
              <div className="space-y-2.5 text-[12px] leading-[1.55] text-slate-600">
                <div>
                  <p className="font-semibold text-slate-950">발행 주기</p>
                  <p>매주 수·금요일 정기 발행</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-950">품질 원칙</p>
                  <p>담당자 승인 후 예약 확정</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-950">연결 대상</p>
                  <p>홈페이지 인사이트 · 공지 게시판</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Workspace Canvas */}
          <div className="lg:col-span-9 p-4 sm:p-6 lg:p-7 bg-white">
            {demoActionNotice && (
              <div
                role="status"
                className="mb-5 flex items-center justify-between gap-4 rounded-lg border border-[#2563EB]/25 bg-blue-50/60 px-4 py-3 text-[13px] text-slate-950"
              >
                <span>{demoActionNotice}</span>
                <button
                  type="button"
                  onClick={() => setDemoActionNotice(null)}
                  className="text-[12px] font-medium text-blue-600 hover:underline whitespace-nowrap shrink-0 cursor-pointer"
                >
                  닫기
                </button>
              </div>
            )}

            {/* VIEW 1: CONTENT CALENDAR */}
            {activeTab === 'calendar' && (
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
                <div className="xl:col-span-8">
                  <div className="flex items-center justify-between gap-2 pb-4">
                    <div>
                      <h3 className="text-[16px] font-semibold text-slate-950">
                        2026년 11월 콘텐츠 발행 캘린더
                      </h3>
                      <p className="mt-0.5 text-[12px] text-slate-500">
                        예정된 날짜를 선택하면 오른쪽에서 세부 규칙과 진행 상태를 확인할 수
                        있습니다.
                      </p>
                    </div>
                  </div>

                  {/* Mobile-specific schedule list (< sm: zero cramped 7-col scroll) */}
                  <div className="block sm:hidden space-y-2">
                    {items.map((entry) => {
                      const isSelected = entry.id === selectedCalendarItem.id;
                      return (
                        <button
                          key={entry.id}
                          type="button"
                          onClick={() => setSelectedCalendarId(entry.id)}
                          className={`flex w-full items-start justify-between gap-3 rounded-[12px] border p-3.5 text-left transition-colors cursor-pointer ${
                            isSelected
                              ? 'border-[#2563EB] bg-blue-50/60'
                              : 'border-slate-200 bg-white'
                          }`}
                        >
                          <div className="min-w-0">
                            <p className="text-[11.5px] font-semibold tabular-metrics text-slate-500">
                              {entry.scheduledDate} · {entry.scheduledTime}
                            </p>
                            <p className="mt-1 text-[13.5px] font-semibold text-slate-950 leading-snug">
                              {entry.title}
                            </p>
                          </div>
                          <span
                            className={`shrink-0 text-[11.5px] font-semibold ${getStageTextColor(
                              entry.stage
                            )}`}
                          >
                            {entry.stage}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Tablet / Desktop 7-column calendar (sm+) */}
                  <div className="hidden sm:block overflow-x-auto -mx-1 px-1 pb-1">
                    <div className="min-w-0">
                      {/* Weekday Header */}
                      <div className="grid grid-cols-7 border-t border-l border-slate-200 bg-slate-50 text-center text-[11px] font-semibold text-slate-500">
                        {CALENDAR_WEEKDAYS.map((day) => (
                          <div key={day} className="border-r border-b border-slate-200 py-2">
                            {day}
                          </div>
                        ))}
                      </div>

                      {/* 30-day Month Grid */}
                      <div className="grid grid-cols-7 border-l border-slate-200">
                        {NOVEMBER_DAYS.map((day) => {
                          const entry = itemsByDay.get(day);
                          const isSelected = entry?.id === selectedCalendarItem.id;

                          return (
                            <div
                              key={day}
                              className={`min-h-[72px] sm:min-h-[82px] border-r border-b border-slate-200 p-1.5 sm:p-2 transition-colors ${
                                isSelected ? 'bg-blue-50/70' : 'bg-white'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span
                                  className={`text-[11px] tabular-nums ${
                                    entry
                                      ? 'font-semibold text-slate-950'
                                      : 'font-normal text-slate-400'
                                  }`}
                                >
                                  {day}
                                </span>
                                {entry && (
                                  <span
                                    className={`hidden sm:inline text-[10px] font-semibold ${getStageTextColor(
                                      entry.stage
                                    )}`}
                                  >
                                    {entry.stage}
                                  </span>
                                )}
                              </div>

                              {entry && (
                                <button
                                  type="button"
                                  onClick={() => setSelectedCalendarId(entry.id)}
                                  className={`mt-1.5 w-full rounded-md border px-1.5 py-1 text-left transition-colors cursor-pointer ${
                                    isSelected
                                      ? 'border-[#2563EB] bg-white text-slate-950'
                                      : 'border-slate-200 bg-slate-50 text-[#344054] hover:border-[#98A2B3]'
                                  }`}
                                >
                                  <p className="line-clamp-2 text-[10px] sm:text-[11px] font-medium leading-[1.35]">
                                    {entry.title}
                                  </p>
                                </button>
                              )}
                            </div>
                          );
                        })}
                        {/* 5 trailing empty cells to complete 5-week 35-cell grid */}
                        {[1, 2, 3, 4, 5].map((pad) => (
                          <div
                            key={`pad-${pad}`}
                            aria-hidden="true"
                            className="min-h-[72px] sm:min-h-[82px] border-r border-b border-slate-200 bg-slate-50/40"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Selected Calendar Item Inspector */}
                <div className="xl:col-span-4 border-t xl:border-t-0 xl:border-l border-slate-200 pt-5 xl:pt-0 xl:pl-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2 text-[12px]">
                      <span className="font-mono tabular-nums text-slate-500">
                        {selectedCalendarItem.id}
                      </span>
                      <span
                        className={`font-semibold ${getStageTextColor(selectedCalendarItem.stage)}`}
                      >
                        {selectedCalendarItem.stage}
                      </span>
                    </div>

                    <div>
                      <p className="text-[12px] text-blue-600 font-medium">
                        {selectedCalendarItem.category} · {selectedCalendarItem.targetSection}
                      </p>
                      <h4 className="mt-1.5 text-[16px] font-semibold leading-snug text-slate-950">
                        {selectedCalendarItem.title}
                      </h4>
                    </div>

                    <div className="divide-y divide-[#EAECF0] border-y border-slate-200 text-[13px]">
                      <div className="flex items-center justify-between py-2.5">
                        <span className="text-slate-500">예정 일정</span>
                        <span className="font-medium tabular-nums text-slate-950">
                          {selectedCalendarItem.scheduledDate} {selectedCalendarItem.scheduledTime}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2.5">
                        <span className="text-slate-500">적용 규칙</span>
                        <span className="font-medium text-slate-950 text-right">
                          {selectedCalendarItem.ruleName}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2.5">
                        <span className="text-slate-500">담당 상태</span>
                        <span className="font-medium text-slate-950">
                          {selectedCalendarItem.reviewer}
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-[12px] font-semibold text-slate-500">초안 핵심 목차</p>
                      <ul className="mt-2 space-y-1.5 text-[13px] leading-[1.55] text-slate-600">
                        {selectedCalendarItem.outline.map((line, i) => (
                          <li key={line} className="flex items-start gap-2">
                            <span className="tabular-nums text-[12px] font-semibold text-blue-600">
                              0{i + 1}
                            </span>
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {selectedCalendarItem.stage === '검수 대기' && (
                    <div className="mt-6 pt-4 border-t border-slate-200">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedReviewId(selectedCalendarItem.id);
                          setActiveTab('review');
                        }}
                        className="w-full min-h-[40px] rounded-lg bg-[#101828] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#1D2939] transition-colors cursor-pointer"
                      >
                        검수 대기 화면에서 확인하기
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* VIEW 2: PENDING REVIEW QUEUE */}
            {activeTab === 'review' && (
              <div>
                <div className="pb-5 border-b border-slate-200">
                  <h3 className="text-[16px] font-semibold text-slate-950">
                    담당자 검수 대기 목록
                  </h3>
                  <p className="mt-1 text-[13px] text-slate-500">
                    AI가 규칙에 맞춰 작성한 초안을 확인하고, 사실 관계와 브랜드 어조 점검 후
                    승인하는 시연 화면입니다.
                  </p>
                </div>

                {reviewItems.length === 0 ? (
                  <div className="py-16 text-center space-y-3">
                    <p className="text-[15px] font-semibold text-slate-950">
                      현재 시연 목록에 남아 있는 검수 대기 항목이 없습니다.
                    </p>
                    <p className="text-[13px] text-slate-500">
                      모든 시연 항목이 예약 확정 상태로 이동했습니다. 초기 상태로 되돌려 다시
                      확인할 수 있습니다.
                    </p>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleResetDemo}
                        className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-[13px] font-medium text-slate-950 hover:border-[#98A2B3] transition-colors cursor-pointer"
                      >
                        <RotateCcw className="h-4 w-4" aria-hidden="true" />
                        <span>시연 데이터 초기화</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-5 grid grid-cols-1 gap-6 xl:grid-cols-12">
                    {/* Queue List */}
                    <div className="xl:col-span-5 divide-y divide-[#EAECF0] border border-slate-200 rounded-xl overflow-hidden self-start">
                      {reviewItems.map((item) => {
                        const active = selectedReviewItem?.id === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setSelectedReviewId(item.id)}
                            className={`w-full p-4 text-left transition-colors cursor-pointer ${
                              active
                                ? 'bg-blue-50/60'
                                : 'bg-white hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 text-[12px]">
                              <span className="font-mono tabular-nums text-slate-500">
                                {item.id}
                              </span>
                              <span className="font-semibold text-[#B45309]">검수 대기</span>
                            </div>
                            <p className="mt-1.5 text-[14px] font-semibold leading-snug text-slate-950">
                              {item.title}
                            </p>
                            <p className="mt-1.5 text-[12px] text-slate-500 tabular-nums">
                              예정 {item.scheduledDate} · {item.targetSection}
                            </p>
                          </button>
                        );
                      })}
                    </div>

                    {/* Active Draft Review Panel */}
                    {selectedReviewItem && (
                      <div className="xl:col-span-7 space-y-5">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2 text-[12px] text-slate-500">
                            <span className="font-semibold text-blue-600">
                              {selectedReviewItem.category}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="tabular-nums">
                              발행 예정 {selectedReviewItem.scheduledDate}{' '}
                              {selectedReviewItem.scheduledTime}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>{selectedReviewItem.ruleName}</span>
                          </div>
                          <h4 className="text-[18px] font-bold leading-snug tracking-[-0.02em] text-slate-950">
                            {selectedReviewItem.title}
                          </h4>
                          <p className="text-[13px] leading-[1.65] text-slate-600">
                            {selectedReviewItem.summaryNote}
                          </p>
                        </div>

                        {/* Draft Structure Preview */}
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                          <div className="flex items-center gap-2 text-[12px] font-semibold text-slate-950">
                            <FileText className="h-4 w-4 text-blue-600" aria-hidden="true" />
                            <span>AI 초안 구조 요약 (시연용)</span>
                          </div>
                          <ol className="mt-3 space-y-2 text-[13px] leading-[1.6] text-[#344054]">
                            {selectedReviewItem.outline.map((sec, idx) => (
                              <li key={sec} className="flex items-start gap-2.5">
                                <span className="font-semibold tabular-nums text-blue-600">
                                  {idx + 1}.
                                </span>
                                <span>{sec}</span>
                              </li>
                            ))}
                          </ol>
                        </div>

                        {/* Interactive Reviewer Checklist */}
                        <div className="space-y-2.5">
                          <p className="text-[12px] font-semibold text-slate-500">
                            담당자 검수 체크리스트 (클릭해 시연해 보세요)
                          </p>
                          {(
                            [
                              {
                                key: 'factChecked',
                                label: '사실 관계 및 서비스 제공 범위 표현 확인',
                              },
                              {
                                key: 'toneChecked',
                                label: '과장·단정 표현 제외 및 브랜드 어조 점검',
                              },
                              {
                                key: 'linkChecked',
                                label: '홈페이지 관련 페이지·상담 링크 연결 확인',
                              },
                            ] as const
                          ).map((checkItem) => {
                            const checked = selectedReviewItem.checks[checkItem.key];
                            return (
                              <button
                                key={checkItem.key}
                                type="button"
                                onClick={() =>
                                  handleToggleCheck(selectedReviewItem.id, checkItem.key)
                                }
                                className="flex w-full items-center gap-3 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-left text-[13px] hover:border-slate-300 transition-colors cursor-pointer"
                              >
                                <span
                                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                                    checked
                                      ? 'border-[#2563EB] bg-[#2563EB] text-white'
                                      : 'border-slate-300 bg-white'
                                  }`}
                                  aria-hidden="true"
                                >
                                  {checked && <Check className="h-3 w-3" />}
                                </span>
                                <span
                                  className={
                                    checked ? 'text-slate-950 font-medium' : 'text-slate-600'
                                  }
                                >
                                  {checkItem.label}
                                </span>
                              </button>
                            );
                          })}
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-t border-slate-200 pt-4">
                          <p className="text-[12px] text-slate-500">
                            시연 버튼이며 실제 홈페이지에 발행되지 않습니다.
                          </p>
                          <button
                            type="button"
                            onClick={() => handleDemoApprove(selectedReviewItem)}
                            className="inline-flex min-h-[40px] items-center justify-center rounded-lg bg-[#2563EB] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#1D4ED8] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                          >
                            검수 완료 · 예약 확정 (시연)
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* VIEW 3: PUBLISHING STATUS TABLE */}
            {activeTab === 'status' && (
              <div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-5">
                  <div>
                    <h3 className="text-[16px] font-semibold text-slate-950">
                      단계별 발행 상태 현황
                    </h3>
                    <p className="mt-0.5 text-[12px] text-slate-500">
                      주제 규칙 설정부터 초안, 검수, 예약, 발행까지 한눈에 필터링하는 시연
                      테이블입니다.
                    </p>
                  </div>
                </div>

                {/* Segmented Filter Bar */}
                <div
                  role="tablist"
                  aria-label="발행 상태 필터"
                  className="mb-4 flex flex-wrap items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1"
                >
                  {STATUS_FILTERS.map((filter) => {
                    const active = statusFilter === filter;
                    return (
                      <button
                        key={filter}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => setStatusFilter(filter)}
                        className={`min-h-[34px] rounded-md px-3 py-1 text-[12px] font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          active
                            ? 'bg-white text-slate-950 shadow-[0_1px_2px_rgba(16,24,40,0.08)]'
                            : 'text-slate-500 hover:text-slate-950'
                        }`}
                      >
                        {filter}
                      </button>
                    );
                  })}
                </div>

                {/* Mobile-specific stacked status cards (< sm) */}
                <div className="block sm:hidden space-y-2.5">
                  {filteredStatusItems.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-[12px] border border-slate-200 bg-white p-4 space-y-1.5"
                    >
                      <div className="flex items-center justify-between gap-2 text-[11.5px]">
                        <span className="font-mono tabular-metrics text-slate-500">{item.id}</span>
                        <span className={`font-semibold ${getStageTextColor(item.stage)}`}>
                          {item.stage}
                        </span>
                      </div>
                      <p className="text-[13.5px] font-semibold text-slate-950">{item.title}</p>
                      <p className="text-[12px] text-slate-500">
                        {item.targetSection} ·{' '}
                        <span className="tabular-metrics">
                          {item.scheduledDate} {item.scheduledTime}
                        </span>
                      </p>
                    </div>
                  ))}
                  {filteredStatusItems.length === 0 && (
                    <p className="rounded-[12px] border border-slate-200 py-8 text-center text-[13px] text-slate-500">
                      선택한 단계에 해당하는 시연 항목이 없습니다.
                    </p>
                  )}
                </div>

                {/* High-Density Data Grid (sm+) */}
                <div className="hidden sm:block overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full min-w-[600px] border-collapse text-left">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-[12px] font-semibold text-slate-500">
                        <th className="py-3 pl-4 pr-3">ID</th>
                        <th className="py-3 px-3">콘텐츠 제목 (예시)</th>
                        <th className="py-3 px-3">게시 영역</th>
                        <th className="py-3 px-3">진행 단계</th>
                        <th className="py-3 pl-3 pr-4 text-right">예정 일시</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EAECF0] text-[13px]">
                      {filteredStatusItems.map((item) => (
                        <tr
                          key={item.id}
                          className="hover:bg-slate-50/80 transition-colors"
                        >
                          <td className="py-3.5 pl-4 pr-3 font-mono text-[12px] tabular-nums text-slate-500 whitespace-nowrap">
                            {item.id}
                          </td>
                          <td className="py-3.5 px-3">
                            <p className="font-medium text-slate-950">{item.title}</p>
                            <p className="mt-0.5 text-[12px] text-slate-500">{item.ruleName}</p>
                          </td>
                          <td className="py-3.5 px-3 text-slate-600 whitespace-nowrap">
                            {item.targetSection}
                          </td>
                          <td
                            className={`py-3.5 px-3 font-semibold whitespace-nowrap ${getStageTextColor(
                              item.stage
                            )}`}
                          >
                            {item.stage}
                          </td>
                          <td className="py-3.5 pl-3 pr-4 text-right font-mono text-[12px] tabular-nums text-slate-600 whitespace-nowrap">
                            {item.scheduledDate} {item.scheduledTime}
                          </td>
                        </tr>
                      ))}
                      {filteredStatusItems.length === 0 && (
                        <tr>
                          <td
                            colSpan={5}
                            className="py-10 text-center text-[13px] text-slate-500"
                          >
                            선택한 단계에 해당하는 시연 항목이 없습니다.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* VIEW 4: EXECUTION & REVIEW HISTORY */}
            {activeTab === 'history' && (
              <div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-4">
                  <div>
                    <h3 className="text-[16px] font-semibold text-slate-950">
                      콘텐츠 루틴 진행 이력
                    </h3>
                    <p className="mt-0.5 text-[12px] text-slate-500">
                      규칙 설정, 초안 생성, 담당자 승인, 예약 반영 이력을 투명하게 남기는 시연
                      기록입니다.
                    </p>
                  </div>

                  <div
                    role="tablist"
                    aria-label="진행 이력 분류 필터"
                    className="inline-flex flex-wrap items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1 self-start sm:self-auto"
                  >
                    {HISTORY_FILTERS.map((cat) => {
                      const active = historyFilter === cat;
                      return (
                        <button
                          key={cat}
                          type="button"
                          role="tab"
                          aria-selected={active}
                          onClick={() => setHistoryFilter(cat)}
                          className={`min-h-[32px] rounded-md px-2.5 py-1 text-[12px] font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                            active
                              ? 'bg-white text-slate-950 shadow-[0_1px_2px_rgba(16,24,40,0.08)]'
                              : 'text-slate-500 hover:text-slate-950'
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="divide-y divide-[#EAECF0] rounded-xl border border-slate-200">
                  {filteredHistoryLogs.map((log) => (
                    <div
                      key={log.id}
                      className="flex flex-col gap-2 px-4 sm:px-5 py-4 sm:flex-row sm:items-start sm:justify-between"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 text-[12px]">
                          <span className="font-semibold text-blue-600">{log.category}</span>
                          <span aria-hidden="true" className="text-[#D0D5DD]">
                            ·
                          </span>
                          <span className="font-semibold text-slate-950">{log.action}</span>
                        </div>
                        <p className="text-[14px] font-medium text-slate-950">{log.targetTitle}</p>
                        <p className="text-[12px] leading-[1.55] text-slate-500">{log.note}</p>
                      </div>
                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 text-[12px] text-slate-500 shrink-0">
                        <span className="inline-flex items-center gap-1 font-mono tabular-nums">
                          <Clock className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                          {log.timestamp}
                        </span>
                        <span>{log.actor}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
