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
      const res = await fetch("/api/quiz-lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          site,
          email: trimmedEmail,
          phone: trimmedPhone,
          giftPdfFilename,
          quizData,
        }),
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
