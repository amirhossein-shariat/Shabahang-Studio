"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const StarCanvas = dynamic(() => import("./StarCanvas"), { ssr: false });

/** Fixed full-page background: static gradient first, GPU stars lazy-loaded, CSS nebula. */
export default function Sky() {
  const [cfg, setCfg] = useState<{ count: number; reduced: boolean } | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 768px)").matches;
    const start = () => setCfg({ count: mobile ? 1200 : 4500, reduced });
    // Let the hero paint and animate in first; the 3D layer is decoration.
    const id = window.setTimeout(start, 1500);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 sky-bg" aria-hidden="true">
      {/* Nebula layers (pure CSS) */}
      <div
        className="absolute -top-1/4 start-[-10%] h-[70vmax] w-[70vmax] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(123,108,246,.45), transparent 65%)" }}
      />
      <div
        className="absolute -bottom-1/3 end-[-15%] h-[60vmax] w-[60vmax] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(232,140,90,.5), transparent 65%)" }}
      />
      {cfg && <StarCanvas count={cfg.count} reduced={cfg.reduced} />}
    </div>
  );
}
