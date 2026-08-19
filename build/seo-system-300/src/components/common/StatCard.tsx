import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface StatCardProps {
  id?: string;
  title: string;
  value: string | number;
  growth?: number; // e.g. 24 for +24%
  growthLabel?: string;
  icon?: React.ReactNode;
  subtitle?: string;
  className?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  id,
  title,
  value,
  growth,
  growthLabel = '전주 대비',
  icon,
  subtitle,
  className = '',
  onClick
}) => {
  const isPositive = growth !== undefined && growth > 0;
  const isNegative = growth !== undefined && growth < 0;
  const isNeutral = growth !== undefined && growth === 0;

  return (
    <div
      id={id}
      onClick={onClick}
      className={`bg-white rounded-3xl border border-[#E2E8F0] p-4.5 sm:p-5 shadow-sm transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-[#2563EB] hover:shadow-md' : ''
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-bold text-[#64748B]">{title}</p>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </span>
            {growth !== undefined && (
              <span
                className={`inline-flex items-center text-xs font-bold px-1.5 py-0.5 rounded-md ${
                  isPositive
                    ? 'text-emerald-500'
                    : isNegative
                    ? 'text-rose-500'
                    : 'text-slate-500'
                }`}
              >
                {isPositive ? `+${growth}%` : `${growth}%`}
              </span>
            )}
          </div>
        </div>
        {icon && (
          <div className="p-2.5 rounded-2xl bg-[#EFF6FF] text-[#2563EB] shrink-0">
            {icon}
          </div>
        )}
      </div>

      {(subtitle || (growth !== undefined && growthLabel)) && (
        <div className="mt-3 pt-2.5 border-t border-[#F1F5F9] flex items-center justify-between text-xs text-[#94A3B8]">
          <span>{subtitle || `${growthLabel} ${isPositive ? '증가' : isNegative ? '감소' : '유지'}`}</span>
        </div>
      )}
    </div>
  );
};
