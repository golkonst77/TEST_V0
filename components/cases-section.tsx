"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCruiseClick } from "@/hooks/use-cruise-click"

const CASES = [
  {
    title: "ИП с сотрудниками",
    lines: [
      "Навели порядок в отчётности за 2 недели",
      "Сдали отчёты без штрафов",
      "Освободили время собственника",
    ],
  },
  {
    title: "ООО на ОСН",
    lines: [
      "Передали бухгалтерию на аутсорс",
      "Снизили нагрузку на директора",
      "Убрали риски ошибок и проверок",
    ],
  },
  {
    title: "ИП или ООО на старте",
    lines: [
      "Помогли разобраться с налогами и системой учёта",
      "Настроили бухгалтерию с нуля",
      "Избежали ошибок на старте",
    ],
  },
  {
    title: "Требования от налоговой",
    lines: [
      "Разобрали ситуацию и подготовили ответы",
      "Снизили риски штрафов",
      "Сопроводили до полного закрытия вопроса",
    ],
  },
] as const

export function CasesSection() {
  const { handleCruiseClick } = useCruiseClick()

  return (
    <section className="py-8 md:py-12 bg-white" id="cases">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 text-center mb-8 md:mb-10">
          С какими задачами к нам приходят
        </h2>
        <p className="text-gray-600 text-sm md:text-base leading-relaxed text-center w-full max-w-none md:max-w-3xl mx-auto mb-6 md:mb-8">
          Коротко о ситуациях, с которыми чаще всего обращаются ИП и ООО
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-5xl mx-auto">
          {CASES.map((c) => (
            <Card key={c.title} className="border border-gray-200 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg md:text-xl">{c.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-700">
                {c.lines.map((line, i) => (
                  <p key={`${c.title}-${i}`}>{line}</p>
                ))}
              </CardContent>
            </Card>
          ))}
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
