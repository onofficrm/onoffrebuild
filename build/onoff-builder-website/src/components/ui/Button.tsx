import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'inverse' | 'inverseGhost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface BaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  className?: string;
}

type ButtonAsButton = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    to?: undefined;
    href?: undefined;
  };

type ButtonAsLink = BaseProps & {
  to: string;
  href?: undefined;
};

type ButtonAsExternal = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
    to?: undefined;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsExternal;

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 border border-transparent shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 font-bold',
  secondary:
    'bg-white text-slate-900 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 font-semibold',
  ghost:
    'bg-transparent text-slate-600 hover:text-slate-950 hover:bg-slate-50 border border-transparent font-semibold',
  inverse:
    'bg-white text-slate-950 hover:bg-slate-50 active:bg-slate-100 border border-transparent font-bold',
  inverseGhost:
    'bg-transparent text-white/90 hover:text-white hover:bg-white/10 border border-white/20 font-semibold',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'min-h-[40px] px-4 py-2 text-[14px] rounded-lg',
  md: 'min-h-[44px] px-6 py-2.5 text-[15px] rounded-xl',
  lg: 'min-h-[48px] px-8 py-3.5 text-base rounded-xl',
};

export function Button(props: ButtonProps) {
  const { variant = 'primary', size = 'md', children, className = '' } = props;

  const classes = [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0 transition-all duration-150 cursor-pointer active:scale-[0.98]',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if ('to' in props && props.to !== undefined) {
    return (
      <Link to={props.to} className={classes}>
        {children}
      </Link>
    );
  }

  if ('href' in props && props.href !== undefined) {
    const { href, variant: _v, size: _s, className: _c, children: _ch, ...rest } = props;
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }

  const { variant: _v, size: _s, className: _c, children: _ch, ...buttonProps } =
    props as ButtonAsButton;

  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
}