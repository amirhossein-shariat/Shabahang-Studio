"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { STAR_PATH } from "./Logo";
import type { Dict } from "@/dictionaries";

const RINGS = [
  { size: 520, dur: 70, dir: 1, dot: 0 },
  { size: 760, dur: 110, dir: -1, dot: 120 },
  { size: 1040, dur: 160, dir: 1, dot: 240 },
];

const TINY_STARS = Array.from({ length: 18 }, (_, i) => ({
  left: (i * 53 + 7) % 100,
  top: (i * 37 + 11) % 70,
  delay: (i % 6) * 0.7,
}));

export default function Hero({ t, lang }: { t: Dict["hero"]; lang: string }) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-rise]", {
        opacity: 0,
        y: 36,
        duration: 1.1,
        ease: "power3.out",
        stagger: 0.14,
        delay: 0.2,
      });
      gsap.from("[data-star]", { opacity: 0, scale: 0.4, duration: 1.6, ease: "expo.out" });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative flex min-h-svh items-center justify-center overflow-hidden px-5 pt-24 pb-16">
      {/* horizon glow */}
      <div
        className="absolute inset-x-0 bottom-0 h-[55%] origin-bottom"
        style={{
          background: "radial-gradient(70% 100% at 50% 100%, rgba(232,140,90,.45), rgba(123,108,246,.25) 45%, transparent 75%)",
          animation: "breathe 9s ease-in-out infinite",
          maskImage: "linear-gradient(to top, transparent 0%, #000 40%)",
          WebkitMaskImage: "linear-gradient(to top, transparent 0%, #000 40%)",
        }}
        aria-hidden="true"
      />
      {TINY_STARS.map((s, i) => (
        <span
          key={i}
          className="absolute h-[3px] w-[3px] rounded-full bg-gold-light"
          style={{ left: `${s.left}%`, top: `${s.top}%`, animation: `twinkle 4s ease-in-out ${s.delay}s infinite` }}
          aria-hidden="true"
        />
      ))}

      {/* orbit rings */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" aria-hidden="true">
        {RINGS.map((r) => (
          <div
            key={r.size}
            className="absolute rounded-full border border-gold/15"
            style={{
              width: r.size,
              height: r.size,
              left: -r.size / 2,
              top: -r.size / 2,
              animation: `orbit ${r.dur}s linear infinite ${r.dir < 0 ? "reverse" : ""}`,
            }}
          >
            <span
              className="absolute h-2 w-2 rounded-full bg-gold-light shadow-[0_0_14px_3px_rgba(246,227,176,.7)]"
              style={{
                left: "50%",
                top: 0,
                transform: `rotate(${r.dot}deg) translateY(-50%)`,
                transformOrigin: `0 ${r.size / 2}px`,
              }}
            />
          </div>
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        <svg
          data-star
          viewBox="0 0 100 100"
          className="mb-6 h-14 w-14 md:h-20 md:w-20"
          style={{ animation: "pulse-star 5s ease-in-out infinite" }}
          aria-hidden="true"
        >
          <path d={STAR_PATH} fill="var(--gold)" />
        </svg>
        <p data-rise className="mb-4 text-xs tracking-[0.2em] text-muted">
          {t.eyebrow}
        </p>
        <h1 data-rise className="gold-text text-[clamp(4rem,17vw,10.5rem)] font-black leading-[1.05]">
          {t.title}
        </h1>
        <p data-rise dir="ltr" className="font-latin text-[clamp(0.9rem,2.4vw,1.5rem)] font-light tracking-[0.7em] text-gold-light">
          {t.sub}
        </p>
        <p data-rise className="mt-8 text-xl font-bold text-text md:text-2xl">
          {t.tagline}
        </p>
        <p data-rise dir="ltr" className="mt-2 max-w-xl font-latin text-sm font-light text-muted">
          {t.desc}
        </p>
        <div data-rise className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href={`/${lang}/contact`}
            className="rounded-full bg-gold px-8 py-3.5 text-sm font-bold text-midnight transition hover:bg-gold-light"
          >
            {t.cta1}
          </Link>
          <Link
            href={`/${lang}/work`}
            className="rounded-full border border-white/20 px-8 py-3.5 text-sm font-bold text-text transition hover:border-gold hover:text-gold-light"
          >
            {t.cta2}
          </Link>
        </div>
      </div>
      <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[11px] tracking-[0.3em] text-muted" aria-hidden="true">
        {t.scroll}
      </span>
    </section>
  );
}
