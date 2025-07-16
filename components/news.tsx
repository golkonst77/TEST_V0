import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"

const news = [
  {
    title: "Изменения в налоговом законодательстве с 2024 года",
    description: "Обзор основных изменений в НК РФ, которые затронут малый и средний бизнес",
    date: "15 декабря 2023",
    category: "Налоги",
    href: "/blog/tax-changes-2024",
  },
  {
    title: "Электронный документооборот: преимущества и внедрение",
    description: "Как перейти на ЭДО и какие выгоды это принесет вашему бизнесу",
    date: "10 декабря 2023",
    category: "Технологии",
    href: "/blog/electronic-workflow",
  },
  {
    title: "Подготовка к налоговым проверкам: чек-лист для бизнеса",
    description: "Пошаговое руководство по подготовке к выездной налоговой проверке",
    date: "5 декабря 2023",
    category: "Проверки",
    href: "/blog/tax-audit-checklist",
  },
]

export function News() {
  return (
    <section className="py-12 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 md:mb-16">
          <div className="mb-4 md:mb-0 text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 mb-4">
              Новости и статьи
            </h2>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed text-center">
              Актуальная информация о налогах, бухгалтерии и бизнесе
            </p>
          </div>
          <Button asChild variant="outline" className="mx-auto md:mx-0">
            <Link href="/blog">
              Все статьи
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8 px-4">
          {news.map((article, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 rounded-xl">
              <CardHeader className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                    {article.category}
                  </span>
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    {article.date}
                  </div>
                </div>
                <CardTitle className="text-base md:text-lg group-hover:text-blue-600 transition-colors leading-relaxed">{article.title}</CardTitle>
                <CardDescription className="text-sm md:text-base leading-relaxed">{article.description}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <Button asChild variant="ghost" className="p-0 h-auto font-medium text-blue-600 hover:text-blue-800 text-sm md:text-base">
                  <Link href={article.href || "#"}>Читать далее →</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8 md:mt-12 px-4">
          <p className="text-xs md:text-sm text-gray-500">Новости автоматически обновляются из проверенных источников</p>
        </div>
      </div>
    </section>
  )
}
