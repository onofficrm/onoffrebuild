import React from 'react';
import { MessageSquare, ArrowRight } from 'lucide-react';
import { KakaoCta } from './KakaoCta';

export const StickyFloatingCta: React.FC = () => {
  return (
    <>
      {/* Desktop Floating Kakao Action Button (Bottom Right) */}
      <div className="hidden lg:block fixed bottom-8 right-8 z-40">
        <KakaoCta
          id="desktop-floating-kakao-btn"
          location="floating"
          className="flex items-center gap-3 px-6 py-3.5 rounded-full bg-yellow-400 text-slate-900 font-black text-sm shadow-xl hover:bg-yellow-300 transition-all hover:scale-105 active:scale-95 group border border-yellow-300/80 min-h-[52px]"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 fill-slate-900" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-sky-500 ring-2 ring-white"></span>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] text-slate-700 font-semibold leading-none">1:1 빠른 상담</span>
            <span className="leading-tight [word-break:keep-all]">카카오톡 문의하기</span>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-900 group-hover:translate-x-1 transition-transform" />
        </KakaoCta>
      </div>

      {/* Mobile Sticky Bottom Floating Bar (Ensures min-height 52px & clear padding) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-2.5 shadow-lg">
        <div className="flex items-center gap-2 max-w-md mx-auto">
          <div className="flex flex-col pl-2">
            <span className="text-[10px] font-bold text-sky-600">SEO SYSTEM 300</span>
            <span className="text-xs font-black text-slate-900 font-mono">300만원</span>
          </div>
          <KakaoCta
            id="mobile-sticky-kakao-btn"
            location="mobile-sticky"
            className="flex-1 py-3 px-4 rounded-full bg-yellow-400 text-slate-900 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all min-h-[48px]"
          >
            <MessageSquare className="w-4 h-4 fill-slate-900 shrink-0" />
            <span className="[word-break:keep-all]">카카오톡 상담하기</span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          </KakaoCta>
        </div>
      </div>
    </>
  );
};
