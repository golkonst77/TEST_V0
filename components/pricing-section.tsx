"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Star, ArrowRight } from "lucide-react"
import Link from "next/link"
import { QuizModal } from "@/components/quiz-modal"
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

export function PricingSection() {
  const [quizOpen, setQuizOpen] = useState(false)
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

        // Совместимость с текущим дизайном: первые 3 карточки ИП, следующие 3 — ООО.
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

  return (
    <section className="py-8 bg-white" id="pricing">
      <style jsx global>{`
        @keyframes priceGlow {
          0%, 100% {
            color: rgb(17, 24, 39);
            text-shadow: 0 0 0 transparent;
            transform: scale(1);
          }
          50% {
            color: rgb(59, 130, 246);
            text-shadow: 0 0 15px rgba(59, 130, 246, 0.6);
            transform: scale(1.05);
          }
        }
        
        .price-animate {
          animation: priceGlow 2s ease-in-out infinite;
          display: inline-block;
        }
      `}</style>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 mb-4">
            Выберите формат бухгалтерского обслуживания
          </h2>
          <div className="flex justify-center w-full mb-6">
            <div className="px-4 md:px-6 py-3 rounded-xl shadow-lg bg-gradient-to-r from-blue-50 to-purple-50 text-sm md:text-base font-medium text-gray-900 text-center">
              От базового сопровождения до бухгалтерии под ключ
            </div>
          </div>
        </div>

        {/* ИП Тарифы */}
        <div className="mb-10">
          <div className="text-center mb-4">
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 px-4">Тарифы для ИП</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8 px-4">
            {ipPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative shadow-xl h-auto ${
                  plan.popular ? "border-2 border-blue-500 scale-105" : "border border-gray-200"
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
                    <Star className="w-3 h-3 mr-1" />
                    Оптимальный выбор
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description || "\u00A0"}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold price-animate">{formatPlanPrice(plan.price)}</span>
                    <span className="text-gray-600 ml-2">/ {plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col px-6">
                  <ul className="space-y-3 max-h-[180px] overflow-auto">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
          {/* Кнопки под карточками ИП */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 justify-items-center mt-6 md:mt-8 mb-8 md:mb-12 w-full px-4">
            {ipPlans.map((plan, index) => (
              <Button
                key={index}
                size="lg"
                className={`w-full max-w-[320px] text-base md:text-lg font-bold shadow-xl flex items-center justify-center rounded-xl px-6 md:px-8 py-3 md:py-4 transition-all duration-200 ${
                  plan.popular ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white" : "bg-white border-2 border-blue-200 hover:border-blue-400 text-blue-900"
                }`}
                variant={plan.popular ? "default" : "outline"}
                onClick={() => setQuizOpen(true)}
              >
                Выбрать тариф
                <ArrowRight className="ml-2 md:ml-3 h-4 w-4 md:h-5 md:w-5" />
              </Button>
            ))}
          </div>
        </div>

        {/* ООО Тарифы */}
        <div>
          <div className="text-center mb-4">
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 px-4">Тарифы для ООО</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8 px-4">
            {oooPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative shadow-xl h-auto ${
                  plan.popular ? "border-2 border-blue-500 scale-105" : "border border-gray-200"
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
                    <Star className="w-3 h-3 mr-1" />
                    Оптимальный выбор
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description || "\u00A0"}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold price-animate">{formatPlanPrice(plan.price)}</span>
                    <span className="text-gray-600 ml-2">/ {plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col px-6">
                  <ul className="space-y-3 max-h-[180px] overflow-auto">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
          {/* Кнопки под карточками ООО */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 justify-items-center mt-6 md:mt-8 mb-8 md:mb-12 w-full px-4">
            {oooPlans.map((plan, index) => (
              <Button
                key={index}
                size="lg"
                className={`w-full max-w-[320px] text-base md:text-lg font-bold shadow-xl flex items-center justify-center rounded-xl px-6 md:px-8 py-3 md:py-4 transition-all duration-200 ${
                  plan.popular ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white" : "bg-white border-2 border-blue-200 hover:border-blue-400 text-blue-900"
                }`}
                variant={plan.popular ? "default" : "outline"}
                onClick={() => setQuizOpen(true)}
              >
                Выбрать тариф
                <ArrowRight className="ml-2 md:ml-3 h-4 w-4 md:h-5 md:w-5" />
              </Button>
            ))}
          </div>
        </div>

        {/* Дополнительные услуги */}
        <div 
          className="mt-12 md:mt-20 rounded-2xl p-4 md:p-8 relative bg-cover bg-center bg-no-repeat mx-4"
          style={{
            backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.85), rgba(30, 58, 138, 0.85)), url('/business-services-bg.jpg')`
          }}
        >
          <div className="relative z-10">
            <div className="text-center mb-6 md:mb-8">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Дополнительные услуги</h3>
              <p className="text-blue-100 text-sm md:text-base">Разовые услуги и консультации</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <div className="text-center bg-white/30 backdrop-blur-sm rounded-lg p-4 md:p-6 border border-white/20 hover:bg-white/40 transition-all duration-300">
                <h4 className="font-semibold text-white mb-2 text-sm md:text-base">Регистрация ИП</h4>
                <p className="text-xl md:text-2xl font-bold text-blue-300 mb-2 price-animate">3 990 ₽<span className="text-blue-200 align-super text-sm md:text-base">*</span></p>
                <p className="text-xs md:text-sm text-blue-100">Под ключ за 3 дня</p>
              </div>
              <div className="text-center bg-white/30 backdrop-blur-sm rounded-lg p-4 md:p-6 border border-white/20 hover:bg-white/40 transition-all duration-300">
                <h4 className="font-semibold text-white mb-2 text-sm md:text-base">Регистрация ООО</h4>
                <p className="text-xl md:text-2xl font-bold text-blue-300 mb-2 price-animate">9 990 ₽<span className="text-blue-200 align-super text-sm md:text-base">*</span></p>
                <p className="text-xs md:text-sm text-blue-100">Полное сопровождение</p>
              </div>
              <div className="text-center bg-white/30 backdrop-blur-sm rounded-lg p-4 md:p-6 border border-white/20 hover:bg-white/40 transition-all duration-300">
                <h4 className="font-semibold text-white mb-2 text-sm md:text-base">Налоговая консультация</h4>
                <p className="text-xl md:text-2xl font-bold text-blue-300 mb-2 price-animate">2 500 ₽</p>
                <p className="text-xs md:text-sm text-blue-100">1 час с экспертом</p>
              </div>
              <div className="text-center bg-white/30 backdrop-blur-sm rounded-lg p-4 md:p-6 border border-white/20 hover:bg-white/40 transition-all duration-300">
                <h4 className="font-semibold text-white mb-2 text-sm md:text-base">Восстановление учета</h4>
                <p className="text-xl md:text-2xl font-bold text-blue-300 mb-2 price-animate">от 15 000 ₽</p>
                <p className="text-xs md:text-sm text-blue-100">За период</p>
              </div>
            </div>
          </div>

        </div>

        {/* CTA */}
        <div className="text-center mt-12 md:mt-16 px-4">
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Не уверены, какой тариф выбрать?</h3>
          <p className="text-gray-600 mb-6 text-sm md:text-base">Поможем подобрать подходящий формат под ваш бизнес</p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 md:px-8 py-3 md:py-4 rounded-xl"
            onClick={handleCruiseClick}
          >
            Получить бесплатную консультацию
          </Button>
        </div>

        <QuizModal open={quizOpen} onOpenChange={setQuizOpen} />
      </div>
    </section>
  )
}
