import { API_ENDPOINTS } from '../config/api';
import type { RoadmapStep, StatusType } from '../types';
import { apiJson, ensureCsrfToken } from './apiClient';

export type ApiRoadmapTask = {
  id: number;
  taskKey: string;
  title: string;
  description: string;
  helpText: string;
  estimatedMinutes: number;
  relatedTool: string;
  completionType: string;
  isRequired: boolean;
  status: string;
  completedAt: string | null;
};

export type ApiRoadmapStep = {
  id: number;
  stepKey: string;
  stepNumber: number;
  title: string;
  description: string;
  progress: number;
  status: string;
  tasks: ApiRoadmapTask[];
};

export type ApiRoadmap = {
  progress: number;
  currentStep: string;
  currentStepNumber: number;
  nextGoal: string;
  steps: ApiRoadmapStep[];
};

export type ApiTaskResult = {
  id: number;
  projectId: number;
  roadmapTaskId: number;
  resultUrl: string;
  keyword: string;
  resultDate: string;
  memo: string;
  screenshotFileId: number;
  relatedTool: string;
  createdAt: string;
};

function uiStatus(status: string): StatusType {
  if (status === 'completed') return 'completed';
  if (status === 'in_progress') return 'in_progress';
  return 'pending';
}

export function mapRoadmapToUi(data: ApiRoadmap): RoadmapStep[] {
  return (data.steps || []).map((step) => ({
    id: step.id,
    stepNumber: step.stepNumber,
    title: step.title,
    subTitle: '',
    description: step.description,
    status: uiStatus(step.status),
    progress: step.progress,
    keyOutcome: step.tasks.filter((t) => t.status === 'completed').map((t) => t.title).slice(0, 2).join(', '),
    connectedTool: undefined,
    durationEst: '',
    checklist: step.tasks.map((t) => ({
      id: String(t.id),
      text: t.title,
      completed: t.status === 'completed',
      required: t.isRequired,
      helpTip: t.completionType === 'result_required' ? '작업 결과를 저장한 뒤 완료할 수 있습니다.' : t.helpText || undefined,
    })),
  }));
}

export async function getRoadmap(projectId: string | number): Promise<ApiRoadmap> {
  return apiJson<ApiRoadmap>(`${API_ENDPOINTS.roadmap}?projectId=${encodeURIComponent(String(projectId))}`);
}

export async function startRoadmapTask(projectId: number, taskId: number) {
  return apiJson<{ roadmap: ApiRoadmap }>(API_ENDPOINTS.roadmap, {
    method: 'POST',
    body: JSON.stringify({ action: 'start', projectId, taskId }),
  });
}

export async function completeRoadmapTask(projectId: number, taskId: number) {
  return apiJson<{ roadmap: ApiRoadmap }>(API_ENDPOINTS.roadmap, {
    method: 'POST',
    body: JSON.stringify({ action: 'complete', projectId, taskId }),
  });
}

export async function reopenRoadmapTask(projectId: number, taskId: number) {
  return apiJson<{ roadmap: ApiRoadmap }>(API_ENDPOINTS.roadmap, {
    method: 'POST',
    body: JSON.stringify({ action: 'reopen', projectId, taskId }),
  });
}

export async function addTaskResult(
  projectId: number,
  taskId: number,
  payload: { resultUrl?: string; keyword?: string; resultDate?: string; memo?: string; relatedTool?: string; screenshotFileId?: number }
) {
  return apiJson<ApiTaskResult>(`${API_ENDPOINTS.roadmap}?action=result`, {
    method: 'POST',
    body: JSON.stringify({ action: 'result', projectId, taskId, ...payload }),
  });
}

export async function uploadTaskScreenshot(projectId: number, file: File) {
  const token = await ensureCsrfToken();
  const form = new FormData();
  form.append('file', file);
  form.append('projectId', String(projectId));
  form.append('action', 'screenshot');
  form.append('token', token);
  return apiJson<{ id: number }>(API_ENDPOINTS.roadmap, { method: 'POST', body: form });
}

export async function listTaskResults(projectId: string | number, taskId?: number) {
  const q = taskId ? `&taskId=${taskId}` : '';
  const data = await apiJson<{ results: ApiTaskResult[] }>(
    `${API_ENDPOINTS.roadmap}?action=results&projectId=${encodeURIComponent(String(projectId))}${q}`
  );
  return data.results || [];
}
