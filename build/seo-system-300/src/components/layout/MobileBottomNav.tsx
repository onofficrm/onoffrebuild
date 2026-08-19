import React from 'react';
import {
  LayoutDashboard,
  CheckSquare2,
  Compass,
  FolderKanban,
  Sparkles
} from 'lucide-react';
import { NavigationTab } from '../../types';

export interface MobileBottomNavProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  pendingMissionsCount?: number;
  aiCoachBadge?: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  pendingMissionsCount = 0,
  aiCoachBadge = false
}) => {
  const navItems = [
    {
      id: 'dashboard' as NavigationTab,
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      id: 'missions' as NavigationTab,
      label: 'Today',
      icon: <CheckSquare2 className="w-5 h-5" />,
      badge: pendingMissionsCount > 0 ? `${pendingMissionsCount}` : undefined
    },
    {
      id: 'roadmap' as NavigationTab,
      label: 'Roadmap',
      icon: <Compass className="w-5 h-5" />
    },
    {
      id: 'projects' as NavigationTab,
      label: 'Project',
      icon: <FolderKanban className="w-5 h-5" />
    },
    {
      id: 'ai_coach' as NavigationTab,
      label: 'AI Coach',
      icon: <Sparkles className="w-5 h-5" />,
      hasDot: aiCoachBadge
    }
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E2E8F0] shadow-lg pb-safe"
    >
      <div className="flex items-center justify-around h-16 px-2">
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

                {/* Badge for Pending Missions */}
                {item.badge && (
                  <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white font-bold text-[9px] flex items-center justify-center shadow-xs">
                    {item.badge}
                  </span>
                )}

                {/* Dot for AI Coach Insight */}
                {item.hasDot && !isActive && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-blue-500 animate-pulse ring-2 ring-white" />
                )}
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
