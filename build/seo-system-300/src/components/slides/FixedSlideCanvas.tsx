import { useEffect, useRef, useState, type ReactNode } from 'react';

export const SLIDE_WIDTH = 1920;
export const SLIDE_HEIGHT = 1080;

interface FixedSlideCanvasProps {
  children: ReactNode;
  className?: string;
}

/**
 * Keeps authored PPT layouts at 1920×1080 and uniformly scales them.
 * Slide components never reflow based on the surrounding portal width.
 */
export function FixedSlideCanvas({ children, className = '' }: FixedSlideCanvasProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const updateScale = () => {
      const width = stage.clientWidth;
      const height = stage.clientHeight;
      if (width <= 0 || height <= 0) return;
      setScale(Math.min(width / SLIDE_WIDTH, height / SLIDE_HEIGHT));
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={stageRef}
      className={`relative w-full overflow-hidden bg-[#07111F] ${className}`}
    >
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          width: SLIDE_WIDTH,
          height: SLIDE_HEIGHT,
          transform: `translate(-50%, -50%) scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
