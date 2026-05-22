"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, ArrowRight } from "lucide-react"
import { useCruiseClick } from "@/hooks/use-cruise-click"
import { useEffect, useState } from "react"

interface PricingPlan {
  id: number
  group?: "ip" | "ooo"
  name: string
  price: string
  period: string
  description: string
  popular: boolean
  features: string[]
}

function formatPlanPrice(rawPrice: string): string {
  const numeric = Number(String(rawPrice).replace(/[^\d]/g, ""))
  if (!Number.isFinite(numeric) || numeric <= 0) return "от — ₽"
  return `от ${new Intl.NumberFormat("ru-RU").format(numeric)} ₽`
}

const AUDIENCE_IP = [
  "Для ИП без сотрудников или с минимальными операциями",
  "Для ИП с сотрудниками и регулярной деятельностью",
  "Для ИП со сложным учетом или ВЭД",
] as const

const AUDIENCE_OOO = [
  "Для небольших ООО с простым учетом",
  "Для компаний с сотрудниками и регулярной отчетностью",
  "Для компаний со сложной структурой и повышенными требованиями",
] as const

function audienceLineForPlan(plan: PricingPlan, index: number): string {
  const n = plan.name.toLowerCase()
  const isOoo = plan.group === "ooo"
  if (isOoo) {
    if (n.includes("под ключ")) return AUDIENCE_OOO[2]
    if (n.includes("оптимал")) return AUDIENCE_OOO[1]
    if (n.includes("базов")) return AUDIENCE_OOO[0]
    return AUDIENCE_OOO[Math.min(index, 2)]
  }
  if (n.includes("под ключ")) return AUDIENCE_IP[2]
  if (n.includes("оптимал")) return AUDIENCE_IP[1]
  if (n.includes("базов")) return AUDIENCE_IP[0]
  return AUDIENCE_IP[Math.min(index, 2)]
}

function strengthenFeatureText(text: string): string {
  const t = text.trim()
  const lower = t.toLowerCase()
  if (lower.includes("кудир")) return "Ведение КУДиР"
  if (lower.includes("сдача отчетности в фнс") || lower.includes("сдача отчётности в фнс")) {
    return "Сдача отчётности в ФНС"
  }
  if (lower.includes("сдача всех отчетов") || lower.includes("сдача всех отчётов")) {
    return "Отчётность в ФНС"
  }
  if (lower.includes("отчётность в фнс") || lower.includes("отчетность в фнс")) {
    return "Отчётность в ФНС"
  }
  if (lower.includes("расчёт взносов ип") || lower.includes("расчет взносов ип")) {
    return "Учёт взносов и регулярных платежей"
  }
  if (lower.includes("учёт взносов") || lower.includes("учет взносов")) {
    return "Учёт взносов и регулярных платежей"
  }
  if (
    lower.includes("кадрового учёта") ||
    lower.includes("кадрового учета") ||
    (lower.includes("кадр") && lower.includes("зарплат"))
  ) {
    return "Кадры и расчёт зарплаты"
  }
  if (lower.includes("пфр") || lower.includes("фсс")) {
    return "Зарплата и кадровые отчёты"
  }
  if (lower.includes("зарплата и кадровые")) {
    return "Зарплата и кадровые отчёты"
  }
  if (lower.includes("финансовая аналитика") || lower.includes("аналитика и налоговое")) {
    return "Аналитика и налоговое планирование"
  }
  if (lower.includes("ведение бухучета") || lower.includes("ведение бухучёта")) {
    return "Ведение бухучёта"
  }
  if (lower.includes("расчёт налогов") || lower.includes("расчет налогов")) {
    return "Расчёт налогов"
  }
  return t
}

function planPriceGlowClassName(popular: boolean) {
  return popular
    ? "pointer-events-none absolute -inset-x-4 top-1/2 h-[1.35em] -translate-y-1/2 rounded-full bg-indigo-500/[0.08] blur-2xl"
    : "pointer-events-none absolute -inset-x-4 top-1/2 h-[1.35em] -translate-y-1/2 rounded-full bg-indigo-500/[0.05] blur-2xl"
}

function planPriceClassName(popular: boolean) {
  return popular
    ? "relative text-3xl md:text-[2rem] font-bold tracking-tight bg-gradient-to-br from-slate-900 via-indigo-950 to-indigo-800 bg-clip-text text-transparent [filter:drop-shadow(0_1px_0_rgba(255,255,255,0.45))_drop-shadow(0_10px_28px_rgba(79,70,229,0.1))]"
    : "relative text-3xl md:text-[2rem] font-bold tracking-tight bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent [filter:drop-shadow(0_1px_0_rgba(255,255,255,0.5))_drop-shadow(0_8px_22px_rgba(79,70,229,0.06))]"
}

function planCardClassName(popular: boolean) {
  return popular
    ? "relative h-full flex flex-col rounded-2xl border border-indigo-300/70 bg-gradient-to-b from-white to-indigo-50/20 shadow-md ring-1 ring-indigo-100/50 transition-[box-shadow,border-color] duration-300 md:hover:shadow-lg md:hover:border-indigo-300"
    : "relative h-full flex flex-col rounded-2xl border border-stone-200 bg-white shadow-sm transition-[box-shadow,border-color] duration-300 md:hover:shadow-md md:hover:border-indigo-200"
}

function planButtonClassName(popular: boolean) {
  return popular
    ? "h-10 w-full max-w-[280px] text-sm font-semibold rounded-xl bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 md:hover:-translate-y-px md:hover:shadow-md transition-[transform,background-color,box-shadow] duration-300 ease-out"
    : "h-10 w-full max-w-[280px] text-sm font-medium rounded-xl bg-white border border-stone-200 text-stone-800 shadow-sm hover:border-indigo-200 hover:bg-stone-50/80 md:hover:-translate-y-px md:hover:shadow-md transition-[transform,background-color,box-shadow,border-color] duration-300 ease-out"
}

export function PricingSection() {
  const { handleCruiseClick } = useCruiseClick()
  const [ipPlans, setIpPlans] = useState<PricingPlan[]>([])
  const [oooPlans, setOooPlans] = useState<PricingPlan[]>([])

  useEffect(() => {
    const fetchPricingData = async () => {
      try {
        const response = await fetch("/api/admin/pricing", { cache: "no-store" })
        if (!response.ok) return

        const payload = await response.json()
        if (!Array.isArray(payload?.plans) || payload.plans.length === 0) return

        const mappedPlans: PricingPlan[] = payload.plans
          .filter((plan: any) => plan && plan.is_active !== false)
          .map((plan: any, index: number) => ({
            id: typeof plan.id === "number" ? plan.id : index + 1,
            group: plan.group === "ooo" ? "ooo" : "ip",
            name: typeof plan.name === "string" ? plan.name : "",
            price: String(plan.price ?? ""),
            period: typeof plan.period === "string" && plan.period.length > 0 ? plan.period : "мес",
            description: typeof plan.description === "string" ? plan.description : "",
            popular: Boolean(plan.is_popular),
            features: Array.isArray(plan.features) ? plan.features.filter((f: any) => typeof f === "string") : [],
          }))

        if (mappedPlans.length === 0) return

        const groupedIp = mappedPlans.filter((plan) => plan.group !== "ooo")
        const groupedOoo = mappedPlans.filter((plan) => plan.group === "ooo")

        const nextIp = (groupedIp.length > 0 ? groupedIp : mappedPlans.slice(0, 3)).slice(0, 3)
        const nextOoo = (groupedOoo.length > 0 ? groupedOoo : mappedPlans.slice(3, 6)).slice(0, 3)

        if (nextIp.length > 0) setIpPlans(nextIp)
        if (nextOoo.length > 0) {
          setOooPlans(nextOoo)
        } else {
          setOooPlans(nextIp)
        }
      } catch (error) {
        console.error("Failed to fetch pricing plans:", error)
      }
    }

    fetchPricingData()
  }, [])

  if (ipPlans.length === 0 && oooPlans.length === 0) {
    return null
  }

  const renderPlanCards = (plans: PricingPlan[]) => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 px-4">
      {plans.map((plan, index) => (
        <Card key={`${plan.id}-${index}`} className={planCardClassName(plan.popular)}>
          {plan.popular && (
            <Badge
              variant="outline"
              className="absolute -top-2.5 left-1/2 -translate-x-1/2 border-indigo-200/80 bg-indigo-50 text-indigo-700 text-[11px] font-medium px-2.5 py-0.5 shadow-sm pointer-events-none"
            >
              Оптимальный выбор
            </Badge>
          )}
          <CardHeader className="text-center pb-2 pt-6 px-5">
            <CardTitle className="text-lg font-semibold text-stone-900">{plan.name}</CardTitle>
            <span className="block text-xs text-stone-500 mt-2 leading-snug">
              {audienceLineForPlan(plan, index)}
            </span>
            <div className="mt-4 flex flex-wrap items-baseline justify-center gap-x-1.5">
              <span className="relative inline-block">
                <span className={planPriceGlowClassName(plan.popular)} aria-hidden />
                <span className={planPriceClassName(plan.popular)}>{formatPlanPrice(plan.price)}</span>
              </span>
              <span className="text-sm text-stone-500">/ {plan.period}</span>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col px-5 pb-5 pt-0">
            <ul className="space-y-2">
              {plan.features.slice(0, 3).map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check
                    className="h-4 w-4 text-indigo-500/70 mr-0 mt-0.5 flex-shrink-0"
                    strokeWidth={2}
                    aria-hidden
                  />
                  <span className="text-sm text-stone-600 leading-snug">
                    {strengthenFeatureText(feature)}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderPlanButtons = (plans: PricingPlan[]) => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 justify-items-center mt-5 md:mt-6 w-full px-4">
      {plans.map((plan, index) => (
        <Button
          key={`btn-${plan.id}-${index}`}
          type="button"
          variant="ghost"
          className={planButtonClassName(plan.popular)}
          onClick={handleCruiseClick}
        >
          Обсудить тариф
          <ArrowRight className="ml-1.5 h-4 w-4 opacity-70" />
        </Button>
      ))}
    </div>
  )

  return (
    <section
      id="pricing"
      className="py-14 md:py-20 bg-gradient-to-b from-white via-stone-50/40 to-white border-b border-stone-100/80"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-stone-900 mb-4">
            Выберите формат бухгалтерского обслуживания
          </h2>
          <div className="flex justify-center w-full">
            <p className="px-4 py-2 rounded-full border border-stone-200/80 bg-stone-50/60 text-sm text-stone-600 text-center max-w-xl">
              От базового сопровождения до бухгалтерии под ключ
            </p>
          </div>
        </div>

        <div className="mb-16 md:mb-20">
          <div className="text-center mb-6 md:mb-8">
            <h3 className="text-xl md:text-2xl font-semibold text-stone-900 tracking-tight mb-1 px-4">
              Тарифы для ИП
            </h3>
          </div>
          {renderPlanCards(ipPlans)}
          {renderPlanButtons(ipPlans)}
        </div>

        <div>
          <div className="text-center mb-6 md:mb-8">
            <h3 className="text-xl md:text-2xl font-semibold text-stone-900 tracking-tight mb-1 px-4">
              Тарифы для ООО
            </h3>
          </div>
          {renderPlanCards(oooPlans)}
          {renderPlanButtons(oooPlans)}
        </div>

        <div
          className="mt-12 md:mt-16 rounded-2xl p-4 md:p-8 relative bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.88), rgba(30, 41, 59, 0.88)), url('/business-services-bg.jpg')`,
          }}
        >
          <div className="relative z-10">
            <div className="text-center mb-6 md:mb-8">
              <h3 className="text-xl md:text-2xl font-semibold text-white mb-2">
                Дополнительные услуги
              </h3>
              <p className="text-stone-300 text-sm md:text-base">Разовые услуги и консультации</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-5 border border-white/15 hover:bg-white/15 transition-colors duration-300">
                <h4 className="font-medium text-white mb-2 text-sm md:text-base">Регистрация ИП</h4>
                <p className="text-lg md:text-xl font-semibold text-white/95 mb-1">3 990 ₽*</p>
                <p className="text-xs text-stone-300">Под ключ за 3 дня</p>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-5 border border-white/15 hover:bg-white/15 transition-colors duration-300">
                <h4 className="font-medium text-white mb-2 text-sm md:text-base">Регистрация ООО</h4>
                <p className="text-lg md:text-xl font-semibold text-white/95 mb-1">9 990 ₽*</p>
                <p className="text-xs text-stone-300">Полное сопровождение</p>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-5 border border-white/15 hover:bg-white/15 transition-colors duration-300">
                <h4 className="font-medium text-white mb-2 text-sm md:text-base">Налоговая консультация</h4>
                <p className="text-lg md:text-xl font-semibold text-white/95 mb-1">2 500 ₽</p>
                <p className="text-xs text-stone-300">1 час с экспертом</p>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-5 border border-white/15 hover:bg-white/15 transition-colors duration-300">
                <h4 className="font-medium text-white mb-2 text-sm md:text-base">Восстановление учета</h4>
                <p className="text-lg md:text-xl font-semibold text-white/95 mb-1">от 15 000 ₽</p>
                <p className="text-xs text-stone-300">За период</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
