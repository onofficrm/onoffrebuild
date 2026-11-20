/**
 * Copy to lessonNN.ts, rename LESSON_TEMPLATE, fill in, then add it to LESSONS in ./index.ts.
 * Not registered — kept here so the shape stays type-checked.
 * Visual rules: .cursor/rules/education-slides-ppt-style.mdc
 */
import { Flag, Rocket, Search, Target } from 'lucide-react';
import type { LessonDefinition } from '../shared/slideSpec';

export const LESSON_TEMPLATE: LessonDefinition = {
  id: 'lesson-N',
  number: 0,
  title: '강의 전체 제목',
  shortTitle: '짧은 제목',
  description: '강의 카드에 보이는 한 줄 설명',
  duration: '약 30분',
  slides: [
    {
      slug: 'lN-cover',
      category: 'N강 · COVER',
      menuTitle: 'N강 · 짧은 제목',
      menuSubtitle: '사이드바 보조 설명',
      kicker: 'LECTURE 0N · 주제',
      title: '슬라이드 제목 (한 줄)',
      subtitle: '짧은 부제',
      icon: Rocket,
      diagram: {
        type: 'StepFlow',
        steps: [
          { label: '진단', tone: 'cyan', icon: Search },
          { label: '목표', tone: 'blue', icon: Target },
          { label: '실행', tone: 'emerald', icon: Flag },
        ],
      },
      outcome: { label: '이 슬라이드의 결론 한 줄' },
    },
  ],
  explanations: {
    'lN-cover': {
      shortTitle: '짧은 제목',
      visualKeywords: ['진단', '목표', '실행'],
      explanation: {
        summary: '슬라이드 아래 설명 패널의 요약 문장',
        details: [{ heading: '상세 설명 소제목', body: ['슬라이드에서 뺀 자세한 문장은 여기에 둡니다.'] }],
        action: ['수강생이 바로 할 일'],
      },
      relatedLabel: '관련 화면 열기',
    },
  },
};