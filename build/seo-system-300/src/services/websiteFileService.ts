import { API_ENDPOINTS } from '../config/api';
import { apiJson, ensureCsrfToken } from './apiClient';
import type { ApiWebsiteFile } from './websiteOrderService';

export async function listWebsiteFiles(orderId: string | number): Promise<ApiWebsiteFile[]> {
  const data = await apiJson<{ files: ApiWebsiteFile[] }>(
    `${API_ENDPOINTS.website}?action=files&orderId=${encodeURIComponent(String(orderId))}`
  );
  return data.files || [];
}

export async function uploadWebsiteFile(
  orderId: string | number,
  category: string,
  file: File,
  memo = '',
  onProgress?: (pct: number) => void
): Promise<ApiWebsiteFile> {
  const token = await ensureCsrfToken();
  const form = new FormData();
  form.append('file', file);
  form.append('orderId', String(orderId));
  form.append('category', category);
  form.append('memo', memo);
  form.append('token', token);
  form.append('action', 'upload');

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_ENDPOINTS.website}?action=upload`);
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
          resolve(body.data as ApiWebsiteFile);
          return;
        }
        const message =
          body?.error?.message || '파일 업로드에 실패했습니다. 다시 시도해주세요.';
        reject(new Error(message));
      } catch {
        reject(new Error('파일 업로드에 실패했습니다. 다시 시도해주세요.'));
      }
    };
    xhr.onerror = () => reject(new Error('파일 업로드에 실패했습니다. 다시 시도해주세요.'));
    xhr.send(form);
  });
}

export async function deleteWebsiteFile(fileId: string | number): Promise<void> {
  await apiJson(`${API_ENDPOINTS.website}?action=delete_file`, {
    method: 'POST',
    body: JSON.stringify({ action: 'delete_file', fileId: Number(fileId) }),
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
