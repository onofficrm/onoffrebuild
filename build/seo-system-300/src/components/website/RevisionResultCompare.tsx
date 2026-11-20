import React from 'react';
import { ExternalLink } from 'lucide-react';
import { RevisionMarkPreview } from './RevisionMarkPreview';
import type { RevisionAnnotation } from '../../types/revisionAnnotation';
import type { RevisionResultPreview } from '../../types/revisionWork';

type Props = {
  annotation?: RevisionAnnotation | null;
  result?: RevisionResultPreview | null;
  feedbackUrl?: string;
  feedbackNote?: string;
};

export const RevisionResultCompare: React.FC<Props> = ({
  annotation,
  result,
  feedbackUrl = '',
  feedbackNote = '',
}) => {
  const afterUrl = result?.url || feedbackUrl;
  const afterSnap = result?.snapshotUrl || '';
  const note = result?.note || feedbackNote;

  return (
    <div className="space-y-2">
      <p className="text-xs font-bold text-slate-700">요청한 자리와 결과를 같은 표시로 비교하세요</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-2 space-y-1">
          <p className="text-[11px] font-bold text-slate-500">요청한 자리</p>
          <RevisionMarkPreview annotation={annotation} compact />
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-2 space-y-2">
          <p className="text-[11px] font-bold text-blue-800">작업 후</p>
          {afterSnap ? (
            <img src={afterSnap} alt="작업 결과" className="w-full rounded-lg border border-blue-100 bg-white object-contain max-h-64" />
          ) : afterUrl ? (
            <iframe
              title="작업 후 페이지"
              src={afterUrl}
              className="w-full aspect-video rounded-lg border border-blue-100 bg-white"
              sandbox="allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
            />
          ) : (
            <p className="text-xs text-slate-500 py-8 text-center">결과 화면이 아직 없습니다.</p>
          )}
          {note ? <p className="text-xs text-blue-900 whitespace-pre-wrap">{note}</p> : null}
          {(result?.changedFiles || []).length > 0 ? (
            <div className="rounded-lg border border-blue-100 bg-white px-2 py-1.5">
              <p className="text-[10px] font-bold text-blue-800 mb-1">
                변경 파일 {result?.changedFiles?.length}개
                {result?.cwd ? ` · ${result.cwd}` : ''}
              </p>
              <pre className="max-h-24 overflow-auto text-[10px] text-slate-700 whitespace-pre-wrap">
                {(result?.changedFiles || []).join('\n')}
              </pre>
            </div>
          ) : null}
          {afterUrl ? (
            <a
              href={afterUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700"
            >
              결과 페이지 열기 <ExternalLink className="h-3 w-3" />
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
};
