import React, { useState } from 'react';
import {
  CheckSquare2,
  Flame,
  Award,
  CheckCircle2,
  Circle,
  ArrowRight,
  Clock,
  Sparkles,
  Calendar,
  Layers,
  ChevronRight,
  Plus,
  PlayCircle,
  ExternalLink,
  Wrench,
  Check,
  Zap,
  Timer
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DailyMission, NavigationTab } from '../../types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export interface DetailedMissionItem extends DailyMission {
  estimatedTime?: string;
  lectureDuration?: string;
  lectureTitle?: string;
  toolName?: string;
  actionButtonLabel?: string;
}

export interface MissionsViewProps {
  missions: DetailedMissionItem[];
  onToggleMission: (id: string) => void;
  onNavigate: (tab: NavigationTab, subTab?: string) => void;
}

export const MissionsView: React.FC<MissionsViewProps> = ({
  missions,
  onToggleMission,
  onNavigate
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const streakDays = 0;

  const completedCount = missions.filter((m) => m.isCompleted).length;
  const totalCount = missions.length;
  const isAllCompleted = totalCount > 0 && completedCount === totalCount;

  const handleToggle = (id: string, currentlyCompleted: boolean) => {
    onToggleMission(id);
    if (!currentlyCompleted && completedCount + 1 === totalCount) {
      // Trigger celebratory confetti on finishing all daily missions
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  const filteredMissions = missions.filter((m) => {
    if (filter === 'pending') return !m.isCompleted;
    if (filter === 'completed') return m.isCompleted;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner (Clean Professional SaaS Header) */}
      <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF6FF] text-[#2563EB] text-xs font-bold border border-[#DBEAFE]">
            <CheckSquare2 className="w-3.5 h-3.5" />
            <span>Daily Action Board</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
            오늘의 SEO 미션
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
            전체 과업을 한꺼번에 마주하지 않고, 하루 3~5개의 핵심 실행 과제에 집중하여
            검색 상위노출 지수를 매일 확실하게 성장시킵니다.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap">
          {/* Estimated Work Time */}
          <div className="bg-[#F8FAFC] rounded-2xl p-4.5 border border-[#E2E8F0] min-w-[130px] space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-[#64748B] font-bold">
              <Clock className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>오늘 예상 작업</span>
            </div>
            <div className="text-xl font-bold text-[#0F172A]">{totalCount}개</div>
          </div>

          {/* Streak Days */}
          <div className="bg-[#EFF6FF] rounded-2xl p-4.5 border border-[#DBEAFE] min-w-[130px] space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-[#1E40AF] font-bold">
              <Flame className="w-3.5 h-3.5 text-[#2563EB] fill-[#2563EB]" />
              <span>SEO 연속 실행</span>
            </div>
            <div className="text-xl font-bold text-[#2563EB]">{streakDays} Days</div>
          </div>

          {/* Progress Status */}
          <div className="bg-[#F8FAFC] rounded-2xl p-4.5 border border-[#E2E8F0] min-w-[130px] space-y-1">
            <div className="text-xs text-[#64748B] font-bold">오늘 달성률</div>
            <div className="text-xl font-bold text-[#0F172A]">
              {completedCount}/{totalCount} 완료
            </div>
          </div>
        </div>
      </div>

      {totalCount === 0 ? (
        <div className="bg-white border border-[#E2E8F0] rounded-3xl p-10 text-center space-y-2">
          <h2 className="text-lg font-black">먼저 SEO 프로젝트를 만들어주세요.</h2>
          <p className="text-sm text-slate-500">프로젝트를 선택하면 오늘 미션이 생성됩니다.</p>
          <Button variant="primary" onClick={() => onNavigate('projects')}>
            프로젝트로 이동
          </Button>
        </div>
      ) : null}

      {/* Celebration Banner when all completed */}
      {isAllCompleted && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-[#ECFDF5] to-[#F0FDF4] border border-[#A7F3D0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-300">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#10B981] text-white flex items-center justify-center shrink-0 shadow-sm">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#065F46]">
                오늘 미션 {totalCount}/{totalCount} 완료 🎉
              </h3>
              <p className="text-xs text-[#047857] mt-0.5">
                SEO 연속 실행: {streakDays} Days! 오늘 할당된 모든 과업을 성공적으로 완료했습니다. 내일 새로운 미션이 배정됩니다.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('roadmap')}
              className="bg-white border-[#A7F3D0] text-[#065F46] hover:bg-[#ECFDF5]"
            >
              SEO 로드맵 확인하기 →
            </Button>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-white border border-[#E2E8F0] rounded-2xl shadow-2xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
            }`}
          >
            오늘의 전체 미션 ({totalCount})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'pending'
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
            }`}
          >
            진행 대기 ({totalCount - completedCount})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'completed'
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
            }`}
          >
            완료됨 ({completedCount})
          </button>
        </div>

        <span className="text-xs text-[#64748B] flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>오늘 기준 23:59까지 완료 시 연속 실행 기록이 유지됩니다.</span>
        </span>
      </div>

      {/* Focused Daily Mission Cards */}
      <div className="space-y-3.5">
        {filteredMissions.map((mission, idx) => {
          const isDone = mission.isCompleted;

          return (
            <div
              key={mission.id}
              className={`p-5 sm:p-6 rounded-3xl border transition-all duration-150 flex flex-col md:flex-row md:items-center justify-between gap-5 bg-white ${
                isDone
                  ? 'border-[#E2E8F0] bg-[#F8FAFC]/70 opacity-90'
                  : 'border-[#E2E8F0] hover:border-[#2563EB] hover:shadow-xs'
              }`}
            >
              {/* Left Info */}
              <div className="flex items-start gap-4 min-w-0">
                {/* Complete Checkbox Button */}
                <button
                  onClick={() => handleToggle(mission.id, isDone)}
                  className="mt-0.5 transition-colors cursor-pointer shrink-0"
                >
                  {isDone ? (
                    <CheckCircle2 className="w-6 h-6 text-[#10B981] fill-[#ECFDF5]" />
                  ) : (
                    <Circle className="w-6 h-6 text-[#CBD5E1] hover:text-[#2563EB]" />
                  )}
                </button>

                <div className="min-w-0 space-y-1.5">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE] font-mono">
                      미션 {idx + 1}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#F1F5F9] text-[#64748B]">
                      STEP {mission.stepNumber}
                    </span>

                    <h3
                      className={`text-sm sm:text-base font-bold truncate ${
                        isDone ? 'line-through text-[#94A3B8]' : 'text-[#0F172A]'
                      }`}
                    >
                      {mission.title}
                    </h3>

                    {isDone ? (
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#10B981] border border-[#A7F3D0]">
                        완료됨
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE]">
                        오늘 진행
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#64748B] leading-relaxed max-w-2xl">
                    {mission.description}
                  </p>

                  {/* Metadata Chips: 예상시간 & 관련강의 */}
                  <div className="flex items-center gap-3 pt-1 flex-wrap text-xs text-[#64748B]">
                    {mission.estimatedTime && (
                      <span className="inline-flex items-center gap-1 font-semibold text-[#0F172A]">
                        <Clock className="w-3.5 h-3.5 text-[#2563EB]" />
                        <span>예상시간: {mission.estimatedTime}</span>
                      </span>
                    )}

                    {mission.lectureDuration && (
                      <span className="inline-flex items-center gap-1 font-medium text-[#475569] bg-[#F1F5F9] px-2 py-0.5 rounded-md">
                        <PlayCircle className="w-3.5 h-3.5 text-[#2563EB]" />
                        <span>관련강의: {mission.lectureDuration}</span>
                      </span>
                    )}

                    <span className="text-[11px] text-[#94A3B8]">{mission.dueDate}</span>
                  </div>
                </div>
              </div>

              {/* Right Action Buttons */}
              <div className="flex items-center gap-2.5 justify-end shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[#F1F5F9]">
                {/* Dedicated Tool Open Button */}
                <Button
                  variant="outline"
                  size="md"
                  leftIcon={<Wrench className="w-4 h-4 text-[#2563EB]" />}
                  onClick={() => onNavigate(mission.targetTab, mission.targetSubTab)}
                  className="bg-white border-[#E2E8F0] hover:bg-[#F8FAFC] text-xs font-bold"
                >
                  {mission.actionButtonLabel || '도구 열기'}
                </Button>

                {/* Complete Toggle Button */}
                <Button
                  variant={isDone ? 'secondary' : 'primary'}
                  size="md"
                  leftIcon={isDone ? <Check className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                  onClick={() => handleToggle(mission.id, isDone)}
                  className="text-xs font-bold"
                >
                  {isDone ? '완료 취소' : '완료 처리'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
