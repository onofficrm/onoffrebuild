import {
  createEmptyExpiredDomainMission,
  type ExpiredDomainMissionDraft,
  type ExpiredDomainMissionRepository,
} from './expiredDomainMission';

/** LOCAL-only namespace. No authenticated user id is available in this shell. */
const STORAGE_KEY = 'seosys300_local_only::lesson-2::expired-domain-comparison::v1';

function isMissionDraft(value: unknown): value is ExpiredDomainMissionDraft {
  if (!value || typeof value !== 'object') return false;
  const draft = value as Partial<ExpiredDomainMissionDraft>;
  return (
    draft.version === 1 &&
    draft.lessonId === 'lesson-2' &&
    draft.missionId === 'expired-domain-comparison' &&
    Array.isArray(draft.candidates) &&
    draft.candidates.length === 3
  );
}

export const localExpiredDomainMissionRepository: ExpiredDomainMissionRepository = {
  load() {
    if (typeof window === 'undefined') return createEmptyExpiredDomainMission();
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) return createEmptyExpiredDomainMission();
      const parsed: unknown = JSON.parse(stored);
      return isMissionDraft(parsed) ? parsed : createEmptyExpiredDomainMission();
    } catch {
      return createEmptyExpiredDomainMission();
    }
  },

  save(draft) {
    const saved: ExpiredDomainMissionDraft = {
      ...draft,
      updatedAt: new Date().toISOString(),
    };
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    }
    return saved;
  },
};
