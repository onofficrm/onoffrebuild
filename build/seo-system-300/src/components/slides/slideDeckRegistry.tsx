import type { ComponentType } from 'react';
import { SLIDES as AUTHORING_SLIDES } from '../../education/slides/slideCatalog';
import {
  Slide01Cover,
  Slide02WhyProcess,
  Slide03Philosophy,
  Slide04PipelineOverview,
  Slide05Step01Domain,
  Slide06Step02Website,
  Slide07Step03Content,
  Slide08Step04Indexing,
  Slide09Step05Backlink,
  Slide10Step06Traffic,
  Slide11Step07Analytics,
  Slide12Step08GEO,
  Slide13SEOAndGEO,
  Slide14FlywheelLoop,
  Slide15PlatformEcosystem,
  Slide16StudentJourney,
  Slide17ProjectOutcomes,
  Slide18Lesson1Mission,
  Slide19CompletionCriteria,
  Slide20NextPreview,
} from '../../education/slides/lesson01';
import {
  Slide21Cover,
  Slide22WhatIsExpiredDomain,
  Slide23WhyAnalyze,
  Slide24HolisticEvaluation,
  Slide25Check01Relevance,
  Slide26Check02History,
  Slide27Check03Backlinks,
  Slide28Check04AnchorText,
  Slide29Check05SpamSignals,
  Slide30ExpiredDomainAbuse,
  Slide31ToolDashboard,
  Slide32AnalysisPipeline,
  Slide33CompareThreeCandidates,
  Slide34PassIsAlsoGood,
  Slide35Lesson2Mission,
  Slide36MissionOutcomes,
  Slide37CompletionCriteria,
  Slide38NextPreview,
} from '../../education/slides/lesson02';
import {
  SLIDE_LEARNING_CONTENT,
  type SlideLearningContent,
} from './content';

export interface EducationSlide {
  id: number;
  globalId: number;
  slug: string;
  category: string;
  title: string;
  subtitle?: string;
  component: ComponentType;
  learningContent: SlideLearningContent;
}

export interface EducationDeck {
  id: 'lesson-1' | 'lesson-2';
  lessonNumber: number;
  title: string;
  shortTitle: string;
  description: string;
  duration: string;
  slides: EducationSlide[];
}

const SLIDE_COMPONENTS: ComponentType[] = [
  Slide01Cover,
  Slide02WhyProcess,
  Slide03Philosophy,
  Slide04PipelineOverview,
  Slide05Step01Domain,
  Slide06Step02Website,
  Slide07Step03Content,
  Slide08Step04Indexing,
  Slide09Step05Backlink,
  Slide10Step06Traffic,
  Slide11Step07Analytics,
  Slide12Step08GEO,
  Slide13SEOAndGEO,
  Slide14FlywheelLoop,
  Slide15PlatformEcosystem,
  Slide16StudentJourney,
  Slide17ProjectOutcomes,
  Slide18Lesson1Mission,
  Slide19CompletionCriteria,
  Slide20NextPreview,
  Slide21Cover,
  Slide22WhatIsExpiredDomain,
  Slide23WhyAnalyze,
  Slide24HolisticEvaluation,
  Slide25Check01Relevance,
  Slide26Check02History,
  Slide27Check03Backlinks,
  Slide28Check04AnchorText,
  Slide29Check05SpamSignals,
  Slide30ExpiredDomainAbuse,
  Slide31ToolDashboard,
  Slide32AnalysisPipeline,
  Slide33CompareThreeCandidates,
  Slide34PassIsAlsoGood,
  Slide35Lesson2Mission,
  Slide36MissionOutcomes,
  Slide37CompletionCriteria,
  Slide38NextPreview,
];

function buildSlides(
  start: number,
  end: number,
  lessonId: EducationDeck['id'],
): EducationSlide[] {
  return AUTHORING_SLIDES.slice(start, end).map((slide, localIndex) => ({
    ...slide,
    id: localIndex + 1,
    globalId: slide.id,
    component: SLIDE_COMPONENTS[start + localIndex],
    learningContent: SLIDE_LEARNING_CONTENT[slide.slug] ?? {
      id: `${lessonId}-slide-${String(localIndex + 1).padStart(2, '0')}`,
      lessonId,
      order: localIndex + 1,
      shortTitle: slide.title,
      visualKeywords: [],
      explanation: {
        summary: slide.subtitle ?? slide.title,
        why: [],
        onoffUse: [],
        action: [],
      },
    },
  }));
}

export const EDUCATION_DECKS: EducationDeck[] = [
  {
    id: 'lesson-1',
    lessonNumber: 1,
    title: 'SEO·GEO 성과를 만드는 8단계 실전 프로세스',
    shortTitle: '전체 프로세스 이해',
    description: '도메인부터 GEO까지 연결되는 전체 실행 구조를 이해합니다.',
    duration: '약 35분',
    slides: buildSlides(0, 20, 'lesson-1'),
  },
  {
    id: 'lesson-2',
    lessonNumber: 2,
    title: '좋은 출발점을 고르는 낙장도메인 실전 분석',
    shortTitle: '낙장도메인 실전 분석',
    description: '좋은 도메인과 위험한 도메인을 근거로 구분하는 방법을 익힙니다.',
    duration: '약 40분',
    slides: buildSlides(20, 38, 'lesson-2'),
  },
];

export const DEFAULT_DECK = EDUCATION_DECKS[0];
export const TOTAL_EDUCATION_SLIDES = EDUCATION_DECKS.reduce(
  (total, deck) => total + deck.slides.length,
  0,
);

export function getEducationDeck(deckId?: string): EducationDeck {
  return EDUCATION_DECKS.find((deck) => deck.id === deckId) ?? DEFAULT_DECK;
}
