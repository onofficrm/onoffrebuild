import {
  ALL_INQUIRY_OPTIONS,
  getInquiryOptionLabel,
  type InquiryOptionItem,
} from '../../data/contactForm';
import type { InquiryServiceSlug } from '../../data/navigation';

const CORE_OPTIONS = ALL_INQUIRY_OPTIONS.filter((item) => item.group === 'core_feature');
const SERVICE_OPTIONS = ALL_INQUIRY_OPTIONS.filter(
  (item) => item.group === 'website_service' || item.group === 'separate_service',
);

interface ContactInterestServicesProps {
  selected: InquiryServiceSlug[];
  onChange: (next: InquiryServiceSlug[]) => void;
  fromQuery: boolean;
}

function toggleSlug(list: InquiryServiceSlug[], slug: InquiryServiceSlug): InquiryServiceSlug[] {
  if (list.includes(slug)) {
    return list.filter((item) => item !== slug);
  }
  return [...list, slug];
}

function ChipGroup(props: {
  title: string;
  options: InquiryOptionItem[];
  selected: InquiryServiceSlug[];
  onToggle: (slug: InquiryServiceSlug) => void;
  idPrefix: string;
}) {
  const { title, options, selected, onToggle, idPrefix } = props;
  return (
    <fieldset className="min-w-0">
      <legend className="text-[12.5px] font-semibold text-slate-700">{title}</legend>
      <div
        className="mt-2 flex flex-wrap gap-2"
        role="group"
        aria-label={title}
        id={`${idPrefix}-group`}
      >
        {options.map((item) => {
          const active = selected.includes(item.slug);
          return (
            <button
              key={item.slug}
              type="button"
              id={idPrefix === 'contact-core' && item === options[0] ? 'contact-service-first' : undefined}
              aria-pressed={active}
              onClick={() => onToggle(item.slug)}
              className={`rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors ${
                active
                  ? 'border-blue-600 bg-blue-50 text-blue-800'
                  : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function ContactInterestServices({ selected, onChange, fromQuery }: ContactInterestServicesProps) {
  const labelSummary =
    selected.length > 0
      ? selected.map((slug) => getInquiryOptionLabel(slug)).join(', ')
      : '';

  return (
    <div className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-[var(--shadow-subtle)] sm:p-6">
      <h3 className="text-[15px] font-bold text-slate-950">관심 기능·서비스</h3>
      <p className="mt-1.5 text-[13.5px] text-slate-600">
        {fromQuery && selected.length > 0
          ? `이전 페이지에서 선택한 항목이 반영되었습니다: ${labelSummary}`
          : '상담 범위를 맞추려면 관련 항목을 선택해 주세요. (선택 사항)'}
      </p>

      <div className="mt-5 space-y-4">
        <ChipGroup
          title="기본 기능"
          options={CORE_OPTIONS}
          selected={selected}
          onToggle={(slug) => onChange(toggleSlug(selected, slug))}
          idPrefix="contact-core"
        />
        <ChipGroup
          title="홈페이지·별도 서비스"
          options={SERVICE_OPTIONS}
          selected={selected}
          onToggle={(slug) => onChange(toggleSlug(selected, slug))}
          idPrefix="contact-svc"
        />
      </div>
    </div>
  );
}