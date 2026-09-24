import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { educationApi } from '../api/educationApi';

const VISIBLE_STATUSES = new Set(['pending_deposit', 'pending_contract', 'active']);

/**
 * Compact classroom shortcut above the Kakao FAB.
 * Shown only when the member has an in-progress or active enrollment.
 * Link always goes to /education/classroom (login / contract / dashboard handled there).
 */
export default function ClassroomEntryFab() {
  const location = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let cancelled = false;
    educationApi
      .getAccess('any')
      .then((result) => {
        if (cancelled) return;
        if (result.ok === false) {
          setVisible(false);
          return;
        }
        const status = String(result.data.enrollment?.status || '');
        setVisible(VISIBLE_STATUSES.has(status));
      })
      .catch(() => {
        if (!cancelled) setVisible(false);
      });
    return () => {
      cancelled = true;
    };
  }, [location.pathname]);

  if (!visible) return null;
  if (location.pathname.startsWith('/education/classroom')) return null;

  return (
    <Link
      to="/education/classroom"
      aria-label="강의실 입장"
      title="강의실 입장"
      className="group relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-slate-900 text-white shadow-[0_8px_24px_rgba(15,23,42,0.35)] border border-slate-700 flex items-center justify-center hover:bg-slate-800 hover:scale-105 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
    >
      <GraduationCap size={22} className="sm:w-6 sm:h-6" aria-hidden="true" />
      <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-lg bg-slate-900 text-white text-xs font-bold px-3 py-1.5 opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100 group-focus-visible:translate-x-0 transition-all shadow-lg">
        강의실 입장
      </span>
    </Link>
  );
}
