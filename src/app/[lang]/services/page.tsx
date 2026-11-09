import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/dictionaries";
import { getServicesDict } from "@/dictionaries/services";
import { PILLARS, SERVICES_UI, type PillarId } from "@/data/services";
import Header from "@/components/Header";
import { Footer } from "@/components/Sections";
import ServiceIcon from "@/components/ServiceIcon";
import InstagramPackages from "@/components/InstagramPackages";
import PackageTable from "@/components/PackageTable";

export async function generateMetadata({ params }: PageProps<"/[lang]/services">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { meta } = getServicesDict(lang);
  return { title: meta.title, description: meta.description, alternates: { canonical: `/${lang}/services`, languages: { fa: "/fa/services", en: "/en/services" } } };
}

const sect = "mx-auto max-w-6xl scroll-mt-32 px-5 py-14 md:px-10";

export default async function ServicesPage({ params }: PageProps<"/[lang]/services">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const [t, home] = [getServicesDict(lang), await getDictionary(lang)];
  const pillars = PILLARS.filter((p) => p.enabled);
  const ui = SERVICES_UI;

  /** The block that sits under the sub-services of each pillar */
  const extra: Record<PillarId, React.ReactNode> = {
    brand: <ProjectPrice lang={lang} price={t.price} note={ui.projectNote[lang]} cta={ui.cta[lang]} />,
    product: <ProjectPrice lang={lang} price={t.price} note={ui.projectNote[lang]} cta={ui.cta[lang]} />,
    web: (
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-gold/30 bg-white/[0.03] p-7">
          <h4 className="font-black text-gold-light">{t.web.freeTitle}</h4>
          <ul className="mt-4 list-disc space-y-1 ps-5 text-sm text-muted marker:text-gold">{t.web.free.map((x) => <li key={x}>{x}</li>)}</ul>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">
          <h4 className="font-black">{t.web.paidTitle}</h4>
          <ul className="mt-4 list-disc space-y-1 ps-5 text-sm text-muted marker:text-gold">{t.web.paid.map((x) => <li key={x}>{x}</li>)}</ul>
          <p className="mt-5 text-sm text-text">{t.price}</p>
        </div>
        <p className="max-w-3xl text-sm leading-7 text-muted md:col-span-2">{t.web.plans}</p>
      </div>
    ),
    growth: (
      <div className="mt-12 rounded-3xl border border-white/10 bg-white/[0.02] p-5 sm:p-8">
        <InstagramPackages lang={lang} />
      </div>
    ),
    it: (
      <div className="mt-10">
        <PackageTable pkg={t.it} price={t.price} />
        <p className="mt-4 text-sm text-text">{t.it.basis}</p>
        <p className="mt-2 text-sm text-muted">{t.it.setup}</p>
      </div>
    ),
  };

  return (
    <>
      <Header lang={lang} t={home.nav} path="services" />
      <main>
        <section className="mx-auto max-w-6xl px-5 pt-36 pb-8 md:px-10">
          <p className="text-sm font-bold tracking-[0.25em] text-gold">{t.hero.kicker}</p>
          <h1 className="gold-text mt-4 max-w-3xl text-4xl font-black leading-tight md:text-6xl">{t.hero.title}</h1>
          <p className="mt-6 max-w-2xl leading-8 text-muted">{t.hero.desc}</p>
        </section>

        <nav aria-label={ui.jump[lang]} className="sticky top-[68px] z-20 border-y border-white/5 bg-midnight/70 backdrop-blur-md">
          <ul className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-5 py-3 md:px-10">
            {pillars.map((p) => (
              <li key={p.id} className="shrink-0">
                <Link href={`/${lang}/services#${p.id}`} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-muted transition hover:border-gold hover:text-gold-light">
                  <ServiceIcon name={p.icon} size={16} className="text-gold" />
                  {p.name[lang]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {pillars.map((p, i) => (
          <section key={p.id} id={p.id} className={sect}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-gold/30 bg-gold/10 text-gold">
                  <ServiceIcon name={p.icon} size={28} />
                </span>
                <div>
                  <p dir="ltr" className="font-latin text-xs tracking-widest text-muted">0{i + 1}</p>
                  <h2 className="mt-1 text-3xl font-black leading-tight md:text-4xl">{p.name[lang]}</h2>
                  <p className="mt-2 font-bold text-gold-light">{p.line[lang]}</p>
                </div>
              </div>
              <p className="rounded-full border border-white/15 px-4 py-2 text-xs text-muted">
                {ui.how[lang]}: <span className="font-bold text-text">{p.model[lang]}</span>
              </p>
            </div>
            <p className="mt-5 max-w-3xl leading-8 text-muted">{p.intro[lang]}</p>

            <h3 className="mt-10 text-sm font-bold tracking-[0.2em] text-muted">{ui.inside[lang]}</h3>
            <ul className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-4">
              {p.subs.map((x) => (
                <li key={x.name.fa} className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition duration-300 hover:-translate-y-1 hover:border-gold/40 hover:bg-white/[0.05] hover:shadow-[0_18px_45px_-22px_rgba(232,198,130,0.4)]">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 text-gold transition duration-300 group-hover:scale-110 group-hover:rotate-[-6deg]">
                    <ServiceIcon name={x.icon} size={20} />
                  </span>
                  <h4 className="mt-4 font-black">{x.name[lang]}</h4>
                  <p className="mt-2 text-sm leading-7 text-muted">{x.text[lang]}</p>
                </li>
              ))}
            </ul>

            {extra[p.id]}
          </section>
        ))}

        <section className={sect}>
          <h2 className="text-3xl font-black leading-tight md:text-4xl">{t.starters.title}</h2>
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
          <Link href={`/${lang}/contact`} className="mt-8 inline-block rounded-full bg-gold px-10 py-4 text-sm font-bold text-midnight transition hover:bg-gold-light">
            {t.cta.button}
          </Link>
          <p className="mt-6"><Link href={`/${lang}`} className="text-sm text-muted hover:text-gold-light">{t.back}</Link></p>
        </section>
      </main>
      <Footer t={home.footer} />
    </>
  );
}

function ProjectPrice({ lang, price, note, cta }: { lang: string; price: string; note: string; cta: string }) {
  return (
    <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <p className="text-sm text-muted">{note} <span className="ms-2 text-text">{price}</span></p>
      <Link href={`/${lang}/contact`} className="rounded-full border border-gold/60 px-6 py-2.5 text-sm font-bold text-gold transition hover:bg-gold hover:text-midnight">{cta}</Link>
    </div>
  );
}
