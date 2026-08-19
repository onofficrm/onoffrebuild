import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  UserCheck, 
  UserX, 
  HelpCircle, 
  ChevronDown, 
  LineChart, 
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet
} from 'lucide-react';
import { TARGET_AUDIENCE, ANTI_TARGET, FAQ_ITEMS } from '../data/landingData';
import { KakaoCta } from './KakaoCta';

export const TargetAndFaqSection: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section id="target" className="py-16 lg:py-24 bg-slate-50 border-b border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. Target Audience Section (Compressed & Fast Scanning) */}
        <div className="mb-16">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs sm:text-sm font-bold tracking-wider mb-2">
              <UserCheck className="w-3.5 h-3.5" />
              <span>TARGET AUDIENCE</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight [word-break:keep-all]">
              이런 분에게 추천합니다.
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1 [word-break:keep-all]">
              실행 환경과 전용 인프라를 통해 본인만의 검색 경쟁력을 구축할 분을 모십니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 max-w-5xl mx-auto">
            {TARGET_AUDIENCE.map((item, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-sky-300 transition-all shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-6 h-6 rounded-lg bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center font-bold text-xs font-mono">
                      0{idx + 1}
                    </span>
                    <span className="text-[10px] font-bold text-sky-600">추천 대상</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1 leading-snug [word-break:keep-all]">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed [word-break:keep-all]">
                    {item.desc}
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-sky-700 font-bold">
                  <CheckCircle2 className="w-3 h-3 text-sky-600 shrink-0" />
                  <span>맞춤형 실행 지원</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Anti-Target Audience Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="rounded-2xl bg-rose-50/70 border border-rose-200 p-5 sm:p-7">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-sm sm:text-base mb-2">
              <UserX className="w-4 h-4 text-rose-600" />
              <span>이런 분에게는 추천하지 않습니다.</span>
            </div>

            <p className="text-xs text-slate-600 mb-3 [word-break:keep-all]">
              불필요한 수강을 방지하고 상호 신뢰를 높이기 위해 아래에 해당하시는 분의 신청은 정중히 사양합니다.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-4">
              {ANTI_TARGET.map((anti, aIdx) => (
                <div
                  key={aIdx}
                  className="p-3 rounded-xl bg-white border border-rose-200 text-xs text-rose-900 flex items-start gap-2 shadow-2xs"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                  <span className="[word-break:keep-all]">{anti}</span>
                </div>
              ))}
            </div>

            <div className="text-center pt-2.5 border-t border-rose-200">
              <span className="text-xs sm:text-sm font-bold text-slate-900 [word-break:keep-all]">
                💡 SEO SYSTEM 300은 <span className="text-sky-700 underline decoration-sky-400">실행할 사람에게 가장 큰 가치가 있는 프로그램</span>입니다.
              </span>
            </div>
          </div>
        </div>

        {/* 3. Authentic Case Study Process Framework Placeholder */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs sm:text-sm font-bold tracking-wider mb-2">
              <LineChart className="w-3.5 h-3.5" />
              <span>PROCESS OVER PROMISES</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight [word-break:keep-all]">
              결과보다 과정을 보여드리겠습니다.
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1 [word-break:keep-all]">
              가짜 후기나 조작된 순위 대신, 체계적으로 진행되는 실제 작업 프로세스와 근거 데이터를 제공합니다.
            </p>
          </div>

          {/* 6-Step Process Flow */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-2xs">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center text-xs mb-6">
              {[
                { step: '01', title: '도메인 선정', desc: '히스토리 검증' },
                { step: '02', title: '홈페이지 제작', desc: 'SEO 구조화' },
                { step: '03', title: '콘텐츠 작업', desc: 'AEO/GEO 최적화' },
                { step: '04', title: '백링크 작업', desc: '도메인 파워 증대' },
                { step: '05', title: '트래픽 운영', desc: '유입 활성화' },
                { step: '06', title: '검색 노출 변화', desc: '인덱싱/성장 추적' },
              ].map((item, pIdx) => (
                <div key={pIdx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-center">
                  <span className="text-[10px] font-mono text-sky-600 font-bold">{item.step}</span>
                  <span className="font-bold text-slate-900 mt-0.5 [word-break:keep-all]">{item.title}</span>
                  <span className="text-[10px] text-slate-500 mt-0.5 [word-break:keep-all]">{item.desc}</span>
                </div>
              ))}
            </div>

            {/* Search Console Placeholder Frame (No Fake Numbers) */}
            <div className="p-5 sm:p-6 rounded-xl bg-slate-900 border border-slate-800 text-white space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-300 text-xs">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-sky-400" />
                  <span className="font-bold">실제 프로젝트 사례 (Google Search Console 연동 분석)</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-sky-300 text-[10px] font-mono">
                  GSC FRAMEWORK
                </span>
              </div>

              {/* Data Placeholder Box */}
              <div className="w-full py-6 px-4 rounded-lg bg-slate-950 border border-dashed border-slate-700 flex flex-col items-center justify-center text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sky-400">
                  <LineChart className="w-5 h-5" />
                </div>
                <span className="px-3 py-0.5 rounded-full bg-sky-950 border border-sky-800 text-sky-300 text-xs font-bold font-mono">
                  실제 Google Search Console 데이터 삽입 영역
                </span>
                <p className="text-xs text-slate-400 max-w-lg [word-break:keep-all]">
                  수강생 프로젝트의 실제 노출수, 클릭수, 평균 게재순위, 색인 생성 현황 데이터를 투명하게 기록하고 분석하는 공간입니다.
                </p>
              </div>

              {/* 5 Search Console Metrics Structure */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 text-[11px] font-mono">
                <div className="p-2 rounded bg-slate-950 border border-slate-800 text-center">
                  <span className="text-slate-500 block text-[10px]">지표 1</span>
                  <span className="text-slate-300 font-bold">Impressions</span>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800 text-center">
                  <span className="text-slate-500 block text-[10px]">지표 2</span>
                  <span className="text-slate-300 font-bold">Clicks</span>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800 text-center">
                  <span className="text-slate-500 block text-[10px]">지표 3</span>
                  <span className="text-slate-300 font-bold">Indexed Pages</span>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800 text-center">
                  <span className="text-slate-500 block text-[10px]">지표 4</span>
                  <span className="text-slate-300 font-bold">Ranking Queries</span>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800 text-center col-span-2 sm:col-span-1">
                  <span className="text-slate-500 block text-[10px]">지표 5</span>
                  <span className="text-slate-300 font-bold">Avg Position</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. FAQ Accordion Section */}
        <div id="faq" className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs sm:text-sm font-bold tracking-wider mb-2">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>FREQUENTLY ASKED QUESTIONS</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight [word-break:keep-all]">
              자주 묻는 질문 (FAQ)
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              궁금하신 점을 빠르게 확인해 보세요.
            </p>
          </div>

          <div className="space-y-2.5">
            {FAQ_ITEMS.map((faq, fIdx) => {
              const isOpen = openFaqIndex === fIdx;
              return (
                <div
                  key={fIdx}
                  className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all duration-200 shadow-2xs"
                >
                  <button
                    onClick={() => toggleFaq(fIdx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sky-600 font-bold text-xs sm:text-sm shrink-0">
                        Q{fIdx + 1 < 10 ? `0${fIdx + 1}` : fIdx + 1}
                      </span>
                      <h3 className="font-bold text-xs sm:text-sm text-slate-900 [word-break:keep-all]">
                        {faq.question}
                      </h3>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-sky-600' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-4 pt-1 text-xs sm:text-sm text-slate-600 border-t border-slate-100 leading-relaxed [word-break:keep-all]">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick FAQ Kakao Link */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-600">
              더 궁금한 점은{' '}
              <KakaoCta
                location="faq"
                className="text-sky-600 font-bold underline hover:text-sky-700"
              >
                카카오톡 1:1 상담
              </KakaoCta>
              을 통해 자세히 안내받으실 수 있습니다.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
