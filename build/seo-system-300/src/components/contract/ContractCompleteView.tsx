import React from 'react';
import { Clock, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { studentPath } from '../../config/routes';

export const ContractCompleteView: React.FC = () => {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900/90 p-8 sm:p-10 text-center max-w-2xl mx-auto">
      <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center mx-auto">
        <Clock className="w-7 h-7 text-cyan-400" />
      </div>
      <h2 className="mt-5 text-xl font-bold text-white">계약서 승인 대기 중입니다</h2>
      <p className="mt-2 text-sm text-slate-400 leading-relaxed [word-break:keep-all]">
        전자서명이 접수되었습니다. 담당자 검토·승인 후 플랫폼 전체 기능이 열립니다. 진행 상황은 알림에서도 확인할 수
        있습니다.
      </p>
      <Link
        to={studentPath('contract', 'view')}
        className="mt-6 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white text-sm font-bold transition-colors"
      >
        <FileText className="w-4 h-4" />
        제출한 계약서 보기
      </Link>
    </div>
  );
};
