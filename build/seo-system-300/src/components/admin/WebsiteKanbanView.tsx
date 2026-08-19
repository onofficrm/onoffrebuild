import React, { useState } from 'react';
import {
  LayoutTemplate,
  Plus,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  User,
  ExternalLink,
  MoreVertical,
  Layers,
  Sparkles
} from 'lucide-react';
import { WebsiteKanbanCard, WebsiteKanbanStage } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { WebsiteOrderDetailModal } from './WebsiteOrderDetailModal';

export interface WebsiteKanbanViewProps {
  cards: WebsiteKanbanCard[];
  onUpdateCard: (updated: WebsiteKanbanCard) => void;
  onOpenCardDetail?: (card: WebsiteKanbanCard) => void;
  onRequestMoreInfo?: (orderId: number, payload: { title: string; body: string; adminMemo?: string }) => void;
}

const STAGES: { id: WebsiteKanbanStage; title: string; color: string }[] = [
  { id: 'new_order', title: '신규 주문', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'awaiting_materials', title: '자료 대기', color: 'bg-amber-50 text-amber-800 border-amber-200' },
  { id: 'planning', title: '기획', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { id: 'design', title: '디자인', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { id: 'development', title: '개발', color: 'bg-cyan-50 text-cyan-800 border-cyan-200' },
  { id: 'qa', title: '검수', color: 'bg-rose-50 text-rose-700 border-rose-200' },
  { id: 'revision', title: '수정', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  { id: 'completed', title: '완료', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
];

export const WebsiteKanbanView: React.FC<WebsiteKanbanViewProps> = ({
  cards,
  onUpdateCard,
  onRequestMoreInfo
}) => {
  const [selectedCard, setSelectedCard] = useState<WebsiteKanbanCard | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium'>('all');

  const filteredCards = cards.filter((c) => {
    const matchesSearch =
      c.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || c.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const handleCardClick = (card: WebsiteKanbanCard) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  const handleMoveStage = (e: React.MouseEvent, card: WebsiteKanbanCard, direction: 'prev' | 'next') => {
    e.stopPropagation();
    const stageIds: WebsiteKanbanStage[] = [
      'new_order',
      'awaiting_materials',
      'planning',
      'design',
      'development',
      'qa',
      'revision',
      'completed'
    ];
    const currentIndex = stageIds.indexOf(card.stage);
    const nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

    if (nextIndex >= 0 && nextIndex < stageIds.length) {
      const nextStage = stageIds[nextIndex];
      const updated: WebsiteKanbanCard = {
        ...card,
        stage: nextStage,
        progress:
          nextStage === 'completed'
            ? 100
            : nextStage === 'qa' || nextStage === 'revision'
            ? 85
            : nextStage === 'development'
            ? 70
            : nextStage === 'design'
            ? 50
            : nextStage === 'planning'
            ? 30
            : nextStage === 'awaiting_materials'
            ? 20
            : 10
      };
      onUpdateCard(updated);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner & Filters */}
      <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <LayoutTemplate className="w-5 h-5 text-[#2563EB]" />
            <h1 className="text-lg sm:text-xl font-black text-[#0F172A]">
              홈페이지 제작 Kanban 파이프라인
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            접수부터 기획, 디자인, 퍼블리싱, 고객 검수, 최종 납품까지 8단계 공정을 실시간 제어합니다.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="학생, 주문번호, 사업명 검색..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#2563EB]"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-bold">
            <button
              onClick={() => setPriorityFilter('all')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                priorityFilter === 'all' ? 'bg-[#2563EB] text-white' : 'text-[#64748B]'
              }`}
            >
              전체
            </button>
            <button
              onClick={() => setPriorityFilter('high')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                priorityFilter === 'high' ? 'bg-rose-600 text-white' : 'text-[#64748B]'
              }`}
            >
              긴급만
            </button>
          </div>
        </div>
      </div>

      {/* 8-Column Horizontal Scrollable Kanban Board */}
      <div className="overflow-x-auto pb-4 -mx-4 px-4 lg:mx-0 lg:px-0">
        <div className="flex flex-col md:flex-row gap-4 md:min-w-[1700px]">
          {STAGES.map((stage, idx) => {
            const stageCards = filteredCards.filter((c) => c.stage === stage.id);
            return (
              <div
                key={stage.id}
                className="w-full md:w-[220px] shrink-0 bg-[#F8FAFC] border border-[#E2E8F0] rounded-3xl p-3 flex flex-col max-h-none md:max-h-[75vh]"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const cardId = e.dataTransfer.getData('text/plain');
                  const card = cards.find((c) => c.id === cardId);
                  if (!card || card.stage === stage.id) return;
                  onUpdateCard({ ...card, stage: stage.id });
                }}
              >
                {/* Column Header */}
                <div className="px-2 py-2 mb-2 flex items-center justify-between border-b border-[#E2E8F0]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
                    <h3 className="text-xs font-black text-[#0F172A]">{stage.title}</h3>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white text-[#2563EB] border border-[#E2E8F0]">
                    {stageCards.length}
                  </span>
                </div>

                {/* Column Card List */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {stageCards.map((card) => (
                    <div
                      key={card.id}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', card.id);
                      }}
                      onClick={() => handleCardClick(card)}
                      className="p-3.5 bg-white border border-[#E2E8F0] rounded-2xl shadow-2xs hover:border-[#2563EB] hover:shadow-xs transition-all cursor-pointer space-y-2.5 group"
                    >
                      {/* Top: Student Name & Priority */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-[#EFF6FF] text-[#2563EB] font-bold text-[10px] flex items-center justify-center">
                            {card.studentName[0]}
                          </div>
                          <span className="text-xs font-bold text-[#0F172A]">{card.studentName}</span>
                        </div>
                        <Badge variant={card.priority === 'high' ? 'red' : 'blue'} size="sm">
                          {card.priority === 'high' ? '긴급' : '보통'}
                        </Badge>
                      </div>

                      {/* Project Title & Domain */}
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-black text-[#0F172A] line-clamp-1 group-hover:text-[#2563EB] transition-colors">
                          {card.projectName}
                        </h4>
                        <span className="text-[10px] font-mono text-[#64748B] block truncate">
                          {card.domain}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-[#64748B]">
                          <span>진행률</span>
                          <span className="font-bold font-mono text-[#2563EB]">{card.progress}%</span>
                        </div>
                        <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-[#2563EB] h-full rounded-full transition-all"
                            style={{ width: `${card.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Materials Status */}
                      <div className="text-[10px] text-[#64748B] flex items-center gap-1 pt-1 border-t border-[#F1F5F9]">
                        <Clock className="w-3 h-3 text-[#94A3B8]" />
                        <span className="truncate">{card.materialsStatus}</span>
                      </div>

                      {/* Bottom Footer: Assignee & Stage Quick Mover */}
                      <div className="flex items-center justify-between pt-1 text-[10px]">
                        <span className="text-[#64748B] font-bold bg-[#F1F5F9] px-2 py-0.5 rounded-lg">
                          {card.assignee}
                        </span>

                        <div className="flex items-center gap-1">
                          {idx > 0 && (
                            <button
                              onClick={(e) => handleMoveStage(e, card, 'prev')}
                              title="이전 단계로 이동"
                              className="p-1 rounded-md text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-colors"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {idx < STAGES.length - 1 && (
                            <button
                              onClick={(e) => handleMoveStage(e, card, 'next')}
                              title="다음 단계로 이동"
                              className="p-1 rounded-md text-[#2563EB] hover:bg-[#EFF6FF] transition-colors"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {stageCards.length === 0 && (
                    <div className="h-28 flex items-center justify-center border-2 border-dashed border-[#E2E8F0] rounded-2xl text-[11px] text-[#94A3B8]">
                      비어있음
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Website Order Detail Modal */}
      <WebsiteOrderDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        card={selectedCard}
        onUpdateCard={onUpdateCard}
        onRequestMoreInfo={
          selectedCard && onRequestMoreInfo
            ? (payload) => onRequestMoreInfo(Number(selectedCard.id), payload)
            : undefined
        }
      />
    </div>
  );
};
