import React from 'react';
import { Globe2, FileText, Link2, TrendingUp, ExternalLink, Sparkles } from 'lucide-react';
import { ToolSubTab, Project } from '../../types';
import { Button } from '../common/Button';

export interface SeoToolsHubProps {
  project: Project;
  onSelectTool: (tool: ToolSubTab) => void;
  tools?: Record<string, Record<string, unknown>>;
}

const ICONS: Record<string, React.ReactNode> = {
  catchdomain: <Globe2 className="w-7 h-7 text-[#2563EB]" />,
  content: <FileText className="w-7 h-7 text-[#2563EB]" />,
  backlink: <Link2 className="w-7 h-7 text-[#2563EB]" />,
  traffic: <TrendingUp className="w-7 h-7 text-[#2563EB]" />,
};

function metricLine(tool: Record<string, unknown> | undefined, key: string) {
  const summary = (tool?.summary || {}) as Record<string, unknown>;
  if (key === 'catchdomain') {
    return summary.selectedDomain
      ? `선택 도메인 ${String(summary.selectedDomain)}`
      : summary.candidateCount != null
        ? `후보 ${String(summary.candidateCount)}`
        : '데이터 없음';
  }
  if (key === 'content') {
    return summary.publishedCount != null ? `발행 ${String(summary.publishedCount)}편` : '데이터 없음';
  }
  if (key === 'backlink') {
    return summary.referringDomains != null ? `RD ${String(summary.referringDomains)}` : '데이터 없음';
  }
  if (key === 'traffic') {
    return summary.deliveredVisits != null ? `캠페인 방문 ${String(summary.deliveredVisits)}` : '데이터 없음';
  }
  return '데이터 없음';
}

export const SeoToolsHub: React.FC<SeoToolsHubProps> = ({ project, onSelectTool, tools = {} }) => {
  const keys: ToolSubTab[] = ['catchdomain', 'content', 'backlink', 'traffic'];
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 text-white">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-300 mb-2">
          <Sparkles className="w-3.5 h-3.5" /> SEO Tools Control Center
        </div>
        <h2 className="text-xl font-black">독립 SEO 도구 연결 · {project.name}</h2>
        <p className="text-sm text-slate-300 mt-1">외부 도구를 다시 만들지 않습니다. 링크·수동 결과·조회만 담당합니다.</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {keys.map((id) => {
          const t = tools[id] || {};
          const url = String(t.url || '');
          const ui = String(t.uiStatus || 'NOT CONNECTED');
          const stale = Boolean(t.stale);
          return (
            <div key={id} className="bg-white border border-[#E2E8F0] rounded-3xl p-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  {ICONS[id]}
                  <div>
                    <div className="font-black">{String(t.name || id)}</div>
                    <div className="text-[10px] font-bold text-slate-500">{ui}</div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-600">{metricLine(t, id)}</p>
              {stale ? <p className="text-xs text-amber-700">최종 동기화 오래됨 — 업데이트 필요</p> : null}
              <p className="text-[11px] text-slate-400">출처: {String(t.source || 'Not Configured')}</p>
              <div className="flex flex-wrap gap-2">
                {url ? (
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="primary" leftIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                      {String(t.name || id)} 열기
                    </Button>
                  </a>
                ) : (
                  <Button size="sm" variant="outline" disabled>
                    URL 미설정
                  </Button>
                )}
                <Button size="sm" variant="outline" onClick={() => onSelectTool(id)}>
                  수동 결과 기록
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
