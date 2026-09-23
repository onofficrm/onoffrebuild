import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { ApiRequestError } from '../../services/apiClient';
import {
  getContract,
  saveDraft,
  sign,
  type ContractFormFields,
  type ContractViewPayload,
} from '../../services/contractService';
import { ContractProcessGuide } from './ContractProcessGuide';
import { SignatureCanvas, type SignatureCanvasRef } from './SignatureCanvas';
import { ContractDocumentViewer } from './ContractDocumentViewer';

const emptyAgreements = {
  readAll: false,
  personalUse: false,
  noRedistribute: false,
  electronic: false,
};

const AGREEMENT_ITEMS: { key: keyof typeof emptyAgreements; label: string }[] = [
  { key: 'readAll', label: '서비스 계약 내용(범위·기간·이용 조건)을 모두 확인했습니다.' },
  { key: 'personalUse', label: '의뢰 산출물·리포트의 무단 재판매·양도를 하지 않습니다.' },
  { key: 'noRedistribute', label: '제공된 기획·디자인·소스의 무단 복제·배포를 하지 않습니다.' },
  { key: 'electronic', label: '전자서명이 수기 서명과 동일한 효력을 갖는 것에 동의합니다.' },
];

function fieldClass() {
  return 'w-full px-3 py-2.5 text-sm rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/50';
}

function labelClass() {
  return 'block text-xs font-bold text-slate-300 mb-1.5';
}

type ContractWizardViewProps = {
  onSigned?: () => void;
};

export const ContractWizardView: React.FC<ContractWizardViewProps> = ({ onSigned }) => {
  const signatureRef = useRef<SignatureCanvasRef>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [payload, setPayload] = useState<ContractViewPayload | null>(null);
  const [form, setForm] = useState<ContractFormFields>({
    companyName: '',
    representativeName: '',
    businessNumber: '',
    companyAddress: '',
    companyPhone: '',
    signerName: '',
    signerPosition: '',
    signerPhone: '',
    signerEmail: '',
    serviceScope: '',
    amount: '',
    startDate: '',
    endDate: '',
    negotiatedTerms: '',
    specialClauses: '',
    agreements: { ...emptyAgreements },
  });

  const applyPayload = useCallback((data: ContractViewPayload) => {
    setPayload(data);
    const f = data.form || {};
    const pkg = data.package;
    setForm((prev) => ({
      ...prev,
      companyName: f.companyName || prev.companyName,
      representativeName: f.representativeName || prev.representativeName,
      businessNumber: f.businessNumber || prev.businessNumber,
      companyAddress: f.companyAddress || prev.companyAddress,
      companyPhone: f.companyPhone || prev.companyPhone,
      signerName: f.signerName || prev.signerName,
      signerPosition: f.signerPosition || prev.signerPosition,
      signerPhone: f.signerPhone || prev.signerPhone,
      signerEmail: f.signerEmail || prev.signerEmail,
      serviceScope: f.serviceScope || pkg?.serviceScope || prev.serviceScope,
      amount: f.amount || pkg?.amount || prev.amount,
      startDate: f.startDate || prev.startDate,
      endDate: f.endDate || prev.endDate,
      negotiatedTerms: f.negotiatedTerms || prev.negotiatedTerms,
      specialClauses: f.specialClauses || prev.specialClauses,
      agreements: {
        readAll: Boolean(f.agreements?.readAll),
        personalUse: Boolean(f.agreements?.personalUse),
        noRedistribute: Boolean(f.agreements?.noRedistribute),
        electronic: Boolean(f.agreements?.electronic),
      },
      step: typeof f.step === 'number' ? f.step : prev.step,
    }));
    if (typeof f.step === 'number' && f.step >= 1 && f.step <= 4) {
      setStep(f.step);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    getContract()
      .then((data) => {
        if (cancelled) return;
        applyPayload(data);
        if (data.isRejected && data.rejectionReason) {
          setError(`반려 사유: ${data.rejectionReason}`);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof ApiRequestError ? err.message : '계약 정보를 불러오지 못했습니다.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [applyPayload]);

  const patch = (partial: Partial<ContractFormFields>) => {
    setForm((prev) => ({ ...prev, ...partial }));
  };

  const persistStep = async (nextStep: number) => {
    setSaving(true);
    setError('');
    try {
      await saveDraft({ ...form, step: nextStep });
      setStep(nextStep);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : '임시 저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!form.companyName.trim() || !form.representativeName.trim()) {
        setError('상호와 대표자명을 입력해 주세요.');
        return;
      }
      void persistStep(2);
      return;
    }
    if (step === 2) {
      void persistStep(3);
      return;
    }
    if (step === 3) {
      if (AGREEMENT_ITEMS.some((item) => !form.agreements[item.key])) {
        setError('필수 약관에 모두 동의해 주세요.');
        return;
      }
      void persistStep(4);
    }
  };

  const handleSign = async () => {
    setError('');
    if (!form.signerName.trim() || !form.signerPhone.trim()) {
      setError('서명자 이름과 연락처를 입력해 주세요.');
      return;
    }
    const signatureData = signatureRef.current?.getDataURL();
    if (!signatureData) {
      setError('서명을 입력해 주세요.');
      return;
    }
    setSaving(true);
    try {
      await saveDraft({ ...form, step: 4 });
      await sign({ ...form, step: 4 }, signatureData);
      onSigned?.();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : '계약 제출에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-10 text-center text-slate-400">
        <Loader2 className="w-5 h-5 animate-spin inline-block mr-2" />
        계약서를 불러오는 중…
      </div>
    );
  }

  if (payload && payload.canWrite === false && !payload.access?.requires) {
    return (
      <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-8 text-center text-sm text-slate-400">
        현재 작성할 수 있는 계약이 없습니다.
      </div>
    );
  }

  const pkg = payload?.package;

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900/90 overflow-hidden">
      <div className="px-5 sm:px-8 py-6 border-b border-slate-700/80">
        <p className="text-[10px] font-bold tracking-widest text-cyan-400 uppercase">Service Contract</p>
        <h1 className="mt-1 text-xl sm:text-2xl font-bold text-white">서비스 계약서 체결</h1>
        <p className="mt-2 text-sm text-slate-400 [word-break:keep-all]">
          입금 확인 후 아래 정보를 입력하고 전자서명을 완료해 주세요.
        </p>
      </div>

      <div className="px-5 sm:px-8 py-6">
        <ContractProcessGuide currentStep={step} />
        {error ? (
          <div className="mb-4 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        ) : null}

        {step === 1 && (
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={labelClass()}>상호 (회사명) *</label>
              <input className={fieldClass()} value={form.companyName} onChange={(e) => patch({ companyName: e.target.value })} />
            </div>
            <div>
              <label className={labelClass()}>대표자명 *</label>
              <input
                className={fieldClass()}
                value={form.representativeName}
                onChange={(e) => patch({ representativeName: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass()}>사업자등록번호</label>
              <input className={fieldClass()} value={form.businessNumber} onChange={(e) => patch({ businessNumber: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass()}>사업장 주소</label>
              <input className={fieldClass()} value={form.companyAddress} onChange={(e) => patch({ companyAddress: e.target.value })} />
            </div>
            <div>
              <label className={labelClass()}>대표 연락처</label>
              <input className={fieldClass()} value={form.companyPhone} onChange={(e) => patch({ companyPhone: e.target.value })} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            {pkg?.title ? (
              <p className="text-xs text-slate-400">
                패키지: <span className="text-slate-200 font-semibold">{pkg.title}</span>
              </p>
            ) : null}
            <div>
              <label className={labelClass()}>서비스 범위</label>
              <textarea
                className={`${fieldClass()} min-h-[100px]`}
                value={form.serviceScope}
                readOnly={Boolean(pkg?.serviceScope && !form.serviceScope)}
                onChange={(e) => patch({ serviceScope: e.target.value })}
              />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className={labelClass()}>계약 금액</label>
                <input className={fieldClass()} value={form.amount} onChange={(e) => patch({ amount: e.target.value })} />
              </div>
              <div>
                <label className={labelClass()}>시작일</label>
                <input type="date" className={fieldClass()} value={form.startDate} onChange={(e) => patch({ startDate: e.target.value })} />
              </div>
              <div>
                <label className={labelClass()}>종료일</label>
                <input type="date" className={fieldClass()} value={form.endDate} onChange={(e) => patch({ endDate: e.target.value })} />
              </div>
            </div>
            <div>
              <label className={labelClass()}>협의 조건</label>
              <textarea className={`${fieldClass()} min-h-[80px]`} value={form.negotiatedTerms} onChange={(e) => patch({ negotiatedTerms: e.target.value })} />
            </div>
            <div>
              <label className={labelClass()}>특약 사항</label>
              <textarea className={`${fieldClass()} min-h-[80px]`} value={form.specialClauses} onChange={(e) => patch({ specialClauses: e.target.value })} />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            {payload?.contractHtml ? (
              <div className="mb-4 rounded-xl border border-slate-700 overflow-hidden">
                <ContractDocumentViewer html={payload.contractHtml} />
              </div>
            ) : null}
            {AGREEMENT_ITEMS.map((item) => (
              <label
                key={item.key}
                className="flex items-start gap-3 rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 cursor-pointer hover:border-slate-600"
              >
                <input
                  type="checkbox"
                  checked={form.agreements[item.key]}
                  onChange={(e) =>
                    patch({
                      agreements: { ...form.agreements, [item.key]: e.target.checked },
                    })
                  }
                  className="mt-0.5 rounded border-slate-600 text-cyan-500 focus:ring-cyan-500/40"
                />
                <span className="text-sm text-slate-300 [word-break:keep-all]">{item.label}</span>
              </label>
            ))}
          </div>
        )}

        {step === 4 && (
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass()}>서명자 성명 *</label>
              <input className={fieldClass()} value={form.signerName} onChange={(e) => patch({ signerName: e.target.value })} />
            </div>
            <div>
              <label className={labelClass()}>직책</label>
              <input className={fieldClass()} value={form.signerPosition} onChange={(e) => patch({ signerPosition: e.target.value })} />
            </div>
            <div>
              <label className={labelClass()}>연락처 *</label>
              <input className={fieldClass()} value={form.signerPhone} onChange={(e) => patch({ signerPhone: e.target.value })} />
            </div>
            <div>
              <label className={labelClass()}>이메일</label>
              <input type="email" className={fieldClass()} value={form.signerEmail} onChange={(e) => patch({ signerEmail: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <SignatureCanvas ref={signatureRef} disabled={saving} />
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-700/80">
          <button
            type="button"
            disabled={step <= 1 || saving}
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-400 hover:text-white disabled:opacity-40"
          >
            이전
          </button>
          {step < 4 ? (
            <button
              type="button"
              disabled={saving}
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white text-sm font-bold disabled:opacity-60"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              다음 단계
            </button>
          ) : (
            <button
              type="button"
              disabled={saving}
              onClick={() => void handleSign()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold disabled:opacity-60"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              서명하고 제출
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
