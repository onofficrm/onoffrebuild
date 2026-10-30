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

const STEPS = ['어디를 고칠지', '어떻게 바꿀지', '확인 후 접수'] as const;

const CATEGORIES = [
  { id: 'design', label: '디자인', hint: '색, 여백, 로고' },
  { id: 'layout', label: '레이아웃', hint: '배치, 메뉴, 간격' },
  { id: 'content', label: '문구', hint: '문장, 오탈자' },
  { id: 'seo_tag', label: 'SEO', hint: '제목, 설명, 태그' },
  { id: 'speed', label: '속도', hint: '로딩, 이미지' },
  { id: 'other', label: '기타', hint: '그 외 한 가지' },
];

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
  category,
  priority,
  files,
  onTitle,
  onDescription,
  onPageUrl,
  onDevice,
  onCategory,
  onPriority,
  onAddFiles,
  onRemoveFile,
  onStep,
  onCancel,
  onSubmit,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const categoryLabel = CATEGORIES.find((item) => item.id === category)?.label || category;
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
            <p className="text-[11px] font-bold text-[#2563EB]">홈페이지 수정 요청</p>
            <h2 className="text-lg sm:text-xl font-black text-[#0F172A] tracking-tight">{STEPS[step - 1]}</h2>
          </div>
          <span className="text-xs font-bold text-[#2563EB]">{step}/3</span>
        </div>
        <div className="w-full bg-[#F1F5F9] rounded-full h-2 overflow-hidden">
          <div className="bg-[#2563EB] h-2 rounded-full transition-all" style={{ width: `${(step / 3) * 100}%` }} />
        </div>
        <p className="text-xs text-[#64748B]">
          {projectLabel ? `${projectLabel} · ` : ''}한 화면, 한 가지 이슈로 적어 주세요. 수정은 기본 무료이고, 관리자가 비용을 정하면 이 화면에서 결제합니다.
        </p>
      </div>

      {step === 1 ? (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1.5">제목 *</label>
            <input
              value={title}
              onChange={(e) => onTitle(e.target.value)}
              placeholder="예: 모바일 상단 로고 크기 조정"
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
            <p className="text-xs font-bold text-[#0F172A] mb-2">어느 화면인가요?</p>
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
            <p className="text-xs font-bold text-[#0F172A] mb-2">분야</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onCategory(item.id)}
                  className={`text-left rounded-2xl border px-3 py-3 ${
                    category === item.id ? 'border-[#2563EB] bg-[#EFF6FF]' : 'border-[#E2E8F0] bg-white'
                  }`}
                >
                  <span className="block text-sm font-bold text-[#0F172A]">{item.label}</span>
                  <span className="block text-[11px] text-[#64748B] mt-0.5">{item.hint}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-[#0F172A] mb-2">긴급도</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'normal', label: '일반' },
                { id: 'urgent', label: '급함' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onPriority(item.id)}
                  className={`rounded-2xl border px-3 py-3 text-sm font-bold ${
                    priority === item.id
                      ? 'border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]'
                      : 'border-[#E2E8F0] bg-white text-[#0F172A]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1.5">상세 내용 <span className="font-medium text-[#94A3B8]">(선택)</span></label>
            <textarea
              value={description}
              onChange={(e) => onDescription(e.target.value)}
              rows={5}
              placeholder="어디에, 무엇이, 어떻게 바뀌어야 하는지 적어 주세요."
              className="w-full px-3.5 py-2.5 text-sm border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#2563EB]"
            />
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="space-y-4">
          <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 space-y-1 text-sm">
            <p className="font-black text-[#0F172A]">{title || '제목 없음'}</p>
            <p className="text-xs text-[#64748B]">
              {categoryLabel} · {deviceLabel}
              {priority === 'urgent' ? ' · 급함' : ''}
              {pageUrl ? ` · ${pageUrl}` : ''}
            </p>
            <p className="text-sm text-[#334155] whitespace-pre-wrap pt-2">{description || '상세 내용 없음'}</p>
          </div>

          <label
            className="block rounded-3xl border border-dashed border-[#93C5FD] bg-[#F8FAFC] p-6 text-center cursor-pointer"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              takeFiles(e.dataTransfer.files);
            }}
          >
            <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mx-auto">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="mt-3 text-sm font-bold text-[#0F172A]">
              스크린샷을 여기로 드래그하거나 <span className="text-[#2563EB] underline">클릭하여 선택</span>하세요
            </p>
            <p className="text-[11px] text-[#64748B] mt-1">JPG, PNG, GIF, WEBP는 미리보기가 표시됩니다. 최대 12MB</p>
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

          {files.length === 0 ? (
            <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] text-center text-xs text-[#94A3B8]">
              아직 첨부한 파일이 없습니다. 화면 캡처가 있으면 처리가 빨라집니다.
            </div>
          ) : (
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#64748B]">첨부 {files.length}개</span>
              {files.map((item) => (
                <div key={item.key} className="p-3.5 rounded-2xl bg-white border border-[#E2E8F0] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {item.previewUrl ? (
                      <a href={item.previewUrl} target="_blank" rel="noreferrer" className="shrink-0">
                        <img src={item.previewUrl} alt={item.file.name} className="h-16 w-24 rounded-lg object-cover border border-[#E2E8F0] bg-white" />
                      </a>
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
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
          )}

          <p className="text-xs text-sky-900 leading-relaxed rounded-xl bg-sky-50 border border-sky-100 px-4 py-3">
            접수 후 관리자가 확인합니다. 기본은 무료로 진행되고, 비용이 필요하면 결제 요청이 이 목록에 표시됩니다.
          </p>
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
              disabled={step === 1 ? !title.trim() : false}
              onClick={() => onStep((step + 1) as 2 | 3)}
            >
              다음
            </Button>
          ) : (
            <Button type="button" variant="primary" size="sm" disabled={busy || !title.trim()} onClick={onSubmit}>
              <CheckCircle2 className="w-4 h-4 mr-1" />
              {busy ? '접수 중' : '수정요청 접수'}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

const RAIL = [
  { id: 'requested', label: '요청됨' },
  { id: 'reviewing', label: '검토중' },
  { id: 'payment', label: '결제 대기' },
  { id: 'work', label: '작업중' },
  { id: 'feedback', label: '확인 요청' },
  { id: 'done', label: '완료' },
];

export function RevisionStatusRail({
  status,
  quotePoints,
  paidAt,
}: {
  status: string;
  quotePoints: number;
  paidAt: string | null;
}) {
  if (status === 'cancelled' || status === 'expired') {
    return (
      <p className="text-xs font-bold text-slate-500 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2">
        {status === 'cancelled' ? '취소된 요청입니다.' : '결제 기한이 지난 요청입니다.'}
      </p>
    );
  }
  const charged = status === 'quote_pending' || quotePoints > 0 || Boolean(paidAt);
  const steps = RAIL.filter((step) => charged || step.id !== 'payment');
  const currentId =
    status === 'completed'
      ? 'done'
      : status === 'feedback'
        ? 'feedback'
        : status === 'in_progress' || status === 'free_progress' || status === 'paid'
          ? 'work'
          : status === 'quote_pending'
            ? 'payment'
            : status === 'reviewing' || status === 'need_info'
              ? 'reviewing'
              : 'requested';
  const current = Math.max(0, steps.findIndex((step) => step.id === currentId));
  return (
    <ol className="flex flex-wrap gap-2">
      {steps.map((step, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <li
            key={step.id}
            className={`min-w-[5.5rem] flex-1 rounded-xl border px-2 py-2 text-center text-[11px] font-bold ${
              active
                ? 'border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]'
                : done
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-[#E2E8F0] bg-white text-[#94A3B8]'
            }`}
          >
            {step.label}
          </li>
        );
      })}
    </ol>
  );
}
