export interface EducationEnrollment {
  en_id: number;
  course_id: string;
  mb_id: string;
  applicant_name: string;
  status: 'pending_deposit' | 'pending_contract' | 'active' | 'expired' | 'cancelled' | string;
  source: string;
  deposit_amount: number;
  depositor_name: string;
  starts_at: string;
  ends_at: string;
  activated_at: string;
  created_at: string;
  updated_at: string;
  phone?: string;
  email?: string;
  admin_memo?: string;
  kakao_active_sent_at?: string;
  kakao_last_error?: string;
  contract_version?: string;
  contract_party_name?: string;
  contract_party_phone?: string;
  contract_party_email?: string;
  contract_signed_at?: string;
  has_contract_signature?: boolean;
}

export interface EducationAccess {
  access: boolean;
  requiresContract?: boolean;
  course_id: string;
  mb_id: string;
  member_name: string;
  enrollment: EducationEnrollment | null;
  contractPath?: string;
  platform_entry_url?: string;
}

export interface EducationContractAgreements {
  readAll: boolean;
  personalUse: boolean;
  noRedistribute: boolean;
  electronic: boolean;
}

export interface EducationContractPackage {
  id: string;
  title: string;
  version: string;
  scope: string[];
  period: string;
  feeNote: string;
  clauses: string[];
}

export interface EducationContractState {
  requiresContract: boolean;
  isSigned: boolean;
  canWrite: boolean;
  version: string;
  package: EducationContractPackage;
  enrollment: EducationEnrollment | null;
  form: {
    partyName: string;
    partyPhone: string;
    partyEmail: string;
    agreements: EducationContractAgreements;
  };
  member_name?: string;
}

export type EnrollmentStatusFilter =
  | ''
  | 'pending_deposit'
  | 'pending_contract'
  | 'active'
  | 'expired'
  | 'cancelled';

export interface EducationEnrollmentList {
  items: EducationEnrollment[];
  page: number;
  totalPage: number;
  totalCount: number;
  statusCounts: Record<string, number>;
  filters: { status: string; stx: string };
}

export interface EnrollmentUpdateFields {
  en_id: number;
  mb_id?: string;
  status?: string;
  deposit_amount?: number;
  depositor_name?: string;
  starts_at?: string;
  ends_at?: string;
  admin_memo?: string;
}

async function educationRequest<T>(
  action: string,
  options: {
    method?: 'GET' | 'POST';
    query?: Record<string, string | number>;
    body?: Record<string, unknown>;
  } = {}
): Promise<{ ok: true; data: T } | { ok: false; status: number; error: string; code?: string }> {
  const params = new URLSearchParams({ action });
  if (options.query) {
    for (const [k, v] of Object.entries(options.query)) {
      if (v === '' || v === undefined || v === null) continue;
      params.set(k, String(v));
    }
  }
  const method = options.method ?? (options.body ? 'POST' : 'GET');
  const res = await fetch(`/api/education.php?${params.toString()}`, {
    method,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const payload = await res.json().catch(() => null);
  if (!res.ok || !payload?.ok) {
    return {
      ok: false as const,
      status: res.status,
      error: String(payload?.message || payload?.error || '요청 실패'),
      code: payload?.code as string | undefined,
    };
  }
  return { ok: true as const, data: payload.data as T };
}

export const educationApi = {
  getAccess(courseId = 'any') {
    return educationRequest<EducationAccess>('access', {
      method: 'GET',
      query: { course_id: courseId },
    });
  },

  getContract(courseId = 'seo-geo-master') {
    return educationRequest<EducationContractState>('contract', {
      method: 'GET',
      query: { course_id: courseId },
    });
  },

  saveContractDraft(fields: {
    course_id?: string;
    partyName: string;
    partyPhone: string;
    partyEmail: string;
    agreements: EducationContractAgreements;
  }) {
    return educationRequest<EducationContractState>('contract', {
      method: 'POST',
      body: { action: 'draft', ...fields },
    });
  },

  signContract(fields: {
    course_id?: string;
    partyName: string;
    partyPhone: string;
    partyEmail: string;
    agreements: EducationContractAgreements;
    signatureData: string;
  }) {
    return educationRequest<{
      message: string;
      enrollment: EducationEnrollment;
      access: boolean;
      requiresContract: boolean;
      contract: EducationContractState;
    }>('contract', {
      method: 'POST',
      body: { action: 'sign', ...fields },
    });
  },

  getAdminGate() {
    return educationRequest<{ canManageAdmin: boolean }>('admin', { method: 'GET' });
  },

  listEnrollments(filters: { status?: EnrollmentStatusFilter; stx?: string; page?: number } = {}) {
    return educationRequest<EducationEnrollmentList>('list', {
      method: 'GET',
      query: {
        status: filters.status || '',
        stx: filters.stx || '',
        page: filters.page || 1,
      },
    });
  },

  updateEnrollment(fields: EnrollmentUpdateFields) {
    return educationRequest<{ enrollment: EducationEnrollment }>('update', {
      method: 'POST',
      body: fields as unknown as Record<string, unknown>,
    });
  },
};
