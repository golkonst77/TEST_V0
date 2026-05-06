"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCruiseClick } from "@/hooks/use-cruise-click"

export function CaseDetailedSection() {
  const { handleCruiseClick } = useCruiseClick()

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-slate-50 via-blue-50/40 to-violet-50/50" id="case-detailed">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 mb-3">
            Как мы быстро навели порядок в учёте
          </h2>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            Реальный сценарий работы с ИП с сотрудниками
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="hidden md:block pointer-events-none absolute inset-y-0 left-1/3 -translate-x-1/2 z-10">
            <div className="h-full flex items-center text-2xl text-slate-500 opacity-70">→</div>
          </div>
          <div className="hidden md:block pointer-events-none absolute inset-y-0 left-2/3 -translate-x-1/2 z-10">
            <div className="h-full flex items-center text-2xl text-slate-500 opacity-70">→</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-7">
            <Card className="rounded-2xl border border-gray-200 bg-slate-50/80 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
            <CardHeader className="pb-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-base font-semibold mb-3 bg-slate-200 text-slate-700">
                1
              </div>
              <CardTitle className="text-xl md:text-2xl">Было</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 md:space-y-3 text-sm md:text-base text-gray-700">
              <p>Учет велся нерегулярно</p>
              <p>Были ошибки в отчетности</p>
              <p>Риск штрафов</p>
            </CardContent>
          </Card>

            <Card className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50/80 to-violet-50/70 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
            <CardHeader className="pb-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-base font-semibold mb-3 bg-blue-100 text-blue-700">
                2
              </div>
              <CardTitle className="text-xl md:text-2xl">Сделали</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 md:space-y-3 text-sm md:text-base text-gray-700">
              <p>Разобрали учет за 2 недели</p>
              <p>Восстановили документы</p>
              <p>Сдали отчётность</p>
            </CardContent>
          </Card>

            <Card className="rounded-2xl border border-blue-500 bg-gradient-to-br from-blue-100 to-violet-100 shadow-2xl ring-1 ring-blue-200 md:scale-[1.03] hover:shadow-2xl hover:-translate-y-1 transition-all">
            <CardHeader className="pb-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-base font-semibold mb-3 bg-blue-600 text-white">
                3
              </div>
              <CardTitle className="text-xl md:text-2xl text-blue-700">Что получили в итоге</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 md:space-y-3 text-sm md:text-base text-gray-700">
              <p>Без штрафов</p>
              <p>Учет под контролем</p>
              <p>Собственник не тратит время</p>
            </CardContent>
            </Card>
          </div>
        </div>

        <div className="text-center mt-6 md:mt-8">
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
