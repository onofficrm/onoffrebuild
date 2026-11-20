import React from 'react';
import { ExternalLink } from 'lucide-react';
import type { RevisionAnnotation } from '../../types/revisionAnnotation';

type Props = {
  annotation: RevisionAnnotation | null | undefined;
  compact?: boolean;
};

export const RevisionMarkPreview: React.FC<Props> = ({ annotation, compact = false }) => {
  if (!annotation) return null;
  const box = annotation.box;
  const mobile = annotation.device === 'mobile';

  return (
    <div className="space-y-2">
      <div
        className={`relative mx-auto overflow-hidden rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] ${
          mobile ? 'max-w-[280px]' : 'max-w-3xl'
        }`}
      >
        <div className={`relative ${compact ? 'aspect-[16/9]' : 'aspect-[16/11]'}`}>
          {annotation.snapshotUrl ? (
            <img
              src={annotation.snapshotUrl}
              alt={annotation.label || '찍은 화면'}
              className="pointer-events-none absolute inset-0 h-full w-full bg-white object-contain"
            />
          ) : annotation.pageUrl ? (
            <iframe
              title="표시한 홈페이지"
              src={annotation.pageUrl}
              className="pointer-events-none absolute inset-0 h-full w-full bg-white"
              sandbox="allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center px-4 text-center text-xs text-[#64748B]">
              주소 없이 구역만 남아 있습니다.
            </div>
          )}
          {box ? (
            <div
              className="absolute rounded-md border-2 border-[#2563EB] bg-[#2563EB]/15"
              style={{
                left: `${box.x}%`,
                top: `${box.y}%`,
                width: `${box.w}%`,
                height: `${box.h}%`,
              }}
            />
          ) : null}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#64748B]">
        <span>
          {annotation.label}
          {annotation.device === 'mobile' ? ' · 모바일' : annotation.device === 'pc' ? ' · PC' : ''}
          {annotation.snapshotUrl ? ' · 찍은 화면' : ''}
        </span>
        {annotation.pageUrl ? (
          <a
            href={annotation.pageUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 font-bold text-[#2563EB]"
          >
            새 창에서 열기 <ExternalLink className="h-3 w-3" />
          </a>
        ) : null}
      </div>
    </div>
  );
};
