/**
 * Demo-only student portal data access.
 * Production GNUBoard / API clients must live in a separate module — do not merge here.
 */
import {
  AI_COACH_INSIGHTS,
  INITIAL_MISSIONS,
  INITIAL_PROJECT,
  INITIAL_REVISIONS,
  INITIAL_WEBSITE_ORDER,
  MOCK_NOTIFICATIONS,
  MOCK_PROJECTS,
  MOCK_SEO_TIMELINE_ITEMS,
  MOCK_TASK_WORK_LOGS,
  RECENT_ACTIVITIES,
  ROADMAP_STEPS,
} from '../mocks/studentFixtures';
export function loadStudentDemoState() {
  return {
    source: 'mock' as const,
    projects: MOCK_PROJECTS,
    activeProject: INITIAL_PROJECT,
    websiteOrder: INITIAL_WEBSITE_ORDER,
    revisions: INITIAL_REVISIONS,
    roadmapSteps: ROADMAP_STEPS,
    missions: INITIAL_MISSIONS,
    activities: RECENT_ACTIVITIES,
    notifications: MOCK_NOTIFICATIONS,
    taskWorkLogs: MOCK_TASK_WORK_LOGS,
    seoTimelineItems: MOCK_SEO_TIMELINE_ITEMS,
    coachInsights: AI_COACH_INSIGHTS,
  };
}
