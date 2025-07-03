"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useContactForm } from "@/hooks/use-contact-form"
import { useToast } from "@/hooks/use-toast"
import { ArrowRight, ArrowLeft, Gift, Phone, X } from "lucide-react"

interface QuizAnswer {
  questionId: number
  answer: string | string[]
}

const questions = [
  {
    id: 1,
    title: "Какой у вас сейчас статус бизнеса?",
    type: "single" as const,
    options: [
      { value: "planning", label: "Только собираюсь открыть бизнес", discount: 5 },
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

function QuizSidebar({
  canProceed,
  handleNext,
  isPhoneStep,
  currentQuestion,
  calculateDiscount,
  getBonusCount,
  bonuses
}: {
  canProceed: boolean,
  handleNext: () => void,
  isPhoneStep: boolean,
  currentQuestion: any,
  calculateDiscount: () => number,
  getBonusCount: () => number,
  bonuses: string[]
}) {
  return (
    <div className="w-80 bg-gray-50 px-8 py-8 border-l border-gray-100 flex flex-col justify-between">
      <div>
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white text-xl font-bold">₽</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Ваша скидка</h3>
          <div className="text-2xl font-bold text-cyan-500 mb-2">{calculateDiscount().toLocaleString()} ₽</div>
          <p className="text-xs text-gray-500">на первый месяц обслуживания</p>
        </div>
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center mr-3">
              <Gift className="h-3 w-3 text-white" />
            </div>
            <h4 className="font-bold text-gray-900">Бонусы в подарок:</h4>
          </div>
          <ul className="space-y-3">
            {bonuses.slice(0, getBonusCount()).map((bonus, index) => (
              <li key={index} className="flex items-start text-sm text-gray-700">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                <span className="font-medium">{bonus}</span>
              </li>
            ))}
            {bonuses.slice(getBonusCount()).map((bonus, index) => (
              <li key={index + getBonusCount()} className="flex items-start text-sm text-gray-400">
                <div className="w-2 h-2 bg-gray-300 rounded-full mt-2 mr-3 flex-shrink-0" />
                <span>{bonus}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-2 font-medium">Ваша экономия:</p>
          <div className="text-2xl font-bold text-green-500">{calculateDiscount().toLocaleString()} ₽</div>
        </div>
      </div>
      {/* Кнопка Далее справа для multiple choice */}
      {!isPhoneStep && currentQuestion?.type === "multiple" && (
        <Button
          onClick={handleNext}
          disabled={!canProceed}
          className="bg-cyan-500 hover:bg-cyan-600 text-white w-full mt-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
        >
          Далее
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      )}
    </div>
  )
}

export function QuizModal() {
  const { isOpen, closeContactForm } = useContactForm()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswer[]>([])
  const [phone, setPhone] = useState("")
  const [wantChecklist, setWantChecklist] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showThanks, setShowThanks] = useState(false)
  const [coupon, setCoupon] = useState<string | null>(null)

  const totalSteps = questions.length + 1 // +1 for phone step
  const progress = ((currentStep + 1) / totalSteps) * 100

  const calculateDiscount = () => {
    // Каждый завершенный шаг дает 2500 рублей скидки
    const completedSteps = answers.length
    const discountPerStep = 2500
    const maxDiscount = 10000

    return Math.min(completedSteps * discountPerStep, maxDiscount)
  }

  const getBonusCount = () => {
    const completedSteps = answers.length

    // Первый бонус появляется после 2-го ответа
    // Второй бонус появляется после 4-го ответа
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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      // Генерируем купон
      const discount = calculateDiscount()
      const code = `DISCOUNT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
      setCoupon(`${code}-${discount}`)
      setShowThanks(true)
      // Reset form
      setCurrentStep(0)
      setAnswers([])
      setPhone("")
      setWantChecklist(true)
      closeContactForm()
    } catch (error) {
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

  // Auto-advance for single choice questions
  useEffect(() => {
    if (!isPhoneStep && currentQuestion?.type === "single" && canProceed) {
      const timer = setTimeout(() => {
        handleNext()
      }, 500) // Small delay for better UX
      return () => clearTimeout(timer)
    }
  }, [canProceed, currentQuestion?.type, isPhoneStep])

  return (
    <>
      <Dialog open={isOpen} onOpenChange={closeContactForm}>
        <DialogContent className="max-w-4xl h-[90vh] max-h-[800px] p-0 overflow-hidden bg-white border-0 shadow-2xl">
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="bg-white px-12 py-8 text-center border-b border-gray-100">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Пройдите короткий опрос и получите подарок и бонусы
              </h1>
              <p className="text-gray-500">Всего 4 вопроса — 2 минуты вашего времени</p>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Left side - Questions */}
              <div className="flex-1 px-12 py-8 flex flex-col bg-white">
                {/* Progress */}
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

                {/* Question or Phone Step */}
                {!isPhoneStep ? (
                  <>
                    <div className="flex flex-col px-0 py-0 overflow-y-auto max-h-[60vh]">
                      <h2 className="text-xl font-bold mb-2 mt-2 text-gray-900 leading-tight">{currentQuestion.title}</h2>

                      {currentQuestion.type === "single" ? (
                        <RadioGroup
                          value={Array.isArray(currentAnswer?.answer) ? "" : currentAnswer?.answer || ""}
                          onValueChange={(value) => handleAnswer(currentQuestion.id, value)}
                          className="space-y-1"
                        >
                          {currentQuestion.options.map((option) => (
                            <div
                              key={option.value}
                              className="group relative bg-white border border-gray-200 rounded-lg p-2 hover:border-cyan-300 hover:shadow-lg transition-all duration-200 cursor-pointer"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value={option.value}
                                  id={option.value}
                                  className="text-cyan-500 border-2 border-gray-300 w-3.5 h-3.5"
                                />
                                <Label
                                  htmlFor={option.value}
                                  className="text-xs cursor-pointer text-gray-700 flex-1 font-normal"
                                >
                                  {option.label}
                                </Label>
                              </div>
                            </div>
                          ))}
                        </RadioGroup>
                      ) : (
                        <div className="space-y-1">
                          {currentQuestion.options.map((option) => (
                            <div
                              key={option.value}
                              className="group relative bg-white border border-gray-200 rounded-lg p-2 hover:border-cyan-300 hover:shadow-lg transition-all duration-200 cursor-pointer"
                            >
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={option.value}
                                  checked={
                                    Array.isArray(currentAnswer?.answer) && currentAnswer.answer.includes(option.value)
                                  }
                                  onCheckedChange={(checked) => {
                                    const currentAnswers = Array.isArray(currentAnswer?.answer)
                                      ? currentAnswer.answer
                                      : []
                                    if (checked) {
                                      handleAnswer(currentQuestion.id, [...currentAnswers, option.value])
                                    } else {
                                      handleAnswer(
                                        currentQuestion.id,
                                        currentAnswers.filter((a) => a !== option.value),
                                      )
                                    }
                                  }}
                                  className="text-cyan-500 border-2 border-gray-300 w-3.5 h-3.5 rounded"
                                />
                                <Label
                                  htmlFor={option.value}
                                  className="text-xs cursor-pointer text-gray-700 flex-1 font-normal"
                                >
                                  {option.label}
                                </Label>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {/* Navigation */}
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
                      {/* Show 'Next' button only for multiple choice questions */}
                      {currentQuestion?.type === "multiple" && (
                        <Button
                          onClick={handleNext}
                          disabled={!canProceed}
                          className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
                        >
                          Далее
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex-1 overflow-y-auto flex flex-col justify-between text-center max-w-lg mx-auto w-full px-0 py-0">
                    <div>
                      <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900">Последний шаг!</h2>
                        <p className="text-base text-gray-600 mb-8 leading-relaxed">
                          Оставьте номер телефона и мы отправим персональное предложение со скидкой {" "}
                          <span className="font-bold text-cyan-500">{calculateDiscount().toLocaleString()} ₽</span> в WhatsApp
                        </p>
                      </div>
                      <div className="space-y-6">
                        <div>
                          <Label htmlFor="phone" className="text-left block mb-3 text-base font-medium text-gray-700">
                            Номер телефона
                          </Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+7 (___) ___-__-__"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="text-center text-base py-3 border-2 border-gray-200 focus:border-cyan-400 rounded-2xl shadow-sm"
                          />
                        </div>
                        {/* Checklist checkbox */}
                        <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                          <div className="flex items-start space-x-4">
                            <Checkbox
                              id="checklist"
                              checked={wantChecklist}
                              onCheckedChange={(checked) => setWantChecklist(Boolean(checked))}
                              className="mt-1 text-green-600 border-2 border-green-300 w-5 h-5"
                            />
                            <Label htmlFor="checklist" className="cursor-pointer leading-relaxed text-gray-700">
                              <span className="text-lg mr-3">🎁</span>
                              <span className="font-bold text-green-700">Ваш подарок:</span> Чек-лист «7 ошибок, из-за которых бизнес получает штрафы».
                            </Label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="bg-gray-50 rounded-2xl p-4 text-center mt-2">
                        <p className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                          ЗВОНИТЬ НЕ БУДЕМ! ОТПРАВИМ ПРЕДЛОЖЕНИЕ В WHATSAPP
                        </p>
                      </div>
                      <div className="flex justify-center items-center mt-2 pt-2">
                        <Button
                          onClick={handleSubmit}
                          disabled={!phone.trim() || isSubmitting}
                          className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
                        >
                          {isSubmitting ? "Отправляем..." : "Получить предложение"}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right side - Discount & Bonuses */}
              <QuizSidebar
                canProceed={canProceed}
                handleNext={handleNext}
                isPhoneStep={isPhoneStep}
                currentQuestion={currentQuestion}
                calculateDiscount={calculateDiscount}
                getBonusCount={getBonusCount}
                bonuses={bonuses}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* Модалка благодарности */}
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
