"use client"

export function RiskBlobButton() {
  return (
    <a
      href="https://prostoburo.com/risk/"
      className="
        fixed z-[60] top-auto bottom-[5vh] right-[2vw] md:bottom-auto md:top-[42vh] md:right-[8vh]
        flex items-center justify-center
        w-12 h-12 md:w-36 md:h-36
        bg-[#FF00A8]
        text-white text-[7px] md:text-sm font-extrabold leading-[1.05] md:leading-tight text-center px-1.5
        shadow-[0_0_28px_rgba(255,0,168,0.55)]
        rotate-[12deg]
        hover:rotate-[18deg]
        hover:scale-110
        transition-transform duration-300 ease-out
        cursor-pointer
        select-none
        blob-ausn
        blob-ausn-vibrate
      "
    >
      Риски дробления<br />и самозанятых
    </a>
  )
}
