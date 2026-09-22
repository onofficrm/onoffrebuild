import React from 'react';
import { AlertOctagon, Flame, Skull, Link2Off, RefreshCw, Ban } from 'lucide-react';

export const Slide29Check05SpamSignals: React.FC = () => {
  const flags = [
    { code: '01', title: '도박·성인', icon: Flame },
    { code: '02', title: '문서 복제', icon: Skull },
    { code: '03', title: '링크 급증', icon: Link2Off },
    { code: '04', title: '주제 변조', icon: RefreshCw },
    { code: '05', title: '상표·리디렉션', icon: Ban },
  ];

  return (
    <div className="w-full h-full p-12 flex flex-col justify-between relative overflow-hidden select-none bg-[#07111F]">
      {/* Background Accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-rose-950/20 rounded-full blur-[140px]" />
      </div>

      {/* Top Header Tag + Title + Core Message */}
      <div className="relative z-10">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-black font-mono text-rose-400">CHECK 05</span>
            <span className="text-sm font-mono uppercase tracking-widest text-rose-400 font-bold">
              SPAM SIGNALS · 치명적 위험 신호
            </span>
          </div>
          <div className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/40 text-rose-400 text-sm font-mono font-bold">
            ZERO TOLERANCE
          </div>
        </div>

        <h2 className="text-5xl font-black text-white">
          스팸 레드 플래그 5
        </h2>
        <p className="text-3xl font-black text-rose-300 mt-2">
          하나라도 보이면 멈추고 검증
        </p>
      </div>

      {/* Main Content: Big 6 Red Flag Cards Grid */}
      <div className="relative z-10 my-auto py-2">
        <div className="p-8 rounded-3xl bg-slate-950/90 border border-rose-900/50 shadow-2xl">
          <div className="grid grid-cols-5 gap-4">
            {flags.map((flag) => {
              const Icon = flag.icon;
              return (
                <div
                  key={flag.code}
                  className="p-6 rounded-2xl bg-gradient-to-b from-rose-950/50 to-slate-900 border-2 border-rose-500/40 flex flex-col items-center justify-center text-center gap-5 h-[240px]"
                >
                  <div className="w-20 h-20 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                    <Icon className="w-10 h-10 text-rose-400" />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-rose-400">FLAG {flag.code}</span>
                    <h3 className="text-xl font-black text-white mt-1">
                      {flag.title}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 rounded-xl bg-rose-950/30 border border-rose-500/40 text-center">
            <span className="text-xl font-black text-rose-300">
              탐지 → 검증 → 보류 / 제외
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-sm text-slate-500 font-mono flex items-center justify-between border-t border-slate-800/80 pt-4">
        <span>ONOFF MARKETING EDUCATION · 2강</span>
        <span>SLIDE 29 / 38</span>
      </div>
    </div>
  );
};
