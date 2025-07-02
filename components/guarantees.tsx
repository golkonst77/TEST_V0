import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Clock, Lock, Users, CheckCircle } from "lucide-react"
import { AIDocuments } from "@/components/ai-documents"

const guarantees = [
  {
    icon: Shield,
    title: "Возмещаем штрафы и пени",
    description: "Возмещаем штрафы и пени, возникшие по нашей вине при ведении учета",
    highlight: true,
  },
  {
    icon: Clock,
    title: "100% своевременная сдача",
    description: "Гарантируем 100% своевременную сдачу всех отчетов",
    highlight: false,
  },
  {
    icon: Lock,
    title: "Строгая конфиденциальность",
    description: "Строгая конфиденциальность (подписываем NDA)",
    highlight: false,
  },
  {
    icon: Users,
    title: "Персональный бухгалтер",
    description: "Персональный бухгалтер доступен в рабочие часы",
    highlight: false,
  },
]



export function Guarantees() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
            Укрощение бюрократического зверя
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Переводим с языка чиновников на язык бизнеса. Избавляем от бумажного хаоса, чтобы вы могли творить
          </p>
        </div>

        {/* Guarantees */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">Наши гарантии</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {guarantees.map((guarantee, index) => (
              <Card
                key={index}
                className={`text-center ${guarantee.highlight ? "border-2 border-green-500 bg-green-50" : ""}`}
              >
                <CardHeader>
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-lg mx-auto mb-4 ${
                      guarantee.highlight
                        ? "bg-green-600 text-white"
                        : "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    }`}
                  >
                    <guarantee.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">{guarantee.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{guarantee.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* AI Documents Section */}
        <div className="mb-16 -mx-4">
          <AIDocuments />
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8">
          <h3 className="text-2xl font-bold mb-4">
            Ты — создаешь бизнес. Мы — следим, чтобы налоги не съели твою прибыль.
          </h3>
          <p className="text-xl mb-6">Расти спокойно.</p>
        </div>
      </div>
    </section>
  )
}
