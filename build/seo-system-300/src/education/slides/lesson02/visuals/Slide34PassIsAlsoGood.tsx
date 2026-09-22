import React from 'react';
import { Filter, ShieldCheck, ArrowRight, Ban, Award } from 'lucide-react';

export const Slide34PassIsAlsoGood: React.FC = () => {
  const funnel = [
    { step: 'STAGE 01', count: '다수 후보', title: '초기 후보 수집', desc: '도메인 검색 및 TLD 수집', color: 'border-slate-700 bg-slate-900/60 text-slate-300' },
    { step: 'STAGE 02', count: '1차 검토', title: '지표 필터링', desc: 'TLD·후보 요약·제3자 지표 참고', color: 'border-blue-500/50 bg-blue-950/20 text-blue-300' },
    { step: 'STAGE 03', count: '정밀 검토', title: '히스토리 검증', desc: '아카이브·백링크 스팸 배제', color: 'border-cyan-500/50 bg-cyan-950/20 text-cyan-300' },
    { step: 'STAGE 04', count: '활용 후보', title: '최종 등록 확정', desc: '검증된 활용 후보', color: 'border-emerald-500/60 bg-emerald-950/30 text-emerald-300' },
  ];

  return (
    <div className="w-full h-full p-12 flex flex-col justify-between relative overflow-hidden select-none bg-[#07111F]">
      {/* Background Accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[140px]" />
      </div>

      {/* Top Header Tag + Title + Core Message */}
      <div className="relative z-10">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-black font-mono text-cyan-400">34</span>
            <span className="text-sm font-mono uppercase tracking-widest text-cyan-400 font-bold">
              PRUDENT SELECTION · 엄격한 선별 퍼널
            </span>
          </div>
          <div className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-sm font-mono text-cyan-400 font-bold">
            SELECTION FUNNEL
          </div>
        </div>

        <h2 className="text-4xl font-black text-white">
          “거르는 것도 실력이다” (선별 퍼널)
        </h2>
        <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-sky-300 to-cyan-400 mt-1">
          “검토 후 안전 후보만”
        </p>
      </div>

      {/* Main Content: Big Funnel 4-Stage Step Infographic */}
      <div className="relative z-10 my-auto py-2">
        <div className="p-8 rounded-3xl bg-slate-950/90 border border-slate-800 shadow-2xl">
          <div className="grid grid-cols-4 gap-4 relative items-center">
            {funnel.map((fn, idx) => (
              <div key={fn.step} className="relative flex flex-col">
                <div className={`p-6 rounded-2xl border ${fn.color} flex flex-col justify-between h-[250px] transition-transform hover:scale-[1.02]`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      {fn.step}
                    </span>
                    <strong className="text-2xl font-black font-mono text-cyan-300">
                      {fn.count}
                    </strong>
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-white mb-1">
                      {fn.title}
                    </h3>
                    <p className="text-xs text-slate-300 font-sans">
                      {fn.desc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 text-xs font-mono text-slate-400">
                    {idx === 0 ? '후보군 풀' : idx === 1 ? '1차 선별' : idx === 2 ? '정밀 확인' : '선별 완료 ✓'}
                  </div>
                </div>

                {idx < 3 && (
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center text-cyan-400">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Under Strategy Callout */}
          <div className="mt-6 p-4 rounded-xl bg-slate-900 border border-cyan-500/30 flex items-center justify-between text-base">
            <span className="text-slate-200 font-bold flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <strong className="text-white">애매하면 PASS → 신규</strong>
            </span>
            <span className="text-sm font-mono text-cyan-400 font-bold">RISK CHECK</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-sm text-slate-500 font-mono flex items-center justify-between border-t border-slate-800/80 pt-4">
        <span>ONOFF MARKETING EDUCATION · 2강</span>
        <span>SLIDE 34 / 38</span>
      </div>
    </div>
  );
};
