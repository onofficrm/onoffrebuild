import React from 'react';
import { Award, CheckCircle2, ShieldCheck } from 'lucide-react';

export const Slide37CompletionCriteria: React.FC = () => {
  const criteria = [
    { num: '01', question: '정의·한계 설명 ✓' },
    { num: '02', question: '좋음 vs 스팸 구분 ✓' },
    { num: '03', question: 'TF/DR 맹신 ✗ · 종합 대조 ✓' },
    { num: '04', question: 'Wayback·앵커 직접 확인 ✓' },
    { num: '05', question: '선택 / PASS 근거 ✓' },
  ];

  return (
    <div className="w-full h-full p-12 flex flex-col justify-between relative overflow-hidden select-none bg-[#07111F]">
      {/* Background Accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-emerald-950/20 rounded-full blur-[140px]" />
      </div>

      {/* Top Header Tag + Title + Core Message */}
      <div className="relative z-10">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-black font-mono text-cyan-400">37</span>
            <span className="text-sm font-mono uppercase tracking-widest text-emerald-400 font-bold">
              COMPETENCY BENCHMARK · 수료 기준
            </span>
          </div>
          <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm font-mono font-bold">
            CHECKLIST
          </div>
        </div>

        <h2 className="text-4xl font-black text-white">
          2강 완료 기준 (스스로 판단하는 사람)
        </h2>
        <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-sky-300 to-cyan-400 mt-1">
          “찾기 → 판단”
        </p>
      </div>

      {/* Main Content: Big Dual Matrix (Left 5 Criteria, Right Master Card) */}
      <div className="relative z-10 my-auto py-2 grid grid-cols-12 gap-8 items-center">
        {/* Left Column (7 cols): 5 Checkpoints */}
        <div className="col-span-7 space-y-2.5 font-mono">
          {criteria.map((item) => (
            <div
              key={item.num}
              className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 flex items-center gap-3"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0">
                {item.num}
              </div>
              <span className="text-slate-200 font-sans text-base font-bold">
                {item.question}
              </span>
            </div>
          ))}
        </div>

        {/* Right Column (5 cols): Master Badge Card */}
        <div className="col-span-5 p-8 rounded-3xl bg-slate-950/90 border-2 border-emerald-500/60 shadow-2xl flex flex-col justify-between h-[340px]">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold block mb-2">
              FINAL VERDICT
            </span>
            <h3 className="text-2xl font-black text-white leading-snug">
              <span className="text-emerald-400">5 CHECKS = 2강 완료</span>
            </h3>
            <p className="text-sm text-slate-300 font-sans mt-3">
              <strong>독립적 판단력 ✓</strong>
            </p>
          </div>

          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 flex items-center justify-between text-xs font-mono font-bold text-emerald-300">
            <span className="flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" />
              <span>LECTURE 02 VERIFIED</span>
            </span>
            <span>PASS ✓</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-sm text-slate-500 font-mono flex items-center justify-between border-t border-slate-800/80 pt-4">
        <span>ONOFF MARKETING EDUCATION · 2강</span>
        <span>SLIDE 37 / 38</span>
      </div>
    </div>
  );
};
