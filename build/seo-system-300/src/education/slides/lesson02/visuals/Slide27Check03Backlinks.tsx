import React from 'react';
import { Landmark, Newspaper, Building2, Globe2, AlertOctagon, XCircle, CheckCircle2 } from 'lucide-react';

export const Slide27Check03Backlinks: React.FC = () => {
  const clean = [
    { title: '공공기관', icon: Landmark },
    { title: '언론사', icon: Newspaper },
    { title: '협회·연구소', icon: Building2 },
    { title: '분산 네트워크', icon: Globe2 },
  ];

  const toxic = [
    { title: '자동 링크팜', icon: Globe2 },
    { title: '사설 PBN', icon: AlertOctagon },
    { title: '도박·성인', icon: AlertOctagon },
    { title: '단일 IP 도배', icon: XCircle },
  ];

  return (
    <div className="w-full h-full p-12 flex flex-col justify-between relative overflow-hidden select-none bg-[#07111F]">
      {/* Background Accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[140px]" />
      </div>

      {/* Top Header Tag + Title + Core Message */}
      <div className="relative z-10">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-black font-mono text-cyan-400">CHECK 03</span>
            <span className="text-sm font-mono uppercase tracking-widest text-cyan-400 font-bold">
              BACKLINK QUALITY · 백링크 품질 비교
            </span>
          </div>
          <div className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-sm font-mono text-cyan-400 font-bold">
            CLEAN VS TOXIC
          </div>
        </div>

        <h2 className="text-5xl font-black text-white">
          백링크는 양보다 출처
        </h2>
        <p className="text-3xl font-black text-cyan-300 mt-2">
          신뢰 출처는 통과 · 조작 네트워크는 제외
        </p>
      </div>

      {/* Main Content: Big Dual Column Matrix (Clean vs Toxic) */}
      <div className="relative z-10 my-auto py-2 grid grid-cols-2 gap-8 items-stretch">
        {/* Left Column: Clean Authority */}
        <div className="p-7 rounded-3xl bg-slate-950/90 border-2 border-emerald-500/60 shadow-2xl flex flex-col justify-between h-[380px]">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-emerald-950/60">
              <span className="text-xl font-black text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6" />
                <span>신뢰 네트워크</span>
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                SAFE PASS ✓
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {clean.map((c) => {
                const Icon = c.icon;
                return (
                  <div key={c.title} className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/20 flex flex-col items-center justify-center gap-3 h-[105px]">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-black text-white">{c.title}</h4>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-lg text-emerald-300 font-bold text-center">
            고권위 자연 링크
          </div>
        </div>

        {/* Right Column: Toxic Link Farm */}
        <div className="p-7 rounded-3xl bg-slate-950/90 border-2 border-rose-500/50 shadow-2xl flex flex-col justify-between h-[380px]">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-rose-950/60">
              <span className="text-xl font-black text-rose-400 flex items-center gap-2">
                <XCircle className="w-6 h-6" />
                <span>조작 네트워크</span>
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono font-bold">
                DROP ✗
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {toxic.map((t) => {
                const Icon = t.icon;
                return (
                  <div key={t.title} className="p-5 rounded-2xl bg-slate-900 border border-rose-500/20 flex flex-col items-center justify-center gap-3 h-[105px]">
                    <div className="w-10 h-10 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-black text-white">{t.title}</h4>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 text-lg text-rose-300 font-bold text-center">
            조작 링크 = 리스크
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-sm text-slate-500 font-mono flex items-center justify-between border-t border-slate-800/80 pt-4">
        <span>ONOFF MARKETING EDUCATION · 2강</span>
        <span>SLIDE 27 / 38</span>
      </div>
    </div>
  );
};
