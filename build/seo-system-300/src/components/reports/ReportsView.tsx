import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Search,
  Calendar,
  ExternalLink,
  Download,
  Filter,
  ArrowUpRight,
  CheckCircle2,
  Sparkles,
  Award,
  Globe2,
  FileText,
  Link2,
  Layers,
  ArrowRight,
  Zap,
  Target,
  Clock,
  ChevronRight,
  TrendingDown
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Project, NavigationTab } from '../../types';
import type { MetricsSummary } from '../../services/metricsService';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Card } from '../common/Card';

export interface ReportsViewProps {
  project: Project;
  onNavigate?: (tab: NavigationTab, subTab?: string) => void;
  liveChart?: Array<{ date: string; impressions: number; clicks: number; traffic: number; position?: number }>;
  queries?: Array<{ query: string; clicks: number; impressions: number; ctr: number; position: number; clicksChangePct?: number | null }>;
  pages?: Array<{ page: string; clicks: number; impressions: number; ctr: number; position: number }>;
  opportunities?: Array<{ rule: string; query: string; reason: string }>;
  beforeNow?: {
    before: { impressions: number; clicks: number } | null;
    now: { impressions: number; clicks: number } | null;
    ga4Before?: { organicSessions: number } | null;
    ga4Now?: { organicSessions: number } | null;
    beforeFrom?: string;
    nowFrom?: string;
  } | null;
  metricsSummary?: MetricsSummary | null;
  timeRange?: TimeRangeType;
  onTimeRangeChange?: (range: TimeRangeType) => void;
  milestones?: Array<{ key: string; title: string; achieved: boolean; value: number | null; threshold: number }>;
  toolSummary?: Record<string, unknown> | null;
}

export type TimeRangeType = '7d' | '30d' | '3m' | '6m' | '1y' | 'all';
export type ChartMetricType = 'impressions' | 'traffic' | 'keywords';

export interface MilestoneItem {
  id: string;
  date: string;
  title: string;
  description: string;
  category: 'content' | 'impressions' | 'keyword' | 'backlink' | 'traffic';
  badge: string;
}

const MILESTONES: MilestoneItem[] = [];

export const ReportsView: React.FC<ReportsViewProps> = ({
  project,
  onNavigate,
  liveChart = [],
  queries = [],
  pages = [],
  opportunities = [],
  beforeNow = null,
  metricsSummary = null,
  timeRange: timeRangeProp,
  onTimeRangeChange,
  milestones = [],
  toolSummary = null,
}) => {
  const [timeRangeLocal, setTimeRangeLocal] = useState<TimeRangeType>('30d');
  const timeRange = timeRangeProp || timeRangeLocal;
  const setTimeRange = (range: TimeRangeType) => {
    setTimeRangeLocal(range);
    onTimeRangeChange?.(range);
  };
  const [chartMetric, setChartMetric] = useState<ChartMetricType>('impressions');
  const [keywordSearch, setKeywordSearch] = useState('');

  const chartData = liveChart;
  const cellText = (state?: string, value?: number | null, digits?: number) => {
    if (state === 'ready' && value != null) {
      return digits != null ? value.toFixed(digits) : value.toLocaleString();
    }
    if (state === 'not_connected') return '연결 전';
    return state || '연결 필요';
  };
  const changeBadge = (pct: number | null | undefined) =>
    pct == null ? '비교 없음' : `${pct > 0 ? '+' : ''}${pct.toFixed(1)}%`;

  const filteredKeywords = queries.filter((k) =>
    k.query.toLowerCase().includes(keywordSearch.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Title & Period Switcher */}
      <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF6FF] text-[#2563EB] text-xs font-bold border border-[#DBEAFE]">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>SEO SYSTEM 300 성과 분석 리포트</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
            SEO 성과 및 성장 분석 리포트
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
            Google Search Console 및 오가닉 트래픽, 키워드 랭킹 지표를 통해
            프로젝트의 종합적인 검색엔진 최적화 성과와 시작 대비 성장세를 확인하세요.
          </p>
        </div>

        {/* Period Selector (7일 / 30일 / 3개월 / 6개월 / 1년 / 전체) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-1 p-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl overflow-x-auto text-xs font-bold shadow-2xs">
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                timeRange === '7d'
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              7일
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                timeRange === '30d'
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              30일
            </button>
            <button
              onClick={() => setTimeRange('3m')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                timeRange === '3m'
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              3개월
            </button>
            <button
              onClick={() => setTimeRange('6m')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                timeRange === '6m'
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              6개월
            </button>
            <button
              onClick={() => setTimeRange('1y')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                timeRange === '1y'
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              1년
            </button>
            <button
              onClick={() => setTimeRange('all')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                timeRange === 'all'
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              전체
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="w-3.5 h-3.5" />}
            className="text-xs font-bold text-[#475569] bg-white border-[#E2E8F0]"
          >
            리포트 내보내기
          </Button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 8 Primary KPI Cards Grid */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-[#E2E8F0] shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#64748B]">Google Impressions</span>
            <span className="text-[11px] font-bold text-slate-500">{changeBadge(metricsSummary?.impressionsChangePct)}</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#0F172A]">
            {cellText(metricsSummary?.impressions.state, metricsSummary?.impressions.value)}
          </div>
          <span className="text-[11px] text-[#64748B] block">구글 검색 총 노출수</span>
        </div>
        <div className="p-5 rounded-3xl bg-white border border-[#E2E8F0] shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#64748B]">Google Clicks</span>
            <span className="text-[11px] font-bold text-slate-500">{changeBadge(metricsSummary?.clicksChangePct)}</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#0F172A]">
            {cellText(metricsSummary?.clicks.state, metricsSummary?.clicks.value)}
          </div>
          <span className="text-[11px] text-[#64748B] block">순수 자연 검색 클릭</span>
        </div>
        <div className="p-5 rounded-3xl bg-white border border-[#E2E8F0] shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#64748B]">자연검색 방문</span>
            <span className="text-[11px] font-bold text-slate-500">{changeBadge(metricsSummary?.organicSessionsChangePct)}</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#2563EB]">
            {cellText(metricsSummary?.organicSessions.state, metricsSummary?.organicSessions.value)}
          </div>
          <span className="text-[11px] text-[#64748B] block">Organic Sessions (Organic Search)</span>
        </div>
        <div className="p-5 rounded-3xl bg-white border border-[#E2E8F0] shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#64748B]">평균 게재순위</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#0F172A]">
            {cellText(metricsSummary?.avgPosition.state, metricsSummary?.avgPosition.value, 1)}
          </div>
          <span className="text-[11px] text-[#64748B] block">낮을수록 개선</span>
        </div>
        <div className="p-5 rounded-3xl bg-white border border-[#E2E8F0] shadow-xs space-y-1.5">
          <span className="text-xs font-bold text-[#64748B]">Contents</span>
          <div className="text-xl sm:text-2xl font-black text-[#0F172A]">연결 전</div>
          <span className="text-[11px] text-[#64748B] block">콘텐츠 시스템은 아직 미연결</span>
        </div>
        <div className="p-5 rounded-3xl bg-white border border-[#E2E8F0] shadow-xs space-y-1.5">
          <span className="text-xs font-bold text-[#64748B]">Referring Domains</span>
          <div className="text-xl sm:text-2xl font-black text-[#0F172A]">연결 전</div>
          <span className="text-[11px] text-[#64748B] block">백링크 시스템은 아직 미연결</span>
        </div>
        <div className="p-5 rounded-3xl bg-white border border-[#E2E8F0] shadow-xs space-y-1.5">
          <span className="text-xs font-bold text-[#64748B]">상위 검색어</span>
          <div className="text-xl sm:text-2xl font-black text-[#0F172A]">
            {queries.length > 0 ? queries.length.toLocaleString() : '데이터 없음'}
          </div>
          <span className="text-[11px] text-[#64748B] block">기간 내 Query 수</span>
        </div>
        <div className="p-5 rounded-3xl bg-[#EFF6FF] border border-[#DBEAFE] shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#1E40AF]">SEO Progress</span>
            <span className="text-[11px] font-bold text-[#2563EB] bg-white px-2 py-0.5 rounded-full border border-[#DBEAFE]">
              Roadmap
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#2563EB]">{project.overallProgress}%</div>
          <span className="text-[11px] text-[#1E3A8A] block">SYSTEM 300 로드맵 진행률</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SaaS Style Line Chart Section (Google 노출 / Organic Traffic / Keyword) */}
      {/* ========================================================================= */}
      <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        {/* Chart Header & Metric Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F1F5F9]">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#2563EB]" />
              <span>성장 추이 시계열 차트 ({timeRange.toUpperCase()} 기간)</span>
            </h3>
            <p className="text-xs text-[#64748B]">
              원하는 지표 탭을 선택하여 구글 노출, 오가닉 트래픽, 키워드 순위 변화를 정밀하게 분석합니다.
            </p>
          </div>

          {/* Metric Switcher Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl text-xs font-bold">
            <button
              onClick={() => setChartMetric('impressions')}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                chartMetric === 'impressions'
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Google 노출 변화
            </button>
            <button
              onClick={() => setChartMetric('traffic')}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                chartMetric === 'traffic'
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Organic Traffic 변화
            </button>
            <button
              onClick={() => setChartMetric('keywords')}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                chartMetric === 'keywords'
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              평균 게재순위 (낮을수록 개선)
            </button>
          </div>
        </div>

        {/* Recharts Line / Area Container */}
        <div className="h-80 w-full pt-2 min-w-0 overflow-hidden">
          {chartData.length === 0 ? (
            <p className="text-sm text-slate-400 pt-10">차트 데이터 없음 — Google 연결 후 동기화하세요.</p>
          ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="chartGradientBlue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="chartGradientGreen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="chartGradientPurple" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis
                reversed={chartMetric === 'keywords'}
                tick={{ fontSize: 11, fill: '#64748B' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#334155',
                  borderRadius: '16px',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
                }}
                itemStyle={{ color: '#FFFFFF' }}
              />

              {chartMetric === 'impressions' && (
                <>
                  <Area
                    type="monotone"
                    dataKey="impressions"
                    name="Google Impressions (노출)"
                    stroke="#2563EB"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#chartGradientBlue)"
                  />
                  <Area
                    type="monotone"
                    dataKey="clicks"
                    name="Google Clicks (클릭)"
                    stroke="#10B981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#chartGradientGreen)"
                  />
                </>
              )}

              {chartMetric === 'traffic' && (
                <Area
                  type="monotone"
                  dataKey="traffic"
                  name="자연검색 방문 (Organic Sessions)"
                  stroke="#10B981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#chartGradientGreen)"
                />
              )}

              {chartMetric === 'keywords' && (
                <Area
                  type="monotone"
                  dataKey="position"
                  name="평균 게재순위 (낮을수록 개선)"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#chartGradientPurple)"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Before vs Now (시작 당시와 현재 비교) */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-md border border-slate-800 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>BEFORE VS NOW PERFORMANCE COMPASS</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black tracking-tight">
              첫 7일 평균 vs 최근 7일 (Before vs Now)
            </h3>
            <p className="text-xs text-slate-300">
              실제 GSC/GA4 저장 데이터가 있을 때만 표시합니다. 평균 순위는 숫자가 낮을수록 개선입니다.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl border border-white/15 text-xs shrink-0">
            <Clock className="w-4 h-4 text-blue-400" />
            <span>기준: 첫 7일 평균 vs 최근 7일 평균</span>
          </div>
        </div>

        {/* 6 Before vs Now Visual Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 1. Google Impressions */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <span className="text-xs text-slate-400 font-bold block">Google 노출</span>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Before</span>
                <span className="text-lg font-mono font-bold text-slate-400">
                  {beforeNow?.before ? beforeNow.before.impressions.toLocaleString() : '데이터 없음'}
                </span>
              </div>
              <ArrowRight className="w-5 h-5 text-blue-400" />
              <div className="text-right">
                <span className="text-[10px] text-blue-300 block uppercase">Now</span>
                <span className="text-2xl font-mono font-black text-white">
                  {beforeNow?.now ? beforeNow.now.impressions.toLocaleString() : '데이터 없음'}
                </span>
              </div>
            </div>
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-slate-400">순수 증가폭</span>
              <span className="font-bold text-slate-400">데이터 없음</span>
            </div>
          </div>

          {/* 2. Google Clicks */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <span className="text-xs text-slate-400 font-bold block">Google 클릭</span>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Before</span>
                <span className="text-lg font-mono font-bold text-slate-400">
                  {beforeNow?.before ? beforeNow.before.clicks.toLocaleString() : '데이터 없음'}
                </span>
              </div>
              <ArrowRight className="w-5 h-5 text-blue-400" />
              <div className="text-right">
                <span className="text-[10px] text-blue-300 block uppercase">Now</span>
                <span className="text-2xl font-mono font-black text-white">
                  {beforeNow?.now ? beforeNow.now.clicks.toLocaleString() : '데이터 없음'}
                </span>
              </div>
            </div>
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-slate-400">순수 증가폭</span>
              <span className="font-bold text-slate-400">데이터 없음</span>
            </div>
          </div>

          {/* 3. Ranking Keywords */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <span className="text-xs text-slate-400 font-bold block">키워드 (100위권 인덱싱)</span>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Before (06.01)</span>
                <span className="text-lg font-mono font-bold text-slate-400">0</span>
              </div>
              <ArrowRight className="w-5 h-5 text-blue-400" />
              <div className="text-right">
                <span className="text-[10px] text-blue-300 block uppercase">Now (08.19)</span>
                <span className="text-2xl font-mono font-black text-white">연결 전</span>
              </div>
            </div>
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-slate-400">순수 증가폭</span>
              <span className="font-bold text-slate-400">연결 전</span>
            </div>
          </div>

          {/* 4. Contents */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <span className="text-xs text-slate-400 font-bold block">발행 콘텐츠</span>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Before (06.01)</span>
                <span className="text-lg font-mono font-bold text-slate-400">0</span>
              </div>
              <ArrowRight className="w-5 h-5 text-blue-400" />
              <div className="text-right">
                <span className="text-[10px] text-blue-300 block uppercase">Now (08.19)</span>
                <span className="text-2xl font-mono font-black text-white">연결 전</span>
              </div>
            </div>
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-slate-400">순수 증가폭</span>
              <span className="font-bold text-slate-400">연결 전</span>
            </div>
          </div>

          {/* 5. Referring Domains */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <span className="text-xs text-slate-400 font-bold block">Referring Domains</span>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Before (06.01)</span>
                <span className="text-lg font-mono font-bold text-slate-400">0</span>
              </div>
              <ArrowRight className="w-5 h-5 text-blue-400" />
              <div className="text-right">
                <span className="text-[10px] text-blue-300 block uppercase">Now (08.19)</span>
                <span className="text-2xl font-mono font-black text-white">연결 전</span>
              </div>
            </div>
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-slate-400">순수 증가폭</span>
              <span className="font-bold text-slate-400">연결 전</span>
            </div>
          </div>

          {/* 6. Organic Traffic */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <span className="text-xs text-slate-400 font-bold block">자연검색 방문 (Organic Sessions)</span>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Before</span>
                <span className="text-lg font-mono font-bold text-slate-400">
                  {beforeNow?.ga4Before ? beforeNow.ga4Before.organicSessions.toLocaleString() : '데이터 없음'}
                </span>
              </div>
              <ArrowRight className="w-5 h-5 text-blue-400" />
              <div className="text-right">
                <span className="text-[10px] text-blue-300 block uppercase">Now</span>
                <span className="text-2xl font-mono font-black text-white">
                  {beforeNow?.ga4Now ? beforeNow.ga4Now.organicSessions.toLocaleString() : '데이터 없음'}
                </span>
              </div>
            </div>
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-slate-400">순수 증가폭</span>
              <span className="font-bold text-slate-400">데이터 없음</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Milestones (마일스톤 달성 기록 - 깔끔하고 전문적인 구성) */}
      {/* ========================================================================= */}
      <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
            <Award className="w-4 h-4 text-[#2563EB]" />
            <span>핵심 SEO 마일스톤 달성 기록</span>
          </h3>
          <p className="text-xs text-[#64748B]">
            과도한 게임화를 배제하고, 실제 사이트 성장에 기여한 주요 지표 돌파 시점을 기록합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {milestones.length === 0 ? (
            <p className="text-sm text-slate-400">실제 마일스톤 기록이 아직 없습니다.</p>
          ) : null}
          {milestones.map((m) => (
            <div
              key={m.key}
              className="p-5 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE]">
                  {m.achieved ? '달성' : '미달성'}
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#0F172A]">{m.title}</h4>
              <p className="text-xs text-[#64748B]">
                {m.value == null ? '데이터 없음' : `현재 ${m.value} / 기준 ${m.threshold}`}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* SERP Keyword Detailed Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-[#0F172A]">구글 상위 랭킹 키워드 상세 리스트</h3>
            <p className="text-xs text-[#64748B]">
              현재 SERP 1~10위권에 진입하여 오가닉 트래픽을 견인하는 주요 키워드
            </p>
          </div>

          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={keywordSearch}
              onChange={(e) => setKeywordSearch(e.target.value)}
              placeholder="키워드 검색..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#2563EB] bg-[#F8FAFC]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B]">
                <th className="py-3 px-4 font-bold">Query</th>
                <th className="py-3 px-4 font-bold text-center">Position</th>
                <th className="py-3 px-4 font-bold text-center">Change</th>
                <th className="py-3 px-4 font-bold text-center">Impressions</th>
                <th className="py-3 px-4 font-bold text-center">Clicks</th>
                <th className="py-3 px-4 font-bold text-center">CTR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filteredKeywords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-400">
                    데이터 없음
                  </td>
                </tr>
              ) : null}
              {filteredKeywords.map((kw) => (
                <tr key={kw.query} className="hover:bg-[#F8FAFC]/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-[#0F172A]">{kw.query}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-black text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#DBEAFE]">
                      {kw.position.toFixed(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {kw.clicksChangePct === null || kw.clicksChangePct === undefined ? (
                      <span className="text-slate-400">-</span>
                    ) : (
                      <span className="text-emerald-600 font-bold">{kw.clicksChangePct.toFixed(1)}%</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-[#0F172A]">
                    {kw.impressions.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-[#2563EB]">
                    {kw.clicks.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-emerald-600">{(kw.ctr * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white border rounded-3xl p-6 space-y-3">
        <h3 className="font-black">상위 페이지</h3>
        {pages.length === 0 ? <p className="text-sm text-slate-400">데이터 없음</p> : null}
        {pages.slice(0, 20).map((p) => (
          <div key={p.page} className="text-xs flex justify-between gap-3 border-b border-slate-100 py-2">
            <span className="truncate font-mono">{p.page}</span>
            <span>
              {p.clicks} / {p.impressions} / {(p.ctr * 100).toFixed(1)}% / {p.position.toFixed(1)}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-white border rounded-3xl p-6 space-y-2">
        <h3 className="font-black">SEO Opportunities (Rule-based)</h3>
        <p className="text-xs text-slate-500">AI 분석이 아닙니다. 규칙 기반 기회입니다.</p>
        {opportunities.length === 0 ? <p className="text-sm text-slate-400">표시할 규칙 결과가 없습니다.</p> : null}
        {opportunities.map((o, i) => (
          <p key={`${o.rule}-${i}`} className="text-sm">
            {o.query} — {o.reason}
          </p>
        ))}
      </div>
    </div>
  );
};
