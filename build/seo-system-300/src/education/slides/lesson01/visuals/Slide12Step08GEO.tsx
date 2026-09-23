import React from 'react';
import { Bot, ArrowRight, Sparkles, Quote, CheckCircle2, ShieldCheck, Terminal, Layers } from 'lucide-react';

export const Slide12Step08GEO: React.FC = () => {
  return (
    <div className="w-full h-full p-12 flex flex-col justify-between relative overflow-hidden select-none bg-[#07111F]">
      {/* Background Cyan to Purple Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-900/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan-900/15 rounded-full blur-[120px]" />
      </div>

      {/* Top Header Tag */}
      <div className="relative z-10 flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-3">
          <span className="text-4xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 tracking-tighter">
            08
          </span>
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-purple-400 font-bold">
              PHASE 04 · DATA & EXPANSION
            </div>
            <h2 className="text-3xl font-black text-white">
              STEP 08 · GEO-UP (Generative Engine Optimization)
            </h2>
          </div>
        </div>
        <div className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold">
          TOOL: geo-up.icrm.co.kr
        </div>
      </div>

      {/* Main Content: Layout A (Left 40% Text + Right 60% AI Citation & Grounding Mockup) */}
      <div className="relative z-10 my-auto py-2 grid grid-cols-12 gap-6 items-center">
        {/* Left Column: Narrative (5 cols) */}
        <div className="col-span-5 space-y-3.5">
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-purple-900/40">
            <span className="text-xs font-mono text-purple-400 font-bold uppercase tracking-wider block mb-1">
              NEXT-GEN AI VISIBILITY
            </span>
            <p className="text-2xl font-black text-white leading-snug">
              “검색엔진을 넘어,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                AI가 답변할 때 선택되는 브랜드
              </span>로.”
            </p>
            <p className="text-lg text-slate-300 mt-2 leading-relaxed">
              콘텐츠·브랜드 신호 → AI가 인용 가능한 출처 구조
            </p>
          </div>

          <div className="space-y-2 text-base font-mono">
            <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">전통적 SEO</span>
              <span className="text-cyan-300">검색 결과 노출</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/70 border border-purple-900/40 flex items-center justify-between">
              <span className="text-purple-300 font-bold">생성형 GEO (GEO-UP)</span>
              <span className="text-purple-400 font-bold">AI 답변 인용 가능성</span>
            </div>
          </div>
        </div>

        {/* Right Column: AI Model Citation UI Mockup (7 cols) */}
        <div className="col-span-7">
          <div className="p-5 rounded-2xl bg-slate-950/90 border border-purple-900/40 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs font-mono">
              <div className="flex items-center gap-2 text-slate-300 font-bold">
                <Bot className="w-5 h-5 text-purple-400" />
                <span>AI SEARCH CITATION & ENTITY GROUNDING</span>
              </div>
              <span className="text-cyan-400 font-bold text-sm">CITATION EXAMPLE</span>
            </div>

            {/* AI Interaction Simulation Window */}
            <div className="space-y-3 font-mono">
              {/* User Prompt Box */}
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-2 text-base">
                <span className="text-sm text-slate-500 font-bold shrink-0">USER PROMPT:</span>
                <span className="text-slate-200 truncate">
                  "2026년 기업 전환율을 극대화하는 검증된 마케팅 솔루션 추천해줘"
                </span>
              </div>

              {/* AI Generated Response with Citation Badges */}
              <div className="p-3.5 rounded-xl bg-gradient-to-br from-slate-900 to-purple-950/20 border border-purple-500/40 space-y-2">
                <div className="flex items-center gap-1.5 text-sm text-purple-300 font-bold">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  <span>AI SYNTHESIS & RECOMMENDATION</span>
                </div>
                <p className="text-base text-slate-200 font-sans leading-relaxed">
                  관련 근거와 출처가 충분하면 <strong className="text-cyan-300 underline decoration-cyan-400 decoration-2">[내 비즈니스 브랜드]</strong>가 답변의 인용 후보가 될 수 있습니다.
                </p>

                {/* Grounding Source Citations Pill Row */}
                <div className="pt-2 border-t border-purple-900/40 flex flex-wrap items-center gap-2 text-sm">
                  <span className="text-slate-400 font-mono">CITED SOURCES:</span>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold flex items-center gap-1">
                    [1] my-brand.com/solution <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    [2] tech-magazine.com/report
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Deliverable Ribbon */}
            <div className="mt-3 p-2.5 rounded-xl bg-purple-950/30 border border-purple-900/40 flex items-center justify-between text-sm">
              <span className="text-base text-slate-300 font-mono">
                <strong className="text-purple-300">실습 미션:</strong> geo-up.icrm.co.kr에서 내 브랜드 AI 인용 상태 진단 및 최적화
              </span>
              <ArrowRight className="w-5 h-5 text-purple-400 shrink-0" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-sm text-slate-500 font-mono flex items-center justify-between border-t border-slate-800/80 pt-3">
        <span>ONOFF MARKETING EDUCATION · 1강</span>
        <span>SEO 자산을 AI 검색 환경으로 확장합니다.</span>
      </div>
    </div>
  );
};
