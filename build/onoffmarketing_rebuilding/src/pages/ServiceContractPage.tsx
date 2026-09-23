import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, FileText, Loader2 } from 'lucide-react';
import {
  educationApi,
  type EducationContractAgreements,
  type EducationContractState,
} from '../api/educationApi';
import { SignaturePad, type SignaturePadRef } from '../components/renewal/SignaturePad';
import { buildLoginPath } from '../lib/brandedAuth';
import { SERVICE_COURSE_IDS, contractPathForCourse } from '../config/consultation';

type ServiceKind = 'education' | 'marketing' | 'combined';

const COURSE_BY_KIND: Record<ServiceKind, string> = {
  education: SERVICE_COURSE_IDS.education,
  marketing: SERVICE_COURSE_IDS.marketing,
  combined: SERVICE_COURSE_IDS.combined,
};

function agreementItemsFor(kind: ServiceKind): { key: keyof EducationContractAgreements; label: string }[] {
  if (kind === 'marketing') {
    return [
      { key: 'readAll', label: '마케팅 의뢰 계약 내용(범위·기간·이용 조건)을 모두 확인했습니다.' },
      { key: 'personalUse', label: '의뢰 산출물·리포트의 무단 재판매·양도를 하지 않습니다.' },
      { key: 'noRedistribute', label: '제공된 기획·디자인·소스의 무단 복제·배포를 하지 않습니다.' },
      { key: 'electronic', label: '전자서명이 수기 서명과 동일한 효력을 갖는 것에 동의합니다.' },
    ];
  }
  if (kind === 'combined') {
    return [
      { key: 'readAll', label: '수강·마케팅 통합 계약 내용(범위·기간·이용 조건)을 모두 확인했습니다.' },
      { key: 'personalUse', label: '수강권은 본인만 사용하며, 의뢰 산출물을 제3자에게 양도·공유하지 않습니다.' },
      { key: 'noRedistribute', label: '강의 자료·마케팅 산출물을 무단 복제·배포하지 않습니다.' },
      { key: 'electronic', label: '전자서명이 수기 서명과 동일한 효력을 갖는 것에 동의합니다.' },
    ];
  }
  return [
    { key: 'readAll', label: '수강 계약 내용(범위·기간·이용 조건)을 모두 확인했습니다.' },
    { key: 'personalUse', label: '수강권은 본인만 사용하며 제3자에게 양도·공유하지 않습니다.' },
    { key: 'noRedistribute', label: '강의 자료·클래스룸 콘텐츠를 무단 복제·배포하지 않습니다.' },
    { key: 'electronic', label: '전자서명이 수기 서명과 동일한 효력을 갖는 것에 동의합니다.' },
  ];
}

function copyFor(kind: ServiceKind) {
  if (kind === 'marketing') {
    return {
      badge: 'ONOFF Marketing',
      title: '마케팅 의뢰 계약서 작성',
      intro: '입금 확인(의뢰 권한)이 부여된 뒤, 계약서 작성과 전자서명을 완료하면 플랫폼이 열립니다.',
      doneTitle: '마케팅 의뢰 계약이 완료되었습니다',
      doneDesc: '이제 교육 플랫폼에서 프로젝트·주문을 이용할 수 있습니다.',
      empty: '관리자가 입금을 확인하고 의뢰 권한을 부여한 뒤에 계약서를 작성할 수 있습니다.',
      feeLabel: '비용',
    };
  }
  if (kind === 'combined') {
    return {
      badge: 'ONOFF Academy + Marketing',
      title: '수강·마케팅 통합 계약서 작성',
      intro: '입금 확인(권한 부여) 후 통합 계약서에 서명하면 강의실과 플랫폼이 열립니다.',
      doneTitle: '통합 계약이 완료되었습니다',
      doneDesc: '이제 강의실과 교육 플랫폼을 이용할 수 있습니다.',
      empty: '관리자가 입금을 확인하고 권한을 부여한 뒤에 계약서를 작성할 수 있습니다.',
      feeLabel: '수강료·의뢰비',
    };
  }
  return {
    badge: 'ONOFF Academy',
    title: '수강 계약서 작성',
    intro: '입금 확인(수강 권한)이 부여된 뒤, 계약서 작성과 전자서명을 완료하면 강의실이 열립니다.',
    doneTitle: '수강 계약이 완료되었습니다',
    doneDesc: '이제 강의실과 교육 플랫폼을 이용할 수 있습니다.',
    empty: '관리자가 입금을 확인하고 수강 권한을 부여한 뒤에 계약서를 작성할 수 있습니다.',
    feeLabel: '수강료',
  };
}

export default function ServiceContractPage({ kind = 'education' }: { kind?: ServiceKind }) {
  const navigate = useNavigate();
  const courseId = COURSE_BY_KIND[kind];
  const loginPath = contractPathForCourse(courseId);
  const agreementItems = useMemo(() => agreementItemsFor(kind), [kind]);
  const copy = useMemo(() => copyFor(kind), [kind]);
  const signatureRef = useRef<SignaturePadRef>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authRequired, setAuthRequired] = useState(false);
  const [state, setState] = useState<EducationContractState | null>(null);
  const [partyName, setPartyName] = useState('');
  const [partyPhone, setPartyPhone] = useState('');
  const [partyEmail, setPartyEmail] = useState('');
  const [agreements, setAgreements] = useState<EducationContractAgreements>({
    readAll: false,
    personalUse: false,
    noRedistribute: false,
    electronic: false,
  });
  const [hasSignature, setHasSignature] = useState(false);
  const [done, setDone] = useState(false);

  const applyState = useCallback((next: EducationContractState) => {
    setState(next);
    setPartyName(next.form.partyName || '');
    setPartyPhone(next.form.partyPhone || '');
    setPartyEmail(next.form.partyEmail || '');
    setAgreements({
      readAll: Boolean(next.form.agreements?.readAll),
      personalUse: Boolean(next.form.agreements?.personalUse),
      noRedistribute: Boolean(next.form.agreements?.noRedistribute),
      electronic: Boolean(next.form.agreements?.electronic),
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setAuthRequired(false);
    setDone(false);
    educationApi
      .getContract(courseId)
      .then((result) => {
        if (cancelled) return;
        if (result.ok === false) {
          if (result.status === 401) {
            setAuthRequired(true);
            setError('로그인이 필요합니다.');
            return;
          }
          setError(result.error);
          return;
        }
        applyState(result.data);
        if (result.data.isSigned && !result.data.requiresContract) {
          setDone(true);
        }
      })
      .catch(() => {
        if (!cancelled) setError('계약서 정보를 불러오지 못했습니다.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [applyState, courseId]);

  async function handleSign() {
    setError(null);
    if (!partyName.trim() || !partyPhone.trim()) {
      setError('계약 당사자 이름과 연락처를 입력해 주세요.');
      return;
    }
    if (agreementItems.some((item) => !agreements[item.key])) {
      setError('필수 약관에 모두 동의해 주세요.');
      return;
    }
    const signatureData = signatureRef.current?.toDataURL();
    if (!signatureData) {
      setError('서명을 입력해 주세요.');
      return;
    }

    setSaving(true);
    await educationApi.saveContractDraft({
      course_id: courseId,
      partyName: partyName.trim(),
      partyPhone: partyPhone.trim(),
      partyEmail: partyEmail.trim(),
      agreements,
    });
    const result = await educationApi.signContract({
      course_id: courseId,
      partyName: partyName.trim(),
      partyPhone: partyPhone.trim(),
      partyEmail: partyEmail.trim(),
      agreements,
      signatureData,
    });
    setSaving(false);
    if (result.ok === false) {
      setError(result.error);
      return;
    }
    setDone(true);
    applyState(result.data.contract);
  }

  const pkg = state?.package;

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-xs font-bold text-blue-600 tracking-wider uppercase">{copy.badge}</span>
          <h1 className="mt-2 text-3xl font-extrabold text-slate-950 tracking-tight">{copy.title}</h1>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">{copy.intro}</p>
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white border border-slate-200 p-8 text-center text-slate-500">
            <Loader2 className="w-5 h-5 animate-spin inline-block mr-2" />
            계약서 정보를 불러오는 중입니다…
          </div>
        ) : authRequired ? (
          <div className="rounded-2xl bg-white border border-slate-200 p-8 text-center">
            <p className="text-sm text-slate-600 mb-4">{error}</p>
            <Link
              to={buildLoginPath(loginPath)}
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-blue-600 text-white text-sm font-bold"
            >
              로그인하기
            </Link>
          </div>
        ) : done || (state && !state.requiresContract && state.isSigned) ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h2 className="mt-4 text-xl font-bold text-emerald-950">{copy.doneTitle}</h2>
            <p className="mt-2 text-sm text-emerald-800">{copy.doneDesc}</p>
            <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-center">
              <button
                type="button"
                onClick={() => navigate('/education/classroom')}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 text-white text-sm font-bold"
              >
                플랫폼 입장 <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="https://onoff.icrm.co.kr/seo-system-300/"
                className="inline-flex items-center justify-center px-5 py-3 rounded-xl border border-emerald-300 bg-white text-emerald-800 text-sm font-semibold"
              >
                교육 플랫폼 열기
              </a>
            </div>
          </div>
        ) : !state?.requiresContract ? (
          <div className="rounded-2xl bg-white border border-slate-200 p-8 text-center">
            <FileText className="w-10 h-10 text-slate-400 mx-auto" />
            <h2 className="mt-4 text-xl font-bold text-slate-950">작성할 계약이 없습니다</h2>
            <p className="mt-2 text-sm text-slate-600">{error || copy.empty}</p>
            <Link
              to="/education/classroom"
              className="mt-6 inline-flex items-center justify-center px-5 py-3 rounded-xl bg-blue-600 text-white text-sm font-bold"
            >
              상태 확인
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {error ? (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
            ) : null}

            <section className="rounded-2xl bg-white border border-slate-200 p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-950">{pkg?.title || copy.title}</h2>
                  <p className="text-xs text-slate-500 mt-1">버전 {pkg?.version}</p>
                </div>
              </div>
              <ul className="space-y-2">
                {(pkg?.scope || []).map((line) => (
                  <li key={line} className="text-sm text-slate-700 flex gap-2">
                    <span className="text-blue-600 font-bold">·</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                  <p className="text-[11px] font-bold text-slate-500">기간</p>
                  <p className="mt-1 text-slate-800">{pkg?.period}</p>
                </div>
                <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                  <p className="text-[11px] font-bold text-slate-500">{copy.feeLabel}</p>
                  <p className="mt-1 text-slate-800">{pkg?.feeNote}</p>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 p-4 space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">주요 조항</p>
                {(pkg?.clauses || []).map((clause) => (
                  <p key={clause} className="text-sm text-slate-700 leading-relaxed">
                    • {clause}
                  </p>
                ))}
              </div>
            </section>

            <section className="rounded-2xl bg-white border border-slate-200 p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-950">계약 당사자</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <label className="space-y-1 sm:col-span-2">
                  <span className="text-[11px] font-bold text-slate-500">이름 *</span>
                  <input
                    value={partyName}
                    onChange={(e) => setPartyName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                    placeholder="계약자 실명"
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-500">연락처 *</span>
                  <input
                    value={partyPhone}
                    onChange={(e) => setPartyPhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                    placeholder="010-0000-0000"
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-500">이메일</span>
                  <input
                    value={partyEmail}
                    onChange={(e) => setPartyEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                    placeholder="name@example.com"
                  />
                </label>
              </div>
            </section>

            <section className="rounded-2xl bg-white border border-slate-200 p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-950">동의 및 서명</h3>
              <div className="space-y-2">
                {agreementItems.map((item) => (
                  <label
                    key={item.key}
                    className="flex items-start gap-3 rounded-xl border border-slate-200 px-3 py-3 text-sm text-slate-700 cursor-pointer hover:border-blue-300"
                  >
                    <input
                      type="checkbox"
                      checked={agreements[item.key]}
                      onChange={(e) =>
                        setAgreements((prev) => ({ ...prev, [item.key]: e.target.checked }))
                      }
                      className="mt-0.5"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
              <SignaturePad
                ref={signatureRef}
                onValidityChange={setHasSignature}
                disabled={saving}
              />
              <button
                type="button"
                disabled={saving || !hasSignature}
                onClick={() => void handleSign()}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-bold py-3"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    제출 중…
                  </>
                ) : (
                  <>
                    계약서 서명 · 제출
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

export function EducationContractPage() {
  return <ServiceContractPage kind="education" />;
}

export function MarketingContractPage() {
  return <ServiceContractPage kind="marketing" />;
}

export function CombinedContractPage() {
  return <ServiceContractPage kind="combined" />;
}
