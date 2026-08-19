import React from 'react';

export const LaunchPreparingScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-sm text-center">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-4 font-black">
          300
        </div>
        <p className="text-[10px] font-bold tracking-widest text-sky-600 uppercase">SEO SYSTEM 300</p>
        <h1 className="mt-2 text-xl font-black text-slate-900 [word-break:keep-all]">
          서비스를 준비하고 있습니다.
        </h1>
        <p className="mt-2 text-sm text-slate-500 [word-break:keep-all]">
          곧 이용하실 수 있습니다.
        </p>
      </div>
    </div>
  );
};
