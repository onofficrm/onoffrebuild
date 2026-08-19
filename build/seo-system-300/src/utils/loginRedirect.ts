import { GNUBOARD_LOGIN_PATH, PORTAL_FALLBACK_PATH } from '../config/api';
import { SEO_SYSTEM_300_BASENAME } from '../config/app';

/**
 * Same-origin portal paths only. Blocks protocol-relative and external URLs.
 */
export function sanitizePortalReturnPath(raw: string): string {
  const fallback = PORTAL_FALLBACK_PATH;
  let url = (raw || '').trim();
  if (!url) return fallback;
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(url)) return fallback;
  if (url.includes('\\') || url.includes('@')) return fallback;
  if (!url.startsWith('/')) return fallback;
  if (url.startsWith('//')) return fallback;

  const pathOnly = url.split('#')[0];
  const pathname = pathOnly.split('?')[0];
  const allowed =
    pathname === SEO_SYSTEM_300_BASENAME || pathname.startsWith(`${SEO_SYSTEM_300_BASENAME}/`);
  if (!allowed) return fallback;
  return pathOnly;
}

export function currentPortalReturnPath(pathname: string, search = ''): string {
  const combined = `${SEO_SYSTEM_300_BASENAME}${pathname === '/' ? '' : pathname}${search}`;
  return sanitizePortalReturnPath(combined || PORTAL_FALLBACK_PATH);
}

export function gnuboardLoginUrl(returnPath: string): string {
  const safe = sanitizePortalReturnPath(returnPath);
  return `${GNUBOARD_LOGIN_PATH}?url=${encodeURIComponent(safe)}`;
}
