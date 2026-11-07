import { existsSync } from "node:fs";
import { join } from "node:path";
import { CLIENTS as ALL_CLIENTS } from "@/data/studio";
import type { Dict } from "@/dictionaries";

const PLACEHOLDER_SLOTS = 8;
/** Logos whose file is not in public/ yet are skipped instead of rendering a broken image. */
const CLIENTS = ALL_CLIENTS.filter((c) => existsSync(join(process.cwd(), "public", c.logo)));
/** Few logos need repeating so one row is always wider than the screen and the loop has no gap. */
const REPS = 4;

type Item = { key: string; node: React.ReactNode; hidden: boolean };

/** Logos scroll right to left in a seamless loop. The track is two identical rows; direction is forced
 *  LTR so it moves the same way in Persian and English. */
export default function ClientsMarquee({ t }: { t: Dict["clients"] }) {
  const real = CLIENTS.length > 0;
  const items: Item[] = real
    ? Array.from({ length: REPS }).flatMap((_, r) =>
        CLIENTS.map((c) => ({
          key: `${c.name}-${r}`,
          hidden: r > 0,
          // eslint-disable-next-line @next/next/no-img-element
          node: <img src={c.logo} alt={r === 0 ? c.name : ""} width={c.w} height={c.h} style={{ height: c.height, width: "auto" }} className="opacity-70 transition-opacity hover:opacity-100" />,
        })),
      )
    : Array.from({ length: PLACEHOLDER_SLOTS }, (_, i) => ({
        key: String(i),
        hidden: false,
        node: <span className="rounded-lg border border-dashed border-white/15 px-6 py-3 text-xs text-muted">{t.placeholder}</span>,
      }));
  const row = (dup: boolean) => (
    <ul className={"flex shrink-0 items-center gap-16 pe-16" + (dup ? " marquee-dup" : "")} aria-hidden={dup || undefined}>
      {items.map((i) => (
        <li key={i.key} className="flex h-16 shrink-0 items-center" aria-hidden={i.hidden || undefined}>{i.node}</li>
      ))}
    </ul>
  );
  return (
    <section aria-label={t.title} className="mx-auto max-w-7xl px-5 py-16 md:px-10">
      <p className="text-center text-xs font-bold tracking-[0.3em] text-muted">{t.title}</p>
      <div className="marquee mt-8 overflow-hidden" dir="ltr">
        <div className="marquee-track" style={{ animationDuration: `${Math.round(items.length * 3.6)}s` }}>
          {row(false)}
          {row(true)}
        </div>
      </div>
    </section>
  );
}
