import React, { useEffect, useState, useRef } from 'react';
import {
  NavigationTab,
  WebsiteSubTab,
  ToolSubTab,
  Project,
  WebsiteOrder,
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
  archiveProject,
  createProject,
  listProjects,
  mapApiProjectToUi,
  updateProject,
  type ProjectCreateInput,
} from './services/projectService';
import { pickCurrentProjectId, writeStoredProjectId } from './services/currentProject';
import {
  ensureWebsiteDraft,
  getWebsiteOrderBundle,
  saveWebsiteOrder,
  submitWebsiteOrder,
  appendWebsiteMaterials,
  type ApiWebsiteOrder,
  type WebsiteOrderSaveInput,
  websiteImagePreviewUrl,
} from './services/websiteOrderService';
import { deleteWebsiteFile, formatFileSize, replaceWebsiteFile, updateWebsiteFile, uploadWebsiteFile } from './services/websiteFileService';
import { addTaskResult, completeRoadmapTask, getRoadmap, listTaskResults, mapRoadmapToUi, reopenRoadmapTask, uploadTaskScreenshot, type ApiRoadmap, type ApiTaskResult } from './services/roadmapService';
import { completeMission, getTodayMissions, mapMissionsToUi, reopenMission } from './services/missionService';
import { listActivities, mapActivitiesToUi } from './services/activityService';
import {
  listNotifications,
  mapNotificationsToUi,
  markAllNotificationsRead,
} from './services/notificationsService';
import {
  adminChangeOrderStatus,
  adminInbox,
  adminKanbanOrders,
  adminProjectList,
  adminRequestMoreInfo,
  adminSavePreviewUrl,
  adminSaveRequestChecklist,
  KANBAN_TO_STATUS,
  mapAdminProjectsToStudents,
  mapInboxToPriority,
  mapOrderToKanbanCard,
} from './services/adminKanbanService';
import { ApiRequestError, apiJson } from './services/apiClient';
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
import { ADMIN_PATH, openContractPath, parsePortalPath, projectPath, studentPath } from './config/routes';
import { API_ENDPOINTS } from './config/api';
import { isDraftOrderStatus } from './constants/seoSystem300';
import { MockDataBanner } from './components/common/MockDataBanner';
import { useAuth } from './auth/AuthContext';
import { AuthLoadingScreen } from './components/auth/AuthLoadingScreen';
import { LoginRequiredScreen } from './components/auth/LoginRequiredScreen';
import { AdminForbiddenScreen } from './components/auth/AdminForbiddenScreen';
import { EnrollmentBlockedScreen } from './components/auth/EnrollmentBlockedScreen';
import { EduAuthScreen, isEduAuthPath } from './components/auth/EduAuthScreen';
import { classTodayScreen, type ClassJourney } from './components/class/ClassHome';

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
const EducationSlideLibraryView = React.lazy(() =>
  import('./components/slides/EducationSlideLibraryView').then((m) => ({
    default: m.EducationSlideLibraryView,
  }))
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
const ClassQueueView = React.lazy(() =>
  import('./components/admin/ClassQueueView').then((m) => ({ default: m.ClassQueueView }))
);
const AdminRevisionQueueView = React.lazy(() =>
  import('./components/admin/AdminRevisionQueueView').then((m) => ({ default: m.AdminRevisionQueueView }))
);
const AdminGeoQueueView = React.lazy(() =>
  import('./components/admin/AdminGeoQueueView').then((m) => ({ default: m.AdminGeoQueueView }))
);
const ContractPage = React.lazy(() => import('./components/contract/ContractPage'));

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
  const { loading, authenticated, isAdmin, launchAllowed, enrollment, contract } = useAuth();
  const [classPrepComplete, setClassPrepComplete] = useState<boolean | null>(null);
  const [todayScreen, setTodayScreen] = useState('');
  const parsed = parsePortalPath(location.pathname);

  const appMode = parsed.mode;
  const adminTab: AdminTab = parsed.mode === 'admin' ? parsed.adminTab : 'dashboard';
  const activeTab: NavigationTab = parsed.mode === 'student' ? parsed.tab : 'dashboard';
  const activeWebsiteSubTab: WebsiteSubTab =
    parsed.mode === 'student' ? parsed.websiteSubTab : 'status';
  const activeToolSubTab: ToolSubTab =
    parsed.mode === 'student' ? parsed.toolSubTab : 'catchdomain';
  const urlProjectId = parsed.mode === 'student' ? parsed.projectId : undefined;
  const contractSubTab =
    parsed.mode === 'student' ? parsed.contractSubTab || 'write' : ('write' as const);
  const studentNavTabs = React.useMemo<NavigationTab[]>(() => {
    if (contract.blocked) {
      return ['contract', 'notifications', 'help', 'account'];
    }
    const tabs: NavigationTab[] = [
      'dashboard',
      'projects',
      'website',
      'roadmap',
      'missions',
      'tools',
      'reports',
      'integrations',
      'curriculum',
      'slides',
      'ai_coach',
      'notifications',
      'help',
      'account',
    ];
    if (contract.applies) {
      return ['contract', ...tabs];
    }
    return tabs;
  }, [contract.applies, contract.blocked]);

  useEffect(() => {
    if (!authenticated || parsed.mode !== 'student') return;
    let cancelled = false;
    apiJson<ClassJourney>(API_ENDPOINTS.classJourney)
      .then((data) => {
        if (cancelled) return;
        setClassPrepComplete(Boolean(data.prep?.complete));
        const screen = classTodayScreen(data);
        if (screen) setTodayScreen(screen);
      })
      .catch(() => {
        if (!cancelled) setClassPrepComplete(false);
      });
    return () => {
      cancelled = true;
    };
  }, [authenticated, parsed.mode]);

  useEffect(() => {
    if (parsed.mode !== 'student' || classPrepComplete === null) return;
    if (!studentNavTabs.includes(activeTab)) {
      if (contract.blocked) openContractPath(navigate, contract);
      else navigate(studentPath('dashboard'));
    }
  }, [classPrepComplete, parsed.mode, activeTab, navigate, studentNavTabs, contract]);

  useEffect(() => {
    if (!authenticated || parsed.mode !== 'student' || !contract.blocked) return;
    const allowed: NavigationTab[] = ['contract', 'notifications', 'help', 'account'];
    if (!allowed.includes(activeTab)) {
      openContractPath(navigate, contract);
    }
  }, [authenticated, parsed.mode, contract, activeTab, navigate]);

  const openTodayScreen = () => {
    if (todayScreen === 'website') {
      navigate(studentPath('website', 'order'));
      return;
    }
    const tool: ToolSubTab =
      todayScreen === 'content' || todayScreen === 'backlink' || todayScreen === 'traffic' || todayScreen === 'catchdomain'
        ? todayScreen
        : 'catchdomain';
    navigate(studentPath('tools', tool));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const setActiveTab = (tab: NavigationTab) => {
    if (tab === 'contract') {
      openContractPath(navigate, contract);
      return;
    }
    if (tab === 'tools') {
      openTodayScreen();
      return;
    }
    if (tab === 'website') {
      navigate(studentPath('website', 'order'));
      return;
    }
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
    if (parsed.mode !== 'student') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [parsed.mode]);

  // Application Data State
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [projectsError, setProjectsError] = useState('');
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [liveOrder, setLiveOrder] = useState<ApiWebsiteOrder | null>(null);
  const [websiteOrders, setWebsiteOrders] = useState<ApiWebsiteOrder[]>([]);
  const [draftOrder, setDraftOrder] = useState<ApiWebsiteOrder | null>(null);
  const [liveOrderError, setLiveOrderError] = useState('');
  const [orderSaveError, setOrderSaveError] = useState('');
  const [orderSaveStatus, setOrderSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const orderSavePendingRef = useRef<Record<string, unknown> | null>(null);
  const orderSaveBusyRef = useRef(false);
  const [uploadError, setUploadError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [websiteOrder, setWebsiteOrder] = useState<WebsiteOrder>(studentDemo.websiteOrder);
  const [roadmapSteps, setRoadmapSteps] = useState<typeof studentDemo.roadmapSteps>([]);
  const [missions, setMissions] = useState<typeof studentDemo.missions>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [roadmapError, setRoadmapError] = useState('');
  const [missionsError, setMissionsError] = useState('');
  const [activityError, setActivityError] = useState('');
  const [adminError, setAdminError] = useState('');
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
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

  const applyTaskResults = (results: ApiTaskResult[], roadmap: ApiRoadmap) => {
    const titleByTask = new Map(
      roadmap.steps.flatMap((step) => step.tasks.map((task) => [task.id, task.title] as const))
    );
    setTaskWorkLogs(
      results.map((item) => ({
        id: String(item.id),
        taskId: item.roadmapTaskId,
        taskTitle: titleByTask.get(item.roadmapTaskId) || '로드맵 작업',
        url: item.resultUrl,
        targetKeyword: item.keyword,
        publishDate: item.resultDate,
        notes: item.memo,
        screenshotFileId: item.screenshotFileId || undefined,
        relatedTool: (item.relatedTool || 'other') as TaskWorkLog['relatedTool'],
        status: 'completed' as const,
        createdAt: item.createdAt,
      }))
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
      applyTaskResults(await listTaskResults(activeProject.id), res.roadmap);
      const acts = await listActivities(activeProject.id, 20);
      setActivities(mapActivitiesToUi(acts));
    } catch (err) {
      setRoadmapError(err instanceof ApiRequestError ? err.message : '저장 중 문제가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleUploadTaskScreenshot = async (file: File) => {
    if (!activeProject) {
      throw new Error('프로젝트를 먼저 선택해주세요.');
    }
    const uploaded = await uploadTaskScreenshot(Number(activeProject.id), file);
    return uploaded.id;
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

  const registerProject = async (projData: Partial<Project>) => {
    const created = await createProject({
      name: projData.name || '새 SEO 프로젝트',
      domain: projData.domain,
      description: projData.niche,
    });
    const mapped = mapApiProjectToUi(created);
    setProjects((prev) => [mapped, ...prev]);
    setActiveProject(mapped);
    writeStoredProjectId(mapped.id);
    return mapped;
  };

  const handleAddNewProject = async (projData: Partial<Project>) => {
    setProjectsError('');
    try {
      const mapped = await registerProject(projData);
      navigate(projectPath(mapped.id));
    } catch (err) {
      setProjectsError(err instanceof ApiRequestError ? err.message : '저장 중 문제가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleSaveProjectKeywords = async (project: Project, keywords: string[]) => {
    setProjectsError('');
    try {
      const saved = await updateProject(project.id, { keywords });
      const mapped = mapApiProjectToUi(saved);
      setProjects((prev) =>
        prev.map((item) =>
          item.id === mapped.id
            ? {
                ...item,
                targetKeywords: mapped.targetKeywords,
                metrics: { ...item.metrics, registeredKeywords: mapped.targetKeywords?.length || 0 },
              }
            : item
        )
      );
      if (activeProject?.id === mapped.id) {
        setActiveProject((current) =>
          current
            ? {
                ...current,
                targetKeywords: mapped.targetKeywords,
                metrics: { ...current.metrics, registeredKeywords: mapped.targetKeywords?.length || 0 },
              }
            : mapped
        );
        const roadmap = await getRoadmap(mapped.id);
        applyRoadmap(roadmap);
      }
    } catch (err) {
      const message = err instanceof ApiRequestError ? err.message : '키워드를 저장하지 못했습니다.';
      setProjectsError(message);
      throw err instanceof Error ? err : new Error(message);
    }
  };

  const handleSaveProjectSettings = async (project: Project, input: Partial<Project>) => {
    setProjectsError('');
    try {
      const saved = await updateProject(project.id, {
        name: input.name,
        domain: input.domain,
        description: input.niche,
        businessType: input.businessType,
        primaryRegion: input.primaryRegion,
        impressionsGoal: input.impressionsGoal,
        trafficGoal: input.trafficGoal,
        contentGoal: input.contentGoal,
        referringDomainGoal: input.referringDomainGoal,
      });
      const mapped = mapApiProjectToUi(saved);
      const mergeSettings = (current: Project): Project => ({
        ...current,
        name: mapped.name,
        domain: mapped.domain,
        niche: mapped.niche,
        businessType: mapped.businessType,
        primaryRegion: mapped.primaryRegion,
        impressionsGoal: mapped.impressionsGoal,
        trafficGoal: mapped.trafficGoal,
        contentGoal: mapped.contentGoal,
        referringDomainGoal: mapped.referringDomainGoal,
      });
      setProjects((prev) => prev.map((item) => (item.id === mapped.id ? mergeSettings(item) : item)));
      if (activeProject?.id === mapped.id) {
        setActiveProject((current) => (current ? mergeSettings(current) : mapped));
        applyRoadmap(await getRoadmap(mapped.id));
      }
    } catch (err) {
      const message = err instanceof ApiRequestError ? err.message : '프로젝트 설정을 저장하지 못했습니다.';
      setProjectsError(message);
      throw err instanceof Error ? err : new Error(message);
    }
  };

  const handleDeleteProject = async (project: Project) => {
    setProjectsError('');
    try {
      await archiveProject(project.id);
      const remaining = projects.filter((item) => item.id !== project.id);
      setProjects(remaining);

      if (activeProject?.id === project.id) {
        const nextProject = remaining[0] || null;
        setActiveProject(nextProject);
        writeStoredProjectId(nextProject?.id || '');
        navigate(nextProject ? projectPath(nextProject.id) : '/projects', { replace: true });
      }
    } catch (err) {
      const message = err instanceof ApiRequestError ? err.message : '프로젝트를 삭제하지 못했습니다.';
      setProjectsError(message);
      throw err instanceof Error ? err : new Error(message);
    }
  };

  const handleCreateProjectForHomepage = async (projData: { name: string; domain: string; niche: string }) => {
    await registerProject(projData);
    navigate(studentPath('website', 'order'));
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

  const applyWebsiteBundle = React.useCallback((bundle: { order: ApiWebsiteOrder | null; orders: ApiWebsiteOrder[] }) => {
    setWebsiteOrders(bundle.orders);
    setLiveOrder(bundle.order);
    setDraftOrder(bundle.orders.find((item) => isDraftOrderStatus(item.status)) || null);
  }, []);

  const loadWebsiteOrder = React.useCallback(async () => {
    if (!activeProject) {
      setLiveOrder(null);
      setWebsiteOrders([]);
      setDraftOrder(null);
      return;
    }
    setLiveOrderError('');
    try {
      applyWebsiteBundle(await getWebsiteOrderBundle(activeProject.id));
    } catch (err) {
      setLiveOrder(null);
      setWebsiteOrders([]);
      setDraftOrder(null);
      setLiveOrderError(err instanceof ApiRequestError ? err.message : '불러오기 실패. 다시 시도해주세요.');
    }
  }, [activeProject, applyWebsiteBundle]);

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
      applyTaskResults(await listTaskResults(pid), rm);
    } catch (err) {
      setRoadmapSteps([]);
      setTaskWorkLogs([]);
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
      let current =
        draftOrder && isDraftOrderStatus(draftOrder.status)
          ? draftOrder
          : liveOrder && isDraftOrderStatus(liveOrder.status)
            ? liveOrder
            : null;
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
        setDraftOrder(saved);
        setWebsiteOrders((prev) => [saved, ...prev.filter((item) => item.id !== saved.id)]);
        if (!liveOrder || isDraftOrderStatus(liveOrder.status)) setLiveOrder(saved);
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
    setOrderSaveError('');
    try {
      let project = activeProject;
      if (!project) {
        const created = await createProject({
          name: String(payload.siteName || payload.brandName || '홈페이지 제작'),
          domain: String(payload.domain || ''),
          businessType: String(payload.industry || payload.siteType || ''),
          description: String(payload.businessDescription || ''),
          primaryRegion: String(payload.region || ''),
        });
        project = mapApiProjectToUi(created);
        setProjects((prev) => [project!, ...prev.filter((item) => item.id !== project!.id)]);
        setActiveProject(project);
        writeStoredProjectId(project.id);
      }
      const editable =
        draftOrder && isDraftOrderStatus(draftOrder.status)
          ? draftOrder
          : liveOrder && isDraftOrderStatus(liveOrder.status)
            ? liveOrder
            : null;
      const draft = editable || (await ensureWebsiteDraft(project.id));
      const saved = await submitWebsiteOrder({
        projectId: Number(project.id),
        orderId: draft.id,
        ...(payload as WebsiteOrderSaveInput),
      });
      const orderNo = saved.orderNo || '';
      if (saved.status !== 'submitted' || !/^WEB-\d{4}-\d{6}$/.test(orderNo)) {
        throw new Error('주문이 저장되지 않았습니다. 다시 제출해주세요.');
      }
      setDraftOrder(null);
      setLiveOrder(saved);
      setWebsiteOrders((prev) => [saved, ...prev.filter((item) => item.id !== saved.id && item.id !== draft.id)]);
      setWebsiteOrder((prev) => ({
        ...prev,
        id: String(saved.id),
        status: 'planning',
        currentStageName: '접수완료',
        progress: saved.progress,
      }));
      return { id: saved.id, orderNo, status: saved.status };
    } catch (err) {
      const message = err instanceof ApiRequestError ? err.message : '저장 중 문제가 발생했습니다. 다시 시도해주세요.';
      setOrderSaveError(message);
      throw err instanceof Error ? err : new Error(message);
    }
  };

  const handleStartNewWebsiteOrder = async () => {
    if (!activeProject) return;
    setOrderSaveError('');
    const draft = await ensureWebsiteDraft(activeProject.id);
    setDraftOrder(draft);
    setWebsiteOrders((prev) => [draft, ...prev.filter((item) => item.id !== draft.id)]);
    if (!liveOrder || isDraftOrderStatus(liveOrder.status)) setLiveOrder(draft);
  };

  const refreshWebsiteBundle = async (projectId: string | number) => {
    applyWebsiteBundle(await getWebsiteOrderBundle(projectId));
  };

  const handleUploadWebsiteFiles = async (categoryId: string, list: FileList, orderId?: number) => {
    const files = Array.from(list);
    if (files.length === 0) return;
    setUploadError('');
    setUploading(true);
    setUploadProgress(0);
    try {
      let project = activeProject || projects[0] || null;
      if (!project) {
        const created = await createProject({ name: '홈페이지 제작' });
        project = mapApiProjectToUi(created);
        setProjects((prev) => [project!, ...prev.filter((item) => item.id !== project!.id)]);
      }
      const editable =
        draftOrder && isDraftOrderStatus(draftOrder.status)
          ? draftOrder
          : liveOrder && isDraftOrderStatus(liveOrder.status)
            ? liveOrder
            : null;
      const targetId = orderId || editable?.id;
      const draft = targetId ? { id: targetId } : await ensureWebsiteDraft(project.id);
      for (const file of files) {
        await uploadWebsiteFile(draft.id, API_CATEGORY_FROM_UI[categoryId] || categoryId, file, '', setUploadProgress);
      }
      await refreshWebsiteBundle(project.id);
      if (!activeProject || activeProject.id !== project.id) {
        setActiveProject(project);
        writeStoredProjectId(project.id);
      }
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
      if (activeProject) await refreshWebsiteBundle(activeProject.id);
    } catch (err) {
      setUploadError(err instanceof ApiRequestError ? err.message : '삭제 중 문제가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleUpdateWebsiteFileMemo = async (id: string, memo: string) => {
    setUploadError('');
    try {
      await updateWebsiteFile(id, { memo });
      if (activeProject) await refreshWebsiteBundle(activeProject.id);
    } catch (err) {
      setUploadError(err instanceof ApiRequestError ? err.message : '메모 저장에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleReplaceWebsiteFile = async (id: string, file: File) => {
    setUploadError('');
    try {
      setUploading(true);
      await replaceWebsiteFile(id, file, '', setUploadProgress);
      if (activeProject) await refreshWebsiteBundle(activeProject.id);
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

  const handleAdminSaveChecklist = async (
    orderId: number,
    checklist: { board: Record<string, string>; program: Record<string, string> }
  ) => {
    const saved = await adminSaveRequestChecklist(orderId, checklist);
    const mapped = mapOrderToKanbanCard(saved);
    setKanbanCards((prev) => prev.map((c) => (c.id === String(saved.id) ? mapped : c)));
    setSelectedCardForModal(mapped);
  };

  const handleAdminSavePreviewUrl = async (orderId: number, previewUrl: string) => {
    const saved = await adminSavePreviewUrl(orderId, previewUrl);
    const mapped = mapOrderToKanbanCard(saved);
    setKanbanCards((prev) => prev.map((c) => (c.id === String(saved.id) ? mapped : c)));
    setSelectedCardForModal(mapped);
  };

  const handleAppendWebsiteMaterials = async (payload: {
    orderId?: number;
    businessInfoNote?: string;
    extraRequest?: string;
    boardRequests?: string[];
    programRequests?: string[];
    references?: Array<string | { url: string; memo?: string }>;
  }) => {
    const targetId = payload.orderId || liveOrder?.id;
    if (!activeProject || !targetId) return;
    setOrderSaveError('');
    try {
      const saved = await appendWebsiteMaterials({
        orderId: targetId,
        projectId: Number(activeProject.id),
        ...payload,
      });
      setWebsiteOrders((prev) => prev.map((item) => (item.id === saved.id ? saved : item)));
      if (!liveOrder || liveOrder.id === saved.id) setLiveOrder(saved);
    } catch (err) {
      setOrderSaveError(err instanceof ApiRequestError ? err.message : '자료 추가에 실패했습니다. 다시 시도해주세요.');
      throw err;
    }
  };

  const handleMarkAllNotificationsRead = async () => {
    try {
      const res = await markAllNotificationsRead();
      setNotifications(mapNotificationsToUi(res.notifications || []));
    } catch {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }
  };

  const loadNotifications = React.useCallback(async () => {
    try {
      const res = await listNotifications(40);
      setNotifications(mapNotificationsToUi(res.notifications || []));
    } catch {
      setNotifications([]);
    }
  }, []);

  React.useEffect(() => {
    if (!authenticated || !launchAllowed) return;
    void loadNotifications();
  }, [authenticated, launchAllowed, loadNotifications]);

  const pendingMissionsCount = missions.filter((m) => !m.isCompleted).length;
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;
  const urgentInboxCount = adminPriorityItems.filter((it) => it.urgentLevel === 'urgent').length;

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

  if (isEduAuthPath(location.pathname)) {
    return <EduAuthScreen />;
  }

  if (enrollment.required && !enrollment.access) {
    return <EnrollmentBlockedScreen status={enrollment.status} />;
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

  const connectionBanner = (
    <MockDataBanner
      gscState={metricsSummary?.status.gscState || '연결 필요'}
      ga4State={metricsSummary?.status.ga4State || '연결 필요'}
      aiConfigured={Boolean(unifiedSummary?.aiConfigured)}
    />
  );

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-[#1E293B] flex flex-col font-sans antialiased overflow-x-hidden">
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

          {/* Admin Main Layout — banner stays in main column so it never clips the sidebar logo */}
          <div
            className={`flex-1 flex flex-col transition-all duration-300 ${
              isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
            }`}
          >
            {connectionBanner}
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
                  onNavigateTab={setAdminTab}
                />
              )}

              {adminTab === 'kanban' && (
                <WebsiteKanbanView
                  cards={kanbanCards}
                  onUpdateCard={handleUpdateKanbanCard}
                  onOpenCardDetail={handleOpenWebsiteOrder}
                  onRequestMoreInfo={(orderId, payload) => void handleAdminRequestMoreInfo(orderId, payload)}
                  onSaveChecklist={(orderId, checklist) => handleAdminSaveChecklist(orderId, checklist)}
                  onSavePreviewUrl={(orderId, previewUrl) => handleAdminSavePreviewUrl(orderId, previewUrl)}
                />
              )}

              {adminTab === 'students' && (
                <StudentDirectoryView
                  students={students}
                  onOpenStudentDetail={handleOpenStudentDetail}
                />
              )}

              {adminTab === 'classes' && <ClassQueueView />}
              {adminTab === 'revisions' && <AdminRevisionQueueView />}
              {adminTab === 'geo' && <AdminGeoQueueView />}
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
            websiteStatusBadgeText={
              liveOrder
                ? liveOrder.status === 'delivered'
                  ? '완료'
                  : '진행중'
                : undefined
            }
            onOpenNewProjectModal={() => setIsOnboardingWizardOpen(true)}
            onSwitchToAdminMode={isAdmin ? () => setAppMode('admin') : undefined}
            projectCount={projects.length}
            allowedTabs={studentNavTabs}
          />

          {/* Mobile Navigation Drawer */}
          <MobileNav
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            activeProject={activeProject}
            pendingMissionsCount={pendingMissionsCount}
            allowedTabs={studentNavTabs}
          />

          {/* Main Content Area — banner in main column only (sidebar logo stays fully visible) */}
          <div
            className={`flex-1 flex flex-col transition-all duration-300 ${
              isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
            }`}
          >
            {connectionBanner}
            {contract.requires && contract.graceActive ? (
              <div className="mx-4 sm:mx-6 lg:mx-8 mt-3 rounded-2xl border border-amber-300/80 bg-amber-50 px-4 py-3 text-sm text-amber-950 [word-break:keep-all]">
                서비스 계약 체결이 필요합니다. 유예 기간 중입니다 — 기한 내 계약을 완료해 주세요.
              </div>
            ) : null}
            {/* Top Header */}
            <Header
              activeTab={activeTab}
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
                  onSaveKeywords={handleSaveProjectKeywords}
                  onSaveSettings={handleSaveProjectSettings}
                  onDeleteProject={handleDeleteProject}
                  onNavigate={handleNavigate}
                />
              )}

              {activeTab === 'website' && (
                <WebsiteView
                  activeSubTab={activeWebsiteSubTab}
                  setActiveSubTab={setActiveWebsiteSubTab}
                  order={websiteOrder}
                  project={activeProject}
                  projects={projects}
                  onSelectProject={handleSelectProject}
                  onCreateProject={handleCreateProjectForHomepage}
                  onSubmitNewOrder={handleSubmitNewOrder}
                  liveOrder={liveOrder}
                  orders={websiteOrders}
                  draftOrder={draftOrder}
                  liveError={liveOrderError}
                  onRetryLive={() => void loadWebsiteOrder()}
                  onSaveDraft={handleSaveWebsiteDraft}
                  onSubmitLive={handleSubmitWebsiteLive}
                  onStartNewOrder={handleStartNewWebsiteOrder}
                  onAppendMaterials={handleAppendWebsiteMaterials}
                  wizardFiles={((draftOrder && isDraftOrderStatus(draftOrder.status) ? draftOrder : liveOrder && isDraftOrderStatus(liveOrder.status) ? liveOrder : null)?.files || []).map((f) => ({
                    id: String(f.id),
                    categoryId: UI_CATEGORY_FROM_API[f.category] || f.category,
                    fileName: f.originalName,
                    fileSize: formatFileSize(f.fileSize),
                    uploadedAt: f.createdAt,
                    memo: f.memo,
                    previewUrl: websiteImagePreviewUrl(f),
                  }))}
                  uploading={uploading}
                  uploadProgress={uploadProgress}
                  uploadError={uploadError}
                  onUploadFiles={(categoryId, files, orderId) => void handleUploadWebsiteFiles(categoryId, files, orderId)}
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
                  onUploadScreenshot={handleUploadTaskScreenshot}
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
                  onBack={() => handleNavigate('dashboard')}
                  activeSubTab={activeToolSubTab}
                  setActiveSubTab={setActiveToolSubTab}
                  project={activeProject}
                  activityItems={seoTimelineItems}
                  tools={toolStatus}
                  onReloadTools={() => void loadUnified()}
                />
              )}
              {activeTab === 'tools' && !activeProject && (
                <p className="text-sm text-slate-500">먼저 사업 이름을 저장하면 오늘 열 화면이 열립니다.</p>
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

              {activeTab === 'curriculum' && (
                <CurriculumView
                  onOpenSlides={(lessonId) =>
                    lessonId ? navigate(`/slides/${encodeURIComponent(lessonId)}/1`) : handleNavigate('slides')
                  }
                />
              )}

              {activeTab === 'slides' && <EducationSlideLibraryView onNavigate={handleNavigate} />}

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

              {activeTab === 'contract' && (
                <ContractPage subTab={contractSubTab} />
              )}
              </React.Suspense>
            </main>

            {/* Mobile Bottom Navigation Bar (Sticky at bottom on mobile) */}
            <MobileBottomNav
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              pendingMissionsCount={pendingMissionsCount}
              aiCoachBadge={false}
              allowedTabs={studentNavTabs}
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
        onSaveChecklist={
          selectedCardForModal
            ? (checklist) => handleAdminSaveChecklist(Number(selectedCardForModal.id), checklist)
            : undefined
        }
        onSavePreviewUrl={
          selectedCardForModal
            ? (previewUrl) => handleAdminSavePreviewUrl(Number(selectedCardForModal.id), previewUrl)
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
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">업종</label>
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
