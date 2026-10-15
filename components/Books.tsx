import type { FlatBook, SpineBook } from "@/data/bookcase";
import { lookOf, titleSize, type Look } from "@/lib/look";
import { COVERS, type CoverKey } from "@/data/bookcase";

export const coverBase = (k?: CoverKey) => (k ? COVERS[k]?.base : undefined);
import Tooltip from "./Tooltip";

// Colours come from data at runtime, so they are applied as inline styles
// (Tailwind can't see dynamically built class names).
const ARABIC = /[\u0600-\u06FF]/;
const NASTALIQ = { fontFamily: "'Noto Nastaliq Urdu', serif" };

type Props<T> = { book: T; onOpen: (el: HTMLElement) => void };

/** A book seen end-on. Also used as the spine of the 3D book when it is taken off the shelf. */
export function Spine({ book: b, look }: { book: SpineBook; look: Look }) {
  const arabic = ARABIC.test(b.title);
  const size = titleSize(b.title, look.w, look.h, look.style, arabic);
  return (
    <div
      className="sp"
      data-s={look.style}
      data-light={look.light ? "" : undefined}
      style={{ width: look.w, height: look.h, background: look.color, color: look.fg, ["--fg" as string]: look.fg }}
    >
      {look.style === "bands" && (<><span className="sp-bands t" /><span className="sp-bands b" /></>)}
      {look.style === "foil" && <span className="sp-orn">◆</span>}
      <span className="sp-tw">
        <span className={`sp-title ${arabic ? "" : "latin"}`} style={{ fontSize: size }}>{b.title}</span>
      </span>
      {b.author && <span className="sp-author">{b.author}</span>}
    </div>
  );
}

export function SpineBookView({ book: b, onOpen }: Props<SpineBook>) {
  const look = lookOf(b.tip[0], !!b.big, coverBase(b.cover));
  return (
    <button type="button" onClick={(e) => onOpen(e.currentTarget.querySelector<HTMLElement>(".sp") ?? e.currentTarget)} aria-label={`Open ${b.tip[0]}`} className="sp-bk group">
      <Spine book={b} look={look} />
      <Tooltip tip={b.tip} />
    </button>
  );
}

export function FlatBookView({ book: b, onOpen }: Props<FlatBook>) {
  return (
    <button
      type="button"
      onClick={(e) => onOpen(e.currentTarget)}
      aria-label={`Open ${b.tip[0]}`}
      style={{ backgroundImage: `linear-gradient(to bottom, ${b.grad.join(", ")})`, borderColor: b.edge }}
      className={`sp-flat group relative ${b.size} border-t border-l rounded-sm flex items-center justify-between px-3 cursor-pointer hover:translate-x-1 transition-transform ${b.overlap ? "-mt-0.5" : ""}`}
    >
      <span style={ARABIC.test(b.label) ? { color: b.labelColor, ...NASTALIQ } : { color: b.labelColor }} className={ARABIC.test(b.label) ? "text-sm leading-[1.9]" : "text-[9px] font-headline-sm tracking-widest uppercase"}>{b.label}</span>
      <span style={{ color: b.glyphColor }} className="text-xs">{b.glyph}</span>
      <Tooltip tip={b.tip} />
    </button>
  );
}
