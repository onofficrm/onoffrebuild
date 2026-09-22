import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

export const Slide28Check04AnchorText: React.FC = () => {
  const clean = [
    { label: '브랜드', percent: '65%' },
    { label: '도메인 URL', percent: '23%' },
    { label: '일반 자연어', percent: '12%' },
  ];

  const toxic = [
    { label: '도박 키워드', percent: '62%' },
    { label: '성인·대출', percent: '28%' },
    { label: '정상 브랜드', percent: '10%' },
  ];

  return (
    <div className="w-full h-full p-12 flex flex-col justify-between relative overflow-hidden select-none bg-[#07111F]">
      {/* Background Accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-teal-900/10 rounded-full blur-[140px]" />
      </div>

      {/* Top Header Tag + Title + Core Message */}
      <div className="relative z-10">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-black font-mono text-cyan-400">CHECK 04</span>
            <span className="text-sm font-mono uppercase tracking-widest text-cyan-400 font-bold">
              ANCHOR PROFILE · 앵커 텍스트 검증
            </span>
          </div>
          <div className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-sm font-mono text-cyan-400 font-bold">
            NATURAL VS TOXIC
          </div>
        </div>

        <h2 className="text-5xl font-black text-white">
          앵커 분포가 조작을 드러낸다
        </h2>
        <p className="text-3xl font-black text-cyan-300 mt-2">
          브랜드 중심은 통과 · 스팸 중심은 제외
        </p>
      </div>

      {/* Main Content: Big Dual Matrix (Clean vs Toxic) */}
      <div className="relative z-10 my-auto py-2 grid grid-cols-2 gap-8 items-stretch">
        {/* Left Column: Clean */}
        <div className="p-7 rounded-3xl bg-slate-950/90 border-2 border-emerald-500/60 shadow-2xl flex flex-col justify-between h-[360px]">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-emerald-950/60">
              <span className="text-xl font-black text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6" />
                <span>자연 앵커</span>
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                SAFE PASS ✓
              </span>
            </div>

            <div className="space-y-5 font-mono">
              {clean.map((c) => (
                <div key={c.label}>
                  <div className="mb-2 flex items-end justify-between">
                    <h4 className="text-xl font-black text-white">{c.label}</h4>
                    <span className="text-2xl font-black text-emerald-400">{c.percent}</span>
                  </div>
                  <div className="h-4 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-400" style={{ width: c.percent }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-lg text-emerald-300 font-bold text-center">
            자연 브랜드 앵커
          </div>
        </div>

        {/* Right Column: Toxic */}
        <div className="p-7 rounded-3xl bg-slate-950/90 border border-rose-500/50 shadow-2xl flex flex-col justify-between h-[360px]">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-rose-950/60">
              <span className="text-xl font-black text-rose-400 flex items-center gap-2">
                <XCircle className="w-6 h-6" />
                <span>스팸 앵커</span>
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono font-bold">
                DROP ✗
              </span>
            </div>

            <div className="space-y-5 font-mono">
              {toxic.map((t) => (
                <div key={t.label}>
                  <div className="mb-2 flex items-end justify-between">
                    <h4 className="text-xl font-black text-white">{t.label}</h4>
                    <span className="text-2xl font-black text-rose-400">{t.percent}</span>
                  </div>
                  <div className="h-4 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full rounded-full bg-rose-400" style={{ width: t.percent }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 text-lg text-rose-300 font-bold text-center">
            조작·해킹 신호
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-sm text-slate-500 font-mono flex items-center justify-between border-t border-slate-800/80 pt-4">
        <span>ONOFF MARKETING EDUCATION · 2강</span>
        <span>SLIDE 28 / 38</span>
      </div>
    </div>
  );
};
