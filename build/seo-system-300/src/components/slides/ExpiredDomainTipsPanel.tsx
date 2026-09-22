import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckSquare2,
  ExternalLink,
  Info,
  MapPin,
  SearchCheck,
} from 'lucide-react';
import type {
  DomainFieldAvailability,
  DomainSearchTarget,
  ExpiredDomainTips,
} from './content';
import { ExpiredDomainMissionPanel } from './ExpiredDomainMissionPanel';

interface ExpiredDomainTipsPanelProps {
  tips: ExpiredDomainTips;
  mode?: 'guide' | 'checklist' | 'mission';
}

const targetStyles: Record<DomainSearchTarget, string> = {
  naver: 'border-emerald-500 bg-emerald-50 text-emerald-700',
  google: 'border-blue-500 bg-blue-50 text-blue-700',
  both: 'border-violet-500 bg-violet-50 text-violet-700',
};

const availabilityLabel: Record<DomainFieldAvailability, string> = {
  available: '플랫폼 필드',
  manual: '수동 확인',
  'not-provided': '직접 제공 안 함',
};

export function ExpiredDomainTipsPanel({
  tips,
  mode = 'guide',
}: ExpiredDomainTipsPanelProps) {
  const [target, setTarget] = useState<DomainSearchTarget>('both');

  useEffect(() => {
    setTarget('both');
  }, [mode]);

  const activeTip = useMemo(
    () => tips.targets.find((item) => item.target === target) ?? tips.targets[0],
    [target, tips.targets],
  );

  return (
    <section className="rounded-3xl border border-[#D8E2F0] bg-[#F8FAFC] p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-amber-700">
            <SearchCheck className="h-3.5 w-3.5" />
            Practice Tip
          </div>
          <h3 className="mt-2 text-base font-black text-[#0F172A]">{tips.title}</h3>
        </div>
        <p className="max-w-xl text-[11px] leading-5 text-[#64748B]">{tips.disclaimer}</p>
      </div>

      {mode !== 'mission' ? (
        <>
          <div className="mt-4 grid grid-cols-3 gap-2" role="tablist" aria-label="검색 목표 선택">
            {tips.targets.map((item) => (
              <button
                key={item.target}
                type="button"
                role="tab"
                aria-selected={target === item.target}
                onClick={() => setTarget(item.target)}
                className={`min-h-11 rounded-xl border px-2 text-xs font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
                  target === item.target
                    ? targetStyles[item.target]
                    : 'border-[#E2E8F0] bg-white text-[#64748B] hover:bg-[#F1F5F9]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-4 rounded-2xl border border-[#E2E8F0] bg-white p-4">
            <p className="text-sm font-black text-[#0F172A]">{activeTip.headline}</p>
            <ul className="mt-3 space-y-1.5">
              {activeTip.summary.map((line) => (
                <li key={line} className="flex items-start gap-2 text-xs leading-5 text-[#475569]">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2563EB]" />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : null}

      {mode === 'guide' ? (
        <div className="mt-4 grid gap-4 2xl:grid-cols-2">
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4">
            <p className="text-xs font-black text-[#334155]">교육용 확인 우선순위</p>
            <div className="mt-3 space-y-2">
              {activeTip.priorities.map((item) => (
                <div key={item.label} className="rounded-xl bg-[#F8FAFC] p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#334155]">{item.label}</span>
                    <span className="font-mono text-xs font-black text-amber-500">
                      {item.stars > 0
                        ? `${'★'.repeat(item.stars)}${'☆'.repeat(5 - item.stars)}`
                        : '제공 안 됨'}
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-start justify-between gap-3 text-[10px] leading-4 text-[#64748B]">
                    <span>{item.whereToCheck}</span>
                    <span className="shrink-0 rounded-full bg-white px-2 py-0.5 font-bold">
                      {availabilityLabel[item.availability]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4">
            <p className="flex items-center gap-2 text-xs font-black text-[#334155]">
              <MapPin className="h-4 w-4 text-[#2563EB]" />
              WHERE TO CHECK
            </p>
            <div className="mt-3 space-y-2">
              {tips.whereToCheck.map((item) => (
                <div key={item.label} className="rounded-xl border border-[#E2E8F0] p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-black text-[#334155]">{item.label}</span>
                    <span className="rounded-full bg-[#F1F5F9] px-2 py-0.5 text-[9px] font-bold text-[#64748B]">
                      {availabilityLabel[item.availability]}
                    </span>
                  </div>
                  <p className="mt-1 font-mono text-[10px] text-[#2563EB]">{item.field}</p>
                  <p className="mt-1 text-[10px] leading-4 text-[#64748B]">{item.location}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {mode === 'checklist' ? (
        <div className="mt-4 rounded-2xl border border-[#E2E8F0] bg-white p-4">
          <p className="flex items-center gap-2 text-xs font-black text-[#334155]">
            <CheckSquare2 className="h-4 w-4 text-[#2563EB]" />
            낙장도메인 10초 판단 TIP
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {activeTip.checklist.map((item) => (
              <div key={item} className="flex items-start gap-2 rounded-xl bg-[#F8FAFC] p-3 text-xs leading-5 text-[#475569]">
                <span className="mt-0.5 h-4 w-4 shrink-0 rounded border-2 border-[#94A3B8]" />
                {item}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {mode === 'mission' ? (
        <ExpiredDomainMissionPanel />
      ) : null}

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {tips.statuses.map((item) => {
          const color =
            item.status === 'GOOD CANDIDATE'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : item.status === 'REVIEW'
                ? 'border-amber-200 bg-amber-50 text-amber-800'
                : 'border-rose-200 bg-rose-50 text-rose-800';
          return (
            <div key={item.status} className={`rounded-2xl border p-3 ${color}`}>
              <p className="font-mono text-[10px] font-black">{item.status}</p>
              <p className="mt-1 text-xs font-black">{item.label}</p>
              <p className="mt-1 text-[10px] leading-4 opacity-80">{item.description}</p>
            </div>
          );
        })}
      </div>

      {mode !== 'mission' ? (
        <details className="mt-4 rounded-2xl border border-[#E2E8F0] bg-white p-4">
          <summary className="flex cursor-pointer list-none items-center gap-2 text-xs font-black text-[#334155]">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            중요한 예외 TIP
          </summary>
          <ul className="mt-3 space-y-2">
            {tips.exceptions.map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs leading-5 text-[#475569]">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2563EB]" />
                {item}
              </li>
            ))}
          </ul>
        </details>
      ) : null}

      <div className="mt-4 flex items-start gap-2 rounded-xl bg-[#0F172A] p-3 text-[10px] leading-5 text-slate-300">
        <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-400" />
        교육 플랫폼은 상세 Domain 분석 API를 동기화하지 않습니다. 표시되지 않는 항목은 원본 서비스 또는 외부 검증 자료에서 직접 확인하고 근거를 기록하세요.
      </div>
    </section>
  );
}
