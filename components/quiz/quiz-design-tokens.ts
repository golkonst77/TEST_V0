/** Quiz v2.3 — unified visual tokens (UI only) */

export const quizModalShellClass =
  "max-w-6xl w-[calc(100vw-1.5rem)] h-auto max-h-[calc(100vh-48px)] md:max-h-[calc(100vh-48px)] p-0 overflow-hidden rounded-2xl border border-stone-200/80 shadow-2xl shadow-stone-900/12 bg-gradient-to-br from-stone-50 via-white to-indigo-50/40 flex flex-col"

export const quizHeaderClass =
  "relative z-10 shrink-0 border-b border-stone-200/70 bg-gradient-to-b from-white to-stone-50/90 px-4 md:px-5 py-2.5 md:py-3 text-center"

export const quizHeaderBadgeClass =
  "inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-700 ring-1 ring-indigo-200/80"

export const quizLeftColumnClass =
  "relative z-10 flex min-w-0 flex-[1_1_68%] flex-col overflow-hidden bg-gradient-to-br from-slate-50/90 via-white to-indigo-50/40 px-3 md:px-4 py-2 md:py-3"

export const quizMainPanelClass =
  "flex min-h-0 flex-1 flex-col md:rounded-2xl md:border md:border-stone-200/70 md:bg-gradient-to-b md:from-white md:to-stone-50/60 md:p-3.5 md:shadow-sm md:shadow-stone-900/[0.05] md:ring-1 md:ring-inset md:ring-white/80"

export const quizSectionPanelClass =
  "flex flex-col h-full rounded-2xl border border-stone-200/70 bg-gradient-to-b from-white via-white to-indigo-50/30 p-3 md:p-3.5 shadow-sm shadow-indigo-950/[0.06] ring-1 ring-inset ring-white/90 md:flex-1 md:min-h-0"

export const quizStep2PanelClass =
  "flex flex-1 min-h-0 flex-col rounded-2xl border border-stone-200/70 bg-gradient-to-b from-white via-white to-indigo-50/25 p-3 md:p-3.5 shadow-sm shadow-indigo-950/[0.06] ring-1 ring-inset ring-white/90 md:justify-center"

export const quizProgressTrackClass =
  "relative h-1.5 w-full overflow-hidden rounded-full bg-stone-200/75 shadow-inner"

export const quizProgressFillClass =
  "relative h-full rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-fuchsia-600 transition-all duration-500 ease-out shadow-sm shadow-indigo-500/35"

export const quizFooterClass =
  "sticky bottom-0 z-20 mt-auto shrink-0 border-t border-stone-200/70 bg-gradient-to-t from-white via-white to-stone-50/80 -mx-3 px-3 py-3 md:static md:-mx-0 md:px-0 md:py-0 md:bg-transparent md:border-t-0 md:pt-0"

export const quizFooterInnerClass =
  "md:mt-auto md:border-t md:border-stone-200/70 md:bg-gradient-to-t md:from-white md:via-white md:to-stone-50/70 md:pt-3"

export const quizIconBoxBase =
  "flex shrink-0 items-center justify-center rounded-xl transition-all duration-300"

export function quizIconBoxClass(selected: boolean) {
  return selected
    ? `${quizIconBoxBase} h-12 w-12 bg-gradient-to-br from-white to-indigo-100 text-indigo-600 shadow-md shadow-indigo-500/25 ring-2 ring-indigo-200/80`
    : `${quizIconBoxBase} h-12 w-12 bg-stone-100/90 text-stone-500 group-hover:bg-indigo-50 group-hover:text-indigo-600`
}

export function quizIconBoxChoiceClass(selected: boolean) {
  return selected
    ? `${quizIconBoxBase} h-10 w-10 bg-gradient-to-br from-white to-indigo-100 text-indigo-600 shadow-md shadow-indigo-500/25 ring-2 ring-indigo-200/80`
    : `${quizIconBoxBase} h-10 w-10 bg-stone-100/90 text-stone-500 group-hover:bg-indigo-50 group-hover:text-indigo-600`
}

const optionMotion = "transition-all duration-300 ease-out"

export function optionCardClass(selected: boolean, layout: "stack" | "row" | "wide" | "choice" = "stack") {
  if (selected) {
    const strong =
      layout === "choice"
        ? "border-indigo-600 bg-gradient-to-br from-indigo-100/80 via-white to-violet-50/50 shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-500/25 -translate-y-0.5"
        : "border-indigo-600 bg-gradient-to-br from-indigo-100/70 via-white to-violet-50/40 shadow-xl shadow-indigo-500/35 ring-2 ring-indigo-500/25 -translate-y-0.5"
    return `${optionMotion} ${strong} text-stone-900`
  }
  return `${optionMotion} border-stone-200/80 bg-gradient-to-b from-white to-stone-50/95 text-stone-700 shadow-sm shadow-stone-900/[0.05] hover:border-indigo-400/80 hover:from-white hover:to-indigo-50/70 hover:-translate-y-0.5 hover:shadow-md hover:shadow-indigo-500/15 active:translate-y-0`
}

export const quizSelectedCheckClass =
  "absolute top-2.5 right-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/50 ring-2 ring-white"

export const quizSelectedCheckCompactClass =
  "absolute top-2.5 right-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/50 ring-2 ring-white"

export const quizCtaBaseClass =
  "group relative flex-1 min-h-12 h-12 md:h-[3.25rem] overflow-hidden rounded-xl text-sm md:text-base font-bold transition-all duration-300 ease-out before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-1/2 before:bg-gradient-to-b before:from-white/25 before:to-transparent"

export const quizCtaEnabledClass =
  `${quizCtaBaseClass} text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 shadow-[0_4px_16px_rgba(79,70,229,0.4)] hover:from-indigo-500 hover:via-violet-500 hover:to-fuchsia-500 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(79,70,229,0.45)] active:translate-y-0 active:scale-[0.99]`

export const quizCtaDisabledClass =
  `${quizCtaBaseClass} cursor-not-allowed bg-gradient-to-r from-stone-200 to-stone-300 text-stone-500 shadow-none hover:translate-y-0`

export function quizCtaClass(enabled: boolean) {
  return enabled ? quizCtaEnabledClass : quizCtaDisabledClass
}

export const quizSidebarShellClass =
  "hidden md:flex w-[32%] min-w-[260px] max-w-[380px] shrink-0 relative overflow-hidden border-l border-indigo-950/30"

export const quizSidebarBgClass =
  "absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-950"

export const quizSidebarGlowClass =
  "absolute inset-0 bg-[radial-gradient(ellipse_at_15%_0%,rgba(129,140,248,0.4),transparent_50%)]"

export const quizSidebarGlowBottomClass =
  "absolute inset-0 bg-[radial-gradient(ellipse_at_100%_100%,rgba(217,70,239,0.15),transparent_45%)]"

export const quizFormPanelClass =
  "rounded-2xl border border-stone-200/70 bg-gradient-to-b from-white via-white to-indigo-50/20 p-4 md:p-5 space-y-3 shadow-md shadow-indigo-950/[0.06] ring-1 ring-inset ring-white/90"

export const quizInputClass =
  "mt-1.5 h-12 md:h-[3.25rem] text-sm border-stone-200/80 bg-gradient-to-b from-white to-stone-50/90 shadow-sm shadow-stone-900/[0.04] transition-all duration-200 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/25 focus:shadow-md focus:shadow-indigo-500/15 rounded-xl w-full pl-10"

export const quizConsentCardClass =
  "flex items-start gap-3 rounded-xl border border-indigo-200/60 bg-indigo-50/40 px-3.5 py-3 ring-1 ring-inset ring-white/80"

export const quizOptionalLabelClass = "font-normal text-stone-500"
