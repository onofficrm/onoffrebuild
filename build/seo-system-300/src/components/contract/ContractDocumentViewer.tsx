import React from 'react';
import './contractDocument.css';

type ContractDocumentViewerProps = {
  html: string;
  className?: string;
};

export const ContractDocumentViewer: React.FC<ContractDocumentViewerProps> = ({ html, className = '' }) => {
  if (!html.trim()) {
    return (
      <div className={`rounded-xl border border-slate-700 bg-slate-900/80 p-8 text-center text-sm text-slate-400 ${className}`}>
        표시할 계약서 본문이 아직 없습니다.
      </div>
    );
  }

  return (
    <div
      className={`contract-document-paper max-h-[min(70vh,640px)] overflow-y-auto custom-scrollbar ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
