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
    <section className="py-0 bg-white p-0 m-0">
      <div className="w-full px-0">
        <div className="flex justify-center w-full mb-4">
          <div className="px-6 py-3 rounded-xl shadow-lg bg-gradient-to-r from-blue-50 to-purple-50 text-lg font-semibold text-gray-900">
            Мы приручили налогового зверя. И научим его работать на вас.
          </div>
        </div>
        <div className="text-center mb-0">
          <p className="text-xl text-gray-600 mt-0 mb-0">
            Налоги могут быть не только головной болью, но и инструментом для оптимизации. Мы знаем все его повадки и слабые места.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 mt-0 w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
          {services.map((service, index) => (
            <Card
              key={index}
              className="flex flex-col justify-between items-stretch w-full shadow-2xl border-0 bg-white transition-all duration-300 hover:shadow-blue-400"
            >
              <CardHeader className="flex flex-col items-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white mb-4 shadow-lg">
                  <service.icon className="h-7 w-7" />
                </div>
                <CardTitle className="text-xl text-center font-bold">{service.title}</CardTitle>
                <CardDescription className="text-gray-600 text-center">{service.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col flex-grow justify-between">
                <ul className="space-y-2 mb-4">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-600 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="flex-grow"></div>
                <Button
                  asChild
                  className="w-full bg-blue-600 text-white rounded-xl shadow-lg font-semibold py-3 mt-auto hover:bg-blue-700 transition-colors text-base"
                >
                  <Link href={service.href || "#"}>
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
