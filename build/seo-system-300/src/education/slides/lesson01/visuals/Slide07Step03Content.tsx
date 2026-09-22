import React from 'react';
import { FileText, ArrowRight, Search, Target, Cpu, Link2, MousePointerClick, CheckCircle2 } from 'lucide-react';

export const Slide07Step03Content: React.FC = () => {
  return (
    <div className="w-full h-full p-8 md:p-12 flex flex-col justify-between relative overflow-hidden select-none bg-[#07111F]">
      {/* Background Cyan Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-900/15 rounded-full blur-[120px]" />
      </div>

      {/* Top Header Tag */}
      <div className="relative z-10 flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl sm:text-4xl font-black font-mono text-cyan-400 tracking-tighter">
            03
          </span>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
              PHASE 02 · ASSET ACCUMULATION
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              STEP 03 · 콘텐츠 작업 (AI Content Pipeline)
            </h2>
          </div>
        </div>
        <div className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold">
          TOOL: content.icrm.co.kr
        </div>
      </div>

      {/* Main Content: Layout D (Left Text 35% + Right AI Content Pipeline Graphic 65%) */}
      <div className="relative z-10 my-auto py-2 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Narrative (4 cols) */}
        <div className="lg:col-span-4 space-y-3.5">
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-900/40">
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block mb-1">
              INTENT-FIRST ENGINE
            </span>
            <p className="text-lg sm:text-xl font-black text-white leading-snug">
              “검색하는 사람의<br />
              <span className="text-cyan-400">질문에 답을 만든다.</span>”
            </p>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              키워드 반복보다 검색 의도를 충실히 다루는 <strong className="text-white">완결형 아티클</strong>이 노출과 전환에 유리할 수 있습니다.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2 text-xs font-mono">
            <div className="flex items-center gap-2 text-cyan-300 font-bold">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>E-E-A-T 검증 구조 탑재</span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              경험(Experience), 전문성(Expertise), 권위(Authoritativeness), 신뢰(Trust)를 증명하는 구조화 글쓰기
            </p>
          </div>
        </div>

        {/* Right Column: AI Content Pipeline Graphic (8 cols) */}
        <div className="lg:col-span-8">
          <div className="p-5 rounded-2xl bg-slate-950/90 border border-cyan-900/40 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 text-xs font-mono">
              <div className="flex items-center gap-2 text-slate-300 font-bold">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>AI CONTENT PIPELINE ARCHITECTURE</span>
              </div>
              <span className="text-cyan-400 font-bold text-[11px]">INTENT FIRST</span>
            </div>

            {/* Pipeline Step Sequence (5 Steps) */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
              {/* Step 1: Keyword */}
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 font-bold block">01 KEYWORD</span>
                  <Search className="w-4 h-4 text-slate-400 mt-1 mb-2" />
                  <span className="text-xs font-bold text-white block">검색어 발굴</span>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    수요 높은 핵심 타겟 롱테일 키워드
                  </span>
                </div>
              </div>

              {/* Step 2: Intent Analysis */}
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 font-bold block">02 INTENT</span>
                  <Target className="w-4 h-4 text-cyan-400 mt-1 mb-2" />
                  <span className="text-xs font-bold text-white block">검색의도 분해</span>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    정보형 vs 상업형 구매 심리 분석
                  </span>
                </div>
              </div>

              {/* Step 3: Deep Article */}
              <div className="p-3 rounded-xl bg-slate-900/90 border border-cyan-500/40 flex flex-col justify-between shadow-lg shadow-cyan-950/40">
                <div>
                  <span className="text-[10px] font-mono text-cyan-300 font-bold block">03 ARTICLE</span>
                  <FileText className="w-4 h-4 text-cyan-300 mt-1 mb-2" />
                  <span className="text-xs font-bold text-cyan-200 block">완결형 콘텐츠</span>
                  <span className="text-[10px] text-cyan-400 mt-1 block">
                    H1~H3 체계적 소제목 & 명쾌한 솔루션
                  </span>
                </div>
              </div>

              {/* Step 4: Silo Linking */}
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 font-bold block">04 SILO LINK</span>
                  <Link2 className="w-4 h-4 text-slate-400 mt-1 mb-2" />
                  <span className="text-xs font-bold text-white block">내부 토픽 연결</span>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    관련 글 사일로 묶음으로 전문성 강화
                  </span>
                </div>
              </div>

              {/* Step 5: Conversion CTA */}
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold block">05 ACTION</span>
                  <MousePointerClick className="w-4 h-4 text-emerald-400 mt-1 mb-2" />
                  <span className="text-xs font-bold text-white block">자연스러운 전환</span>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    상담/문의/구매로 즉각 유도하는 CTA
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Deliverable Ribbon */}
            <div className="mt-4 p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-900/40 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-300 font-mono">
                <strong className="text-cyan-300">실습 미션:</strong> content.icrm.co.kr에서 E-E-A-T 완결형 아티클 1편 작성
              </span>
              <ArrowRight className="w-4 h-4 text-cyan-400 shrink-0" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-xs text-slate-500 font-mono flex items-center justify-between border-t border-slate-800/80 pt-3">
        <span>ONOFF MARKETING EDUCATION · 1강</span>
        <span>글은 단순한 텍스트가 아니라 24시간 일하는 비즈니스 영업 사원입니다.</span>
      </div>
    </div>
  );
};
