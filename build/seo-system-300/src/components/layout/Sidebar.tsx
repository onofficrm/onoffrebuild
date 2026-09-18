import React from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  LayoutTemplate,
  Compass,
  CheckSquare2,
  Wrench,
  BarChart3,
  GraduationCap,
  Sparkles,
  Bell,
  HelpCircle,
  User,
  ChevronRight,
  ChevronDown,
  Globe2,
  Bot,
  ExternalLink,
  Link2
} from 'lucide-react';
import { NavigationTab, WebsiteSubTab, ToolSubTab, Project } from '../../types';
import { useAuth } from '../../auth/AuthContext';
import { memberDisplayName, memberInitials } from '../../services/authService';

export interface SidebarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  activeWebsiteSubTab: WebsiteSubTab;
  setActiveWebsiteSubTab: (subTab: WebsiteSubTab) => void;
  activeToolSubTab: ToolSubTab;
  setActiveToolSubTab: (subTab: ToolSubTab) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  activeProject: Project | null;
  pendingMissionsCount: number;
  unreadNotificationsCount: number;
  websiteStatusBadgeText?: string;
  onOpenNewProjectModal: () => void;
  onSwitchToAdminMode?: () => void;
  projectCount?: number;
  allowedTabs?: NavigationTab[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  activeWebsiteSubTab,
  setActiveWebsiteSubTab,
  activeToolSubTab,
  setActiveToolSubTab,
  isCollapsed,
  setIsCollapsed,
  activeProject,
  pendingMissionsCount,
  unreadNotificationsCount,
  websiteStatusBadgeText,
  onSwitchToAdminMode,
  projectCount = 0,
  allowedTabs
}) => {
  const { user } = useAuth();
  const [websiteExpanded, setWebsiteExpanded] = React.useState(true);
  const [toolsExpanded, setToolsExpanded] = React.useState(false);

  const navItems = [
    {
      id: 'dashboard' as NavigationTab,
      label: '다음 수업',
      icon: <LayoutDashboard className="w-4 h-4" />
    },
    {
      id: 'projects' as NavigationTab,
      label: '내 프로젝트',
      icon: <FolderKanban className="w-4 h-4" />,
      badge: projectCount > 0 ? `${projectCount}` : undefined
    },
    {
      id: 'website' as NavigationTab,
      label: '홈페이지 주문',
      icon: <LayoutTemplate className="w-4 h-4" />
    },
    {
      id: 'roadmap' as NavigationTab,
      label: 'SEO 로드맵',
      icon: <Compass className="w-4 h-4" />
    },
    {
      id: 'missions' as NavigationTab,
      label: '오늘의 미션',
      icon: <CheckSquare2 className="w-4 h-4" />,
      badge: pendingMissionsCount > 0 ? `${pendingMissionsCount}` : undefined,
      badgeColor: 'blue'
    },
    {
      id: 'tools' as NavigationTab,
      label: '오늘 열 화면',
      icon: <Wrench className="w-4 h-4" />
    },
    {
      id: 'reports' as NavigationTab,
      label: '성과 리포트',
      icon: <BarChart3 className="w-4 h-4" />
    },
    {
      id: 'integrations' as NavigationTab,
      label: '데이터 연결',
      icon: <Link2 className="w-4 h-4" />
    },
    {
      id: 'curriculum' as NavigationTab,
      label: '강의실',
      icon: <GraduationCap className="w-4 h-4" />
    },
    {
      id: 'ai_coach' as NavigationTab,
      label: 'AI SEO Coach',
      icon: <Sparkles className="w-4 h-4" />
    }
  ];

  const bottomItems = [
    {
      id: 'notifications' as NavigationTab,
      label: '알림',
      icon: <Bell className="w-4 h-4" />,
      badge: unreadNotificationsCount > 0 ? `${unreadNotificationsCount}` : undefined,
      badgeColor: 'red'
    },
    {
      id: 'help' as NavigationTab,
      label: '도움말 & FAQ',
      icon: <HelpCircle className="w-4 h-4" />
    },
    {
      id: 'account' as NavigationTab,
      label: '내 계정',
      icon: <User className="w-4 h-4" />
    }
  ].filter((item) => !allowedTabs || allowedTabs.includes(item.id));

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 bg-white text-[#1E293B] hidden lg:flex flex-col transition-all duration-300 ease-in-out border-r border-[#E2E8F0] ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header — min-height + padding so the mark is never clipped at the top */}
      <div className="min-h-16 px-5 py-3.5 flex items-center justify-between border-b border-[#E2E8F0] shrink-0">
        {!isCollapsed ? (
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 shrink-0 bg-[#2563EB] rounded-xl flex items-center justify-center text-white font-bold text-xl leading-none shadow-xs">
              S
            </div>
            <div className="min-w-0 leading-tight">
              <span className="block text-lg font-bold tracking-tight text-[#0F172A]">
                ONOFF 교육
              </span>
              <p className="text-[10px] text-[#64748B] font-medium tracking-wide leading-none mt-0.5">
                1:1 수업
              </p>
            </div>
          </div>
        ) : (
          <div className="w-10 h-10 mx-auto shrink-0 bg-[#2563EB] rounded-xl flex items-center justify-center text-white font-bold text-xl leading-none shadow-xs">
            S
          </div>
        )}
      </div>

      {/* Active Project Ribbon */}
      {!isCollapsed && (
        <div className="mx-3 mt-3 px-3.5 py-2.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
          <div className="flex items-center justify-between text-[11px] text-[#64748B] mb-1">
            <span className="flex items-center gap-1 font-medium">
              <Globe2 className="w-3 h-3 text-[#2563EB]" />
              <span>내 사업</span>
            </span>
          </div>
          <p className="text-xs font-bold text-[#0F172A] truncate">{activeProject?.name || '아직 없음'}</p>
          <p className="text-[11px] text-[#64748B] font-mono truncate">{activeProject?.domain || '-'}</p>
        </div>
      )}

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 custom-scrollbar">
        <div className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider px-3 mb-1.5">
          {!isCollapsed ? '메뉴' : '•••'}
        </div>

        {navItems.filter((item) => !allowedTabs || allowedTabs.includes(item.id)).map((item) => {
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#EFF6FF] text-[#2563EB] font-bold shadow-2xs'
                  : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] font-medium'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-[#2563EB]' : 'text-[#64748B]'}>
                  {item.icon}
                </span>
                {!isCollapsed && <span>{item.label}</span>}
              </div>

              {!isCollapsed && item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold leading-none ${
                    isActive
                      ? 'bg-[#2563EB] text-white'
                      : 'bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="pt-3 mt-2 border-t border-[#E2E8F0]">
          <div className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider px-3 mb-1.5">
            {!isCollapsed ? '설정' : '•••'}
          </div>
          {bottomItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#EFF6FF] text-[#2563EB] font-bold'
                    : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] font-medium'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-[#2563EB]' : 'text-[#64748B]'}>
                    {item.icon}
                  </span>
                  {!isCollapsed && <span>{item.label}</span>}
                </div>
                {!isCollapsed && item.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-500 text-white font-bold leading-none">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Student Profile Card Footer */}
      <div className="p-3.5 border-t border-[#E2E8F0] bg-white shrink-0 space-y-2">
        {!isCollapsed ? (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center text-white font-bold text-xs shadow-2xs shrink-0">
                  {memberInitials(user)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="text-xs font-bold text-[#0F172A] truncate">{memberDisplayName(user)}</p>
                  </div>
                  <p className="text-[11px] text-[#64748B] truncate">{user?.mbId || ''}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('account')}
                className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors"
                title="내 계정 설정"
              >
                <User className="w-4 h-4" />
              </button>
            </div>

            {onSwitchToAdminMode && (
              <button
                onClick={onSwitchToAdminMode}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold transition-all cursor-pointer shadow-xs"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                <span>관리자 Control Center 전환</span>
              </button>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center text-white font-bold text-xs">
              {memberInitials(user)}
            </div>
            {onSwitchToAdminMode && (
              <button
                onClick={onSwitchToAdminMode}
                className="w-6 h-6 rounded-lg bg-slate-900 text-white text-[9px] font-bold flex items-center justify-center cursor-pointer"
                title="관리자 Control Center 전환"
              >
                AD
              </button>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
