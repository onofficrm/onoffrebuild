import React from 'react';
import {
  LayoutDashboard,
  LayoutTemplate,
  Wrench,
  Bell,
  ScrollText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NavigationTab } from '../../types';
import { useAuth } from '../../auth/AuthContext';
import { contractPathFor } from '../../config/routes';

export interface MobileBottomNavProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  pendingMissionsCount?: number;
  aiCoachBadge?: boolean;
  allowedTabs?: NavigationTab[];
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  pendingMissionsCount = 0,
  aiCoachBadge = false,
  allowedTabs
}) => {
  const navigate = useNavigate();
  const { contract } = useAuth();
  const showContract = contract.applies && (!allowedTabs || allowedTabs.includes('contract'));

  const navItems = [
    {
      id: 'dashboard' as NavigationTab,
      label: '오늘 미션',
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      id: 'tools' as NavigationTab,
      label: '오늘 화면',
      icon: <Wrench className="w-5 h-5" />
    },
    {
      id: 'website' as NavigationTab,
      label: '홈페이지',
      icon: <LayoutTemplate className="w-5 h-5" />
    },
    {
      id: 'notifications' as NavigationTab,
      label: '알림',
      icon: <Bell className="w-5 h-5" />
    }
  ].filter((item) => !allowedTabs || allowedTabs.includes(item.id));

  return (
    <nav
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E2E8F0] shadow-lg pb-safe"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {showContract ? (
          <button
            type="button"
            onClick={() => navigate(contractPathFor(contract))}
            className={`relative flex flex-col items-center justify-center flex-1 h-full py-1 transition-all cursor-pointer ${
              activeTab === 'contract' ? 'text-[#2563EB]' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <ScrollText className={`w-5 h-5 ${activeTab === 'contract' ? 'scale-110' : ''}`} />
            <span
              className={`text-[10px] tracking-tight mt-1 ${activeTab === 'contract' ? 'font-black text-[#2563EB]' : 'font-medium text-[#64748B]'}`}
            >
              계약
            </span>
            {activeTab === 'contract' && (
              <span className="absolute top-0 w-8 h-0.5 rounded-full bg-[#2563EB]" />
            )}
          </button>
        ) : null}
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center flex-1 h-full py-1 transition-all cursor-pointer ${
                isActive ? 'text-[#2563EB]' : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <div className="relative">
                <div className={`transition-transform duration-150 ${isActive ? 'scale-110' : ''}`}>
                  {item.icon}
                </div>
              </div>

              <span
                className={`text-[10px] tracking-tight mt-1 transition-all ${
                  isActive ? 'font-black text-[#2563EB]' : 'font-medium text-[#64748B]'
                }`}
              >
                {item.label}
              </span>

              {/* Active Underline Pill Indicator */}
              {isActive && (
                <span className="absolute top-0 w-8 h-0.5 rounded-full bg-[#2563EB]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
