export type NavigationTab =
  | 'dashboard'
  | 'projects'
  | 'website'
  | 'roadmap'
  | 'missions'
  | 'tools'
  | 'reports'
  | 'integrations'
  | 'curriculum'
  | 'ai_coach'
  | 'notifications'
  | 'help'
  | 'account';

export type WebsiteSubTab = 'order' | 'status' | 'revision';

export type ToolSubTab = 'catchdomain' | 'content' | 'backlink' | 'traffic';

export type StatusType = 'completed' | 'in_progress' | 'needs_check' | 'error' | 'pending';

export interface Project {
  id: string;
  name: string;
  domain: string;
  niche: string;
  status: StatusType;
  overallProgress: number; // 0-100
  currentStep: string;
  currentStepNumber?: number;
  nextGoal: string;
  moduleProgress: {
    website: number;
    seoSetup: number;
    content: number;
    backlink: number;
    traffic: number;
  };
  metrics: {
    googleImpressions: number;
    impressionsGrowth: number;
    googleClicks: number;
    clicksGrowth: number;
    registeredKeywords: number;
    contentCount: number;
    referringDomains: number;
    organicTraffic: number;
  };
  gscConnected: boolean;
  gaConnected: boolean;
  createdAt: string;
  websiteStatusLabel?: string;
  metricsAreDemo?: boolean;
  roadmapIsDemo?: boolean;
}

export interface WebsiteOrder {
  id: string;
  projectId: string;
  projectName: string;
  siteType: 'blog' | 'affiliate' | 'business' | 'landing' | 'ecommerce';
  targetNiche: string;
  targetKeywords: string[];
  theme: string;
  referenceUrls: string[];
  specialRequests: string;
  status: 'planning' | 'design' | 'publishing' | 'seo_setup' | 'review' | 'delivered';
  currentStageName: string;
  progress: number;
  eta: string;
  assignedEngineer: string;
  liveUrl?: string;
  orderDate: string;
  milestones: {
    id: string;
    title: string;
    description: string;
    status: StatusType;
    completedAt?: string;
  }[];
}

export interface RevisionTicket {
  id: string;
  orderId: string;
  title: string;
  category: 'layout' | 'content' | 'seo_tag' | 'speed' | 'design' | 'other';
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  description: string;
  createdAt: string;
  updatedAt: string;
  devReply?: string;
}

export interface RoadmapStep {
  id: number;
  stepNumber: number;
  title: string;
  subTitle: string;
  description: string;
  status: StatusType;
  progress: number;
  keyOutcome: string;
  connectedTool?: ToolSubTab | 'website';
  durationEst: string;
  checklist: {
    id: string;
    text: string;
    completed: boolean;
    required: boolean;
    helpTip?: string;
  }[];
  lectureModuleId?: number;
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  category: 'seo_setup' | 'content' | 'backlink' | 'audit' | 'tool';
  stepNumber: number;
  xpReward: number;
  isCompleted: boolean;
  dueDate: string;
  targetTab: NavigationTab;
  targetSubTab?: string;
  completionType?: string;
  roadmapTaskId?: number;
}

export interface DomainItem {
  id: string;
  domain: string;
  da: number;
  pa: number;
  spamScore: number;
  backlinksCount: number;
  referringDomainsCount: number;
  archiveAge: string;
  niche: string;
  price: string;
  status: 'available' | 'auction' | 'reserved' | 'purchased';
  seoScore: number;
}

export interface ContentItem {
  id: string;
  title: string;
  targetKeyword: string;
  secondaryKeywords: string[];
  wordCount: number;
  seoScore: number;
  status: 'published' | 'scheduled' | 'draft' | 'generating';
  publishDate: string;
  url?: string;
  views: number;
}

export interface BacklinkItem {
  id: string;
  targetUrl: string;
  anchorText: string;
  sourceDomain: string;
  sourceType: 'PBN' | 'Editorial Guest Post' | 'Niche Directory' | 'Web 2.0' | 'Forum';
  sourceDA: number;
  status: 'indexed' | 'crawled' | 'pending' | 'lost';
  placedDate: string;
  indexedDate?: string;
}

export interface TrafficCampaign {
  id: string;
  title: string;
  targetKeyword: string;
  targetUrl: string;
  dailyTargetVisitors: number;
  currentVisitors: number;
  geoTarget: string;
  avgTimeOnSite: string;
  bounceRateControl: string;
  status: 'active' | 'paused' | 'completed';
  startDate: string;
}

export interface AiCoachInsight {
  id: string;
  title: string;
  summary: string;
  impact: 'high' | 'medium' | 'low';
  category: 'content' | 'backlink' | 'technical' | 'keyword';
  actionRecommendations: string[];
  recommendedSteps: {
    title: string;
    actionTab: NavigationTab;
    actionSubTab?: string;
  }[];
}

export interface ActivityLog {
  id: string;
  action: string;
  category: string;
  timestamp: string;
  status: StatusType;
}

export interface CurriculumLesson {
  id: number;
  stepNumber: number;
  moduleTitle: string;
  title: string;
  duration: string;
  videoUrl?: string;
  completed: boolean;
  resources: {
    title: string;
    type: 'template' | 'sheet' | 'pdf' | 'link';
    downloadUrl: string;
  }[];
}

export interface TaskWorkLog {
  id: string;
  taskId: number | string;
  taskTitle: string;
  url: string;
  targetKeyword: string;
  publishDate: string;
  notes: string;
  screenshotUrl?: string;
  screenshotFileId?: number;
  relatedTool: 'catchdomain' | 'content' | 'backlink' | 'traffic' | 'gsc' | 'website' | 'direct' | 'other';
  status: 'completed';
  createdAt: string;
}

export interface SeoActivityTimelineItem {
  id: string;
  date: string; // e.g. '2026.08.19'
  time?: string;
  category: 'content' | 'backlink' | 'gsc' | 'website' | 'traffic' | 'catchdomain' | 'keyword';
  title: string; // e.g. '콘텐츠 발행'
  summary: string; // e.g. '세부 가족여행 추천'
  details?: {
    url?: string;
    keyword?: string;
    metrics?: string;
    notes?: string;
    screenshotUrl?: string;
    referringDomains?: number;
    backlinksCount?: number;
  };
  connectedTool?: 'catchdomain' | 'content' | 'backlink' | 'traffic' | 'gsc' | 'website';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timeAgo: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  read: boolean;
  actionTab?: NavigationTab;
  actionSubTab?: string;
}

export type AdminTab = 'dashboard' | 'inbox' | 'kanban' | 'students' | 'integrations';

export type WebsiteKanbanStage =
  | 'new_order'
  | 'awaiting_materials'
  | 'planning'
  | 'design'
  | 'development'
  | 'qa'
  | 'revision'
  | 'completed';

export interface AdminPriorityItem {
  id: string;
  studentId: string;
  studentName: string;
  type: 'missing_material' | 'inactive' | 'review_pending' | 'traffic_drop' | 'milestone_reached' | 'custom';
  title: string;
  description: string;
  daysElapsed?: number;
  urgentLevel: 'urgent' | 'warning' | 'normal' | 'success';
  ctaText: string;
  relatedProjectId: string;
  actionType: 'open_materials' | 'open_student' | 'open_review' | 'open_seo' | 'send_guide';
}

export interface WebsiteKanbanCard {
  id: string;
  studentId: string;
  studentName: string;
  projectName: string;
  domain: string;
  orderDate: string;
  stage: WebsiteKanbanStage;
  progress: number;
  materialsStatus: string;
  materialsReadyPercent: number;
  priority: 'high' | 'medium' | 'low';
  assignee: string;
  brief: {
    siteType: string;
    structure: string[];
    designStyle: string;
    brandColor: string;
    referenceUrls: string[];
    features: string[];
    keywords: string[];
  };
  notes: { id: string; author: string; date: string; content: string }[];
}

export interface StudentSummary {
  id: string;
  name: string;
  cohort: string;
  email: string;
  phone: string;
  projectName: string;
  domain: string;
  currentStepNumber: number;
  currentStepTitle: string;
  roadmapProgress: number;
  lastActive: string;
  lastActiveDays: number;
  websiteStatus: '자료대기' | '기획중' | '디자인중' | '개발중' | '검수대기' | '수정중' | '완료';
  seoHealthScore: number;
  seoTrend: 'growth' | 'stable' | 'drop';
  needsAdminCheck: boolean;
  adminCheckReason?: string;
  impressions: number;
  clicks: number;
  rankingKeywords: number;
  contentsCount: number;
  referringDomains: number;
  adminNotes?: string[];
}
