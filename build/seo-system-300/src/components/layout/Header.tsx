import React, { useState } from 'react';
import {
  Search,
  Bell,
  Sparkles,
  ChevronDown,
  Globe2,
  PlusCircle,
  Flame,
  CheckCircle2,
  ExternalLink,
  Menu
} from 'lucide-react';
import { Project, NavigationTab, NotificationItem } from '../../types';
import { useAuth } from '../../auth/AuthContext';
import { memberDisplayName, memberInitials } from '../../services/authService';

export interface HeaderProps {
  activeProject: Project | null;
  projects: Project[];
  onSelectProject: (proj: Project) => void;
  onOpenNewProjectModal: () => void;
  notifications: NotificationItem[];
  onNavigate: (tab: NavigationTab, subTab?: string) => void;
  onToggleMobileMenu: () => void;
  isSidebarCollapsed: boolean;
  onSwitchToAdminMode?: () => void;
  onOpenGlobalSearch?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeProject,
  projects,
  onSelectProject,
  onOpenNewProjectModal,
  notifications,
  onNavigate,
  onToggleMobileMenu,
  isSidebarCollapsed,
  onSwitchToAdminMode,
  onOpenGlobalSearch
}) => {
  const { user } = useAuth();
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header
      className={`h-16 bg-white border-b border-[#E2E8F0] sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8 transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:pl-24' : 'lg:pl-68'
      }`}
    >
      {/* Left side: Mobile Hamburger + Breadcrumb / Project Selector */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        {/* Mobile menu trigger */}
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-[#64748B] hover:bg-[#F8FAFC]"
          aria-label="메뉴 열기"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb Path */}
        <div className="hidden lg:flex items-center text-xs font-medium text-[#64748B]">
          <span className="font-bold text-[#64748B]">SEO SYSTEM 300</span>
          <span className="mx-2 text-[#CBD5E1]">/</span>
          <span className="text-[#0F172A] font-bold">대시보드</span>
        </div>

        {/* Project Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setProjectDropdownOpen(!projectDropdownOpen);
              setNotifDropdownOpen(false);
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-slate-100 transition-colors text-left cursor-pointer"
          >
            <div className="w-5 h-5 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center font-bold text-xs shrink-0">
              <Globe2 className="w-3 h-3" />
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-bold text-[#0F172A] truncate max-w-[140px]">
                {activeProject?.name || '프로젝트 없음'}
              </div>
            </div>
            <ChevronDown className="w-3 h-3 text-[#64748B]" />
          </button>

          {/* Project Dropdown Menu */}
          {projectDropdownOpen && (
            <div
              className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-lg border border-[#E2E8F0] py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
              onMouseLeave={() => setProjectDropdownOpen(false)}
            >
              <div className="px-4 py-1.5 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
                등록된 SEO 프로젝트
              </div>
              <div className="max-h-60 overflow-y-auto">
                {projects.map((proj) => {
                  const isSelected = Boolean(activeProject && proj.id === activeProject.id);
                  return (
                    <button
                      key={proj.id}
                      onClick={() => {
                        onSelectProject(proj);
                        setProjectDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 hover:bg-[#F8FAFC] flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected ? 'bg-[#EFF6FF]' : ''
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-[#0F172A] truncate">{proj.name}</span>
                          {isSelected && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#2563EB] text-white font-bold">
                              선택됨
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-[#64748B] font-mono block truncate">
                          {proj.domain}
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-[#2563EB]">{proj.overallProgress}%</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 mt-1 border-t border-[#E2E8F0] px-2">
                <button
                  onClick={() => {
                    setProjectDropdownOpen(false);
                    onOpenNewProjectModal();
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold text-[#2563EB] hover:bg-[#EFF6FF] rounded-xl transition-colors cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>새 SEO 프로젝트 추가</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right side: System Status Pill + Search + Notifications + Profile */}
      <div className="flex items-center gap-3">
        {/* System Normal Status Indicator */}
        <div className="hidden sm:flex items-center bg-[#F8FAFC] px-3.5 py-1.5 rounded-full border border-[#E2E8F0]">
          <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse" />
          <span className="text-xs font-bold text-[#64748B]">System Normal</span>
        </div>

        {/* Global Search Button */}
        {onOpenGlobalSearch && (
          <button
            onClick={onOpenGlobalSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-slate-100 text-[#64748B] hover:text-[#0F172A] text-xs font-medium transition-all cursor-pointer"
            title="통합 검색 (Cmd+K / Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-[#94A3B8]" />
            <span className="hidden md:inline">통합 검색...</span>
            <kbd className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.2 bg-white border border-[#CBD5E1] rounded text-[#64748B] shadow-2xs">
              ⌘K
            </kbd>
          </button>
        )}

        {/* AI SEO Coach Button */}
        <button
          onClick={() => onNavigate('ai_coach')}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EFF6FF] border border-[#DBEAFE] hover:bg-blue-100 text-[#2563EB] text-xs font-bold transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Coach</span>
        </button>

        {/* Switch to Admin Mode Button */}
        {onSwitchToAdminMode && (
          <button
            onClick={onSwitchToAdminMode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>관리자 모드</span>
          </button>
        )}

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setNotifDropdownOpen(!notifDropdownOpen);
              setProjectDropdownOpen(false);
            }}
            className="relative p-2 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] rounded-xl transition-colors cursor-pointer"
            aria-label="알림"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>

          {/* Notifications Popover */}
          {notifDropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-[#E2E8F0] py-3 z-50 animate-in fade-in zoom-in-95 duration-100"
              onMouseLeave={() => setNotifDropdownOpen(false)}
            >
              <div className="px-4 pb-2 border-b border-[#E2E8F0] flex items-center justify-between">
                <span className="text-xs font-bold text-[#0F172A]">알림 센터</span>
                <span className="text-[11px] text-[#2563EB] font-bold cursor-pointer hover:underline">
                  모두 읽음 표시
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-[#F1F5F9]">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      if (n.actionTab) onNavigate(n.actionTab, n.actionSubTab);
                      setNotifDropdownOpen(false);
                    }}
                    className={`p-3.5 hover:bg-[#F8FAFC] transition-colors cursor-pointer flex gap-3 ${
                      !n.read ? 'bg-[#EFF6FF]/50' : ''
                    }`}
                  >
                    <div
                      className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${
                        !n.read ? 'bg-[#2563EB]' : 'bg-transparent'
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <p className="text-xs font-bold text-[#0F172A] truncate">{n.title}</p>
                        <span className="text-[10px] text-[#94A3B8] shrink-0">{n.timeAgo}</span>
                      </div>
                      <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed">{n.message}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-2 px-4 border-t border-[#E2E8F0] text-center">
                <button
                  onClick={() => {
                    setNotifDropdownOpen(false);
                    onNavigate('notifications');
                  }}
                  className="text-xs text-[#64748B] hover:text-[#2563EB] font-bold py-1"
                >
                  전체 알림 목록 보기 →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Account Avatar */}
        <button
          onClick={() => onNavigate('account')}
          className="flex items-center gap-2 pl-2 border-l border-[#E2E8F0] cursor-pointer min-w-0"
        >
          <span className="hidden sm:inline text-xs font-bold text-slate-700 truncate max-w-[140px]">
            안녕하세요, {memberDisplayName(user)}님
          </span>
          <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-xs font-bold shadow-2xs shrink-0">
            {memberInitials(user)}
          </div>
        </button>
      </div>
    </header>
  );
};
