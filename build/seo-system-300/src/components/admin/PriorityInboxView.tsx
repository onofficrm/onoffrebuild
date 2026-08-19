import React, { useState } from 'react';
import {
  Inbox,
  AlertTriangle,
  Clock,
  CheckCircle2,
  TrendingDown,
  Sparkles,
  ArrowRight,
  User,
  ExternalLink,
  Filter,
  Check,
  Send,
  MessageSquare
} from 'lucide-react';
import { AdminPriorityItem, StudentSummary, WebsiteKanbanCard } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export interface PriorityInboxViewProps {
  items: AdminPriorityItem[];
  students: StudentSummary[];
  kanbanCards: WebsiteKanbanCard[];
  onOpenStudentDetail: (student: StudentSummary) => void;
  onOpenWebsiteOrder: (card: WebsiteKanbanCard) => void;
  onDismissItem?: (id: string) => void;
}

export const PriorityInboxView: React.FC<PriorityInboxViewProps> = ({
  items,
  students,
  kanbanCards,
  onOpenStudentDetail,
  onOpenWebsiteOrder,
  onDismissItem
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [handledIds, setHandledIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleActionClick = (item: AdminPriorityItem) => {
    if (item.actionType === 'open_materials' || item.actionType === 'open_review') {
      const card = kanbanCards.find((c) => c.studentName.includes(item.studentName)) || kanbanCards[0];
      onOpenWebsiteOrder(card);
    } else {
      const student = students.find((s) => s.name.includes(item.studentName)) || students[0];
      onOpenStudentDetail(student);
    }
  };

  const handleQuickResolve = (e: React.MouseEvent, itemId: string, studentName: string) => {
    e.stopPropagation();
    setHandledIds([...handledIds, itemId]);
    showToast(`${studentName} 수강생 작업 조치가 완료 처리되었습니다.`);
  };

  const filteredItems = items
    .filter((it) => !handledIds.includes(it.id))
    .filter((it) => {
      if (filterType === 'all') return true;
      if (filterType === 'urgent') return it.urgentLevel === 'urgent';
      if (filterType === 'material') return it.type === 'missing_material';
      if (filterType === 'inactive') return it.type === 'inactive';
      if (filterType === 'review') return it.type === 'review_pending';
      if (filterType === 'seo') return it.type === 'traffic_drop';
      return true;
    });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 left-4 right-4 sm:left-auto sm:right-6 lg:bottom-6 z-50 bg-[#0F172A] text-white px-5 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-bottom-3 break-words">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Inbox className="w-5 h-5 text-[#2563EB]" />
            <h1 className="text-lg sm:text-xl font-black text-[#0F172A]">
              지금 확인해야 할 작업 (Priority Inbox)
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            124명의 수강생 중 관리자의 개입 및 검토가 필요한 작업만 우선순위별로 스마트 필터링합니다.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              filterType === 'all' ? 'bg-[#2563EB] text-white' : 'text-[#64748B]'
            }`}
          >
            전체 ({items.length - handledIds.length})
          </button>
          <button
            onClick={() => setFilterType('urgent')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              filterType === 'urgent' ? 'bg-rose-600 text-white' : 'text-[#64748B]'
            }`}
          >
            긴급 확인
          </button>
          <button
            onClick={() => setFilterType('material')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              filterType === 'material' ? 'bg-[#2563EB] text-white' : 'text-[#64748B]'
            }`}
          >
            자료 지연
          </button>
          <button
            onClick={() => setFilterType('inactive')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              filterType === 'inactive' ? 'bg-[#2563EB] text-white' : 'text-[#64748B]'
            }`}
          >
            SEO 정체
          </button>
          <button
            onClick={() => setFilterType('review')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              filterType === 'review' ? 'bg-[#2563EB] text-white' : 'text-[#64748B]'
            }`}
          >
            검수 대기
          </button>
        </div>
      </div>

      {/* Priority Cards List */}
      <div className="space-y-3.5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => handleActionClick(item)}
            className="p-5 sm:p-6 bg-white border border-[#E2E8F0] rounded-3xl shadow-xs hover:border-[#2563EB] hover:shadow-md transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 shadow-xs ${
                  item.urgentLevel === 'urgent'
                    ? 'bg-rose-100 text-rose-700 border border-rose-200'
                    : item.urgentLevel === 'warning'
                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                    : item.urgentLevel === 'success'
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                    : 'bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE]'
                }`}
              >
                {item.studentName[0]}
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-black text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                    {item.studentName}
                  </span>
                  <span className="text-xs font-bold text-[#64748B]">
                    ({item.relatedProjectId === 'proj-01' ? '300기' : '299기'})
                  </span>

                  {item.daysElapsed && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[11px] font-bold border border-rose-200 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{item.daysElapsed}일 경과</span>
                    </span>
                  )}

                  {item.type === 'traffic_drop' && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[11px] font-bold border border-rose-200 flex items-center gap-1">
                      <TrendingDown className="w-3 h-3" />
                      <span>노출 급감</span>
                    </span>
                  )}

                  {item.type === 'milestone_reached' && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>목표 달성</span>
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-[#0F172A]">{item.title}</h4>
                <p className="text-xs text-[#64748B] leading-relaxed max-w-2xl">{item.description}</p>
              </div>
            </div>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => handleQuickResolve(e, item.id, item.studentName)}
                leftIcon={<Check className="w-3.5 h-3.5" />}
                className="text-xs font-bold bg-white text-[#475569] border-[#E2E8F0]"
              >
                해결 완료
              </Button>

              <Button
                variant="primary"
                size="sm"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                className="text-xs font-bold shadow-xs px-4"
              >
                [{item.ctaText}]
              </Button>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="p-12 text-center bg-white border border-[#E2E8F0] rounded-3xl space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="text-base font-bold text-[#0F172A]">확인 필요한 긴급 작업이 없습니다!</h3>
            <p className="text-xs text-[#64748B]">모든 수강생의 작업과 홈페이지 제작이 정상적으로 진행되고 있습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};
