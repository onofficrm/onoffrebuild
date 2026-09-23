import React from 'react';
import { BarChart3, ArrowRight, TrendingUp, Filter, AlertCircle, CheckCircle2, Activity } from 'lucide-react';

export const Slide11Step07Analytics: React.FC = () => {
  return (
    <div className="w-full h-full p-12 flex flex-col justify-between relative overflow-hidden select-none bg-[#07111F]">
      {/* Background Indigo Accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-900/15 rounded-full blur-[120px]" />
      </div>

      {/* Top Header Tag */}
      <div className="relative z-10 flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-3">
          <span className="text-4xl font-black font-mono text-indigo-400 tracking-tighter">
            07
          </span>
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-bold">
              PHASE 04 · DATA & EXPANSION
            </div>
            <h2 className="text-3xl font-black text-white">
              STEP 07 · 성과측정 (SaaS Funnel Analytics)
            </h2>
          </div>
        </div>
        <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-mono font-bold">
          TOOL: 통합 분석 대시보드 (GSC + GA4)
        </div>
      </div>

      {/* Main Content: Layout E (Dashboard UI Mockup + Funnel Analysis) */}
      <div className="relative z-10 my-auto py-2 grid grid-cols-12 gap-6 items-center">
        {/* Left Column: Narrative (4 cols) */}
        <div className="col-span-4 space-y-3.5">
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-indigo-900/40">
            <span className="text-xs font-mono text-indigo-400 font-bold uppercase tracking-wider block mb-1">
              DATA-DRIVEN DECISION
            </span>
            <p className="text-2xl font-black text-white leading-snug">
              “느낌이 아니라,<br />
              <span className="text-indigo-400">숫자로 판단합니다.</span>”
            </p>
            <p className="text-lg text-slate-300 mt-2 leading-relaxed">
              노출 → 클릭 → 체류 → 전환
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2 text-xs font-mono">
            <div className="flex items-center gap-2 text-indigo-300 font-bold">
              <Filter className="w-5 h-5 text-indigo-400" />
              <span>5단계 퍼널 진단 체계</span>
            </div>
            <p className="text-base text-slate-400 font-sans">
              가장 큰 이탈 구간이 다음 개선점
            </p>
          </div>
        </div>

        {/* Right Column: Professional SaaS Analytics Dashboard Mockup (8 cols) */}
        <div className="col-span-8">
          <div className="p-5 rounded-2xl bg-slate-950/90 border border-indigo-900/40 shadow-2xl relative">
            {/* Dashboard Header Bar */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 text-xs font-mono">
              <div className="flex items-center gap-2 text-slate-300 font-bold">
                <BarChart3 className="w-5 h-5 text-indigo-400" />
                <span>INTEGRATED PERFORMANCE METRICS (30-DAY)</span>
              </div>
              <span className="text-emerald-400 font-bold text-sm">CONVERSION RATE: 4.8%</span>
            </div>

            {/* 4 Metric Cards */}
            <div className="grid grid-cols-4 gap-2.5 font-mono mb-4">
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-sm text-slate-500 block">IMPRESSIONS (노출)</span>
                <span className="text-xl font-black text-white block mt-0.5">142,500</span>
                <span className="text-sm text-indigo-400 mt-0.5 block">검색 노출</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-sm text-slate-500 block">CLICKS (클릭수)</span>
                <span className="text-xl font-black text-cyan-300 block mt-0.5">8,920</span>
                <span className="text-sm text-cyan-400 mt-0.5 block">CTR: 6.25%</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-sm text-slate-500 block">ENGAGED SESSIONS</span>
                <span className="text-xl font-black text-teal-300 block mt-0.5">6,450</span>
                <span className="text-sm text-teal-400 mt-0.5 block">Avg 3m 22s</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-emerald-900/40">
                <span className="text-sm text-slate-500 block">CONVERSIONS (문의)</span>
                <span className="text-xl font-black text-emerald-400 block mt-0.5">318</span>
                <span className="text-sm text-emerald-400 mt-0.5 block">전환 완료</span>
              </div>
            </div>

            {/* Funnel Bottleneck Diagnostic Bar */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-indigo-900/30 font-mono text-xs">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-slate-400">FUNNEL DROP-OFF ANALYSIS</span>
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <AlertCircle className="w-5 h-5" /> 병목 발견: 2구간 (클릭률 개선 대상)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 flex overflow-hidden">
                <div className="h-full bg-indigo-500 w-[100%]" title="노출 100%" />
                <div className="h-full bg-cyan-400 w-[6.2%]" title="클릭 6.2%" />
                <div className="h-full bg-teal-400 w-[4.5%]" title="체류 4.5%" />
                <div className="h-full bg-emerald-400 w-[0.22%]" title="전환 0.22%" />
              </div>
              <div className="mt-2 text-base text-slate-400 font-sans">
                병목: CTR → 제목·설명 개선 후 재측정
              </div>
            </div>

            {/* Bottom Deliverable Ribbon */}
            <div className="mt-3 p-2.5 rounded-xl bg-indigo-950/30 border border-indigo-900/40 flex items-center justify-between text-sm">
              <span className="text-base text-slate-300 font-mono">
                <strong className="text-indigo-300">실습 미션:</strong> 대시보드에서 내 프로젝트의 1대 병목 지점 찾아내기
              </span>
              <ArrowRight className="w-5 h-5 text-indigo-400 shrink-0" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-sm text-slate-500 font-mono flex items-center justify-between border-t border-slate-800/80 pt-3">
        <span>ONOFF MARKETING EDUCATION · 1강</span>
        <span>어디가 막혔는지 알면 마케팅은 더 이상 막막하지 않습니다.</span>
      </div>
    </div>
  );
};
