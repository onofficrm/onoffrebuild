import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  header?: React.ReactNode;
  headerAction?: React.ReactNode;
  footer?: React.ReactNode;
  noPadding?: boolean;
  hoverEffect?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  id,
  header,
  headerAction,
  footer,
  noPadding = false,
  hoverEffect = false,
  onClick
}) => {
  return (
    <div
      id={id}
      onClick={onClick}
      className={`bg-white rounded-3xl border border-[#E2E8F0] shadow-sm ${
        hoverEffect ? 'hover:shadow-md hover:border-[#CBD5E1] transition-all duration-200 cursor-pointer' : ''
      } ${className}`}
    >
      {(header || headerAction) && (
        <div className="px-6 py-4.5 border-b border-[#F1F5F9] flex items-center justify-between flex-wrap gap-2">
          {typeof header === 'string' ? (
            <h3 className="font-bold text-[#0F172A] text-base">{header}</h3>
          ) : (
            header
          )}
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'p-6'}>{children}</div>
      {footer && (
        <div className="px-6 py-4 bg-[#F8FAFC] border-t border-[#F1F5F9] rounded-b-3xl">
          {footer}
        </div>
      )}
    </div>
  );
};
