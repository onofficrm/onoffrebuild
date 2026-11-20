import { API_ENDPOINTS, EMPTY_MEMBER_FIELD } from '../config/api';

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export type PortalUser = {
  mbId: string;
  mbName: string;
  mbNick: string;
  mbEmail: string;
};

export type LaunchMode = 'off' | 'admin' | 'pilot' | 'all';

export type EnrollmentState = {
  required: boolean;
  access: boolean;
  status: string;
  courseId: string;
};

export type ContractAccessState = {
  applies: boolean;
  signed: boolean;
  blocked: boolean;
  graceActive: boolean;
  requires: boolean;
  hasSignedHistory: boolean;
  viewable: boolean;
  status: string;
  courseId: string;
  path: string;
  version: string;
  rejectionReason: string;
};

export type SessionPayload = {
  authenticated: boolean;
  isAdmin: boolean;
  adminLevel: string;
  user: PortalUser | null;
  csrfToken?: string;
  launchMode: LaunchMode;
  launchAllowed: boolean;
  enrollment: EnrollmentState;
  contract: ContractAccessState;
};

const DEFAULT_CONTRACT: ContractAccessState = {
  applies: false,
  signed: true,
  blocked: false,
  graceActive: false,
  requires: false,
  hasSignedHistory: false,
  viewable: false,
  status: '',
  courseId: '',
  path: '/seo-system-300/contract',
  version: '',
  rejectionReason: '',
};

function normalizeContract(raw: unknown): ContractAccessState {
  if (!raw || typeof raw !== 'object') return { ...DEFAULT_CONTRACT };
  const c = raw as Record<string, unknown>;
  return {
    applies: c.applies === true,
    signed: c.signed !== false,
    blocked: c.blocked === true,
    graceActive: c.graceActive === true,
    requires: c.requires === true,
    hasSignedHistory: c.hasSignedHistory === true,
    viewable: c.viewable === true,
    status: String(c.status ?? ''),
    courseId: String(c.courseId ?? ''),
    path: String(c.path ?? DEFAULT_CONTRACT.path),
    version: String(c.version ?? ''),
    rejectionReason: String(c.rejectionReason ?? ''),
  };
}

function emptyPayload(): SessionPayload {
  return {
    authenticated: false,
    isAdmin: false,
    adminLevel: '',
    user: null,
    csrfToken: '',
    launchMode: 'all',
    launchAllowed: true,
    enrollment: { required: false, access: true, status: '', courseId: '' },
    contract: { ...DEFAULT_CONTRACT },
  };
}

function asLaunchMode(raw: unknown): LaunchMode {
  return raw === 'off' || raw === 'admin' || raw === 'pilot' || raw === 'all' ? raw : 'off';
}

function normalize(raw: unknown): SessionPayload {
  if (!raw || typeof raw !== 'object') return emptyPayload();
  let data = raw as Record<string, unknown>;
  if (
    data.data &&
    typeof data.data === 'object' &&
    ('authenticated' in (data.data as object) || 'launchMode' in (data.data as object))
  ) {
    data = data.data as Record<string, unknown>;
  }

  const userRaw = data.user ?? data.member;
  let user: PortalUser | null = null;
  if (userRaw && typeof userRaw === 'object') {
    const u = userRaw as Record<string, unknown>;
    const mbId = String(u.mbId ?? u.id ?? '');
    if (mbId) {
      user = {
        mbId,
        mbName: String(u.mbName ?? u.name ?? ''),
        mbNick: String(u.mbNick ?? u.nickname ?? ''),
        mbEmail: String(u.mbEmail ?? u.email ?? ''),
      };
    }
  }

  const authenticated =
    data.authenticated === true || data.isMember === true || Boolean(user);

  const hasLaunch = Object.prototype.hasOwnProperty.call(data, 'launchAllowed');
  const launchMode = hasLaunch ? asLaunchMode(data.launchMode) : 'all';
  const launchAllowed = hasLaunch ? data.launchAllowed === true : true;
  const enrollmentRaw = data.enrollment;
  const enrollment: EnrollmentState =
    enrollmentRaw && typeof enrollmentRaw === 'object'
      ? {
          required: (enrollmentRaw as EnrollmentState).required === true,
          access: (enrollmentRaw as EnrollmentState).access !== false,
          status: String((enrollmentRaw as EnrollmentState).status || ''),
          courseId: String((enrollmentRaw as EnrollmentState).courseId || ''),
        }
      : { required: false, access: true, status: '', courseId: '' };

  const contract = normalizeContract(data.contract);

  return {
    authenticated,
    isAdmin: authenticated && data.isAdmin === true,
    adminLevel: authenticated ? String(data.adminLevel ?? '') : '',
    user: authenticated ? user : null,
    csrfToken: String(data.csrfToken ?? ''),
    launchMode,
    launchAllowed,
    enrollment,
    contract,
  };
}

export async function fetchSession(): Promise<SessionPayload> {
  const res = await fetch(API_ENDPOINTS.session, {
    credentials: 'same-origin',
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) return emptyPayload();
  return normalize(await res.json());
}

let cached: SessionPayload | null = null;

export async function getCurrentUser(): Promise<PortalUser | null> {
  const session = cached ?? (await fetchSession());
  cached = session;
  return session.user;
}

export function isAuthenticated(session: SessionPayload): boolean {
  return session.authenticated && Boolean(session.user);
}

export function isAdmin(session: SessionPayload): boolean {
  return isAuthenticated(session) && session.isAdmin;
}

export function memberDisplayName(user: PortalUser | null): string {
  if (!user) return EMPTY_MEMBER_FIELD;
  return user.mbName || user.mbNick || user.mbId || EMPTY_MEMBER_FIELD;
}

export function memberField(value: string | undefined | null): string {
  const v = (value || '').trim();
  return v || EMPTY_MEMBER_FIELD;
}

export function memberInitials(user: PortalUser | null): string {
  const name = memberDisplayName(user);
  if (name === EMPTY_MEMBER_FIELD) return '?';
  return Array.from(name).slice(0, 2).join('');
}

export function clearSessionCache() {
  cached = null;
}
