import type { Slug } from "@/dictionaries/work";

export type Project = { title: string; client: string; summary: string; image?: string; href?: string };

/** Add real projects here. Empty list = the category page shows marked placeholders. */
export const PROJECTS: Record<Slug, Project[]> = { brand: [], web: [], growth: [], it: [], product: [] };

export type Client = {
  name: string;
  /** White-on-transparent SVG (or PNG) in public/clients */
  logo: string;
  /** Intrinsic pixel size of the file (prevents layout shift) */
  w: number;
  h: number;
  /** Displayed height in px; tune per logo so they look equally weighted */
  height: number;
};

/** Client logos for the home-page marquee. Empty list = marked placeholder slots. */
export const CLIENTS: Client[] = [
  { name: "Titano", logo: "/clients/titano.svg", w: 336, h: 76, height: 38 },
  { name: "Pyaco", logo: "/clients/pyaco.svg", w: 176, h: 174, height: 58 },
  { name: "Akofix", logo: "/clients/akofix.svg", w: 210, h: 40, height: 26 },
  { name: "Pratti", logo: "/clients/pratti.svg", w: 360, h: 65, height: 34 },
  { name: "دماکار", logo: "/clients/damakar.svg", w: 219, h: 69, height: 46 },
];
