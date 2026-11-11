import Link from "next/link";
import { FAQ_UI, type Faq } from "@/data/faq";

const nf = new Intl.NumberFormat("fa-IR");
const chev = (cls = "") => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={"h-5 w-5 " + cls} aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
);

/**
 * FAQ as a swipeable carousel (server-rendered; arrows, dots and the list view come from src/lib/enhance.ts).
 * Any number of questions works: the entries live in src/data/faq.ts (admin-editable later).
 */
export default function FaqCarousel({ items, lang }: { items: Faq[]; lang: "fa" | "en" }) {
  const T = FAQ_UI;
  const qa = items.map((i) => ({ q: i.q[lang] ?? i.q.fa, a: i.a[lang] ?? i.a.fa }));
  const total = qa.length + 1;
  const pre = JSON.stringify({ message: lang === "fa" ? "پرسش من:\n" : "My question:\n" });
  return (
    <section data-faq aria-labelledby="faq-title" className="mx-auto max-w-6xl scroll-mt-32 px-5 py-14 md:px-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold tracking-[0.25em] text-gold">FAQ</p>
          <h2 id="faq-title" className="mt-2 text-3xl font-black leading-tight md:text-4xl">{T.title[lang]}</h2>
          <p className="mt-2 max-w-2xl text-muted">{T.sub[lang]}</p>
        </div>
        <button type="button" data-fq-toggle data-list={T.list[lang]} data-carousel={T.carousel[lang]} className="rounded-full border border-gold/50 px-4 py-2 text-xs font-bold text-gold hover:bg-gold hover:text-midnight">{T.list[lang]}</button>
      </div>

      <div data-fq-carousel className="mt-6">
        <div className="relative">
          <div data-fq-track className="fq-track relative flex snap-x snap-mandatory gap-5 overflow-x-auto px-[8%] py-8 sm:px-[calc(50%-14rem)]" tabIndex={0} aria-label={T.title[lang]}>
            {qa.map((x, i) => (
              <article key={i} data-fq-card {...(i === 0 ? { "data-active": "" } : {})} className="fq-card relative flex min-h-72 shrink-0 basis-[84%] snap-center flex-col rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm sm:basis-[28rem]">
                <span aria-hidden="true" className="absolute end-6 top-4 font-latin text-6xl font-black text-gold/10">{nf.format(i + 1)}</span>
                <h3 className="relative max-w-[90%] text-lg font-black leading-8 text-gold-light">{x.q}</h3>
                <p className="relative mt-4 text-sm leading-8 text-text/85">{x.a}</p>
              </article>
            ))}
            <article data-fq-card className="fq-card relative flex min-h-72 shrink-0 basis-[84%] snap-center flex-col items-center justify-center rounded-3xl border border-gold/30 bg-gold/5 p-7 text-center sm:basis-[28rem]">
              <h3 className="text-xl font-black">{T.moreTitle[lang]}</h3>
              <p className="mt-2 text-sm text-muted">{T.moreText[lang]}</p>
              <Link href={`/${lang}/contact`} data-prefill={pre} className="mt-5 rounded-full bg-gold px-8 py-3 text-sm font-bold text-midnight">{T.moreButton[lang]}</Link>
            </article>
          </div>
          <button type="button" data-fq-prev aria-label={T.prev[lang]} className="absolute start-0 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gold/40 bg-[#0b0e27]/90 text-gold backdrop-blur hover:bg-gold hover:text-midnight rtl:rotate-180 md:start-2">{chev()}</button>
          <button type="button" data-fq-next aria-label={T.next[lang]} className="absolute end-0 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 rotate-180 items-center justify-center rounded-full border border-gold/40 bg-[#0b0e27]/90 text-gold backdrop-blur hover:bg-gold hover:text-midnight rtl:rotate-0 md:end-2">{chev()}</button>
        </div>
        <div className="mt-2 flex flex-col items-center gap-3">
          <div className="flex max-w-full flex-wrap items-center justify-center gap-1.5" role="group">
            {Array.from({ length: total }, (_, i) => (
              <button key={i} type="button" data-fq-dot={i} aria-label={nf.format(i + 1)} aria-current={i === 0 ? "true" : "false"} className="fq-dot h-2 w-2 rounded-full bg-white/20" />
            ))}
          </div>
          <p className="text-xs text-muted"><span data-fq-now>{nf.format(1)}</span> {T.of[lang]} {nf.format(total)}</p>
        </div>
      </div>

      <div data-fq-list hidden className="mt-8 grid gap-3">
        {qa.map((x, i) => (
          <details key={i} className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 open:border-gold/40">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-black"><span>{x.q}</span><span aria-hidden="true" className="text-gold transition group-open:rotate-45">+</span></summary>
            <p className="mt-3 text-sm leading-8 text-text/85">{x.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
