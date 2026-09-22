import React from 'react';
import { Globe, Clock, Trash2, RefreshCw, ArrowRight } from 'lucide-react';

export const Slide22WhatIsExpiredDomain: React.FC = () => {
  const steps = [
    { num: '01', title: '운영', eng: 'ACTIVE', icon: Globe, color: 'border-blue-500/60 bg-blue-950/30 text-blue-300' },
    { num: '02', title: '만료', eng: 'EXPIRED', icon: Clock, color: 'border-amber-500/60 bg-amber-950/30 text-amber-300' },
    { num: '03', title: '삭제', eng: 'DROPPED', icon: Trash2, color: 'border-rose-500/60 bg-rose-950/30 text-rose-300' },
    { num: '04', title: '재등록', eng: 'AVAILABLE', icon: RefreshCw, color: 'border-emerald-500/60 bg-emerald-950/30 text-emerald-300' },
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
            <span className="text-3xl font-black font-mono text-cyan-400">22</span>
            <span className="text-sm font-mono uppercase tracking-widest text-cyan-400 font-bold">
              DOMAIN LIFECYCLE · 낙장도메인 정의
            </span>
          </div>
          <div className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-sm font-mono text-cyan-400 font-bold">
            TIMELINE
          </div>
        </div>

        <h2 className="text-5xl font-black text-white">
          낙장도메인이란 무엇인가?
        </h2>
        <p className="text-3xl font-black text-cyan-300 mt-2">
          만료되고 삭제된 뒤, 다시 등록 가능한 도메인
        </p>
      </div>

      {/* Main Content: Big 4-Stage Lifecycle Flow */}
      <div className="relative z-10 my-auto py-2">
        <div className="p-10 rounded-3xl bg-slate-950/90 border border-slate-800 shadow-2xl">
          <div className="grid grid-cols-4 gap-6 relative items-center">
            {steps.map((st, idx) => {
              const Icon = st.icon;
              return (
                <div key={st.title} className="relative flex flex-col">
                  <div className={`p-7 rounded-2xl border-2 ${st.color} flex flex-col justify-between h-[250px]`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-slate-400">
                        {st.num}
                      </span>
                      <Icon className="w-5 h-5" />
                    </div>

                    <div>
                      <h3 className="text-4xl font-black text-white mb-2">
                        {st.title}
                      </h3>
                      <p className="text-lg font-mono font-black">
                        {st.eng}
                      </p>
                    </div>
                    <div className="h-1.5 rounded-full bg-current opacity-60" />
                  </div>

                  {idx < 3 && (
                    <div className="absolute -right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center text-cyan-400">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex justify-center gap-3 text-lg font-black">
            {['만료', '삭제', '재등록'].map((word) => (
              <span key={word} className="px-5 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">{word}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-sm text-slate-500 font-mono flex items-center justify-between border-t border-slate-800/80 pt-4">
        <span>ONOFF MARKETING EDUCATION · 2강</span>
        <span>SLIDE 22 / 38</span>
      </div>
    </div>
  );
};
