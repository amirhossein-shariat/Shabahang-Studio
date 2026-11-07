/** Interactive Canvas2D starfield: parallax with the pointer and scroll, stars that push away from and
 *  brighten near the cursor, and sparks that trail fast movement. */
type Star = { x: number; y: number; z: number; r: number; ph: number; sp: number; ox: number; oy: number; c: string };
type Spark = { x: number; y: number; vx: number; vy: number; life: number };

const COLORS = ["#F6E3B0", "#F6E3B0", "#F6E3B0", "#EDE6D6", "#EDE6D6", "#B8AEFF"];

export function createStarfield(canvas: HTMLCanvasElement, opts: { reduced: boolean }) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return { destroy() {} };
  let w = 0, h = 0, raf = 0, last = 0, running = true;
  let stars: Star[] = [];
  const sparks: Spark[] = [];
  const m = { x: 0, y: 0, tx: 0, ty: 0, active: false };
  let px = 0, py = 0;
  const R = 150;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth; h = window.innerHeight;
    canvas!.width = Math.round(w * dpr); canvas!.height = Math.round(h * dpr);
    canvas!.style.width = w + "px"; canvas!.style.height = h + "px";
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round(Math.min(320, Math.max(90, (w * h) / 5200)));
    stars = Array.from({ length: n }, () => {
      const z = 0.15 + Math.pow(Math.random(), 1.6) * 0.85;
      return { x: Math.random() * w, y: Math.random() * h, z, r: 0.35 + z * 1.35, ph: Math.random() * 6.28, sp: 0.5 + Math.random() * 1.6, ox: 0, oy: 0, c: COLORS[(Math.random() * COLORS.length) | 0] };
    });
    if (opts.reduced) draw(0, 0);
  }

  function draw(t: number, dt: number) {
    ctx!.clearRect(0, 0, w, h);
    const scroll = window.scrollY;
    const k = Math.min(1, dt * 8);
    m.x += (m.tx - m.x) * Math.min(1, dt * 14); m.y += (m.ty - m.y) * Math.min(1, dt * 14);
    const tpx = m.active ? (m.x / w - 0.5) * -34 : 0, tpy = m.active ? (m.y / h - 0.5) * -22 : 0;
    px += (tpx - px) * Math.min(1, dt * 3); py += (tpy - py) * Math.min(1, dt * 3);

    for (const s of stars) {
      if (!opts.reduced) s.x = (s.x + s.z * 4 * dt + w) % w;
      let bx = s.x + px * s.z * 1.6;
      let by = (((s.y - scroll * 0.14 * s.z + py * s.z) % h) + h) % h;
      let near = 0, tx = 0, ty = 0;
      if (m.active && !opts.reduced) {
        const dx = bx - m.x, dy = by - m.y, d = Math.hypot(dx, dy);
        if (d < R && d > 0.01) { near = 1 - d / R; const f = near * near * 80 * (0.4 + s.z); tx = (dx / d) * f; ty = (dy / d) * f; }
      }
      s.ox += (tx - s.ox) * k; s.oy += (ty - s.oy) * k;
      bx += s.ox; by += s.oy;
      const tw = opts.reduced ? 0.8 : 0.55 + 0.45 * Math.sin(t * 0.001 * s.sp + s.ph);
      const a = Math.min(1, (0.28 + 0.72 * s.z) * tw + near * 0.7);
      const r = s.r * (1 + near * 1.1);
      ctx!.fillStyle = s.c;
      if (near > 0.25) { ctx!.globalAlpha = a * 0.22; ctx!.beginPath(); ctx!.arc(bx, by, r * 3.4, 0, 6.2832); ctx!.fill(); }
      ctx!.globalAlpha = a; ctx!.beginPath(); ctx!.arc(bx, by, r, 0, 6.2832); ctx!.fill();
    }

    ctx!.fillStyle = "#F6E3B0";
    for (let i = sparks.length - 1; i >= 0; i--) {
      const p = sparks[i];
      p.life -= dt * 1.2;
      if (p.life <= 0) { sparks.splice(i, 1); continue; }
      p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= 0.96; p.vy *= 0.96;
      ctx!.globalAlpha = p.life * 0.8; ctx!.beginPath(); ctx!.arc(p.x, p.y, 0.6 + p.life * 1.4, 0, 6.2832); ctx!.fill();
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

  const onMove = (e: PointerEvent) => {
    m.tx = e.clientX; m.ty = e.clientY;
    if (!m.active) { m.x = m.tx; m.y = m.ty; m.active = true; }
    const speed = Math.hypot(e.movementX || 0, e.movementY || 0);
    if (speed > 6 && sparks.length < 80) {
      const n = Math.min(3, Math.floor(speed / 12) + 1);
      for (let i = 0; i < n; i++) sparks.push({ x: e.clientX, y: e.clientY, vx: (Math.random() - 0.5) * 60 - (e.movementX || 0) * 3, vy: (Math.random() - 0.5) * 60 - (e.movementY || 0) * 3, life: 0.6 + Math.random() * 0.5 });
    }
  };
  const onLeave = () => { m.active = false; };
  const onVis = () => {
    if (document.hidden) { running = false; cancelAnimationFrame(raf); }
    else if (!opts.reduced) { running = true; last = performance.now(); raf = requestAnimationFrame(loop); }
  };

  resize();
  window.addEventListener("resize", resize);
  if (!opts.reduced) {
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);
    document.addEventListener("visibilitychange", onVis);
    raf = requestAnimationFrame(loop);
  }
  return {
    destroy() {
      running = false; cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    },
  };
}
