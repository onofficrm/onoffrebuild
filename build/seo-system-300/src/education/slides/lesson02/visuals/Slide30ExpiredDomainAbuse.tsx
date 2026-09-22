import React from 'react';
import { AlertOctagon, CheckCircle2, XCircle } from 'lucide-react';

export const Slide30ExpiredDomainAbuse: React.FC = () => {
  const legit = [
    { title: '맥락 일치' },
    { title: '사용자 가치' },
    { title: '고유 콘텐츠' },
    { title: '장기 브랜드' },
  ];

  const abuse = [
    { title: '평판 편취' },
    { title: 'PBN 조작' },
    { title: '스팸 콘텐츠' },
    { title: '강제 리디렉션' },
  ];

  return (
    <div className="w-full h-full p-12 flex flex-col justify-between relative overflow-hidden select-none bg-[#07111F]">
      {/* Background Accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-amber-950/20 rounded-full blur-[140px]" />
      </div>

      {/* Top Header Tag + Title + Core Message */}
      <div className="relative z-10">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-black font-mono text-amber-400">POLICY</span>
            <span className="text-sm font-mono uppercase tracking-widest text-amber-400 font-bold">
              GOOGLE SEARCH SPAM POLICY · 구글 정책
            </span>
          </div>
          <div className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-sm font-mono text-amber-400 font-bold">
            COMPLIANCE
          </div>
        </div>

        <h2 className="text-5xl font-black text-white">
          재등록 자체는 정책 위반이 아니다
        </h2>
        <p className="text-3xl font-black text-amber-300 mt-2">
          목적과 사용 방식이 정상 활용과 악용을 가른다
        </p>
      </div>

      {/* Main Content: Big Dual Matrix (Approved vs Penalized) */}
      <div className="relative z-10 my-auto py-2 grid grid-cols-2 gap-8 items-stretch">
        {/* Approved Card */}
        <div className="p-7 rounded-3xl bg-slate-950/90 border-2 border-emerald-500/60 shadow-2xl flex flex-col justify-between h-[390px]">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-emerald-950/60">
              <span className="text-xl font-black text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6" />
                <span>정상 활용</span>
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                APPROVED ✓
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {legit.map((l) => (
                <div key={l.title} className="p-5 rounded-xl bg-slate-900 border border-emerald-500/20 flex flex-col items-center justify-center gap-3 h-[105px]">
                  <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                  <h4 className="text-lg font-black text-white">{l.title}</h4>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-lg text-emerald-300 font-bold text-center">
            사용자 가치 · 정식 서비스
          </div>
        </div>

        {/* Penalized Card */}
        <div className="p-7 rounded-3xl bg-slate-950/90 border-2 border-rose-500/50 shadow-2xl flex flex-col justify-between h-[390px]">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-rose-950/60">
              <span className="text-xl font-black text-rose-400 flex items-center gap-2">
                <AlertOctagon className="w-6 h-6" />
                <span>정책 악용</span>
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono font-bold">
                POLICY RISK ✗
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {abuse.map((a) => (
                <div key={a.title} className="p-5 rounded-xl bg-slate-900 border border-rose-500/20 flex flex-col items-center justify-center gap-3 h-[105px]">
                  <XCircle className="w-7 h-7 text-rose-400" />
                  <h4 className="text-lg font-black text-white">{a.title}</h4>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 text-lg text-rose-300 font-bold text-center">
            정책 위반 = 노출 리스크
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-sm text-slate-500 font-mono flex items-center justify-between border-t border-slate-800/80 pt-4">
        <span>ONOFF MARKETING EDUCATION · 2강</span>
        <span>SLIDE 30 / 38</span>
      </div>
    </div>
  );
};
