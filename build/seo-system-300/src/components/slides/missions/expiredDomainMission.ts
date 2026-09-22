export type ExpiredDomainTarget = 'NAVER' | 'GOOGLE' | 'BOTH';
export type DomainAssessment = 'unrated' | 'good' | 'review' | 'risk';
export type DomainFinalDecision =
  | 'unrated'
  | 'candidate'
  | 'review'
  | 'exclude'
  | 'no_purchase';

export interface ExpiredDomainCandidate {
  id: 'candidate-1' | 'candidate-2' | 'candidate-3';
  domain: string;
  target: ExpiredDomainTarget;
  brandFit: DomainAssessment;
  topicRelevance: DomainAssessment;
  history: DomainAssessment;
  referringDomains: DomainAssessment;
  anchor: DomainAssessment;
  risk: DomainAssessment;
  metrics: string;
  memo: string;
  finalDecision: DomainFinalDecision;
  reason: string;
}

export interface ExpiredDomainMissionDraft {
  version: 1;
  lessonId: 'lesson-2';
  missionId: 'expired-domain-comparison';
  candidates: [
    ExpiredDomainCandidate,
    ExpiredDomainCandidate,
    ExpiredDomainCandidate,
  ];
  updatedAt: string | null;
}

function emptyCandidate(index: 1 | 2 | 3): ExpiredDomainCandidate {
  return {
    id: `candidate-${index}`,
    domain: '',
    target: 'BOTH',
    brandFit: 'unrated',
    topicRelevance: 'unrated',
    history: 'unrated',
    referringDomains: 'unrated',
    anchor: 'unrated',
    risk: 'unrated',
    metrics: '',
    memo: '',
    finalDecision: 'unrated',
    reason: '',
  };
}

export function createEmptyExpiredDomainMission(): ExpiredDomainMissionDraft {
  return {
    version: 1,
    lessonId: 'lesson-2',
    missionId: 'expired-domain-comparison',
    candidates: [emptyCandidate(1), emptyCandidate(2), emptyCandidate(3)],
    updatedAt: null,
  };
}

export interface ExpiredDomainMissionRepository {
  load(): ExpiredDomainMissionDraft;
  save(draft: ExpiredDomainMissionDraft): ExpiredDomainMissionDraft;
}
