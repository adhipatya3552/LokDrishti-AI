'use client';

import { ReactNode, useRef } from 'react';

export function Tilt({ children, max = 7 }: { children: ReactNode; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg) translateY(-2px)`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = 'rotateX(0deg) rotateY(0deg)';
  };

  return (
    <div className="perspective-stage h-full">
      <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className="tilt-3d h-full rounded-2xl">
        {children}
      </div>
    </div>
  );
}
