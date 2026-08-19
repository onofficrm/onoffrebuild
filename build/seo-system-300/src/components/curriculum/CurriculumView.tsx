import React, { useState } from 'react';
import {
  GraduationCap,
  PlayCircle,
  Download,
  CheckCircle2,
  Circle,
  FileText,
  Clock,
  ExternalLink,
  BookOpen,
  Award,
  Video
} from 'lucide-react';
import { CurriculumLesson } from '../../types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { MOCK_CURRICULUM } from '../../mocks/studentFixtures';

export interface CurriculumViewProps {
  lessons?: CurriculumLesson[];
}

export const CurriculumView: React.FC<CurriculumViewProps> = () => {
  const [lessons, setLessons] = useState<CurriculumLesson[]>(MOCK_CURRICULUM);
  const [activeVideoLesson, setActiveVideoLesson] = useState<CurriculumLesson | null>(null);

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
            10단계 실행 프로세스별 핵심 강의 영상과 즉시 다운로드하여 사용할 수 있는
            엑셀/스프레드시트 템플릿을 제공합니다.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4.5 border border-white/15 min-w-[220px] shrink-0 text-center space-y-1">
          <span className="text-xs text-blue-200 font-medium">강의 수강 진척도</span>
          <div className="text-3xl font-black text-white">{progressPercent}%</div>
          <p className="text-[11px] text-emerald-300 font-bold">{completedCount}/{totalCount} 강 완료</p>
        </div>
      </div>

      {/* 10 Modules List */}
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

                  {/* Resource Badges */}
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {lesson.resources.map((res, i) => (
                      <button
                        key={i}
                        onClick={() => alert(`[다운로드] ${res.title} 파일이 저장되었습니다.`)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
                      >
                        <Download className="w-3 h-3 text-blue-600" />
                        <span>{res.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<PlayCircle className="w-4 h-4" />}
                  onClick={() => setActiveVideoLesson(lesson)}
                >
                  강의 영상 시청
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Video Player Modal */}
      {activeVideoLesson && (
        <Modal
          isOpen={true}
          onClose={() => setActiveVideoLesson(null)}
          title={activeVideoLesson.title}
          subtitle={`${activeVideoLesson.moduleTitle} (재생시간: ${activeVideoLesson.duration})`}
          maxWidth="2xl"
        >
          <div className="space-y-4">
            <div className="w-full aspect-video bg-slate-900 rounded-xl flex flex-col items-center justify-center text-white relative overflow-hidden shadow-inner">
              <div className="w-16 h-16 rounded-full bg-blue-600/80 hover:bg-blue-600 flex items-center justify-center cursor-pointer shadow-lg transition-transform hover:scale-105">
                <PlayCircle className="w-10 h-10 text-white" />
              </div>
              <p className="text-xs text-slate-400 mt-3 font-mono">
                [SEO SYSTEM 300] 마스터클래스 HD 스트리밍 플레이어
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl space-y-2 text-xs">
              <h4 className="font-bold text-slate-900">핵심 학습 포인트</h4>
              <p className="text-slate-600 leading-relaxed">
                해당 챕터에서는 구글 알고리즘 기준에 부합하는 실전 세팅 프로세스를 다룹니다.
                영상 시청 후 첨부된 엑셀 SOP를 다운로드하여 자신의 프로젝트에 즉시 적용하세요.
              </p>
            </div>

            <div className="flex justify-between items-center pt-2">
              <Button
                variant={activeVideoLesson.completed ? 'secondary' : 'success'}
                size="sm"
                leftIcon={<CheckCircle2 className="w-4 h-4" />}
                onClick={() => {
                  toggleComplete(activeVideoLesson.id);
                  setActiveVideoLesson(null);
                }}
              >
                {activeVideoLesson.completed ? '수강 취소' : '수강 완료로 체크'}
              </Button>
              <Button variant="outline" size="sm" onClick={() => setActiveVideoLesson(null)}>
                닫기
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
