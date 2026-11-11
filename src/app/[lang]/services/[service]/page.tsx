import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/dictionaries";
import { getServicesDict } from "@/dictionaries/services";
import { PILLARS, SERVICES_UI, type PillarId } from "@/data/services";
import { FAQ } from "@/data/faq";
import Header from "@/components/Header";
import { Footer } from "@/components/Sections";
import ServiceIcon from "@/components/ServiceIcon";
import InstagramPackages from "@/components/InstagramPackages";
import FaqCarousel from "@/components/FaqCarousel";
import ItServices, { ItCta } from "@/components/ItServices";

const LANGS = ["fa", "en"] as const;

export function generateStaticParams() {
  return LANGS.flatMap((lang) => PILLARS.filter((p) => p.enabled).map((p) => ({ lang, service: p.id })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/services/[service]">): Promise<Metadata> {
  const { lang, service } = await params;
  const p = PILLARS.find((x) => x.id === service && x.enabled);
  if (!hasLocale(lang) || !p) return {};
  return {
    title: p.name[lang],
    description: p.summary[lang],
    alternates: { canonical: `/${lang}/services/${p.id}`, languages: { fa: `/fa/services/${p.id}`, en: `/en/services/${p.id}` } },
  };
}

const sect = "mx-auto max-w-6xl scroll-mt-32 px-5 py-14 md:px-10";

export default async function ServicePage({ params }: PageProps<"/[lang]/services/[service]">) {
  const { lang, service } = await params;
  if (!hasLocale(lang)) notFound();
  const p = PILLARS.find((x) => x.id === service && x.enabled);
  if (!p) notFound();
  const [t, home] = [getServicesDict(lang), await getDictionary(lang)];
  const ui = SERVICES_UI;
  const id = p.id as PillarId;
  const others = PILLARS.filter((x) => x.enabled && x.id !== id);
  const contact = `/${lang}/contact`;

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
    it: null,
  };

  return (
    <>
      <Header lang={lang} t={home.nav} path="services" />
      <main>
        <section className="page-head mx-auto max-w-6xl px-5 pt-36 pb-6 md:px-10">
          <p className="text-sm"><Link href={`/${lang}/services`} className="text-muted hover:text-gold">{t.hero.kicker}</Link> <span className="text-muted">/</span> <span className="text-gold">{p.name[lang]}</span></p>
          <div className="mt-6 flex items-start gap-4">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-gold/30 bg-gold/10 text-gold"><ServiceIcon name={p.icon} size={32} /></span>
            <div>
              <h1 className="gold-text text-4xl font-black leading-tight md:text-6xl">{p.name[lang]}</h1>
              <p className="mt-2 font-bold text-gold-light">{p.line[lang]}</p>
            </div>
          </div>
          <p className="mt-6 max-w-3xl leading-8 text-muted">{p.intro[lang]}</p>
          <p className="mt-5 inline-block rounded-full border border-white/15 px-4 py-2 text-xs text-muted">{ui.how[lang]}: <span className="font-bold text-text">{p.model[lang]}</span></p>
        </section>

        {id === "it" ? (
          <ItServices lang={lang} />
        ) : (
          <section className={sect}>
            <h2 className="text-sm font-bold tracking-[0.2em] text-muted">{ui.inside[lang]}</h2>
            <ul className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-4">
              {p.subs.map((x) => (
                <li key={x.name.fa} className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition duration-300 hover:scale-[1.02] hover:border-gold/40 hover:bg-white/[0.05] hover:shadow-[0_0_44px_-14px_rgba(232,198,130,0.45)]">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 text-gold transition duration-300 group-hover:scale-110 group-hover:rotate-[-6deg]"><ServiceIcon name={x.icon} size={20} /></span>
                  <h3 className="mt-4 font-black">{x.name[lang]}</h3>
                  <p className="mt-2 text-sm leading-7 text-muted">{x.text[lang]}</p>
                </li>
              ))}
            </ul>
            {extra[id]}
          </section>
        )}

        <FaqCarousel items={FAQ[id]} lang={lang} />

        {id === "it" ? <ItCta lang={lang} /> : (
          <section className="mx-auto max-w-3xl px-5 py-16 text-center">
            <h2 className="gold-text text-3xl font-black md:text-5xl">{t.cta.title}</h2>
            <Link href={contact} className="mt-8 inline-block rounded-full bg-gold px-10 py-4 text-sm font-bold text-midnight transition hover:bg-gold-light">{t.cta.button}</Link>
          </section>
        )}

        <nav aria-label={ui.jump[lang]} className={sect + " !pt-4"}>
          <h2 className="text-sm font-bold tracking-[0.2em] text-muted">{lang === "fa" ? "خدمات دیگر" : "Other services"}</h2>
          <ul className="chip-row mt-4 flex flex-wrap gap-2">
            {others.map((o) => (
              <li key={o.id}><Link href={`/${lang}/services/${o.id}`} className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-sm text-muted transition hover:border-gold/70 hover:bg-gold/10 hover:text-gold"><ServiceIcon name={o.icon} size={16} className="text-gold" />{o.name[lang]}</Link></li>
            ))}
          </ul>
        </nav>
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
