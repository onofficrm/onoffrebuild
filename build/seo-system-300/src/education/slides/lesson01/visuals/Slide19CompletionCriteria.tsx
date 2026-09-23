import React from 'react';
import { CheckCircle2, ArrowRight, ShieldCheck, Award, Sparkles, CheckSquare } from 'lucide-react';

export const Slide19CompletionCriteria: React.FC = () => {
  return (
    <div className="w-full h-full p-12 flex flex-col justify-between relative overflow-hidden select-none bg-[#07111F]">
      {/* Background Accent Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-900/15 rounded-full blur-[120px]" />
      </div>

      {/* Top Tag & Title */}
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold mb-2">
          <CheckSquare className="w-5 h-5" />
          <span>COMPLETION CRITERIA · 1강 수료 기준</span>
        </div>
        <h2 className="text-5xl font-black text-white tracking-tight">
          1강 완료 기준 : 이제 무엇을 해야 할지 압니다
        </h2>
        <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 mt-1">
          “아래 3가지 질문에 답할 수 있다면, 1강의 핵심 목표를 달성한 것으로 볼 수 있습니다.”
        </p>
      </div>

      {/* Main Content: Layout B / G (Left 60% 3 Criteria Cards + Right 40% Completion Seal) */}
      <div className="relative z-10 my-auto py-2 grid grid-cols-12 gap-6 items-center">
        {/* Left Column: 3 Pass Criteria Cards (7 cols) */}
        <div className="col-span-7 space-y-3">
          {/* Criterion 1 */}
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-bold text-sm shrink-0 mt-0.5">
              01
            </div>
            <div>
              <span className="text-base font-bold text-white block">전체 파이프라인의 연결 구조를 이해했다</span>
              <span className="text-sm text-slate-400 mt-0.5 block leading-relaxed">
                왜 단 하나의 작업만으로는 성과가 나지 않으며, 도메인부터 GEO-UP까지 왜 순서대로 작동해야 하는지 원리를 설명할 수 있다.
              </span>
            </div>
          </div>

          {/* Criterion 2 */}
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-bold text-sm shrink-0 mt-0.5">
              02
            </div>
            <div>
              <span className="text-base font-bold text-white block">내 프로젝트의 현재 위치와 최대 병목을 찾았다</span>
              <span className="text-sm text-slate-400 mt-0.5 block leading-relaxed">
                현재 내 프로젝트가 8단계 중 몇 단계에 머물러 있으며, 성과를 가로막고 있는 1순위 문제 지점(색인, 링크, 트래픽 등)이 어디인지 특정했다.
              </span>
            </div>
          </div>

          {/* Criterion 3 */}
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-bold text-sm shrink-0 mt-0.5">
              03
            </div>
            <div>
              <span className="text-base font-bold text-white block">다음 강의에서 실행할 최우선 과제를 확정했다</span>
              <span className="text-sm text-slate-400 mt-0.5 block leading-relaxed">
                2강(낙장도메인)에 진입하기 전, 내가 당장 발굴해야 할 도메인 분야나 해결해야 할 인프라 과제 1개를 명확히 결정했다.
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Verified Completion Seal Card (5 cols) */}
        <div className="col-span-5">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900/90 to-teal-950/40 border border-emerald-500/50 shadow-2xl text-center relative overflow-hidden">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-950/40">
              <Award className="w-8 h-8" />
            </div>

            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold block">
              MILESTONE VERIFICATION
            </span>
            <h3 className="text-xl font-black text-white mt-1">
              1강 목표 달성 완료
            </h3>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              “무엇을 해야 할지 알고 있다면,<br />
              이미 절반의 성과를 만든 것입니다.”
            </p>

            <div className="mt-4 pt-3 border-t border-emerald-900/40 flex items-center justify-center gap-2 text-xs font-mono text-emerald-300 font-semibold">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>READY FOR LECTURE 02</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-sm text-slate-500 font-mono flex items-center justify-between border-t border-slate-800/80 pt-3">
        <span>ONOFF MARKETING EDUCATION · 1강</span>
        <span>준비가 완료되었습니다. 이제 첫 번째 실전 미션으로 들어갑니다.</span>
      </div>
    </div>
  );
};
