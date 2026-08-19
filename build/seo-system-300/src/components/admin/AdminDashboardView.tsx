import React from 'react';
import {
  Users,
  LayoutTemplate,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Compass,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Inbox,
  ShieldCheck,
  Zap,
  BarChart3
} from 'lucide-react';
import { ADMIN_KPIS } from '../../mocks/adminFixtures';
import { AdminPriorityItem, StudentSummary, WebsiteKanbanCard } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export interface AdminDashboardViewProps {
  priorityItems: AdminPriorityItem[];
  students: StudentSummary[];
  kanbanCards: WebsiteKanbanCard[];
  onNavigateTab: (tab: 'dashboard' | 'inbox' | 'kanban' | 'students') => void;
  onOpenStudentDetail: (student: StudentSummary) => void;
  onOpenWebsiteOrder: (card: WebsiteKanbanCard) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  priorityItems,
  students,
  kanbanCards,
  onNavigateTab,
  onOpenStudentDetail,
  onOpenWebsiteOrder
}) => {
  return (
    <div className="space-y-7 animate-in fade-in duration-200">
      {/* Top Welcome & KPI Grid */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0F172A]">
              관리자 전용 Control Center
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
              전체 수강생의 홈페이지 제작 현황, SEO 진행 진도, 긴급 확인 과제를 실시간으로 통제합니다.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              시스템 정상 가동중
            </span>
          </div>
        </div>

        {/* 6 KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
          {/* 전체 수강생 */}
          <div
            onClick={() => onNavigateTab('students')}
            className="p-4 sm:p-5 rounded-3xl bg-white border border-[#E2E8F0] shadow-2xs hover:border-[#2563EB] hover:shadow-xs transition-all cursor-pointer space-y-1 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#64748B]">전체 수강생</span>
              <Users className="w-4 h-4 text-[#2563EB] group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-black text-[#0F172A] font-mono">{ADMIN_KPIS.totalStudents}</div>
            <span className="text-[11px] text-emerald-600 font-bold">누적 등록</span>
          </div>

          {/* 활성 프로젝트 */}
          <div
            onClick={() => onNavigateTab('students')}
            className="p-4 sm:p-5 rounded-3xl bg-white border border-[#E2E8F0] shadow-2xs hover:border-[#2563EB] hover:shadow-xs transition-all cursor-pointer space-y-1 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#64748B]">활성 프로젝트</span>
              <Compass className="w-4 h-4 text-[#2563EB] group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-black text-[#0F172A] font-mono">{ADMIN_KPIS.activeProjects}</div>
            <span className="text-[11px] text-[#64748B]">진행률 73.4%</span>
          </div>

          {/* 홈페이지 제작중 */}
          <div
            onClick={() => onNavigateTab('kanban')}
            className="p-4 sm:p-5 rounded-3xl bg-white border border-[#E2E8F0] shadow-2xs hover:border-[#2563EB] hover:shadow-xs transition-all cursor-pointer space-y-1 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#64748B]">홈페이지 제작중</span>
              <LayoutTemplate className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-black text-blue-600 font-mono">{ADMIN_KPIS.websitesInProgress}</div>
            <span className="text-[11px] text-[#64748B]">디자인/개발 공정</span>
          </div>

          {/* 검수대기 */}
          <div
            onClick={() => onNavigateTab('kanban')}
            className="p-4 sm:p-5 rounded-3xl bg-white border border-[#E2E8F0] shadow-2xs hover:border-amber-400 hover:shadow-xs transition-all cursor-pointer space-y-1 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#64748B]">검수대기</span>
              <Clock className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-black text-amber-600 font-mono">{ADMIN_KPIS.qaPending}</div>
            <span className="text-[11px] text-amber-600 font-bold">1차/고객검수</span>
          </div>

          {/* 진행중 SEO */}
          <div
            onClick={() => onNavigateTab('students')}
            className="p-4 sm:p-5 rounded-3xl bg-white border border-[#E2E8F0] shadow-2xs hover:border-[#2563EB] hover:shadow-xs transition-all cursor-pointer space-y-1 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#64748B]">진행중 SEO</span>
              <TrendingUp className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-black text-[#0F172A] font-mono">{ADMIN_KPIS.activeSeoProjects}</div>
            <span className="text-[11px] text-emerald-600 font-bold">트래픽 빌드업</span>
          </div>

          {/* 관리자 확인 필요 (High Priority Accent) */}
          <div
            onClick={() => onNavigateTab('inbox')}
            className="p-4 sm:p-5 rounded-3xl bg-rose-50 border border-rose-200 shadow-2xs hover:border-rose-400 hover:shadow-xs transition-all cursor-pointer space-y-1 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-800">관리자 확인 필요</span>
              <AlertTriangle className="w-4 h-4 text-rose-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-black text-rose-600 font-mono">{ADMIN_KPIS.needsAdminAttention}</div>
            <span className="text-[11px] text-rose-700 font-bold">긴급 대응 요망</span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ========================================================================= */}
        {/* Left 7 cols: 지금 확인해야 할 작업 (Priority Inbox) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Inbox className="w-4 h-4 text-[#2563EB]" />
              <h2 className="text-base font-black text-[#0F172A]">
                지금 확인해야 할 작업 (Priority Inbox)
              </h2>
            </div>
            <button
              onClick={() => onNavigateTab('inbox')}
              className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1"
            >
              <span>전체 보기</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {priorityItems.slice(0, 5).map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  if (item.actionType === 'open_materials' || item.actionType === 'open_review') {
                    const card = kanbanCards.find((c) => c.studentName.includes(item.studentName)) || kanbanCards[0];
                    onOpenWebsiteOrder(card);
                  } else {
                    const student = students.find((s) => s.name.includes(item.studentName)) || students[0];
                    onOpenStudentDetail(student);
                  }
                }}
                className="p-4 sm:p-5 bg-white border border-[#E2E8F0] rounded-3xl shadow-2xs hover:border-[#2563EB] hover:shadow-xs transition-all cursor-pointer flex items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black text-xs shrink-0 ${
                      item.urgentLevel === 'urgent'
                        ? 'bg-rose-100 text-rose-700'
                        : item.urgentLevel === 'warning'
                        ? 'bg-amber-100 text-amber-800'
                        : item.urgentLevel === 'success'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-[#EFF6FF] text-[#2563EB]'
                    }`}
                  >
                    {item.studentName[0]}
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <strong className="text-xs font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                        {item.studentName}
                      </strong>
                      {item.daysElapsed && (
                        <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          {item.daysElapsed}일 경과
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-bold text-[#334155]">{item.title}</p>
                    <p className="text-[11px] text-[#64748B] line-clamp-1">{item.description}</p>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  className="text-xs font-bold shrink-0 px-3 shadow-xs"
                >
                  [{item.ctaText}]
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Right 5 cols: 홈페이지 제작 파이프라인 요약 & 수강생 진도 현황 */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LayoutTemplate className="w-4 h-4 text-[#2563EB]" />
              <h2 className="text-base font-black text-[#0F172A]">
                홈페이지 제작 공정 현황
              </h2>
            </div>
            <button
              onClick={() => onNavigateTab('kanban')}
              className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1"
            >
              <span>Kanban 열기</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-5 bg-white border border-[#E2E8F0] rounded-3xl shadow-2xs space-y-4">
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-[#F1F5F9]">
                <span className="text-[#64748B] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  신규 주문 접수
                </span>
                <strong className="text-[#0F172A] font-mono font-bold">3건</strong>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#F1F5F9]">
                <span className="text-[#64748B] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  자료 대기 (이미지/로고)
                </span>
                <strong className="text-amber-600 font-mono font-bold">4건 (지연 1건)</strong>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#F1F5F9]">
                <span className="text-[#64748B] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  기획 & 디자인
                </span>
                <strong className="text-[#0F172A] font-mono font-bold">5건</strong>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#F1F5F9]">
                <span className="text-[#64748B] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-500" />
                  퍼블리싱 & 개발
                </span>
                <strong className="text-[#0F172A] font-mono font-bold">3건</strong>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#F1F5F9]">
                <span className="text-[#64748B] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  검수 대기 (1차/고객)
                </span>
                <strong className="text-rose-600 font-mono font-bold">4건</strong>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-[#64748B] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  제작 완료 & 납품
                </span>
                <strong className="text-emerald-600 font-mono font-bold">18건</strong>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigateTab('kanban')}
              className="w-full text-xs font-bold text-[#2563EB] border-[#DBEAFE] bg-[#EFF6FF] hover:bg-[#DBEAFE]"
            >
              홈페이지 Kanban 보드 바로가기
            </Button>
          </div>

          {/* Quick Notice Card */}
          <div className="p-5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-3xl space-y-2">
            <h3 className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>관리자 운영 Tip</span>
            </h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              수강생이 7일 이상 미접속하거나 GSC 노출이 급감한 경우, Priority Inbox에서 즉시 감지하여 알림을 전달합니다. 일일이 모든 학생을 열어보지 않아도 확인이 필요한 수강생만 선별 처리할 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
