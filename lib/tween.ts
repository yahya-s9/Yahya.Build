// A small frame-by-frame animator. It sets `style.transform` itself on every frame instead of using the
// Web Animations API, because some mobile browsers drop 3D transform animations and leave the element stuck.

export type Bezier = [number, number, number, number];
export type Frame = { offset: number; v: number[]; ease?: Bezier };

/** CSS cubic-bezier(x1, y1, x2, y2) as a function of time (0..1). */
function bezier([x1, y1, x2, y2]: Bezier) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const X = (t: number) => ((ax * t + bx) * t + cx) * t;
  const Y = (t: number) => ((ay * t + by) * t + cy) * t;
  const dX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  return (x: number) => {
    let t = x;
    for (let i = 0; i < 8; i++) {
      const err = X(t) - x;
      if (Math.abs(err) < 1e-5) return Y(t);
      const d = dX(t);
      if (Math.abs(d) < 1e-6) break;
      t -= err / d;
    }
    let lo = 0, hi = 1;
    t = x;
    for (let i = 0; i < 20; i++) {
      const v = X(t);
      if (Math.abs(v - x) < 1e-5) break;
      if (v < x) lo = t; else hi = t;
      t = (lo + hi) / 2;
    }
    return Y(t);
  };
}

/**
 * Moves `el` through `frames` (each a list of numbers, turned into a transform by `make`) over `duration` ms.
 * An easing on a frame shapes the stretch from that frame to the next, as in CSS keyframes.
 */
export function tween(
  el: HTMLElement,
  make: (v: number[]) => string,
  frames: Frame[],
  opts: { duration: number; delay?: number; ease?: Bezier },
) {
  const { duration, delay = 0, ease } = opts;
  const fs = frames.map((f) => ({ ...f, ease: f.ease ?? ease ?? ([0.25, 0.1, 0.25, 1] as Bezier) }));
  const curves = fs.map((f) => bezier(f.ease));
  const at = (p: number) => {
    let k = 0;
    while (k < fs.length - 2 && p > fs[k + 1].offset) k++;
    const a = fs[k], b = fs[k + 1];
    const span = b.offset - a.offset || 1;
    const e = curves[k](Math.min(1, Math.max(0, (p - a.offset) / span)));
    return a.v.map((x, i) => x + (b.v[i] - x) * e);
  };
  el.style.transform = make(fs[0].v);

  let cancelled = false;
  const finished = new Promise<void>((resolve) => {
    const t0 = performance.now() + delay;
    const step = (now: number) => {
      if (cancelled) return resolve();
      if (now < t0) { requestAnimationFrame(step); return; }
      const p = Math.min(1, (now - t0) / duration);
      el.style.transform = make(p >= 1 ? fs[fs.length - 1].v : at(p));
      if (p < 1) requestAnimationFrame(step); else resolve();
    };
    requestAnimationFrame(step);
  });
  return { finished, cancel: () => { cancelled = true; } };
}
