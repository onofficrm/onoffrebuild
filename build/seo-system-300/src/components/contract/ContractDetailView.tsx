import React, { useEffect, useState } from 'react';
import { Download, Loader2, Plus } from 'lucide-react';
import { ApiRequestError } from '../../services/apiClient';
import { getContract, getContractRead, addAddendum } from '../../services/contractService';
import { ContractDocumentViewer } from './ContractDocumentViewer';

export const ContractDetailView: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [html, setHtml] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [summary, setSummary] = useState<Record<string, string>>({});
  const [history, setHistory] = useState<Array<{ version?: string; status?: string }>>([]);
  const [selectedVersion, setSelectedVersion] = useState('');
  const [addenda, setAddenda] = useState<Array<{ id?: number; title?: string; body?: string }>>([]);
  const [canAddAddendum, setCanAddAddendum] = useState(false);
  const [addendumTitle, setAddendumTitle] = useState('');
  const [addendumBody, setAddendumBody] = useState('');
  const [savingAddendum, setSavingAddendum] = useState(false);

  const loadRead = async (version?: string) => {
    setError('');
    try {
      const read = await getContractRead(version || undefined);
      setAddenda(read.addenda || []);
      setCanAddAddendum(Boolean(read.canAddAddendum));
      const contract = read.contract as Record<string, string> | null | undefined;
      if (contract) {
        setSummary({
          companyName: contract.companyName || '',
          amount: contract.amount || '',
          startDate: contract.startDate || '',
          endDate: contract.endDate || '',
          status: contract.status || '',
        });
      }
      setHistory(read.history || []);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : '계약 상세를 불러오지 못했습니다.');
    }
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([getContract(), getContractRead()])
      .then(([view, read]) => {
        if (cancelled) return;
        setHtml(view.contractHtml || '');
        setDownloadUrl(view.urls?.download || '');
        const f = view.form || {};
        setSummary({
          companyName: f.companyName || '',
          amount: f.amount || '',
          startDate: f.startDate || '',
          endDate: f.endDate || '',
          status: String((view.contract as Record<string, string> | undefined)?.status || view.access?.status || ''),
        });
        setHistory(read.history || []);
        setAddenda(read.addenda || []);
        setCanAddAddendum(Boolean(read.canAddAddendum));
        const ver = read.history?.[0]?.version || '';
        setSelectedVersion(ver);
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
  }, []);

  const onVersionChange = async (version: string) => {
    setSelectedVersion(version);
    await loadRead(version);
    const view = await getContract();
    setHtml(view.contractHtml || '');
  };

  const handleAddAddendum = async () => {
    if (!addendumTitle.trim() || !addendumBody.trim()) {
      setError('특약 제목과 내용을 입력해 주세요.');
      return;
    }
    setSavingAddendum(true);
    setError('');
    try {
      await addAddendum({ title: addendumTitle.trim(), body: addendumBody.trim() });
      setAddendumTitle('');
      setAddendumBody('');
      await loadRead(selectedVersion || undefined);
      const view = await getContract();
      setHtml(view.contractHtml || '');
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : '특약 추가에 실패했습니다.');
    } finally {
      setSavingAddendum(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-10 text-center text-slate-400">
        <Loader2 className="w-5 h-5 animate-spin inline-block mr-2" />
        계약 정보 불러오는 중…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-700 bg-slate-900/90 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white">계약 정보</h1>
            <p className="mt-1 text-sm text-slate-400">체결된 서비스 계약서와 특약을 확인합니다.</p>
          </div>
          {downloadUrl ? (
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-bold hover:bg-blue-600"
            >
              <Download className="w-4 h-4" />
              PDF 다운로드
            </a>
          ) : null}
        </div>

        {history.length > 1 ? (
          <div className="mt-4">
            <label className="text-xs font-bold text-slate-400">버전</label>
            <select
              className="mt-1 block w-full max-w-xs rounded-xl bg-slate-950 border border-slate-700 text-sm text-white px-3 py-2"
              value={selectedVersion}
              onChange={(e) => void onVersionChange(e.target.value)}
            >
              {history.map((h) => (
                <option key={h.version || 'current'} value={h.version || ''}>
                  {h.version || 'current'} {h.status ? `(${h.status})` : ''}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <dl className="mt-5 grid sm:grid-cols-2 gap-3 text-sm">
          {[
            ['상호', summary.companyName],
            ['금액', summary.amount],
            ['시작일', summary.startDate],
            ['종료일', summary.endDate],
            ['상태', summary.status],
          ].map(([k, v]) => (
            <div key={k} className="rounded-xl bg-slate-950/60 border border-slate-700/80 px-3 py-2">
              <dt className="text-[10px] font-bold text-slate-500 uppercase">{k}</dt>
              <dd className="text-slate-200 font-medium mt-0.5">{v || '—'}</dd>
            </div>
          ))}
        </dl>
      </div>

      {error ? (
        <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div>
      ) : null}

      <ContractDocumentViewer html={html} />

      {addenda.length > 0 ? (
        <div className="rounded-2xl border border-slate-700 bg-slate-900/90 p-5">
          <h2 className="text-sm font-bold text-white mb-3">특약 목록</h2>
          <ul className="space-y-3">
            {addenda.map((a) => (
              <li key={a.id} className="rounded-xl border border-slate-700 bg-slate-950/50 p-4">
                <p className="text-sm font-bold text-cyan-300">{a.title}</p>
                <p className="mt-1 text-sm text-slate-400 whitespace-pre-wrap">{a.body}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {canAddAddendum ? (
        <div className="rounded-2xl border border-slate-700 bg-slate-900/90 p-5">
          <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Plus className="w-4 h-4 text-cyan-400" />
            특약 추가
          </h2>
          <input
            className="w-full mb-2 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white"
            placeholder="특약 제목"
            value={addendumTitle}
            onChange={(e) => setAddendumTitle(e.target.value)}
          />
          <textarea
            className="w-full min-h-[100px] px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white"
            placeholder="특약 내용"
            value={addendumBody}
            onChange={(e) => setAddendumBody(e.target.value)}
          />
          <button
            type="button"
            disabled={savingAddendum}
            onClick={() => void handleAddAddendum()}
            className="mt-3 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold disabled:opacity-60"
          >
            {savingAddendum ? '저장 중…' : '특약 등록'}
          </button>
        </div>
      ) : null}
    </div>
  );
};
