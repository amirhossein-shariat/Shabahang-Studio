import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EMAIL, PHONE, getDictionary, hasLocale } from "@/dictionaries";
import { getContactDict } from "@/dictionaries/pages";
import Header from "@/components/Header";
import { Footer } from "@/components/Sections";
import { BaleIcon, PhoneIcon, TelegramIcon } from "@/components/Icons";
import ContactForm from "@/components/ContactForm";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { meta } = getContactDict(lang);
  return { title: meta.title, description: meta.description, alternates: { canonical: `/${lang}/contact`, languages: { fa: "/fa/contact", en: "/en/contact" } } };
}

const pill = "inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2 text-sm transition hover:border-gold hover:text-gold-light";

export default async function ContactPage({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const [t, home] = [getContactDict(lang), await getDictionary(lang)];
  const c = t.channels;
  return (
    <>
      <Header lang={lang} t={home.nav} path="contact" />
      <main className="mx-auto max-w-6xl px-5 pt-36 pb-24 md:px-10">
        <p className="text-sm font-bold tracking-[0.25em] text-gold">{t.kicker}</p>
        <h1 className="gold-text mt-4 max-w-3xl text-4xl font-black leading-tight md:text-6xl">{t.title}</h1>
        <p className="mt-6 max-w-2xl leading-8 text-muted">{t.intro}</p>

        <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">
            <h2 className="text-2xl font-black">{c.title}</h2>
            <dl className="mt-6 space-y-6 text-sm">
              <div>
                <dt className="text-muted">{c.phone}</dt>
                <dd dir="ltr" className="mt-1 text-start font-latin text-2xl font-light tracking-wider text-gold-light">{PHONE.display}</dd>
                <dd className="mt-3 flex flex-wrap gap-3">
                  <a href={`tel:${PHONE.intl}`} className={pill}><PhoneIcon className="text-gold" />{c.call}</a>
                  <a href={`https://t.me/${PHONE.intl}`} target="_blank" rel="noopener noreferrer" className={pill}><TelegramIcon className="text-gold" />{c.telegram}</a>
                </dd>
                <dd className="mt-3 flex items-center gap-2 text-muted"><BaleIcon className="text-gold" />{c.bale}</dd>
              </div>
              <div>
                <dt className="text-muted">{c.email}</dt>
                <dd className="mt-1"><a href={`mailto:${EMAIL}`} dir="ltr" className="font-latin text-gold-light underline-offset-4 hover:underline">{EMAIL}</a></dd>
              </div>
              <div>
                <dt className="text-muted">{c.hours}</dt>
                <dd className="mt-1">{c.hoursValue}</dd>
              </div>
            </dl>
          </section>
          <ContactForm t={t.form} email={EMAIL} />
        </div>
      </main>
      <Footer t={home.footer} />
    </>
  );
}
