import React from 'react';
import { Users, ArrowRight, MousePointerClick, Clock, Search, BarChart2, ShieldAlert, Sparkles } from 'lucide-react';

export const Slide10Step06Traffic: React.FC = () => {
  return (
    <div className="w-full h-full p-8 md:p-12 flex flex-col justify-between relative overflow-hidden select-none bg-[#07111F]">
      {/* Background Blue-Cyan Accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-900/15 rounded-full blur-[120px]" />
      </div>

      {/* Top Header Tag */}
      <div className="relative z-10 flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl sm:text-4xl font-black font-mono text-cyan-400 tracking-tighter">
            06
          </span>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
              PHASE 03 · TRUST & DISTRIBUTION
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              STEP 06 · 트래픽 (Real Visitor Journey Simulation)
            </h2>
          </div>
        </div>
        <div className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold">
          TOOL: traffic.icrm.co.kr
        </div>
      </div>

      {/* Main Content: Layout B (Left 60% Visitor Journey Graphic + Right 40% Key Narrative) */}
      <div className="relative z-10 my-auto py-2 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Visitor Journey Graphic (7 cols) */}
        <div className="lg:col-span-7">
          <div className="p-5 rounded-2xl bg-slate-950/90 border border-cyan-900/40 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs font-mono">
              <div className="flex items-center gap-2 text-slate-300 font-bold">
                <Search className="w-4 h-4 text-cyan-400" />
                <span>USER SEARCH & INTERACTION PIPELINE</span>
              </div>
              <span className="text-cyan-400 font-bold text-[11px]">AVG DWELL TIME: 3M 40S</span>
            </div>

            {/* 3-Step Journey Sequence */}
            <div className="space-y-2.5 font-mono">
              {/* Step 1: Google SERP Impression */}
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                    01
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">GOOGLE SEARCH QUERY</span>
                    <span className="text-xs font-bold text-white block">
                      "기업 맞춤형 마케팅 솔루션 비교" 검색
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-cyan-400 font-bold">SERP CLICK</span>
              </div>

              {/* Step 2: Website Landing & Dwell */}
              <div className="p-3 rounded-xl bg-slate-900/90 border border-cyan-500/40 flex items-center justify-between shadow-md shadow-cyan-950/30">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-xs">
                    02
                  </div>
                  <div>
                    <span className="text-[10px] text-cyan-400 block">ENGAGED LANDING VISIT</span>
                    <span className="text-xs font-bold text-cyan-200 block">
                      콘텐츠 85% 정독 & 체류 시간 3분 40초 유지
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold">ZERO BOUNCE</span>
              </div>

              {/* Step 3: Behavior & Conversion */}
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                    03
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">CONVERSION EVENT</span>
                    <span className="text-xs font-bold text-white block">
                      내부 사일로 글 추가 탐색 및 상담 문의 제출
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold">GOAL HIT</span>
              </div>
            </div>

            {/* Bottom Deliverable Ribbon */}
            <div className="mt-3 p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-900/40 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-300 font-mono">
                <strong className="text-cyan-300">실습 미션:</strong> traffic.icrm.co.kr로 실제 체류형 검색 유입 신호 가동
              </span>
              <ArrowRight className="w-4 h-4 text-cyan-400 shrink-0" />
            </div>
          </div>
        </div>

        {/* Right Column: Narrative (5 cols) */}
        <div className="lg:col-span-5 space-y-3.5">
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-900/40">
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block mb-1">
              ENGAGEMENT SIGNALS
            </span>
            <p className="text-lg sm:text-xl font-black text-white leading-snug">
              “사이트를 만들었다면,<br />
              <span className="text-cyan-400">실제 사용자가 들어와야</span> 합니다.”
            </p>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              체류 시간, 스크롤, 페이지 상호작용 등 <strong className="text-white">실제 사용자 신호(User Engagement)</strong>는 사용자 행동을 이해하는 참고 데이터입니다.
            </p>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">의미 없는 단순 트래픽 부풀리기</span>
              <span className="text-rose-400 font-bold">이탈율 95% (무효) ✕</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/70 border border-cyan-900/40 flex items-center justify-between">
              <span className="text-white font-bold">자연스러운 체류 & 상호작용 유입</span>
              <span className="text-cyan-400 font-bold">순위 상승 신호 반영 ✓</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-xs text-slate-500 font-mono flex items-center justify-between border-t border-slate-800/80 pt-3">
        <span>ONOFF MARKETING EDUCATION · 1강</span>
        <span>진성 사용자의 만족스러운 체류가 검색엔진에게 가장 확실한 추천서입니다.</span>
      </div>
    </div>
  );
};
