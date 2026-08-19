import type { AdminTab, NavigationTab, ToolSubTab, WebsiteSubTab } from '../types';

export const STUDENT_PATH: Record<NavigationTab, string> = {
  dashboard: '/dashboard',
  projects: '/projects',
  website: '/website/status',
  roadmap: '/roadmap',
  missions: '/today',
  tools: '/tools',
  reports: '/report',
  integrations: '/integrations',
  curriculum: '/lessons',
  ai_coach: '/ai-coach',
  notifications: '/notifications',
  help: '/help',
  account: '/account',
};

export const WEBSITE_SUB_PATH: Record<WebsiteSubTab, string> = {
  order: '/website/order',
  status: '/website/status',
  revision: '/website/revisions',
};

export const TOOL_SUB_PATH: Record<ToolSubTab, string> = {
  catchdomain: '/tools/catchdomain',
  content: '/tools/content',
  backlink: '/tools/backlink',
  traffic: '/tools/traffic',
};

export const ADMIN_PATH: Record<AdminTab, string> = {
  dashboard: '/admin',
  inbox: '/admin/inbox',
  kanban: '/admin/kanban',
  students: '/admin/students',
  integrations: '/admin/integrations',
};

export function studentPath(tab: NavigationTab, subTab?: string): string {
  if (tab === 'website') {
    return WEBSITE_SUB_PATH[(subTab as WebsiteSubTab) || 'status'] || WEBSITE_SUB_PATH.status;
  }
  if (tab === 'tools') {
    return TOOL_SUB_PATH[(subTab as ToolSubTab) || 'catchdomain'] || TOOL_SUB_PATH.catchdomain;
  }
  return STUDENT_PATH[tab] || STUDENT_PATH.dashboard;
}

export function projectPath(projectId: string): string {
  return `/projects/${encodeURIComponent(projectId)}`;
}

export type ParsedPortalPath =
  | {
      mode: 'student';
      tab: NavigationTab;
      websiteSubTab: WebsiteSubTab;
      toolSubTab: ToolSubTab;
      projectId?: string;
    }
  | {
      mode: 'admin';
      adminTab: AdminTab;
    };

export function parsePortalPath(pathname: string): ParsedPortalPath {
  const path = pathname.replace(/\/+$/, '') || '/';
  const parts = path.split('/').filter(Boolean);

  if (parts[0] === 'admin') {
    const sub = parts[1];
    const adminTab: AdminTab =
      sub === 'inbox' || sub === 'kanban' || sub === 'students' || sub === 'integrations' ? sub : 'dashboard';
    return { mode: 'admin', adminTab };
  }

  const websiteSubTab: WebsiteSubTab = 'status';
  const toolSubTab: ToolSubTab = 'catchdomain';

  if (parts[0] === 'website') {
    const sub = parts[1];
    const mapped: WebsiteSubTab =
      sub === 'order' ? 'order' : sub === 'revisions' || sub === 'revision' ? 'revision' : 'status';
    return { mode: 'student', tab: 'website', websiteSubTab: mapped, toolSubTab };
  }

  if (parts[0] === 'tools') {
    const sub = parts[1];
    const mapped: ToolSubTab =
      sub === 'content' || sub === 'backlink' || sub === 'traffic' || sub === 'catchdomain'
        ? sub
        : 'catchdomain';
    return { mode: 'student', tab: 'tools', websiteSubTab, toolSubTab: mapped };
  }

  if (parts[0] === 'projects' && parts[1]) {
    return {
      mode: 'student',
      tab: 'projects',
      websiteSubTab,
      toolSubTab,
      projectId: decodeURIComponent(parts[1]),
    };
  }

  const first = parts[0] || 'dashboard';
  const tabBySegment: Record<string, NavigationTab> = {
    dashboard: 'dashboard',
    projects: 'projects',
    website: 'website',
    roadmap: 'roadmap',
    today: 'missions',
    missions: 'missions',
    tools: 'tools',
    report: 'reports',
    reports: 'reports',
    integrations: 'integrations',
    lessons: 'curriculum',
    curriculum: 'curriculum',
    'ai-coach': 'ai_coach',
    notifications: 'notifications',
    help: 'help',
    account: 'account',
  };

  return {
    mode: 'student',
    tab: tabBySegment[first] || 'dashboard',
    websiteSubTab,
    toolSubTab,
  };
}
