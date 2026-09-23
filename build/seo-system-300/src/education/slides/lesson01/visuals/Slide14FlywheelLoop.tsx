import React from 'react';
import { RefreshCw, ArrowRight, TrendingUp, Zap, Sparkles, Database, Layers } from 'lucide-react';

export const Slide14FlywheelLoop: React.FC = () => {
  return (
    <div className="w-full h-full p-12 flex flex-col justify-between relative overflow-hidden select-none bg-[#07111F]">
      {/* Background Radial Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[140px]" />
      </div>

      {/* Top Tag & Title */}
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold mb-2">
          <RefreshCw className="w-5 h-5" />
          <span>RECURSIVE GROWTH ENGINE · 복리 플라이휠</span>
        </div>
        <h2 className="text-5xl font-black text-white tracking-tight">
          8단계는 일직선이 아닙니다
        </h2>
        <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 mt-1">
          “측정 후 다시 개선하는 끝없는 선순환 플라이휠(Flywheel)”
        </p>
      </div>

      {/* Main Flywheel Graphic: Layout H (Left 35% Narrative + Right 65% Flywheel Visual) */}
      <div className="relative z-10 my-auto py-2 grid grid-cols-12 gap-6 items-center">
        {/* Left Column: Narrative (4 cols) */}
        <div className="col-span-4 space-y-3.5">
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-900/40">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block mb-1">
              COMPOUND ADVANTAGE
            </span>
            <p className="text-2xl font-black text-white leading-snug">
              “1회로 끝나지 않고,<br />
              <span className="text-cyan-400">돌릴수록 가속</span>됩니다.”
            </p>
            <p className="text-lg text-slate-300 mt-2 leading-relaxed">
              실행 → 측정 → 개선 → 재실행
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2 text-xs font-mono">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span>복리 성장의 원리</span>
            </div>
            <p className="text-base text-slate-400 font-sans">
              측정과 개선을 반복해 검색 노출 범위를 넓힙니다.
            </p>
          </div>
        </div>

        {/* Right Column: Circular Flywheel Visual Engine (8 cols) */}
        <div className="col-span-8">
          <div className="p-6 rounded-2xl bg-slate-950/90 border border-cyan-900/40 shadow-2xl relative overflow-hidden">
            {/* Engine Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 text-xs font-mono">
              <div className="flex items-center gap-2 text-slate-300 font-bold">
                <RefreshCw className="w-5 h-5 text-cyan-400 animate-spin" style={{ animationDuration: '12s' }} />
                <span>8-STAGE CLOSED-LOOP FLYWHEEL ARCHITECTURE</span>
              </div>
              <span className="text-cyan-400 font-bold text-sm">FEEDBACK CYCLE: CONTINUOUS</span>
            </div>

            {/* Central Compounding Core surrounded by 8 Stages in Orbit Layout */}
            <div className="relative py-2 flex flex-col items-center justify-center">
              {/* Central Engine Core */}
              <div className="z-10 p-4 px-6 rounded-2xl bg-gradient-to-br from-cyan-950/90 to-blue-950/90 border-2 border-cyan-400/80 shadow-2xl shadow-cyan-950/80 text-center">
                <span className="text-sm font-mono text-cyan-300 uppercase font-bold tracking-widest block">
                  CORE FLYWHEEL ENGINE
                </span>
                <span className="text-3xl font-black text-white block mt-0.5">
                  자산 누적 & 복리 성장
                </span>
                <span className="text-sm text-emerald-400 font-mono mt-1 block">
                  COMPOUND SEO/GEO ASSET
                </span>
              </div>

              {/* 8 Connected Stage Pills in Flow Row */}
              <div className="w-full grid grid-cols-4 gap-2 mt-4 text-base font-mono">
                <div className="p-2 rounded-lg bg-slate-900/90 border border-blue-900/40 text-center">
                  <span className="text-blue-400 font-bold block text-base">01 도메인</span>
                  <span className="text-slate-300 text-base block">출발점</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900/90 border border-sky-900/40 text-center">
                  <span className="text-sky-400 font-bold block text-base">02 웹사이트</span>
                  <span className="text-slate-300 text-base block">구조</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900/90 border border-cyan-900/40 text-center">
                  <span className="text-cyan-400 font-bold block text-base">03 콘텐츠</span>
                  <span className="text-slate-300 text-base block">답변</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900/90 border border-teal-900/40 text-center">
                  <span className="text-teal-300 font-bold block text-base">04 인덱싱</span>
                  <span className="text-slate-300 text-base block">색인</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900/90 border border-teal-900/40 text-center">
                  <span className="text-teal-400 font-bold block text-base">05 백링크</span>
                  <span className="text-slate-300 text-base block">인용망</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900/90 border border-sky-900/40 text-center">
                  <span className="text-sky-300 font-bold block text-base">06 트래픽</span>
                  <span className="text-slate-300 text-base block">방문</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900/90 border border-indigo-900/40 text-center">
                  <span className="text-indigo-400 font-bold block text-base">07 성과측정</span>
                  <span className="text-slate-300 text-base block">병목</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900/90 border border-purple-900/40 text-center">
                  <span className="text-purple-400 font-bold block text-base">08 GEO-UP</span>
                  <span className="text-slate-300 text-base block">AI 인용</span>
                </div>
              </div>

              {/* Feedback Loop Direction Ribbon */}
              <div className="w-full mt-3 p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-900/40 flex items-center justify-between text-sm">
                <span className="text-base text-slate-300 font-mono flex items-center gap-1.5">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  <span>
                    <strong>피드백 루프:</strong> 07 측정에서 드러난 병목 데이터를 03 콘텐츠 및 05 백링크에 지속 재투입
                  </span>
                </span>
                <span className="text-sm font-mono text-cyan-400 font-bold shrink-0 ml-2">RE-INVEST</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-sm text-slate-500 font-mono flex items-center justify-between border-t border-slate-800/80 pt-3">
        <span>ONOFF MARKETING EDUCATION · 1강</span>
        <span>반복할수록 데이터와 실행 근거가 축적됩니다.</span>
      </div>
    </div>
  );
};
