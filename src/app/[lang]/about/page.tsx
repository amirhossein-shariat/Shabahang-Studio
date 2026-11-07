import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/dictionaries";
import { getAboutDict } from "@/dictionaries/pages";
import Header from "@/components/Header";
import { Footer } from "@/components/Sections";

export async function generateMetadata({ params }: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { meta } = getAboutDict(lang);
  return { title: meta.title, description: meta.description, alternates: { canonical: `/${lang}/about`, languages: { fa: "/fa/about", en: "/en/about" } } };
}

const h2 = "text-3xl font-black md:text-4xl";
const sect = "mx-auto max-w-6xl px-5 py-14 md:px-10";

export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const [t, home] = [getAboutDict(lang), await getDictionary(lang)];
  return (
    <>
      <Header lang={lang} t={home.nav} path="about" />
      <main>
        <section className="mx-auto max-w-6xl px-5 pt-36 pb-10 md:px-10">
          <p className="text-sm font-bold tracking-[0.25em] text-gold">{t.kicker}</p>
          <h1 className="gold-text mt-4 max-w-3xl text-4xl font-black leading-tight md:text-6xl">{t.title}</h1>
          <p className="mt-6 max-w-2xl leading-8 text-muted">{t.intro}</p>
        </section>

        <section className={sect + " grid gap-5 md:grid-cols-2"}>
          {[t.name, t.concept].map((b) => (
            <div key={b.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">
              <h2 className="text-2xl font-black text-gold-light">{b.title}</h2>
              <p className="mt-4 leading-8 text-muted">{b.text}</p>
            </div>
          ))}
        </section>

        <section className={sect}>
          <h2 className={h2}>{t.steps.title}</h2>
          <ol className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {t.steps.items.map((s, i) => (
              <li key={s.name} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <span dir="ltr" className="font-latin text-xs tracking-widest text-gold">0{i + 1}</span>
                <h3 className="mt-3 text-lg font-black">{s.name}</h3>
                <p className="mt-2 text-sm leading-7 text-muted">{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className={sect}>
          <h2 className={h2}>{t.promise.title}</h2>
          <ul className="mt-8 grid gap-5 md:grid-cols-3">
            {t.promise.items.map((s) => (
              <li key={s.name} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <h3 className="text-lg font-black text-gold-light">{s.name}</h3>
                <p className="mt-2 text-sm leading-7 text-muted">{s.text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className={sect}>
          <h2 className={h2}>{t.team.title}</h2>
          <p className="mt-8 flex min-h-40 items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-6 text-center text-sm text-muted">{t.team.placeholder}</p>
        </section>

        <section className="mx-auto max-w-3xl px-5 py-24 text-center">
          <Link href={`/${lang}/contact`} className="inline-block rounded-full bg-gold px-10 py-4 text-sm font-bold text-midnight transition hover:bg-gold-light">{t.cta}</Link>
        </section>
      </main>
      <Footer t={home.footer} />
    </>
  );
}
