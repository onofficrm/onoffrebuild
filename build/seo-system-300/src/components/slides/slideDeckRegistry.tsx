import type { ComponentType } from 'react';
import { LESSONS } from '../../education/slides/lessons';
import { SlideRenderer } from '../../education/slides/shared/SlideRenderer';
import type { LessonDefinition, SlideSpec } from '../../education/slides/shared/slideSpec';
import type { SlideLearningContent } from './content';

export interface EducationSlide {
  id: number;
  globalId: number;
  slug: string;
  category: string;
  title: string;
  subtitle?: string;
  spec: SlideSpec;
  component: ComponentType;
  learningContent: SlideLearningContent;
}

export interface EducationDeck {
  id: string;
  lessonNumber: number;
  title: string;
  shortTitle: string;
  description: string;
  duration: string;
  slides: EducationSlide[];
}

const TOTAL = LESSONS.reduce((total, lesson) => total + lesson.slides.length, 0);

function learningContentFor(lesson: LessonDefinition, spec: SlideSpec, order: number): SlideLearningContent {
  const authored = lesson.explanations[spec.slug];
  const base = authored ?? {
    shortTitle: spec.title,
    visualKeywords: [],
    explanation: { summary: spec.subtitle ?? spec.title },
  };
  return {
    ...base,
    id: `${lesson.id}-slide-${String(order).padStart(2, '0')}`,
    lessonId: lesson.id,
    lessonNumber: lesson.number,
    order,
  };
}

function buildDecks(): EducationDeck[] {
  const seen = new Set<string>();
  let globalId = 0;

  return LESSONS.map((lesson) => ({
    id: lesson.id,
    lessonNumber: lesson.number,
    title: lesson.title,
    shortTitle: lesson.shortTitle,
    description: lesson.description,
    duration: lesson.duration,
    slides: lesson.slides.map((spec, index) => {
      if (seen.has(spec.slug)) {
        throw new Error(`Duplicate education slide slug: ${spec.slug}`);
      }
      seen.add(spec.slug);
      if (import.meta.env.DEV && !lesson.explanations[spec.slug]) {
        console.warn(`[slides] ${lesson.id}/${spec.slug} has no explanation entry`);
      }

      globalId += 1;
      const page = globalId;
      const Slide = () => <SlideRenderer spec={spec} page={page} total={TOTAL} lesson={lesson.number} />;
      Slide.displayName = `Slide(${spec.slug})`;

      return {
        id: index + 1,
        globalId: page,
        slug: spec.slug,
        category: spec.category,
        title: spec.menuTitle,
        subtitle: spec.menuSubtitle,
        spec,
        component: Slide,
        learningContent: learningContentFor(lesson, spec, index + 1),
      };
    }),
  }));
}

export const EDUCATION_DECKS: EducationDeck[] = buildDecks();

export const DEFAULT_DECK = EDUCATION_DECKS[0];
export const TOTAL_EDUCATION_SLIDES = TOTAL;

export function getEducationDeck(deckId?: string): EducationDeck {
  return EDUCATION_DECKS.find((deck) => deck.id === deckId) ?? DEFAULT_DECK;
}

export function getNextDeck(deck: EducationDeck): EducationDeck | undefined {
  return EDUCATION_DECKS[EDUCATION_DECKS.indexOf(deck) + 1];
}

export function getPreviousDeck(deck: EducationDeck): EducationDeck | undefined {
  const index = EDUCATION_DECKS.indexOf(deck);
  return index > 0 ? EDUCATION_DECKS[index - 1] : undefined;
}
