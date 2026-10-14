export default function Tooltip({ tip: [title, sub] }: { tip: [string, string] }) {
  return (
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 hidden md:group-hover:flex z-50 pointer-events-none w-64 md:w-72 flex-col items-center filter drop-shadow-[0_12px_30px_rgba(15,10,5,0.65)]">
      <div className="w-full bg-[#fdf8f0] text-[#1f1b12] border-2 border-[#7e5617] p-3.5 rounded-sm relative">
        <div className="w-full h-full border border-[#d4af37]/60 p-2 flex flex-col items-center text-center bg-[#fffdf9]/70 relative">
          <span className="absolute -top-1.5 -left-1.5 text-[8px] text-[#7e5617] leading-none">❖</span>
          <span className="absolute -top-1.5 -right-1.5 text-[8px] text-[#7e5617] leading-none">❖</span>
          <span className="absolute -bottom-1.5 -left-1.5 text-[8px] text-[#7e5617] leading-none">❖</span>
          <span className="absolute -bottom-1.5 -right-1.5 text-[8px] text-[#7e5617] leading-none">❖</span>
          <div className="flex items-center justify-center gap-2 w-full pb-1 mb-1 border-b border-[#e2d9ca]">
            <span className="w-1.5 h-1.5 rotate-45 bg-[#7e5617]" />
            <h4 className="font-headline-sm text-xs md:text-sm text-[#4c0d0d] font-semibold tracking-wider uppercase" dangerouslySetInnerHTML={{ __html: title }} />
            <span className="w-1.5 h-1.5 rotate-45 bg-[#7e5617]" />
          </div>
          <p className="font-body-md italic text-[11px] md:text-xs text-[#4d453f] leading-snug my-1" dangerouslySetInnerHTML={{ __html: sub }} />
        </div>
      </div>
      <div className="relative -mt-2 w-3 h-3 rotate-45 bg-[#fdf8f0] border-r-2 border-b-2 border-[#7e5617]" />
    </div>
  );
}
