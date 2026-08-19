import React, { useEffect, useState } from 'react';
import { Button } from '../common/Button';
import { ApiRequestError } from '../../services/apiClient';
import { adminDiagnostics, adminIntegrations, adminSyncMetrics } from '../../services/integrationsService';
import { adminAiMonitor, adminToolHealth } from '../../services/toolsService';

export const AdminIntegrationsView: React.FC = () => {
  const [filter, setFilter] = useState('');
  const [items, setItems] = useState<Array<Record<string, unknown>>>([]);
  const [diag, setDiag] = useState<{
    coreDb: string;
    roadmapDb: string;
    metricsDb: string;
    toolsDb?: string;
    googleConfigured: boolean;
    aiConfigured?: boolean;
  } | null>(null);
  const [healthItems, setHealthItems] = useState<Array<Record<string, unknown>>>([]);
  const [aiItems, setAiItems] = useState<Array<Record<string, unknown>>>([]);
  const [error, setError] = useState('');

  const load = async () => {
    setError('');
    try {
      const [d, list, health, ai] = await Promise.all([
        adminDiagnostics(),
        adminIntegrations(filter),
        adminToolHealth().catch(() => []),
        adminAiMonitor().catch(() => []),
      ]);
      setDiag(d);
      setItems(list);
      setHealthItems(health);
      setAiItems(ai);
    } catch (err) {
      setItems([]);
      setError(err instanceof ApiRequestError ? err.message : '불러오기 실패. 다시 시도해주세요.');
    }
  };

  useEffect(() => {
    void load();
  }, [filter]);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-black">SEO 데이터 연결 현황</h1>
      {diag ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="border rounded-2xl p-3">Core DB: {diag.coreDb}</div>
          <div className="border rounded-2xl p-3">Roadmap DB: {diag.roadmapDb}</div>
          <div className="border rounded-2xl p-3">Metrics DB: {diag.metricsDb}</div>
          <div className="border rounded-2xl p-3">Tools DB: {diag.toolsDb || 'missing'}</div>
          <div className="border rounded-2xl p-3">Google API: {diag.googleConfigured ? '설정됨' : '미설정'}</div>
          <div className="border rounded-2xl p-3">AI: {diag.aiConfigured ? '설정됨' : '미설정'}</div>
        </div>
      ) : null}
      {error ? (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-3 text-sm">{error}</div>
      ) : null}
      <div className="flex flex-wrap gap-2 text-xs font-bold">
        {['', 'gsc_missing', 'ga4_missing', 'sync_failed', 'stale'].map((f) => (
          <button
            key={f || 'all'}
            type="button"
            className={`px-3 py-1 rounded-full border ${filter === f ? 'bg-blue-600 text-white' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === '' ? '전체' : f === 'gsc_missing' ? 'GSC 미연결' : f === 'ga4_missing' ? 'GA4 미연결' : f === 'sync_failed' ? 'Sync 실패' : '7일 이상 Sync 없음'}
          </button>
        ))}
      </div>
      {items.length === 0 ? <p className="text-sm text-slate-500">표시할 연결 현황이 없습니다.</p> : null}
      {items.map((it) => (
        <div key={String(it.projectId)} className="bg-white border rounded-2xl p-4 text-sm flex flex-wrap justify-between gap-2">
          <div>
            <div className="font-black">{String(it.projectName)}</div>
            <div className="text-xs text-slate-500">
              {String(it.mbId)} · {String(it.domain)} · GSC {String(it.gsc)} · GA4 {String(it.ga4)} · 마지막 {String(it.lastSyncAt || '-')}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={async () => {
                try {
                  await adminSyncMetrics(Number(it.projectId), 'GOOGLE_SEARCH_CONSOLE');
                  await load();
                } catch (err) {
                  setError(err instanceof ApiRequestError ? err.message : '동기화 실패');
                }
              }}
            >
              GSC Sync
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={async () => {
                try {
                  await adminSyncMetrics(Number(it.projectId), 'GOOGLE_ANALYTICS');
                  await load();
                } catch (err) {
                  setError(err instanceof ApiRequestError ? err.message : '동기화 실패');
                }
              }}
            >
              GA4 Sync
            </Button>
          </div>
        </div>
      ))}
      <h2 className="text-lg font-black pt-4">Tool Integration Health</h2>
      {healthItems.map((it) => (
        <div key={`h-${String(it.projectId)}`} className="bg-white border rounded-2xl p-3 text-xs">
          {String(it.projectName)} · CD {String(it.catchdomain)} · Content {String(it.content)} · BL {String(it.backlink)} ·
          Traffic {String(it.traffic)} · GSC {String(it.gsc)} · GA4 {String(it.ga4)} · AI {String(it.ai)}
        </div>
      ))}
      <h2 className="text-lg font-black pt-4">AI 사용량 (메타데이터만)</h2>
      {aiItems.map((it) => (
        <div key={`a-${String(it.projectId)}`} className="bg-white border rounded-2xl p-3 text-xs">
          {String(it.projectName)} · {String(it.provider || '-')} · {String(it.status)} · {String(it.lastAnalysisAt || '-')} ·
          tokens {String(it.inputTokens ?? '-')} / {String(it.outputTokens ?? '-')}
        </div>
      ))}
    </div>
  );
};
