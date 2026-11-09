"use client";

import { useEffect, useRef } from "react";
import { createStarfield } from "@/lib/starfield";

/** A few rare, slow shooting stars (CSS only). Positions and rhythms differ so they never sync up. */
const METEORS = [
  { "--t": "8%", "--l": "18%", "--dur": "17s", "--delay": "4s", "--len": "140px" },
  { "--t": "22%", "--l": "52%", "--dur": "23s", "--delay": "11s", "--len": "110px" },
  { "--t": "5%", "--l": "74%", "--dur": "29s", "--delay": "19s", "--len": "150px" },
];

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
        className="nebula-a absolute -top-1/4 start-[-10%] h-[70vmax] w-[70vmax] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(123,108,246,.45), transparent 65%)" }}
      />
      <div
        className="nebula-b absolute -bottom-1/3 end-[-15%] h-[60vmax] w-[60vmax] rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(232,140,90,.5), transparent 65%)" }}
      />
      <canvas ref={ref} className="absolute inset-0" />
      {METEORS.map((m, i) => (
        <span key={i} className="meteor" style={m as React.CSSProperties} />
      ))}
    </div>
  );
}
