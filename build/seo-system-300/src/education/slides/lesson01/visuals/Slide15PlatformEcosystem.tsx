import React from 'react';
import { Cpu, ArrowRight, ExternalLink, ShieldCheck, CheckCircle2, Terminal, Layers } from 'lucide-react';

export const Slide15PlatformEcosystem: React.FC = () => {
  const tools = [
    { num: '01', name: 'DOMAIN', sub: 'domain.icrm.co.kr', role: '낙장도메인 스팸 검증 & 발굴', color: 'text-blue-400', border: 'border-blue-900/40' },
    { num: '02', name: 'BUILDER', sub: '온오프빌더', role: '전환형 반응형 웹사이트 제작', color: 'text-sky-400', border: 'border-sky-900/40' },
    { num: '03', name: 'CONTENT', sub: 'content.icrm.co.kr', role: '검색의도 완결형 E-E-A-T 글 생성', color: 'text-cyan-400', border: 'border-cyan-900/40' },
    { num: '04', name: 'INDEX', sub: 'GSC 콘솔 연동', role: '구글 검색엔진 색인 여부 검증', color: 'text-cyan-300', border: 'border-cyan-800/40' },
    { num: '05', name: 'BACKLINK', sub: 'backlink.icrm.co.kr', role: '고품질 외부 권위 인용 링크 구축', color: 'text-teal-400', border: 'border-teal-900/40' },
    { num: '06', name: 'TRAFFIC', sub: 'traffic.icrm.co.kr', role: '진성 검색 사용자 체류 유입 신호', color: 'text-teal-300', border: 'border-teal-800/40' },
    { num: '07', name: 'METRICS', sub: '통합 분석 대시보드', role: '퍼널별 전환율 & 병목 구간 진단', color: 'text-indigo-400', border: 'border-indigo-900/40' },
    { num: '08', name: 'GEO-UP', sub: 'geo-up.icrm.co.kr', role: '생성형 AI 모델 답변 출처 인용', color: 'text-purple-400', border: 'border-purple-900/40' },
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
          <Cpu className="w-5 h-5" />
          <span>INTEGRATED TECH SUITE · 통합 기술 생태계</span>
        </div>
        <h2 className="text-5xl font-black text-white tracking-tight">
          온오프마케팅 플랫폼은 이 과정을 연결합니다
        </h2>
        <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 mt-1">
          “말뿐인 이론이 아닌, 교육 내내 직접 다루는 8대 실습 워크벤치”
        </p>
      </div>

      {/* Main Content: Layout E (Integrated Lab Command Center Grid) */}
      <div className="relative z-10 my-auto py-2">
        <div className="p-6 rounded-2xl bg-slate-950/90 border border-slate-800 shadow-2xl">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs font-mono">
            <div className="flex items-center gap-2 text-slate-300 font-bold">
              <Terminal className="w-5 h-5 text-cyan-400" />
              <span>ONOFF MARKETING INTEGRATED LABORATORY COMMAND CENTER</span>
            </div>
            <span className="text-cyan-400 font-bold text-sm">8 CONNECTED TOOLS ACTIVE</span>
          </div>

          {/* 8-Tool Grid */}
          <div className="grid grid-cols-4 gap-2.5 font-mono">
            {tools.map((tool) => (
              <div
                key={tool.num}
                className={`p-3 rounded-xl bg-slate-900/80 border ${tool.border} flex flex-col justify-between hover:translate-y-[-1px] transition-all`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-base font-black ${tool.color}`}>{tool.num}</span>
                    <span className="text-sm text-slate-400 font-bold tracking-wider">{tool.name}</span>
                  </div>
                  <span className="text-base font-bold text-white block truncate">{tool.sub}</span>
                  <span className="text-sm text-slate-400 font-sans block mt-1 line-clamp-2">
                    {tool.role}
                  </span>
                </div>
                <div className="mt-2.5 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-sm text-slate-500">
                  <span>PRACTICE LAB</span>
                  <ExternalLink className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Banner */}
      <div className="relative z-10 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs font-mono">
        <span className="text-slate-300">
          <strong className="text-cyan-300">실습 일체화:</strong> 교육 화면 옆에 실습 도구를 띄우고 매 강의마다 실제 데이터를 구축합니다.
        </span>
        <span className="text-sm text-cyan-400 font-bold block">PROJECT-BASED PRACTICE</span>
      </div>
    </div>
  );
};
