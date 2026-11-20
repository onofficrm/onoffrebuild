import { SEO_SYSTEM_300_BASENAME } from './app';

export const API_ENDPOINTS = {
  session: '/plugin/seo-system-300/session.php',
  sessionAlias: '/plugin/seo-system-300/api/session.php',
  projects: '/plugin/seo-system-300/api/projects/index.php',
  website: '/plugin/seo-system-300/api/website/index.php',
  roadmap: '/plugin/seo-system-300/api/roadmap/index.php',
  missions: '/plugin/seo-system-300/api/missions/index.php',
  activity: '/plugin/seo-system-300/api/activity/index.php',
  metrics: '/plugin/seo-system-300/api/metrics/index.php',
  google: '/plugin/seo-system-300/api/integrations/google/index.php',
  gsc: '/plugin/seo-system-300/api/integrations/gsc/index.php',
  ga4: '/plugin/seo-system-300/api/integrations/ga4/index.php',
  admin: '/plugin/seo-system-300/api/admin/index.php',
  tools: '/plugin/seo-system-300/api/tools/index.php',
  ai: '/plugin/seo-system-300/api/ai/index.php',
  notifications: '/plugin/seo-system-300/api/notifications/index.php',
  classJourney: '/plugin/seo-system-300/api/class/index.php',
  revision: '/plugin/seo-system-300/api/revision/index.php',
  geo: '/plugin/seo-system-300/api/geo/index.php',
  contract: '/plugin/seo-system-300/api/contract/index.php',
} as const;

export const GNUBOARD_LOGIN_PATH = '/bbs/login.php';
export const PORTAL_FALLBACK_PATH = `${SEO_SYSTEM_300_BASENAME}/dashboard`;
export const EMPTY_MEMBER_FIELD = '등록되지 않음';
