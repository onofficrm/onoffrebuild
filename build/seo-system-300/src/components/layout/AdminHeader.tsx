import React, { useState } from 'react';
import {
  Search,
  Bell,
  Sparkles,
  ChevronDown,
  Globe2,
  PlusCircle,
  Menu,
  ShieldCheck,
  ArrowLeftRight,
  AlertTriangle,
  Users,
  LayoutTemplate
} from 'lucide-react';
import { AdminTab } from '../../types';

export interface AdminHeaderProps {
  activeTab: AdminTab;
  onNavigateTab: (tab: AdminTab) => void;
  onSwitchToStudentMode: () => void;
  onToggleMobileMenu: () => void;
  isSidebarCollapsed: boolean;
  urgentCount: number;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  activeTab,
  onNavigateTab,
  onSwitchToStudentMode,
  onToggleMobileMenu,
  isSidebarCollapsed,
  urgentCount
}) => {
  return (
    <header
      className={`h-16 bg-white border-b border-[#E2E8F0] sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8 transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:pl-24' : 'lg:pl-68'
      }`}
    >
      {/* Left: Mobile trigger & Breadcrumb */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-[#64748B] hover:bg-[#F8FAFC]"
          aria-label="메뉴 열기"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="px-2 py-0.5 rounded-md bg-[#0F172A] text-white text-[10px] uppercase font-mono">
            SUPER ADMIN
          </span>
          <span className="hidden sm:inline text-[#64748B]">/</span>
          <span className="text-[#0F172A] font-black">
            {activeTab === 'dashboard'
              ? '관리자 대시보드'
              : activeTab === 'inbox'
              ? '지금 확인해야 할 작업 (Priority Inbox)'
              : activeTab === 'kanban'
              ? '홈페이지 제작 Kanban 파이프라인'
              : activeTab === 'integrations'
              ? 'SEO 데이터 연결 현황'
              : '수강생 통합 관리'}
          </span>
        </div>
      </div>

      {/* Right side: Switch to Student Portal button & Urgent Badge */}
      <div className="flex items-center gap-3">
        {/* Urgent Alert Pill */}
        {urgentCount > 0 && (
          <button
            onClick={() => onNavigateTab('inbox')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold hover:bg-rose-100 transition-colors cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>확인 필요 {urgentCount}건</span>
          </button>
        )}

        {/* Switch to Student Portal */}
        <button
          onClick={onSwitchToStudentMode}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#EFF6FF] border border-[#DBEAFE] hover:bg-blue-100 text-[#2563EB] text-xs font-bold transition-all cursor-pointer shadow-2xs"
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">수강생 화면으로 이동</span>
          <span className="sm:hidden">수강생 모드</span>
        </button>

        {/* Admin Avatar */}
        <div className="w-8 h-8 rounded-full bg-[#0F172A] text-white flex items-center justify-center text-xs font-bold shadow-2xs">
          AD
        </div>
      </div>
    </header>
  );
};
