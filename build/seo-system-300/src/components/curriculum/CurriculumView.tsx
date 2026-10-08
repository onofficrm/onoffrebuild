import React, { useMemo, useState } from 'react';
import {
  GraduationCap,
  PlayCircle,
  CheckCircle2,
  Circle,
  Clock,
  Presentation
} from 'lucide-react';
import { CurriculumLesson } from '../../types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { EDUCATION_DECKS } from '../slides/slideDeckRegistry';

export interface CurriculumViewProps {
  lessons?: CurriculumLesson[];
  onOpenSlides?: (lessonId?: string) => void;
}

export const CurriculumView: React.FC<CurriculumViewProps> = ({ lessons: lessonOverrides, onOpenSlides }) => {
  const registeredLessons = useMemo<CurriculumLesson[]>(
    () =>
      EDUCATION_DECKS.map((deck, index) => ({
        id: index + 1,
        stepNumber: deck.lessonNumber,
        moduleTitle: `${deck.lessonNumber}강 · ${deck.shortTitle}`,
        title: deck.title,
        duration: deck.duration,
        completed: false,
        resources: [],
      })),
    []
  );
  const [lessons, setLessons] = useState<CurriculumLesson[]>(lessonOverrides || registeredLessons);

  const completedCount = lessons.filter((l) => l.completed).length;
  const totalCount = lessons.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const toggleComplete = (id: number) => {
    setLessons(
      lessons.map((l) => (l.id === id ? { ...l, completed: !l.completed } : l))
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold border border-blue-400/30">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>SEO SYSTEM 300 마스터클래스</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            수강생 전용 커리큘럼 & 실전 SOP
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/80 leading-relaxed">
            현재 등록된 강의를 순서대로 학습하고, 강의별 슬라이드와 실전 설명을 확인할 수 있습니다.
          </p>
        </div>

        <div className="min-w-[220px] shrink-0 space-y-2">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4.5 border border-white/15 text-center space-y-1">
            <span className="text-xs text-blue-200 font-medium">강의 수강 진척도</span>
            <div className="text-3xl font-black text-white">{progressPercent}%</div>
            <p className="text-[11px] text-emerald-300 font-bold">{completedCount}/{totalCount} 강 완료</p>
          </div>
          {onOpenSlides ? (
            <button
              type="button"
              onClick={onOpenSlides}
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 text-xs font-bold text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
            >
              <Presentation className="h-4 w-4" />
              첫 강의 시작하기
            </button>
          ) : null}
        </div>
      </div>

      {/* Registered lessons */}
      <div className="space-y-4">
        {lessons.map((lesson) => (
          <Card
            key={lesson.id}
            className={`p-5 transition-all ${
              lesson.completed ? 'bg-white border-slate-200' : 'bg-white border-slate-200 hover:border-blue-300'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5 min-w-0">
                <button
                  onClick={() => toggleComplete(lesson.id)}
                  className="mt-1 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer shrink-0"
                >
                  {lesson.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300" />
                  )}
                </button>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs font-bold text-blue-600">{lesson.moduleTitle}</span>
                    <Badge variant={lesson.completed ? 'green' : 'blue'} size="sm">
                      {lesson.completed ? '수강완료' : '수강대기'}
                    </Badge>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {lesson.duration}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">{lesson.title}</h3>

                  <p className="mt-2 text-xs text-slate-500">
                    {EDUCATION_DECKS[lesson.id - 1]?.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<PlayCircle className="w-4 h-4" />}
                  onClick={() => onOpenSlides?.(EDUCATION_DECKS[lesson.id - 1]?.id)}
                >
                  강의 보기
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

    </div>
  );
};
