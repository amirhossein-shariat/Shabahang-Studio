import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/dictionaries";
import { CATEGORY_SLUGS, getWorkDict } from "@/dictionaries/work";
import { PROJECTS } from "@/data/studio";
import Header from "@/components/Header";
import { Footer } from "@/components/Sections";

export async function generateMetadata({ params }: PageProps<"/[lang]/work">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { meta } = getWorkDict(lang);
  return { title: meta.title, description: meta.description, alternates: { canonical: `/${lang}/work`, languages: { fa: "/fa/work", en: "/en/work" } } };
}

export default async function WorkPage({ params }: PageProps<"/[lang]/work">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const [t, home] = [getWorkDict(lang), await getDictionary(lang)];
  return (
    <>
      <Header lang={lang} t={home.nav} path="work" />
      <main className="mx-auto max-w-6xl px-5 pt-36 pb-24 md:px-10">
        <p className="text-sm font-bold tracking-[0.25em] text-gold">{t.kicker}</p>
        <h1 className="gold-text mt-4 max-w-3xl text-4xl font-black leading-tight md:text-6xl">{t.title}</h1>
        <p className="mt-6 max-w-2xl leading-8 text-muted">{t.intro}</p>
        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORY_SLUGS.map((slug, i) => {
            const c = t.cats[slug];
            return (
              <li key={slug}>
                <Link href={`/${lang}/work/${slug}`} className="group block h-full rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition hover:border-gold/50 hover:bg-white/[0.06]">
                  <span dir="ltr" className="font-latin text-xs tracking-widest text-muted">0{i + 1}</span>
                  <h2 className="mt-5 text-2xl font-black">{c.name}</h2>
                  <p className="mt-2 font-bold text-gold-light">{c.line}</p>
                  <p className="mt-3 text-sm leading-7 text-muted">{c.blurb}</p>
                  <p className="mt-6 flex items-center justify-between text-sm">
                    <span className="text-muted">{PROJECTS[slug].length} {t.count}</span>
                    <span className="font-bold text-gold transition group-hover:text-gold-light">{t.open}</span>
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </main>
      <Footer t={home.footer} />
    </>
  );
}
