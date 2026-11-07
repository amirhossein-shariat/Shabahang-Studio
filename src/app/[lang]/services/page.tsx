import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/dictionaries";
import { getServicesDict } from "@/dictionaries/services";
import Header from "@/components/Header";
import { Footer } from "@/components/Sections";
import PackageTable from "@/components/PackageTable";

export async function generateMetadata({ params }: PageProps<"/[lang]/services">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { meta } = getServicesDict(lang);
  return { title: meta.title, description: meta.description, alternates: { canonical: `/${lang}/services`, languages: { fa: "/fa/services", en: "/en/services" } } };
}

const h2 = "mt-3 text-3xl font-black leading-tight md:text-4xl";
const kick = "text-sm font-bold tracking-[0.25em] text-gold";
const sect = "mx-auto max-w-6xl px-5 py-16 md:px-10";

export default async function ServicesPage({ params }: PageProps<"/[lang]/services">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const [t, home] = [getServicesDict(lang), await getDictionary(lang)];
  return (
    <>
      <Header lang={lang} t={home.nav} path="services" />
      <main>
        <section className="mx-auto max-w-6xl px-5 pt-36 pb-10 md:px-10">
          <p className={kick}>{t.hero.kicker}</p>
          <h1 className="gold-text mt-4 max-w-3xl text-4xl font-black leading-tight md:text-6xl">{t.hero.title}</h1>
          <p className="mt-6 max-w-2xl leading-8 text-muted">{t.hero.desc}</p>
        </section>

        <section id="projects" className={sect}>
          <h2 className={h2}>{t.projects.title}</h2>
          <p className="mt-2 text-muted">{t.projects.sub}</p>
          <ul className="mt-8 grid gap-5 md:grid-cols-2">
            {t.projects.items.map((p) => (
              <li key={p.name} className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">
                <h3 className="text-2xl font-black">{p.name}</h3>
                <p className="mt-1 font-bold text-gold-light">{p.line}</p>
                <ul className="mt-4 list-disc space-y-1 ps-5 text-sm text-muted marker:text-gold">
                  {p.points.map((x) => <li key={x}>{x}</li>)}
                </ul>
                <p className="mt-5 text-sm text-text">{t.price}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="web" className={sect}>
          <h2 className={h2}>{t.web.title}</h2>
          <p className="mt-2 max-w-2xl text-muted">{t.web.sub}</p>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-gold/30 bg-white/[0.03] p-7">
              <h3 className="font-black text-gold-light">{t.web.freeTitle}</h3>
              <ul className="mt-4 list-disc space-y-1 ps-5 text-sm text-muted marker:text-gold">{t.web.free.map((x) => <li key={x}>{x}</li>)}</ul>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">
              <h3 className="font-black">{t.web.paidTitle}</h3>
              <ul className="mt-4 list-disc space-y-1 ps-5 text-sm text-muted marker:text-gold">{t.web.paid.map((x) => <li key={x}>{x}</li>)}</ul>
            </div>
          </div>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-muted">{t.web.plans}</p>
          <p className="mt-3 text-sm text-text">{t.price}</p>
        </section>

        <section id="growth" className={sect}>
          <h2 className={h2}>{t.growth.title}</h2>
          <p className="mt-2 text-muted">{t.growth.sub}</p>
          <div className="mt-8"><PackageTable pkg={t.growth} price={t.price} /></div>
          <h3 className="mt-10 font-black">{t.growth.durationTitle}</h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {t.growth.durations.map((d) => (
              <li key={d.label} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <p className="font-bold">{d.label}</p>
                <p className="mt-1 text-sm text-gold-light">{d.off}</p>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-muted">{t.growth.durationNote}</p>
          <p className="mt-2 text-sm text-muted">{t.growth.setup}</p>
        </section>

        <section id="it" className={sect}>
          <h2 className={h2}>{t.it.title}</h2>
          <p className="mt-2 text-muted">{t.it.sub}</p>
          <div className="mt-8"><PackageTable pkg={t.it} price={t.price} /></div>
          <p className="mt-4 text-sm text-text">{t.it.basis}</p>
          <p className="mt-2 text-sm text-muted">{t.it.setup}</p>
        </section>

        <section id="starters" className={sect}>
          <h2 className={h2}>{t.starters.title}</h2>
          <ul className="mt-8 grid gap-5 md:grid-cols-2">
            {t.starters.items.map((s) => (
              <li key={s.name} className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">
                <h3 className="text-xl font-black">{s.name}</h3>
                <p className="mt-3 text-sm leading-7 text-muted">{s.text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mx-auto max-w-3xl px-5 py-24 text-center">
          <h2 className="gold-text text-3xl font-black md:text-5xl">{t.cta.title}</h2>
          <Link href={`/${lang}#contact`} className="mt-8 inline-block rounded-full bg-gold px-10 py-4 text-sm font-bold text-midnight transition hover:bg-gold-light">
            {t.cta.button}
          </Link>
          <p className="mt-6"><Link href={`/${lang}`} className="text-sm text-muted hover:text-gold-light">{t.back}</Link></p>
        </section>
      </main>
      <Footer t={home.footer} />
    </>
  );
}
