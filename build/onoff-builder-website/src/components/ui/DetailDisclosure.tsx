import { useId, useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

interface DetailDisclosureProps {
  label: string;
  summary?: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

/**
 * Accessible collapsible detail drawer for keeping SEO, technical, and policy disclosures intact
 * without elongating the primary visual scroll flow.
 */
export function DetailDisclosure({
  label,
  summary,
  children,
  defaultOpen = false,
  className = '',
}: DetailDisclosureProps) {
  const [open, setOpen] = useState(defaultOpen);
  const contentId = useId();

  return (
    <div
      className={`overflow-hidden rounded-[16px] border border-slate-200 bg-slate-50 ${className}`.trim()}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={contentId}
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full min-h-[52px] cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left transition-colors duration-150 hover:bg-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2563EB] sm:px-6"
      >
        <div className="min-w-0">
          <span className="block text-[14.5px] font-semibold leading-[1.35] text-slate-950">
            {label}
          </span>
          {summary && (
            <span className="mt-0.5 block text-[13px] leading-[1.45] text-slate-500">
              {summary}
            </span>
          )}
        </div>
        <ChevronDown
          aria-hidden="true"
          className={`h-4 w-4 shrink-0 text-slate-500 transition-transform duration-150 ${
            open ? 'rotate-180 text-slate-950' : ''
          }`}
        />
      </button>

      <div
        id={contentId}
        hidden={!open}
        className="border-t border-slate-200 bg-white px-5 py-5 text-[14px] leading-[1.65] text-slate-600 sm:px-6"
      >
        {children}
      </div>
    </div>
  );
}
