import React from 'react';
import { Layers, AlertTriangle, CheckCircle2, ArrowRight, XCircle, Zap } from 'lucide-react';

export const Slide02WhyProcess: React.FC = () => {
  return (
    <div className="w-full h-full p-8 md:p-12 flex flex-col justify-between relative overflow-hidden select-none bg-[#07111F]">
      {/* Background technical accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      {/* Top Tag & Title */}
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono font-semibold mb-2">
          <Layers className="w-3.5 h-3.5" />
          <span>SYSTEM THINKING · 시스템적 사고</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
          왜 첫 강의에서 전체 프로세스를 배울까요?
        </h2>
        <p className="text-base sm:text-lg lg:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 mt-1">
          “SEO는 단 하나의 작업으로 성과가 만들어지지 않습니다.”
        </p>
      </div>

      {/* Main Comparative Architecture: 40% Text & 60% Visual Graphic (Layout G) */}
      <div className="relative z-10 my-auto py-2 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Side: Failure Model - Disconnected Silos (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900/80 border border-rose-900/30 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-rose-900/30">
              <span className="text-xs font-mono font-bold text-rose-400 flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-rose-500" />
                <span>기존의 파편화된 접근 (ISOLATED)</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 font-bold">
                실패 원인
              </span>
            </div>

            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              도메인 따로, 글쓰기 따로, 링크 따로 생각합니다. 병목이 어디서 발생하는지 알 수 없어 <strong className="text-rose-300">시간과 비용을 쓰고도 성과는 0</strong>에 수렴합니다.
            </p>

            {/* Broken Nodes Visual */}
            <div className="space-y-2 font-mono text-[11px]">
              <div className="p-2 rounded-lg bg-slate-950/80 border border-rose-900/30 flex items-center justify-between text-slate-400">
                <span>[도메인] 신규 생성 (신뢰도 없음)</span>
                <span className="text-[10px] text-rose-400">단절 ✕</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950/80 border border-rose-900/30 flex items-center justify-between text-slate-400">
                <span>[콘텐츠] 검색의도 무시 글 50개 양산</span>
                <span className="text-[10px] text-rose-400">미색인 ✕</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950/80 border border-rose-900/30 flex items-center justify-between text-slate-400">
                <span>[백링크] 무작위 스팸성 링크 구매</span>
                <span className="text-[10px] text-rose-400">위험 신호 ✕</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2 text-[11px] text-rose-300 font-medium">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>각 요소가 서로 고립되어 데이터 시너지가 발생하지 않음</span>
          </div>
        </div>

        {/* Center Transfer Arrow (2 cols) */}
        <div className="lg:col-span-2 hidden lg:flex flex-col items-center justify-center">
          <div className="p-3 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 shadow-lg">
            <ArrowRight className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider mt-2">
            TRANSFORM
          </span>
        </div>

        {/* Right Side: Success Model - 8-Step Unified Compounding Loop (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-gradient-to-br from-cyan-950/30 via-slate-900/90 to-blue-950/30 border border-cyan-500/40 flex flex-col justify-between relative shadow-xl shadow-cyan-950/20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-cyan-900/40">
              <span className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>온오프마케팅 시스템 (UNIFIED PIPELINE)</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                성공 표준
              </span>
            </div>

            <p className="text-xs text-slate-200 mb-4 leading-relaxed">
              기반 인프라 구축부터 데이터 피드백과 AI 확장까지 8개 단계가 톱니바퀴처럼 맞물려 돌아가는 <strong className="text-cyan-300">유기적 복리 마케팅 엔진</strong>을 가동합니다.
            </p>

            {/* Connected Circuit Visual */}
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-2 rounded-lg bg-slate-900/90 border border-cyan-900/40 text-cyan-100 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                <span className="truncate">01 검증 도메인</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/90 border border-cyan-900/40 text-cyan-100 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                <span className="truncate">02 전환형 사이트</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/90 border border-cyan-900/40 text-cyan-100 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                <span className="truncate">03 의도 답변 글</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/90 border border-cyan-900/40 text-cyan-100 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                <span className="truncate">04 GSC 색인 검증</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/90 border border-cyan-900/40 text-cyan-100 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                <span className="truncate">05 권위 백링크</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/90 border border-cyan-900/40 text-cyan-100 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                <span className="truncate">06 진성 트래픽</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/90 border border-cyan-900/40 text-cyan-100 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                <span className="truncate">07 퍼널 병목 측정</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/90 border border-cyan-900/40 text-cyan-100 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                <span className="truncate">08 GEO AI 인용</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-cyan-900/40 flex items-center justify-between text-[11px] text-cyan-300 font-medium">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>병목 지점 즉시 발견 & 지속 성장</span>
            </span>
            <span className="text-[10px] font-mono text-cyan-400 uppercase">SYSTEM SYNERGY</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-xs text-slate-500 font-mono flex items-center justify-between border-t border-slate-800/80 pt-3">
        <span>ONOFF MARKETING EDUCATION · 1강</span>
        <span>STEP BY STEP · 8개 요소가 유기적으로 맞물려 작동합니다.</span>
      </div>
    </div>
  );
};
