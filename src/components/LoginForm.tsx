"use client";

import { useState } from "react";
import Link from "next/link";
import ServiceIcon from "./ServiceIcon";
import { LogoMark } from "./Logo";
import type { LoginDict } from "@/dictionaries/login";

const field = "mt-2 w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-text placeholder:text-muted transition-colors focus:border-gold";

function score(p: string) {
  let n = 0;
  if (p.length >= 8) n++;
  if (p.length >= 12) n++;
  if (/[a-zA-Z؀-ۿ]/.test(p) && /\d/.test(p)) n++;
  if (/[^A-Za-z0-9؀-ۿ]/.test(p) || (/[a-z]/.test(p) && /[A-Z]/.test(p))) n++;
  return n;
}

type Msg = "" | "required" | "badId" | "short" | "mismatch" | "notReady";

/** Design-only for now: it validates and explains that the system is not live. It sends nothing anywhere. */
export default function LoginForm({ t, lang }: { t: LoginDict; lang: string }) {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [show, setShow] = useState(false);
  const [help, setHelp] = useState(false);
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState<Msg>("");
  const sc = score(pw);
  const level = pw.length === 0 ? -1 : sc <= 1 ? 0 : sc <= 3 ? 1 : 2;
  const levels = [t.signup.strength.weak, t.signup.strength.fair, t.signup.strength.strong];
  const bar = ["bg-amber", "bg-gold", "bg-emerald-400"];

  function go(next: "login" | "signup") {
    setTab(next);
    setMsg("");
  }

  function onLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    setMsg(String(d.get("username") ?? "").trim() && String(d.get("password") ?? "") ? "notReady" : "required");
  }

  function onSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const name = String(d.get("name") ?? "").trim();
    const id = String(d.get("username") ?? "").trim();
    const p = String(d.get("password") ?? "");
    const c = String(d.get("confirm") ?? "");
    if (!name || !id || !p || !c) return setMsg("required");
    if (!/^[A-Za-z0-9._]{3,32}$/.test(id)) return setMsg("badId");
    if (p.length < 8) return setMsg("short");
    if (p !== c) return setMsg("mismatch");
    setMsg("notReady");
  }

  const eye = (
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
  );

  /** Status line under a form; only the visible form shows the current message. */
  const message = (kind: "login" | "signup") => (
    <div role="status" aria-live="polite" className="mt-4 min-h-6 text-center text-sm">
      {tab !== kind ? null : msg === "notReady" ? (
        <p className="text-muted">{kind === "login" ? t.login.notReady : t.signup.notReady}</p>
      ) : msg ? (
        <p className="text-amber">{msg === "required" ? (kind === "login" ? t.login.required : t.signup.requiredAll) : t.signup[msg]}</p>
      ) : null}
    </div>
  );

  const heading = tab === "login" ? t.login : t.signup;

  return (
    <div className="relative mx-auto w-full max-w-md">
      {/* glow behind the card */}
      <div aria-hidden="true" className="nebula-a pointer-events-none absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(circle,rgba(123,108,246,.35),rgba(232,198,130,.12)_45%,transparent_70%)] blur-2xl" />
      {/* animated light running around the border */}
      <div className="relative overflow-hidden rounded-[1.75rem] p-px">
        <div aria-hidden="true" className="auth-ring absolute -inset-[60%] bg-[conic-gradient(from_0deg,transparent_0deg,rgba(232,198,130,.9)_60deg,transparent_130deg,rgba(123,108,246,.8)_220deg,transparent_300deg)]" />
        <div className="relative rounded-[calc(1.75rem-1px)] bg-[#0b0e27]/95 p-7 backdrop-blur-xl sm:p-9">
          <div className="flex flex-col items-center text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-gold/30 bg-gold/10 shadow-[0_0_30px_-6px_rgba(232,198,130,.6)]"><LogoMark size={26} /></span>
            <h1 className="mt-5 text-2xl font-black">{heading.title}</h1>
            <p className="mt-1 text-sm text-muted">{heading.sub}</p>
          </div>

          <div role="tablist" aria-label={t.tabs.login + " / " + t.tabs.signup} className="mt-7 grid grid-cols-2 gap-1 rounded-full border border-white/10 bg-black/20 p-1">
            {(["login", "signup"] as const).map((k) => (
              <button
                key={k}
                type="button"
                role="tab"
                data-tab={k}
                aria-selected={tab === k}
                onClick={() => go(k)}
                className={"rounded-full px-4 py-2.5 text-sm font-bold transition " + (tab === k ? "bg-gold text-midnight" : "text-muted hover:text-gold-light")}
              >
                {t.tabs[k]}
              </button>
            ))}
          </div>

          <form id="login-form" hidden={tab !== "login"} onSubmit={onLogin} noValidate>
            <label htmlFor="username" className="mt-6 block text-sm">{t.login.id}
              <input id="username" name="username" autoComplete="username" autoCapitalize="none" spellCheck={false} placeholder={t.login.idHint} className={field} />
            </label>
            <label htmlFor="password" className="mt-5 block text-sm">{t.login.password}
              <span className="relative mt-2 block">
                <input id="password" name="password" type={show ? "text" : "password"} autoComplete="current-password" className={field.replace("mt-2 ", "") + " pe-12"} />
                {eye}
              </span>
            </label>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
              <label htmlFor="remember" className="flex cursor-pointer items-center gap-2 text-muted">
                <input id="remember" name="remember" type="checkbox" className="h-4 w-4 accent-[#E8C682]" />
                {t.login.remember}
              </label>
              <button type="button" onClick={() => setHelp((v) => !v)} aria-expanded={help} className="text-gold transition hover:text-gold-light">{t.login.forgot}</button>
            </div>
            {help && (
              <p className="mt-3 rounded-xl border border-white/10 bg-black/20 p-3 text-center text-sm leading-7 text-muted">
                {t.login.forgotHelp} <Link href={`/${lang}/contact`} className="font-bold text-gold hover:text-gold-light">{t.contact}</Link>
              </p>
            )}
            <button type="submit" className="mt-6 w-full rounded-full bg-gold px-8 py-3.5 text-sm font-bold text-midnight transition hover:bg-gold-light">{t.login.submit}</button>
            {message("login")}
            <p className="mt-2 text-center text-sm text-muted">{t.login.toSignup} <button type="button" onClick={() => go("signup")} className="font-bold text-gold hover:text-gold-light">{t.login.toSignupLink}</button></p>
          </form>

          <form id="signup-form" hidden={tab !== "signup"} onSubmit={onSignup} noValidate>
            <label htmlFor="su-name" className="mt-6 block text-sm">{t.signup.name}
              <input id="su-name" name="name" autoComplete="name" placeholder={t.signup.nameHint} className={field} />
            </label>
            <label htmlFor="su-id" className="mt-5 block text-sm">{t.signup.id}
              <input id="su-id" name="username" autoComplete="username" autoCapitalize="none" spellCheck={false} placeholder={t.signup.idHint} className={field} />
              <span className="mt-1.5 block text-xs text-muted">{t.signup.idRule}</span>
            </label>
            <label htmlFor="su-password" className="mt-5 block text-sm">{t.signup.password}
              <span className="relative mt-2 block">
                <input id="su-password" name="password" type={show ? "text" : "password"} autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} className={field.replace("mt-2 ", "") + " pe-12"} />
                {eye}
              </span>
            </label>
            <div className="mt-3" aria-live="polite">
              <div className="flex gap-1.5" aria-hidden="true">
                {[0, 1, 2].map((i) => <span key={i} className={"h-1.5 flex-1 rounded-full transition-colors duration-300 " + (i <= level ? bar[level] : "bg-white/10")} />)}
              </div>
              <p className="mt-1.5 min-h-5 text-xs text-muted">{level >= 0 && <>{t.signup.strength.label}: <span className="font-bold text-text">{levels[level]}</span></>}</p>
            </div>
            <label htmlFor="su-confirm" className="mt-3 block text-sm">{t.signup.confirm}
              <input id="su-confirm" name="confirm" type={show ? "text" : "password"} autoComplete="new-password" className={field} />
            </label>
            <button type="submit" className="mt-6 w-full rounded-full bg-gold px-8 py-3.5 text-sm font-bold text-midnight transition hover:bg-gold-light">{t.signup.submit}</button>
            {message("signup")}
            <p className="mt-2 text-center text-sm text-muted">{t.signup.toLogin} <button type="button" onClick={() => go("login")} className="font-bold text-gold hover:text-gold-light">{t.signup.toLoginLink}</button></p>
          </form>
        </div>
      </div>
    </div>
  );
}
