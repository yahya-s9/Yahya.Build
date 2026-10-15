import Bookcase from "@/components/Bookcase";
import { getBookcase } from "@/lib/library";

export const revalidate = 60;

export default async function Home() {
  const shelves = await getBookcase();
  return (
    <main className="w-full flex flex-col bg-background">
{/* SECTION 1: Folio Hero (Kept exact with scroll hint) */}
<div className="flex flex-col w-full h-[100dvh] max-h-[100dvh] overflow-hidden select-none relative justify-center items-center bg-background border-b border-outline-variant/30">
<div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-multiply bg-[radial-gradient(ellipse_at_center,_transparent_40%,_#e2d9ca_100%)]"></div>
<div className="absolute inset-0 pointer-events-none opacity-25 mix-blend-color-burn bg-[radial-gradient(circle_at_top_right,_#ffddb3_0%,_transparent_60%),radial-gradient(circle_at_bottom_left,_#f2bd74_0%,_transparent_65%)]"></div>
<div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
<div className="relative w-[130vw] h-[130vh] flex items-center justify-center transform -rotate-6 scale-110">
<div className="absolute inset-0 opacity-[0.07] mix-blend-darken flex flex-col justify-between py-10 text-secondary select-none leading-relaxed tracking-normal text-right dir-rtl pointer-events-none blur-[0.3px]" style={{"fontFamily": "\"Noto Nastaliq Urdu\", serif"}}><p className="text-[5.5rem] md:text-[8rem] font-normal leading-[1.8] whitespace-nowrap -mr-28">
  چندان دعا کن در نَهان، چندان بنال اندر شَبان
</p>
<p className="text-[6rem] md:text-[9rem] font-normal leading-[1.8] whitespace-nowrap -ml-20">
  کز گنبدِ هفت آسمان در گوشِ تو آید صدا
</p>
<p className="text-[5.5rem] md:text-[8.5rem] font-normal leading-[1.8] whitespace-nowrap -mr-16">
  چندان دعا کن در نَهان، چندان بنال اندر شَبان
</p>
<p className="text-[6.5rem] md:text-[9.5rem] font-normal leading-[1.8] whitespace-nowrap -ml-36">
  کز گنبدِ هفت آسمان در گوشِ تو آید صدا
</p></div>
<div className="absolute w-96 h-96 rounded-full bg-secondary-fixed opacity-20 blur-3xl mix-blend-multiply pointer-events-none"></div>
</div>
</div>
<div className="relative z-10 w-full max-w-[820px] mx-auto px-6 md:px-12 flex flex-col items-center justify-center">
<div className="relative w-full p-2 md:p-3 bg-surface-container-low shadow-[0_12px_45px_-10px_rgba(31,27,18,0.08)]">
<div className="relative w-full p-2 md:p-2 bg-surface-container-high/60">
<div className="relative w-full px-8 py-16 md:px-16 md:py-24 bg-surface flex flex-col items-center justify-center text-center">
<div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 bg-surface text-secondary flex items-center gap-2">
<span className="w-2 h-2 rotate-45 bg-secondary-fixed-dim inline-block"></span>
<span className="text-label-sm font-label-sm uppercase tracking-[0.35em] text-secondary"><br /></span>
<span className="w-2 h-2 rotate-45 bg-secondary-fixed-dim inline-block"></span>
</div>
<div className="flex items-center justify-center gap-4 mb-10 opacity-75">
<div className="w-12 h-px bg-secondary-fixed-dim"></div>
<div className="w-2 h-2 rotate-45 bg-secondary"></div>
<div className="w-12 h-px bg-secondary-fixed-dim"></div>
</div>
<div className="max-w-[620px] mx-auto">
<p dir="rtl" lang="ar" className="text-primary font-normal text-6xl md:text-8xl leading-[1.9] antialiased" style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}>
              اقرأ!</p>
</div>
<div className="flex items-center justify-center gap-4 mt-10 opacity-75">
<div className="w-12 h-px bg-secondary-fixed-dim"></div>
<div className="w-2 h-2 rotate-45 bg-secondary"></div>
<div className="w-12 h-px bg-secondary-fixed-dim"></div>
</div>
<div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 bg-surface text-on-surface-variant font-label-sm text-label-sm tracking-[0.25em] opacity-60">
            ❖
          </div>
</div>
</div>
</div>
</div>
<div className="sr-only">
<img alt="Historical manuscript reference with fine classical gold and iron-gall ruled lines" className="hidden" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGGsPo7PyCWYUeO9fUamtnRNMuah9CFZeW3GvFFYL0U4oBNJyLB03n_EDlPI_nyZDSlybCtFBQGLo7U4uGF4mp8XaqTa1D1oZpqXWUVZWez5-G9om0Kxc9vNGPC1d0FPqTMUUmEkFBLrnFXxvOVPfFHSENaxdxiuBVU2W6-3ja4xRzxhHZR2CjT956JVAU67BacqMaa36AEkU4W1zR0ZNiVnwDNk0OSUoNK2n31w2zbYp3wa1S2C6XoWw6vk2SRbKpbg" />
</div>
</div>
{/* SECTION 2: Makhzan al-Kutub (The Antique Bookshelf Archive) */}
<section className="relative w-full py-12 md:py-16 px-4 md:px-12 bg-[var(--section)] text-on-surface overflow-hidden" id="makhzan-al-kutub">
{/* Subtle Parchment Backing and Lighting */}
<div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-multiply bg-[radial-gradient(circle_at_50%_0%,_#fffdfa_0%,_#ebdcc8_100%)]"></div>
<div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-color-burn bg-[radial-gradient(circle_at_80%_30%,_#ffddb3_0%,_transparent_50%),radial-gradient(circle_at_20%_80%,_#f2bd74_0%,_transparent_60%)]"></div>
<div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center">
{/* BOOKCASE STRUCTURE */}
<div className="w-full relative">
<Bookcase shelves={shelves} />
<div className="flex justify-end pt-2">
<a className="px-3 py-1 border border-secondary/40 hover:bg-secondary/10 rounded-sm text-secondary text-[11px] font-label-sm uppercase tracking-[0.2em] transition-colors flex items-center gap-1.5" href="#">
<span>Return</span>
<span className="material-symbols-outlined text-xs">arrow_upward</span>
</a>
</div>
</div>
{/* Colophon / Footer Accent */}
<div className="mt-14 text-center flex flex-col items-center opacity-75">
<div className="text-secondary mb-2">❖</div>


</div>
</div>
</section>
</main>
  );
}
