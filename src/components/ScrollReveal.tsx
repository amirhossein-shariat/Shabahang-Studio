"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initReveal } from "@/lib/reveal";

/** Mounted once in the layout; re-scans the page after every navigation. Renders nothing. */
export default function ScrollReveal() {
  const path = usePathname();
  useEffect(() => {
    let stop: (() => void) | undefined;
    const id = window.setTimeout(() => { stop = initReveal(document); }, 60);
    return () => { clearTimeout(id); stop?.(); };
  }, [path]);
  return null;
}
