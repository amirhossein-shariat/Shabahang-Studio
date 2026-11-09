"use client";

import { useState } from "react";
import { LogoMark } from "./Logo";
import type { ContactDict } from "@/dictionaries/pages";

const field = "mt-2 w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-text placeholder:text-muted transition-colors focus:border-gold";

export default function ContactForm({ t, email }: { t: ContactDict["form"]; email: string }) {
  const [state, setState] = useState<"idle" | "opened" | "error">("idle");
  const [draft, setDraft] = useState("");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const name = String(d.get("name") ?? "").trim();
    const reach = String(d.get("reach") ?? "").trim();
    if (!name || !reach) return setState("error");
    const body = `${t.bodyName}: ${name}\n${t.bodyReach}: ${reach}\n${t.bodyService}: ${d.get("service")}\n\n${String(d.get("message") ?? "").trim()}`;
    setDraft(body);
    setState("opened");
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(`${t.subject}: ${name}`)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form onSubmit={onSubmit} style={{ "--d": 0.5 } as React.CSSProperties} className="cine-card cine-sweep cine-kids flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm sm:p-9" noValidate>
      <div className="flex flex-col items-center text-center">
        <span className="cine-pop flex h-12 w-12 items-center justify-center rounded-2xl border border-gold/30 bg-gold/10"><LogoMark size={22} /></span>
        <h2 className="mt-4 text-2xl font-black">{t.title}</h2>
      </div>
      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <label htmlFor="name" className="block text-sm">{t.name}
          <input id="name" name="name" autoComplete="name" required className={field} />
        </label>
        <label htmlFor="reach" className="block text-sm">{t.reach}
          <input id="reach" name="reach" placeholder={t.reachHint} required className={field} />
        </label>
      </div>
      <label htmlFor="service" className="mt-5 block text-sm">{t.service}
        <select id="service" name="service" className={field + " select-field"}>
          {t.services.map((s) => <option key={s} value={s} className="bg-midnight">{s}</option>)}
        </select>
      </label>
      <label htmlFor="message" className="mt-5 block text-sm">{t.message}
        <textarea id="message" name="message" rows={5} className={field} />
      </label>
      <div className="mt-7 flex flex-col items-center">
        <button type="submit" className="rounded-full bg-gold px-10 py-3.5 text-sm font-bold text-midnight transition hover:bg-gold-light">{t.submit}</button>
        <div aria-live="polite" className="mt-4 w-full text-center text-sm">
          {state === "error" && <p className="text-amber">{t.required}</p>}
          {state === "opened" && (
            <div className="text-muted">
              <p>{t.opened}</p>
              <p className="mt-2">{t.fallback} <span dir="ltr" className="font-latin text-gold-light">{email}</span></p>
              <pre dir="auto" className="mt-2 whitespace-pre-wrap rounded-lg bg-black/30 p-3 text-start text-xs text-text">{draft}</pre>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
