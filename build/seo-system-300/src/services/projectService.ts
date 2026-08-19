import { API_ENDPOINTS } from '../config/api';
import type { Project, StatusType } from '../types';
import { apiJson } from './apiClient';

export type ApiKeyword = {
  id?: number;
  keyword: string;
  priority?: number;
  target?: string;
};

export type ApiProject = {
  id: number;
  mbId: string;
  name: string;
  description: string;
  businessType: string;
  purposes: string[];
  domain: string;
  websiteStatus: string;
  domainStatus: string;
  primaryRegion: string;
  impressionsGoal: number;
  trafficGoal: number;
  contentGoal: number;
  referringDomainGoal: number;
  status: string;
  progress: number;
  isActive: number;
  keywords: ApiKeyword[];
  createdAt: string;
  updatedAt: string;
};

export type ProjectCreateInput = {
  name: string;
  description?: string;
  businessType?: string;
  purposes?: string[];
  domain?: string;
  websiteStatus?: string;
  domainStatus?: string;
  primaryRegion?: string;
  keywords?: Array<string | ApiKeyword>;
  impressionsGoal?: number;
  trafficGoal?: number;
  contentGoal?: number;
  referringDomainGoal?: number;
};

export function mapApiProjectToUi(row: ApiProject): Project {
  const created = (row.createdAt || '').slice(0, 10);
  const uiStatus: StatusType = row.isActive ? 'in_progress' : 'pending';
  return {
    id: String(row.id),
    name: row.name,
    domain: row.domain || '도메인 미정',
    niche: row.description || row.businessType || '',
    status: uiStatus,
    overallProgress: 0,
    currentStep: 'STEP 1 프로젝트 설정',
    nextGoal: '홈페이지 기획 및 SEO 로드맵',
    moduleProgress: {
      website: row.websiteStatus ? 20 : 0,
      seoSetup: 0,
      content: 0,
      backlink: 0,
      traffic: 0,
    },
    metrics: {
      googleImpressions: 0,
      impressionsGrowth: 0,
      googleClicks: 0,
      clicksGrowth: 0,
      registeredKeywords: row.keywords?.length || 0,
      contentCount: 0,
      referringDomains: 0,
      organicTraffic: 0,
    },
    gscConnected: false,
    gaConnected: false,
    createdAt: created || new Date().toISOString().slice(0, 10),
    websiteStatusLabel: row.websiteStatus || '',
    metricsAreDemo: true,
    roadmapIsDemo: true,
  };
}

export async function listProjects(): Promise<ApiProject[]> {
  const data = await apiJson<{ projects: ApiProject[] }>(API_ENDPOINTS.projects);
  return data.projects || [];
}

export async function getProject(id: string | number): Promise<ApiProject> {
  const url = `${API_ENDPOINTS.projects}?id=${encodeURIComponent(String(id))}`;
  return apiJson<ApiProject>(url);
}

export async function createProject(input: ProjectCreateInput): Promise<ApiProject> {
  return apiJson<ApiProject>(API_ENDPOINTS.projects, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function updateProject(id: string | number, input: Partial<ProjectCreateInput>): Promise<ApiProject> {
  return apiJson<ApiProject>(`${API_ENDPOINTS.projects}?id=${encodeURIComponent(String(id))}&action=update`, {
    method: 'POST',
    body: JSON.stringify({ ...input, action: 'update' }),
  });
}

export async function archiveProject(id: string | number): Promise<ApiProject> {
  return apiJson<ApiProject>(`${API_ENDPOINTS.projects}?id=${encodeURIComponent(String(id))}&action=archive`, {
    method: 'POST',
    body: JSON.stringify({ action: 'archive' }),
  });
}
