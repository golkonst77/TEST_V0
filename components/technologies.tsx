import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cloud, Zap, Shield, Clock, Database } from "lucide-react"

const technologies = [
  {
    name: "1С:Предприятие",
    description: "Облачная и локальная версии",
    benefit: "Автоматизация всех учетных процессов",
  },
  {
    name: "Контур.Диадок",
    description: "Электронный документооборот",
    benefit: "Экономия на бумаге и почте",
  },
  {
    name: "Банковские интеграции",
    description: "Тинькофф, Сбер, Альфа-Банк",
    benefit: "Автоматическая загрузка выписок",
  },
  {
    name: "КЭП и ЭЦП",
    description: "Квалифицированная электронная подпись",
    benefit: "Безопасная сдача отчетности",
  },
]

const benefits = [
  {
    icon: Zap,
    title: "Автоматизация рутины",
    description: "Ваши банковские выписки загружаются автоматически – никакого ручного ввода",
  },
  {
    icon: Clock,
    title: "Мгновенная отчетность",
    description: "Сдаем все в ФНС, ПФР, ФСС онлайн в день готовности",
  },
  {
    icon: Cloud,
    title: "Круглосуточный доступ",
    description: "Ваши финансы всегда под рукой в Личном кабинете или облаке 1С",
  },
  {
    icon: Shield,
    title: "Ноль арифметических ошибок",
    description: "Автоматические расчеты зарплаты и налогов",
  },
  {
    icon: Database,
    title: "Безопасное хранение",
    description: "Облачное хранение документов по стандартам 1С",
  },

]

export function Technologies() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600">Новинка: ИИ-обработка документов</Badge>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
            Технологии, которые работают на ваш успех
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Мы используем самые современные решения для автоматизации бухгалтерского учета
          </p>
        </div>



        {/* Technologies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {technologies.map((tech, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <CardTitle className="text-lg">{tech.name}</CardTitle>
                <CardDescription>{tech.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-green-600 font-medium">{tech.benefit}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white flex-shrink-0">
                <benefit.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
