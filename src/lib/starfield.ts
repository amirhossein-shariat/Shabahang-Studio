/** Calm Canvas2D starfield: twinkling stars at different depths that drift very slowly, with a faint
 *  depth shift while the page scrolls. It does not react to the mouse or touch. */
type Star = { x: number; y: number; z: number; r: number; ph: number; sp: number; c: string };

const COLORS = ["#F6E3B0", "#F6E3B0", "#F6E3B0", "#EDE6D6", "#EDE6D6", "#B8AEFF"];

export function createStarfield(canvas: HTMLCanvasElement, opts: { reduced: boolean }) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return { destroy() {} };
  let w = 0, h = 0, raf = 0, last = 0, running = true;
  let stars: Star[] = [];

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth; h = window.innerHeight;
    canvas!.width = Math.round(w * dpr); canvas!.height = Math.round(h * dpr);
    canvas!.style.width = w + "px"; canvas!.style.height = h + "px";
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round(Math.min(320, Math.max(90, (w * h) / 5200)));
    stars = Array.from({ length: n }, () => {
      const z = 0.15 + Math.pow(Math.random(), 1.6) * 0.85;
      return { x: Math.random() * w, y: Math.random() * h, z, r: 0.35 + z * 1.35, ph: Math.random() * 6.28, sp: 0.5 + Math.random() * 1.6, c: COLORS[(Math.random() * COLORS.length) | 0] };
    });
    if (opts.reduced) draw(0, 0);
  }

  function draw(t: number, dt: number) {
    ctx!.clearRect(0, 0, w, h);
    const scroll = window.scrollY;
    for (const s of stars) {
      if (!opts.reduced) s.x = (s.x + s.z * 4 * dt + w) % w;
      const by = (((s.y - scroll * 0.14 * s.z) % h) + h) % h;
      const tw = opts.reduced ? 0.8 : 0.55 + 0.45 * Math.sin(t * 0.001 * s.sp + s.ph);
      ctx!.globalAlpha = Math.min(1, (0.28 + 0.72 * s.z) * tw);
      ctx!.fillStyle = s.c;
      ctx!.beginPath();
      ctx!.arc(s.x, by, s.r, 0, 6.2832);
      ctx!.fill();
    }
    ctx!.globalAlpha = 1;
  }

  function loop(now: number) {
    if (!running) return;
    const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
    last = now;
    draw(now, dt);
    raf = requestAnimationFrame(loop);
  }

  const onVis = () => {
    if (document.hidden) { running = false; cancelAnimationFrame(raf); }
    else if (!opts.reduced) { running = true; last = performance.now(); raf = requestAnimationFrame(loop); }
  };

  resize();
  window.addEventListener("resize", resize);
  if (!opts.reduced) {
    document.addEventListener("visibilitychange", onVis);
    raf = requestAnimationFrame(loop);
  }
  return {
    destroy() {
      running = false; cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
    },
  };
}
