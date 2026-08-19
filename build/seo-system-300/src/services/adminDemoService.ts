/**
 * Demo-only admin portal data access.
 * Do not call GNUBoard member/DB APIs from this file.
 */
import {
  MOCK_ADMIN_PRIORITY_ITEMS,
  MOCK_KANBAN_CARDS,
  MOCK_STUDENTS,
} from '../mocks/adminFixtures';

export function loadAdminDemoState() {
  return {
    source: 'mock' as const,
    priorityItems: MOCK_ADMIN_PRIORITY_ITEMS,
    kanbanCards: MOCK_KANBAN_CARDS,
    students: MOCK_STUDENTS,
  };
}
