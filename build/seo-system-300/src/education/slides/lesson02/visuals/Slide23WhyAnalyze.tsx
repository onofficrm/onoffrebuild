import React from 'react';
import { AlertTriangle, CheckCircle2, Clock, Zap, ArrowRight, ShieldAlert } from 'lucide-react';

export const Slide23WhyAnalyze: React.FC = () => {
  return (
    <div className="w-full h-full p-12 flex flex-col justify-between relative overflow-hidden select-none bg-[#07111F]">
      {/* Background Accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[140px]" />
      </div>

      {/* Top Header Tag + Title + Core Message */}
      <div className="relative z-10">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-black font-mono text-cyan-400">23</span>
            <span className="text-sm font-mono uppercase tracking-widest text-cyan-400 font-bold">
              WHY EXPIRED DOMAIN · 왜 낙장도메인인가?
            </span>
          </div>
          <div className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-sm font-mono text-cyan-400 font-bold">
            VS COMPARISON
          </div>
        </div>

        <h2 className="text-4xl font-black text-white">
          신규 도메인 vs 검증된 낙장도메인
        </h2>
        <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-300 to-emerald-400 mt-1">
          “이력 활용 가능성 · 결과 비보장”
        </p>
      </div>

      {/* Main Content: Big Dual Comparison Infographic */}
      <div className="relative z-10 my-auto py-2 grid grid-cols-2 gap-8 items-stretch">
        {/* Left: Fresh New Domain (SANDBOX PAIN) */}
        <div className="p-7 rounded-3xl bg-slate-950/90 border border-rose-500/40 shadow-2xl flex flex-col justify-between h-[340px]">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-rose-950/60">
              <span className="text-base font-bold text-rose-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <span>신규 등록 도메인 (Fresh Domain)</span>
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono font-bold">
                HIGH TIME-COST
              </span>
            </div>

            <div className="space-y-3 font-mono">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-white text-base font-bold">초기 신뢰도</span>
                <span className="text-rose-400 font-bold text-sm">초기 이력 없음</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-white text-base font-bold">구글 샌드박스</span>
                <span className="text-rose-400 font-bold text-sm">색인·노출 시간 필요</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-white text-base font-bold">백링크 기초</span>
                <span className="text-rose-400 font-bold text-sm">외부 권위 링크 0개</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 text-rose-300 text-sm font-bold text-center">
            색인 지연 · 하위 노출
          </div>
        </div>

        {/* Right: Verified Expired Domain (INSTANT TRUST) */}
        <div className="p-7 rounded-3xl bg-slate-950/90 border-2 border-emerald-500/60 shadow-2xl flex flex-col justify-between h-[340px]">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-emerald-950/60">
              <span className="text-base font-bold text-emerald-400 flex items-center gap-2">
                <Zap className="w-5 h-5 text-emerald-400" />
                <span>검증된 낙장도메인 (Verified Expired)</span>
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                POTENTIAL HEAD START
              </span>
            </div>

            <div className="space-y-3 font-mono">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-white text-base font-bold">초기 신뢰도</span>
                <span className="text-emerald-300 font-bold text-sm">과거 신호 잔존 가능성</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-white text-base font-bold">구글 샌드박스</span>
                <span className="text-emerald-300 font-bold text-sm">빠른 색인·노출</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-white text-base font-bold">백링크 기초</span>
                <span className="text-emerald-300 font-bold text-sm">공공·언론 링크 ✓</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-sm font-bold text-center">
            상대적 출발 조건 비교
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-sm text-slate-500 font-mono flex items-center justify-between border-t border-slate-800/80 pt-4">
        <span>ONOFF MARKETING EDUCATION · 2강</span>
        <span>SLIDE 23 / 38</span>
      </div>
    </div>
  );
};
