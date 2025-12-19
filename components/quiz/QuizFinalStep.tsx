"use client"

import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import InputMask from "react-input-mask"

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
      title: uiTexts?.title || "Последний шаг!",
      subtitle:
        uiTexts?.subtitle ||
        "Оставьте email, и мы отправим персональное коммерческое предложение и подарок.",
      giftLabel: uiTexts?.giftLabel || "Подарок (чек-лист)",
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
  const [consentPd, setConsentPd] = useState(false)
  const [giftPdfFilename, setGiftPdfFilename] = useState(
    defaultGiftPdfFilename || "Kak_vibrat_buh_kompany.pdf"
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  const canSubmit = useMemo(() => {
    const trimmedEmail = email.trim()
    if (!trimmedEmail || !isValidEmail(trimmedEmail)) return false
    if (!consentPd) return false
    const digits = phone.trim().replace(/\D/g, "")
    if (digits.length > 0 && digits.length < 10) return false
    return true
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
    [canSubmit, email, phone, consentPd, giftPdfFilename, site, quizData]
  )

  const handleSubmit = async () => {
    const trimmedEmail = email.trim()
    const trimmedPhone = phone.trim()

    if (!trimmedEmail || !isValidEmail(trimmedEmail)) {
      toast({
        title: "Проверьте email",
        description: "Введите корректный email.",
        variant: "destructive",
      })
      return
    }

    if (!consentPd) {
      toast({
        title: "Нужно согласие",
        description: "Подтвердите согласие на обработку персональных данных.",
        variant: "destructive",
      })
      return
    }

    const digits = trimmedPhone.replace(/\D/g, "")
    if (digits.length > 0 && digits.length < 10) {
      toast({
        title: "Проверьте телефон",
        description: "Телефон указан не полностью (можно оставить поле пустым).",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const utm = readUtmFromStorage()
      const lead = {
        ...mapQuizDataToLead(site, quizData),
        ...utm,
      }

      const payload: NormalizedLeadPayload = {
        site,
        email: trimmedEmail,
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
    <div className="flex flex-col h-[600px] min-h-0">
      <div className="flex-1 min-h-0 overflow-y-auto px-0 pt-2 pb-0 text-center max-w-lg mx-auto w-full flex flex-col items-stretch justify-start">
        <h2 className="text-2xl font-bold mb-2 text-gray-900">{texts.title}</h2>
        <p className="text-base text-gray-600 mb-4 leading-relaxed">{texts.subtitle}</p>

        <div className="space-y-3">
          <div className="text-left">
            <Label htmlFor="quiz-final-email" className="text-sm text-gray-700">
              Email
            </Label>
            <Input
              id="quiz-final-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="mt-1 text-center text-base py-3 border-2 border-gray-200 focus:border-cyan-400 rounded-2xl shadow-sm w-full"
            />
          </div>

          <div className="text-left">
            <Label htmlFor="quiz-final-phone" className="text-sm text-gray-700">
              Телефон (необязательно)
            </Label>
            <InputMask mask="+7 (999) 999-99-99" value={phone} onChange={(e) => setPhone(e.target.value)}>
              {(inputProps) => (
                <Input
                  {...inputProps}
                  id="quiz-final-phone"
                  type="tel"
                  placeholder="+7 (___) ___-__-__"
                  className="mt-1 text-center text-base py-3 border-2 border-gray-200 focus:border-cyan-400 rounded-2xl shadow-sm w-full"
                />
              )}
            </InputMask>
          </div>

          <div className="flex items-start space-x-2 mt-2 text-left">
            <Checkbox
              id="quiz-final-consent-pd"
              checked={consentPd}
              onCheckedChange={(checked) => setConsentPd(checked === true || checked === "indeterminate")}
              className="mt-1 text-cyan-600 border-2 border-cyan-300 w-5 h-5"
            />
            <Label
              htmlFor="quiz-final-consent-pd"
              className="cursor-pointer leading-relaxed text-gray-700"
            >
              Я даю согласие на обработку персональных данных
            </Label>
          </div>

          <div className="mt-3 text-left">
            <div className="rounded-2xl border-2 border-cyan-300 bg-cyan-50/70 p-3 shadow-sm">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-gray-900 font-bold">{texts.giftLabel}</Label>
                <span className="text-xs font-bold text-cyan-700 bg-white/70 border border-cyan-200 px-2 py-1 rounded-full">
                  PDF
                </span>
              </div>
              <select
                value={giftPdfFilename}
                onChange={(e) => setGiftPdfFilename(e.target.value)}
                className="mt-2 w-full border-2 border-cyan-300 focus:border-cyan-500 rounded-2xl shadow-sm px-3 py-3 text-sm bg-white"
              >
                {resolvedGiftOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="shrink-0 bg-white pt-2 pb-2">
        <div className="bg-gray-50 rounded-2xl p-4 text-center mt-2">
          <p className="text-xs font-bold text-gray-900 uppercase tracking-wide">БЕЗОПАСНО И КОНФИДЕНЦИАЛЬНО</p>
        </div>
      </div>
    </div>
  )
})
