import React from 'react';
import { Target, Square, ShieldCheck } from 'lucide-react';

interface Slide35Lesson2MissionProps {
  onOpenWorkspace?: () => void;
}

export const Slide35Lesson2Mission: React.FC<Slide35Lesson2MissionProps> = () => {
  const candidates = [
    {
      id: '후보 A',
      color: 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300',
      tag: 'RECOMMENDED',
      verdict: '추천',
      verdictColor: 'text-emerald-400',
    },
    {
      id: '후보 B',
      color: 'border-rose-500/50 bg-rose-950/20 text-rose-300',
      tag: 'INSTANT DROP',
      verdict: '제외',
      verdictColor: 'text-rose-400',
    },
    {
      id: '후보 C',
      color: 'border-amber-500/50 bg-amber-950/20 text-amber-300',
      tag: 'ON HOLD',
      verdict: '보류',
      verdictColor: 'text-amber-300',
    },
  ];

  const checks = [
    { key: '01', label: '이력' },
    { key: '02', label: '백링크' },
    { key: '03', label: '앵커' },
    { key: '04', label: '스팸' },
    { key: '05', label: '판정' },
  ];

  return (
    <div className="w-full h-full p-12 flex flex-col justify-between relative overflow-hidden select-none bg-[#07111F]">
      {/* Background Subtle Gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[140px]" />
      </div>

      {/* Top Header Tag + Title + Core Message */}
      <div className="relative z-10">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-black font-mono text-cyan-400">35</span>
            <span className="text-sm font-mono uppercase tracking-widest text-cyan-400 font-bold">
              HANDS-ON MISSION · 2강 실전 과제
            </span>
          </div>
          <div className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-sm font-mono font-bold">
            MISSION BOARD
          </div>
        </div>

        <h2 className="text-5xl font-black text-white">
          후보 3개를 직접 판정하라
        </h2>
        <p className="text-3xl font-black text-cyan-300 mt-2">
          5개 체크를 거쳐 추천 · 보류 · 제외
        </p>
      </div>

      <div className="relative z-10 my-auto py-2">
        <div className="p-8 rounded-3xl bg-slate-950/90 border border-slate-800 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-8 h-8 text-cyan-400" />
            <span className="text-xl font-black text-white">MISSION CHECKPOINTS</span>
          </div>

          <div className="grid grid-cols-5 gap-4 mb-7">
            {checks.map((item) => (
              <div key={item.key} className="h-[125px] rounded-2xl bg-slate-900 border-2 border-cyan-500/30 flex flex-col items-center justify-center gap-3">
                <Square className="w-7 h-7 text-cyan-400" />
                <strong className="text-2xl text-white">{item.label}</strong>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-5">
          {candidates.map((cand) => (
            <div
              key={cand.id}
              className={`p-5 rounded-2xl border-2 ${cand.color} flex items-center justify-between h-[115px]`}
            >
              <div>
                <span className="font-black text-white text-2xl">{cand.id}</span>
                <div className="text-base font-mono font-bold mt-1">{cand.tag}</div>
              </div>
              <div className={`text-3xl font-black ${cand.verdictColor}`}>
                {cand.verdict}
              </div>
            </div>
          ))}
          </div>
        </div>

        <div className="mt-5 p-4 rounded-xl bg-slate-900 border border-cyan-500/30 flex items-center justify-between text-base">
          <span className="text-slate-200 font-bold flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <strong className="text-white">매수 / 보류 / 제외 · 근거 판정</strong>
          </span>
          <span className="text-sm font-mono text-cyan-400 font-bold">PRUDENT DECISION</span>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-sm text-slate-500 font-mono flex items-center justify-between border-t border-slate-800/80 pt-4">
        <span>ONOFF MARKETING EDUCATION · 2강</span>
        <span>SLIDE 35 / 38</span>
      </div>
    </div>
  );
};
