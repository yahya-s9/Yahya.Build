"use client";

import { useState } from "react";
import type { FlatBook, Shelf, SpineBook } from "@/data/bookcase";
import { FlatBookView, SpineBookView } from "./Books";
import BookOpen, { type OpenBook } from "./BookOpen";

export default function Bookcase({ shelves }: { shelves: Record<string, Shelf> }) {
  const [open, setOpen] = useState<{ open: OpenBook; origin: HTMLElement } | null>(null);
  const entries = Object.entries(shelves);
  const allBooks: (SpineBook | FlatBook)[] = entries.flatMap(([, s]) => [...s.books, ...(s.stack ?? [])]);

  const show = (b: SpineBook | FlatBook, origin: HTMLElement) => setOpen({ open: { book: b, index: allBooks.indexOf(b) }, origin });

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
              {s.books.map((b) => <SpineBookView key={b.tip[0]} book={b} onOpen={(el) => show(b, el)} />)}
              {s.stack && (
                <div className="ml-auto hidden md:flex flex-col justify-end items-center flex-shrink-0">
                  {s.stack.map((b) => <FlatBookView key={b.tip[0]} book={b} onOpen={(el) => show(b, el)} />)}
                </div>
              )}
            </div>
            <div className="sh-plank" />
          </section>
        ))}
      </div>
      {open && <BookOpen open={open.open} origin={open.origin} onClose={() => setOpen(null)} />}
    </>
  );
}
