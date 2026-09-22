import React from 'react';
import { CheckCircle2, PauseCircle, AlertOctagon, Trash2, ArrowRight } from 'lucide-react';

export const Slide26Check02History: React.FC = () => {
  const timeline = [
    { num: '01', title: '정상 운영', status: 'SAFE', icon: CheckCircle2, color: 'border-emerald-500/60 bg-emerald-950/20 text-emerald-300' },
    { num: '02', title: '운영 중단', status: 'NOTICE', icon: PauseCircle, color: 'border-amber-500/60 bg-amber-950/20 text-amber-300' },
    { num: '03', title: '스팸 변조', status: 'TOXIC', icon: AlertOctagon, color: 'border-rose-500/80 bg-rose-950/30 text-rose-300' },
    { num: '04', title: '삭제', status: 'DROPPED', icon: Trash2, color: 'border-slate-700 bg-slate-900/60 text-slate-400' },
  ];

  return (
    <div className="w-full h-full p-12 flex flex-col justify-between relative overflow-hidden select-none bg-[#07111F]">
      {/* Background Accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[140px]" />
      </div>

      {/* Top Header Tag + Title + Core Message */}
      <div className="relative z-10">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-black font-mono text-cyan-400">CHECK 02</span>
            <span className="text-sm font-mono uppercase tracking-widest text-cyan-400 font-bold">
              HISTORICAL ARCHIVE · 과거 사이트 이력
            </span>
          </div>
          <div className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-sm font-mono text-cyan-400 font-bold">
            WAYBACK MACHINE
          </div>
        </div>

        <h2 className="text-5xl font-black text-white">
          과거 이력을 시간순으로 확인
        </h2>
        <p className="text-3xl font-black text-rose-300 mt-2">
          스팸 변조 흔적이 한 번이라도 있으면 제외
        </p>
      </div>

      {/* Main Content: Big 4-Stage History Timeline Flow */}
      <div className="relative z-10 my-auto py-2">
        <div className="p-8 rounded-3xl bg-slate-950/90 border border-slate-800 shadow-2xl">
          <div className="grid grid-cols-4 gap-4 relative items-center">
            {timeline.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="relative flex flex-col">
                  <div className={`p-6 rounded-2xl border-2 ${item.color} flex flex-col justify-between h-[250px]`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-slate-400">
                        {item.num}
                      </span>
                      <Icon className="w-5 h-5" />
                    </div>

                    <div>
                      <span className="text-base font-mono font-black block mb-2">
                        {item.status}
                      </span>
                      <h3 className="text-3xl font-black text-white">
                        {item.title}
                      </h3>
                    </div>
                    <div className="h-1.5 rounded-full bg-current opacity-60" />
                  </div>

                  {idx < 3 && (
                    <div className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center text-cyan-400">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 rounded-xl bg-rose-950/30 border-2 border-rose-500/50 flex items-center justify-center gap-3 text-xl">
            <AlertOctagon className="w-7 h-7 text-rose-400" />
            <strong className="text-rose-300">변조 발견 → 즉시 탈락</strong>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-sm text-slate-500 font-mono flex items-center justify-between border-t border-slate-800/80 pt-4">
        <span>ONOFF MARKETING EDUCATION · 2강</span>
        <span>SLIDE 26 / 38</span>
      </div>
    </div>
  );
};
