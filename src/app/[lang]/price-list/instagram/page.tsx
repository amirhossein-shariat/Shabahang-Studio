import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, EMAIL, PHONE } from "@/dictionaries";
import { INSTAGRAM_PACKAGES as C, priceFor, type Plan } from "@/data/packages";
import { LogoMark } from "@/components/Logo";
import PrintButton from "@/components/PrintButton";

/** Printable one-page price list (A4) for handing to clients. Same data as the site, so prices never drift.
 *  PDF files are generated from this page with `node tools/make-price-pdf.js`. */
export const metadata: Metadata = { title: "Price list", robots: { index: false, follow: false } };

const TIER: Record<Plan["tier"], string> = { bronze: "#D98E5B", silver: "#D5DAE4", gold: "#EBCB88" };

export default async function PriceListPage({ params }: PageProps<"/[lang]/price-list/instagram">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const plans = C.plans.filter((p) => p.enabled);
  const durations = C.durations.filter((d) => d.enabled);
  const nf = new Intl.NumberFormat(lang === "fa" ? "fa-IR" : "en-US", { maximumFractionDigits: 2 });
  const fa = lang === "fa";
  const T = {
    title: fa ? "لیست قیمت پکیج‌های اینستاگرام" : "Instagram packages: price list",
    price: fa ? "مبلغ کل دوره" : "Total for the period",
    monthly: fa ? "معادل ماهانه" : "per month",
    print: fa ? "ذخیره به‌صورت PDF" : "Save as PDF",
    contact: fa ? "برای مشاوره و ثبت سفارش" : "For advice and orders",
    valid: fa ? "اعتبار قیمت‌ها: [جای‌گذار]" : "Prices valid until: [placeholder]",
  };
  const col = `${plans.length}`;
  return (
    <main className="pl-root">
      <div className="pl-bar print:hidden"><PrintButton label={T.print} /></div>
      <div className="pl-sheet" style={{ ["--cols" as string]: col }}>
        <header className="pl-head">
          <div className="flex items-center gap-3"><LogoMark size={34} /><div className="leading-none"><b className="block text-xl font-black">{fa ? "شباهنگ" : "Shabahang"}</b><span dir="ltr" className="font-latin text-[9px] tracking-[0.3em] text-muted">SHABAHANG STUDIO</span></div></div>
          <div className="text-end"><p className="text-[11px] font-bold tracking-[0.25em] text-gold">{C.kicker[lang]}</p><h1 className="gold-text text-2xl font-black leading-tight">{T.title}</h1></div>
        </header>

        <section className="pl-grid pl-prices" aria-label={T.price}>
          <div className="pl-corner">{T.price}<small>{C.currency[lang]}</small></div>
          {plans.map((p) => (
            <div key={p.id} className="pl-th" style={{ ["--c" as string]: TIER[p.tier] }}>
              <i aria-hidden="true" />{p.name[lang]}{p.badge && <em>{p.badge[lang]}</em>}
            </div>
          ))}
          {durations.map((d) => (
            <div key={d.id} className="contents">
              <div className="pl-label">{d.label[lang]}{d.discountPercent > 0 && <small>{nf.format(d.discountPercent)}٪ {C.discountLabel[lang]}</small>}{d.setupFee > 0 && <small>{C.setupIncluded[lang]}</small>}</div>
              {plans.map((p) => { const { monthly, total } = priceFor(p, d); return (
                <div key={p.id} className="pl-price"><b>{nf.format(total)}</b><span>{T.monthly}: {nf.format(monthly)}</span></div>
              ); })}
            </div>
          ))}
        </section>

        <section className="pl-grid pl-feats">
          {plans[0].features.map((f, i) => (
            <div key={i} className="contents">
              <div className="pl-label">{f.label[lang]}</div>
              {plans.map((p) => { const x = p.features[i]; return (
                <div key={p.id} className={"pl-cell" + (x.off ? " off" : "")}>{x.off ? "—" : "✓"} <span>{x.value[lang]}</span></div>
              ); })}
            </div>
          ))}
        </section>

        <footer className="pl-foot">
          <p>{C.footnote[lang]}</p>
          <div className="pl-contact"><span>{T.contact}</span><b dir="ltr">{PHONE.display}</b><b dir="ltr">{EMAIL}</b></div>
          <p className="pl-valid">{T.valid}</p>
        </footer>
      </div>
    </main>
  );
}
