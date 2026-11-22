import Bookcase from "@/components/Bookcase";
import { getBookcase } from "@/lib/library";

export const revalidate = 60;

export default async function Home() {
  const shelves = await getBookcase();
  return (
    <main className="w-full flex flex-col bg-background">
{/* Back to the homepage. Mirrors the theme toggle (top right). A plain <a>: "/" is a static page, not a Next route. */}
<a
  href="/"
  className="fixed top-4 left-4 z-[90] h-10 pl-3 pr-4 rounded-full flex items-center gap-1.5 border border-secondary/40 bg-surface/80 text-secondary backdrop-blur hover:bg-secondary/10 transition-colors text-[11px] font-label-sm uppercase tracking-[0.2em]"
>
  <span className="material-symbols-outlined text-base" aria-hidden>arrow_back</span>
  <span>Yahya Builds</span>
</a>
{/* One section: the poetry backdrop, with the bookcase inside the folio box. It grows past one screen when the shelves need it. */}
<div className="flex flex-col w-full min-h-[100dvh] overflow-hidden select-none relative justify-center items-center bg-background py-12">
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
<div className="relative z-10 w-full max-w-[1040px] mx-auto px-4 md:px-12 flex flex-col items-center justify-center">
<div className="relative w-full p-2 md:p-3 bg-surface-container-low shadow-[0_12px_45px_-10px_rgba(31,27,18,0.08)]">
<div className="relative w-full p-2 md:p-2 bg-surface-container-high/60">
<div className="relative w-full px-3 py-10 md:px-10 md:py-10 bg-surface flex flex-col items-center justify-center text-center">
<div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 bg-surface text-secondary flex items-center gap-2">
<span className="w-2 h-2 rotate-45 bg-secondary-fixed-dim inline-block"></span>
<span className="text-label-sm font-label-sm uppercase tracking-[0.35em] text-secondary"><br /></span>
<span className="w-2 h-2 rotate-45 bg-secondary-fixed-dim inline-block"></span>
</div>
<h1 className="text-primary font-headline-xl text-headline-xl-mobile md:text-headline-xl text-balance mb-4">Yahya&apos;s Bookshelf</h1>
<div className="flex items-center justify-center gap-4 mb-8 opacity-75">
<div className="w-12 h-px bg-secondary-fixed-dim"></div>
<div className="w-2 h-2 rotate-45 bg-secondary"></div>
<div className="w-12 h-px bg-secondary-fixed-dim"></div>
</div>
{/* The bookcase, where اقرأ! used to sit. select-text: the section above turns text selection off. */}
<div className="w-full relative text-left select-text">
<Bookcase shelves={shelves} />
</div>
<div className="flex items-center justify-center gap-4 mt-6 opacity-75">
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
</main>
  );
}
