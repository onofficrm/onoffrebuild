import React from 'react';
import { Target, ArrowRight, CheckCircle2, AlertCircle, Sparkles, HelpCircle, PenTool } from 'lucide-react';

export const Slide18Lesson1Mission: React.FC = () => {
  return (
    <div className="w-full h-full p-12 flex flex-col justify-between relative overflow-hidden select-none bg-[#07111F]">
      {/* Background Accent Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-900/15 rounded-full blur-[120px]" />
      </div>

      {/* Top Tag & Title */}
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold mb-2">
          <Target className="w-5 h-5" />
          <span>LECTURE 01 PRACTICE MISSION · 1강 실전 과제</span>
        </div>
        <h2 className="text-5xl font-black text-white tracking-tight">
          1강 Mission : 현재 내 프로젝트의 위치를 찾아라
        </h2>
        <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 mt-1">
          “진단이 명확해야 올바른 처방과 실행이 시작됩니다.”
        </p>
      </div>

      {/* Main Content: Layout E / A (3 Action Diagnosis Cards) */}
      <div className="relative z-10 my-auto py-2">
        <div className="grid grid-cols-3 gap-4">
          {/* Card 1: Current Stage */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-blue-900/40 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                <span className="text-xs font-mono font-bold text-blue-400">QUESTION 01</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">
                  진행 위치
                </span>
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                현재 내 프로젝트는 8단계 중 어디에 있는가?
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                도메인부터 시작해야 하는 백지 상태인가, 사이트와 글은 있지만 색인과 트래픽이 멈춰 있는 상태인가?
              </p>
            </div>

            <div className="mt-4 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm font-mono text-slate-300">
              → 자가진단표에 현재 진행 번호(01~08) 기록
            </div>
          </div>

          {/* Card 2: Bottleneck Finder */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-amber-900/40 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                <span className="text-xs font-mono font-bold text-amber-400">QUESTION 02</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                  핵심 병목
                </span>
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                성과를 가로막는 최대 병목은 어디인가?
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                글을 아무리 써도 구글 색인이 안 되는가, 방문자는 오는데 전환 문의가 0건인가? 1순위 문제 지점 도출.
              </p>
            </div>

            <div className="mt-4 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm font-mono text-amber-300">
              → 성과를 가로막는 단 하나의 병목 특정
            </div>
          </div>

          {/* Card 3: Top Priority Action */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/40 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                <span className="text-xs font-mono font-bold text-cyan-400">QUESTION 03</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                  최우선 과제
                </span>
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                이번 주 당장 실행할 단 1개의 행동은?
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                여러 개를 벌리지 않고, 병목을 깨부술 가장 결정적인 다음 액션 1가지를 명확히 확정합니다.
              </p>
            </div>

            <div className="mt-4 p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-900/40 text-sm font-mono text-cyan-200">
              → 최우선 해결 과제 1개 작성 후 워크스페이스 저장
            </div>
          </div>
        </div>
      </div>

      {/* Footer Banner */}
      <div className="relative z-10 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs font-mono">
        <span className="text-slate-300">
          <strong className="text-cyan-300">실습 안내:</strong> 상단 우측 [실습 워크스페이스] 버튼을 눌러 지금 바로 3가지 질문에 답변을 기록하세요.
        </span>
        <span className="text-sm text-cyan-400 font-bold block">WORKSPACE INTEGRATED</span>
      </div>
    </div>
  );
};
