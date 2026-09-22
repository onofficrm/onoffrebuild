import React from 'react';
import { CheckCircle2, XCircle, Tag, ArrowRight } from 'lucide-react';

export const Slide25Check01Relevance: React.FC = () => {
  return (
    <div className="w-full h-full p-12 flex flex-col justify-between relative overflow-hidden select-none bg-[#07111F]">
      {/* Background Accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[140px]" />
      </div>

      {/* Top Header Tag + Title + Core Message */}
      <div className="relative z-10">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-black font-mono text-cyan-400">CHECK 01</span>
            <span className="text-sm font-mono uppercase tracking-widest text-cyan-400 font-bold">
              THEMATIC RELEVANCE · 주제 관련성
            </span>
          </div>
          <div className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-sm font-mono text-cyan-400 font-bold">
            THEME AUDIT
          </div>
        </div>

        <h2 className="text-4xl font-black text-white">
          도메인 글자보다 ‘과거 주제 일치’가 최우선
        </h2>
        <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-rose-400 mt-1">
          “과거 주제 ↔ 현재 사업”
        </p>
      </div>

      {/* Main Content: Big Dual Matrix (Match vs Mismatch) */}
      <div className="relative z-10 my-auto py-2 grid grid-cols-2 gap-8">
        {/* Match Card */}
        <div className="p-7 rounded-3xl bg-slate-950/90 border-2 border-emerald-500/60 shadow-2xl flex flex-col justify-between h-[340px]">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-emerald-950/60">
              <span className="text-xl font-black text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6" />
                <span>주제 일치 (채택 후보)</span>
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                MATCH ✓
              </span>
            </div>

            <div className="space-y-3 font-mono">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400 text-sm">과거 이력</span>
                <strong className="text-white text-base">골프 장비 리뷰 & 커뮤니티</strong>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400 text-sm">현재 계획</span>
                <strong className="text-emerald-300 text-base">골프 레슨 & 피팅 스튜디오</strong>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-sm font-bold text-center">
            링크·주제 승계 ✓
          </div>
        </div>

        {/* Mismatch Card */}
        <div className="p-7 rounded-3xl bg-slate-950/90 border border-rose-500/50 shadow-2xl flex flex-col justify-between h-[340px]">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-rose-950/60">
              <span className="text-xl font-black text-rose-400 flex items-center gap-2">
                <XCircle className="w-6 h-6" />
                <span>주제 불일치 (즉각 기각)</span>
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono font-bold">
                MISMATCH ✗
              </span>
            </div>

            <div className="space-y-3 font-mono">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400 text-sm">과거 이력</span>
                <strong className="text-white text-base">중고 자동차 매매 상사</strong>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400 text-sm">현재 계획</span>
                <strong className="text-rose-300 text-base">피부과 의원 웹사이트</strong>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 text-rose-300 text-sm font-bold text-center">
            주제 단절 · 스팸 의심 ✗
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-sm text-slate-500 font-mono flex items-center justify-between border-t border-slate-800/80 pt-4">
        <span>ONOFF MARKETING EDUCATION · 2강</span>
        <span>SLIDE 25 / 38</span>
      </div>
    </div>
  );
};
