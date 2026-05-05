"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCruiseClick } from "@/hooks/use-cruise-click"

export function ComparisonSection() {
  const { handleCruiseClick } = useCruiseClick()

  return (
    <section className="py-8 md:py-12 bg-gradient-to-b from-gray-50 to-white" id="comparison">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
            Штатный бухгалтер или аутсорс — что выгоднее?
          </h2>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed w-full max-w-none md:max-w-3xl mx-auto mt-3">
            Сравните не только цену, но и ответственность, заменяемость и риски
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-5xl mx-auto">
          <Card className="border border-gray-200 bg-white shadow-md hover:shadow-lg transition-shadow hover:-translate-y-1 transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg md:text-xl">Штатный бухгалтер</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-700">
              <p>Зарплата от 60 000 ₽</p>
              <p>Отпуска и больничные</p>
              <p>Ошибки — ваша ответственность</p>
              <p>Ограниченный опыт</p>
              <p>Зависимость от одного человека</p>
            </CardContent>
          </Card>

          <Card className="border border-blue-400 bg-blue-50/70 shadow-md ring-1 ring-blue-100 hover:shadow-lg transition-shadow hover:-translate-y-1 transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg md:text-xl">Бухгалтерия на аутсорсе</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-700">
              <p>Фиксированная стоимость</p>
              <p>Без отпусков и замен</p>
              <p>Ответственность по договору</p>
              <p>Команда специалистов</p>
              <p>Всегда на связи</p>
            </CardContent>
          </Card>
        </div>

        <p className="text-center text-xs md:text-sm text-gray-500 max-w-2xl mx-auto mt-8 md:mt-10 mb-4 md:mb-5 leading-relaxed">
          Аутсорс выгоден, когда нужна не просто бухгалтерия, а ответственность и стабильная поддержка.
        </p>

        <div className="text-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 md:px-8 py-3 md:py-4 rounded-xl"
            onClick={handleCruiseClick}
          >
            Получить консультацию
          </Button>
        </div>
      </div>
    </section>
  )
}
