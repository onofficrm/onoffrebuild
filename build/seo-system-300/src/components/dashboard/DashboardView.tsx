import React from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckSquare2,
  AlertTriangle,
  Plus,
  Compass,
  LayoutTemplate,
  FolderKanban,
  Link2,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Project, DailyMission, NavigationTab, ActivityLog, AiCoachInsight } from '../../types';
import type { MetricsSummary } from '../../services/metricsService';
import type { ApiWebsiteOrder } from '../../services/websiteOrderService';
import { WEBSITE_ORDER_STATUS_LABEL } from '../../constants/seoSystem300';
import { Button } from '../common/Button';
import { HelpTooltip } from '../common/HelpTooltip';

export interface DashboardViewProps {
  project: Project | null;
  missions: DailyMission[];
  onToggleMission: (id: string) => void;
  onNavigate: (tab: NavigationTab, subTab?: string) => void;
  coachInsight?: AiCoachInsight;
  activities: ActivityLog[];
  onOpenOnboarding?: () => void;
  metricsSummary?: MetricsSummary | null;
  metricsTimeseries?: Array<{ date: string; impressions: number; clicks: number }>;
  unified?: Record<string, unknown> | null;
  liveWebsiteOrder?: ApiWebsiteOrder | null;
  adminAttentionNotice?: {
    title: string;
    description: string;
    actionTab: NavigationTab;
    actionSubTab?: string;
    actionText: string;
  };
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  project,
  missions,
  onToggleMission,
  onNavigate,
  coachInsight,
  activities,
  onOpenOnboarding,
  metricsSummary = null,
  metricsTimeseries = [],
  unified = null,
  liveWebsiteOrder = null,
  adminAttentionNotice
}) => {
  if (!project) {
    return (
      <div className="relative overflow-hidden rounded-[28px] border border-[#E2E8F0] bg-[linear-gradient(160deg,#F8FAFC_0%,#FFFFFF_42%,#EFF6FF_100%)]">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              'radial-gradient(circle at 12% 18%, rgba(37,99,235,0.12), transparent 34%), radial-gradient(circle at 88% 8%, rgba(15,23,42,0.08), transparent 28%)',
          }}
        />
        <div className="relative grid gap-8 p-8 sm:p-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-10 lg:p-12">
          <div className="space-y-6 text-left">
            <div>
              <p className="text-[11px] font-black tracking-[0.14em] text-[#2563EB] uppercase">SEO SYSTEM 300</p>
              <h1 className="mt-3 text-2xl font-black tracking-tight text-[#0F172A] sm:text-3xl">
                Control Center에서
                <br className="hidden sm:block" />
                SEO 프로젝트를 시작하세요
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#64748B]">
                홈페이지 제작부터 로드맵·미션·성과까지 한곳에서 진행합니다. 먼저 프로젝트를 만들면 대시보드가 채워집니다.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="primary"
                size="lg"
                leftIcon={<Plus className="h-4 w-4" />}
                onClick={() => onOpenOnboarding?.()}
                className="rounded-2xl px-5 py-3 text-sm font-bold shadow-xs"
              >
                새 프로젝트 만들기
              </Button>
              <button
                type="button"
                onClick={() => onNavigate('website', 'order')}
                className="inline-flex items-center gap-2 rounded-2xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm font-bold text-[#0F172A] transition hover:border-[#CBD5E1] hover:bg-[#F8FAFC]"
              >
                <LayoutTemplate className="h-4 w-4 text-[#2563EB]" />
                홈페이지 주문 안내
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {[
              {
                step: '01',
                title: '프로젝트 생성',
                desc: '도메인·니치·목표를 등록합니다.',
                icon: <FolderKanban className="h-4 w-4" />,
                action: () => onOpenOnboarding?.(),
              },
              {
                step: '02',
                title: '홈페이지 주문',
                desc: '제작 요청과 진행 현황을 관리합니다.',
                icon: <LayoutTemplate className="h-4 w-4" />,
                action: () => onNavigate('website', 'order'),
              },
              {
                step: '03',
                title: 'SEO Roadmap',
                desc: '10단계 로드맵과 오늘의 미션을 실행합니다.',
                icon: <Compass className="h-4 w-4" />,
                action: () => onNavigate('roadmap'),
              },
            ].map((item) => (
              <button
                key={item.step}
                type="button"
                onClick={item.action}
                className="flex w-full items-start gap-3 rounded-2xl border border-[#E2E8F0] bg-white/90 p-4 text-left shadow-2xs transition hover:border-[#BFDBFE] hover:bg-white"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
                  {item.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-black text-[#94A3B8]">{item.step}</span>
                    <span className="text-sm font-black text-[#0F172A]">{item.title}</span>
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-[#64748B]">{item.desc}</span>
                </span>
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-[#94A3B8]" />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }
  const completedMissionsCount = missions.filter((m) => m.isCompleted).length;
  const totalMissionsCount = missions.length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col gap-6 rounded-[28px] border border-[#E2E8F0] bg-white p-6 shadow-2xs sm:p-7 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl space-y-2">
          <p className="text-[11px] font-black tracking-[0.12em] text-[#2563EB] uppercase">SEO SYSTEM 300</p>
          <h1 className="text-xl font-black tracking-tight text-[#0F172A] sm:text-2xl">
            {project.name}
          </h1>
          <p className="text-sm leading-relaxed text-[#64748B]">
            {project.domain || '도메인 미등록'}
            {project.websiteStatusLabel ? ` · 홈페이지 ${project.websiteStatusLabel}` : ''}
            {' · '}
            현재 단계 {project.currentStepNumber || '-'} · {project.currentStepTitle || project.currentStep || '로드맵 준비'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <Button
            variant="primary"
            size="lg"
            rightIcon={<ArrowRight className="h-4 w-4" />}
            onClick={() => onNavigate('roadmap')}
            className="rounded-2xl px-5 py-3 text-sm font-bold shadow-xs"
          >
            로드맵 이어서 하기
          </Button>

          <div className="min-w-[140px]">
            <div className="mb-1 flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
              <span>전체 진행률</span>
              <HelpTooltip
                term="로드맵 진행률"
                explanation="10단계 SEO 로드맵 체크리스트 완료 비율입니다."
              />
            </div>
            <div className="font-mono text-2xl font-black tracking-tight text-[#2563EB]">
              {project.overallProgress}%
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#F1F5F9]">
              <div
                className="h-full rounded-full bg-[#2563EB] transition-all duration-700"
                style={{ width: `${project.overallProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-4 rounded-[28px] border border-[#DBEAFE] bg-[linear-gradient(120deg,#EFF6FF_0%,#FFFFFF_55%,#F8FAFC_100%)] p-5 sm:p-6 md:flex-row md:items-center">
        <div className="flex items-start gap-3.5 sm:items-center">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#2563EB] text-sm font-black text-white shadow-xs">
            {project.currentStepNumber || '·'}
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wide text-[#2563EB]">
              지금 진행 중 · {project.currentStep || 'STEP'}
            </div>
            <h2 className="text-base font-black text-[#0F172A] sm:text-lg">
              {project.currentStepTitle || '로드맵 단계를 선택하세요'}
            </h2>
            <p className="mt-0.5 text-xs text-[#64748B]">
              오늘의 미션과 로드맵 체크리스트를 순서대로 완료하세요.
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="md"
          rightIcon={<ArrowRight className="h-4 w-4" />}
          onClick={() => onNavigate('roadmap')}
          className="shrink-0 rounded-xl px-4 py-2.5 text-xs font-bold shadow-xs"
        >
          이 단계 열기
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-5">
          <div className="space-y-4 rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-2xs sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare2 className="h-4 w-4 text-[#2563EB]" />
                <h3 className="text-sm font-black text-[#0F172A] sm:text-base">오늘 해야 할 일</h3>
              </div>
              <span className="rounded-full border border-[#DBEAFE] bg-[#EFF6FF] px-2.5 py-1 text-xs font-bold text-[#2563EB]">
                {completedMissionsCount} / {totalMissionsCount}
              </span>
            </div>

            <div className="space-y-2.5">
              {missions.length === 0 ? (
                <p className="py-4 text-center text-xs text-slate-400">오늘 표시할 미션이 없습니다.</p>
              ) : null}
              {missions.slice(0, 4).map((mission) => {
                const isDone = mission.isCompleted;
                return (
                  <div
                    key={mission.id}
                    onClick={() => onToggleMission(mission.id)}
                    className={`flex cursor-pointer items-center rounded-2xl border p-3.5 transition-all ${
                      isDone
                        ? 'border-[#E2E8F0] bg-[#F8FAFC] opacity-80'
                        : 'border-[#DBEAFE] bg-white hover:border-[#2563EB]'
                    }`}
                  >
                    <div
                      className={`mr-3 flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px] transition-colors ${
                        isDone
                          ? 'bg-[#10B981] font-bold text-white'
                          : 'border-2 border-[#CBD5E1] bg-white hover:border-[#2563EB]'
                      }`}
                    >
                      {isDone && '✓'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span
                        className={`block truncate text-xs font-bold ${
                          isDone ? 'text-[#94A3B8] line-through' : 'text-[#0F172A]'
                        }`}
                      >
                        {mission.title}
                      </span>
                    </div>
                    <span className="ml-2 shrink-0 rounded-md bg-[#EFF6FF] px-2 py-0.5 font-mono text-[10px] font-bold text-[#2563EB]">
                      +{mission.xpReward}P
                    </span>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => onNavigate('missions')}
              className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-[#DBEAFE] bg-[#EFF6FF] py-2.5 text-xs font-bold text-[#2563EB] transition-colors hover:bg-blue-100"
            >
              <span>오늘의 미션 전체보기</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {liveWebsiteOrder ? (
            <div className="space-y-3 rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-2xs sm:p-6">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#2563EB]">내 홈페이지</span>
                  <h4 className="mt-1 text-sm font-black text-[#0F172A]">
                    {WEBSITE_ORDER_STATUS_LABEL[liveWebsiteOrder.status] || liveWebsiteOrder.status}
                  </h4>
                  <p className="mt-1 text-xs text-[#64748B]">
                    Progress {liveWebsiteOrder.processStep || 0} / {liveWebsiteOrder.processTotal || 7}
                    {liveWebsiteOrder.orderNo ? ` · ${liveWebsiteOrder.orderNo}` : ''}
                  </p>
                </div>
                <Button variant="primary" size="sm" onClick={() => onNavigate('website', 'status')}>
                  제작현황
                </Button>
              </div>
              {liveWebsiteOrder.status === 'need_more_info' ? (
                <p className="text-xs font-bold text-amber-700">추가 자료가 필요합니다</p>
              ) : null}
            </div>
          ) : null}

          {adminAttentionNotice && (
            <div className="space-y-3 rounded-[28px] border border-amber-200 bg-amber-50/70 p-5 shadow-2xs sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <span className="text-xs font-black uppercase text-amber-900">관리자 요청</span>
                </div>
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#0F172A]">{adminAttentionNotice.title}</h4>
                <p className="mt-1 text-xs leading-relaxed text-[#64748B]">
                  {adminAttentionNotice.description}
                </p>
              </div>
              <button
                onClick={() => onNavigate(adminAttentionNotice.actionTab, adminAttentionNotice.actionSubTab)}
                className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-amber-500 py-2 text-xs font-bold text-white shadow-xs transition-colors hover:bg-amber-600"
              >
                <span>{adminAttentionNotice.actionText}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          <div className="space-y-3.5 rounded-[28px] border border-slate-800 bg-[#0F172A] p-5 text-white shadow-lg sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-blue-400" />
                <h3 className="text-sm font-bold text-white">AI SEO Coach</h3>
              </div>
              <span className="rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-[10px] font-bold text-slate-200">
                {unified?.aiConfigured ? '준비됨' : '설정 필요'}
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-300">
              {unified?.aiConfigured
                ? '분석은 요청 시에만 생성됩니다. 새로고침마다 호출하지 않습니다.'
                : 'AI Coach는 Provider 설정 후 사용할 수 있습니다. 가짜 추천은 표시하지 않습니다.'}
            </p>
            <button
              onClick={() => onNavigate('ai_coach')}
              className="mt-2 w-full cursor-pointer rounded-xl border border-white/20 bg-white/10 py-2.5 text-xs font-bold text-white transition-all hover:bg-white/20"
            >
              AI Coach 열기 →
            </button>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-7">
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
            {[
              {
                label: 'Google 노출',
                tip: '구글 검색 결과에 노출된 횟수입니다.',
                value:
                  metricsSummary?.impressions.value != null
                    ? metricsSummary.impressions.value.toLocaleString()
                    : metricsSummary?.impressions.state || '연결 필요',
                change: metricsSummary?.impressionsChangePct,
                state: metricsSummary?.impressions.state,
              },
              {
                label: 'Google 클릭',
                tip: '검색 결과에서 실제 클릭된 횟수입니다.',
                value:
                  metricsSummary?.clicks.value != null
                    ? metricsSummary.clicks.value.toLocaleString()
                    : metricsSummary?.clicks.state || '연결 필요',
                change: metricsSummary?.clicksChangePct,
                state: metricsSummary?.clicks.state,
              },
              {
                label: '평균 게재순위',
                tip: '낮을수록 검색 상단에 가깝습니다.',
                value:
                  metricsSummary?.avgPosition.value != null
                    ? metricsSummary.avgPosition.value.toFixed(1)
                    : metricsSummary?.avgPosition.state || '연결 필요',
                change: null,
                state: metricsSummary?.avgPosition.state,
              },
              {
                label: '자연검색 방문',
                tip: 'GA4 Organic Search 세션 수입니다.',
                value:
                  metricsSummary?.organicSessions.value != null
                    ? metricsSummary.organicSessions.value.toLocaleString()
                    : metricsSummary?.organicSessions.state || '연결 필요',
                change: metricsSummary?.organicSessionsChangePct,
                state: metricsSummary?.organicSessions.state,
              },
            ].map((kpi) => (
              <div key={kpi.label} className="space-y-1 rounded-[24px] border border-[#E2E8F0] bg-white p-4 shadow-2xs">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold text-[#64748B]">{kpi.label}</span>
                  <HelpTooltip term={kpi.label} explanation={kpi.tip} />
                </div>
                {kpi.state === 'ready' ? null : (
                  <span className="inline-flex rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-black text-slate-600">
                    {kpi.state || '연결 필요'}
                  </span>
                )}
                <div className="font-mono text-lg font-black text-[#0F172A] sm:text-xl">{kpi.value}</div>
                <span className="block font-mono text-[11px] font-bold text-slate-500">
                  {kpi.change == null
                    ? '비교 데이터 없음'
                    : `${kpi.change > 0 ? '+' : ''}${kpi.change.toFixed(1)}% 전기간비`}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3 rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-2xs sm:p-6">
            <div>
              <span className="text-[10px] font-bold uppercase text-[#2563EB]">빠른 이동</span>
              <p className="mt-1 text-sm font-black text-[#0F172A]">데이터 연동 · 성과 · 프로젝트</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onNavigate('integrations')}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2E8F0] px-3 py-2 text-xs font-bold text-[#64748B] hover:bg-[#F8FAFC]"
              >
                <Link2 className="h-3.5 w-3.5" />
                데이터 연결
              </button>
              <button
                type="button"
                onClick={() => onNavigate('reports')}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2E8F0] px-3 py-2 text-xs font-bold text-[#64748B] hover:bg-[#F8FAFC]"
              >
                성과 리포트
              </button>
              <button
                type="button"
                onClick={() => onNavigate('projects')}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2E8F0] px-3 py-2 text-xs font-bold text-[#64748B] hover:bg-[#F8FAFC]"
              >
                프로젝트
              </button>
            </div>
          </div>

          <div className="space-y-4 rounded-[28px] border border-[#E2E8F0] bg-white p-6 shadow-2xs">
            <div className="flex flex-col justify-between gap-3 border-b border-[#F1F5F9] pb-3 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-base font-black text-[#0F172A] sm:text-lg">최근 활동</h3>
                <p className="text-xs text-[#64748B]">프로젝트에서 실행한 작업 기록</p>
              </div>
              <Button
                variant="primary"
                size="sm"
                rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                onClick={() => onNavigate('roadmap')}
                className="text-xs font-bold"
              >
                로드맵 열기
              </Button>
            </div>
            {activities.length === 0 ? (
              <p className="text-xs text-slate-400">아직 작업 기록이 없습니다.</p>
            ) : (
              <div className="space-y-2">
                {activities.slice(0, 6).map((a) => (
                  <div key={a.id} className="flex justify-between gap-2 text-xs text-slate-600">
                    <span className="truncate">{a.action}</span>
                    <span className="shrink-0 font-mono text-slate-400">{a.timestamp.slice(0, 16)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-[28px] border border-[#E2E8F0] bg-white p-6 shadow-2xs">
            <div className="mb-4 flex min-w-0 flex-col justify-between gap-3 sm:flex-row sm:items-start">
              <div className="min-w-0">
                <h3 className="flex items-center gap-1.5 break-words text-sm font-bold text-[#0F172A] sm:text-base">
                  <span>Google 노출 & 클릭 트렌드</span>
                  <HelpTooltip
                    term="GSC 트렌드 차트"
                    explanation="Search Console에서 집계된 일별 노출·클릭입니다."
                  />
                </h3>
                <p className="text-xs text-[#64748B]">Search Console 동기화 데이터</p>
              </div>
              <button
                onClick={() => onNavigate('reports')}
                className="cursor-pointer text-xs font-bold text-[#2563EB] hover:underline"
              >
                상세 리포트 →
              </button>
            </div>

            <div className="h-52 w-full min-w-0 overflow-hidden">
              {metricsTimeseries.length === 0 ? (
                <p className="pt-8 text-sm text-slate-400">차트 데이터 없음 — Search Console 연결 후 동기화하세요.</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={metricsTimeseries}>
                    <defs>
                      <linearGradient id="colorImp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        borderRadius: '16px',
                        border: 'none',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="impressions"
                      name="Google 노출"
                      stroke="#2563EB"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorImp)"
                    />
                    <Area
                      type="monotone"
                      dataKey="clicks"
                      name="Google 클릭"
                      stroke="#10B981"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorClicks)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
