import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, ChevronDown, Menu, X } from 'lucide-react';
import {
  COMMUNITY_URL,
  CORE_FEATURE_NAV_ITEMS,
  FEATURES_OVERVIEW_PATH,
  SERVICE_NAV_ITEMS,
} from '../../data/navigation';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { HeaderAuthLinks } from './HeaderAuthLinks';
import { BrandLogo } from './BrandLogo';

type DesktopMenuKey = 'features' | 'services' | null;
type MobileAccordionKey = 'features' | 'services' | null;

export function Header() {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState<DesktopMenuKey>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isFeatureActive =
    location.pathname === FEATURES_OVERVIEW_PATH ||
    location.pathname.startsWith(`${FEATURES_OVERVIEW_PATH}/`);
  const isServiceActive = SERVICE_NAV_ITEMS.some((item) => item.path === location.pathname);

  const [mobileAccordion, setMobileAccordion] = useState<MobileAccordionKey>(() => {
    if (isFeatureActive) return 'features';
    if (isServiceActive) return 'services';
    return null;
  });

  const featuresDropdownRef = useRef<HTMLDivElement>(null);
  const servicesDropdownRef = useRef<HTMLDivElement>(null);

  const automationFeatures = CORE_FEATURE_NAV_ITEMS.filter((item) => item.group === 'automation');
  const editingAiFeatures = CORE_FEATURE_NAV_ITEMS.filter((item) => item.group === 'editing_ai');
  const baseServices = SERVICE_NAV_ITEMS.filter((item) => item.group === 'core');
  const separateServices = SERVICE_NAV_ITEMS.filter((item) => item.group === 'extension');

  useEffect(() => {
    setOpenMenu(null);
    setMobileMenuOpen(false);
    if (
      location.pathname === FEATURES_OVERVIEW_PATH ||
      location.pathname.startsWith(`${FEATURES_OVERVIEW_PATH}/`)
    ) {
      setMobileAccordion('features');
    } else if (SERVICE_NAV_ITEMS.some((item) => item.path === location.pathname)) {
      setMobileAccordion('services');
    } else {
      setMobileAccordion(null);
    }
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const inFeatures = featuresDropdownRef.current?.contains(target);
      const inServices = servicesDropdownRef.current?.contains(target);
      if (!inFeatures && !inServices) {
        setOpenMenu(null);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpenMenu(null);
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  function toggleMobileAccordion(key: Exclude<MobileAccordionKey, null>) {
    setMobileAccordion((prev) => (prev === key ? null : key));
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-sm shadow-slate-900/5">
      <Container>
        <div className="flex h-[68px] items-center justify-between gap-4 lg:gap-6">
          {/* Zone 1: Brand Wordmark */}
          <Link
            to="/"
            className="inline-flex shrink-0 items-center transition-opacity duration-150 hover:opacity-85"
            aria-label="ONOFF Builder 홈"
          >
            <BrandLogo variant="light" size="md" />
          </Link>

          {/* Zone 2: Desktop Navigation (빌더 소개 | 기본 기능 | 활용사례 | 제작사례 | 서비스 | 요금안내 | 커뮤니티) */}
          <nav
            aria-label="주 메뉴"
            className="hidden lg:flex items-center gap-5 xl:gap-7 text-[14px] xl:text-[15px] font-medium text-slate-600"
          >
            <Link
              to="/"
              aria-current={location.pathname === '/' ? 'page' : undefined}
              className={`py-2 whitespace-nowrap shrink-0 transition-colors duration-150 ${
                location.pathname === '/'
                  ? 'text-blue-600 font-semibold'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              빌더 소개
            </Link>

            {/* 기본 기능 Dropdown */}
            <div
              ref={featuresDropdownRef}
              className="relative"
              onMouseEnter={() => setOpenMenu('features')}
              onMouseLeave={() => setOpenMenu((prev) => (prev === 'features' ? null : prev))}
              onBlur={(e) => {
                if (
                  featuresDropdownRef.current &&
                  !featuresDropdownRef.current.contains(e.relatedTarget as Node | null)
                ) {
                  setOpenMenu((prev) => (prev === 'features' ? null : prev));
                }
              }}
            >
              <button
                type="button"
                aria-expanded={openMenu === 'features'}
                aria-haspopup="true"
                aria-controls="desktop-features-menu"
                onClick={() => setOpenMenu((prev) => (prev === 'features' ? null : 'features'))}
                className={`inline-flex items-center gap-1 py-2 whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer ${
                  isFeatureActive || openMenu === 'features'
                    ? 'text-blue-600 font-semibold'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                <span>기본 기능</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-150 ${
                    openMenu === 'features'
                      ? 'rotate-180 text-blue-600'
                      : isFeatureActive
                        ? 'text-blue-600'
                        : 'text-slate-500'
                  }`}
                  aria-hidden="true"
                />
              </button>

              {openMenu === 'features' && (
                <div id="desktop-features-menu" className="absolute left-0 top-full pt-2">
                  <div className="w-[min(560px,calc(100vw-2rem))] rounded-xl border border-slate-200 bg-white p-6 shadow-[0_12px_32px_rgba(16,24,40,0.08)]">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3.5">
                      <div>
                        <p className="text-[12px] font-semibold text-blue-600">
                          ONOFF Builder 핵심 기능
                        </p>
                        <p className="mt-0.5 text-[12px] text-slate-500">
                          운영 자동화 · 자동 댓글 · 쉬운 수정 · AI 기능 개발
                        </p>
                      </div>
                      <Link
                        to={FEATURES_OVERVIEW_PATH}
                        aria-current={
                          location.pathname === FEATURES_OVERVIEW_PATH ? 'page' : undefined
                        }
                        className="inline-flex items-center gap-1 text-[13px] font-semibold text-blue-600 hover:text-blue-700 whitespace-nowrap shrink-0"
                      >
                        <span>전체 보기</span>
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </Link>
                    </div>

                    <div className="mt-4 grid grid-cols-12 gap-5">
                      {/* 3대 자동화 도구 · 자동 댓글 */}
                      <div className="col-span-6 border-r border-slate-200 pr-5">
                        <p className="text-[12px] font-semibold text-slate-500">운영 자동화</p>
                        <div className="mt-2.5 space-y-1">
                          {automationFeatures.map((item) => {
                            const active = location.pathname === item.path;
                            return (
                              <Link
                                key={item.slug}
                                to={item.path}
                                aria-current={active ? 'page' : undefined}
                                className={`block rounded-lg px-3 py-2.5 transition-colors duration-150 ${
                                  active
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'hover:bg-slate-50 text-slate-950'
                                }`}
                              >
                                <p className="text-[14px] font-semibold leading-snug">
                                  {item.label}
                                </p>
                                <p className="mt-0.5 text-[12px] leading-[1.45] text-slate-500">
                                  {item.subtitle}
                                </p>
                              </Link>
                            );
                          })}
                        </div>
                      </div>

                      {/* 쉬운 수정 · AI 기능 개발 */}
                      <div className="col-span-6">
                        <p className="text-[12px] font-semibold text-slate-500">
                          수정 · 맞춤 개발
                        </p>
                        <div className="mt-2.5 space-y-1">
                          {editingAiFeatures.map((item) => {
                            const active = location.pathname === item.path;
                            return (
                              <Link
                                key={item.slug}
                                to={item.path}
                                aria-current={active ? 'page' : undefined}
                                className={`block rounded-lg px-3 py-2.5 transition-colors duration-150 ${
                                  active
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'hover:bg-slate-50 text-slate-950'
                                }`}
                              >
                                <p className="text-[14px] font-semibold leading-snug">
                                  {item.label}
                                </p>
                                <p className="mt-0.5 text-[12px] leading-[1.45] text-slate-500">
                                  {item.subtitle}
                                </p>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/use-cases"
              aria-current={location.pathname === '/use-cases' ? 'page' : undefined}
              className={`py-2 whitespace-nowrap shrink-0 transition-colors duration-150 ${
                location.pathname === '/use-cases'
                  ? 'text-blue-600 font-semibold'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              활용사례
            </Link>

            <Link
              to="/portfolio"
              aria-current={location.pathname === '/portfolio' ? 'page' : undefined}
              className={`py-2 whitespace-nowrap shrink-0 transition-colors duration-150 ${
                location.pathname === '/portfolio'
                  ? 'text-blue-600 font-semibold'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              제작사례
            </Link>

            {/* 서비스 Dropdown (홈페이지 제작·운영 + 별도 전문 서비스) */}
            <div
              ref={servicesDropdownRef}
              className="relative"
              onMouseEnter={() => setOpenMenu('services')}
              onMouseLeave={() => setOpenMenu((prev) => (prev === 'services' ? null : prev))}
              onBlur={(e) => {
                if (
                  servicesDropdownRef.current &&
                  !servicesDropdownRef.current.contains(e.relatedTarget as Node | null)
                ) {
                  setOpenMenu((prev) => (prev === 'services' ? null : prev));
                }
              }}
            >
              <button
                type="button"
                aria-expanded={openMenu === 'services'}
                aria-haspopup="true"
                aria-controls="desktop-services-menu"
                onClick={() => setOpenMenu((prev) => (prev === 'services' ? null : 'services'))}
                className={`inline-flex items-center gap-1 py-2 whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer ${
                  isServiceActive || openMenu === 'services'
                    ? 'text-blue-600 font-semibold'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                <span>서비스</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-150 ${
                    openMenu === 'services'
                      ? 'rotate-180 text-blue-600'
                      : isServiceActive
                        ? 'text-blue-600'
                        : 'text-slate-500'
                  }`}
                  aria-hidden="true"
                />
              </button>

              {openMenu === 'services' && (
                <div
                  id="desktop-services-menu"
                  className="absolute right-0 xl:left-1/2 xl:right-auto xl:-translate-x-1/2 top-full pt-2"
                >
                  <div className="w-[min(620px,calc(100vw-2rem))] rounded-xl border border-slate-200 bg-white p-6 shadow-[0_12px_32px_rgba(16,24,40,0.08)]">
                    <div className="grid grid-cols-12 gap-6">
                      {/* 홈페이지 제작·운영 */}
                      <div className="col-span-5 border-r border-slate-200 pr-6">
                        <p className="text-[12px] font-semibold text-slate-500">
                          홈페이지 제작·운영
                        </p>
                        <div className="mt-3 space-y-1">
                          {baseServices.map((item) => {
                            const active = location.pathname === item.path;
                            return (
                              <Link
                                key={item.slug}
                                to={item.path}
                                aria-current={active ? 'page' : undefined}
                                className={`block rounded-lg px-3 py-2.5 transition-colors duration-150 ${
                                  active
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'hover:bg-slate-50 text-slate-950'
                                }`}
                              >
                                <p className="text-[14px] font-semibold leading-snug">
                                  {item.label}
                                </p>
                                <p className="mt-0.5 text-[12px] leading-[1.45] text-slate-500">
                                  {item.shortDesc}
                                </p>
                              </Link>
                            );
                          })}
                        </div>
                      </div>

                      {/* 별도 전문 서비스 */}
                      <div className="col-span-7">
                        <p className="text-[12px] font-semibold text-slate-500">
                          별도 전문 마케팅 서비스
                        </p>
                        <div className="mt-3 grid grid-cols-2 gap-1">
                          {separateServices.map((item) => {
                            const active = location.pathname === item.path;
                            return (
                              <Link
                                key={item.slug}
                                to={item.path}
                                aria-current={active ? 'page' : undefined}
                                className={`block rounded-lg px-3 py-2 transition-colors duration-150 ${
                                  active
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'hover:bg-slate-50 text-slate-950'
                                }`}
                              >
                                <p className="text-[14px] font-semibold leading-snug">
                                  {item.label}
                                </p>
                                <p className="mt-0.5 text-[12px] leading-[1.4] text-slate-500">
                                  {item.shortDesc}
                                </p>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/pricing"
              aria-current={location.pathname === '/pricing' ? 'page' : undefined}
              className={`py-2 whitespace-nowrap shrink-0 transition-colors duration-150 ${
                location.pathname === '/pricing'
                  ? 'text-blue-600 font-semibold'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              요금안내
            </Link>

            <a
              href={COMMUNITY_URL}
              className="py-2 text-slate-600 hover:text-slate-950 transition-colors duration-150 whitespace-nowrap shrink-0"
            >
              커뮤니티
            </a>
          </nav>

          {/* Zone 3: Single Primary Action & Mobile Drawer Trigger */}
          <div className="flex items-center gap-2 shrink-0">
            <HeaderAuthLinks layout="desktop" />
            <Button to="/contact" size="sm" className="hidden lg:inline-flex">
              상담하기
            </Button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-drawer"
              className="inline-flex lg:hidden h-11 w-11 items-center justify-center rounded-lg border border-slate-200 text-slate-950 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile & Tablet Navigation Drawer with Compact Accordions */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="lg:hidden fixed inset-x-0 top-[68px] bottom-0 z-50 overflow-y-auto bg-white border-t border-slate-200"
        >
          <Container className="py-5 pb-10">
            <nav aria-label="모바일 주 메뉴" className="divide-y divide-[#EAECF0]">
              {/* 빌더 소개 */}
              <div className="py-1">
                <Link
                  to="/"
                  aria-current={location.pathname === '/' ? 'page' : undefined}
                  className={`flex min-h-[48px] items-center rounded-lg px-2 text-[16px] font-medium ${
                    location.pathname === '/'
                      ? 'text-blue-600 bg-blue-50 font-semibold'
                      : 'text-slate-950 hover:bg-slate-50'
                  }`}
                >
                  빌더 소개
                </Link>
              </div>

              {/* 기본 기능 Accordion */}
              <div className="py-1">
                <button
                  type="button"
                  aria-expanded={mobileAccordion === 'features'}
                  aria-controls="mobile-features-panel"
                  onClick={() => toggleMobileAccordion('features')}
                  className={`flex min-h-[48px] w-full items-center justify-between rounded-lg px-2 text-[16px] font-medium cursor-pointer ${
                    isFeatureActive ? 'text-blue-600 font-semibold' : 'text-slate-950'
                  }`}
                >
                  <span>기본 기능</span>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-500 transition-transform duration-150 ${
                      mobileAccordion === 'features' ? 'rotate-180 text-slate-950' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {mobileAccordion === 'features' && (
                  <div id="mobile-features-panel" className="pb-3 pt-1 space-y-3">
                    <Link
                      to={FEATURES_OVERVIEW_PATH}
                      aria-current={
                        location.pathname === FEATURES_OVERVIEW_PATH ? 'page' : undefined
                      }
                      className={`flex min-h-[44px] items-center justify-between rounded-lg border px-3 py-2 text-[14px] font-semibold transition-colors ${
                        location.pathname === FEATURES_OVERVIEW_PATH
                          ? 'border-[#2563EB]/30 bg-blue-50 text-blue-600'
                          : 'border-slate-200 bg-slate-50 text-slate-950'
                      }`}
                    >
                      <span>기본 기능 전체 보기</span>
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {CORE_FEATURE_NAV_ITEMS.map((item) => {
                        const active = location.pathname === item.path;
                        return (
                          <Link
                            key={item.slug}
                            to={item.path}
                            aria-current={active ? 'page' : undefined}
                            className={`min-h-[44px] rounded-lg px-3 py-2.5 transition-colors ${
                              active
                                ? 'bg-blue-50 text-blue-600'
                                : 'bg-slate-50 text-slate-950 hover:bg-[#F2F4F7]'
                            }`}
                          >
                            <p className="text-[14px] font-semibold">{item.label}</p>
                            <p className="mt-0.5 text-[12px] text-slate-500">{item.subtitle}</p>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* 활용사례 · 제작사례 */}
              <div className="py-1 space-y-0.5">
                <Link
                  to="/use-cases"
                  aria-current={location.pathname === '/use-cases' ? 'page' : undefined}
                  className={`flex min-h-[48px] items-center rounded-lg px-2 text-[16px] font-medium ${
                    location.pathname === '/use-cases'
                      ? 'text-blue-600 bg-blue-50 font-semibold'
                      : 'text-slate-950 hover:bg-slate-50'
                  }`}
                >
                  활용사례
                </Link>
                <Link
                  to="/portfolio"
                  aria-current={location.pathname === '/portfolio' ? 'page' : undefined}
                  className={`flex min-h-[48px] items-center rounded-lg px-2 text-[16px] font-medium ${
                    location.pathname === '/portfolio'
                      ? 'text-blue-600 bg-blue-50 font-semibold'
                      : 'text-slate-950 hover:bg-slate-50'
                  }`}
                >
                  제작사례
                </Link>
              </div>

              {/* 서비스 Accordion */}
              <div className="py-1">
                <button
                  type="button"
                  aria-expanded={mobileAccordion === 'services'}
                  aria-controls="mobile-services-panel"
                  onClick={() => toggleMobileAccordion('services')}
                  className={`flex min-h-[48px] w-full items-center justify-between rounded-lg px-2 text-[16px] font-medium cursor-pointer ${
                    isServiceActive ? 'text-blue-600 font-semibold' : 'text-slate-950'
                  }`}
                >
                  <span>서비스</span>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-500 transition-transform duration-150 ${
                      mobileAccordion === 'services' ? 'rotate-180 text-slate-950' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {mobileAccordion === 'services' && (
                  <div id="mobile-services-panel" className="pb-3 pt-1 space-y-3">
                    <div>
                      <p className="px-1 text-[12px] font-semibold text-slate-500">
                        홈페이지 제작·운영
                      </p>
                      <div className="mt-1.5 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {baseServices.map((item) => {
                          const active = location.pathname === item.path;
                          return (
                            <Link
                              key={item.slug}
                              to={item.path}
                              aria-current={active ? 'page' : undefined}
                              className={`min-h-[44px] rounded-lg px-3 py-2.5 transition-colors ${
                                active
                                  ? 'bg-blue-50 text-blue-600'
                                  : 'bg-slate-50 text-slate-950 hover:bg-[#F2F4F7]'
                              }`}
                            >
                              <p className="text-[14px] font-semibold">{item.label}</p>
                              <p className="mt-0.5 text-[12px] text-slate-500">{item.shortDesc}</p>
                            </Link>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <p className="px-1 text-[12px] font-semibold text-slate-500">
                        별도 전문 마케팅 서비스
                      </p>
                      <div className="mt-1.5 grid grid-cols-2 gap-1.5">
                        {separateServices.map((item) => {
                          const active = location.pathname === item.path;
                          return (
                            <Link
                              key={item.slug}
                              to={item.path}
                              aria-current={active ? 'page' : undefined}
                              className={`min-h-[44px] rounded-lg px-3 py-2.5 transition-colors ${
                                active
                                  ? 'bg-blue-50 text-blue-600'
                                  : 'bg-slate-50 text-slate-950 hover:bg-[#F2F4F7]'
                              }`}
                            >
                              <p className="text-[14px] font-semibold">{item.label}</p>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 요금안내 · 커뮤니티 */}
              <div className="py-1 space-y-0.5">
                <Link
                  to="/pricing"
                  aria-current={location.pathname === '/pricing' ? 'page' : undefined}
                  className={`flex min-h-[48px] items-center rounded-lg px-2 text-[16px] font-medium ${
                    location.pathname === '/pricing'
                      ? 'text-blue-600 bg-blue-50 font-semibold'
                      : 'text-slate-950 hover:bg-slate-50'
                  }`}
                >
                  요금안내
                </Link>
                <a
                  href={COMMUNITY_URL}
                  className="flex min-h-[48px] items-center rounded-lg px-2 text-[16px] font-medium text-slate-950 hover:bg-slate-50"
                >
                  커뮤니티
                </a>
              </div>

              <HeaderAuthLinks layout="mobile" onNavigate={() => setMobileMenuOpen(false)} />

              <div className="pt-3">
                <Button to="/contact" size="lg" className="w-full">
                  상담하기
                </Button>
              </div>
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}
