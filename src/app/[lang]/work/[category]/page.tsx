import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale, locales } from "@/dictionaries";
import { CATEGORY_SLUGS, getWorkDict, isSlug } from "@/dictionaries/work";
import { PROJECTS } from "@/data/studio";
import Header from "@/components/Header";
import { Footer } from "@/components/Sections";

export function generateStaticParams() {
  return locales.flatMap((lang) => CATEGORY_SLUGS.map((category) => ({ lang, category })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/work/[category]">): Promise<Metadata> {
  const { lang, category } = await params;
  if (!hasLocale(lang) || !isSlug(category)) return {};
  const t = getWorkDict(lang);
  const c = t.cats[category];
  return {
    title: `${c.name} | ${t.kicker} | ${lang === "fa" ? "شباهنگ استودیو" : "Shabahang Studio"}`,
    description: c.blurb,
    alternates: { canonical: `/${lang}/work/${category}`, languages: { fa: `/fa/work/${category}`, en: `/en/work/${category}` } },
  };
}

export default async function CategoryPage({ params }: PageProps<"/[lang]/work/[category]">) {
  const { lang, category } = await params;
  if (!hasLocale(lang) || !isSlug(category)) notFound();
  const [t, home] = [getWorkDict(lang), await getDictionary(lang)];
  const c = t.cats[category];
  const projects = PROJECTS[category];
  return (
    <>
      <Header lang={lang} t={home.nav} path={`work/${category}`} />
      <main className="mx-auto max-w-6xl px-5 pt-36 pb-24 md:px-10">
        <p className="text-sm font-bold tracking-[0.25em] text-gold">
          <Link href={`/${lang}/work`} className="hover:text-gold-light">{t.kicker}</Link>
        </p>
        <h1 className="gold-text mt-4 max-w-3xl text-4xl font-black leading-tight md:text-6xl">{c.name}</h1>
        <p className="mt-4 text-xl font-bold text-gold-light">{c.line}</p>
        <p className="mt-4 max-w-2xl leading-8 text-muted">{c.blurb}</p>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.length
            ? projects.map((p) => (
                <li key={p.title} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {p.image && <img src={p.image} alt={p.title} className="aspect-[4/3] w-full object-cover" />}
                  <div className="p-6">
                    <p className="text-xs text-muted">{t.client}: {p.client}</p>
                    <h2 className="mt-2 text-xl font-black">{p.title}</h2>
                    <p className="mt-3 text-sm leading-7 text-muted">{p.summary}</p>
                  </div>
                </li>
              ))
            : [0, 1, 2].map((i) => (
                <li key={i} className="flex aspect-[4/3] items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-6 text-center text-sm text-muted">
                  {t.placeholder}
                </li>
              ))}
        </ul>
        {!projects.length && <p className="mt-6 text-sm text-muted">{t.soon}</p>}

        <nav aria-label={t.others} className="mt-16">
          <h2 className="text-sm font-bold tracking-[0.2em] text-muted">{t.others}</h2>
          <ul className="mt-4 flex flex-wrap gap-3">
            {CATEGORY_SLUGS.filter((s) => s !== category).map((s) => (
              <li key={s}>
                <Link href={`/${lang}/work/${s}`} className="inline-block rounded-full border border-white/20 px-5 py-2 text-sm transition hover:border-gold hover:text-gold-light">{t.cats[s].name}</Link>
              </li>
            ))}
            <li><Link href={`/${lang}/work`} className="inline-block rounded-full border border-gold/50 px-5 py-2 text-sm text-gold transition hover:bg-gold hover:text-midnight">{t.allWork}</Link></li>
          </ul>
        </nav>

        <section className="mt-24 text-center">
          <h2 className="gold-text text-3xl font-black md:text-4xl">{t.ctaTitle}</h2>
          <Link href={`/${lang}/contact`} className="mt-8 inline-block rounded-full bg-gold px-10 py-4 text-sm font-bold text-midnight transition hover:bg-gold-light">{t.ctaButton}</Link>
        </section>
      </main>
      <Footer t={home.footer} />
    </>
  );
}
