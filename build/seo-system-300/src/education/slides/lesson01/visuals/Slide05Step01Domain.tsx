import React from 'react';
import { ShieldCheck, ArrowRight, Activity, AlertOctagon, CheckCircle2, History, Database, Network } from 'lucide-react';

export const Slide05Step01Domain: React.FC = () => {
  return (
    <div className="w-full h-full p-12 flex flex-col justify-between relative overflow-hidden select-none bg-[#07111F]">
      {/* Background Deep Blue Accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-900/15 rounded-full blur-[120px]" />
      </div>

      {/* Top Header Tag */}
      <div className="relative z-10 flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-3">
          <span className="text-4xl font-black font-mono text-blue-500 tracking-tighter">
            01
          </span>
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-blue-400 font-bold">
              PHASE 01 · INFRASTRUCTURE BASE
            </div>
            <h2 className="text-3xl font-black text-white">
              STEP 01 · 낙장도메인 (Expired Domain)
            </h2>
          </div>
        </div>
        <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono font-bold">
          TOOL: domain.icrm.co.kr
        </div>
      </div>

      {/* Main Content: Layout A (Left 40% Text + Right 60% Domain Intelligence Network) */}
      <div className="relative z-10 my-auto py-2 grid grid-cols-12 gap-6 items-center">
        {/* Left Column: Core Principle & Action (5 cols) */}
        <div className="col-span-5 space-y-3.5">
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-blue-900/40">
            <span className="text-xs font-mono text-blue-400 font-bold uppercase tracking-wider block mb-1">
              CORE PHILOSOPHY
            </span>
            <p className="text-2xl font-black text-white leading-snug">
              “처음부터 <span className="text-blue-400">좋은 출발점</span>을 선택한다.”
            </p>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              신규 도메인은 신뢰와 색인이 쌓이는 데 시간이 걸릴 수 있습니다. <strong className="text-white">과거 이력(History)과 도메인 파워</strong>를 검증하여 시간 비용을 압축합니다.
            </p>
          </div>

          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-2.5">
              <History className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-base font-bold text-white block">과거 신호 잔존 가능성</span>
                <span className="text-sm text-slate-400 block mt-0.5">
                  외부 원본으로 이력 확인 · 결과 비보장
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-2.5">
              <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-base font-bold text-white block">위험 이력 교차 검증</span>
                <span className="text-sm text-slate-400 block mt-0.5">
                  위험 신호 발견 시 보류·제외하고 근거 기록
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Domain Intelligence Network Visual Graphic (7 cols) */}
        <div className="col-span-7">
          <div className="p-6 rounded-2xl bg-slate-950/90 border border-blue-900/40 shadow-2xl relative overflow-hidden">
            {/* Ambient network glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Network Inspector Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 text-xs font-mono">
              <div className="flex items-center gap-2 text-slate-300 font-bold">
                <Network className="w-5 h-5 text-blue-400" />
                <span>DOMAIN INTELLIGENCE NETWORK</span>
              </div>
              <span className="text-emerald-400 text-sm font-bold">RISK CHECK · EXAMPLE</span>
            </div>

            {/* Central Domain Node & Radial Orbit Visual */}
            <div className="relative py-3 flex flex-col items-center justify-center">
              {/* Central Target Domain Badge */}
              <div className="z-10 p-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-950 to-slate-900 border-2 border-blue-500/80 shadow-xl shadow-blue-950/60 text-center">
                <span className="text-xs font-mono text-blue-400 uppercase font-bold tracking-wider block">
                  INSPECTED TARGET DOMAIN
                </span>
                <span className="text-xl font-mono font-black text-white block mt-0.5">
                  target-domain.com
                </span>
                <span className="inline-flex items-center gap-1 text-sm text-emerald-400 font-mono mt-1">
                  <CheckCircle2 className="w-5 h-5" /> REVIEWED CANDIDATE
                </span>
              </div>

              {/* Connected Orbit Nodes */}
              <div className="w-full grid grid-cols-3 gap-2.5 mt-5 text-sm font-mono">
                {/* Node 1: Historical Trust */}
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-blue-900/30 text-left">
                  <span className="text-sm text-slate-500 block">THIRD-PARTY METRICS</span>
                  <span className="text-sm font-bold text-blue-300 block mt-0.5">TF / CF 참고 예시</span>
                  <span className="text-sm text-emerald-400 mt-1 block">공식 점수 아님</span>
                </div>

                {/* Node 2: Archive History */}
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-blue-900/30 text-left">
                  <span className="text-sm text-slate-500 block">WAYBACK ARCHIVE</span>
                  <span className="text-sm font-bold text-slate-200 block mt-0.5">6.8 Years Active</span>
                  <span className="text-sm text-blue-400 mt-1 block">정상 비즈니스 이력</span>
                </div>

                {/* Node 3: Referring Domains */}
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-blue-900/30 text-left col-span-1">
                  <span className="text-sm text-slate-500 block">GOV/EDU CITATIONS</span>
                  <span className="text-sm font-bold text-cyan-300 block mt-0.5">14 Clean Backlinks</span>
                  <span className="text-sm text-cyan-400 mt-1 block">공공·언론사 링크 보유</span>
                </div>
              </div>

              {/* Action Ribbon */}
              <div className="w-full mt-3 p-2.5 rounded-xl bg-blue-950/30 border border-blue-900/40 flex items-center justify-between text-sm">
                <span className="text-sm text-slate-300">
                  <strong className="text-blue-300">실습 미션:</strong> domain.icrm.co.kr에서 내 분야 안전 도메인 1개 확정
                </span>
                <ArrowRight className="w-5 h-5 text-blue-400 shrink-0" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-sm text-slate-500 font-mono flex items-center justify-between border-t border-slate-800/80 pt-3">
        <span>ONOFF MARKETING EDUCATION · 1강</span>
        <span>출발점이 빠르면 상위 노출에 걸리는 시간이 수개월 단축됩니다.</span>
      </div>
    </div>
  );
};
