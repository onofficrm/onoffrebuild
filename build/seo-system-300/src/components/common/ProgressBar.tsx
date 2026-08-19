import React from 'react';

export interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  label?: string;
  subLabel?: string;
  showPercent?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'blue' | 'emerald' | 'amber' | 'gradient';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  subLabel,
  showPercent = true,
  size = 'md',
  variant = 'blue',
  className = ''
}) => {
  const percentage = Math.min(Math.max(Math.round((value / max) * 100), 0), 100);

  const heightStyles = {
    xs: 'h-1.5',
    sm: 'h-2',
    md: 'h-2.5',
    lg: 'h-3'
  };

  const variantStyles = {
    blue: 'bg-[#2563EB]',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    gradient: 'bg-[#2563EB]'
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercent || subLabel) && (
        <div className="flex items-center justify-between text-xs mb-1.5 gap-2">
          <div className="flex items-center gap-1.5 truncate">
            {label && <span className="font-bold text-[#0F172A] truncate">{label}</span>}
            {subLabel && <span className="text-[#64748B] text-[11px] truncate">({subLabel})</span>}
          </div>
          {showPercent && (
            <span className="font-bold text-[#0F172A] tabular-nums shrink-0">{percentage}%</span>
          )}
        </div>
      )}
      <div className={`w-full bg-[#F1F5F9] rounded-full overflow-hidden ${heightStyles[size]}`}>
        <div
          className={`${heightStyles[size]} ${variantStyles[variant]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
