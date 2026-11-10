/**
 * Demo panels (client and CEO) rendered from plain strings, so the very same file runs inside the Next.js page
 * and inside the static preview. DEMO ONLY: the data below is sample data kept in sessionStorage; nothing is sent
 * anywhere, nothing here is a security boundary. Real build: see docs/shabahang-panels-spec.md (server-side access
 * control, PostgreSQL, S3 files, e-mail, TOTP, append-only audit log).
 * Naming follows common Persian panels (پیشخوان، امور مالی، تیکت…). No SMS anywhere.
 */
import type { Role, Session } from "./demo";

export type ServiceOpt = { id: string; name: string; line: string };
type Opts = { session: Session; services: ServiceOpt[]; onLogout: () => void };

type Stage = { n: string; done: boolean };
type Report = { d: string; t: string; vis: boolean };
type Delivery = { id: string; title: string; st: "await" | "ok" | "edit"; note?: string };
type Project = {
  id: string; title: string; service: string; owner: string; left: number; total: number;
  stages: Stage[]; reports: Report[]; calendar: boolean; days: Record<number, string>;
  deliveries: Delivery[]; rating: null | { stars: number; text: string };
};
type Unit = { id: string; inv: string; label: string; amount: number; due: string; st: "unpaid" | "pending" | "paid" | "rejected"; file?: string; reason?: string };
type Msg = { from: "client" | "ceo" | "staff"; t: string; at: string; file?: string };
type Thread = { id: string; with: "ceo" | "staff"; msgs: Msg[]; unread: { client: number; ceo: number } };
type User = { id: string; name: string; email: string; role: Role; st: "pending" | "active" | "disabled"; emailOk: boolean };
type Note = { id: string; t: string; d: string; read: boolean };
type Audit = { at: string; who: string; act: string; target: string };
type Data = {
  projects: Project[]; units: Unit[]; threads: Thread[]; users: User[];
  notes: { client: Note[]; ceo: Note[] }; audit: Audit[]; drafts: Record<string, string>;
};

const DATA_KEY = "sh-demo-data";
const TOUR_KEY = "sh-demo-tour";
const MAX_FILE = 3 * 1024 * 1024;

const nf = new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 2 });
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);
const nowStr = () => new Date().toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" });

function seed(): Data {
  const days: Record<number, string> = { 3: "ریلز ۱", 7: "پست ثابت", 10: "ریلز ۲", 14: "کروسل", 17: "ریلز ۳", 21: "استوری موشن", 24: "ریلز ۴", 28: "پست ثابت" };
  return {
    projects: [
      {
        id: "p1", title: "پکیج نقره‌ای اینستاگرام (۳ ماهه)", service: "شبکه‌های اجتماعی و محتوا", owner: "مجری نمونه", left: 48, total: 90,
        stages: [{ n: "سناریو", done: true }, { n: "فیلمبرداری", done: true }, { n: "تدوین", done: false }, { n: "تأیید مشتری", done: false }, { n: "انتشار", done: false }],
        reports: [
          { d: "۱۸ آبان", t: "سناریوی ریلز ۱ و ۲ نهایی شد. [متن گزارش واقعی]", vis: true },
          { d: "۱۹ آبان", t: "یادداشت داخلی برای تیم. [فقط داخلی]", vis: false },
        ],
        calendar: true, days,
        deliveries: [{ id: "d1", title: "ریلز شماره‌ی ۱", st: "await" }],
        rating: null,
      },
      {
        id: "p2", title: "طراحی لوگو و هویت بصری", service: "برندینگ و هویت بصری", owner: "مجری نمونه", left: 0, total: 0,
        stages: [{ n: "مشاوره", done: true }, { n: "طرح اولیه", done: true }, { n: "بازبینی", done: true }, { n: "تحویل نهایی", done: true }],
        reports: [{ d: "۲ آبان", t: "فایل‌های نهایی آماده‌ی تحویل است. [متن گزارش واقعی]", vis: true }],
        calendar: false, days: {},
        deliveries: [{ id: "d2", title: "فایل‌های نهایی لوگو", st: "await" }],
        rating: null,
      },
    ],
    units: [
      { id: "u1", inv: "فاکتور پکیج نقره‌ای (۳ ماهه)", label: "پیش‌پرداخت", amount: 28.2, due: "۱ آبان", st: "paid" },
      { id: "u2", inv: "فاکتور پکیج نقره‌ای (۳ ماهه)", label: "قسط دوم", amount: 28.2, due: "۱ آذر", st: "unpaid" },
      { id: "u3", inv: "فاکتور طراحی لوگو", label: "تسویه‌ی کامل", amount: 12, due: "۱۵ آبان", st: "rejected", reason: "تصویر رسید ناخوانا است؛ لطفاً دوباره بفرستید.", file: "receipt-1.jpg" },
    ],
    threads: [
      { id: "t1", with: "ceo", unread: { client: 0, ceo: 0 }, msgs: [{ from: "ceo", t: "سلام، به پنل خوش آمدید.", at: "۱۰:۱۵" }] },
      { id: "t2", with: "staff", unread: { client: 1, ceo: 0 }, msgs: [{ from: "staff", t: "ریلز شماره‌ی ۱ برای تأیید آماده است.", at: "۱۱:۳۰" }] },
    ],
    users: [
      { id: "2222", name: "مشتری نمونه", email: "[ایمیل]", role: "client", st: "active", emailOk: true },
      { id: "ali.rezaei", name: "علی رضایی (نمونه)", email: "[ایمیل]", role: "client", st: "pending", emailOk: true },
      { id: "sara.m", name: "سارا م. (نمونه)", email: "[ایمیل]", role: "client", st: "pending", emailOk: true },
    ],
    notes: {
      client: [
        { id: "n1", t: "رسید شما رد شد: تصویر ناخوانا است.", d: "امروز", read: false },
        { id: "n2", t: "ریلز شماره‌ی ۱ برای تأیید شما آماده است.", d: "امروز", read: false },
        { id: "n3", t: "حساب شما فعال شد.", d: "دیروز", read: true },
      ],
      ceo: [
        { id: "c1", t: "دو ثبت‌نام جدید منتظر تأیید شماست.", d: "امروز", read: false },
      ],
    },
    audit: [{ at: "—", who: "سیستم", act: "ایجاد داده‌ی نمایشی", target: "—" }],
    drafts: {},
  };
}

const CLIENT_NAV: [string, string][] = [["dash", "پیشخوان"], ["projects", "پروژه‌ها"], ["messages", "پیام‌ها"], ["files", "فایل‌ها"], ["finance", "امور مالی"], ["order", "سفارش جدید"], ["notes", "اعلان‌ها"], ["account", "حساب کاربری"]];
const CEO_NAV: [string, string][] = [["dash", "پیشخوان"], ["users", "کاربران و حساب‌ها"], ["receipts", "رسیدها و فاکتورها"], ["projects", "پروژه‌ها"], ["messages", "پیام‌ها"], ["notes", "اعلان‌ها"], ["audit", "لاگ ممیزی"], ["money", "امور مالی"], ["account", "حساب کاربری"]];
const ROLE_FA: Record<Role, string> = { client: "مشتری", staff: "مجری", admin: "ادمین", ceo: "مدیرعامل" };
const UNIT_FA = { unpaid: "پرداخت‌نشده", pending: "در انتظار تأیید", paid: "پرداخت‌شده", rejected: "ردشده" };
const UNIT_CLS = { unpaid: "border-amber/50 text-amber", pending: "border-violet/60 text-[#b8aeff]", paid: "border-emerald-400/60 text-emerald-400", rejected: "border-red-400/60 text-red-300" };
const TOUR = [
  ["پیشخوان", "هر چیزی که منتظر اقدام شماست در یک نگاه: تأیید تحویل، فاکتور و پیام. روی هر کارت بزنید تا جزئیاتش را ببینید."],
  ["پروژه‌ها و مراحل", "برای هر پروژه نوار پیشرفت مرحله‌ای، گزارش‌های مجری و تحویل‌ها را می‌بینید. تحویل را همین‌جا تأیید کنید یا ویرایش بخواهید."],
  ["پیام‌ها", "با مدیرعامل یا مجری خودتان گفت‌وگو کنید. پیوست تا ۳ مگابایت و پیام صوتی تا ۲ دقیقه."],
  ["امور مالی", "فاکتورها و اقساط را ببینید، کارت‌به‌کارت کنید و عکس رسید را همین‌جا بفرستید. وضعیت رسید لحظه‌ای عوض می‌شود."],
  ["سفارش جدید", "پکیج یا خدمت تازه سفارش دهید یا پکیج فعالتان را تمدید کنید."],
];

const card = "rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm";
const btn = "rounded-full border border-gold/50 px-4 py-2 text-xs font-bold text-gold transition hover:bg-gold hover:text-midnight";
const btnGold = "rounded-full bg-gold px-5 py-2.5 text-xs font-bold text-midnight";
const input = "w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2.5 text-sm text-text placeholder:text-muted focus:border-gold";
const chip = (st: Unit["st"]) => `<span class="shrink-0 rounded-full border px-3 py-1 text-[11px] font-bold ${UNIT_CLS[st]}">${UNIT_FA[st]}</span>`;
const bar = (pct: number) => `<div class="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10"><div class="h-full rounded-full bg-gradient-to-l from-gold to-amber" style="width:${Math.round(pct)}%"></div></div>`;
const empty = (t: string) => `<p class="rounded-xl border border-dashed border-white/15 p-5 text-center text-sm text-muted">${t}</p>`;
const head = (t: string, sub = "") => `<div class="mb-5"><h1 class="text-2xl font-black md:text-3xl">${t}</h1>${sub ? `<p class="mt-1 text-sm text-muted">${sub}</p>` : ""}</div>`;

export function mountPanel(root: HTMLElement, o: Opts): () => void {
  const role = o.session.role;
  const isCeo = role === "ceo" || role === "admin";
  const nav = isCeo ? CEO_NAV.filter(([k]) => role === "ceo" || k !== "money") : CLIENT_NAV;
  let D: Data;
  try { const raw = sessionStorage.getItem(DATA_KEY); D = raw ? (JSON.parse(raw) as Data) : seed(); } catch { D = seed(); }
  const S = { view: "dash", pid: "", tid: "t1", day: 0, editFor: "", rejectFor: "", star: 0, tour: -1, calcOpen: false };
  const save = () => { try { sessionStorage.setItem(DATA_KEY, JSON.stringify(D)); } catch { /* demo keeps working without saving */ } };
  const audit = (act: string, target: string) => { D.audit.unshift({ at: nowStr(), who: o.session.name, act, target }); };
  const notify = (to: "client" | "ceo", t: string) => { D.notes[to].unshift({ id: "n" + Date.now() + Math.random().toString(36).slice(2, 5), t, d: "هم‌اکنون", read: false }); };
  if (role === "client") { try { if (!localStorage.getItem(TOUR_KEY)) S.tour = -2; } catch { /* no tour memory */ } }

  const me: Msg["from"] = isCeo ? "ceo" : "client";
  const myNotes = () => (isCeo ? D.notes.ceo : D.notes.client);
  const myThreads = () => (isCeo ? D.threads.filter((t) => t.with === "ceo") : D.threads);
  const unreadMsgs = () => myThreads().reduce((n, t) => n + (isCeo ? t.unread.ceo : t.unread.client), 0);
  const unreadNotes = () => myNotes().filter((n) => !n.read).length;

  function toast(t: string) {
    const el = document.createElement("div");
    el.className = "fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 rounded-full border border-gold/40 bg-[#0b0e27] px-5 py-3 text-sm text-text shadow-lg";
    el.textContent = t;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2800);
  }

  /* ---------- views ---------- */
  function actionItems() {
    const out: { t: string; v: string; id?: string }[] = [];
    D.projects.forEach((p) => p.deliveries.filter((d) => d.st === "await").forEach((d) => out.push({ t: `تأیید تحویل: ${d.title}`, v: "projects", id: p.id })));
    D.units.filter((u) => u.st === "unpaid" || u.st === "rejected").forEach((u) => out.push({ t: `${u.st === "rejected" ? "رسید ردشده" : "پرداخت"}: ${u.label} (${nf.format(u.amount)} میلیون تومان)`, v: "finance" }));
    const um = unreadMsgs();
    if (um) out.push({ t: `${nf.format(um)} پیام بی‌پاسخ`, v: "messages" });
    return out;
  }

  function dashClient() {
    const acts = actionItems();
    const active = D.projects.filter((p) => p.total > 0);
    const run = D.projects.filter((p) => p.stages.some((s) => !s.done) || p.deliveries.some((d) => d.st !== "ok"));
    return head(`سلام، ${esc(o.session.name)}`, "خلاصه‌ی وضعیت شما. با کلیک روی هر کارت جزئیاتش را ببینید.") + `
    <div class="grid gap-4 md:grid-cols-2">
      <div class="${card} md:col-span-2"><h2 class="font-black">در انتظار اقدام شما</h2>
        <div class="mt-3 grid gap-2">${acts.length ? acts.map((a) => `<button data-act="go" data-v="${a.v}" data-id="${a.id || ""}" class="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-start text-sm transition hover:border-gold/50"><span>${esc(a.t)}</span><span class="text-gold">‹</span></button>`).join("") : empty("همه‌چیز مرتب است.")}</div></div>
      <div class="${card}"><h2 class="font-black">پکیج‌های فعال</h2>
        ${active.length ? active.map((p) => `<div class="mt-4"><div class="flex items-center justify-between text-sm"><span>${esc(p.title)}</span><span class="text-xs text-muted">${nf.format(p.left)} روز مانده</span></div>${bar(((p.total - p.left) / p.total) * 100)}<button data-act="go" data-v="order" class="${btn} mt-3">تمدید</button></div>`).join("") : empty("پکیج فعالی ندارید.")}</div>
      <div class="${card}"><h2 class="font-black">پروژه‌های در حال انجام</h2>
        ${run.length ? run.map((p) => { const d = p.stages.filter((s) => s.done).length; return `<button data-act="open" data-id="${p.id}" class="mt-4 block w-full text-start"><div class="flex justify-between text-sm"><span>${esc(p.title)}</span><span class="text-xs text-muted">${nf.format(d)} از ${nf.format(p.stages.length)} مرحله</span></div>${bar((d / p.stages.length) * 100)}</button>`; }).join("") : empty("پروژه‌ی فعالی نیست.")}</div>
      <button data-act="go" data-v="notes" class="${card} text-start transition hover:border-gold/50"><h2 class="font-black">اعلان‌ها</h2><p class="mt-3 text-sm text-muted">${unreadNotes() ? nf.format(unreadNotes()) + " اعلان خوانده‌نشده" : "اعلان تازه‌ای نیست"}</p></button>
      <button data-act="go" data-v="messages" class="${card} text-start transition hover:border-gold/50"><h2 class="font-black">پیام‌ها</h2><p class="mt-3 text-sm text-muted">${unreadMsgs() ? nf.format(unreadMsgs()) + " پیام خوانده‌نشده" : "پیام تازه‌ای نیست"}</p></button>
    </div>`;
  }

  function dashCeo() {
    const pend = D.users.filter((u) => u.st === "pending").length;
    const rc = D.units.filter((u) => u.st === "pending").length;
    const aw = D.projects.reduce((n, p) => n + p.deliveries.filter((d) => d.st === "await").length, 0);
    const tile = (v: string, big: number, t: string) => `<button data-act="go" data-v="${v}" class="${card} text-start transition hover:border-gold/50"><p class="text-4xl font-black text-gold-light">${nf.format(big)}</p><p class="mt-2 text-sm text-muted">${t}</p></button>`;
    return head("پیشخوان مدیرعامل", "چیزهایی که به تصمیم شما نیاز دارند.") + `<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      ${tile("users", pend, "حساب منتظر تأیید")}${tile("receipts", rc, "رسید منتظر بررسی")}${tile("projects", aw, "تحویل منتظر تأیید مشتری")}${tile("messages", unreadMsgs(), "پیام خوانده‌نشده")}</div>
      <div class="${card} mt-4"><h2 class="font-black">آخرین رویدادها</h2><div class="mt-3 grid gap-2 text-sm">${D.audit.slice(0, 5).map((a) => `<p class="flex justify-between gap-3 rounded-xl bg-white/[0.03] px-4 py-2"><span>${esc(a.act)} ${a.target !== "—" ? "· " + esc(a.target) : ""}</span><span class="text-xs text-muted">${esc(a.at)}</span></p>`).join("")}</div></div>`;
  }

  function stepper(p: Project) {
    return `<ol class="mt-4 grid gap-2 sm:grid-cols-${Math.min(p.stages.length, 5)}">${p.stages.map((s, i) => {
      const cur = !s.done && p.stages.slice(0, i).every((x) => x.done);
      const dot = s.done ? "bg-emerald-400 text-midnight" : cur ? "bg-gold text-midnight" : "bg-white/10 text-muted";
      const inner = `<span class="flex h-7 w-7 items-center justify-center rounded-full text-xs font-black ${dot}">${s.done ? "✓" : nf.format(i + 1)}</span><span class="text-sm ${cur ? "font-bold text-gold-light" : s.done ? "" : "text-muted"}">${esc(s.n)}</span>`;
      return isCeo ? `<li><button data-act="stage" data-id="${p.id}" data-i="${i}" class="flex w-full items-center gap-2 rounded-xl border border-white/10 px-3 py-2 transition hover:border-gold/50">${inner}</button></li>` : `<li class="flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2">${inner}</li>`;
    }).join("")}</ol>${isCeo ? `<p class="mt-2 text-xs text-muted">برای تغییر مرحله روی آن بزنید.</p>` : ""}`;
  }

  function calendar(p: Project) {
    const cells = Array.from({ length: 30 }, (_, i) => i + 1).map((d) => {
      const t = p.days[d];
      return `<button data-act="day" data-d="${d}" ${t ? "" : "disabled"} class="flex aspect-square flex-col items-center justify-center rounded-xl border text-xs transition ${S.day === d ? "border-gold bg-gold/15" : t ? "border-gold/30 bg-white/[0.04] hover:border-gold" : "border-white/5 text-muted/50"}"><span class="font-bold">${nf.format(d)}</span>${t ? `<span class="mt-0.5 hidden text-[10px] text-gold-light sm:block">${esc(t)}</span>` : ""}</button>`;
    }).join("");
    const sel = S.day && p.days[S.day] ? `<div class="mt-3 rounded-xl border border-gold/30 bg-gold/5 p-4 text-sm"><p class="font-bold text-gold-light">روز ${nf.format(S.day)} — ${esc(p.days[S.day])}</p><p class="mt-2 text-muted">[متن سناریو را مجری اینجا می‌نویسد] · وضعیت: در حال تولید</p></div>` : "";
    return `<div class="${card} mt-4"><h3 class="font-black">تقویم محتوا (آبان)</h3><div class="mt-3 grid grid-cols-6 gap-1.5 sm:grid-cols-10">${cells}</div>${sel}</div>`;
  }

  function projectDetail(p: Project) {
    const rep = p.reports.filter((r) => isCeo || r.vis);
    const allOk = p.deliveries.length > 0 && p.deliveries.every((d) => d.st === "ok");
    const deliv = p.deliveries.map((d) => {
      const stl = d.st === "ok" ? `<span class="text-emerald-400">تأیید شد</span>` : d.st === "edit" ? `<span class="text-amber">ویرایش خواسته شد</span>` : `<span class="text-[#b8aeff]">منتظر تأیید</span>`;
      const act = !isCeo && d.st === "await" ? `<div class="mt-3 flex flex-wrap gap-2"><button data-act="approve" data-p="${p.id}" data-id="${d.id}" class="${btnGold}">تأیید تحویل</button><button data-act="edit" data-id="${d.id}" class="${btn}">درخواست ویرایش</button></div>` : "";
      const form = S.editFor === d.id ? `<div class="mt-3"><textarea data-f="note" rows="3" class="${input}" placeholder="چه چیزی باید تغییر کند؟"></textarea><button data-act="sendedit" data-p="${p.id}" data-id="${d.id}" class="${btn} mt-2">ارسال درخواست</button></div>` : "";
      return `<div class="rounded-xl border border-white/10 bg-white/[0.03] p-4"><div class="flex justify-between gap-3 text-sm"><span class="font-bold">${esc(d.title)}</span>${stl}</div>${d.note ? `<p class="mt-2 text-xs text-muted">«${esc(d.note)}»</p>` : ""}${act}${form}</div>`;
    }).join("");
    const rate = !isCeo && allOk ? (p.rating ? `<div class="${card} mt-4"><p class="font-bold">ممنون از امتیاز شما: ${"★".repeat(p.rating.stars)}</p></div>` : `<div class="${card} mt-4"><h3 class="font-black">این پروژه چطور بود؟</h3><div class="mt-2 flex gap-1 text-2xl">${[1, 2, 3, 4, 5].map((n) => `<button data-act="star" data-n="${n}" class="${n <= S.star ? "text-gold" : "text-muted"}">★</button>`).join("")}</div>${S.star ? `<textarea data-f="rate" rows="2" class="${input} mt-3" placeholder="اگر می‌خواهید توضیح بدهید (اختیاری)"></textarea><button data-act="rate" data-id="${p.id}" class="${btn} mt-2">ثبت امتیاز</button>` : ""}</div>`) : "";
    const cross = !isCeo && allOk ? `<div class="${card} mt-4 border-gold/30"><h3 class="font-black">پیشنهاد برای ادامه</h3><p class="mt-1 text-sm text-muted">بعد از ${esc(p.service)}، معمولاً مشتریان کاتالوگ یا پکیج اینستاگرام سفارش می‌دهند.</p><button data-act="go" data-v="order" class="${btn} mt-3">دیدن خدمات</button></div>` : "";
    return `<button data-act="back" class="mb-3 text-sm text-gold">‹ بازگشت به پروژه‌ها</button>
      ${head(esc(p.title), `${esc(p.service)} · مجری: ${esc(p.owner)}`)}
      <div class="${card}"><h3 class="font-black">مراحل پروژه</h3>${stepper(p)}</div>
      <div class="${card} mt-4"><h3 class="font-black">گزارش‌های مجری</h3><div class="mt-3 grid gap-2">${rep.length ? rep.map((r) => `<div class="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm"><div class="flex justify-between text-xs text-muted"><span>${esc(r.d)}</span>${r.vis ? "" : `<span class="text-amber">فقط داخلی</span>`}</div><p class="mt-1">${esc(r.t)}</p></div>`).join("") : empty("هنوز گزارشی ثبت نشده.")}</div></div>
      ${p.calendar ? calendar(p) : ""}
      <div class="${card} mt-4"><h3 class="font-black">تحویل‌ها</h3><div class="mt-3 grid gap-2">${deliv || empty("تحویلی وجود ندارد.")}</div></div>${rate}${cross}`;
  }

  function projects() {
    if (S.pid) { const p = D.projects.find((x) => x.id === S.pid); if (p) return projectDetail(p); }
    return head("پروژه‌ها", isCeo ? "همه‌ی پروژه‌ها" : "پروژه‌ها و پکیج‌های شما") + `<div class="grid gap-4 md:grid-cols-2">${D.projects.map((p) => { const d = p.stages.filter((s) => s.done).length; return `<button data-act="open" data-id="${p.id}" class="${card} text-start transition hover:border-gold/50"><h2 class="font-black">${esc(p.title)}</h2><p class="mt-1 text-xs text-muted">${esc(p.service)} · مجری: ${esc(p.owner)}</p>${bar((d / p.stages.length) * 100)}<p class="mt-2 text-xs text-muted">${nf.format(d)} از ${nf.format(p.stages.length)} مرحله</p></button>`; }).join("")}</div>`;
  }

  function messages() {
    const ts = myThreads();
    const t = ts.find((x) => x.id === S.tid) ?? ts[0];
    if (!t) return head("پیام‌ها") + empty("گفت‌وگویی وجود ندارد.");
    const who = (x: Thread) => (isCeo ? "مشتری نمونه" : x.with === "ceo" ? "مدیرعامل" : "مجری نمونه");
    const list = ts.map((x) => { const u = isCeo ? x.unread.ceo : x.unread.client; return `<button data-act="thread" data-id="${x.id}" class="flex w-full items-center justify-between rounded-xl border px-4 py-3 text-start text-sm ${x.id === t.id ? "border-gold/60 bg-gold/10" : "border-white/10"}"><span>${who(x)}</span>${u ? `<span class="rounded-full bg-gold px-2 text-[11px] font-black text-midnight">${nf.format(u)}</span>` : ""}</button>`; }).join("");
    const bubbles = t.msgs.map((m) => `<div class="flex ${m.from === me ? "justify-start" : "justify-end"}"><div class="max-w-[80%] rounded-2xl px-4 py-2 text-sm ${m.from === me ? "bg-gold/15 border border-gold/30" : "bg-white/[0.06] border border-white/10"}"><p>${esc(m.t)}</p>${m.file ? `<p class="mt-1 text-xs text-gold-light">📎 ${esc(m.file)}</p>` : ""}<p class="mt-1 text-[10px] text-muted">${esc(m.at)}</p></div></div>`).join("");
    return head("پیام‌ها", "صندوق عمومی؛ می‌توانید یک پروژه را به پیام وصل کنید.") + `<div class="grid gap-4 md:grid-cols-[14rem_1fr]">
      <div class="grid content-start gap-2">${list}</div>
      <div class="${card} flex min-h-[26rem] flex-col"><div class="flex-1 space-y-2 overflow-y-auto">${bubbles}</div>
        <div class="mt-4 border-t border-white/10 pt-4"><textarea data-f="draft" data-t="${t.id}" rows="2" class="${input}" placeholder="پیام خود را بنویسید…">${esc(D.drafts[t.id] ?? "")}</textarea>
        <div class="mt-2 flex flex-wrap items-center gap-2"><button data-act="send" data-id="${t.id}" class="${btnGold}">ارسال</button>
        <label class="${btn} cursor-pointer">پیوست<input data-act="attach" data-id="${t.id}" type="file" accept="image/*,application/pdf" class="hidden"></label>
        <button data-act="voice" class="${btn}">پیام صوتی</button>
        <span class="text-[11px] text-muted">پیوست تا ۳ مگابایت · صوت تا ۲ دقیقه</span></div></div></div></div>`;
  }

  function files() {
    const rows: { n: string; w: string }[] = [];
    D.units.forEach((u) => u.file && rows.push({ n: u.file, w: "رسید پرداخت" }));
    D.threads.forEach((t) => t.msgs.forEach((m) => m.file && rows.push({ n: m.file, w: "پیوست پیام" })));
    D.projects.forEach((p) => p.deliveries.filter((d) => d.st === "ok").forEach((d) => rows.push({ n: d.title, w: "تحویل تأییدشده" })));
    return head("فایل‌ها", "همه‌ی فایل‌های شما در یک‌جا") + (rows.length ? `<div class="grid gap-2">${rows.map((r) => `<div class="${card} flex items-center justify-between text-sm"><span>📄 ${esc(r.n)}</span><span class="text-xs text-muted">${r.w}</span></div>`).join("")}</div>` : empty("هنوز فایلی نیست."));
  }

  function finance() {
    const groups = Array.from(new Set(D.units.map((u) => u.inv)));
    return head("امور مالی", "فاکتورهای غیررسمی · پرداخت کارت‌به‌کارت با ارسال عکس رسید (قالب نهایی فاکتور در انتظار فایل مالک)") + `<div class="${card} mb-4 text-sm"><p class="font-bold">اطلاعات کارت‌به‌کارت</p><p class="mt-1 text-muted">شماره‌ی کارت: [جای‌گذار] · به‌نام: [جای‌گذار]</p></div>` + groups.map((g) => `<div class="${card} mb-4"><h2 class="font-black">${esc(g)}</h2><div class="mt-3 grid gap-2">${D.units.filter((u) => u.inv === g).map((u) => `<div class="rounded-xl border border-white/10 bg-white/[0.03] p-4"><div class="flex items-center justify-between gap-3 text-sm"><span class="font-bold">${esc(u.label)}: ${nf.format(u.amount)} میلیون تومان</span>${chip(u.st)}</div><p class="mt-1 text-xs text-muted">سررسید: ${esc(u.due)}</p>${u.st === "rejected" ? `<p class="mt-2 text-xs text-red-300">دلیل رد: ${esc(u.reason ?? "")}</p>` : ""}${u.st === "unpaid" || u.st === "rejected" ? `<label class="${btn} mt-3 inline-block cursor-pointer">ارسال عکس رسید<input data-act="receipt" data-id="${u.id}" type="file" accept="image/*,application/pdf" class="hidden"></label>` : u.file ? `<p class="mt-2 text-xs text-muted">📎 ${esc(u.file)}</p>` : ""}</div>`).join("")}</div></div>`).join("");
  }

  function order() {
    return head("سفارش جدید", "خدمت یا پکیج تازه سفارش دهید یا پکیج فعالتان را تمدید کنید.") + `<div class="grid gap-4 sm:grid-cols-2">${o.services.map((s) => `<div class="${card}"><h2 class="font-black">${esc(s.name)}</h2><p class="mt-1 text-sm text-muted">${esc(s.line)}</p><div class="mt-3 flex gap-2"><button data-act="order" data-id="${esc(s.name)}" class="${btnGold}">ثبت درخواست</button>${s.id === "growth" ? `<button data-act="renew" class="${btn}">تمدید پکیج</button>` : ""}</div></div>`).join("")}</div>`;
  }

  function notes() {
    const ns = myNotes();
    return head("اعلان‌ها") + `<div class="grid gap-2">${ns.length ? ns.map((n) => `<button data-act="read" data-id="${n.id}" class="${card} flex items-center justify-between gap-3 text-start text-sm ${n.read ? "opacity-60" : "border-gold/40"}"><span>${esc(n.t)}</span><span class="shrink-0 text-xs text-muted">${esc(n.d)}</span></button>`).join("") : empty("اعلانی نیست.")}</div>`;
  }

  function account() {
    return head("حساب کاربری") + `<div class="grid gap-4 md:grid-cols-2"><div class="${card} text-sm"><p><span class="text-muted">نام:</span> ${esc(o.session.name)}</p><p class="mt-2"><span class="text-muted">شناسه:</span> <span dir="ltr">${esc(o.session.id)}</span></p><p class="mt-2"><span class="text-muted">نقش:</span> ${ROLE_FA[role]}</p>
      <p class="mt-4 text-xs text-muted">ورود دومرحله‌ای (TOTP، بدون پیامک) در نسخه‌ی واقعی: ${isCeo ? "اجباری" : "اختیاری"}.</p></div>
      <div class="${card}"><h2 class="font-black">آموزش</h2><p class="mt-1 text-sm text-muted">راهنمای ۵ مرحله‌ای کار با پنل؛ هر زمان می‌توانید دوباره ببینید.</p><button data-act="tour" class="${btnGold} mt-3">شروع آموزش</button>
      <button data-act="reset" class="${btn} mt-3 block">بازنشانی داده‌های نمایشی</button></div></div>`;
  }

  function users() {
    const row = (u: User) => `<div class="${card} flex flex-wrap items-center justify-between gap-3 text-sm"><div><p class="font-bold">${esc(u.name)}</p><p class="text-xs text-muted"><span dir="ltr">${esc(u.id)}</span> · ${u.emailOk ? "ایمیل تأییدشده" : "ایمیل تأییدنشده"} · ${ROLE_FA[u.role]}</p></div>
      <div class="flex flex-wrap items-center gap-2"><span class="rounded-full border px-3 py-1 text-[11px] font-bold ${u.st === "active" ? UNIT_CLS.paid : u.st === "pending" ? UNIT_CLS.pending : UNIT_CLS.rejected}">${u.st === "active" ? "فعال" : u.st === "pending" ? "منتظر تأیید" : "غیرفعال"}</span>
      ${u.st === "pending" ? `<button data-act="uok" data-id="${u.id}" class="${btnGold}">تأیید حساب</button><button data-act="uno" data-id="${u.id}" class="${btn}">رد</button>` : role === "ceo" && u.role !== "ceo" ? `<select data-act="urole" data-id="${u.id}" class="rounded-full border border-white/15 bg-midnight px-3 py-1.5 text-xs">${(["client", "staff", "admin"] as Role[]).map((r) => `<option value="${r}" ${u.role === r ? "selected" : ""}>${ROLE_FA[r]}</option>`).join("")}</select>` : ""}</div></div>`;
    return head("کاربران و حساب‌ها", "فقط ایمیل‌تأییدشده‌ها وارد صف تأیید می‌شوند. ارتقای نقش فقط توسط مدیرعامل.") + `<div class="grid gap-2">${D.users.map(row).join("")}</div>`;
  }

  function receipts() {
    const pend = D.units.filter((u) => u.st === "pending");
    return head("رسیدها و فاکتورها", "تأیید یا رد (با ذکر دلیل) رسیدهای کارت‌به‌کارت") + `<h2 class="mb-2 font-black">منتظر بررسی</h2><div class="grid gap-2">${pend.length ? pend.map((u) => `<div class="${card} text-sm"><div class="flex justify-between gap-3"><span class="font-bold">${esc(u.inv)} — ${esc(u.label)}: ${nf.format(u.amount)} میلیون تومان</span><span class="text-xs text-muted">📎 ${esc(u.file ?? "")}</span></div><div class="mt-3 flex flex-wrap items-center gap-2"><button data-act="rok" data-id="${u.id}" class="${btnGold}">تأیید رسید</button><button data-act="rno" data-id="${u.id}" class="${btn}">رد با دلیل</button></div>${S.rejectFor === u.id ? `<div class="mt-3 flex gap-2"><input data-f="reason" class="${input}" placeholder="دلیل رد"><button data-act="rsend" data-id="${u.id}" class="${btn}">ثبت</button></div>` : ""}</div>`).join("") : empty("رسید منتظری نیست.")}</div>
      <h2 class="mb-2 mt-6 font-black">همه‌ی اقلام</h2><div class="grid gap-2">${D.units.map((u) => `<div class="${card} flex items-center justify-between gap-3 text-sm"><span>${esc(u.inv)} — ${esc(u.label)}: ${nf.format(u.amount)}</span>${chip(u.st)}</div>`).join("")}</div>
      <p class="mt-4 text-xs text-muted">ساخت فاکتور و اقساط: در انتظار فایل قالب فاکتور مالک.</p>`;
  }

  function auditView() {
    return head("لاگ ممیزی", "فقط افزودنی؛ هیچ ردیفی قابل ویرایش یا حذف نیست.") + `<div class="grid gap-2">${D.audit.map((a) => `<div class="${card} flex flex-wrap justify-between gap-2 text-sm"><span>${esc(a.who)} · ${esc(a.act)} ${a.target !== "—" ? "· " + esc(a.target) : ""}</span><span class="text-xs text-muted">${esc(a.at)}</span></div>`).join("")}</div>`;
  }

  function money() {
    return head("امور مالی مدیرعامل") + `<div class="${card} text-center"><p class="text-3xl">🔒</p><p class="mt-3 font-bold">این بخش فقط برای مدیرعامل است</p><p class="mt-2 text-sm text-muted">سود، هزینه‌ها و حقوق کارکنان را مالک خودش کامل می‌کند. فعلاً فقط مسیر محافظت‌شده و بررسی نقش وجود دارد؛ هیچ داده‌ای ساخته نشده است.</p></div>`;
  }

  const VIEWS: Record<string, () => string> = {
    dash: () => (isCeo ? dashCeo() : dashClient()), projects, messages, files, finance, order, notes, account, users, receipts, audit: auditView, money,
  };

  function tourModal() {
    if (S.tour === -2) return `<div class="fixed inset-0 z-[65] flex items-end justify-center bg-black/50 p-4 sm:items-center"><div class="${card} max-w-sm bg-[#0b0e27] text-center"><p class="text-lg font-black">خوش آمدید</p><p class="mt-2 text-sm text-muted">می‌خواهید یک آموزش کوتاه ۵ مرحله‌ای ببینید؟</p><div class="mt-4 flex justify-center gap-2"><button data-act="tourgo" class="${btnGold}">شروع آموزش</button><button data-act="tourlater" class="${btn}">بعداً</button></div></div></div>`;
    if (S.tour >= 0) { const [t, d] = TOUR[S.tour]; return `<div class="fixed inset-0 z-[65] flex items-end justify-center bg-black/50 p-4 sm:items-center"><div class="${card} max-w-sm bg-[#0b0e27]"><p class="text-xs text-muted">مرحله ${nf.format(S.tour + 1)} از ${nf.format(TOUR.length)}</p><p class="mt-1 text-lg font-black">${t}</p><p class="mt-2 text-sm text-muted">${d}</p><div class="mt-4 flex gap-2"><button data-act="tournext" class="${btnGold}">${S.tour === TOUR.length - 1 ? "پایان" : "بعدی"}</button><button data-act="tourclose" class="${btn}">بستن</button></div></div></div>`; }
    return "";
  }

  function render() {
    const y = window.scrollY;
    const items = nav.map(([k, t]) => {
      const badge = k === "messages" ? unreadMsgs() : k === "notes" ? unreadNotes() : k === "users" ? D.users.filter((u) => u.st === "pending").length : k === "receipts" ? D.units.filter((u) => u.st === "pending").length : 0;
      return `<button data-act="go" data-v="${k}" class="flex shrink-0 items-center justify-between gap-3 rounded-xl px-4 py-2.5 text-sm transition ${S.view === k ? "bg-gold/15 font-bold text-gold-light" : "text-muted hover:text-text"}"><span>${t}</span>${badge ? `<span class="rounded-full bg-gold px-2 text-[11px] font-black text-midnight">${nf.format(badge)}</span>` : ""}</button>`;
    }).join("");
    root.innerHTML = `<div dir="rtl" class="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 pt-8 pb-16 md:flex-row md:px-8">
      <aside class="shrink-0 md:sticky md:top-6 md:h-fit md:w-64"><div class="${card} !p-4"><p class="text-lg font-black"><span class="gold-text">شباهنگ</span></p><p class="mt-1 text-xs text-muted">${esc(o.session.name)} · ${ROLE_FA[role]}</p>
        <nav aria-label="پنل" class="chip-row mt-4 flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">${items}</nav>
        <button data-act="logout" class="mt-3 w-full rounded-xl border border-white/10 px-4 py-2 text-sm text-muted transition hover:text-gold">خروج</button></div></aside>
      <section class="min-w-0 flex-1"><p class="mb-4 rounded-xl border border-violet/40 bg-violet/10 px-4 py-2 text-xs text-[#d5cfff]">نسخه‌ی نمایشی: داده‌ها نمونه‌اند، ورود و ذخیره‌ی واقعی هنوز ساخته نشده و چیزی به جایی ارسال نمی‌شود.</p>${(VIEWS[S.view] ?? VIEWS.dash)()}</section></div>${tourModal()}`;
    window.scrollTo(0, y);
  }

  /* ---------- events ---------- */
  const go = (v: string, id = "") => { S.view = v; S.pid = v === "projects" ? id : ""; S.editFor = ""; S.rejectFor = ""; S.day = 0; S.star = 0; window.scrollTo(0, 0); render(); };
  const fval = (sel: string) => (root.querySelector(sel) as HTMLInputElement | HTMLTextAreaElement | null)?.value.trim() ?? "";
  const proj = (id?: string) => D.projects.find((p) => p.id === id);
  const unit = (id?: string) => D.units.find((u) => u.id === id);

  function onClick(e: Event) {
    const el = (e.target as Element).closest<HTMLElement>("[data-act]");
    if (!el || el.tagName === "INPUT" || el.tagName === "SELECT") return;
    const a = el.dataset.act, id = el.dataset.id;
    switch (a) {
      case "go": return go(el.dataset.v ?? "dash", id);
      case "open": S.view = "projects"; S.pid = id ?? ""; window.scrollTo(0, 0); return render();
      case "back": S.pid = ""; return render();
      case "logout": return o.onLogout();
      case "stage": { const p = proj(id); const i = Number(el.dataset.i); if (p) { p.stages[i].done = !p.stages[i].done; audit(`تغییر مرحله «${p.stages[i].n}»`, p.title); notify("client", `مرحله‌ی «${p.stages[i].n}» در «${p.title}» به‌روز شد.`); save(); render(); } return; }
      case "day": S.day = Number(el.dataset.d); return render();
      case "approve": { const p = proj(el.dataset.p); const d = p?.deliveries.find((x) => x.id === id); if (d && p) { d.st = "ok"; notify("ceo", `${d.title} را مشتری تأیید کرد.`); audit("تأیید تحویل", d.title); save(); toast("تحویل تأیید شد."); render(); } return; }
      case "edit": S.editFor = id ?? ""; return render();
      case "sendedit": { const p = proj(el.dataset.p); const d = p?.deliveries.find((x) => x.id === id); const note = fval("[data-f=note]"); if (d) { d.st = "edit"; d.note = note || "بدون توضیح"; notify("ceo", `درخواست ویرایش برای ${d.title}`); S.editFor = ""; save(); toast("درخواست ویرایش ارسال شد."); render(); } return; }
      case "star": S.star = Number(el.dataset.n); return render();
      case "rate": { const p = proj(id); if (p) { p.rating = { stars: S.star, text: fval("[data-f=rate]") }; save(); toast("ممنون از بازخورد شما."); render(); } return; }
      case "thread": S.tid = id ?? "t1"; { const t = D.threads.find((x) => x.id === S.tid); if (t) { if (isCeo) t.unread.ceo = 0; else t.unread.client = 0; save(); } } return render();
      case "send": {
        const t = D.threads.find((x) => x.id === id); const text = fval("[data-f=draft]");
        if (!t || !text) return toast("پیام خالی است.");
        t.msgs.push({ from: me, t: text, at: nowStr() }); if (isCeo) t.unread.client++; else if (t.with === "ceo") t.unread.ceo++;
        D.drafts[t.id] = ""; save(); return render();
      }
      case "voice": return toast("ضبط پیام صوتی (تا ۲ دقیقه) در نسخه‌ی واقعی فعال می‌شود.");
      case "order": notify("ceo", `درخواست سفارش: ${id}`); audit("ثبت سفارش", id ?? ""); save(); return toast("درخواست شما ثبت شد (نمایشی).");
      case "renew": notify("ceo", "درخواست تمدید پکیج"); save(); return toast("درخواست تمدید ثبت شد (نمایشی).");
      case "read": { const n = myNotes().find((x) => x.id === id); if (n) { n.read = true; save(); render(); } return; }
      case "uok": { const u = D.users.find((x) => x.id === id); if (u) { u.st = "active"; audit("تأیید حساب", u.id); save(); toast("حساب تأیید شد؛ ایمیل «حساب فعال شد» در نسخه‌ی واقعی ارسال می‌شود."); render(); } return; }
      case "uno": { const u = D.users.find((x) => x.id === id); if (u) { u.st = "disabled"; audit("رد حساب", u.id); save(); render(); } return; }
      case "rok": { const u = unit(id); if (u) { u.st = "paid"; audit("تأیید رسید", u.label); notify("client", `رسید «${u.label}» تأیید شد.`); save(); render(); } return; }
      case "rno": S.rejectFor = id ?? ""; return render();
      case "rsend": { const u = unit(id); const r = fval("[data-f=reason]"); if (u && r) { u.st = "rejected"; u.reason = r; audit("رد رسید", u.label); notify("client", `رسید «${u.label}» رد شد: ${r}`); S.rejectFor = ""; save(); render(); } else toast("دلیل رد را بنویسید."); return; }
      case "tour": S.tour = 0; return render();
      case "tourgo": S.tour = 0; try { localStorage.setItem(TOUR_KEY, "1"); } catch { /* ignore */ } return render();
      case "tourlater": S.tour = -1; try { localStorage.setItem(TOUR_KEY, "later"); } catch { /* ignore */ } return render();
      case "tournext": S.tour = S.tour >= TOUR.length - 1 ? -1 : S.tour + 1; return render();
      case "tourclose": S.tour = -1; return render();
      case "reset": D = seed(); save(); return render();
    }
  }

  function onChange(e: Event) {
    const el = e.target as HTMLInputElement | HTMLSelectElement;
    const a = el.dataset?.act; if (!a) return;
    if (a === "urole") { const u = D.users.find((x) => x.id === el.dataset.id); if (u && role === "ceo") { u.role = el.value as Role; audit(`تغییر نقش به ${ROLE_FA[u.role]}`, u.id); save(); toast("نقش تغییر کرد."); render(); } return; }
    if (a === "attach" || a === "receipt") {
      const f = (el as HTMLInputElement).files?.[0]; if (!f) return;
      if (f.size > MAX_FILE) { el.value = ""; return toast("حجم فایل بیشتر از ۳ مگابایت است."); }
      if (a === "attach") { const t = D.threads.find((x) => x.id === el.dataset.id); if (t) { t.msgs.push({ from: me, t: "فایل پیوست شد", at: nowStr(), file: f.name }); save(); render(); } }
      else { const u = unit(el.dataset.id); if (u) { u.st = "pending"; u.file = f.name; u.reason = ""; notify("ceo", `رسید جدید برای «${u.label}»`); audit("ارسال رسید", u.label); save(); toast("رسید ارسال شد و منتظر تأیید است."); render(); } }
    }
  }

  function onInput(e: Event) {
    const el = e.target as HTMLTextAreaElement;
    if (el.dataset?.f === "draft" && el.dataset.t) { D.drafts[el.dataset.t] = el.value; save(); }
  }

  root.addEventListener("click", onClick);
  root.addEventListener("change", onChange);
  root.addEventListener("input", onInput);
  save();
  render();
  return () => { root.removeEventListener("click", onClick); root.removeEventListener("change", onChange); root.removeEventListener("input", onInput); root.innerHTML = ""; };
}
