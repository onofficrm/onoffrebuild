import React, { useCallback, useEffect, useState } from 'react';
import {
  PlusCircle,
  MessageSquare,
  Paperclip,
  ExternalLink,
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
import {
  PendingAttachment,
  RevisionRequestComposer,
  RevisionStatusRail,
  pendingAttachment,
} from './RevisionRequestComposer';
import { RevisionAnnotateWorkspace } from './RevisionAnnotateWorkspace';
import { RevisionMarkPreview } from './RevisionMarkPreview';
import type { WebsitePresence } from '../../utils/websitePresence';
import {
  ApiRevisionTicket,
  commentRevision,
  confirmRevision,
  createRevision,
  listRevisions,
  payRevisionQuote,
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

const CATEGORY_LABEL: Record<string, string> = {
  layout: '레이아웃',
  design: '디자인',
  content: '문구',
  seo_tag: 'SEO',
  speed: '속도',
  other: '기타',
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
  const [eligible, setEligible] = useState(false);
  const [resolvedOrderId, setResolvedOrderId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<ApiRevisionTicket | null>(null);
  const [composerOpen, setComposerOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3>(1);
  const [busy, setBusy] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pageUrl, setPageUrl] = useState('');
  const [device, setDevice] = useState('both');
  const [category, setCategory] = useState('design');
  const [priority, setPriority] = useState('normal');
  const [pendingFiles, setPendingFiles] = useState<PendingAttachment[]>([]);
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
    if (!focusTicketId) return;
    let cancelled = false;
    void getRevision(focusTicketId)
      .then((data) => {
        if (!cancelled) setSelected(data.ticket);
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
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : '상세를 불러오지 못했습니다.');
    }
  };

  const closeDrawer = useCallback(() => {
    setSelected(null);
    onCloseDetail?.();
  }, [onCloseDetail]);

  const clearPending = (items: PendingAttachment[]) => {
    items.forEach((item) => {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
    });
    setPendingFiles([]);
  };

  const openComposer = () => {
    clearPending(pendingFiles);
    setTitle('');
    setDescription('');
    setPageUrl('');
    setDevice('both');
    setCategory('design');
    setPriority('normal');
    setWizardStep(1);
    setError('');
    setComposerOpen(true);
  };

  const handleCreate = async () => {
    if (!projectId || !title.trim()) return;
    setBusy(true);
    setError('');
    try {
      const created = await createRevision({
        projectId,
        orderId: resolvedOrderId || orderId || undefined,
        title: title.trim(),
        description: description.trim(),
        pageUrl: pageUrl.trim(),
        device,
        category,
        priority,
      });
      for (const item of pendingFiles) {
        await uploadRevisionFile(created.id, item.file);
      }
      clearPending(pendingFiles);
      setComposerOpen(false);
      setWizardStep(1);
      setTitle('');
      setDescription('');
      setPageUrl('');
      await refresh();
      await openDetail(created);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : '수정 요청 접수에 실패했습니다.');
    } finally {
      setBusy(false);
    }
  };

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

  const handlePay = async () => {
    if (!selected) return;
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
            <p className="text-sm font-bold text-slate-900">홈페이지 수정은 프로젝트에 등록된 홈페이지만 가능합니다.</p>
            <p className="text-xs text-slate-500 mt-1">
              등록된 프로젝트가 없습니다. 프로젝트를 만든 뒤 그 프로젝트에 홈페이지를 등록해주세요.
            </p>
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
              {creatingProject ? '등록 중' : '프로젝트 등록 후 홈페이지 주문'}
            </Button>
          </div>
        </form>
      ) : !detailOnly ? (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
          <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="revision-project">
            수정할 프로젝트
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
            <option value="">프로젝트를 선택하세요</option>
            {projects.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
                {item.domain ? ` · ${item.domain}` : ''}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-slate-500 mt-2">선택한 프로젝트에 접수된 홈페이지만 수정 요청할 수 있습니다.</p>
        </div>
      ) : null}

      {!detailOnly && projects.length > 0 && projectId && !composerOpen && presence !== 'present' ? (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-xs text-[#64748B]">
            수정 요청은 기본 무료입니다. 관리자가 비용을 정하면 이 화면에서 결제한 뒤에 작업이 진행됩니다.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          leftIcon={<PlusCircle className="w-4 h-4" />}
          disabled={!eligible || busy}
          onClick={openComposer}
        >
          새 수정요청
        </Button>
      </div>
      ) : null}

      {!detailOnly && projects.length > 0 && !projectId ? (
        <p className="text-sm text-slate-500">수정할 프로젝트를 선택해주세요.</p>
      ) : null}

      {!detailOnly && projectId && !loading && !error && !eligible ? (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>이 프로젝트에 접수된 홈페이지가 없습니다. 홈페이지를 등록한 뒤에 수정 요청을 할 수 있습니다.</span>
          </div>
          <Button size="sm" variant="primary" onClick={onRegisterHomepage}>
            홈페이지 등록
          </Button>
        </div>
      ) : null}

      {error && !detailOnly ? (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 text-sm text-rose-800">{error}</div>
      ) : null}

      {presence === 'present' && projectId && !detailOnly ? (
        <RevisionAnnotateWorkspace
          projectLabel={(() => {
            const current = projects.find((item) => item.id === String(projectId));
            if (!current) return '';
            return current.domain ? `${current.name} · ${current.domain}` : current.name;
          })()}
          previewUrl={previewUrl}
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

      {composerOpen && projectId && presence !== 'present' ? (
        <RevisionRequestComposer
          projectLabel={(() => {
            const current = projects.find((item) => item.id === String(projectId));
            if (!current) return '';
            return current.domain ? `${current.name} · ${current.domain}` : current.name;
          })()}
          step={wizardStep}
          busy={busy}
          title={title}
          description={description}
          pageUrl={pageUrl}
          device={device}
          category={category}
          priority={priority}
          files={pendingFiles}
          onTitle={setTitle}
          onDescription={setDescription}
          onPageUrl={setPageUrl}
          onDevice={setDevice}
          onCategory={setCategory}
          onPriority={setPriority}
          onAddFiles={(selected) => {
            setPendingFiles((prev) => [...prev, ...selected.map((file, index) => pendingAttachment(file, prev.length + index))]);
          }}
          onRemoveFile={(key) => {
            setPendingFiles((prev) => {
              const target = prev.find((item) => item.key === key);
              if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
              return prev.filter((item) => item.key !== key);
            });
          }}
          onStep={setWizardStep}
          onCancel={() => {
            if (busy) return;
            clearPending(pendingFiles);
            setComposerOpen(false);
            setWizardStep(1);
          }}
          onSubmit={() => void handleCreate()}
        />
      ) : null}

      {projectId && !composerOpen && !detailOnly && loading && tickets.length === 0 ? (
        <p className="text-sm text-slate-500">불러오는 중…</p>
      ) : null}

      {projectId && !composerOpen && !detailOnly ? <div className="space-y-3">
          {tickets.length === 0 && !loading ? (
            <div className="bg-white rounded-2xl border border-dashed border-[#CBD5E1] p-6 text-center text-sm text-slate-500">
              아직 수정 요청이 없습니다.
            </div>
          ) : null}
          {tickets.map((rev) => (
            <button
              key={rev.id}
              type="button"
              onClick={() => void openDetail(rev)}
              className={`w-full text-left bg-white rounded-2xl border p-4 space-y-2 transition-colors ${
                selected?.id === rev.id ? 'border-blue-400 ring-1 ring-blue-100' : 'border-[#E2E8F0] hover:border-[#CBD5E1]'
              }`}
            >
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-[10px] text-slate-400">#{rev.id}</span>
                <span className="text-sm font-bold text-slate-900 truncate">{rev.title}</span>
                <Badge status={statusTone(rev.status)} size="sm">
                  {rev.statusLabel}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2">{rev.description}</p>
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>{rev.annotation?.label || CATEGORY_LABEL[rev.category] || rev.category}</span>
                <span>{rev.createdAt.slice(0, 16)}</span>
              </div>
            </button>
          ))}
        </div> : null}

        {selected || (detailOnly && focusTicketId) ? (
          <RevisionDetailDrawer title={selected?.title || '수정 요청'} onClose={closeDrawer}>
          {!selected ? (
            <p className="text-sm text-slate-500">{error || '불러오는 중…'}</p>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-black text-slate-900">{selected.title}</h3>
                    <Badge status={statusTone(selected.status)} size="sm">
                      {selected.statusLabel}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {DEVICE_LABEL[selected.device] || selected.device}
                    {selected.pageUrl ? ` · ${selected.pageUrl}` : ''}
                  </p>
                </div>
              </div>
              <RevisionStatusRail status={selected.status} quotePoints={selected.quotePoints} paidAt={selected.paidAt} />

              <RevisionMarkPreview annotation={selected.annotation} compact />

              <p className="text-sm text-slate-700 bg-slate-50 border border-slate-100 rounded-xl p-3 whitespace-pre-wrap">
                {selected.description}
              </p>

              {selected.status === 'quote_pending' ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-2">
                  <p className="text-sm font-bold text-amber-900">
                    관리자 과금 {selected.quotePoints.toLocaleString()}P
                  </p>
                  <p className="text-xs text-amber-800">온오프에서 결제하면 관리자가 수정을 진행합니다.</p>
                  {selected.quoteNote ? (
                    <p className="text-xs text-amber-800 whitespace-pre-wrap">{selected.quoteNote}</p>
                  ) : null}
                  {selected.quoteExpiresAt ? (
                    <p className="text-[11px] text-amber-700">결제 기한: {selected.quoteExpiresAt}</p>
                  ) : null}
                  <Button
                    size="sm"
                    variant="primary"
                    leftIcon={<CreditCard className="w-4 h-4" />}
                    disabled={busy}
                    onClick={() => void handlePay()}
                  >
                    {selected.quotePoints.toLocaleString()}P 결제하기
                  </Button>
                </div>
              ) : null}

              {selected.paidAt && selected.status !== 'quote_pending' ? (
                <p className="text-xs text-emerald-700">결제 완료. 관리자가 수정을 진행합니다.</p>
              ) : null}

              {selected.status === 'feedback' ? (
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 space-y-2">
                  <p className="text-sm font-bold text-blue-900">수정 반영 — 확인해 주세요</p>
                  {selected.feedbackNote ? (
                    <p className="text-xs text-blue-800 whitespace-pre-wrap">{selected.feedbackNote}</p>
                  ) : null}
                  {selected.feedbackUrl ? (
                    <a
                      href={selected.feedbackUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-blue-700 font-medium"
                    >
                      결과 보기 <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : null}
                  <div className="flex gap-2">
                    <Button size="sm" variant="primary" disabled={busy} onClick={() => void handleConfirm(true)}>
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      확인했어요
                    </Button>
                    <Button size="sm" variant="outline" disabled={busy} onClick={() => void handleConfirm(false)}>
                      아직 안 됐어요
                    </Button>
                  </div>
                </div>
              ) : null}

              {(selected.files || []).length > 0 ? (
                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-slate-500">첨부</p>
                  <ul className="space-y-1">
                    {(selected.files || []).map((f) => {
                      const preview = websiteImagePreviewUrl(f);
                      return (
                        <li key={f.id}>
                          {preview ? (
                            <a href={preview} target="_blank" rel="noreferrer" className="inline-block" title={f.originalName}>
                              <img
                                src={preview}
                                alt={f.originalName}
                                className="h-16 w-16 rounded-lg object-cover border border-[#E2E8F0] bg-white"
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
                </div>
              ) : null}

              <div className="space-y-2 border-t border-slate-100 pt-3">
                <p className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5" /> 대화
                </p>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {(selected.comments || []).length === 0 ? (
                    <p className="text-xs text-slate-400">아직 댓글이 없습니다.</p>
                  ) : (
                    (selected.comments || []).map((c) => (
                      <div
                        key={c.id}
                        className={`rounded-xl px-3 py-2 text-xs ${
                          c.authorRole === 'admin'
                            ? 'bg-blue-50 border border-blue-100 text-blue-900'
                            : 'bg-slate-50 border border-slate-100 text-slate-700'
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
                      placeholder="추가 설명이나 답변을 남겨주세요"
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
            </div>
          )}
          </RevisionDetailDrawer>
        ) : null}

    </div>
  );
};
