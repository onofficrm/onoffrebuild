import React from 'react';
import { Link2 } from 'lucide-react';

/** Compact connection status — not a construction/debug banner. */
export const MockDataBanner: React.FC<{ gscState?: string; ga4State?: string; aiConfigured?: boolean }> = ({
  gscState = '연결 필요',
  ga4State = '연결 필요',
  aiConfigured = false,
}) => {
  const gscLive = gscState === 'ready';
  const ga4Live = ga4State === 'ready';

  return (
    <div
      role="status"
      className="sticky top-0 z-50 border-b border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1.5 text-[11px] font-semibold text-[#64748B] sm:text-xs"
    >
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-center gap-x-3 gap-y-1">
        <span className="inline-flex items-center gap-1.5 text-[#0F172A]">
          <Link2 className="h-3.5 w-3.5 text-[#2563EB]" />
          연동 상태
        </span>
        <span className="text-[#CBD5E1]">|</span>
        <span>
          GSC{' '}
          <strong className={gscLive ? 'text-emerald-600' : 'text-[#64748B]'}>
            {gscLive ? '연결됨' : '미연결'}
          </strong>
        </span>
        <span>
          GA4{' '}
          <strong className={ga4Live ? 'text-emerald-600' : 'text-[#64748B]'}>
            {ga4Live ? '연결됨' : '미연결'}
          </strong>
        </span>
        <span>
          AI Coach{' '}
          <strong className={aiConfigured ? 'text-emerald-600' : 'text-[#64748B]'}>
            {aiConfigured ? '준비됨' : '설정 필요'}
          </strong>
        </span>
      </div>
    </div>
  );
};
