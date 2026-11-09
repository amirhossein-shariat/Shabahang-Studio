/**
 * Scroll reveal that works in every browser (IntersectionObserver, no CSS scroll-timeline needed).
 * Things below the fold start hidden; when they scroll into view they rise in with a soft blur-in,
 * a small stagger between neighbours, and icons pop with a little spin. Once an item has appeared
 * its helper classes are removed again, so normal hover effects keep working.
 * Nothing is hidden when the user prefers reduced motion or IntersectionObserver is missing.
 */
const BLOCKS =
  'main h2, main section > p, main section > h3, main :is(ul, ol) > li, main form, [data-item], main section[class*="rounded-"], main section > div[class*="rounded-"]:not(:has(ul, form))';
const ICONS = 'main span[class*="rounded-"]:has(> svg)';
const SKIP = ".page-head, .hero-rise, .title-in, .marquee, [data-no-reveal]";

export function initReveal(scope: ParentNode = document): () => void {
  if (typeof IntersectionObserver === "undefined" || matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};

  const touched = new Set<HTMLElement>();
  const timers = new Set<number>();
  const vh = window.innerHeight;

  const io = new IntersectionObserver(
    (entries) => {
      let n = 0;
      for (const en of entries) {
        const el = en.target as HTMLElement;
        const passed = !en.isIntersecting && en.boundingClientRect.bottom < 0;
        if (!en.isIntersecting && !passed) continue;
        io.unobserve(el);
        const isIcon = el.classList.contains("rv-icon");
        const delay = passed ? 0 : Math.min(n++ * 90, 450) + (isIcon ? 160 : 0);
        el.style.transitionDelay = delay + "ms";
        el.classList.add("rv-in");
        const t = window.setTimeout(() => {
          el.classList.remove("rv-pre", "rv-in", "rv-icon");
          el.style.transitionDelay = "";
          touched.delete(el);
          timers.delete(t);
        }, 1300 + delay);
        timers.add(t);
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
  );

  const list = Array.from(scope.querySelectorAll<HTMLElement>(BLOCKS + ", " + ICONS));
  for (const el of list) {
    if (el.closest(SKIP)) continue;
    const icon = el.matches(ICONS);
    if (!icon && el.parentElement?.closest(BLOCKS)) continue; // children ride along with their block
    if (el.getBoundingClientRect().top < vh * 0.92) continue; // already on screen: leave it alone
    el.classList.add("rv-pre");
    if (icon) el.classList.add("rv-icon");
    touched.add(el);
    io.observe(el);
  }

  return () => {
    io.disconnect();
    timers.forEach((t) => clearTimeout(t));
    touched.forEach((el) => {
      el.classList.remove("rv-pre", "rv-in", "rv-icon");
      el.style.transitionDelay = "";
    });
  };
}
