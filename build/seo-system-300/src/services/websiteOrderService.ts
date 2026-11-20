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

const PREVIEWABLE_IMAGE = /\.(jpe?g|png|gif|webp)$/i;

export function websiteImagePreviewUrl(file: { originalName?: string; mimeType?: string; downloadUrl?: string }): string {
  const name = file.originalName || '';
  const mime = (file.mimeType || '').toLowerCase();
  const safeMime = mime === 'image/jpeg' || mime === 'image/jpg' || mime === 'image/png' || mime === 'image/gif' || mime === 'image/webp';
  const safeName = PREVIEWABLE_IMAGE.test(name) && !/\.(svg|heic|heif)$/i.test(name);
  if (!safeMime && !safeName) return '';
  return file.downloadUrl || '';
}

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
  previewUrl?: string;
  designStyle: string;
  primaryColor: string;
  customColor: string;
  targetRegion: string;
  secondaryStyle?: string;
  colorPreset?: string;
  accentColor?: string;
  contacts?: Record<string, string>;
  extraRequest?: string;
  businessInfoNote?: string;
  boardRequests?: string[];
  programRequests?: string[];
  requestChecklist?: {
    board?: Record<string, string>;
    program?: Record<string, string>;
  };
  materialsRequest?: {
    title?: string;
    body?: string;
    categories?: string[];
    requestedAt?: string;
  } | null;
  status: string;
  progress: number;
  processStep?: number;
  processTotal?: number;
  materialsReadiness?: number;
  materialsStatus?: string;
  isDraft: boolean;
  wizardStep: string;
  submittedAt: string | null;
  createdAt: string;
  updatedAt: string;
  orderNo?: string;
  menus: ApiMenuItem[];
  features: ApiFeature[];
  references: ApiReference[];
  files: ApiWebsiteFile[];
  projectName?: string;
  projectDomain?: string;
  kanbanColumn?: string;
  history?: Array<{ toStatus: string; createdAt: string; fromStatus?: string }>;
  customerUpdates?: Array<{
    id?: string;
    message: string;
    createdAt?: string;
    files?: Array<{ id: number; name: string; size?: number }>;
  }>;
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
  contacts?: Record<string, string>;
  extraRequest?: string;
  businessInfoNote?: string;
  boardRequests?: string[];
  programRequests?: string[];
  secondaryStyle?: string;
  colorPreset?: string;
  accentColor?: string;
};

export async function getCurrentWebsiteOrder(projectId: string | number): Promise<ApiWebsiteOrder | null> {
  const data = await getWebsiteOrderBundle(projectId);
  return data.order;
}

export async function getWebsiteOrderBundle(projectId: string | number): Promise<{
  order: ApiWebsiteOrder | null;
  orders: ApiWebsiteOrder[];
}> {
  const data = await apiJson<{ order: ApiWebsiteOrder | null; orders?: ApiWebsiteOrder[] }>(
    `${API_ENDPOINTS.website}?projectId=${encodeURIComponent(String(projectId))}`
  );
  const orders = Array.isArray(data.orders) ? data.orders : data.order ? [data.order] : [];
  return { order: data.order || null, orders };
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

export async function appendWebsiteMaterials(
  input: {
    orderId?: number;
    projectId?: number;
    businessInfoNote?: string;
    extraRequest?: string;
    boardRequests?: string[];
    programRequests?: string[];
    references?: Array<string | { url: string; memo?: string }>;
    contacts?: Record<string, string>;
  }
): Promise<ApiWebsiteOrder> {
  return apiJson<ApiWebsiteOrder>(API_ENDPOINTS.website, {
    method: 'POST',
    body: JSON.stringify({ action: 'append_materials', ...input }),
  });
}
