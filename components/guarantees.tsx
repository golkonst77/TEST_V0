'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Clock, Lock, Users, CheckCircle } from "lucide-react"
import { AIDocuments } from "@/components/ai-documents"
import { QuizModal } from "@/components/quiz-modal"
import { useState } from "react"

const guarantees = [
  {
    icon: Shield,
    title: "Возмещаем штрафы и пени",
    description: "Возмещаем штрафы и пени, возникшие по нашей вине при ведении учета",
    highlight: true,
    bg: "bg-green-100 border-green-500",
    iconBg: "bg-green-600 text-white",
  },
  {
    icon: Clock,
    title: "100% своевременная сдача",
    description: "Гарантируем 100% своевременную сдачу всех отчетов",
    highlight: false,
    bg: "bg-blue-100 border-blue-500",
    iconBg: "bg-blue-600 text-white",
  },
  {
    icon: Lock,
    title: "Строгая конфиденциальность",
    description: "Строгая конфиденциальность (подписываем NDA)",
    highlight: false,
    bg: "bg-purple-100 border-purple-500",
    iconBg: "bg-purple-600 text-white",
  },
  {
    icon: Users,
    title: "Персональный бухгалтер",
    description: "Персональный бухгалтер доступен в рабочие часы",
    highlight: false,
    bg: "bg-red-100 border-red-500",
    iconBg: "bg-red-600 text-white",
  },
]

export function Guarantees() {
  const [quizOpen, setQuizOpen] = useState(false)
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
            Укрощение бюрократического зверя
          </h2>
          <div className="flex flex-col items-center gap-2 mb-8">
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Переводим с языка чиновников на язык бизнеса. Избавляем от бумажного хаоса, чтобы вы могли творить
            </p>
            <div className="flex flex-col items-center gap-2 mt-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg px-6 py-3 mb-4">
                <span className="text-base font-medium">Мы являемся авторизованными партнерами Сбербанка, ВТБ, Альфа-Банка</span>
              </div>
              <div className="flex flex-row items-center gap-6 mt-4">
                {/* Сбербанк */}
                <Card className="text-center border-2 border-gray-200 bg-white hover:border-green-300 hover:shadow-lg transition-all duration-200 px-6 py-4">
                  <CardHeader className="pb-2">
                    <div className="flex h-16 w-16 items-center justify-center rounded-lg mx-auto mb-3 bg-green-600 text-white">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 12l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <CardTitle className="text-base">Сбербанк</CardTitle>
                  </CardHeader>
                </Card>
                {/* ВТБ */}
                <Card className="text-center border-2 border-gray-200 bg-white hover:border-blue-300 hover:shadow-lg transition-all duration-200 px-6 py-4">
                  <CardHeader className="pb-2">
                    <div className="flex h-16 w-16 items-center justify-center rounded-lg mx-auto mb-3 bg-blue-600 text-white">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 6h16v2H4V6zm2 4h12v2H6v-2zm2 4h8v2H8v-2z" fill="#fff"/>
                      </svg>
                    </div>
                    <CardTitle className="text-base">ВТБ</CardTitle>
                  </CardHeader>
                </Card>
                {/* Альфа-Банк */}
                <Card className="text-center border-2 border-gray-200 bg-white hover:border-red-300 hover:shadow-lg transition-all duration-200 px-6 py-4">
                  <CardHeader className="pb-2">
                    <div className="flex h-16 w-16 items-center justify-center rounded-lg mx-auto mb-3 bg-red-600 text-white">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2l3 9h-6l3-9zm-3 12h6v2H9v-2z" fill="#fff"/>
                      </svg>
                    </div>
                    <CardTitle className="text-base">Альфа-Банк</CardTitle>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Guarantees */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">Наши гарантии</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {guarantees.map((guarantee, index) => (
              <Card
                key={index}
                className={`text-center border-2 ${guarantee.bg}`}
              >
                <CardHeader>
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-lg mx-auto mb-4 ${guarantee.iconBg}`}
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
          <AIDocuments onQuizOpen={() => setQuizOpen(true)} />
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8">
          <h3 className="text-2xl font-bold mb-4">
            Ты — создаешь бизнес. Мы — следим, чтобы налоги не съели твою прибыль.
          </h3>
          <p className="text-xl mb-6">Расти спокойно.</p>
        </div>

        <QuizModal open={quizOpen} onOpenChange={setQuizOpen} />
      </div>
    </section>
  )
}
