import React from 'react';

export const Slide33CompareThreeCandidates: React.FC = () => {
  const candidates = [
    {
      name: '후보 A',
      domain: 'k-ecobuilding.co.kr',
      verdictEng: 'RECOMMENDED ✓',
      color: 'border-2 border-emerald-500/70 bg-emerald-950/20 text-emerald-300',
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
      specs: [
        { label: '주제', val: '일치', good: true },
        { label: '지표', val: '균형', good: true },
        { label: '링크', val: '공공·언론', good: true },
        { label: '이력', val: '정상 6년', good: true },
      ],
      action: '1순위 추가 검증 후 검토',
    },
    {
      name: '후보 B',
      domain: 'seoul-medi.com',
      verdictEng: 'DROP ✗',
      color: 'border-2 border-rose-500/70 bg-rose-950/20 text-rose-300',
      badge: 'bg-rose-500/20 text-rose-400 border-rose-500/50',
      specs: [
        { label: '주제', val: '불일치', good: false },
        { label: '지표', val: '편향', good: false },
        { label: '링크', val: '도박 62%', good: false },
        { label: '이력', val: 'PBN 변조', good: false },
      ],
      action: '제외 (활용 비추천)',
    },
    {
      name: '후보 C',
      domain: 'trade-hub.kr',
      verdictEng: 'ON HOLD △',
      color: 'border-2 border-amber-500/70 bg-amber-950/20 text-amber-300',
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
      specs: [
        { label: '주제', val: '보통', good: null },
        { label: '지표', val: '평이', good: true },
        { label: '링크', val: '포털·뉴스', good: true },
        { label: '이력', val: '공백 2년', good: null },
      ],
      action: '1순위 실패 시 차선책 검토',
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
            <span className="text-3xl font-black font-mono text-cyan-400">33</span>
            <span className="text-sm font-mono uppercase tracking-widest text-cyan-400 font-bold">
              CASE STUDY · 3개 후보 실전 판정
            </span>
          </div>
          <div className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-sm font-mono text-cyan-400 font-bold">
            PRACTICE
          </div>
        </div>

        <h2 className="text-5xl font-black text-white">
          세 후보, 한눈에 판정
        </h2>
        <p className="text-3xl font-black text-cyan-300 mt-2">
          A 추천 · B 제외 · C 보류
        </p>
      </div>

      {/* Main Content: Big 3-Card Comparison */}
      <div className="relative z-10 my-auto py-2">
        <div className="grid grid-cols-3 gap-6 items-stretch">
          {candidates.map((c) => (
            <div
              key={c.name}
              className={`p-7 rounded-3xl ${c.color} shadow-2xl flex flex-col justify-between h-[390px]`}
            >
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                  <span className="text-3xl font-black text-white">
                    {c.name}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${c.badge}`}>
                    {c.verdictEng}
                  </span>
                </div>

                <h3 className="text-lg font-black text-slate-300 font-mono mb-4">
                  {c.domain}
                </h3>

                <div className="space-y-3 font-mono">
                  {c.specs.map((s) => (
                    <div key={s.label} className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 flex items-center justify-between">
                      <span className="text-base text-slate-400">{s.label}</span>
                      <strong className={`text-lg ${s.good === true ? 'text-emerald-400' : s.good === false ? 'text-rose-400' : 'text-amber-300'}`}>
                        {s.val}
                      </strong>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center text-base font-bold font-mono">
                {c.action}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-sm text-slate-500 font-mono flex items-center justify-between border-t border-slate-800/80 pt-4">
        <span>ONOFF MARKETING EDUCATION · 2강</span>
        <span>SLIDE 33 / 38</span>
      </div>
    </div>
  );
};
