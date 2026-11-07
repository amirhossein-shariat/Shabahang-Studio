import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/dictionaries";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ClientsMarquee from "@/components/ClientsMarquee";
import { Services, Work, Cta, Footer } from "@/components/Sections";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = await getDictionary(lang);
  return (
    <>
      <Header lang={lang} t={t.nav} />
      <main>
        <Hero t={t.hero} lang={lang} />
        <ClientsMarquee t={t.clients} />
        <Services t={t.services} lang={lang} />
        <Work t={t.work} lang={lang} />
        <Cta t={t.cta} lang={lang} />
      </main>
      <Footer t={t.footer} />
    </>
  );
}
