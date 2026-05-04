"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCruiseClick } from "@/hooks/use-cruise-click"

export function CaseDetailedSection() {
  const { handleCruiseClick } = useCruiseClick()

  return (
    <section className="py-8 md:py-12 bg-white" id="case-detailed">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 mb-3">
            Как мы навели порядок в бухгалтерии за 2 недели
          </h2>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            Кейс клиента — ИП с сотрудниками
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
          <Card className="border border-gray-200 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg md:text-xl">Было</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-700">
              <p>Учет велся нерегулярно</p>
              <p>Были ошибки в отчетности</p>
              <p>Риск штрафов</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg md:text-xl">Сделали</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-700">
              <p>Разобрали учет за 2 недели</p>
              <p>Восстановили документы</p>
              <p>Сдали отчётность</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg md:text-xl">Результат</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-700">
              <p>Без штрафов</p>
              <p>Учет под контролем</p>
              <p>Собственник не тратит время</p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8 md:mt-10">
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 md:px-8 py-3 md:py-4 rounded-xl"
            onClick={handleCruiseClick}
          >
            Разобрать свою ситуацию
          </Button>
        </div>
      </div>
    </section>
  )
}
