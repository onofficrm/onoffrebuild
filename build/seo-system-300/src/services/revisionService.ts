import { API_ENDPOINTS } from '../config/api';
import { apiJson, ensureCsrfToken } from './apiClient';
import type { RevisionAnnotation } from '../types/revisionAnnotation';

export type RevisionStatus =
  | 'requested'
  | 'reviewing'
  | 'need_info'
  | 'free_progress'
  | 'quote_pending'
  | 'paid'
  | 'in_progress'
  | 'feedback'
  | 'completed'
  | 'cancelled'
  | 'expired';

export type ApiRevisionFile = {
  id: number;
  ticketId: number;
  commentId: number;
  originalName: string;
  mimeType: string;
  fileSize: number;
  createdAt: string;
  downloadUrl: string;
};

export type ApiRevisionComment = {
  id: number;
  ticketId: number;
  mbId: string;
  authorRole: 'student' | 'admin' | string;
  body: string;
  createdAt: string;
};

export type ApiRevisionTicket = {
  id: number;
  orderId: number;
  projectId: number;
  mbId: string;
  title: string;
  description: string;
  pageUrl: string;
  device: 'pc' | 'mobile' | 'both' | string;
  category: string;
  priority: 'normal' | 'urgent' | string;
  status: RevisionStatus | string;
  statusLabel: string;
  quotePoints: number;
  quoteNote: string;
  quoteVersion: number;
  quoteExpiresAt: string | null;
  paidAt: string | null;
  feedbackNote: string;
  feedbackUrl: string;
  annotation?: RevisionAnnotation | null;
  agentBrief?: string;
  freeUsed: boolean;
  createdAt: string;
  updatedAt: string;
  comments?: ApiRevisionComment[];
  files?: ApiRevisionFile[];
  quota?: { limit: number; used: number; remaining: number };
};

export type RevisionQuota = { limit: number; used: number; remaining: number };

export async function listRevisions(projectId: number) {
  return apiJson<{
    tickets: ApiRevisionTicket[];
    quota: RevisionQuota;
    eligible: boolean;
    orderId: number;
  }>(`${API_ENDPOINTS.revision}?projectId=${encodeURIComponent(String(projectId))}`);
}

export async function getRevision(ticketId: number) {
  return apiJson<{ ticket: ApiRevisionTicket; quota: RevisionQuota }>(
    `${API_ENDPOINTS.revision}?action=detail&ticketId=${encodeURIComponent(String(ticketId))}`
  );
}

export async function createRevision(payload: {
  projectId: number;
  orderId?: number;
  title: string;
  description: string;
  pageUrl?: string;
  device?: string;
  category?: string;
  priority?: string;
  annotation?: RevisionAnnotation;
}) {
  return apiJson<ApiRevisionTicket>(API_ENDPOINTS.revision, {
    method: 'POST',
    body: JSON.stringify({ action: 'create', ...payload }),
  });
}

export async function commentRevision(ticketId: number, body: string) {
  return apiJson<ApiRevisionTicket>(API_ENDPOINTS.revision, {
    method: 'POST',
    body: JSON.stringify({ action: 'comment', ticketId, body }),
  });
}

export async function confirmRevision(ticketId: number, ok: boolean) {
  return apiJson<ApiRevisionTicket>(API_ENDPOINTS.revision, {
    method: 'POST',
    body: JSON.stringify({ action: 'confirm', ticketId, ok }),
  });
}

export async function payRevisionQuote(ticketId: number, quoteVersion: number) {
  const requestId = `rev${ticketId}q${quoteVersion}`;
  return apiJson<ApiRevisionTicket>(API_ENDPOINTS.revision, {
    method: 'POST',
    body: JSON.stringify({
      action: 'pay',
      ticketId,
      quoteVersion,
      requestId,
    }),
  });
}

export async function uploadRevisionFile(
  ticketId: number,
  file: File,
  onProgress?: (pct: number) => void,
  options?: { asSnapshot?: boolean }
): Promise<ApiRevisionFile> {
  const token = await ensureCsrfToken();
  const form = new FormData();
  form.append('file', file);
  form.append('ticketId', String(ticketId));
  form.append('token', token);
  form.append('action', 'upload');
  if (options?.asSnapshot) {
    form.append('asSnapshot', '1');
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_ENDPOINTS.revision}?action=upload`);
    xhr.withCredentials = true;
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('X-CSRF-Token', token);
    xhr.upload.onprogress = (ev) => {
      if (onProgress && ev.lengthComputable) {
        onProgress(Math.round((ev.loaded / ev.total) * 100));
      }
    };
    xhr.onload = () => {
      try {
        const body = JSON.parse(xhr.responseText || '{}');
        if (xhr.status >= 200 && xhr.status < 300 && body.ok !== false) {
          resolve(body.data as ApiRevisionFile);
          return;
        }
        reject(new Error(body?.error?.message || '파일 업로드에 실패했습니다.'));
      } catch {
        reject(new Error('파일 업로드에 실패했습니다.'));
      }
    };
    xhr.onerror = () => reject(new Error('파일 업로드에 실패했습니다.'));
    xhr.send(form);
  });
}

export async function adminListRevisions(status = 'open') {
  return apiJson<{ items: ApiRevisionTicket[]; quotaDefault: number }>(
    `${API_ENDPOINTS.admin}?action=revisions&status=${encodeURIComponent(status)}`
  );
}

export async function adminGetRevision(ticketId: number) {
  return apiJson<ApiRevisionTicket>(
    `${API_ENDPOINTS.admin}?action=revision-detail&ticketId=${encodeURIComponent(String(ticketId))}`
  );
}

export async function adminSaveRevision(payload: Record<string, unknown>) {
  return apiJson<ApiRevisionTicket>(API_ENDPOINTS.admin, {
    method: 'POST',
    body: JSON.stringify({ action: 'revision-save', ...payload }),
  });
}
