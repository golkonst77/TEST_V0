"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Phone } from "lucide-react"
import { useCruiseClick } from "@/hooks/use-cruise-click"

export function CtaFinalSection() {
  const { handleCruiseClick } = useCruiseClick()
  const [phone, setPhone] = useState("")

  useEffect(() => {
    const controller = new AbortController()
    const load = async () => {
      try {
        const res = await fetch("/api/settings", { cache: "no-store", signal: controller.signal })
        if (!res.ok) return
        const data = await res.json()
        if (typeof data?.phone === "string" && data.phone.trim().length > 0) {
          setPhone(data.phone.trim())
        }
      } catch (e) {
        if (!(e instanceof Error && e.name === "AbortError")) {
          console.error("CtaFinalSection: settings load error", e)
        }
      }
    }
    load()
    return () => controller.abort()
  }, [])

  const phoneHref = phone ? `tel:${phone.replace(/\s/g, "")}` : undefined

  return (
    <section className="py-8 md:py-12 bg-gradient-to-br from-slate-50 to-blue-50 border-y border-gray-100" id="cta-final">
      <div className="container mx-auto px-4 text-center max-w-2xl">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Не уверены, какой тариф выбрать?</h2>
        <p className="text-gray-600 text-sm md:text-base mb-6 leading-relaxed">
          Поможем подобрать подходящий формат под ваш бизнес
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Button
            size="lg"
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 rounded-xl shadow-lg"
            onClick={handleCruiseClick}
          >
            Получить бесплатную консультацию
          </Button>
          {phone ? (
            <a
              href={phoneHref}
              className="inline-flex items-center justify-center gap-2 text-gray-700 hover:text-blue-600 text-sm md:text-base font-medium transition-colors"
            >
              <Phone className="h-4 w-4 shrink-0" />
              <span>{phone}</span>
            </a>
          ) : null}
        </div>
      </div>
    </section>
  )
}
