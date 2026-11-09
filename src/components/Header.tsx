import Link from "next/link";
import { FEATURES } from "@/config";
import Logo from "./Logo";
import ServiceIcon from "./ServiceIcon";
import type { Dict, Locale } from "@/dictionaries";

export default function Header({ lang, t, path = "" }: { lang: Locale; t: Dict["nav"]; path?: string }) {
  const other: Locale = lang === "fa" ? "en" : "fa";
  const links = [
    ...(FEATURES.showWork ? [[`/${lang}/work`, t.work]] : []),
    [`/${lang}/services`, t.services],
    [`/${lang}/about`, t.studio],
    [`/${lang}/contact`, t.contact],
  ];
  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-white/5 bg-midnight/50 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-5 md:px-10">
        <Link href={`/${lang}`} aria-label="Shabahang Studio">
          <Logo />
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-8 text-sm text-muted md:flex">
          {links.map(([href, label]) => (
            <Link key={href} href={href} className="nav-link transition-colors hover:text-gold-light">
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2.5 sm:gap-3">
          {FEATURES.showLogin && (
            <Link href={`/${lang}/login`} aria-label={t.login} className="inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-gold-light">
              <ServiceIcon name="user" size={18} />
              <span className="hidden sm:inline">{t.login}</span>
            </Link>
          )}
          <Link
            href={path ? `/${other}/${path}` : `/${other}`}
            hrefLang={other}
            className="font-latin text-xs text-muted transition-colors hover:text-gold-light"
          >
            {other === "en" ? "EN" : "فا"}
          </Link>
          <Link
            href={`/${lang}/contact`}
            className="whitespace-nowrap rounded-full border border-gold/60 px-2.5 py-2 text-[11px] font-bold tracking-wider text-gold sm:px-3 sm:text-xs transition hover:bg-gold hover:text-midnight md:px-4"
          >
            {t.talk}
          </Link>
        </div>
      </div>
    </header>
  );
}
