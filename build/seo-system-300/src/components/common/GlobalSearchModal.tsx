import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  FolderKanban,
  GraduationCap,
  CheckSquare2,
  Wrench,
  FileText,
  Key,
  Compass,
  ArrowRight,
  Sparkles,
  Command
} from 'lucide-react';
import { Project, NavigationTab, TaskWorkLog } from '../../types';

export interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: NavigationTab, subTab?: string) => void;
  projects: Project[];
  taskLogs: TaskWorkLog[];
}

interface SearchResultItem {
  id: string;
  category: 'project' | 'curriculum' | 'mission' | 'tool' | 'task_log' | 'keyword';
  title: string;
  subtitle: string;
  tab: NavigationTab;
  subTab?: string;
  icon: React.ReactNode;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  projects,
  taskLogs
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Search catalog
  const staticCatalog: SearchResultItem[] = [
    // Tools
    {
      id: 'tool-catchdomain',
      category: 'tool',
      title: 'CatchDomain (낙장 도메인 검색/분석)',
      subtitle: 'DA/PA 지수 높은 만료 도메인 실시간 발굴 허브',
      tab: 'tools',
      subTab: 'catchdomain',
      icon: <Wrench className="w-4 h-4 text-blue-500" />
    },
    {
      id: 'tool-content',
      category: 'tool',
      title: 'Content Automation (AI 콘텐츠 생성)',
      subtitle: 'Silo 구조 기반 고품질 SEO 블로그/랜딩페이지 자동생성',
      tab: 'tools',
      subTab: 'content',
      icon: <Wrench className="w-4 h-4 text-purple-500" />
    },
    {
      id: 'tool-backlink',
      category: 'tool',
      title: 'Backlink Monitor (백링크 분석 & 주입)',
      subtitle: 'Referring Domain 및 DoFollow 링크 품질 상태 트래킹',
      tab: 'tools',
      subTab: 'backlink',
      icon: <Wrench className="w-4 h-4 text-emerald-500" />
    },
    {
      id: 'tool-traffic',
      category: 'tool',
      title: 'Traffic Analytics (트래픽 통계 & 순위)',
      subtitle: 'Google Search Console 실시간 오가닉 방문자 및 CTR 분석',
      tab: 'tools',
      subTab: 'traffic',
      icon: <Wrench className="w-4 h-4 text-cyan-500" />
    },

    // Curriculum lectures
    {
      id: 'lec-1',
      category: 'curriculum',
      title: 'STEP 01: 황금 낙장 도메인 선별 및 히스토리 검증법',
      subtitle: 'Wayback Machine 스팸 이력 필터링 및 앵커 텍스트 무결성 점검',
      tab: 'curriculum',
      icon: <GraduationCap className="w-4 h-4 text-amber-500" />
    },
    {
      id: 'lec-2',
      category: 'curriculum',
      title: 'STEP 02: 1:1 맞춤형 SEO 최적화 홈페이지 주문 가이드',
      subtitle: '구글 권장 모바일 반응형 및 코어 웹 바이탈 최적화 아키텍처',
      tab: 'curriculum',
      icon: <GraduationCap className="w-4 h-4 text-amber-500" />
    },
    {
      id: 'lec-4',
      category: 'curriculum',
      title: 'STEP 04: Technical SEO 무결점 세팅 가이드',
      subtitle: 'SSL, 사이트맵, Robots.txt 및 스키마 마크업 완벽 적용',
      tab: 'curriculum',
      icon: <GraduationCap className="w-4 h-4 text-amber-500" />
    },
    {
      id: 'lec-5',
      category: 'curriculum',
      title: 'STEP 05: Silo 구조 키워드 설계 및 클러스터링',
      subtitle: '기둥 콘텐츠(Pillar)와 보조 콘텐츠(Cluster) 인터널 링크 전략',
      tab: 'curriculum',
      icon: <GraduationCap className="w-4 h-4 text-amber-500" />
    },

    // Missions
    {
      id: 'mis-1',
      category: 'mission',
      title: 'CatchDomain에서 DA 20+ 후보 도메인 3개 추출',
      subtitle: '오늘의 우선순위 SEO 실행 미션',
      tab: 'missions',
      icon: <CheckSquare2 className="w-4 h-4 text-blue-600" />
    },
    {
      id: 'mis-2',
      category: 'mission',
      title: '홈페이지 메인 H1 태그 및 OpenGraph 메타태그 검수',
      subtitle: '오늘의 기술 SEO 점검 미션',
      tab: 'missions',
      icon: <CheckSquare2 className="w-4 h-4 text-blue-600" />
    },

    // Keywords
    {
      id: 'kw-1',
      category: 'keyword',
      title: '제주 독채 감성 숙소 추천 (월간 검색량 18,200)',
      subtitle: '현재 랭킹 4위 (Top 10 진입 완료)',
      tab: 'reports',
      icon: <Key className="w-4 h-4 text-indigo-500" />
    },
    {
      id: 'kw-2',
      category: 'keyword',
      title: '제주 풀빌라 오션뷰 예약 팁 (월간 검색량 8,900)',
      subtitle: '현재 랭킹 8위 (전주 대비 +4계단)',
      tab: 'reports',
      icon: <Key className="w-4 h-4 text-indigo-500" />
    },

    // Roadmap View
    {
      id: 'roadmap-main',
      category: 'task_log',
      title: '10단계 SEO 실행 로드맵 (Roadmap Engine)',
      subtitle: '도메인부터 트래픽 스케일업까지 단계별 실시간 공정',
      tab: 'roadmap',
      icon: <Compass className="w-4 h-4 text-[#2563EB]" />
    },

    // AI Coach
    {
      id: 'ai-coach-main',
      category: 'task_log',
      title: 'AI SEO Coach 진단 & 제안',
      subtitle: 'GSC 데이터 기반 1:1 맞춤형 SEO 개선 처방전',
      tab: 'ai_coach',
      icon: <Sparkles className="w-4 h-4 text-[#2563EB]" />
    }
  ];

  // Dynamic projects converted to Search items
  const projectItems: SearchResultItem[] = projects.map((p) => ({
    id: `proj-${p.id}`,
    category: 'project',
    title: `${p.name} (${p.domain})`,
    subtitle: `진행률: ${p.overallProgress}% | 현재: ${p.currentStepTitle}`,
    tab: 'projects',
    icon: <FolderKanban className="w-4 h-4 text-[#2563EB]" />
  }));

  // Dynamic task work logs
  const taskLogItems: SearchResultItem[] = taskLogs.map((log) => ({
    id: `log-${log.id}`,
    category: 'task_log',
    title: log.taskTitle,
    subtitle: `작업일: ${log.publishDate} | ${log.notes || '기록 완료'}`,
    tab: 'roadmap',
    icon: <FileText className="w-4 h-4 text-slate-500" />
  }));

  const allItems: SearchResultItem[] = [...projectItems, ...staticCatalog, ...taskLogItems];

  const filteredItems = query.trim()
    ? allItems.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      )
    : allItems.slice(0, 8); // Default suggestions when empty

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Global Keyboard listener for Escape & Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const categoryLabels: Record<SearchResultItem['category'], string> = {
    project: '프로젝트',
    curriculum: '강의 & 가이드',
    mission: '미션',
    tool: 'SEO Tools',
    task_log: '작업기록 & 로드맵',
    keyword: '타겟 키워드'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-white border border-[#E2E8F0] rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar Input */}
        <div className="p-4 sm:p-5 border-b border-[#E2E8F0] flex items-center gap-3 bg-white sticky top-0">
          <Search className="w-5 h-5 text-[#2563EB] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="프로젝트, 강의, 미션, SEO 도구, 키워드, 작업기록 통합 검색..."
            className="w-full text-sm sm:text-base font-medium text-[#0F172A] placeholder-[#94A3B8] focus:outline-none bg-transparent"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#94A3B8] hover:text-[#0F172A] p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 text-[11px] font-bold text-[#64748B] bg-[#F1F5F9] rounded-lg border border-[#E2E8F0] hover:bg-[#E2E8F0]"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-1.5 divide-y divide-[#F1F5F9]">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Search className="w-8 h-8 text-[#94A3B8] mx-auto opacity-50" />
              <p className="text-sm font-bold text-[#0F172A]">'{query}'에 대한 검색 결과가 없습니다.</p>
              <p className="text-xs text-[#64748B]">다른 키워드나 도메인, 강의명으로 검색해보세요.</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onNavigate(item.tab, item.subTab);
                  onClose();
                }}
                className="pt-2 first:pt-0"
              >
                <div className="p-3 rounded-2xl hover:bg-[#EFF6FF] hover:border-[#DBEAFE] border border-transparent transition-all cursor-pointer flex items-center justify-between gap-3 group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-[#F8FAFC] group-hover:bg-white flex items-center justify-center shrink-0 border border-[#E2E8F0] group-hover:border-blue-200">
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#0F172A] group-hover:text-[#2563EB] truncate">
                          {item.title}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-[#F1F5F9] text-[#64748B] font-bold shrink-0">
                          {categoryLabels[item.category]}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#64748B] truncate mt-0.5">{item.subtitle}</p>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#2563EB] group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="p-3 bg-[#F8FAFC] border-t border-[#E2E8F0] text-[11px] text-[#64748B] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 bg-white border border-[#CBD5E1] rounded text-[10px] font-mono shadow-2xs">
                Enter
              </kbd>{' '}
              바로 이동
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-white border border-[#CBD5E1] rounded text-[10px] font-mono shadow-2xs">
                ESC
              </kbd>{' '}
              닫기
            </span>
          </div>
          <span className="text-slate-400">SEO SYSTEM 300 Global Index</span>
        </div>
      </div>
    </div>
  );
};
