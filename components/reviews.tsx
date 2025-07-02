import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"

const reviews = [
  {
    name: "Анна Петрова",
    company: 'ООО "Строй-Мастер"',
    rating: 5,
    text: "Отличная команда! Помогли пройти налоговую проверку без единого штрафа. Всегда на связи, отвечают быстро и по делу.",
    date: "2 месяца назад",
  },
  {
    name: "Михаил Сидоров",
    company: "ИП Сидоров М.А.",
    rating: 5,
    text: "Работаю с ПростоБюро уже 3 года. Никаких проблем с отчетностью, все сдается вовремя. Рекомендую!",
    date: "1 месяц назад",
  },
  {
    name: "Елена Козлова",
    company: 'ООО "Торговый дом"',
    rating: 5,
    text: "Профессиональный подход к делу. Оперативно решают любые вопросы. Цены адекватные, качество на высоте.",
    date: "3 недели назад",
  },
]

export function Reviews() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">Отзывы наших клиентов</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Более 500 довольных клиентов доверяют нам свою бухгалтерию
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <Card key={index} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <Quote className="h-6 w-6 text-gray-300" />
                </div>
                <CardTitle className="text-lg">{review.name}</CardTitle>
                <CardDescription>{review.company}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{review.text}</p>
                <p className="text-sm text-gray-400">{review.date}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Все отзывы взяты с{" "}
            <a
              href="https://yandex.ru/maps/org/prosto_byuro/180493814174/reviews/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              Яндекс.Карт
            </a>
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <span>Средняя оценка: 5.0</span>
            <span>•</span>
            <span>Всего отзывов: 15+</span>
          </div>
        </div>
      </div>
    </section>
  )
}
