import React from 'react';
import { User, ShieldCheck } from 'lucide-react';
import { Card } from '../common/Card';
import { useAuth } from '../../auth/AuthContext';
import { memberDisplayName, memberField, memberInitials } from '../../services/authService';
import { isEduHost } from '../../config/app';

export const AccountView: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const displayName = memberDisplayName(user);
  const initials = memberInitials(user);
  const edu = isEduHost();

  const logout = async () => {
    await fetch('/api/auth.php?action=logout', {
      method: 'POST',
      credentials: 'include',
      headers: { Accept: 'application/json' },
    }).catch(() => undefined);
    await fetch('/plugin/seo-system-300/edu-logout.php', {
      method: 'POST',
      credentials: 'include',
      headers: { Accept: 'application/json' },
    }).catch(() => undefined);
    window.location.assign('/login');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <User className="w-6 h-6 text-blue-600" />
          <span>내 계정</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          {edu
            ? 'ONOFF 통합계정입니다. 로그아웃하면 다른 icrm 서비스 세션도 함께 종료됩니다.'
            : 'GNUBoard 회원 정보입니다. 프로젝트·로드맵·홈페이지 주문은 운영 데이터로 연결됩니다.'}
        </p>
      </div>

      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 rounded-2xl p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xl font-black shadow-md ring-2 ring-white/20">
            {initials}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{displayName}님</h2>
            <p className="text-xs text-blue-200 mt-0.5 font-mono">{memberField(user?.mbId)}</p>
          </div>
        </div>
        <div className="text-right sm:border-l sm:border-white/10 sm:pl-6">
          <span className="text-[11px] text-blue-200 block">권한</span>
          <span className="text-sm font-extrabold text-emerald-400">
            {isAdmin ? '관리자' : '통합계정'}
          </span>
        </div>
      </div>
      {edu && (
        <button
          type="button"
          onClick={logout}
          className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-slate-200 px-5 text-sm font-bold text-slate-700 hover:bg-slate-50"
        >
          통합 로그아웃
        </button>
      )}

      <Card header={edu ? '통합계정' : 'GNUBoard 회원 정보'}>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-xs font-bold text-slate-500 mb-1">아이디</dt>
            <dd className="font-mono text-slate-900">{memberField(user?.mbId)}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold text-slate-500 mb-1">이름</dt>
            <dd className="text-slate-900">{memberField(user?.mbName)}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold text-slate-500 mb-1">닉네임</dt>
            <dd className="text-slate-900">{memberField(user?.mbNick)}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold text-slate-500 mb-1">이메일</dt>
            <dd className="text-slate-900">{memberField(user?.mbEmail)}</dd>
          </div>
        </dl>
        <p className="mt-4 text-[11px] text-slate-400 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          회원 정보는 GNUBoard에서 읽기 전용으로 표시합니다.
        </p>
      </Card>
    </div>
  );
};
