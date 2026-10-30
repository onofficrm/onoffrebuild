import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ExternalLink, ImagePlus, Monitor, Smartphone, X } from 'lucide-react';
import { Button } from '../common/Button';
import type { RevisionAnnotateTool, RevisionAnnotation } from '../../types/revisionAnnotation';

export type AnnotateTool = RevisionAnnotateTool;

const BLOCKS = [
  { id: 'nav', label: '상단 메뉴', top: 0, height: 12 },
  { id: 'hero', label: '히어로', top: 12, height: 30 },
  { id: 'body', label: '본문', top: 42, height: 40 },
  { id: 'footer', label: '하단', top: 82, height: 18 },
];

function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

function pointIn(el: HTMLElement, clientX: number, clientY: number) {
  const rect = el.getBoundingClientRect();
  return {
    x: clamp(((clientX - rect.left) / rect.width) * 100),
    y: clamp(((clientY - rect.top) / rect.height) * 100),
  };
}

export function formatRevisionAnnotation(mark: RevisionAnnotation, note: string) {
  const lines = [`[표시] ${mark.label} · ${mark.device === 'mobile' ? '모바일' : 'PC'}`];
  if (mark.box) {
    lines.push(
      `영역: ${Math.round(mark.box.x)},${Math.round(mark.box.y)} - ${Math.round(mark.box.x + mark.box.w)},${Math.round(mark.box.y + mark.box.h)}`
    );
  }
  if (note.trim()) {
    lines.push('', note.trim());
  }
  return lines.join('\n');
}

type Props = {
  projectLabel: string;
  previewUrl: string;
  busy: boolean;
  onSubmit: (payload: {
    title: string;
    description: string;
    pageUrl: string;
    device: string;
    category: string;
    annotation: RevisionAnnotation;
    snapshotFile?: File;
  }) => void;
};

export const RevisionAnnotateWorkspace: React.FC<Props> = ({
  projectLabel,
  previewUrl,
  busy,
  onSubmit,
}) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const [tool, setTool] = useState<AnnotateTool>('block');
  const [device, setDevice] = useState<'pc' | 'mobile'>('pc');
  const [mark, setMark] = useState<RevisionAnnotation | null>(null);
  const [draftBox, setDraftBox] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [penPoints, setPenPoints] = useState<Array<{ x: number; y: number }>>([]);
  const drawing = useRef(false);
  const boxStart = useRef<{ x: number; y: number } | null>(null);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [snapshotFile, setSnapshotFile] = useState<File | null>(null);
  const [snapshotPreview, setSnapshotPreview] = useState('');
  const snapshotInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (snapshotPreview) URL.revokeObjectURL(snapshotPreview);
    };
  }, [snapshotPreview]);

  const applySnapshot = (file: File | null) => {
    setSnapshotPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return file ? URL.createObjectURL(file) : '';
    });
    setSnapshotFile(file);
  };

  const boxStyle = useMemo(() => {
    const box = draftBox || mark?.box;
    if (!box) return null;
    return {
      left: `${box.x}%`,
      top: `${box.y}%`,
      width: `${box.w}%`,
      height: `${box.h}%`,
    };
  }, [draftBox, mark]);

  const applyBlock = (label: string, box: { x: number; y: number; w: number; h: number }) => {
    setMark({
      tool: 'block',
      label,
      device,
      pageUrl: previewUrl,
      box,
    });
    setDraftBox(null);
    setPenPoints([]);
    setError('');
  };

  const onStageDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const start = pointIn(stageRef.current, event.clientX, event.clientY);
    drawing.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);

    if (tool === 'block') {
      const hit = BLOCKS.find((item) => start.y >= item.top && start.y < item.top + item.height) || BLOCKS[2];
      applyBlock(hit.label, { x: 4, y: hit.top, w: 92, h: hit.height });
      drawing.current = false;
      return;
    }
    if (tool === 'box') {
      boxStart.current = start;
      setDraftBox({ x: start.x, y: start.y, w: 0, h: 0 });
      return;
    }
    setPenPoints([start]);
  };

  const onStageMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!drawing.current || !stageRef.current || tool === 'block') return;
    const next = pointIn(stageRef.current, event.clientX, event.clientY);
    if (tool === 'box' && boxStart.current) {
      const origin = boxStart.current;
      setDraftBox({
        x: Math.min(origin.x, next.x),
        y: Math.min(origin.y, next.y),
        w: Math.abs(next.x - origin.x),
        h: Math.abs(next.y - origin.y),
      });
      return;
    }
    setPenPoints((prev) => (prev.length ? [...prev, next] : [next]));
  };

  const onStageUp = () => {
    if (!drawing.current) return;
    drawing.current = false;
    if (tool === 'box' && draftBox && draftBox.w > 1 && draftBox.h > 1) {
      setMark({
        tool: 'box',
        label: '선택한 영역',
        device,
        pageUrl: previewUrl,
        box: draftBox,
      });
      setError('');
    }
    if (tool === 'pen' && penPoints.length > 1) {
      const xs = penPoints.map((p) => p.x);
      const ys = penPoints.map((p) => p.y);
      const x = Math.min(...xs);
      const y = Math.min(...ys);
      setMark({
        tool: 'pen',
        label: '펜으로 표시한 부분',
        device,
        pageUrl: previewUrl,
        box: { x, y, w: Math.max(2, Math.max(...xs) - x), h: Math.max(2, Math.max(...ys) - y) },
      });
      setError('');
    }
  };

  const handleSubmit = () => {
    if (!mark) {
      setError('고칠 자리를 먼저 찍어 주세요.');
      return;
    }
    if (!note.trim()) {
      setError('바꾸고 싶은 내용을 한 줄이라도 적어 주세요.');
      return;
    }
    onSubmit({
      title: mark.label,
      description: note.trim(),
      pageUrl: previewUrl,
      device,
      category: mark.tool === 'block' && mark.label === '상단 메뉴' ? 'layout' : 'design',
      annotation: { ...mark, pageUrl: previewUrl, device },
      snapshotFile: snapshotFile || undefined,
    });
  };

  return (
    <section className="bg-white rounded-3xl border border-[#E2E8F0] overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-[#E2E8F0] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-[11px] font-bold text-[#2563EB]">수정하기</p>
          <p className="truncate text-sm font-black text-[#0F172A]">{projectLabel || '내 홈페이지'}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            aria-pressed={device === 'pc'}
            onClick={() => setDevice('pc')}
            className={`inline-flex h-8 items-center gap-1 rounded-full border px-3 text-xs font-bold ${
              device === 'pc' ? 'border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]' : 'border-[#E2E8F0] text-[#0F172A]'
            }`}
          >
            <Monitor className="h-3.5 w-3.5" />
            PC
          </button>
          <button
            type="button"
            aria-pressed={device === 'mobile'}
            onClick={() => setDevice('mobile')}
            className={`inline-flex h-8 items-center gap-1 rounded-full border px-3 text-xs font-bold ${
              device === 'mobile' ? 'border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]' : 'border-[#E2E8F0] text-[#0F172A]'
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            모바일
          </button>
          {(
            [
              ['block', '블록'],
              ['box', '영역'],
              ['pen', '펜'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              aria-pressed={tool === id}
              onClick={() => setTool(id)}
              className={`inline-flex h-8 items-center rounded-full border px-3 text-xs font-bold ${
                tool === id ? 'border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]' : 'border-[#E2E8F0] text-[#0F172A]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid min-h-[28rem] grid-cols-1 lg:grid-cols-[minmax(0,1.45fr)_minmax(240px,0.8fr)]">
        <div className="bg-[#F8FAFC] p-4">
          <div
            className={`relative mx-auto overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white ${
              device === 'mobile' ? 'max-w-[360px]' : 'max-w-4xl'
            }`}
          >
            <div
              ref={stageRef}
              className="relative aspect-[3/4] cursor-crosshair sm:aspect-[16/11]"
              onPointerDown={onStageDown}
              onPointerMove={onStageMove}
              onPointerUp={onStageUp}
              onPointerCancel={onStageUp}
            >
              {snapshotPreview ? (
                <img
                  src={snapshotPreview}
                  alt="올린 화면"
                  className="pointer-events-none absolute inset-0 h-full w-full bg-white object-contain"
                />
              ) : previewUrl ? (
                <iframe
                  title="홈페이지 미리보기"
                  src={previewUrl}
                  className="pointer-events-none absolute inset-0 h-full w-full bg-white"
                  sandbox="allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-[#F8FAFC] px-6 text-center text-sm text-[#64748B]">
                  화면이 안 보이면 스크린샷을 올린 뒤 그 위에 표시하세요.
                </div>
              )}
              <div className="absolute inset-0">
                {tool === 'block'
                  ? BLOCKS.map((item) => (
                      <div
                        key={item.id}
                        className={`absolute left-0 right-0 border-b border-dashed border-[#93C5FD]/70 ${
                          mark?.label === item.label ? 'bg-[#2563EB]/10' : 'bg-transparent'
                        }`}
                        style={{ top: `${item.top}%`, height: `${item.height}%` }}
                      />
                    ))
                  : null}
                {boxStyle ? (
                  <div className="absolute rounded-md border-2 border-[#2563EB] bg-[#2563EB]/10" style={boxStyle} />
                ) : null}
                {penPoints.length > 1 ? (
                  <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <polyline
                      fill="none"
                      stroke="#2563EB"
                      strokeWidth="1.2"
                      points={penPoints.map((p) => `${p.x},${p.y}`).join(' ')}
                    />
                  </svg>
                ) : null}
              </div>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {previewUrl ? (
              <a
                href={previewUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2563EB]"
              >
                새 창에서 열기 <ExternalLink className="h-3 w-3" />
              </a>
            ) : null}
            <input
              ref={snapshotInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0] || null;
                event.target.value = '';
                if (file) applySnapshot(file);
              }}
            />
            <button
              type="button"
              onClick={() => snapshotInputRef.current?.click()}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0F172A]"
            >
              <ImagePlus className="h-3 w-3" />
              {snapshotFile ? '다른 화면 올리기' : '화면이 안 보이면 스크린샷 올리기'}
            </button>
            {snapshotFile ? (
              <button
                type="button"
                onClick={() => applySnapshot(null)}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#64748B]"
              >
                <X className="h-3 w-3" />
                올린 화면 빼기
              </button>
            ) : null}
          </div>
          {snapshotFile ? (
            <p className="mt-1 text-[11px] text-[#64748B]">올린 화면 위에 표시한 내용이 관리자에게 그대로 전달됩니다.</p>
          ) : previewUrl ? (
            <p className="mt-1 text-[11px] text-[#64748B]">
              미리보기가 하얗게 보이면 새 창에서 연 뒤 스크린샷을 올려 그 위에 찍으세요.
            </p>
          ) : null}
        </div>

        <aside className="space-y-3 border-t border-[#E2E8F0] p-4 lg:border-l lg:border-t-0">
          <h2 className="text-sm font-black text-[#0F172A]">찍은 부분</h2>
          <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-3">
            <p className="text-sm font-bold text-[#0F172A]">{mark?.label || '아직 찍은 부분 없음'}</p>
            <p className="mt-1 text-[11px] text-[#64748B]">
              {mark
                ? `${device === 'mobile' ? '모바일' : 'PC'}${previewUrl ? ` · ${previewUrl}` : ''}`
                : '블록이나 영역으로 고칠 자리를 선택하세요'}
            </p>
          </div>
          <label className="block text-xs font-bold text-[#0F172A]">
            이 부분을 어떻게 바꿀까요?
            <textarea
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
                if (error) setError('');
              }}
              rows={5}
              placeholder="더 신뢰감 있게 바꿔 주세요."
              className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-[#2563EB]"
            />
          </label>
          {error ? <p className="text-xs font-bold text-rose-600">{error}</p> : null}
          <p className="text-[11px] text-[#64748B]">
            접수 후 온오프가 읽고 정리한 뒤에 작업이 시작됩니다. 기본은 무료입니다.
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={busy}
              onClick={() => {
                setMark(null);
                setDraftBox(null);
                setPenPoints([]);
                setNote('');
                setError('');
              }}
            >
              표시 지우기
            </Button>
            <Button type="button" variant="primary" size="sm" disabled={busy} onClick={handleSubmit}>
              {busy ? '접수 중' : '수정 요청'}
            </Button>
          </div>
        </aside>
      </div>
    </section>
  );
};
