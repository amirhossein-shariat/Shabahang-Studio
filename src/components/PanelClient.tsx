"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { clearSession, readSession } from "@/lib/panel/demo";
import { mountPanel, type ServiceOpt } from "@/lib/panel/panel";

/** Mounts the demo panel for the signed-in demo session; without a session it sends you to the sign-in page. */
export default function PanelClient({ lang, services }: { lang: string; services: ServiceOpt[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  useEffect(() => {
    const session = readSession();
    if (!session || !ref.current) { router.replace(`/${lang}/login`); return; }
    return mountPanel(ref.current, { session, services, onLogout: () => { clearSession(); router.replace(`/${lang}/login`); } });
  }, [lang, services, router]);
  return <div ref={ref} data-panel-root className="min-h-svh w-full" />;
}
