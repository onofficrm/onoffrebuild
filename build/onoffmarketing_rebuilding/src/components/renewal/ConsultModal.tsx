import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  FileText,
} from 'lucide-react';
import { SERVICE_PLATFORMS } from '../../config/services';
import {
  CONSULTATION_CONFIG,
  requiresInAppSignature,
  resolveContractMode,
  resolveContractPackage,
  type ContractPackage,
} from '../../config/consultation';
import { trackEvent } from '../../utils/analytics';
import { submitInquiryToBoard } from '../../lib/submitInquiry';
import { SignaturePad, type SignaturePadRef } from './SignaturePad';
import { authApi } from '../../api/authApi';

interface ConsultModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopics?: string[];
  initialMessage?: string;
  presetLabel?: string;
  contractEnabled?: boolean;
}

type SiteStatus = 'has_site' | 'no_site';
type FormStep = 1 | 2;

function usableContact(value: string | undefined): string {
  const text = (value || '').trim();
  if (!text || text.includes('*')) return '';
  return text;
}

function emptyForm(initialTopics?: string[], initialMessage?: string) {
  return {
    siteStatus: 'has_site' as SiteStatus,
    websiteUrl: '',
    selectedTopics: initialTopics?.length ? [...initialTopics] : ([] as string[]),
    phone: '',
    email: '',
    name: '',
    message: initialMessage?.trim() || '',
    privacyAgreed: false,
    termsAgreed: false,
  };
}

export const ConsultModal: React.FC<ConsultModalProps> = ({
  isOpen,
  onClose,
  initialTopics,
  initialMessage,
  presetLabel,
  contractEnabled = false,
}) => {
  const [step, setStep] = useState<FormStep>(1);
  const [form, setForm] = useState(() => emptyForm(initialTopics, initialMessage));
  const [hasSignature, setHasSignature] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isPreviewWalkthrough, setIsPreviewWalkthrough] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [resolvedPackage, setResolvedPackage] = useState<ContractPackage | null>(null);
  const [contractOpen, setContractOpen] = useState(false);
  const [contractLoading, setContractLoading] = useState(false);
  const [contractError, setContractError] = useState<string | null>(null);
  const [contractDoc, setContractDoc] = useState<{ subject: string; html: string } | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const signatureRef = useRef<SignaturePadRef>(null);
  const contractOpenRef = useRef(false);
  contractOpenRef.current = contractOpen;

  useEffect(() => {
    if (!isOpen) return;

    setStep(1);
    setForm(emptyForm(initialTopics, initialMessage));
    setHasSignature(false);
    setIsSubmitting(false);
    setSubmitSuccess(false);
    setIsPreviewWalkthrough(false);
    setSubmitError(null);
    setResolvedPackage(null);
    setContractOpen(false);

    trackEvent('consult_modal_open');

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (contractOpenRef.current) {
          setContractOpen(false);
          return;
        }
        onClose();
        return;
      }

      if (e.key === 'Tab' && modalRef.current) {
        const rawElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, a[href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        const focusable = (Array.from(rawElements) as HTMLElement[]).filter(
          (el) => !el.hasAttribute('disabled') && el.offsetParent !== null
        );

        if (focusable.length === 0) return;

        const firstEl = focusable[0];
        const lastEl = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstEl) {
            e.preventDefault();
            lastEl.focus();
          }
        } else if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    const closeBtn = modalRef.current?.querySelector<HTMLElement>('#modal-close-button');
    closeBtn?.focus();

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [isOpen, onClose, initialTopics, initialMessage]);

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    (async () => {
      const session = await authApi.getSession().catch(() => null);
      if (cancelled || !session?.loggedIn) return;
      let name = (session.mbName || '').trim();
      let email = usableContact(session.mbEmail);
      let phone = usableContact(session.mbPhone);
      const profileResult = await authApi.getProfile().catch(() => null);
      if (profileResult?.ok) {
        const profile = profileResult.data.profile;
        name = (profile.mbName || name).trim();
        email = usableContact(profile.email) || email;
        phone = usableContact(profile.phone) || phone;
      }
      if (cancelled) return;
      setForm((prev) => ({
        ...prev,
        name: prev.name || name,
        email: prev.email || email,
        phone: prev.phone || phone,
      }));
    })();
    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!contractOpen || contractDoc) return;
    let cancelled = false;
    setContractLoading(true);
    setContractError(null);
    fetch('/api/edu-contract.php', { headers: { Accept: 'application/json' } })
      .then((response) => response.json())
      .then((payload: { ok?: boolean; message?: string; data?: { subject?: string; html?: string } }) => {
        if (cancelled) return;
        if (!payload?.ok || !payload.data?.html) {
          setContractError(payload?.message || '강의 표준계약서를 불러오지 못했습니다.');
          return;
        }
        setContractDoc({
          subject: payload.data.subject || '강의 표준계약서',
          html: payload.data.html,
        });
      })
      .catch(() => {
        if (!cancelled) setContractError('강의 표준계약서를 불러오지 못했습니다.');
      })
      .finally(() => {
        if (!cancelled) setContractLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [contractOpen, contractDoc]);

  useEffect(() => {
    if (!isOpen || submitSuccess) return;
    stepHeadingRef.current?.focus();
  }, [step, isOpen, submitSuccess]);

  if (!isOpen) return null;

  const isLive = CONSULTATION_CONFIG.mode === 'LIVE';
  const isLecture =
    Boolean(presetLabel) ||
    (initialTopics ?? []).some((topic) => topic.toUpperCase() === 'EDUCATION');
  const contractPkg = resolvedPackage ?? resolveContractPackage(form.selectedTopics);
  const contractMode = resolveContractMode();
  const showContractStep = contractEnabled && contractMode !== 'OFF';
  const needSignature = contractEnabled && requiresInAppSignature();

  const canSubmitStep2 =
    form.privacyAgreed &&
    form.name.trim().length > 0 &&
    form.phone.trim().length > 0 &&
    (!showContractStep || form.termsAgreed) &&
    (!needSignature || hasSignature);

  const finishPreviewWalkthrough = () => {
    if (!canSubmitStep2) return;
    setIsPreviewWalkthrough(true);
    setSubmitSuccess(true);
    trackEvent('consult_contract_ready', {
      category: 'consultation',
      label: `preview:${contractPkg.id}`,
    });
  };

  const canGoStep2 =
    form.privacyAgreed && form.name.trim().length > 0 && form.phone.trim().length > 0;

  const handleGoStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canGoStep2) return;
    const pkg = resolveContractPackage(form.selectedTopics);
    setResolvedPackage(pkg);
    setHasSignature(false);
    setSubmitError(null);
    trackEvent('consult_step2_view', {
      category: 'consultation',
      label: pkg.id,
    });
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmitStep2) return;
    if (!isLive) return;

    const signatureDataUrl = needSignature
      ? signatureRef.current?.toDataURL() || null
      : undefined;
    if (needSignature && !signatureDataUrl) {
      setSubmitError('서명을 입력해 주세요.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    trackEvent('consult_submit', {
      category: 'consultation',
      label: contractPkg.id,
    });

    const result = await submitInquiryToBoard({
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || undefined,
      message: form.message.trim() || '서비스 신청·상담 요청',
      privacyAgree: form.privacyAgreed,
      websiteUrl: isLecture || form.siteStatus !== 'has_site' ? undefined : form.websiteUrl,
      topics: form.selectedTopics,
      contractPackageId: showContractStep ? contractPkg.id : undefined,
      contractPackageTitle: showContractStep ? contractPkg.title : undefined,
      contractScope: showContractStep ? contractPkg.scope : undefined,
      contractPeriod: showContractStep ? contractPkg.period : undefined,
      contractFeeNote: showContractStep ? contractPkg.feeNote : undefined,
      termsAgree: showContractStep ? form.termsAgreed : undefined,
      signatureDataUrl: signatureDataUrl || undefined,
    });

    if (result.success) {
      setSubmitSuccess(true);
      trackEvent('consult_contract_ready', {
        category: 'consultation',
        label: contractPkg.id,
      });
    } else {
      setSubmitError(result.message);
    }
    setIsSubmitting(false);
  };

  const stepLabel =
    step === 1
      ? '1. 신청 정보'
      : needSignature
        ? '2. 계약 확인·서명'
        : '2. 계약·약관 확인';

  return (
    <div
      id="consult-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="consult-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-in fade-in"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        id="consult-modal-container"
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-slate-950 text-white p-5 sm:p-6 relative shrink-0">
          <button
            id="modal-close-button"
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-sm bg-blue-600 text-white tracking-wider uppercase font-mono">
              SERVICE APPLICATION
            </span>
            {isPreviewWalkthrough && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-sm bg-amber-500/90 text-slate-950 tracking-wider uppercase">
                PREVIEW · 미접수
              </span>
            )}
            {!submitSuccess && (
              <span className="text-[11px] font-medium text-slate-400" aria-live="polite">
                {stepLabel}
              </span>
            )}
          </div>

          <h2 id="consult-modal-title" className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            {submitSuccess
              ? isPreviewWalkthrough
                ? '완료 화면 미리보기'
                : showContractStep
                  ? '신청·서명이 접수되었습니다'
                  : '상담 요청이 접수되었습니다'
              : step === 1
                ? '서비스 신청서를 작성해 주세요'
                : showContractStep
                  ? '계약 안내를 확인하고 서명해 주세요'
                  : '신청 내용을 확인해 주세요'}
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 leading-relaxed">
            {submitSuccess
              ? isPreviewWalkthrough
                ? '실제 게시판 접수는 되지 않았습니다. LIVE 전환 후 동일 흐름으로 접수됩니다.'
                : '남겨주신 연락처로 안내드리겠습니다.'
              : step === 1
                ? '기본 정보와 관심 영역을 입력한 뒤, 다음 단계에서 내용을 확인합니다.'
                : showContractStep
                  ? '범위·기간·비용을 확인한 뒤 약관에 동의하고 직접 서명합니다.'
                  : '입력한 내용을 확인한 뒤 상담 요청을 완료합니다.'}
          </p>

          {!submitSuccess && (
            <div
              className="mt-4 flex items-center gap-2"
              role="group"
              aria-label={`신청 단계 ${step} / 2`}
            >
              <div className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-blue-500' : 'bg-slate-700'}`} />
              <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-blue-500' : 'bg-slate-700'}`} />
            </div>
          )}
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-slate-800">
          {submitSuccess ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3
                  ref={stepHeadingRef}
                  tabIndex={-1}
                  className="text-lg font-bold text-slate-900 outline-hidden"
                >
                  {contractPkg.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                  {isPreviewWalkthrough ? (
                    <>
                      {showContractStep ? '서명 포함' : '상담 접수'} 완료 화면 미리보기입니다. 연락처 예시:{' '}
                      <span className="font-semibold text-slate-800">{form.phone}</span>
                    </>
                  ) : (
                    <>
                      {showContractStep ? '서명과 함께 신청이' : '상담 요청이'} 접수되었습니다. 연락처(
                      <span className="font-semibold text-slate-800">{form.phone}</span>
                      )로 안내드리겠습니다.
                    </>
                  )}
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                <a
                  id="consult-success-platform-btn"
                  href="/education/classroom"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
                >
                  <span>강의 플랫폼 바로가기</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  id="consult-success-close-btn"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-300 text-slate-700 text-xs sm:text-sm font-medium hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  닫기
                </button>
              </div>
            </div>
          ) : step === 1 ? (
            <form onSubmit={handleGoStep2} className="space-y-4">
              <h3 ref={stepHeadingRef} tabIndex={-1} className="sr-only outline-hidden">
                1단계 신청 정보
              </h3>

              {!isLecture && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  현재 홈페이지 상태 <span className="text-blue-600">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, siteStatus: 'has_site' }))}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border text-center transition-all cursor-pointer ${
                      form.siteStatus === 'has_site'
                        ? 'bg-blue-50 border-blue-600 text-blue-700'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    홈페이지 있음 (운영 중)
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, siteStatus: 'no_site' }))}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border text-center transition-all cursor-pointer ${
                      form.siteStatus === 'no_site'
                        ? 'bg-blue-50 border-blue-600 text-blue-700'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    홈페이지 없음 (신규 준비)
                  </button>
                </div>
              </div>
              )}

              {!isLecture && form.siteStatus === 'has_site' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    웹사이트 URL (선택)
                  </label>
                  <input
                    id="modal-input-url"
                    type="text"
                    placeholder="https://example.com"
                    value={form.websiteUrl}
                    onChange={(e) => setForm((p) => ({ ...p, websiteUrl: e.target.value }))}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden transition-all bg-white text-slate-900"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  이름 / 담당자명 <span className="text-blue-600">*</span>
                </label>
                <input
                  id="modal-input-name"
                  type="text"
                  required
                  placeholder="홍길동"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden transition-all bg-white text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    전화번호 <span className="text-blue-600">*</span>
                  </label>
                  <input
                    id="modal-input-phone"
                    type="tel"
                    required
                    placeholder="010-0000-0000"
                    value={form.phone}
                    onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden transition-all bg-white text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    이메일 (선택)
                  </label>
                  <input
                    id="modal-input-email"
                    type="email"
                    placeholder="email@example.com"
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden transition-all bg-white text-slate-900"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">문의 내용</label>
                  {presetLabel && (
                    <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-100 rounded-full px-2 py-0.5">
                      {presetLabel}
                    </span>
                  )}
                </div>
                {presetLabel && (
                  <p className="text-[11px] text-slate-500 mb-1.5">
                    선택한 과정 정보가 자동 입력되었습니다. 필요한 내용만 수정해 주세요.
                  </p>
                )}
                <textarea
                  id="modal-input-message"
                  rows={3}
                  placeholder="현재 사이트 상황이나 궁금한 내용을 간단히 입력해 주세요."
                  value={form.message}
                  onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden transition-all bg-white text-slate-900 resize-none"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-center justify-between text-xs text-slate-600 cursor-pointer gap-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.privacyAgreed}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, privacyAgreed: e.target.checked }))
                      }
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      required
                    />
                    <span>개인정보 수집 및 이용(상담·신청 목적)에 동의합니다.</span>
                  </div>
                  {CONSULTATION_CONFIG.privacyPolicyUrl && (
                    <a
                      href={CONSULTATION_CONFIG.privacyPolicyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-[11px] font-medium shrink-0"
                    >
                      [자세히 보기]
                    </a>
                  )}
                </label>
              </div>

              <div className="pt-2 space-y-3">
                <button
                  id="modal-next-step-button"
                  type="submit"
                  disabled={!canGoStep2}
                  className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-98 cursor-pointer disabled:cursor-not-allowed"
                >
                  <span>{showContractStep ? '다음: 계약 확인·서명' : '다음: 신청 내용 확인'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  불필요한 영업 전화나 스팸을 보내지 않습니다.
                </span>
                {!isLecture && (
                <a
                  id="modal-direct-geo-shortcut"
                  href={SERVICE_PLATFORMS.geo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  직접 GEO 분석 →
                </a>
                )}
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 ref={stepHeadingRef} tabIndex={-1} className="sr-only outline-hidden">
                2단계 계약 확인 및 서명
              </h3>

              {submitError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs space-y-1.5">
                <p className="font-bold text-slate-800 mb-2">신청자 정보</p>
                <p>
                  <span className="text-slate-500">담당자</span>{' '}
                  <span className="font-medium text-slate-900">{form.name}</span>
                </p>
                <p>
                  <span className="text-slate-500">연락처</span>{' '}
                  <span className="font-medium text-slate-900">{form.phone}</span>
                  {form.email ? ` · ${form.email}` : ''}
                </p>
                {!isLecture && form.siteStatus === 'has_site' && form.websiteUrl.trim() && (
                  <p>
                    <span className="text-slate-500">웹사이트</span>{' '}
                    <span className="font-medium text-slate-900 break-all">
                      {form.websiteUrl.trim()}
                    </span>
                  </p>
                )}
              </div>

              <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4 space-y-3">
                <div className="flex items-start gap-2">
                  <FileText className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[11px] font-bold text-blue-700 uppercase tracking-wide">
                      {showContractStep ? '신청 계약 요약' : '상담 신청 요약'}
                    </p>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">{contractPkg.title}</p>
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-bold text-slate-600 mb-1">업무 범위</p>
                  <ul className="space-y-1">
                    {contractPkg.scope.map((line) => (
                      <li
                        key={line}
                        className="text-xs text-slate-700 flex gap-1.5 leading-relaxed"
                      >
                        <span className="text-blue-500 shrink-0">·</span>
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-blue-100">
                  <div>
                    <p className="text-[11px] font-bold text-slate-600">계약 기간</p>
                    <p className="text-xs text-slate-800 mt-0.5">{contractPkg.period}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-600">비용 안내</p>
                    <p className="text-xs text-slate-800 mt-0.5">{contractPkg.feeNote}</p>
                  </div>
                </div>
              </div>

              {showContractStep && (
                <div className="pt-1 space-y-2">
                  <label className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.termsAgreed}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, termsAgreed: e.target.checked }))
                      }
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 mt-0.5"
                      required
                    />
                    <span>
                      위 신청 요약과{' '}
                      {isLecture ? (
                        <>
                          <a
                            href={CONSULTATION_CONFIG.termsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline font-medium"
                          >
                            이용약관
                          </a>
                          {' '}및{' '}
                          <button
                            type="button"
                            className="text-blue-600 hover:underline font-medium cursor-pointer"
                            onClick={() => setContractOpen(true)}
                          >
                            강의 표준계약서
                          </button>
                        </>
                      ) : (
                        <a
                          href={CONSULTATION_CONFIG.termsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline font-medium"
                        >
                          이용약관·표준계약 안내
                        </a>
                      )}
                      를 확인했으며, 아래 서명으로 신청 의사를 확인합니다. 세부 금액·일정은
                      상담 후 확정될 수 있습니다.
                    </span>
                  </label>
                </div>
              )}

              {needSignature && (
                <SignaturePad
                  id="consult-signature-pad"
                  ref={signatureRef}
                  onValidityChange={setHasSignature}
                  disabled={isSubmitting}
                />
              )}

              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <button
                  id="modal-back-step-button"
                  type="button"
                  onClick={() => {
                    setSubmitError(null);
                    setHasSignature(false);
                    setStep(1);
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl border border-slate-300 text-slate-700 text-xs sm:text-sm font-medium hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>이전</span>
                </button>

                {isLive ? (
                  <button
                    id="modal-submit-button"
                    type="submit"
                    disabled={!canSubmitStep2 || isSubmitting}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-98 cursor-pointer disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>신청 접수 중...</span>
                      </>
                    ) : (
                      <span>{showContractStep ? '서명하고 신청 완료' : '상담 요청 완료'}</span>
                    )}
                  </button>
                ) : (
                  <div className="flex-1 space-y-2.5">
                    <button
                      id="modal-preview-complete-button"
                      type="button"
                      disabled={!canSubmitStep2}
                      onClick={finishPreviewWalkthrough}
                      className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:cursor-not-allowed"
                    >
                      <span>
                        {showContractStep ? '서명 완료 미리보기' : '상담 완료 미리보기'} (미접수)
                      </span>
                    </button>
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-center space-y-2">
                      <p className="text-xs text-amber-900/80">
                        PREVIEW 모드입니다. {showContractStep ? '서명은 화면에서만 확인되며, ' : ''}
                        LIVE 전환 후에만 서버에 저장됩니다.
                      </p>
                      <a
                        id="modal-preview-direct-geo-btn"
                        href={SERVICE_PLATFORMS.geo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      >
                        <span>내 사이트 GEO 분석하기</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
      {contractOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-6 bg-slate-950/75"
          role="presentation"
          onClick={() => setContractOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edu-contract-title"
            className="w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl bg-white shadow-2xl flex flex-col"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-slate-200">
              <div>
                <p className="text-[11px] font-bold tracking-wide text-blue-600">LECTURE CONTRACT</p>
                <h3 id="edu-contract-title" className="text-base font-bold text-slate-900 mt-0.5">
                  {contractDoc?.subject || '강의 표준계약서'}
                </h3>
              </div>
              <button
                type="button"
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
                aria-label="계약서 닫기"
                onClick={() => setContractOpen(false)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-y-auto px-5 py-4 text-sm text-slate-700 leading-relaxed [&_h2]:mt-4 [&_h2]:mb-1 [&_h2]:text-sm [&_h2]:font-bold [&_h2]:text-slate-900 [&_p]:mt-1 [&_ol]:mt-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:mt-1 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-0.5">
              {contractLoading && (
                <p className="flex items-center gap-2 text-slate-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  계약서를 불러오는 중입니다.
                </p>
              )}
              {contractError && <p className="text-red-600">{contractError}</p>}
              {contractDoc && (
                <div dangerouslySetInnerHTML={{ __html: contractDoc.html }} />
              )}
            </div>
            <div className="px-5 py-3 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold cursor-pointer"
                onClick={() => setContractOpen(false)}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
