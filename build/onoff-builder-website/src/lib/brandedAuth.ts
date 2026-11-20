function readBool(value: string | undefined, defaultValue: boolean): boolean {
  if (value === undefined || value === '') return defaultValue;
  return value === 'true' || value === '1';
}

export const brandedAuthConfig = {
  enabled: readBool(import.meta.env.VITE_ONOFF_BRANDED_AUTH, true),
};

export function isBrandedAuthEnabled(): boolean {
  return brandedAuthConfig.enabled;
}

export const AUTH_ROUTES = {
  login: '/login',
  signup: '/signup',
} as const;

export function buildLoginPath(returnPath?: string): string {
  const safe = sanitizeReturnPath(returnPath);
  if (safe === '/') return AUTH_ROUTES.login;
  return `${AUTH_ROUTES.login}?return=${encodeURIComponent(safe)}`;
}

export function buildSignupPath(returnPath?: string): string {
  const safe = sanitizeReturnPath(returnPath);
  if (safe === '/') return AUTH_ROUTES.signup;
  return `${AUTH_ROUTES.signup}?return=${encodeURIComponent(safe)}`;
}

function sanitizeReturnPath(raw: string | null | undefined, fallback = '/'): string {
  const value = String(raw || '').trim();
  if (!value) return fallback;
  if (!value.startsWith('/') || value.startsWith('//') || value.includes('\\')) return fallback;
  const base = value.split('?')[0];
  if (base === AUTH_ROUTES.login || base === AUTH_ROUTES.signup) return fallback;
  return value;
}