import { LESSONS } from './lessons';

export interface SlideData {
  id: number;
  slug: string;
  category: string;
  title: string;
  subtitle?: string;
}

/** Flat, derived view of every registered lecture's slides. Edit `lessons/` instead. */
export const SLIDES: SlideData[] = LESSONS.flatMap((lesson) => lesson.slides).map((spec, index) => ({
  id: index + 1,
  slug: spec.slug,
  category: spec.category,
  title: spec.menuTitle,
  subtitle: spec.menuSubtitle,
}));
