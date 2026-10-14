import type { FlatBook, SpineBook } from "@/data/bookcase";
import Tooltip from "./Tooltip";

// Colours come from data at runtime, so they are applied as inline styles
// (Tailwind can't see dynamically built class names).
type Props<T> = { book: T; onOpen: () => void };

export function SpineBookView({ book: b, onOpen }: Props<SpineBook>) {
  const big = !!b.big;
  const band = { background: b.band };
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Open ${b.tip[0]}`}
      style={{ backgroundImage: `linear-gradient(to right, ${b.grad.join(", ")})`, borderColor: b.edge }}
      className={`book group relative flex flex-col justify-between ${b.size} text-[#f7edde] rounded-t-sm shadow-[-4px_2px_10px_rgba(0,0,0,0.5)] border-t border-r cursor-pointer hover:-translate-y-3.5 transition-all duration-300 flex-shrink-0`}
    >
      <div className={`band w-full ${b.bandH} opacity-85 mt-3`} style={band} />
      <div className="mx-auto my-auto flex flex-col items-center">
        <span
          style={{ color: b.titleColor }}
          className={`${big ? "text-xs md:text-sm tracking-[0.28em] py-3 font-semibold" : "text-[10px] md:text-xs tracking-[0.22em] py-2"} font-headline-sm uppercase [writing-mode:vertical-rl] rotate-180`}
        >
          {b.title}
        </span>
        {b.author && (
          <span
            style={{ color: b.authorColor }}
            className={`${big ? "text-[9px] tracking-widest font-mono" : "text-[8px] opacity-70"} [writing-mode:vertical-rl] rotate-180 mt-1`}
          >
            {b.author}
          </span>
        )}
      </div>
      <div className={`band w-full ${b.bandH} opacity-85 mb-3`} style={band} />
      {b.ribbon && (
        <div
          style={{ background: b.ribbon }}
          className={`absolute ${big ? "-bottom-5 w-2 h-7" : "-bottom-4 w-1.5 h-6"} left-1/2 -translate-x-1/2 shadow-sm rounded-b-xs pointer-events-none`}
        />
      )}
      <Tooltip tip={b.tip} />
    </button>
  );
}

export function FlatBookView({ book: b, onOpen }: Props<FlatBook>) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Open ${b.tip[0]}`}
      style={{ backgroundImage: `linear-gradient(to bottom, ${b.grad.join(", ")})`, borderColor: b.edge }}
      className={`group relative ${b.size} border-t border-l rounded-sm shadow-md flex items-center justify-between px-3 cursor-pointer hover:translate-x-1 transition-transform ${b.overlap ? "-mt-0.5" : ""}`}
    >
      <span style={{ color: b.labelColor }} className="text-[9px] font-headline-sm tracking-widest uppercase">{b.label}</span>
      <span style={{ color: b.glyphColor }} className="text-xs">{b.glyph}</span>
      <Tooltip tip={b.tip} />
    </button>
  );
}
