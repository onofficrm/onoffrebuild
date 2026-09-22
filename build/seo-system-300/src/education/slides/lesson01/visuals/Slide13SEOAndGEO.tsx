import React from 'react';
import { ArrowRight, Globe, Bot, ShieldCheck, Sparkles, CheckCircle2, Layers, Cpu } from 'lucide-react';

export const Slide13SEOAndGEO: React.FC = () => {
  return (
    <div className="w-full h-full p-8 md:p-12 flex flex-col justify-between relative overflow-hidden select-none bg-[#07111F]">
      {/* Background Accent Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-cyan-900/15 rounded-full blur-[120px]" />
      </div>

      {/* Top Tag & Title */}
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold mb-2">
          <Layers className="w-3.5 h-3.5" />
          <span>PARADIGM CONNECTION · 패러다임 연계</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
          SEO와 GEO는 별개의 일이 아닙니다
        </h2>
        <p className="text-base sm:text-lg lg:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 mt-1">
          “SEO 자산이 웹에 쌓여야, 비로소 AI(GEO)가 신뢰하고 인용합니다.”
        </p>
      </div>

      {/* Main Comparative Bridge Architecture: Layout G / D */}
      <div className="relative z-10 my-auto py-2 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        {/* Left Box: SEO Foundation (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900/90 border border-blue-900/40 shadow-xl">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-blue-300 font-bold text-sm">
              <Globe className="w-4 h-4 text-blue-400" />
              <span>SEO : 기초 체력 (THE GROUND TRUTH)</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">
              STEP 01~06
            </span>
          </div>

          <p className="text-xs text-slate-300 mb-4 leading-relaxed">
            웹 생태계에 실제로 존재하는 권위 있는 사이트, 검색엔진에 정상 색인된 E-E-A-T 콘텐츠, 외부 백링크 신뢰도.
          </p>

          <div className="space-y-2 font-mono text-[11px]">
            <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between text-slate-300">
              <span>01. 안전한 권위 도메인 & 구조적 사이트</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between text-slate-300">
              <span>02. 검색의도 콘텐츠 & 색인 상태 확인</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between text-slate-300">
              <span>03. 고품질 백링크 & 진성 체류 트래픽</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
            </div>
          </div>
        </div>

        {/* Center Connection Data Highway (2 cols) */}
        <div className="lg:col-span-2 hidden lg:flex flex-col items-center justify-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 p-0.5 shadow-xl shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-300">
              <Cpu className="w-6 h-6 animate-pulse" />
            </div>
          </div>
          <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase tracking-wider text-center">
            RAG & AI CRAWLER INGESTION
          </span>
          <ArrowRight className="w-4 h-4 text-purple-400" />
        </div>

        {/* Right Box: GEO Expansion (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-gradient-to-br from-purple-950/30 via-slate-900/90 to-cyan-950/20 border border-purple-500/40 shadow-xl shadow-purple-950/30">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-purple-900/40">
            <div className="flex items-center gap-2 text-purple-200 font-bold text-sm">
              <Bot className="w-4 h-4 text-purple-400" />
              <span>GEO : AI 지능 확장 (INTELLIGENCE LAYER)</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">
              STEP 07~08
            </span>
          </div>

          <p className="text-xs text-slate-200 mb-4 leading-relaxed">
            AI 모델(ChatGPT, Perplexity, Gemini)이 실시간 웹 검색 및 지식 그래프 탐색 시 내 브랜드를 신뢰 출처로 우선 채택.
          </p>

          <div className="space-y-2 font-mono text-[11px]">
            <div className="p-2 rounded-lg bg-slate-900/90 border border-purple-900/30 flex items-center justify-between text-purple-100">
              <span>01. AI 모델 내 브랜드 엔티티(Entity) 등록</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="p-2 rounded-lg bg-slate-900/90 border border-purple-900/30 flex items-center justify-between text-purple-100">
              <span>02. 사용자 질문 시 직접 솔루션 추천</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="p-2 rounded-lg bg-slate-900/90 border border-purple-900/30 flex items-center justify-between text-purple-100">
              <span>03. 답변 내 출처 인용 가능성 강화</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Core Warning Banner */}
      <div className="relative z-10 p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            <strong className="text-cyan-300">핵심 원리:</strong> SEO 자산이 부실하면 AI는 인용할 데이터가 없어 브랜드를 언급조차 하지 못합니다.
          </span>
        </div>
        <span className="text-[10px] font-mono text-purple-400 font-bold uppercase hidden sm:block">
          FOUNDATION FIRST
        </span>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-xs text-slate-500 font-mono flex items-center justify-between border-t border-slate-800/80 pt-3">
        <span>ONOFF MARKETING EDUCATION · 1강</span>
        <span>SEO로 자산을 쌓고, GEO로 AI 시대를 선점합니다.</span>
      </div>
    </div>
  );
};
