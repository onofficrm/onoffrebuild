import React from 'react';
import { CheckCircle2, ArrowRight, Activity, TrendingUp, Sparkles, Flag } from 'lucide-react';

export const Slide38NextPreview: React.FC = () => {
  const pipeline = [
    { name: 'DOMAIN', kor: '도메인' },
    { name: 'WEBSITE', kor: '웹사이트' },
    { name: 'CONTENT', kor: '콘텐츠' },
    { name: 'INDEX', kor: '인덱스' },
    { name: 'BACKLINK', kor: '백링크' },
    { name: 'TRAFFIC', kor: '트래픽' },
    { name: 'MEASURE', kor: '성과측정' },
    { name: 'GEO-UP', kor: 'AI 추천' },
  ];

  const flywheelCore = ['EXECUTE', 'MEASURE', 'IMPROVE'];

  return (
    <div className="w-full h-full p-12 flex flex-col justify-between relative overflow-hidden select-none bg-[#07111F]">
      {/* Background Accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-cyan-600/10 rounded-full blur-[150px]" />
        <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[130px]" />
      </div>

      {/* Top Header Tag + Title + Core Message */}
      <div className="relative z-10">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-black font-mono text-cyan-400">38</span>
            <span className="text-sm font-mono uppercase tracking-widest text-cyan-400 font-bold">
              COURSE COMPLETION · 교육 과정 완료
            </span>
          </div>
          <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm font-mono font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            FINAL STEP
          </div>
        </div>

        <h2 className="text-4xl font-black text-white">
          SEO·GEO 실전 프로세스 기초 과정 완료
        </h2>
        <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-400 mt-1">
          “교육 끝 → 실행 시작”
        </p>
      </div>

      {/* Main Content: Big 8-Stage Flywheel Pipeline Infographic */}
      <div className="relative z-10 my-auto py-2">
        <div className="p-8 rounded-3xl bg-slate-950/90 border border-slate-800 shadow-2xl">
          {/* 8 Pipeline Nodes Flow */}
          <div className="grid grid-cols-8 gap-2.5 relative items-center mb-6">
            {pipeline.map((item, idx) => (
              <div key={item.name} className="relative flex flex-col">
                <div className="p-3.5 rounded-2xl border border-slate-700 bg-slate-900/90 flex flex-col items-center justify-between text-center h-[115px] transition-transform hover:scale-105">
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    0{idx + 1}
                  </span>
                  <div>
                    <h3 className="text-base font-black font-mono text-white tracking-tight">
                      {item.name}
                    </h3>
                    <p className="text-xs font-bold text-slate-300 mt-0.5">
                      {item.kor}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">
                    STAGE
                  </span>
                </div>

                {idx < 7 && (
                  <div className="absolute -right-2.5 top-1/2 -translate-y-1/2 z-20 w-5 h-5 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center text-cyan-400">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Central Flywheel Core Loop: EXECUTE -> MEASURE -> IMPROVE */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-emerald-950/60 border-2 border-cyan-400/70 flex items-center justify-between shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
                <Activity className="w-6 h-6 text-cyan-400 animate-pulse" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider block">
                  ACTION ENGINE
                </span>
                <span className="text-base font-black text-white">
                  EXECUTE · MEASURE · IMPROVE
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 font-mono font-black text-base">
              {flywheelCore.map((word, index) => (
                <React.Fragment key={word}>
                  <div className="px-4 py-2 rounded-xl bg-slate-900/90 border border-cyan-500/40 text-cyan-300 shadow-md">
                    {word}
                  </div>
                  {index < flywheelCore.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-cyan-400 shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Bottom Dual Lecture Milestone Badge + Inspiring Callout */}
          <div className="mt-5 pt-4 border-t border-slate-800 grid grid-cols-12 gap-6 items-center">
            {/* Left Badges */}
            <div className="col-span-5 flex items-center gap-4">
              <div className="flex-1 p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-slate-400 block font-bold">LECTURE 01</span>
                  <span className="text-sm font-bold text-white">전체 프로세스 이해</span>
                </div>
                <span className="text-xs font-mono text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                  ✓ COMPLETE
                </span>
              </div>

              <div className="flex-1 p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-slate-400 block font-bold">LECTURE 02</span>
                  <span className="text-sm font-bold text-white">낙장도메인 실전 분석</span>
                </div>
                <span className="text-xs font-mono text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                  ✓ COMPLETE
                </span>
              </div>
            </div>

            {/* Right Callout */}
            <div className="col-span-7 flex items-center justify-end gap-3 text-right">
              <div>
                <p className="text-lg font-black text-white">
                  “배운 것보다 직접 실행한 결과를 남기세요.”
                </p>
                <span className="text-xs font-mono font-bold text-cyan-400 tracking-wider">
                  ONOFF MARKETING EDUCATION
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-sm text-slate-500 font-mono flex items-center justify-between border-t border-slate-800/80 pt-4">
        <span>ONOFF MARKETING EDUCATION DECK</span>
        <span>SLIDE 38 / 38 · 전체 기초 과정 완료</span>
      </div>
    </div>
  );
};
