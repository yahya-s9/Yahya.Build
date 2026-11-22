"use client";

// A scroll taken out of the scroll box: it lifts out of its cubby, flies to the middle of the screen as a
// closed scroll (two wooden rollers with the parchment wound between them), unrolls downwards, and shows
// its Markdown notes from GitHub, which scroll vertically. Closing rolls it back up and returns it.
// Driven by CSS transitions on state changes (no Web Animations), like the books.

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { marked } from "marked";
import DOMPurify from "dompurify";
import type { ScrollItem } from "@/data/bookcase";

type Phase = "start" | "fly" | "unroll" | "read" | "rollup" | "return";

const FLY_MS = 480, UNROLL_MS = 950, ROLLUP_MS = 600, ROLLER = 22;

/** github.com/<owner>/<repo>/blob/<branch>/<path>.md  ->  raw.githubusercontent.com (allows cross-origin reads). */
function rawMarkdownUrl(link?: string) {
  const m = link?.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/(.+\.md)$/i);
  return m ? `https://raw.githubusercontent.com/${m[1]}/${m[2]}/${m[3]}` : null;
}

/** Markdown -> safe HTML. Inline $math$ is shown as italics without the dollar signs. */
function render(md: string) {
  const text = md.replace(/\$([^$\n]+)\$/g, (_, m: string) => `*${m.replace(/[{}\\]/g, "")}*`);
  const html = marked.parse(text, { gfm: true, breaks: true, async: false }) as string;
  const clean = DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
  return clean.replace(/<a /g, '<a target="_blank" rel="noopener" ');
}

export default function ScrollOpen({ scroll: s, origin, onClose }: { scroll: ScrollItem; origin: HTMLElement; onClose: () => void }) {
  const [phase, setPhase] = useState<Phase>("start");
  const [notes, setNotes] = useState<{ html?: string; error?: boolean }>({});
  const closeRef = useRef<HTMLButtonElement>(null);
  const closing = useRef(false);
  const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const info = s.info ?? {};
  const raw = rawMarkdownUrl(info.link);

  // size of the open scroll, and where it starts (over the scroll end in its cubby)
  const [g] = useState(() => {
    const vw = window.innerWidth, vh = window.innerHeight;
    const W = Math.min(700, vw - 40);
    const paper = Math.min(vh * 0.86, 940) - ROLLER * 2;
    const r = origin.getBoundingClientRect();
    return {
      W, paper,
      dx: r.left + r.width / 2 - vw / 2,
      dy: r.top + r.height / 2 - vh / 2,
      s: Math.max(0.05, r.width / (W + 30)),
    };
  });

  // the scroll leaves its cubby while it's in your hands
  useLayoutEffect(() => {
    const prev = origin.style.visibility;
    origin.style.visibility = "hidden";
    return () => { origin.style.visibility = prev; };
  }, [origin]);

  // fetch the notes straight away, so they're ready when it finishes unrolling
  useEffect(() => {
    if (!raw) { setNotes({ error: true }); return; }
    let live = true;
    fetch(raw)
      .then((r) => (r.ok ? r.text() : Promise.reject(new Error(String(r.status)))))
      .then((md) => live && setNotes({ html: render(md) }))
      .catch(() => live && setNotes({ error: true }));
    return () => { live = false; };
  }, [raw]);

  // out of the cubby -> closed scroll in the middle -> unrolled -> readable
  useEffect(() => {
    if (reduce) { setPhase("read"); return; }
    const t: number[] = [];
    t.push(window.setTimeout(() => setPhase("fly"), 20));
    t.push(window.setTimeout(() => setPhase("unroll"), 20 + FLY_MS + 60));
    t.push(window.setTimeout(() => setPhase("read"), 20 + FLY_MS + 60 + UNROLL_MS));
    return () => t.forEach(clearTimeout);
  }, [reduce]);

  useEffect(() => { closeRef.current?.focus({ preventScroll: true }); }, []);

  // no page scrolling underneath while it's open
  useEffect(() => {
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => { document.documentElement.style.overflow = prev; };
  }, []);

  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    if (reduce) { onClose(); return; }
    setPhase("rollup");
    window.setTimeout(() => setPhase("return"), ROLLUP_MS);
    window.setTimeout(onClose, ROLLUP_MS + FLY_MS);
  }, [onClose, reduce]);

  useEffect(() => {
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [close]);

  const away = phase === "start" || phase === "return";        // over its cubby, shrunk
  const open = phase === "unroll" || phase === "read";         // paper unrolled
  const stage = {
    transform: away ? `translate(${g.dx}px, ${g.dy}px) scale(${g.s})` : "translate(0, 0) scale(1)",
    opacity: away ? 0.4 : 1,
    transition: phase === "start" ? "none" : `transform ${FLY_MS}ms cubic-bezier(.2,.7,.2,1), opacity ${FLY_MS}ms ease`,
  };
  const paper = {
    height: open ? g.paper : 0,
    transition: `height ${phase === "rollup" ? ROLLUP_MS : UNROLL_MS}ms cubic-bezier(.33,.9,.3,1)`,
  };

  // rendered at the end of <body>, above the page's fixed back link and theme toggle (like the books)
  return createPortal(
    <div className="sc-overlay" data-phase={phase} onClick={close} role="dialog" aria-modal="true" aria-label={s.tip[0].replace(/&amp;/g, "&")}>
      <button ref={closeRef} type="button" className="sc-close" onClick={close} aria-label="Close the scroll">✕</button>
      <div className="sc-stage" style={{ ...stage, width: g.W + 30 }} onClick={(e) => e.stopPropagation()}>
        <div className="sc-roller" aria-hidden />
        <div className="sc-paper" style={{ ...paper, width: g.W }}>
          <div className="sc-text" data-show={phase === "read" ? "" : undefined}>
            <header className="sc-head">
              <h2 dangerouslySetInnerHTML={{ __html: info.title ?? s.tip[0] }} />
              {(info.author || info.date) && <p>{[info.author, info.date].filter(Boolean).join(" · ")}</p>}
              {info.link && <a href={info.link} target="_blank" rel="noopener">Open on GitHub ↗</a>}
            </header>
            {notes.html ? (
              <article className="sc-notes" dangerouslySetInnerHTML={{ __html: notes.html }} />
            ) : notes.error ? (
              <p className="sc-status">These notes couldn&apos;t be loaded here. {info.link && <a href={info.link} target="_blank" rel="noopener">Read them on GitHub ↗</a>}</p>
            ) : (
              <p className="sc-status">Unrolling…</p>
            )}
          </div>
        </div>
        <div className="sc-roller" aria-hidden />
      </div>
    </div>,
    document.body,
  );
}
