import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Clock, FileText, Loader2, LockKeyhole } from 'lucide-react';
import { educationApi, type EducationAccess } from '../api/educationApi';
import { buildLoginPath } from '../lib/brandedAuth';
import { useRenewalNav } from '../hooks/useRenewalNav';

const PLATFORM_DASHBOARD_PATH = '/seo-system-300/dashboard';

export default function EducationClassroom() {
  const { onOpenConsult } = useRenewalNav();
  const [access, setAccess] = useState<EducationAccess | null>(null);
  const [error, setError] = useState<{ status: number; message: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    educationApi
      .getAccess('any')
      .then((result) => {
        if (cancelled) return;
        if (result.ok === false) {
          setError({ status: result.status, message: result.error });
          setAccess(null);
          return;
        }
        setAccess(result.data);
        setError(null);
      })
      .catch(() => {
        if (!cancelled) setError({ status: 500, message: '수강권 확인 중 오류가 발생했습니다.' });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const enrollment = access?.enrollment;
  const pendingDeposit = enrollment?.status === 'pending_deposit';
  const requiresContract = Boolean(access?.requiresContract || enrollment?.status === 'pending_contract');
  const canEnterPlatform = Boolean(access?.access) && !requiresContract;
  const contractPath = access?.contractPath || '/education/contract';

  useEffect(() => {
    if (loading || !canEnterPlatform) return;
    window.location.replace(access?.platform_entry_url || PLATFORM_DASHBOARD_PATH);
  }, [loading, canEnterPlatform, access?.platform_entry_url]);

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-xs font-bold text-blue-600 tracking-wider uppercase">
            ONOFF Academy
          </span>
          <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
            SEO·GEO 마스터 클래스 강의실
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
            입금 확인 후 권한이 부여되면, 계약서 작성을 마친 회원만 플랫폼에 입장할 수 있습니다.
            교육·마케팅·통합 계약 모두 동일한 플랫폼을 이용합니다.
          </p>
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white border border-slate-200 p-8 text-center text-slate-500">
            접근 권한을 확인하는 중입니다…
          </div>
        ) : error?.status === 401 ? (
          <LockedCard
            icon={<LockKeyhole className="w-7 h-7" />}
            title="로그인이 필요합니다"
            message="ONOFF 통합계정으로 로그인한 뒤 강의실 접근 권한을 확인해 주세요."
            action={
              <Link
                to={buildLoginPath('/education/classroom')}
                className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold"
              >
                로그인하기
              </Link>
            }
          />
        ) : requiresContract ? (
          <LockedCard
            icon={<FileText className="w-7 h-7" />}
            title="계약서 작성이 필요합니다"
            message="권한이 부여되었습니다. 계약서 작성과 전자서명을 완료하면 플랫폼이 열립니다."
            action={
              <Link
                to={contractPath}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold"
              >
                계약서 작성하기
              </Link>
            }
          />
        ) : !access?.access ? (
          <LockedCard
            icon={pendingDeposit ? <Clock className="w-7 h-7" /> : <LockKeyhole className="w-7 h-7" />}
            title={pendingDeposit ? '입금 확인 대기 중입니다' : '활성화된 권한이 없습니다'}
            message={
              pendingDeposit
                ? '신청은 접수되었습니다. 관리자 입금 확인 후 계약서 작성 단계로 넘어갑니다.'
                : error?.message || '신청 후 계좌입금이 확인되면 플랫폼 접근 권한이 활성화됩니다.'
            }
            action={
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <button
                  type="button"
                  onClick={() => onOpenConsult({ topics: ['EDUCATION'], contractEnabled: true })}
                  className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold"
                >
                  교육·마케팅 신청하기
                </button>
                <Link
                  to="/education"
                  className="inline-flex items-center justify-center px-5 py-3 rounded-xl border border-slate-300 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50"
                >
                  교육 안내 보기
                </Link>
              </div>
            }
          />
        ) : (
          <div className="rounded-2xl bg-white border border-slate-200 p-8 text-center text-slate-600">
            <Loader2 className="w-5 h-5 animate-spin inline-block mr-2 align-[-2px]" />
            {access.member_name || access.mb_id}님의 강의 플랫폼 대시보드로 이동 중입니다…
          </div>
        )}
      </div>
    </div>
  );
}

function LockedCard({
  icon,
  title,
  message,
  action,
}: {
  icon: ReactNode;
  title: string;
  message: string;
  action: ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-8 text-center shadow-xs">
      <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
        {icon}
      </div>
      <h2 className="mt-4 text-xl font-bold text-slate-950">{title}</h2>
      <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto leading-relaxed">{message}</p>
      <div className="mt-6">{action}</div>
    </div>
  );
}
