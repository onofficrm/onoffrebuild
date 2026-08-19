import { API_ENDPOINTS } from '../config/api';
import { apiJson } from './apiClient';

export type ApiMenuItem = {
  id: number;
  parentId: number;
  label: string;
  slug: string;
  sortOrder: number;
};

export type ApiFeature = {
  key: string;
  label: string;
  isAiRecommended: boolean;
};

export type ApiReference = {
  id: number;
  url: string;
  memo: string;
  sortOrder: number;
};

export type ApiWebsiteFile = {
  id: number;
  orderId: number;
  projectId: number;
  category: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  memo: string;
  status: string;
  createdAt: string;
  downloadUrl: string;
};

export type ApiWebsiteOrder = {
  id: number;
  projectId: number;
  mbId: string;
  siteType: string;
  purposes: string[];
  industry: string;
  siteName: string;
  brandName: string;
  phone: string;
  email: string;
  region: string;
  businessDescription: string;
  currentUrl: string;
  designStyle: string;
  primaryColor: string;
  customColor: string;
  targetRegion: string;
  status: string;
  progress: number;
  isDraft: boolean;
  wizardStep: string;
  submittedAt: string | null;
  createdAt: string;
  updatedAt: string;
  menus: ApiMenuItem[];
  features: ApiFeature[];
  references: ApiReference[];
  files: ApiWebsiteFile[];
  projectName?: string;
  projectDomain?: string;
  kanbanColumn?: string;
  history?: Array<{ toStatus: string; createdAt: string; fromStatus?: string }>;
};

export type WebsiteOrderSaveInput = {
  projectId: number;
  orderId?: number;
  wizardStep?: string;
  siteType?: string;
  purposes?: string[];
  industry?: string;
  siteName?: string;
  brandName?: string;
  phone?: string;
  email?: string;
  region?: string;
  businessDescription?: string;
  currentUrl?: string;
  designStyle?: string;
  primaryColor?: string;
  customColor?: string;
  targetRegion?: string;
  menus?: Array<{
    id?: string;
    label?: string;
    title?: string;
    parentId?: string | number;
    isSubItem?: boolean;
    parentTitle?: string;
    slug?: string;
  }>;
  features?: string[];
  references?: Array<string | { url: string; memo?: string }>;
  keywords?: string[];
  progress?: number;
};

export async function getCurrentWebsiteOrder(projectId: string | number): Promise<ApiWebsiteOrder | null> {
  const data = await apiJson<{ order: ApiWebsiteOrder | null }>(
    `${API_ENDPOINTS.website}?projectId=${encodeURIComponent(String(projectId))}`
  );
  return data.order || null;
}

export async function ensureWebsiteDraft(projectId: string | number): Promise<ApiWebsiteOrder> {
  return apiJson<ApiWebsiteOrder>(API_ENDPOINTS.website, {
    method: 'POST',
    body: JSON.stringify({ action: 'draft', projectId: Number(projectId) }),
  });
}

export async function saveWebsiteOrder(input: WebsiteOrderSaveInput): Promise<ApiWebsiteOrder> {
  return apiJson<ApiWebsiteOrder>(API_ENDPOINTS.website, {
    method: 'POST',
    body: JSON.stringify({ action: 'save', ...input }),
  });
}

export async function submitWebsiteOrder(input: WebsiteOrderSaveInput): Promise<ApiWebsiteOrder> {
  return apiJson<ApiWebsiteOrder>(`${API_ENDPOINTS.website}?action=submit`, {
    method: 'POST',
    body: JSON.stringify({ action: 'submit', ...input }),
  });
}
