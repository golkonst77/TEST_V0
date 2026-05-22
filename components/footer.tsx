"use client"

import { useState, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import { Logo } from "./logo"
import { VersionInfo } from "./version-info"

const INN = "4027132996"
const OGRN = "1174027006592"
const DEFAULT_TELEGRAM = "https://t.me/prostoburo"
const PLACEHOLDER_PHONE = "+7 999 000-00-00"

function resolveTelegramUrl(raw: string | undefined): string {
  if (!raw?.trim()) return DEFAULT_TELEGRAM
  const clean = raw.trim()
  if (clean.startsWith("http")) return clean
  return `https://t.me/${clean.replace("@", "")}`
}

export function Footer() {
  const [policyOpen, setPolicyOpen] = useState(false)
  const [policyText, setPolicyText] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [telegramLink, setTelegramLink] = useState(DEFAULT_TELEGRAM)
  const [telegramLabel, setTelegramLabel] = useState("@prostoburo")

  useEffect(() => {
    const controller = new AbortController()

    fetch("/policy.md", { cache: "no-store", signal: controller.signal })
      .then((res) => res.text())
      .then(setPolicyText)
      .catch(() => setPolicyText("Ошибка загрузки политики."))

    fetch("/api/settings", { cache: "no-store", signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return
        if (typeof data.phone === "string") setPhone(data.phone.trim())
        if (typeof data.email === "string") setEmail(data.email.trim())
        if (typeof data.telegram === "string" && data.telegram.trim()) {
          const tg = data.telegram.trim()
          setTelegramLink(resolveTelegramUrl(tg))
          setTelegramLabel(tg.startsWith("@") ? tg : `@${tg.replace("@", "")}`)
        }
      })
      .catch(() => {})

    return () => controller.abort()
  }, [])

  const displayPhone =
    phone && phone.replace(/\s/g, "") !== PLACEHOLDER_PHONE.replace(/\s/g, "") ? phone : ""
  const phoneHref = displayPhone ? `tel:${displayPhone.replace(/\s/g, "")}` : undefined
  const emailHref = email ? `mailto:${email}` : undefined
  return (
    <footer className="border-t border-stone-200 bg-stone-50">
      <div className="mx-auto max-w-7xl px-4 py-10 md:py-14">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3 max-w-md">
            <Logo
              siteName="ПростоБюро"
              className="[&_span]:text-base [&_span]:font-semibold [&_span]:text-stone-900 [&_div]:h-9 [&_div]:w-9 [&_div]:rounded-lg"
            />
            <p className="text-sm text-stone-600 leading-relaxed">
              Бухгалтерское сопровождение для ИП и ООО.
            </p>
            <p className="text-sm text-stone-500">Калуга · работаем по всей России</p>
          </div>

          <div className="space-y-4 md:text-right">
            <nav aria-label="Контакты" className="flex flex-col gap-2 text-sm">
              {phoneHref ? (
                <a
                  href={phoneHref}
                  className="text-stone-600 transition-colors duration-200 hover:text-indigo-600"
                >
                  {displayPhone}
                </a>
              ) : null}
              <a
                href={telegramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-600 transition-colors duration-200 hover:text-indigo-600"
              >
                {telegramLabel}
              </a>
              {emailHref ? (
                <a
                  href={emailHref}
                  className="text-stone-600 transition-colors duration-200 hover:text-indigo-600 break-all"
                >
                  {email}
                </a>
              ) : null}
            </nav>

            <p className="text-sm text-stone-500">
              ИНН {INN} · ОГРН {OGRN}
            </p>

            <Dialog open={policyOpen} onOpenChange={setPolicyOpen}>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="text-sm text-stone-500 transition-colors duration-200 hover:text-indigo-600 md:ml-auto md:block"
                >
                  Политика конфиденциальности
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Политика конфиденциальности</DialogTitle>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-y-auto text-left text-sm text-stone-600">
                  <ReactMarkdown>{policyText}</ReactMarkdown>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start gap-3 border-t border-stone-200/80 pt-6 text-xs text-stone-500 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p>&copy; 2026 ПростоБюро</p>
            <VersionInfo inline showDate={false} className="text-stone-400" />
          </div>
          <p>
            Сайт разработан{" "}
            <span className="font-medium text-stone-600">GØL Design Studio</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
