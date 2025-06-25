import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Star, ArrowRight, Phone } from "lucide-react"

const oooPlans = [
  {
    name: "Базовый",
    price: "8 990",
    period: "мес",
    description: "Для малых ООО",
    popular: false,
    features: [
      "Ведение бухучета",
      "Сдача всех отчетов",
      "Расчет налогов",
      "Консультации бухгалтера",
      "Документооборот",
    ],
    suitable: ["УСН", "До 20 операций в месяц", "Без сотрудников"],
  },
  {
    name: "Стандарт",
    price: "14 990",
    period: "мес",
    description: "Оптимальное решение",
    popular: true,
    features: [
      "Все из тарифа Базовый",
      "Кадровое делопроизводство",
      "Расчет зарплаты",
      "Отчеты в ПФР и ФСС",
      "Юридические консультации",
      "Личный кабинет",
    ],
    suitable: ["УСН/ОСНО", "До 100 операций в месяц", "До 10 сотрудников"],
  },
  {
    name: "Бизнес",
    price: "24 990",
    period: "мес",
    description: "Для растущих компаний",
    popular: false,
    features: [
      "Все из тарифа Стандарт",
      "Управленческий учет",
      "Финансовая аналитика",
      "Налоговое планирование",
      "Персональный менеджер",
      "Сопровождение проверок",
    ],
    suitable: ["Любая система налогообложения", "Безлимитные операции", "Любое количество сотрудников"],
  },
]

export default function OOOPricingPage() {
  return (
    <div className="container py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">Тарифы для ООО</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Полное бухгалтерское обслуживание организаций. От ведения учета до налогового планирования и юридической
          поддержки.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {oooPlans.map((plan, index) => (
          <Card
            key={index}
            className={`relative ${
              plan.popular ? "border-2 border-blue-500 shadow-lg scale-105" : "border border-gray-200"
            }`}
          >
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
                <Star className="w-3 h-3 mr-1" />
                Популярный
              </Badge>
            )}
            <CardHeader className="text-center">
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-gray-600 ml-2">₽/{plan.period}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Что входит:</h4>
                <ul className="space-y-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Подходит для:</h4>
                <ul className="space-y-2">
                  {plan.suitable.map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                className={`w-full ${
                  plan.popular
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    : ""
                }`}
                variant={plan.popular ? "default" : "outline"}
              >
                Выбрать тариф
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Дополнительная информация */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Phone className="mr-2 h-5 w-5" />
              Индивидуальное предложение
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Нужны дополнительные услуги или особые условия? Мы составим персональное предложение под ваш бизнес.
            </p>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Получить предложение
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Что включено во все тарифы</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Ведение учета в 1С</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Электронный документооборот</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Сдача отчетности онлайн</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Консультации по телефону</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
