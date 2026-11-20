import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

type Point = { x: number; y: number };

export type SignatureCanvasRef = {
  clear: () => void;
  isEmpty: () => boolean;
  getDataURL: () => string | null;
};

type SignatureCanvasProps = {
  id?: string;
  className?: string;
  onValidityChange?: (hasStroke: boolean) => void;
  disabled?: boolean;
};

export const SignatureCanvas = forwardRef<SignatureCanvasRef, SignatureCanvasProps>(function SignatureCanvas(
  { id = 'contract-signature', className = '', onValidityChange, disabled = false },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef<Point | null>(null);
  const strokeCountRef = useRef(0);
  const [hasStroke, setHasStroke] = useState(false);

  const notify = useCallback(
    (next: boolean) => {
      setHasStroke(next);
      onValidityChange?.(next);
    },
    [onValidityChange]
  );

  const clear = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const cssW = canvas.clientWidth;
    const cssH = canvas.clientHeight;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, cssW, cssH);
    strokeCountRef.current = 0;
    notify(false);
  }, [notify]);

  useImperativeHandle(
    ref,
    () => ({
      clear,
      isEmpty: () => strokeCountRef.current === 0,
      getDataURL: () => {
        if (strokeCountRef.current === 0) return null;
        const canvas = canvasRef.current;
        if (!canvas) return null;
        try {
          return canvas.toDataURL('image/png');
        } catch {
          return null;
        }
      },
    }),
    [clear]
  );

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cssW = parent.clientWidth;
    const cssH = 140;
    const prev = canvas.toDataURL('image/png');
    const hadContent = strokeCountRef.current > 0;

    canvas.width = Math.floor(cssW * dpr);
    canvas.height = Math.floor(cssH * dpr);
    canvas.style.width = `${cssW}px`;
    canvas.style.height = `${cssH}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.2;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, cssW, cssH);

    if (hadContent) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, cssW, cssH);
      };
      img.src = prev;
    }
  }, []);

  useEffect(() => {
    resizeCanvas();
    const onResize = () => resizeCanvas();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [resizeCanvas]);

  const getPoint = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDraw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (disabled) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);
    drawingRef.current = true;
    lastPointRef.current = getPoint(e);
  };

  const moveDraw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current || disabled) return;
    e.preventDefault();
    const ctx = canvasRef.current?.getContext('2d');
    const last = lastPointRef.current;
    if (!ctx || !last) return;
    const point = getPoint(e);
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    lastPointRef.current = point;
    if (strokeCountRef.current === 0) {
      strokeCountRef.current = 1;
      notify(true);
    } else {
      strokeCountRef.current += 1;
    }
  };

  const endDraw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    lastPointRef.current = null;
    try {
      canvasRef.current?.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-xs font-bold text-slate-300">
          서명 <span className="text-cyan-400">*</span>
        </label>
        <button
          type="button"
          onClick={clear}
          disabled={disabled || !hasStroke}
          className="text-[11px] font-medium text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          지우기
        </button>
      </div>
      <div
        className={`relative rounded-xl border-2 border-dashed overflow-hidden ${
          hasStroke ? 'border-cyan-500/60 bg-white' : 'border-slate-600 bg-slate-800/50'
        } ${disabled ? 'opacity-60 pointer-events-none' : ''}`}
      >
        {!hasStroke && (
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs text-slate-500 select-none">
            여기에 서명해 주세요
          </span>
        )}
        <canvas
          id={id}
          ref={canvasRef}
          className="block w-full touch-none cursor-crosshair"
          style={{ height: 140 }}
          onPointerDown={startDraw}
          onPointerMove={moveDraw}
          onPointerUp={endDraw}
          onPointerCancel={endDraw}
          aria-label="서명 입력 영역"
        />
      </div>
    </div>
  );
});
