export type WebsitePresence = 'absent' | 'building' | 'present';

export function normalizeSiteUrl(raw?: string | null): string {
  const value = String(raw || '').trim();
  if (!value || value === '도메인 미정' || value === '아직 없음') return '';
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value.replace(/^\/+/, '')}`;
}

export function websitePreviewUrl(input: {
  previewUrl?: string | null;
  liveUrl?: string | null;
}): string {
  return normalizeSiteUrl(input.previewUrl) || normalizeSiteUrl(input.liveUrl);
}

export function websitePresence(input: {
  hasSubmittedOrder: boolean;
  hasLivePreview?: boolean;
}): WebsitePresence {
  if (!input.hasSubmittedOrder) return 'absent';
  if (input.hasLivePreview) return 'present';
  return 'building';
}
