"use client";

import { useEffect, useState } from "react";
import type { FlatBook, Shelf, SpineBook } from "@/data/bookcase";
import { FlatBookView, SpineBookView } from "./Books";
import BookModal, { type OpenBook } from "./BookModal";

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
          <section key={name} className={i === entries.length - 1 ? "" : "mb-4"}>
            <div className="flex items-baseline gap-3 px-1 mb-1.5 text-on-surface-variant">
              <h3 className="text-[12px] font-label-sm tracking-[0.3em] uppercase">{name}</h3>
              {s.arabic && <span className="text-sm opacity-80" style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}>{s.arabic}</span>}
            </div>
            <div className="sh-row">
              {s.books.map((b) => <SpineBookView key={b.tip[0]} book={b} onOpen={() => show(b)} />)}
              {s.stack && (
                <div className="ml-auto hidden md:flex flex-col justify-end items-center flex-shrink-0">
                  {s.stack.map((b) => <FlatBookView key={b.tip[0]} book={b} onOpen={() => show(b)} />)}
                </div>
              )}
            </div>
            <div className="sh-plank" />
          </section>
        ))}
      </div>
      {open && <BookModal open={open} onClose={() => setOpen(null)} />}
    </>
  );
}
