import React from 'react';
import { Check } from 'lucide-react';

const STEPS = ['업체 정보', '서비스 조건', '약관 동의', '서명·제출'];

type ContractProcessGuideProps = {
  currentStep: number;
};

export const ContractProcessGuide: React.FC<ContractProcessGuideProps> = ({ currentStep }) => {
  return (
    <ol className="flex flex-wrap gap-2 sm:gap-3 mb-6">
      {STEPS.map((label, index) => {
        const stepNum = index + 1;
        const done = stepNum < currentStep;
        const active = stepNum === currentStep;
        return (
          <li
            key={label}
            className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold border ${
              active
                ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-300'
                : done
                  ? 'border-slate-600 bg-slate-800/80 text-slate-300'
                  : 'border-slate-700 bg-slate-900/50 text-slate-500'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                active ? 'bg-cyan-500 text-slate-950' : done ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-400'
              }`}
            >
              {done ? <Check className="w-3 h-3" /> : stepNum}
            </span>
            <span className="whitespace-nowrap">{label}</span>
          </li>
        );
      })}
    </ol>
  );
};
