import React, { useState } from 'react';
import {
  History,
  FileText,
  Link2,
  Globe2,
  Search,
  CheckCircle2,
  Calendar,
  ExternalLink,
  Target,
  Image as ImageIcon,
  Sparkles,
  Filter,
  Plus,
  ArrowUpRight,
  Clock,
  Layers,
  ChevronRight,
  Eye,
  Award
} from 'lucide-react';
import { SeoActivityTimelineItem, Project, TaskWorkLog } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

export interface SeoActivityHistoryProps {
  project: Project;
  activityItems: SeoActivityTimelineItem[];
  onAddActivity?: () => void;
}

export const SeoActivityHistory: React.FC<SeoActivityHistoryProps> = ({
  project,
  activityItems,
  onAddActivity
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [selectedItemDetail, setSelectedItemDetail] = useState<SeoActivityTimelineItem | null>(null);

  const getCategoryBadge = (cat: SeoActivityTimelineItem['category']) => {
    switch (cat) {
      case 'content':
        return <Badge variant="blue" size="sm">콘텐츠 발행</Badge>;
      case 'backlink':
        return <Badge variant="green" size="sm">백링크 확보</Badge>;
      case 'gsc':
        return <Badge variant="purple" size="sm">GSC / 색인</Badge>;
      case 'website':
        return <Badge variant="blue" size="sm">홈페이지 구축</Badge>;
      case 'catchdomain':
        return <Badge variant="orange" size="sm">도메인 발굴</Badge>;
      case 'traffic':
        return <Badge variant="green" size="sm">트래픽 가동</Badge>;
      default:
        return <Badge variant="gray" size="sm">작업 기록</Badge>;
    }
  };

  const getCategoryIcon = (cat: SeoActivityTimelineItem['category']) => {
    switch (cat) {
      case 'content':
        return <FileText className="w-4 h-4 text-[#2563EB]" />;
      case 'backlink':
        return <Link2 className="w-4 h-4 text-[#10B981]" />;
      case 'gsc':
        return <Search className="w-4 h-4 text-[#8B5CF6]" />;
      case 'website':
        return <Globe2 className="w-4 h-4 text-[#2563EB]" />;
      case 'catchdomain':
        return <Sparkles className="w-4 h-4 text-[#F97316]" />;
      case 'traffic':
        return <Award className="w-4 h-4 text-[#10B981]" />;
      default:
        return <History className="w-4 h-4 text-[#64748B]" />;
    }
  };

  const filteredList = activityItems.filter((item) => {
    if (filterCategory !== 'all' && item.category !== filterCategory) return false;
    if (searchKeyword.trim()) {
      const q = searchKeyword.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchSummary = item.summary.toLowerCase().includes(q);
      const matchKeyword = item.details?.keyword?.toLowerCase().includes(q) || false;
      const matchUrl = item.details?.url?.toLowerCase().includes(q) || false;
      return matchTitle || matchSummary || matchKeyword || matchUrl;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner / Growth Journal Header */}
      <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF6FF] text-[#2563EB] text-xs font-bold border border-[#DBEAFE]">
            <History className="w-3.5 h-3.5" />
            <span>SEO Activity History • 프로젝트 성장일지</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
            지금까지 진행된 SEO 작업 히스토리 타임라인
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
            도메인 발굴부터 홈페이지 오픈, GSC 연결, 콘텐츠 발행, 백링크 구축까지
            프로젝트의 모든 실행 기록과 작업 결과(Proof of Work)를 날짜순으로 열람할 수 있습니다.
          </p>
        </div>

        {/* Action Button & Milestone summary */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-center min-w-[140px]">
            <span className="text-[11px] font-bold text-[#64748B] block">누적 작업 완료</span>
            <span className="text-2xl font-black text-[#2563EB]">{activityItems.length}건</span>
          </div>

          {onAddActivity && (
            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={onAddActivity}
              className="bg-[#2563EB] hover:bg-blue-700 font-bold"
            >
              새 작업 기록하기
            </Button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-[#E2E8F0] rounded-2xl shadow-2xs overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              filterCategory === 'all'
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
            }`}
          >
            전체 ({activityItems.length})
          </button>
          <button
            onClick={() => setFilterCategory('content')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              filterCategory === 'content'
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
            }`}
          >
            콘텐츠
          </button>
          <button
            onClick={() => setFilterCategory('backlink')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              filterCategory === 'backlink'
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
            }`}
          >
            백링크
          </button>
          <button
            onClick={() => setFilterCategory('gsc')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              filterCategory === 'gsc'
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
            }`}
          >
            GSC/기술
          </button>
          <button
            onClick={() => setFilterCategory('website')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              filterCategory === 'website'
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
            }`}
          >
            홈페이지
          </button>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="키워드, URL 또는 제목 검색..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#2563EB] bg-white"
          />
        </div>
      </div>

      {/* Timeline UI Container */}
      <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#E2E8F0]">
          {filteredList.map((item, idx) => (
            <div key={item.id} className="relative group">
              {/* Timeline Dot Indicator */}
              <div className="absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full bg-white border-2 border-[#2563EB] flex items-center justify-center shadow-xs">
                <div className="w-2 h-2 rounded-full bg-[#2563EB]" />
              </div>

              {/* Timeline Card */}
              <div
                onClick={() => setSelectedItemDetail(item)}
                className="p-5 rounded-2xl border border-[#E2E8F0] bg-white hover:border-[#2563EB]/40 hover:shadow-xs transition-all cursor-pointer space-y-3"
              >
                {/* Header Row: Date + Category Badge + Time */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-black text-sm text-[#0F172A]">
                      {item.date}
                    </span>
                    {item.time && (
                      <span className="text-[11px] font-mono text-[#64748B]">
                        {item.time}
                      </span>
                    )}
                    {getCategoryBadge(item.category)}
                  </div>

                  <span className="text-[11px] font-bold text-[#2563EB] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>상세 결과 보기</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>

                {/* Title & Summary */}
                <div>
                  <h4 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
                    {getCategoryIcon(item.category)}
                    <span>{item.title}</span>
                  </h4>
                  <p className="text-xs text-[#475569] mt-1 font-medium">
                    {item.summary}
                  </p>
                </div>

                {/* Rich Details Snippet (If available) */}
                {item.details && (
                  <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs space-y-1.5">
                    {item.details.url && (
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-[#64748B] font-bold shrink-0">등록 URL:</span>
                        <a
                          href={item.details.url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="font-mono text-[#2563EB] hover:underline truncate flex items-center gap-1"
                        >
                          <span>{item.details.url}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      </div>
                    )}

                    {item.details.keyword && (
                      <div className="flex items-center gap-2">
                        <span className="text-[#64748B] font-bold shrink-0">목표 키워드:</span>
                        <span className="font-bold text-[#0F172A] bg-white px-2 py-0.5 rounded border border-[#E2E8F0]">
                          {item.details.keyword}
                        </span>
                        {item.details.metrics && (
                          <span className="text-[11px] text-[#64748B] ml-auto">
                            {item.details.metrics}
                          </span>
                        )}
                      </div>
                    )}

                    {item.details.notes && (
                      <p className="text-[11px] text-[#64748B] pt-1 border-t border-[#F1F5F9] line-clamp-1">
                        {item.details.notes}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Item Detail Modal */}
      {selectedItemDetail && (
        <Modal
          isOpen={!!selectedItemDetail}
          onClose={() => setSelectedItemDetail(null)}
          title={`작업 결과 상세: ${selectedItemDetail.title}`}
          subtitle={`${selectedItemDetail.date} 기록된 작업 증빙 및 상세 실행 내역`}
          maxWidth="max-w-xl"
        >
          <div className="space-y-4 text-xs">
            {/* Header info */}
            <div className="p-4 rounded-2xl bg-[#EFF6FF] border border-[#DBEAFE] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-[#2563EB]">
                  {selectedItemDetail.date} {selectedItemDetail.time}
                </span>
                {getCategoryBadge(selectedItemDetail.category)}
              </div>
              <h3 className="text-base font-black text-[#0F172A]">
                {selectedItemDetail.title}
              </h3>
              <p className="text-xs text-[#334155]">
                {selectedItemDetail.summary}
              </p>
            </div>

            {/* Details Box */}
            {selectedItemDetail.details && (
              <div className="space-y-3 p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
                {selectedItemDetail.details.url && (
                  <div>
                    <span className="font-bold text-[#64748B] block mb-1">등록 / 대상 URL</span>
                    <a
                      href={selectedItemDetail.details.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1.5 break-all"
                    >
                      <span>{selectedItemDetail.details.url}</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </a>
                  </div>
                )}

                {selectedItemDetail.details.keyword && (
                  <div>
                    <span className="font-bold text-[#64748B] block mb-1">목표 키워드</span>
                    <span className="inline-block font-bold text-xs text-[#0F172A] bg-white px-2.5 py-1 rounded-lg border border-[#E2E8F0]">
                      {selectedItemDetail.details.keyword}
                    </span>
                  </div>
                )}

                {selectedItemDetail.details.metrics && (
                  <div>
                    <span className="font-bold text-[#64748B] block mb-1">성과 지표</span>
                    <span className="font-mono text-xs text-[#0F172A]">
                      {selectedItemDetail.details.metrics}
                    </span>
                  </div>
                )}

                {selectedItemDetail.details.notes && (
                  <div>
                    <span className="font-bold text-[#64748B] block mb-1">작업 메모</span>
                    <p className="text-xs text-[#334155] leading-relaxed bg-white p-3 rounded-xl border border-[#E2E8F0]">
                      {selectedItemDetail.details.notes}
                    </p>
                  </div>
                )}

                {selectedItemDetail.details.screenshotUrl && (
                  <div>
                    <span className="font-bold text-[#64748B] block mb-1">증빙 스크린샷</span>
                    <div className="rounded-xl overflow-hidden border border-[#E2E8F0] bg-slate-100 max-h-56">
                      <img
                        src={selectedItemDetail.details.screenshotUrl}
                        alt="Proof screenshot"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <Button
                variant="primary"
                size="md"
                onClick={() => setSelectedItemDetail(null)}
              >
                확인 완료
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
