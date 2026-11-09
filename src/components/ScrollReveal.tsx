"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initReveal } from "@/lib/reveal";
import { initProgress } from "@/lib/progress";

/** Mounted once in the layout: re-scans the page for scroll reveals after every navigation and drives the progress line. Renders nothing. */
export default function ScrollReveal() {
  const path = usePathname();
  useEffect(() => {
    let stop: (() => void) | undefined;
    const id = window.setTimeout(() => { stop = initReveal(document); }, 60);
    return () => { clearTimeout(id); stop?.(); };
  }, [path]);
  useEffect(() => {
    const el = document.querySelector<HTMLElement>(".scroll-progress");
    return el ? initProgress(el) : undefined;
  }, []);
  return null;
}
