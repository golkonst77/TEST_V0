import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Star, ArrowRight, Phone } from "lucide-react"
import { QuizModalTariff } from "@/components/quiz-modal-tariff"
import React from "react"

const ipPlans = [
  {
    name: "Старт",
    price: "2 990",
    period: "мес",
    description: "Для начинающих ИП",
    popular: false,
    features: [
      "Ведение КУДиР",
      "Расчет и подача деклараций",
      "Консультации по налогам",
      "Сдача отчетности в ФНС",
      "Базовая поддержка",
    ],
    suitable: ["УСН доходы", "Патент", "До 10 операций в месяц"],
  },
  {
    name: "Оптимум",
    price: "4 990",
    period: "мес",
    description: "Самый популярный тариф",
    popular: true,
    features: [
      "Все из тарифа Старт",
      "Ведение учета в 1С",
      "Расчет взносов ИП",
      "Консультации по оптимизации",
      "Приоритетная поддержка",
      "Личный кабинет",
    ],
    suitable: ["УСН доходы/доходы-расходы", "До 50 операций в месяц", "Работа с НДС"],
  },
  {
    name: "Премиум",
    price: "7 990",
    period: "мес",
    description: "Для активных ИП",
    popular: false,
    features: [
      "Все из тарифа Оптимум",
      "Ведение кадрового учета",
      "Расчет зарплаты сотрудников",
      "Юридическое сопровождение",
      "Персональный менеджер",
      "Безлимитные консультации",
    ],
    suitable: ["Любая система налогообложения", "Безлимитные операции", "Наемные сотрудники"],
  },
]

export default function IPPricingPage() {
  const [quizOpen, setQuizOpen] = React.useState(false)
  return (
    <div className="container py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">Тарифы для ИП</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Профессиональное ведение учета для индивидуальных предпринимателей. Все налоги, отчеты и консультации в одном
          месте.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {ipPlans.map((plan, index) => (
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
                onClick={() => setQuizOpen(true)}
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
              Нужна консультация?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Не уверены, какой тариф подойдет именно вам? Получите бесплатную консультацию наших экспертов.
            </p>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Получить консультацию
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Гарантии качества</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Возмещаем штрафы по нашей вине</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Сдача отчетов точно в срок</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Персональный бухгалтер</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Конфиденциальность данных</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
      <QuizModalTariff open={quizOpen} onOpenChange={setQuizOpen} />
    </div>
  )
}
