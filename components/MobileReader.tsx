"use client";

import { useEffect, useRef, useState } from "react";
import type { BookInfo, TocEntry } from "@/data/bookcase";
import { openNotes, type NotesDoc } from "@/lib/pdf-notes";

const NASTALIQ = { fontFamily: "'Noto Nastaliq Urdu', serif" };

/** One page of notes: drawn only when it scrolls near the screen. */
function Page({ doc, n }: { doc: NotesDoc; n: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          doc.render(n).then(setSrc).catch(() => {});
        }
      },
      { rootMargin: "900px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [doc, n]);

  return (
    <div ref={ref} className="mb-3 overflow-hidden rounded-sm" style={{ boxShadow: "0 2px 10px rgba(60,35,12,.35)", background: "#f1e3b4", aspectRatio: src ? undefined : "0.76" }}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={`Notes, page ${n}`} draggable={false} className="block w-full select-none" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-xs tracking-[0.3em] opacity-50">…</div>
      )}
    </div>
  );
}

/** The phone version of an open book: the title page, then the notes as one long scroll. No page turning. */
export default function MobileReader({ title, info, author, color }: { title: string; info: BookInfo; author: string; color: string }) {
  const chapters: TocEntry[] = (info.toc ?? []).filter((e) => e.href);
  const [sel, setSel] = useState(0);
  const [doc, setDoc] = useState<NotesDoc | null>(null);
  const [failed, setFailed] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const notesTop = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const entry = chapters[sel];
    if (!entry?.href) return;
    let live = true;
    setDoc(null);
    setFailed(false);
    openNotes(entry.href).then((d) => live && setDoc(d)).catch(() => live && setFailed(true));
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sel]);

  const choose = (k: number) => {
    setSel(k);
    // start the chosen chapter at the top of the notes
    requestAnimationFrame(() => notesTop.current?.scrollIntoView({ block: "start" }));
  };

  return (
    <div ref={scroller} className="ob-reader parchment" role="dialog" aria-label={title}>
      <div className="flex flex-col items-center gap-4 px-6 pb-8 pt-14 text-center" style={{ color: "#3a2a18" }}>
        <span className="text-xs tracking-[0.5em] opacity-70">❖ ✦ ❖</span>
        <p dir="rtl" lang="ar" className="text-[1.9rem] leading-[2.3]" style={{ ...NASTALIQ, textShadow: "0 0 .6px rgba(58,42,24,.5)" }}>
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>
        <span className="h-px w-16 opacity-40" style={{ background: "#3a2a18" }} />
      </div>
      <div className="flex flex-col items-center gap-3 px-7 pb-8 pt-10 text-center" style={{ color: "#3a2a18" }}>
        <span className="text-xs tracking-[0.4em]" style={{ color }}>❖ ✦ ❖</span>
        {info.ar && <h2 className="text-3xl leading-[1.8]" style={{ ...NASTALIQ, color: "#2f2012" }}>{info.ar}</h2>}
        <h3 className="font-headline-md text-lg uppercase tracking-[0.12em]" dangerouslySetInnerHTML={{ __html: info.title ?? title }} />
        <div className="h-px w-16" style={{ background: color, opacity: 0.5 }} />
        <p className="font-serif text-base">{author}</p>
        {info.authorAr && <p className="text-sm" style={{ ...NASTALIQ, lineHeight: 1.9 }}>{info.authorAr}</p>}
        {info.subject && <p className="max-w-[17rem] font-serif text-sm italic opacity-80">“{info.subject}”</p>}
      </div>

      {chapters.length > 0 && (
        <>
          <div ref={notesTop} className="sticky top-0 z-10 px-4 py-2" style={{ background: "linear-gradient(#ecdcb0, rgba(236,220,176,.92))", borderTop: "1px solid rgba(90,60,25,.25)", borderBottom: "1px solid rgba(90,60,25,.25)" }}>
            <label className="flex items-center gap-2 font-serif text-sm" style={{ color: "#3a2a18" }}>
              <span className="text-[10px] uppercase tracking-[0.3em] opacity-60">Contents</span>
              <select
                value={sel}
                onChange={(e) => choose(Number(e.target.value))}
                className="min-w-0 flex-1 rounded-sm border bg-transparent px-2 py-1"
                style={{ borderColor: "rgba(90,60,25,.35)" }}
                aria-label="Jump to a chapter"
              >
                {chapters.map((e, k) => (
                  <option key={k} value={k}>{e.n ? `${e.n}. ` : ""}{e.title}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="px-3 pb-10 pt-4">
            {failed ? (
              <p className="py-10 text-center font-serif text-sm">
                These notes couldn’t be loaded.{" "}
                <a href={chapters[sel].href} target="_blank" rel="noopener noreferrer" className="underline">Open on GitHub ↗</a>
              </p>
            ) : doc ? (
              Array.from({ length: doc.pages }, (_, k) => <Page key={`${sel}-${k}`} doc={doc} n={k + 1} />)
            ) : (
              <p className="py-16 text-center text-xs uppercase tracking-[0.3em] opacity-50">Opening the notes…</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
