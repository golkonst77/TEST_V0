import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calculator, FileText, Users, Building, ArrowRight } from "lucide-react"
import Link from "next/link"

const services = [
  {
    icon: FileText,
    title: "Бухгалтерия",
    description: "Полное ведение бухгалтерского учета, составление и сдача отчетности",
    features: ["Ведение учета в 1С", "Сдача отчетности онлайн", "Консультации по налогам"],
    href: "/services/accounting",
  },
  {
    icon: Users,
    title: "Зарплата и кадры",
    description: "Расчет заработной платы и ведение кадрового делопроизводства",
    features: ["Расчет зарплаты", "Кадровые документы", "Отчеты в ПФР и ФСС"],
    href: "/services/payroll",
  },
  {
    icon: Building,
    title: "Юридическое сопровождение",
    description: "Защита интересов в налоговых спорах и при проверках",
    features: ["Сопровождение проверок", "Налоговые споры", "Правовые консультации"],
    href: "/services/legal",
  },
  {
    icon: Calculator,
    title: "Регистрация фирм",
    description: "Регистрация ИП и ООО, внесение изменений в ЕГРЮЛ",
    features: ["Регистрация ИП", "Регистрация ООО", "Изменения в документах"],
    href: "/services/registration",
  },
]

export function Services() {
  return (
    <section className="py-20 bg-white">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
            Мы приручили налогового зверя. И научим его работать на вас.
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Налоги могут быть не только головной болью, но и инструментом для оптимизации. Мы знаем все его повадки и
            слабые места.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white mb-4">
                  <service.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
                <CardDescription className="text-gray-600">{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-600 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  variant="outline"
                  className="w-full group-hover:bg-blue-600 group-hover:text-white transition-colors"
                >
                  <Link href={service.href}>
                    Подробнее
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
