import { API_ENDPOINTS } from '../config/api';
import { apiJson } from './apiClient';

export async function getGoogleConnection() {
  return apiJson<{
    configured: boolean;
    tablesReady?: boolean;
    connection: { connected: boolean; status: string; googleEmailMasked?: string; configured?: boolean };
  }>(API_ENDPOINTS.google);
}

export async function startGoogleConnect() {
  return apiJson<{ authUrl: string }>(API_ENDPOINTS.google, {
    method: 'POST',
    body: JSON.stringify({ action: 'connect' }),
  });
}

export async function disconnectGoogle() {
  return apiJson<{ message: string }>(API_ENDPOINTS.google, {
    method: 'POST',
    body: JSON.stringify({ action: 'disconnect' }),
  });
}

export async function listGscSites(projectId: number) {
  return apiJson<{
    projectDomain: string;
    sites: Array<{ siteUrl: string; recommended: boolean; mismatch: boolean }>;
  }>(`${API_ENDPOINTS.gsc}?projectId=${projectId}`);
}

export async function selectGscSite(projectId: number, siteUrl: string) {
  return apiJson<{ domainMismatch: boolean }>(API_ENDPOINTS.gsc, {
    method: 'POST',
    body: JSON.stringify({ action: 'select', projectId, siteUrl }),
  });
}

export async function syncGsc(projectId: number) {
  return apiJson(API_ENDPOINTS.gsc, {
    method: 'POST',
    body: JSON.stringify({ action: 'sync', projectId }),
  });
}

export async function listGa4Properties(projectId: number) {
  return apiJson<{
    properties: Array<{ propertyId: string; displayName: string; accountName: string }>;
    manualEntryAllowed: boolean;
  }>(`${API_ENDPOINTS.ga4}?projectId=${projectId}`);
}

export async function selectGa4Property(projectId: number, propertyId: string, displayName = '') {
  return apiJson(API_ENDPOINTS.ga4, {
    method: 'POST',
    body: JSON.stringify({ action: 'select', projectId, propertyId, displayName }),
  });
}

export async function syncGa4(projectId: number) {
  return apiJson(API_ENDPOINTS.ga4, {
    method: 'POST',
    body: JSON.stringify({ action: 'sync', projectId }),
  });
}

export async function adminDiagnostics() {
  return apiJson<{ coreDb: string; roadmapDb: string; metricsDb: string; toolsDb?: string; googleConfigured: boolean; aiConfigured?: boolean }>(
    `${API_ENDPOINTS.admin}?action=diagnostics`
  );
}

export async function adminIntegrations(filter = '') {
  const q = filter ? `&filter=${encodeURIComponent(filter)}` : '';
  const data = await apiJson<{ items: Array<Record<string, unknown>> }>(
    `${API_ENDPOINTS.admin}?action=integrations${q}`
  );
  return data.items || [];
}

export async function adminSyncMetrics(projectId: number, provider: string) {
  return apiJson(API_ENDPOINTS.admin, {
    method: 'POST',
    body: JSON.stringify({ action: 'sync-metrics', projectId, provider }),
  });
}
