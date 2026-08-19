import React, { useState, useEffect } from 'react';
import { MessageSquare, Menu, X, ChevronRight, ExternalLink } from 'lucide-react';
import { KakaoCta } from './KakaoCta';

export const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: '프로그램 소개', href: '#program' },
    { label: '실전 경험', href: '#trust' },
    { label: '5단계 로드맵', href: '#roadmap' },
    { label: '실제 시스템', href: '#systems' },
    { label: '1:1 수업방식', href: '#class-method' },
    { label: '혜택 & 가격', href: '#pricing' },
    { label: '추천대상', href: '#target' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-200 py-3 shadow-sm'
          : 'bg-white/80 backdrop-blur-sm border-b border-slate-200/60 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2">
        {/* Brand */}
        <a href="#hero" id="header-brand-logo" className="flex items-center gap-2 sm:gap-3 group min-w-0 flex-1 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center font-black text-white text-sm tracking-wider shadow-sm group-hover:bg-sky-500 transition-colors">
            ON
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold tracking-widest text-sky-600 uppercase">
              ONOFF MARKETING
            </span>
            <span className="text-sm sm:text-base font-black tracking-tight text-slate-900 flex items-center gap-1.5 truncate">
              SEO SYSTEM 300
              <span className="hidden sm:inline-block text-[10px] px-1.5 py-0.5 rounded bg-sky-50 text-sky-700 font-bold border border-sky-200">
                1:1 실전 구축
              </span>
            </span>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav id="desktop-nav-menu" className="hidden lg:flex items-center gap-5 text-sm font-medium text-slate-600">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-sky-600 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-sky-500 hover:after:w-full after:transition-all text-xs xl:text-sm"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <KakaoCta
            id="header-kakao-cta-btn"
            location="header"
            aria-label="카카오톡으로 1:1 상담하기"
            className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-5 py-2 sm:py-2.5 rounded-full bg-yellow-400 text-slate-900 font-bold text-xs sm:text-sm hover:bg-yellow-300 shadow-sm transition-all active:scale-95 shrink-0"
          >
            <MessageSquare className="w-4 h-4 fill-slate-900 shrink-0" />
            <span className="hidden sm:inline [word-break:keep-all]">1:1 상담하기</span>
            <ChevronRight className="w-3.5 h-3.5 hidden sm:inline" />
          </KakaoCta>

          {/* Mobile Menu Toggle */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-drawer-nav"
          className="lg:hidden bg-white border-b border-slate-200 px-5 py-4 space-y-2.5 shadow-lg animate-in slide-in-from-top-2"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-700 hover:text-sky-600 py-2 border-b border-slate-100"
            >
              {link.label}
            </a>
          ))}
          <KakaoCta
            location="header-mobile"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full mt-2 py-3 rounded-full bg-yellow-400 text-slate-900 font-bold text-center flex items-center justify-center gap-2 shadow-sm min-h-[48px]"
          >
            <MessageSquare className="w-4 h-4 fill-slate-900" />
            <span>카카오톡으로 1:1 상담하기</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </KakaoCta>
        </div>
      )}
    </header>
  );
};
