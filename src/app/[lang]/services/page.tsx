import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/dictionaries";
import { getServicesDict } from "@/dictionaries/services";
import { PILLARS, SERVICES_UI } from "@/data/services";
import Header from "@/components/Header";
import { Footer } from "@/components/Sections";
import ServiceIcon from "@/components/ServiceIcon";

export async function generateMetadata({ params }: PageProps<"/[lang]/services">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { meta } = getServicesDict(lang);
  return { title: meta.title, description: meta.description, alternates: { canonical: `/${lang}/services`, languages: { fa: "/fa/services", en: "/en/services" } } };
}

export default async function ServicesPage({ params }: PageProps<"/[lang]/services">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const [t, home] = [getServicesDict(lang), await getDictionary(lang)];
  const pillars = PILLARS.filter((p) => p.enabled);
  const ui = SERVICES_UI;
  return (
    <>
      <Header lang={lang} t={home.nav} path="services" />
      <main>
        <section className="page-head mx-auto max-w-6xl px-5 pt-36 pb-8 md:px-10">
          <p className="text-sm font-bold tracking-[0.25em] text-gold">{t.hero.kicker}</p>
          <h1 className="gold-text mt-4 max-w-3xl text-4xl font-black leading-tight md:text-6xl">{t.hero.title}</h1>
          <p className="mt-6 max-w-2xl leading-8 text-muted">{t.hero.desc}</p>
        </section>
        <section className="mx-auto max-w-6xl px-5 py-10 md:px-10">
          <ul className="grid gap-5 md:grid-cols-2">
            {pillars.map((p, i) => (
              <li key={p.id}>
                <Link href={`/${lang}/services/${p.id}`} className="group flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition duration-300 hover:-translate-y-1 hover:border-gold/50 hover:bg-white/[0.05] hover:shadow-[0_0_50px_-16px_rgba(232,198,130,0.5)]">
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-gold/30 bg-gold/10 text-gold"><ServiceIcon name={p.icon} size={28} /></span>
                    <span dir="ltr" className="font-latin text-xs tracking-widest text-muted">0{i + 1}</span>
                  </div>
                  <h2 className="mt-5 text-2xl font-black">{p.name[lang]}</h2>
                  <p className="mt-1 font-bold text-gold-light">{p.line[lang]}</p>
                  <p className="mt-3 text-sm leading-7 text-muted">{p.summary[lang]}</p>
                  <p className="mt-auto flex items-center justify-between gap-3 pt-6 text-sm"><span className="rounded-full border border-white/15 px-3 py-1 text-xs text-muted">{p.model[lang]}</span><span className="font-bold text-gold transition group-hover:-translate-x-1 rtl:group-hover:translate-x-0 rtl:group-hover:-translate-x-1">{ui.homeMore[lang]} ←</span></p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section className="mx-auto max-w-6xl px-5 py-10 md:px-10">
          <h2 className="text-3xl font-black leading-tight md:text-4xl">{t.starters.title}</h2>
          <ul className="mt-8 grid gap-5 md:grid-cols-2">
            {t.starters.items.map((s) => (
              <li key={s.name} className="rounded-2xl border border-white/10 bg-white/[0.03] p-7"><h3 className="text-xl font-black">{s.name}</h3><p className="mt-3 text-sm leading-7 text-muted">{s.text}</p></li>
            ))}
          </ul>
        </section>
        <section className="mx-auto max-w-3xl px-5 py-24 text-center">
          <h2 className="gold-text text-3xl font-black md:text-5xl">{t.cta.title}</h2>
          <Link href={`/${lang}/contact`} className="mt-8 inline-block rounded-full bg-gold px-10 py-4 text-sm font-bold text-midnight transition hover:bg-gold-light">{t.cta.button}</Link>
          <p className="mt-6"><Link href={`/${lang}`} className="text-sm text-muted hover:text-gold">{t.back}</Link></p>
        </section>
      </main>
      <Footer t={home.footer} />
    </>
  );
}
