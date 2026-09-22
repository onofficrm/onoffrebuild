import React from 'react';
import { FileCheck, CheckCircle2 } from 'lucide-react';

export const Slide36MissionOutcomes: React.FC = () => {
  const outcomes = [
    {
      num: '01',
      title: '후보 3개 발굴 목록',
      desc: '타겟 연계 후보 3개',
    },
    {
      num: '02',
      title: '5대 지표 분석표',
      desc: '5지표 분석표',
    },
    {
      num: '03',
      title: '제외·보류 근거서',
      desc: '제외·보류 근거',
    },
    {
      num: '04',
      title: '최종 결정 보고서',
      desc: '1개 채택 또는 PASS',
    },
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
            <span className="text-3xl font-black font-mono text-cyan-400">36</span>
            <span className="text-sm font-mono uppercase tracking-widest text-cyan-400 font-bold">
              TANGIBLE ASSETS · 실전 산출물
            </span>
          </div>
          <div className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-sm font-mono text-cyan-400 font-bold">
            4 DELIVERABLES
          </div>
        </div>

        <h2 className="text-4xl font-black text-white">
          2강 수강 후 손에 남는 4대 결과물
        </h2>
        <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 mt-1">
          “4대 실무 산출물”
        </p>
      </div>

      {/* Main Content: Big 4 Deliverable Cards */}
      <div className="relative z-10 my-auto py-2">
        <div className="p-8 rounded-3xl bg-slate-950/90 border border-slate-800 shadow-2xl">
          <div className="grid grid-cols-4 gap-4">
            {outcomes.map((item) => (
              <div
                key={item.num}
                className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between h-[230px] transition-transform hover:scale-[1.02]"
              >
                <div>
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      OUTPUT 0{item.num}
                    </span>
                    <FileCheck className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h3 className="text-lg font-black text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800 text-xs font-mono text-cyan-300 font-bold">
                  DELIVERABLE ASSET ✓
                </div>
              </div>
            ))}
          </div>

          {/* Under Standard Callout */}
          <div className="mt-6 p-4 rounded-xl bg-slate-900 border border-cyan-500/30 flex items-center justify-between text-base">
            <span className="text-slate-200 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <strong className="text-white">근거 기반 매수 / 패스 = 수료</strong>
            </span>
            <span className="text-sm font-mono text-emerald-400 font-bold">EVALUATION METRIC</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-sm text-slate-500 font-mono flex items-center justify-between border-t border-slate-800/80 pt-4">
        <span>ONOFF MARKETING EDUCATION · 2강</span>
        <span>SLIDE 36 / 38</span>
      </div>
    </div>
  );
};
