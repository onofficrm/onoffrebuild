import {
  OPERATIONAL_STATUS_META,
  PROVISION_POLICY_META,
  type PlatformOffering,
} from '../../data/platformCapabilities';

interface FeaturePolicyStatusCardProps {
  offering: PlatformOffering;
}

export function FeaturePolicyStatusCard({ offering }: FeaturePolicyStatusCardProps) {
  const policyMeta = PROVISION_POLICY_META[offering.provisionPolicy];
  const statusMeta = OPERATIONAL_STATUS_META[offering.operationalStatus];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between border-b border-slate-200 pb-4">
        <p className="text-[13px] font-semibold text-blue-600">제공 정책 및 실제 운영 상태 안내</p>
        <p className="text-[12px] text-slate-500">
          {policyMeta.shortLabel} · {statusMeta.shortLabel}
        </p>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-[12px] font-semibold text-slate-500">제공 정책</p>
            {offering.separateSubscriptionFeeLabel && (
              <p className="text-[12px] font-semibold text-blue-600">
                {offering.separateSubscriptionFeeLabel}
              </p>
            )}
          </div>
          <p className="mt-1.5 text-[17px] font-semibold text-slate-950">{policyMeta.label}</p>
          <p className="mt-2 text-[14px] leading-[1.65] text-slate-600">{offering.policyDetail}</p>
        </div>

        <div className="rounded-xl border border-[#2563EB]/25 bg-slate-50 p-5">
          <p className="text-[12px] font-semibold text-blue-600">현재 운영 상태</p>
          <p className="mt-1.5 text-[17px] font-semibold text-slate-950">{statusMeta.label}</p>
          <p className="mt-2 text-[14px] leading-[1.65] text-slate-600">{offering.statusDetail}</p>
        </div>
      </div>

      <div className="mt-5 space-y-1.5 border-t border-slate-200 pt-4 text-[13px] leading-[1.6]">
        {offering.costBoundaryNote && (
          <p className="text-slate-950">
            <span className="font-semibold text-blue-600 mr-2">비용 구분</span>
            {offering.costBoundaryNote}
          </p>
        )}
        <p className="text-slate-950">
          <span className="font-semibold text-slate-500 mr-2">현행 제공 방식</span>
          {offering.currentDeliveryMode}
        </p>
        <p className="text-slate-500">
          <span className="font-semibold text-slate-600 mr-2">유의사항</span>
          {offering.guardrailNote}
        </p>
      </div>
    </div>
  );
}
