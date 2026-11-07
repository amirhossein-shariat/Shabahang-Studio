"use client";

import { useEffect, useRef } from "react";
import { createStarfield } from "@/lib/starfield";

/** Fixed full-page background: gradient, CSS nebula and an interactive starfield. */
export default function Sky() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const field = createStarfield(canvas, { reduced });
    return () => field.destroy();
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 sky-bg" aria-hidden="true">
      <div
        className="absolute -top-1/4 start-[-10%] h-[70vmax] w-[70vmax] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(123,108,246,.45), transparent 65%)" }}
      />
      <div
        className="absolute -bottom-1/3 end-[-15%] h-[60vmax] w-[60vmax] rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(232,140,90,.5), transparent 65%)" }}
      />
      <canvas ref={ref} className="absolute inset-0" />
    </div>
  );
}
