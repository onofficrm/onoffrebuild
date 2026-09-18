import React from 'react';

const STATUS_COPY: Record<string, { title: string; body: string }> = {
  pending_deposit: {
    title: '입금 확인 후 열립니다.',
    body: '수강 신청은 접수되어 있습니다. 관리자가 입금을 확인하면 이 교육 플랫폼이 열립니다.',
  },
  expired: {
    title: '수강 기간이 끝났습니다.',
    body: '기간을 연장하려면 담당자에게 문의해 주세요.',
  },
  cancelled: {
    title: '수강이 취소된 계정입니다.',
    body: '다시 시작하려면 수강 신청을 새로 진행해 주세요.',
  },
};

export const EnrollmentBlockedScreen: React.FC<{ status: string }> = ({ status }) => {
  const copy = STATUS_COPY[status] || {
    title: '수강권이 연결된 계정만 입장할 수 있습니다.',
    body: '통합 로그인 계정이 수강권의 회원 ID와 같아야 합니다. 신청 때 로그인한 계정인지 확인해 주세요.',
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-sm text-center">
        <p className="text-[10px] font-bold tracking-widest text-sky-600 uppercase">edu.icrm.co.kr</p>
        <h1 className="mt-2 text-xl font-black text-slate-900 [word-break:keep-all]">{copy.title}</h1>
        <p className="mt-2 text-sm text-slate-500 [word-break:keep-all]">{copy.body}</p>
        <a
          href="https://onoff.icrm.co.kr/education"
          className="mt-6 inline-flex items-center justify-center w-full min-h-[48px] rounded-full bg-slate-900 text-white font-bold text-sm"
        >
          교육 안내 보기
        </a>
      </div>
    </div>
  );
};
