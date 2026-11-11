import Link from "next/link";
import { IT_CTA, IT_GROUPS, IT_PAGE, IT_PLANS, IT_PROJECTS_INTRO, IT_SHARED_NOTES, IT_TARIFF, IT_TERMS, type ItPlan } from "@/data/it";

const nf = new Intl.NumberFormat("fa-IR");
const tick = (
  <span aria-hidden="true" className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-emerald-400/70 bg-emerald-400/10 text-xs leading-none text-emerald-400">✓</span>
);
const pre = (o: object) => JSON.stringify(o);

function PlanCard({ p, lang }: { p: ItPlan; lang: string }) {
  const gold = "linear-gradient(90deg,#EBCB88,color-mix(in srgb,#EBCB88 45%,#fff),#EBCB88,color-mix(in srgb,#EBCB88 45%,#fff),#EBCB88)";
  const grey = "linear-gradient(90deg,#4b5578,#6a7498,#4b5578)";
  return (
    <article className={"relative flex flex-col overflow-hidden rounded-3xl border p-7 pt-9 " + (p.featured ? "border-gold/60 bg-gradient-to-b from-gold/10 to-transparent shadow-[0_0_60px_-22px_rgba(232,198,130,.55)]" : "border-white/15 bg-white/[0.04]")}>
      <div aria-hidden="true" className={"absolute inset-x-0 top-0 h-2.5 " + (p.featured ? "band-shine" : "")} style={{ background: p.featured ? gold : grey, backgroundSize: "200% 100%" }} />
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><p dir="ltr" className="font-latin text-2xl font-black text-gold-light">{p.name}</p><h3 className="mt-1 text-sm font-bold text-muted">{p.title}</h3></div>
        <span className={"rounded-full border px-3 py-1 text-xs font-bold " + (p.featured ? "border-gold bg-gold/15 text-gold-light" : "border-white/25 text-muted")}>{p.badge}</span>
      </div>
      <p className="mt-4 text-sm leading-7 text-muted">{p.short}</p>

      <div className="mt-6" data-for="m">
        <p className="flex items-baseline gap-2"><span className="text-4xl font-black">{nf.format(p.monthly)}</span><span className="text-sm text-muted">تومان / ماه</span></p>
        <p className="mt-2 text-sm text-muted">{IT_PAGE.monthlyHint}</p>
      </div>
      <div className="mt-6" data-for="q">
        <p className="flex items-baseline gap-2"><span className="text-4xl font-black">{nf.format(p.quarterly)}</span><span className="text-sm text-muted">تومان / سه ماه</span></p>
        <p className="mt-2 text-sm text-muted">معادل ماهانه: حدود <b className="text-gold-light">{nf.format(p.quarterlyMonthlyApprox)}</b> تومان</p>
      </div>

      <h4 className="mt-7 text-xs font-bold tracking-[0.15em] text-muted">ظرفیت و سقف پشتیبانی</h4>
      <dl className="mt-3 divide-y divide-white/5 text-sm">
        {p.capacity.map(([k, v]) => (<div key={k} className="flex items-start justify-between gap-4 py-2"><dt className="text-muted">{k}</dt><dd className="text-end font-bold">{v}</dd></div>))}
      </dl>
      {p.capacityNote && <p className="mt-3 text-xs leading-6 text-muted">{p.capacityNote}</p>}

      <h4 className="mt-7 text-xs font-bold tracking-[0.15em] text-muted">امکانات</h4>
      <ul className="mt-3 grid gap-2.5 text-sm leading-7">{p.features.map((x) => (<li key={x} className="flex gap-3">{tick}<span>{x}</span></li>))}</ul>

      <h4 className="mt-7 text-xs font-bold tracking-[0.15em] text-muted">شرایط پاسخ‌گویی</h4>
      <ul className="mt-3 grid gap-2 text-sm leading-7 text-text/85">{p.response.map((x) => (<li key={x} className="flex gap-2"><span aria-hidden="true" className="text-gold">•</span><span>{x}</span></li>))}</ul>
      {p.emergency && (
        <details className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm">
          <summary className="cursor-pointer font-bold text-gold-light">تعریف درخواست اضطراری</summary>
          <p className="mt-2 leading-7 text-muted">{p.emergency}</p>
        </details>
      )}

      <div className="mt-auto pt-8 text-center">
        <Link href={`/${lang}/contact`} data-prefill={pre({ service: "it", message: `درخواست مشاوره برای پکیج ${p.name}.\nتعداد کاربران:\nتعداد سرورها:\nتوضیحات:\n` })} className={"block rounded-full px-6 py-3.5 text-sm font-bold " + (p.featured ? "bg-gold text-midnight" : "border border-white/25 hover:border-gold hover:text-gold")}>{p.cta}</Link>
        <p className="mt-3 text-xs text-muted">{p.ctaHint}</p>
      </div>
    </article>
  );
}

/** The whole IT page body (Persian). Server-rendered; the period toggle and the selection bar are enhanced by src/lib/enhance.ts. */
export default function ItServices({ lang }: { lang: string }) {
  return (
    <div lang="fa" dir="rtl">
      <section id="it-plans" data-period-root data-p="m" className="mx-auto max-w-6xl scroll-mt-32 px-5 py-10 md:px-10">
        <p className="max-w-3xl leading-8 text-muted">{IT_PAGE.intro}</p>
        <div className="mt-8 flex flex-col items-center gap-2">
          <div role="group" aria-label="مدت قرارداد" className="inline-flex rounded-full border border-white/15 bg-white/[0.03] p-1">
            <button type="button" data-period-btn="m" className="per-btn rounded-full px-6 py-2.5 text-sm font-bold">{IT_PAGE.monthlyLabel}</button>
            <button type="button" data-period-btn="q" className="per-btn rounded-full px-6 py-2.5 text-sm font-bold">{IT_PAGE.quarterlyLabel} <span className="ms-1 text-xs font-normal">≈ ۵٪ تخفیف</span></button>
          </div>
          <p className="text-xs text-muted" data-for="m">{IT_PAGE.monthlyHint}</p>
          <p className="text-xs text-muted" data-for="q">{IT_PAGE.quarterlyHint}</p>
        </div>
        <div className="mt-8 grid items-stretch gap-6 md:grid-cols-2">{IT_PLANS.map((p) => <PlanCard key={p.id} p={p} lang={lang} />)}</div>
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h3 className="text-sm font-black">توضیحات مشترک پکیج‌ها</h3>
          <ul className="mt-3 grid gap-2 text-xs leading-7 text-muted md:grid-cols-2">{IT_SHARED_NOTES.map((x) => (<li key={x} className="flex gap-2"><span aria-hidden="true" className="text-gold">•</span><span>{x}</span></li>))}</ul>
        </div>
      </section>

      <section id="it-projects" className="mx-auto max-w-6xl scroll-mt-32 px-5 py-14 md:px-10">
        <p className="text-sm font-bold tracking-[0.25em] text-gold">خارج از پکیج</p>
        <h2 className="mt-2 text-3xl font-black leading-tight md:text-4xl">{IT_PROJECTS_INTRO.title}</h2>
        <p className="mt-3 max-w-3xl leading-8 text-muted">{IT_PROJECTS_INTRO.text}</p>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-gold-light">{IT_PROJECTS_INTRO.hint}</p>
        {IT_GROUPS.map((g) => (
          <div key={g.id} className="mt-10">
            <h3 className="text-lg font-black">{g.title}</h3>
            <ul className="mt-4 grid gap-4 md:grid-cols-2">
              {g.items.map((it) => (
                <li key={it.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition has-[:checked]:border-gold/70 has-[:checked]:bg-gold/10">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input type="checkbox" data-sel data-title={it.title} className="peer sr-only" />
                    <span aria-hidden="true" className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-white/30 text-sm text-transparent transition peer-checked:border-gold peer-checked:bg-gold peer-checked:text-midnight peer-focus-visible:ring-2 peer-focus-visible:ring-gold-light">✓</span>
                    <span><span className="block font-black">{it.title}</span><span className="mt-1 block text-sm leading-7 text-muted">{it.short}</span></span>
                  </label>
                  <details className="mt-3 ps-9 text-sm">
                    <summary className="cursor-pointer font-bold text-gold">جزئیات کامل</summary>
                    <p className="mt-2 leading-8 text-text/85">{it.full}</p>
                    {it.extra && <p className="mt-2 leading-8 text-muted">{it.extra}</p>}
                  </details>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="mt-10 flex flex-col items-center gap-3 rounded-3xl border border-dashed border-gold/40 bg-gold/5 p-7 text-center">
          <h3 className="text-xl font-black">{IT_PROJECTS_INTRO.missingTitle}</h3>
          <p className="text-sm text-muted">{IT_PROJECTS_INTRO.missingText}</p>
          <Link href={`/${lang}/contact`} data-prefill={pre({ service: "it", message: "مشکل یا نیاز من در فهرست خدمات نبود:\n" })} className="rounded-full bg-gold px-8 py-3 text-sm font-bold text-midnight">{IT_PROJECTS_INTRO.missingButton}</Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10 md:px-10">
        <h2 className="text-2xl font-black md:text-3xl">{IT_TARIFF.title}</h2>
        <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-white/5">{IT_TARIFF.rows.map(([k, v]) => (<tr key={k} className="bg-white/[0.03]"><th scope="row" className="p-4 text-start font-bold">{k}</th><td className="p-4 text-end text-gold-light">{v}</td></tr>))}</tbody>
          </table>
        </div>
        <p className="mt-4 max-w-4xl text-sm leading-8 text-muted">{IT_TARIFF.text}</p>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10 md:px-10">
        <h2 className="text-2xl font-black md:text-3xl">{IT_TERMS.title}</h2>
        <p className="mt-2 text-sm text-muted">{IT_TERMS.intro}</p>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {IT_TERMS.items.map(([k, v], i) => (
            <details key={k} className="group rounded-2xl border border-white/10 bg-white/[0.04] p-4 open:border-gold/40">
              <summary className="flex cursor-pointer list-none items-center gap-3 font-black"><span aria-hidden="true" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold/15 text-xs text-gold">{nf.format(i + 1)}</span><span className="flex-1">{k}</span><span aria-hidden="true" className="text-gold transition group-open:rotate-45">+</span></summary>
              <p className="mt-3 text-sm leading-8 text-text/85">{v}</p>
            </details>
          ))}
        </div>
      </section>

      <div data-sel-bar data-no-reveal className="sel-bar fixed inset-x-0 bottom-4 z-40 mx-auto flex w-[min(40rem,calc(100%-2rem))] items-center justify-between gap-3 rounded-2xl border border-gold/50 bg-[#0b0e27]/95 p-3 shadow-[0_10px_50px_rgba(0,0,0,.6)] backdrop-blur-md">
        <p className="ps-2 text-sm"><b data-sel-count className="text-gold-light">۰</b> خدمت برای برآورد انتخاب شد</p>
        <div className="flex items-center gap-2">
          <button type="button" data-sel-clear className="rounded-full border border-white/20 px-4 py-2 text-xs text-muted hover:border-red-400/50 hover:text-red-300">پاک کردن</button>
          <Link href={`/${lang}/contact`} data-prefill-sel className="rounded-full bg-gold px-5 py-2.5 text-xs font-bold text-midnight">درخواست برآورد</Link>
        </div>
      </div>
    </div>
  );
}

export function ItCta({ lang }: { lang: string }) {
  return (
    <section dir="rtl" lang="fa" className="mx-auto max-w-3xl px-5 py-20 text-center">
      <h2 className="gold-text text-3xl font-black leading-tight md:text-5xl">{IT_CTA.title}</h2>
      <p className="mt-5 leading-8 text-muted">{IT_CTA.text}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href={`/${lang}/contact`} data-prefill={pre({ service: "it", message: "درخواست مشاوره و ارزیابی اولیه.\nشهر:\nتعداد تقریبی کاربران:\nتعداد سرورها:\nنوع خدمت (پشتیبانی ماهانه / راه‌اندازی یا توسعه پروژه / مشاوره و ارزیابی):\n" })} className="rounded-full bg-gold px-8 py-3.5 text-sm font-bold text-midnight">{IT_CTA.primary}</Link>
        <a href="#it-projects" className="rounded-full border border-white/25 px-8 py-3.5 text-sm font-bold hover:border-gold hover:text-gold">{IT_CTA.secondary}</a>
      </div>
    </section>
  );
}
