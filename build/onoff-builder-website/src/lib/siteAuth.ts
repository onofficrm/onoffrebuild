import { buildLoginPath, buildSignupPath, isBrandedAuthEnabled } from './brandedAuth';

export type SiteBoot = {
  isMember?: boolean;
  mbId?: string;
  mbNick?: string;
  loginUrl?: string;
  registerUrl?: string;
  logoutUrl?: string;
  portalUrl?: string;
};

/** useSyncExternalStore 안정 스냅샷 — 매 호출마다 새 `{}`를 만들면 React #185 루프 발생 */
const EMPTY_SITE_BOOT: SiteBoot = Object.freeze({});

declare global {
  interface Window {
    __ONOFF_SITE__?: SiteBoot;
  }
}

export function readSiteBoot(): SiteBoot {
  if (typeof window === 'undefined') return EMPTY_SITE_BOOT;
  return window.__ONOFF_SITE__ ?? EMPTY_SITE_BOOT;
}

function currentReturnPath(): string {
  if (typeof window === 'undefined') return '/';
  const { pathname, search } = window.location;
  return `${pathname}${search}` || '/';
}

export function resolveLoginHref(boot?: SiteBoot): string {
  const site = boot ?? readSiteBoot();
  if (isBrandedAuthEnabled()) return buildLoginPath(currentReturnPath());
  if (site.loginUrl) return site.loginUrl;
  if (typeof window === 'undefined') return '/bbs/login.php';
  const target = encodeURIComponent(window.location.origin + currentReturnPath());
  return `/bbs/login.php?url=${target}`;
}

export function resolveRegisterHref(boot?: SiteBoot): string {
  const site = boot ?? readSiteBoot();
  if (isBrandedAuthEnabled()) return buildSignupPath(currentReturnPath());
  if (site.registerUrl) return site.registerUrl;
  return '/bbs/register.php';
}

export function resolveLogoutHref(boot?: SiteBoot): string {
  const site = boot ?? readSiteBoot();
  if (site.logoutUrl) return site.logoutUrl;
  const target = encodeURIComponent(window.location.origin + '/');
  return `/bbs/logout.php?url=${target}`;
}

/** Paths that leave the official Builder SPA (full document navigation). */
export function isOffSpaPath(path: string): boolean {
  if (!path) return false;
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('//')) return true;
  if (path === '/community' || path.startsWith('/community/')) return true;
  if (path.startsWith('/bbs/') || path.startsWith('/adm/')) return true;
  if (path === '/login' || path.startsWith('/login?')) return true;
  if (path === '/signup' || path.startsWith('/signup?')) return true;
  if (path.startsWith('/notice') || path.startsWith('/faq') || path.startsWith('/youtube')) return true;
  return false;
}