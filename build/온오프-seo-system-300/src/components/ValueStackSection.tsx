import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  MessageSquare, 
  Coins,
  ChevronRight,
  ExternalLink,
  Video
} from 'lucide-react';
import { KakaoCta } from './KakaoCta';

export const ValueStackSection: React.FC = () => {
  const executionFees = [
    { title: '낙장도메인 CatchDomain', amount: '300,000원 제공', note: 'SEO 검증 도메인 매입 지원' },
    { title: '백링크 Backlink Auto', amount: '700,000원 제공', note: '도메인 파워 증대 링크 구축' },
    { title: '트래픽 충전금', amount: '1,000,000원 제공', note: '실제 검색 유입 운용 예산' },
  ];

  const includedServices = [
    { 
      title: '1:1 Google Meet 실전교육', 
      desc: '수강생 일정에 맞춰 강사와 1:1로 만나 내 사이트를 보며 진행',
      highlight: true 
    },
    { 
      title: '맞춤 SEO 홈페이지 제작', 
      desc: '1:1 타깃 키워드 및 검색엔진 최적화 웹사이트 직접 제작' 
    },
    { 
      title: 'SEO / GEO / AEO 실전 노하우', 
      desc: '전통 포털부터 ChatGPT·Perplexity AI 답변 엔진까지 총망라' 
    },
    { 
      title: '콘텐츠 자동화 시스템', 
      desc: '지속 가능한 롱테일 정보성 콘텐츠 제작 파이프라인 전수' 
    },
    { 
      title: '백링크 및 트래픽 운영 시스템', 
      desc: '직접 대시보드에서 안전하게 배포하고 운영하는 실행 인프라' 
    },
  ];

  return (
    <section id="pricing" className="py-16 lg:py-24 bg-white border-b border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs sm:text-sm font-bold tracking-wider mb-2">
            <Coins className="w-3.5 h-3.5 text-sky-600" />
            <span>PROGRAM VALUE STACK</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight [word-break:keep-all]">
            300만원은 단순한 강의비가 아닙니다.
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-2 font-medium [word-break:keep-all]">
            1:1 개인지도와 함께 실제 상위노출 작업에 필요한 비용과 시스템이 모두 제공됩니다.
          </p>
        </div>

        {/* Value Stack Main Card in Sleek Slate-900 */}
        <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-9 text-white shadow-xl relative overflow-hidden">
          
          {/* Top Title & Total Fee */}
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
            <div>
              <span className="px-2.5 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800/80 text-xs font-mono font-bold">
                1:1 PRIVATE ALL-IN-ONE PACKAGE
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white mt-1.5">
                SEO SYSTEM 300
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 [word-break:keep-all]">
                1:1 Google Meet 실전교육 + 200만원 실행비용 + 맞춤 사이트 제작
              </p>
            </div>

            <div className="text-left md:text-right">
              <span className="text-xs font-bold text-slate-400 block">프로그램 참가비</span>
              <div className="flex items-baseline md:justify-end gap-1 mt-0.5">
                <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-mono tracking-tight">
                  3,000,000
                </span>
                <span className="text-base font-bold text-slate-300">원</span>
              </div>
            </div>
          </div>

          {/* Core Visual Value Stack Breakdown */}
          <div className="py-6 border-b border-slate-800">
            <div className="text-center mb-4">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-widest block">
                COMPOSITION VALUE
              </span>
              <h4 className="text-sm sm:text-base font-bold text-white mt-0.5 [word-break:keep-all]">
                300만원 참가비에 포함된 4대 가치
              </h4>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 items-center">
              
              {/* Part 1: Execution Fees */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 font-medium block">실제 실행비용</span>
                <span className="text-sm sm:text-base font-black text-sky-400 font-mono mt-0.5 block">
                  2,000,000원
                </span>
                <span className="text-[10px] text-slate-500 mt-1 block">도메인+백링크+트래픽</span>
              </div>

              {/* Part 2: Custom Website */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 font-medium block">맞춤 홈페이지</span>
                <span className="text-sm sm:text-base font-black text-emerald-400 mt-0.5 block">
                  제작 포함
                </span>
                <span className="text-[10px] text-slate-500 mt-1 block">1:1 SEO 사이트 구축</span>
              </div>

              {/* Part 3: 1:1 Google Meet */}
              <div className="p-3.5 rounded-2xl bg-sky-950/60 border border-sky-800/80 text-center">
                <span className="text-[10px] text-sky-300 font-bold block">1:1 Google Meet</span>
                <span className="text-sm sm:text-base font-black text-sky-300 mt-0.5 block">
                  개인 실전교육
                </span>
                <span className="text-[10px] text-sky-400 mt-1 block">수강생 일정 맞춤</span>
              </div>

              {/* Part 4: SEO System */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 font-medium block">SEO SYSTEM</span>
                <span className="text-sm sm:text-base font-black text-yellow-400 mt-0.5 block">
                  인프라 이용
                </span>
                <span className="text-[10px] text-slate-500 mt-1 block">자동화 도구 전수</span>
              </div>

            </div>
          </div>

          {/* Execution Fees 2,000,000 KRW Breakdown */}
          <div className="py-6 border-b border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs sm:text-sm font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                직접 제공되는 실제 실행비용 상세
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-yellow-400/10 text-yellow-300 border border-yellow-400/30 text-xs font-bold font-mono">
                총 2,000,000원
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {executionFees.map((fee, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium block">
                      {fee.note}
                    </span>
                    <h4 className="text-xs font-bold text-white mt-0.5 [word-break:keep-all]">
                      {fee.title}
                    </h4>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-800">
                    <span className="text-xs sm:text-sm font-black text-sky-400 font-mono">
                      {fee.amount}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Core Narrative Highlighting 2,000,000 KRW Execution Budget */}
            <div className="mt-3.5 p-3 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-0.5">
              <p className="text-xs sm:text-sm font-bold text-sky-300 [word-break:keep-all]">
                프로그램 비용 중 200만원은 실제 SEO 작업에 사용할 수 있는 실행비용으로 제공됩니다.
              </p>
              <p className="text-[11px] text-slate-400 [word-break:keep-all]">
                수강 후 별도의 도메인 구매비, 백링크 대행비, 트래픽 비용을 준비할 필요 없이 즉시 시작할 수 있습니다.
              </p>
            </div>
          </div>

          {/* Included Services List */}
          <div className="py-6 border-b border-slate-800 space-y-2.5">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
              추가 포함 가치 &amp; 실전 교육 (별도 추가비용 없음)
            </span>

            <div className="space-y-2">
              {includedServices.map((svc, sIdx) => (
                <div
                  key={sIdx}
                  className={`flex items-center justify-between p-3 rounded-xl border text-xs ${
                    svc.highlight
                      ? 'bg-sky-950/70 border-sky-700/80'
                      : 'bg-slate-950 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60 flex items-center justify-center text-[10px] shrink-0 font-bold">
                      ✓
                    </div>
                    <div>
                      <span className={`font-bold block sm:inline [word-break:keep-all] ${svc.highlight ? 'text-sky-300' : 'text-white'}`}>
                        {svc.title}
                      </span>
                      <span className="text-slate-400 text-[11px] block sm:inline sm:ml-2 [word-break:keep-all]">
                        {svc.desc}
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-slate-900 text-emerald-400 font-bold border border-slate-800 shrink-0 text-[10px]">
                    포함
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Final Value Punchline & CTA */}
          <div className="pt-6 text-center space-y-3">
            <h3 className="text-base sm:text-xl font-black text-white leading-snug [word-break:keep-all]">
              300만원은 녹화강의를 구매하는 비용이 아닙니다.
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl mx-auto [word-break:keep-all]">
              내 홈페이지를 만들고, 200만원의 실제 작업비용을 사용하면서, <br className="hidden sm:inline" />
              <span className="text-sky-400 font-bold">현업 SEO 실무자에게 1:1로 배우는 구축형 프로그램입니다.</span>
            </p>

            {/* CTA Button in Yellow */}
            <div className="pt-2 max-w-md mx-auto">
              <KakaoCta
                id="pricing-kakao-cta"
                location="pricing"
                className="w-full py-3.5 px-6 rounded-full bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-sm transition-all min-h-[52px]"
              >
                <MessageSquare className="w-4 h-4 fill-slate-900 shrink-0" />
                <span className="[word-break:keep-all]">1:1 SEO SYSTEM 300 상담하기</span>
                <ChevronRight className="w-4 h-4 shrink-0" />
              </KakaoCta>

              <p className="text-[11px] text-slate-400 mt-1.5 flex items-center justify-center gap-1">
                <span>상담 후 가능한 일정과 프로그램 진행방식을 안내드립니다.</span>
                <ExternalLink className="w-3 h-3" />
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
