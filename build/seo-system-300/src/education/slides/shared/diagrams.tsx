import { Fragment, type FC } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Minus,
  PauseCircle,
  Trophy,
  X,
  XCircle,
} from 'lucide-react';

export type Tone = 'cyan' | 'blue' | 'sky' | 'teal' | 'emerald' | 'indigo' | 'purple' | 'amber' | 'rose';

interface ToneStyle {
  card: string;
  chip: string;
  text: string;
  bar: string;
  hex: string;
}

const TONES: Record<Tone, ToneStyle> = {
  cyan: {
    card: 'border-cyan-400/40 bg-gradient-to-br from-cyan-500/20 via-cyan-500/5 to-slate-950/40',
    chip: 'bg-cyan-400/15 text-cyan-300 ring-cyan-300/40 shadow-[0_0_40px_-8px_rgba(34,211,238,0.6)]',
    text: 'text-cyan-300',
    bar: 'from-cyan-400 to-cyan-600',
    hex: '#22d3ee',
  },
  blue: {
    card: 'border-blue-400/40 bg-gradient-to-br from-blue-500/20 via-blue-500/5 to-slate-950/40',
    chip: 'bg-blue-400/15 text-blue-300 ring-blue-300/40 shadow-[0_0_40px_-8px_rgba(96,165,250,0.6)]',
    text: 'text-blue-300',
    bar: 'from-blue-400 to-blue-600',
    hex: '#60a5fa',
  },
  sky: {
    card: 'border-sky-400/40 bg-gradient-to-br from-sky-500/20 via-sky-500/5 to-slate-950/40',
    chip: 'bg-sky-400/15 text-sky-300 ring-sky-300/40 shadow-[0_0_40px_-8px_rgba(56,189,248,0.6)]',
    text: 'text-sky-300',
    bar: 'from-sky-400 to-sky-600',
    hex: '#38bdf8',
  },
  teal: {
    card: 'border-teal-400/40 bg-gradient-to-br from-teal-500/20 via-teal-500/5 to-slate-950/40',
    chip: 'bg-teal-400/15 text-teal-300 ring-teal-300/40 shadow-[0_0_40px_-8px_rgba(45,212,191,0.6)]',
    text: 'text-teal-300',
    bar: 'from-teal-400 to-teal-600',
    hex: '#2dd4bf',
  },
  emerald: {
    card: 'border-emerald-400/40 bg-gradient-to-br from-emerald-500/20 via-emerald-500/5 to-slate-950/40',
    chip: 'bg-emerald-400/15 text-emerald-300 ring-emerald-300/40 shadow-[0_0_40px_-8px_rgba(52,211,153,0.6)]',
    text: 'text-emerald-300',
    bar: 'from-emerald-400 to-emerald-600',
    hex: '#34d399',
  },
  indigo: {
    card: 'border-indigo-400/40 bg-gradient-to-br from-indigo-500/20 via-indigo-500/5 to-slate-950/40',
    chip: 'bg-indigo-400/15 text-indigo-300 ring-indigo-300/40 shadow-[0_0_40px_-8px_rgba(129,140,248,0.6)]',
    text: 'text-indigo-300',
    bar: 'from-indigo-400 to-indigo-600',
    hex: '#818cf8',
  },
  purple: {
    card: 'border-purple-400/40 bg-gradient-to-br from-purple-500/20 via-purple-500/5 to-slate-950/40',
    chip: 'bg-purple-400/15 text-purple-300 ring-purple-300/40 shadow-[0_0_40px_-8px_rgba(192,132,252,0.6)]',
    text: 'text-purple-300',
    bar: 'from-purple-400 to-purple-600',
    hex: '#c084fc',
  },
  amber: {
    card: 'border-amber-400/40 bg-gradient-to-br from-amber-500/20 via-amber-500/5 to-slate-950/40',
    chip: 'bg-amber-400/15 text-amber-300 ring-amber-300/40 shadow-[0_0_40px_-8px_rgba(251,191,36,0.6)]',
    text: 'text-amber-300',
    bar: 'from-amber-400 to-amber-600',
    hex: '#fbbf24',
  },
  rose: {
    card: 'border-rose-400/40 bg-gradient-to-br from-rose-500/20 via-rose-500/5 to-slate-950/40',
    chip: 'bg-rose-400/15 text-rose-300 ring-rose-300/40 shadow-[0_0_40px_-8px_rgba(251,113,133,0.6)]',
    text: 'text-rose-300',
    bar: 'from-rose-400 to-rose-600',
    hex: '#fb7185',
  },
};

export interface DiagramItem {
  label: string;
  tone?: Tone;
  icon?: LucideIcon;
  badge?: string;
}

function tone(value: Tone = 'cyan') {
  return TONES[value];
}

const CHIP_SIZE = {
  sm: 'h-14 w-14 rounded-xl [&>svg]:h-7 [&>svg]:w-7',
  md: 'h-20 w-20 rounded-2xl [&>svg]:h-10 [&>svg]:w-10',
  lg: 'h-28 w-28 rounded-3xl [&>svg]:h-14 [&>svg]:w-14',
};

const IconChip: FC<{ icon?: LucideIcon; tone?: Tone; size?: keyof typeof CHIP_SIZE; fallback?: string }> = ({
  icon: Icon,
  tone: toneName,
  size = 'md',
  fallback,
}) => (
  <span className={`flex shrink-0 items-center justify-center ring-1 ${CHIP_SIZE[size]} ${tone(toneName).chip}`}>
    {Icon ? <Icon strokeWidth={2.2} /> : <span className="font-mono text-3xl font-black">{fallback}</span>}
  </span>
);

const Connector: FC<{ vertical?: boolean }> = ({ vertical }) => (
  <span className="flex shrink-0 items-center justify-center">
    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-600/70 bg-slate-900 text-slate-300">
      {vertical ? <ChevronDown className="h-6 w-6" /> : <ChevronRight className="h-6 w-6" />}
    </span>
  </span>
);

export function StepFlow({ steps }: { steps: DiagramItem[] }) {
  const dense = steps.length >= 7;
  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-500/30 via-cyan-400/40 to-purple-500/30" />
      <div className="relative flex w-full items-center">
        {steps.map((step, index) => (
          <Fragment key={step.label}>
            <div
              className={`relative flex flex-1 flex-col items-center justify-between rounded-3xl border-2 text-center shadow-2xl backdrop-blur ${
                dense ? 'min-h-[300px] px-3 py-6' : 'min-h-[320px] px-6 py-8'
              } ${tone(step.tone).card}`}
            >
              <span className={`absolute left-4 top-3 font-mono text-2xl font-black ${tone(step.tone).text}`}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="mt-8">
                <IconChip icon={step.icon} tone={step.tone} size={dense ? 'md' : 'lg'} fallback={String(index + 1)} />
              </div>
              <span className={`${dense ? 'text-[26px]' : 'text-[32px]'} font-black leading-tight text-white`}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 ? (
              <span className={dense ? '-mx-2 z-10' : 'mx-2 z-10'}>
                <Connector />
              </span>
            ) : null}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

const RING = { width: 1200, height: 560, cx: 600, cy: 280, rx: 430, ry: 220 };

export function CycleLoop({
  center,
  centerIcon: CenterIcon,
  steps,
}: {
  center: string;
  centerIcon?: LucideIcon;
  steps: DiagramItem[];
}) {
  const angles = [-90, 0, 90, 180];
  const arrowAngles = [-45, 45, 135, 225];
  const point = (deg: number) => {
    const rad = (deg * Math.PI) / 180;
    return { x: RING.cx + RING.rx * Math.cos(rad), y: RING.cy + RING.ry * Math.sin(rad), rad };
  };

  return (
    <div className="relative mx-auto" style={{ width: RING.width, height: RING.height }}>
      <svg className="absolute inset-0" width={RING.width} height={RING.height} aria-hidden>
        <defs>
          <linearGradient id="cycle-ring" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="50%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
        </defs>
        <ellipse
          cx={RING.cx}
          cy={RING.cy}
          rx={RING.rx}
          ry={RING.ry}
          fill="none"
          stroke="url(#cycle-ring)"
          strokeWidth={5}
          strokeDasharray="14 12"
          opacity={0.75}
        />
      </svg>

      {arrowAngles.map((deg) => {
        const p = point(deg);
        const rotate = (Math.atan2(RING.ry * Math.cos(p.rad), -RING.rx * Math.sin(p.rad)) * 180) / Math.PI;
        return (
          <span
            key={deg}
            className="absolute flex h-12 w-12 items-center justify-center rounded-full border border-cyan-300/50 bg-slate-950 text-cyan-300"
            style={{ left: p.x - 24, top: p.y - 24, transform: `rotate(${rotate}deg)` }}
          >
            <ArrowRight className="h-6 w-6" />
          </span>
        );
      })}

      <div
        className="absolute flex flex-col items-center justify-center rounded-full border-4 border-cyan-300/80 bg-gradient-to-br from-cyan-500/30 via-slate-900 to-blue-600/30 text-center shadow-[0_0_80px_-10px_rgba(34,211,238,0.6)]"
        style={{ width: 280, height: 280, left: RING.cx - 140, top: RING.cy - 140 }}
      >
        {CenterIcon ? <CenterIcon className="mb-2 h-14 w-14 text-cyan-200" strokeWidth={2.2} /> : null}
        <span className="px-6 text-[36px] font-black leading-tight text-white">{center}</span>
      </div>

      {steps.slice(0, 4).map((step, index) => {
        const p = point(angles[index]);
        return (
          <div
            key={step.label}
            className={`absolute flex items-center gap-4 rounded-3xl border-2 px-5 shadow-2xl ${tone(step.tone).card}`}
            style={{ width: 320, height: 116, left: p.x - 160, top: p.y - 58, backgroundColor: '#0b1628' }}
          >
            <IconChip icon={step.icon} tone={step.tone} size="sm" fallback={String(index + 1)} />
            <div className="flex flex-col">
              <span className={`font-mono text-xl font-black ${tone(step.tone).text}`}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="text-[32px] font-black leading-tight text-white">{step.label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const HUB = { width: 1792, height: 560, hub: 300, cardW: 460, cardH: 128 };

export function HubSpokes({
  hub,
  hubIcon: HubIcon,
  items,
}: {
  hub: string;
  hubIcon?: LucideIcon;
  items: DiagramItem[];
}) {
  const half = Math.ceil(items.length / 2);
  const columns = [items.slice(0, half), items.slice(half)];
  const cx = HUB.width / 2;
  const cy = HUB.height / 2;
  const radius = HUB.hub / 2;

  const placed = columns.flatMap((column, side) =>
    column.map((item, row) => {
      const gap = HUB.height / column.length;
      const y = gap * row + gap / 2;
      const x = side === 0 ? 0 : HUB.width - HUB.cardW;
      return { item, x, y, side };
    }),
  );

  return (
    <div className="relative w-full" style={{ height: HUB.height }}>
      <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 ${HUB.width} ${HUB.height}`} aria-hidden>
        {placed.map(({ item, y, side }) => {
          const startX = side === 0 ? HUB.cardW : HUB.width - HUB.cardW;
          const endX = side === 0 ? cx - radius : cx + radius;
          const midX = (startX + endX) / 2;
          return (
            <g key={item.label}>
              <path
                d={`M ${startX} ${y} C ${midX} ${y}, ${midX} ${cy}, ${endX} ${cy}`}
                fill="none"
                stroke={tone(item.tone).hex}
                strokeWidth={3}
                strokeDasharray="8 8"
                opacity={0.7}
              />
              <circle cx={startX} cy={y} r={7} fill={tone(item.tone).hex} />
            </g>
          );
        })}
      </svg>

      <div
        className="absolute flex flex-col items-center justify-center rounded-full border-4 border-cyan-300/80 bg-gradient-to-br from-cyan-500/30 via-slate-900 to-blue-600/30 text-center shadow-[0_0_90px_-10px_rgba(34,211,238,0.6)]"
        style={{ width: HUB.hub, height: HUB.hub, left: cx - radius, top: cy - radius }}
      >
        {HubIcon ? <HubIcon className="mb-3 h-16 w-16 text-cyan-200" strokeWidth={2.2} /> : null}
        <span className="px-6 text-[38px] font-black leading-tight text-white">{hub}</span>
      </div>

      {placed.map(({ item, x, y }) => (
        <div
          key={item.label}
          className={`absolute flex items-center gap-5 rounded-3xl border-2 px-6 shadow-2xl ${tone(item.tone).card}`}
          style={{ width: HUB.cardW, height: HUB.cardH, left: x, top: y - HUB.cardH / 2, backgroundColor: '#0b1628' }}
        >
          <IconChip icon={item.icon} tone={item.tone} size="md" fallback={item.label.slice(0, 1)} />
          <span className="text-[32px] font-black leading-tight text-white">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export type CompareKind = 'good' | 'bad' | 'hold' | 'neutral';

export interface CompareColumn extends DiagramItem {
  items: string[];
  kind?: CompareKind;
}

function kindOf(column: CompareColumn): CompareKind {
  if (column.kind) return column.kind;
  if (column.tone === 'rose') return 'bad';
  if (column.tone === 'amber') return 'hold';
  return 'good';
}

const KIND_ICON: Record<CompareKind, { head: LucideIcon; bullet: LucideIcon }> = {
  good: { head: CheckCircle2, bullet: Check },
  bad: { head: XCircle, bullet: X },
  hold: { head: PauseCircle, bullet: Minus },
  neutral: { head: CheckCircle2, bullet: Check },
};

export function CompareColumns({ columns }: { columns: CompareColumn[] }) {
  const pair = columns.length === 2;
  return (
    <div className="relative flex w-full items-stretch gap-8">
      {columns.map((column, index) => {
        const kind = kindOf(column);
        const HeadIcon = column.icon ?? KIND_ICON[kind].head;
        const Bullet = KIND_ICON[kind].bullet;
        const style = tone(column.tone);
        return (
          <Fragment key={column.label}>
            <div className={`relative flex flex-1 flex-col overflow-hidden rounded-3xl border-2 shadow-2xl ${style.card}`}>
              <div className={`h-2 w-full bg-gradient-to-r ${style.bar}`} />
              <div className="flex items-center gap-5 border-b border-white/10 px-8 py-6">
                <IconChip icon={HeadIcon} tone={column.tone} size="md" />
                <div>
                  <div className="text-[38px] font-black leading-tight text-white">{column.label}</div>
                  {column.badge ? (
                    <span className={`mt-1 inline-block rounded-full bg-white/5 px-4 py-1 text-2xl font-bold ring-1 ring-white/10 ${style.text}`}>
                      {column.badge}
                    </span>
                  ) : null}
                </div>
              </div>
              <ul className="flex flex-1 flex-col justify-center gap-5 px-8 py-6">
                {column.items.map((item) => (
                  <li key={item} className="flex items-center gap-4 text-[30px] font-bold text-white">
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-1 ${style.chip}`}>
                      <Bullet className="h-6 w-6" strokeWidth={3} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            {pair && index === 0 ? (
              <div className="absolute left-1/2 top-1/2 z-10 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-slate-700 bg-[#07111F] font-mono text-3xl font-black text-white shadow-2xl">
                VS
              </div>
            ) : null}
          </Fragment>
        );
      })}
    </div>
  );
}

export function PointTiles({ points }: { points: DiagramItem[] }) {
  const cols =
    points.length === 5 ? 'grid-cols-5' :
    points.length === 4 ? 'grid-cols-4' :
    points.length === 2 ? 'grid-cols-2' :
    'grid-cols-3';
  const dense = points.length >= 5;
  return (
    <div className={`grid w-full ${cols} gap-6`}>
      {points.map((point, index) => (
        <div
          key={point.label}
          className={`relative flex min-h-[300px] flex-col items-center justify-center gap-6 overflow-hidden rounded-3xl border-2 px-6 text-center shadow-2xl ${tone(point.tone).card}`}
        >
          <div className={`absolute inset-x-0 top-0 h-2 bg-gradient-to-r ${tone(point.tone).bar}`} />
          <span className={`absolute left-5 top-5 font-mono text-2xl font-black ${tone(point.tone).text}`}>
            {String(index + 1).padStart(2, '0')}
          </span>
          <IconChip icon={point.icon} tone={point.tone} size={dense ? 'md' : 'lg'} fallback={String(index + 1)} />
          <div>
            <div className={`${dense ? 'text-[30px]' : 'text-[36px]'} font-black leading-tight text-white`}>{point.label}</div>
            {point.badge ? <div className={`mt-2 text-2xl font-bold ${tone(point.tone).text}`}>{point.badge}</div> : null}
          </div>
        </div>
      ))}
    </div>
  );
}

export function KeywordRow({ words }: { words: DiagramItem[] }) {
  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-500/40 via-cyan-400/50 to-purple-500/40" />
      <div className="relative flex w-full items-center">
        {words.map((word, index) => (
          <Fragment key={word.label}>
            <div
              className={`flex h-[280px] flex-1 flex-col items-center justify-center gap-6 rounded-3xl border-2 px-3 text-center shadow-2xl ${tone(word.tone).card}`}
              style={{ backgroundColor: '#0b1628' }}
            >
              <IconChip icon={word.icon} tone={word.tone} size="lg" fallback={String(index + 1)} />
              <span className="text-[34px] font-black leading-tight text-white">{word.label}</span>
            </div>
            {index < words.length - 1 ? (
              <span className="z-10 mx-2">
                <Connector />
              </span>
            ) : null}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export function CheckList({ items }: { items: DiagramItem[] }) {
  const dense = items.length >= 5;
  return (
    <div className={`grid w-full ${dense ? 'gap-3' : 'gap-5'}`}>
      {items.map((item, index) => {
        const style = tone(item.tone);
        return (
          <div
            key={item.label}
            className={`relative flex items-center gap-6 overflow-hidden rounded-3xl border-2 pl-10 pr-8 shadow-xl ${dense ? 'py-3' : 'py-5'} ${style.card}`}
          >
            <span className={`absolute inset-y-0 left-0 w-2 bg-gradient-to-b ${style.bar}`} />
            <IconChip icon={item.icon ?? Check} tone={item.tone} size={dense ? 'sm' : 'md'} />
            <span className={`font-mono text-3xl font-black ${style.text}`}>{String(index + 1).padStart(2, '0')}</span>
            <span className="text-[34px] font-black text-white">{item.label}</span>
            <span className="ml-auto flex items-center gap-2 rounded-full bg-white/5 px-5 py-2 text-2xl font-bold ring-1 ring-white/10">
              <CheckCircle2 className={`h-7 w-7 ${style.text}`} />
              <span className={style.text}>{item.badge ?? 'CHECK'}</span>
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function StatRow({ stats }: { stats: DiagramItem[] }) {
  return (
    <div className={`grid w-full gap-5 ${stats.length === 4 ? 'grid-cols-4' : 'grid-cols-3'}`}>
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`flex min-h-[260px] flex-col items-center justify-center gap-4 rounded-3xl border-2 text-center ${tone(stat.tone).card}`}
        >
          <IconChip icon={stat.icon} tone={stat.tone} size="md" fallback="#" />
          <div className="text-[56px] font-black leading-none text-white">{stat.badge ?? stat.label}</div>
          {stat.badge ? <div className="text-[28px] font-bold text-white">{stat.label}</div> : null}
        </div>
      ))}
    </div>
  );
}

export function Funnel({ layers }: { layers: DiagramItem[] }) {
  return (
    <div className="flex w-full flex-col items-center gap-2">
      {layers.map((layer, index) => {
        const width = 100 - index * 14;
        const style = tone(layer.tone);
        return (
          <Fragment key={layer.label}>
            <div
              className={`relative flex h-[82px] items-center justify-center gap-5 overflow-hidden rounded-full border-2 shadow-xl ${style.card}`}
              style={{ width: `${width}%`, backgroundColor: '#0b1628' }}
            >
              <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${style.bar}`} />
              <IconChip icon={layer.icon} tone={layer.tone} size="sm" fallback={String(index + 1)} />
              <span className="text-[34px] font-black text-white">{layer.label}</span>
              {layer.badge ? <span className={`text-2xl font-bold ${style.text}`}>{layer.badge}</span> : null}
            </div>
            {index < layers.length - 1 ? <ChevronDown className="-my-1 h-6 w-6 text-slate-500" /> : null}
          </Fragment>
        );
      })}
    </div>
  );
}

export function LayerStack({ layers }: { layers: DiagramItem[] }) {
  return (
    <div className="flex w-full flex-col items-center gap-4">
      {layers.map((layer, index) => {
        const width = 70 + index * 15;
        const style = tone(layer.tone);
        return (
          <div
            key={layer.label}
            className={`relative flex min-h-[130px] items-center gap-6 overflow-hidden rounded-3xl border-2 px-10 shadow-2xl ${style.card}`}
            style={{ width: `${width}%` }}
          >
            <div className={`absolute inset-x-0 top-0 h-2 bg-gradient-to-r ${style.bar}`} />
            <IconChip icon={layer.icon} tone={layer.tone} size="md" fallback={String(layers.length - index)} />
            <span className="text-[36px] font-black text-white">{layer.label}</span>
            {layer.badge ? (
              <span className={`ml-auto rounded-full bg-white/5 px-5 py-2 text-[26px] font-bold ring-1 ring-white/10 ${style.text}`}>
                {layer.badge}
              </span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export function OutcomeBar({ label, icon: Icon = Trophy }: { label: string; icon?: LucideIcon }) {
  return (
    <div className="mt-6 flex w-full items-center justify-center gap-4 rounded-2xl border border-cyan-300/40 bg-gradient-to-r from-cyan-500/20 via-blue-500/10 to-purple-500/20 py-4 text-[30px] font-black text-white shadow-[0_0_60px_-20px_rgba(34,211,238,0.7)]">
      <Icon className="h-9 w-9 text-cyan-300" strokeWidth={2.2} />
      {label}
    </div>
  );
}
