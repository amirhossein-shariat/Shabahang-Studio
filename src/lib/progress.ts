/**
 * Scroll progress line along the top edge. The target is scroll position / scrollable height; the drawn
 * value eases toward it (time-based, so it feels the same at any frame rate) instead of following the
 * scrollbar one-to-one, which removes the jumps when the page height shifts or the wheel moves in steps.
 */
export function initProgress(el: HTMLElement): () => void {
  let shown = 0;
  let raf = 0;
  let last = 0;

  const target = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
  };

  function frame(now: number) {
    const dt = Math.min(now - (last || now), 64);
    last = now;
    const t = target();
    shown += (t - shown) * (1 - Math.exp(-dt / 140));
    if (Math.abs(t - shown) < 0.0004) shown = t;
    el.style.transform = `scaleX(${shown})`;
    if (shown !== t) raf = requestAnimationFrame(frame);
    else { raf = 0; last = 0; }
  }
  const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };

  window.addEventListener("scroll", kick, { passive: true });
  window.addEventListener("resize", kick);
  kick();
  return () => {
    window.removeEventListener("scroll", kick);
    window.removeEventListener("resize", kick);
    cancelAnimationFrame(raf);
  };
}
