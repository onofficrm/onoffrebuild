import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import {
  COMMUNITY_URL,
  CORE_FEATURE_NAV_ITEMS,
  FEATURES_OVERVIEW_PATH,
  SERVICE_NAV_ITEMS,
  SITE_DOMAIN,
} from '../../data/navigation';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { BrandLogo } from './BrandLogo';

export function Footer() {
  const baseServices = SERVICE_NAV_ITEMS.filter((item) => item.group === 'core');
  const separateServices = SERVICE_NAV_ITEMS.filter((item) => item.group === 'extension');

  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400">
      <Container className="py-14 sm:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-3 space-y-4">
            <Link to="/" className="inline-block" aria-label="ONOFF Builder 홈">
              <BrandLogo variant="dark" size="lg" />
            </Link>
            <p className="max-w-[300px] text-[15px] font-medium leading-snug text-white">
              홈페이지 하나로,{' '}
              <span className="text-blue-400">운영까지.</span>
            </p>
            <p className="max-w-[300px] text-sm leading-relaxed text-slate-400">
              관리형 홈페이지 구축에 3대 자동화 도구, 자동 댓글, 쉬운 수정, AI 기능 개발과 전문 마케팅 서비스를
              연계하는 온오프마케팅 웹 플랫폼입니다.
            </p>
            <p className="text-xs text-slate-500">{SITE_DOMAIN}</p>
            <Button to="/contact" size="sm" className="!shadow-blue-600/25">
              <span>상담하기</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Button>
          </div>

          <div className="md:col-span-3 space-y-3">
            <p className="text-xs font-bold tracking-wider uppercase text-slate-200">기본 기능</p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to={FEATURES_OVERVIEW_PATH}
                  className="font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  기본 기능 전체
                </Link>
              </li>
              {CORE_FEATURE_NAV_ITEMS.map((item) => (
                <li key={item.slug}>
                  <Link to={item.path} className="text-slate-400 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4 space-y-3">
            <p className="text-xs font-bold tracking-wider uppercase text-slate-200">서비스</p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
              <ul className="space-y-2.5">
                {baseServices.map((item) => (
                  <li key={item.slug}>
                    <Link
                      to={item.path}
                      className="font-semibold text-slate-300 hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                {separateServices.slice(0, 2).map((item) => (
                  <li key={item.slug}>
                    <Link to={item.path} className="text-slate-400 hover:text-white transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <ul className="space-y-2.5">
                {separateServices.slice(2).map((item) => (
                  <li key={item.slug}>
                    <Link to={item.path} className="text-slate-400 hover:text-white transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="md:col-span-2 space-y-3">
            <p className="text-xs font-bold tracking-wider uppercase text-slate-200">안내 및 상담</p>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  빌더 소개
                </Link>
              </li>
              <li>
                <Link to="/use-cases" className="hover:text-white transition-colors">
                  활용사례
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="hover:text-white transition-colors">
                  제작사례
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-white transition-colors">
                  요금안내
                </Link>
              </li>
              <li>
                <Link to="/contact" className="font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                  상담하기
                </Link>
              </li>
              <li>
                <a href={COMMUNITY_URL} className="hover:text-white transition-colors">
                  커뮤니티
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-slate-800 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} ONOFF Marketing. All rights reserved.
          </p>
          <p className="text-xs text-slate-500">
            ONOFF Builder 2.0 · 홈페이지 · 3대 자동화 도구 · 자동 댓글 · 쉬운 수정 · AI 기능 개발
          </p>
        </div>
      </Container>
    </footer>
  );
}