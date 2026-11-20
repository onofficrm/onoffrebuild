import { CORE_INCLUDED_TOOL_POLICY } from '../../data/platformCapabilities';

interface CoreToolPricingPolicyNoticeProps {
  /** 'full': 별도 구분 비용 3항목 그리드까지 표시 / 'compact': 핵심 요약 + 구분 안내만 표시 */
  variant?: 'full' | 'compact';
  className?: string;
}

/**
 * 스텝메일 · 오토포스터(SNS 마케팅) 기본 제공 정책 및 비용 구분 공통 안내 컴포넌트
 * - 단일 원천: src/data/platformCapabilities.ts (CORE_INCLUDED_TOOL_POLICY)
 * - 별도 솔루션 구독료 0원 정책과 제3자 발송/API 실비, 사용량 초과 비용, 맞춤 기능 개발비의 혼동 방지
 */
export function CoreToolPricingPolicyNotice({
  variant = 'full',
  className = '',
}: CoreToolPricingPolicyNoticeProps) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 ${className}`.trim()}
    >
      <div className="flex flex-col gap-1.5 border-b border-slate-200 pb-4 sm:flex-row sm:items-baseline sm:justify-between">
        <p className="text-[13px] font-semibold text-blue-600">
          {CORE_INCLUDED_TOOL_POLICY.badgeLabel} · {CORE_INCLUDED_TOOL_POLICY.subscriptionFeeLabel}
        </p>
        <p className="text-[12px] text-slate-500">
          제3자 실비 · 초과 사용량 · 맞춤 개발비 별도 구분
        </p>
      </div>

      <div className="mt-4 space-y-2">
        <p className="text-[16px] font-semibold leading-snug tracking-[-0.015em] text-slate-950">
          {CORE_INCLUDED_TOOL_POLICY.valueProposition}
        </p>
        <p className="text-[14px] leading-[1.68] text-slate-600">
          {CORE_INCLUDED_TOOL_POLICY.summaryNotice}{' '}
          {CORE_INCLUDED_TOOL_POLICY.costSeparationNotice}
        </p>
      </div>

      {variant === 'full' && (
        <div className="mt-5 grid grid-cols-1 gap-4 border-t border-slate-200 pt-5 md:grid-cols-3">
          {CORE_INCLUDED_TOOL_POLICY.separatedCostItems.map((item, idx) => (
            <div
              key={item.id}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-1.5"
            >
              <p className="text-[11px] font-semibold tabular-nums text-blue-600">
                구분 0{idx + 1}
              </p>
              <p className="text-[14px] font-semibold text-slate-950">{item.label}</p>
              <p className="text-[13px] leading-[1.6] text-slate-600">{item.detail}</p>
            </div>
          ))}
        </div>
      )}

      <p className="mt-4 border-t border-slate-200 pt-3.5 text-[12px] leading-[1.6] text-slate-500">
        <span className="font-semibold text-slate-600 mr-1.5">운영 상태 안내</span>
        {CORE_INCLUDED_TOOL_POLICY.readinessNotice}
      </p>
    </div>
  );
}
