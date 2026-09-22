import React from 'react';
import { Target, CheckCircle2, Play, Terminal, ArrowRight, Laptop, FileCheck, Layers } from 'lucide-react';

export const Slide03Philosophy: React.FC = () => {
  return (
    <div className="w-full h-full p-8 md:p-12 flex flex-col justify-between relative overflow-hidden select-none bg-[#07111F]">
      {/* Subtle background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Top Tag & Title */}
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold mb-2">
          <Target className="w-3.5 h-3.5" />
          <span>ACTION-DRIVEN EDUCATION · 실행 중심 교육</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
          이 교육은 ‘듣는 교육’이 아닙니다
        </h2>
        <p className="text-base sm:text-lg lg:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 mt-1">
          “내 프로젝트에 실제 결과물이 남아야 수료입니다.”
        </p>
      </div>

      {/* Main Content Area: 40% Text (Execution Cycle) + 60% Visual (Workbench UI Mockup) */}
      <div className="relative z-10 my-auto py-2 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: 4-Step Execution Cycle (5 cols) */}
        <div className="lg:col-span-5 space-y-2.5">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>THE 4-STEP ACTION LOOP</span>
          </div>

          {/* Step 1: WATCH */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-3 group hover:border-cyan-500/40 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-mono font-bold text-xs shrink-0">
              01
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold text-white flex items-center justify-between">
                <span>WATCH · 원리 이해</span>
                <span className="text-[10px] font-mono text-slate-500">10~15분</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                지식 암기가 아닌 <strong className="text-slate-300">‘무엇을 해야 하는가’</strong> 판단 기준 습득
              </div>
            </div>
          </div>

          {/* Step 2: DO */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-3 group hover:border-cyan-500/40 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-mono font-bold text-xs shrink-0">
              02
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold text-white flex items-center justify-between">
                <span>DO · 직접 실행</span>
                <span className="text-[10px] font-mono text-cyan-400">플랫폼 실습</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                온오프 플랫폼 도구로 <strong className="text-cyan-300">내 실제 프로젝트</strong>에 즉시 적용
              </div>
            </div>
          </div>

          {/* Step 3: VERIFY */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-3 group hover:border-cyan-500/40 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-mono font-bold text-xs shrink-0">
              03
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold text-white flex items-center justify-between">
                <span>VERIFY · 결과 검증</span>
                <span className="text-[10px] font-mono text-teal-400">데이터 확인</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                색인 여부, 백링크 신호, 트래픽 유입 등 <strong className="text-slate-300">객관적 지표</strong> 확인
              </div>
            </div>
          </div>

          {/* Step 4: IMPROVE */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-3 group hover:border-cyan-500/40 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-mono font-bold text-xs shrink-0">
              04
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold text-white flex items-center justify-between">
                <span>IMPROVE · 병목 개선</span>
                <span className="text-[10px] font-mono text-purple-400">선순환 확장</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                안 되는 단계를 즉시 수정하여 <strong className="text-purple-300">다음 단계로 진입</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Laboratory Workbench UI Mockup (7 cols) */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl bg-slate-950/90 border border-slate-800 shadow-2xl overflow-hidden">
            {/* Window Title Bar */}
            <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="text-slate-400 ml-2 font-medium">onoff-education-workspace.app</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                LIVE PROJECT MODE
              </span>
            </div>

            {/* Workbench Body */}
            <div className="p-4 sm:p-5 space-y-4">
              {/* Project Status Bar */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase">ACTIVE USER PROJECT</div>
                  <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-2 mt-0.5">
                    <span>project-alpha.com</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                      연동 완료
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-mono text-slate-500 uppercase">CURRICULUM PROGRESS</div>
                  <div className="text-xs sm:text-sm font-mono font-bold text-cyan-400 mt-0.5">
                    STEP 01 OF 08 (READY)
                  </div>
                </div>
              </div>

              {/* Mission Progress Checklist */}
              <div className="space-y-2">
                <div className="text-[11px] font-mono text-slate-400 font-semibold flex items-center justify-between">
                  <span>PRACTICE MISSION VERIFICATION</span>
                  <span className="text-emerald-400">실전 산출물 완성 목표</span>
                </div>

                <div className="space-y-1.5 font-mono text-xs">
                  <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>강의 시청 (핵심 개념 & 기준 체득)</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold">COMPLETED</span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>도구 실행 (내 사이트 실제 설정 적용)</span>
                    </div>
                    <span className="text-[10px] text-cyan-400 font-bold">ACTIVE</span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-400">
                      <FileCheck className="w-4 h-4 text-slate-500 shrink-0" />
                      <span>산출물 저장 (도메인, 색인, 트래픽 보고서)</span>
                    </div>
                    <span className="text-[10px] text-slate-500">READY</span>
                  </div>
                </div>
              </div>

              {/* Bottom Deliverable Output Badge */}
              <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-900/40 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-cyan-200">
                  <Terminal className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="text-[11px]">
                    <strong>수료 기준:</strong> 8개 미션 산출물이 모두 내 프로젝트에 생성되어야 합니다.
                  </span>
                </div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold">VERIFIED</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-xs text-slate-500 font-mono flex items-center justify-between border-t border-slate-800/80 pt-3">
        <span>ONOFF MARKETING EDUCATION · 1강</span>
        <span>눈으로만 보는 강의는 끝났을 때 아무것도 남지 않습니다.</span>
      </div>
    </div>
  );
};
