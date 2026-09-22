import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Globe, Bot, Cpu, Network, Database } from 'lucide-react';

export const Slide01Cover: React.FC = () => {
  return (
    <div className="w-full h-full p-8 md:p-12 flex flex-col justify-between relative overflow-hidden select-none bg-[#07111F]">
      {/* Visual background ambient grids & technical glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px]" />
        {/* Subtle dot matrix grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      {/* Top Header Label */}
      <div className="relative z-10 flex items-center justify-between border-b border-slate-800/80 pb-3.5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[11px] font-mono font-bold tracking-widest text-cyan-400 uppercase">
              ONOFF MARKETING TECH DECK
            </span>
          </div>
          <span className="text-xs text-slate-500 hidden sm:inline">|</span>
          <span className="text-xs font-medium text-slate-400 hidden sm:inline">
            Enterprise SEO & GEO Education
          </span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-400 font-mono">
          <span className="text-slate-500">MODULE</span>
          <span className="text-cyan-400 font-bold">LECTURE 01</span>
        </div>
      </div>

      {/* Main Content Area: Left 45% Text / Right 55% Visual Graphic */}
      <div className="relative z-10 my-auto py-2 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
        {/* Left Column: Title & Key Narrative (45%) */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono font-semibold mb-4 w-fit">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>실무 파이프라인 마스터코스 · 01</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-white tracking-tight leading-[1.18] mb-3">
            SEO·GEO 성과를 만드는<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400">
              8단계 실전 프로세스
            </span>
          </h1>

          <p className="text-lg sm:text-xl font-bold text-slate-300 mb-5">
            1강 · 전체 프로세스 이해 & 아키텍처
          </p>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-5 max-w-xl">
            단순 웹사이트 제작이나 일회성 글쓰기로는 성과가 나지 않습니다.
            <strong className="text-white"> 인프라 구축부터 데이터 피드백, 그리고 생성형 AI 인용(GEO)까지</strong> 8개 단계가 맞물려 돌아가는 하나의 유기적 기술 시스템을 학습합니다.
          </p>

          {/* Quick Pillars Badge Row */}
          <div className="flex flex-wrap gap-2 text-[11px] font-mono">
            <div className="px-2.5 py-1 rounded bg-slate-900/90 border border-slate-800 text-slate-300">
              #01 8-Step Pipeline
            </div>
            <div className="px-2.5 py-1 rounded bg-slate-900/90 border border-slate-800 text-slate-300">
              #02 E-E-A-T Asset
            </div>
            <div className="px-2.5 py-1 rounded bg-slate-900/90 border border-slate-800 text-cyan-400 font-semibold">
              #03 AI Citation (GEO)
            </div>
          </div>
        </div>

        {/* Right Column: Dual-Engine Technology Graphic (55%) */}
        <div className="lg:col-span-6">
          <div className="relative p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-950/90 border border-slate-800 shadow-2xl overflow-hidden">
            {/* Ambient inner glow */}
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 text-xs font-mono">
              <span className="text-slate-400 font-bold flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>INTEGRATED SYSTEM ARCHITECTURE</span>
              </span>
              <span className="text-cyan-400 text-[11px]">8-STAGE DUAL ENGINE</span>
            </div>

            {/* Dual Engine Blocks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Engine 1: SEO Foundation */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-blue-900/40 relative group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-300">
                    <Globe className="w-3.5 h-3.5 text-blue-400" />
                    <span>ENGINE 01 : SEO 자산</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-semibold">
                    기반 체력
                  </span>
                </div>
                <div className="space-y-1.5 text-[11px] text-slate-300 font-mono">
                  <div className="flex items-center gap-1.5 p-1 rounded bg-slate-900/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    <span>01~02 도메인 & 전환 사이트</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-1 rounded bg-slate-900/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>03~04 검색의도 글 & 색인 검증</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-1 rounded bg-slate-900/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                    <span>05~06 신뢰 백링크 & 유입 활성</span>
                  </div>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-800 text-[10px] text-slate-400">
                  웹 생태계 내 실제 데이터 자산 누적
                </div>
              </div>

              {/* Engine 2: GEO Expansion */}
              <div className="p-3.5 rounded-xl bg-gradient-to-br from-cyan-950/30 to-blue-950/40 border border-cyan-500/40 relative shadow-lg shadow-cyan-950/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-200">
                    <Bot className="w-3.5 h-3.5 text-cyan-400" />
                    <span>ENGINE 02 : GEO 확장</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-semibold">
                    AI 인용
                  </span>
                </div>
                <div className="space-y-1.5 text-[11px] text-cyan-100 font-mono">
                  <div className="flex items-center gap-1.5 p-1 rounded bg-slate-900/90 border border-cyan-900/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>07 퍼널 측정 & 병목 제거</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-1 rounded bg-slate-900/90 border border-cyan-900/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    <span>08 AI 답변 출처 인용 (GEO-UP)</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-1 rounded bg-slate-900/90 border border-cyan-900/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>지속 가능한 복리 선순환</span>
                  </div>
                </div>
                <div className="mt-2.5 pt-2 border-t border-cyan-900/50 text-[10px] text-cyan-300">
                  AI 답변 인용 후보로 준비
                </div>
              </div>
            </div>

            {/* Connecting Bridge Bar */}
            <div className="mt-3.5 p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[11px] text-slate-300">
                  <strong className="text-cyan-300">단일 파이프라인 연동:</strong> SEO 자산이 없으면 GEO 인용도 불가능합니다.
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-cyan-400 shrink-0 ml-2" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer Note */}
      <div className="relative z-10 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-mono">
        <span>ONOFF MARKETING EDUCATION · 1강</span>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>공식 표준 커리큘럼 라이선스</span>
        </div>
      </div>
    </div>
  );
};

