import React from 'react';
import { Award, ArrowRight, CheckCircle2, ShieldCheck, FolderCheck, Sparkles } from 'lucide-react';

export const Slide17ProjectOutcomes: React.FC = () => {
  const outcomes = [
    { num: '01', title: '낙장도메인', output: '스팸 필터링 통과 도메인 1개 확정', tool: 'domain.icrm.co.kr' },
    { num: '02', title: '홈페이지', output: '검색 표준 반응형 전환 사이트 1개 런칭', tool: '온오프빌더' },
    { num: '03', title: '콘텐츠', output: '검색의도 완결형 E-E-A-T 글 1편 발행', tool: 'content.icrm.co.kr' },
    { num: '04', title: '인덱싱', output: '구글 서치콘솔 URL 정식 색인 등록 확인', tool: 'Google Search Console' },
    { num: '05', title: '백링크', output: '도메인 권위 향상 참조 링크 프로필 구축', tool: 'backlink.icrm.co.kr' },
    { num: '06', title: '트래픽', output: '실제 검색 방문자 체류 유입 데이터 확보', tool: 'traffic.icrm.co.kr' },
    { num: '07', title: '성과측정', output: '노출·클릭·전환 퍼널 병목 분석 보고서', tool: '통합 대시보드' },
    { num: '08', title: 'GEO-UP', output: '생성형 AI 모델 인용 및 엔티티 진단표', tool: 'geo-up.icrm.co.kr' },
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
          <FolderCheck className="w-5 h-5" />
          <span>PROJECT DELIVERABLES · 축적되는 실물 자산</span>
        </div>
        <h2 className="text-5xl font-black text-white tracking-tight">
          강의가 끝날수록 내 프로젝트가 완성됩니다
        </h2>
        <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 mt-1">
          “배운 것이 아니라, 내 프로젝트에 만든 것이 남습니다.”
        </p>
      </div>

      {/* Main Content: Layout E (8 Tangible Deliverables Grid) */}
      <div className="relative z-10 my-auto py-2">
        <div className="p-6 rounded-2xl bg-slate-950/90 border border-slate-800 shadow-2xl">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs font-mono">
            <span className="text-slate-300 font-bold flex items-center gap-2">
              <Award className="w-5 h-5 text-cyan-400" />
              <span>8 REAL-WORLD TANGIBLE DELIVERABLES INVENTORY</span>
            </span>
            <span className="text-emerald-400 font-bold text-sm">PORTFOLIO VALUE: COMPOUND ASSET</span>
          </div>

          <div className="grid grid-cols-4 gap-2.5 font-mono">
            {outcomes.map((item) => (
              <div
                key={item.num}
                className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between group hover:border-cyan-500/50 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-black text-cyan-400">{item.num} DELIVERABLE</span>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="text-base font-bold text-white block">{item.title}</span>
                  <span className="text-sm text-slate-300 font-sans block mt-1 leading-snug">
                    {item.output}
                  </span>
                </div>
                <div className="mt-2.5 pt-1.5 border-t border-slate-800/80 text-sm text-slate-500 truncate">
                  {item.tool}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Banner */}
      <div className="relative z-10 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs font-mono">
        <span className="text-slate-300">
          <strong className="text-cyan-300">장기 활용 자산:</strong> 결과물은 교육 이후에도 개선하며 활용할 수 있습니다.
        </span>
        <span className="text-sm text-emerald-400 font-bold block">PORTFOLIO READY</span>
      </div>
    </div>
  );
};
