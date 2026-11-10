import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "@/dictionaries";
import { FEATURES } from "@/config";
import { PILLARS } from "@/data/services";
import PanelClient from "@/components/PanelClient";

export async function generateMetadata({ params }: PageProps<"/[lang]/panel">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  return { title: "پیشخوان | شباهنگ استودیو", robots: { index: false, follow: false } };
}

/** Demo panels (client and CEO). The panel itself is Persian-only for now. */
export default async function PanelPage({ params }: PageProps<"/[lang]/panel">) {
  const { lang } = await params;
  if (!hasLocale(lang) || !FEATURES.demoPanel) notFound();
  const services = PILLARS.filter((p) => p.enabled).map((p) => ({ id: p.id, name: p.name.fa, line: p.line.fa }));
  return (
    <main className="w-full">
      <PanelClient lang={lang} services={services} />
    </main>
  );
}
