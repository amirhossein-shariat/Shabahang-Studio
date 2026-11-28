import type { Faq } from "@/data/faq";

/** Accessible FAQ accordion. Server-rendered: every question is a <button aria-expanded aria-controls> and the
 *  answer is a labelled region. Toggling is handled by src/lib/enhance.ts ([data-acc-btn]); several can be open.
 *  Styling follows the site's cards (border, gold accents). */
export default function FaqAccordion({ items, lang, title, id }: { items: Faq[]; lang: "fa" | "en"; title: string; id: string }) {
  return (
    <section aria-labelledby={`${id}-t`} className="mt-14">
      <p className="text-sm font-bold tracking-[0.25em] text-gold">FAQ</p>
      <h3 id={`${id}-t`} className="mt-2 text-2xl font-black leading-tight md:text-3xl">{title}</h3>
      <div className="mt-6 grid gap-3">
        {items.map((x, i) => (
          <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm transition-colors duration-300 hover:border-gold/30 has-[[aria-expanded=true]]:border-gold/50">
            <h4>
              <button
                type="button"
                id={`${id}-q${i}`}
                data-acc-btn
                aria-expanded="false"
                aria-controls={`${id}-a${i}`}
                className="flex w-full items-center justify-between gap-4 rounded-2xl p-5 text-start font-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold aria-expanded:text-gold-light"
              >
                <span>{x.q[lang] ?? x.q.fa}</span>
                <span aria-hidden="true" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold transition-transform duration-300 [[aria-expanded=true]_&]:rotate-45">+</span>
              </button>
            </h4>
            <div id={`${id}-a${i}`} role="region" aria-labelledby={`${id}-q${i}`} hidden>
              <p className="px-5 pb-5 text-sm leading-8 text-text/85">{x.a[lang] ?? x.a.fa}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
