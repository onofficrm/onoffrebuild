import React, { useEffect, useState } from 'react';
import { Copy, RefreshCw, Send } from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { ApiRequestError } from '../../services/apiClient';
import {
  ApiRevisionTicket,
  adminGetRevision,
  adminListRevisions,
  adminSaveRevision,
  adminUploadRevisionFile,
} from '../../services/revisionService';
import { RevisionMarkPreview } from '../website/RevisionMarkPreview';
import { RevisionResultCompare } from '../website/RevisionResultCompare';
import { RevisionInfoRequestEditor, type InfoRequestDraft } from './RevisionInfoRequestEditor';

function tone(status: string): 'completed' | 'in_progress' | 'pending' | 'needs_check' {
  if (status === 'completed') return 'completed';
  if (['in_progress', 'free_progress', 'paid', 'reviewing'].includes(status)) return 'in_progress';
  if (['need_info', 'quote_pending', 'feedback', 'expired', 'requested'].includes(status)) return 'needs_check';
  return 'pending';
}

export const AdminRevisionQueueView: React.FC = () => {
  const [items, setItems] = useState<ApiRevisionTicket[]>([]);
  const [selected, setSelected] = useState<ApiRevisionTicket | null>(null);
  const [quoteEnabled, setQuoteEnabled] = useState(false);
  const [filter, setFilter] = useState('open');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState('');
  const [quotePoints, setQuotePoints] = useState('50000');
  const [quoteNote, setQuoteNote] = useState('');
  const [feedbackNote, setFeedbackNote] = useState('');
  const [feedbackUrl, setFeedbackUrl] = useState('');
  const [agentBrief, setAgentBrief] = useState('');
  const [assignee, setAssignee] = useState('');
  const [constraints, setConstraints] = useState('');
  const [scope, setScope] = useState<'page' | 'site'>('page');
  const [infoDrafts, setInfoDrafts] = useState<InfoRequestDraft[]>([]);
  const [briefCopied, setBriefCopied] = useState(false);
  const [promptCopied, setPromptCopied] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminListRevisions(filter);
      setItems(data.items || []);
      setQuoteEnabled(Boolean(data.quoteEnabled));
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : '목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [filter]);

  const open = async (item: ApiRevisionTicket) => {
    setSelected(item);
    setAgentBrief(item.agentBrief || '');
    setAssignee(item.workPackage?.assignee || '');
    setConstraints(item.workPackage?.constraints || '');
    setScope(item.workPackage?.scope === 'site' ? 'site' : 'page');
    setInfoDrafts([]);
    setNote('');
    setFeedbackNote('');
    setFeedbackUrl('');
    setQuoteNote('');
    setBriefCopied(false);
    setPromptCopied(false);
    try {
      const detail = await adminGetRevision(item.id);
      setSelected(detail);
      setAgentBrief(detail.agentBrief || '');
      setAssignee(detail.workPackage?.assignee || '');
      setConstraints(detail.workPackage?.constraints || '');
      setScope(detail.workPackage?.scope === 'site' ? 'site' : 'page');
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : '상세를 불러오지 못했습니다.');
    }
  };

  const run = async (op: string, extra: Record<string, unknown> = {}) => {
    if (!selected) return;
    setBusy(true);
    setError('');
    try {
      const next = await adminSaveRevision({
        ticketId: selected.id,
        op,
        note,
        agentBrief: agentBrief.trim(),
        assignee: assignee.trim(),
        constraints: constraints.trim(),
        scope,
        ...extra,
      });
      setSelected(next);
      setAgentBrief(next.agentBrief || agentBrief);
      setAssignee(next.workPackage?.assignee || assignee);
      setConstraints(next.workPackage?.constraints || constraints);
      setScope(next.workPackage?.scope === 'site' ? 'site' : 'page');
      if (op === 'need_info') setInfoDrafts([]);
      setNote('');
      await load();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : '저장에 실패했습니다.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-slate-900">홈페이지 수정 요청</h2>
          <p className="text-xs text-slate-500">
            표시를 보고 에이전트 지시를 적은 뒤 무료로 넘깁니다.
            {quoteEnabled
              ? ' Core 포인트 결제가 연결되어 있어 견적을 보낼 수 있습니다.'
              : ' 포인트 결제가 연결되지 않아 견적은 숨겼습니다.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-2 py-2 bg-white"
          >
            <option value="open">진행 중</option>
            <option value="requested">요청됨</option>
            <option value="quote_pending">견적 대기</option>
            <option value="feedback">확인 요청</option>
            <option value="completed">완료</option>
            <option value="">전체</option>
          </select>
          <Button size="sm" variant="outline" onClick={() => void load()} disabled={loading}>
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {error ? <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-sm text-rose-800">{error}</div> : null}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2 space-y-2">
          {items.length === 0 && !loading ? (
            <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-6 text-center text-sm text-slate-500">
              대기 중인 수정 요청이 없습니다.
            </div>
          ) : null}
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => void open(item)}
              className={`w-full text-left bg-white rounded-2xl border p-4 space-y-1 ${
                selected?.id === item.id ? 'border-blue-400' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-[10px] text-slate-400">#{item.id}</span>
                <span className="text-sm font-bold truncate">{item.title}</span>
                <Badge status={tone(item.status)} size="sm">
                  {item.statusLabel}
                </Badge>
              </div>
              <p className="text-[11px] text-slate-500">
                {item.mbId} · 주문 #{item.orderId} · {item.triageStateLabel || ''}
                {item.annotation?.label ? ` · ${item.annotation.label}` : ''}
              </p>
              {item.priority === 'urgent' ? (
                <span className="text-[10px] font-bold text-rose-600">급함</span>
              ) : null}
            </button>
          ))}
        </div>

        <div className="lg:col-span-3">
          {!selected ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-sm text-slate-500">
              요청을 선택하세요.
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-black">{selected.title}</h3>
                  <Badge status={tone(selected.status)} size="sm">
                    {selected.statusLabel}
                  </Badge>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {selected.mbId} · 프로젝트 #{selected.projectId} · {selected.pageUrl || 'URL 없음'}
                </p>
                {selected.quota ? (
                  <p className="text-[11px] text-slate-500 mt-1">
                    이번 달 무료 {selected.quota.used}/{selected.quota.limit} 사용
                    {selected.quota.remaining < 1 && !selected.freeUsed
                      ? ' · 한도 소진'
                      : ` · ${selected.quota.remaining}회 남음`}
                  </p>
                ) : null}
              </div>

              <RevisionMarkPreview annotation={selected.annotation} compact />

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 space-y-1">
                <p className="text-[11px] font-bold text-slate-500">고객이 남긴 것</p>
                <p className="text-sm whitespace-pre-wrap text-slate-800">{selected.description || '상세 내용 없음'}</p>
              </div>

              <div className="rounded-xl border border-[#2563EB]/20 bg-[#EFF6FF] p-3 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold text-[#1D4ED8]">정리 작업대 · 고객에게 보이지 않음</p>
                  <span className="text-[11px] font-bold text-[#1D4ED8]">
                    {selected.triageStateLabel || (selected.workPackage?.readyForAgent ? '커서 준비' : '정리 대기')}
                  </span>
                </div>
                <input
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                  className="w-full text-xs border border-blue-200 rounded-lg px-3 py-2 bg-white"
                  placeholder="담당자"
                />
                <div className="flex gap-2 text-[11px] font-bold text-slate-600">
                  <label className="inline-flex items-center gap-1">
                    <input type="radio" checked={scope === 'page'} onChange={() => setScope('page')} />
                    이 페이지만
                  </label>
                  <label className="inline-flex items-center gap-1">
                    <input type="radio" checked={scope === 'site'} onChange={() => setScope('site')} />
                    같은 요소 사이트
                  </label>
                </div>
                <textarea
                  value={constraints}
                  onChange={(e) => setConstraints(e.target.value)}
                  rows={2}
                  placeholder="제약: 버튼은 유지. 다른 섹션은 건드리지 말 것."
                  className="w-full text-xs border border-blue-200 rounded-lg px-3 py-2 bg-white"
                />
                <textarea
                  value={agentBrief}
                  onChange={(e) => setAgentBrief(e.target.value)}
                  rows={4}
                  placeholder="대상: 메인 히어로 H1, PC·모바일. 문구만 교체하고 버튼은 유지."
                  className="w-full text-xs border border-blue-200 rounded-lg px-3 py-2 bg-white"
                />
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={busy || !agentBrief.trim()}
                    onClick={() => void run('triage', { readyForAgent: false })}
                  >
                    정리만 저장
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    disabled={busy || !agentBrief.trim()}
                    onClick={() => void run('ready', { readyForAgent: true })}
                  >
                    정리 완료 · 커서 준비
                  </Button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2563EB]"
                    onClick={() => {
                      const text = agentBrief.trim();
                      if (!text || !navigator.clipboard) return;
                      void navigator.clipboard.writeText(text).then(() => {
                        setBriefCopied(true);
                        window.setTimeout(() => setBriefCopied(false), 1500);
                      });
                    }}
                  >
                    <Copy className="h-3 w-3" />
                    {briefCopied ? '지시 복사됨' : '지시만 복사'}
                  </button>
                </div>
                {selected.cursorPrompt ? (
                  <div className="rounded-lg border border-blue-200 bg-white p-2 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-bold text-slate-600">커서 작업 패키지</p>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2563EB]"
                        onClick={() => {
                          const text = selected.cursorPrompt || '';
                          if (!text || !navigator.clipboard) return;
                          void navigator.clipboard.writeText(text).then(() => {
                            setPromptCopied(true);
                            window.setTimeout(() => setPromptCopied(false), 1500);
                          });
                        }}
                      >
                        <Copy className="h-3 w-3" />
                        {promptCopied ? '패키지 복사됨' : '패키지 복사'}
                      </button>
                    </div>
                    <pre className="max-h-40 overflow-auto whitespace-pre-wrap text-[11px] text-slate-700">
                      {selected.cursorPrompt}
                    </pre>
                  </div>
                ) : null}
                {!selected.workPackage?.readyForAgent ? (
                  <p className="text-[11px] text-slate-500">정리를 완료하기 전에는 무료·견적·작업을 시작할 수 없습니다.</p>
                ) : null}
              </div>

              {(selected.files || []).length > 0 ? (
                <ul className="text-xs space-y-1">
                  {(selected.files || []).map((f) => (
                    <li key={f.id}>
                      <a href={f.downloadUrl} className="text-blue-600" target="_blank" rel="noreferrer">
                        {f.originalName}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}

              <div className="space-y-2 max-h-48 overflow-y-auto border-t border-slate-100 pt-3">
                {(selected.comments || []).map((c) => (
                  <div
                    key={c.id}
                    className={`rounded-xl px-3 py-2 text-xs ${
                      c.authorRole === 'admin' ? 'bg-blue-50 text-blue-900' : 'bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="font-bold mb-0.5">{c.authorRole === 'admin' ? '운영자' : '고객'}</div>
                    <p className="whitespace-pre-wrap">{c.body}</p>
                  </div>
                ))}
              </div>

              {(selected.infoRequests || []).length > 0 ? (
                <div className="rounded-xl border border-slate-200 p-3 space-y-1">
                  <p className="text-[11px] font-bold text-slate-500">자료 칸</p>
                  {(selected.infoRequests || []).map((item) => (
                    <p key={item.id} className="text-xs text-slate-700">
                      {item.status === 'answered' ? '회신' : '대기'} · {item.label}
                      {item.answerText ? ` — ${item.answerText}` : ''}
                    </p>
                  ))}
                </div>
              ) : null}

              <RevisionInfoRequestEditor items={infoDrafts} onChange={setInfoDrafts} />

              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                placeholder="댓글 / 자료 요청 안내"
                className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2"
              />

              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" disabled={busy} onClick={() => void run('review')}>
                  검토중
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={busy || (!note.trim() && infoDrafts.length === 0)}
                  onClick={() => void run('need_info', { infoRequests: infoDrafts })}
                >
                  자료 요청
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  disabled={
                    busy ||
                    !agentBrief.trim() ||
                    !selected.workPackage?.readyForAgent ||
                    Boolean(selected.quota && selected.quota.remaining < 1 && !selected.freeUsed)
                  }
                  onClick={() => void run('free')}
                >
                  무료 진행
                </Button>
                {!selected.workPackage?.readyForAgent ? (
                  <p className="w-full text-[11px] text-slate-500">무료·견적은 정리 완료 뒤에만 할 수 있습니다.</p>
                ) : null}
                {selected.quota && selected.quota.remaining < 1 && !selected.freeUsed ? (
                  <p className="w-full text-[11px] text-rose-700">
                    {quoteEnabled
                      ? '이번 달 무료 한도를 모두 사용했습니다. 견적으로 진행하세요.'
                      : '이번 달 무료 한도를 모두 사용했습니다. 다음 달에 다시 무료로 진행하거나 결제를 설정하세요.'}
                  </p>
                ) : null}
                <Button size="sm" variant="outline" disabled={busy || !note.trim()} onClick={() => void run('comment')}>
                  <Send className="w-3.5 h-3.5 mr-1" />
                  댓글
                </Button>
                <Button size="sm" variant="outline" disabled={busy} onClick={() => void run('cancel')}>
                  취소
                </Button>
              </div>

              {quoteEnabled || selected.quoteEnabled ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 space-y-2">
                <p className="text-xs font-bold text-amber-900">견적 보내기</p>
                <div className="flex flex-wrap gap-2">
                  <input
                    type="number"
                    min={1}
                    value={quotePoints}
                    onChange={(e) => setQuotePoints(e.target.value)}
                    className="w-32 text-xs border border-amber-300 rounded-lg px-2 py-2"
                    placeholder="포인트"
                  />
                  <input
                    value={quoteNote}
                    onChange={(e) => setQuoteNote(e.target.value)}
                    className="flex-1 min-w-[160px] text-xs border border-amber-300 rounded-lg px-2 py-2"
                    placeholder="견적 사유"
                  />
                  <Button
                    size="sm"
                    variant="primary"
                    disabled={busy || !agentBrief.trim() || !selected.workPackage?.readyForAgent}
                    onClick={() =>
                      void run('quote', {
                        quotePoints: Number(quotePoints),
                        quoteNote: quoteNote || note,
                      })
                    }
                  >
                    견적 발행
                  </Button>
                </div>
              </div>
              ) : null}

              {selected.resultPreview?.url || selected.feedbackUrl || selected.status === 'feedback' ? (
                <RevisionResultCompare
                  annotation={selected.annotation}
                  result={selected.resultPreview}
                  feedbackUrl={selected.feedbackUrl}
                  feedbackNote={selected.feedbackNote}
                />
              ) : null}

              <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 space-y-2">
                <p className="text-xs font-bold text-blue-900">완료 피드백</p>
                <textarea
                  value={feedbackNote}
                  onChange={(e) => setFeedbackNote(e.target.value)}
                  rows={2}
                  className="w-full text-xs border border-blue-200 rounded-lg px-2 py-2"
                  placeholder="무엇을 수정했는지"
                />
                <input
                  value={feedbackUrl}
                  onChange={(e) => setFeedbackUrl(e.target.value)}
                  className="w-full text-xs border border-blue-200 rounded-lg px-2 py-2"
                  placeholder="확인 URL (선택)"
                />
                <label className="block text-[11px] text-blue-800">
                  결과 캡처 (선택)
                  <input
                    type="file"
                    accept="image/*"
                    className="mt-1 block w-full text-[11px]"
                    disabled={busy}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      e.target.value = '';
                      if (!file || !selected) return;
                      void (async () => {
                        setBusy(true);
                        try {
                          await adminUploadRevisionFile(selected.id, file, { asResult: true });
                          const detail = await adminGetRevision(selected.id);
                          setSelected(detail);
                        } catch (err) {
                          setError(err instanceof ApiRequestError ? err.message : '결과 캡처 업로드에 실패했습니다.');
                        } finally {
                          setBusy(false);
                        }
                      })();
                    }}
                  />
                </label>
                <Button
                  size="sm"
                  variant="primary"
                  disabled={busy || !feedbackNote.trim()}
                  onClick={() =>
                    void run('feedback', {
                      feedbackNote,
                      feedbackUrl,
                    })
                  }
                >
                  고객 확인 요청
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
