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
  const [tool, setTool] = useState<AnnotateTool>('box');
  const [device, setDevice] = useState<'pc' | 'mobile'>('pc');
  const [mark, setMark] = useState<RevisionAnnotation | null>(null);
  const [draftBox, setDraftBox] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const drawing = useRef(false);
  const boxStart = useRef<{ x: number; y: number } | null>(null);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [pageUrl, setPageUrl] = useState(previewUrl || '');
  const [snapshotFile, setSnapshotFile] = useState<File | null>(null);
  const [snapshotPreview, setSnapshotPreview] = useState('');
  const [iframeFailed, setIframeFailed] = useState(false);
  const snapshotInputRef = useRef<HTMLInputElement>(null);
  const liveUrl = (pageUrl || previewUrl || '').trim();
  const step: 1 | 2 | 3 = !mark ? 1 : !note.trim() ? 2 : 3;

  useEffect(() => {
    if (previewUrl && !pageUrl) setPageUrl(previewUrl);
  }, [previewUrl, pageUrl]);

  useEffect(() => {
    setIframeFailed(false);
  }, [liveUrl, device]);

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
      pageUrl: liveUrl,
      box,
    });
    setDraftBox(null);
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
    boxStart.current = start;
    setDraftBox({ x: start.x, y: start.y, w: 0, h: 0 });
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
    }
  };

  const onStageUp = () => {
    if (!drawing.current) return;
    drawing.current = false;
    if (tool === 'box' && draftBox && draftBox.w > 1 && draftBox.h > 1) {
      setMark({
        tool: 'box',
        label: '선택한 영역',
        device,
        pageUrl: liveUrl,
        box: draftBox,
      });
      setError('');
    }
  };

  const handleSubmit = () => {
    if (!mark) {
      setError('고칠 자리를 먼저 선택해 주세요.');
      return;
    }
    if (!note.trim()) {
      setError('어떻게 바꿀지 한 줄로 적어 주세요.');
      return;
    }
    onSubmit({
      title: mark.label,
      description: note.trim(),
      pageUrl: liveUrl,
      device,
      category: mark.tool === 'block' && mark.label === '상단 메뉴' ? 'layout' : 'design',
      annotation: { ...mark, pageUrl: liveUrl, device },
      snapshotFile: snapshotFile || undefined,
    });
  };

  return (
    <section className="overflow-hidden rounded-3xl border border-[#E2E8F0] bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-[#E2E8F0] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-[11px] font-bold text-[#2563EB]">스튜디오 수정</p>
          <p className="truncate text-sm font-black text-[#0F172A]">{projectLabel || '내 홈페이지'}</p>
        </div>
        <ol className="grid w-full max-w-md grid-cols-3 gap-1.5 sm:w-auto">
          {[
            { id: 1, label: '표시' },
            { id: 2, label: '한 줄 설명' },
            { id: 3, label: '보내기' },
          ].map((item) => {
            const active = step === item.id;
            const done = step > item.id;
            return (
              <li
                key={item.id}
                className={`rounded-lg px-2 py-1.5 text-center text-[11px] font-bold ${
                  active ? 'bg-[#2563EB] text-white' : done ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-400'
                }`}
              >
                {item.id}. {item.label}
              </li>
            );
          })}
        </ol>
      </div>

      <div className="grid min-h-[34rem] grid-cols-1 lg:grid-cols-[minmax(0,1.55fr)_minmax(280px,0.75fr)]">
        {/* Left: live homepage studio canvas */}
        <div className="flex min-h-[28rem] flex-col bg-[#0B1220] p-3 sm:p-4">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              aria-pressed={device === 'pc'}
              onClick={() => setDevice('pc')}
              className={`inline-flex h-8 items-center gap-1 rounded-lg border px-3 text-xs font-bold ${
                device === 'pc' ? 'border-white bg-white text-slate-900' : 'border-white/20 text-white/80'
              }`}
            >
              <Monitor className="h-3.5 w-3.5" />
              PC
            </button>
            <button
              type="button"
              aria-pressed={device === 'mobile'}
              onClick={() => setDevice('mobile')}
              className={`inline-flex h-8 items-center gap-1 rounded-lg border px-3 text-xs font-bold ${
                device === 'mobile' ? 'border-white bg-white text-slate-900' : 'border-white/20 text-white/80'
              }`}
            >
              <Smartphone className="h-3.5 w-3.5" />
              모바일
            </button>
            {(
              [
                ['box', '영역 선택'],
                ['block', '블록 선택'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                aria-pressed={tool === id}
                onClick={() => setTool(id)}
                className={`inline-flex h-8 items-center rounded-lg border px-3 text-xs font-bold ${
                  tool === id ? 'border-sky-300 bg-sky-400 text-slate-950' : 'border-white/20 text-white/80'
                }`}
              >
                {label}
              </button>
            ))}
            {liveUrl ? (
              <a
                href={liveUrl}
                target="_blank"
                rel="noreferrer"
                className="ml-auto inline-flex items-center gap-1 text-[11px] font-bold text-sky-300"
              >
                새 창 <ExternalLink className="h-3 w-3" />
              </a>
            ) : null}
          </div>

          <div
            className={`relative mx-auto w-full flex-1 overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl shadow-black/40 ${
              device === 'mobile' ? 'max-w-[390px]' : 'max-w-5xl'
            }`}
          >
            <div
              ref={stageRef}
              className="relative h-full min-h-[26rem] cursor-crosshair sm:min-h-[30rem]"
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
              ) : liveUrl && !iframeFailed ? (
                <iframe
                  title="홈페이지 스튜디오 미리보기"
                  src={liveUrl}
                  className="pointer-events-none absolute inset-0 h-full w-full bg-white"
                  sandbox="allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-same-origin"
                  onError={() => setIframeFailed(true)}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-50 px-6 text-center">
                  <p className="text-sm font-bold text-slate-900">홈페이지를 왼쪽에 띄우려면 주소를 넣거나 캡처를 올리세요</p>
                  <button
                    type="button"
                    onClick={() => snapshotInputRef.current?.click()}
                    className="inline-flex items-center gap-1 rounded-full bg-[#2563EB] px-3 py-1.5 text-xs font-bold text-white"
                  >
                    <ImagePlus className="h-3.5 w-3.5" />
                    캡처 올리기
                  </button>
                </div>
              )}

              {/* Selection overlay — studio builder style */}
              <div className="absolute inset-0">
                {tool === 'block'
                  ? BLOCKS.map((item) => (
                      <div
                        key={item.id}
                        className={`absolute left-0 right-0 border-b border-dashed border-sky-300/50 ${
                          mark?.label === item.label ? 'bg-sky-400/20' : 'bg-transparent hover:bg-sky-400/10'
                        }`}
                        style={{ top: `${item.top}%`, height: `${item.height}%` }}
                      />
                    ))
                  : null}
                {boxStyle ? (
                  <div
                    className="absolute rounded-md border-2 border-sky-400 bg-sky-400/15 shadow-[0_0_0_9999px_rgba(15,23,42,0.28)]"
                    style={boxStyle}
                  >
                    <span className="absolute -top-6 left-0 rounded bg-sky-400 px-1.5 py-0.5 text-[10px] font-bold text-slate-950">
                      {mark?.label || '선택 중'}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <p className="mt-2 text-center text-[11px] text-white/60">
            {tool === 'box' ? '드래그해서 고칠 부분만 선택하세요.' : '블록을 눌러 구역을 고르세요.'}
          </p>
        </div>

        {/* Right: note / send */}
        <aside className="space-y-4 border-t border-[#E2E8F0] p-4 lg:border-l lg:border-t-0">
          <label className="block text-xs font-bold text-[#0F172A]">
            페이지 주소
            <input
              value={pageUrl}
              onChange={(e) => setPageUrl(e.target.value)}
              placeholder="https://"
              className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-[#2563EB]"
            />
          </label>

          <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-3">
            <p className="text-[11px] font-bold text-slate-500">1. 표시</p>
            <p className="text-sm font-bold text-[#0F172A]">{mark?.label || '아직 선택 없음'}</p>
            {mark?.box ? (
              <p className="mt-1 font-mono text-[10px] text-slate-500">
                {Math.round(mark.box.x)},{Math.round(mark.box.y)} · {Math.round(mark.box.w)}×{Math.round(mark.box.h)}
              </p>
            ) : null}
          </div>

          <label className="block text-xs font-bold text-[#0F172A]">
            2. 한 줄 설명
            <input
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
                if (error) setError('');
              }}
              placeholder="예: 로고와 메뉴 사이 간격만 줄여 주세요"
              className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-[#2563EB]"
            />
          </label>

          <div className="flex flex-wrap gap-2">
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
              {snapshotFile ? '다른 캡처' : '캡처 올리기'}
            </button>
            {snapshotFile ? (
              <button
                type="button"
                onClick={() => applySnapshot(null)}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#64748B]"
              >
                <X className="h-3 w-3" />
                캡처 빼기
              </button>
            ) : null}
          </div>

          {iframeFailed && liveUrl && !snapshotPreview ? (
            <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] text-amber-900">
              사이트가 미리보기 삽입을 막았습니다. 새 창으로 보거나 캡처를 올려 주세요.
            </p>
          ) : null}

          {error ? <p className="text-xs font-bold text-rose-600">{error}</p> : null}

          <div className="flex gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={busy}
              onClick={() => {
                setMark(null);
                setDraftBox(null);
                setNote('');
                setError('');
              }}
            >
              지우기
            </Button>
            <Button type="button" variant="primary" size="sm" disabled={busy || !mark || !note.trim()} onClick={handleSubmit}>
              {busy ? '보내는 중' : '3. 보내기'}
            </Button>
          </div>
        </aside>
      </div>
    </section>
  );
};
