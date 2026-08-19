import React from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Circle,
  TrendingUp,
  Globe2,
  CheckSquare2,
  ExternalLink,
  Flame,
  LayoutTemplate,
  FileText,
  Link2,
  Activity,
  Layers,
  Wrench,
  ChevronRight,
  Clock,
  Bot,
  Plus,
  Compass,
  AlertTriangle,
  HelpCircle,
  ShieldCheck,
  Zap
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
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';
import { StatCard } from '../common/StatCard';
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
  adminAttentionNotice = {
    title: '홈페이지 1차 디자인 시안 검수 대기',
    description: '전문 디자이너가 제작한 5개 페이지 반응형 디자인 시안이 등록되었습니다. 검수 후 수정을 요청하거나 최종 승인해주세요.',
    actionTab: 'website',
    actionSubTab: 'status',
    actionText: '시안 검수하러 가기'
  }
}) => {
  if (!project) {
    return (
      <div className="bg-white rounded-3xl p-10 border border-[#E2E8F0] text-center space-y-4">
        <h1 className="text-xl font-black text-[#0F172A]">첫 SEO 프로젝트를 시작해보세요.</h1>
        <p className="text-sm text-[#64748B]">프로젝트를 만들면 대시보드에 이름, 도메인, 홈페이지 상태가 표시됩니다.</p>
        <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />} onClick={() => onOpenOnboarding?.()}>
          새 프로젝트 만들기
        </Button>
      </div>
    );
  }
  const completedMissionsCount = missions.filter((m) => m.isCompleted).length;
  const totalMissionsCount = missions.length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ========================================================================= */}
      {/* 1. Core Service Identity & Master Greeting Banner */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-[#E2E8F0] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE]">
              SEO SYSTEM 300
            </span>
            <span className="text-xs font-medium text-[#64748B] flex items-center gap-1">
              <span>●</span>
              <span>수익형 웹사이트 Control Center</span>
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
            홈페이지 제작부터 SEO 성장까지 순서대로 따라가기만 하세요.
          </h1>

          <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
            도메인, 홈페이지, 콘텐츠, 백링크, 트래픽을 하나의{' '}
            <strong className="text-[#0F172A]">SEO Roadmap</strong>에서 체계적으로 관리합니다.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          {/* Create New Project CTA */}
          <Button
            variant="primary"
            size="lg"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => {
              if (onOpenOnboarding) onOpenOnboarding();
            }}
            className="shadow-xs font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl bg-[#2563EB] hover:bg-blue-700"
          >
            새 프로젝트 생성
          </Button>

          <div className="h-10 w-px bg-[#E2E8F0] hidden sm:block" />

          {/* 1. 전체 진행률 (Overall Progress) */}
          <div className="text-left sm:text-right">
            <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-0.5 flex items-center gap-1">
              <span>전체 로드맵 진행률</span>
              <HelpTooltip
                term="로드맵 진행률"
                explanation="10단계 SEO 로드맵의 총 32개 체크리스트 중 완료된 비율입니다. 단계별 작업을 마칠 때마다 상승합니다."
              />
            </div>
            <div className="text-2xl font-black text-[#2563EB] tracking-tight font-mono">
              {project.overallProgress}%
            </div>
          </div>

          <div className="w-28 sm:w-36 h-2.5 bg-[#F1F5F9] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#2563EB] rounded-full transition-all duration-700"
              style={{ width: `${project.overallProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. 현재 단계 (Current Active Step Hero Card) */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-[#EFF6FF] via-white to-[#F8FAFC] border-2 border-[#DBEAFE] rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#2563EB] text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
            {project.currentStepNumber || 5}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wide">
                NOW RUNNING: {project.currentStep}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <h2 className="text-base sm:text-lg font-black text-[#0F172A]">
              {project.currentStepTitle || 'Silo 구조 키워드 설계 및 클러스터링'}
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              기둥 콘텐츠(Pillar)와 하위 클러스터를 연결해 검색 엔진 최적의 구조를 완성하는 단계입니다.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="primary"
            size="md"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            onClick={() => onNavigate('roadmap')}
            className="text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs"
          >
            지금 이 단계 실행하기
          </Button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. Main 12-Column Grid */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): Today's Missions + Admin Attention Box + AI Coach */}
        <div className="lg:col-span-5 space-y-6">
          {/* 3. 오늘 해야 할 일 (Today's Missions) */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-[#E2E8F0] space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <CheckSquare2 className="w-4 h-4 text-[#2563EB]" />
                <h3 className="font-black text-[#0F172A] text-sm sm:text-base">오늘 해야 할 일 (Today)</h3>
              </div>
              <span className="text-xs font-bold bg-[#EFF6FF] text-[#2563EB] px-2.5 py-1 rounded-full border border-[#DBEAFE]">
                {completedMissionsCount} / {totalMissionsCount} 완료
              </span>
            </div>

            <div className="space-y-2.5">
              {missions.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">오늘 표시할 미션이 없습니다. 프로젝트를 선택하면 생성됩니다.</p>
              ) : null}
              {missions.slice(0, 4).map((mission) => {
                const isDone = mission.isCompleted;
                return (
                  <div
                    key={mission.id}
                    onClick={() => onToggleMission(mission.id)}
                    className={`flex items-center p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isDone
                        ? 'bg-[#F8FAFC] border-[#E2E8F0] opacity-80'
                        : 'bg-white border-[#DBEAFE] hover:border-[#2563EB] shadow-2xs'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] mr-3 shrink-0 transition-colors ${
                        isDone
                          ? 'bg-[#10B981] text-white font-bold'
                          : 'border-2 border-[#CBD5E1] bg-white hover:border-[#2563EB]'
                      }`}
                    >
                      {isDone && '✓'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span
                        className={`text-xs font-bold block truncate ${
                          isDone ? 'text-[#94A3B8] line-through' : 'text-[#0F172A]'
                        }`}
                      >
                        {mission.title}
                      </span>
                      <span className="text-[10px] text-[#64748B] block truncate mt-0.5 font-medium">
                        오늘의 미션
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-[#2563EB] ml-2 shrink-0 bg-[#EFF6FF] px-2 py-0.5 rounded-md font-mono">
                      +{mission.xpReward}P
                    </span>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => onNavigate('missions')}
              className="w-full py-2.5 bg-[#EFF6FF] hover:bg-blue-100 text-[#2563EB] font-bold rounded-xl text-xs transition-colors cursor-pointer border border-[#DBEAFE] flex items-center justify-center gap-1.5"
            >
              <span>오늘의 미션 전체보기 ({totalMissionsCount}개)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 4. 관리자 / 시스템 요청사항 (Admin/System Attention Card) */}
          {adminAttentionNotice && (
            <div className="bg-amber-50/70 rounded-3xl p-5 sm:p-6 shadow-2xs border border-amber-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-black text-amber-900 uppercase">
                    관리자 요청 & 알림
                  </span>
                </div>
                <span className="text-[10px] font-bold bg-amber-200/60 text-amber-800 px-2 py-0.5 rounded-full">
                  확인 필요
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#0F172A]">{adminAttentionNotice.title}</h4>
                <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                  {adminAttentionNotice.description}
                </p>
              </div>

              <button
                onClick={() => onNavigate(adminAttentionNotice.actionTab, adminAttentionNotice.actionSubTab)}
                className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
              >
                <span>{adminAttentionNotice.actionText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* 6. AI 추천 (AI SEO Coach Dark Card) */}
          <div className="bg-[#0F172A] rounded-3xl p-5 sm:p-6 shadow-lg text-white border border-slate-800 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <h3 className="font-bold text-sm text-white">AI SEO Coach</h3>
              </div>
              <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                {unified?.aiConfigured ? 'CODE READY' : '준비중'}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {unified?.aiConfigured
                ? '분석은 [다시 분석]으로만 생성됩니다. 새로고침마다 호출하지 않습니다.'
                : 'AI Coach 준비중 — Provider가 설정되지 않았습니다. 가짜 추천을 표시하지 않습니다.'}
            </p>
            <button
              onClick={() => onNavigate('ai_coach')}
              className="w-full mt-2 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs border border-white/20 transition-all cursor-pointer"
            >
              AI Coach 열기 →
            </button>
          </div>
        </div>

        {/* Right Column (7 cols): 5. SEO 성과 (Performance KPIs & Charts & Active Project) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 5. SEO 성과 4대 KPI Cards with Help Tooltips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {/* Google 노출 */}
            <div className="bg-white p-4 rounded-3xl border border-[#E2E8F0] shadow-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#64748B]">Google 노출</span>
                {metricsSummary?.impressions.state === 'ready' ? null : (
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                    {metricsSummary?.impressions.state || '연결 필요'}
                  </span>
                )}
                <HelpTooltip
                  term="Google Impressions (노출수)"
                  explanation="구글 검색 결과 화면에 내 사이트의 링크가 사용자에게 노출된 총 횟수입니다. 검색 순위가 오를수록 빠르게 증가합니다."
                  example="예: 38,214회 노출 = 구글 검색어 결과에 38,214번 등장"
                />
              </div>
              <div className="text-lg sm:text-xl font-black text-[#0F172A] font-mono">
                {metricsSummary?.impressions.value != null
                  ? metricsSummary.impressions.value.toLocaleString()
                  : metricsSummary?.impressions.state || '연결 필요'}
              </div>
              <span className="text-[11px] text-slate-500 font-bold block font-mono">
                {metricsSummary?.impressionsChangePct == null
                  ? '비교 데이터 없음'
                  : `${metricsSummary.impressionsChangePct > 0 ? '+' : ''}${metricsSummary.impressionsChangePct.toFixed(1)}% 전기간비`}
              </span>
            </div>

            {/* Google 클릭 */}
            <div className="bg-white p-4 rounded-3xl border border-[#E2E8F0] shadow-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#64748B]">Google 클릭</span>
                {metricsSummary?.clicks.state === 'ready' ? null : (
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                    {metricsSummary?.clicks.state || '연결 필요'}
                  </span>
                )}
                <HelpTooltip
                  term="Google Clicks (클릭수)"
                  explanation="구글 검색 결과에서 사용자가 내 웹사이트 링크를 실제로 클릭하여 방문한 총 횟수입니다."
                />
              </div>
              <div className="text-lg sm:text-xl font-black text-[#0F172A] font-mono">
                {metricsSummary?.clicks.value != null
                  ? metricsSummary.clicks.value.toLocaleString()
                  : metricsSummary?.clicks.state || '연결 필요'}
              </div>
              <span className="text-[11px] text-slate-500 font-bold block font-mono">
                {metricsSummary?.clicksChangePct == null
                  ? '비교 데이터 없음'
                  : `${metricsSummary.clicksChangePct > 0 ? '+' : ''}${metricsSummary.clicksChangePct.toFixed(1)}% 전기간비`}
              </span>
            </div>

            {/* 랭킹 키워드 */}
            <div className="bg-white p-4 rounded-3xl border border-[#E2E8F0] shadow-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#64748B]">평균 게재순위</span>
                {metricsSummary?.avgPosition.state === 'ready' ? null : (
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                    {metricsSummary?.avgPosition.state || '연결 필요'}
                  </span>
                )}
                <HelpTooltip
                  term="Ranking Keywords (순위 키워드)"
                  explanation="구글 검색 결과 상위 100위 안에 진입하여 실제 노출 및 유입을 일으키고 있는 핵심 키워드의 개수입니다."
                />
              </div>
              <div className="text-lg sm:text-xl font-black text-[#2563EB] font-mono">
                {metricsSummary?.avgPosition.value != null
                  ? metricsSummary.avgPosition.value.toFixed(1)
                  : metricsSummary?.avgPosition.state || '연결 필요'}
              </div>
              <span className="text-[11px] text-slate-500 font-bold block">낮을수록 개선</span>
            </div>

            {/* Organic Traffic */}
            <div className="bg-white p-4 rounded-3xl border border-[#E2E8F0] shadow-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#64748B]">자연검색 방문</span>
                {metricsSummary?.organicSessions.state === 'ready' ? null : (
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                    {metricsSummary?.organicSessions.state || '연결 필요'}
                  </span>
                )}
                <HelpTooltip
                  term="Organic Traffic (자연 검색 유입)"
                  explanation="GA4 Organic Sessions: sessionDefaultChannelGroup이 Organic Search인 세션 수입니다. Active Users와 섞지 않습니다."
                />
              </div>
              <div className="text-lg sm:text-xl font-black text-[#2563EB] font-mono">
                {metricsSummary?.organicSessions.value != null
                  ? metricsSummary.organicSessions.value.toLocaleString()
                  : metricsSummary?.organicSessions.state || '연결 필요'}
              </div>
              <span className="text-[11px] text-slate-500 font-bold block font-mono">
                {metricsSummary?.organicSessionsChangePct == null
                  ? '비교 데이터 없음'
                  : `${metricsSummary.organicSessionsChangePct > 0 ? '+' : ''}${metricsSummary.organicSessionsChangePct.toFixed(1)}% 전기간비`}
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-500 font-bold">
            SEO Health Score: {metricsSummary?.seoHealthScore?.state || '준비 중'} (AI Score 아님)
          </p>

          {/* Active Project Card with Pipeline & Details */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-[#E2E8F0] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F1F5F9]">
              <div>
                <span className="text-[10px] font-bold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded-md uppercase">
                  Active SEO Project
                </span>
                <h3 className="text-base sm:text-lg font-black text-[#0F172A] mt-1">{project?.name || '선택된 프로젝트 없음'}</h3>
                <div className="text-xs text-[#64748B] font-mono">{project?.domain || '-'}</div>
                {project?.websiteStatusLabel ? (
                  <div className="text-[11px] text-slate-600 mt-1">홈페이지 상태: {project.websiteStatusLabel}</div>
                ) : null}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="primary"
                  size="sm"
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  onClick={() => onNavigate('roadmap')}
                  className="text-xs font-bold"
                >
                  로드맵 열기
                </Button>
                <button
                  onClick={() => onNavigate('projects')}
                  className="px-3 py-1.5 border border-[#E2E8F0] rounded-xl text-xs font-bold hover:bg-[#F8FAFC] transition-colors cursor-pointer text-[#64748B]"
                >
                  프로젝트 전환
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-[#F1F5F9] space-y-2">
              <h4 className="text-xs font-black text-[#0F172A]">최근 활동</h4>
              {activities.length === 0 ? (
                <p className="text-xs text-slate-400">아직 작업 기록이 없습니다.</p>
              ) : (
                activities.slice(0, 5).map((a) => (
                  <div key={a.id} className="text-xs text-slate-600 flex justify-between gap-2">
                    <span className="truncate">{a.action}</span>
                    <span className="shrink-0 font-mono text-slate-400">{a.timestamp.slice(0, 16)}</span>
                  </div>
                ))
              )}
            </div>
            <div className="text-[10px] font-black text-amber-700 bg-amber-50 border border-amber-200 inline-flex px-2 py-0.5 rounded mb-2">DEMO 모듈 진행률</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span className="text-[#0F172A] flex items-center gap-1">
                      <span>Website Setup (홈페이지)</span>
                      <HelpTooltip term="Website Setup" explanation="SEO 친화적 워드프레스 테마, 반응형 모바일 레이아웃 및 5개 핵심 페이지 세팅 완료 여부입니다." />
                    </span>
                    <span className="text-emerald-600">100% (완료)</span>
                  </div>
                  <div className="w-full h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-full rounded-full" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span className="text-[#0F172A] flex items-center gap-1">
                      <span>Technical SEO (GSC/사이트맵)</span>
                      <HelpTooltip term="Technical SEO" explanation="구글 서치 콘솔 등록, SSL 인증서, Robots.txt, XML Sitemap, Schema 구조화 데이터 세팅입니다." />
                    </span>
                    <span className="text-[#2563EB]">80%</span>
                  </div>
                  <div className="w-full h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                    <div className="h-full bg-[#2563EB] w-4/5 rounded-full" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span className="text-[#0F172A] flex items-center gap-1">
                      <span>Content Automation (콘텐츠)</span>
                      <HelpTooltip term="Content Automation" explanation="Silo 구조에 맞춘 기둥 및 서브 블로그 콘텐츠 50개 목표 발행 진도입니다." />
                    </span>
                    <span className="text-[#2563EB]">64% (32/50개)</span>
                  </div>
                  <div className="w-full h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                    <div className="h-full bg-[#2563EB] w-[64%] rounded-full" />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span className="text-[#0F172A] flex items-center gap-1">
                      <span>Backlink Network (백링크)</span>
                      <HelpTooltip term="Backlink Network" explanation="신뢰도 높은 고품질 외부 도메인(Referring Domain)으로부터의 인바운드 하이퍼링크 구축 상태입니다." />
                    </span>
                    <span className="text-[#2563EB]">36% (18개 도메인)</span>
                  </div>
                  <div className="w-full h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                    <div className="h-full bg-[#2563EB] w-[36%] rounded-full" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span className="text-[#0F172A] flex items-center gap-1">
                      <span>Traffic Booster Signals</span>
                      <HelpTooltip term="Traffic Booster" explanation="실제 오가닉 유입 및 사용자 체류시간 증대를 유도하는 검색 신호 최적화입니다." />
                    </span>
                    <span className="text-[#2563EB]">25%</span>
                  </div>
                  <div className="w-full h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                    <div className="h-full bg-[#2563EB] w-1/4 rounded-full" />
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between text-xs text-[#64748B] border-t border-[#F1F5F9]">
                  <span>연동: Google Search Console</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    실시간 동기화중
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* GSC Time Series Chart */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-[#E2E8F0]">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4 min-w-0">
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base font-bold text-[#0F172A] flex items-center gap-1.5 break-words">
                  <span>Google 노출 & 클릭 트렌드 (최근 18일)</span>
                  <HelpTooltip
                    term="GSC 트렌드 차트"
                    explanation="구글 서치 콘솔에서 집계된 일별 검색 노출수(파란색)와 실제 클릭수(초록색)의 상승 곡선입니다."
                  />
                </h3>
                <p className="text-xs text-[#64748B]">Search Console 동기화 데이터 (로컬 DB)</p>
              </div>
              <button
                onClick={() => onNavigate('reports')}
                className="text-xs font-bold text-[#2563EB] hover:underline cursor-pointer"
              >
                상세 성과 리포트 보기 →
              </button>
            </div>

            <div className="h-52 w-full min-w-0 overflow-hidden">
              {metricsTimeseries.length === 0 ? (
                <p className="text-sm text-slate-400 pt-8">차트 데이터 없음 — Search Console 연결 후 동기화하세요.</p>
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
                      fontSize: '12px'
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
