import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, RefreshCw, Shield } from 'lucide-react';
import { AuthShell, AuthAlert } from '../../components/auth/AuthShell';
import {
  educationApi,
  type EducationEnrollment,
  type EnrollmentStatusFilter,
} from '../../api/educationApi';
import { AUTH_ROUTES, buildLoginPath } from '../../lib/brandedAuth';

const STATUS_OPTIONS: { value: EnrollmentStatusFilter | 'all'; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'pending_deposit', label: '입금대기' },
  { value: 'pending_contract', label: '계약대기' },
  { value: 'active', label: '수강중' },
  { value: 'expired', label: '만료' },
  { value: 'cancelled', label: '취소' },
];

function statusLabel(status: string) {
  return STATUS_OPTIONS.find((s) => s.value === status)?.label || status;
}

function courseLabel(courseId: string) {
  switch (courseId) {
    case 'seo-geo-master':
      return '교육';
    case 'marketing-service':
      return '마케팅';
    case 'education-marketing':
      return '교육+마케팅';
    default:
      return courseId || '-';
  }
}

function courseTone(courseId: string) {
  switch (courseId) {
    case 'marketing-service':
      return 'bg-violet-50 text-violet-800 border-violet-200';
    case 'education-marketing':
      return 'bg-indigo-50 text-indigo-800 border-indigo-200';
    case 'seo-geo-master':
    default:
      return 'bg-blue-50 text-blue-800 border-blue-200';
  }
}

function statusTone(status: string) {
  switch (status) {
    case 'pending_deposit':
      return 'bg-amber-50 text-amber-800 border-amber-200';
    case 'pending_contract':
      return 'bg-sky-50 text-sky-800 border-sky-200';
    case 'active':
      return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    case 'expired':
      return 'bg-slate-100 text-slate-600 border-slate-200';
    case 'cancelled':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    default:
      return 'bg-slate-50 text-slate-600 border-slate-200';
  }
}

type Draft = {
  mb_id: string;
  status: string;
  deposit_amount: string;
  depositor_name: string;
  starts_at: string;
  ends_at: string;
  admin_memo: string;
};

function toDraft(row: EducationEnrollment): Draft {
  return {
    mb_id: row.mb_id || '',
    status: row.status || 'pending_deposit',
    deposit_amount: String(row.deposit_amount ?? 0),
    depositor_name: row.depositor_name || '',
    starts_at: row.starts_at || '',
    ends_at: row.ends_at || '',
    admin_memo: row.admin_memo || '',
  };
}

export default function AccountEnrollmentsPage() {
  const [canManage, setCanManage] = useState<boolean | null>(null);
  const [items, setItems] = useState<EducationEnrollment[]>([]);
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});
  const [status, setStatus] = useState<EnrollmentStatusFilter | 'all'>('pending_deposit');
  const [stx, setStx] = useState('');
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [drafts, setDrafts] = useState<Record<number, Draft>>({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);

  const loadList = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await educationApi.listEnrollments({
      status: status === 'all' ? '' : status,
      stx: stx.trim(),
      page,
    });
    setLoading(false);
    if (result.ok === false) {
      if (result.status === 401) {
        setCanManage(false);
        setError('로그인이 필요합니다.');
        return;
      }
      if (result.status === 403) {
        setCanManage(false);
        setError('최고관리자만 수강권을 승인할 수 있습니다.');
        return;
      }
      setError(result.error);
      return;
    }
    setCanManage(true);
    setItems(result.data.items);
    setStatusCounts(result.data.statusCounts || {});
    setTotalPage(result.data.totalPage);
    setTotalCount(result.data.totalCount);
    const next: Record<number, Draft> = {};
    for (const row of result.data.items) {
      next[row.en_id] = toDraft(row);
    }
    setDrafts(next);
  }, [page, status, stx]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const gate = await educationApi.getAdminGate();
      if (cancelled) return;
      if (gate.ok === false) {
        setCanManage(false);
        setLoading(false);
        setError(gate.status === 401 ? '로그인이 필요합니다.' : gate.error);
        return;
      }
      if (!gate.data.canManageAdmin) {
        setCanManage(false);
        setLoading(false);
        setError('최고관리자만 수강권을 승인할 수 있습니다.');
        return;
      }
      setCanManage(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (canManage !== true) return;
    void loadList();
  }, [canManage, loadList]);

  async function saveRow(enId: number, approve = false) {
    const draft = drafts[enId];
    if (!draft) return;
    setSavingId(enId);
    setFlash(null);
    setError(null);
    const result = await educationApi.updateEnrollment({
      en_id: enId,
      mb_id: draft.mb_id.trim(),
      status: approve ? 'active' : draft.status,
      deposit_amount: Number(draft.deposit_amount) || 0,
      depositor_name: draft.depositor_name.trim(),
      starts_at: draft.starts_at.trim(),
      ends_at: draft.ends_at.trim(),
      admin_memo: draft.admin_memo.trim(),
    });
    setSavingId(null);
    if (result.ok === false) {
      setError(result.error);
      return;
    }
    setFlash(
      approve
        ? `수강권 #${enId}을 승인했습니다. 수강중이 됩니다.`
        : `수강권 #${enId}을 저장했습니다.`
    );
    await loadList();
  }

  function patchDraft(enId: number, patch: Partial<Draft>) {
    setDrafts((prev) => ({ ...prev, [enId]: { ...prev[enId], ...patch } }));
  }

  return (
    <AuthShell
      wide
      title="수강권 승인"
      lead="입금대기·계약대기 신청은 승인하면 수강중이 됩니다. 이미 수강중인 건은 저장만 하면 됩니다."
      footer={
        <p className="text-xs text-slate-500">
          <Link to={AUTH_ROUTES.account} className="text-blue-600 font-semibold hover:underline">
            내 계정
          </Link>
          {' · '}
          <Link to={AUTH_ROUTES.accountNotifications} className="text-slate-500 hover:text-blue-600">
            알림 설정
          </Link>
          {' · '}
          <Link to="/" className="text-slate-500 hover:text-blue-600">
            홈
          </Link>
        </p>
      }
    >
      {canManage === false ? (
        <div className="space-y-3">
          <AuthAlert tone="error">{error || '권한이 없습니다.'}</AuthAlert>
          <Link
            to={buildLoginPath(AUTH_ROUTES.accountEnrollments)}
            className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5"
          >
            통합계정으로 로그인
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            {STATUS_OPTIONS.map((opt) => {
              const count =
                opt.value === 'all'
                  ? totalCount
                  : statusCounts[opt.value] ?? 0;
              const active = status === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setStatus(opt.value);
                    setPage(1);
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${
                    active
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300'
                  }`}
                >
                  {opt.label}
                  <span className={active ? 'text-blue-100' : 'text-slate-400'}>{count}</span>
                </button>
              );
            })}
          </div>

          <form
            className="flex flex-col sm:flex-row gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              setPage(1);
              void loadList();
            }}
          >
            <input
              value={stx}
              onChange={(e) => setStx(e.target.value)}
              placeholder="이름·아이디·전화·이메일 검색"
              className="flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold px-4 py-2.5"
            >
              <RefreshCw className="w-4 h-4" />
              검색
            </button>
          </form>

          {flash ? <AuthAlert tone="success">{flash}</AuthAlert> : null}
          {error ? <AuthAlert tone="error">{error}</AuthAlert> : null}

          {loading ? (
            <p className="text-sm text-slate-500 text-center py-8">불러오는 중…</p>
          ) : items.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
              조건에 맞는 수강권이 없습니다.
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((row) => {
                const draft = drafts[row.en_id] || toDraft(row);
                const saving = savingId === row.en_id;
                const canApprove = row.status === 'pending_deposit' || row.status === 'pending_contract';
                return (
                  <article
                    key={row.en_id}
                    className="rounded-2xl border border-slate-200 overflow-hidden"
                  >
                    <div className="flex flex-wrap items-center gap-2 px-4 py-3 bg-slate-50 border-b border-slate-200">
                      <span className="text-xs font-black text-slate-500">#{row.en_id}</span>
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${courseTone(row.course_id)}`}
                      >
                        {courseLabel(row.course_id)}
                      </span>
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${statusTone(row.status)}`}
                      >
                        {statusLabel(row.status)}
                      </span>
                      <span className="text-sm font-extrabold text-slate-900">
                        {row.applicant_name || '(이름 없음)'}
                      </span>
                      {row.email ? (
                        <span className="text-xs font-semibold text-slate-700">{row.email}</span>
                      ) : null}
                      <span className="ml-auto text-[11px] text-slate-400">{row.created_at}</span>
                    </div>

                    <div className="p-4 grid sm:grid-cols-2 gap-3 text-sm">
                      <label className="space-y-1">
                        <span className="text-[11px] font-bold text-slate-500">회원 아이디 (mb_id)</span>
                        <input
                          value={draft.mb_id}
                          onChange={(e) => patchDraft(row.en_id, { mb_id: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 px-3 py-2"
                        />
                      </label>
                      <label className="space-y-1">
                        <span className="text-[11px] font-bold text-slate-500">상태</span>
                        <select
                          value={draft.status}
                          onChange={(e) => patchDraft(row.en_id, { status: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 px-3 py-2"
                        >
                          {STATUS_OPTIONS.filter((s) => s.value !== 'all').map((s) => (
                            <option key={s.value} value={s.value}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="space-y-1">
                        <span className="text-[11px] font-bold text-slate-500">입금액</span>
                        <input
                          type="number"
                          value={draft.deposit_amount}
                          onChange={(e) => patchDraft(row.en_id, { deposit_amount: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 px-3 py-2"
                        />
                      </label>
                      <label className="space-y-1">
                        <span className="text-[11px] font-bold text-slate-500">입금자명</span>
                        <input
                          value={draft.depositor_name}
                          onChange={(e) => patchDraft(row.en_id, { depositor_name: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 px-3 py-2"
                        />
                      </label>
                      <label className="space-y-1">
                        <span className="text-[11px] font-bold text-slate-500">시작일</span>
                        <input
                          value={draft.starts_at}
                          onChange={(e) => patchDraft(row.en_id, { starts_at: e.target.value })}
                          placeholder="YYYY-MM-DD HH:MM:SS"
                          className="w-full rounded-lg border border-slate-200 px-3 py-2"
                        />
                      </label>
                      <label className="space-y-1">
                        <span className="text-[11px] font-bold text-slate-500">종료일</span>
                        <input
                          value={draft.ends_at}
                          onChange={(e) => patchDraft(row.en_id, { ends_at: e.target.value })}
                          placeholder="YYYY-MM-DD HH:MM:SS"
                          className="w-full rounded-lg border border-slate-200 px-3 py-2"
                        />
                      </label>
                      <label className="space-y-1 sm:col-span-2">
                        <span className="text-[11px] font-bold text-slate-500">관리 메모</span>
                        <input
                          value={draft.admin_memo}
                          onChange={(e) => patchDraft(row.en_id, { admin_memo: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 px-3 py-2"
                        />
                      </label>
                      <p className="sm:col-span-2 text-[11px] text-slate-500">
                        연락처 {row.phone || '-'} · 이메일 {row.email || '-'}
                        {row.kakao_active_sent_at ? ` · 카카오 발송 ${row.kakao_active_sent_at}` : ''}
                      </p>
                    </div>

                    <div className="px-4 pb-4 flex flex-wrap gap-2">
                      {canApprove ? (
                        <button
                          type="button"
                          disabled={saving}
                          onClick={() => void saveRow(row.en_id, true)}
                          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-xs font-bold px-4 py-2.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          승인
                        </button>
                      ) : null}
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => void saveRow(row.en_id, false)}
                        className="inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white text-xs font-bold px-4 py-2.5"
                      >
                        <Shield className="w-4 h-4" />
                        {saving ? '저장 중…' : '저장'}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {totalPage > 1 ? (
            <div className="flex items-center justify-center gap-3 text-sm">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-40"
              >
                이전
              </button>
              <span className="text-slate-500">
                {page} / {totalPage}
              </span>
              <button
                type="button"
                disabled={page >= totalPage}
                onClick={() => setPage((p) => Math.min(totalPage, p + 1))}
                className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-40"
              >
                다음
              </button>
            </div>
          ) : null}

          <div className="pt-4 border-t border-slate-100">
            <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">바로가기</p>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed flex flex-wrap items-center gap-x-2 gap-y-1">
              <Link to="/education/classroom" className="font-semibold text-blue-600 hover:underline">
                강의실
              </Link>
              <span className="text-slate-300">·</span>
              <Link to="/education/contract" className="font-semibold text-blue-600 hover:underline">
                수강 계약서
              </Link>
              <span className="text-slate-300">·</span>
              <Link to="/education" className="font-semibold text-blue-600 hover:underline">
                교육 안내
              </Link>
              <span className="text-slate-300">·</span>
              <a
                href="https://onoff.icrm.co.kr/seo-system-300/"
                className="font-semibold text-blue-600 hover:underline"
              >
                교육 플랫폼
              </a>
              <span className="text-slate-300">·</span>
              <Link to={AUTH_ROUTES.account} className="font-semibold text-blue-600 hover:underline">
                내 계정
              </Link>
              <span className="text-slate-300">·</span>
              <Link
                to={AUTH_ROUTES.accountNotifications}
                className="font-semibold text-blue-600 hover:underline"
              >
                알림 설정
              </Link>
            </p>
          </div>
        </div>
      )}
    </AuthShell>
  );
}
