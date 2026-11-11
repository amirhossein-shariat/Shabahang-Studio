export const locales = ["fa", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fa";
export const hasLocale = (l: string): l is Locale =>
  (locales as readonly string[]).includes(l);

export const EMAIL = "Amirhosseinshariatt@gmail.com";
export const PHONE = { display: "0912 867 2522", intl: "+989128672522" } as const;

export type Dict = {
  meta: { title: string; description: string };
  nav: { work: string; services: string; studio: string; contact: string; talk: string; login: string; panel: string };
  hero: { eyebrow: string; title: string; sub: string; tagline: string; desc: string; cta1: string; cta2: string; scroll: string };
  services: { kicker: string; title: string };
  work: { kicker: string; title: string; note: string; placeholder: string; all: string };
  clients: { title: string; placeholder: string };
  cta: { title: string; desc: string; button: string; emailLabel: string; phoneLabel: string; call: string; telegram: string; bale: string };
  footer: { rights: string };
};

const dictionaries: Record<Locale, () => Promise<Dict>> = {
  fa: () => import("./fa").then((m) => m.default),
  en: () => import("./en").then((m) => m.default),
};

export const getDictionary = (l: Locale) => dictionaries[l]();
