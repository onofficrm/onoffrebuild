export interface TimelineItem {
  year: string;
  title: string;
  description: string;
  tag?: string;
}

export interface RoadmapStep {
  step: string;
  title: string;
  serviceName?: string;
  serviceUrl?: string;
  description: string;
  benefitBadge?: string;
  details: string[];
}

export interface SystemItem {
  id: string;
  title: string;
  serviceUrl?: string;
  subtitle: string;
  features: string[];
  mockupType: 'domain' | 'website' | 'backlink' | 'content_traffic';
  previewStats: { label: string; value: string }[];
}

export interface FaqItem {
  question: string;
  answer: string;
  category?: string;
}

export interface ValueItem {
  title: string;
  valueText: string;
  isProvidedFee?: boolean;
  highlight?: boolean;
}
