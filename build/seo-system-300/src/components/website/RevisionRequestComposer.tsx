import React, { useRef } from 'react';
import { CheckCircle2, FileText, Trash2, UploadCloud } from 'lucide-react';
import { Button } from '../common/Button';
import { websiteImagePreviewUrl } from '../../services/websiteOrderService';

export type PendingAttachment = { key: string; file: File; previewUrl: string };

export function pendingAttachment(file: File, index: number): PendingAttachment {
  const previewable = websiteImagePreviewUrl({
    originalName: file.name,
    mimeType: file.type,
    downloadUrl: 'local',
  });
  return {
    key: `${file.name}-${file.size}-${file.lastModified}-${index}`,
    file,
    previewUrl: previewable ? URL.createObjectURL(file) : '',
  };
}

const STEPS = ['표시', '한 줄 설명', '보내기'] as const;

const DEVICES = [
  { id: 'pc', label: 'PC' },
  { id: 'mobile', label: '모바일' },
  { id: 'both', label: 'PC·모바일' },
];

function formatBytes(size: number) {
  if (size < 1024) return `${size}B`;
  if (size < 1024 * 1024) return `${Math.round(size / 1024)}KB`;
  return `${(size / (1024 * 1024)).toFixed(1)}MB`;
}

type Props = {
  projectLabel: string;
  step: 1 | 2 | 3;
  busy: boolean;
  title: string;
  description: string;
  pageUrl: string;
  device: string;
  category: string;
  priority: string;
  files: PendingAttachment[];
  onTitle: (value: string) => void;
  onDescription: (value: string) => void;
  onPageUrl: (value: string) => void;
  onDevice: (value: string) => void;
  onCategory: (value: string) => void;
  onPriority: (value: string) => void;
  onAddFiles: (files: File[]) => void;
  onRemoveFile: (key: string) => void;
  onStep: (step: 1 | 2 | 3) => void;
  onCancel: () => void;
  onSubmit: () => void;
};

export const RevisionRequestComposer: React.FC<Props> = ({
  projectLabel,
  step,
  busy,
  title,
  description,
  pageUrl,
  device,
  files,
  onTitle,
  onDescription,
  onPageUrl,
  onDevice,
  onAddFiles,
  onRemoveFile,
  onStep,
  onCancel,
  onSubmit,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const deviceLabel = DEVICES.find((item) => item.id === device)?.label || device;

  const takeFiles = (list: FileList | null) => {
    const selected: File[] = list ? Array.from(list) : [];
    if (selected.length) onAddFiles(selected);
  };

  return (
    <section className="bg-white rounded-3xl border border-[#E2E8F0] shadow-xs p-5 sm:p-8 space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold text-[#2563EB]">수정 요청</p>
            <h2 className="text-lg sm:text-xl font-black text-[#0F172A] tracking-tight">{STEPS[step - 1]}</h2>
          </div>
          <span className="text-xs font-bold text-[#2563EB]">{step}/3</span>
        </div>
        <ol className="grid grid-cols-3 gap-1.5">
          {STEPS.map((label, index) => {
            const id = (index + 1) as 1 | 2 | 3;
            const active = step === id;
            const done = step > id;
            return (
              <li
                key={label}
                className={`rounded-lg px-2 py-1.5 text-center text-[11px] font-bold ${
                  active ? 'bg-[#2563EB] text-white' : done ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-400'
                }`}
              >
                {id}. {label}
              </li>
            );
          })}
        </ol>
        <p className="text-xs text-[#64748B]">
          {projectLabel ? `${projectLabel} · ` : ''}한 화면만, 한 가지씩.
        </p>
      </div>

      {step === 1 ? (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1.5">어디를 고칠까요? *</label>
            <input
              value={title}
              onChange={(e) => onTitle(e.target.value)}
              placeholder="예: 상단 로고"
              className="w-full px-3.5 py-2.5 text-sm border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#2563EB]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1.5">페이지 URL</label>
            <input
              value={pageUrl}
              onChange={(e) => onPageUrl(e.target.value)}
              placeholder="https://"
              className="w-full px-3.5 py-2.5 text-sm border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#2563EB]"
            />
          </div>
          <div>
            <p className="text-xs font-bold text-[#0F172A] mb-2">화면</p>
            <div className="grid grid-cols-3 gap-2">
              {DEVICES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onDevice(item.id)}
                  className={`rounded-2xl border px-3 py-3 text-sm font-bold ${
                    device === item.id
                      ? 'border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]'
                      : 'border-[#E2E8F0] bg-white text-[#0F172A]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1.5">한 줄 설명 *</label>
            <input
              value={description}
              onChange={(e) => onDescription(e.target.value)}
              placeholder="예: 로고와 메뉴 사이 간격만 줄여 주세요"
              className="w-full px-3.5 py-2.5 text-sm border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#2563EB]"
            />
          </div>
          <p className="text-xs text-[#64748B]">표시: {title || '—'} · {deviceLabel}</p>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="space-y-4">
          <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 space-y-1 text-sm">
            <p className="font-black text-[#0F172A]">{title || '표시 없음'}</p>
            <p className="text-xs text-[#64748B]">
              {deviceLabel}
              {pageUrl ? ` · ${pageUrl}` : ''}
            </p>
            <p className="text-sm text-[#334155] pt-2">{description || '설명 없음'}</p>
          </div>

          <label
            className="block rounded-3xl border border-dashed border-[#93C5FD] bg-[#F8FAFC] p-5 text-center cursor-pointer"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              takeFiles(e.dataTransfer.files);
            }}
          >
            <div className="w-10 h-10 rounded-2xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mx-auto">
              <UploadCloud className="w-5 h-5" />
            </div>
            <p className="mt-2 text-sm font-bold text-[#0F172A]">캡처 올리기 (선택)</p>
            <input
              ref={inputRef}
              type="file"
              className="sr-only"
              multiple
              accept="image/jpeg,image/png,image/gif,image/webp,.pdf,.zip,.doc,.docx,.txt"
              onChange={(e) => {
                takeFiles(e.target.files);
                e.currentTarget.value = '';
              }}
            />
          </label>

          {files.length > 0 ? (
            <div className="space-y-2">
              {files.map((item) => (
                <div key={item.key} className="p-3 rounded-2xl bg-white border border-[#E2E8F0] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {item.previewUrl ? (
                      <img src={item.previewUrl} alt={item.file.name} className="h-12 w-16 rounded-lg object-cover border border-[#E2E8F0]" />
                    ) : (
                      <div className="w-9 h-9 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#0F172A] truncate">{item.file.name}</p>
                      <p className="text-[10px] text-[#64748B]">{formatBytes(item.file.size)}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-500 shrink-0"
                    aria-label={`${item.file.name} 제거`}
                    onClick={() => onRemoveFile(item.key)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="wizard-cta-bar">
        <Button type="button" variant="outline" size="sm" disabled={busy} onClick={onCancel}>
          취소
        </Button>
        <div className="flex items-center gap-2">
          {step > 1 ? (
            <Button type="button" variant="outline" size="sm" disabled={busy} onClick={() => onStep((step - 1) as 1 | 2)}>
              이전
            </Button>
          ) : null}
          {step < 3 ? (
            <Button
              type="button"
              variant="primary"
              size="sm"
              disabled={step === 1 ? !title.trim() : !description.trim()}
              onClick={() => onStep((step + 1) as 2 | 3)}
            >
              다음
            </Button>
          ) : (
            <Button type="button" variant="primary" size="sm" disabled={busy || !title.trim() || !description.trim()} onClick={onSubmit}>
              <CheckCircle2 className="w-4 h-4 mr-1" />
              {busy ? '보내는 중' : '보내기'}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

/** Customer-facing progress only — 접수 → 진행 → 확인 → 완료 */
const SIMPLE_RAIL = [
  { id: 'received', label: '접수' },
  { id: 'working', label: '진행' },
  { id: 'feedback', label: '확인' },
  { id: 'done', label: '완료' },
];

function mapCustomerRailStep(status: string, progressId?: string): string {
  if (status === 'completed' || progressId === 'done') return 'done';
  if (status === 'feedback' || progressId === 'feedback') return 'feedback';
  if (
    progressId === 'work' ||
    progressId === 'queued' ||
    progressId === 'need_info' ||
    progressId === 'payment' ||
    ['in_progress', 'free_progress', 'paid', 'need_info', 'quote_pending'].includes(status)
  ) {
    return 'working';
  }
  return 'received';
}

export function RevisionStatusRail({
  status,
  progressId,
}: {
  status: string;
  /** @deprecated kept for call-site compatibility */
  quotePoints?: number;
  /** @deprecated kept for call-site compatibility */
  paidAt?: string | null;
  progressId?: string;
}) {
  if (status === 'cancelled' || status === 'expired') {
    return (
      <p className="text-xs font-bold text-slate-500 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2">
        {status === 'cancelled' ? '취소' : '만료'}
      </p>
    );
  }
  const currentId = mapCustomerRailStep(status, progressId);
  const current = Math.max(0, SIMPLE_RAIL.findIndex((step) => step.id === currentId));
  return (
    <ol className="grid grid-cols-4 gap-1.5">
      {SIMPLE_RAIL.map((step, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <li
            key={step.id}
            className={`rounded-lg px-1.5 py-2 text-center text-[11px] font-bold ${
              active
                ? 'bg-[#2563EB] text-white'
                : done
                  ? 'bg-emerald-50 text-emerald-800'
                  : 'bg-[#F1F5F9] text-[#94A3B8]'
            }`}
          >
            {step.label}
          </li>
        );
      })}
    </ol>
  );
}
