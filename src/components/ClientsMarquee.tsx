import { CLIENTS } from "@/data/studio";
import type { Dict } from "@/dictionaries";

const SLOTS = 8;

/** Logos scroll right to left in a seamless loop (the track is duplicated; direction is forced LTR so
 *  it moves the same way in Persian and English). */
export default function ClientsMarquee({ t }: { t: Dict["clients"] }) {
  const items = CLIENTS.length
    ? CLIENTS.map((c) => ({ key: c.name, node: c.logo ? // eslint-disable-next-line @next/next/no-img-element
      <img src={c.logo} alt={c.name} className="h-10 w-auto opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0" /> : <span className="text-lg font-bold text-muted">{c.name}</span> }))
    : Array.from({ length: SLOTS }, (_, i) => ({ key: String(i), node: <span className="rounded-lg border border-dashed border-white/15 px-6 py-3 text-xs text-muted">{t.placeholder}</span> }));
  const row = (dup: boolean) => (
    <ul className={"flex shrink-0 items-center gap-14 pe-14" + (dup ? " marquee-dup" : "")} aria-hidden={dup || undefined}>
      {items.map((i) => <li key={i.key} className="flex h-14 shrink-0 items-center">{i.node}</li>)}
    </ul>
  );
  return (
    <section aria-label={t.title} className="mx-auto max-w-7xl px-5 py-16 md:px-10">
      <p className="text-center text-xs font-bold tracking-[0.3em] text-muted">{t.title}</p>
      <div className="marquee mt-8 overflow-hidden" dir="ltr">
        <div className="marquee-track">{row(false)}{row(true)}</div>
      </div>
    </section>
  );
}
