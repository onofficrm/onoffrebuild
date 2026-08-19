import React from 'react';
import { motion } from 'motion/react';
import { Shield, Award, User, Video, Users, Sparkles } from 'lucide-react';
import { TIMELINE_DATA } from '../data/landingData';

export const TrustSection: React.FC = () => {
  return (
    <section id="trust" className="py-16 lg:py-24 bg-slate-50 border-b border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Tag */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs sm:text-sm font-bold tracking-wider"
          >
            <Shield className="w-3.5 h-3.5 text-sky-600" />
            <span>PRACTICAL EXPERTISE &amp; 1:1 COACHING</span>
          </motion.div>
        </div>

        {/* Real Instructor Profile & Strong Bio Grid */}
        <div className="max-w-5xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* PC: 40% Photo Placeholder (Mobile: Top) */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative w-full max-w-xs sm:max-w-sm aspect-[4/5] rounded-2xl bg-gradient-to-b from-slate-100 to-slate-200 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center p-6 text-center shadow-inner group overflow-hidden">
                <div className="w-20 h-20 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center mb-4 shadow-sm border border-sky-200">
                  <User className="w-10 h-10 text-sky-600" />
                </div>
                
                <span className="px-3 py-1 rounded-full bg-white text-slate-800 text-xs font-bold shadow-2xs border border-slate-200 mb-2">
                  강사 실제 사진 영역
                </span>
                
                <p className="text-[11px] text-slate-500 [word-break:keep-all] leading-relaxed">
                  2018년부터 현재까지 현업에서 직접 SEO 비즈니스를 총괄하는 실무자
                </p>

                <div className="absolute bottom-3 inset-x-3 py-1.5 rounded-lg bg-slate-900/90 backdrop-blur-sm text-[10px] text-white font-mono font-bold tracking-wider flex items-center justify-center gap-1.5">
                  <Video className="w-3 h-3 text-sky-400" />
                  <span>1:1 GOOGLE MEET DIRECT COACHING</span>
                </div>
              </div>
            </div>

            {/* PC: 60% Bio Information (Mobile: Middle) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-sky-700 uppercase tracking-wider block">
                  SEO PRACTITIONER &amp; 1:1 DIRECT INSTRUCTOR
                </span>
                
                {/* Core Strong Headline with keep-all */}
                <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug [word-break:keep-all]">
                  2018년부터 SEO를 가르친 것이 아닙니다. <br />
                  <span className="text-sky-600">2018년부터 SEO를 실제 사업에 사용해 왔습니다.</span>
                </h2>
              </div>

              <div className="p-3.5 rounded-xl bg-sky-50/80 border border-sky-200">
                <div className="text-xs font-bold text-sky-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                  단순히 강의를 시청하는 방식이 아닙니다
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-900 [word-break:keep-all]">
                  실제 SEO 실무자와 1:1로 만나 <br className="sm:hidden" />
                  <span className="text-sky-800 font-extrabold">내 사이트와 내 사업을 기준으로 함께 진행합니다.</span>
                </p>
              </div>

              {/* Concise Narrative */}
              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-2 [word-break:keep-all]">
                <p>
                  SEO SYSTEM 300은 여러 명을 대상으로 동일한 내용을 전달하는 단체강의가 아닙니다.
                </p>
                <p className="text-slate-700 font-medium">
                  수강생마다 <strong>업종, 홈페이지, 목표 키워드, 경쟁환경, SEO 경험, 사업목적</strong>이 모두 다르기 때문에, 
                  각 수강생의 실제 프로젝트를 중심으로 <strong className="text-sky-700 font-bold">1:1 맞춤 실전교육</strong>을 진행합니다.
                </p>
                <p>
                  2018년부터 웹사이트를 직접 만들고, 키워드를 분석하고, 콘텐츠와 백링크, 트래픽을 검증해온 실무자가 
                  필요했던 시스템과 실행 노하우를 수강생의 화면을 함께 보며 1:1로 전수합니다.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* 3 Numeric Trust UI Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto mb-12">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
            <div className="text-lg sm:text-2xl font-black text-sky-600 font-mono">
              2018
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5 [word-break:keep-all]">
              SEO 실전 시작
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 hidden sm:block">
              이론이 아닌 직접 실전 구축
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
            <div className="text-lg sm:text-2xl font-black text-sky-600 font-mono">
              1:1 ONLY
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5 [word-break:keep-all]">
              1:1 개인 실전지도
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 hidden sm:block">
              내 사업/프로젝트 맞춤 교육
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
            <div className="text-lg sm:text-2xl font-black text-emerald-600 font-mono">
              NOW
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5 [word-break:keep-all]">
              현재도 직접 운영
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 hidden sm:block">
              실제 수익 사업에 적용 중
            </p>
          </div>
        </div>

        {/* Compressed 2018-2026 Timeline */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="text-center mb-6">
            <span className="text-[11px] font-mono font-bold tracking-widest text-sky-600 uppercase">
              // EVOLUTION TIMELINE (2018 → 2026)
            </span>
            <h3 className="text-base sm:text-xl font-black text-slate-900 mt-0.5 [word-break:keep-all]">
              오랜 시행착오 → 노하우 축적 → 자동화 → 자체 시스템 개발
            </h3>
          </div>

          {/* Compressed Horizontal/Card Timeline Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
            {TIMELINE_DATA.map((item, idx) => (
              <div
                key={item.year}
                className="bg-white border border-slate-200 hover:border-sky-300 rounded-xl p-3.5 shadow-2xs transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-black text-sky-600 font-mono text-sm">
                      {item.year}
                    </span>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                      STEP {idx + 1}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug [word-break:keep-all]">
                    {item.title}
                  </h4>
                </div>
                <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-tight [word-break:keep-all]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Key Positioning Highlight Box in Sleek Slate-900 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="max-w-4xl mx-auto rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-7 text-center text-white shadow-xl relative overflow-hidden"
        >
          <div className="flex items-center justify-center gap-1.5 text-sky-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Award className="w-3.5 h-3.5 text-sky-400" />
            <span>실무자 핵심 포지셔닝</span>
          </div>

          <p className="text-base sm:text-2xl font-black text-white leading-snug tracking-tight mb-3 [word-break:keep-all]">
            “방법만 알려주는 강사가 아닙니다. <br className="hidden sm:inline" />
            제가 실제로 필요한 도구를 직접 만들어 사용하고 있는 SEO 실무자입니다.”
          </p>

          <div className="inline-block px-3.5 py-1 rounded-lg bg-sky-950 border border-sky-800/80 text-xs font-bold text-sky-300">
            수강생의 실제 사업과 프로젝트를 화면으로 직접 보며 1:1로 지도합니다
          </div>
        </motion.div>

      </div>
    </section>
  );
};
