import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, ArrowRight, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function BlogPage() {
  const posts = [
    {
      id: 1,
      title: "Как не попасть на штрафы при смене налогового режима",
      excerpt: "Подробный гайд по переходу с одного налогового режима на другой без потери денег и нервов.",
      content: "Смена налогового режима — это серьезное решение, которое может существенно повлиять на ваш бизнес...",
      author: "Екатерина Голубева",
      date: "2024-01-15",
      readTime: "5 мин",
      category: "Налоги",
      tags: ["УСН", "ОСНО", "Патент"],
      image: "/blog/taxes.jpg"
    },
    {
      id: 2,
      title: "Новые требования к отчетности в 2024 году",
      excerpt: "Что изменилось в отчетности для ИП и ООО, какие новые формы появились и как к ним подготовиться.",
      content: "В 2024 году вступили в силу новые требования к бухгалтерской отчетности...",
      author: "Людмила",
      date: "2024-01-12",
      readTime: "7 мин",
      category: "Отчетность",
      tags: ["2024", "Изменения", "Формы"],
      image: "/blog/reports.jpg"
    },
    {
      id: 3,
      title: "ИП или ООО: что выбрать в 2024 году",
      excerpt: "Сравниваем плюсы и минусы разных форм ведения бизнеса и помогаем сделать правильный выбор.",
      content: "Выбор между ИП и ООО — один из первых вопросов, с которым сталкивается начинающий предприниматель...",
      author: "Константин",
      date: "2024-01-10",
      readTime: "6 мин",
      category: "Регистрация",
      tags: ["ИП", "ООО", "Выбор"],
      image: "/blog/business.jpg"
    },
    {
      id: 4,
      title: "Как правильно вести кадровый учет",
      excerpt: "Основы кадрового делопроизводства: от трудовых договоров до увольнения сотрудников.",
      content: "Кадровый учет — это не только оформление документов, но и соблюдение трудового законодательства...",
      author: "Наталья",
      date: "2024-01-08",
      readTime: "8 мин",
      category: "Кадры",
      tags: ["Трудовые договоры", "Кадры", "Документооборот"],
      image: "/blog/hr.jpg"
    }
  ]

  const categories = ["Все", "Налоги", "Отчетность", "Регистрация", "Кадры"]

  return (
    <div className="min-h-screen py-2">
      <div className="container py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">Блог</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Полезные статьи о бухгалтерии, налогах и ведении бизнеса от экспертов "Просто Бюро"
          </p>
        </div>

        {/* Поиск и фильтры */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Поиск статей..."
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={category === "Все" ? "default" : "outline"}
                  size="sm"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Список статей */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {posts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gradient-to-r from-blue-600 to-purple-600 relative">
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-4 left-4">
                  <Badge variant="secondary" className="bg-white/90 text-gray-900">
                    {post.category}
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <User className="h-4 w-4 mr-1" />
                  <span className="mr-4">{post.author}</span>
                  <Calendar className="h-4 w-4 mr-1" />
                  <span className="mr-4">{post.date}</span>
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{post.readTime}</span>
                </div>
                <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                <CardDescription className="line-clamp-3">
                  {post.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {post.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {post.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{post.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/blog/${post.id}`}>
                      Читать
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Пагинация */}
        <div className="flex justify-center">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              Назад
            </Button>
            <Button variant="default" size="sm">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <Button variant="outline" size="sm">
              Вперед
            </Button>
          </div>
        </div>

        {/* Подписка на новости */}
        <div className="mt-20">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Подпишитесь на наши новости</h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Получайте свежие статьи о бухгалтерии, изменениях в законодательстве и полезные советы для бизнеса
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  placeholder="Ваш email"
                  className="bg-white text-gray-900 border-0"
                />
                <Button variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                  Подписаться
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 