"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const CASES = [
  {
    title: "ИП с сотрудниками",
    problem: "Путаница с отчетностью и штрафы",
    solution: "Взяли учет на себя",
    result: "Отчетность без ошибок и штрафов",
  },
  {
    title: "ООО на ОСН",
    problem: "Сложный учет и нагрузка на директора",
    solution: "Полный аутсорс бухгалтерии",
    result: "Освободили время и снизили риски",
  },
] as const

export function CasesSection() {
  return (
    <section className="py-8 md:py-12 bg-white" id="cases">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 text-center mb-8 md:mb-10">
          Как мы решаем задачи бизнеса
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-5xl mx-auto">
          {CASES.map((c) => (
            <Card key={c.title} className="border border-gray-200 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg md:text-xl">{c.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-700">
                <p>
                  <span className="font-medium text-gray-900">Проблема: </span>
                  {c.problem}
                </p>
                <p>
                  <span className="font-medium text-gray-900">Решение: </span>
                  {c.solution}
                </p>
                <p>
                  <span className="font-medium text-gray-900">Результат: </span>
                  {c.result}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
