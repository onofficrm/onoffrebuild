import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  Circle,
  Clock,
  ArrowRight,
  ExternalLink,
  GraduationCap,
  PlayCircle,
  HelpCircle,
  Filter,
  Layers,
  Wrench,
  Sparkles,
  Info,
  Check,
  ChevronDown,
  ChevronUp,
  Target,
  BarChart3,
  Award,
  FileCheck,
  Edit3,
  Link,
  Image as ImageIcon
} from 'lucide-react';
import { RoadmapStep, NavigationTab, TaskWorkLog } from '../../types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';
import { TaskWorkLogModal } from './TaskWorkLogModal';

export interface DetailedRoadmapStepItem extends RoadmapStep {
  whyNeeded?: string;
  completionCriteria?: string;
  currentResult?: string;
  lectureTitle?: string;
  lectureDuration?: string;
  toolName?: string;
  ctaText?: string;
}

export interface RoadmapViewProps {
  steps: DetailedRoadmapStepItem[];
  taskWorkLogs?: TaskWorkLog[];
  onToggleChecklistItem: (stepId: number, checkId: string) => void;
  onSaveTaskLog?: (log: Omit<TaskWorkLog, 'id' | 'createdAt' | 'status'>) => void;
  onUploadScreenshot?: (file: File) => Promise<number>;
  onNavigate: (tab: NavigationTab, subTab?: string) => void;
  onOpenOnboarding?: () => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  steps,
  taskWorkLogs = [],
  onToggleChecklistItem,
  onSaveTaskLog,
  onUploadScreenshot,
  onNavigate,
  onOpenOnboarding
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'in_progress' | 'completed' | 'pending'>('all');
  const [expandedStepIds, setExpandedStepIds] = useState<number[]>([4, 5, 6]); // Expand active in-progress steps by default

  // Work Log Modal State
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [activeLoggingStep, setActiveLoggingStep] = useState<DetailedRoadmapStepItem | null>(null);
  const [activeLoggingTaskId, setActiveLoggingTaskId] = useState<string>('');
  const [activeLoggingTaskTitle, setActiveLoggingTaskTitle] = useState('');

  const toggleExpand = (stepId: number) => {
    if (expandedStepIds.includes(stepId)) {
      setExpandedStepIds(expandedStepIds.filter((id) => id !== stepId));
    } else {
      setExpandedStepIds([...expandedStepIds, stepId]);
    }
  };

  const expandAll = () => {
    setExpandedStepIds(steps.map((s) => s.id));
  };

  const collapseAll = () => {
    setExpandedStepIds([]);
  };

  const totalSteps = steps.length;
  const completedSteps = steps.filter((s) => s.status === 'completed').length;
  const overallProgress = totalSteps ? Math.round((completedSteps / totalSteps) * 100) : 0;

  const filteredSteps = steps.filter((step) => {
    if (selectedFilter === 'all') return true;
    return step.status === selectedFilter;
  });

  const handleOpenLogModal = (step: DetailedRoadmapStepItem) => {
    const item =
      step.checklist.find((c) => !c.completed && c.helpTip) ||
      step.checklist.find((c) => !c.completed) ||
      step.checklist[0];
    setActiveLoggingStep(step);
    setActiveLoggingTaskId(item ? item.id : '');
    setActiveLoggingTaskTitle(item ? item.text : step.title);
    setIsLogModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF6FF] text-[#2563EB] text-xs font-bold border border-[#DBEAFE]">
            <Compass className="w-3.5 h-3.5" />
            <span>SEO SYSTEM 300 실행 로드맵 (Full Lifecycle)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
            10단계 SEO 마스터 실행 로드맵
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
            기획부터 도메인, 제작, 테크니컬 설정, 키워드, 콘텐츠 자동화, 백링크, 트래픽, 성과분석, 반복 성장까지
            단순 체크를 넘어 **작업 결과(URL, 키워드, 발행일, 메모)**를 증빙하고 성장일지로 축적합니다.
          </p>
        </div>

        {/* Progress Card */}
        <div className="bg-[#F8FAFC] rounded-2xl p-5 border border-[#E2E8F0] w-full md:w-auto md:min-w-[260px] min-w-0 shrink-0 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#64748B] font-bold">전체 로드맵 진행률</span>
            <span className="text-[#2563EB] font-bold">{completedSteps}/{totalSteps} 단계 완료</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#0F172A]">{overallProgress}%</span>
            <span className="text-xs text-[#64748B] font-medium">달성 완료</span>
          </div>
          <div className="w-full bg-[#E2E8F0] rounded-full h-2 overflow-hidden">
            <div
              className="bg-[#2563EB] h-2 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </div>

      {steps.length === 0 ? (
        <div className="bg-white border border-[#E2E8F0] rounded-3xl p-10 text-center space-y-3">
          <h2 className="text-lg font-black">먼저 SEO 프로젝트를 만들어주세요.</h2>
          <p className="text-sm text-slate-500">프로젝트를 선택하면 10단계 로드맵이 표시됩니다.</p>
          {onOpenOnboarding ? (
            <Button variant="primary" onClick={onOpenOnboarding}>
              새 프로젝트 만들기
            </Button>
          ) : null}
        </div>
      ) : null}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-white border border-[#E2E8F0] rounded-2xl shadow-2xs">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedFilter === 'all'
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
            }`}
          >
            전체 10단계 ({totalSteps})
          </button>
          <button
            onClick={() => setSelectedFilter('in_progress')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedFilter === 'in_progress'
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
            }`}
          >
            진행중 ({steps.filter((s) => s.status === 'in_progress').length})
          </button>
          <button
            onClick={() => setSelectedFilter('completed')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedFilter === 'completed'
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
            }`}
          >
            완료됨 ({completedSteps})
          </button>
          <button
            onClick={() => setSelectedFilter('pending')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedFilter === 'pending'
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
            }`}
          >
            대기중 ({steps.filter((s) => s.status === 'pending').length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={expandAll} className="text-xs text-[#64748B]">
            모두 펼치기
          </Button>
          <span className="text-[#CBD5E1]">|</span>
          <Button variant="ghost" size="sm" onClick={collapseAll} className="text-xs text-[#64748B]">
            모두 접기
          </Button>
        </div>
      </div>

      {/* 10-Step Detailed Interactive Cards List */}
      <div className="space-y-4">
        {filteredSteps.map((step) => {
          const isExpanded = expandedStepIds.includes(step.id);
          const isCompleted = step.status === 'completed';
          const isInProgress = step.status === 'in_progress';
          const isPending = step.status === 'pending';

          const completedChecklistCount = step.checklist.filter((c) => c.completed).length;
          const totalChecklistCount = step.checklist.length;

          // Find matching task work log if exists
          const existingWorkLog = taskWorkLogs.find(
            (log) => Number(log.taskId) === step.id || Number(log.taskId) === step.stepNumber
          );

          return (
            <div
              key={step.id}
              className={`rounded-3xl border transition-all duration-200 overflow-hidden bg-white ${
                isInProgress
                  ? 'border-[#2563EB] ring-2 ring-[#2563EB]/10 shadow-md'
                  : isCompleted
                  ? 'border-[#E2E8F0] shadow-2xs'
                  : 'border-[#E2E8F0] opacity-85'
              }`}
            >
              {/* Header Bar */}
              <div
                onClick={() => toggleExpand(step.id)}
                className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-[#F8FAFC]/70 transition-colors"
              >
                <div className="flex items-start sm:items-center gap-4 min-w-0">
                  {/* Step Status Icon / Number */}
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs ${
                      isCompleted
                        ? 'bg-[#ECFDF5] text-[#10B981] border border-[#A7F3D0]'
                        : isInProgress
                        ? 'bg-[#2563EB] text-white shadow-xs'
                        : 'bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <span>{step.stepNumber < 10 ? `0${step.stepNumber}` : step.stepNumber}</span>
                    )}
                  </div>

                  {/* Titles */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="text-sm sm:text-base font-bold text-[#0F172A] truncate">
                        {step.title}
                      </h3>

                      {/* Status Tag */}
                      {isCompleted && (
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#10B981] border border-[#A7F3D0] inline-flex items-center gap-1">
                          <Check className="w-3 h-3" /> 완료
                        </span>
                      )}
                      {isInProgress && (
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE] inline-flex items-center gap-1 animate-pulse">
                          ● 진행중
                        </span>
                      )}
                      {isPending && (
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]">
                          시작 전
                        </span>
                      )}

                      <span className="text-[11px] text-[#64748B] font-medium hidden md:inline">
                        예상 소요: {step.durationEst}
                      </span>
                    </div>
                    <p className="text-xs text-[#64748B] mt-1 truncate">{step.subTitle}</p>
                  </div>
                </div>

                {/* Progress Bar & Toggle */}
                <div className="flex items-center justify-between sm:justify-end gap-5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F1F5F9]">
                  <div className="text-right min-w-[100px]">
                    <div className="flex items-center justify-end gap-1.5">
                      <span className="text-xs font-bold text-[#0F172A]">진행률 {step.progress}%</span>
                    </div>
                    <div className="w-24 bg-[#F1F5F9] rounded-full h-2 mt-1.5 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          isCompleted ? 'bg-[#10B981]' : isInProgress ? 'bg-[#2563EB]' : 'bg-[#94A3B8]'
                        }`}
                        style={{ width: `${step.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#64748B]">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Expanded Details Body */}
              {isExpanded && (
                <div className="p-6 pt-0 border-t border-[#F1F5F9] space-y-5 animate-in fade-in duration-150">
                  {/* Step Description */}
                  <p className="text-xs sm:text-sm text-[#334155] leading-relaxed pt-4">
                    {step.description}
                  </p>

                  {/* ========================================================================= */}
                  {/* [작업 결과 기록 완료 카드 (Proof of Work Box)] */}
                  {/* ========================================================================= */}
                  {existingWorkLog ? (
                    <div className="p-4 sm:p-5 rounded-2xl bg-[#F8FAFC] border-2 border-[#2563EB]/30 space-y-3 shadow-2xs">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                            <span>✅ 완료 ({existingWorkLog.publishDate})</span>
                          </span>
                          <Badge variant="blue" size="sm">
                            {existingWorkLog.relatedTool.toUpperCase()}
                          </Badge>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                          onClick={() => handleOpenLogModal(step)}
                          className="text-xs text-[#2563EB] bg-white border-[#DBEAFE]"
                        >
                          작업 결과 수정
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 rounded-xl bg-white border border-[#E2E8F0] space-y-1">
                          <span className="text-[#64748B] font-bold block">등록 URL:</span>
                          <a
                            href={existingWorkLog.url}
                            target="_blank"
                            rel="noreferrer"
                            className="font-mono text-[#2563EB] hover:underline truncate flex items-center gap-1 font-bold"
                          >
                            <Link className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{existingWorkLog.url}</span>
                          </a>
                        </div>

                        <div className="p-3 rounded-xl bg-white border border-[#E2E8F0] space-y-1">
                          <span className="text-[#64748B] font-bold block">목표 키워드:</span>
                          <span className="font-bold text-[#0F172A] block">{existingWorkLog.targetKeyword}</span>
                        </div>
                      </div>

                      {existingWorkLog.notes && (
                        <div className="p-3 rounded-xl bg-white border border-[#E2E8F0] text-xs text-[#475569] leading-relaxed">
                          <strong className="text-[#0F172A] block mb-0.5">작업 메모:</strong>
                          {existingWorkLog.notes}
                        </div>
                      )}
                    </div>
                  ) : (
                    /* If no log recorded yet, show a CTA banner to record work */
                    <div className="p-4 rounded-2xl bg-[#EFF6FF] border border-[#DBEAFE] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <FileCheck className="w-5 h-5 text-[#2563EB]" />
                        <div>
                          <h4 className="text-xs font-bold text-[#1E40AF]">작업 결과 기록하기 (Proof of Work)</h4>
                          <p className="text-[11px] text-[#1E3A8A]">
                            URL, 목표 키워드, 발행일, 작업 메모를 등록하면 프로젝트 성장일지에 자동 기록됩니다.
                          </p>
                        </div>
                      </div>

                      <Button
                        variant="primary"
                        size="sm"
                        leftIcon={<FileCheck className="w-3.5 h-3.5" />}
                        onClick={() => handleOpenLogModal(step)}
                        className="bg-[#2563EB] hover:bg-blue-700 font-bold shrink-0"
                      >
                        작업 결과 기록
                      </Button>
                    </div>
                  )}

                  {/* 4-Box Grid: 왜 필요한가요? / 완료조건 / 작업결과 / 관련강의 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {/* 1. 왜 필요한가요? */}
                    <div className="p-4 rounded-2xl bg-[#EFF6FF] border border-[#DBEAFE] space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E40AF]">
                        <Info className="w-3.5 h-3.5 text-[#2563EB]" />
                        <span>왜 필요한가요?</span>
                      </div>
                      <p className="text-xs text-[#1E3A8A] leading-relaxed font-medium">
                        {step.whyNeeded || '해당 단계는 구글 검색엔진 크롤링 및 상위 랭킹 알고리즘에 직접적인 영향을 주는 핵심 프로세스입니다.'}
                      </p>
                    </div>

                    {/* 2. 완료 조건 */}
                    <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F172A]">
                        <Target className="w-3.5 h-3.5 text-[#2563EB]" />
                        <span>완료 조건 (Criteria)</span>
                      </div>
                      <p className="text-xs text-[#475569] leading-relaxed">
                        {step.completionCriteria || '모든 필수 체크리스트 항목 100% 완료 및 결과 지표 등록'}
                      </p>
                    </div>

                    {/* 3. 현재 작업 결과 */}
                    <div className="p-4 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#065F46]">
                        <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
                        <span>현재 작업 결과</span>
                      </div>
                      <p className="text-xs text-[#047857] leading-relaxed font-bold">
                        {step.currentResult || (isCompleted ? '정상 완료됨' : '진행 중인 데이터 측정 중')}
                      </p>
                    </div>

                    {/* 4. 관련 강의 & 시간 */}
                    <div className="p-4 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#92400E]">
                          <GraduationCap className="w-3.5 h-3.5 text-[#D97706]" />
                          <span>관련 강의 (SYSTEM 300)</span>
                        </div>
                        {step.lectureDuration && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#92400E] border border-[#FCD34D]">
                            {step.lectureDuration}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#78350F] truncate font-medium">
                        {step.lectureTitle || `0${step.stepNumber}강. SYSTEM 300 가이드`}
                      </p>
                    </div>
                  </div>

                  {/* Actionable Checklist (해야 할 일) */}
                  <div className="space-y-2.5 pt-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
                        <span>해야 할 일 (Checklist)</span>
                        <span className="text-[#2563EB] font-mono">
                          {completedChecklistCount}/{totalChecklistCount}
                        </span>
                      </h4>
                      <span className="text-[11px] text-[#64748B]">
                        항목을 클릭하여 완료 여부를 실시간 토글할 수 있습니다.
                      </span>
                    </div>

                    <div className="space-y-2">
                      {step.checklist.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => onToggleChecklistItem(step.id, item.id)}
                          className={`flex items-start justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                            item.completed
                              ? 'bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B]'
                              : 'bg-white border-[#E2E8F0] hover:border-[#2563EB] hover:bg-[#F8FAFC]'
                          }`}
                        >
                          <div className="flex items-start gap-3 min-w-0 pr-2">
                            <button className="mt-0.5 shrink-0">
                              {item.completed ? (
                                <CheckCircle2 className="w-5 h-5 text-[#10B981] fill-[#ECFDF5]" />
                              ) : (
                                <Circle className="w-5 h-5 text-[#CBD5E1] hover:text-[#2563EB]" />
                              )}
                            </button>
                            <div>
                              <span
                                className={`text-xs font-bold block ${
                                  item.completed ? 'line-through text-[#94A3B8]' : 'text-[#0F172A]'
                                }`}
                              >
                                {item.text}
                              </span>
                              {item.helpTip && (
                                <p className="text-[11px] text-[#B45309] font-medium mt-1 flex items-center gap-1">
                                  <HelpCircle className="w-3 h-3" />
                                  <span>{item.helpTip}</span>
                                </p>
                              )}
                            </div>
                          </div>

                          {item.required && (
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#F1F5F9] text-[#475569] font-bold shrink-0">
                              필수
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Connected Actions Footers & CTAs */}
                  <div className="pt-4 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      {/* Connected SEO Tool CTA */}
                      {step.connectedTool && (
                        <Button
                          variant="primary"
                          size="md"
                          leftIcon={<Wrench className="w-4 h-4" />}
                          onClick={() => {
                            if (step.connectedTool === 'website') {
                              onNavigate('website', 'status');
                            } else {
                              onNavigate('tools', step.connectedTool);
                            }
                          }}
                        >
                          {step.toolName ? `${step.toolName} 열기` : '연동 도구 열기'}
                        </Button>
                      )}

                      {/* Watch Lecture CTA */}
                      {step.lectureModuleId && (
                        <Button
                          variant="outline"
                          size="md"
                          leftIcon={<PlayCircle className="w-4 h-4 text-[#2563EB]" />}
                          onClick={() => onNavigate('curriculum')}
                        >
                          강의 시청하기 ({step.lectureDuration || '영상 보기'})
                        </Button>
                      )}

                      {/* Primary Step CTA */}
                      <Button
                        variant="secondary"
                        size="md"
                        rightIcon={<ArrowRight className="w-4 h-4" />}
                        onClick={() => {
                          if (step.connectedTool === 'website') {
                            onNavigate('website', 'order');
                          } else if (step.connectedTool) {
                            onNavigate('tools', step.connectedTool);
                          } else if (step.stepNumber === 1 && onOpenOnboarding) {
                            onOpenOnboarding();
                          } else if (step.stepNumber === 9) {
                            onNavigate('reports');
                          } else {
                            onNavigate('missions');
                          }
                        }}
                      >
                        {step.ctaText || '계속 진행 →'}
                      </Button>
                    </div>

                    <span className="text-[11px] text-[#64748B] font-medium">
                      모든 필수 항목 완료 시 다음 단계가 자동 승인됩니다.
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Task Work Log Proof Modal */}
      {isLogModalOpen && activeLoggingStep && (
        <TaskWorkLogModal
          isOpen={isLogModalOpen}
          onClose={() => {
            setIsLogModalOpen(false);
            setActiveLoggingStep(null);
            setActiveLoggingTaskId('');
          }}
          taskId={activeLoggingTaskId || activeLoggingStep.id}
          taskTitle={activeLoggingTaskTitle || activeLoggingStep.title}
          defaultKeyword=""
          defaultTool={
            activeLoggingStep.connectedTool === 'website'
              ? 'direct'
              : (activeLoggingStep.connectedTool as any) || 'content'
          }
          existingLog={taskWorkLogs.find(
            (log) => String(log.taskId) === String(activeLoggingTaskId)
          )}
          onUploadScreenshot={onUploadScreenshot}
          onSaveLog={(logData) => {
            if (onSaveTaskLog) {
              onSaveTaskLog(logData);
            }
          }}
        />
      )}
    </div>
  );
};
