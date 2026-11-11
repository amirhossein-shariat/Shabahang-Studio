import Link from "next/link";
import Reveal from "./Reveal";
import ServiceIcon from "./ServiceIcon";
import { PILLARS, SERVICES_UI } from "@/data/services";
import { BaleIcon, PhoneIcon, TelegramIcon } from "./Icons";
import { EMAIL, PHONE, type Dict } from "@/dictionaries";

export function Services({ t, lang }: { t: Dict["services"]; lang: "fa" | "en" }) {
  const other = lang === "fa" ? "en" : "fa";
  return (
    <Reveal id="services" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-28 md:px-10">
      <p data-item className="text-sm font-bold tracking-[0.25em] text-gold">{t.kicker}</p>
      <h2 data-item className="mt-3 max-w-2xl text-4xl font-black leading-tight md:text-5xl">{t.title}</h2>
      <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {PILLARS.filter((p) => p.enabled).map((p, i) => (
          <li key={p.id} data-item>
            <Link
              href={`/${lang}/services/${p.id}`}
              className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-sm transition duration-300 hover:scale-[1.03] hover:border-gold/60 hover:bg-white/[0.06] hover:shadow-[0_0_50px_-14px_rgba(232,198,130,0.5)]"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-gold/30 bg-gold/10 text-gold transition duration-300 group-hover:rotate-[-8deg] group-hover:scale-110 group-hover:bg-gold group-hover:text-midnight">
                  <ServiceIcon name={p.icon} />
                </span>
                <span dir="ltr" className="font-latin text-xs tracking-widest text-muted">0{i + 1}</span>
              </div>
              <h3 className="mt-6 text-2xl font-black">{p.name[lang]}</h3>
              <p className="mt-1 text-xs text-muted">{p.name[other]}</p>
              <p className="mt-5 font-bold text-gold-light">{p.line[lang]}</p>
              <p className="mt-3 flex-1 text-sm leading-7 text-muted">{p.summary[lang]}</p>
              <p className="mt-6 flex items-center gap-2 text-sm font-bold text-gold">
                {SERVICES_UI.homeMore[lang]}
                <ServiceIcon name="arrow" size={16} className="transition group-hover:translate-x-[-4px] rtl:rotate-180 rtl:group-hover:translate-x-1" />
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

export function Work({ t, lang }: { t: Dict["work"]; lang: string }) {
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
      <p data-item className="mt-6">
        <Link href={`/${lang}/work`} className="font-bold text-gold hover:text-gold">{t.all}</Link>
      </p>
    </Reveal>
  );
}

export function Cta({ t, lang }: { t: Dict["cta"]; lang: string }) {
  return (
    <Reveal id="contact" className="mx-auto max-w-4xl scroll-mt-20 px-5 py-32 text-center md:px-10">
      <h2 data-item className="gold-text text-4xl font-black leading-tight md:text-6xl">{t.title}</h2>
      <p data-item className="mt-6 text-muted">{t.desc}</p>
      <div data-item className="mt-10">
        <Link href={`/${lang}/contact`} className="inline-block rounded-full bg-gold px-10 py-4 text-sm font-bold text-midnight transition hover:bg-gold-light">
          {t.button}
        </Link>
      </div>
      <div data-item className="mt-10 flex flex-col items-center gap-4">
        <p className="text-xs tracking-widest text-muted">{t.phoneLabel}</p>
        <p dir="ltr" className="font-latin text-2xl font-light tracking-wider text-gold-light">{PHONE.display}</p>
        <ul className="flex flex-wrap justify-center gap-3 text-sm">
          <li><a href={`tel:${PHONE.intl}`} className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2 transition hover:border-gold hover:text-gold"><PhoneIcon className="text-gold" />{t.call}</a></li>
          <li><a href={`https://t.me/${PHONE.intl}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2 transition hover:border-gold hover:text-gold"><TelegramIcon className="text-gold" />{t.telegram}</a></li>
          <li><span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-2 text-muted"><BaleIcon />{t.bale}</span></li>
        </ul>
        <p className="mt-2 text-xs text-muted">{t.emailLabel}</p>
        <a href={`mailto:${EMAIL}`} dir="ltr" className="font-latin text-sm text-gold-light underline-offset-4 hover:underline">{EMAIL}</a>
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
