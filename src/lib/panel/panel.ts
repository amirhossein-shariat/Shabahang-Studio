/**
 * Demo panels (client and CEO) rendered from plain strings, so the very same file runs inside the Next.js page
 * and inside the static preview. DEMO ONLY: the data below is sample data kept in sessionStorage; nothing is sent
 * anywhere, nothing here is a security boundary. Real build: see docs/shabahang-panels-spec.md (server-side access
 * control, PostgreSQL, S3 files, e-mail, TOTP, append-only audit log).
 * Naming follows common Persian panels (پیشخوان، امور مالی، تیکت…). No SMS anywhere.
 */
import type { Role, Session } from "./demo";
import { toJalali, jMonthLen, weekCol, MONTHS, WEEKDAYS } from "./jalali";

export type ServiceOpt = { id: string; name: string; line: string };
type Opts = { session: Session; services: ServiceOpt[]; siteHref: string; onLogout: () => void; mountInvoices?: (el: HTMLElement) => () => void };

type Party = "client" | "ceo" | "staff";
type Stage = { n: string; done: boolean };
type Report = { d: string; t: string; vis: boolean };
type Delivery = { id: string; title: string; st: "await" | "ok" | "edit"; note?: string };
type Comment = { from: Party; t: string; at: string };
type Ev = { id: string; kind: string; title: string; detail: string; st: string; comments: Comment[] };
type Project = {
  id: string; title: string; service: string; left: number; total: number;
  stages: Stage[]; reports: Report[]; calendar: boolean; events: Record<string, Ev[]>;
  deliveries: Delivery[]; rating: null | { stars: number; text: string };
};
type Unit = { id: string; label: string; amount: number; due: string; st: "unpaid" | "pending" | "paid" | "rejected"; file?: string; track?: string; method?: string; reason?: string; note?: string };
type Terms = "cash" | "inst" | "cheque" | "credit";
type Invoice = { id: string; no: string; title: string; issued: string; lines: { t: string; amt: number }[]; terms: Terms; methods: string[]; accountId: string; units: Unit[] };
type Account = { id: string; label: string; holder: string; bank: string; card: string; sheba: string; on: boolean };
type Msg = { from: Party; t: string; at: string; file?: string };
type Thread = { id: string; a: Party; b: Party; msgs: Msg[]; unread: Record<Party, number> };
type User = { id: string; name: string; email: string; role: Role; st: "pending" | "active" | "disabled"; emailOk: boolean };
type Note = { id: string; t: string; d: string; read: boolean };
type Audit = { at: string; who: string; act: string; target: string };
type Data = {
  projects: Project[]; invoices: Invoice[]; accounts: Account[]; defaultAccount: string; threads: Thread[]; users: User[];
  notes: { client: Note[]; ceo: Note[] }; audit: Audit[]; drafts: Record<string, string>;
};

const DATA_KEY = "sh-demo-data-3";
const TOUR_KEY = "sh-demo-tour";
const MAX_FILE = 3 * 1024 * 1024;

const nf = new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 2 });
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);
const nowStr = () => new Date().toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" });

const fullDay = (jy: number, jm: number, jd: number) => `${WEEKDAYS[weekCol(jy, jm, jd)]} ${nf.format(jd)} ${MONTHS[jm - 1]}`;
const ek = (jy: number, jm: number, jd: number) => `${jy}-${jm}-${jd}`;

/* ---------- people (names with role, in distinct colours) ---------- */
const PEOPLE: Record<Party, { name: string; title: string; cls: string }> = {
  client: { name: "آقا/خانم [نام مشتری]", title: "", cls: "" },
  ceo: { name: "آقا/خانم [نام مدیرعامل]", title: "مدیرعامل", cls: "border-gold/60 text-gold" },
  staff: { name: "آقا/خانم [نام مجری]", title: "طراح گرافیک", cls: "border-violet/60 text-[#b8aeff]" },
};
const person = (p: Party) => `<span class="inline-flex flex-wrap items-center gap-x-2 gap-y-1"><span class="font-bold">${PEOPLE[p].name}</span>${p === "client" ? "" : `<span class="inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-bold leading-none ${PEOPLE[p].cls}">${PEOPLE[p].title}</span>`}</span>`;
/** Label above a message: the role for staff and CEO, the customer's own name for the customer */
const tag = (p: Party) => (p === "client" ? PEOPLE.client.name : PEOPLE[p].title);
const nameColor = (p: Party) => (p === "staff" ? "text-[#b8aeff]" : p === "ceo" ? "text-gold" : "text-text");

function seed(): Data {
  const now = new Date();
  const j = toJalali(now.getFullYear(), now.getMonth() + 1, now.getDate());
  const nx = j.jm === 12 ? { y: j.jy + 1, m: 1 } : { y: j.jy, m: j.jm + 1 };
  const events: Record<string, Ev[]> = {};
  const put = (y: number, m: number, d: number, kind: string, title: string, st: string) => {
    const k = ek(y, m, d); (events[k] ??= []).push({ id: `e${y}${m}${d}${(events[k]?.length ?? 0)}`, kind, title, detail: "[شرح و سناریوی این مورد را مجری اینجا می‌نویسد]", st, comments: [] });
  };
  [[3, "ریلز", "ریلز ۱"], [7, "پست", "پست ثابت ۱"], [10, "ریلز", "ریلز ۲"], [14, "کروسل", "کروسل ۱"], [17, "ریلز", "ریلز ۳"], [17, "استوری", "استوری موشن ۱"], [21, "استوری", "استوری موشن ۲"], [24, "ریلز", "ریلز ۴"], [28, "پست", "پست ثابت ۲"]].forEach(([d, k, t]) => put(j.jy, j.jm, d as number, k as string, t as string, d as number <= j.jd ? "تحویل‌شده" : "در حال تولید"));
  [[2, "ریلز", "ریلز ۵"], [6, "پست", "پست ثابت ۳"], [11, "کروسل", "کروسل ۲"]].forEach(([d, k, t]) => put(nx.y, nx.m, d as number, k as string, t as string, "برنامه‌ریزی‌شده"));
  return {
    projects: [
      {
        id: "p1", title: "پکیج نقره‌ای اینستاگرام (۳ ماهه)", service: "شبکه‌های اجتماعی و محتوا", left: 48, total: 90,
        stages: [{ n: "سناریو", done: true }, { n: "فیلمبرداری", done: true }, { n: "تدوین", done: false }, { n: "تأیید مشتری", done: false }, { n: "انتشار", done: false }],
        reports: [
          { d: "۱۸ آبان", t: "سناریوی ریلز ۱ و ۲ نهایی شد. [متن گزارش واقعی]", vis: true },
          { d: "۱۹ آبان", t: "یادداشت داخلی برای تیم. [فقط داخلی]", vis: false },
        ],
        calendar: true, events,
        deliveries: [{ id: "d1", title: "ریلز شماره‌ی ۱", st: "await" }],
        rating: null,
      },
      {
        id: "p2", title: "طراحی لوگو و هویت بصری", service: "برندینگ و هویت بصری", left: 0, total: 0,
        stages: [{ n: "مشاوره", done: true }, { n: "طرح اولیه", done: true }, { n: "بازبینی", done: true }, { n: "تحویل نهایی", done: true }],
        reports: [{ d: "۲ آبان", t: "فایل‌های نهایی آماده‌ی تحویل است. [متن گزارش واقعی]", vis: true }],
        calendar: false, events: {},
        deliveries: [{ id: "d2", title: "فایل‌های نهایی لوگو", st: "await" }],
        rating: null,
      },
    ],
    accounts: [
      { id: "a1", label: "کارت اصلی", holder: "[نام صاحب حساب]", bank: "[نام بانک]", card: "[شماره کارت]", sheba: "IR[شماره شبا]", on: true },
      { id: "a2", label: "کارت دوم", holder: "[نام صاحب حساب]", bank: "[نام بانک]", card: "[شماره کارت]", sheba: "IR[شماره شبا]", on: true },
    ],
    defaultAccount: "a1",
    invoices: [
      {
        id: "f1", no: "[شماره فاکتور]", title: "پکیج نقره‌ای اینستاگرام (۳ ماهه)", issued: "۱ آبان", terms: "inst", methods: ["کارت‌به‌کارت", "پل", "پایا", "ساتنا"], accountId: "a1",
        lines: [{ t: "پکیج نقره‌ای اینستاگرام — ۳ ماه", amt: 56.4 }],
        units: [
          { id: "u1", label: "پیش‌پرداخت", amount: 28.2, due: "۱ آبان", st: "paid", method: "کارت‌به‌کارت", track: "[شماره پیگیری]", file: "receipt-0.jpg" },
          { id: "u2", label: "قسط دوم", amount: 28.2, due: "۱ آذر", st: "unpaid" },
        ],
      },
      {
        id: "f2", no: "[شماره فاکتور]", title: "طراحی لوگو و هویت بصری", issued: "۲۰ مهر", terms: "cash", methods: ["کارت‌به‌کارت", "پل", "پایا"], accountId: "a2",
        lines: [{ t: "طراحی لوگو", amt: 8 }, { t: "راهنمای هویت بصری", amt: 4 }],
        units: [{ id: "u3", label: "تسویه‌ی نقدی", amount: 12, due: "۱۵ آبان", st: "rejected", reason: "تصویر رسید ناخوانا است؛ لطفاً دوباره ثبت کنید.", file: "receipt-1.jpg", method: "کارت‌به‌کارت", track: "[شماره پیگیری]" }],
      },
      {
        id: "f3", no: "[شماره فاکتور]", title: "طراحی سایت معرفی", issued: "۵ آبان", terms: "cheque", methods: ["کارت‌به‌کارت"], accountId: "a1",
        lines: [{ t: "طراحی و پیاده‌سازی سایت", amt: 40 }],
        units: [
          { id: "u4", label: "چک اول", amount: 20, due: "۵ دی", st: "unpaid", note: "چک شماره [شماره چک] · بانک [نام بانک]" },
          { id: "u5", label: "چک دوم", amount: 20, due: "۵ بهمن", st: "unpaid", note: "چک شماره [شماره چک] · بانک [نام بانک]" },
        ],
      },
    ],
    threads: [
      { id: "t1", a: "client", b: "ceo", unread: { client: 0, ceo: 0, staff: 0 }, msgs: [{ from: "ceo", t: "سلام، به پنل خوش آمدید.", at: "۱۰:۱۵" }] },
      { id: "t2", a: "client", b: "staff", unread: { client: 1, ceo: 0, staff: 0 }, msgs: [{ from: "staff", t: "ریلز شماره‌ی ۱ برای تأیید آماده است.", at: "۱۱:۳۰" }] },
      { id: "t3", a: "ceo", b: "staff", unread: { client: 0, ceo: 1, staff: 0 }, msgs: [{ from: "staff", t: "گزارش امروز ثبت شد.", at: "۱۲:۰۵" }] },
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
      ceo: [{ id: "c1", t: "دو ثبت‌نام جدید منتظر تأیید شماست.", d: "امروز", read: false }],
    },
    audit: [{ at: "—", who: "سیستم", act: "ایجاد داده‌ی نمایشی", target: "—" }],
    drafts: {},
  };
}

const CLIENT_NAV: [string, string][] = [["dash", "پیشخوان"], ["projects", "پروژه‌ها"], ["messages", "پیام‌ها"], ["files", "فایل‌ها"], ["finance", "امور مالی"], ["order", "سفارش جدید"], ["notes", "اعلان‌ها"], ["account", "حساب کاربری"]];
const CEO_NAV: [string, string][] = [["dash", "پیشخوان"], ["users", "کاربران و حساب‌ها"], ["invoices", "فاکتورها"], ["receipts", "رسیدها و پرداخت‌ها"], ["accounts", "کارت‌ها و حساب‌های بانکی"], ["projects", "پروژه‌ها"], ["messages", "پیام‌ها"], ["notes", "اعلان‌ها"], ["audit", "لاگ ممیزی"], ["money", "امور مالی"], ["account", "حساب کاربری"]];
const ROLE_FA: Record<Role, string> = { client: "مشتری", staff: "مجری", admin: "ادمین", ceo: "مدیرعامل" };
const UNIT_FA = { unpaid: "پرداخت‌نشده", pending: "در انتظار تأیید", paid: "پرداخت‌شده", rejected: "ردشده" };
const UNIT_CLS = { unpaid: "border-amber/50 text-amber", pending: "border-violet/60 text-[#b8aeff]", paid: "border-emerald-400/60 text-emerald-400", rejected: "border-red-400/60 text-red-300" };
const TERMS_FA: Record<Terms, string> = { cash: "نقدی", inst: "قسطی", cheque: "چکی", credit: "اعتباری" };
const ALL_METHODS = ["کارت‌به‌کارت", "پل", "پایا", "ساتنا"];
const TOUR: { k: string; t: string; d: string }[] = [
  { k: "dash", t: "پیشخوان", d: "هر چیزی که منتظر اقدام شماست در یک نگاه: تأیید تحویل، فاکتور و پیام." },
  { k: "projects", t: "پروژه‌ها", d: "نوار مراحل، گزارش‌های مجری، تقویم محتوا و تحویل‌ها اینجاست. روی روز تقویم بزنید و برای هر مورد نظر بگذارید." },
  { k: "messages", t: "پیام‌ها", d: "با مدیرعامل یا مجری خودتان گفت‌وگو کنید. Enter ارسال می‌کند و Shift+Enter خط بعد می‌رود." },
  { k: "finance", t: "امور مالی", d: "هر فاکتور یک کادر جدا دارد؛ فاکتور را ببینید و با دکمه‌ی «پرداخت» شیوه‌ی پرداخت را ثبت کنید." },
  { k: "order", t: "سفارش جدید", d: "پکیج یا خدمت تازه سفارش دهید یا پکیج فعالتان را تمدید کنید." },
];

const card = "rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm";
const btn = "rounded-full border border-gold/50 px-4 py-2 text-xs font-bold text-gold transition hover:bg-gold hover:text-midnight";
const btnGold = "rounded-full bg-gold px-5 py-2.5 text-xs font-bold text-midnight";
const input = "w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2.5 text-sm text-text placeholder:text-muted focus:border-gold";
const chip = (st: Unit["st"]) => `<span class="shrink-0 rounded-full border px-3 py-1 text-[11px] font-bold ${UNIT_CLS[st]}">${UNIT_FA[st]}</span>`;
const bar = (pct: number) => `<div class="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10"><div class="pn-grow h-full rounded-full bg-gradient-to-l from-gold to-amber" style="width:${Math.round(pct)}%"></div></div>`;
const empty = (t: string) => `<p class="rounded-xl border border-dashed border-white/15 p-5 text-center text-sm text-muted">${t}</p>`;
const head = (t: string, sub = "") => `<div class="mb-5"><h1 class="text-2xl font-black md:text-3xl">${t}</h1>${sub ? `<p class="mt-1 text-sm text-muted">${sub}</p>` : ""}</div>`;
const svg = (p: string) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5" aria-hidden="true">${p}</svg>`;
const I_SEND = svg('<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>');
const I_CLIP = svg('<path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/>');
const I_MIC = svg('<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><path d="M12 19v3"/>');
const I_CHEV_R = svg('<path d="m9 18 6-6-6-6"/>');
const I_CHEV_L = svg('<path d="m15 18-6-6 6-6"/>');
const badge = (n: number, pop = false) => (n ? `<span class="${pop ? "pn-badge-pop " : ""}inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-gold px-1 text-[11px] font-black leading-none text-midnight">${nf.format(n)}</span>` : "");
const ICONS: Record<string, string> = {
  dash: '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>',
  projects: '<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
  messages: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
  files: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>',
  finance: '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
  order: '<circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8"/>',
  notes: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  account: '<circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  receipts: '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8M12 17.5v-11"/>',
  accounts: '<rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/>',
  audit: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  invoices: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4M8 13h8M8 17h6"/>',
  money: '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
};
const ic = (k: string, extra = "") => `<span class="pn-ic ${extra}">${svg(ICONS[k] ?? ICONS.dash)}</span>`;
const I_MENU = svg('<path d="M4 6h16M4 12h16M4 18h16"/>');
const I_X = svg('<path d="M18 6 6 18M6 6l12 12"/>');
const sendBtn = (id: string, hasText: boolean) => (hasText ? `<button data-act="send" data-id="${id}" class="js-send flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold text-midnight" aria-label="ارسال">${I_SEND}</button>` : `<button data-act="voice" class="js-send flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold text-midnight" aria-label="پیام صوتی">${I_MIC}</button>`);

export function mountPanel(root: HTMLElement, o: Opts): () => void {
  const role = o.session.role;
  const isCeo = role === "ceo" || role === "admin";
  const me: Party = isCeo ? "ceo" : "client";
  const nav = isCeo ? CEO_NAV.filter(([k]) => role === "ceo" || (k !== "money" && k !== "invoices")) : CLIENT_NAV;
  let stopInv: (() => void) | null = null;
  let D: Data;
  try { const raw = sessionStorage.getItem(DATA_KEY); D = raw ? (JSON.parse(raw) as Data) : seed(); } catch { D = seed(); }
  const today = toJalali(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate());
  const S = { anim: false, drawerAnim: false, menu: false, fresh: [] as string[], view: "dash", pid: "", tid: "", mtab: "staff", cy: today.jy, cm: today.jm, day: 0, editFor: "", rejectFor: "", star: 0, tour: -1, payFor: "", payMethod: "", invView: "" };
  const save = () => { try { sessionStorage.setItem(DATA_KEY, JSON.stringify(D)); } catch { /* demo keeps working without saving */ } };
  const audit = (act: string, target: string) => { D.audit.unshift({ at: nowStr(), who: o.session.name, act, target }); };
  const notify = (to: "client" | "ceo", t: string) => { D.notes[to].unshift({ id: "n" + Date.now() + Math.random().toString(36).slice(2, 5), t, d: "هم‌اکنون", read: false }); };
  if (role === "client") { try { if (!localStorage.getItem(TOUR_KEY)) S.tour = -2; } catch { /* no tour memory */ } }

  const myNotes = () => (isCeo ? D.notes.ceo : D.notes.client);
  const myThreads = () => D.threads.filter((t) => t.a === me || t.b === me);
  const unreadMsgs = () => myThreads().reduce((n, t) => n + t.unread[me], 0);
  const unreadNotes = () => myNotes().filter((n) => !n.read).length;
  const allUnits = () => D.invoices.flatMap((i) => i.units.map((u) => ({ u, i })));
  const acc = (id: string) => D.accounts.find((a) => a.id === id) ?? D.accounts[0];
  const invTotal = (i: Invoice) => i.lines.reduce((n, l) => n + l.amt, 0);

  function toast(t: string) {
    const el = document.createElement("div");
    el.className = "fixed bottom-6 left-1/2 z-[80] -translate-x-1/2 rounded-full border border-gold/40 bg-[#0b0e27] px-5 py-3 text-sm text-text shadow-lg";
    el.textContent = t;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2800);
  }

  /* ---------- views ---------- */
  function dashClient() {
    const active = D.projects.filter((p) => p.total > 0);
    const run = D.projects.filter((p) => p.stages.some((s) => !s.done) || p.deliveries.some((d) => d.st !== "ok"));
    const unpaid = allUnits().filter(({ u, i }) => (u.st === "unpaid" || u.st === "rejected") && i.terms !== "cheque");
    const nextPay = unpaid[0];
    const tile = (v: string, n: number, lbl: string) => `<button data-act="go" data-v="${v}" class="${card} text-start transition hover:border-gold/50"><span class="flex h-10 w-10 items-center justify-center rounded-xl border border-gold/30 bg-gold/10 text-gold">${ic(v)}</span><p data-count="${n}" class="mt-4 text-3xl font-black text-gold-light">${nf.format(n)}</p><p class="mt-1 text-sm text-muted">${lbl}</p></button>`;
    const notes = myNotes().slice(0, 3);
    const threads = myThreads().slice(0, 3);
    const lastMsg = (th: Thread) => th.msgs[th.msgs.length - 1];
    const noteRows = notes.length ? notes.map((n) => `<button data-act="go" data-v="notes" class="flex w-full items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-start text-sm transition hover:border-gold/50"><span aria-hidden="true" class="mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.read ? "bg-white/20" : "bg-gold shadow-[0_0_8px_rgba(232,198,130,.8)]"}"></span><span class="flex-1 ${n.read ? "text-muted" : "text-text"}">${esc(n.t)}</span><span class="shrink-0 text-xs text-muted">${esc(n.d)}</span></button>`).join("") : empty("اعلان تازه‌ای نیست.");
    const msgRows = threads.length ? threads.map((th) => { const m = lastMsg(th); const u = th.unread[me]; return `<button data-act="dthread" data-id="${th.id}" class="flex w-full items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-start text-sm transition hover:border-gold/50"><span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-xs font-black text-gold">${esc((PEOPLE[other(th, me)].title || PEOPLE[other(th, me)].name).charAt(0))}</span><span class="min-w-0 flex-1"><span class="flex items-center justify-between gap-2"><b class="truncate">${person(other(th, me))}</b><span class="shrink-0 text-xs text-muted">${m ? esc(m.at) : ""}</span></span><span class="mt-0.5 block truncate text-muted">${m ? esc(m.file ? "📎 " + m.file : m.t) : "بدون پیام"}</span></span>${u ? `<span class="flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[11px] font-black text-midnight">${nf.format(u)}</span>` : ""}</button>`; }).join("") : empty("گفت‌وگویی وجود ندارد.");
    const more = (v: string, txt: string) => `<button data-act="go" data-v="${v}" class="mt-3 text-xs font-bold text-gold hover:underline">${txt} ‹</button>`;
    return head(`سلام، ${esc(o.session.name)}`, "خلاصه‌ی وضعیت شما. با کلیک روی هر کارت جزئیاتش را ببینید.") + `
    <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
      ${tile("projects", run.length, "پروژه‌ی در حال انجام")}${tile("order", active.length, "پکیج فعال")}${tile("finance", unpaid.length, "پرداخت باز")}${tile("messages", unreadMsgs(), "پیام خوانده‌نشده")}
    </div>
    <div class="mt-4 grid gap-4 md:grid-cols-2">
      <div class="${card}"><h2 class="flex items-center gap-2 font-black"><span class="text-gold">${ic("notes")}</span>آخرین اعلان‌ها</h2><div class="mt-3 grid gap-2">${noteRows}</div>${more("notes", "همه‌ی اعلان‌ها")}</div>
      <div class="${card}"><h2 class="flex items-center gap-2 font-black"><span class="text-gold">${ic("messages")}</span>آخرین پیام‌ها</h2><div class="mt-3 grid gap-2">${msgRows}</div>${more("messages", "همه‌ی پیام‌ها")}</div>
      <div class="${card}"><h2 class="font-black">پکیج‌های فعال</h2>
        ${active.length ? active.map((p) => `<div class="mt-4"><div class="flex items-center justify-between text-sm"><span>${esc(p.title)}</span><span class="text-xs text-muted">${nf.format(p.left)} روز مانده</span></div>${bar(((p.total - p.left) / p.total) * 100)}<button data-act="go" data-v="order" class="${btn} mt-3">تمدید</button></div>`).join("") : empty("پکیج فعالی ندارید.")}</div>
      <div class="${card}"><h2 class="font-black">پروژه‌های در حال انجام</h2>
        ${run.length ? run.map((p) => { const d = p.stages.filter((s) => s.done).length; return `<button data-act="open" data-id="${p.id}" class="mt-4 block w-full text-start"><div class="flex justify-between text-sm"><span>${esc(p.title)}</span><span class="text-xs text-muted">${nf.format(d)} از ${nf.format(p.stages.length)} مرحله</span></div>${bar((d / p.stages.length) * 100)}</button>`; }).join("") : empty("پروژه‌ی فعالی نیست.")}</div>
      <div class="${card}"><h2 class="font-black">پرداخت بعدی</h2>
        ${nextPay ? `<p class="mt-3 text-sm">${esc(nextPay.u.label)} — ${esc(nextPay.i.title)}</p><p class="mt-1 text-2xl font-black text-gold-light">${nf.format(nextPay.u.amount)} <span class="text-sm font-normal text-muted">میلیون تومان</span></p><p class="mt-1 text-xs text-muted">سررسید: ${esc(nextPay.u.due)}</p><button data-act="go" data-v="finance" class="${btn} mt-4">رفتن به امور مالی</button>` : `<div class="mt-3">${empty("پرداخت بازی ندارید.")}</div>`}</div>
      <div class="${card}"><h2 class="font-black">میانبرها</h2><div class="mt-3 grid grid-cols-2 gap-2 text-sm">
        ${([["order", "سفارش جدید"], ["files", "فایل‌ها"], ["messages", "پیام به مجری"], ["finance", "امور مالی"]] as const).map(([v, l]) => `<button data-act="go" data-v="${v}" class="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 text-start transition hover:border-gold/50"><span class="text-gold">${ic(v)}</span>${l}</button>`).join("")}</div></div>
    </div>`;
  }

  function dashCeo() {
    const pend = D.users.filter((u) => u.st === "pending").length;
    const rc = allUnits().filter(({ u }) => u.st === "pending").length;
    const aw = D.projects.reduce((n, p) => n + p.deliveries.filter((d) => d.st === "await").length, 0);
    const tile = (v: string, big: number, t: string) => `<button data-act="go" data-v="${v}" class="${card} text-start transition hover:border-gold/50"><span class="flex h-10 w-10 items-center justify-center rounded-xl border border-gold/30 bg-gold/10 text-gold">${ic(v)}</span><p data-count="${big}" class="mt-4 text-4xl font-black text-gold-light">${nf.format(big)}</p><p class="mt-2 text-sm text-muted">${t}</p></button>`;
    return head("پیشخوان مدیرعامل", "چیزهایی که به تصمیم شما نیاز دارند.") + `<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      ${tile("users", pend, "حساب منتظر تأیید")}${tile("receipts", rc, "رسید منتظر بررسی")}${tile("projects", aw, "تحویل منتظر تأیید مشتری")}${tile("messages", unreadMsgs(), "پیام خوانده‌نشده")}</div>
      <div class="${card} mt-4"><h2 class="font-black">آخرین رویدادها</h2><div class="mt-3 grid gap-2 text-sm">${D.audit.slice(0, 5).map((a) => `<p class="flex justify-between gap-3 rounded-xl bg-white/[0.03] px-4 py-2"><span>${esc(a.act)} ${a.target !== "—" ? "· " + esc(a.target) : ""}</span><span class="text-xs text-muted">${esc(a.at)}</span></p>`).join("")}</div></div>`;
  }

  /* Timeline: horizontal on wide screens, vertical on phones */
  function stepper(p: Project) {
    const n = p.stages.length;
    const items = p.stages.map((s, i) => {
      const cur = !s.done && p.stages.slice(0, i).every((x) => x.done);
      const dot = s.done ? "border-emerald-400 bg-emerald-400 text-midnight" : cur ? "border-gold bg-gold text-midnight shadow-[0_0_18px_rgba(232,198,130,.55)]" : "border-white/20 bg-[#0b0e27] text-muted";
      const line = i < n - 1 ? `<span aria-hidden="true" class="pn-line absolute start-[15px] top-8 h-[calc(100%-1rem)] w-0.5 md:start-1/2 md:top-[15px] md:h-0.5 md:w-full ${s.done ? "bg-gradient-to-b from-emerald-400 to-emerald-400/60 md:bg-gradient-to-l" : "bg-white/10"}"></span>` : "";
      const node = `<span class="relative z-[1] flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-black ${dot}">${s.done ? "✓" : nf.format(i + 1)}</span>`;
      const label = `<span class="text-sm md:mt-2 ${cur ? "font-bold text-gold-light" : s.done ? "text-text" : "text-muted"}">${esc(s.n)}</span><span class="hidden text-[11px] md:block ${cur ? "text-gold" : "text-muted"}">${s.done ? "انجام شد" : cur ? "در حال انجام" : "در انتظار"}</span>`;
      const inner = `${line}${node}<span class="flex flex-col md:items-center">${label}</span>`;
      const cls = "relative flex items-start gap-3 pb-7 md:flex-1 md:flex-col md:items-center md:pb-0 md:text-center";
      return isCeo ? `<li class="${cls}"><button data-act="stage" data-id="${p.id}" data-i="${i}" class="contents">${inner}</button></li>` : `<li class="${cls}">${inner}</li>`;
    }).join("");
    return `<ol class="mt-5 flex flex-col md:flex-row">${items}</ol>${isCeo ? `<p class="mt-3 text-xs text-muted">برای تغییر مرحله روی آن بزنید.</p>` : ""}`;
  }

  function calendar(p: Project) {
    const y = S.cy, m = S.cm, len = jMonthLen(y, m), off = weekCol(y, m, 1);
    const cells: string[] = [];
    for (let i = 0; i < off; i++) cells.push(`<div></div>`);
    for (let d = 1; d <= len; d++) {
      const evs = p.events[ek(y, m, d)] ?? [];
      const isToday = y === today.jy && m === today.jm && d === today.jd;
      const sel = S.day === d;
      const cls = sel ? "border-gold bg-gold/15" : evs.length ? "border-gold/30 bg-white/[0.05] hover:border-gold" : "border-white/5 bg-white/[0.02]";
      cells.push(`<button data-act="day" data-d="${d}" class="flex min-h-14 flex-col items-center gap-0.5 rounded-xl border p-1 text-xs transition sm:min-h-20 sm:items-start sm:p-2 ${cls}"><span class="${isToday ? "flex h-6 w-6 items-center justify-center rounded-full bg-gold font-black text-midnight" : "font-bold"}">${nf.format(d)}</span>${evs.slice(0, 2).map((e) => `<span class="hidden w-full truncate text-[10px] text-gold-light sm:block">${esc(e.title)}</span>`).join("")}${evs.length ? `<span class="flex gap-0.5 sm:hidden">${evs.map(() => `<i class="h-1.5 w-1.5 rounded-full bg-gold"></i>`).join("")}</span>` : ""}${evs.length > 2 ? `<span class="hidden text-[10px] text-muted sm:block">+${nf.format(evs.length - 2)}</span>` : ""}</button>`);
    }
    const detail = S.day ? dayDetail(p, y, m, S.day) : `<p class="mt-4 text-center text-sm text-muted">روی یک روز بزنید تا کارهای آن روز را ببینید.</p>`;
    return `<div class="${card} mt-4"><div class="flex items-center justify-between gap-3"><h3 class="font-black">تقویم محتوا</h3>
      <div class="flex items-center gap-2"><button data-act="cal" data-d="-1" class="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 hover:border-gold" aria-label="ماه قبل">${I_CHEV_R}</button><span class="min-w-28 text-center text-sm font-bold">${MONTHS[m - 1]} ${nf.format(y).replace(/٬/g, "")}</span><button data-act="cal" data-d="1" class="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 hover:border-gold" aria-label="ماه بعد">${I_CHEV_L}</button></div></div>
      <div class="mt-4 grid grid-cols-7 gap-1 text-center text-[11px] text-muted sm:gap-1.5">${WEEKDAYS.map((w) => `<div class="pb-1 font-bold">${w}</div>`).join("")}${cells.join("")}</div>${detail}</div>`;
  }

  function dayDetail(p: Project, y: number, m: number, d: number) {
    const evs = p.events[ek(y, m, d)] ?? [];
    const body = evs.length ? evs.map((e) => `<div class="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <div class="flex flex-wrap items-center justify-between gap-2"><p><span class="text-xs text-gold">${esc(e.kind)}</span><span class="mx-2 text-white/20">|</span><span class="font-black">${esc(e.title)}</span></p><span class="rounded-full border border-white/15 px-3 py-0.5 text-[11px] text-muted">${esc(e.st)}</span></div>
        <p class="mt-2 text-sm leading-7 text-white/70">${esc(e.detail)}</p>
        <div class="mt-3 grid gap-2">${e.comments.map((c) => `<div class="rounded-lg bg-black/25 px-3 py-2 text-sm"><p class="text-[11px] ${nameColor(c.from)}">${tag(c.from)} · ${esc(c.at)}</p><p class="mt-0.5 whitespace-pre-wrap">${esc(c.t)}</p></div>`).join("")}</div>
        <div data-wrap class="mt-3 flex items-end gap-2"><textarea data-f="ec-${e.id}" rows="1" class="${input} resize-none" placeholder="${isCeo ? "پاسخ یا نظر…" : "نظر شما برای مجری…"}"></textarea><button data-act="ecomment" data-p="${p.id}" data-k="${ek(y, m, d)}" data-id="${e.id}" class="js-send ${btnGold} shrink-0">ثبت نظر</button></div></div>`).join("") : empty("برای این روز کاری ثبت نشده.");
    return `<div class="mt-5 border-t border-white/10 pt-4"><h4 class="text-lg font-black text-gold-light">${fullDay(y, m, d)}</h4><p class="mb-3 mt-1 text-xs text-muted">نظر شما برای مجری ارسال می‌شود و مدیرعامل همه‌چیز را می‌بیند.</p><div class="grid gap-3">${body}</div></div>`;
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
      ${head(esc(p.title), `${esc(p.service)} · مجری: ${person("staff")}`)}
      <div class="${card}"><h3 class="font-black">مراحل پروژه</h3>${stepper(p)}</div>
      ${p.calendar ? calendar(p) : ""}
      <div class="${card} mt-4"><h3 class="font-black">گزارش‌های مجری</h3><div class="mt-3 grid gap-2">${rep.length ? rep.map((r) => `<div class="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm"><div class="flex justify-between text-xs text-muted"><span>${esc(r.d)}</span>${r.vis ? "" : `<span class="text-amber">فقط داخلی</span>`}</div><p class="mt-1">${esc(r.t)}</p></div>`).join("") : empty("هنوز گزارشی ثبت نشده.")}</div></div>
      <div class="${card} mt-4"><h3 class="font-black">تحویل‌ها</h3><div class="mt-3 grid gap-2">${deliv || empty("تحویلی وجود ندارد.")}</div></div>${rate}${cross}`;
  }

  function projects() {
    if (S.pid) { const p = D.projects.find((x) => x.id === S.pid); if (p) return projectDetail(p); }
    return head("پروژه‌ها", isCeo ? "همه‌ی پروژه‌ها" : "پروژه‌ها و پکیج‌های شما") + `<div class="grid gap-4 md:grid-cols-2">${D.projects.map((p) => { const d = p.stages.filter((s) => s.done).length; return `<button data-act="open" data-id="${p.id}" class="${card} text-start transition hover:border-gold/50"><h2 class="font-black">${esc(p.title)}</h2><p class="mt-1 text-xs text-muted">${esc(p.service)}</p>${bar((d / p.stages.length) * 100)}<p class="mt-2 text-xs text-muted">${nf.format(d)} از ${nf.format(p.stages.length)} مرحله</p></button>`; }).join("")}</div>`;
  }

  /* ----- messages ----- */
  const other = (t: Thread, viewer: Party): Party => (t.a === viewer ? t.b : t.a);
  function messages() {
    let ts: Thread[]; let monitor = false;
    if (isCeo) {
      ts = S.mtab === "staff" ? D.threads.filter((t) => t.a === "ceo" && t.b === "staff") : S.mtab === "client" ? D.threads.filter((t) => (t.a === "client" && t.b === "ceo") || (t.a === "ceo" && t.b === "client")) : D.threads.filter((t) => t.a === "client" && t.b === "staff");
      monitor = S.mtab === "watch";
    } else ts = myThreads();
    const t = ts.find((x) => x.id === S.tid) ?? ts[0];
    const label = (x: Thread) => (monitor ? `${person("client")} ⟷ ${person("staff")}` : person(other(x, me)));
    const tabs = isCeo ? `<div class="mb-4 grid gap-1 rounded-2xl border border-white/10 bg-black/20 p-1 sm:grid-cols-3">${([["staff", "گفت‌وگو با مجریان"], ["client", "گفت‌وگو با مشتریان"], ["watch", "نظارت: مجریان و مشتریان"]] as const).map(([k, tt]) => `<button data-act="mtab" data-id="${k}" class="rounded-xl px-3 py-2 text-sm font-bold ${S.mtab === k ? "bg-gold/15 text-gold-light" : "text-muted"}">${tt}</button>`).join("")}</div>` : "";
    const sub = isCeo ? (S.mtab === "staff" ? "چت‌های شما با مجریان" : S.mtab === "client" ? "پیام‌های شما با مشتریان" : "همه‌ی گفت‌وگوهای بین مجریان و مشتریان (فقط خواندنی)") : "";
    if (!t) return head("پیام‌ها", sub) + tabs + empty("گفت‌وگویی وجود ندارد.");
    const list = ts.map((x) => { const u = x.unread[me]; return `<button data-act="thread" data-id="${x.id}" class="flex w-full items-center justify-between gap-2 rounded-xl border px-4 py-3 text-start text-sm ${x.id === t.id ? "border-gold/60 bg-gold/10" : "border-white/10"}"><span class="flex flex-wrap items-center gap-x-2 gap-y-1">${label(x)}</span>${badge(u)}</button>`; }).join("");
    const bubbles = t.msgs.map((m) => `<div class="flex ${monitor ? (m.from === "client" ? "justify-start" : "justify-end") : m.from === me ? "justify-start" : "justify-end"}"><div class="max-w-[82%] rounded-2xl px-4 py-2 text-sm ${m.from === me && !monitor ? "border border-gold/30 bg-gold/15" : "border border-white/10 bg-white/[0.06]"}"><p class="mb-0.5 text-[11px] font-bold ${nameColor(m.from)}">${tag(m.from)}</p><p class="whitespace-pre-wrap">${esc(m.t)}</p>${m.file ? `<p class="mt-1 text-xs text-gold-light">📎 ${esc(m.file)}</p>` : ""}<p class="mt-1 text-[10px] text-muted">${esc(m.at)}</p></div></div>`).join("");
    const draft = D.drafts[t.id] ?? "";
    const composer = monitor ? `<p class="mt-4 rounded-xl border border-white/10 p-3 text-center text-xs text-muted">این گفت‌وگو فقط برای نظارت است.</p>` : `<div data-wrap class="mt-4 flex items-end gap-2 rounded-3xl border border-white/10 bg-white/[0.04] p-2">
        <label class="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted transition hover:text-gold" aria-label="پیوست">${I_CLIP}<input data-act="attach" data-id="${t.id}" type="file" accept="image/*,application/pdf" class="hidden"></label>
        <textarea data-f="draft" data-t="${t.id}" rows="1" class="max-h-32 min-h-10 flex-1 resize-none bg-transparent px-1 py-2.5 text-sm text-text outline-none placeholder:text-muted" placeholder="پیام…">${esc(draft)}</textarea>
        <span data-sendslot>${sendBtn(t.id, draft.trim().length > 0)}</span></div>
        <p class="mt-2 text-[11px] text-muted">پیوست تا ۳ مگابایت · پیام صوتی تا ۲ دقیقه</p>`;
    return head("پیام‌ها", sub) + tabs + `<div class="grid gap-4 md:grid-cols-[17rem_1fr]">
      <div class="grid content-start gap-2">${list}</div>
      <div class="${card} flex min-h-[26rem] flex-col"><div class="mb-3 flex flex-wrap items-center gap-2 border-b border-white/10 pb-3 text-sm">${label(t)}</div><div class="flex-1 space-y-2 overflow-y-auto">${bubbles}</div>${composer}</div></div>`;
  }

  function files() {
    const rows: { n: string; w: string }[] = [];
    allUnits().forEach(({ u }) => u.file && rows.push({ n: u.file, w: "رسید پرداخت" }));
    D.threads.forEach((t) => (t.a === me || t.b === me) && t.msgs.forEach((m) => m.file && rows.push({ n: m.file, w: "پیوست پیام" })));
    D.projects.forEach((p) => p.deliveries.filter((d) => d.st === "ok").forEach((d) => rows.push({ n: d.title, w: "تحویل تأییدشده" })));
    return head("فایل‌ها", "همه‌ی فایل‌های شما در یک‌جا") + (rows.length ? `<div class="grid gap-2">${rows.map((r) => `<div class="${card} flex items-center justify-between text-sm"><span>📄 ${esc(r.n)}</span><span class="text-xs text-muted">${r.w}</span></div>`).join("")}</div>` : empty("هنوز فایلی نیست."));
  }

  /* ----- finance ----- */
  const copy = (v: string) => `<button data-act="copy" data-v="${esc(v)}" class="rounded-full border border-white/15 px-2.5 py-0.5 text-[11px] text-muted transition hover:border-gold hover:text-gold">کپی</button>`;
  function accountBlock(a: Account) {
    return `<div class="rounded-xl border border-gold/25 bg-gold/5 p-4 text-sm">
      <p class="flex flex-wrap items-center gap-2"><span class="text-xs text-muted">شماره کارت</span><span dir="ltr" class="font-latin tracking-wider">${esc(a.card)}</span>${copy(a.card)}</p>
      <p class="mt-2 flex flex-wrap items-center gap-2"><span class="text-xs text-muted">شماره شبا</span><span dir="ltr" class="font-latin tracking-wider">${esc(a.sheba)}</span>${copy(a.sheba)}</p>
      <p class="mt-3 border-t border-white/10 pt-3 font-bold">${esc(a.holder)} <span class="text-xs font-normal text-muted">· ${esc(a.bank)}</span></p></div>`;
  }
  function unitRow(i: Invoice, u: Unit) {
    const paying = S.payFor === u.id;
    const canPay = (u.st === "unpaid" || u.st === "rejected") && (i.terms === "cash" || i.terms === "inst");
    const info = u.note ? `<p class="mt-1 text-xs text-muted">${esc(u.note)}</p>` : "";
    const done = u.st === "pending" || u.st === "paid" ? `<p class="mt-2 text-xs text-muted">${u.method ? esc(u.method) : ""}${u.track ? ` · شماره پیگیری: <span dir="ltr">${esc(u.track)}</span>` : ""}${u.file ? ` · 📎 ${esc(u.file)}` : ""}</p>` : "";
    const rej = u.st === "rejected" ? `<p class="mt-2 text-xs text-red-300">دلیل رد: ${esc(u.reason ?? "")}</p>` : "";
    const method = S.payMethod;
    const form = paying ? `<div class="mt-3 rounded-xl border border-white/10 bg-black/20 p-4"><p class="text-sm font-bold">نحوه‌ی پرداخت</p>
        <div class="mt-2 flex flex-wrap gap-2">${i.methods.map((m) => `<button data-act="pm" data-id="${esc(m)}" class="rounded-full border px-4 py-1.5 text-xs font-bold ${method === m ? "border-gold bg-gold/15 text-gold-light" : "border-white/15 text-muted"}">${esc(m)}</button>`).join("")}</div>
        ${method ? `<div class="mt-3 grid gap-3">${accountBlock(acc(i.accountId))}
          <label class="block text-xs text-muted">شماره پیگیری<input data-f="track" dir="ltr" class="${input} mt-1" placeholder="شماره پیگیری تراکنش"></label>
          <label class="block text-xs text-muted">عکس رسید<input data-f="payfile" type="file" accept="image/*,application/pdf" class="${input} mt-1 text-xs"></label>
          <div class="flex gap-2"><button data-act="paysend" data-id="${u.id}" class="${btnGold}">ثبت پرداخت</button><button data-act="paycancel" class="${btn}">انصراف</button></div></div>` : `<p class="mt-3 text-xs text-muted">یکی از روش‌ها را انتخاب کنید.</p>`}</div>` : "";
    return `<div class="rounded-xl border border-white/10 bg-white/[0.03] p-4"><div class="flex flex-wrap items-center justify-between gap-3 text-sm"><span class="font-bold">${esc(u.label)}: ${nf.format(u.amount)} میلیون تومان</span>${chip(u.st)}</div><p class="mt-1 text-xs text-muted">سررسید: ${esc(u.due)}</p>${info}${rej}${done}
      ${canPay && !paying ? `<button data-act="pay" data-id="${u.id}" class="${btnGold} mt-3">پرداخت</button>` : ""}${i.terms === "cheque" ? `<p class="mt-2 text-xs text-muted">چک را مدیرعامل ثبت و وصول می‌کند.</p>` : ""}${i.terms === "credit" ? `<p class="mt-2 text-xs text-muted">سرویس اعتباری؛ تسویه طبق توافق.</p>` : ""}${form}</div>`;
  }
  function invoiceBox(i: Invoice) {
    const paid = i.units.filter((u) => u.st === "paid").length;
    return `<div class="mb-8 overflow-hidden rounded-3xl border border-white/15 bg-white/[0.05] shadow-[0_0_40px_-18px_rgba(232,198,130,.5)]">
      <div class="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 bg-gradient-to-l from-gold/10 to-transparent p-5">
        <div><p class="text-xs text-muted">فاکتور شماره <span dir="ltr">${esc(i.no)}</span> · صدور: ${esc(i.issued)}</p><h2 class="mt-1 text-lg font-black">${esc(i.title)}</h2></div>
        <div class="text-end"><p class="text-xl font-black text-gold-light">${nf.format(invTotal(i))} <span class="text-xs font-normal text-muted">میلیون تومان</span></p><p class="mt-1 text-xs text-muted">شرایط پرداخت: <span class="font-bold text-text">${TERMS_FA[i.terms]}</span> · ${nf.format(paid)} از ${nf.format(i.units.length)} پرداخت‌شده</p></div></div>
      <div class="p-5"><div class="grid gap-3">${i.units.map((u) => unitRow(i, u)).join("")}</div>
        <button data-act="invview" data-id="${i.id}" class="${btn} mt-4">مشاهده‌ی فاکتور</button></div></div>`;
  }
  function invoiceModal() {
    const i = D.invoices.find((x) => x.id === S.invView); if (!i) return "";
    return `<div class="fixed inset-0 z-[66] flex items-center justify-center overflow-y-auto bg-black/60 p-4"><div class="${card} w-full max-w-lg bg-[#0b0e27]"><div class="flex items-start justify-between gap-3"><div><p class="text-xs text-muted">فاکتور غیررسمی · شماره <span dir="ltr">${esc(i.no)}</span></p><h3 class="mt-1 text-lg font-black">${esc(i.title)}</h3><p class="mt-1 text-xs text-muted">تاریخ صدور: ${esc(i.issued)}</p></div><button data-act="invclose" class="rounded-full border border-white/15 px-3 py-1 text-xs">بستن</button></div>
      <div class="mt-4 divide-y divide-white/10 text-sm">${i.lines.map((l) => `<div class="flex justify-between py-2"><span>${esc(l.t)}</span><span>${nf.format(l.amt)} میلیون تومان</span></div>`).join("")}<div class="flex justify-between py-3 font-black text-gold-light"><span>جمع کل</span><span>${nf.format(invTotal(i))} میلیون تومان</span></div></div>
      <p class="text-xs text-muted">شرایط پرداخت: ${TERMS_FA[i.terms]} · قالب نهایی فاکتور در انتظار فایل مالک</p></div></div>`;
  }
  function finance() {
    const a = acc(D.defaultAccount);
    return head("امور مالی") +
      `<div class="${card} mb-8"><h2 class="mb-3 font-black">حساب مقصد واریز</h2>${accountBlock(a)}</div>` + D.invoices.map(invoiceBox).join("");
  }

  /* ----- CEO: invoices, receipts, accounts ----- */
  function receipts() {
    const boxes = D.invoices.map((i) => `<div class="mb-8 overflow-hidden rounded-3xl border border-white/15 bg-white/[0.05]">
      <div class="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 bg-gradient-to-l from-gold/10 to-transparent p-5"><div><p class="text-xs text-muted">فاکتور <span dir="ltr">${esc(i.no)}</span> · ${esc(i.issued)}</p><h2 class="mt-1 text-lg font-black">${esc(i.title)}</h2></div><p class="text-xl font-black text-gold-light">${nf.format(invTotal(i))} <span class="text-xs font-normal text-muted">میلیون تومان</span></p></div>
      <div class="grid gap-4 p-5 md:grid-cols-3"><label class="block text-xs text-muted">شرایط پرداخت<select data-act="terms" data-id="${i.id}" class="mt-1 w-full rounded-xl border border-white/15 bg-midnight px-3 py-2 text-sm text-text">${(Object.keys(TERMS_FA) as Terms[]).map((k) => `<option value="${k}" ${i.terms === k ? "selected" : ""}>${TERMS_FA[k]}</option>`).join("")}</select></label>
        <label class="block text-xs text-muted">حساب مقصد<select data-act="invacc" data-id="${i.id}" class="mt-1 w-full rounded-xl border border-white/15 bg-midnight px-3 py-2 text-sm text-text">${D.accounts.filter((a) => a.on || a.id === i.accountId).map((a) => `<option value="${a.id}" ${i.accountId === a.id ? "selected" : ""}>${esc(a.label)}</option>`).join("")}</select></label>
        <div class="text-xs text-muted">روش‌های مجاز پرداخت<div class="mt-2 flex flex-wrap gap-2">${ALL_METHODS.map((m) => `<button data-act="method" data-id="${i.id}" data-m="${esc(m)}" class="rounded-full border px-3 py-1 text-xs font-bold ${i.methods.includes(m) ? "border-gold bg-gold/15 text-gold-light" : "border-white/15 text-muted"}">${esc(m)}</button>`).join("")}</div></div></div>
      <div class="grid gap-3 px-5 pb-5">${i.units.map((u) => `<div class="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm"><div class="flex flex-wrap items-center justify-between gap-3"><span class="font-bold">${esc(u.label)}: ${nf.format(u.amount)} میلیون تومان</span>${chip(u.st)}</div>${u.method || u.track || u.file ? `<p class="mt-1 text-xs text-muted">${esc(u.method ?? "")}${u.track ? ` · شماره پیگیری: <span dir="ltr">${esc(u.track)}</span>` : ""}${u.file ? ` · 📎 ${esc(u.file)}` : ""}</p>` : ""}
        ${u.st === "pending" ? `<div class="mt-3 flex flex-wrap items-center gap-2"><button data-act="rok" data-id="${u.id}" class="${btnGold}">تأیید رسید</button><button data-act="rno" data-id="${u.id}" class="${btn}">رد با دلیل</button></div>` : ""}
        ${S.rejectFor === u.id ? `<div class="mt-3 flex gap-2"><input data-f="reason" class="${input}" placeholder="دلیل رد"><button data-act="rsend" data-id="${u.id}" class="${btn}">ثبت</button></div>` : ""}</div>`).join("")}</div></div>`).join("");
    return head("فاکتورها و رسیدها", "شرایط پرداخت هر فاکتور را تعیین کنید (بعداً هم قابل تغییر است)؛ رسیدهای ثبت‌شده را تأیید یا با دلیل رد کنید.") + boxes + `<p class="text-xs text-muted">ساخت فاکتور و اقساط: در انتظار فایل قالب فاکتور مالک.</p>`;
  }
  function accounts() {
    const f = (a: Account, k: keyof Account, label: string, ltr = false) => `<label class="block text-xs text-muted">${label}<input data-acc="${a.id}" data-field="${k}" ${ltr ? 'dir="ltr"' : ""} value="${esc(String(a[k]))}" class="${input} mt-1"></label>`;
    return head("کارت‌ها و حساب‌های بانکی", "چند حساب ثبت کنید و برای هر فاکتور یا هر مشتری هر زمان خواستید تغییر دهید.") + `<div class="grid gap-4">${D.accounts.map((a) => `<div class="${card} ${a.on ? "" : "opacity-60"}"><div class="flex flex-wrap items-center justify-between gap-3"><h2 class="font-black">${esc(a.label)} ${a.id === D.defaultAccount ? `<span class="me-2 rounded-full border border-gold/50 px-2 py-0.5 text-[10px] text-gold">پیش‌فرض مشتری نمونه</span>` : ""}</h2><div class="flex gap-2">${a.id !== D.defaultAccount ? `<button data-act="accdef" data-id="${a.id}" class="${btn}">پیش‌فرض مشتری</button>` : ""}<button data-act="acctoggle" data-id="${a.id}" class="${btn}">${a.on ? "غیرفعال" : "فعال"}</button></div></div>
      <div class="mt-3 grid gap-3 sm:grid-cols-2">${f(a, "label", "عنوان")}${f(a, "holder", "نام صاحب حساب")}${f(a, "bank", "بانک")}${f(a, "card", "شماره کارت", true)}${f(a, "sheba", "شماره شبا", true)}</div></div>`).join("")}</div><button data-act="accadd" class="${btnGold} mt-4">افزودن کارت</button>`;
  }

  function order() {
    return head("سفارش جدید", "خدمت یا پکیج تازه سفارش دهید یا پکیج فعالتان را تمدید کنید.") + `<div class="grid gap-4 sm:grid-cols-2">${o.services.map((s) => `<div class="${card}"><h2 class="font-black">${esc(s.name)}</h2><p class="mt-1 text-sm text-muted">${esc(s.line)}</p><div class="mt-3 flex gap-2"><button data-act="order" data-id="${esc(s.name)}" class="${btnGold}">ثبت درخواست</button>${s.id === "growth" ? `<button data-act="renew" class="${btn}">تمدید پکیج</button>` : ""}</div></div>`).join("")}</div>`;
  }

  function notes() {
    const ns = myNotes();
    return head("اعلان‌ها") + `<div class="grid gap-2">${ns.length ? ns.map((n) => `<button data-act="read" data-id="${n.id}" class="${card} flex items-center justify-between gap-3 text-start text-sm ${S.fresh.includes(n.id) ? "border-gold/40" : "opacity-60"}"><span>${esc(n.t)}</span><span class="shrink-0 text-xs text-muted">${esc(n.d)}</span></button>`).join("") : empty("اعلانی نیست.")}</div>`;
  }

  function account() {
    return head("حساب کاربری") + `<div class="grid gap-4 md:grid-cols-2"><div class="${card} text-sm"><p><span class="text-muted">نام:</span> ${esc(o.session.name)}</p><p class="mt-2"><span class="text-muted">شناسه:</span> <span dir="ltr">${esc(o.session.id)}</span></p><p class="mt-2"><span class="text-muted">نقش:</span> ${ROLE_FA[role]}</p>
      <p class="mt-4 text-xs text-muted">ورود دومرحله‌ای (TOTP، بدون پیامک) در نسخه‌ی واقعی: ${isCeo ? "اجباری" : "اختیاری"}.</p></div>
      <div class="${card}"><h2 class="font-black">آموزش</h2><p class="mt-1 text-sm text-muted">راهنمای ۵ مرحله‌ای با نشان دادن تب‌ها؛ هر زمان می‌توانید دوباره ببینید.</p>${isCeo ? "" : `<button data-act="tour" class="${btnGold} mt-3">شروع آموزش</button>`}
      <button data-act="reset" class="${btn} mt-3 block">بازنشانی داده‌های نمایشی</button></div></div>`;
  }

  function users() {
    const row = (u: User) => `<div class="${card} flex flex-wrap items-center justify-between gap-3 text-sm"><div><p class="font-bold">${esc(u.name)}</p><p class="text-xs text-muted"><span dir="ltr">${esc(u.id)}</span> · ${u.emailOk ? "ایمیل تأییدشده" : "ایمیل تأییدنشده"} · ${ROLE_FA[u.role]}</p></div>
      <div class="flex flex-wrap items-center gap-2"><span class="rounded-full border px-3 py-1 text-[11px] font-bold ${u.st === "active" ? UNIT_CLS.paid : u.st === "pending" ? UNIT_CLS.pending : UNIT_CLS.rejected}">${u.st === "active" ? "فعال" : u.st === "pending" ? "منتظر تأیید" : "غیرفعال"}</span>
      ${u.st === "pending" ? `<button data-act="uok" data-id="${u.id}" class="${btnGold}">تأیید حساب</button><button data-act="uno" data-id="${u.id}" class="${btn}">رد</button>` : role === "ceo" && u.role !== "ceo" ? `<select data-act="urole" data-id="${u.id}" class="rounded-full border border-white/15 bg-midnight px-3 py-1.5 text-xs">${(["client", "staff", "admin"] as Role[]).map((r) => `<option value="${r}" ${u.role === r ? "selected" : ""}>${ROLE_FA[r]}</option>`).join("")}</select>` : ""}</div></div>`;
    return head("کاربران و حساب‌ها", "فقط ایمیل‌تأییدشده‌ها وارد صف تأیید می‌شوند. ارتقای نقش فقط توسط مدیرعامل.") + `<div class="grid gap-2">${D.users.map(row).join("")}</div>`;
  }

  function auditView() {
    return head("لاگ ممیزی", "فقط افزودنی؛ هیچ ردیفی قابل ویرایش یا حذف نیست.") + `<div class="grid gap-2">${D.audit.map((a) => `<div class="${card} flex flex-wrap justify-between gap-2 text-sm"><span>${esc(a.who)} · ${esc(a.act)} ${a.target !== "—" ? "· " + esc(a.target) : ""}</span><span class="text-xs text-muted">${esc(a.at)}</span></div>`).join("")}</div>`;
  }

  function money() {
    return head("امور مالی مدیرعامل") + `<div class="${card} text-center"><p class="text-3xl">🔒</p><p class="mt-3 font-bold">این بخش فقط برای مدیرعامل است</p><p class="mt-2 text-sm text-muted">سود، هزینه‌ها و حقوق کارکنان را مالک خودش کامل می‌کند. فعلاً فقط مسیر محافظت‌شده و بررسی نقش وجود دارد؛ هیچ داده‌ای ساخته نشده است.</p></div>`;
  }

  const VIEWS: Record<string, () => string> = {
    dash: () => (isCeo ? dashCeo() : dashClient()), projects, messages, files, finance, order, notes, account, users, receipts, accounts, audit: auditView, money, invoices: () => `<div data-inv-root></div>`,
  };

  function tourHtml() {
    if (S.tour === -2) return `<div class="fixed inset-0 z-[65] flex items-end justify-center bg-black/60 p-4 sm:items-center"><div class="${card} max-w-sm bg-[#0b0e27] text-center"><p class="text-lg font-black">خوش آمدید</p><p class="mt-2 text-sm text-muted">می‌خواهید یک آموزش کوتاه ۵ مرحله‌ای با نشان دادن تب‌ها ببینید؟</p><div class="mt-4 flex justify-center gap-2"><button data-act="tourgo" class="${btnGold}">شروع آموزش</button><button data-act="tourlater" class="${btn}">بعداً</button></div></div></div>`;
    if (S.tour >= 0) {
      const s = TOUR[S.tour];
      return `<div class="fixed inset-0 z-[63]"></div><div id="tour-ring" class="pointer-events-none fixed z-[64] rounded-xl ring-2 ring-gold" style="box-shadow:0 0 0 9999px rgba(3,4,12,.74),0 0 24px rgba(232,198,130,.6);transition:all .35s"></div>
      <div id="tour-tip" class="${card} fixed z-[65] w-72 bg-[#0b0e27]" style="max-width:calc(100vw - 24px)"><p class="text-xs text-muted">مرحله ${nf.format(S.tour + 1)} از ${nf.format(TOUR.length)}</p><p class="mt-1 text-lg font-black text-gold-light">${s.t}</p><p class="mt-2 text-sm leading-7 text-muted">${s.d}</p><div class="mt-4 flex gap-2"><button data-act="tournext" class="${btnGold}">${S.tour === TOUR.length - 1 ? "پایان" : "بعدی"}</button><button data-act="tourclose" class="${btn}">بستن</button></div></div>`;
    }
    return "";
  }

  function placeTour() {
    if (S.tour < 0) return;
    const el = root.querySelector<HTMLElement>(`nav [data-v="${TOUR[S.tour].k}"]`);
    const ring = root.querySelector<HTMLElement>("#tour-ring"), tip = root.querySelector<HTMLElement>("#tour-tip");
    if (!el || !ring || !tip) return;
    el.scrollIntoView({ block: "nearest", inline: "center" });
    const r = el.getBoundingClientRect();
    ring.style.left = r.left - 6 + "px"; ring.style.top = r.top - 6 + "px"; ring.style.width = r.width + 12 + "px"; ring.style.height = r.height + 12 + "px";
    const w = tip.offsetWidth;
    let left = r.left - w - 20, top = r.top - 6;
    if (left < 12) { left = Math.min(Math.max(12, r.left + r.width / 2 - w / 2), window.innerWidth - w - 12); top = r.bottom + 16; }
    tip.style.left = left + "px"; tip.style.top = Math.max(12, Math.min(top, window.innerHeight - tip.offsetHeight - 12)) + "px";
  }

  const isMobile = () => window.matchMedia("(max-width: 767px)").matches;
  let mobile = isMobile();
  let built = "";
  let navReady = false;
  const navBadge = (k: string) => (k === "messages" ? unreadMsgs() : k === "notes" ? unreadNotes() : k === "users" ? D.users.filter((u) => u.st === "pending").length : k === "receipts" ? allUnits().filter(({ u }) => u.st === "pending").length : 0);
  const navItems = () => nav.map(([k, t]) => {
    const on = S.view === k;
    return `<button data-act="go" data-v="${k}" ${on ? 'aria-current="page"' : ""} class="relative z-[1] flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm ${on ? "font-black text-gold-light" : "text-muted hover:text-text"}">${ic(k, on && S.anim ? "pn-ic-pop" : "")}<span class="flex-1 text-start">${t}</span>${badge(navBadge(k), S.anim)}</button>`;
  }).join("");
  const brandHtml = (closeBtn: boolean) => `<div class="flex items-start justify-between gap-3"><div><p class="text-lg font-black"><span class="gold-text">شباهنگ</span></p><p class="mt-1 text-xs text-muted">${esc(o.session.name)} · ${ROLE_FA[role]}</p></div>${closeBtn ? `<button data-act="menu" aria-label="بستن منو" class="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-muted">${I_X}</button>` : ""}</div>`;
  /* the gold pill lives outside the re-rendered items, so it can glide from tab to tab */
  const navShell = `<nav aria-label="پنل" class="mt-4 flex-1 overflow-y-auto"><div class="relative"><i data-pill aria-hidden="true" class="pointer-events-none absolute inset-x-0 top-0 h-11 rounded-xl border border-gold/50 bg-gradient-to-l from-gold/25 to-gold/5 opacity-0 shadow-[0_0_22px_-8px_rgba(232,198,130,.7)] transition-[top,height,opacity] duration-[450ms] ease-[cubic-bezier(.34,1.3,.64,1)]"><b class="absolute inset-y-2.5 start-0 w-1 rounded-full bg-gold"></b></i><div data-slot="items" class="relative space-y-1"></div></div></nav>`;
  const footHtml = `<a href="${o.siteHref}" class="mt-3 flex w-full shrink-0 items-center justify-center rounded-xl border border-white/10 px-4 py-2.5 text-sm text-muted hover:border-gold/50 hover:bg-gold/10 hover:text-gold">صفحه‌ی اصلی سایت</a>
    <button data-act="logout" class="mt-2 w-full shrink-0 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-muted hover:border-red-400/50 hover:bg-red-500/10 hover:text-red-300">خروج</button>`;

  /** Fill a nav and slide its pill under the active tab (instant = place it without animating) */
  function updateNav(navEl: Element | null, instant: boolean) {
    const items = navEl?.querySelector<HTMLElement>("[data-slot=items]"); const pill = navEl?.querySelector<HTMLElement>("[data-pill]");
    if (!items || !pill) return;
    items.innerHTML = navItems();
    const act = items.querySelector<HTMLElement>("[aria-current]");
    if (!act) { pill.style.opacity = "0"; return; }
    if (instant) pill.style.transition = "none";
    pill.style.top = act.offsetTop + "px"; pill.style.height = act.offsetHeight + "px"; pill.style.opacity = "1";
    if (instant) { void pill.offsetWidth; pill.style.transition = ""; }
  }

  function countUp(scope: Element) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    scope.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
      const n = Number(el.dataset.count); if (!n) return;
      const t0 = performance.now();
      const tick = (t: number) => { const k = Math.min(1, (t - t0) / 900); const e = 1 - Math.pow(1 - k, 3); el.textContent = nf.format(Math.round(n * e)); if (k < 1) requestAnimationFrame(tick); };
      el.textContent = nf.format(0); requestAnimationFrame(tick);
    });
  }

  function build() {
    root.innerHTML = `<div dir="rtl" class="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 pb-16 md:flex-row md:items-start md:px-8 md:pt-4">
      ${mobile ? `<div data-slot="bar" class="sticky top-0 z-40 -mx-4 mb-4 flex items-center justify-between border-b border-white/10 bg-midnight/70 px-4 py-3 backdrop-blur-md"></div>` : `<aside class="shrink-0 md:sticky md:top-4 md:h-[calc(100svh-2rem)] md:w-64"><div class="${card} flex h-full flex-col !p-4">${brandHtml(false)}${navShell}${footHtml}</div></aside>`}
      <section class="min-w-0 flex-1"><p class="mb-4 rounded-xl border border-violet/40 bg-violet/10 px-4 py-2 text-xs text-[#d5cfff]">نسخه‌ی نمایشی: داده‌ها نمونه‌اند، ورود و ذخیره‌ی واقعی هنوز ساخته نشده و چیزی به جایی ارسال نمی‌شود.</p><div data-slot="main"></div></section></div><div data-slot="over"></div>`;
    built = mobile ? "mob" : "desk"; navReady = false;
  }

  function render() {
    const y = window.scrollY;
    if (built !== (mobile ? "mob" : "desk")) build();
    const anim = S.anim;
    if (mobile) {
      const bar = root.querySelector("[data-slot=bar]");
      if (bar) bar.innerHTML = `<button data-act="menu" aria-label="منو" class="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/15">${I_MENU}${unreadMsgs() + unreadNotes() > 0 ? `<i class="absolute -end-0.5 -top-0.5 h-3 w-3 rounded-full bg-gold"></i>` : ""}</button><p class="text-lg font-black"><span class="gold-text">شباهنگ</span></p>`;
    } else { updateNav(root.querySelector("aside nav"), !navReady); navReady = true; }
    const main = root.querySelector<HTMLElement>("[data-slot=main]");
    if (main) {
      stopInv?.(); stopInv = null;
      main.innerHTML = (VIEWS[S.view] ?? VIEWS.dash)();
      if (S.view === "invoices" && role === "ceo" && o.mountInvoices) { const host = main.querySelector<HTMLElement>("[data-inv-root]"); if (host) stopInv = o.mountInvoices(host); }
      main.classList.remove("pn-view");
      if (anim) { void main.offsetWidth; main.classList.add("pn-view"); countUp(main); }
    }
    const da = S.drawerAnim; S.drawerAnim = false;
    const over = root.querySelector<HTMLElement>("[data-slot=over]");
    if (over) {
      const hadDrawer = !!over.querySelector(".pn-drawer");
      over.innerHTML = `${mobile && S.menu ? `<div data-act="menu" class="pn-backdrop fixed inset-0 z-[61] bg-black/45 backdrop-blur-sm ${da ? "pn-in" : ""}"></div><aside class="pn-drawer fixed inset-y-0 start-0 z-[62] w-72 max-w-[85vw] p-3 ${da ? "pn-in" : ""}"><div class="${card} flex h-full flex-col bg-[#0b0e27]/95 !p-4">${brandHtml(true)}${navShell}${footHtml}</div></aside>` : ""}${tourHtml()}${invoiceModal()}`;
      if (mobile && S.menu) updateNav(over.querySelector(".pn-drawer nav"), true);
      void hadDrawer;
    }
    S.anim = false;
    window.scrollTo(0, y);
    placeTour();
  }

  /** Slide the phone menu out (and fade the backdrop) before running the next step */
  function closeDrawer(next: () => void) {
    const d = root.querySelector(".pn-drawer"), bd = root.querySelector(".pn-backdrop");
    if (!d) return next();
    d.classList.add("pn-out"); bd?.classList.add("pn-out");
    setTimeout(next, 230);
  }

  /* ---------- events ---------- */
  const go = (v: string, id = "") => { S.menu = false; S.anim = true; if (v === "notes") { S.fresh = myNotes().filter((n) => !n.read).map((n) => n.id); myNotes().forEach((n) => { n.read = true; }); save(); } else S.fresh = []; S.view = v; S.pid = v === "projects" ? id : ""; S.editFor = ""; S.rejectFor = ""; S.payFor = ""; S.day = 0; S.star = 0; window.scrollTo(0, 0); render(); };
  const fval = (sel: string) => (root.querySelector(sel) as HTMLInputElement | HTMLTextAreaElement | null)?.value.trim() ?? "";
  const proj = (id?: string) => D.projects.find((p) => p.id === id);
  const unitById = (id?: string) => allUnits().find(({ u }) => u.id === id);
  const inv = (id?: string) => D.invoices.find((i) => i.id === id);

  function sendMessage(id: string | undefined) {
    const t = D.threads.find((x) => x.id === id); const text = fval("[data-f=draft]");
    if (!t || !text) return;
    t.msgs.push({ from: me, t: text, at: nowStr() });
    t.unread[other(t, me)]++;
    D.drafts[t.id] = ""; save(); render();
    const ta = root.querySelector<HTMLTextAreaElement>("[data-f=draft]"); ta?.focus();
  }

  function onClick(e: Event) {
    const el = (e.target as Element).closest<HTMLElement>("[data-act]");
    if (!el || el.tagName === "INPUT" || el.tagName === "SELECT") return;
    const a = el.dataset.act, id = el.dataset.id;
    switch (a) {
      case "go": if (mobile && S.menu && S.tour < 0) return closeDrawer(() => go(el.dataset.v ?? "dash", id)); return go(el.dataset.v ?? "dash", id);
      case "open": S.view = "projects"; S.pid = id ?? ""; S.anim = true; window.scrollTo(0, 0); return render();
      case "back": S.pid = ""; S.anim = true; return render();
      case "logout": return o.onLogout();
      case "menu": if (S.menu) return closeDrawer(() => { S.menu = false; render(); }); S.menu = true; S.drawerAnim = true; return render();
      case "stage": { const p = proj(id); const i = Number(el.dataset.i); if (p) { p.stages[i].done = !p.stages[i].done; audit(`تغییر مرحله «${p.stages[i].n}»`, p.title); notify("client", `مرحله‌ی «${p.stages[i].n}» در «${p.title}» به‌روز شد.`); save(); render(); } return; }
      case "cal": { const dlt = Number(el.dataset.d); let m = S.cm + dlt, y = S.cy; if (m > 12) { m = 1; y++; } if (m < 1) { m = 12; y--; } S.cm = m; S.cy = y; S.day = 0; return render(); }
      case "day": S.day = S.day === Number(el.dataset.d) ? 0 : Number(el.dataset.d); return render();
      case "ecomment": {
        const p = proj(el.dataset.p); const ev = p?.events[el.dataset.k ?? ""]?.find((x) => x.id === id); const t = fval(`[data-f="ec-${id}"]`);
        if (!ev || !t) return toast("نظر خالی است.");
        ev.comments.push({ from: me, t, at: nowStr() }); notify(isCeo ? "client" : "ceo", `نظر جدید روی «${ev.title}»`); save(); toast(isCeo ? "پاسخ ثبت شد." : "نظر شما برای مجری ارسال شد."); return render();
      }
      case "approve": { const p = proj(el.dataset.p); const d = p?.deliveries.find((x) => x.id === id); if (d && p) { d.st = "ok"; notify("ceo", `${d.title} را مشتری تأیید کرد.`); audit("تأیید تحویل", d.title); save(); toast("تحویل تأیید شد."); render(); } return; }
      case "edit": S.editFor = id ?? ""; return render();
      case "sendedit": { const p = proj(el.dataset.p); const d = p?.deliveries.find((x) => x.id === id); const note = fval("[data-f=note]"); if (d) { d.st = "edit"; d.note = note || "بدون توضیح"; notify("ceo", `درخواست ویرایش برای ${d.title}`); S.editFor = ""; save(); toast("درخواست ویرایش ارسال شد."); render(); } return; }
      case "star": S.star = Number(el.dataset.n); return render();
      case "rate": { const p = proj(id); if (p) { p.rating = { stars: S.star, text: fval("[data-f=rate]") }; save(); toast("ممنون از بازخورد شما."); render(); } return; }
      case "mtab": S.mtab = id ?? "staff"; S.tid = ""; return render();
      case "dthread": S.tid = id ?? ""; { const th = D.threads.find((x) => x.id === S.tid); if (th) { th.unread[me] = 0; save(); } } return go("messages");
      case "thread": S.tid = id ?? ""; { const t = D.threads.find((x) => x.id === S.tid); if (t) { t.unread[me] = 0; save(); } } return render();
      case "send": return sendMessage(id);
      case "voice": return toast("ضبط پیام صوتی (تا ۲ دقیقه) در نسخه‌ی واقعی فعال می‌شود.");
      case "copy": { const v = el.dataset.v ?? ""; try { void navigator.clipboard.writeText(v); } catch { /* clipboard unavailable */ } return toast("کپی شد."); }
      case "pay": S.payFor = id ?? ""; S.payMethod = ""; return render();
      case "pm": S.payMethod = id ?? ""; return render();
      case "paycancel": S.payFor = ""; S.payMethod = ""; return render();
      case "paysend": {
        const f = unitById(id); const track = fval("[data-f=track]"); const file = (root.querySelector("[data-f=payfile]") as HTMLInputElement | null)?.files?.[0];
        if (!f || !S.payMethod) return toast("روش پرداخت را انتخاب کنید.");
        if (!track) return toast("شماره پیگیری را وارد کنید.");
        if (!file) return toast("عکس رسید را انتخاب کنید.");
        if (file.size > MAX_FILE) return toast("حجم فایل بیشتر از ۳ مگابایت است.");
        f.u.st = "pending"; f.u.file = file.name; f.u.track = track; f.u.method = S.payMethod; f.u.reason = "";
        notify("ceo", `پرداخت جدید برای «${f.u.label}» (${S.payMethod})`); audit("ثبت پرداخت", f.u.label); S.payFor = ""; S.payMethod = ""; save(); toast("پرداخت ثبت شد و منتظر تأیید است."); return render();
      }
      case "invview": S.invView = id ?? ""; return render();
      case "invclose": S.invView = ""; return render();
      case "order": notify("ceo", `درخواست سفارش: ${id}`); audit("ثبت سفارش", id ?? ""); save(); return toast("درخواست شما ثبت شد (نمایشی).");
      case "renew": notify("ceo", "درخواست تمدید پکیج"); save(); return toast("درخواست تمدید ثبت شد (نمایشی).");
      case "read": { const n = myNotes().find((x) => x.id === id); if (n) { n.read = true; save(); render(); } return; }
      case "uok": { const u = D.users.find((x) => x.id === id); if (u) { u.st = "active"; audit("تأیید حساب", u.id); save(); toast("حساب تأیید شد؛ ایمیل «حساب فعال شد» در نسخه‌ی واقعی ارسال می‌شود."); render(); } return; }
      case "uno": { const u = D.users.find((x) => x.id === id); if (u) { u.st = "disabled"; audit("رد حساب", u.id); save(); render(); } return; }
      case "rok": { const f = unitById(id); if (f) { f.u.st = "paid"; audit("تأیید رسید", f.u.label); notify("client", `پرداخت «${f.u.label}» تأیید شد.`); save(); render(); } return; }
      case "rno": S.rejectFor = id ?? ""; return render();
      case "rsend": { const f = unitById(id); const r = fval("[data-f=reason]"); if (f && r) { f.u.st = "rejected"; f.u.reason = r; audit("رد رسید", f.u.label); notify("client", `پرداخت «${f.u.label}» رد شد: ${r}`); S.rejectFor = ""; save(); render(); } else toast("دلیل رد را بنویسید."); return; }
      case "method": { const i = inv(id); const m = el.dataset.m ?? ""; if (i) { i.methods = i.methods.includes(m) ? i.methods.filter((x) => x !== m) : [...i.methods, m]; if (!i.methods.length) i.methods = [m]; audit("تغییر روش‌های پرداخت", i.title); notify("client", `روش‌های پرداخت «${i.title}» به‌روز شد.`); save(); render(); } return; }
      case "accadd": { const n = D.accounts.length + 1; D.accounts.push({ id: "a" + Date.now(), label: `کارت ${nf.format(n)}`, holder: "[نام صاحب حساب]", bank: "[نام بانک]", card: "[شماره کارت]", sheba: "IR[شماره شبا]", on: true }); audit("افزودن کارت", `کارت ${n}`); save(); return render(); }
      case "accdef": D.defaultAccount = id ?? D.defaultAccount; audit("تغییر حساب پیش‌فرض مشتری", acc(D.defaultAccount).label); save(); return render();
      case "acctoggle": { const ac = D.accounts.find((x) => x.id === id); if (ac && !(ac.on && D.accounts.filter((x) => x.on).length === 1)) { ac.on = !ac.on; audit(ac.on ? "فعال‌سازی کارت" : "غیرفعال‌سازی کارت", ac.label); save(); render(); } else toast("حداقل یک کارت باید فعال بماند."); return; }
      case "tour": S.tour = 0; S.menu = mobile; S.drawerAnim = mobile; window.scrollTo(0, 0); return render();
      case "tourgo": S.tour = 0; S.menu = mobile; S.drawerAnim = mobile; window.scrollTo(0, 0); try { localStorage.setItem(TOUR_KEY, "1"); } catch { /* ignore */ } return render();
      case "tourlater": S.tour = -1; try { localStorage.setItem(TOUR_KEY, "later"); } catch { /* ignore */ } return render();
      case "tournext": S.tour = S.tour >= TOUR.length - 1 ? -1 : S.tour + 1; if (S.tour < 0) S.menu = false; window.scrollTo(0, 0); return render();
      case "tourclose": S.tour = -1; S.menu = false; return render();
      case "reset": D = seed(); save(); return render();
    }
  }

  function onChange(e: Event) {
    const el = e.target as HTMLInputElement | HTMLSelectElement;
    if (el.dataset?.acc) { const ac = D.accounts.find((x) => x.id === el.dataset.acc); const k = el.dataset.field as keyof Account; if (ac && k) { (ac as unknown as Record<string, unknown>)[k] = el.value.trim(); audit("ویرایش کارت", ac.label); save(); toast("ذخیره شد."); } return; }
    const a = el.dataset?.act; if (!a) return;
    if (a === "urole") { const u = D.users.find((x) => x.id === el.dataset.id); if (u && role === "ceo") { u.role = el.value as Role; audit(`تغییر نقش به ${ROLE_FA[u.role]}`, u.id); save(); toast("نقش تغییر کرد."); render(); } return; }
    if (a === "terms" || a === "invacc") { const i = inv(el.dataset.id); if (i) { if (a === "terms") i.terms = el.value as Terms; else i.accountId = el.value; audit(a === "terms" ? `تغییر شرایط پرداخت به ${TERMS_FA[i.terms]}` : "تغییر حساب مقصد فاکتور", i.title); notify("client", `شرایط پرداخت «${i.title}» به‌روز شد.`); save(); toast("ذخیره شد."); render(); } return; }
    if (a === "attach") {
      const f = (el as HTMLInputElement).files?.[0]; if (!f) return;
      if (f.size > MAX_FILE) { el.value = ""; return toast("حجم فایل بیشتر از ۳ مگابایت است."); }
      const t = D.threads.find((x) => x.id === el.dataset.id); if (t) { t.msgs.push({ from: me, t: "فایل پیوست شد", at: nowStr(), file: f.name }); t.unread[other(t, me)]++; save(); render(); }
    }
  }

  function onInput(e: Event) {
    const el = e.target as HTMLTextAreaElement;
    if (el.dataset?.f === "draft" && el.dataset.t) {
      D.drafts[el.dataset.t] = el.value; save();
      const slot = root.querySelector<HTMLElement>("[data-sendslot]"); if (slot) { const has = el.value.trim().length > 0; const cur = slot.querySelector("[data-act]")?.getAttribute("data-act"); if ((has && cur !== "send") || (!has && cur !== "voice")) slot.innerHTML = sendBtn(el.dataset.t, has); }
    }
    if (el.tagName === "TEXTAREA") { el.style.height = "auto"; el.style.height = Math.min(el.scrollHeight, 128) + "px"; }
  }

  /** Enter sends, Shift+Enter inserts a new line (also while a text-composition is not in progress) */
  function onKeydown(e: KeyboardEvent) {
    const el = e.target as HTMLElement;
    if (e.key !== "Enter" || e.shiftKey || e.isComposing || el.tagName !== "TEXTAREA") return;
    const wrap = el.closest("[data-wrap]"); const b = wrap?.querySelector<HTMLElement>(".js-send");
    if (!b) return;
    e.preventDefault();
    if (b.dataset.act === "voice") return;
    b.click();
  }

  function onResize() { const m = isMobile(); if (m !== mobile) { mobile = m; S.menu = false; render(); } else placeTour(); }
  root.addEventListener("click", onClick);
  root.addEventListener("change", onChange);
  root.addEventListener("input", onInput);
  root.addEventListener("keydown", onKeydown);
  window.addEventListener("resize", onResize);
  window.addEventListener("scroll", placeTour, { passive: true });
  save();
  render();
  return () => {
    stopInv?.();
    root.removeEventListener("click", onClick); root.removeEventListener("change", onChange); root.removeEventListener("input", onInput); root.removeEventListener("keydown", onKeydown);
    window.removeEventListener("resize", onResize); window.removeEventListener("scroll", placeTour); root.innerHTML = "";
  };
}
