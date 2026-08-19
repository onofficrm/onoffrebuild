import React, { useState, useRef } from 'react';
import {
  NavigationTab,
  WebsiteSubTab,
  ToolSubTab,
  Project,
  WebsiteOrder,
  RevisionTicket,
  ActivityLog,
  NotificationItem,
  TaskWorkLog,
  SeoActivityTimelineItem,
  AdminTab,
  AdminPriorityItem,
  WebsiteKanbanCard,
  StudentSummary
} from './types';
import {useLocation, useNavigate, Navigate} from 'react-router-dom';
import { loadStudentDemoState } from './services/studentDemoService';
import {
  createProject,
  listProjects,
  mapApiProjectToUi,
  type ProjectCreateInput,
} from './services/projectService';
import { pickCurrentProjectId, writeStoredProjectId } from './services/currentProject';
import {
  ensureWebsiteDraft,
  getCurrentWebsiteOrder,
  saveWebsiteOrder,
  submitWebsiteOrder,
  type ApiWebsiteOrder,
  type WebsiteOrderSaveInput,
} from './services/websiteOrderService';
import { deleteWebsiteFile, formatFileSize, replaceWebsiteFile, updateWebsiteFile, uploadWebsiteFile } from './services/websiteFileService';
import { addTaskResult, completeRoadmapTask, getRoadmap, mapRoadmapToUi, reopenRoadmapTask, uploadTaskScreenshot, type ApiRoadmap } from './services/roadmapService';
import { completeMission, getTodayMissions, mapMissionsToUi, reopenMission } from './services/missionService';
import { listActivities, mapActivitiesToUi } from './services/activityService';
import {
  adminChangeOrderStatus,
  adminInbox,
  adminKanbanOrders,
  adminProjectList,
  adminRequestMoreInfo,
  KANBAN_TO_STATUS,
  mapAdminProjectsToStudents,
  mapInboxToPriority,
  mapOrderToKanbanCard,
} from './services/adminKanbanService';
import { ApiRequestError } from './services/apiClient';
import {
  getBeforeNow,
  getMetricsPages,
  getMetricsQueries,
  getMetricsSummary,
  getMetricsTimeseries,
  getOpportunities,
  type MetricsSummary,
} from './services/metricsService';
import { getUnifiedSummary } from './services/toolsService';
import { ADMIN_PATH, parsePortalPath, projectPath, studentPath } from './config/routes';
import { MockDataBanner } from './components/common/MockDataBanner';
import { useAuth } from './auth/AuthContext';
import { AuthLoadingScreen } from './components/auth/AuthLoadingScreen';
import { LoginRequiredScreen } from './components/auth/LoginRequiredScreen';
import { AdminForbiddenScreen } from './components/auth/AdminForbiddenScreen';
import { LaunchPreparingScreen } from './components/auth/LaunchPreparingScreen';

// Layout components
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { AdminSidebar } from './components/layout/AdminSidebar';
import { AdminHeader } from './components/layout/AdminHeader';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';

// View components
import { DashboardView } from './components/dashboard/DashboardView';
import { RoadmapView } from './components/roadmap/RoadmapView';
import { MissionsView } from './components/missions/MissionsView';
import { ToolsView } from './components/tools/ToolsView';
import { CurriculumView } from './components/curriculum/CurriculumView';
import { NotificationsView } from './components/notifications/NotificationsView';
import { HelpView } from './components/help/HelpView';
import { AccountView } from './components/account/AccountView';
import { OnboardingWizardModal } from './components/onboarding/OnboardingWizardModal';
import { Modal } from './components/common/Modal';
import { Button } from './components/common/Button';

const WebsiteView = React.lazy(() =>
  import('./components/website/WebsiteView').then((m) => ({ default: m.WebsiteView }))
);
const ProjectsView = React.lazy(() =>
  import('./components/projects/ProjectsView').then((m) => ({ default: m.ProjectsView }))
);
const ReportsView = React.lazy(() =>
  import('./components/reports/ReportsView').then((m) => ({ default: m.ReportsView }))
);
const AiCoachView = React.lazy(() =>
  import('./components/ai-coach/AiCoachView').then((m) => ({ default: m.AiCoachView }))
);
const AdminDashboardView = React.lazy(() =>
  import('./components/admin/AdminDashboardView').then((m) => ({ default: m.AdminDashboardView }))
);
const PriorityInboxView = React.lazy(() =>
  import('./components/admin/PriorityInboxView').then((m) => ({ default: m.PriorityInboxView }))
);
const WebsiteKanbanView = React.lazy(() =>
  import('./components/admin/WebsiteKanbanView').then((m) => ({ default: m.WebsiteKanbanView }))
);
const StudentDirectoryView = React.lazy(() =>
  import('./components/admin/StudentDirectoryView').then((m) => ({ default: m.StudentDirectoryView }))
);
const StudentDetailModal = React.lazy(() =>
  import('./components/admin/StudentDetailModal').then((m) => ({ default: m.StudentDetailModal }))
);
const WebsiteOrderDetailModal = React.lazy(() =>
  import('./components/admin/WebsiteOrderDetailModal').then((m) => ({ default: m.WebsiteOrderDetailModal }))
);
const IntegrationsView = React.lazy(() =>
  import('./components/integrations/IntegrationsView').then((m) => ({ default: m.IntegrationsView }))
);
const AdminIntegrationsView = React.lazy(() =>
  import('./components/admin/AdminIntegrationsView').then((m) => ({ default: m.AdminIntegrationsView }))
);

const UI_CATEGORY_FROM_API: Record<string, string> = {
  logo: 'logo',
  company: 'company_intro',
  hero: 'hero_photos',
  service: 'product_photos',
  price: 'price_table',
  business: 'business_info',
  contact: 'contact_channels',
  sns: 'sns_links',
  brochure: 'brochure',
  other: 'other_files',
};

const API_CATEGORY_FROM_UI: Record<string, string> = {
  logo: 'logo',
  company_intro: 'company',
  hero_photos: 'hero',
  product_photos: 'service',
  price_table: 'price',
  business_info: 'business',
  contact_channels: 'contact',
  sns_links: 'sns',
  brochure: 'brochure',
  other_files: 'other',
};

function RouteFallback() {
  return (
    <div className="space-y-3 py-6" role="status" aria-label="화면 불러오는 중">
      <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse" />
      <div className="h-40 bg-white border border-slate-200 rounded-2xl animate-pulse" />
    </div>
  );
}

const studentDemo = loadStudentDemoState();

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { loading, authenticated, isAdmin, launchMode, launchAllowed } = useAuth();
  const parsed = parsePortalPath(location.pathname);

  const appMode = parsed.mode;
  const adminTab: AdminTab = parsed.mode === 'admin' ? parsed.adminTab : 'dashboard';
  const activeTab: NavigationTab = parsed.mode === 'student' ? parsed.tab : 'dashboard';
  const activeWebsiteSubTab: WebsiteSubTab =
    parsed.mode === 'student' ? parsed.websiteSubTab : 'status';
  const activeToolSubTab: ToolSubTab =
    parsed.mode === 'student' ? parsed.toolSubTab : 'catchdomain';
  const urlProjectId = parsed.mode === 'student' ? parsed.projectId : undefined;

  const setActiveTab = (tab: NavigationTab) => {
    navigate(studentPath(tab));
  };
  const setActiveWebsiteSubTab = (subTab: WebsiteSubTab) => {
    navigate(studentPath('website', subTab));
  };
  const setActiveToolSubTab = (subTab: ToolSubTab) => {
    navigate(studentPath('tools', subTab));
  };
  const setAdminTab = (tab: AdminTab) => {
    navigate(ADMIN_PATH[tab]);
  };
  const setAppMode = (mode: 'student' | 'admin') => {
    navigate(mode === 'admin' ? ADMIN_PATH.dashboard : studentPath('dashboard'));
  };

  // Admin Data State (Builder demo fixtures)
  const [adminPriorityItems, setAdminPriorityItems] = useState<AdminPriorityItem[]>([]);
  const [kanbanCards, setKanbanCards] = useState<WebsiteKanbanCard[]>([]);
  const [students, setStudents] = useState<StudentSummary[]>([]);

  // Admin Modal States
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<StudentSummary | null>(null);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [selectedCardForModal, setSelectedCardForModal] = useState<WebsiteKanbanCard | null>(null);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);

  // Layout UI State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOnboardingWizardOpen, setIsOnboardingWizardOpen] = useState(false);
  const [isGlobalNewProjectModalOpen, setIsGlobalNewProjectModalOpen] = useState(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);

  // Global Keyboard Shortcut for Cmd+K / Ctrl+K
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsGlobalSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Application Data State
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [projectsError, setProjectsError] = useState('');
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [liveOrder, setLiveOrder] = useState<ApiWebsiteOrder | null>(null);
  const [liveOrderError, setLiveOrderError] = useState('');
  const [orderSaveError, setOrderSaveError] = useState('');
  const [orderSaveStatus, setOrderSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const orderSavePendingRef = useRef<Record<string, unknown> | null>(null);
  const orderSaveBusyRef = useRef(false);
  const [uploadError, setUploadError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [websiteOrder, setWebsiteOrder] = useState<WebsiteOrder>(studentDemo.websiteOrder);
  const [revisions, setRevisions] = useState<RevisionTicket[]>(studentDemo.revisions);
  const [roadmapSteps, setRoadmapSteps] = useState<typeof studentDemo.roadmapSteps>([]);
  const [missions, setMissions] = useState<typeof studentDemo.missions>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [roadmapError, setRoadmapError] = useState('');
  const [missionsError, setMissionsError] = useState('');
  const [activityError, setActivityError] = useState('');
  const [adminError, setAdminError] = useState('');
  const [notifications, setNotifications] = useState<NotificationItem[]>(studentDemo.notifications);
  const [taskWorkLogs, setTaskWorkLogs] = useState<TaskWorkLog[]>(studentDemo.taskWorkLogs);
  const [seoTimelineItems, setSeoTimelineItems] = useState<SeoActivityTimelineItem[]>(studentDemo.seoTimelineItems);
  const [metricsSummary, setMetricsSummary] = useState<MetricsSummary | null>(null);
  const [metricsTimeseries, setMetricsTimeseries] = useState<
    Array<{ date: string; impressions: number; clicks: number; traffic?: number; position?: number }>
  >([]);
  const [reportQueries, setReportQueries] = useState<Array<Record<string, unknown>>>([]);
  const [reportPages, setReportPages] = useState<Array<Record<string, unknown>>>([]);
  const [reportOpps, setReportOpps] = useState<Array<{ rule: string; query: string; reason: string }>>([]);
  const [beforeNow, setBeforeNow] = useState<Awaited<ReturnType<typeof getBeforeNow>> | null>(null);
  const [metricsError, setMetricsError] = useState('');
  const [metricsRange, setMetricsRange] = useState('30d');
  const [unifiedSummary, setUnifiedSummary] = useState<Record<string, unknown> | null>(null);
  const [toolStatus, setToolStatus] = useState<Record<string, Record<string, unknown>>>({});

  // New Project Form State for quick modal
  const [newProjName, setNewProjName] = useState('');
  const [newProjDomain, setNewProjDomain] = useState('');
  const [newProjNiche, setNewProjNiche] = useState('');

  const applyRoadmap = (data: ApiRoadmap) => {
    setRoadmapSteps(mapRoadmapToUi(data) as typeof studentDemo.roadmapSteps);
    setActiveProject((prev) =>
      prev
        ? {
            ...prev,
            overallProgress: data.progress,
            currentStep: data.currentStep,
            nextGoal: data.nextGoal,
            currentStepNumber: data.currentStepNumber,
            roadmapIsDemo: false,
          }
        : prev
    );
  };

  const handleSaveTaskLog = async (newLog: Omit<TaskWorkLog, 'id' | 'createdAt' | 'status'>) => {
    if (!activeProject) return;
    const taskId = typeof newLog.taskId === 'number' ? newLog.taskId : parseInt(String(newLog.taskId), 10);
    if (Number.isNaN(taskId)) return;
    try {
      await addTaskResult(Number(activeProject.id), taskId, {
        resultUrl: newLog.url,
        keyword: newLog.targetKeyword,
        resultDate: newLog.publishDate.replace(/\./g, '-').slice(0, 10),
        memo: newLog.notes,
        relatedTool: newLog.relatedTool,
        screenshotFileId: newLog.screenshotFileId,
      });
      const res = await completeRoadmapTask(Number(activeProject.id), taskId);
      applyRoadmap(res.roadmap);
      const acts = await listActivities(activeProject.id, 20);
      setActivities(mapActivitiesToUi(acts));
    } catch (err) {
      setRoadmapError(err instanceof ApiRequestError ? err.message : '저장 중 문제가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleToggleMission = async (missionId: string) => {
    if (!activeProject) return;
    const current = missions.find((m) => m.id === missionId);
    if (!current) return;
    if (!current.isCompleted && current.completionType === 'result_required') {
      setMissionsError('작업 결과를 저장한 뒤 완료할 수 있습니다.');
      handleNavigate('roadmap');
      return;
    }
    try {
      const res = current.isCompleted
        ? await reopenMission(Number(missionId), Number(activeProject.id))
        : await completeMission(Number(missionId), Number(activeProject.id));
      setMissions(mapMissionsToUi(res.missions));
      const rm = await getRoadmap(activeProject.id);
      applyRoadmap(rm);
      const acts = await listActivities(activeProject.id, 20);
      setActivities(mapActivitiesToUi(acts));
    } catch (err) {
      setMissionsError(err instanceof ApiRequestError ? err.message : '저장 중 문제가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleToggleChecklistItem = async (stepId: number, checkId: string) => {
    if (!activeProject) return;
    const step = roadmapSteps.find((s) => s.id === stepId);
    const item = step?.checklist.find((c) => c.id === checkId);
    if (!item) return;
    try {
      const res = item.completed
        ? await reopenRoadmapTask(Number(activeProject.id), Number(checkId))
        : await completeRoadmapTask(Number(activeProject.id), Number(checkId));
      applyRoadmap(res.roadmap);
    } catch (err) {
      setRoadmapError(err instanceof ApiRequestError ? err.message : '저장 중 문제가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleAddRevision = (
    newRev: Omit<RevisionTicket, 'id' | 'createdAt' | 'updatedAt' | 'status'>
  ) => {
    const revItem: RevisionTicket = {
      ...newRev,
      id: `rev-${String(revisions.length + 1).padStart(2, '0')}`,
      status: 'pending',
      createdAt: '2026-08-18 (오늘)',
      updatedAt: '2026-08-18'
    };
    setRevisions([revItem, ...revisions]);
  };

  const handleSubmitNewOrder = (orderData: Partial<WebsiteOrder>) => {
    const updated: WebsiteOrder = {
      ...websiteOrder,
      ...orderData,
      id: `ord-${Date.now().toString().slice(-8)}`,
      status: 'planning',
      currentStageName: '기획 및 키워드 검토중',
      progress: 20,
      eta: '접수 후 3~5일'
    };
    setWebsiteOrder(updated);
  };

  const handleAddNewProject = async (projData: Partial<Project>) => {
    setProjectsError('');
    try {
      const created = await createProject({
        name: projData.name || '새 SEO 프로젝트',
        domain: projData.domain,
        description: projData.niche,
      });
      const mapped = mapApiProjectToUi(created);
      setProjects((prev) => [mapped, ...prev]);
      setActiveProject(mapped);
      writeStoredProjectId(mapped.id);
      navigate(projectPath(mapped.id));
    } catch (err) {
      setProjectsError(err instanceof ApiRequestError ? err.message : '저장 중 문제가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleWizardComplete = async (payload: ProjectCreateInput) => {
    setProjectsError('');
    try {
      const created = await createProject(payload);
      const mapped = mapApiProjectToUi(created);
      setProjects((prev) => [mapped, ...prev]);
      setActiveProject(mapped);
      writeStoredProjectId(mapped.id);
      setIsOnboardingWizardOpen(false);
      navigate(projectPath(mapped.id));
    } catch (err) {
      setProjectsError(err instanceof ApiRequestError ? err.message : '저장 중 문제가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleNavigate = (tab: NavigationTab, subTab?: string) => {
    navigate(studentPath(tab, subTab));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loadProjects = React.useCallback(async () => {
    setProjectsLoading(true);
    setProjectsError('');
    try {
      const rows = await listProjects();
      const mapped = rows.map(mapApiProjectToUi);
      setProjects(mapped);
      const nextId = pickCurrentProjectId(
        mapped.map((p) => p.id),
        urlProjectId
      );
      const next = mapped.find((p) => p.id === nextId) || null;
      setActiveProject(next);
      writeStoredProjectId(next ? next.id : '');
    } catch (err) {
      setProjects([]);
      setActiveProject(null);
      writeStoredProjectId('');
      setProjectsError(err instanceof ApiRequestError ? err.message : '불러오기 실패. 다시 시도해주세요.');
    } finally {
      setProjectsLoading(false);
    }
  }, [urlProjectId]);

  React.useEffect(() => {
    if (!authenticated || !launchAllowed) return;
    void loadProjects();
  }, [authenticated, loadProjects]);

  const loadWebsiteOrder = React.useCallback(async () => {
    if (!activeProject) {
      setLiveOrder(null);
      return;
    }
    setLiveOrderError('');
    try {
      const order = await getCurrentWebsiteOrder(activeProject.id);
      setLiveOrder(order);
    } catch (err) {
      setLiveOrder(null);
      setLiveOrderError(err instanceof ApiRequestError ? err.message : '불러오기 실패. 다시 시도해주세요.');
    }
  }, [activeProject]);

  React.useEffect(() => {
    if (!authenticated || !launchAllowed) return;
    void loadWebsiteOrder();
  }, [authenticated, loadWebsiteOrder]);

  const loadRoadmapBundle = React.useCallback(async () => {
    if (!activeProject) {
      setRoadmapSteps([]);
      setMissions([]);
      setActivities([]);
      return;
    }
    setRoadmapError('');
    setMissionsError('');
    setActivityError('');
    const pid = activeProject.id;
    try {
      const rm = await getRoadmap(pid);
      if (pid !== activeProject.id) return;
      applyRoadmap(rm);
    } catch (err) {
      setRoadmapSteps([]);
      setRoadmapError(err instanceof ApiRequestError ? err.message : '불러오기 실패. 다시 시도해주세요.');
    }
    try {
      const ms = await getTodayMissions(pid);
      setMissions(mapMissionsToUi(ms.missions));
    } catch (err) {
      setMissions([]);
      setMissionsError(err instanceof ApiRequestError ? err.message : '불러오기 실패. 다시 시도해주세요.');
    }
    try {
      const acts = await listActivities(pid, 20);
      setActivities(mapActivitiesToUi(acts));
    } catch (err) {
      setActivities([]);
      setActivityError(err instanceof ApiRequestError ? err.message : '불러오기 실패. 다시 시도해주세요.');
    }
  }, [activeProject]);

  React.useEffect(() => {
    if (!authenticated || !launchAllowed) return;
    void loadRoadmapBundle();
  }, [authenticated, loadRoadmapBundle]);

  const loadMetricsBundle = React.useCallback(async () => {
    if (!activeProject) {
      setMetricsSummary(null);
      setMetricsTimeseries([]);
      setReportQueries([]);
      setReportPages([]);
      setReportOpps([]);
      setBeforeNow(null);
      return;
    }
    setMetricsError('');
    setMetricsSummary(null);
    setMetricsTimeseries([]);
    const pid = activeProject.id;
    try {
      const [sum, ts, qs, ps, bn, op] = await Promise.all([
        getMetricsSummary(pid, metricsRange),
        getMetricsTimeseries(pid, metricsRange),
        getMetricsQueries(pid, metricsRange),
        getMetricsPages(pid, metricsRange),
        getBeforeNow(pid),
        getOpportunities(pid),
      ]);
      if (pid !== activeProject.id) return;
      setMetricsSummary(sum);
      const gscRows = ts.gsc || [];
      const gaRows = ts.ga4 || [];
      const dates = Array.from(new Set([...gscRows.map((r) => r.date), ...gaRows.map((r) => r.date)])).sort();
      const gscMap = new Map(gscRows.map((r) => [r.date, r]));
      const gaMap = new Map(gaRows.map((r) => [r.date, r]));
      setMetricsTimeseries(
        dates.map((date) => ({
          date,
          impressions: gscMap.get(date)?.impressions || 0,
          clicks: gscMap.get(date)?.clicks || 0,
          traffic: gaMap.get(date)?.organicSessions || 0,
          position: gscMap.get(date)?.position,
        }))
      );
      setReportQueries(qs);
      setReportPages(ps);
      setBeforeNow(bn);
      setReportOpps(op);
    } catch (err) {
      setMetricsSummary(null);
      setMetricsTimeseries([]);
      setReportQueries([]);
      setReportPages([]);
      setBeforeNow(null);
      setReportOpps([]);
      setMetricsError(err instanceof ApiRequestError ? err.message : '불러오기 실패. 다시 시도해주세요.');
    }
  }, [activeProject, metricsRange]);

  React.useEffect(() => {
    if (!authenticated || !launchAllowed) return;
    void loadMetricsBundle();
  }, [authenticated, loadMetricsBundle]);

  const loadUnified = React.useCallback(async () => {
    if (!activeProject) {
      setUnifiedSummary(null);
      setToolStatus({});
      return;
    }
    try {
      const uni = await getUnifiedSummary(activeProject.id);
      setUnifiedSummary(uni);
      setToolStatus({
        catchdomain: (uni.catchDomain as Record<string, unknown>) || {},
        content: (uni.content as Record<string, unknown>) || {},
        backlink: (uni.backlink as Record<string, unknown>) || {},
        traffic: (uni.traffic as Record<string, unknown>) || {},
      });
    } catch {
      setUnifiedSummary(null);
      setToolStatus({});
    }
  }, [activeProject]);

  React.useEffect(() => {
    if (!authenticated || !launchAllowed) return;
    void loadUnified();
  }, [authenticated, loadUnified]);

  React.useEffect(() => {
    const google = new URLSearchParams(location.search).get('google');
    if (!google) return;
    if (activeTab !== 'integrations') {
      navigate(`${studentPath('integrations')}${location.search}`, { replace: true });
    }
  }, [location.search, activeTab, navigate]);

  const loadAdminLive = React.useCallback(async () => {
    if (!isAdmin) return;
    setAdminError('');
    try {
      const [orders, inbox, projectRows] = await Promise.all([
        adminKanbanOrders(),
        adminInbox(),
        adminProjectList(),
      ]);
      setKanbanCards(orders.map(mapOrderToKanbanCard));
      setAdminPriorityItems(mapInboxToPriority(inbox));
      setStudents(mapAdminProjectsToStudents(projectRows, orders));
    } catch (err) {
      setKanbanCards([]);
      setAdminPriorityItems([]);
      setStudents([]);
      setAdminError(err instanceof ApiRequestError ? err.message : '불러오기 실패. 다시 시도해주세요.');
    }
  }, [isAdmin]);

  React.useEffect(() => {
    if (!authenticated || !isAdmin || !launchAllowed) return;
    void loadAdminLive();
  }, [authenticated, isAdmin, loadAdminLive]);

  React.useEffect(() => {
    if (!urlProjectId) return;
    const match = projects.find((p) => p.id === urlProjectId);
    if (match) {
      setActiveProject(match);
      writeStoredProjectId(match.id);
    }
  }, [urlProjectId, projects]);

  const handleSelectProject = (proj: Project) => {
    setActiveProject(proj);
    writeStoredProjectId(proj.id);
  };

  const handleSaveWebsiteDraft = async (payload: Record<string, unknown>) => {
    if (!activeProject) return;
    orderSavePendingRef.current = payload;
    if (orderSaveBusyRef.current) return;
    orderSaveBusyRef.current = true;
    setOrderSaveError('');
    setOrderSaveStatus('saving');
    try {
      let current = liveOrder;
      while (orderSavePendingRef.current) {
        const next = orderSavePendingRef.current;
        orderSavePendingRef.current = null;
        const draft = current || (await ensureWebsiteDraft(activeProject.id));
        const saved = await saveWebsiteOrder({
          projectId: Number(activeProject.id),
          orderId: draft.id,
          ...(next as WebsiteOrderSaveInput),
        });
        current = saved;
        setLiveOrder(saved);
      }
      setOrderSaveStatus('saved');
    } catch (err) {
      setOrderSaveStatus('idle');
      setOrderSaveError(err instanceof ApiRequestError ? err.message : '저장 중 문제가 발생했습니다. 다시 시도해주세요.');
    } finally {
      orderSaveBusyRef.current = false;
      if (orderSavePendingRef.current) {
        void handleSaveWebsiteDraft(orderSavePendingRef.current);
      }
    }
  };

  const handleSubmitWebsiteLive = async (payload: Record<string, unknown>) => {
    if (!activeProject) return;
    setOrderSaveError('');
    try {
      const draft = liveOrder || (await ensureWebsiteDraft(activeProject.id));
      const saved = await submitWebsiteOrder({
        projectId: Number(activeProject.id),
        orderId: draft.id,
        ...(payload as WebsiteOrderSaveInput),
      });
      setLiveOrder(saved);
      setWebsiteOrder((prev) => ({
        ...prev,
        id: String(saved.id),
        status: 'planning',
        currentStageName: '접수완료',
        progress: saved.progress,
      }));
      navigate(studentPath('website', 'status'));
    } catch (err) {
      setOrderSaveError(err instanceof ApiRequestError ? err.message : '저장 중 문제가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleUploadWebsiteFiles = async (categoryId: string, list: FileList) => {
    if (!activeProject) return;
    setUploadError('');
    try {
      const draft = liveOrder || (await ensureWebsiteDraft(activeProject.id));
      setUploading(true);
      for (const file of Array.from(list)) {
        await uploadWebsiteFile(draft.id, API_CATEGORY_FROM_UI[categoryId] || categoryId, file, '', setUploadProgress);
      }
      const fresh = await getCurrentWebsiteOrder(activeProject.id);
      setLiveOrder(fresh);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : '파일 업로드에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteWebsiteFile = async (id: string) => {
    setUploadError('');
    try {
      await deleteWebsiteFile(id);
      if (activeProject) {
        const fresh = await getCurrentWebsiteOrder(activeProject.id);
        setLiveOrder(fresh);
      }
    } catch (err) {
      setUploadError(err instanceof ApiRequestError ? err.message : '삭제 중 문제가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleUpdateWebsiteFileMemo = async (id: string, memo: string) => {
    setUploadError('');
    try {
      await updateWebsiteFile(id, { memo });
      if (activeProject) {
        const fresh = await getCurrentWebsiteOrder(activeProject.id);
        setLiveOrder(fresh);
      }
    } catch (err) {
      setUploadError(err instanceof ApiRequestError ? err.message : '메모 저장에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleReplaceWebsiteFile = async (id: string, file: File) => {
    setUploadError('');
    try {
      setUploading(true);
      await replaceWebsiteFile(id, file, '', setUploadProgress);
      if (activeProject) {
        const fresh = await getCurrentWebsiteOrder(activeProject.id);
        setLiveOrder(fresh);
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : '파일 교체에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleAdminRequestMoreInfo = async (
    orderId: number,
    payload: { title: string; body: string; categories?: string[]; adminMemo?: string }
  ) => {
    try {
      const saved = await adminRequestMoreInfo(orderId, payload);
      setKanbanCards((prev) => prev.map((c) => (c.id === String(saved.id) ? mapOrderToKanbanCard(saved) : c)));
      setSelectedCardForModal(mapOrderToKanbanCard(saved));
    } catch (err) {
      setAdminError(err instanceof ApiRequestError ? err.message : '추가자료 요청에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const pendingMissionsCount = missions.filter((m) => !m.isCompleted).length;
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;
  const urgentInboxCount = adminPriorityItems.length;

  const handleUpdateKanbanCard = async (updated: WebsiteKanbanCard) => {
    const previous = kanbanCards;
    setKanbanCards((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    try {
      const status = KANBAN_TO_STATUS[updated.stage];
      const saved = await adminChangeOrderStatus(Number(updated.id), status);
      setKanbanCards((prev) => prev.map((c) => (c.id === updated.id ? mapOrderToKanbanCard(saved) : c)));
    } catch (err) {
      setKanbanCards(previous);
      setAdminError(err instanceof ApiRequestError ? err.message : '상태 변경에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleOpenStudentDetail = (student: StudentSummary) => {
    setSelectedStudentForModal(student);
    setIsStudentModalOpen(true);
  };

  const handleOpenWebsiteOrder = (card: WebsiteKanbanCard) => {
    setSelectedCardForModal(card);
    setIsCardModalOpen(true);
  };

  const handleOpenOrderModalFromStudentId = (studentId: string) => {
    const card = kanbanCards.find((c) => c.studentId === studentId) || kanbanCards[0];
    setSelectedCardForModal(card);
    setIsCardModalOpen(true);
  };

  if (loading) {
    return <AuthLoadingScreen />;
  }

  if (!launchAllowed) {
    if (!authenticated && launchMode !== 'off') {
      return <LoginRequiredScreen />;
    }
    return <LaunchPreparingScreen />;
  }

  if (!authenticated) {
    return <LoginRequiredScreen />;
  }

  if (parsed.mode === 'admin' && !isAdmin) {
    return <AdminForbiddenScreen />;
  }

  if (location.pathname === '/' || location.pathname === '') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-[#1E293B] flex flex-col font-sans antialiased overflow-x-hidden">
      <MockDataBanner
        gscState={metricsSummary?.status.gscState || '연결 필요'}
        ga4State={metricsSummary?.status.ga4State || '연결 필요'}
        aiConfigured={Boolean(unifiedSummary?.aiConfigured)}
      />
      {/* ========================================================================= */}
      {/* 1. ADMIN MODE CONTROL CENTER */}
      {/* ========================================================================= */}
      {appMode === 'admin' ? (
        <>
          {/* Admin Desktop Sidebar */}
          <AdminSidebar
            activeTab={adminTab}
            setActiveTab={setAdminTab}
            isCollapsed={isSidebarCollapsed}
            setIsCollapsed={setIsSidebarCollapsed}
            onSwitchToStudentMode={() => setAppMode('student')}
            urgentInboxCount={urgentInboxCount}
          />

          {/* Admin Main Layout */}
          <div
            className={`flex-1 flex flex-col transition-all duration-300 ${
              isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
            }`}
          >
            <AdminHeader
              activeTab={adminTab}
              onNavigateTab={setAdminTab}
              onSwitchToStudentMode={() => setAppMode('student')}
              onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
              isSidebarCollapsed={isSidebarCollapsed}
              urgentCount={urgentInboxCount}
            />

            <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 max-w-7xl w-full mx-auto min-w-0 overflow-x-hidden">
              <React.Suspense fallback={<RouteFallback />}>
              {adminTab === 'dashboard' && (
                <AdminDashboardView
                  priorityItems={adminPriorityItems}
                  students={students}
                  kanbanCards={kanbanCards}
                  onNavigateTab={setAdminTab}
                  onOpenStudentDetail={handleOpenStudentDetail}
                  onOpenWebsiteOrder={handleOpenWebsiteOrder}
                />
              )}

              {adminTab === 'inbox' && (
                <PriorityInboxView
                  items={adminPriorityItems}
                  students={students}
                  kanbanCards={kanbanCards}
                  onOpenStudentDetail={handleOpenStudentDetail}
                  onOpenWebsiteOrder={handleOpenWebsiteOrder}
                />
              )}

              {adminTab === 'kanban' && (
                <WebsiteKanbanView
                  cards={kanbanCards}
                  onUpdateCard={handleUpdateKanbanCard}
                  onOpenCardDetail={handleOpenWebsiteOrder}
                  onRequestMoreInfo={(orderId, payload) => void handleAdminRequestMoreInfo(orderId, payload)}
                />
              )}

              {adminTab === 'students' && (
                <StudentDirectoryView
                  students={students}
                  onOpenStudentDetail={handleOpenStudentDetail}
                />
              )}

              {adminTab === 'integrations' && <AdminIntegrationsView />}
              </React.Suspense>
            </main>
          </div>
        </>
      ) : (
        /* ========================================================================= */
        /* 2. STUDENT PORTAL (수강생 포털) */
        /* ========================================================================= */
        <>
          {/* Desktop & Tablet Collapsible Sidebar */}
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            activeWebsiteSubTab={activeWebsiteSubTab}
            setActiveWebsiteSubTab={setActiveWebsiteSubTab}
            activeToolSubTab={activeToolSubTab}
            setActiveToolSubTab={setActiveToolSubTab}
            isCollapsed={isSidebarCollapsed}
            setIsCollapsed={setIsSidebarCollapsed}
            activeProject={activeProject}
            pendingMissionsCount={pendingMissionsCount}
            unreadNotificationsCount={unreadNotificationsCount}
            websiteStatusBadgeText={websiteOrder.status === 'delivered' ? '완료' : '진행중'}
            onOpenNewProjectModal={() => setIsOnboardingWizardOpen(true)}
            onSwitchToAdminMode={isAdmin ? () => setAppMode('admin') : undefined}
            projectCount={projects.length}
          />

          {/* Mobile Navigation Drawer */}
          <MobileNav
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            activeProject={activeProject}
            pendingMissionsCount={pendingMissionsCount}
          />

          {/* Main Content Area */}
          <div
            className={`flex-1 flex flex-col transition-all duration-300 ${
              isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
            }`}
          >
            {/* Top Header */}
            <Header
              activeProject={activeProject}
              projects={projects}
              onSelectProject={handleSelectProject}
              onOpenNewProjectModal={() => setIsOnboardingWizardOpen(true)}
              notifications={notifications}
              onNavigate={handleNavigate}
              onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
              isSidebarCollapsed={isSidebarCollapsed}
              onSwitchToAdminMode={isAdmin ? () => setAppMode('admin') : undefined}
              onOpenGlobalSearch={() => setIsGlobalSearchOpen(true)}
            />

            {/* Dynamic Page Views */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 max-w-7xl w-full mx-auto min-w-0 overflow-x-hidden">
              {projectsError ? (
                <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-800 text-sm rounded-2xl p-4 flex items-center justify-between gap-3">
                  <span>{projectsError}</span>
                  <button type="button" className="font-bold underline" onClick={() => void loadProjects()}>
                    다시 시도
                  </button>
                </div>
              ) : null}
              {roadmapError ? (
                <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-800 text-sm rounded-2xl p-4 flex items-center justify-between gap-3">
                  <span>{roadmapError}</span>
                  <button type="button" className="font-bold underline" onClick={() => void loadRoadmapBundle()}>
                    다시 시도
                  </button>
                </div>
              ) : null}
              {missionsError ? (
                <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-800 text-sm rounded-2xl p-4">{missionsError}</div>
              ) : null}
              {activityError ? (
                <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-800 text-sm rounded-2xl p-4">{activityError}</div>
              ) : null}
              {adminError ? (
                <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-800 text-sm rounded-2xl p-4">{adminError}</div>
              ) : null}
              {metricsError ? (
                <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-800 text-sm rounded-2xl p-4 flex justify-between gap-3">
                  <span>{metricsError}</span>
                  <button type="button" className="font-bold underline" onClick={() => void loadMetricsBundle()}>
                    다시 시도
                  </button>
                </div>
              ) : null}
              <React.Suspense fallback={<RouteFallback />}>
              {activeTab === 'dashboard' && (
                <DashboardView
                  project={activeProject}
                  missions={missions}
                  onToggleMission={handleToggleMission}
                  onNavigate={handleNavigate}
                  coachInsight={studentDemo.coachInsights[0]}
                  activities={activities}
                  onOpenOnboarding={() => setIsOnboardingWizardOpen(true)}
                  metricsSummary={metricsSummary}
                  metricsTimeseries={metricsTimeseries}
                  unified={unifiedSummary}
                  liveWebsiteOrder={liveOrder}
                />
              )}

              {activeTab === 'projects' && (
                <ProjectsView
                  projects={projects}
                  activeProject={activeProject}
                  onSelectProject={handleSelectProject}
                  onAddNewProject={handleAddNewProject}
                  onNavigate={handleNavigate}
                />
              )}

              {activeTab === 'website' && (
                <WebsiteView
                  activeSubTab={activeWebsiteSubTab}
                  setActiveSubTab={setActiveWebsiteSubTab}
                  order={websiteOrder}
                  revisions={revisions}
                  project={activeProject}
                  onAddRevision={handleAddRevision}
                  onSubmitNewOrder={handleSubmitNewOrder}
                  liveOrder={liveOrder}
                  liveError={liveOrderError}
                  onRetryLive={() => void loadWebsiteOrder()}
                  onSaveDraft={handleSaveWebsiteDraft}
                  onSubmitLive={handleSubmitWebsiteLive}
                  wizardFiles={(liveOrder?.files || []).map((f) => ({
                    id: String(f.id),
                    categoryId: UI_CATEGORY_FROM_API[f.category] || f.category,
                    fileName: f.originalName,
                    fileSize: formatFileSize(f.fileSize),
                    uploadedAt: f.createdAt,
                    memo: f.memo,
                  }))}
                  uploading={uploading}
                  uploadProgress={uploadProgress}
                  uploadError={uploadError}
                  onUploadFiles={handleUploadWebsiteFiles}
                  onDeleteFile={handleDeleteWebsiteFile}
                  onUpdateFileMemo={handleUpdateWebsiteFileMemo}
                  onReplaceFile={handleReplaceWebsiteFile}
                  saveError={orderSaveError}
                  saveStatus={orderSaveStatus}
                />
              )}

              {activeTab === 'roadmap' && (
                <RoadmapView
                  steps={roadmapSteps}
                  taskWorkLogs={taskWorkLogs}
                  onToggleChecklistItem={handleToggleChecklistItem}
                  onSaveTaskLog={handleSaveTaskLog}
                  onUploadScreenshot={async (file) => {
                    if (!activeProject) throw new Error('프로젝트를 선택해주세요.');
                    const uploaded = await uploadTaskScreenshot(Number(activeProject.id), file);
                    return uploaded.id;
                  }}
                  onNavigate={handleNavigate}
                  onOpenOnboarding={() => setIsOnboardingWizardOpen(true)}
                />
              )}

              {activeTab === 'missions' && (
                <MissionsView
                  missions={missions}
                  onToggleMission={handleToggleMission}
                  onNavigate={handleNavigate}
                />
              )}

              {activeTab === 'tools' && activeProject && (
                <ToolsView
                  activeSubTab={activeToolSubTab}
                  setActiveSubTab={setActiveToolSubTab}
                  project={activeProject}
                  activityItems={seoTimelineItems}
                  tools={toolStatus}
                  onReloadTools={() => void loadUnified()}
                />
              )}

              {activeTab === 'reports' && activeProject && (
                <ReportsView
                  project={activeProject}
                  onNavigate={handleNavigate}
                  liveChart={metricsTimeseries.map((r) => ({
                    date: r.date,
                    impressions: r.impressions,
                    clicks: r.clicks,
                    traffic: r.traffic || 0,
                    position: r.position,
                  }))}
                  queries={reportQueries as Array<{ query: string; clicks: number; impressions: number; ctr: number; position: number; clicksChangePct?: number | null }>}
                  pages={reportPages as Array<{ page: string; clicks: number; impressions: number; ctr: number; position: number }>}
                  opportunities={reportOpps}
                  beforeNow={beforeNow}
                  metricsSummary={metricsSummary}
                  timeRange={metricsRange as '7d' | '30d' | '3m' | '6m' | '1y' | 'all'}
                  onTimeRangeChange={(range) => setMetricsRange(range)}
                  milestones={(unifiedSummary?.milestones as Array<{ key: string; title: string; achieved: boolean; value: number | null; threshold: number }>) || []}
                  toolSummary={unifiedSummary}
                />
              )}

              {activeTab === 'integrations' && (
                <IntegrationsView projectId={activeProject ? activeProject.id : null} projectDomain={activeProject?.domain} />
              )}

              {activeTab === 'curriculum' && <CurriculumView />}

              {activeTab === 'ai_coach' && activeProject && (
                <AiCoachView project={activeProject} onNavigate={handleNavigate} />
              )}

              {activeTab === 'notifications' && (
                <NotificationsView
                  notifications={notifications}
                  onMarkAllAsRead={handleMarkAllNotificationsRead}
                  onNavigate={handleNavigate}
                />
              )}

              {activeTab === 'help' && <HelpView />}

              {activeTab === 'account' && <AccountView />}
              </React.Suspense>
            </main>

            {/* Mobile Bottom Navigation Bar (Sticky at bottom on mobile) */}
            <MobileBottomNav
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              pendingMissionsCount={pendingMissionsCount}
              aiCoachBadge={false}
            />
          </div>
        </>
      )}

      {/* Global Search Modal (Cmd+K / Ctrl+K) */}
      <GlobalSearchModal
        isOpen={isGlobalSearchOpen}
        onClose={() => setIsGlobalSearchOpen(false)}
        onNavigate={handleNavigate}
        projects={projects}
        taskLogs={taskWorkLogs}
      />

      {/* Admin Modals */}
      <React.Suspense fallback={null}>
      <StudentDetailModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        student={selectedStudentForModal}
        onOpenOrderModal={handleOpenOrderModalFromStudentId}
      />

      <WebsiteOrderDetailModal
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
        card={selectedCardForModal}
        onUpdateCard={handleUpdateKanbanCard}
        onRequestMoreInfo={
          selectedCardForModal
            ? (payload) => void handleAdminRequestMoreInfo(Number(selectedCardForModal.id), payload)
            : undefined
        }
      />
      </React.Suspense>

      {/* Comprehensive SEO Onboarding Wizard Modal */}
      <OnboardingWizardModal
        isOpen={isOnboardingWizardOpen}
        onClose={() => setIsOnboardingWizardOpen(false)}
        onComplete={handleWizardComplete}
        onNavigateToTools={(tool) => {
          setIsOnboardingWizardOpen(false);
          handleNavigate('tools', tool);
        }}
      />

      {/* Global Quick New Project Modal */}
      <Modal
        isOpen={isGlobalNewProjectModalOpen}
        onClose={() => setIsGlobalNewProjectModalOpen(false)}
        title="새 SEO 프로젝트 등록"
        subtitle="새로운 수익형 니치 웹사이트 프로젝트를 등록하여 10단계 로드맵을 시작합니다."
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!newProjName.trim() || !newProjDomain.trim()) return;
            handleAddNewProject({
              name: newProjName,
              domain: newProjDomain,
              niche: newProjNiche || '신규 니치'
            });
            setNewProjName('');
            setNewProjDomain('');
            setNewProjNiche('');
            setIsGlobalNewProjectModalOpen(false);
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              프로젝트 명칭 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={newProjName}
              onChange={(e) => setNewProjName(e.target.value)}
              placeholder="예: 제주 독채 풀빌라 큐레이션"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              도메인 주소 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={newProjDomain}
              onChange={(e) => setNewProjDomain(e.target.value)}
              placeholder="jejustay365.com"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">타겟 니치</label>
            <input
              type="text"
              value={newProjNiche}
              onChange={(e) => setNewProjNiche(e.target.value)}
              placeholder="국내 숙박 / 감성 펜션 예약"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsGlobalNewProjectModalOpen(false)}
            >
              취소
            </Button>
            <Button type="submit" variant="primary" size="sm">
              프로젝트 등록 및 시작
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
