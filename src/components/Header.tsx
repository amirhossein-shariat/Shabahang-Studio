import Link from "next/link";
import Logo from "./Logo";
import type { Dict, Locale } from "@/dictionaries";

export default function Header({ lang, t, path = "" }: { lang: Locale; t: Dict["nav"]; path?: "" | "services" }) {
  const other: Locale = lang === "fa" ? "en" : "fa";
  const links = [
    [`/${lang}#work`, t.work],
    [`/${lang}/services`, t.services],
    [`/${lang}#studio`, t.studio],
    [`/${lang}#contact`, t.contact],
  ];
  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-white/5 bg-midnight/50 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-10">
        <Link href={`/${lang}`} aria-label="Shabahang Studio">
          <Logo />
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-8 text-sm text-muted md:flex">
          {links.map(([href, label]) => (
            <Link key={href} href={href} className="transition-colors hover:text-gold-light">
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-3">
          <Link
            href={path === "services" ? `/${other}/services` : `/${other}`}
            hrefLang={other}
            className="font-latin text-xs tracking-widest text-muted transition-colors hover:text-gold-light"
          >
            {other === "en" ? "EN" : "فا"}
          </Link>
          <Link
            href={`/${lang}#contact`}
            className="whitespace-nowrap rounded-full border border-gold/60 px-3 py-2 text-xs font-bold tracking-wider text-gold transition hover:bg-gold hover:text-midnight md:px-4"
          >
            {t.talk}
          </Link>
        </div>
      </div>
    </header>
  );
}
