import React from 'react';
import { ShieldOff } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminForbiddenScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-sm text-center">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
          <ShieldOff className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-black text-slate-900 [word-break:keep-all]">관리자 권한이 없습니다.</h1>
        <p className="mt-2 text-sm text-slate-500 [word-break:keep-all]">
          이 메뉴는 GNUBoard 관리자만 사용할 수 있습니다.
        </p>
        <Link
          to="/dashboard"
          className="mt-6 inline-flex items-center justify-center w-full min-h-[48px] rounded-full bg-slate-900 text-white font-bold text-sm"
        >
          수강생 대시보드로 이동
        </Link>
      </div>
    </div>
  );
};
