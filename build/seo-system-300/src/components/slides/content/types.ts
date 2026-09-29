import type { NavigationTab } from '../../../types';

export interface SlideDetailBlock {
  heading: string;
  body: string[];
}

export interface SlideExplanationSections {
  summary: string;
  why?: string[];
  onoffUse?: string[];
  action?: string[];
  details?: SlideDetailBlock[];
}

export type DomainSearchTarget = 'naver' | 'google' | 'both';
export type DomainFieldAvailability = 'available' | 'manual' | 'not-provided';
export type DomainMetricSourceKind =
  | 'education-portal'
  | 'catchdomain-public'
  | 'not-verified';
export type DomainMetricPriority = 0 | 1 | 2 | 3 | 4 | 5;

export interface DomainPriorityItem {
  label: string;
  stars: 0 | 2 | 3 | 4 | 5;
  whereToCheck: string;
  availability: DomainFieldAvailability;
}

export interface DomainTargetTip {
  target: DomainSearchTarget;
  label: string;
  headline: string;
  summary: string[];
  priorities: DomainPriorityItem[];
  checklist: string[];
}

export interface DomainWhereToCheck {
  label: string;
  field: string;
  location: string;
  availability: DomainFieldAvailability;
}

export interface DomainMetricMapItem {
  field: string;
  uiLabel: string;
  providerApi: string;
  meaning: string;
  studentUse: string;
  naverPriority: DomainMetricPriority;
  googlePriority: DomainMetricPriority;
  bothPriority: DomainMetricPriority;
  sourceKind: DomainMetricSourceKind;
  availability: DomainFieldAvailability;
  evidence: string;
}

export interface ExpiredDomainTips {
  title: string;
  disclaimer: string;
  targets: DomainTargetTip[];
  whereToCheck: DomainWhereToCheck[];
  exceptions: string[];
  statuses: Array<{
    status: 'GOOD CANDIDATE' | 'REVIEW' | 'RISK';
    label: string;
    description: string;
  }>;
}

export interface SlideLearningContent {
  id: string;
  lessonId: string;
  lessonNumber?: number;
  order: number;
  shortTitle: string;
  visualKeywords: string[];
  explanation: SlideExplanationSections;
  expiredDomainTips?: ExpiredDomainTips;
  expiredDomainTipsMode?: 'guide' | 'checklist' | 'mission';
  relatedLabel?: string;
  relatedTab?: NavigationTab;
  relatedSubTab?: string;
}
