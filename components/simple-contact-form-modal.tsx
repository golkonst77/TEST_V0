"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useContactForm } from "@/hooks/use-contact-form"
import { Loader2, CheckCircle2 } from "lucide-react"

function isValidEmail(email: string): boolean {
  if (!email.trim()) return true
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

export function SimpleContactFormModal() {
  const { isOpen, formType, closeContactForm } = useContactForm()
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [phoneError, setPhoneError] = useState("")
  const [emailError, setEmailError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const dialogOpen = isOpen && formType === "simple"

  const resetForm = () => {
    setName("")
    setPhone("")
    setEmail("")
    setMessage("")
    setPhoneError("")
    setEmailError("")
    setSubmitError("")
    setSubmitted(false)
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closeContactForm()
      setTimeout(resetForm, 200)
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setPhoneError("")
    setEmailError("")
    setSubmitError("")

    const trimmedPhone = phone.trim()
    const trimmedEmail = email.trim()

    if (!trimmedPhone) {
      setPhoneError("Укажите телефон, чтобы мы могли связаться с вами")
      return
    }

    if (!isValidEmail(trimmedEmail)) {
      setEmailError("Проверьте формат email")
      return
    }

    setSubmitting(true)

    try {
      const pageUrl = typeof window !== "undefined" ? window.location.href : ""
      const payload = {
        phone: trimmedPhone,
        email: trimmedEmail,
        lead: {
          name: name.trim() || undefined,
          source: "simple_contact_form",
          city: message.trim() || undefined,
        },
        raw_quiz_answers: {
          type: "simple_contact_form",
          name: name.trim() || null,
          phone: trimmedPhone,
          email: trimmedEmail || null,
          message: message.trim() || null,
          pageUrl,
          submittedAt: new Date().toISOString(),
        },
      }

      const response = await fetch("/api/quiz-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await response.json().catch(() => null)

      if (!response.ok || !data?.success) {
        setSubmitError("Не удалось отправить заявку. Попробуйте ещё раз или напишите нам в Telegram.")
        return
      }

      setSubmitted(true)
    } catch {
      setSubmitError("Не удалось отправить заявку. Попробуйте ещё раз или напишите нам в Telegram.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg rounded-3xl border border-stone-200 bg-white p-0 shadow-xl overflow-hidden">
        {submitted ? (
          <div className="px-6 py-10 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500 mb-4" />
            <DialogTitle className="text-xl font-semibold text-stone-900 mb-2">
              Заявка отправлена
            </DialogTitle>
            <DialogDescription className="text-stone-600 mb-6">
              Мы свяжемся с вами в ближайшее время и подскажем по вашей задаче.
            </DialogDescription>
            <Button
              type="button"
              onClick={() => handleOpenChange(false)}
              className="rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white"
            >
              Закрыть
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-7">
            <DialogTitle className="text-2xl font-semibold text-stone-900 mb-2">
              Получить консультацию
            </DialogTitle>
            <DialogDescription className="text-sm text-stone-600 leading-relaxed mb-6">
              Оставьте телефон — мы свяжемся и подскажем, как безопасно передать бухгалтерию на сопровождение.
            </DialogDescription>

            <div className="space-y-4">
              <div>
                <Label htmlFor="simple-contact-name" className="text-sm text-stone-700">
                  Имя
                </Label>
                <Input
                  id="simple-contact-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Как к вам обращаться"
                  className="mt-1.5 h-11 rounded-xl border-stone-200"
                />
              </div>

              <div>
                <Label htmlFor="simple-contact-phone" className="text-sm text-stone-700">
                  Телефон <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="simple-contact-phone"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value)
                    if (phoneError) setPhoneError("")
                  }}
                  placeholder="+7 900 000-00-00"
                  className={`mt-1.5 h-11 rounded-xl border-stone-200 ${phoneError ? "border-red-300" : ""}`}
                />
                {phoneError ? <p className="mt-1.5 text-xs text-red-600">{phoneError}</p> : null}
              </div>

              <div>
                <Label htmlFor="simple-contact-email" className="text-sm text-stone-700">
                  Email
                </Label>
                <Input
                  id="simple-contact-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (emailError) setEmailError("")
                  }}
                  placeholder="email@example.com"
                  className={`mt-1.5 h-11 rounded-xl border-stone-200 ${emailError ? "border-red-300" : ""}`}
                />
                {emailError ? <p className="mt-1.5 text-xs text-red-600">{emailError}</p> : null}
              </div>

              <div>
                <Label htmlFor="simple-contact-message" className="text-sm text-stone-700">
                  Кратко опишите задачу
                </Label>
                <Textarea
                  id="simple-contact-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Например: нужно передать бухгалтерию, разобраться с отчётностью или ответить на требование ФНС"
                  rows={4}
                  className="mt-1.5 rounded-xl border-stone-200 resize-none"
                />
              </div>
            </div>

            {submitError ? <p className="mt-4 text-sm text-red-600">{submitError}</p> : null}

            <Button
              type="submit"
              disabled={submitting}
              className="mt-6 h-11 w-full rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white shadow-sm shadow-indigo-500/15 hover:from-indigo-500 hover:via-violet-500 hover:to-fuchsia-500"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Отправляем...
                </>
              ) : (
                "Отправить заявку"
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
