import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { CardCaption, CardTitle, MetaLine } from './Typography';

export type CardVariant = 'default' | 'subtle' | 'dark';
export type CardPadding = 'none' | 'compact' | 'default';

interface CardProps {
  children: ReactNode;
  variant?: CardVariant;
  padding?: CardPadding;
  interactive?: boolean;
  className?: string;
}

const SURFACE_CLASSES: Record<CardVariant, string> = {
  default: 'bg-white border-slate-200',
  subtle: 'bg-slate-50 border-slate-200',
  dark: 'bg-slate-950 border-slate-800 text-white',
};

const PADDING_CLASSES: Record<CardPadding, string> = {
  none: 'p-0',
  compact: 'p-5 sm:p-6',
  default: 'p-6 sm:p-8',
};

const INTERACTIVE_CLASSES: Record<CardVariant, string> = {
  default:
    'transition-[border-color,background-color,box-shadow] duration-150 hover:border-slate-300 hover:shadow-[var(--shadow-card-hover)]',
  subtle:
    'transition-[border-color,background-color,box-shadow] duration-150 hover:border-slate-300 hover:bg-white hover:shadow-[var(--shadow-card-hover)]',
  dark:
    'transition-[border-color,background-color] duration-150 hover:border-white/20',
};

export function Card({
  children,
  variant = 'default',
  padding = 'default',
  interactive = false,
  className = '',
}: CardProps) {
  return (
    <div
      className={[
        'rounded-[16px] border',
        SURFACE_CLASSES[variant],
        PADDING_CLASSES[padding],
        interactive ? INTERACTIVE_CLASSES[variant] : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}

interface VisualCardProps {
  visual: ReactNode;
  title: string;
  description: string;
  meta?: string;
  action?: ReactNode;
  to?: string;
  visualClassName?: string;
  className?: string;
}

/**
 * Visual-first product card enforcing: strong visual + 1-line title + max 1-line caption.
 */
export function VisualCard({
  visual,
  title,
  description,
  meta,
  action,
  to,
  visualClassName = '',
  className = '',
}: VisualCardProps) {
  const inner = (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-[border-color,box-shadow] duration-150 hover:border-slate-300 hover:shadow-[var(--shadow-card-hover)]">
      <div
        className={`relative overflow-hidden border-b border-slate-200 bg-slate-50 ${visualClassName}`.trim()}
      >
        {visual}
      </div>
      <div className="flex flex-1 flex-col justify-between gap-3 p-5 sm:p-6">
        <div className="space-y-1.5">
          {meta && <MetaLine>{meta}</MetaLine>}
          <CardTitle className="line-clamp-1">{title}</CardTitle>
          <CardCaption className="line-clamp-2 sm:line-clamp-1">{description}</CardCaption>
        </div>
        {action && <div className="pt-1">{action}</div>}
      </div>
    </div>
  );

  if (to) {
    return (
      <Link
        to={to}
        className={`group block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 ${className}`.trim()}
      >
        {inner}
      </Link>
    );
  }

  return <div className={`h-full ${className}`.trim()}>{inner}</div>;
}
