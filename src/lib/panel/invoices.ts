/**
 * Invoice tool (فاکتورها): form, live A4 preview, saved list, phone book, paid status, settings, PDF via the browser.
 * Plain DOM strings (no framework), same shape and API contract as the owner's desktop tool.
 * Storage goes through a small Store; here it is localStorage (demo). When the real backend exists, set
 * window.API_BASE and the same UI talks to GET/PUT /api/invoices, DELETE /api/invoices/:id, GET/PUT /api/settings, GET/PUT /api/contacts.
 * The invoice number is assigned by the store (server side in the real version, inside a transaction).
 */
import { MONTHS, WEEKDAYS, jMonthLen, weekCol, tehranToday, pad2, toFaDigits, toLatinDigits } from "./jalali";

type VItem = { desc: string; qty: number; price: number };
type VInv = {
  id?: string; number?: number; date: string; customerName: string; customerPhone: string; items: VItem[];
  discount: number; discountType: "amount" | "percent"; note: string; paid: boolean; createdAt?: string; updatedAt?: string;
};
type VSettings = {
  designerName: string; designerPhone: string; cardNumber: string; bank: string; accountName: string; sheba: string;
  providerLabel: string; currency: string; noteFooter: string;
};
type VContact = { name: string; phone: string };
type VStore = {
  list(): Promise<VInv[]>; save(i: VInv): Promise<VInv>; remove(id: string): Promise<void>;
  getSettings(): Promise<Partial<VSettings>>; putSettings(s: VSettings): Promise<void>;
  getContacts(): Promise<VContact[] | null>; putContacts(c: VContact[]): Promise<void>;
};
type VMode = { filler: boolean; compact: boolean; grow: boolean };

const V_DEFAULTS: VSettings = {
  designerName: "امیرحسین شریعت", designerPhone: "09128672522", cardNumber: "[شماره کارت]", bank: "[نام بانک]", accountName: "[نام صاحب حساب]", sheba: "IR[شماره شبا]",
  providerLabel: "ارائه‌دهنده خدمات", currency: "ریال", noteFooter: "کلیه‌ی مبالغ به ریال می‌باشد.",
};
const V_NAVY = "#14304f";
const V_GREEN = "#4cb582";
const A4_H = 1123;
const A4_W = 794;

/* ---------- storage ---------- */
function vLocalStore(): VStore {
  const rd = <T,>(k: string, d: T): T => { try { const v = localStorage.getItem(k); return v ? (JSON.parse(v) as T) : d; } catch { return d; } };
  const wr = (k: string, v: unknown) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* quota or private mode */ } };
  return {
    async list() { return rd<VInv[]>("sh-inv-list", []).sort((a, b) => (b.number ?? 0) - (a.number ?? 0)); },
    async save(i) {
      const all = rd<VInv[]>("sh-inv-list", []); const gone = rd<VInv[]>("sh-inv-deleted", []); const now = new Date().toISOString();
      if (!i.id) {
        const n = Math.max(0, ...all.map((x) => x.number ?? 0), ...gone.map((x) => x.number ?? 0)) + 1;
        const rec = { ...i, number: n, id: String(n).padStart(4, "0"), createdAt: now, updatedAt: now };
        all.push(rec); wr("sh-inv-list", all); return rec;
      }
      const idx = all.findIndex((x) => x.id === i.id);
      const rec = { ...(idx >= 0 ? all[idx] : {}), ...i, updatedAt: now };
      if (idx >= 0) all[idx] = rec; else all.push(rec);
      wr("sh-inv-list", all); return rec;
    },
    async remove(id) { // soft delete: moved to a separate store, never hard-deleted
      const all = rd<VInv[]>("sh-inv-list", []); const gone = rd<VInv[]>("sh-inv-deleted", []);
      const rec = all.find((x) => x.id === id); if (!rec) return;
      gone.push({ ...rec, updatedAt: new Date().toISOString() }); wr("sh-inv-deleted", gone); wr("sh-inv-list", all.filter((x) => x.id !== id));
    },
    async getSettings() { return rd<Partial<VSettings>>("sh-inv-settings", {}); },
    async putSettings(s) { wr("sh-inv-settings", s); },
    async getContacts() { return rd<VContact[] | null>("sh-inv-contacts", null); },
    async putContacts(c) { wr("sh-inv-contacts", c); },
  };
}
function vHttpStore(base: string): VStore {
  const j = async (u: string, init?: RequestInit) => { const r = await fetch(base + u, { credentials: "same-origin", headers: { "Content-Type": "application/json" }, ...init }); if (!r.ok) throw new Error(String(r.status)); return r.status === 204 ? null : r.json(); };
  return {
    list: () => j("/api/invoices"), save: (i) => j("/api/invoices", { method: "PUT", body: JSON.stringify(i) }),
    remove: async (id) => { await j("/api/invoices/" + encodeURIComponent(id), { method: "DELETE" }); },
    getSettings: () => j("/api/settings"), putSettings: async (s) => { await j("/api/settings", { method: "PUT", body: JSON.stringify(s) }); },
    getContacts: () => j("/api/contacts"), putContacts: async (c) => { await j("/api/contacts", { method: "PUT", body: JSON.stringify(c) }); },
  };
}

/* ---------- helpers ---------- */
const vh = (s: string) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);
const vFmt = new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 0 });
const vFa = (n: number) => vFmt.format(Math.round(n));
const vNum = (s: string) => { const t = toLatinDigits(s).replace(/[^\d]/g, ""); return t ? parseInt(t, 10) : 0; };
const vNorm = (s: string) => s.replace(/ي/g, "ی").replace(/ك/g, "ک").replace(/[‌\s]+/g, " ").trim();
const vToday = () => { const t = tehranToday(); return toFaDigits(`${t.jy}/${pad2(t.jm)}/${pad2(t.jd)}`); };
const vBlank = (): VInv => ({ date: vToday(), customerName: "", customerPhone: "", items: [{ desc: "", qty: 1, price: 0 }], discount: 0, discountType: "amount", note: "", paid: false });
function vCalc(i: VInv) {
  const sub = i.items.reduce((n, r) => n + (r.qty || 0) * (r.price || 0), 0);
  const disc = i.discountType === "percent" ? Math.round((sub * Math.min(100, i.discount || 0)) / 100) : Math.min(sub, i.discount || 0);
  return { sub, disc, pay: Math.max(0, sub - disc) };
}
const vIcon = (p: string) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" aria-hidden="true">${p}</svg>`;

/** The A4 sheet. Colours and proportions follow the owner's printed sample: navy header, green accent, SA logo column. */
function vSheet(i: VInv, st: VSettings, m: VMode) {
  const c = vCalc(i);
  const real = i.items.filter((r) => r.desc.trim() || r.price || r.qty > 1);
  const rows = real.length ? real : [];
  const fill = m.filler ? Math.max(0, 10 - rows.length) : 0;
  const body = rows.map((r, k) => `<tr><td class="c">${vFa(k + 1)}</td><td class="d">${vh(r.desc)}</td><td class="c">${vFa(r.qty)}</td><td class="n">${vFa(r.price)}</td><td class="n">${vFa(r.qty * r.price)}</td></tr>`).join("") +
    Array.from({ length: fill }, (_, k) => `<tr class="e"><td class="c">${vFa(rows.length + k + 1)}</td><td></td><td></td><td></td><td></td></tr>`).join("");
  const num = i.number ? toFaDigits(String(i.number).padStart(4, "0")) : "—";
  return `<div class="inv-sheet ${m.compact ? "compact" : ""} ${m.grow ? "grow" : ""}" dir="rtl">
    <div class="inv-band" aria-hidden="true"><img src="/invoice/logo.png" alt="" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="inv-mono" style="display:none"><b>S</b><b>A</b></div></div>
    <div class="inv-main">
      <header class="inv-head">
        <div class="inv-meta"><p><span>شماره فاکتور</span><b>${num}</b></p><p><span>تاریخ</span><b>${vh(i.date)}</b></p></div>
        <div class="inv-party"><span class="lab">${vh(st.providerLabel)}</span><b>${vh(st.designerName)}</b><em dir="ltr">${vh(toFaDigits(st.designerPhone))}</em></div>
        <div class="inv-party"><span class="lab">مشتری</span><b>${vh(i.customerName) || "—"}</b><em dir="ltr">${vh(toFaDigits(i.customerPhone))}</em></div>
      </header>
      <table class="inv-table"><thead><tr><th class="c" style="width:7%">ردیف</th><th>شرح خدمات</th><th class="c" style="width:9%">تعداد</th><th class="n" style="width:19%">فی</th><th class="n" style="width:21%">مبلغ کل</th></tr></thead><tbody>${body}</tbody></table>
      <div class="inv-spacer"></div>
      <footer class="inv-foot">
        <div class="inv-notes">
          <div class="inv-note"><p>${vh(i.note) || "&nbsp;"}</p><p class="fixed">${vh(st.noteFooter)}</p></div>
          <div class="inv-bank"><p><span>شماره کارت</span><b dir="ltr">${vh(toFaDigits(st.cardNumber))}</b></p><p><span>بانک</span><b>${vh(st.bank)}</b></p><p><span>به نام</span><b>${vh(st.accountName)}</b></p><p><span>شماره شبا</span><b dir="ltr">${vh(toFaDigits(st.sheba))}</b></p></div>
        </div>
        <div class="inv-totals">
          <p><span>جمع کل</span><b>${vFa(c.sub)}</b></p>
          <p><span>تخفیف</span><b>${vFa(c.disc)}</b></p>
          <p class="pay"><span>مبلغ قابل پرداخت</span><b>${vFa(c.pay)} <small>${vh(st.currency)}</small></b></p>
        </div>
      </footer>
    </div>
  </div>`;
}

export function mountInvoices(el: HTMLElement): () => void {
  const store: VStore = (window as unknown as { API_BASE?: string }).API_BASE ? vHttpStore((window as unknown as { API_BASE: string }).API_BASE) : vLocalStore();
  let settings: VSettings = { ...V_DEFAULTS };
  let list: VInv[] = [];
  let contacts: VContact[] = [];
  let cur: VInv = vBlank();
  let dirty = false;
  let nameFilter = "";
  let query = "";
  let mode: VMode = { filler: true, compact: false, grow: false };
  let pbIdx = -1;
  let dp: { y: number; m: number } | null = null;
  let dragFrom = -1;
  let alive = true;

  const q = <T extends HTMLElement>(s: string) => el.querySelector<T>(s);
  const toast = (t: string) => { const d = document.createElement("div"); d.className = "fixed bottom-6 left-1/2 z-[90] -translate-x-1/2 rounded-full border border-gold/40 bg-[#0b0e27] px-5 py-3 text-sm text-text shadow-lg"; d.textContent = t; document.body.appendChild(d); setTimeout(() => d.remove(), 2600); };
  const field = "min-w-0 w-full rounded-xl border border-white/15 bg-white/[0.04] px-3 py-2.5 text-sm text-text placeholder:text-muted focus:border-gold";
  const btn = "rounded-full border border-gold/50 px-4 py-2 text-xs font-bold text-gold transition hover:bg-gold hover:text-midnight";
  const btnGold = "rounded-full bg-gold px-5 py-2.5 text-xs font-bold text-midnight";

  /* ---------- draft autosave (nothing typed is ever lost silently) ---------- */
  const saveDraft = () => { try { if (dirty) localStorage.setItem("sh-inv-draft", JSON.stringify(cur)); else localStorage.removeItem("sh-inv-draft"); } catch { /* ignore */ } };
  const touch = () => { dirty = true; saveDraft(); paintStatus(); paintPreview(); };
  const confirmDiscard = () => !dirty || confirm("تغییرات ذخیره‌نشده از بین می‌رود. ادامه می‌دهید؟");

  /* ---------- layout ---------- */
  function shell() {
    const lab = "mb-1 block text-xs font-bold text-muted";
    el.innerHTML = `<div class="@container" data-inv>
      <div class="mb-5 flex flex-wrap items-center justify-between gap-3"><div><h1 class="text-2xl font-black md:text-3xl">فاکتورها</h1><p class="mt-1 text-sm text-muted" data-status></p></div>
        <div class="flex flex-wrap gap-2"><button data-i="new" class="${btnGold}">فاکتور جدید</button><button data-i="settings" class="${btn}">تنظیمات</button></div></div>
      <div class="grid items-start gap-6 @3xl:grid-cols-[19rem_minmax(0,1fr)]">
        <aside class="min-w-0 @3xl:sticky @3xl:top-4" aria-label="لیست فاکتورها">
          <div class="grid gap-2">
            <label class="flex items-center gap-2 text-xs text-muted"><span class="shrink-0">اسم‌ها</span><select data-i="names" class="min-w-0 flex-1 rounded-xl border border-white/15 bg-midnight px-3 py-2.5 text-sm text-text"></select></label>
            <input data-i="search" class="${field}" placeholder="جستجوی مشتری یا شماره…"></div>
          <p class="mt-3 text-xs text-muted" data-summary></p>
          <div class="mt-2 grid max-h-[34rem] gap-2.5 overflow-y-auto pe-1" data-list></div>
        </aside>
        <section class="min-w-0 rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm md:p-7" aria-label="ویرایش فاکتور"><div class="@container">
          <h2 class="text-xl font-black" data-title>فاکتور جدید</h2>
          <div class="mt-5 grid gap-4 @xl:grid-cols-2">
            <label class="relative block"><span class="${lab}">نام مشتری</span>
              <span class="relative block"><input data-i="name" autocomplete="off" placeholder="تایپ یا انتخاب از دفترچه" class="${field} pe-10"><span aria-hidden="true" class="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-muted">${vIcon('<rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="12" cy="10" r="3"/><path d="M7 17c1-2 3-3 5-3s4 1 5 3"/>')}</span></span>
              <div data-pb class="absolute inset-x-0 top-full z-30 mt-1 hidden max-h-56 overflow-y-auto rounded-xl border border-white/15 bg-[#0b0e27] p-1 shadow-xl"></div></label>
            <label class="block"><span class="${lab}">شماره تماس مشتری</span><input data-i="phone" dir="ltr" inputmode="tel" class="${field} text-end"></label>
            <label class="relative block @xl:max-w-[calc(50%-0.5rem)]"><span class="${lab}">تاریخ</span><input data-i="date" class="${field}" autocomplete="off"><div data-dp class="absolute start-0 top-full z-30 mt-1 hidden w-64 rounded-xl border border-white/15 bg-[#0b0e27] p-3 shadow-xl"></div></label>
          </div>
          <h3 class="mt-7 text-sm font-black">اقلام فاکتور</h3>
          <div class="mt-3 hidden grid-cols-[1.25rem_1.5rem_minmax(0,1fr)_4.5rem_8rem_2.5rem] gap-2 px-1 text-xs font-bold text-muted @xl:grid"><span>#</span><span></span><span>شرح خدمات</span><span class="text-center">تعداد</span><span>فی</span><span></span></div>
          <div class="mt-2 grid gap-2" data-rows></div>
          <button data-i="addrow" class="mt-3 w-full rounded-xl border border-dashed border-white/25 py-2.5 text-sm text-muted transition hover:border-gold hover:text-gold">+ افزودن ردیف</button>
          <div class="mt-6 grid gap-4 @xl:grid-cols-[1fr_9rem]"><label class="block"><span class="${lab}">تخفیف</span><input data-i="disc" inputmode="numeric" class="${field}"></label>
            <label class="block"><span class="${lab}">نوع تخفیف</span><select data-i="dtype" class="w-full rounded-xl border border-white/15 bg-midnight px-3 py-2.5 text-sm text-text"><option value="amount">مبلغ</option><option value="percent">درصد</option></select></label></div>
          <div class="mt-5 rounded-xl border border-white/15 bg-black/20 p-4 text-sm"><p class="flex justify-between"><span class="text-muted">جمع کل</span><b data-sub>۰</b></p><p class="mt-2 flex justify-between border-t border-white/10 pt-2 font-black"><span>قابل پرداخت</span><b class="text-gold-light" data-pay>۰</b></p></div>
          <label class="mt-5 block"><span class="${lab}">یادداشت</span><textarea data-i="note" rows="3" class="${field} resize-none"></textarea></label>
          <div class="mt-6 flex flex-wrap items-center gap-3"><button data-i="save" class="rounded-xl bg-[#4cb582] px-6 py-3 text-sm font-bold text-[#06210f] transition hover:brightness-110">ذخیره <span class="text-[10px] opacity-70">Ctrl+S</span></button><button data-i="pdf" class="rounded-xl border border-white/20 bg-[#14304f] px-6 py-3 text-sm font-bold text-white transition hover:border-gold">خروجی PDF</button></div>
        </div></section>
      </div>
      <div data-sheet-host aria-hidden="true" style="position:fixed;left:0;top:0;width:${A4_W}px;visibility:hidden;pointer-events:none;z-index:-1"><div data-sheet></div></div>
      <dialog data-set class="m-auto w-[min(32rem,92vw)] rounded-2xl border border-white/15 bg-[#0b0e27] p-5 text-text backdrop:bg-black/60 backdrop:backdrop-blur-sm"></dialog></div>`;
  }

  function fillForm() {
    (q<HTMLInputElement>("[data-i=name]")!).value = cur.customerName;
    (q<HTMLInputElement>("[data-i=phone]")!).value = cur.customerPhone;
    (q<HTMLInputElement>("[data-i=date]")!).value = cur.date;
    (q<HTMLInputElement>("[data-i=disc]")!).value = cur.discount ? vFa(cur.discount) : "";
    (q<HTMLSelectElement>("[data-i=dtype]")!).value = cur.discountType;
    (q<HTMLTextAreaElement>("[data-i=note]")!).value = cur.note;
    paintRows(); paintStatus(); paintPreview();
  }

  function paintStatus() {
    const s = q("[data-status]"); if (s) s.textContent = (cur.number ? `فاکتور شماره ${toFaDigits(String(cur.number).padStart(4, "0"))}` : "فاکتور جدید (شماره بعد از ذخیره داده می‌شود)") + (dirty ? " · ذخیره‌نشده" : "");
    const c = vCalc(cur); const ti = q("[data-title]"); if (ti) ti.textContent = cur.number ? `ویرایش فاکتور ${toFaDigits(String(cur.number).padStart(4, "0"))}` : "فاکتور جدید";
    const sb = q("[data-sub]"), py = q("[data-pay]"); if (sb) sb.textContent = `${vFa(c.sub)} ${settings.currency}`; if (py) py.textContent = `${vFa(c.pay)} ${settings.currency}`;
  }

  function paintRows() {
    const host = q("[data-rows]"); if (!host) return;
    host.innerHTML = cur.items.map((r, i) => `<div data-row="${i}" class="grid grid-cols-[1.5rem_minmax(0,1fr)_2.5rem] items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-2 @xl:grid-cols-[1.25rem_1.5rem_minmax(0,1fr)_4.5rem_8rem_2.5rem] @xl:border-0 @xl:bg-transparent @xl:p-0">
      <span class="hidden text-center text-xs text-muted @xl:block">${vFa(i + 1)}</span>
      <span data-drag title="جابجایی" class="cursor-grab select-none text-center text-lg leading-none text-muted">⋮⋮</span>
      <input data-r="desc" data-i2="${i}" value="${vh(r.desc)}" placeholder="شرح خدمات" class="${field}">
      <span class="flex items-center justify-end gap-1 @xl:order-last"><span class="hidden gap-1 [@media(pointer:coarse)]:inline-flex"><button data-mv="-1" data-i2="${i}" class="rounded-full border border-white/15 px-2 text-xs" aria-label="بالا">↑</button><button data-mv="1" data-i2="${i}" class="rounded-full border border-white/15 px-2 text-xs" aria-label="پایین">↓</button></span><button data-del="${i}" class="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 text-muted transition hover:border-red-400/50 hover:text-red-300" aria-label="حذف ردیف">✕</button></span>
      <div class="col-span-3 grid grid-cols-[4.5rem_minmax(0,1fr)] gap-2 @xl:contents">
        <input data-r="qty" data-i2="${i}" value="${vFa(r.qty)}" inputmode="numeric" aria-label="تعداد" class="${field} text-center">
        <input data-r="price" data-i2="${i}" value="${r.price ? vFa(r.price) : ""}" inputmode="numeric" placeholder="فی" aria-label="فی" class="${field}">
      </div></div>`).join("");
  }

  /* ---------- one-page fit (measured off-screen; there is no on-screen preview) ---------- */
  function paintPreview() {
    const host = q("[data-sheet]"); if (!host) return;
    const modes: VMode[] = [{ filler: true, compact: false, grow: false }, { filler: false, compact: false, grow: false }, { filler: false, compact: true, grow: false }, { filler: false, compact: true, grow: true }];
    for (const m of modes) {
      mode = m; host.innerHTML = vSheet(cur, settings, m);
      const s = host.firstElementChild as HTMLElement; if (m.grow || s.scrollHeight <= A4_H + 1) break;
    }
  }

  /* ---------- list ---------- */
  function paintList() {
    const names = new Map<string, number>(); list.forEach((i) => { const k = vNorm(i.customerName); names.set(k, (names.get(k) ?? 0) + 1); });
    const sel = q<HTMLSelectElement>("[data-i=names]"); if (sel) { sel.innerHTML = `<option value="">همه‌ی فاکتورها (${vFa(list.length)})</option>` + [...names.entries()].sort((a, b) => a[0].localeCompare(b[0], "fa")).map(([n, c]) => `<option value="${vh(n)}" ${n === nameFilter ? "selected" : ""}>${vh(n || "بدون نام")} (${vFa(c)})</option>`).join(""); if (nameFilter && !names.has(nameFilter)) nameFilter = ""; }
    const qs = toLatinDigits(vNorm(query)).toLowerCase();
    const shown = list.filter((i) => (!nameFilter || vNorm(i.customerName) === nameFilter) && (!qs || toLatinDigits(`${i.number} ${i.customerName} ${i.customerPhone} ${i.date}`).toLowerCase().includes(qs)));
    const unpaid = shown.filter((i) => !i.paid).reduce((n, i) => n + vCalc(i).pay, 0);
    const sm = q("[data-summary]"); if (sm) sm.textContent = `${vFa(shown.length)} فاکتور · پرداخت‌نشده: ${vFa(unpaid)} ${settings.currency}`;
    const host = q("[data-list]"); if (!host) return;
    host.innerHTML = shown.length ? shown.map((i) => `<div data-open="${i.id}" class="cursor-pointer rounded-xl border border-white/10 border-s-4 p-3 text-sm transition hover:brightness-125 ${i.paid ? "border-s-emerald-400 bg-emerald-400/10" : "border-s-red-400 bg-red-400/10"} ${cur.id === i.id ? "ring-2 ring-gold" : ""}">
        <div class="flex items-baseline justify-between gap-2"><b class="truncate">${vh(i.customerName) || "بدون نام"}</b><span class="shrink-0 text-xs text-muted">#${vFa(i.number ?? 0)}</span></div>
        <div class="mt-1 flex items-center justify-between gap-2 text-xs text-muted"><span>${vh(i.date)}</span><span>${vFa(vCalc(i).pay)}</span></div>
        <div class="mt-2 flex items-center justify-between gap-2"><label class="flex items-center gap-2 text-xs ${i.paid ? "text-emerald-300" : "text-red-300"}"><input type="checkbox" data-paid="${i.id}" ${i.paid ? "checked" : ""} class="h-4 w-4 accent-[#4cb582]"><span>${i.paid ? "پرداخت شده" : "پرداخت نشده"}</span></label>
          <span class="flex gap-1.5 text-[11px]"><button data-copy="${i.id}" class="rounded-full border border-white/20 px-2.5 py-0.5 text-muted hover:border-gold hover:text-gold">کپی</button><button data-rm="${i.id}" class="rounded-full border border-white/20 px-2.5 py-0.5 text-muted hover:border-red-400/60 hover:text-red-300">حذف</button></span></div></div>`).join("") : `<p class="rounded-xl border border-dashed border-white/15 p-4 text-center text-xs text-muted">${list.length ? "موردی پیدا نشد." : "هنوز فاکتوری ذخیره نشده است."}</p>`;
  }

  /* ---------- phone book ---------- */
  function pbMatches() { const t = vNorm(cur.customerName); return contacts.filter((c) => !t || vNorm(c.name).includes(t) || c.phone.includes(toLatinDigits(t))).slice(0, 30); }
  function paintPb(show: boolean) {
    const box = q("[data-pb]"); if (!box) return;
    const ms = pbMatches(); if (!show || !ms.length) { box.classList.add("hidden"); return; }
    if (pbIdx >= ms.length) pbIdx = ms.length - 1;
    box.innerHTML = ms.map((c, k) => `<div data-pick="${k}" class="flex cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm ${k === pbIdx ? "bg-gold/15" : "hover:bg-white/5"}"><span>${vh(c.name)} <span class="text-xs text-muted" dir="ltr">${vh(toFaDigits(c.phone))}</span></span><button data-pbx="${k}" class="rounded-full px-2 text-xs text-muted hover:text-red-300" aria-label="حذف مخاطب">✕</button></div>`).join("");
    box.classList.remove("hidden");
  }
  function pickContact(k: number) { const c = pbMatches()[k]; if (!c) return; cur.customerName = c.name; cur.customerPhone = c.phone; (q<HTMLInputElement>("[data-i=name]")!).value = c.name; (q<HTMLInputElement>("[data-i=phone]")!).value = c.phone; paintPb(false); touch(); }

  /* ---------- date picker ---------- */
  function paintDp() {
    const box = q("[data-dp]"); if (!box) return;
    if (!dp) { box.classList.add("hidden"); return; }
    const today = tehranToday(); const off = weekCol(dp.y, dp.m, 1); const len = jMonthLen(dp.y, dp.m); const sel = toLatinDigits(cur.date).split("/").map(Number);
    const cells = Array.from({ length: off }, () => `<i></i>`).concat(Array.from({ length: len }, (_, k) => { const d = k + 1; const on = sel[0] === dp!.y && sel[1] === dp!.m && sel[2] === d; const tdy = today.jy === dp!.y && today.jm === dp!.m && today.jd === d; return `<button data-day="${d}" class="h-8 rounded-lg text-xs ${on ? "bg-gold font-black text-midnight" : tdy ? "border border-gold/60" : "hover:bg-white/10"}">${vFa(d)}</button>`; }));
    box.innerHTML = `<div class="mb-2 flex items-center justify-between"><button data-dpn="-1" class="rounded-full border border-white/15 px-2" aria-label="ماه قبل">›</button><b class="text-sm">${MONTHS[dp.m - 1]} ${toFaDigits(String(dp.y))}</b><button data-dpn="1" class="rounded-full border border-white/15 px-2" aria-label="ماه بعد">‹</button></div><div class="grid grid-cols-7 gap-1 text-center text-[10px] text-muted">${WEEKDAYS.map((w) => `<span>${w.slice(0, 1)}</span>`).join("")}</div><div class="mt-1 grid grid-cols-7 gap-1">${cells.join("")}</div><button data-dpt class="mt-2 w-full rounded-lg border border-white/15 py-1 text-xs text-gold">امروز</button>`;
    box.classList.remove("hidden");
  }

  /* ---------- actions ---------- */
  async function refresh() { list = await store.list(); paintList(); }
  function load(i: VInv, isDirty = false) { cur = JSON.parse(JSON.stringify(i)) as VInv; dirty = isDirty; saveDraft(); fillForm(); paintList(); }
  async function save() {
    if (!cur.customerName.trim()) return toast("نام مشتری را وارد کنید.");
    const items = cur.items.filter((r) => r.desc.trim() || r.price);
    if (!items.length) return toast("حداقل یک ردیف با شرح یا مبلغ لازم است.");
    try {
      const saved = await store.save({ ...cur, customerName: vNorm(cur.customerName), items });
      const k = vNorm(saved.customerName); const ph = saved.customerPhone.trim();
      const ex = contacts.find((c) => vNorm(c.name) === k);
      if (ex) { if (ph) ex.phone = ph; } else contacts.push({ name: k, phone: ph });
      await store.putContacts(contacts);
      cur = saved; dirty = false; saveDraft(); await refresh(); fillForm(); toast("فاکتور ذخیره شد.");
    } catch { toast("ذخیره نشد؛ دوباره تلاش کنید. تغییرات شما نگه داشته شده است."); }
  }
  async function togglePaid(id: string, v: boolean) { const rec = list.find((x) => x.id === id); if (!rec) return; try { await store.save({ ...rec, paid: v }); if (cur.id === id) cur.paid = v; await refresh(); } catch { toast("تغییر وضعیت ذخیره نشد."); } }
  /* PDF: the browser's print dialog when it is available; otherwise (blocked or sandboxed) a real .pdf file is built and downloaded. */
  let printed = false;
  function printPdf() {
    paintPreview();
    const root = document.getElementById("inv-print-root") ?? Object.assign(document.createElement("div"), { id: "inv-print-root" });
    if (!root.parentElement) document.body.appendChild(root);
    root.innerHTML = vSheet(cur, settings, mode);
    const prev = document.title; document.title = `فاکتور-${cur.number ? String(cur.number).padStart(4, "0") : "جدید"}-${vNorm(cur.customerName).replace(/\s+/g, "-") || "مشتری"}`;
    document.body.classList.add("inv-printing");
    printed = false;
    const done = () => { document.body.classList.remove("inv-printing"); document.title = prev; root.innerHTML = ""; window.removeEventListener("afterprint", done); };
    window.addEventListener("afterprint", done);
    setTimeout(() => {
      try { window.print(); } catch { /* handled below */ }
      setTimeout(() => { if (!printed) { done(); void downloadPdf(); } }, 700);
    }, 50);
  }
  const u8 = (s: string) => new TextEncoder().encode(s);
  function buildPdf(pages: Uint8Array[], pw: number, ph: number): Blob {
    const parts: Uint8Array[] = []; const offs: number[] = []; let len = 0;
    const push = (b: Uint8Array | string) => { const x = typeof b === "string" ? u8(b) : b; parts.push(x); len += x.length; };
    const obj = (n: number, body: Uint8Array | string, pre = "", post = "") => { offs[n] = len; push(`${n} 0 obj\n${pre}`); push(body); push(`${post}\nendobj\n`); };
    const W = 595.28, H = 841.89, n = pages.length;
    push("%PDF-1.4\n");
    obj(1, "<< /Type /Catalog /Pages 2 0 R >>");
    obj(2, `<< /Type /Pages /Kids [${pages.map((_, k) => `${3 + k * 3} 0 R`).join(" ")}] /Count ${n} >>`);
    pages.forEach((jpg, k) => {
      const pg = 3 + k * 3, ct = pg + 1, im = pg + 2; const cs = `q ${W} 0 0 ${H} 0 0 cm /Im0 Do Q`;
      obj(pg, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${H}] /Resources << /XObject << /Im0 ${im} 0 R >> >> /Contents ${ct} 0 R >>`);
      obj(ct, `<< /Length ${cs.length} >>\nstream\n${cs}\nendstream`);
      obj(im, jpg, `<< /Type /XObject /Subtype /Image /Width ${pw} /Height ${ph} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpg.length} >>\nstream\n`, "\nendstream");
    });
    const total = 3 + n * 3; const xref = len;
    let x = `xref\n0 ${total}\n0000000000 65535 f \n`; for (let k = 1; k < total; k++) x += `${String(offs[k]).padStart(10, "0")} 00000 n \n`;
    push(`${x}trailer\n<< /Size ${total} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`);
    return new Blob(parts as BlobPart[], { type: "application/pdf" });
  }
  async function downloadPdf() {
    try {
      paintPreview();
      const host = q("[data-sheet]")!; const sheetEl = host.firstElementChild as HTMLElement;
      const height = Math.max(A4_H, Math.ceil(sheetEl.scrollHeight));
      let css = ""; for (const ss of Array.from(document.styleSheets)) { try { for (const r of Array.from(ss.cssRules)) if (r.cssText.includes(".inv-")) css += r.cssText; } catch { /* cross-origin sheet */ } }
      css = css.replace(/var\(--font-vazir\)|var\(--font-sora\)/g, "Vazirmatn, Tahoma");
      let logo = ""; try { const r = await fetch("/invoice/logo.png"); if (r.ok) { const b = await r.blob(); logo = await new Promise<string>((ok, no) => { const fr = new FileReader(); fr.onload = () => ok(String(fr.result)); fr.onerror = no; fr.readAsDataURL(b); }); } } catch { /* monogram instead */ }
      let html = vSheet(cur, settings, mode).replace(/<img [^>]*>/, logo ? `<img src="${logo}" alt=""/>` : "").replace(/<div class="inv-mono" style="display:none">/, logo ? `<div class="inv-mono" style="display:none">` : `<div class="inv-mono" style="display:flex">`).replace(/&nbsp;/g, "&#160;");
      if (height > A4_H) html = html.replace('class="inv-sheet', `style="height:${height}px" class="inv-sheet`);
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${A4_W}" height="${height}"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml"><style>${css}</style>${html}</div></foreignObject></svg>`;
      const img = new Image(); await new Promise<void>((ok, no) => { img.onload = () => ok(); img.onerror = () => no(new Error("render")); img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg); });
      const S = 2; const cv = document.createElement("canvas"); cv.width = A4_W * S; cv.height = height * S;
      const cx = cv.getContext("2d")!; cx.fillStyle = "#fff"; cx.fillRect(0, 0, cv.width, cv.height); cx.drawImage(img, 0, 0, cv.width, cv.height);
      const pages: Uint8Array[] = []; const n = Math.ceil(height / A4_H);
      for (let k = 0; k < n; k++) {
        const pc = document.createElement("canvas"); pc.width = A4_W * S; pc.height = A4_H * S; const pcx = pc.getContext("2d")!; pcx.fillStyle = "#fff"; pcx.fillRect(0, 0, pc.width, pc.height);
        pcx.drawImage(cv, 0, k * A4_H * S, A4_W * S, A4_H * S, 0, 0, A4_W * S, A4_H * S);
        const b64 = pc.toDataURL("image/jpeg", 0.92).split(",")[1]; const bin = atob(b64); const arr = new Uint8Array(bin.length); for (let j = 0; j < bin.length; j++) arr[j] = bin.charCodeAt(j); pages.push(arr);
      }
      const blob = buildPdf(pages, A4_W * S, A4_H * S);
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
      a.download = `invoice-${cur.number ? String(cur.number).padStart(4, "0") : "new"}.pdf`;
      document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
      toast("فایل PDF ساخته شد.");
    } catch { toast("ساخت PDF ممکن نشد؛ دوباره تلاش کنید."); }
  }
  function openSettings() {
    const d = q<HTMLDialogElement>("[data-set]"); if (!d) return;
    const f = (k: keyof VSettings, lab: string, ltr = false) => `<label class="block text-xs text-muted">${lab}<input name="${k}" ${ltr ? 'dir="ltr"' : ""} value="${vh(settings[k])}" class="${field} mt-1"></label>`;
    d.innerHTML = `<form method="dialog" class="grid gap-3"><h2 class="text-lg font-black">تنظیمات فاکتور</h2>${f("providerLabel", "عنوان ارائه‌دهنده")}${f("designerName", "نام")}${f("designerPhone", "تلفن", true)}${f("cardNumber", "شماره کارت", true)}${f("bank", "بانک")}${f("accountName", "نام صاحب حساب")}${f("sheba", "شماره شبا", true)}${f("currency", "واحد پول")}<label class="block text-xs text-muted">جمله‌ی ثابت یادداشت<textarea name="noteFooter" rows="2" class="${field} mt-1">${vh(settings.noteFooter)}</textarea></label><div class="flex gap-2"><button value="ok" data-sok class="${btnGold}">ذخیره</button><button value="cancel" class="${btn}">بستن</button></div></form>`;
    d.showModal();
  }

  /* ---------- events ---------- */
  function onClick(e: Event) {
    const t = e.target as HTMLElement;
    const g = (a: string) => t.closest<HTMLElement>(`[${a}]`);
    const pbx = g("data-pbx"); if (pbx) { e.stopPropagation(); const c = pbMatches()[Number(pbx.dataset.pbx)]; if (c) { contacts = contacts.filter((x) => x !== c); void store.putContacts(contacts); paintPb(true); } return; }
    const pick = g("data-pick"); if (pick) return pickContact(Number(pick.dataset.pick));
    const dpn = g("data-dpn"); if (dpn && dp) { let m = dp.m + Number(dpn.dataset.dpn), y = dp.y; if (m > 12) { m = 1; y++; } if (m < 1) { m = 12; y--; } dp = { y, m }; return paintDp(); }
    const day = g("data-day"); if (day && dp) { cur.date = toFaDigits(`${dp.y}/${pad2(dp.m)}/${pad2(Number(day.dataset.day))}`); (q<HTMLInputElement>("[data-i=date]")!).value = cur.date; dp = null; paintDp(); return touch(); }
    if (g("data-dpt")) { const n = tehranToday(); cur.date = toFaDigits(`${n.jy}/${pad2(n.jm)}/${pad2(n.jd)}`); (q<HTMLInputElement>("[data-i=date]")!).value = cur.date; dp = null; paintDp(); return touch(); }
    if (!t.closest("[data-pb],[data-i=name]")) paintPb(false);
    if (!t.closest("[data-dp],[data-i=date]") && dp) { dp = null; paintDp(); }
    const paid = g("data-paid"); if (paid) { e.stopPropagation(); return void togglePaid(paid.dataset.paid!, (paid as HTMLInputElement).checked); }
    const cp = g("data-copy"); if (cp) { e.stopPropagation(); const src = list.find((x) => x.id === cp.dataset.copy); if (src && confirmDiscard()) { const c = JSON.parse(JSON.stringify(src)) as VInv; delete c.id; delete c.number; delete c.createdAt; delete c.updatedAt; c.paid = false; c.date = vToday(); load(c, true); toast("کپی ساخته شد؛ با ذخیره شماره‌ی تازه می‌گیرد."); } return; }
    const rm = g("data-rm"); if (rm) { e.stopPropagation(); const id = rm.dataset.rm!; if (confirm("این فاکتور حذف شود؟ (حذف نرم است و داده نابود نمی‌شود)")) { void store.remove(id).then(async () => { if (cur.id === id) { cur = vBlank(); dirty = false; saveDraft(); fillForm(); } await refresh(); toast("حذف شد."); }); } return; }
    const op = g("data-open"); if (op) { const rec = list.find((x) => x.id === op.dataset.open); if (rec && rec.id !== cur.id && confirmDiscard()) load(rec); return; }
    const act = g("data-i")?.dataset.i;
    if (act === "new") { if (confirmDiscard()) load(vBlank()); }
    else if (act === "settings") openSettings();
    else if (act === "addrow") { cur.items.push({ desc: "", qty: 1, price: 0 }); paintRows(); touch(); q<HTMLInputElement>(`[data-r=desc][data-i2="${cur.items.length - 1}"]`)?.focus(); }
    else if (act === "save") void save();
    else if (act === "pdf") printPdf();
    const del = g("data-del"); if (del) { const i = Number(del.dataset.del); cur.items.splice(i, 1); if (!cur.items.length) cur.items.push({ desc: "", qty: 1, price: 0 }); paintRows(); return touch(); }
    const mv = g("data-mv"); if (mv) { const i = Number(mv.dataset.i2), j = i + Number(mv.dataset.mv); if (j >= 0 && j < cur.items.length) { [cur.items[i], cur.items[j]] = [cur.items[j], cur.items[i]]; paintRows(); touch(); } }
    if (g("data-sok")) { e.preventDefault(); const d = q<HTMLDialogElement>("[data-set]"); const fd = new FormData(d!.querySelector("form")!); const next = { ...settings }; (Object.keys(V_DEFAULTS) as (keyof VSettings)[]).forEach((k) => { next[k] = String(fd.get(k) ?? next[k]); }); settings = next; void store.putSettings(settings); d!.close(); paintPreview(); paintStatus(); paintList(); toast("تنظیمات ذخیره شد."); }
  }

  function onInput(e: Event) {
    const t = e.target as HTMLInputElement;
    if (t.dataset.r) {
      const i = Number(t.dataset.i2); const r = cur.items[i]; if (!r) return;
      if (t.dataset.r === "desc") r.desc = t.value;
      else { const n = vNum(t.value); if (t.dataset.r === "qty") r.qty = n; else r.price = n; t.value = n ? vFa(n) : ""; }
      return touch();
    }
    switch (t.dataset.i) {
      case "name": cur.customerName = t.value; pbIdx = -1; paintPb(true); return touch();
      case "phone": cur.customerPhone = t.value; return touch();
      case "date": cur.date = t.value; return touch();
      case "disc": { const n = vNum(t.value); cur.discount = cur.discountType === "percent" ? Math.min(100, n) : n; t.value = cur.discount ? vFa(cur.discount) : ""; return touch(); }
      case "note": cur.note = t.value; return touch();
      case "search": query = t.value; return paintList();
    }
  }
  function onChange(e: Event) {
    const t = e.target as HTMLSelectElement;
    if (t.dataset.i === "dtype") { cur.discountType = t.value as VInv["discountType"]; if (cur.discountType === "percent") cur.discount = Math.min(100, cur.discount); (q<HTMLInputElement>("[data-i=disc]")!).value = cur.discount ? vFa(cur.discount) : ""; touch(); }
    else if (t.dataset.i === "names") { nameFilter = t.value; paintList(); }
  }
  function onFocusIn(e: Event) {
    const t = e.target as HTMLInputElement;
    if (t.dataset.i === "name") { pbIdx = -1; paintPb(true); }
    if (t.dataset.i === "date") { const p = toLatinDigits(cur.date).split("/").map(Number); const n = tehranToday(); dp = { y: p[0] || n.jy, m: p[1] || n.jm }; paintDp(); }
  }
  function onKey(e: KeyboardEvent) {
    const t = e.target as HTMLInputElement;
    if (t.dataset?.i === "name") {
      const ms = pbMatches();
      if (e.key === "ArrowDown") { e.preventDefault(); pbIdx = Math.min(ms.length - 1, pbIdx + 1); paintPb(true); }
      else if (e.key === "ArrowUp") { e.preventDefault(); pbIdx = Math.max(0, pbIdx - 1); paintPb(true); }
      else if (e.key === "Enter" && pbIdx >= 0) { e.preventDefault(); pickContact(pbIdx); }
      else if (e.key === "Escape") paintPb(false);
    }
    if (e.key === "Enter" && t.dataset?.r && !e.isComposing) { // Enter jumps to the next row, or makes a new one
      e.preventDefault(); const i = Number(t.dataset.i2);
      if (i === cur.items.length - 1) { cur.items.push({ desc: "", qty: 1, price: 0 }); paintRows(); touch(); }
      q<HTMLInputElement>(`[data-r=${t.dataset.r}][data-i2="${i + 1}"]`)?.focus();
    }
  }
  function onDocKey(e: KeyboardEvent) {
    if (!alive || !el.isConnected || !(e.ctrlKey || e.metaKey)) return;
    if (e.key.toLowerCase() === "s") { e.preventDefault(); void save(); }
    else if (e.key.toLowerCase() === "p") { e.preventDefault(); printPdf(); }
  }
  /* drag and drop: only the ⋮⋮ handle starts a drag */
  function onDown(e: Event) { const h = (e.target as HTMLElement).closest("[data-drag]"); const row = h?.closest<HTMLElement>("[data-row]"); if (row) row.draggable = true; }
  function onDragStart(e: DragEvent) { const row = (e.target as HTMLElement).closest<HTMLElement>("[data-row]"); if (!row) return; dragFrom = Number(row.dataset.row); e.dataTransfer?.setData("text/plain", String(dragFrom)); row.classList.add("opacity-50"); }
  function onDragOver(e: DragEvent) { if (dragFrom >= 0) e.preventDefault(); }
  function onDrop(e: DragEvent) { const row = (e.target as HTMLElement).closest<HTMLElement>("[data-row]"); if (!row || dragFrom < 0) return; e.preventDefault(); const to = Number(row.dataset.row); const [m] = cur.items.splice(dragFrom, 1); cur.items.splice(to, 0, m); dragFrom = -1; paintRows(); touch(); }
  function onDragEnd() { dragFrom = -1; el.querySelectorAll<HTMLElement>("[data-row]").forEach((r) => { r.draggable = false; r.classList.remove("opacity-50"); }); }

  (async () => {
    shell();
    try {
      settings = { ...V_DEFAULTS, ...(await store.getSettings()) };
      list = await store.list();
      const c = await store.getContacts();
      if (c === null) { const seen = new Map<string, VContact>(); list.forEach((i) => { const k = vNorm(i.customerName); if (k && !seen.has(k)) seen.set(k, { name: k, phone: i.customerPhone }); }); contacts = [...seen.values()]; await store.putContacts(contacts); } else contacts = c;
    } catch { toast("خواندن اطلاعات ممکن نشد."); }
    if (!alive) return;
    let draft: VInv | null = null; try { const d = localStorage.getItem("sh-inv-draft"); draft = d ? (JSON.parse(d) as VInv) : null; } catch { /* ignore */ }
    if (draft) { cur = draft; dirty = true; toast("پیش‌نویس ذخیره‌نشده‌ی قبلی بازیابی شد."); }
    fillForm(); paintList();
    if (document.fonts?.ready) void document.fonts.ready.then(() => alive && paintPreview());
  })();

  el.addEventListener("click", onClick); el.addEventListener("input", onInput); el.addEventListener("change", onChange);
  el.addEventListener("focusin", onFocusIn); el.addEventListener("keydown", onKey); el.addEventListener("mousedown", onDown);
  el.addEventListener("dragstart", onDragStart); el.addEventListener("dragover", onDragOver); el.addEventListener("drop", onDrop); el.addEventListener("dragend", onDragEnd);
  document.addEventListener("keydown", onDocKey);
  const before = () => { printed = true; paintPreview(); };
  window.addEventListener("beforeprint", before);
  return () => {
    alive = false;
    el.removeEventListener("click", onClick); el.removeEventListener("input", onInput); el.removeEventListener("change", onChange);
    el.removeEventListener("focusin", onFocusIn); el.removeEventListener("keydown", onKey); el.removeEventListener("mousedown", onDown);
    el.removeEventListener("dragstart", onDragStart); el.removeEventListener("dragover", onDragOver); el.removeEventListener("drop", onDrop); el.removeEventListener("dragend", onDragEnd);
    document.removeEventListener("keydown", onDocKey); window.removeEventListener("beforeprint", before);
    el.innerHTML = "";
  };
}
void vIcon; void V_NAVY; void V_GREEN;
