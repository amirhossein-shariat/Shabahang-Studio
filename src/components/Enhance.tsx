"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initEnhance } from "@/lib/enhance";

/** Adds the small interactive behaviours of the public pages (see src/lib/enhance.ts). Renders nothing. */
export default function Enhance() {
  const path = usePathname();
  useEffect(() => {
    let stop: (() => void) | undefined;
    const id = window.setTimeout(() => { stop = initEnhance(document); }, 80);
    return () => { clearTimeout(id); stop?.(); };
  }, [path]);
  return null;
}
