"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { COVERS, type CoverKey, type FlatBook, type SpineBook } from "@/data/bookcase";

export type OpenBook = { book: SpineBook | FlatBook; index: number };

const COVER_KEYS = Object.keys(COVERS) as CoverKey[];
const NASTALIQ = { fontFamily: "'Noto Nastaliq Urdu', serif" };
const SHAPES: Record<string, CSSProperties> = {
  arch: { borderRadius: "50px 50px 8px 8px" },
  stepped: { borderRadius: 2, outline: "2px solid var(--gold)", outlineOffset: 3 },
  oval: { borderRadius: "90px / 60px" },
};

const Corner = ({ className = "" }: { className?: string }) => (
  <svg className={`w-12 h-12 ${className}`} fill="none" stroke="var(--gold)" strokeWidth="1.8" viewBox="0 0 40 40">
    <path d="M2,2 L38,2 C28,2 20,10 20,20 C20,10 12,2 2,2 Z" fill="var(--deep)" />
    <path d="M2,2 L2,38 C2,28 10,20 20,20 C10,20 2,12 2,2 Z" fill="var(--deep)" />
    <circle cx="9" cy="9" r="3" fill="var(--hi)" stroke="none" />
  </svg>
);

const Rule = () => <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg,transparent,var(--gold),transparent)" }} />;
const Bar = () => <div className="w-0.5 h-28" style={{ background: "linear-gradient(transparent,var(--gold),transparent)" }} />;

export default function BookModal({ open, onClose }: { open: OpenBook; onClose: () => void }) {
  const { book: b, index } = open;
  const t = COVERS[b.cover ?? COVER_KEYS[index % COVER_KEYS.length]];
  const i = b.info ?? {};
  const title = i.title ?? b.tip[0];
  const sub = i.subtitle ?? b.tip[1];
  const author = i.author ?? ("author" in b ? b.author : "") ?? "";
  const metas = [i.school, i.date, i.edition].filter(Boolean) as string[];
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const vars = { "--base": t.base, "--deep": t.deep, "--gold": t.gold, "--hi": t.hi, filter: "drop-shadow(0 35px 80px rgba(0,0,0,.98))" } as CSSProperties;
  const mix = (a: number) => `color-mix(in srgb,var(--deep) ${a}%,var(--base))`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 md:p-8 backdrop-blur-sm bg-[#0a0705]/65 overflow-y-auto py-8 sm:py-12"
    >
      <div className="relative z-10 w-full max-w-2xl lg:max-w-3xl my-auto flex flex-col items-center" style={vars}>
        <div
          className="relative w-full rounded-sm overflow-hidden p-3 md:p-5 flex min-h-[720px] md:min-h-[780px]"
          style={{ background: t.spine[0], border: `4px solid ${t.spine[1]}`, boxShadow: "inset 0 0 50px rgba(0,0,0,.95),0 0 0 2px var(--gold)" }}
        >
          {/* Spine */}
          <div
            className="w-7 sm:w-9 mr-2 md:mr-3 self-stretch flex flex-col items-center justify-between py-8 flex-shrink-0 shadow-inner"
            style={{ background: `linear-gradient(90deg,${t.spine.join(",")})`, borderRight: "2px solid var(--gold)" }}
          >
            <div className="w-3 h-3 rotate-45" style={{ border: "1px solid var(--gold)", background: "var(--base)" }} />
            <div className="flex flex-col items-center gap-6 my-auto" style={{ color: "var(--gold)" }}>
              <span className="text-xs opacity-85">❖</span><Bar /><span className="text-sm">۞</span><Bar /><span className="text-xs opacity-85">❖</span>
            </div>
            <div className="w-3 h-3 rotate-45" style={{ border: "1px solid var(--gold)", background: "var(--base)" }} />
          </div>

          {/* Cover board */}
          <div className="relative flex-1 rounded-xs p-3 sm:p-5 md:p-6 flex flex-col justify-between overflow-hidden" style={{ background: "var(--base)", border: "2px solid var(--gold)", boxShadow: "inset 0 0 45px rgba(0,0,0,.9)" }}>
            <div className="absolute inset-0 pointer-events-none opacity-40" style={{ background: "radial-gradient(circle at 30% 25%,var(--gold),transparent 45%),radial-gradient(circle at 70% 75%,var(--deep),transparent 55%)", mixBlendMode: "soft-light" }} />
            <div className="relative z-10 w-full h-full p-2 sm:p-3.5 flex flex-col justify-between gap-3" style={{ border: "2px solid var(--hi)", background: mix(55), boxShadow: "0 0 0 2px var(--gold),inset 0 0 0 2px var(--gold)" }}>
              <div className="w-full h-full p-3 sm:p-5 md:p-6 flex flex-col justify-between relative rounded-xs shadow-inner" style={{ border: "2px solid var(--hi)", background: `linear-gradient(180deg,${mix(70)},var(--base) 50%,${mix(75)})` }}>
                <div className="absolute -top-1.5 -left-1.5 pointer-events-none"><Corner /></div>
                <div className="absolute -top-1.5 -right-1.5 pointer-events-none"><Corner className="rotate-90" /></div>
                <div className="absolute -bottom-1.5 -left-1.5 pointer-events-none"><Corner className="-rotate-90" /></div>
                <div className="absolute -bottom-1.5 -right-1.5 pointer-events-none"><Corner className="rotate-180" /></div>

                <div className="flex flex-col items-center pt-2 mb-2">
                  <div className="flex items-center gap-3 mb-1.5 opacity-90">
                    <Rule />
                    <div className="w-4 h-4 rotate-45 flex items-center justify-center" style={{ border: "1px solid var(--gold)", background: "var(--deep)" }}>
                      <span className="w-2 h-2 rotate-45" style={{ background: "var(--gold)" }} />
                    </div>
                    <Rule />
                  </div>
                  <span className="text-xs md:text-sm tracking-[0.35em] uppercase font-medium opacity-95" style={{ color: "var(--hi)" }}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
                </div>

                {/* Title cartouche */}
                <div
                  className="relative w-full my-2 p-5 sm:p-7 md:p-8 flex flex-col items-center text-center"
                  style={{ ...SHAPES[t.shape], border: "2px solid var(--gold)", background: `linear-gradient(180deg,var(--deep),${mix(60)},var(--deep))`, boxShadow: "inset 0 0 30px rgba(0,0,0,.9),0 6px 20px rgba(0,0,0,.7)" }}
                >
                  <div className="relative -top-3 flex items-center gap-2 text-sm" style={{ color: "var(--gold)" }}><span className="text-xs">❖</span><span className="text-base font-serif">۞</span><span className="text-xs">❖</span></div>
                  {i.ar && (
                    <>
                      <h1 className="font-normal text-3xl sm:text-4xl md:text-5xl leading-[1.8] my-2" style={{ ...NASTALIQ, color: "var(--hi)", textShadow: "0 3px 10px color-mix(in srgb,var(--gold) 50%,transparent)" }}>{i.ar}</h1>
                      <div className="flex items-center justify-center gap-4 w-4/5 my-3 opacity-95">
                        <Rule />
                        <div className="flex items-center gap-2" style={{ color: "var(--gold)" }}><span className="text-[10px]">✦</span><span className="text-sm">❖</span><span className="text-[10px]">✦</span></div>
                        <Rule />
                      </div>
                    </>
                  )}
                  <h2 className="font-headline-lg text-xl sm:text-2xl md:text-3xl tracking-[0.2em] uppercase font-semibold text-[#fff4d1]" style={{ textShadow: "0 2px 6px rgba(0,0,0,.95)" }} dangerouslySetInnerHTML={{ __html: title }} />
                  <span className="text-xs md:text-sm tracking-[0.3em] uppercase mt-2 font-serif opacity-90" style={{ color: "var(--gold)" }}>{sub}</span>
                </div>

                {/* Author */}
                <div className="relative w-full my-3 py-3.5 px-6 rounded-sm flex flex-col items-center text-center" style={{ border: "2px solid var(--gold)", background: `linear-gradient(90deg,var(--deep),${mix(60)},var(--deep))`, boxShadow: "inset 0 0 20px rgba(0,0,0,.85)" }}>
                  <span className="text-xs tracking-[0.35em] uppercase opacity-95 mb-1" style={{ color: "var(--hi)" }}>Musannif • Author</span>
                  <p className="font-headline-md text-base sm:text-lg md:text-xl text-white font-medium tracking-[0.06em] leading-snug">{author}</p>
                  {i.authorAr && <span className="text-sm md:text-base italic mt-1 text-[#fed7aa]" style={NASTALIQ}>{i.authorAr}</span>}
                </div>

                {/* Subject + meta */}
                {i.subject && (
                  <div className="relative w-full my-2 rounded-sm p-4 sm:p-5 shadow-inner flex flex-col items-center text-center" style={{ border: "1px solid var(--gold)", background: mix(85) }}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="w-2 h-2 rotate-45" style={{ background: "var(--gold)" }} />
                      <span className="text-xs tracking-[0.3em] uppercase" style={{ color: "var(--hi)" }}>Mawdu&apos; • Subject</span>
                      <span className="w-2 h-2 rotate-45" style={{ background: "var(--gold)" }} />
                    </div>
                    <p className="text-sm sm:text-base text-[#fdf2e9] leading-relaxed italic max-w-md font-serif">“{i.subject}”</p>
                    {metas.length > 0 && (
                      <div className="flex items-center justify-between w-full mt-3 pt-2 text-xs tracking-[0.22em] uppercase" style={{ borderTop: "1px solid color-mix(in srgb,var(--gold) 30%,transparent)", color: "var(--gold)" }}>
                        {metas.flatMap((m, k) => (k ? [<span key={`d${k}`}>•</span>, <span key={m}>{m}</span>] : [<span key={m}>{m}</span>]))}
                      </div>
                    )}
                  </div>
                )}

                {/* Binding footer */}
                {i.binding && (
                  <div className="w-full pt-3">
                    <div className="w-full py-2.5 px-4 rounded-xs flex items-center justify-between text-xs sm:text-sm tracking-wider text-[#e2d9ca] font-serif" style={{ background: "var(--deep)", border: "1px solid color-mix(in srgb,var(--gold) 70%,transparent)" }}>
                      <span className="flex items-center gap-2" style={{ color: "var(--gold)" }}>
                        <span className="material-symbols-outlined text-base">verified</span>
                        <span dangerouslySetInnerHTML={{ __html: b.tip[0] }} />
                      </span>
                      <span style={{ color: "var(--hi)" }}>Bound in {i.binding}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <button ref={closeRef} type="button" onClick={onClose} className="mt-6 px-6 py-2 text-[11px] tracking-[0.3em] uppercase font-serif rounded-xs transition-colors" style={{ background: "#0a0705", color: "var(--gold)", border: "1px solid var(--gold)" }}>
          Return to Shelf
        </button>
      </div>
    </div>
  );
}
