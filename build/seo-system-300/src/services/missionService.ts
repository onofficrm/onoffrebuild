import { API_ENDPOINTS } from '../config/api';
import type { DailyMission, NavigationTab } from '../types';
import { apiJson } from './apiClient';

export type ApiMission = {
  id: number;
  projectId: number;
  roadmapTaskId: number;
  missionDate: string;
  status: string;
  sortOrder: number;
  title: string;
  description: string;
  completionType: string;
  relatedTool: string;
  estimatedMinutes: number;
  isCompleted: boolean;
};

function toolTab(tool: string): { tab: NavigationTab; sub?: string } {
  if (tool === 'website') return { tab: 'website', sub: 'status' };
  if (tool === 'content') return { tab: 'tools', sub: 'content' };
  if (tool === 'backlink') return { tab: 'tools', sub: 'backlink' };
  if (tool === 'traffic') return { tab: 'tools', sub: 'traffic' };
  if (tool === 'catchdomain') return { tab: 'tools', sub: 'catchdomain' };
  return { tab: 'roadmap' };
}

export function mapMissionsToUi(rows: ApiMission[]): DailyMission[] {
  return rows.map((m) => {
    const target = toolTab(m.relatedTool);
    return {
      id: String(m.id),
      title: m.title || '오늘의 미션',
      description: m.description || '',
      category: 'seo_setup',
      stepNumber: 0,
      xpReward: 0,
      isCompleted: m.isCompleted,
      dueDate: m.missionDate,
      targetTab: target.tab,
      targetSubTab: target.sub,
      completionType: m.completionType,
      roadmapTaskId: m.roadmapTaskId,
    };
  });
}

export async function getTodayMissions(projectId: string | number) {
  return apiJson<{ date: string; timezone: string; missions: ApiMission[] }>(
    `${API_ENDPOINTS.missions}?projectId=${encodeURIComponent(String(projectId))}`
  );
}

export async function completeMission(missionId: number, projectId: number) {
  return apiJson<{ missions: ApiMission[] }>(API_ENDPOINTS.missions, {
    method: 'POST',
    body: JSON.stringify({ action: 'complete', missionId, projectId }),
  });
}

export async function reopenMission(missionId: number, projectId: number) {
  return apiJson<{ missions: ApiMission[] }>(API_ENDPOINTS.missions, {
    method: 'POST',
    body: JSON.stringify({ action: 'reopen', missionId, projectId }),
  });
}
