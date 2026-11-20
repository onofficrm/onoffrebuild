import React from 'react';
import {
  LayoutDashboard,
  Compass,
  FolderKanban,
  LayoutTemplate,
  BarChart3,
  X,
  Globe2,
  User,
  ScrollText,
  GraduationCap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NavigationTab, Project } from '../../types';
import { useAuth } from '../../auth/AuthContext';
import { memberDisplayName, type ContractAccessState } from '../../services/authService';
import { openContractPath } from '../../config/routes';

function contractNavLabel(contract: ContractAccessState): string {
  if (contract.status === 'review_pending') return '계약 승인 대기';
  if (contract.status === 'rejected') return '계약서 재작성';
  if (contract.status === 'signed' || (contract.viewable && !contract.requires)) return '계약 정보';
  return '계약서 체결하기';
}

function contractNavBadge(contract: ContractAccessState): string | undefined {
  if (contract.status === 'review_pending') return '대기';
  if (contract.requires && !contract.signed) return '필수';
  return undefined;
}

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
    { id: 'dashboard' as NavigationTab, label: '홈', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'roadmap' as NavigationTab, label: 'SEO 로드맵', icon: <Compass className="w-5 h-5" /> },
    { id: 'curriculum' as NavigationTab, label: '강의실', icon: <GraduationCap className="w-5 h-5" /> },
    { id: 'projects' as NavigationTab, label: '내 프로젝트', icon: <FolderKanban className="w-5 h-5" /> },
    { id: 'website' as NavigationTab, label: '홈페이지 제작', icon: <LayoutTemplate className="w-5 h-5" /> },
    { id: 'reports' as NavigationTab, label: '성과', icon: <BarChart3 className="w-5 h-5" /> },
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
          {navItems.filter((item) => item.id !== 'account').map((item) => {
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
          <div className="pt-3 mt-3 border-t border-[#1E293B] space-y-1">
            <p className="px-3.5 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#475569]">설정</p>
            {showContract ? (
              <button
                type="button"
                onClick={() => {
                  openContractPath(navigate, contract);
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
                  <span>{contractNavLabel(contract)}</span>
                </div>
                {contractNavBadge(contract) ? (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-500 text-white font-bold leading-none">
                    {contractNavBadge(contract)}
                  </span>
                ) : null}
              </button>
            ) : null}
            {navItems.filter((item) => item.id === 'account').map((item) => {
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
