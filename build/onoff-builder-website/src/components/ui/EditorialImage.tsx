import { useState } from 'react';

interface EditorialImageProps {
  src: string;
  alt: string;
  aspectClass?: string;
  className?: string;
  priority?: boolean;
  fallbackTitle?: string;
}

export function EditorialImage({
  src,
  alt,
  aspectClass = 'aspect-[16/9]',
  className = '',
  priority = false,
  fallbackTitle = 'ONOFF BUILDER',
}: EditorialImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center ${aspectClass} ${className}`.trim()}
      >
        <div className="px-6 text-center">
          <p className="text-[13px] font-semibold tracking-tight text-slate-500">{fallbackTitle}</p>
          <p className="mt-1 text-[13px] text-slate-400">{alt}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50 ${aspectClass} ${className}`.trim()}
    >
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onError={() => setHasError(true)}
        className="h-full w-full object-cover"
      />
    </div>
  );
}
