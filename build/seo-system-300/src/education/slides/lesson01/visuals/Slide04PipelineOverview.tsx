import React from 'react';
import { GitCommit, ArrowRight, Shield, FileText, CheckCircle, Link2, Users, BarChart3, Bot, Sparkles } from 'lucide-react';

export const Slide04PipelineOverview: React.FC = () => {
  const phases = [
    {
      phase: 'PHASE 01',
      title: '기반 인프라 구축',
      desc: '출발점 선정 & 전환 최적화',
      steps: [
        {
          num: '01',
          name: '낙장도메인',
          eng: 'EXPIRED DOMAIN',
          tool: 'domain.icrm.co.kr',
          desc: '과거 신뢰 이력 및 스팸 검증',
          color: 'from-blue-600 to-blue-700',
          borderColor: 'border-blue-500/50',
          textColor: 'text-blue-400',
          badgeBg: 'bg-blue-500/20 text-blue-300',
          icon: Shield,
        },
        {
          num: '02',
          name: '홈페이지 제작',
          eng: 'RESPONSIVE WEB',
          tool: '온오프빌더',
          desc: '검색 엔진 표준 & 전환 구조',
          color: 'from-sky-600 to-sky-700',
          borderColor: 'border-sky-500/50',
          textColor: 'text-sky-400',
          badgeBg: 'bg-sky-500/20 text-sky-300',
          icon: CheckCircle,
        },
      ],
    },
    {
      phase: 'PHASE 02',
      title: '자산 적재 및 색인',
      desc: '의도 콘텐츠 & 검색엔진 등재',
      steps: [
        {
          num: '03',
          name: '콘텐츠 작업',
          eng: 'INTENT CONTENT',
          tool: 'content.icrm.co.kr',
          desc: '검색의도 완결형 E-E-A-T 글',
          color: 'from-cyan-600 to-cyan-700',
          borderColor: 'border-cyan-500/50',
          textColor: 'text-cyan-400',
          badgeBg: 'bg-cyan-500/20 text-cyan-300',
          icon: FileText,
        },
        {
          num: '04',
          name: '인덱싱 확인',
          eng: 'SEARCH INDEXING',
          tool: 'GSC 콘솔',
          desc: '크롤링 완료 & DB 정식 등록',
          color: 'from-cyan-500 to-teal-600',
          borderColor: 'border-cyan-400/50',
          textColor: 'text-cyan-300',
          badgeBg: 'bg-cyan-400/20 text-cyan-200',
          icon: CheckCircle,
        },
      ],
    },
    {
      phase: 'PHASE 03',
      title: '신뢰 전파 및 유입',
      desc: '외부 권위 획득 & 진성 체류',
      steps: [
        {
          num: '05',
          name: '백링크',
          eng: 'AUTHORITY LINK',
          tool: 'backlink.icrm.co.kr',
          desc: '고품질 외부 인용 & 신뢰 전달',
          color: 'from-teal-600 to-teal-700',
          borderColor: 'border-teal-500/50',
          textColor: 'text-teal-400',
          badgeBg: 'bg-teal-500/20 text-teal-300',
          icon: Link2,
        },
        {
          num: '06',
          name: '트래픽',
          eng: 'ACTIVE TRAFFIC',
          tool: 'traffic.icrm.co.kr',
          desc: '실제 검색 방문자 유입 활성',
          color: 'from-teal-500 to-sky-600',
          borderColor: 'border-teal-400/50',
          textColor: 'text-teal-300',
          badgeBg: 'bg-teal-400/20 text-teal-200',
          icon: Users,
        },
      ],
    },
    {
      phase: 'PHASE 04',
      title: '데이터 측정 및 AI',
      desc: '퍼널 개선 & 생성형 AI 인용',
      steps: [
        {
          num: '07',
          name: '성과측정',
          eng: 'FUNNEL ANALYTICS',
          tool: '통합 대시보드',
          desc: '노출·클릭·전환 병목 데이터',
          color: 'from-indigo-600 to-indigo-700',
          borderColor: 'border-indigo-500/50',
          textColor: 'text-indigo-400',
          badgeBg: 'bg-indigo-500/20 text-indigo-300',
          icon: BarChart3,
        },
        {
          num: '08',
          name: 'GEO-UP',
          eng: 'AI CITATION (GEO)',
          tool: 'geo-up.icrm.co.kr',
          desc: '생성형 AI 모델 직접 출처 인용',
          color: 'from-cyan-500 to-purple-600',
          borderColor: 'border-purple-500/50',
          textColor: 'text-purple-400',
          badgeBg: 'bg-purple-500/20 text-purple-300',
          icon: Bot,
        },
      ],
    },
  ];

  return (
    <div className="w-full h-full p-12 flex flex-col justify-between relative overflow-hidden select-none bg-[#07111F]">
      {/* Background Pipeline Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 right-0 h-32 bg-cyan-500/5 blur-3xl -translate-y-1/2" />
      </div>

      {/* Top Header */}
      <div className="relative z-10 flex flex-row items-end justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold mb-1">
            <GitCommit className="w-5 h-5" />
            <span>MASTER PIPELINE ARCHITECTURE</span>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tight">
            8개의 미션이 하나의 성과를 만듭니다
          </h2>
        </div>
        <div className="text-right block">
          <span className="text-xs font-mono text-slate-400 block">4 PHASES · 8 SEQUENTIAL STEPS</span>
          <span className="text-sm text-cyan-400 font-semibold">도메인 인프라부터 GEO-UP까지</span>
        </div>
      </div>

      {/* 8-Step Master Pipeline Visual Grid (Layout D) */}
      <div className="relative z-10 my-auto py-2 grid grid-cols-4 gap-3.5">
        {phases.map((phaseGroup, pIdx) => (
          <div
            key={pIdx}
            className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between relative overflow-hidden group hover:border-slate-700 transition-colors"
          >
            {/* Phase Header */}
            <div className="pb-2.5 mb-2.5 border-b border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-sm font-mono font-bold text-cyan-400 block">
                  {phaseGroup.phase}
                </span>
                <span className="text-lg font-bold text-white block mt-0.5">
                  {phaseGroup.title}
                </span>
              </div>
              <span className="sr-only">
                {phaseGroup.desc}
              </span>
            </div>

            {/* 2 Steps in this Phase */}
            <div className="space-y-2.5">
              {phaseGroup.steps.map((step) => {
                const IconComponent = step.icon;
                return (
                  <div
                    key={step.num}
                    className={`p-2.5 rounded-xl bg-slate-950/80 border ${step.borderColor} relative group/card transition-all hover:translate-x-0.5`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {/* Big Step Number as Graphic Feature */}
                        <span className={`text-3xl font-black font-mono tracking-tight ${step.textColor}`}>
                          {step.num}
                        </span>
                        <div>
                          <div className="text-lg font-bold text-white flex items-center gap-1.5">
                            <span>{step.name}</span>
                            <span className={`inline-block font-mono px-1.5 py-0.5 rounded ${step.badgeBg}`}>
                              {step.eng}
                            </span>
                          </div>
                          <div className="sr-only">
                            {step.desc}
                          </div>
                        </div>
                      </div>
                      <IconComponent className={`w-5 h-5 ${step.textColor} shrink-0 mt-1`} />
                    </div>

                    <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-sm font-mono">
                      <span className="text-slate-500">PLATFORM TOOL</span>
                      <span className="text-slate-300 font-medium">{step.tool}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Process Link Ribbon */}
      <div className="relative z-10 pt-2.5 border-t border-slate-800/80 flex flex-row items-center justify-between gap-2 text-base font-mono">
        <div className="flex items-center gap-2 text-slate-300">
          <Sparkles className="w-5 h-5 text-cyan-400 shrink-0" />
          <span>
            <strong>파이프라인 연속성:</strong> 01에서 시작해 08까지 완료될 때 비로소 지속적으로 개선하는 마케팅 자산이 됩니다.
          </span>
        </div>
        <div className="flex items-center gap-1 text-sm text-cyan-400 font-bold">
          <span>01</span>
          <ArrowRight className="w-5 h-5" />
          <span>04</span>
          <ArrowRight className="w-5 h-5" />
          <span>08</span>
        </div>
      </div>
    </div>
  );
};
