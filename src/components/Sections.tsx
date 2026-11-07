import Link from "next/link";
import Reveal from "./Reveal";
import { LogoMark } from "./Logo";
import { PHONE, type Dict } from "@/dictionaries";

export function Services({ t, lang }: { t: Dict["services"]; lang: string }) {
  return (
    <Reveal id="services" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-28 md:px-10">
      <p data-item className="text-sm font-bold tracking-[0.25em] text-gold">{t.kicker}</p>
      <h2 data-item className="mt-3 max-w-2xl text-4xl font-black leading-tight md:text-5xl">{t.title}</h2>
      <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {t.items.map((s, i) => (
          <li
            key={s.key}
            data-item
            className="group rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-sm transition hover:border-gold/50 hover:bg-white/[0.06]"
          >
            <div className="flex items-center justify-between">
              <span dir="ltr" className="font-latin text-xs tracking-widest text-muted">0{i + 1}</span>
              <LogoMark size={18} className="opacity-60 transition group-hover:opacity-100" />
            </div>
            <h3 className="mt-6 text-2xl font-black">{s.name}</h3>
            <p className="mt-1 text-xs text-muted">{s.en}</p>
            <p className="mt-5 font-bold text-gold-light">{s.line}</p>
            <p className="mt-3 text-sm leading-7 text-muted">{s.detail}</p>
          </li>
        ))}
      </ul>
      <p data-item className="mt-10">
        <Link href={`/${lang}/services`} className="font-bold text-gold hover:text-gold-light">
          {lang === "fa" ? "خدمات و پکیج‌ها ←" : "Services & packages →"}
        </Link>
      </p>
    </Reveal>
  );
}

export function Work({ t }: { t: Dict["work"] }) {
  return (
    <Reveal id="work" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-28 md:px-10">
      <p data-item className="text-sm font-bold tracking-[0.25em] text-gold">{t.kicker}</p>
      <h2 data-item className="mt-3 text-4xl font-black md:text-5xl">{t.title}</h2>
      <ul className="mt-14 grid gap-5 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <li
            key={i}
            data-item
            className="flex aspect-[4/3] items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-6 text-center text-sm text-muted"
          >
            {t.placeholder}
          </li>
        ))}
      </ul>
      <p data-item className="mt-6 text-sm text-muted">{t.note}</p>
    </Reveal>
  );
}

export function Cta({ t }: { t: Dict["cta"] }) {
  return (
    <Reveal id="contact" className="mx-auto max-w-4xl scroll-mt-20 px-5 py-32 text-center md:px-10">
      <h2 data-item className="gold-text text-4xl font-black leading-tight md:text-6xl">{t.title}</h2>
      <p data-item className="mt-6 text-muted">{t.desc}</p>
      <div data-item className="mt-10">
        <a href="#contact" className="inline-block rounded-full bg-gold px-10 py-4 text-sm font-bold text-midnight transition hover:bg-gold-light">
          {t.button}
        </a>
      </div>
      <div data-item className="mt-10 flex flex-col items-center gap-4">
        <p className="text-xs tracking-widest text-muted">{t.phoneLabel}</p>
        <p dir="ltr" className="font-latin text-2xl font-light tracking-wider text-gold-light">{PHONE.display}</p>
        <ul className="flex flex-wrap justify-center gap-3 text-sm">
          <li><a href={`tel:${PHONE.intl}`} className="inline-block rounded-full border border-white/20 px-5 py-2 transition hover:border-gold hover:text-gold-light">{t.call}</a></li>
          <li><a href={`https://t.me/${PHONE.intl}`} target="_blank" rel="noopener noreferrer" className="inline-block rounded-full border border-white/20 px-5 py-2 transition hover:border-gold hover:text-gold-light">{t.telegram}</a></li>
          <li><span className="inline-block rounded-full border border-white/10 px-5 py-2 text-muted">{t.bale}</span></li>
        </ul>
        <p dir="ltr" className="mt-2 font-latin text-sm text-muted">{t.contact}</p>
      </div>
    </Reveal>
  );
}

export function Footer({ t }: { t: Dict["footer"] }) {
  return (
    <footer id="studio" className="border-t border-white/10 px-5 py-8 text-center text-xs text-muted">
      © {new Date().getFullYear()} {t.rights}
    </footer>
  );
}
