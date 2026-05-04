/**
 * @file: technologies.tsx
 * @description: Компонент для отображения используемых технологий
 * @dependencies: None
 * @created: 2025-01-15
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cloud, Zap, Shield, Clock, Database, BarChart3, FileText, CreditCard, Package, Lock } from "lucide-react"

const technologies = [
  {
    name: "1С:Предприятие",
    description: "Облачная и локальная версии",
    benefit: "Автоматизация всех учетных процессов",
    icon: BarChart3,
    gradient: "from-blue-600 to-purple-600"
  },
  {
    name: "Контур.Диадок",
    description: "Электронный документооборот",
    benefit: "Экономия на бумаге и почте",
    icon: FileText,
    gradient: "from-green-600 to-teal-600"
  },
  {
    name: "Банковские интеграции",
    description: "Тинькофф, Сбер, Альфа-Банк",
    benefit: "Автоматическая загрузка выписок",
    icon: CreditCard,
    gradient: "from-orange-600 to-red-600"
  },
  {
    name: "КЭП и ЭЦП",
    description: "Квалифицированная электронная подпись",
    benefit: "Безопасная сдача отчетности",
    icon: Lock,
    gradient: "from-purple-600 to-pink-600"
  },
  {
    name: "МойСклад",
    description: "Управление складом и товарами",
    benefit: "Полный контроль над товарными запасами",
    icon: Package,
    gradient: "from-indigo-600 to-blue-600"
  },
  {
    name: "Облачные решения",
    description: "1С:Облако, Контур.Бухгалтерия",
    benefit: "Доступ к данным из любой точки мира",
    icon: Cloud,
    gradient: "from-cyan-600 to-blue-600"
  }
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
  {
    icon: BarChart3,
    title: "Аналитика и отчеты",
    description: "Детальная аналитика по всем финансовым показателям",
  }
]

export function Technologies() {
  return (
    <section className="py-20 bg-gray-50" id="technologies">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600">Новинка: умная обработка документов</Badge>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
            Технологии, которые работают на ваш успех
          </h2>
          <p className="text-xl text-gray-600 w-full max-w-none md:max-w-3xl mx-auto">
            Мы используем самые современные решения для автоматизации бухгалтерского учета
          </p>
        </div>

        {/* Technologies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {technologies.map((tech, index) => (
            <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className={`w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-r ${tech.gradient} flex items-center justify-center text-white`}>
                  <tech.icon className="h-6 w-6" />
                </div>
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

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Готовы к цифровой трансформации?</h3>
            <p className="text-blue-100 mb-6 w-full max-w-none md:max-w-2xl mx-auto">
              Переходите на современные технологии вместе с нами. 
              Автоматизируйте процессы, сократите расходы и получите полный контроль над финансами.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                🔒 Безопасность данных
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                ⚡ Мгновенная синхронизация
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                📊 Подробная аналитика
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                ☁️ Облачные решения
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
