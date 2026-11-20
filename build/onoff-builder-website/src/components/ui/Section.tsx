import type { ReactNode } from 'react';
import { Container, type ContainerSize } from './Container';
import { DisplayHeading, LeadText, SectionHeading, SectionKicker } from './Typography';

export type SectionSurface = 'white' | 'subtle' | 'navy';
export type SectionSpacing = 'hero' | 'default' | 'compact';

interface SectionProps {
  children: ReactNode;
  id?: string;
  surface?: SectionSurface;
  spacing?: SectionSpacing;
  bordered?: boolean;
  containerSize?: ContainerSize;
  className?: string;
  containerClassName?: string;
}

const SURFACE_CLASSES: Record<SectionSurface, string> = {
  white: 'bg-white text-slate-950',
  subtle: 'bg-slate-50 text-slate-950',
  navy: 'bg-slate-950 text-white',
};

const SPACING_CLASSES: Record<SectionSpacing, string> = {
  hero: 'section-rhythm-hero',
  default: 'section-rhythm-default',
  compact: 'section-rhythm-compact',
};

export function Section({
  children,
  id,
  surface = 'white',
  spacing = 'default',
  bordered = spacing !== 'hero',
  containerSize = 'default',
  className = '',
  containerClassName = '',
}: SectionProps) {
  const borderClass =
    bordered && surface !== 'navy'
      ? 'border-t border-slate-200/80'
      : bordered && surface === 'navy'
        ? 'border-t border-slate-800'
        : '';

  return (
    <section
      id={id}
      className={[SURFACE_CLASSES[surface], SPACING_CLASSES[spacing], borderClass, className]
        .filter(Boolean)
        .join(' ')}
    >
      <Container size={containerSize} className={containerClassName}>
        {children}
      </Container>
    </section>
  );
}

interface SectionHeaderProps {
  kicker?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  as?: 'h1' | 'h2';
  align?: 'left' | 'center';
  tone?: 'light' | 'dark';
  className?: string;
}

export function SectionHeader({
  kicker,
  title,
  subtitle,
  action,
  as = 'h2',
  align = 'left',
  tone = 'light',
  className = '',
}: SectionHeaderProps) {
  const isCentered = align === 'center';
  const isDark = tone === 'dark';

  const kickerColor = isDark ? 'text-blue-400' : 'text-blue-600';
  const headingColor = isDark ? 'text-white' : 'text-slate-950';
  const subtitleColor = isDark ? 'text-slate-300' : 'text-slate-600';

  const HeadingComponent = as === 'h1' ? DisplayHeading : SectionHeading;

  if (isCentered) {
    return (
      <div className={`mx-auto max-w-[680px] text-center ${className}`.trim()}>
        {kicker && <SectionKicker className={kickerColor}>{kicker}</SectionKicker>}
        <HeadingComponent className={`${kicker ? 'mt-2.5' : ''} ${headingColor}`.trim()}>
          {title}
        </HeadingComponent>
        {subtitle && (
          <LeadText className={`mx-auto mt-3.5 max-w-[46ch] ${subtitleColor}`}>{subtitle}</LeadText>
        )}
        {action && <div className="mt-6 flex justify-center">{action}</div>}
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between ${className}`.trim()}
    >
      <div className="max-w-[640px]">
        {kicker && <SectionKicker className={kickerColor}>{kicker}</SectionKicker>}
        <HeadingComponent className={`${kicker ? 'mt-2.5' : ''} ${headingColor}`.trim()}>
          {title}
        </HeadingComponent>
        {subtitle && (
          <LeadText className={`mt-3 max-w-[46ch] ${subtitleColor}`}>{subtitle}</LeadText>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}