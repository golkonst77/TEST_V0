"use client"

import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import InputMask from "react-input-mask"
import { User, Mail, Phone, Gift, Check, ChevronDown } from "lucide-react"
import {
  quizConsentCardClass,
  quizFormPanelClass,
  quizInputClass,
  quizOptionalLabelClass,
} from "@/components/quiz/quiz-design-tokens"

type SiteKind = "main" | "ausn"

type QuizFinalStepUiTexts = {
  title?: string
  subtitle?: string
  giftLabel?: string
}

export type QuizFinalStepHandle = {
  submit: () => void
}

type GiftOption = { value: string; label: string }

type UtmPayload = {
  utm_source?: string | null
  utm_medium?: string | null
  utm_campaign?: string | null
  utm_content?: string | null
  utm_term?: string | null
}

type NormalizedLeadPayload = {
  site: SiteKind
  email: string
  phone?: string
  lead: {
    name?: string
    tax_regime?: string
    monthly_revenue?: number
    employees_count?: number
    city?: string
    source?: string
  } & UtmPayload
  raw_quiz_answers?: any
  giftPdfFilename?: string
}

const UTM_STORAGE_KEY = "pb_utm"

function readUtmFromStorage(): UtmPayload {
  if (typeof window === "undefined") return {}
  try {
    const raw = window.localStorage.getItem(UTM_STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return (parsed && typeof parsed === "object" ? parsed : {}) as UtmPayload
  } catch {
    return {}
  }
}

function writeUtmToStorage(utm: UtmPayload) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utm))
  } catch {
    // ignore
  }
}

function persistUtmFromUrlOnce() {
  if (typeof window === "undefined") return
  try {
    const params = new URLSearchParams(window.location.search)
    const fromUrl: UtmPayload = {
      utm_source: params.get("utm_source"),
      utm_medium: params.get("utm_medium"),
      utm_campaign: params.get("utm_campaign"),
      utm_content: params.get("utm_content"),
      utm_term: params.get("utm_term"),
    }

    const hasAny = Object.values(fromUrl).some((v) => typeof v === "string" && v.length > 0)
    if (!hasAny) return

    const existing = readUtmFromStorage()
    const merged: UtmPayload = {
      utm_source: fromUrl.utm_source || existing.utm_source || null,
      utm_medium: fromUrl.utm_medium || existing.utm_medium || null,
      utm_campaign: fromUrl.utm_campaign || existing.utm_campaign || null,
      utm_content: fromUrl.utm_content || existing.utm_content || null,
      utm_term: fromUrl.utm_term || existing.utm_term || null,
    }
    writeUtmToStorage(merged)
  } catch {
    // ignore
  }
}

function safeNumber(v: unknown): number | undefined {
  if (typeof v === "number" && Number.isFinite(v)) return v
  if (typeof v === "string") {
    const n = Number(v)
    if (Number.isFinite(n)) return n
  }
  return undefined
}

function mapQuizDataToLead(site: SiteKind, quizData: any): NormalizedLeadPayload["lead"] {
  const lead: NormalizedLeadPayload["lead"] = {}

  // Минимальная/безопасная нормализация: оставляем то, что уже есть в quizData.
  // Для AUSN можно заранее проставить налоговый режим.
  if (site === "ausn") {
    lead.tax_regime = typeof quizData?.tax_regime === "string" ? quizData.tax_regime : "АУСН"
  } else if (typeof quizData?.tax_regime === "string") {
    lead.tax_regime = quizData.tax_regime
  }

  if (typeof quizData?.city === "string") lead.city = quizData.city
  if (typeof quizData?.name === "string") lead.name = quizData.name

  const monthlyRevenue = safeNumber(quizData?.monthly_revenue)
  if (monthlyRevenue !== undefined) lead.monthly_revenue = monthlyRevenue

  const employeesCount = safeNumber(quizData?.employees_count)
  if (employeesCount !== undefined) lead.employees_count = employeesCount

  // Попытка извлечь некоторые значения из массива answers (если есть)
  const answers = Array.isArray(quizData?.answers) ? quizData.answers : []
  const businessStepAnswer = answers.find((a: any) => a?.questionId === 1)?.answer

  if (businessStepAnswer && typeof businessStepAnswer === "object" && !Array.isArray(businessStepAnswer)) {
    const taxSystem = typeof businessStepAnswer.taxSystem === "string" ? businessStepAnswer.taxSystem : undefined
    if (taxSystem) {
      if (taxSystem === "usn") lead.tax_regime = "УСН"
      else if (taxSystem === "osn") lead.tax_regime = "ОСНО"
      else if (taxSystem === "patent") lead.tax_regime = "Патент"
      else if (taxSystem === "not-selected") lead.tax_regime = "Нужна консультация по выбору режима"
    }

    const employees = typeof businessStepAnswer.employees === "string" ? businessStepAnswer.employees : undefined
    if (employees) {
      if (employees === "0") lead.employees_count = 0
      else if (employees === "has") lead.employees_count = 1
      else if (employees === "plan") lead.employees_count = 1
      else if (employees === "many") lead.employees_count = 6
    }
  }

  if (site === "ausn") {
    // В ausn квизе: id=2 выручка (категория), id=3 работники
    const revenueAnswer = answers.find((a: any) => a?.questionId === 2)?.answer
    if (typeof revenueAnswer === "string") {
      const map: Record<string, number> = {
        revenue_lt_60: 60000000,
        revenue_60_272_5: 272500000,
        revenue_272_5_490_5: 490500000,
        revenue_gt_490_5: 490500000,
      }
      if (map[revenueAnswer] !== undefined) lead.monthly_revenue = map[revenueAnswer]
    }

    const empAnswer = answers.find((a: any) => a?.questionId === 3)?.answer
    if (typeof empAnswer === "string") {
      if (empAnswer === "emp_le_5") lead.employees_count = 5
      if (empAnswer === "emp_gt_5") lead.employees_count = 6
    }
  }

  return lead
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function phoneDigits(phone: string): string {
  return phone.replace(/\D/g, "")
}

function hasValidPhone(phone: string): boolean {
  return phoneDigits(phone).length >= 10
}

export const QuizFinalStep = forwardRef<
  QuizFinalStepHandle,
  {
    site: SiteKind
    quizData: any
    uiTexts?: QuizFinalStepUiTexts
    giftOptions?: GiftOption[]
    defaultGiftPdfFilename?: string
    onStateChange?: (state: { canSubmit: boolean; isSubmitting: boolean }) => void
    onSuccess?: (payload: {
      site: SiteKind
      email: string
      phone: string
      giftPdfFilename: string
      quizData: any
    }) => void
  }
>(function QuizFinalStep(
  {
    site,
    quizData,
    uiTexts,
    giftOptions,
    defaultGiftPdfFilename,
    onStateChange,
    onSuccess,
  },
  ref
) {
  const { toast } = useToast()

  useEffect(() => {
    persistUtmFromUrlOnce()
  }, [])

  const texts = useMemo(() => {
    return {
      title: uiTexts?.title || "Получите предварительные рекомендации",
      subtitle:
        uiTexts?.subtitle ||
        "Оставьте email, и мы отправим подбор бухгалтерского сопровождения под ваш бизнес.",
      giftLabel: uiTexts?.giftLabel || "Полезные материалы (по желанию)",
    }
  }, [uiTexts])

  const resolvedGiftOptions: GiftOption[] = useMemo(() => {
    return (
      giftOptions || [
        { value: "Kak_vibrat_buh_kompany.pdf", label: "Как выбрать бух. компанию" },
        { value: "Kak-izbezhat-blokirovki-scheta.pdf", label: "Как избежать блокировки счёта" },
        { value: "Sravnenie-IP-i-OOO-Chto-vybrat-dlya-vashego-biznesa.pdf", label: "Сравнение ИП и ООО" },
        { value: "Vosstanovlenie-buhgalterskogo-ucheta.pdf", label: "Восстановление бухучета" },
        { value: "Buhgalterskoe-soprovozhdenie-ProstoByuro.pdf", label: "Бухгалтерское сопровождение" },
        { value: "none", label: "Не нужен чек-лист" },
      ]
    )
  }, [giftOptions])

  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [name, setName] = useState("")
  const [consentPd, setConsentPd] = useState(false)
  const [giftPdfFilename, setGiftPdfFilename] = useState(
    defaultGiftPdfFilename || "Kak_vibrat_buh_kompany.pdf"
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  const canSubmit = useMemo(() => {
    if (!consentPd) return false
    const trimmedEmail = email.trim()
    if (trimmedEmail && !isValidEmail(trimmedEmail)) return false
    const digits = phoneDigits(phone)
    if (digits.length > 0 && digits.length < 10) return false
    return hasValidPhone(phone)
  }, [consentPd, email, phone])

  useEffect(() => {
    onStateChange?.({ canSubmit, isSubmitting })
  }, [canSubmit, isSubmitting, onStateChange])

  useImperativeHandle(
    ref,
    () => ({
      submit: () => {
        void handleSubmit()
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [canSubmit, email, phone, consentPd, giftPdfFilename, site, quizData, name]
  )

  const handleSubmit = async () => {
    const trimmedEmail = email.trim()
    const trimmedPhone = phone.trim()

    if (!consentPd) {
      toast({
        title: "Нужно согласие",
        description: "Подтвердите согласие на обработку персональных данных.",
        variant: "destructive",
      })
      return
    }

    if (trimmedEmail && !isValidEmail(trimmedEmail)) {
      toast({
        title: "Проверьте email",
        description: "Введите корректный email или оставьте поле пустым.",
        variant: "destructive",
      })
      return
    }

    const digits = phoneDigits(trimmedPhone)
    if (digits.length > 0 && digits.length < 10) {
      toast({
        title: "Проверьте телефон",
        description: "Телефон указан не полностью.",
        variant: "destructive",
      })
      return
    }

    if (!hasValidPhone(trimmedPhone)) {
      toast({
        title: "Укажите телефон",
        description: "Введите номер телефона или мессенджер, чтобы мы могли связаться с вами.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const utm = readUtmFromStorage()
      const trimmedName = name.trim()
      const lead = {
        ...mapQuizDataToLead(site, quizData),
        name: trimmedName || "Не указано",
        ...utm,
      }

      const payload: NormalizedLeadPayload = {
        site,
        email: trimmedEmail && isValidEmail(trimmedEmail) ? trimmedEmail : "",
        ...(trimmedPhone ? { phone: trimmedPhone } : {}),
        lead,
        raw_quiz_answers: quizData,
        giftPdfFilename,
      }

      const res = await fetch("/api/quiz-lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || `HTTP ${res.status}`)
      }

      try {
        onSuccess?.({
          site,
          email: trimmedEmail,
          phone: trimmedPhone,
          giftPdfFilename,
          quizData,
        })
      } catch (e) {
        console.error("[QuizFinalStep] onSuccess hook failed (non-blocking):", e)
      }

    } catch (error) {
      console.error("[QuizFinalStep] submit failed:", error)
      const errorMessage = error instanceof Error ? error.message : "Попробуйте еще раз."
      toast({
        title: "Ошибка отправки",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col min-h-0 w-full max-w-xl mx-auto md:flex-1 md:justify-center">
      <h2 className="text-xl md:text-[1.65rem] font-bold mb-0.5 text-stone-900 text-center tracking-tight shrink-0">
        {texts.title}
      </h2>
      <p className="text-sm text-stone-600 mb-2.5 text-center shrink-0 leading-snug max-w-md mx-auto">{texts.subtitle}</p>

      <section className={quizFormPanelClass}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="text-left">
            <Label htmlFor="quiz-final-name" className="text-sm font-semibold text-stone-800 tracking-tight">
              Как к вам обращаться <span className={quizOptionalLabelClass}>(необязательно)</span>
            </Label>
            <div className="relative">
              <User className="absolute left-3.5 top-[calc(50%+6px)] -translate-y-1/2 h-4 w-4 text-stone-400 pointer-events-none" />
              <Input
                id="quiz-final-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Имя"
                className={quizInputClass}
              />
            </div>
          </div>

          <div className="text-left">
            <Label htmlFor="quiz-final-phone" className="text-sm font-semibold text-stone-800">
              Телефон или мессенджер <span className="text-indigo-600">*</span>
            </Label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-[calc(50%+6px)] -translate-y-1/2 h-4 w-4 text-stone-400 pointer-events-none z-10" />
              <InputMask mask="+7 (999) 999-99-99" value={phone} onChange={(e) => setPhone(e.target.value)}>
                {(inputProps) => (
                  <Input
                    {...inputProps}
                    id="quiz-final-phone"
                    type="tel"
                    placeholder="+7 (___) ___-__-__"
                    className={quizInputClass}
                  />
                )}
              </InputMask>
            </div>
          </div>
        </div>

        <div className="text-left">
          <Label htmlFor="quiz-final-email" className="text-sm font-semibold text-stone-800">
            Email <span className={quizOptionalLabelClass}>(необязательно)</span>
          </Label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-[calc(50%+6px)] -translate-y-1/2 h-4 w-4 text-stone-400 pointer-events-none" />
            <Input
              id="quiz-final-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className={quizInputClass}
            />
          </div>
        </div>

        <div className={quizConsentCardClass}>
          <Checkbox
            id="quiz-final-consent-pd"
            checked={consentPd}
            onCheckedChange={(checked) => setConsentPd(checked === true || checked === "indeterminate")}
            className="mt-0.5 border-stone-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 w-4 h-4 shrink-0 rounded-[4px] shadow-sm"
          />
          <Label htmlFor="quiz-final-consent-pd" className="cursor-pointer text-sm font-medium text-stone-700 leading-snug">
            Согласие на обработку персональных данных
          </Label>
        </div>

        <details className="group rounded-xl border border-stone-300/90 bg-stone-50/80 ring-1 ring-inset ring-white/80 transition-colors hover:border-indigo-300/70 hover:bg-indigo-50/40 open:border-indigo-200/80 open:bg-white">
          <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden rounded-xl px-3.5 py-2.5 flex items-center gap-3 transition-colors hover:bg-stone-100/60 group-open:bg-stone-50/80">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100/80">
              <Gift className="h-4 w-4 shrink-0" />
            </span>
            <span className="min-w-0 flex-1 text-left">
              <span className="block text-sm font-semibold text-stone-800">{texts.giftLabel}</span>
              <span className="block text-xs text-stone-500 mt-0.5">Выберите чек-лист</span>
            </span>
            <ChevronDown
              className="h-4 w-4 shrink-0 text-stone-500 transition-transform duration-200 group-open:rotate-180"
              aria-hidden
            />
          </summary>
          <div className="border-t border-stone-200/70 px-3.5 pb-3.5 pt-2.5">
          <select
            value={giftPdfFilename}
            onChange={(e) => setGiftPdfFilename(e.target.value)}
            className="w-full border border-stone-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 rounded-lg px-2.5 py-2 text-sm bg-white h-10"
          >
            {resolvedGiftOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          </div>
        </details>

        <p className="flex items-center justify-center gap-1.5 text-[11px] text-stone-500 pt-0.5">
          <span className="inline-flex h-5 items-center gap-1.5 rounded-full bg-indigo-50/80 px-2.5 py-0.5 text-stone-600 ring-1 ring-indigo-100/80">
            <Check className="h-3 w-3 text-indigo-500 shrink-0" />
            Без спама · ответим в рабочее время
          </span>
        </p>
      </section>
    </div>
  )
})
