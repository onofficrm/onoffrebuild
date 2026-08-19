import React, { useEffect, useState } from 'react';
import { adminListProjects, adminListWebsiteOrders } from '../../services/adminLiveService';
import type { ApiProject } from '../../services/projectService';
import type { ApiWebsiteOrder } from '../../services/websiteOrderService';
import { WEBSITE_ORDER_STATUS_LABEL } from '../../constants/seoSystem300';
import { ApiRequestError } from '../../services/apiClient';

export const AdminLiveReadonlyPanel: React.FC = () => {
  const [projects, setProjects] = useState<ApiProject[]>([]);
  const [orders, setOrders] = useState<ApiWebsiteOrder[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    setError('');
    Promise.all([adminListProjects(), adminListWebsiteOrders()])
      .then(([p, o]) => {
        setProjects(p);
        setOrders(o);
      })
      .catch((err) => {
        setProjects([]);
        setOrders([]);
        setError(err instanceof ApiRequestError ? err.message : '불러오기 실패. 다시 시도해주세요.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-3xl p-5 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-black text-slate-900">LIVE 프로젝트 / 홈페이지 주문 (읽기 전용)</h2>
          <p className="text-xs text-slate-500">GNUBoard DB에 저장된 실제 데이터입니다. Kanban도 LIVE 주문 상태와 연결됩니다.</p>
        </div>
        <button type="button" className="text-xs font-bold text-blue-600" onClick={load}>
          새로고침
        </button>
      </div>
      {loading ? <p className="text-xs text-slate-500">불러오는 중...</p> : null}
      {error ? (
        <div className="text-xs text-rose-700">
          {error}{' '}
          <button type="button" className="underline font-bold" onClick={load}>
            다시 시도
          </button>
        </div>
      ) : null}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <h3 className="text-xs font-bold text-slate-600 mb-2">Projects ({projects.length})</h3>
          {projects.length === 0 && !loading && !error ? (
            <p className="text-xs text-slate-400">아직 생성된 프로젝트가 없습니다.</p>
          ) : (
            <ul className="space-y-1 max-h-48 overflow-auto text-xs">
              {projects.map((p) => (
                <li key={p.id} className="border border-slate-100 rounded-lg px-2 py-1.5">
                  #{p.id} {p.name} · {p.mbId} · {p.domain || '도메인 미정'}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h3 className="text-xs font-bold text-slate-600 mb-2">Website Orders ({orders.length})</h3>
          {orders.length === 0 && !loading && !error ? (
            <p className="text-xs text-slate-400">아직 생성된 주문이 없습니다.</p>
          ) : (
            <ul className="space-y-1 max-h-48 overflow-auto text-xs">
              {orders.map((o) => (
                <li key={o.id} className="border border-slate-100 rounded-lg px-2 py-1.5">
                  #{o.id} {o.siteName || o.projectName || '이름 없음'} · {o.mbId} ·{' '}
                  {WEBSITE_ORDER_STATUS_LABEL[o.status] || o.status}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
