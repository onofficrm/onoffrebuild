import React from 'react';
import { Link2, ArrowRight, ShieldCheck, Globe, CheckCircle2, Award, AlertOctagon, Share2 } from 'lucide-react';

export const Slide09Step05Backlink: React.FC = () => {
  return (
    <div className="w-full h-full p-8 md:p-12 flex flex-col justify-between relative overflow-hidden select-none bg-[#07111F]">
      {/* Background Teal Accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-teal-900/15 rounded-full blur-[120px]" />
      </div>

      {/* Top Header Tag */}
      <div className="relative z-10 flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl sm:text-4xl font-black font-mono text-teal-400 tracking-tighter">
            05
          </span>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-teal-400 font-bold">
              PHASE 03 · TRUST & DISTRIBUTION
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              STEP 05 · 백링크 (Authority Link Network)
            </h2>
          </div>
        </div>
        <div className="px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-mono font-bold">
          TOOL: backlink.icrm.co.kr
        </div>
      </div>

      {/* Main Content: Layout A (Left Text 40% + Right Clean Authority Link Graph 60%) */}
      <div className="relative z-10 my-auto py-2 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Narrative (5 cols) */}
        <div className="lg:col-span-5 space-y-3.5">
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-teal-900/40">
            <span className="text-[10px] font-mono text-teal-400 font-bold uppercase tracking-wider block mb-1">
              EXTERNAL CITATION TRUST
            </span>
            <p className="text-lg sm:text-xl font-black text-white leading-snug">
              “내가 좋다고 말하는 것과,<br />
              <span className="text-teal-400">남이 나를 추천하는 것</span>은 다릅니다.”
            </p>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              관련성 있는 외부 출처의 자연스러운 인용은 <strong className="text-white">신뢰 신호가 될 수 있습니다</strong>.
            </p>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300">스팸성 대량 링크</span>
              <span className="text-rose-400 font-bold">품질 위험 신호 ✕</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/70 border border-teal-900/40 flex items-center justify-between">
              <span className="text-white font-bold">관련성 높은 권위 사이트 링크</span>
              <span className="text-teal-400 font-bold">긍정 신호 가능 ✓</span>
            </div>
          </div>
        </div>

        {/* Right Column: Authority Link Network Graph (7 cols) */}
        <div className="lg:col-span-7">
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-950/90 border border-teal-900/40 shadow-2xl relative overflow-hidden">
            {/* Network Graph Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 text-xs font-mono">
              <div className="flex items-center gap-2 text-slate-300 font-bold">
                <Share2 className="w-4 h-4 text-teal-400" />
                <span>CLEAN REPUTATION & CITATION GRAPH</span>
              </div>
              <span className="text-teal-400 font-bold text-[11px]">PAGE-RANK EQUITY FLOW</span>
            </div>

            {/* Central Target Site with Authority Nodes */}
            <div className="relative py-2 flex flex-col items-center justify-center">
              {/* Central Target Website Node */}
              <div className="z-10 p-3.5 px-6 rounded-2xl bg-gradient-to-r from-teal-950 to-slate-900 border-2 border-teal-500/80 shadow-xl shadow-teal-950/60 text-center">
                <span className="text-[10px] font-mono text-teal-400 uppercase font-bold tracking-wider block">
                  TARGET MONEY SITE
                </span>
                <span className="text-base sm:text-lg font-mono font-black text-white block mt-0.5">
                  my-business.com
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] text-teal-300 font-mono mt-1">
                  <ShieldCheck className="w-3 h-3 text-teal-400" /> TRUST EQUITY ACCUMULATION
                </span>
              </div>

              {/* Surrounding 4 Clean Authority Nodes */}
              <div className="w-full grid grid-cols-2 gap-3 mt-4 text-[11px] font-mono">
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-teal-900/30 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 block">산업 전문 매거진 언론사</span>
                    <span className="text-xs font-bold text-white block mt-0.5">Press Citation</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-teal-400 shrink-0" />
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-teal-900/30 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 block">관련 분야 고권위 블로그</span>
                    <span className="text-xs font-bold text-white block mt-0.5">Topic Authority</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-teal-400 shrink-0" />
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-teal-900/30 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 block">공식 기업 파트너십 디렉토리</span>
                    <span className="text-xs font-bold text-white block mt-0.5">B2B Directory</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-teal-400 shrink-0" />
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-teal-900/30 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 block">공공/교육 기관 인용 레퍼런스</span>
                    <span className="text-xs font-bold text-white block mt-0.5">Edu Citation</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-teal-400 shrink-0" />
                </div>
              </div>

              {/* Bottom Deliverable Ribbon */}
              <div className="w-full mt-3 p-2.5 rounded-xl bg-teal-950/30 border border-teal-900/40 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-300 font-mono">
                  <strong className="text-teal-300">실습 미션:</strong> backlink.icrm.co.kr에서 분야별 고품질 백링크 프로필 구축
                </span>
                <ArrowRight className="w-4 h-4 text-teal-400 shrink-0" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-xs text-slate-500 font-mono flex items-center justify-between border-t border-slate-800/80 pt-3">
        <span>ONOFF MARKETING EDUCATION · 1강</span>
        <span>신뢰할 수 있는 도메인들의 추천이 모여 웹 생태계의 대표 브랜드가 됩니다.</span>
      </div>
    </div>
  );
};
