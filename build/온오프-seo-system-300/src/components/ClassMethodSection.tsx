import React from 'react';
import { motion } from 'motion/react';
import { Video, CalendarCheck, MessageSquare, Laptop, CheckCircle2, ArrowRight } from 'lucide-react';
import { KakaoCta } from './KakaoCta';

export const ClassMethodSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: '카카오톡으로 일정 조율',
      desc: '수강생이 가능한 날짜와 편한 시간대를 1:1로 직접 협의하여 확정합니다.',
      icon: <CalendarCheck className="w-5 h-5 text-sky-600" />,
      badge: '수강생 맞춤 스케줄',
    },
    {
      step: '02',
      title: '1:1 Google Meet 수업',
      desc: '강사와 수강생이 Google Meet을 통해 직접 화면을 공유하며 밀착 진행합니다.',
      icon: <Video className="w-5 h-5 text-sky-600" />,
      badge: '실시간 양방향 코칭',
    },
    {
      step: '03',
      title: '내 실제 사이트에 바로 적용',
      desc: '단순 샘플 예제가 아니라 수강생 본인의 도메인과 맞춤 홈페이지에 즉시 구축합니다.',
      icon: <Laptop className="w-5 h-5 text-sky-600" />,
      badge: '내 프로젝트 실전 구축',
    },
  ];

  return (
    <section id="class-method" className="py-16 lg:py-20 bg-slate-50 border-b border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs sm:text-sm font-bold tracking-wider mb-3"
          >
            <Video className="w-3.5 h-3.5 text-sky-600" />
            <span>HOW THE CLASS WORKS</span>
          </motion.div>

          <h2 className="text-sm sm:text-base font-bold text-slate-500 uppercase tracking-wider mb-1 [word-break:keep-all]">
            정해진 시간에 맞춰 듣는 단체강의가 아닙니다.
          </h2>

          <h3 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-snug [word-break:keep-all]">
            내 일정에 맞춰 진행하는 <br />
            <span className="text-sky-600">1:1 Google Meet 실전교육입니다.</span>
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 mt-2.5 max-w-xl mx-auto [word-break:keep-all]">
            수강생이 가능한 시간대를 기준으로 일정을 조율하고, Google Meet을 통해 강사와 직접 만나 수업을 진행합니다.
          </p>
        </div>

        {/* 3-Step Process Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto mb-8">
          {steps.map((item, idx) => (
            <div
              key={item.step}
              className="bg-white border border-slate-200 hover:border-sky-300 rounded-2xl p-5 sm:p-6 shadow-2xs transition-all relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 font-mono font-black text-sm flex items-center justify-center">
                    {item.step}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold">
                    {item.badge}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-lg bg-sky-50 text-sky-600">
                    {item.icon}
                  </div>
                  <h4 className="text-base sm:text-lg font-black text-slate-900 [word-break:keep-all]">
                    {item.title}
                  </h4>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed [word-break:keep-all]">
                  {item.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-sky-700 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span>1:1 전담 실무 가이드</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Highlight Box in Sleek Slate-900 */}
        <div className="max-w-4xl mx-auto rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-7 text-center text-white shadow-xl">
          <div className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-1.5">
            REAL 1:1 INTERACTIVE COACHING
          </div>

          <h4 className="text-base sm:text-xl font-black text-white mb-2 [word-break:keep-all]">
            녹화강의만 보고 혼자 따라 하는 교육이 아닙니다.
          </h4>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed [word-break:keep-all]">
            궁금한 것을 직접 질문하고, 내 사이트를 함께 보면서, 실제로 작업하면서 배우는{' '}
            <strong className="text-sky-400 font-bold">1:1 실전교육</strong>입니다.
          </p>

          <div className="mt-4 inline-flex items-center gap-2">
            <KakaoCta
              location="class-method"
              className="px-5 py-2.5 rounded-full bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-slate-900" />
              <span>1:1 수업 일정 상담하기</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </KakaoCta>
          </div>
        </div>

      </div>
    </section>
  );
};
