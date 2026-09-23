import React from 'react';
import { Compass, Play, Target, Terminal, CheckCircle2, FileCheck, ArrowRight, Sparkles } from 'lucide-react';

export const Slide16StudentJourney: React.FC = () => {
  const steps = [
    { num: '01', title: '강의 시청', eng: 'WATCH', desc: '핵심 기준 및 알고리즘 원리 습득', icon: Play, color: 'text-blue-400' },
    { num: '02', title: '미션 확인', eng: 'MISSION', desc: '오늘 해결할 단 1개의 구체적 목표', icon: Target, color: 'text-sky-400' },
    { num: '03', title: '직접 실행', eng: 'EXECUTE', desc: '온오프 전용 도구로 실제 설정 적용', icon: Terminal, color: 'text-cyan-400' },
    { num: '04', title: '결과 검증', eng: 'VERIFY', desc: '색인·백링크·유입 정상 여부 확인', icon: CheckCircle2, color: 'text-teal-400' },
    { num: '05', title: '성과 기록', eng: 'RECORD', desc: '프로젝트 대시보드에 실물 자산 등록', icon: FileCheck, color: 'text-indigo-400' },
    { num: '06', title: '다음 단계', eng: 'NEXT STEP', desc: '병목 해결 후 상위 파이프라인 진입', icon: ArrowRight, color: 'text-purple-400' },
  ];

  return (
    <div className="w-full h-full p-12 flex flex-col justify-between relative overflow-hidden select-none bg-[#07111F]">
      {/* Background Accent Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-900/15 rounded-full blur-[120px]" />
      </div>

      {/* Top Tag & Title */}
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold mb-2">
          <Compass className="w-5 h-5" />
          <span>STUDENT WORKFLOW · 수강생 학습 여정</span>
        </div>
        <h2 className="text-5xl font-black text-white tracking-tight">
          수강생은 이렇게 진행합니다
        </h2>
        <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 mt-1">
          “몰아서 듣지 않고, 1강당 1자산을 직접 만듭니다.”
        </p>
      </div>

      {/* Main Content: Layout D (6-Step Connected Sequential Cards) */}
      <div className="relative z-10 my-auto py-2">
        <div className="grid grid-cols-6 gap-3">
          {steps.map((step) => {
            const IconComp = step.icon;
            return (
              <div
                key={step.num}
                className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between group hover:border-cyan-500/50 transition-all hover:translate-y-[-2px] shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                    <span className={`text-xl font-black font-mono ${step.color}`}>{step.num}</span>
                    <span className="text-xs font-mono text-slate-500 font-bold">{step.eng}</span>
                  </div>
                  <IconComp className={`w-5 h-5 ${step.color} mb-2`} />
                  <span className="text-sm font-bold text-white block">{step.title}</span>
                  <span className="text-sm text-slate-400 mt-1 block leading-relaxed">
                    {step.desc}
                  </span>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80 text-xs font-mono text-slate-500">
                  ACTION REQUIRED
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Banner */}
      <div className="relative z-10 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2 text-slate-300">
          <Sparkles className="w-5 h-5 text-cyan-400 shrink-0" />
          <span>
            <strong>학습 완료 원칙:</strong> 다음 강의를 결제하거나 재생하기 전, 현재 강의의 미션 결과물이 생성되어야 합니다.
          </span>
        </div>
        <span className="text-sm text-cyan-400 font-bold block">NO PASSIVE WATCHING</span>
      </div>
    </div>
  );
};
