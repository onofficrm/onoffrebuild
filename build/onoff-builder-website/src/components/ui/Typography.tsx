import type { ReactNode } from 'react';

interface TypographyProps {
  children: ReactNode;
  className?: string;
}

export function SectionKicker({ children, className = '' }: TypographyProps) {
  return (
    <p
      className={`text-[12px] sm:text-[13px] font-bold leading-[1.35] tracking-wider uppercase text-blue-600 ${className}`.trim()}
    >
      {children}
    </p>
  );
}

export function DisplayHeading({ children, className = '' }: TypographyProps) {
  return (
    <h1
      className={`text-[clamp(2rem,4.2vw,3.5rem)] font-extrabold leading-[1.14] tracking-tight text-slate-950 ${className}`.trim()}
    >
      {children}
    </h1>
  );
}

export function SectionHeading({ children, className = '' }: TypographyProps) {
  return (
    <h2
      className={`text-[clamp(1.5rem,2.6vw,2.25rem)] font-bold leading-[1.2] tracking-tight text-slate-950 ${className}`.trim()}
    >
      {children}
    </h2>
  );
}

export function SubHeading({ children, className = '' }: TypographyProps) {
  return (
    <h3
      className={`text-[18px] sm:text-[19px] font-semibold leading-[1.32] tracking-tight text-slate-950 ${className}`.trim()}
    >
      {children}
    </h3>
  );
}

export function CardTitle({ children, className = '' }: TypographyProps) {
  return (
    <h3
      className={`text-[17px] sm:text-[18px] font-bold leading-[1.3] tracking-tight text-slate-950 ${className}`.trim()}
    >
      {children}
    </h3>
  );
}

export function CardCaption({ children, className = '' }: TypographyProps) {
  return (
    <p className={`text-[14px] leading-[1.55] text-slate-600 ${className}`.trim()}>{children}</p>
  );
}

export function MetaLine({ children, className = '' }: TypographyProps) {
  return (
    <p
      className={`text-[12.5px] font-semibold leading-[1.45] tracking-wide text-slate-500 ${className}`.trim()}
    >
      {children}
    </p>
  );
}

export function LeadText({ children, className = '' }: TypographyProps) {
  return (
    <p
      className={`text-[15.5px] sm:text-[17px] leading-relaxed text-slate-600 font-medium ${className}`.trim()}
    >
      {children}
    </p>
  );
}

export function BodyText({ children, className = '' }: TypographyProps) {
  return (
    <p className={`text-[14.5px] sm:text-[15px] leading-[1.65] text-slate-600 ${className}`.trim()}>
      {children}
    </p>
  );
}