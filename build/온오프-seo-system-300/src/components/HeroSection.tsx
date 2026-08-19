import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Play, MessageSquare, CheckCircle2, Sparkles, Layers, ShieldCheck, ArrowRight, ExternalLink, Video, Calendar, Laptop } from 'lucide-react';
import { HERO_BENEFITS, SEO_SYSTEM_VIDEO_ID } from '../data/landingData';
import { KakaoCta } from './KakaoCta';

export const HeroSection: React.FC = () => {
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const youtubeVideoId = SEO_SYSTEM_VIDEO_ID.trim();

  return (
    <section id="hero" className="relative pt-24 pb-14 lg:pt-32 lg:pb-20 bg-white border-b border-slate-200 overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sky-50 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-50 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Badges & Program Title */}
        <div className="text-center max-w-4xl mx-auto mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex flex-wrap items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs sm:text-sm font-bold tracking-wider mb-4 shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-600 shrink-0" />
            <span className="uppercase">ONOFF MARKETING</span>
            <span className="w-1 h-1 rounded-full bg-sky-400"></span>
            <span className="hidden sm:inline text-slate-700 font-semibold">상위노출 시스템 구축 프로그램</span>
            <span className="sm:hidden text-slate-700 font-semibold">상위노출 시스템</span>
            <span className="w-1 h-1 rounded-full bg-sky-400"></span>
            <span className="px-2 py-0.2 rounded-full bg-sky-600 text-white text-[10px] font-bold">
              <span className="sm:hidden">1:1 MEET</span>
              <span className="hidden sm:inline">1:1 GOOGLE MEET</span>
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-3"
          >
            <h2 className="text-xs sm:text-sm font-bold tracking-widest text-sky-600 uppercase">
              SEO SYSTEM 300 · 1:1 PRIVATE COACHING
            </h2>
            
            {/* Main Headline with keep-all to prevent awkward breaks */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.2] sm:leading-[1.15] [word-break:keep-all]">
              SEO를 배우기만 하는 <br className="hidden sm:inline" />
              <span className="text-sky-600">강의는 끝났습니다.</span>
            </h1>

            <p className="text-base sm:text-2xl font-bold text-slate-700 tracking-tight pt-1 [word-break:keep-all]">
              도메인부터 홈페이지, 콘텐츠, 백링크, 트래픽까지 <br className="hidden sm:inline" />
              상위노출에 필요한 <span className="text-sky-600 font-extrabold">실행환경</span>을 만들어드립니다.
            </p>
          </motion.div>

          {/* 5-Second Recognition Key Value Box */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mt-5 max-w-2xl mx-auto p-3.5 sm:p-4 rounded-2xl bg-sky-50/90 border border-sky-200 text-center shadow-2xs"
          >
            <div className="text-[11px] font-bold text-sky-700 uppercase tracking-wider mb-1">
              300만원 올인원 실전 구축 구성
            </div>
            <p className="text-xs sm:text-base font-black text-slate-900 [word-break:keep-all]">
              맞춤 홈페이지 제작 · 실행비용 200만원 · <span className="text-sky-700 underline decoration-sky-400">1:1 Google Meet 실전교육</span> · SEO 자동화 시스템
            </p>
          </motion.div>

          {/* Mobile Key Benefit Strip (1:1 Google Meet · 수강생 일정 맞춤 · 실제 사이트 실습) */}
          <div className="mt-3.5 grid grid-cols-2 sm:hidden gap-1.5 text-[11px] font-bold text-sky-800 max-w-sm mx-auto">
            <span className="px-2 py-1 rounded-lg bg-sky-100/90 border border-sky-200 flex items-center justify-center gap-1">
              <Video className="w-3 h-3 text-sky-600 shrink-0" />
              1:1 Google Meet
            </span>
            <span className="px-2 py-1 rounded-lg bg-sky-100/90 border border-sky-200 flex items-center justify-center gap-1 text-center [word-break:keep-all]">
              <Calendar className="w-3 h-3 text-sky-600 shrink-0" />
              수강생 일정 맞춤
            </span>
            <span className="col-span-2 px-2 py-1 rounded-lg bg-sky-100/90 border border-sky-200 flex items-center justify-center gap-1">
              <Laptop className="w-3 h-3 text-sky-600 shrink-0" />
              실제 사이트 실습
            </span>
          </div>

          {/* Narrative Body Copy */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-xs sm:text-sm text-slate-600 max-w-3xl mx-auto leading-relaxed [word-break:keep-all]"
          >
            녹화영상만 제공하는 단체 강의가 아닙니다. 2018년부터 현업에서 직접 비즈니스를 운영해온 실무자가 수강생과{' '}
            <strong className="text-slate-900 font-bold">1:1 Google Meet으로 만나 수강생 일정에 맞춰</strong>{' '}
            낙장도메인 선정부터 홈페이지 제작, 콘텐츠, 백링크, 트래픽 시스템 전체를 직접 구축해 드립니다.
          </motion.p>
        </div>

        {/* Video & Key Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center max-w-6xl mx-auto">
          
          {/* Left / Center 16:9 Video Area */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-7 flex flex-col"
          >
            <div className="mb-2 text-center lg:text-left flex items-center justify-center lg:justify-start gap-2 text-xs font-bold text-sky-700">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
              </span>
              <span className="[word-break:keep-all]">먼저 3분만 투자해서 이 프로그램이 기존 SEO 강의와 무엇이 다른지 확인해보세요.</span>
            </div>

            {/* 16:9 Video Container */}
            <div
              id="hero-video-container"
              className="relative w-full aspect-video rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden group"
            >
              {isPlayingVideo && youtubeVideoId ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${youtubeVideoId}?autoplay=1&rel=0`}
                  title="SEO SYSTEM 300 Program Video"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center bg-radial from-slate-800 via-slate-900 to-slate-950">
                  {/* Subtle Grid overlay */}
                  <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
                  
                  {/* Top Bar for SaaS Mockup look */}
                  <div className="absolute top-0 inset-x-0 h-8 sm:h-9 bg-slate-950/80 border-b border-slate-800 px-4 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                      <span className="ml-2 font-mono text-slate-400 hidden sm:inline">SEO_SYSTEM_300_PREVIEW.mp4</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-sky-950 text-sky-400 font-bold border border-sky-800/60">
                      1:1 GOOGLE MEET PREVIEW
                    </span>
                  </div>

                  {/* Center Play Button */}
                  <button
                    id="hero-play-video-btn"
                    onClick={() => {
                      if (youtubeVideoId) {
                        setIsPlayingVideo(true);
                      }
                    }}
                    className="relative z-10 w-14 h-14 sm:w-18 sm:h-18 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center shadow-lg group-hover:scale-105 group-hover:bg-white/30 transition-all duration-300 active:scale-95"
                    aria-label="Play video introduction"
                  >
                    <Play className="w-6 h-6 sm:w-8 sm:h-8 fill-white ml-1 text-white" />
                  </button>

                  <div className="relative z-10 mt-3 space-y-1">
                    <p className="font-extrabold text-white text-sm sm:text-base [word-break:keep-all]">
                      SEO SYSTEM 300 핵심 구조 프리뷰
                    </p>
                    <p className="text-xs text-slate-300 [word-break:keep-all]">
                      도메인 · 홈페이지 · 백링크 · 트래픽 &amp; 1:1 수업 방식 한눈에 보기
                    </p>
                  </div>

                  <div className="absolute bottom-2.5 text-[10px] sm:text-[11px] text-slate-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                    <span>실제 제작 시스템 &amp; 1:1 맞춤 지도 프로세스 공개</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Column: 5 Core Benefits + Pricing & CTA */}
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="lg:col-span-5 flex flex-col justify-between space-y-4"
          >
            {/* 5 Benefit Badges Grid */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-200">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-sky-600" />
                  핵심 5대 혜택 구성
                </span>
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
                  총 200만원 실행비용 포함
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="grid grid-cols-2 gap-1.5">
                  {HERO_BENEFITS.slice(0, 4).map((b) => (
                    <div
                      key={b.id}
                      className="p-2 sm:p-2.5 rounded-xl bg-white border border-slate-200 flex flex-col justify-center shadow-2xs"
                    >
                      <div className="flex items-center gap-1 text-sky-700 text-xs font-bold mb-0.5">
                        <CheckCircle2 className="w-3 h-3 text-sky-600 shrink-0" />
                        <span className="[word-break:keep-all] leading-snug">{b.title}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 [word-break:keep-all] leading-snug">{b.subtitle}</span>
                    </div>
                  ))}
                </div>

                {/* 5th Benefit Highlight: 1:1 Google Meet Private Class */}
                <div className="p-2.5 rounded-xl bg-sky-100/90 border border-sky-300 flex flex-col min-[400px]:flex-row min-[400px]:items-center min-[400px]:justify-between gap-2 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-sky-600 text-white flex items-center justify-center shrink-0">
                      <Video className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-sky-900">
                        1:1 Google Meet 실전교육
                      </div>
                      <div className="text-[10px] text-sky-700 font-medium">
                        정해진 단체수업 X · 수강생 일정 맞춰 1:1 진행
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-sky-800 border border-sky-200 shrink-0">
                    개인 밀착 코칭
                  </span>
                </div>
              </div>

              <div className="mt-3 p-2 rounded-xl bg-sky-50 border border-sky-200 text-center">
                <p className="text-[11px] text-slate-600">녹화 강의만 파는 방식이 아닙니다.</p>
                <p className="text-xs font-black text-sky-800 mt-0.5">
                  1:1 실무 지도 + 200만원 실행비용 + 맞춤 사이트 제작 포함
                </p>
              </div>
            </div>

            {/* Price Card in Sleek Dark Slate-900 */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-xl relative overflow-hidden">
              <div className="flex items-baseline justify-between gap-1 mb-1.5">
                <span className="text-xs font-bold text-slate-400 tracking-wider">
                  프로그램 참가비 (1:1 개인지도 포함)
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                    3,000,000
                  </span>
                  <span className="text-base font-bold text-slate-300">원</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 font-medium mb-3 [word-break:keep-all]">
                녹화강의만 제공하는 프로그램이 아닙니다.
                <span className="block mt-0.5 text-sky-400 font-bold">
                  1:1 Google Meet 교육 + 홈페이지 + 200만 실행비용 모두 포함
                </span>
              </p>

              {/* Main CTA in Yellow Pill */}
              <KakaoCta
                id="hero-main-kakao-cta"
                location="hero"
                className="w-full py-3.5 px-6 rounded-full bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] transition-all group min-h-[52px]"
              >
                <MessageSquare className="w-4 h-4 fill-slate-900 shrink-0" />
                <span className="[word-break:keep-all]">카카오톡으로 1:1 프로그램 상담하기</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
              </KakaoCta>

              <p className="text-[11px] text-center text-slate-400 mt-2 flex items-center justify-center gap-1">
                <span>상담 후 가능한 일정과 프로그램 진행방식을 안내드립니다.</span>
                <ExternalLink className="w-3 h-3" />
              </p>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
