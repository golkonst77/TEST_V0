"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCruiseClick } from "@/hooks/use-cruise-click"

export function ComparisonSection() {
  const { handleCruiseClick } = useCruiseClick()

  return (
    <section className="py-8 md:py-12 bg-white" id="comparison">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
            Штатный бухгалтер или аутсорс — что выгоднее?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-5xl mx-auto">
          <Card className="border border-gray-200 shadow-md">
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

          <Card className="border border-gray-200 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg md:text-xl">ПростоБюро</CardTitle>
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

        <div className="text-center mt-8 md:mt-10">
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
