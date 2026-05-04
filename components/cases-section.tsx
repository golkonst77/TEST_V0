"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
] as const

export function CasesSection() {
  return (
    <section className="py-8 md:py-12 bg-white" id="cases">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 text-center mb-8 md:mb-10">
          Примеры задач, которые мы берём на себя
        </h2>
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
      </div>
    </section>
  )
}
