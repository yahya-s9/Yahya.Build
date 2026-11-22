"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { FlatBook, ScrollItem, Shelf, SpineBook } from "@/data/bookcase";
import { lookOf } from "@/lib/look";
import { FlatBookView, SpineBookView, coverBase } from "./Books";
import BookOpen, { type OpenBook } from "./BookOpen";
import ScrollBoxes, { BOX_W, PER_BOX } from "./Scrolls";

const GAP = 2; // px between books
const PAD = 56; // horizontal padding inside a shelf row
const PILE_W = 180; // the horizontal books lie in a pile this wide, at the end of the last shelf

const widthOf = (b: SpineBook) => lookOf(b.tip[0], !!b.big, coverBase(b.cover)).w;

/** Fills each shelf before starting the next. `end` is the room the last shelf needs after its books
 *  (the scroll boxes and the pile of horizontal books). */
function pack(books: SpineBook[], avail: number, end: number): SpineBook[][] {
  const rows: SpineBook[][] = [[]];
  let used = 0;
  for (const b of books) {
    const w = widthOf(b) + GAP;
    const row = rows[rows.length - 1];
    if (row.length && used + w > avail) {
      rows.push([b]);
      used = w;
    } else {
      row.push(b);
      used += w;
    }
  }
  // the scroll boxes and the pile need room at the end of the last shelf, or a shelf of their own
  if (end > 0 && used + end > avail && rows[rows.length - 1].length) rows.push([]);
  return rows;
}

export default function Bookcase({ shelves }: { shelves: Record<string, Shelf> }) {
  const [open, setOpen] = useState<{ open: OpenBook; origin: HTMLElement } | null>(null);
  const [avail, setAvail] = useState(1000);
  const boxRef = useRef<HTMLDivElement>(null);

  // measure how much room a shelf has, and keep it up to date
  useLayoutEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const measure = () => {
      setAvail(Math.max(160, el.clientWidth - PAD));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const all = Object.values(shelves);
  const books = all.flatMap((s) => s.books);
  const flats = all.flatMap((s) => s.stack ?? []);
  const scrolls = all.flatMap((s) => s.scrolls ?? []);
  const everything: (SpineBook | FlatBook | ScrollItem)[] = [...books, ...scrolls, ...flats];
  const pile = flats.length > 0;
  const boxes = Math.ceil(scrolls.length / PER_BOX);
  const end = (pile ? PILE_W : 0) + (boxes ? boxes * (BOX_W + 8) + 16 : 0);
  const rows = pack(books, avail, end);

  const show = (b: SpineBook | FlatBook | ScrollItem, origin: HTMLElement) =>
    setOpen({ open: { book: b, index: everything.indexOf(b) }, origin });

  return (
    <>
      <div ref={boxRef}>
        {rows.map((row, i) => (
          <section key={i} className={i === rows.length - 1 ? "" : "mb-2"}>
            <div className="sh-row">
              {row.map((b) => <SpineBookView key={b.tip[0]} book={b} onOpen={(el) => show(b, el)} />)}
              {boxes > 0 && i === rows.length - 1 && <ScrollBoxes scrolls={scrolls} onOpen={(s, el) => show(s, el)} />}
              {pile && i === rows.length - 1 && (
                <div className="ml-auto flex flex-col justify-end items-center flex-shrink-0">
                  {flats.map((b) => <FlatBookView key={b.tip[0]} book={b} onOpen={(el) => show(b, el)} />)}
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
