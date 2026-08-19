import React from 'react';
import { motion } from 'motion/react';
import { 
  HelpCircle, 
  CheckCircle, 
  XCircle, 
  Check,
  Video,
  ExternalLink
} from 'lucide-react';
import { ROADMAP_STEPS, systemHref } from '../data/landingData';

export const WhyAndRoadmapSection: React.FC = () => {
  const borderLeftColors = [
    'border-l-sky-600',
    'border-l-sky-500',
    'border-l-sky-400',
    'border-l-sky-300',
    'border-l-sky-200',
  ];

  return (
    <section id="roadmap" className="py-16 lg:py-24 bg-white border-b border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section 1: Why SEO SYSTEM 300 Comparison */}
        <div id="program" className="max-w-4xl mx-auto text-center mb-14 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs sm:text-sm font-bold tracking-wider mb-3"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>WHY SEO SYSTEM 300?</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4 [word-break:keep-all]"
          >
            예전에는 방법을 알려드렸습니다. <br />
            <span className="text-sky-600">
              이제는 실행할 시스템까지 만들어 놓았습니다.
            </span>
          </motion.h2>

          {/* Comparison Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left mt-8">
            
            {/* Left Card: Traditional Online Course */}
            <div className="bg-slate-50 border border-rose-200 rounded-2xl p-5 sm:p-7 flex flex-col justify-between shadow-2xs">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2 text-rose-600 font-bold text-base">
                    <XCircle className="w-4 h-4 text-rose-500" />
                    <span>일반적인 온라인 강의</span>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-700">
                    단체 녹화강의
                  </span>
                </div>

                <div className="mt-4 space-y-2.5">
                  {[
                    '정해진 커리큘럼을 여러 수강생이 동일하게 학습',
                    '녹화영상 시청 후 혼자서 따라하기 시도',
                    '도메인을 혼자 직접 찾는다 (품질 판단 불가)',
                    '홈페이지 제작업체를 별도로 찾는다 (추가 비용)',
                    '콘텐츠 만드는 방법을 찾아보다 지친다',
                    '백링크 업체를 찾아 헤맨다 (신뢰성 부족)',
                  ].map((step, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                      <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px] shrink-0 font-mono font-bold">
                        {idx + 1}
                      </span>
                      <span className="[word-break:keep-all]">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Requested Copy Fix */}
              <div className="mt-5 pt-3 border-t border-slate-200 text-rose-700 font-bold text-xs sm:text-sm bg-rose-50/80 p-3 rounded-xl [word-break:keep-all]">
                많은 분들이 실제 실행 단계에서 어려움을 겪습니다.
              </div>
            </div>

            {/* Right Card: SEO SYSTEM 300 */}
            <div className="bg-white border-2 border-sky-500 rounded-2xl p-5 sm:p-7 flex flex-col justify-between shadow-sm relative">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-sky-700 font-bold text-base">
                    <CheckCircle className="w-4 h-4 text-sky-600" />
                    <span>SEO SYSTEM 300</span>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                    1:1 GOOGLE MEET 실전교육
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  {[
                    { 
                      title: '1:1 맞춤 실전교육', 
                      desc: 'Google Meet으로 내 사업과 사이트를 보면서 1:1 직접 진행', 
                      highlight: true 
                    },
                    { 
                      title: '내 사업 맞춤 홈페이지를 직접 제작해준다', 
                      desc: '검색엔진 최적화 구조 완성형 사이트 1:1 맞춤 구축' 
                    },
                    { 
                      title: '실제 작업비용 200만원까지 제공한다', 
                      desc: '도메인 30만 + 백링크 70만 + 트래픽 100만 실사용금 지급' 
                    },
                    { 
                      title: '이미 만들어진 시스템을 사용한다', 
                      desc: 'CatchDomain / Backlink / Traffic 인프라 연동' 
                    },
                  ].map((step, idx) => (
                    <div 
                      key={idx} 
                      className={`flex items-start gap-2.5 text-xs sm:text-sm p-2 rounded-xl ${
                        step.highlight ? 'bg-sky-50 border border-sky-200' : ''
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-xs shrink-0 font-bold mt-0.5">
                        ✓
                      </div>
                      <div>
                        <strong className="text-slate-900 font-bold block [word-break:keep-all]">{step.title}</strong>
                        <span className="text-slate-600 text-xs [word-break:keep-all]">{step.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Exact Requested Copy */}
              <div className="mt-5 pt-3 border-t border-slate-100 text-sky-900 font-bold text-xs sm:text-sm bg-sky-50 p-3 rounded-xl border border-sky-200 [word-break:keep-all]">
                방법만 배우는 것이 아니라, 내 사업을 기준으로 1:1 진행하며 즉시 가동되는 인프라를 손에 쥡니다.
              </div>
            </div>

          </div>

          {/* Core Takeaway Box */}
          <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center max-w-xl mx-auto shadow-2xs">
            <p className="text-[11px] font-bold text-slate-400 mb-0.5 uppercase tracking-widest">
              PARADIGM SHIFT
            </p>
            <h3 className="text-base sm:text-xl font-black text-slate-900 leading-snug [word-break:keep-all]">
              이제 중요한 것은 <br />
              <span className="text-slate-500 font-normal">“어떻게 해야 하지?”가 아니라</span> <br />
              <span className="text-sky-600 font-extrabold">“1:1로 직접 실행하는 것”입니다.</span>
            </h3>
          </div>
        </div>

        {/* Section 2: 5-Stage System Roadmap (Compressed & Mobile Vertical) */}
        <div className="mt-14">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <span className="text-xs font-mono font-bold tracking-widest text-sky-600 uppercase">
              // THE 5-STEP SYSTEM
            </span>
            <h3 className="text-xl sm:text-3xl font-black text-slate-900 mt-1 [word-break:keep-all]">
              5단계 상위노출 시스템 구축 로드맵
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              도메인 발굴부터 사이트 제작, 백링크, AI 콘텐츠, 트래픽까지 완벽하게 이어지는 흐름
            </p>
          </div>

          {/* 5-Step Compact Cards */}
          <div className="space-y-3 max-w-4xl mx-auto">
            {ROADMAP_STEPS.map((step, idx) => (
              <div
                key={step.step}
                className={`rounded-2xl bg-white border border-slate-200 border-l-4 ${borderLeftColors[idx]} p-4 sm:p-5 shadow-2xs transition-all`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 font-mono font-bold">
                        {step.step}
                      </span>
                      {step.serviceName && (
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold flex items-center gap-1">
                          {step.serviceName}
                          {step.serviceUrl && (
                            <a
                              href={systemHref(step.serviceUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sky-600 font-mono font-bold text-[11px] hover:underline inline-flex items-center gap-0.5"
                            >
                              ({step.serviceUrl})
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </span>
                      )}
                      {step.benefitBadge && (
                        <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-bold text-[11px]">
                          ★ {step.benefitBadge}
                        </span>
                      )}
                    </div>

                    <h4 className="text-base sm:text-lg font-black text-slate-900 [word-break:keep-all]">
                      {step.title}
                    </h4>

                    <p className="text-xs text-slate-500 [word-break:keep-all]">
                      {step.description}
                    </p>
                  </div>

                  {/* 3 Core Points (Compact Pills) */}
                  <div className="flex flex-wrap sm:flex-col gap-1.5 sm:min-w-[170px] pt-1 sm:pt-0">
                    {step.details.map((d, dIdx) => (
                      <div
                        key={dIdx}
                        className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-700 flex items-center gap-1.5"
                      >
                        <Check className="w-3 h-3 text-sky-600 shrink-0" />
                        <span className="truncate">{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Connected System Summary Big Box in Sleek Dark Slate-900 */}
          <div className="mt-10 p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center text-white shadow-xl max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-3 font-mono font-black text-xs sm:text-base lg:text-lg text-white">
              <span className="px-2.5 py-1 rounded bg-slate-800 text-sky-300 border border-slate-700">DOMAIN</span>
              <span className="text-sky-400">→</span>
              <span className="px-2.5 py-1 rounded bg-slate-800 text-sky-300 border border-slate-700">WEBSITE</span>
              <span className="text-sky-400">→</span>
              <span className="px-2.5 py-1 rounded bg-slate-800 text-sky-300 border border-slate-700">CONTENT</span>
              <span className="text-sky-400">→</span>
              <span className="px-2.5 py-1 rounded bg-slate-800 text-sky-300 border border-slate-700">BACKLINK</span>
              <span className="text-sky-400">→</span>
              <span className="px-2.5 py-1 rounded bg-slate-800 text-sky-300 border border-slate-700">TRAFFIC</span>
            </div>

            <p className="mt-4 text-sm sm:text-base font-bold text-slate-300 [word-break:keep-all]">
              이 5가지를 각각 배우는 것이 아니라 <br className="hidden sm:inline" />
              <span className="text-sky-400 font-extrabold">1:1 맞춤 일정으로 하나의 SEO 성장 시스템으로 연결합니다.</span>
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
