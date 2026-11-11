"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { readSession } from "@/lib/panel/demo";
import ServiceIcon from "./ServiceIcon";

const noop = () => () => {};

/** "Sign in" for visitors, "My panel" once a (demo) session exists, so signed-in people can still browse the public pages. */
export default function HeaderAccount({ lang, login, panel }: { lang: string; login: string; panel: string }) {
  const signedIn = useSyncExternalStore(noop, () => readSession() !== null, () => false);
  const label = signedIn ? panel : login;
  return (
    <Link href={signedIn ? `/${lang}/panel` : `/${lang}/login`} aria-label={label} className={"inline-flex items-center gap-1.5 text-xs transition-colors hover:text-gold " + (signedIn ? "font-bold text-gold" : "text-muted")}>
      <ServiceIcon name="user" size={18} />
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );
}
