"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Car } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { QuizModal } from "@/components/quiz-modal"
import { useContactForm } from "@/hooks/use-contact-form"

const faqData = [
  {
    question: "Из чего складывается цена и не будет ли скрытых «опций»?",
    answer: "Стоимость зависит от «мощности» вашего бизнеса (системы налогообложения, числа операций). Мы предлагаем полную и честную «комплектацию» услуг без скрытых платежей — всё прозрачно, как на приборной панели."
  },
  {
    question: "Что будет, если вы ошибетесь и я получу штраф?",
    answer: "Если «ДТП» со штрафом произойдет по нашей вине, мы все оплатим. Считайте, что полное «КАСКО» от финансовых рисков уже включено в стоимость наших услуг и прописано в договоре."
  },
  {
    question: "У меня уже есть бухгалтер. Сложно ли будет «пересесть» к вам?",
    answer: "Мы проведем «техосмотр» ваших дел и переключим все на себя максимально плавно. Вы просто «пересаживаетесь за руль», а наша команда уже всё настроила под капотом."
  },
  {
    question: "Что конкретно входит в вашу работу за эту цену?",
    answer: "Мы ставим вашу бухгалтерию на «круиз-контроль», следя за отчетностью и налогами. Вы держите руль и выбираете курс, а мы обеспечиваем ровное движение по скоростному хайвею к достатку."
  },
  {
    question: "А что мне нужно будет делать?",
    answer: "Вы остаетесь главным водителем — вы управляете бизнесом и задаете направление. От вас потребуется только заправлять нас «топливом» (документами), чтобы мы могли двигаться вперед без остановок."
  },
  {
    question: "Вы помогаете легально платить меньше налогов?",
    answer: "Конечно. Мы не просто едем по навигатору. Наша задача — проложить самый экономичный маршрут, объезжая «пробки» и «платные дороги» закона, чтобы сэкономить ваше «топливо» (деньги)."
  },
  {
    question: "Если у меня срочный вопрос, как быстро вы ответите?",
    answer: "У вас будет «прямая связь» с вашим личным штурманом-бухгалтером через мессенджер. Мы всегда наготове, чтобы помочь вам сориентироваться на любом, даже самом сложном, участке дороги."
  },
  {
    question: "Мы будем подписывать договор?",
    answer: "Обязательно. Договор — это ваша официальная «дорожная карта» и «техпаспорт» нашего сотрудничества. В нем зафиксирован маршрут, гарантии и полная ответственность нашего «сервисного центра»."
  },
  {
    question: "Вы работали с таким бизнесом, как у меня?",
    answer: "Наш «автопарк» огромен — мы успешно обслуживали и скоростные IT-«спорткары», и мощные торговые «грузовики». Мы точно знаем, как настроить двигатель именно вашего бизнеса."
  },
  {
    question: "Насколько безопасно доверять вам свои данные?",
    answer: "Ваша коммерческая информация хранится в надежном «гараже» с тройной системой сигнализации. Конфиденциальность — это как не обсуждать маршрут с посторонними: наше главное правило безопасности."
  }
]

export function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([])
  const { openContactForm } = useContactForm()

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50" id="faq">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-full mb-4 md:mb-6">
            <Car className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-white mb-4 bg-blue-600 px-4 py-2 rounded-lg inline-block">
            Приборная Панель: Ответы на главные вопросы
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Прояснили самые важные моменты, чтобы ваше решение было уверенным
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-3 md:space-y-4">
            {faqData.map((item, index) => (
              <Card 
                key={index} 
                className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl"
              >
                <CardContent className="p-0">
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full text-left p-4 md:p-6 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                  >
                    <span className="text-base md:text-lg font-medium text-gray-900 pr-4 leading-relaxed">
                      {item.question}
                    </span>
                    <div className="flex-shrink-0">
                      {openItems.includes(index) ? (
                        <ChevronUp className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                      ) : (
                        <ChevronDown className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                      )}
                    </div>
                  </button>
                  
                  {openItems.includes(index) && (
                    <div className="px-4 md:px-6 pb-4 md:pb-6">
                      <div className="border-t border-gray-100 pt-4">
                        <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA секция */}
        <div className="mt-12 md:mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 max-w-3xl mx-auto border border-gray-100">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
              Остались вопросы?
            </h3>
            <p className="text-gray-600 mb-6 text-sm md:text-base">
              Получите персональную консультацию от наших экспертов
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
              <a 
                href="tel:+79533301777"
                className="inline-flex items-center justify-center px-6 md:px-8 py-5 md:py-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm md:text-base w-full sm:w-[320px] whitespace-nowrap"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                </svg>
                +7 953 330-17-77
              </a>
              
              <button 
                onClick={openContactForm}
                className="inline-flex items-center justify-center px-6 md:px-8 py-5 md:py-6 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-colors font-medium text-sm md:text-base w-full sm:w-[320px]"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                Получить скидку
              </button>
              
              <a 
                href="https://t.me/prostoburo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 md:px-8 py-5 md:py-6 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm md:text-base w-full sm:w-[320px]"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.13-.31-1.09-.65.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.97-1.36.08 0 .27.02.39.12.1.08.15.19.15.27-.01.06-.01.13-.02.2z"/>
                </svg>
                Написать в Telegram
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <QuizModal />
    </section>
  )
} 