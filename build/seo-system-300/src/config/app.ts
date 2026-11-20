/** Public URL prefix. Must match Apache directory + Vite `base`. Empty on edu.icrm.co.kr. */
const rawBase = import.meta.env.BASE_URL || '/seo-system-300/';
export const SEO_SYSTEM_300_BASENAME = rawBase === '/' ? '' : rawBase.replace(/\/$/, '');

export function isEduHost(): boolean {
  if (import.meta.env.VITE_EDU_HOST === 'true') return true;
  if (typeof window === 'undefined') return false;
  return window.location.hostname === 'edu.icrm.co.kr';
}

/**
 * Member / project / website order: GNUBoard live APIs.
 * Roadmap, missions, SEO metrics, AI Coach remain Builder demo fixtures.
 */
export const SEO_SYSTEM_300_DATA_MODE = 'hybrid' as const;

export { API_ENDPOINTS } from './api';
export const GNUBOARD_SESSION_URL = '/plugin/seo-system-300/session.php';
