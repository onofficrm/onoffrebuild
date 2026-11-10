import React, { useCallback, useEffect, useState } from 'react';
import {
  MessageSquare,
  Paperclip,
  Send,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Project } from '../../types';
import { ApiRequestError } from '../../services/apiClient';
import { websiteImagePreviewUrl } from '../../services/websiteOrderService';
import { RevisionStatusRail } from './RevisionRequestComposer';
import { RevisionAnnotateWorkspace } from './RevisionAnnotateWorkspace';
import { RevisionMarkPreview } from './RevisionMarkPreview';
import { RevisionInfoReplySlots } from './RevisionInfoReplySlots';
import { RevisionResultCompare } from './RevisionResultCompare';
import type { WebsitePresence } from '../../utils/websitePresence';
import {
  ApiRevisionTicket,
  RevisionQuota,
  RevisionWallet,
  commentRevision,
  confirmRevision,
  createRevision,
  listRevisions,
  payRevisionQuote,
  replyRevisionInfo,
  uploadRevisionFile,
  getRevision,
} from '../../services/revisionService';

type Props = {
  projectId: number | null;
  orderId?: number | null;
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onCreateProject: (input: { name: string; domain: string; niche: string }) => Promise<void>;
  onRegisterHomepage: () => void;
  focusTicketId?: number | null;
  detailOnly?: boolean;
  onCloseDetail?: () => void;
  presence?: WebsitePresence;
  previewUrl?: string;
};

const DEVICE_LABEL: Record<string, string> = {
  pc: 'PC',
  mobile: '모바일',
  both: 'PC·모바일',
};

function statusTone(status: string): 'completed' | 'in_progress' | 'pending' | 'needs_check' {
  if (status === 'completed') return 'completed';
  if (status === 'in_progress' || status === 'free_progress' || status === 'paid' || status === 'reviewing') {
    return 'in_progress';
  }
  if (status === 'need_info' || status === 'quote_pending' || status === 'feedback' || status === 'expired') {
    return 'needs_check';
  }
  return 'pending';
}

function customerCta(ticket: ApiRevisionTicket): string {
  if (ticket.customerProgress?.cta) return ticket.customerProgress.cta;
  if (ticket.status === 'feedback') return '확인';
  if (ticket.status === 'need_info') return '자료 보내기';
  if (ticket.status === 'quote_pending') return '결제하기';
  if (ticket.status === 'completed') return '완료';
  if (ticket.status === 'cancelled' || ticket.status === 'expired') return ticket.status === 'cancelled' ? '취소' : '만료';
  return ticket.customerProgress?.label || '접수';
}

function customerNeedsAction(ticket: ApiRevisionTicket): boolean {
  return ['feedback', 'need_info', 'quote_pending'].includes(ticket.status);
}

function RevisionDetailDrawer({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button type="button" className="absolute inset-0 bg-[#0F172A]/40" aria-label="닫기" onClick={onClose} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative flex h-full w-full max-w-xl flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-200"
      >
        <div className="flex items-center justify-between gap-3 border-b border-[#E2E8F0] px-5 py-4">
          <h2 className="truncate text-sm font-black text-[#0F172A]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
            aria-label="닫기"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
      </aside>
    </div>
  );
}

export const WebsiteRevisionPanel: React.FC<Props> = ({
  projectId,
  orderId,
  projects,
  onSelectProject,
  onCreateProject,
  onRegisterHomepage,
  focusTicketId = null,
  detailOnly = false,
  onCloseDetail,
  presence = 'building',
  previewUrl = '',
}) => {
  const [tickets, setTickets] = useState<ApiRevisionTicket[]>([]);
  const [quota, setQuota] = useState<RevisionQuota | null>(null);
  const [quoteEnabled, setQuoteEnabled] = useState(false);
  const [wallet, setWallet] = useState<RevisionWallet | null>(null);
  const [eligible, setEligible] = useState(false);
  const [resolvedOrderId, setResolvedOrderId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<ApiRevisionTicket | null>(null);
  const [busy, setBusy] = useState(false);
  const [pageUrl, setPageUrl] = useState('');
  const [commentBody, setCommentBody] = useState('');
  const [newName, setNewName] = useState('');
  const [newDomain, setNewDomain] = useState('');
  const [newNiche, setNewNiche] = useState('');
  const [creatingProject, setCreatingProject] = useState(false);

  const refresh = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    setError('');
    try {
      const data = await listRevisions(projectId);
      setTickets(data.tickets || []);
      setQuota(data.quota || null);
      setQuoteEnabled(Boolean(data.quoteEnabled));
      setWallet(data.wallet || null);
      setEligible(Boolean(data.eligible));
      setResolvedOrderId(data.orderId || orderId || 0);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : '수정 요청을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, [projectId, orderId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (!pageUrl.trim() && previewUrl.trim()) {
      setPageUrl(previewUrl.trim());
    }
  }, [previewUrl, pageUrl]);

  useEffect(() => {
    if (!focusTicketId) return;
    let cancelled = false;
    void getRevision(focusTicketId)
      .then((data) => {
        if (!cancelled) {
          setSelected(data.ticket);
          if (data.wallet) setWallet(data.wallet);
        }
      })
      .catch(() => {
        if (!cancelled) setError('수정 요청 상세를 불러오지 못했습니다.');
      });
    return () => {
      cancelled = true;
    };
  }, [focusTicketId]);

  const openDetail = async (ticket: ApiRevisionTicket) => {
    setSelected(ticket);
    setCommentBody('');
    try {
      const data = await getRevision(ticket.id);
      setSelected(data.ticket);
      if (data.wallet) setWallet(data.wallet);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : '상세를 불러오지 못했습니다.');
    }
  };

  const closeDrawer = useCallback(() => {
    setSelected(null);
    onCloseDetail?.();
  }, [onCloseDetail]);

  const handleComment = async () => {
    if (!selected || !commentBody.trim()) return;
    setBusy(true);
    try {
      const next = await commentRevision(selected.id, commentBody.trim());
      setSelected(next);
      setCommentBody('');
      await refresh();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : '댓글 저장에 실패했습니다.');
    } finally {
      setBusy(false);
    }
  };

  const POINT_CHARGE_URL =
    '/api/auth.php?action=icrm-continue&to=' + encodeURIComponent('/point_center.php?tab=charge');

  const handlePay = async () => {
    if (!selected) return;
    const amount = selected.quotePoints;
    if (!window.confirm(`${amount.toLocaleString()}P를 결제할까요? 보유 포인트에서 바로 차감됩니다.`)) {
      return;
    }
    setBusy(true);
    setError('');
    try {
      const next = await payRevisionQuote(selected.id, selected.quoteVersion);
      setSelected(next);
      await refresh();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : '결제에 실패했습니다.');
    } finally {
      setBusy(false);
    }
  };

  const handleConfirm = async (ok: boolean) => {
    if (!selected) return;
    setBusy(true);
    try {
      const next = await confirmRevision(selected.id, ok);
      setSelected(next);
      await refresh();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : '확인 처리에 실패했습니다.');
    } finally {
      setBusy(false);
    }
  };

  const handleReplyInfo = async (
    items: { id: string; answerText: string }[],
    uploads: { id: string; files: File[] }[]
  ) => {
    if (!selected) return;
    setBusy(true);
    setError('');
    try {
      for (const upload of uploads) {
        for (const file of upload.files) {
          await uploadRevisionFile(selected.id, file, undefined, { infoRequestId: upload.id });
        }
      }
      const next = await replyRevisionInfo(selected.id, items);
      setSelected(next);
      await refresh();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : '자료 회신에 실패했습니다.');
    } finally {
      setBusy(false);
    }
  };

  const handleAttachToSelected = async (files: FileList | null) => {
    if (!selected || !files?.length) return;
    setBusy(true);
    try {
      for (const file of Array.from(files)) {
        await uploadRevisionFile(selected.id, file);
      }
      await openDetail(selected);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : '파일 업로드에 실패했습니다.');
    } finally {
      setBusy(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newDomain.trim() || creatingProject) return;
    setCreatingProject(true);
    setError('');
    try {
      await onCreateProject({
        name: newName.trim(),
        domain: newDomain.trim(),
        niche: newNiche.trim(),
      });
      setNewName('');
      setNewDomain('');
      setNewNiche('');
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : '프로젝트 등록에 실패했습니다.');
    } finally {
      setCreatingProject(false);
    }
  };

  return (
    <div className="space-y-4">
      {!detailOnly && projects.length === 0 ? (
        <form onSubmit={(e) => void handleCreateProject(e)} className="bg-white rounded-2xl border border-[#E2E8F0] p-5 space-y-4">
          <div>
            <p className="text-sm font-bold text-slate-900">프로젝트를 먼저 만들어 주세요.</p>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              프로젝트 명칭 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="예: 온오프마케팅"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              도메인 주소 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              placeholder="example.com"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
              autoComplete="off"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">업종</label>
            <input
              type="text"
              value={newNiche}
              onChange={(e) => setNewNiche(e.target.value)}
              placeholder="예: 정책자금, 인증, 법인 컨설팅"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" variant="primary" size="sm" disabled={creatingProject}>
              {creatingProject ? '등록 중' : '프로젝트 만들기'}
            </Button>
          </div>
        </form>
      ) : !detailOnly ? (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
          <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="revision-project">
            프로젝트
          </label>
          <select
            id="revision-project"
            value={projectId ? String(projectId) : ''}
            onChange={(e) => {
              const next = projects.find((item) => item.id === e.target.value);
              if (next) onSelectProject(next);
            }}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
          >
            <option value="">선택</option>
            {projects.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
                {item.domain ? ` · ${item.domain}` : ''}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {!detailOnly && projects.length > 0 && projectId && eligible ? (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-xs text-[#64748B]">
          {quota ? `무료 ${quota.remaining}/${quota.limit}회` : '무료 수정'}
          {presence !== 'present' ? ' · 주소나 캡처로도 요청할 수 있습니다' : ''}
        </p>
      </div>
      ) : null}

      {!detailOnly && projects.length > 0 && !projectId ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-5 text-sm text-slate-700">
          프로젝트를 선택해 주세요.
        </div>
      ) : null}

      {!detailOnly && projectId && !loading && !error && !eligible ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-sm font-bold text-amber-950">홈페이지를 등록해 주세요.</p>
          <Button size="sm" variant="primary" onClick={onRegisterHomepage}>
            홈페이지 등록
          </Button>
        </div>
      ) : null}

      {!detailOnly && projectId && eligible && quota && quota.remaining < 1 ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm font-bold text-rose-900">
          이번 달 무료 한도를 모두 썼습니다.
          {quota.resetLabel ? ` ${quota.resetLabel}에 다시 열립니다.` : ''}
        </div>
      ) : null}

      {error && !detailOnly ? (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 text-sm text-rose-800">{error}</div>
      ) : null}

      {!detailOnly && projectId && eligible && !(quota && quota.remaining < 1) ? (
        <RevisionAnnotateWorkspace
          projectLabel={(() => {
            const current = projects.find((item) => item.id === String(projectId));
            if (!current) return '';
            return current.domain ? `${current.name} · ${current.domain}` : current.name;
          })()}
          previewUrl={previewUrl || pageUrl}
          busy={busy}
          onSubmit={(payload) => {
            void (async () => {
              if (!projectId || !payload.title.trim()) return;
              setBusy(true);
              setError('');
              try {
                const created = await createRevision({
                  projectId,
                  orderId: resolvedOrderId || orderId || undefined,
                  title: payload.title.trim(),
                  description: payload.description.trim(),
                  pageUrl: payload.pageUrl.trim(),
                  device: payload.device,
                  category: payload.category,
                  priority: 'normal',
                  annotation: payload.annotation,
                });
                if (payload.snapshotFile) {
                  await uploadRevisionFile(created.id, payload.snapshotFile, undefined, { asSnapshot: true });
                }
                await refresh();
                await openDetail(created);
              } catch (err) {
                setError(err instanceof ApiRequestError ? err.message : '수정 요청 접수에 실패했습니다.');
              } finally {
                setBusy(false);
              }
            })();
          }}
        />
      ) : null}

      {projectId && !detailOnly && loading && tickets.length === 0 ? (
        <p className="text-sm text-slate-500">불러오는 중…</p>
      ) : null}

      {projectId && !detailOnly ? <div className="space-y-2">
          {tickets.length === 0 && !loading ? (
            <div className="rounded-2xl border border-dashed border-[#CBD5E1] bg-white px-5 py-8 text-center">
              <p className="text-sm font-bold text-slate-800">아직 수정 요청이 없습니다.</p>
              <p className="mt-1 text-xs text-slate-500">위 스튜디오에서 자리를 고르고 보내 주세요.</p>
            </div>
          ) : null}
          {tickets.map((rev) => {
            const cta = customerCta(rev);
            const needsAction = customerNeedsAction(rev);
            return (
              <button
                key={rev.id}
                type="button"
                onClick={() => void openDetail(rev)}
                className={`w-full text-left rounded-2xl border bg-white px-4 py-3 transition-colors ${
                  selected?.id === rev.id ? 'border-blue-400 ring-1 ring-blue-100' : 'border-[#E2E8F0] hover:border-[#CBD5E1]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="truncate text-sm font-bold text-slate-900">{rev.title}</span>
                      <Badge status={statusTone(rev.status)} size="sm">
                        {rev.customerProgress?.label || rev.statusLabel}
                      </Badge>
                    </div>
                    <p className="text-[12px] text-slate-600 line-clamp-1">
                      {rev.customerProgress?.label || '접수'}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-lg px-2.5 py-1.5 text-[11px] font-bold ${
                      needsAction
                        ? 'bg-[#2563EB] text-white'
                        : rev.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {cta}
                  </span>
                </div>
              </button>
            );
          })}
        </div> : null}

        {selected || (detailOnly && focusTicketId) ? (
          <RevisionDetailDrawer title={selected?.title || '수정 요청'} onClose={closeDrawer}>
          {!selected ? (
            <p className="text-sm text-slate-500">{error || '불러오는 중…'}</p>
          ) : (
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-black text-slate-900">{selected.title}</h3>
                  <Badge status={statusTone(selected.status)} size="sm">
                    {selected.customerProgress?.label || selected.statusLabel}
                  </Badge>
                </div>
                <RevisionStatusRail
                  status={selected.status}
                  progressId={selected.customerProgress?.id}
                />
              </div>

              {/* Primary next action — always first after progress */}
              {selected.status === 'feedback' ? (
                <div className="space-y-3 rounded-2xl border border-[#2563EB]/25 bg-[#EFF6FF] p-4">
                  <p className="text-sm font-black text-[#1D4ED8]">확인</p>
                  {(selected.customerProgress?.confirmUrl || selected.feedbackUrl) ? (
                    <a
                      href={selected.customerProgress?.confirmUrl || selected.feedbackUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex rounded-lg bg-white px-3 py-2 text-xs font-bold text-[#1D4ED8] underline break-all"
                    >
                      {selected.customerProgress?.confirmUrl || selected.feedbackUrl}
                    </a>
                  ) : null}
                  {selected.feedbackNote ? (
                    <p className="text-xs text-slate-800 whitespace-pre-wrap">{selected.feedbackNote}</p>
                  ) : null}
                  <RevisionResultCompare
                    annotation={selected.annotation}
                    result={selected.resultPreview}
                    feedbackUrl={selected.customerProgress?.confirmUrl || selected.feedbackUrl}
                    feedbackNote={selected.feedbackNote}
                  />
                  <div className="flex flex-wrap gap-2 pt-1">
                    <Button size="sm" variant="primary" disabled={busy} onClick={() => void handleConfirm(true)}>
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      확인했어요
                    </Button>
                    <Button size="sm" variant="outline" disabled={busy} onClick={() => void handleConfirm(false)}>
                      같은 자리 다시 요청
                    </Button>
                  </div>
                </div>
              ) : null}

              {selected.status === 'need_info' ? (
                <div className="space-y-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-sm font-black text-amber-950">진행 · 자료 보내기</p>
                  {(selected.infoRequests || []).length > 0 ? (
                    <RevisionInfoReplySlots
                      items={selected.infoRequests || []}
                      files={selected.files}
                      busy={busy}
                      onReply={handleReplyInfo}
                    />
                  ) : (
                    <p className="text-xs text-amber-900">아래 대화에 답하거나 파일을 올려 주세요.</p>
                  )}
                </div>
              ) : null}

              {quoteEnabled && selected.status === 'quote_pending' ? (
                <div className="space-y-2 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-sm font-black text-amber-950">
                    {selected.quotePoints.toLocaleString()}P 결제
                  </p>
                  <p className="text-xs text-amber-900">결제하면 수정을 시작합니다.</p>
                  {selected.quoteNote ? (
                    <p className="text-xs text-amber-800 whitespace-pre-wrap">{selected.quoteNote}</p>
                  ) : null}
                  {wallet?.ok ? (
                    <p className={`text-xs font-bold ${wallet.balance < selected.quotePoints ? 'text-rose-700' : 'text-amber-950'}`}>
                      보유 {wallet.balance.toLocaleString()}P
                      {wallet.balance < selected.quotePoints
                        ? ` · ${selected.quotePoints - wallet.balance}P 부족`
                        : ''}
                    </p>
                  ) : null}
                  {wallet?.ok && wallet.balance < selected.quotePoints ? (
                    <a href={POINT_CHARGE_URL} className="inline-flex text-xs font-bold text-blue-700 underline">
                      포인트 충전
                    </a>
                  ) : null}
                  <Button
                    size="sm"
                    variant="primary"
                    leftIcon={<CreditCard className="w-4 h-4" />}
                    disabled={busy || Boolean(wallet?.ok && wallet.balance < selected.quotePoints)}
                    onClick={() => void handlePay()}
                  >
                    결제하기
                  </Button>
                </div>
              ) : null}

              {!quoteEnabled && selected.status === 'quote_pending' ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  무료로 이어서 처리합니다. 조금만 기다려 주세요.
                </div>
              ) : null}

              {!customerNeedsAction(selected) && selected.status !== 'completed' && selected.status !== 'cancelled' ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700">
                  {selected.customerProgress?.label || '진행'}
                </div>
              ) : null}

              {selected.status === 'completed' ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-900">
                  완료
                </div>
              ) : null}

              <details className="rounded-2xl border border-[#E2E8F0] bg-white open:pb-3">
                <summary className="cursor-pointer list-none px-4 py-3 text-sm font-bold text-slate-800">
                  요청 내용 보기
                </summary>
                <div className="space-y-3 border-t border-[#E2E8F0] px-4 pt-3">
                  <RevisionMarkPreview annotation={selected.annotation} compact />
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">{selected.description}</p>
                  {selected.pageUrl ? (
                    <p className="text-[11px] text-slate-400 break-all">
                      {DEVICE_LABEL[selected.device] || selected.device} · {selected.pageUrl}
                    </p>
                  ) : null}
                  {(selected.files || []).length > 0 ? (
                    <ul className="flex flex-wrap gap-2">
                      {(selected.files || []).map((f) => {
                        const preview = websiteImagePreviewUrl(f);
                        return (
                          <li key={f.id}>
                            {preview ? (
                              <a href={preview} target="_blank" rel="noreferrer" title={f.originalName}>
                                <img
                                  src={preview}
                                  alt={f.originalName}
                                  className="h-14 w-14 rounded-lg object-cover border border-[#E2E8F0] bg-white"
                                />
                              </a>
                            ) : (
                              <a
                                href={f.downloadUrl}
                                className="text-xs text-blue-600 inline-flex items-center gap-1"
                                target="_blank"
                                rel="noreferrer"
                              >
                                <Paperclip className="w-3 h-3" />
                                {f.originalName}
                              </a>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                </div>
              </details>

              <details className="rounded-2xl border border-[#E2E8F0] bg-white open:pb-3">
                <summary className="cursor-pointer list-none px-4 py-3 text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                  대화 {(selected.comments || []).length ? `(${(selected.comments || []).length})` : ''}
                </summary>
                <div className="space-y-2 border-t border-[#E2E8F0] px-4 pt-3">
                  <div className="space-y-2 max-h-56 overflow-y-auto">
                    {(selected.comments || []).length === 0 ? (
                      <p className="text-xs text-slate-400">아직 대화가 없습니다.</p>
                    ) : (
                      (selected.comments || []).map((c) => (
                        <div
                          key={c.id}
                          className={`rounded-xl px-3 py-2 text-xs ${
                            c.authorRole === 'admin'
                              ? 'bg-blue-50 text-blue-900'
                              : 'bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="flex justify-between gap-2 mb-0.5">
                            <span className="font-bold">{c.authorRole === 'admin' ? '운영자' : '나'}</span>
                            <span className="text-[10px] opacity-60">{c.createdAt.slice(0, 16)}</span>
                          </div>
                          <p className="whitespace-pre-wrap">{c.body}</p>
                        </div>
                      ))
                    )}
                  </div>
                  {selected.status !== 'completed' && selected.status !== 'cancelled' ? (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={commentBody}
                        onChange={(e) => setCommentBody(e.target.value)}
                        placeholder="추가 설명을 남겨 주세요"
                        className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg"
                      />
                      <label className="inline-flex items-center justify-center px-3 py-2 text-xs border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50">
                        <Paperclip className="w-3.5 h-3.5 mr-1" />
                        파일
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*,.pdf,.zip,.doc,.docx,.txt"
                          multiple
                          onChange={(e) => void handleAttachToSelected(e.target.files)}
                        />
                      </label>
                      <Button size="sm" variant="primary" disabled={busy || !commentBody.trim()} onClick={() => void handleComment()}>
                        <Send className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ) : null}
                </div>
              </details>
            </div>
          )}
          </RevisionDetailDrawer>
        ) : null}

    </div>
  );
};
