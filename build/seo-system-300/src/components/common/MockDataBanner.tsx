import React from 'react';
import { Beaker, UserCheck } from 'lucide-react';

export const MockDataBanner: React.FC<{ gscState?: string; ga4State?: string; aiConfigured?: boolean }> = ({
  gscState = '연결 필요',
  ga4State = '연결 필요',
  aiConfigured = false,
}) => {
  const gscLive = gscState === 'ready';
  const ga4Live = ga4State === 'ready';
  const liveBits = ['회원', '프로젝트', '홈페이지', 'Roadmap', 'Mission', 'Activity'];
  if (gscLive) liveBits.push('GSC');
  if (ga4Live) liveBits.push('GA4');
  if (gscLive && ga4Live) liveBits.push('SEO 성과');
  const pending: string[] = [];
  pending.push(aiConfigured ? 'AI Coach (설정됨·데이터 대기)' : 'AI Coach 준비중');
  pending.push('CatchDomain/Content/Backlink/Traffic LINK 또는 미설정');
  return (
    <div
      role="status"
      className="sticky top-0 z-50 bg-amber-400 text-slate-900 text-[11px] sm:text-xs font-bold px-3 py-1.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 border-b border-amber-500"
    >
      <span className="inline-flex items-center gap-1">
        <UserCheck className="w-3.5 h-3.5 shrink-0" />
        운영 데이터: {liveBits.join(' · ')}
      </span>
      <span className="text-amber-800">·</span>
      <span className="inline-flex items-center gap-1">
        <Beaker className="w-3.5 h-3.5 shrink-0" />
        GSC: {gscLive ? 'LIVE' : '연결 필요'} · GA4: {ga4Live ? 'LIVE' : '연결 필요'}
      </span>
      <span className="text-amber-800">·</span>
      <span>{pending.join(' · ')}</span>
    </div>
  );
};
