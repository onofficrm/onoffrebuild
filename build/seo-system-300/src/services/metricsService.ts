import { API_ENDPOINTS } from '../config/api';
import { apiJson } from './apiClient';

export type MetricCell = { state: string; value: number | null };

export type MetricsSummary = {
  range: string;
  from: string;
  to: string;
  status: {
    configured: boolean;
    tablesReady: boolean;
    gscState: string;
    ga4State: string;
    connection: { connected: boolean; status: string; configured: boolean; googleEmailMasked?: string };
    gsc: { lastSuccessAt?: string; status?: string } | null;
    ga4: { lastSuccessAt?: string; status?: string } | null;
  };
  impressions: MetricCell;
  clicks: MetricCell;
  ctr: MetricCell;
  avgPosition: MetricCell;
  organicSessions: MetricCell;
  activeUsers: MetricCell;
  impressionsChangePct: number | null;
  clicksChangePct: number | null;
  organicSessionsChangePct: number | null;
  contents: MetricCell;
  referringDomains: MetricCell;
  seoHealthScore: { state: string; value: number | null };
};

export async function getMetricsSummary(projectId: string | number, range = '30d') {
  return apiJson<MetricsSummary>(
    `${API_ENDPOINTS.metrics}?projectId=${encodeURIComponent(String(projectId))}&range=${encodeURIComponent(range)}`
  );
}

export async function getMetricsTimeseries(projectId: string | number, range = '30d') {
  return apiJson<{
    gsc: Array<{ date: string; clicks: number; impressions: number; position: number }>;
    ga4: Array<{ date: string; organicSessions: number }>;
  }>(
    `${API_ENDPOINTS.metrics}?action=timeseries&projectId=${encodeURIComponent(String(projectId))}&range=${encodeURIComponent(range)}`
  );
}

export async function getMetricsQueries(projectId: string | number, range = '30d') {
  const data = await apiJson<{ queries: Array<Record<string, unknown>> }>(
    `${API_ENDPOINTS.metrics}?action=queries&projectId=${encodeURIComponent(String(projectId))}&range=${encodeURIComponent(range)}`
  );
  return data.queries || [];
}

export async function getMetricsPages(projectId: string | number, range = '30d') {
  const data = await apiJson<{ pages: Array<Record<string, unknown>> }>(
    `${API_ENDPOINTS.metrics}?action=pages&projectId=${encodeURIComponent(String(projectId))}&range=${encodeURIComponent(range)}`
  );
  return data.pages || [];
}

export async function getBeforeNow(projectId: string | number) {
  return apiJson<{
    before: { impressions: number; clicks: number } | null;
    now: { impressions: number; clicks: number } | null;
    ga4Before?: { organicSessions: number } | null;
    ga4Now?: { organicSessions: number } | null;
  }>(`${API_ENDPOINTS.metrics}?action=before-now&projectId=${encodeURIComponent(String(projectId))}`);
}

export async function getOpportunities(projectId: string | number) {
  const data = await apiJson<{ items: Array<{ rule: string; query: string; reason: string }> }>(
    `${API_ENDPOINTS.metrics}?action=opportunities&projectId=${encodeURIComponent(String(projectId))}`
  );
  return data.items || [];
}

export async function getCoachContext(projectId: string | number) {
  return apiJson<Record<string, unknown>>(
    `${API_ENDPOINTS.metrics}?action=coach-context&projectId=${encodeURIComponent(String(projectId))}`
  );
}

export function formatMetricCell(cell?: MetricCell) {
  if (!cell) return { label: '연결 필요', demo: false };
  if (cell.state !== 'ready' || cell.value === null) return { label: cell.state, demo: false };
  return { label: '', value: cell.value, demo: false };
}
