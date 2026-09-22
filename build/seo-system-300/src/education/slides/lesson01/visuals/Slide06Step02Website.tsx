import React from 'react';
import { Layout, CheckCircle, Zap, Smartphone, Monitor, ArrowRight, Gauge, MousePointerClick } from 'lucide-react';

export const Slide06Step02Website: React.FC = () => {
  return (
    <div className="w-full h-full p-8 md:p-12 flex flex-col justify-between relative overflow-hidden select-none bg-[#07111F]">
      {/* Background Blue Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-sky-900/15 rounded-full blur-[120px]" />
      </div>

      {/* Top Header Tag */}
      <div className="relative z-10 flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl sm:text-4xl font-black font-mono text-sky-400 tracking-tighter">
            02
          </span>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-sky-400 font-bold">
              PHASE 01 · INFRASTRUCTURE BASE
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              STEP 02 · 홈페이지 제작 (Responsive Conversion Site)
            </h2>
          </div>
        </div>
        <div className="px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-mono font-bold">
          TOOL: 온오프빌더 (SEO 표준 빌더)
        </div>
      </div>

      {/* Main Content: Layout E (Responsive Multi-Device Website Mockup) */}
      <div className="relative z-10 my-auto py-2 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Core Principles (5 cols) */}
        <div className="lg:col-span-5 space-y-3.5">
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-sky-900/40">
            <span className="text-[10px] font-mono text-sky-400 font-bold uppercase tracking-wider block mb-1">
              CONVERSION ARCHITECTURE
            </span>
            <p className="text-lg sm:text-xl font-black text-white leading-snug">
              “검색되는 사이트가 아니라,<br />
              <span className="text-sky-400">성과가 나는 사이트</span>를 만든다.”
            </p>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              화려하기만 한 사이트는 검색엔진이 읽지 못하고 이탈만 유발합니다. <strong className="text-white">검색엔진 친화적 구조(Silo)와 직관적인 고객 전환 경로(CTA)</strong>가 결합되어야 합니다.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800">
              <span className="text-sky-400 font-bold block flex items-center gap-1.5">
                <Layout className="w-3.5 h-3.5" /> 01 구조 최적화
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">
                시맨틱 태그 (H1~H3) & 논리적 사일로 URL
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800">
              <span className="text-sky-400 font-bold block flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5" /> 02 속도 90+ 점
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Core Web Vitals 모바일 초고속 로딩
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800">
              <span className="text-sky-400 font-bold block flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5" /> 03 모바일 반응형
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">
                모바일 레이아웃 최적화 목표
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800">
              <span className="text-sky-400 font-bold block flex items-center gap-1.5">
                <MousePointerClick className="w-3.5 h-3.5" /> 04 전환 동선
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">
                1초 만에 이해되는 가치 제안 & 문의 버튼
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Multi-Device Responsive Mockup (Desktop + Tablet + Mobile) (7 cols) */}
        <div className="lg:col-span-7">
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/90 border border-sky-900/40 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs font-mono">
              <div className="flex items-center gap-2 text-slate-300 font-bold">
                <Monitor className="w-4 h-4 text-sky-400" />
                <span>CROSS-DEVICE CONVERSION ENGINE</span>
              </div>
              <span className="text-emerald-400 font-bold text-[11px]">CORE WEB VITALS: 98/100</span>
            </div>

            {/* Visual Overlapping Device Mockup */}
            <div className="relative flex items-center justify-center p-2">
              {/* Desktop Browser Window Frame */}
              <div className="w-full max-w-[460px] rounded-xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
                {/* Browser top nav */}
                <div className="px-3 py-1.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500/80" />
                    <span className="w-2 h-2 rounded-full bg-amber-500/80" />
                    <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
                    <span className="ml-2 px-2 py-0.5 rounded bg-slate-900 text-slate-300">
                      https://my-brand.com
                    </span>
                  </div>
                  <span className="text-sky-400 font-bold">SSL 256-bit ✓</span>
                </div>

                {/* Mockup Landing Page Body */}
                <div className="p-4 space-y-3 bg-gradient-to-b from-slate-900 to-[#07111F]">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black tracking-wider text-white">ENTERPRISE SOLUTIONS</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500 text-slate-950 font-bold">
                      무료 상담 신청
                    </span>
                  </div>

                  {/* Headline & Subhead */}
                  <div className="space-y-1 py-1">
                    <div className="text-xs sm:text-sm font-black text-white leading-tight">
                      검색 친화·전환을 목표로 하는 아키텍처
                    </div>
                    <div className="text-[10px] text-slate-400">
                      신뢰 구조 기반 시맨틱 마크업과 1초 전환 퍼널로 완성합니다.
                    </div>
                  </div>

                  {/* Key feature pills */}
                  <div className="flex gap-2 text-[9px] font-mono">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-sky-300">Schema.org Org</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-300">Fast LCP 0.8s</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">GA4 Ready</span>
                  </div>
                </div>
              </div>

              {/* Mobile Phone Mockup Overlay */}
              <div className="absolute -bottom-2 -right-1 sm:right-4 w-32 sm:w-36 rounded-2xl bg-slate-950 border-2 border-sky-500/80 shadow-2xl p-2 hidden sm:block">
                <div className="w-8 h-1 rounded-full bg-slate-800 mx-auto mb-2" />
                <div className="p-2 rounded-lg bg-slate-900 text-center space-y-1.5 font-mono">
                  <span className="text-[9px] text-sky-400 font-bold block">MOBILE OPTIMIZED</span>
                  <div className="w-full h-1 bg-slate-800 rounded" />
                  <div className="w-3/4 h-1 bg-slate-800 rounded mx-auto" />
                  <span className="block text-[8px] p-1 rounded bg-sky-500/20 text-sky-300 font-bold">
                    CALL TO ACTION
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Deliverable Bar */}
            <div className="mt-3 p-2 rounded-xl bg-sky-950/30 border border-sky-900/40 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-300 font-mono">
                <strong className="text-sky-300">실습 미션:</strong> 온오프빌더로 검색 표준 전환 사이트 1개 개설
              </span>
              <ArrowRight className="w-4 h-4 text-sky-400 shrink-0" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-xs text-slate-500 font-mono flex items-center justify-between border-t border-slate-800/80 pt-3">
        <span>ONOFF MARKETING EDUCATION · 1강</span>
        <span>모바일에서 1초 만에 뜨고 즉시 문의할 수 있는 구조가 본질입니다.</span>
      </div>
    </div>
  );
};
