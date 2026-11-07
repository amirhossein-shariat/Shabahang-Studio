import type { Slug } from "@/dictionaries/work";

export type Project = { title: string; client: string; summary: string; image?: string; href?: string };

/** Add real projects here. Empty list = the category page shows marked placeholders. */
export const PROJECTS: Record<Slug, Project[]> = { brand: [], web: [], growth: [], it: [], product: [] };

/** Client logos shown in the home-page marquee. Put SVG/PNG files in public/clients and list them here,
 *  e.g. { name: "Acme", logo: "/clients/acme.svg" }. Empty list = placeholder slots. */
export const CLIENTS: { name: string; logo?: string }[] = [];
