"use client"

// ✅ WhatsApp отправка включена обратно
// Дата включения: 2025-09-04

import { useRef, useState, useEffect, Children, type ReactNode, type ElementType } from "react"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { useContactForm } from "@/hooks/use-contact-form"
import {
  ArrowRight,
  ArrowLeft,
  X,
  Check,
  Briefcase,
  Building2,
  Rocket,
  Users,
  FileText,
  ShieldCheck,
  MessageCircle,
  ClipboardCheck,
  AlertCircle,
  Scale,
  FolderOpen,
  RefreshCw,
  BadgeCheck,
  Sparkles,
} from "lucide-react"
import { sendYandexMetric, YANDEX_METRICS_EVENTS } from "@/utils/yandex-metrics"
import { QuizFinalStep, type QuizFinalStepHandle } from "@/components/quiz/QuizFinalStep"
import {
  optionCardClass,
  quizCtaClass,
  quizFooterClass,
  quizFooterInnerClass,
  quizFormPanelClass,
  quizHeaderBadgeClass,
  quizHeaderClass,
  quizIconBoxChoiceClass,
  quizIconBoxClass,
  quizLeftColumnClass,
  quizMainPanelClass,
  quizModalShellClass,
  quizProgressFillClass,
  quizProgressTrackClass,
  quizSectionPanelClass,
  quizSelectedCheckClass,
  quizSelectedCheckCompactClass,
  quizSidebarBgClass,
  quizSidebarGlowBottomClass,
  quizSidebarGlowClass,
  quizSidebarShellClass,
  quizStep2PanelClass,
} from "@/components/quiz/quiz-design-tokens"

const SIDEBAR_POINT_ICONS = [BadgeCheck, Sparkles, ShieldCheck] as const

interface QuizAnswer {
  questionId: number
  answer: string | string[] | Record<string, string>
}

type SidebarContext = {
  title: string
  shortSummary: string
  points: [string, string, string]
  trustLine: string
}

const STEP2_OPTIONS = [
  { value: "self-accounting", label: "Ведём бухгалтерию сами", icon: ClipboardCheck },
  { value: "reporting-confidence", label: "Есть сомнения в отчётности", icon: AlertCircle },
  { value: "fns-requests", label: "Приходят требования ФНС", icon: ShieldCheck },
  { value: "docs-order", label: "Нужен порядок в документах", icon: FolderOpen },
  { value: "handover", label: "Переходим от бухгалтера", icon: RefreshCw },
  { value: "responsibility", label: "Нужна понятная стоимость", icon: Scale },
] as const

const COMPANY_OPTIONS = [
  { value: "ip", label: "ИП", icon: Briefcase },
  { value: "ooo", label: "ООО", icon: Building2 },
  { value: "new", label: "Открою бизнес", hint: "Скоро открою", icon: Rocket, wide: true },
] as const

const TAX_OPTIONS = [
  { value: "usn", label: "(A)УСН", icon: FileText },
  { value: "osn", label: "ОСНО", icon: Scale },
  { value: "not-selected", label: "Нужна консультация", icon: MessageCircle, wide: true },
] as const

const EMPLOYEE_OPTIONS = [
  { value: "0", label: "Нет", icon: Users },
  { value: "has", label: "Есть", icon: Users },
  { value: "plan", label: "Планирую нанимать", icon: Users, wide: true },
] as const

const questions = [
  {
    id: 1,
    title: "О вашем бизнесе",
    type: "business" as const,
  },
  {
    id: 2,
    title: "Что сейчас вызывает сложности?",
    subtitle: "Можно выбрать несколько",
    type: "multiple" as const,
    options: [...STEP2_OPTIONS],
  },
]

function SelectedCheckBadge({ compact = false }: { compact?: boolean }) {
  return (
    <span className={compact ? quizSelectedCheckCompactClass : quizSelectedCheckClass}>
      <Check className={compact ? "h-2.5 w-2.5 stroke-[2.5]" : "h-3 w-3 stroke-[2.5]"} />
    </span>
  )
}

function SectionHeading({
  number,
  title,
  icon: Icon,
}: {
  number: number
  title: string
  icon: ElementType<{ className?: string }>
}) {
  return (
    <div className="flex items-center gap-2.5 mb-3 shrink-0">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 text-xs font-bold text-white shadow-sm shadow-indigo-600/30">
        {number}
      </span>
      <span className="text-[15px] font-bold text-stone-900 tracking-tight leading-tight line-clamp-2 min-w-0 flex-1">
        {title}
      </span>
      <Icon className="h-4 w-4 shrink-0 text-indigo-500/80" />
    </div>
  )
}

function BusinessMiniPanel({
  number,
  title,
  icon,
  children,
}: {
  number: number
  title: string
  icon: ElementType<{ className?: string }>
  children: ReactNode
}) {
  return (
    <section className={quizSectionPanelClass}>
      <SectionHeading number={number} title={title} icon={icon} />
      <div className="grid grid-cols-2 gap-3 flex-1 min-h-0 content-start">
        {(() => {
          const items = Children.toArray(children)
          return items.map((child, index) => (
            <div
              key={(child as { key?: string | number })?.key ?? index}
              className={`min-h-0 flex w-full ${index === items.length - 1 && items.length === 3 ? "col-span-2" : ""}`}
            >
              {child}
            </div>
          ))
        })()}
      </div>
    </section>
  )
}

function OptionCard({
  selected,
  onClick,
  icon: Icon,
  children,
  layout = "stack",
  hint,
}: {
  selected: boolean
  onClick: () => void
  icon: ElementType<{ className?: string }>
  children: ReactNode
  layout?: "stack" | "row" | "wide" | "choice"
  hint?: string
}) {
  const stackLayout = layout === "stack"
  const wideLayout = layout === "wide"
  const rowLayout = layout === "row"
  const choiceLayout = layout === "choice"

  return (
    <button
      type="button"
      onClick={onClick}
      title={hint}
      className={`group relative w-full h-full rounded-xl border ${optionCardClass(selected, layout)} ${
        choiceLayout
          ? "flex items-start min-h-[4.75rem] md:min-h-[5rem] h-full w-full px-4 py-3.5 text-left"
          : wideLayout
            ? "flex flex-row items-center justify-center gap-3.5 min-h-[100px] md:min-h-[108px] h-full w-full px-4 py-4"
            : stackLayout
              ? "flex flex-col items-center justify-center text-center gap-3 min-h-[100px] md:min-h-[108px] h-full w-full shrink-0 px-4 py-4"
              : "flex items-center min-h-[56px] md:min-h-[60px] h-[56px] md:h-[60px] px-3.5 py-3 text-left"
      }`}
    >
      {selected ? <SelectedCheckBadge compact={rowLayout} /> : null}
      {wideLayout ? (
        <>
          <span className={quizIconBoxClass(selected)}>
            <Icon className="h-5 w-5" />
          </span>
          <span
            className={`text-[15px] leading-tight text-center ${selected ? "font-bold text-stone-900" : "font-semibold text-stone-600"}`}
          >
            {children}
          </span>
        </>
      ) : choiceLayout ? (
        <div className="flex items-start gap-3 w-full pr-7 min-w-0">
          <span className={quizIconBoxChoiceClass(selected)}>
            <Icon className="h-[1.125rem] w-[1.125rem]" />
          </span>
          <span
            className={`min-w-0 flex-1 text-[13px] md:text-sm leading-snug line-clamp-2 ${selected ? "font-bold text-stone-900" : "font-semibold text-stone-600"}`}
          >
            {children}
          </span>
        </div>
      ) : stackLayout ? (
        <>
          <span className={quizIconBoxClass(selected)}>
            <Icon className="h-5 w-5" />
          </span>
          <span
            className={`block w-full text-center text-[15px] leading-tight whitespace-nowrap ${selected ? "font-bold text-stone-900" : "font-semibold text-stone-600"}`}
          >
            {children}
          </span>
        </>
      ) : (
        <div className="flex items-center gap-2 pr-5 md:pr-6 h-full w-full min-w-0">
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
              selected ? "bg-white text-indigo-600 shadow-sm ring-1 ring-indigo-200" : "bg-stone-100 text-stone-500"
            }`}
          >
            <Icon className="h-[1.125rem] w-[1.125rem]" />
          </span>
          <span
            className={`min-w-0 flex-1 truncate text-sm leading-tight whitespace-nowrap ${selected ? "font-bold text-stone-900" : "font-semibold text-stone-600"}`}
          >
            {children}
          </span>
        </div>
      )}
    </button>
  )
}

function QuizStepFooter({
  canProceed,
  onNext,
  onBack,
  showBack,
  isPhoneStep,
  onSubmit,
  canSubmit,
  isSubmitting,
}: {
  canProceed: boolean
  onNext: () => void
  onBack: () => void
  showBack: boolean
  isPhoneStep: boolean
  onSubmit: () => void
  canSubmit: boolean
  isSubmitting: boolean
}) {
  const ctaEnabled = isPhoneStep ? canSubmit && !isSubmitting : canProceed

  return (
    <div className={quizFooterClass}>
      <div className={quizFooterInnerClass}>
        {!isPhoneStep && !canProceed ? (
          <p className="text-[11px] text-center text-stone-500 mb-2 font-medium">
            Выберите варианты в каждом блоке, чтобы продолжить
          </p>
        ) : isPhoneStep && !canSubmit && !isSubmitting ? (
          <p className="text-[11px] text-center text-stone-500 mb-2 font-medium">
            Укажите телефон и подтвердите согласие
          </p>
        ) : null}
        <div className="flex gap-2.5 items-stretch w-full">
          {showBack ? (
            <Button
              type="button"
              variant="ghost"
              onClick={onBack}
              className="shrink-0 h-12 px-3 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl text-sm font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Назад
            </Button>
          ) : null}
          {isPhoneStep ? (
            <Button
              type="button"
              onClick={onSubmit}
              disabled={!ctaEnabled}
              className={quizCtaClass(ctaEnabled)}
            >
              <span className="relative z-10 inline-flex items-center">
                {isSubmitting ? "Отправляем..." : "Получить рекомендации"}
                {!isSubmitting ? <ArrowRight className="ml-2 h-4 w-4 shrink-0" /> : null}
              </span>
            </Button>
          ) : (
            <Button type="button" onClick={onNext} disabled={!ctaEnabled} className={quizCtaClass(ctaEnabled)}>
              <span className="relative z-10 inline-flex items-center">
                Далее
                <ArrowRight className="ml-2 h-4 w-4 shrink-0" />
              </span>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

const SIDEBAR_BY_STEP: SidebarContext[] = [
  {
    title: "Что вы получите",
    shortSummary: "",
    points: ["Проверим текущую ситуацию", "Подскажем формат сопровождения", "Поможем организовать учёт"],
    trustLine: "Работаем по договору · Поддержка в мессенджерах",
  },
  {
    title: "Разберём вашу ситуацию",
    shortSummary: "",
    points: ["Проверим слабые места", "Подскажем следующий шаг", "Поможем навести порядок"],
    trustLine: "Работаем по договору · Поддержка в мессенджерах",
  },
  {
    title: "Что дальше",
    shortSummary: "",
    points: ["Свяжемся с вами", "Подготовим рекомендации", "Предложим подходящий формат работы"],
    trustLine: "Работаем по договору · Поддержка в мессенджерах",
  },
]

function getQuizSidebarContext(stepIndex: number): SidebarContext {
  const index = Math.min(Math.max(stepIndex, 0), SIDEBAR_BY_STEP.length - 1)
  return SIDEBAR_BY_STEP[index]
}

function QuizSidebar({ context }: { context: SidebarContext }) {
  const trustBadges = context.trustLine.split(" · ").filter(Boolean)

  return (
    <aside className={quizSidebarShellClass}>
      <div className={quizSidebarBgClass} />
      <div className={quizSidebarGlowClass} />
      <div className={quizSidebarGlowBottomClass} />

      <div className="relative z-10 flex flex-col h-full w-full p-5 lg:p-6 overflow-hidden min-h-0">
        <h3 className="text-[1.35rem] lg:text-[1.65rem] font-bold text-white leading-[1.15] tracking-tight mb-5 line-clamp-3">
          {context.title}
        </h3>
        {context.shortSummary ? <p className="sr-only">{context.shortSummary}</p> : null}

        <ul className="space-y-3.5 flex-1 min-h-0">
          {context.points.map((point, index) => {
            const PointIcon = SIDEBAR_POINT_ICONS[index] ?? BadgeCheck
            return (
              <li key={point} className="group flex items-center gap-3.5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-white/15 to-white/5 text-indigo-100 shadow-lg shadow-indigo-950/40 ring-1 ring-white/10 transition-all duration-300 group-hover:from-indigo-400/25 group-hover:to-violet-400/15 group-hover:scale-105">
                  <PointIcon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                </span>
                <span className="text-[15px] lg:text-base font-semibold text-white leading-snug">{point}</span>
              </li>
            )
          })}
        </ul>

        <div className="flex flex-wrap gap-2 shrink-0 pt-4 mt-auto">
          {trustBadges.map((badge) => (
            <span
              key={badge}
              className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3.5 py-2 text-sm font-medium text-white/90 ring-1 ring-white/15"
            >
              <ShieldCheck className="h-4 w-4 text-indigo-200 shrink-0" />
              {badge}
            </span>
          ))}
        </div>
      </div>
    </aside>
  )
}

const getBusinessType = (answers: QuizAnswer[]): "ip" | "ooo" | "both" => {
  const businessTypeAnswer = answers.find((a) => a.questionId === 1)?.answer
  if (!businessTypeAnswer || typeof businessTypeAnswer !== "object" || Array.isArray(businessTypeAnswer))
    return "both"

  const type = businessTypeAnswer.companyType
  if (type === "ip") return "ip"
  if (type === "ooo") return "ooo"
  if (type === "both") return "both"
  if (type === "new") return "both"
  return "both"
}

const getBusinessStepValue = (answers: QuizAnswer[]) => {
  const answer = answers.find((a) => a.questionId === 1)?.answer
  if (!answer || typeof answer !== "object" || Array.isArray(answer)) {
    return { companyType: "", taxSystem: "", employees: "" }
  }
  return {
    companyType: String(answer.companyType || ""),
    taxSystem: String(answer.taxSystem || ""),
    employees: String(answer.employees || ""),
  }
}

export function QuizModal({ open, onOpenChange }: { open?: boolean; onOpenChange?: (open: boolean) => void } = {}) {
  const { isOpen, closeContactForm } = useContactForm()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswer[]>([])
  const finalStepRef = useRef<QuizFinalStepHandle | null>(null)
  const [canFinalSubmit, setCanFinalSubmit] = useState(false)
  const [isFinalSubmitting, setIsFinalSubmitting] = useState(false)
  const [showThanks, setShowThanks] = useState(false)

  const totalSteps = questions.length + 1
  const progress = ((currentStep + 1) / totalSteps) * 100

  const handleAnswer = (questionId: number, answer: string | string[] | Record<string, string>) => {
    setAnswers((prev) => {
      const existing = prev.find((a) => a.questionId === questionId)
      if (existing) {
        return prev.map((a) => (a.questionId === questionId ? { ...a, answer } : a))
      }
      return [...prev, { questionId, answer }]
    })
  }

  const handleNext = () => {
    if (currentStep < questions.length) {
      const step2 = answers.find((a) => a.questionId === 2)
      if (step2 && Array.isArray(step2.answer)) {
        const allowed = new Set(STEP2_OPTIONS.map((o) => o.value))
        const filtered = step2.answer.filter((v) => allowed.has(v))
        if (filtered.length !== step2.answer.length) {
          handleAnswer(2, filtered)
        }
      }
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const quizData = {
    answers,
    discount: 0,
    businessType: getBusinessType(answers),
  }

  const isPhoneStep = currentStep >= questions.length
  const currentQuestion = questions[currentStep]
  const businessStepValue = getBusinessStepValue(answers)
  const sidebarContext = getQuizSidebarContext(isPhoneStep ? 2 : currentStep)
  const currentAnswer = answers.find((a) => a.questionId === currentQuestion?.id)
  const canProceed = isPhoneStep
    ? false
    : currentQuestion?.type === "business"
      ? Boolean(businessStepValue.companyType && businessStepValue.taxSystem && businessStepValue.employees)
      : Boolean(
          currentAnswer &&
            (Array.isArray(currentAnswer.answer) ? currentAnswer.answer.length > 0 : currentAnswer.answer)
        )

  useEffect(() => {
    if (!showThanks) return
    const t = window.setTimeout(() => {
      window.location.href = "/"
    }, 3000)
    return () => window.clearTimeout(t)
  }, [showThanks])

  const handleOptionCheckedChange = (
    questionId: number,
    optionValue: string,
    checked: CheckboxPrimitive.CheckedState
  ) => {
    const currentAnswers = Array.isArray(answers.find((a) => a.questionId === questionId)?.answer)
      ? (answers.find((a) => a.questionId === questionId)?.answer as string[])
      : []

    if (checked === true) {
      handleAnswer(questionId, [...currentAnswers, optionValue])
    } else {
      handleAnswer(
        questionId,
        currentAnswers.filter((a) => a !== optionValue)
      )
    }
  }

  return (
    <>
      <Dialog open={!!(open !== undefined ? open : isOpen)} onOpenChange={onOpenChange || closeContactForm}>
        <DialogTitle className="sr-only">Короткий опрос для подбора условий</DialogTitle>
        <DialogDescription className="sr-only">
          Ответьте на несколько вопросов — мы подготовим персональное предложение
        </DialogDescription>
        <DialogContent className={quizModalShellClass}>
          <div className="h-full max-h-[calc(100vh-48px)] flex flex-col relative overflow-hidden rounded-2xl">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(99,102,241,0.06),transparent_55%)]" />
                        {/* Header */}
            <div className={quizHeaderClass}>
              <span className={quizHeaderBadgeClass}>3 шага · без спама</span>
              <h1 className="text-lg md:text-xl font-bold text-stone-900 tracking-tight leading-tight mt-2">
                Короткая диагностика бизнеса
              </h1>
              <p className="text-xs md:text-sm text-stone-600 mt-0.5 max-w-lg mx-auto leading-snug">
                3 вопроса — и мы подскажем оптимальный формат сопровождения
              </p>
            </div>

            <div className="flex flex-1 min-h-0 overflow-hidden">
              <div className={quizLeftColumnClass}>
                <div className={quizMainPanelClass}>
                <div className="mb-1.5 shrink-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                      Шаг {currentStep + 1} из {totalSteps}
                    </span>
                    <span className="text-sm font-bold text-indigo-700 tabular-nums">{Math.round(progress)}%</span>
                  </div>
                  <div className={quizProgressTrackClass}>
                    <div
                      className={quizProgressFillClass}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex-1 min-h-0 flex flex-col">
                  {!isPhoneStep ? (
                    <>
                      <div className="flex-1 min-h-0 flex flex-col overflow-y-auto md:overflow-hidden pr-0.5 max-md:overscroll-contain md:min-h-0">
                        <h2 className="text-xl md:text-[1.6rem] font-bold mb-0.5 text-stone-900 tracking-tight shrink-0">
                          {currentQuestion.title}
                        </h2>
                        {currentQuestion.type === "business" ? (
                          <p className="text-xs text-stone-500 mb-1.5 md:mb-2 shrink-0">
                            Три блока — выберите по одному варианту в каждом
                          </p>
                        ) : (
                          <p className="text-xs text-stone-500 mb-1.5 md:mb-2 shrink-0">Отметьте всё, что актуально</p>
                        )}

                        {currentQuestion.type === "business" ? (
                          <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-3.5 items-stretch max-md:pb-1">
                            <BusinessMiniPanel number={1} title="Форма бизнеса" icon={Briefcase}>
                              {COMPANY_OPTIONS.map((option) => (
                                <OptionCard
                                  key={option.value}
                                  icon={option.icon}
                                  layout={"wide" in option && option.wide ? "wide" : "stack"}
                                  hint={"hint" in option ? option.hint : undefined}
                                  selected={businessStepValue.companyType === option.value}
                                  onClick={() =>
                                    handleAnswer(1, {
                                      ...businessStepValue,
                                      companyType: option.value,
                                    })
                                  }
                                >
                                  {option.label}
                                </OptionCard>
                              ))}
                            </BusinessMiniPanel>

                            <BusinessMiniPanel number={2} title="Налоговый режим" icon={FileText}>
                              {TAX_OPTIONS.map((option) => (
                                <OptionCard
                                  key={option.value}
                                  icon={option.icon}
                                  layout={"wide" in option && option.wide ? "wide" : "stack"}
                                  selected={businessStepValue.taxSystem === option.value}
                                  onClick={() =>
                                    handleAnswer(1, {
                                      ...businessStepValue,
                                      taxSystem: option.value,
                                    })
                                  }
                                >
                                  {option.label}
                                </OptionCard>
                              ))}
                            </BusinessMiniPanel>

                            <BusinessMiniPanel number={3} title="Сотрудники" icon={Users}>
                              {EMPLOYEE_OPTIONS.map((option) => (
                                <OptionCard
                                  key={option.value}
                                  icon={option.icon}
                                  layout={"wide" in option && option.wide ? "wide" : "stack"}
                                  selected={businessStepValue.employees === option.value}
                                  onClick={() =>
                                    handleAnswer(1, {
                                      ...businessStepValue,
                                      employees: option.value,
                                    })
                                  }
                                >
                                  {option.label}
                                </OptionCard>
                              ))}
                            </BusinessMiniPanel>
                          </div>
                        ) : (
                          <section className={`${quizStep2PanelClass} md:justify-center`}>
                            <div className="grid grid-cols-2 gap-2 md:gap-2.5">
                              {currentQuestion.options.map((option) => {
                                const checked = !!(
                                  Array.isArray(currentAnswer?.answer) &&
                                  currentAnswer.answer.includes(option.value)
                                )
                                return (
                                  <div key={option.value} className="min-h-0 flex w-full">
                                      <OptionCard
                                        icon={option.icon}
                                        selected={checked}
                                        layout="choice"
                                        onClick={() =>
                                          handleOptionCheckedChange(
                                            currentQuestion.id,
                                            option.value,
                                            !checked
                                          )
                                        }
                                      >
                                        {option.label}
                                      </OptionCard>
                                  </div>
                                )
                              })}
                            </div>
                          </section>
                        )}
                      </div>
                      <QuizStepFooter
                        canProceed={canProceed}
                        onNext={handleNext}
                        onBack={handleBack}
                        showBack={currentStep > 0}
                        isPhoneStep={false}
                        onSubmit={() => {}}
                        canSubmit={false}
                        isSubmitting={false}
                      />
                    </>
                  ) : (
                    <>
                      <div className="flex-1 min-h-0 flex flex-col overflow-y-auto md:overflow-hidden pr-0.5 max-md:overscroll-contain">
                        <QuizFinalStep
                          ref={finalStepRef}
                          site="main"
                          quizData={quizData}
                          uiTexts={{
                            title: "Почти готово",
                            subtitle: "Оставьте контакт — подготовим рекомендации и свяжемся с вами.",
                            giftLabel: "Материалы по теме (по желанию)",
                          }}
                          defaultGiftPdfFilename="Kak_vibrat_buh_kompany.pdf"
                          onStateChange={({ canSubmit, isSubmitting }) => {
                            setCanFinalSubmit(canSubmit)
                            setIsFinalSubmitting(isSubmitting)
                          }}
                          onSuccess={({ email, phone, quizData }) => {
                            try {
                              sendYandexMetric(YANDEX_METRICS_EVENTS.QUIZ_COMPLETED, {
                                discount: quizData?.discount,
                                business_type: quizData?.businessType,
                                email,
                                phone,
                              })
                            } catch (error) {
                              console.error("Ошибка отправки в Яндекс.Метрику:", error)
                            }

                            setShowThanks(true)
                            setCurrentStep(0)
                            setAnswers([])
                            setCanFinalSubmit(false)
                            setIsFinalSubmitting(false)
                            closeContactForm()
                          }}
                        />
                      </div>
                      <QuizStepFooter
                        canProceed={false}
                        onNext={() => {}}
                        onBack={handleBack}
                        showBack
                        isPhoneStep
                        onSubmit={() => finalStepRef.current?.submit()}
                        canSubmit={canFinalSubmit && !showThanks}
                        isSubmitting={isFinalSubmitting || showThanks}
                      />
                    </>
                  )}
                </div>
                </div>
              </div>

              <QuizSidebar context={sidebarContext} />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showThanks} onOpenChange={setShowThanks}>
        <DialogTitle className="sr-only">Благодарность за заполнение опроса</DialogTitle>
        <DialogDescription className="sr-only">Рекомендации отправлены</DialogDescription>
        <DialogContent className="max-w-md p-8 text-center flex flex-col items-center justify-center">
          <button
            onClick={() => setShowThanks(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold mb-4 text-green-700">Спасибо за уделенное время!</h2>
          <p className="text-base text-gray-700 mb-4">
            Предварительные рекомендации отправлены на ваш email, проверьте почту
          </p>
          <Button
            onClick={() => setShowThanks(false)}
            className="mt-2 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-xl"
          >
            Закрыть
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
