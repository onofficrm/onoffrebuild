import React from 'react';
import { Search, History, Link2, Tag, AlertOctagon, CheckCircle2, XCircle } from 'lucide-react';

export const Slide31ToolDashboard: React.FC = () => {
  const sections = [
    {
      key: 'DOMAIN',
      title: '도메인 기본',
      desc: 'TLD · 등록 가능',
      icon: Search,
      color: 'border-blue-500/50 text-blue-400 bg-blue-950/20',
      tag: 'BASIC',
    },
    {
      key: 'HISTORY',
      title: '과거 운영 이력',
      desc: 'Wayback · 업종',
      icon: History,
      color: 'border-sky-500/50 text-sky-400 bg-sky-950/20',
      tag: 'ARCHIVE',
    },
    {
      key: 'BACKLINK',
      title: '백링크 품질',
      desc: '공공·언론 · RD',
      icon: Link2,
      color: 'border-cyan-500/50 text-cyan-300 bg-cyan-950/20',
      tag: 'AUTHORITY',
    },
    {
      key: 'ANCHOR',
      title: '앵커 텍스트',
      desc: '앵커 분포 확인',
      icon: Tag,
      color: 'border-teal-500/50 text-teal-300 bg-teal-950/20',
      tag: 'PURITY',
    },
    {
      key: 'RISK',
      title: '리스크 검증',
      desc: '스팸·변조 Red Flag',
      icon: AlertOctagon,
      color: 'border-rose-500/50 text-rose-300 bg-rose-950/20',
      tag: 'RISK REVIEW',
    },
  ];

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
            <span className="text-3xl font-black font-mono text-cyan-400">31</span>
            <span className="text-sm font-mono uppercase tracking-widest text-cyan-400 font-bold">
              WORKBENCH WALKTHROUGH · 전용 도구
            </span>
          </div>
          <div className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-sm font-mono text-cyan-400 font-bold">
            domain.icrm.co.kr
          </div>
        </div>

        <h2 className="text-4xl font-black text-white">
          후보 요약 + 외부 상세 검증
        </h2>
        <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 mt-1">
          “5 ZONE 순서 점검”
        </p>
      </div>

      {/* Main Content: Big 5 Core Inspection Zones (Clean Visual Architecture) */}
      <div className="relative z-10 my-auto py-2">
        <div className="p-8 rounded-3xl bg-slate-950/95 border border-slate-800 shadow-2xl">
          {/* Top Browser Bar */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800 font-mono">
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-rose-500" />
                <span className="w-3.5 h-3.5 rounded-full bg-amber-500" />
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-500" />
              </div>
              <span className="px-4 py-1.5 rounded-xl bg-slate-900 text-cyan-300 font-bold text-base border border-slate-800">
                https://domain.icrm.co.kr
              </span>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              5 CORE INSPECTION ZONES
            </span>
          </div>

          {/* 5 Big Inspection Zone Cards */}
          <div className="grid grid-cols-5 gap-4">
            {sections.map((sec, idx) => {
              const Icon = sec.icon;
              return (
                <div
                  key={sec.key}
                  className={`p-6 rounded-2xl border ${sec.color} flex flex-col justify-between h-[230px] transition-transform hover:scale-[1.02]`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      ZONE 0{idx + 1}
                    </span>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div>
                    <span className="text-xs font-mono font-bold text-cyan-300 block mb-1">
                      {sec.key}
                    </span>
                    <h3 className="text-xl font-black text-white mb-2">
                      {sec.title}
                    </h3>
                    <p className="text-base text-slate-300 font-sans leading-relaxed">
                      {sec.desc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 text-xs font-mono font-bold text-slate-400">
                    {sec.tag}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Under Platform Bottom Principle */}
          <div className="mt-6 p-4 rounded-xl bg-slate-900 border border-cyan-500/30 flex items-center justify-between text-base">
            <span className="text-slate-200 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <strong className="text-white">1차 필터 → 사람이 최종</strong>
            </span>
            <span className="text-sm font-mono text-cyan-400 font-bold">5-ZONE CHECK</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-sm text-slate-500 font-mono flex items-center justify-between border-t border-slate-800/80 pt-4">
        <span>ONOFF MARKETING EDUCATION · 2강</span>
        <span>SLIDE 31 / 38</span>
      </div>
    </div>
  );
};
