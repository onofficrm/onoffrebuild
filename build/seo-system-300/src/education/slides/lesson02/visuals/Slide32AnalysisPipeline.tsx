import React from 'react';
import { Search, Tag, History, Link2, Filter, AlertOctagon, Scale, CheckCircle2, ArrowRight } from 'lucide-react';

export const Slide32AnalysisPipeline: React.FC = () => {
  const steps = [
    { num: '01', title: '후보 검색', icon: Search },
    { num: '02', title: '주제 관련성', icon: Tag },
    { num: '03', title: '아카이브', icon: History },
    { num: '04', title: '백링크', icon: Link2 },
    { num: '05', title: '앵커', icon: Filter },
    { num: '06', title: '스팸 위험', icon: AlertOctagon },
    { num: '07', title: '후보 비교', icon: Scale },
    { num: '08', title: '최종 판정', icon: CheckCircle2 },
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
            <span className="text-3xl font-black font-mono text-cyan-400">32</span>
            <span className="text-sm font-mono uppercase tracking-widest text-cyan-400 font-bold">
              EXECUTION ROADMAP · 8단계 실무 파이프라인
            </span>
          </div>
          <div className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-sm font-mono text-cyan-400 font-bold">
            8-STEP PIPELINE
          </div>
        </div>

        <h2 className="text-4xl font-black text-white">
          낙장도메인 8단계 검증 파이프라인
        </h2>
        <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 mt-1">
          “8단계 스크리닝”
        </p>
      </div>

      {/* Main Content: Big 8-Step Pipeline Grid (4x2) */}
      <div className="relative z-10 my-auto py-2">
        <div className="p-8 rounded-3xl bg-slate-950/90 border border-slate-800 shadow-2xl">
          <div className="grid grid-cols-4 gap-4">
            {steps.map((st, idx) => {
              const Icon = st.icon;
              const isLast = idx === 7;
              return (
                <div
                  key={st.num}
                  className={`p-5 rounded-2xl border ${
                    isLast
                      ? 'border-emerald-500/80 bg-emerald-950/20 text-emerald-300'
                      : 'border-slate-800 bg-slate-900/80 text-white'
                  } flex flex-col justify-between h-[135px] transition-transform hover:scale-[1.02]`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      STEP {st.num}
                    </span>
                    <Icon className={`w-5 h-5 ${isLast ? 'text-emerald-400' : 'text-slate-400'}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black font-mono">
                      {st.title}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Under Line Rule */}
          <div className="mt-6 p-4 rounded-xl bg-slate-900 border border-cyan-500/30 flex items-center justify-between text-base">
            <span className="text-slate-200 font-bold">
              FAST-FAIL · 즉시 다음 후보
            </span>
            <span className="text-sm font-mono text-cyan-400 font-bold">FAST-FAIL WORKFLOW</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-sm text-slate-500 font-mono flex items-center justify-between border-t border-slate-800/80 pt-4">
        <span>ONOFF MARKETING EDUCATION · 2강</span>
        <span>SLIDE 32 / 38</span>
      </div>
    </div>
  );
};
