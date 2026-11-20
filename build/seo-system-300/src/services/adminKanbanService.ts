import { API_ENDPOINTS } from '../config/api';
import type { AdminPriorityItem, StudentSummary, WebsiteKanbanCard, WebsiteKanbanStage } from '../types';
import { apiJson } from './apiClient';
import type { ApiProject } from './projectService';
import type { ApiWebsiteOrder } from './websiteOrderService';

export async function adminKanbanOrders(): Promise<ApiWebsiteOrder[]> {
  const data = await apiJson<{ orders: ApiWebsiteOrder[] }>(`${API_ENDPOINTS.admin}?action=kanban`);
  return data.orders || [];
}

export async function adminOrderDetail(id: number): Promise<ApiWebsiteOrder> {
  return apiJson<ApiWebsiteOrder>(`${API_ENDPOINTS.admin}?action=order-detail&id=${id}`);
}

export async function adminChangeOrderStatus(orderId: number, status: string, memo = '') {
  return apiJson<ApiWebsiteOrder>(API_ENDPOINTS.admin, {
    method: 'POST',
    body: JSON.stringify({ action: 'change-status', orderId, status, memo }),
  });
}

export async function adminAddNote(projectId: number, orderId: number, note: string) {
  return apiJson(API_ENDPOINTS.admin, {
    method: 'POST',
    body: JSON.stringify({ action: 'note', projectId, orderId, note }),
  });
}

export async function adminRequestMoreInfo(
  orderId: number,
  payload: { title: string; body: string; categories?: string[]; adminMemo?: string }
) {
  return apiJson<ApiWebsiteOrder>(API_ENDPOINTS.admin, {
    method: 'POST',
    body: JSON.stringify({ action: 'request-more-info', orderId, ...payload }),
  });
}

export async function adminSavePreviewUrl(orderId: number, previewUrl: string) {
  return apiJson<ApiWebsiteOrder>(API_ENDPOINTS.admin, {
    method: 'POST',
    body: JSON.stringify({ action: 'preview-url', orderId, previewUrl }),
  });
}

export async function adminSaveRequestChecklist(
  orderId: number,
  requestChecklist: { board?: Record<string, string>; program?: Record<string, string> }
) {
  return apiJson<ApiWebsiteOrder>(API_ENDPOINTS.admin, {
    method: 'POST',
    body: JSON.stringify({ action: 'request-checklist', orderId, requestChecklist }),
  });
}

export async function adminInbox() {
  const data = await apiJson<{ items: Array<Record<string, unknown>> }>(`${API_ENDPOINTS.admin}?action=inbox`);
  return data.items || [];
}

export async function adminProjectList(): Promise<ApiProject[]> {
  const data = await apiJson<{ projects: ApiProject[] }>(`${API_ENDPOINTS.admin}?action=projects`);
  return data.projects || [];
}

function websiteStatusLabel(status: string): StudentSummary['websiteStatus'] {
  const s = (status || '').toLowerCase();
  if (s === 'need_more_info' || s === 'material_waiting') return '자료대기';
  if (s === 'design') return '디자인중';
  if (s === 'development') return '개발중';
  if (s === 'internal_review' || s === 'customer_review') return '검수대기';
  if (s === 'revision') return '수정중';
  if (s === 'completed') return '완료';
  return '기획중';
}

export function mapAdminProjectsToStudents(projects: ApiProject[], orders: ApiWebsiteOrder[]): StudentSummary[] {
  const latest = new Map<string, ApiProject>();
  for (const p of projects) {
    const prev = latest.get(p.mbId);
    if (!prev || p.id > prev.id) latest.set(p.mbId, p);
  }
  return [...latest.values()].map((p) => {
    const order = orders.find((o) => o.projectId === p.id);
    return {
      id: p.mbId,
      name: p.mbId,
      cohort: '',
      email: '',
      phone: '',
      projectName: p.name,
      domain: p.domain,
      currentStepNumber: 1,
      currentStepTitle: '',
      roadmapProgress: p.progress,
      lastActive: (p.updatedAt || '').slice(0, 10),
      lastActiveDays: 0,
      websiteStatus: websiteStatusLabel(order?.status || p.websiteStatus || ''),
      seoHealthScore: 0,
      seoTrend: 'stable',
      needsAdminCheck: false,
      impressions: 0,
      clicks: 0,
      rankingKeywords: 0,
      contentsCount: 0,
      referringDomains: 0,
    };
  });
}

export async function adminStudentDetail(mbId: string) {
  return apiJson<{ mbId: string; projects: unknown[] }>(
    `${API_ENDPOINTS.admin}?action=student-detail&mbId=${encodeURIComponent(mbId)}`
  );
}

export function mapOrderToKanbanCard(order: ApiWebsiteOrder): WebsiteKanbanCard {
  const stage = (order.kanbanColumn || 'new_order') as WebsiteKanbanStage;
  return {
    id: String(order.id),
    studentId: order.mbId,
    studentName: order.mbId,
    projectName: order.projectName || order.siteName || '프로젝트',
    domain: order.projectDomain || '',
    orderDate: (order.submittedAt || order.createdAt || '').slice(0, 10),
    stage,
    progress: order.progress || 0,
    materialsStatus: `${(order.files || []).length}개 자료 제출`,
    materialsReadyPercent: order.materialsReadiness || 0,
    priority: 'medium',
    assignee: '',
    brief: {
      siteType: order.siteType || '',
      structure: (order.menus || []).map((m) => m.label),
      designStyle: order.designStyle || '',
      brandColor: order.primaryColor || order.customColor || '',
      referenceUrls: (order.references || []).map((r) => r.url),
      features: (order.features || []).map((f) => f.key),
      keywords: [],
      businessDescription: order.businessDescription || '',
      businessInfoNote: order.businessInfoNote || '',
      extraRequest: order.extraRequest || '',
      boardRequests: order.boardRequests || [],
      programRequests: order.programRequests || [],
      requestChecklist: {
        board: (order.requestChecklist?.board || {}) as Record<string, string>,
        program: (order.requestChecklist?.program || {}) as Record<string, string>,
      },
      contacts: order.contacts || {},
    },
    notes: [],
    orderNo: order.orderNo || '',
    mbId: order.mbId,
    previewUrl: order.previewUrl || '',
    files: (order.files || []).map((f) => ({
      id: f.id,
      originalName: f.originalName,
      downloadUrl: f.downloadUrl,
      category: f.category,
      memo: f.memo,
    })),
  };
}

export function mapInboxToPriority(items: Array<Record<string, unknown>>): AdminPriorityItem[] {
  return items.map((it) => {
    const actionTab = String(it.actionTab || '');
    const type = (it.type as AdminPriorityItem['type']) || 'custom';
    let actionType: AdminPriorityItem['actionType'] = 'open_student';
    if (actionTab === 'geo' || String(it.title || '').includes('막힘')) {
      actionType = 'open_geo';
    } else if (type === 'missing_material') {
      actionType = 'open_materials';
    } else if (type === 'review_pending') {
      actionType = 'open_review';
    }
    return {
      id: String(it.id || ''),
      studentId: String(it.mbId || ''),
      studentName: String(it.mbId || ''),
      type,
      title: String(it.title || ''),
      description: String(it.description || ''),
      urgentLevel: (it.urgentLevel as AdminPriorityItem['urgentLevel']) || 'normal',
      ctaText: actionType === 'open_geo' ? 'GEO 막힘 처리' : '자세히 보기',
      relatedProjectId: String(it.projectId || ''),
      actionType,
    };
  });
}

export const KANBAN_TO_STATUS: Record<WebsiteKanbanStage, string> = {
  new_order: 'submitted',
  awaiting_materials: 'material_waiting',
  planning: 'planning',
  design: 'design',
  development: 'development',
  qa: 'customer_review',
  revision: 'revision',
  completed: 'completed',
};
