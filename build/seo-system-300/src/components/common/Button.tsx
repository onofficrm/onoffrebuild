import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'white';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer select-none';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-xs sm:text-sm px-4.5 py-2.5 gap-2',
    lg: 'text-sm sm:text-base px-5.5 py-3 gap-2.5'
  };

  const variantStyles = {
    primary: 'bg-[#2563EB] hover:bg-blue-700 active:bg-blue-800 text-white shadow-xs hover:shadow focus:ring-[#2563EB]',
    secondary: 'bg-[#EFF6FF] hover:bg-blue-100 active:bg-blue-200 text-[#2563EB] border border-[#DBEAFE] focus:ring-[#2563EB]',
    outline: 'border-2 border-[#E2E8F0] hover:border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-[#0F172A] focus:ring-[#2563EB]',
    ghost: 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] focus:ring-slate-400',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs focus:ring-rose-500',
    success: 'bg-[#10B981] hover:bg-emerald-600 text-white shadow-xs focus:ring-emerald-500',
    white: 'bg-white text-[#2563EB] hover:bg-blue-50 border border-[#E2E8F0] shadow-xs focus:ring-[#2563EB]'
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
};
