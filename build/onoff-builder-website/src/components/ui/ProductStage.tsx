import type { ReactNode } from 'react';

interface ProductStageProps {
  children: ReactNode;
  ariaLabel: string;
  title?: string;
  demoLabel?: string;
  footnote?: string;
  tone?: 'light' | 'dark';
  padding?: 'none' | 'compact' | 'default';
  className?: string;
}

const PADDING_CLASSES = {
  none: '',
  compact: 'p-4 sm:p-5',
  default: 'p-5 sm:p-6',
};

/**
 * Standardized 18px-radius product UI showcase frame with subtle elevation and unboxed demo/status caption.
 */
export function ProductStage({
  children,
  ariaLabel,
  title,
  demoLabel = '시연 화면',
  footnote,
  tone = 'light',
  padding = 'default',
  className = '',
}: ProductStageProps) {
  const isDark = tone === 'dark';

  const frameClass = isDark
    ? 'border-white/10 bg-slate-950 text-white'
    : 'border-slate-200 bg-white text-slate-950 shadow-[var(--shadow-stage)]';

  const barClass = isDark
    ? 'border-white/10 bg-white/[0.03] text-slate-300'
    : 'border-slate-200 bg-slate-50 text-slate-600';

  const mutedClass = isDark ? 'text-slate-400' : 'text-slate-500';

  return (
    <figure
      role="region"
      aria-label={ariaLabel}
      className={`overflow-hidden rounded-[18px] border ${frameClass} ${className}`.trim()}
    >
      {(title || demoLabel) && (
        <div
          className={`flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3 sm:px-5 ${barClass}`}
        >
          <div className="flex min-w-0 items-center gap-2.5">
            <span
              aria-hidden="true"
              className="flex shrink-0 items-center gap-1.5"
            >
              <span
                className={`h-2 w-2 rounded-full ${isDark ? 'bg-white/20' : 'bg-[#D0D5DD]'}`}
              />
              <span
                className={`h-2 w-2 rounded-full ${isDark ? 'bg-white/20' : 'bg-[#D0D5DD]'}`}
              />
              <span
                className={`h-2 w-2 rounded-full ${isDark ? 'bg-white/20' : 'bg-[#D0D5DD]'}`}
              />
            </span>
            {title && (
              <span
                className={`truncate text-[13px] font-semibold tracking-[-0.01em] ${isDark ? 'text-white' : 'text-slate-950'}`}
              >
                {title}
              </span>
            )}
          </div>
          {demoLabel && (
            <span className={`text-[12px] font-medium ${mutedClass}`}>
              {demoLabel}
            </span>
          )}
        </div>
      )}

      <div className={PADDING_CLASSES[padding]}>{children}</div>

      {footnote && (
        <figcaption
          className={`border-t px-4 py-2.5 text-[12px] leading-[1.45] sm:px-5 ${
            isDark
              ? 'border-white/10 bg-white/[0.02] text-slate-400'
              : 'border-slate-200 bg-slate-50/70 text-slate-500'
          }`}
        >
          {footnote}
        </figcaption>
      )}
    </figure>
  );
}
