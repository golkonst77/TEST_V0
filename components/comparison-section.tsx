"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCruiseClick } from "@/hooks/use-cruise-click"

export function ComparisonSection() {
  const { handleCruiseClick } = useCruiseClick()

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-slate-50 via-blue-50/40 to-violet-50/50" id="comparison">
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
          <Card className="rounded-2xl border border-gray-200 bg-white/80 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all opacity-80 grayscale-[20%]">
            <CardHeader className="pb-2">
              <span className="inline-flex w-fit px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 mb-3">
                Риски и расходы
              </span>
              <CardTitle className="text-lg md:text-xl">Штатный бухгалтер</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-700">
              <p><span className="text-slate-400 mr-2">−</span>Зарплата от 60 000 ₽</p>
              <p><span className="text-slate-400 mr-2">−</span>Отпуска и больничные</p>
              <p><span className="text-slate-400 mr-2">−</span>Ошибки — ваша ответственность</p>
              <p><span className="text-slate-400 mr-2">−</span>Ограниченный опыт</p>
              <p><span className="text-slate-400 mr-2">−</span>Зависимость от одного человека</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-blue-400 bg-gradient-to-br from-blue-50 to-violet-50 shadow-2xl ring-1 ring-blue-200 scale-[1.02] hover:shadow-2xl hover:-translate-y-1 transition-all">
            <CardHeader className="pb-2">
              <span className="inline-flex w-fit px-3 py-1 rounded-full text-xs font-medium bg-blue-600 text-white mb-3">
                Рекомендуем
              </span>
              <CardTitle className="text-lg md:text-xl">Бухгалтерия на аутсорсе</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-700">
              <p><span className="text-emerald-600 mr-2">✓</span>Фиксированная стоимость</p>
              <p><span className="text-emerald-600 mr-2">✓</span>Без отпусков и замен</p>
              <p><span className="text-emerald-600 mr-2">✓</span>Ответственность по договору</p>
              <p><span className="text-emerald-600 mr-2">✓</span>Команда специалистов</p>
              <p><span className="text-emerald-600 mr-2">✓</span>Всегда на связи</p>
            </CardContent>
          </Card>
        </div>

        <p className="text-center text-xs md:text-sm text-gray-500 max-w-2xl mx-auto mt-8 md:mt-10 mb-4 md:mb-5 leading-relaxed">
          Аутсорс выгоден, когда нужна не просто бухгалтерия, а ответственность и стабильная поддержка.
        </p>
        <p className="text-center text-sm md:text-base text-gray-600 max-w-2xl mx-auto mb-5 leading-relaxed">
          В большинстве случаев это дешевле и безопаснее, чем держать бухгалтера в штате
        </p>

        <div className="text-center mt-8">
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
