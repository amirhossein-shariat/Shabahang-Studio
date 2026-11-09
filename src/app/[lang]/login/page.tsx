import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/dictionaries";
import { getLoginDict } from "@/dictionaries/login";
import { FEATURES } from "@/config";
import Header from "@/components/Header";
import { Footer } from "@/components/Sections";
import LoginForm from "@/components/LoginForm";
import ServiceIcon from "@/components/ServiceIcon";

export async function generateMetadata({ params }: PageProps<"/[lang]/login">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { meta } = getLoginDict(lang);
  return { title: meta.title, description: meta.description, robots: { index: false }, alternates: { canonical: `/${lang}/login`, languages: { fa: "/fa/login", en: "/en/login" } } };
}

export default async function LoginPage({ params }: PageProps<"/[lang]/login">) {
  const { lang } = await params;
  if (!hasLocale(lang) || !FEATURES.showLogin) notFound();
  const [t, home] = [getLoginDict(lang), await getDictionary(lang)];
  return (
    <>
      <Header lang={lang} t={home.nav} path="login" />
      <main className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 pt-36 pb-20 md:px-10 lg:grid-cols-[1.05fr_1fr]">
        <section>
          <p className="text-sm font-bold tracking-[0.25em] text-gold">{t.kicker}</p>
          <h1 className="gold-text mt-4 text-4xl font-black leading-tight md:text-6xl">{t.title}</h1>
          <p className="mt-6 max-w-xl leading-8 text-muted">{t.intro}</p>
          <ul className="mt-10 space-y-5">
            {t.points.map((p) => (
              <li key={p.title} className="flex items-start gap-4">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/10 text-gold"><ServiceIcon name={p.icon} size={20} /></span>
                <div>
                  <h2 className="font-black">{p.title}</h2>
                  <p className="mt-1 text-sm leading-7 text-muted">{p.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
        <LoginForm t={t.form} lang={lang} noAccount={t.noAccount} contact={t.contact} />
      </main>
      <Footer t={home.footer} />
    </>
  );
}
