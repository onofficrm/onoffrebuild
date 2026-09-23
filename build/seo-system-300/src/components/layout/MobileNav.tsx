import React from 'react';
import {
  LayoutDashboard,
  LayoutTemplate,
  Wrench,
  Bell,
  X,
  Globe2,
  User,
  Presentation,
  ScrollText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NavigationTab, Project } from '../../types';
import { useAuth } from '../../auth/AuthContext';
import { memberDisplayName } from '../../services/authService';
import { contractPathFor } from '../../config/routes';

export interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  activeProject: Project | null;
  pendingMissionsCount: number;
  allowedTabs?: NavigationTab[];
}

export const MobileNav: React.FC<MobileNavProps> = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  activeProject,
  pendingMissionsCount,
  allowedTabs
}) => {
  const navigate = useNavigate();
  const { user, contract } = useAuth();
  if (!isOpen) return null;

  const showContract = contract.applies && (!allowedTabs || allowedTabs.includes('contract'));

  const navItems = [
    { id: 'dashboard' as NavigationTab, label: '오늘 미션', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'tools' as NavigationTab, label: '오늘 열 화면', icon: <Wrench className="w-5 h-5" /> },
    { id: 'website' as NavigationTab, label: '홈페이지 주문', icon: <LayoutTemplate className="w-5 h-5" /> },
    { id: 'slides' as NavigationTab, label: '교육 슬라이드', icon: <Presentation className="w-5 h-5" /> },
    { id: 'notifications' as NavigationTab, label: '알림', icon: <Bell className="w-5 h-5" /> },
    { id: 'account' as NavigationTab, label: '내 계정', icon: <User className="w-5 h-5" /> }
  ].filter((item) => !allowedTabs || allowedTabs.includes(item.id));

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-xs" onClick={onClose} />

      {/* Drawer */}
      <div className="relative w-4/5 max-w-xs bg-[#0F172A] text-white h-full flex flex-col shadow-2xl z-10 animate-in slide-in-from-left duration-200 border-r border-[#1E293B]">
        {/* Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-[#1E293B]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#2563EB] flex items-center justify-center text-white font-bold text-lg shadow-xs">
              S
            </div>
            <span className="font-bold text-white text-sm">SEO SYSTEM 300</span>
          </div>
          <button onClick={onClose} className="p-1.5 text-[#64748B] hover:text-white rounded-xl hover:bg-[#1E293B]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Project Card */}
        <div className="p-4 border-b border-[#1E293B] bg-[#1E293B]/50">
          <div className="text-[11px] text-[#94A3B8] mb-1 flex items-center gap-1">
            <Globe2 className="w-3 h-3 text-[#3B82F6]" />
            <span className="font-bold">내 사업</span>
          </div>
          <p className="text-xs font-bold text-white truncate">{activeProject?.name || '아직 없음'}</p>
          <p className="text-[11px] text-[#64748B] font-mono">{activeProject?.domain || '-'}</p>
        </div>

        {/* Nav list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
          {showContract ? (
            <button
              type="button"
              onClick={() => {
                navigate(contractPathFor(contract));
                onClose();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm transition-colors ${
                activeTab === 'contract'
                  ? 'bg-[#2563EB] text-white font-bold shadow-lg shadow-blue-500/20'
                  : 'text-[#94A3B8] hover:text-white hover:bg-[#1E293B] font-medium'
              }`}
            >
              <div className="flex items-center gap-3">
                <ScrollText className="w-5 h-5" />
                <span>계약</span>
              </div>
            </button>
          ) : null}
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm transition-colors ${
                  isActive
                    ? 'bg-[#2563EB] text-white font-bold shadow-lg shadow-blue-500/20'
                    : 'text-[#94A3B8] hover:text-white hover:bg-[#1E293B] font-medium'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-white' : 'text-[#64748B]'}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1E293B] bg-[#0F172A] text-xs text-[#94A3B8]">
          <p className="font-bold text-white">{memberDisplayName(user)}</p>
          <p className="text-[11px] mt-0.5">교육 플랫폼</p>
        </div>
      </div>
    </div>
  );
};
