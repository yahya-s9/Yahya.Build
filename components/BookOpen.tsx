"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { FlatBook, SpineBook } from "@/data/bookcase";
import { lookOf } from "@/lib/look";
import { Spine, coverBase } from "./Books";
import CoverArt from "./CoverArt";

export type OpenBook = { book: SpineBook | FlatBook; index: number };

const ASPECT = 4 / 3; // height / width of the cover
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const EASE_IN_OUT = "cubic-bezier(0.77, 0, 0.175, 1)";
const NASTALIQ = { fontFamily: "'Noto Nastaliq Urdu', serif" };

type Geo = { W: number; H: number; D: number; vw: number; vh: number; wide: boolean };

function measure(spineW: number, spineH: number): Geo {
  const vw = window.innerWidth, vh = window.innerHeight;
  const H = Math.round(Math.min(660, vh * 0.82, (vw * 0.92) * ASPECT));
  const W = Math.round(H / ASPECT);
  return { W, H, D: Math.max(26, Math.round((spineW * H) / spineH)), vw, vh, wide: vw >= 820 };
}

// translate (x, y) → scale → depth → turn → tip → roll
const T = (x: number, y: number, s: number, z: number, ry: number, rx = 0, rz = 0) =>
  `translate3d(${x}px, ${y}px, 0) scale3d(${s}, ${s}, ${s}) translateZ(${z}px) rotateY(${ry}deg) rotateX(${rx}deg) rotateZ(${rz}deg)`;

/** Keyframes carrying the book from its place on the shelf to the middle of the screen. */
function flight(g: Geo, el: HTMLElement) {
  const r = el.getBoundingClientRect();
  const dx = r.left + r.width / 2 - g.vw / 2;
  const dy = r.top + r.height / 2 - g.vh / 2;
  const end = T(0, 0, 1, -g.D / 2, 0);
  if (el.classList.contains("sp")) {
    const k = r.height / g.H;
    return [
      { offset: 0, transform: T(dx, dy, k, -g.W / 2, 90), easing: EASE },
      // pulled toward you and tipped back, the way a book leaves a shelf
      { offset: 0.22, transform: T(dx, dy - 20, k, -g.W / 2 + 80, 90, -6), easing: "cubic-bezier(0.45, 0, 0.2, 1)" },
      { offset: 0.65, transform: T(dx * 0.2, dy * 0.2 - 12, k + (1 - k) * 0.8, -g.D / 2 + 50, 36, -4, -1.2), easing: EASE },
      { offset: 1, transform: end },
    ];
  }
  const k = Math.min(1, r.width / g.W);
  return [
    { offset: 0, transform: T(dx, dy, k, -g.D / 2, 0), easing: EASE },
    { offset: 0.4, transform: T(dx * 0.5, dy * 0.5 - 24, k + (1 - k) * 0.6, -g.D / 2 + 50, -12, 6, -1.5), easing: EASE },
    { offset: 1, transform: end },
  ];
}

export default function BookOpen({ open, origin, onClose }: { open: OpenBook; origin: HTMLElement; onClose: () => void }) {
  const { book: b, index } = open;
  const look = lookOf(b.tip[0], "big" in b ? !!b.big : false, coverBase(b.cover));
  const [g] = useState(() => measure(look.w, look.h));
  const [phase, setPhase] = useState<"in" | "closed" | "open" | "out">("in");
  const phaseRef = useRef<"in" | "closed" | "open" | "out">("in");
  const go = (p: "in" | "closed" | "open" | "out") => { phaseRef.current = p; setPhase(p); };
  const bookRef = useRef<HTMLDivElement>(null);
  const shiftRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const flyRef = useRef<Animation | null>(null);
  const closing = useRef(false);
  const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const shift = g.wide ? g.W / 2 : 0;
  const frontZ = `translateZ(${g.D / 2}px)`;
  const i = b.info ?? {};
  const author = i.author ?? ("author" in b ? b.author : "") ?? "";

  // the book leaves its place on the shelf while it is in your hands
  useLayoutEffect(() => {
    const prev = origin.style.visibility;
    origin.style.visibility = "hidden";
    return () => { origin.style.visibility = prev; };
  }, [origin]);

  useLayoutEffect(() => {
    const book = bookRef.current!;
    if (reduce) {
      book.style.transform = T(0, 0, 1, -g.D / 2, 0);
      go("closed");
      return;
    }
    const spine = origin.classList.contains("sp");
    const fly = book.animate(flight(g, origin), { duration: spine ? 860 : 680, fill: "forwards" });
    flyRef.current = fly;
    fly.finished.then(() => go("closed")).catch(() => {});
    // once, on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // the book waits, closed, until you click it
  const openCover = useCallback(() => {
    if (phaseRef.current !== "closed") return;
    const cover = coverRef.current!, sh = shiftRef.current!;
    go("open");
    if (reduce) {
      cover.style.transform = `${frontZ} rotateY(-180deg)`;
      sh.style.transform = `translateX(${shift}px)`;
      return;
    }
    const opts: KeyframeAnimationOptions = { duration: 760, easing: EASE_IN_OUT, fill: "forwards" };
    cover.animate([{ transform: `${frontZ} rotateY(0deg)` }, { transform: `${frontZ} rotateY(-180deg)` }], opts);
    sh.animate([{ transform: "translateX(0px)" }, { transform: `translateX(${shift}px)` }], opts);
  }, [frontZ, reduce, shift]);

  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    const wasOpen = phaseRef.current === "open";
    go("out");
    const book = bookRef.current!, cover = coverRef.current!, sh = shiftRef.current!;
    if (reduce) return onClose();
    if (wasOpen) {
      const opts: KeyframeAnimationOptions = { duration: 520, easing: EASE_IN_OUT, fill: "forwards" };
      cover.animate([{ transform: `${frontZ} rotateY(-180deg)` }, { transform: `${frontZ} rotateY(0deg)` }], opts);
      sh.animate([{ transform: `translateX(${shift}px)` }, { transform: "translateX(0px)" }], opts);
    }
    // fly back to wherever it came from, once the cover is shut
    const fly = book.animate(
      flight(measure(look.w, look.h), origin).map((k) => ({ ...k, offset: 1 - k.offset })).reverse(),
      { duration: origin.classList.contains("sp") ? 740 : 580, delay: wasOpen ? 380 : 0, fill: "forwards" },
    );
    fly.finished.then(onClose).catch(onClose);
  }, [frontZ, look.h, look.w, onClose, origin, reduce, shift]);

  useEffect(() => {
    if (phase === "closed") bookRef.current?.focus({ preventScroll: true });
  }, [phase]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { e.preventDefault(); close(); } };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [close]);

  const { W, H, D } = g;

  return createPortal(
    <div className="ob-stage" data-phase={phase} role="dialog" aria-modal="true" aria-label={i.title ?? b.tip[0]}>
      <div className="ob-backdrop" onClick={close} />
      <div className="ob-world">
        <div ref={shiftRef} className="ob-shift">
          <div
            ref={bookRef}
            className="ob-book"
            data-phase={phase}
            role="button"
            tabIndex={0}
            aria-label={phase === "open" ? undefined : `Open ${i.title ?? b.tip[0]}`}
            onClick={openCover}
            onKeyDown={(e) => { if (e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openCover(); } }}
            style={{ width: W, height: H, marginLeft: -W / 2, marginTop: -H / 2, transform: flight(g, origin)[0].transform }}
          >
            {/* back board, spine, and the edges of the pages */}
            <div className="ob-face" style={{ background: look.color, transform: `rotateY(180deg) translateZ(${D / 2}px)` }} />
            <div className="ob-face" style={{ width: D, left: (W - D) / 2, transform: `rotateY(-90deg) translateZ(${W / 2}px)`, overflow: "hidden" }}>
              <div style={{ transform: `scale(${D / look.w}, ${H / look.h})`, transformOrigin: "0 0", width: look.w, height: look.h }}>
                {"title" in b && "bandH" in b ? <Spine book={b as SpineBook} look={look} /> : <div style={{ width: look.w, height: look.h, background: look.color }} />}
              </div>
            </div>
            <div className="ob-face ob-edge" style={{ width: D - 6, height: H - 8, top: 4, left: (W - D + 6) / 2, transform: `rotateY(90deg) translateZ(${W / 2 - 4}px)` }} />
            <div className="ob-face ob-edge ob-edge-h" style={{ width: W - 6, height: D - 6, left: 2, top: (H - D + 6) / 2, transform: `rotateX(90deg) translateZ(${H / 2 - 4}px)` }} />
            <div className="ob-face ob-edge ob-edge-h" style={{ width: W - 6, height: D - 6, left: 2, top: (H - D + 6) / 2, transform: `rotateX(-90deg) translateZ(${H / 2 - 4}px)` }} />

            {/* inside of the back board, then the first page */}
            <div className="ob-face" style={{ background: look.color, transform: `translateZ(${D / 2 - 6}px)` }} />
            <div className="ob-face parchment gutter-l" style={{ width: W - 9, height: H - 12, top: 6, left: 1, transform: `translateZ(${D / 2 - 2}px)` }}>
              <div className="flex h-full flex-col items-center justify-center gap-3 px-8 py-10 text-center">
                <span className="text-xs tracking-[0.4em]" style={{ color: look.color }}>❖ ✦ ❖</span>
                {i.ar && <h2 className="text-3xl leading-[1.8]" style={{ ...NASTALIQ, color: "#2f2012" }}>{i.ar}</h2>}
                <h3 className="font-headline-md text-lg tracking-[0.12em] uppercase" dangerouslySetInnerHTML={{ __html: i.title ?? b.tip[0] }} />
                <div className="h-px w-16" style={{ background: look.color, opacity: 0.5 }} />
                <p className="font-serif text-base">{author}</p>
                {i.authorAr && <p className="text-sm" style={{ ...NASTALIQ, lineHeight: 1.9 }}>{i.authorAr}</p>}
                {i.subject && <p className="font-serif text-sm italic opacity-80 max-w-[17rem]">“{i.subject}”</p>}
                {i.link && (
                  <a
                    href={i.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 rounded-sm px-4 py-2 text-[11px] uppercase tracking-[0.25em] transition-opacity hover:opacity-85"
                    style={{ background: look.color, color: look.fg }}
                  >
                    Open my notes ↗
                  </a>
                )}
              </div>
            </div>

            {/* front board: the cover outside, a bookplate inside */}
            <div ref={coverRef} className="ob-cover" style={{ transform: `${frontZ} rotateY(0deg)` }}>
              <div className="ob-face"><CoverArt book={b} look={look} /></div>
              <div className="ob-face" style={{ background: look.color, transform: "rotateY(180deg)" }}>
                <div className="parchment gutter-r absolute" style={{ inset: 7 }}>
                {i.toc?.length ? (
                  <div className="flex h-full flex-col px-7 pb-6 pt-8" style={{ color: "#3a2a18" }}>
                    <p className="text-center text-[10px] uppercase tracking-[0.4em] opacity-70">Contents</p>
                    <span className="mx-auto mt-3 mb-3 h-px w-12 opacity-40" style={{ background: "#3a2a18" }} />
                    <ol className="ob-toc min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-2 font-serif text-[13px] leading-snug">
                      {i.toc.map((e, k) => (
                        <li key={k} className="flex gap-3">
                          <span className="w-8 shrink-0 text-right tabular-nums opacity-55">{e.n}</span>
                          {e.href ? (
                            <a href={e.href} target="_blank" rel="noopener noreferrer" className="underline decoration-transparent underline-offset-2 transition hover:decoration-current">
                              {e.title}
                            </a>
                          ) : (
                            <span className="opacity-60">{e.title}</span>
                          )}
                        </li>
                      ))}
                    </ol>
                  </div>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-5 px-6 text-center" style={{ color: "#3a2a18" }}>
                    <span className="text-xs tracking-[0.5em] opacity-70">❖ ✦ ❖</span>
                    <p
                      dir="rtl"
                      lang="ar"
                      className="text-[2.1rem] leading-[2.3]"
                      style={{ ...NASTALIQ, textShadow: "0 0 .6px rgba(58,42,24,.5)" }}
                    >
                      بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                    </p>
                    <span className="h-px w-16 opacity-40" style={{ background: "#3a2a18" }} />
                  </div>
                )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button ref={closeRef} type="button" onClick={close} aria-label="Close" className="ob-x">✕</button>
    </div>,
    document.body,
  );
}
