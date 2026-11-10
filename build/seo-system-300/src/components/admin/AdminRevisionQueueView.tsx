import React, { useEffect, useState } from 'react';
import { ExternalLink, RefreshCw } from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { ApiRequestError } from '../../services/apiClient';
import {
  ApiRevisionTicket,
  adminGetRevision,
  adminListRevisions,
  adminSaveRevision,
} from '../../services/revisionService';
import { RevisionMarkPreview } from '../website/RevisionMarkPreview';

const CRM_REVISIONS_URL = 'https://crm.icrm.co.kr/';

function tone(status: string): 'completed' | 'in_progress' | 'pending' | 'needs_check' {
  if (status === 'completed') return 'completed';
  if (['in_progress', 'free_progress', 'paid', 'reviewing'].includes(status)) return 'in_progress';
  if (['need_info', 'quote_pending', 'feedback', 'expired', 'requested'].includes(status)) return 'needs_check';
  return 'pending';
}

function opsHint(ticket: ApiRevisionTicket): string {
  if (ticket.deployPlan?.ready) {
    if (ticket.deployPlan.ftpConfigured === false) return 'FTP 필요';
    if (ticket.deployPlan.status === 'queued') return '배포 대기';
    if (ticket.deployPlan.status === 'completed') return '배포 완료';
    return '배포 가능';
  }
  if (ticket.status === 'feedback') return '고객 확인';
  if (ticket.quota && ticket.quota.remaining < 1) return '한도 소진';
  return ticket.customerProgress?.label || ticket.statusLabel || '진행';
}

export const AdminRevisionQueueView: React.FC = () => {
  const [items, setItems] = useState<ApiRevisionTicket[]>([]);
  const [selected, setSelected] = useState<ApiRevisionTicket | null>(null);
  const [filter, setFilter] = useState('open');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminListRevisions(filter);
      setItems(data.items || []);
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
    try {
      const detail = await adminGetRevision(item.id);
      setSelected(detail);
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
        ...extra,
      });
      setSelected(next);
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
          <h2 className="text-lg font-black text-slate-900">수정 · 배포</h2>
          <p className="text-xs text-slate-500">
            할당량·FTP·배포만 봅니다. 정리·보내기는{' '}
            <a href={CRM_REVISIONS_URL} target="_blank" rel="noreferrer" className="font-bold text-slate-700 underline">
              CRM
            </a>
            에서.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={CRM_REVISIONS_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700"
          >
            CRM
            <ExternalLink className="h-3 w-3" />
          </a>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-2 py-2 bg-white"
          >
            <option value="open">열린 요청</option>
            <option value="feedback">고객 확인 중</option>
            <option value="completed">배포 후 완료</option>
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
              대기 중인 요청이 없습니다.
            </div>
          ) : null}
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => void open(item)}
              className={`w-full text-left bg-white rounded-2xl border px-4 py-3 ${
                selected?.id === item.id ? 'border-blue-400 ring-1 ring-blue-100' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="min-w-0 flex-1 space-y-0.5">
                  <p className="text-sm font-bold truncate">{item.title}</p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {item.orderDomain || item.mbId}
                    {item.quota ? ` · 무료 ${item.quota.remaining}/${item.quota.limit}` : ''}
                  </p>
                </div>
                <span className="shrink-0 rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-700">
                  {opsHint(item)}
                </span>
              </div>
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
                    {opsHint(selected)}
                  </Badge>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {selected.orderDomain || selected.mbId}
                  {selected.pageUrl ? ` · ${selected.pageUrl}` : ''}
                </p>
              </div>

              {selected.quota ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
                  이번 달 무료 {selected.quota.used}/{selected.quota.limit} 사용
                  {selected.quota.remaining < 1 ? ' · 한도 소진' : ` · ${selected.quota.remaining}회 남음`}
                  {selected.quota.resetLabel ? ` · ${selected.quota.resetLabel} 초기화` : ''}
                </div>
              ) : null}

              <RevisionMarkPreview annotation={selected.annotation} compact />
              <p className="text-sm whitespace-pre-wrap text-slate-700 line-clamp-4">
                {selected.description || '상세 없음'}
              </p>

              {selected.deployChecklist ? (
                <div
                  className={`rounded-xl border p-3 space-y-2 ${
                    selected.deployChecklist.ready
                      ? 'border-emerald-200 bg-emerald-50'
                      : 'border-amber-200 bg-amber-50'
                  }`}
                >
                  <p
                    className={`text-xs font-bold ${
                      selected.deployChecklist.ready ? 'text-emerald-900' : 'text-amber-900'
                    }`}
                  >
                    {selected.deployChecklist.ready ? '배포 준비됨' : '배포 전 체크'}
                  </p>
                  <ul className="space-y-1">
                    {(selected.deployChecklist.items || []).map((item) => (
                      <li
                        key={item.id}
                        className={`text-[11px] ${item.ok ? 'text-emerald-800' : 'text-amber-900 font-bold'}`}
                      >
                        {item.ok ? '✓' : '○'} {item.label}
                      </li>
                    ))}
                  </ul>
                  {(selected.deployChecklist.changedFiles || []).length > 0 ? (
                    <pre className="max-h-28 overflow-auto rounded-lg bg-white/80 border border-emerald-100 px-2 py-1 text-[10px] text-slate-700 whitespace-pre-wrap">
                      {(selected.deployChecklist.changedFiles || []).join('\n')}
                    </pre>
                  ) : null}
                  {selected.deployPlan?.note ? (
                    <p className="text-[11px] text-slate-700">{selected.deployPlan.note}</p>
                  ) : null}
                  {selected.deployPlan ? (
                    <div
                      className={`rounded-lg border px-2 py-1.5 text-[11px] ${
                        selected.deployPlan.ftpConfigured === true
                          ? 'border-emerald-200 bg-white text-emerald-900'
                          : selected.deployPlan.ftpConfigured === false
                            ? 'border-rose-200 bg-rose-50 text-rose-900'
                            : 'border-amber-200 bg-amber-50/80 text-amber-950'
                      }`}
                    >
                      {selected.deployPlan.ftpConfigured === true
                        ? 'FTP 준비됨'
                        : selected.deployPlan.ftpConfigured === false
                          ? 'FTP 미설정 — ops/ftp.env 필요'
                          : 'FTP는 담당 Mac에서 확인'}
                      {(selected.deployPlan.ftpPaths || []).length > 0 ? (
                        <pre className="mt-1 max-h-16 overflow-auto whitespace-pre-wrap text-[10px] opacity-80">
                          {(selected.deployPlan.ftpPaths || []).join('\n')}
                        </pre>
                      ) : null}
                    </div>
                  ) : null}
                  {selected.deployPlan?.deployCommand ? (
                    <div className="space-y-2 border-t border-emerald-100 pt-2">
                      <pre className="rounded-lg bg-white/90 border border-emerald-100 px-2 py-1 text-[10px] text-slate-700 whitespace-pre-wrap">
                        {selected.deployPlan.previewCommand || selected.deployPlan.deployCommand}
                      </pre>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={busy || !selected.deployPlan.previewCommand}
                          onClick={() => {
                            const text = selected.deployPlan?.previewCommand || '';
                            if (!text || !navigator.clipboard) return;
                            void navigator.clipboard.writeText(text);
                          }}
                        >
                          dry-run 복사
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={busy || !selected.deployPlan.deployCommand}
                          onClick={() => {
                            const text = selected.deployPlan?.deployCommand || '';
                            if (!text || !navigator.clipboard) return;
                            void navigator.clipboard.writeText(text);
                          }}
                        >
                          배포 명령 복사
                        </Button>
                        <Button
                          size="sm"
                          variant="primary"
                          disabled={busy || !selected.deployPlan.ready || selected.deployPlan.ftpConfigured === false}
                          onClick={() => void run('deploy_queue')}
                        >
                          배포 대기열
                        </Button>
                      </div>
                      {selected.deployPlan.status || selected.deployPlan.workerAlive != null ? (
                        <p className="text-[10px] text-slate-500">
                          {selected.deployPlan.status ? `배포 ${selected.deployPlan.status}` : ''}
                          {selected.deployPlan.deployNote ? ` · ${selected.deployPlan.deployNote}` : ''}
                          {selected.deployPlan.error ? ` · ${selected.deployPlan.error}` : ''}
                          {selected.deployPlan.workerAlive === true
                            ? ' · 워커 정상'
                            : selected.deployPlan.workerAlive === false
                              ? ' · 워커 없음'
                              : ''}
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                  아직 배포 체크리스트가 없습니다. CRM에서 작업을 보낸 뒤 결과가 오면 여기서 배포합니다.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
