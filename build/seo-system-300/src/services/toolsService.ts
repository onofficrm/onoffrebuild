import { API_ENDPOINTS } from '../config/api';
import { apiJson } from './apiClient';

export type ToolKey = 'catchdomain' | 'content' | 'backlink' | 'traffic';

export async function getToolRegistry() {
  return apiJson<{ tools: Array<Record<string, unknown>>; aiConfigured: boolean }>(
    `${API_ENDPOINTS.tools}?action=registry`
  );
}

export async function getToolsStatus(projectId: string | number) {
  return apiJson<{ tools: Record<string, Record<string, unknown>>; registry: Array<Record<string, unknown>> }>(
    `${API_ENDPOINTS.tools}?projectId=${encodeURIComponent(String(projectId))}`
  );
}

export async function getUnifiedSummary(projectId: string | number) {
  return apiJson<Record<string, unknown>>(
    `${API_ENDPOINTS.tools}?action=summary&projectId=${encodeURIComponent(String(projectId))}`
  );
}

export async function saveManualToolResult(projectId: number, toolKey: ToolKey, payload: Record<string, unknown>) {
  return apiJson(API_ENDPOINTS.tools, {
    method: 'POST',
    body: JSON.stringify({ action: 'manual-result', projectId, toolKey, payload }),
  });
}

export async function applyCatchDomain(projectId: number, domain: string, confirm: boolean) {
  return apiJson(API_ENDPOINTS.tools, {
    method: 'POST',
    body: JSON.stringify({ action: 'apply-domain', projectId, domain, confirm }),
  });
}

export async function getAiAnalysis(projectId: string | number) {
  return apiJson<{
    configured: boolean;
    cached: boolean;
    data: {
      summary: string;
      health: Record<string, number | null>;
      insights: string[];
      actions: Array<{ title: string; reason: string; priority: string; tool: string; roadmapTaskKey?: string | null }>;
      warnings: string[];
    } | null;
    createdAt: string | null;
    dataAsOf: string | null;
    healthRuleBased: Record<string, unknown>;
  }>(`${API_ENDPOINTS.ai}?projectId=${encodeURIComponent(String(projectId))}`);
}

export async function runAiAnalyze(projectId: number, force = false) {
  return apiJson(API_ENDPOINTS.ai, {
    method: 'POST',
    body: JSON.stringify({ action: 'analyze', projectId, force }),
  });
}

export async function runAiChat(projectId: number, message: string) {
  return apiJson<{ data: { summary: string; actions: Array<{ title: string; reason: string; priority: string; tool: string; roadmapTaskKey?: string | null }> } }>(
    API_ENDPOINTS.ai,
    {
      method: 'POST',
      body: JSON.stringify({ action: 'chat', projectId, message }),
    }
  );
}

export async function addAiMission(projectId: number, roadmapTaskKey: string) {
  return apiJson(API_ENDPOINTS.ai, {
    method: 'POST',
    body: JSON.stringify({ action: 'add-mission', projectId, roadmapTaskKey }),
  });
}

export async function adminToolHealth() {
  const data = await apiJson<{ items: Array<Record<string, unknown>> }>(`${API_ENDPOINTS.admin}?action=tool-health`);
  return data.items || [];
}

export async function adminAiMonitor() {
  const data = await apiJson<{ items: Array<Record<string, unknown>> }>(`${API_ENDPOINTS.admin}?action=ai-monitor`);
  return data.items || [];
}

export function toolCtaTab(tool: string): { tab: 'tools' | 'reports' | 'roadmap'; sub?: string } {
  const t = tool.toLowerCase();
  if (t.includes('backlink')) return { tab: 'tools', sub: 'backlink' };
  if (t.includes('content')) return { tab: 'tools', sub: 'content' };
  if (t.includes('catch') || t.includes('domain')) return { tab: 'tools', sub: 'catchdomain' };
  if (t.includes('traffic')) return { tab: 'tools', sub: 'traffic' };
  if (t.includes('gsc') || t.includes('report') || t.includes('page')) return { tab: 'reports' };
  return { tab: 'roadmap' };
}
