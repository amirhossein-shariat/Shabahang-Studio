import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Sora, Vazirmatn } from "next/font/google";
import { getDictionary, hasLocale, locales } from "@/dictionaries";
import Sky from "@/components/Sky";
import "../globals.css";

const sora = Sora({ variable: "--font-sora", subsets: ["latin"], weight: ["300", "400", "600"], display: "swap" });
const vazir = Vazirmatn({ variable: "--font-vazir", subsets: ["arabic", "latin"], weight: ["300", "400", "700", "900"], display: "swap" });

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { meta } = await getDictionary(lang);
  return {
    title: meta.title,
    description: meta.description,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://shabahangstudio.ir"),
    alternates: { canonical: `/${lang}`, languages: { fa: "/fa", en: "/en" } },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  return (
    <html lang={lang} dir={lang === "fa" ? "rtl" : "ltr"} className={`${sora.variable} ${vazir.variable}`}>
      <body className="min-h-svh">
        <Sky />
        {children}
      </body>
    </html>
  );
}
