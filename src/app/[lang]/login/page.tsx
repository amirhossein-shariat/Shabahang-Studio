import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/dictionaries";
import { getLoginDict } from "@/dictionaries/login";
import { FEATURES } from "@/config";
import Header from "@/components/Header";
import { Footer } from "@/components/Sections";
import LoginForm from "@/components/LoginForm";

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
      <main className="flex w-full flex-col items-center justify-center overflow-x-clip px-5 pt-32 pb-20">
        <LoginForm t={t} lang={lang} />
      </main>
      <Footer t={home.footer} />
    </>
  );
}
