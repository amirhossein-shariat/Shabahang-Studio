"use client";

import { useState } from "react";
import Link from "next/link";
import ServiceIcon from "./ServiceIcon";
import type { LoginDict } from "@/dictionaries/login";

const field = "w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-text placeholder:text-muted focus:border-gold focus:outline-none";

/** Design-only for now: it validates and explains that sign-in is not live. It sends nothing anywhere. */
export default function LoginForm({ t, lang, noAccount, contact }: { t: LoginDict["form"]; lang: string; noAccount: string; contact: string }) {
  const [show, setShow] = useState(false);
  const [help, setHelp] = useState(false);
  const [msg, setMsg] = useState<"" | "required" | "notReady">("");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const ok = String(d.get("username") ?? "").trim() && String(d.get("password") ?? "");
    setMsg(ok ? "notReady" : "required");
  }

  return (
    <form id="login-form" onSubmit={onSubmit} noValidate className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-md sm:p-9">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gold/30 bg-gold/10 text-gold"><ServiceIcon name="user" size={24} /></span>
      <h2 className="mt-5 text-2xl font-black">{t.title}</h2>
      <p className="mt-1 text-sm text-muted">{t.sub}</p>

      <label htmlFor="username" className="mt-7 block text-sm">{t.id}
        <input id="username" name="username" dir="ltr" autoComplete="username" autoCapitalize="none" spellCheck={false} placeholder={t.idHint} className={field + " mt-2 text-start"} />
      </label>

      <label htmlFor="password" className="mt-5 block text-sm">{t.password}
        <span className="relative mt-2 block">
          <input id="password" name="password" dir="ltr" type={show ? "text" : "password"} autoComplete="current-password" className={field + " pe-12 text-start"} />
          <button
            type="button"
            data-toggle-pw
            onClick={() => setShow((v) => !v)}
            aria-label={show ? t.hide : t.show}
            aria-pressed={show}
            className="absolute inset-y-0 end-2 my-auto flex h-9 w-9 items-center justify-center rounded-lg text-muted transition hover:text-gold-light"
          >
            <ServiceIcon name={show ? "eyeOff" : "eye"} size={20} />
          </button>
        </span>
      </label>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
        <label htmlFor="remember" className="flex cursor-pointer items-center gap-2 text-muted">
          <input id="remember" name="remember" type="checkbox" className="h-4 w-4 accent-[#E8C682]" />
          {t.remember}
        </label>
        <button type="button" onClick={() => setHelp((v) => !v)} aria-expanded={help} className="text-gold transition hover:text-gold-light">{t.forgot}</button>
      </div>
      {help && (
        <p className="mt-3 rounded-xl border border-white/10 bg-black/20 p-3 text-sm leading-7 text-muted">
          {t.forgotHelp} <Link href={`/${lang}/contact`} className="font-bold text-gold hover:text-gold-light">{contact}</Link>
        </p>
      )}

      <button type="submit" className="mt-7 w-full rounded-full bg-gold px-8 py-3.5 text-sm font-bold text-midnight transition hover:bg-gold-light">{t.submit}</button>

      <div role="status" aria-live="polite" className="mt-4 min-h-6 text-sm">
        {msg === "required" && <p className="text-amber">{t.required}</p>}
        {msg === "notReady" && <p className="text-muted">{t.notReady}</p>}
      </div>

      <p className="mt-2 border-t border-white/10 pt-4 text-xs leading-6 text-muted">{t.noSms}</p>
      <p className="mt-3 text-sm text-muted">{noAccount} <Link href={`/${lang}/contact`} className="font-bold text-gold hover:text-gold-light">{contact}</Link></p>
    </form>
  );
}
