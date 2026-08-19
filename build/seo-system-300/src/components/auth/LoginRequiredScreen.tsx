import React from 'react';
import { Lock } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { currentPortalReturnPath, gnuboardLoginUrl } from '../../utils/loginRedirect';

export const LoginRequiredScreen: React.FC = () => {
  const location = useLocation();
  const returnPath = currentPortalReturnPath(location.pathname, location.search);
  const href = gnuboardLoginUrl(returnPath);

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-sm text-center">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-4">
          <Lock className="w-6 h-6" />
        </div>
        <p className="text-[10px] font-bold tracking-widest text-sky-600 uppercase">SEO SYSTEM 300</p>
        <h1 className="mt-2 text-xl font-black text-slate-900 [word-break:keep-all]">
          SEO SYSTEM 300은 수강생 전용 서비스입니다.
        </h1>
        <p className="mt-2 text-sm text-slate-500 [word-break:keep-all]">
          GNUBoard 회원 로그인 후 Control Center를 이용할 수 있습니다.
        </p>
        <a
          href={href}
          className="mt-6 inline-flex items-center justify-center w-full min-h-[48px] rounded-full bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold text-sm"
        >
          로그인하고 계속하기
        </a>
      </div>
    </div>
  );
};
