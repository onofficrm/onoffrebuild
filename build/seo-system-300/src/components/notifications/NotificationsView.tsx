import React from 'react';
import { Bell, CheckCircle2, Clock, Info, AlertTriangle, ArrowRight } from 'lucide-react';
import { NotificationItem, NavigationTab } from '../../types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export interface NotificationsViewProps {
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onNavigate: (tab: NavigationTab, subTab?: string) => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  onMarkAllAsRead,
  onNavigate
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-blue-600" />
            <span>알림 센터</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            홈페이지 제작 배포, 백링크 색인, 미션 리마인더 등 중요 시스템 알림
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={onMarkAllAsRead}>
          모두 읽음 표시
        </Button>
      </div>

      <Card>
        {notifications.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">
            아직 알림이 없습니다. 홈페이지 주문·상태 변경 시 이곳에 표시됩니다.
          </div>
        ) : (
        <div className="divide-y divide-slate-100">
          {notifications.map((n) => {
            const iconMap = {
              success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
              info: <Info className="w-5 h-5 text-blue-500" />,
              warning: <Clock className="w-5 h-5 text-amber-500" />,
              alert: <AlertTriangle className="w-5 h-5 text-rose-500" />
            };

            return (
              <div
                key={n.id}
                onClick={() => n.actionTab && onNavigate(n.actionTab, n.actionSubTab)}
                className={`p-4 flex items-start justify-between gap-4 hover:bg-slate-50 transition-colors cursor-pointer ${
                  !n.read ? 'bg-blue-50/30' : ''
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="mt-0.5 shrink-0">{iconMap[n.type]}</div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                        {n.title}
                      </h3>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[11px] text-slate-400">{n.timeAgo}</span>
                  {n.actionTab && (
                    <Button variant="ghost" size="sm">
                      이동 →
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        )}
      </Card>
    </div>
  );
};
