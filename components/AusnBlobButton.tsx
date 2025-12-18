"use client"

export function AusnBlobButton() {
  return (
    <a
      href="/ausn/"
      className="
        fixed z-[60] top-auto bottom-[14vh] right-[4vw] md:bottom-auto md:top-[12vh] md:right-[12vh]
        flex items-center justify-center
        w-16 h-16 md:w-48 md:h-48
        bg-[#FF00A8]
        text-white text-[11px] md:text-3xl font-extrabold leading-[1.05] md:leading-tight
        shadow-[0_0_28px_rgba(255,0,168,0.55)]
        rotate-[-18deg]
        hover:rotate-[-10deg]
        hover:scale-110
        transition-transform duration-300 ease-out
        cursor-pointer
        select-none
        blob-ausn
        blob-ausn-vibrate
      "
    >
      АУСН
    </a>
  )
}
