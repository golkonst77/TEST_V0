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
    <section className="py-20 bg-gray-50">
      <div className="container">
        <div className="flex items-center justify-between mb-16">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">Новости и статьи</h2>
            <p className="text-xl text-gray-600">Актуальная информация о налогах, бухгалтерии и бизнесе</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/blog">
              Все статьи
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((article, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                    {article.category}
                  </span>
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    {article.date}
                  </div>
                </div>
                <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">{article.title}</CardTitle>
                <CardDescription>{article.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="ghost" className="p-0 h-auto font-medium text-blue-600 hover:text-blue-800">
                  <Link href={article.href}>Читать далее →</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-gray-500">Новости автоматически обновляются из проверенных источников</p>
        </div>
      </div>
    </section>
  )
}
