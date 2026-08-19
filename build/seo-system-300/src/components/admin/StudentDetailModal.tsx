import React, { useEffect, useState } from 'react';
import { X, Compass, LayoutTemplate, BarChart3, History, MessageSquare, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { StudentSummary } from '../../types';
import { Button } from '../common/Button';
import { adminAddNote, adminStudentDetail } from '../../services/adminKanbanService';
import { ApiRequestError } from '../../services/apiClient';
import type { ApiRoadmap } from '../../services/roadmapService';

type LiveProject = {
  id: number;
  name?: string;
  domain?: string;
  progress?: number;
  websiteStatus?: string;
  websiteOrder?: { status?: string; progress?: number } | null;
  roadmap?: ApiRoadmap;
  todayMissions?: Array<{ id: number; title: string; isCompleted?: boolean; status?: string }>;
  recentActivity?: Array<{ id: number; title: string; createdAt?: string; activityType?: string }>;
  adminNotes?: Array<{ id: number; note: string; createdAt?: string }>;
};

export interface StudentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentSummary | null;
  onOpenOrderModal?: (studentId: string) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  isOpen,
  onClose,
  student,
  onOpenOrderModal
}) => {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'website' | 'seo' | 'history' | 'notes'>('roadmap');
  const [adminNoteInput, setAdminNoteInput] = useState('');
  const [liveProjects, setLiveProjects] = useState<LiveProject[]>([]);
  const [loadError, setLoadError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !student) return;
    let cancelled = false;
    setLoading(true);
    setLoadError('');
    adminStudentDetail(student.id)
      .then((data) => {
        if (cancelled) return;
        setLiveProjects((data.projects || []) as LiveProject[]);
      })
      .catch((err) => {
        if (cancelled) return;
        setLiveProjects([]);
        setLoadError(err instanceof ApiRequestError ? err.message : '불러오기 실패. 다시 시도해주세요.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isOpen, student]);

  if (!isOpen || !student) return null;

  const current = liveProjects[0];
  const roadmap = current?.roadmap;
  const notes = current?.adminNotes || [];
  const activities = current?.recentActivity || [];
  const missions = current?.todayMissions || [];

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminNoteInput.trim() || !current) return;
    try {
      await adminAddNote(current.id, 0, adminNoteInput.trim());
      setAdminNoteInput('');
      const data = await adminStudentDetail(student.id);
      setLiveProjects((data.projects || []) as LiveProject[]);
    } catch (err) {
      setLoadError(err instanceof ApiRequestError ? err.message : '저장 중 문제가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-end sm:items-center justify-center p-2 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl border border-[#E2E8F0] shadow-2xl w-full max-w-5xl max-h-[min(92dvh,100%)] flex flex-col overflow-hidden">
        <div className="p-6 border-b border-[#E2E8F0] bg-[#F8FAFC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#2563EB] text-white text-lg font-black flex items-center justify-center shadow-xs">
              {student.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-[#0F172A] break-words">{student.name} 수강생</h2>
                {student.needsAdminCheck && (
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    <span>확인 필요</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">
                프로젝트: <strong className="text-[#0F172A]">{current?.name || student.projectName}</strong> ({current?.domain || student.domain})
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-[#64748B] hover:bg-slate-200 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2 px-6 pt-3 border-b border-[#E2E8F0] bg-white overflow-x-auto text-xs font-bold">
          {(
            [
              ['roadmap', Compass, `Roadmap (${roadmap?.currentStepNumber || student.currentStepNumber}/10)`],
              ['website', LayoutTemplate, `홈페이지 (${current?.websiteOrder?.status || student.websiteStatus})`],
              ['seo', BarChart3, 'SEO 성과 (DEMO)'],
              ['history', History, '활동 History'],
              ['notes', MessageSquare, '관리자 Note']
            ] as const
          ).map(([id, Icon, label]) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`pb-3 px-3 transition-colors border-b-2 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === id ? 'border-[#2563EB] text-[#2563EB]' : 'border-transparent text-[#64748B]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading ? <p className="text-sm text-slate-500">불러오는 중...</p> : null}
          {loadError ? (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 text-sm rounded-2xl p-3">{loadError}</div>
          ) : null}

          {activeTab === 'roadmap' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-[#EFF6FF] border border-[#DBEAFE] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#1E40AF]">현재 진행 단계</h4>
                  <p className="text-sm font-black text-[#2563EB]">{roadmap?.currentStep || student.currentStepTitle || '로드맵 없음'}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#1E40AF]">진행률</span>
                  <div className="text-lg font-black text-[#2563EB] font-mono">{roadmap?.progress ?? student.roadmapProgress}%</div>
                </div>
              </div>
              {(roadmap?.steps || []).length === 0 ? (
                <p className="text-sm text-slate-400">표시할 로드맵이 없습니다.</p>
              ) : (
                roadmap?.steps.map((step) => (
                  <div key={step.id} className="p-4 rounded-2xl border border-[#E2E8F0] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-xl bg-[#EFF6FF] text-[#2563EB] text-xs font-black flex items-center justify-center">
                        {step.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : step.stepNumber}
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-[#0F172A]">{step.title}</h5>
                        <p className="text-[11px] text-[#64748B]">{step.progress}%</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#64748B]">{step.status}</span>
                  </div>
                ))
              )}
              <div className="pt-2">
                <h4 className="text-xs font-black mb-2">오늘의 미션</h4>
                {missions.length === 0 ? (
                  <p className="text-xs text-slate-400">오늘 생성된 미션이 없습니다.</p>
                ) : (
                  missions.map((m) => (
                    <p key={m.id} className="text-xs text-slate-700">
                      {m.title} {m.isCompleted || m.status === 'completed' ? '(완료)' : ''}
                    </p>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'website' && (
            <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#64748B]">홈페이지 상태</span>
                  <h4 className="text-base font-black text-[#0F172A]">
                    {current?.websiteOrder?.status || current?.websiteStatus || student.websiteStatus}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">진행률 {current?.websiteOrder?.progress ?? 0}%</p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onOpenOrderModal && onOpenOrderModal(student.id)}
                  className="text-xs font-bold"
                >
                  Kanban 상세 열기
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-2">
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">DEMO</span>
              <p className="text-sm text-slate-500">SEO 성과 지표는 다음 단계에서 연동합니다. 가짜 수치를 운영 데이터로 표시하지 않습니다.</p>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-3">
              {activities.length === 0 ? (
                <p className="text-sm text-slate-400">아직 활동 기록이 없습니다.</p>
              ) : (
                activities.map((a) => (
                  <div key={a.id} className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs">
                    <div className="flex justify-between font-bold text-[#64748B]">
                      <span>{(a.createdAt || '').slice(0, 16)}</span>
                      <span className="text-[#2563EB]">{a.activityType}</span>
                    </div>
                    <p className="text-[#0F172A] font-bold mt-1">{a.title}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4">
              <form onSubmit={handleAddNote} className="space-y-2">
                <label className="text-xs font-bold text-[#0F172A] block">내부 관리자 메모 (수강생 비공개)</label>
                <textarea
                  value={adminNoteInput}
                  onChange={(e) => setAdminNoteInput(e.target.value)}
                  rows={3}
                  className="w-full p-3 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl"
                />
                <Button variant="primary" size="sm" type="submit" className="text-xs font-bold" disabled={!current}>
                  메모 등록
                </Button>
              </form>
              {notes.length === 0 ? (
                <p className="text-xs text-slate-400">메모가 없습니다.</p>
              ) : (
                notes.map((n) => (
                  <div key={n.id} className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs">
                    <span className="text-slate-400">{(n.createdAt || '').slice(0, 16)}</span>
                    <p className="text-[#334155] mt-1">{n.note}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
