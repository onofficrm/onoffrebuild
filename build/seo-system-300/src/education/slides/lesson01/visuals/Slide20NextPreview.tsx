import React from 'react';
import { ArrowRight, ShieldAlert, CheckCircle2, Search, Sparkles, Database, Layers } from 'lucide-react';

export const Slide20NextPreview: React.FC = () => {
  return (
    <div className="w-full h-full p-8 md:p-12 flex flex-col justify-between relative overflow-hidden select-none bg-[#07111F]">
      {/* Background Deep Blue Accent Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-blue-900/15 rounded-full blur-[140px]" />
      </div>

      {/* Top Tag */}
      <div className="relative z-10 flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono font-semibold">
          <Layers className="w-3.5 h-3.5" />
          <span>NEXT LECTURE PREVIEW · 다음 강의 예고</span>
        </div>
        <span className="text-xs font-mono text-slate-400">ONOFF MARKETING EDUCATION</span>
      </div>

      {/* Main Content: Next Lecture Card & 3 Teasers */}
      <div className="relative z-10 my-auto py-2 max-w-4xl mx-auto w-full">
        {/* Next Lecture Main Headline Box */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-blue-950/40 via-slate-900/90 to-slate-950 border border-blue-500/40 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono text-blue-400 font-bold uppercase tracking-widest block">
                LECTURE 02 PREVIEW
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                2강. 좋은 출발점을 고르는 낙장도메인 실전 분석
              </h2>
            </div>
            <div className="px-3 py-1 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-300 text-xs font-mono font-bold self-start sm:self-auto">
              TOOL: domain.icrm.co.kr
            </div>
          </div>

          <p className="text-sm text-slate-300 mb-6 leading-relaxed">
            “교육 플랫폼 요약과 외부 원본 화면을 함께 보며 후보와 위험 신호를 구분합니다.”
          </p>

          {/* 3 Core Curriculum Teaser Points */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] text-blue-400 font-bold block mb-1">POINT 01</span>
              <span className="text-xs font-bold text-white block">알고리즘 우대 도메인</span>
              <span className="text-[11px] text-slate-400 font-sans mt-1 block">
                신뢰도(TF/CF)와 아카이브 정상 이력 판독법
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] text-rose-400 font-bold block mb-1">POINT 02</span>
              <span className="text-xs font-bold text-white block">치명적 스팸 도메인 컷</span>
              <span className="text-[11px] text-slate-400 font-sans mt-1 block">
                위험 이력·앵커는 외부 자료로 교차 검증
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-blue-500/40 shadow-lg shadow-blue-950/40">
              <span className="text-[10px] text-emerald-400 font-bold block mb-1">POINT 03 · 실습</span>
              <span className="text-xs font-bold text-cyan-200 block">내 도메인 1개 확정</span>
              <span className="text-[11px] text-slate-300 font-sans mt-1 block">
                전용 도구로 내 비즈니스에 맞는 안전 자산 확정
              </span>
            </div>
          </div>

          {/* Action Outro Bar */}
          <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-slate-400 font-sans">
              수고하셨습니다. 1강 실습 워크스페이스를 완료한 뒤 2강으로 이동하세요.
            </span>
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold font-mono shadow-lg shadow-blue-500/20">
              <span>PROCEED TO LECTURE 02</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-xs text-slate-500 font-mono flex items-center justify-between border-t border-slate-800/80 pt-3">
        <span>ONOFF MARKETING TECH EDUCATION DECK</span>
        <span>SEO & GEO 8-STEP MASTER PIPELINE</span>
      </div>
    </div>
  );
};
