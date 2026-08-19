import React, { useState } from 'react';
import { ArrowLeft, History } from 'lucide-react';
import { ToolSubTab, Project, SeoActivityTimelineItem } from '../../types';
import { Button } from '../common/Button';
import { SeoToolsHub } from './SeoToolsHub';
import { SeoActivityHistory } from '../history/SeoActivityHistory';
import { ApiRequestError } from '../../services/apiClient';
import { applyCatchDomain, saveManualToolResult, type ToolKey } from '../../services/toolsService';

export interface ToolsViewProps {
  activeSubTab: ToolSubTab;
  setActiveSubTab: (tab: ToolSubTab) => void;
  project: Project;
  activityItems?: SeoActivityTimelineItem[];
  onAddActivity?: () => void;
  tools?: Record<string, Record<string, unknown>>;
  onReloadTools?: () => void;
}

export type ToolsMainViewMode = 'hub' | 'detail' | 'history';

export const ToolsView: React.FC<ToolsViewProps> = ({
  activeSubTab,
  setActiveSubTab,
  project,
  activityItems = [],
  tools = {},
  onReloadTools,
}) => {
  const [viewMode, setViewMode] = useState<ToolsMainViewMode>('hub');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [publishedCount, setPublishedCount] = useState('');
  const [contentUrl, setContentUrl] = useState('');
  const [rd, setRd] = useState('');
  const [backlinks, setBacklinks] = useState('');
  const [delivered, setDelivered] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');

  const save = async (toolKey: ToolKey, payload: Record<string, unknown>) => {
    setError('');
    try {
      await saveManualToolResult(Number(project.id), toolKey, payload);
      setInfo('수동 결과를 저장했습니다. 외부 주문/발행은 실행하지 않습니다.');
      onReloadTools?.();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : '저장 실패. 다시 시도해주세요.');
    }
  };

  if (viewMode === 'history') {
    return (
      <div className="space-y-4">
        <Button variant="outline" size="sm" onClick={() => setViewMode('hub')} leftIcon={<ArrowLeft className="w-4 h-4" />}>
          허브로
        </Button>
        <SeoActivityHistory project={project} activityItems={activityItems} />
      </div>
    );
  }

  if (viewMode === 'hub') {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={() => setViewMode('history')} leftIcon={<History className="w-4 h-4" />}>
            작업 기록
          </Button>
        </div>
        <SeoToolsHub project={project} onSelectTool={(t) => { setActiveSubTab(t); setViewMode('detail'); }} tools={tools} />
      </div>
    );
  }

  const t = tools[activeSubTab] || {};
  const url = String(t.url || '');

  return (
    <div className="space-y-4">
      <Button variant="outline" size="sm" onClick={() => setViewMode('hub')} leftIcon={<ArrowLeft className="w-4 h-4" />}>
        도구 허브
      </Button>
      {error ? <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-3 text-sm">{error}</div> : null}
      {info ? <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-3 text-sm">{info}</div> : null}
      <div className="bg-white border rounded-3xl p-6 space-y-3">
        <h2 className="text-lg font-black">{String(t.name || activeSubTab)}</h2>
        <p className="text-xs font-bold text-slate-500">{String(t.uiStatus || 'NOT CONNECTED')} · LIVE API 아님</p>
        {url ? (
          <a className="text-sm text-blue-700 font-bold" href={url} target="_blank" rel="noopener noreferrer">
            외부 도구 열기
          </a>
        ) : (
          <p className="text-sm text-slate-500">설정 필요: 서버에 도구 URL이 없습니다.</p>
        )}
        <p className="text-xs text-slate-400">동기화 API: 미지원 (unsupported). 스크래핑하지 않습니다.</p>

        {activeSubTab === 'catchdomain' ? (
          <div className="space-y-2">
            <input className="w-full border rounded-xl px-3 py-2 text-sm" placeholder="선택한 도메인 example.com" value={selectedDomain} onChange={(e) => setSelectedDomain(e.target.value)} />
            <Button
              size="sm"
              onClick={() => void save('catchdomain', { selectedDomain, source: 'manual' })}
            >
              선택한 도메인 등록
            </Button>
            {selectedDomain ? (
              <Button
                size="sm"
                variant="outline"
                onClick={async () => {
                  if (!window.confirm(`CatchDomain에서 선택한 도메인 ${selectedDomain}을 이 프로젝트 도메인으로 설정할까요?`)) return;
                  try {
                    await applyCatchDomain(Number(project.id), selectedDomain, true);
                    setInfo('프로젝트 도메인을 업데이트했습니다.');
                    onReloadTools?.();
                  } catch (err) {
                    setError(err instanceof ApiRequestError ? err.message : '변경 실패');
                  }
                }}
              >
                프로젝트 도메인으로 설정
              </Button>
            ) : null}
          </div>
        ) : null}

        {activeSubTab === 'content' ? (
          <div className="space-y-2">
            <input className="w-full border rounded-xl px-3 py-2 text-sm" placeholder="발행 콘텐츠 수" value={publishedCount} onChange={(e) => setPublishedCount(e.target.value)} />
            <input className="w-full border rounded-xl px-3 py-2 text-sm" placeholder="최근 발행 URL (선택)" value={contentUrl} onChange={(e) => setContentUrl(e.target.value)} />
            <Button size="sm" onClick={() => void save('content', { publishedCount: Number(publishedCount) || 0, url: contentUrl })}>
              수동 결과 저장
            </Button>
          </div>
        ) : null}

        {activeSubTab === 'backlink' ? (
          <div className="space-y-2">
            <p className="text-xs text-amber-800">외부 백링크 주문/결제는 실행하지 않습니다.</p>
            <input className="w-full border rounded-xl px-3 py-2 text-sm" placeholder="Referring Domains" value={rd} onChange={(e) => setRd(e.target.value)} />
            <input className="w-full border rounded-xl px-3 py-2 text-sm" placeholder="Backlinks" value={backlinks} onChange={(e) => setBacklinks(e.target.value)} />
            <Button size="sm" onClick={() => void save('backlink', { referringDomains: Number(rd) || 0, backlinks: Number(backlinks) || 0 })}>
              수동 결과 저장
            </Button>
          </div>
        ) : null}

        {activeSubTab === 'traffic' ? (
          <div className="space-y-2">
            <p className="text-xs text-amber-800">캠페인 방문수는 GA4 Organic Sessions와 다릅니다. 외부 트래픽 실행은 하지 않습니다.</p>
            <input className="w-full border rounded-xl px-3 py-2 text-sm" placeholder="Delivered visits" value={delivered} onChange={(e) => setDelivered(e.target.value)} />
            <Button size="sm" onClick={() => void save('traffic', { deliveredVisits: Number(delivered) || 0 })}>
              수동 결과 저장
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
};
