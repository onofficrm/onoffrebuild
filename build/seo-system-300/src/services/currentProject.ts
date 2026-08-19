import { CURRENT_PROJECT_STORAGE_KEY } from '../constants/seoSystem300';

export function readStoredProjectId(): string {
  try {
    return localStorage.getItem(CURRENT_PROJECT_STORAGE_KEY) || '';
  } catch {
    return '';
  }
}

export function writeStoredProjectId(id: string) {
  try {
    if (!id) localStorage.removeItem(CURRENT_PROJECT_STORAGE_KEY);
    else localStorage.setItem(CURRENT_PROJECT_STORAGE_KEY, id);
  } catch {
    /* ignore quota */
  }
}

export function pickCurrentProjectId(ownedIds: string[], preferred?: string): string {
  const stored = preferred || readStoredProjectId();
  if (stored && ownedIds.includes(stored)) return stored;
  if (ownedIds.length > 0) return ownedIds[0];
  return '';
}
