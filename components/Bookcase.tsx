"use client";

import { useEffect, useState } from "react";
import type { FlatBook, Shelf, SpineBook } from "@/data/bookcase";
import { FlatBookView, SpineBookView } from "./Books";
import BookModal, { type OpenBook } from "./BookModal";

const BOOKEND = {
  brass: { grad: "from-[#8c672b] to-[#5a3f16]", border: "border-[#3d2716]", inlay: "bg-[#a9813d]/60", h: "h-44", inner: "h-28 w-1", op: "opacity-85" },
  wood: { grad: "from-[#4d321d] to-[#342111]", border: "border-[#201309]", inlay: "bg-[#8c672b]/50", h: "h-48", inner: "h-32 w-1.5", op: "opacity-90" },
};

function Bookend({ kind = "wood", side }: { kind?: "brass" | "wood"; side: "left" | "right" }) {
  const k = BOOKEND[kind];
  const left = side === "left";
  return (
    <div
      className={`w-4 ${k.h} ${left ? "bg-gradient-to-r rounded-l-sm border-r" : "bg-gradient-to-l rounded-r-sm border-l ml-auto"} ${k.grad} ${k.border} shadow-lg flex-shrink-0 flex items-center justify-center ${k.op}`}
    >
      <div className={`${k.inner} ${k.inlay}`} />
    </div>
  );
}

export default function Bookcase({ shelves }: { shelves: Record<string, Shelf> }) {
  const [open, setOpen] = useState<OpenBook | null>(null);
  const entries = Object.entries(shelves);
  const allBooks: (SpineBook | FlatBook)[] = entries.flatMap(([, s]) => [...s.books, ...(s.stack ?? [])]);

  const show = (b: SpineBook | FlatBook) => setOpen({ book: b, index: allBooks.indexOf(b) });

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <div>
        {entries.map(([name, s], i) => (
          <div key={name} className={`relative w-full ${i === entries.length - 1 ? "" : "mb-8"}`}>
            <div className="relative w-full bg-[#1f130b] border-x border-[#432a18] p-3 md:px-8 pt-4 pb-0 shadow-inner">
              <div className="flex items-center justify-between pb-3 border-b border-[#3d2716]/60 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-label-sm tracking-[0.3em] uppercase text-[#c4a173]">{name}</span>
                  <span className="text-xs text-[#7e5617]">•</span>
                  <span className="text-xs text-[#a08462] font-serif italic" style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}>{s.arabic}</span>
                </div>
              </div>
              <div className="flex items-end justify-start gap-1 md:gap-2.5 h-[280px] md:h-[320px] px-2 pt-6 overflow-x-auto overflow-y-hidden md:overflow-visible overscroll-x-contain [-webkit-overflow-scrolling:touch]">
                <Bookend kind={s.bookend} side="left" />
                {s.books.map((b) => <SpineBookView key={b.tip[0]} book={b} onOpen={() => show(b)} />)}
                {s.stack && (
                  <div className="ml-auto hidden md:flex flex-col justify-end items-center flex-shrink-0">
                    {s.stack.map((b) => <FlatBookView key={b.tip[0]} book={b} onOpen={() => show(b)} />)}
                  </div>
                )}
                <Bookend kind={s.bookend} side="right" />
              </div>
            </div>
            <div className="w-full h-7 bg-gradient-to-b from-[#47301c] via-[#332112] to-[#1c120a] border-t border-[#6d4c2e] border-b border-[#0d0704] shadow-[0_12px_16px_rgba(0,0,0,0.6)] flex items-center justify-between px-6">
              <div className="w-24 h-0.5 bg-[#69482b]" />
              <div className="text-[#7e5617] text-xs">❖</div>
              <div className="w-24 h-0.5 bg-[#69482b]" />
            </div>
          </div>
        ))}
      </div>
      {open && <BookModal open={open} onClose={() => setOpen(null)} />}
    </>
  );
}
