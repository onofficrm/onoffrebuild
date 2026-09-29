import type { LessonDefinition } from '../shared/slideSpec';
import { LESSON_01 } from './lesson01';
import { LESSON_02 } from './lesson02';

/**
 * The only place to register a lecture. Order here = lecture order.
 * Sidebar, page numbers, totals, and next-lecture navigation derive from this list.
 */
export const LESSONS: LessonDefinition[] = [LESSON_01, LESSON_02];
