import React from 'react';
import { Award, History, Compass, Link2, Tag, AlertOctagon, ShieldCheck } from 'lucide-react';

export const Slide24HolisticEvaluation: React.FC = () => {
  const vectors = [
    { eng: 'HISTORY', label: '운영 이력', icon: History, color: 'border-blue-500/50 bg-blue-950/20 text-blue-300' },
    { eng: 'RELEVANCE', label: '주제 맥락', icon: Compass, color: 'border-cyan-500/50 bg-cyan-950/20 text-cyan-300' },
    { eng: 'BACKLINKS', label: '링크 품질', icon: Link2, color: 'border-teal-500/50 text-teal-300 bg-teal-950/20' },
    { eng: 'ANCHORS', label: '앵커 분포', icon: Tag, color: 'border-indigo-500/50 text-indigo-300 bg-indigo-950/20' },
    { eng: 'SPAM', label: '스팸 신호', icon: AlertOctagon, color: 'border-rose-500/50 text-rose-300 bg-rose-950/20' },
    { eng: 'BRAND', label: '상표 리스크', icon: ShieldCheck, color: 'border-amber-500/50 text-amber-300 bg-amber-950/20' },
  ];

  return (
    <div className="w-full h-full p-12 flex flex-col justify-between relative overflow-hidden select-none bg-[#07111F]">
      {/* Background Accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[140px]" />
      </div>

      {/* Top Header Tag + Title + Core Message */}
      <div className="relative z-10">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-black font-mono text-cyan-400">24</span>
            <span className="text-sm font-mono uppercase tracking-widest text-cyan-400 font-bold">
              HOLISTIC EVALUATION · 종합 평가
            </span>
          </div>
          <div className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-sm font-mono text-cyan-400 font-bold">
            6-VECTOR MATRIX
          </div>
        </div>

        <h2 className="text-5xl font-black text-white">
          도메인 품질은 종합 판정
        </h2>
        <p className="text-3xl font-black text-cyan-300 mt-2">
          한 개 지표가 아닌 6개 신호를 함께 본다
        </p>
      </div>

      {/* Main Content: Big Radial Grid (Left Hub + Right 6 Satellites) */}
      <div className="relative z-10 my-auto py-2">
        <div className="p-8 rounded-3xl bg-slate-950/90 border border-slate-800 shadow-2xl">
          <div className="grid grid-cols-12 gap-6 items-center">
            {/* Center Hub (4 cols) */}
            <div className="col-span-4 p-8 rounded-full aspect-square max-h-[310px] bg-gradient-to-br from-cyan-950/80 via-slate-900 to-blue-950/80 border-4 border-cyan-400/80 shadow-2xl flex flex-col justify-center items-center text-center">
              <div>
                <Award className="w-16 h-16 text-cyan-400 mx-auto mb-3" />
                <h3 className="text-3xl font-black text-white">
                  종합 품질
                </h3>
                <p className="text-lg text-cyan-300 font-mono font-black mt-1">
                  PASS / HOLD / DROP
                </p>
              </div>
            </div>

            {/* 6 Surrounding Satellites Grid (8 cols) */}
            <div className="col-span-8 grid grid-cols-3 gap-3.5">
              {vectors.map((v) => {
                const Icon = v.icon;
                return (
                  <div
                    key={v.eng}
                    className={`p-5 rounded-2xl border-2 ${v.color} flex flex-col justify-between h-[135px]`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-slate-400">
                        {v.eng}
                      </span>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-white">
                        {v.label}
                      </h4>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-sm text-slate-500 font-mono flex items-center justify-between border-t border-slate-800/80 pt-4">
        <span>ONOFF MARKETING EDUCATION · 2강</span>
        <span>SLIDE 24 / 38</span>
      </div>
    </div>
  );
};
