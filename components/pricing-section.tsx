"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Star, ArrowRight } from "lucide-react"
import Link from "next/link"
import { QuizModalTariff } from "@/components/quiz-modal-tariff"
import { useCruiseClick } from "@/hooks/use-cruise-click"
import React from "react"

const ipPlans = [
  {
    name: "Круиз-Контроль",
    price: "2 990",
    period: "мес",
    description: "Идеально для ИП и фрилансеров, которые хотят снять с себя базовые задачи по отчетности и налогам",
    popular: false,
    features: [
      "Ведение КУДиР",
      "Расчет и подача деклараций",
      "Консультации по налогам",
      "Сдача отчетности в ФНС",
      "Базовая поддержка",
    ],
  },
  {
    name: "Адаптивный Круиз",
    price: "4 990",
    period: "мес",
    description: "Лучшее решение для растущих компаний и ИП с сотрудниками, которым нужна гибкость и поддержка в кадровых вопросах",
    popular: true,
    features: [
      "Все из тарифа Круиз-Контроль",
      "Ведение учета в 1С",
      "Расчет взносов ИП",
      "Консультации по оптимизации",
      "Приоритетная поддержка",
      "Личный кабинет",
    ],
  },
  {
    name: "Полный Автопилот",
    price: "7 990",
    period: "мес",
    description: "Для опытных компаний со сложным учетом, ВЭД и специфическими задачами, требующими максимального вовлечения и экспертной поддержки",
    popular: false,
    features: [
      "Все из тарифа Адаптивный Круиз",
      "Ведение кадрового учета",
      "Расчет зарплаты сотрудников",
      "Юридическое сопровождение",
      "Персональный менеджер",
      "Безлимитные консультации",
    ],
  },
]

const oooPlans = [
  {
    name: "Круиз-Контроль",
    price: "8 990",
    period: "мес",
    description: "Идеально для ООО и фрилансеров, которые хотят снять с себя базовые задачи по отчетности и налогам",
    popular: false,
    features: [
      "Ведение бухучета",
      "Сдача всех отчетов",
      "Расчет налогов",
      "Консультации бухгалтера",
      "Документооборот",
    ],
  },
  {
    name: "Адаптивный Круиз",
    price: "14 990",
    period: "мес",
    description: "Лучшее решение для растущих компаний и ООО с сотрудниками, которым нужна гибкость и поддержка в кадровых вопросах",
    popular: true,
    features: [
      "Все из тарифа Круиз-Контроль",
      "Кадровое делопроизводство",
      "Расчет зарплаты",
      "Отчеты в ПФР и ФСС",
      "Юридические консультации",
      "Личный кабинет",
    ],
  },
  {
    name: "Полный Автопилот",
    price: "24 990",
    period: "мес",
    description: "Для опытных компаний со сложным учетом, ВЭД и специфическими задачами, требующими максимального вовлечения и экспертной поддержки",
    popular: false,
    features: [
      "Все из тарифа Адаптивный Круиз",
      "Управленческий учет",
      "Финансовая аналитика",
      "Налоговое планирование",
      "Персональный менеджер",
      "Сопровождение проверок",
    ],
  },
]

export function PricingSection() {
  const [quizOpen, setQuizOpen] = React.useState(false)
  const { handleCruiseClick } = useCruiseClick()

  return (
    <section className="py-8 bg-white">
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
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
            Выберите ваш режим «Круиз-контроля»
          </h2>
          <div className="flex justify-center w-full mb-6">
            <div className="px-6 py-3 rounded-xl shadow-lg bg-gradient-to-r from-blue-50 to-purple-50 text-base font-medium text-gray-900">
              От базовой поддержки до полного автопилота для вашего бизнеса 🚗
            </div>
          </div>
        </div>

        {/* ИП Тарифы */}
        <div className="mb-10">
          <div className="text-center mb-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Тарифы для ИП</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                    <span className="text-4xl font-bold price-animate">{plan.price}</span>
                    <span className="text-gray-600 ml-2">₽/{plan.period}</span>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center mt-8 mb-12 w-full">
            {ipPlans.map((plan, index) => (
              <Button
                key={index}
                size="lg"
                className={`w-full max-w-[320px] text-lg font-bold shadow-xl flex items-center justify-center rounded-xl px-8 py-4 transition-all duration-200 ${
                  plan.popular ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white" : "bg-white border-2 border-blue-200 hover:border-blue-400 text-blue-900"
                }`}
                variant={plan.popular ? "default" : "outline"}
                onClick={() => setQuizOpen(true)}
              >
                Выбрать тариф
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
            ))}
          </div>
        </div>

        {/* ООО Тарифы */}
        <div>
          <div className="text-center mb-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Тарифы для ООО</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                    <span className="text-4xl font-bold price-animate">{plan.price}</span>
                    <span className="text-gray-600 ml-2">₽/{plan.period}</span>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center mt-8 mb-12 w-full">
            {oooPlans.map((plan, index) => (
              <Button
                key={index}
                size="lg"
                className={`w-full max-w-[320px] text-lg font-bold shadow-xl flex items-center justify-center rounded-xl px-8 py-4 transition-all duration-200 ${
                  plan.popular ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white" : "bg-white border-2 border-blue-200 hover:border-blue-400 text-blue-900"
                }`}
                variant={plan.popular ? "default" : "outline"}
                onClick={() => setQuizOpen(true)}
              >
                Выбрать тариф
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
            ))}
          </div>
        </div>

        {/* Дополнительные услуги */}
        <div 
          className="mt-20 rounded-2xl p-8 relative bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.85), rgba(30, 58, 138, 0.85)), url('/business-services-bg.jpg')`
          }}
        >
          <div className="relative z-10">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">Дополнительные услуги</h3>
              <p className="text-blue-100">Разовые услуги и консультации</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center bg-white/30 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/40 transition-all duration-300">
                <h4 className="font-semibold text-white mb-2">Регистрация ИП</h4>
                <p className="text-2xl font-bold text-blue-300 mb-2 price-animate">3 990 ₽<span className="text-blue-200 align-super text-base">*</span></p>
                <p className="text-sm text-blue-100">Под ключ за 3 дня</p>
              </div>
              <div className="text-center bg-white/30 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/40 transition-all duration-300">
                <h4 className="font-semibold text-white mb-2">Регистрация ООО</h4>
                <p className="text-2xl font-bold text-blue-300 mb-2 price-animate">9 990 ₽<span className="text-blue-200 align-super text-base">*</span></p>
                <p className="text-sm text-blue-100">Полное сопровождение</p>
              </div>
              <div className="text-center bg-white/30 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/40 transition-all duration-300">
                <h4 className="font-semibold text-white mb-2">Налоговая консультация</h4>
                <p className="text-2xl font-bold text-blue-300 mb-2 price-animate">2 500 ₽</p>
                <p className="text-sm text-blue-100">1 час с экспертом</p>
              </div>
              <div className="text-center bg-white/30 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/40 transition-all duration-300">
                <h4 className="font-semibold text-white mb-2">Восстановление учета</h4>
                <p className="text-2xl font-bold text-blue-300 mb-2 price-animate">от 15 000 ₽</p>
                <p className="text-sm text-blue-100">За период</p>
              </div>
            </div>
          </div>
          <div className="text-left text-sm font-bold text-white mt-4 ml-2">
            * НЕ ВЗИМАЕТСЯ при заключении договора бухгалтерского обслуживания на 6 месяцев.
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Не можете выбрать подходящий тариф?</h3>
          <p className="text-gray-600 mb-6">Получите бесплатную консультацию и персональное предложение</p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            onClick={handleCruiseClick}
          >
            Получить консультацию
          </Button>
        </div>

        <QuizModalTariff open={quizOpen} onOpenChange={setQuizOpen} />
      </div>
    </section>
  )
}
