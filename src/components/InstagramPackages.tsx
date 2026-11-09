"use client";

import { useState } from "react";
import Link from "next/link";
import { INSTAGRAM_PACKAGES as C, priceFor, type Plan } from "@/data/packages";

/** One colour per tier drives the top band, border, glow, medal dot and name. */
const TIER: Record<Plan["tier"], string> = {
  bronze: "#D98E5B",
  silver: "#D5DAE4",
  gold: "#EBCB88",
};
const mix = (c: string, pct: number) => `color-mix(in srgb, ${c} ${pct}%, transparent)`;

export default function InstagramPackages({ lang }: { lang: "fa" | "en" }) {
  const durations = C.durations.filter((d) => d.enabled);
  const plans = C.plans.filter((p) => p.enabled);
  const [id, setId] = useState((durations.find((x) => x.default) ?? durations[0])?.id);
  const d = durations.find((x) => x.id === id) ?? durations[0];
  const nf = new Intl.NumberFormat(lang === "fa" ? "fa-IR" : "en-US", { maximumFractionDigits: 2 });
  if (!C.enabled || !d || plans.length === 0) return null;

  return (
    <div>
      <p className="text-sm font-bold tracking-[0.25em] text-gold">{C.kicker[lang]}</p>
      <h2 className="mt-3 text-3xl font-black leading-tight md:text-4xl">{C.title[lang]}</h2>
      <p className="mt-2 max-w-2xl text-muted">{C.subtitle[lang]}</p>

      <div className="mt-10 flex flex-col items-center text-center">
        <p className="text-xs font-bold tracking-[0.2em] text-muted" id="dur-label">{C.durationTitle[lang]}</p>
        <div role="radiogroup" aria-labelledby="dur-label" className="mt-3 inline-flex flex-wrap justify-center gap-1 rounded-full border border-white/15 bg-white/[0.03] p-1">
          {durations.map((x) => {
            const on = x.id === d.id;
            return (
              <button
                key={x.id}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setId(x.id)}
                className={"rounded-full px-5 py-2 text-sm font-bold transition " + (on ? "bg-gold text-midnight" : "text-muted hover:text-gold")}
              >
                {x.label[lang]}
                {x.discountPercent > 0 && <span className={"ms-2 text-xs font-normal " + (on ? "text-midnight/80" : "text-gold")}>{nf.format(x.discountPercent)}٪ {C.discountLabel[lang]}</span>}
              </button>
            );
          })}
        </div>
      </div>

      <ul className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-5">
        {plans.map((p) => {
          const c = TIER[p.tier];
          const { monthly, total } = priceFor(p, d);
          return (
            <li
              key={p.id}
              className="relative flex flex-col overflow-hidden rounded-2xl border bg-white/[0.03] p-7 pt-9 backdrop-blur-sm transition duration-300 hover:scale-[1.03]"
              style={{ borderColor: mix(c, 60), backgroundImage: `linear-gradient(180deg, ${mix(c, 16)}, transparent 240px)` }}
            >
              <div aria-hidden="true" className="band-shine absolute inset-x-0 top-0 h-2.5" style={{ background: `linear-gradient(90deg, ${c}, color-mix(in srgb, ${c} 45%, #ffffff), ${c}, color-mix(in srgb, ${c} 45%, #ffffff), ${c})`, backgroundSize: "200% 100%" }} />
              <div className="flex items-center justify-between gap-3">
                <h3 className="flex items-center gap-3 text-xl font-black" style={{ color: c }}>
                  <span
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 rounded-full"
                    style={{ background: `radial-gradient(circle at 32% 30%, #ffffffcc, ${c} 50%, color-mix(in srgb, ${c} 55%, #000000))`, boxShadow: `0 0 14px ${mix(c, 55)}` }}
                  />
                  {p.name[lang]}
                </h3>
                {p.badge && <span className="rounded-full border border-gold/50 px-3 py-1 text-xs font-bold text-gold">{p.badge[lang]}</span>}
              </div>

              <p className="mt-6 flex items-baseline gap-2">
                <span key={`${p.id}-${d.id}-t`} className="price-pop text-4xl font-black">{nf.format(total)}</span>
                <span className="text-sm text-muted">{C.currency[lang]} / {d.label[lang]}</span>
              </p>
              <p className="mt-2 text-sm text-muted">
                {C.monthlyLabel[lang]}: <span key={`${p.id}-${d.id}-m`} className="price-pop font-bold text-gold-light">{nf.format(monthly)} {C.currency[lang]}</span>
                {d.setupFee > 0 && <span className="block text-xs">{C.setupIncluded[lang]} ({nf.format(d.setupFee)} {C.currency[lang]})</span>}
              </p>

              <ul className="mt-6 flex-1 divide-y divide-white/5 text-sm">
                {p.features.map((x, i) => (
                  <li key={i} className="flex items-center gap-3 py-2.5">
                    <span aria-hidden="true" className={"flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs leading-none " + (x.off ? "border-white/15 text-muted" : "border-emerald-400/70 bg-emerald-400/10 text-emerald-400")}>{x.off ? "–" : "✓"}</span>
                    <span className="min-w-0">
                      <span className="block text-xs text-muted">{x.label[lang]}</span>
                      <span className={x.off ? "text-muted" : "text-text"}>
                        <span className="sr-only">{x.off ? C.notIncluded[lang] : C.included[lang]}: </span>
                        {x.value[lang]}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>

              <Link href={`/${lang}/contact`} className={"mt-7 block rounded-full px-6 py-3 text-center text-sm font-bold transition " + (p.badge ? "bg-gold text-midnight hover:bg-gold-light" : "border border-white/25 hover:border-gold hover:text-gold")}>
                {C.cta[lang]}
              </Link>
            </li>
          );
        })}
      </ul>
      <p className="mt-6 max-w-3xl text-xs leading-6 text-muted">{C.footnote[lang]}</p>
    </div>
  );
}
