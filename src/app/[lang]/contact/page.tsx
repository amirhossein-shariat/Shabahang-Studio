import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EMAIL, PHONE, getDictionary, hasLocale } from "@/dictionaries";
import { getContactDict } from "@/dictionaries/pages";
import Header from "@/components/Header";
import { Footer } from "@/components/Sections";
import { BaleIcon, PhoneIcon, TelegramIcon } from "@/components/Icons";
import ServiceIcon from "@/components/ServiceIcon";
import ContactForm from "@/components/ContactForm";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { meta } = getContactDict(lang);
  return { title: meta.title, description: meta.description, alternates: { canonical: `/${lang}/contact`, languages: { fa: "/fa/contact", en: "/en/contact" } } };
}

const pill = "inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm transition hover:border-gold hover:text-gold";

export default async function ContactPage({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const [t, home] = [getContactDict(lang), await getDictionary(lang)];
  const c = t.channels;
  return (
    <>
      <Header lang={lang} t={home.nav} path="contact" />
      <main className="mx-auto w-full max-w-5xl px-5 pt-36 pb-24 md:px-10">
        <header className="page-head mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold tracking-[0.25em] text-gold">{t.kicker}</p>
          <h1 className="gold-text mt-4 text-4xl font-black leading-tight md:text-5xl">{t.title}</h1>
          <p className="mt-5 leading-8 text-muted">{t.intro}</p>
        </header>

        <div className="mt-14 grid items-stretch gap-6 lg:grid-cols-2">
          <section className="flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/[0.04] p-7 text-center backdrop-blur-sm sm:p-9">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gold/30 bg-gold/10 text-gold"><PhoneIcon size={22} /></span>
            <h2 className="mt-4 text-2xl font-black">{c.title}</h2>

            <p className="mt-8 text-xs text-muted">{c.phone}</p>
            <p dir="ltr" className="mt-1 font-latin text-3xl font-light tracking-wider text-gold-light">{PHONE.display}</p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <a href={`tel:${PHONE.intl}`} className={pill}><PhoneIcon className="text-gold" />{c.call}</a>
              <a href={`https://t.me/${PHONE.intl}`} target="_blank" rel="noopener noreferrer" className={pill}><TelegramIcon className="text-gold" />{c.telegram}</a>
            </div>
            <p className="mt-4 inline-flex items-center gap-2 text-sm text-muted"><BaleIcon className="text-gold" />{c.bale}</p>

            <div aria-hidden="true" className="my-8 h-px w-24 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

            <dl className="space-y-6 text-sm">
              <div>
                <dt className="text-xs text-muted">{c.email}</dt>
                <dd className="mt-1"><a href={`mailto:${EMAIL}`} dir="ltr" className="font-latin text-lg text-gold-light underline-offset-4 hover:underline">{EMAIL}</a></dd>
              </div>
              <div>
                <dt className="text-xs text-muted">{c.hours}</dt>
                <dd className="mt-1 inline-flex items-center gap-2 text-lg"><ServiceIcon name="calendar" size={18} className="text-gold" />{c.hoursValue}</dd>
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
