import { API_ENDPOINTS } from '../config/api';
import type { NavigationTab, NotificationItem } from '../types';
import { apiJson } from './apiClient';

export type ApiNotification = {
  id: number;
  projectId: number;
  orderId: number;
  eventType: string;
  title: string;
  message: string;
  severity: string;
  read: boolean;
  actionTab: string;
  actionSubTab: string;
  createdAt: string;
};

function severityToType(severity: string): NotificationItem['type'] {
  if (severity === 'success') return 'success';
  if (severity === 'warning') return 'warning';
  if (severity === 'alert' || severity === 'error') return 'alert';
  return 'info';
}

function formatTimeAgo(createdAt: string): string {
  const ts = Date.parse(createdAt.replace(' ', 'T'));
  if (Number.isNaN(ts)) return createdAt;
  const diffMin = Math.max(0, Math.floor((Date.now() - ts) / 60000));
  if (diffMin < 1) return '방금';
  if (diffMin < 60) return `${diffMin}분 전`;
  const hours = Math.floor(diffMin / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  return `${days}일 전`;
}

export function mapNotificationsToUi(rows: ApiNotification[]): NotificationItem[] {
  return rows.map((n) => ({
    id: String(n.id),
    title: n.title,
    message: n.message,
    timeAgo: formatTimeAgo(n.createdAt),
    type: severityToType(n.severity),
    read: Boolean(n.read),
    actionTab: (n.actionTab || undefined) as NavigationTab | undefined,
    actionSubTab: n.actionSubTab || undefined,
  }));
}

export async function listNotifications(limit = 40) {
  const params = new URLSearchParams({ limit: String(limit) });
  return apiJson<{ notifications: ApiNotification[]; unreadCount: number; tablesReady?: boolean }>(
    `${API_ENDPOINTS.notifications}?${params.toString()}`
  );
}

export async function markAllNotificationsRead() {
  return apiJson<{ notifications: ApiNotification[]; unreadCount: number }>(API_ENDPOINTS.notifications, {
    method: 'POST',
    body: JSON.stringify({ action: 'mark-all-read' }),
  });
}
