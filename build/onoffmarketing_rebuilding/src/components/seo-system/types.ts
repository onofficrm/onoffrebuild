export interface SeoServiceItem {
  id: string;
  name: string;
  subName: string;
  badge: string;
  role: string;
  url: string;
  iconName: string;
  color: string;
  accentColor: string;
  tagline: string;
  description: string;
  problemSolved: string;
  keyFeatures: {
    title: string;
    desc: string;
  }[];
  processStep: number;
  stats: {
    label: string;
    value: string;
    change?: string;
  }[];
  checklist: string[];
}

export interface PipelineStep {
  step: number;
  title: string;
  serviceName: string;
  serviceUrl: string;
  keyAction: string;
  whyCrucial: string;
  skipRisk: string;
  output: string;
}

export interface CaseStudy {
  id: string;
  clientCategory: string;
  title: string;
  period: string;
  challenge: string;
  solution: string;
  results: {
    label: string;
    before: string;
    after: string;
    increase: string;
  }[];
  appliedServices: string[];
}

export interface AuditResult {
  url: string;
  keyword: string;
  overallScore: number;
  domainScore: number;
  contentScore: number;
  backlinkScore: number;
  technicalScore: number;
  summary: string;
  recommendations: {
    category: string;
    serviceName: string;
    serviceUrl: string;
    action: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
  }[];
}
