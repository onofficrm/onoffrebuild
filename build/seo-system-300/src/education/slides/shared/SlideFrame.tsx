import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

interface SlideFrameProps {
  page: number;
  total?: number;
  lesson?: number;
  kicker: string;
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  children: ReactNode;
}

const GRID_STYLE = {
  backgroundImage:
    'linear-gradient(rgba(148,163,184,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.06) 1px, transparent 1px)',
  backgroundSize: '64px 64px',
};

export function SlideFrame({
  page,
  total = 38,
  lesson = 1,
  kicker,
  title,
  subtitle,
  icon: Icon,
  children,
}: SlideFrameProps) {
  return (
    <div className="relative flex h-full w-full select-none flex-col overflow-hidden bg-[#07111F] px-16 py-12">
      <div className="pointer-events-none absolute inset-0" style={GRID_STYLE} />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 h-[520px] w-[520px] rounded-full bg-cyan-500/12 blur-[140px]" />
        <div className="absolute -right-16 bottom-[-80px] h-[480px] w-[480px] rounded-full bg-indigo-600/15 blur-[140px]" />
      </div>

      <header className="relative z-10 flex items-center justify-between">
        <span className="flex items-center gap-4 font-mono text-[26px] font-bold uppercase tracking-[0.18em] text-cyan-300">
          <span className="h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_16px_rgba(34,211,238,0.9)]" />
          {kicker}
        </span>
        <span className="rounded-2xl border border-cyan-400/30 bg-cyan-500/10 px-5 py-1 font-mono text-4xl font-black text-cyan-200">
          {String(page).padStart(2, '0')}
        </span>
      </header>
      <div className="relative z-10 mt-5 h-px w-full bg-gradient-to-r from-cyan-400/60 via-slate-700/60 to-transparent" />

      <div className="relative z-10 mt-8 flex items-center gap-8">
        {Icon ? (
          <span className="flex h-[124px] w-[124px] shrink-0 items-center justify-center rounded-[32px] bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-[0_20px_60px_-15px_rgba(34,211,238,0.8)]">
            <Icon className="h-16 w-16" strokeWidth={2.2} />
          </span>
        ) : null}
        <div>
          <h2 className="text-[64px] font-black leading-[1.1] tracking-tight text-white">{title}</h2>
          {subtitle ? (
            <p className="mt-3 text-[32px] font-bold leading-snug text-cyan-300">{subtitle}</p>
          ) : null}
        </div>
      </div>

      <div className="relative z-10 flex min-h-0 flex-1 items-center py-8">{children}</div>

      <footer className="relative z-10 flex items-center justify-between border-t border-slate-800/80 pt-4 font-mono text-2xl text-slate-400">
        <span>ONOFF MARKETING · {lesson}강</span>
        <span>
          {String(page).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
      </footer>
    </div>
  );
}
