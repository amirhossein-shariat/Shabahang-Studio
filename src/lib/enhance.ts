/**
 * Progressive enhancement for the public pages. The HTML is server-rendered and complete; this only adds behaviour:
 *  - price period toggle on the IT page            ([data-period-btn] inside [data-period-root])
 *  - FAQ carousel arrows, dots, active card, list/carousel switch   ([data-fq-*])
 *  - selecting project services and sending them to the contact page ([data-sel], [data-sel-bar], [data-prefill])
 *  - pre-filling the contact form from that selection (sessionStorage "sh-prefill")
 * It runs in the Next.js app (via <Enhance />) and in the static preview, so it uses no framework.
 */
const PREFILL_KEY = "sh-prefill";
const ENH_TOPIC: Record<string, string[]> = { it: ["IT"], web: ["سایت", "Web"], growth: ["شبکه", "Social"], brand: ["برند", "Brand"], product: ["محصول", "Product"] };

type EnhWindow = Window & { __shEnh?: boolean };

function enhRm() { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; }

function enhCards(track: Element) { return Array.from(track.querySelectorAll<HTMLElement>("[data-fq-card]")); }
function enhActive(track: HTMLElement) {
  const box = track.getBoundingClientRect(); const mid = box.left + box.width / 2;
  let best = 0, dist = Infinity;
  enhCards(track).forEach((c, i) => { const r = c.getBoundingClientRect(); const d = Math.abs(r.left + r.width / 2 - mid); if (d < dist) { dist = d; best = i; } });
  return best;
}
function enhPaint(root: Element, idx: number) {
  const track = root.querySelector<HTMLElement>("[data-fq-track]"); if (!track) return;
  enhCards(track).forEach((c, i) => { if (i === idx) c.setAttribute("data-active", ""); else c.removeAttribute("data-active"); });
  root.querySelectorAll<HTMLElement>("[data-fq-dot]").forEach((d, i) => { d.setAttribute("aria-current", i === idx ? "true" : "false"); });
  const n = root.querySelector("[data-fq-now]"); if (n) n.textContent = new Intl.NumberFormat("fa-IR").format(idx + 1);
}
function enhGo(root: Element, idx: number) {
  const track = root.querySelector<HTMLElement>("[data-fq-track]"); if (!track) return;
  const cards = enhCards(track); const i = Math.max(0, Math.min(cards.length - 1, idx));
  cards[i].scrollIntoView({ inline: "center", block: "nearest", behavior: enhRm() ? "auto" : "smooth" }); // works in RTL; block:nearest keeps the page still
  enhPaint(root, i);
}

function enhSelBar() {
  const bar = document.querySelector<HTMLElement>("[data-sel-bar]"); if (!bar) return;
  const n = document.querySelectorAll<HTMLInputElement>("[data-sel]:checked").length;
  const c = bar.querySelector("[data-sel-count]"); if (c) c.textContent = new Intl.NumberFormat("fa-IR").format(n);
  if (n > 0) bar.setAttribute("data-open", ""); else bar.removeAttribute("data-open");
}

function enhApplyPrefill(scope: ParentNode) {
  const form = scope.querySelector<HTMLFormElement>("form[novalidate]") ?? scope.querySelector<HTMLFormElement>("form");
  if (!form) return;
  let raw: string | null = null;
  try { raw = sessionStorage.getItem(PREFILL_KEY); } catch { return; }
  if (!raw) return;
  let p: { service?: string; message?: string } = {};
  try { p = JSON.parse(raw); } catch { return; }
  const msg = form.elements.namedItem("message") as HTMLTextAreaElement | null;
  const sel = form.elements.namedItem("service") as HTMLSelectElement | null;
  if (!msg && !sel) return;
  if (msg && p.message && !msg.value.trim()) msg.value = p.message;
  if (sel && p.service) { const keys = ENH_TOPIC[p.service] ?? []; const o = Array.from(sel.options).find((x) => keys.some((k) => x.text.includes(k))); if (o) sel.value = o.value; }
  try { sessionStorage.removeItem(PREFILL_KEY); } catch { /* ignore */ }
}

function enhSelectedPayload() {
  const picked = Array.from(document.querySelectorAll<HTMLInputElement>("[data-sel]:checked")).map((i) => i.dataset.title ?? "");
  return JSON.stringify({ service: "it", message: "درخواست برآورد برای خدمات پروژه‌ای زیر:\n" + picked.map((t) => "- " + t).join("\n") + "\n\nتوضیحات تکمیلی:\n" });
}

function enhClick(e: Event) {
  const t = e.target as HTMLElement;
  const per = t.closest<HTMLElement>("[data-period-btn]");
  if (per) { const root = per.closest<HTMLElement>("[data-period-root]"); if (root) root.setAttribute("data-p", per.dataset.periodBtn ?? "m"); return; }
  const fq = t.closest<HTMLElement>("[data-faq]");
  if (fq) {
    const track = fq.querySelector<HTMLElement>("[data-fq-track]");
    if (t.closest("[data-fq-prev]") && track) return enhGo(fq, enhActive(track) - 1);
    if (t.closest("[data-fq-next]") && track) return enhGo(fq, enhActive(track) + 1);
    const dot = t.closest<HTMLElement>("[data-fq-dot]"); if (dot) return enhGo(fq, Number(dot.dataset.fqDot));
    const card = t.closest<HTMLElement>("[data-fq-card]"); if (card && track && !card.hasAttribute("data-active")) return enhGo(fq, enhCards(track).indexOf(card));
    if (t.closest("[data-fq-toggle]")) {
      const list = fq.querySelector<HTMLElement>("[data-fq-list]"), car = fq.querySelector<HTMLElement>("[data-fq-carousel]"), b = fq.querySelector<HTMLElement>("[data-fq-toggle]");
      if (!list || !car || !b) return;
      const showList = list.hasAttribute("hidden");
      list.toggleAttribute("hidden", !showList); car.toggleAttribute("hidden", showList);
      b.textContent = showList ? (b.dataset.carousel ?? "") : (b.dataset.list ?? "");
      return;
    }
  }
  if (t.closest("[data-sel-clear]")) { document.querySelectorAll<HTMLInputElement>("[data-sel]").forEach((i) => { i.checked = false; }); return enhSelBar(); }
  const a = t.closest<HTMLElement>("[data-prefill], [data-prefill-sel]");
  if (a) { try { sessionStorage.setItem(PREFILL_KEY, a.hasAttribute("data-prefill-sel") ? enhSelectedPayload() : (a.getAttribute("data-prefill") ?? "")); } catch { /* ignore */ } }
}

export function initEnhance(scope: ParentNode = document): () => void {
  const w = window as EnhWindow;
  if (!w.__shEnh) {
    w.__shEnh = true;
    document.addEventListener("click", enhClick);
    document.addEventListener("change", (e) => { if ((e.target as HTMLElement).matches?.("[data-sel]")) enhSelBar(); });
  }
  const cleanups: (() => void)[] = [];
  scope.querySelectorAll<HTMLElement>("[data-faq]").forEach((root) => {
    const track = root.querySelector<HTMLElement>("[data-fq-track]"); if (!track) return;
    let raf = 0;
    const on = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => enhPaint(root, enhActive(track))); };
    track.addEventListener("scroll", on, { passive: true });
    enhPaint(root, 0);
    cleanups.push(() => track.removeEventListener("scroll", on));
  });
  enhSelBar();
  enhApplyPrefill(scope);
  return () => cleanups.forEach((c) => c());
}
