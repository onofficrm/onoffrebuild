import React from 'react';
import { Compass, ShieldCheck, Database, ArrowRight, Sparkles } from 'lucide-react';

export const Slide21Cover: React.FC = () => {
  return (
    <div className="w-full h-full p-12 flex flex-col justify-between relative overflow-hidden select-none bg-[#07111F]">
      {/* Background Accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[140px]" />
      </div>

      {/* Top Header Tag */}
      <div className="relative z-10 flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold text-xs border border-cyan-500/40">
            LECTURE 02
          </span>
          <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">
            STEP 01 · DOMAIN SELECTION ENGINE
          </span>
        </div>
        <span className="text-xs font-mono text-slate-500 font-bold">
          ONOFF MARKETING EDUCATION
        </span>
      </div>

      {/* Main Content: Big Lecture Title & 3 Core Value Pillars */}
      <div className="relative z-10 my-auto py-2 grid grid-cols-12 gap-8 items-center">
        {/* Left Column (7 cols): Hero Title */}
        <div className="col-span-7 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400 font-bold">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>EXPIRED DOMAIN ANALYSIS & SELECTION</span>
          </div>

          <h1 className="text-6xl font-black text-white tracking-tight leading-[1.1]">
            2강 · 낙장도메인 <br />
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 bg-clip-text text-transparent">
              실전 분석
            </span>
          </h1>

          <p className="text-2xl font-bold text-slate-200">
            좋음 vs 위험 · 체크리스트 판별
          </p>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl max-w-xl">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block mb-1">
              CORE PHILOSOPHY
            </span>
            <p className="text-lg font-black text-white">
              좋음 / 나쁨 · 판단은 검증
            </p>
            <p className="text-sm text-slate-400 font-sans mt-1">
              이력·리스크 직접 검증
            </p>
          </div>
        </div>

        {/* Right Column (5 cols): 3 Action Pillars */}
        <div className="col-span-5 space-y-4 font-mono">
          <div className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800 shadow-xl flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-bold block mb-1">01 검증 도구</span>
              <strong className="text-xl font-black text-cyan-300 font-mono">domain.icrm.co.kr</strong>
            </div>
            <Database className="w-8 h-8 text-cyan-400" />
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800 shadow-xl flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-bold block mb-1">02 핵심 역량</span>
              <strong className="text-xl font-black text-white font-sans">위험 도메인 사전 점검</strong>
            </div>
            <ShieldCheck className="w-8 h-8 text-amber-400" />
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/90 border border-cyan-500/40 shadow-xl flex items-center justify-between bg-cyan-950/20">
            <div>
              <span className="text-xs text-cyan-400 font-bold block mb-1">03 수료 기준</span>
              <strong className="text-xl font-black text-emerald-400 font-sans">스스로 판단 완료</strong>
            </div>
            <Sparkles className="w-8 h-8 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-sm text-slate-500 font-mono flex items-center justify-between border-t border-slate-800/80 pt-4">
        <span>ONOFF MARKETING EDUCATION · 2강 시작</span>
        <span>SLIDE 21 / 38</span>
      </div>
    </div>
  );
};
