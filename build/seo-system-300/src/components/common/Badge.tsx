import React from 'react';
import { StatusType } from '../../types';

export interface BadgeProps {
  status?: StatusType;
  variant?: 'green' | 'blue' | 'orange' | 'red' | 'gray' | 'purple' | 'slate';
  children: React.ReactNode;
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  status,
  variant,
  children,
  size = 'md',
  icon,
  className = '',
  dot = false
}) => {
  // Determine variant based on StatusType if provided
  let effectiveVariant: 'green' | 'blue' | 'orange' | 'red' | 'gray' | 'purple' | 'slate' = variant || 'slate';

  if (status) {
    switch (status) {
      case 'completed':
        effectiveVariant = 'green';
        break;
      case 'in_progress':
        effectiveVariant = 'blue';
        break;
      case 'needs_check':
        effectiveVariant = 'orange';
        break;
      case 'error':
        effectiveVariant = 'red';
        break;
      case 'pending':
        effectiveVariant = 'gray';
        break;
    }
  }

  const variantStyles = {
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200/70',
    blue: 'bg-blue-50 text-blue-700 border-blue-200/70',
    orange: 'bg-amber-50 text-amber-800 border-amber-200/70',
    red: 'bg-rose-50 text-rose-700 border-rose-200/70',
    gray: 'bg-slate-100 text-slate-600 border-slate-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200/70',
    slate: 'bg-slate-50 text-slate-700 border-slate-200'
  };

  const dotColors = {
    green: 'bg-emerald-500',
    blue: 'bg-blue-500',
    orange: 'bg-amber-500',
    red: 'bg-rose-500',
    gray: 'bg-slate-400',
    purple: 'bg-purple-500',
    slate: 'bg-slate-400'
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 gap-1 font-medium',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium'
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border whitespace-nowrap leading-none ${sizeStyles[size]} ${variantStyles[effectiveVariant]} ${className}`}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[effectiveVariant]}`} />
      )}
      {icon}
      <span>{children}</span>
    </span>
  );
};
