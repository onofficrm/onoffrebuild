import { API_ENDPOINTS } from '../config/api';
import { apiJson } from './apiClient';
import type { ApiProject } from './projectService';
import type { ApiWebsiteOrder } from './websiteOrderService';

export async function adminListProjects(): Promise<ApiProject[]> {
  const data = await apiJson<{ projects: ApiProject[] }>(`${API_ENDPOINTS.admin}?action=projects`);
  return data.projects || [];
}

export async function adminListWebsiteOrders(): Promise<ApiWebsiteOrder[]> {
  const data = await apiJson<{ orders: ApiWebsiteOrder[] }>(
    `${API_ENDPOINTS.admin}?action=website-orders`
  );
  return data.orders || [];
}
