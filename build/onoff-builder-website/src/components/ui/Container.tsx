import type { ReactNode } from 'react';

export type ContainerSize = 'narrow' | 'default' | 'wide';

interface ContainerProps {
  children: ReactNode;
  size?: ContainerSize;
  className?: string;
}

const SIZE_CLASSES: Record<ContainerSize, string> = {
  narrow: 'max-w-[920px]',
  default: 'max-w-[1200px]',
  wide: 'max-w-[1280px]',
};

export function Container({
  children,
  size = 'default',
  className = '',
}: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full ${SIZE_CLASSES[size]} px-4 sm:px-8 ${className}`.trim()}
    >
      {children}
    </div>
  );
}
