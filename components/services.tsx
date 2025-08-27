"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calculator, FileText, Users, Building, ArrowRight } from "lucide-react"
import Link from "next/link"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import { useState } from "react"
import { useContactForm } from "@/hooks/use-contact-form"

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

const serviceDetails = [
  {
    title: "Бухгалтерия (Ваш Финансовый Штурман)",
    text: `Представьте: вы полны идей, горите желанием запустить свой бизнес, но вот эти бесконечные цифры, отчеты, налоги... Голова идет кругом, правда? А что, если всю эту рутину возьмет на себя команда профессионалов, чтобы вы могли полностью сосредоточиться на главном – развитии своего дела? Мы станем вашим надежным финансовым штурманом! Наши эксперты не просто ведут вашу бухгалтерию – они заботятся о каждой копейке, контролируют доходы и расходы, готовят идеальные отчеты, чтобы у налоговой никогда не возникало вопросов. Мы умеем работать в 1С, так что вся ваша финансовая картина будет прозрачной и понятной. И самое главное: никаких сложных терминов! Всегда готовы объяснить самые запутанные налоговые вопросы простыми словами, чтобы вы чувствовали себя уверенно и спокойно. С нами ваш бизнес будет расти на прочном финансовом фундаменте, а вы забудете о бухгалтерских головных болях.`
  },
  {
    title: "Зарплата и кадры (Сердце Вашей Команды)",
    text: `Ваш бизнес растет, и вот уже нужны помощники – настоящие профессионалы! Но как правильно оформить их, чтобы все было по закону, и зарплата всегда приходила вовремя? Эта часть работы может показаться сложной, но только не для нас! Мы станем вашим HR-отделом и бухгалтерией по зарплате в одном лице. Наши специалисты с ювелирной точностью рассчитают зарплату для каждого сотрудника, учтут все премии, отпуска, больничные – никаких ошибок! Мы подготовим все необходимые документы: от трудовых договоров до приказов, чтобы вы были спокойны за каждого члена команды. А еще мы берем на себя всю бумажную волокиту с Пенсионным фондом и Фондом социального страхования. Вам не придется часами сидеть над отчетами – мы сделаем это за вас, гарантируя, что все будет сдано в срок и без единой помарки. Вы сможете полностью посвятить себя формированию сильной и мотивированной команды, а мы позаботимся о ее финансовом и документальном благополучии.`
  },
  {
    title: "Юридическое сопровождение (Ваш Щит и Меч в Мире Закона)",
    text: `Мир бизнеса – это не только возможности, но и иногда неожиданные препятствия. Вдруг проверка? Или возник спор с партнером? А может, просто нужно понять, как правильно составить договор, чтобы потом не было проблем? Не беспокойтесь! Мы станем вашим надежным щитом и острым мечом в мире законов и правил. Наши юристы – это опытные защитники, которые готовы встать на вашу сторону в любой ситуации. Мы поможем пройти любые проверки без стресса, отстоять ваши интересы в налоговых спорах и дать четкие, понятные советы по любым юридическим вопросам. Вы всегда сможете обратиться к нам за консультацией, будь то составление договора, защита ваших прав или решение конфликтных ситуаций. С нами вы будете чувствовать себя уверенно, зная, что ваш бизнес под надежной правовой защитой, а вы можете смело двигаться вперед.`
  },
  {
    title: "Регистрация фирм (Ваш Трамплин в Большой Бизнес)",
    text: `Мечта о собственном бизнесе становится реальностью, когда все оформлено правильно. Мы поможем зарегистрировать ИП или ООО, подготовим все документы, объясним каждый шаг и подскажем, как избежать ошибок. Ваш старт будет легким и уверенным!`
  },
]

export function Services({ showTitle = false }: { showTitle?: boolean }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const { openContactForm } = useContactForm()
  return (
    <section className="pt-8 pb-16 bg-white" id="services">
      <div className="max-w-7xl mx-auto w-full px-2 md:px-4 xl:px-8">
        {showTitle && (
          <h2 className="text-4xl md:text-5xl font-extrabold mb-8 text-center">Наши услуги</h2>
        )}
        <div className="flex justify-center w-full mb-4">
          <div className="px-6 py-3 rounded-xl shadow-lg bg-gradient-to-r from-blue-50 to-purple-50 text-lg font-semibold text-gray-900 text-center">
            Мы приручили налогового зверя. И научим его работать на вас.
          </div>
        </div>
        <div className="text-center mb-0">
          <p className="text-xl text-gray-600 mt-0 mb-0 text-center">
            Налоги могут быть не только головной болью, но и инструментом для оптимизации. Мы знаем все его повадки и слабые места.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-12 mt-8">
          {services.map((service, index) => (
            <Card
              key={index}
              className="flex flex-col justify-between items-start w-full shadow-lg border-0 bg-white transition-all duration-300 hover:shadow-xl hover:shadow-blue-400 rounded-xl overflow-hidden text-left"
            >
              <CardHeader className="flex flex-col items-start p-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white mb-4 shadow-lg">
                  <service.icon className="h-8 w-8" />
                </div>
                <CardTitle className="text-xl md:text-2xl text-left font-bold mb-3">{service.title}</CardTitle>
                <CardDescription className="text-gray-600 text-left text-base leading-relaxed">{service.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col flex-grow justify-between p-6 text-left">
                <ul className="space-y-3 mb-6 text-left">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-sm md:text-base text-gray-600 text-left">
                      <div className="h-2 w-2 rounded-full bg-blue-600 mr-3 mt-2 flex-shrink-0" />
                      <span className="leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex-grow"></div>
                <Dialog open={openIndex === index} onOpenChange={open => setOpenIndex(open ? index : null)}>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full bg-blue-600 text-white rounded-xl shadow-lg font-semibold py-4 mt-auto hover:bg-blue-700 transition-colors text-base md:text-lg text-left"
                    >
                      Подробнее
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl rounded-3xl bg-white/90 backdrop-blur-lg shadow-2xl p-8 sm:p-10 border-0 animate-fade-in flex flex-col text-left">
                    <DialogHeader>
                      <div className="flex items-start gap-4 mb-2">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
                          {service.icon && <service.icon className="h-7 w-7" />}
                        </div>
                        <DialogTitle className="text-2xl font-extrabold text-gray-900 leading-tight text-left">
                          {serviceDetails[index].title}
                        </DialogTitle>
                      </div>
                    </DialogHeader>
                    <div className="text-lg text-gray-800 leading-relaxed whitespace-pre-line mt-2 flex-1 overflow-y-auto max-h-[50vh] sm:max-h-[60vh] text-left">
                      {serviceDetails[index].text}
                    </div>
                    <Button
                      className="w-full bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-bold text-lg py-4 mt-8 shadow-xl transition-all text-left"
                      onClick={openContactForm}
                    >
                      Получить консультацию
                    </Button>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
