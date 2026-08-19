import React from 'react';

export const AuthLoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-4" role="status" aria-label="세션 확인 중">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2563EB] animate-pulse" />
          <div className="space-y-2 flex-1">
            <div className="h-3 w-40 bg-slate-200 rounded animate-pulse" />
            <div className="h-3 w-24 bg-slate-100 rounded animate-pulse" />
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
          <div className="h-4 w-3/4 bg-slate-200 rounded animate-pulse" />
          <div className="h-4 w-full bg-slate-100 rounded animate-pulse" />
          <div className="h-24 w-full bg-slate-50 rounded-xl animate-pulse" />
        </div>
        <p className="text-center text-xs font-bold text-slate-500">SEO SYSTEM 300 로그인 상태를 확인하고 있습니다.</p>
      </div>
    </div>
  );
};
