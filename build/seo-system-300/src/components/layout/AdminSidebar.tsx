import React from 'react';
import {
  LayoutDashboard,
  Inbox,
  LayoutTemplate,
  Users,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  AlertTriangle,
  Flame,
  UserCheck,
  Globe2,
  ExternalLink,
  Link2,
  ArrowLeftRight
} from 'lucide-react';
import { AdminTab } from '../../types';
import { ADMIN_KPIS } from '../../mocks/adminFixtures';

export interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  onSwitchToStudentMode: () => void;
  urgentInboxCount: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  onSwitchToStudentMode,
  urgentInboxCount
}) => {
  const navItems = [
    {
      id: 'dashboard' as AdminTab,
      label: 'Admin Dashboard',
      subLabel: '관리자 대시보드',
      icon: <LayoutDashboard className="w-4 h-4" />
    },
    {
      id: 'inbox' as AdminTab,
      label: '지금 확인해야 할 작업',
      subLabel: 'Priority Inbox',
      icon: <Inbox className="w-4 h-4" />,
      badge: `${urgentInboxCount}건`,
      badgeColor: 'rose'
    },
    {
      id: 'kanban' as AdminTab,
      label: '홈페이지 주문 관리',
      subLabel: '/admin/website-orders',
      icon: <LayoutTemplate className="w-4 h-4" />,
      badge: `${ADMIN_KPIS.websitesInProgress}건`,
      badgeColor: 'blue'
    },
    {
      id: 'students' as AdminTab,
      label: '수강생 관리',
      subLabel: '전체 수강생 & 진도 필터',
      icon: <Users className="w-4 h-4" />,
      badge: `${ADMIN_KPIS.totalStudents}명`,
      badgeColor: 'slate'
    },
    {
      id: 'integrations' as AdminTab,
      label: 'SEO 데이터 연결',
      subLabel: 'GSC / GA4 동기화 현황',
      icon: <Link2 className="w-4 h-4" />
    }
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen bg-[#0F172A] border-r border-slate-800 transition-all duration-300 hidden lg:flex flex-col ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="min-h-16 px-4 py-3.5 flex items-center justify-between border-b border-slate-800 shrink-0">
        {!isCollapsed ? (
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 shrink-0 rounded-xl bg-[#2563EB] flex items-center justify-center text-white shadow-xs font-black text-xs leading-none">
              AD
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm tracking-tight text-white">
                  SEO SYSTEM
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
                  ADMIN
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono leading-none mt-0.5">
                Control Center v3.5
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full flex justify-center">
            <div className="w-8 h-8 shrink-0 rounded-xl bg-[#2563EB] flex items-center justify-center text-white shadow-xs font-black text-xs leading-none">
              AD
            </div>
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title={isCollapsed ? '사이드바 펼치기' : '사이드바 접기'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Switch Mode Action Button */}
      <div className="p-3 border-b border-slate-800">
        <button
          onClick={onSwitchToStudentMode}
          className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all cursor-pointer shadow-xs group ${
            isCollapsed ? 'px-0' : ''
          }`}
          title="수강생 포털 화면으로 전환"
        >
          <ArrowLeftRight className="w-3.5 h-3.5 text-[#2563EB] group-hover:rotate-180 transition-transform duration-300" />
          {!isCollapsed && <span>수강생 화면으로 전환</span>}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1.5">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">
          {!isCollapsed ? 'CONTROL CENTER' : '•••'}
        </div>

        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#2563EB] text-white font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/70 font-medium'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-white' : 'text-slate-400'}>
                  {item.icon}
                </span>
                {!isCollapsed && (
                  <div className="text-left">
                    <span className="block leading-tight">{item.label}</span>
                    <span className={`text-[10px] block ${isActive ? 'text-blue-200' : 'text-slate-500'}`}>
                      {item.subLabel}
                    </span>
                  </div>
                )}
              </div>

              {!isCollapsed && item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold leading-none ${
                    item.badgeColor === 'rose'
                      ? 'bg-rose-500 text-white'
                      : item.badgeColor === 'blue'
                      ? 'bg-blue-600/60 text-blue-200 border border-blue-400/30'
                      : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Admin Profile Footer */}
      <div className="p-3.5 border-t border-slate-800 bg-slate-900/50 shrink-0">
        {!isCollapsed ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-xs shadow-2xs shrink-0">
                AD
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">총괄 마스터 관리자</p>
                <p className="text-[10px] text-emerald-400 font-mono truncate">
                  ● Super Admin 접속중
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-xs">
              AD
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
