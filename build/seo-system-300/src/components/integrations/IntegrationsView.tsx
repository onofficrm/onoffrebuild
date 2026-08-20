import React, { useEffect, useState } from 'react';
import { Link2, RefreshCw } from 'lucide-react';
import { Button } from '../common/Button';
import { ApiRequestError } from '../../services/apiClient';
import {
  disconnectGoogle,
  getGoogleConnection,
  listGa4Properties,
  listGscSites,
  selectGa4Property,
  selectGscSite,
  startGoogleConnect,
  syncGa4,
  syncGsc,
} from '../../services/integrationsService';

export const IntegrationsView: React.FC<{ projectId: string | null; projectDomain?: string }> = ({
  projectId,
  projectDomain,
}) => {
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState(false);
  const [status, setStatus] = useState('disconnected');
  const [email, setEmail] = useState('');
  const [sites, setSites] = useState<Array<{ siteUrl: string; recommended: boolean; mismatch: boolean }>>([]);
  const [ga4, setGa4] = useState<Array<{ propertyId: string; displayName: string; accountName: string }>>([]);
  const [manualId, setManualId] = useState('');
  const [pickedGsc, setPickedGsc] = useState('');
  const [tablesReady, setTablesReady] = useState(true);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const g = await getGoogleConnection();
      setConfigured(Boolean(g.configured || g.connection?.configured));
      setTablesReady(g.tablesReady !== false);
      setStatus(g.connection?.status || 'disconnected');
      setEmail(g.connection?.googleEmailMasked || '');
      if (projectId && g.connection?.connected) {
        const [s, p] = await Promise.all([listGscSites(Number(projectId)), listGa4Properties(Number(projectId))]);
        setSites(s.sites || []);
        setGa4(p.properties || []);
      } else {
        setSites([]);
        setGa4([]);
      }
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : '불러오기 실패. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [projectId]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const google = params.get('google');
    if (!google) return;
    const messages: Record<string, string> = {
      connected: 'Google 계정이 연결되었습니다. GSC 사이트와 GA4 속성을 선택하세요.',
      denied: 'Google 연결이 취소되었습니다.',
      state_mismatch: '보안 검증에 실패했습니다. 다시 연결해주세요.',
      missing_code: '인증 코드가 없습니다. 다시 연결해주세요.',
      not_configured: '서버에 Google API 설정이 필요합니다.',
      token_failed: '토큰 교환에 실패했습니다. 다시 연결해주세요.',
      login_required: '로그인 후 다시 연결해주세요.',
    };
    if (google === 'connected') {
      setInfo(messages.connected);
      setError('');
    } else {
      setError(messages[google] || 'Google 연결에 실패했습니다.');
    }
    params.delete('google');
    const next = `${window.location.pathname}${params.toString() ? `?${params}` : ''}${window.location.hash}`;
    window.history.replaceState({}, '', next);
  }, []);

  if (!projectId) {
    return (
      <div className="bg-white border rounded-3xl p-10 text-center">
        <h1 className="text-lg font-black">먼저 SEO 프로젝트를 만들어주세요.</h1>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-2">
          <Link2 className="w-5 h-5 text-[#2563EB]" />
          <h1 className="text-xl font-black">SEO 데이터 연결</h1>
        </div>
        <p className="text-sm text-slate-500">Google Search Console과 GA4는 서버 OAuth로만 연결됩니다. 현재 프로젝트: {projectDomain || projectId}</p>
      </div>

      {error ? (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-4 text-sm flex justify-between">
          <span>{error}</span>
          <button type="button" className="font-bold underline" onClick={() => void load()}>
            다시 시도
          </button>
        </div>
      ) : null}
      {info ? <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-3 text-sm">{info}</div> : null}
      {loading ? <p className="text-sm text-slate-500">불러오는 중...</p> : null}

      {!configured ? (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 text-sm font-bold text-amber-900">Google API 설정 필요</div>
      ) : null}
      {configured && !tablesReady ? (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 text-sm font-bold text-amber-900">
          SEO 성과 DB가 아직 준비되지 않았습니다. (연결됨으로 표시하지 않습니다)
        </div>
      ) : null}

      <div className="bg-white border rounded-3xl p-6 space-y-3">
        <h2 className="font-black">Google 계정</h2>
        <p className="text-sm text-slate-600">상태: {status === 'connected' ? '연결됨' : status === 'reauth_required' ? '다시 연결 필요' : '연결되지 않음'}</p>
        {email ? <p className="text-xs text-slate-500">{email}</p> : null}
        {status === 'connected' ? (
          <Button
            variant="outline"
            onClick={async () => {
              try {
                const res = await disconnectGoogle();
                setInfo(res.message);
                await load();
              } catch (err) {
                setError(err instanceof ApiRequestError ? err.message : '연결 해제에 실패했습니다.');
              }
            }}
          >
            연결 해제
          </Button>
        ) : (
          <Button
            variant="primary"
            disabled={!configured}
            onClick={async () => {
              try {
                const res = await startGoogleConnect();
                window.location.href = res.authUrl;
              } catch (err) {
                setError(err instanceof ApiRequestError ? err.message : '연결을 시작할 수 없습니다.');
              }
            }}
          >
            Google 연결
          </Button>
        )}
        <p className="text-xs text-slate-400">연결을 해제해도 기존에 수집된 SEO 통계는 유지됩니다.</p>
      </div>

      <div className="bg-white border rounded-3xl p-6 space-y-3">
        <h2 className="font-black">Google Search Console</h2>
        {sites.length === 0 ? <p className="text-sm text-slate-500">연결 후 속성을 선택할 수 있습니다.</p> : null}
        {sites.map((s) => (
          <label key={s.siteUrl} className="flex items-start gap-2 text-sm">
            <input type="radio" name="gsc" checked={pickedGsc === s.siteUrl} onChange={() => setPickedGsc(s.siteUrl)} />
            <span>
              {s.siteUrl}
              {s.recommended ? <span className="ml-2 text-[10px] font-black text-blue-700">추천</span> : null}
              {s.mismatch ? <span className="block text-xs text-amber-700">선택한 Search Console 사이트와 프로젝트 도메인이 다릅니다.</span> : null}
            </span>
          </label>
        ))}
        <div className="flex gap-2">
          <Button
            variant="primary"
            disabled={!pickedGsc}
            onClick={async () => {
              const site = sites.find((x) => x.siteUrl === pickedGsc);
              if (site?.mismatch && !window.confirm('선택한 Search Console 사이트와 프로젝트 도메인이 다릅니다. 계속 연결하시겠습니까?')) {
                return;
              }
              try {
                await selectGscSite(Number(projectId), pickedGsc);
                setInfo('Search Console 속성을 연결했습니다.');
                await load();
              } catch (err) {
                setError(err instanceof ApiRequestError ? err.message : '저장 실패');
              }
            }}
          >
            속성 연결
          </Button>
          <Button
            variant="outline"
            onClick={async () => {
              try {
                await syncGsc(Number(projectId));
                setInfo('Search Console 동기화를 요청했습니다.');
              } catch (err) {
                setError(err instanceof ApiRequestError ? err.message : '동기화 실패');
              }
            }}
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" /> 데이터 새로고침
          </Button>
        </div>
      </div>

      <div className="bg-white border rounded-3xl p-6 space-y-3">
        <h2 className="font-black">GA4</h2>
        <p className="text-xs text-slate-500">자연검색 방문(Organic Sessions) = sessionDefaultChannelGroup이 Organic Search인 sessions</p>
        {ga4.map((p) => (
          <button
            key={p.propertyId}
            type="button"
            className="block w-full text-left text-sm border rounded-xl px-3 py-2 hover:border-blue-500"
            onClick={async () => {
              try {
                await selectGa4Property(Number(projectId), p.propertyId, p.displayName);
                setInfo('GA4 속성을 연결했습니다.');
                await load();
              } catch (err) {
                setError(err instanceof ApiRequestError ? err.message : '저장 실패');
              }
            }}
          >
            {p.accountName} / {p.displayName} ({p.propertyId})
          </button>
        ))}
        <div className="flex gap-2 items-center">
          <input
            className="flex-1 border rounded-xl px-3 py-2 text-sm"
            placeholder="Property ID 직접 입력"
            value={manualId}
            onChange={(e) => setManualId(e.target.value)}
          />
          <Button
            variant="outline"
            onClick={async () => {
              try {
                await selectGa4Property(Number(projectId), manualId);
                setInfo('GA4 속성을 연결했습니다.');
              } catch (err) {
                setError(err instanceof ApiRequestError ? err.message : '저장 실패');
              }
            }}
          >
            연결
          </Button>
          <Button
            variant="outline"
            onClick={async () => {
              try {
                await syncGa4(Number(projectId));
                setInfo('GA4 동기화를 요청했습니다.');
              } catch (err) {
                setError(err instanceof ApiRequestError ? err.message : '동기화 실패');
              }
            }}
          >
            새로고침
          </Button>
        </div>
      </div>
    </div>
  );
};
