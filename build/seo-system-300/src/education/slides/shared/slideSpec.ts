import type { LucideIcon } from 'lucide-react';
import type { SlideLearningContent } from '../../../components/slides/content/types';
import type { CompareColumn, DiagramItem } from './diagrams';

export type SlideDiagram =
  | { type: 'StepFlow'; steps: DiagramItem[] }
  | { type: 'CycleLoop'; center: string; centerIcon?: LucideIcon; steps: DiagramItem[] }
  | { type: 'HubSpokes'; hub: string; hubIcon?: LucideIcon; items: DiagramItem[] }
  | { type: 'CompareColumns'; columns: CompareColumn[] }
  | { type: 'PointTiles'; points: DiagramItem[] }
  | { type: 'KeywordRow'; words: DiagramItem[] }
  | { type: 'CheckList'; items: DiagramItem[] }
  | { type: 'Funnel'; layers: DiagramItem[] }
  | { type: 'LayerStack'; layers: DiagramItem[] };

export interface SlideSpec {
  /** Stable key; also the key into the lesson's `explanations`. */
  slug: string;
  /** Sidebar and viewer header label. */
  category: string;
  menuTitle: string;
  menuSubtitle?: string;
  kicker: string;
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  diagram: SlideDiagram;
  outcome?: { label: string; icon?: LucideIcon };
}

/** id, lessonId and order are filled in by the deck registry. */
export type LessonExplanation = Omit<SlideLearningContent, 'id' | 'lessonId' | 'order' | 'lessonNumber'> &
  Partial<Pick<SlideLearningContent, 'id' | 'lessonId' | 'order'>>;

export interface LessonDefinition {
  /** URL segment: /slides/{id}/{n}. */
  id: string;
  number: number;
  title: string;
  shortTitle: string;
  description: string;
  duration: string;
  slides: SlideSpec[];
  explanations: Record<string, LessonExplanation>;
}
