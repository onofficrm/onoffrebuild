import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, X, ExternalLink } from 'lucide-react';

export interface HelpTooltipProps {
  term: string;
  explanation: string;
  example?: string;
  learnMoreLink?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const HelpTooltip: React.FC<HelpTooltipProps> = ({
  term,
  explanation,
  example,
  learnMoreLink,
  position = 'top',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <span className={`inline-flex items-center relative align-middle ${className}`} ref={tooltipRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        onMouseEnter={() => setIsOpen(true)}
        className="text-[#94A3B8] hover:text-[#2563EB] transition-colors p-0.5 rounded-full hover:bg-blue-50 cursor-pointer focus:outline-none"
        title={`${term} 용어 설명 보기`}
        aria-label={`${term} 용어 설명`}
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>

      {isOpen && (
        <div
          className={`absolute z-50 w-72 sm:w-80 p-3.5 bg-slate-900 text-white rounded-2xl shadow-xl border border-slate-700 text-xs animate-in fade-in zoom-in-95 duration-150 ${
            position === 'top'
              ? 'bottom-full left-1/2 -translate-x-1/2 mb-2'
              : position === 'bottom'
              ? 'top-full left-1/2 -translate-x-1/2 mt-2'
              : position === 'left'
              ? 'right-full top-1/2 -translate-y-1/2 mr-2'
              : 'left-full top-1/2 -translate-y-1/2 ml-2'
          }`}
          onMouseLeave={() => setIsOpen(false)}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-slate-800">
            <span className="font-bold text-blue-400 flex items-center gap-1 text-[11px] uppercase tracking-wide">
              <span>💡 초보자 SEO 가이드</span>
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-0.5 rounded"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          {/* Term Title */}
          <div className="mt-1.5 font-bold text-sm text-white">{term}</div>

          {/* Explanation */}
          <p className="mt-1 text-slate-300 text-xs leading-relaxed">{explanation}</p>

          {/* Example if provided */}
          {example && (
            <div className="mt-2 p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-[11px] text-slate-300">
              <span className="font-bold text-blue-300 block mb-0.5">예시 :</span>
              {example}
            </div>
          )}

          {/* Arrow */}
          <div
            className={`absolute w-2 h-2 bg-slate-900 border-slate-700 transform rotate-45 ${
              position === 'top'
                ? 'top-full -mt-1 left-1/2 -translate-x-1/2 border-r border-b'
                : position === 'bottom'
                ? 'bottom-full -mb-1 left-1/2 -translate-x-1/2 border-l border-t'
                : position === 'left'
                ? 'left-full -ml-1 top-1/2 -translate-y-1/2 border-t border-r'
                : 'right-full -mr-1 top-1/2 -translate-y-1/2 border-b border-l'
            }`}
          />
        </div>
      )}
    </span>
  );
};
