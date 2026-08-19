import { API_ENDPOINTS } from '../config/api';
import { fetchSession } from './authService';

export class ApiRequestError extends Error {
  status: number;
  code: string;
  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
    this.name = 'ApiRequestError';
  }
}

type ApiEnvelope<T> = {
  ok?: boolean;
  data?: T;
  error?: { code?: string; message?: string } | string;
  message?: string;
};

let csrfToken = '';

export async function ensureCsrfToken(): Promise<string> {
  if (csrfToken) return csrfToken;
  const session = await fetchSession();
  csrfToken = session.csrfToken || '';
  return csrfToken;
}

export function clearApiClientCache() {
  csrfToken = '';
}

function friendlyMessage(status: number, body: ApiEnvelope<unknown> | null): { code: string; message: string } {
  const err = body?.error;
  if (err && typeof err === 'object' && err.message) {
    return { code: String(err.code || 'request_failed'), message: String(err.message) };
  }
  if (typeof err === 'string') {
    return { code: err, message: '요청을 처리할 수 없습니다. 다시 시도해주세요.' };
  }
  if (status === 401) return { code: 'unauthorized', message: '로그인이 필요합니다.' };
  if (status === 403 && body?.error && typeof body.error === 'object' && body.error.code === 'launch_not_allowed') {
    return { code: 'launch_not_allowed', message: String(body.error.message || 'SEO SYSTEM 300을 준비하고 있습니다.') };
  }
  if (status === 403) return { code: 'forbidden', message: '권한이 없습니다.' };
  if (status === 404) return { code: 'not_found', message: '요청한 정보를 찾을 수 없습니다.' };
  if (status === 409) return { code: 'conflict', message: '지금은 이 작업을 할 수 없습니다.' };
  if (status === 422) return { code: 'validation_error', message: '입력값을 확인한 뒤 다시 시도해주세요.' };
  if (status === 503) return { code: 'tables_missing', message: '저장 기능이 아직 준비되지 않았습니다.' };
  return { code: 'request_failed', message: '저장 중 문제가 발생했습니다. 다시 시도해주세요.' };
}

export async function apiRequest(url: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers || {});
  if (!headers.has('Accept')) headers.set('Accept', 'application/json');
  const res = await fetch(url, {
    credentials: 'same-origin',
    ...init,
    headers,
  });
  const body = await res.json().catch(() => null);
  return { ok: res.ok, status: res.status, body };
}

export async function apiJson<T>(url: string, init: RequestInit = {}): Promise<T> {
  const method = (init.method || 'GET').toUpperCase();
  const headers = new Headers(init.headers || {});
  if (!headers.has('Accept')) headers.set('Accept', 'application/json');
  const isForm = typeof FormData !== 'undefined' && init.body instanceof FormData;
  if (!isForm && init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (method !== 'GET' && method !== 'HEAD') {
    const token = await ensureCsrfToken();
    if (token) headers.set('X-CSRF-Token', token);
  }
  const res = await fetch(url, {
    credentials: 'same-origin',
    ...init,
    headers,
  });
  const body = (await res.json().catch(() => null)) as ApiEnvelope<T> | null;
  if (!res.ok || body?.ok === false) {
    const parsed = friendlyMessage(res.status, body);
    throw new ApiRequestError(res.status, parsed.code, parsed.message);
  }
  if (body && 'data' in body) {
    return body.data as T;
  }
  return body as T;
}

export const portalApi = {
  session: () => apiRequest(API_ENDPOINTS.session),
  projects: () => apiRequest(API_ENDPOINTS.projects),
  website: () => apiRequest(API_ENDPOINTS.website),
  roadmap: () => apiRequest(API_ENDPOINTS.roadmap),
  missions: () => apiRequest(API_ENDPOINTS.missions),
  activity: () => apiRequest(API_ENDPOINTS.activity),
  admin: () => apiRequest(API_ENDPOINTS.admin),
};
