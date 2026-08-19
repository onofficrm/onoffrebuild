import { API_ENDPOINTS } from '../config/api';
import type { ActivityLog, StatusType } from '../types';
import { apiJson } from './apiClient';

export type ApiActivity = {
  id: number;
  projectId: number;
  activityType: string;
  title: string;
  description: string;
  createdAt: string;
};

export function mapActivitiesToUi(rows: ApiActivity[]): ActivityLog[] {
  return rows.map((a) => ({
    id: String(a.id),
    action: a.title,
    category: a.activityType,
    timestamp: a.createdAt,
    status: 'completed' as StatusType,
  }));
}

export async function listActivities(projectId: string | number, limit = 30, before = 0) {
  const params = new URLSearchParams({
    projectId: String(projectId),
    limit: String(limit),
  });
  if (before > 0) params.set('before', String(before));
  const data = await apiJson<{ activities: ApiActivity[] }>(`${API_ENDPOINTS.activity}?${params.toString()}`);
  return data.activities || [];
}
