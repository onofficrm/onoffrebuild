import React from 'react';
import { motion } from 'motion/react';
import { MessageSquare, ArrowRight, ShieldCheck, CheckCircle2, Video } from 'lucide-react';
import { KakaoCta } from './KakaoCta';

export const FinalCtaSection: React.FC = () => {
  return (
    <section id="final-cta" className="py-16 lg:py-24 bg-slate-900 text-white relative overflow-hidden border-t border-slate-800">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
        
        {/* Top Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-950 border border-sky-800/80 text-sky-300 text-xs sm:text-sm font-bold tracking-wider">
          <Video className="w-3.5 h-3.5 text-sky-400" />
          <span>1:1 PRIVATE SEO PROGRAM</span>
        </div>

        {/* Big Headline */}
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-snug [word-break:keep-all]">
            지금 필요한 것은 또 하나의 SEO 강의가 아닙니다. <br />
            <span className="text-sky-400">
              실제로 실행할 수 있는 SEO 시스템입니다.
            </span>
          </h2>

          <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed pt-1 [word-break:keep-all]">
            <strong className="text-sky-300 font-bold">내 일정에 맞춰 Google Meet으로 1:1 진행</strong>되며,
            200만원 상당의 실제 실행비용과 맞춤 홈페이지까지 모두 포함된 올인원 환경에서 상위노출을 직접 구축하세요.
          </p>
        </div>

        {/* 5 Inclusions Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 max-w-3xl mx-auto text-xs">
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center gap-1.5 text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="[word-break:keep-all]">맞춤 홈페이지 제작</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center gap-1.5 text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="[word-break:keep-all]">도메인 30만 지원</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center gap-1.5 text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="[word-break:keep-all]">백링크 70만 지원</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center gap-1.5 text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="[word-break:keep-all]">트래픽 100만 지원</span>
          </div>
          <div className="p-2.5 rounded-xl bg-sky-950 border border-sky-800 text-sky-300 flex items-center justify-center gap-1.5 col-span-2 sm:col-span-1 font-bold">
            <Video className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="[word-break:keep-all]">1:1 Meet 실전교육</span>
          </div>
        </div>

        {/* CTA Button in Bright Yellow Pill */}
        <div className="pt-2 max-w-md mx-auto">
          <KakaoCta
            id="final-kakao-cta-btn"
            location="final"
            className="w-full py-4 px-6 rounded-full bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg hover:shadow-yellow-400/20 active:scale-[0.99] transition-all group min-h-[52px]"
          >
            <MessageSquare className="w-5 h-5 fill-slate-900 shrink-0" />
            <span className="[word-break:keep-all]">카카오톡으로 SEO SYSTEM 300 상담하기</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
          </KakaoCta>

          <p className="text-[11px] text-slate-400 mt-2.5">
            상담 후 가능한 일정과 프로그램 진행방식을 안내드립니다.
          </p>
        </div>

      </div>
    </section>
  );
};
