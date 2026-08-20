import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppNavLink } from '../lib/navLink';

const logoImg = '/img/logo/logo.png';

export interface SubMenuItem {
  name: string;
  path: string;
  desc?: string;
  badge?: string;
}

export interface MenuItem {
  title: string;
  path: string;
  items: SubMenuItem[];
}

type SiteBoot = {
  isMember?: boolean;
  mbId?: string;
  mbNick?: string;
  loginUrl?: string;
  registerUrl?: string;
  logoutUrl?: string;
  portalUrl?: string;
};

declare global {
  interface Window {
    __ONOFF_SITE__?: SiteBoot;
  }
}

const menuData: MenuItem[] = [
  { 
    title: '회사소개', 
    path: '/company', 
    items: [] 
  },
  { 
    title: '홈페이지제작', 
    path: '/request', 
    items: [
      { name: '홈페이지 제작 의뢰하기', path: '/request', desc: '맞춤형 고전환 웹사이트 제작 & SEO/AEO 구축' },
      { name: '직접 만들고 배포하기', path: '/diy', desc: '노코드/코딩으로 직접 제작하는 실전 가이드' },
      { name: '온오프빌더 요금 안내', path: '/pricing', desc: '합리적인 통합 솔루션 플랜별 요금 안내' },
      { name: '제작 사례', path: '/portfolio', desc: '다양한 업종별 포트폴리오 및 샘플 미리보기' }
    ] 
  },
  { 
    title: '서비스', 
    path: '/traffic', 
    items: [
      { name: '트래픽', path: '/traffic', desc: '검색 노출 활성화 및 타겟 오가닉 유입 서비스' },
      { name: '블로그포스팅', path: '/blog', desc: '네이버·구글 키워드 맞춤형 전문 블로그 대행' },
      { name: '카페포스팅', path: '/cafe', desc: '타겟 커뮤니티 입소문 및 침투 마케팅' },
      { name: '백링크', path: '/traffic', desc: '구글·네이버 도메인 신뢰도 향상을 위한 백링크 구축' },
      { name: 'SEO/AEO 컨설팅', path: '/seo-aeo', desc: '검색엔진 및 AI 답변엔진 최적화 종합 진단' }
    ] 
  },
  { 
    title: '플랫폼', 
    path: '/platform', 
    items: [
      { name: '마케팅자동화(iCRM)', path: '/platform', desc: '수집, 상담, 고객 관리 흐름을 자동화하는 도구' },
      { name: '채팅자동화', path: '/platform', desc: '카카오 알림톡 및 실시간 상담 자동 연결' },
      { name: '애드센스자동화', path: '/platform', desc: '수익형 웹사이트 자동 발행 및 운영 시스템' },
      { name: '온오프CPA', path: '/onoffcpa', desc: '광고주와 파트너를 연결하는 성과형 제휴 플랫폼', badge: 'HOT' },
      { name: '플랫폼 제작 의뢰', path: '/platform', desc: '기업 독자형 자동화 플랫폼 및 시스템 구축' }
    ] 
  },
  { 
    title: 'AI 도구 모음', 
    path: '/ai-tools', 
    items: [] 
  },
  { 
    title: '무료온라인강의', 
    path: '/free-courses', 
    items: [
      { name: '홈페이지제작', path: '/free-courses', desc: '초보자도 따라 하는 웹사이트 제작 기초 VOD' },
      { name: 'SEO 노하우', path: '/free-courses', desc: '검색 상위 1페이지 점유를 위한 SEO 마스터' },
      { name: '블로그상위노출', path: '/free-courses', desc: '핵심 키워드 추출과 실전 블로그 상위 노출 전략' },
      { name: '카페상위노출', path: '/free-courses', desc: '타겟 카페 침투 및 커뮤니티 바이럴 전략' }
    ] 
  },
  { 
    title: '커뮤니티', 
    path: '/community', 
    items: [
      { name: '공지사항', path: '/notice', desc: '온오프마케팅 주요 소식 및 시스템 업데이트' },
      { name: '자주묻는질문', path: '/faq', desc: '서비스 이용 시 자주 묻는 질문 및 답변' },
      { name: '유튜브게시판', path: '/youtube', desc: '실전 마케팅 영상 가이드 및 노하우 칼럼' },
      { name: '커뮤니티 홈', path: '/community', desc: '공지·FAQ·영상 한눈에 보기' }
    ] 
  },
];

function readSiteBoot(): SiteBoot {
  if (typeof window === 'undefined') return {};
  return window.__ONOFF_SITE__ || {};
}

function AuthLinks({
  className = '',
  linkClassName,
  onNavigate,
}: {
  className?: string;
  linkClassName: string;
  onNavigate?: () => void;
}) {
  const boot = readSiteBoot();
  const loginUrl = boot.loginUrl || '/bbs/login.php';
  const registerUrl = boot.registerUrl || '/bbs/register.php';
  const logoutUrl = boot.logoutUrl || '/bbs/logout.php';
  const portalUrl = boot.portalUrl || '/seo-system-300/dashboard';
  const isMember = Boolean(boot.isMember);

  if (isMember) {
    return (
      <div className={className}>
        <AppNavLink to={portalUrl} className={linkClassName} onClick={onNavigate}>
          Control Center
        </AppNavLink>
        <AppNavLink to={logoutUrl} className={linkClassName} onClick={onNavigate}>
          로그아웃
        </AppNavLink>
      </div>
    );
  }

  return (
    <div className={className}>
      <AppNavLink to={loginUrl} className={linkClassName} onClick={onNavigate}>
        로그인
      </AppNavLink>
      <AppNavLink to={registerUrl} className={linkClassName} onClick={onNavigate}>
        회원가입
      </AppNavLink>
    </div>
  );
}

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMobileMenu, setActiveMobileMenu] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-3.5' : 'bg-white/90 backdrop-blur-sm py-4.5 border-b border-slate-100'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center gap-3">
        {/* Logo */}
        <Link to="/" className="flex items-center shrink-0 group" aria-label="온오프마케팅 홈">
          <img
            src={logoImg}
            alt="온오프마케팅 ONOFF MARKETING"
            className="h-9 sm:h-10 w-auto object-contain transition-opacity group-hover:opacity-80"
            width={182}
            height={54}
          />
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center space-x-5 xl:space-x-7">
          {menuData.map((menu) => (
            <div key={menu.title} className="relative group">
              <Link 
                to={menu.path} 
                className="flex items-center text-sm font-extrabold text-slate-700 hover:text-blue-900 transition-colors py-2"
              >
                <span>{menu.title}</span>
                {menu.items.length > 0 && (
                  <ChevronDown size={14} className="ml-1 text-slate-400 group-hover:text-blue-900 group-hover:rotate-180 transition-transform duration-200" />
                )}
              </Link>

              {/* Submenu Card Popup */}
              {menu.items.length > 0 && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-72 xl:w-80 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out z-50">
                  <div className="bg-white border border-slate-100 shadow-2xl rounded-2xl p-2.5 backdrop-blur-xl">
                    <div className="space-y-1">
                      {menu.items.map((item) => (
                        <AppNavLink 
                          key={item.name} 
                          to={item.path} 
                          className="group/item block p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs sm:text-sm font-extrabold text-slate-800 group-hover/item:text-blue-900 transition-colors">
                              {item.name}
                            </span>
                            {item.badge && (
                              <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          {item.desc && (
                            <p className="text-[11px] text-slate-500 font-medium leading-tight mt-1 line-clamp-1 group-hover/item:text-slate-600">
                              {item.desc}
                            </p>
                          )}
                        </AppNavLink>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          <AuthLinks
            className="flex items-center gap-3 xl:gap-4 pl-1 border-l border-slate-200"
            linkClassName="text-sm font-extrabold text-slate-700 hover:text-blue-900 transition-colors whitespace-nowrap"
          />

          {/* Right CTA Button - Kept Header Styling */}
          <Link 
            to="/consult" 
            className="bg-blue-900 text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-blue-800 shadow-md shadow-blue-900/20 transition-all flex items-center space-x-1.5 group shrink-0"
          >
            <Sparkles size={15} className="text-yellow-400 group-hover:rotate-12 transition-transform" />
            <span>무료 상담</span>
          </Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden p-2 rounded-xl text-slate-800 hover:bg-slate-100 transition-colors" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="메뉴 열기"
        >
          {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Nav Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-2xl border-t border-slate-100 max-h-[calc(100vh-80px)] overflow-y-auto">
          <div className="px-4 py-4 space-y-1">
            {menuData.map((menu) => (
              <div key={menu.title} className="border-b border-slate-100 last:border-0 pb-2 pt-1">
                {menu.items.length > 0 ? (
                  <button 
                    className="flex items-center justify-between w-full py-3 px-2 text-left font-extrabold text-slate-800 rounded-xl hover:bg-slate-50"
                    onClick={() => setActiveMobileMenu(activeMobileMenu === menu.title ? null : menu.title)}
                  >
                    <span>{menu.title}</span>
                    <ChevronDown size={18} className={`text-slate-400 transition-transform ${activeMobileMenu === menu.title ? 'rotate-180 text-blue-900' : ''}`} />
                  </button>
                ) : (
                  <Link 
                    to={menu.path}
                    className="flex items-center justify-between w-full py-3 px-2 text-left font-extrabold text-slate-800 rounded-xl hover:bg-slate-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>{menu.title}</span>
                  </Link>
                )}

                {/* Mobile Submenu Accordion */}
                {menu.items.length > 0 && activeMobileMenu === menu.title && (
                  <div className="ml-3 pl-3 border-l-2 border-blue-100 py-2 space-y-2">
                    {menu.items.map((item) => (
                      <AppNavLink 
                        key={item.name} 
                        to={item.path} 
                        onClick={() => setIsMobileMenuOpen(false)} 
                        className="block p-2 rounded-lg hover:bg-blue-50/50"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-slate-800">{item.name}</span>
                          {item.badge && <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-1 py-0.2 rounded">{item.badge}</span>}
                        </div>
                        {item.desc && <p className="text-[11px] text-slate-500 font-medium mt-0.5">{item.desc}</p>}
                      </AppNavLink>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="pt-3 px-2 space-y-2">
              <AuthLinks
                className="grid grid-cols-2 gap-2"
                linkClassName="flex items-center justify-center w-full border border-slate-200 bg-white text-slate-800 px-4 py-3 rounded-xl font-extrabold text-sm hover:border-blue-200 hover:bg-slate-50"
                onNavigate={() => setIsMobileMenuOpen(false)}
              />
              <Link 
                to="/consult" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="flex items-center justify-center space-x-2 w-full bg-blue-900 text-white px-5 py-3.5 rounded-xl font-extrabold text-sm hover:bg-blue-800 shadow-lg shadow-blue-900/20"
              >
                <Sparkles size={16} className="text-yellow-400" />
                <span>무료 상담 신청하기</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
