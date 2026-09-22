import React from 'react';
import { Search, Bot, Database, CheckCircle2, ArrowRight, Eye, AlertTriangle, CheckSquare } from 'lucide-react';

export const Slide08Step04Indexing: React.FC = () => {
  return (
    <div className="w-full h-full p-8 md:p-12 flex flex-col justify-between relative overflow-hidden select-none bg-[#07111F]">
      {/* Background Light Cyan Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-800/15 rounded-full blur-[120px]" />
      </div>

      {/* Top Header Tag */}
      <div className="relative z-10 flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl sm:text-4xl font-black font-mono text-cyan-300 tracking-tighter">
            04
          </span>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-cyan-300 font-bold">
              PHASE 02 · ASSET ACCUMULATION
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              STEP 04 · 인덱싱 확인 (Search Engine Ingestion & Indexing)
            </h2>
          </div>
        </div>
        <div className="px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 text-xs font-mono font-bold">
          TOOL: Google Search Console (GSC)
        </div>
      </div>

      {/* Main Content: Layout D (Left Text 35% + Right Search Indexing Flow 65%) */}
      <div className="relative z-10 my-auto py-2 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Narrative (4 cols) */}
        <div className="lg:col-span-4 space-y-3.5">
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-800/40">
            <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase tracking-wider block mb-1">
              INDEXING REALITY
            </span>
            <p className="text-lg sm:text-xl font-black text-white leading-snug">
              “글을 썼다고 해서<br />
              <span className="text-cyan-300">검색되는 것은 아닙니다.</span>”
            </p>
            <p className="text-lg text-slate-300 mt-2 leading-relaxed">
              PUBLISH → CRAWL → INDEX → SEARCH
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2 text-xs font-mono">
            <div className="flex items-center gap-2 text-rose-300 font-bold">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>미색인은 자산 낭비</span>
            </div>
            <p className="text-base text-slate-400 font-sans">
              색인 1 ≫ 미색인 100
            </p>
          </div>
        </div>

        {/* Right Column: Search Indexing Pipeline Visual (8 cols) */}
        <div className="lg:col-span-8">
          <div className="p-5 rounded-2xl bg-slate-950/90 border border-cyan-800/40 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 text-xs font-mono">
              <div className="flex items-center gap-2 text-slate-300 font-bold">
                <Database className="w-4 h-4 text-cyan-300" />
                <span>SEARCH ENGINE INGESTION & INDEXING PIPELINE</span>
              </div>
              <span className="text-emerald-400 font-bold text-[11px]">URL IS ON GOOGLE (INDEXED ✓)</span>
            </div>

            {/* 4 Ingestion Nodes */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 font-mono">
              {/* Node 1: Published */}
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">01 PAGE</span>
                  <div className="my-2 p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-[11px] font-sans">
                    웹페이지 발행 완료
                  </div>
                  <span className="text-lg font-bold text-white block">URL 생성</span>
                  <span className="text-base text-slate-400 mt-1 block">
                    Sitemap 제출
                  </span>
                </div>
              </div>

              {/* Node 2: Crawl */}
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-cyan-400 font-bold block">02 CRAWL</span>
                  <div className="my-2 p-2 rounded-lg bg-cyan-950/40 border border-cyan-900/40 text-cyan-300 text-[11px] font-sans flex items-center gap-1">
                    <Bot className="w-3.5 h-3.5 text-cyan-400" /> Googlebot
                  </div>
                  <span className="text-lg font-bold text-white block">봇 크롤링</span>
                  <span className="text-base text-slate-400 mt-1 block">
                    렌더링 · 파싱
                  </span>
                </div>
              </div>

              {/* Node 3: Index DB */}
              <div className="p-3 rounded-xl bg-slate-900/90 border border-cyan-400/40 flex flex-col justify-between shadow-lg shadow-cyan-950/40">
                <div>
                  <span className="text-[10px] text-cyan-300 font-bold block">03 INDEX</span>
                  <div className="my-2 p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/50 text-cyan-200 text-[11px] font-sans flex items-center gap-1">
                    <Database className="w-3.5 h-3.5 text-cyan-300" /> DB 등재
                  </div>
                  <span className="text-lg font-bold text-cyan-100 block">색인 등록</span>
                  <span className="text-base text-cyan-300 mt-1 block">
                    검색 저장소
                  </span>
                </div>
              </div>

              {/* Node 4: Search Rank */}
              <div className="p-3 rounded-xl bg-slate-900/90 border border-emerald-500/40 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-emerald-400 font-bold block">04 SEARCH</span>
                  <div className="my-2 p-2 rounded-lg bg-emerald-950/40 border border-emerald-900/40 text-emerald-300 text-[11px] font-sans flex items-center gap-1">
                    <Search className="w-3.5 h-3.5 text-emerald-400" /> SERP 노출
                  </div>
                  <span className="text-lg font-bold text-white block">검색 노출</span>
                  <span className="text-base text-emerald-400 mt-1 block">
                    순위는 별도 평가
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Deliverable Ribbon */}
            <div className="mt-4 p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-800/40 flex items-center justify-between text-xs">
              <span className="text-base text-slate-300 font-mono">
                <strong className="text-cyan-300">실습 미션:</strong> GSC URL 검사 도구로 발행 글의 색인 완료 여부 확인
              </span>
              <ArrowRight className="w-4 h-4 text-cyan-300 shrink-0" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-xs text-slate-500 font-mono flex items-center justify-between border-t border-slate-800/80 pt-3">
        <span>ONOFF MARKETING EDUCATION · 1강</span>
        <span>색인이 확인되지 않은 글은 인터넷에 존재하지 않는 것과 같습니다.</span>
      </div>
    </div>
  );
};
