"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { ArrowRight, ArrowLeft, X } from "lucide-react"

// CSS анимация для мигающей карточки скидки
const discountCardAnimation = `
  @keyframes discountGlow {
    0%, 100% {
      background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      border: 1px solid #e5e7eb;
    }
    50% {
      background: linear-gradient(135deg, #ecfeff 0%, #cffafe 100%);
      box-shadow: 0 10px 15px -3px rgba(6, 182, 212, 0.2), 0 4px 6px -2px rgba(6, 182, 212, 0.1);
      border: 1px solid #06b6d4;
    }
  }
  
  .discount-card-animate {
    animation: discountGlow 2s ease-in-out infinite;
  }
`

const questions = [
  {
    id: 1,
    title: "Какой у вас сейчас статус бизнеса?",
    type: "single" as const,
    options: [
      // { value: "planning", label: "Только собираюсь открыть бизнес", discount: 5 },
      { value: "ip", label: "ИП без сотрудников", discount: 10 },
      { value: "ooo-usn", label: "ООО на УСН", discount: 15 },
      { value: "ooo-osn", label: "ООО на ОСНО", discount: 20 },
    ],
  },
  {
    id: 2,
    title: "Как вы сейчас ведёте бухгалтерию?",
    type: "single" as const,
    options: [
      { value: "self", label: "Сам(а) через онлайн-сервисы", discount: 5 },
      { value: "staff", label: "Штатный бухгалтер", discount: 10 },
      { value: "outsource", label: "Внешняя бухгалтерия (аутсорсинг)", discount: 15 },
      { value: "chaos", label: "Пока никак — всё в хаосе", discount: 25 },
    ],
  },
  {
    id: 3,
    title: "Что вас сейчас беспокоит больше всего?",
    type: "multiple" as const,
    options: [
      { value: "fines", label: "Боюсь штрафов и проверок", discount: 10 },
      { value: "taxes", label: "Не понимаю, какие налоги платить", discount: 10 },
      { value: "time", label: "Хочу сэкономить время и нервы", discount: 10 },
    ],
  },
  {
    id: 4,
    title: "Какие услуги вам актуальны?",
    type: "multiple" as const,
    options: [
      { value: "full", label: "Полное бухгалтерское обслуживание", discount: 15 },
      { value: "registration", label: "Помощь при открытии ИП/ООО", discount: 10 },
      { value: "optimization", label: "Оптимизация налогообложения", discount: 15 },
    ],
  },
]

const bonuses = ["Бесплатная консультация", "Скидка 50% на обслуживание первый месяц"]

// Добавим функцию отправки WhatsApp
async function sendWhatsAppMessage(phone: string, message: string) {
  // Приводим номер к формату 79XXXXXXXXX
  const cleanPhone = phone.replace(/\D/g, '').replace(/^8/, '7');
  if (cleanPhone.length !== 11) return;
  await fetch('https://gate.whapi.cloud/messages/text', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer QlZ00L1DXVAv17SfAoTtarbseCNIKaIo',
    },
    body: JSON.stringify({
      to: cleanPhone,
      body: message,
    }),
  });
}

// Добавим функцию отправки PDF-файла
async function sendWhatsAppDocument(phone: string, filePath: string, caption: string) {
  // Приводим номер к формату 79XXXXXXXXX
  const cleanPhone = phone.replace(/\D/g, '').replace(/^8/, '7');
  if (cleanPhone.length !== 11) return;
  
  await fetch('/api/send-whatsapp-document', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      phone: cleanPhone,
      filePath: filePath,
      caption: caption,
    }),
  });
}

function QuizSidebar({
  canProceed,
  handleNext,
  isPhoneStep,
  currentQuestion,
  calculateDiscount,
  getBonusCount,
  bonuses,
  handleSubmit,
  phone,
  isSubmitting
}: {
  canProceed: boolean,
  handleNext: () => void,
  isPhoneStep: boolean,
  currentQuestion: any,
  calculateDiscount: () => number,
  getBonusCount: () => number,
  bonuses: string[],
  handleSubmit: () => void,
  phone: string,
  isSubmitting: boolean
}) {
  return (
    <div className="w-80 bg-gray-50 px-6 py-6 border-l border-gray-100 flex flex-col justify-between items-center">
      <style dangerouslySetInnerHTML={{ __html: discountCardAnimation }} />
      <div className="w-full flex flex-col items-center">
        <div className={`rounded-2xl flex flex-col items-center mb-3 min-h-[80px] max-h-[100px] p-2 w-full ${calculateDiscount() > 0 ? 'discount-card-animate' : 'bg-white shadow-md'}`}>
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-100 mb-1">
            <span className="text-xl text-cyan-500">₽</span>
          </div>
          <div className="text-xs text-gray-500 mb-0.5 leading-tight">Ваша скидка</div>
          <div className="text-lg font-bold text-cyan-500 mb-0.5 leading-tight break-words max-w-[90%] text-center">{calculateDiscount().toLocaleString()} ₽</div>
          <div className="text-[10px] text-gray-400 leading-tight text-center break-words max-w-[90%] whitespace-pre-line">на дополнительные услуги</div>
        </div>
        <div className="bg-white rounded-2xl shadow-md flex flex-col items-center p-3 w-full">
          <div className="text-sm font-bold mb-1 text-gray-900">Бонусы в подарок:</div>
          <div className="flex gap-1 mt-1 justify-center items-center w-full">
            {bonuses.map((bonus, idx) => (
              <div
                key={bonus}
                className="flex flex-col items-center bg-green-200 rounded-xl shadow min-w-[100px] max-w-[100px] min-h-[100px] max-h-[100px] justify-center p-1"
                style={{ flex: '0 0 100px' }}
              >
                <span
                  className={`w-8 h-8 flex items-center justify-center rounded-full text-white text-xl mb-1 ${idx === 0 ? 'bg-orange-500' : 'bg-cyan-500'}`}
                >
                  {idx === 0 ? '🎁' : '💡'}
                </span>
                <span className="text-xs text-gray-900 text-center font-bold leading-tight">
                  {bonus}
                </span>
              </div>
            ))}
          </div>
        </div>
        {isPhoneStep ? (
          <Button
            onClick={handleSubmit}
            disabled={!phone.trim() || isSubmitting}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white w-full mt-4 py-4 rounded-xl font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 border-2 border-orange-400 hover:border-orange-300"
            style={{
              boxShadow: '0 10px 25px rgba(249, 115, 22, 0.4), 0 4px 10px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            }}
          >
            {isSubmitting ? "Отправляем..." : "🎁 Получить предложение"}
          </Button>
        ) : null}
      </div>
      {(!isPhoneStep && currentQuestion?.type === "multiple") ? (
        <Button
          onClick={handleNext}
          disabled={!canProceed}
          className="bg-cyan-500 hover:bg-cyan-600 text-white w-full mt-4 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
        >
          Далее
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      ) : null}
    </div>
  )
}

export function QuizModalTariff({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<any[]>([])
  const [phone, setPhone] = useState("")
  const [wantChecklist, setWantChecklist] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showThanks, setShowThanks] = useState(false)
  const [coupon, setCoupon] = useState<string | null>(null)

  const totalSteps = questions.length + 1
  const progress = ((currentStep + 1) / totalSteps) * 100

  const calculateDiscount = () => {
    const completedSteps = answers.length
    const discountPerStep = 2500
    const maxDiscount = 10000
    return Math.min(completedSteps * discountPerStep, maxDiscount)
  }

  const getBonusCount = () => {
    const completedSteps = answers.length
    if (completedSteps >= 4) return 2
    if (completedSteps >= 2) return 1
    return 0
  }

  const handleAnswer = (questionId: number, answer: string | string[]) => {
    setAnswers((prev) => {
      const existing = prev.find((a) => a.questionId === questionId)
      if (existing) {
        return prev.map((a) => (a.questionId === questionId ? { ...a, answer } : a))
      }
      return [...prev, { questionId, answer }]
    })
  }

  const handleNext = () => {
    if (currentStep < questions.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    if (!phone.trim()) return
    setIsSubmitting(true)
    try {
      const discount = calculateDiscount()
      const code = `PROSTOBURO-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
      const fullCoupon = `${code}-${discount}`
      
      // Сохраняем купон в базу данных
      const response = await fetch('/api/coupons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: fullCoupon,
          phone: phone.trim(),
          discount: discount
        })
      })
      
      if (!response.ok) {
        throw new Error('Ошибка при сохранении купона')
      }
      
      const result = await response.json()
      console.log('Купон сохранен:', result)

      // Отправляем WhatsApp-сообщение клиенту
      await sendWhatsAppMessage(phone, `Спасибо за прохождение квиза! Ваш купон: ${fullCoupon}. Мы свяжемся с вами скоро.`)
      
      // Отправляем PDF-файл с чек-листом
      await sendWhatsAppDocument(phone, 'CHEK_LIST/Kak-izbezhat-blokirovki-scheta.pdf', 'Ваш подарок: Чек-лист "Как избежать блокировки счета"')
      
      setCoupon(fullCoupon)
      setShowThanks(true)
      setCurrentStep(0)
      setAnswers([])
      setPhone("")
      setWantChecklist(true)
      onOpenChange(false)
      
      toast({
        title: "Успешно!",
        description: "Ваш купон сохранен. Мы свяжемся с вами в ближайшее время.",
      })
    } catch (error) {
      console.error('Ошибка при отправке:', error)
      toast({
        title: "Ошибка отправки",
        description: "Попробуйте еще раз или свяжитесь с нами по телефону.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentQuestion = questions[currentStep]
  const currentAnswer = answers.find((a) => a.questionId === currentQuestion?.id)
  const canProceed =
    currentAnswer && (Array.isArray(currentAnswer.answer) ? currentAnswer.answer.length > 0 : currentAnswer.answer)
  const isPhoneStep = currentStep >= questions.length

  useEffect(() => {
    if (!isPhoneStep && currentQuestion?.type === "single" && canProceed) {
      const timer = setTimeout(() => {
        handleNext()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [canProceed, currentQuestion?.type, isPhoneStep])

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl h-[90vh] max-h-[800px] p-0 overflow-hidden bg-white border-0 shadow-2xl">
          <div className="h-full flex flex-col">
            <div className="bg-white px-12 py-8 text-center border-b border-gray-100">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Пройдите короткий опрос и получите подарок и бонусы
              </h1>
              <p className="text-gray-500">Всего 4 вопроса — 2 минуты вашего времени</p>
            </div>
            <div className="flex flex-1 overflow-hidden">
              <div className="flex-1 px-12 py-8 flex flex-col bg-white">
                <div className="mb-12">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-400">
                      Шаг {currentStep + 1} из {totalSteps}
                    </span>
                    <span className="text-sm font-medium text-cyan-500">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1">
                    <div
                      className="bg-cyan-400 h-1 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                {!isPhoneStep ? (
                  <>
                    <div className="flex flex-col px-0 py-0 overflow-y-auto max-h-[60vh]">
                      <h2 className="text-xl font-bold mb-2 mt-2 text-gray-900 leading-tight">{currentQuestion.title}</h2>
                      {currentQuestion.type === "single" ? (
                        <div className="space-y-1">
                          {currentQuestion.options.map((option) => (
                            <label key={option.value} className="flex items-center">
                              <input
                                type="radio"
                                name={`question-${currentQuestion.id}`}
                                value={option.value}
                                checked={!Array.isArray(currentAnswer?.answer) && currentAnswer?.answer === option.value}
                                onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                                className="mr-2 border-2 border-gray-300 rounded-full text-cyan-500 focus:ring-cyan-500"
                              />
                              <span className="text-xs cursor-pointer text-gray-700 flex-1 font-normal">{option.label}</span>
                            </label>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {currentQuestion.options.map((option) => (
                            <label key={option.value} className="flex items-center">
                              <input
                                type="checkbox"
                                value={option.value}
                                checked={!!(Array.isArray(currentAnswer?.answer) && currentAnswer.answer.includes(option.value))}
                                onChange={(e) => {
                                  const currentAnswers = Array.isArray(currentAnswer?.answer)
                                    ? currentAnswer.answer
                                    : [];
                                  if (e.target.checked) {
                                    handleAnswer(currentQuestion.id, [...currentAnswers, option.value]);
                                  } else {
                                    handleAnswer(
                                      currentQuestion.id,
                                      currentAnswers.filter((a: string) => a !== option.value)
                                    );
                                  }
                                }}
                                className="mr-2 border-2 border-gray-300 rounded-full text-cyan-500 focus:ring-cyan-500"
                              />
                              <span className="text-xs cursor-pointer text-gray-700 flex-1 font-normal">{option.label}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between items-center mt-6 pt-4">
                      <Button
                        variant="ghost"
                        onClick={handleBack}
                        disabled={currentStep === 0}
                        className="flex items-center text-gray-500 hover:text-gray-700 px-6 py-3 rounded-xl"
                      >
                        <ArrowLeft className="mr-2 h-5 w-5" />
                        Назад
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col h-[600px] min-h-0">
                    <div className="flex-1 min-h-0 overflow-y-auto px-0 pt-2 pb-0 text-center max-w-lg mx-auto w-full flex flex-col items-stretch justify-start">
                      <h2 className="text-2xl font-bold mb-2 text-gray-900">Последний шаг!</h2>
                      <p className="text-base text-gray-600 mb-4 leading-relaxed">
                        Оставьте номер телефона и мы отправим персональное предложение со скидкой {" "}
                        <span className="font-bold text-cyan-500">{calculateDiscount().toLocaleString()} ₽</span> в WhatsApp
                      </p>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+7 (___) ___-__-__"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="text-center text-base py-3 border-2 border-gray-200 focus:border-cyan-400 rounded-2xl shadow-sm"
                      />
                      <div className="mb-4">
                        <Checkbox
                          id="checklist"
                          checked={!!wantChecklist}
                          onCheckedChange={(checked) => setWantChecklist(!!checked)}
                          className="mt-1 text-green-600 border-2 border-green-300 w-5 h-5"
                        />
                        <Label htmlFor="checklist" className="cursor-pointer leading-relaxed text-gray-700">
                          <span className="text-lg mr-3">🎁</span>
                          <span className="font-bold text-green-700">Ваш подарок:</span> Чек-лист «7 ошибок, из-за которых бизнес получает штрафы».
                        </Label>
                      </div>
                    </div>
                    <div className="shrink-0 bg-white pt-2 pb-2">
                      <div className="bg-gray-50 rounded-2xl p-4 text-center mt-2">
                        <p className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                          ЗВОНИТЬ НЕ БУДЕМ! ОТПРАВИМ ПРЕДЛОЖЕНИЕ В WHATSAPP
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <QuizSidebar
                canProceed={canProceed}
                handleNext={handleNext}
                isPhoneStep={isPhoneStep}
                currentQuestion={currentQuestion}
                calculateDiscount={calculateDiscount}
                getBonusCount={getBonusCount}
                bonuses={bonuses}
                handleSubmit={handleSubmit}
                phone={phone}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={showThanks} onOpenChange={setShowThanks}>
        <DialogContent className="max-w-md p-8 text-center flex flex-col items-center justify-center">
          <button onClick={() => setShowThanks(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"><X className="w-6 h-6" /></button>
          <h2 className="text-2xl font-bold mb-4 text-green-700">Спасибо за уделенное время!</h2>
          <p className="text-base text-gray-700 mb-4">Мы отправим Вам в WhatsApp наше предложение и бонусы!<br/>Хорошего дня!</p>
          {coupon && (
            <div className="bg-gray-100 rounded-xl p-4 mb-4 w-full">
              <div className="text-sm text-gray-500 mb-1">Ваш купон на скидку:</div>
              <div className="text-lg font-mono font-bold text-purple-700 mb-1 select-all">{coupon}</div>
              <Button size="sm" variant="outline" onClick={() => {navigator.clipboard.writeText(coupon)}}>Скопировать</Button>
            </div>
          )}
          <Button onClick={() => setShowThanks(false)} className="mt-2 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-xl">Закрыть</Button>
        </DialogContent>
      </Dialog>
    </>
  )
} 