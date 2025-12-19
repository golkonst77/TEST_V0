"use client"

// ✅ WhatsApp отправка включена обратно
// Дата включения: 2025-09-04

import { useRef, useState, useEffect } from "react"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { useContactForm } from "@/hooks/use-contact-form"
import { ArrowRight, ArrowLeft, X } from "lucide-react"
import { sendYandexMetric, YANDEX_METRICS_EVENTS } from "@/utils/yandex-metrics"
import { QuizFinalStep, type QuizFinalStepHandle } from "@/components/quiz/QuizFinalStep"

// CSS анимация для мигающей карточки скидки
const discountCardAnimation = `
  @keyframes discountGlow {
    0%, 100% {
      background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      border: 1px solid #e5e7eb;
    }

  useEffect(() => {
    if (!showThanks) return
    const t = window.setTimeout(() => {
      window.location.href = '/'
    }, 3000)
    return () => window.clearTimeout(t)
  }, [showThanks])
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

const bonuses = ["Бесплатная консультация", "Дополнительные услуги"]

function QuizSidebar({
  canProceed,
  handleNext,
  handleSubmit,
  isPhoneStep,
  currentQuestion,
  calculateDiscount,
  getBonusCount,
  bonuses,
  canSubmit,
  isSubmitting,
}: {
  canProceed: boolean,
  handleNext: () => void,
  handleSubmit: () => void,
  isPhoneStep: boolean,
  currentQuestion: any,
  calculateDiscount: () => number,
  getBonusCount: () => number,
  bonuses: string[],
  canSubmit: boolean,
  isSubmitting: boolean
}) {
  return (
         <div className="w-80 bg-amber-100 px-6 py-6 border-l border-amber-200 flex flex-col justify-between items-center">
      <style dangerouslySetInnerHTML={{ __html: discountCardAnimation }} />
      <div className="w-full flex flex-col items-center">
        <div className={`rounded-2xl flex flex-col items-center mb-3 min-h-[80px] max-h-[100px] p-2 w-full ${calculateDiscount() > 0 ? 'discount-card-animate' : 'bg-white shadow-md'}`}>
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-100 mb-1">
            <span className="text-xl text-cyan-500">₽</span>
          </div>
          <div className="text-xs text-gray-500 mb-0.5 leading-tight">Ваша скидка</div>
          <div className="text-lg font-bold text-cyan-500 mb-0.5 leading-tight break-words max-w-[90%] text-center">{calculateDiscount().toLocaleString()} ₽</div>
          <div className="text-[10px] text-gray-400 leading-tight text-center break-words max-w-[90%] whitespace-pre-line">на первый месяц\nобслуживания</div>
        </div>
        <div className="bg-white rounded-2xl shadow-md flex flex-col items-center p-3 w-full">
          <div className="text-sm font-bold mb-1 text-gray-900">Бонусы в подарок:</div>
          <div className="flex gap-1 mt-1 justify-center items-center w-full">
            {bonuses.map((bonus, idx) => (
                             <div
                 key={bonus}
                 className="flex flex-col items-center bg-green-200 rounded-xl shadow min-w-[120px] max-w-[120px] min-h-[100px] max-h-[100px] justify-center p-1"
                 style={{ flex: '0 0 120px' }}
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
            disabled={!canSubmit || isSubmitting}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white w-full mt-4 rounded-xl font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 border-2 border-orange-400 hover:border-orange-300 whitespace-normal leading-tight text-center min-h-[96px] py-6"
            style={{
              boxShadow:
                '0 10px 25px rgba(249, 115, 22, 0.4), 0 4px 10px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            }}
          >
            {isSubmitting ? "Отправляем..." : "ПОЛУЧИТЬ ПОДАРОК И КУПОН"}
          </Button>
        ) : null}
      </div>
      {/* Кнопка Далее справа для multiple choice */}
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

// Определяем тип бизнеса на основе ответов
const getBusinessType = (answers: QuizAnswer[]): "ip" | "ooo" | "both" => {
  // Ищем ответ на вопрос о типе бизнеса
  const businessTypeAnswer = answers.find(a => a.questionId === 1)?.answer
  
  if (!businessTypeAnswer) return "both"
  
  if (Array.isArray(businessTypeAnswer)) {
    return businessTypeAnswer.includes("ip") && businessTypeAnswer.includes("ooo") 
      ? "both" 
      : businessTypeAnswer.includes("ip") 
        ? "ip" 
        : "ooo"
  }
  
  return businessTypeAnswer === "ip" ? "ip" : "ooo"
}

export function QuizModal({ open, onOpenChange }: { open?: boolean, onOpenChange?: (open: boolean) => void } = {}) {
  const { isOpen, closeContactForm } = useContactForm()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswer[]>([])
  const finalStepRef = useRef<QuizFinalStepHandle | null>(null)
  const [canFinalSubmit, setCanFinalSubmit] = useState(false)
  const [isFinalSubmitting, setIsFinalSubmitting] = useState(false)
  const [showThanks, setShowThanks] = useState(false)

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

  const quizData = {
    answers,
    discount: calculateDiscount(),
    businessType: getBusinessType(answers),
  }

  const currentQuestion = questions[currentStep]
  const currentAnswer = answers.find((a) => a.questionId === currentQuestion?.id)
  const canProceed = Boolean(
    currentAnswer && (Array.isArray(currentAnswer.answer) ? currentAnswer.answer.length > 0 : currentAnswer.answer)
  ) || false

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

  const handleOptionCheckedChange = (questionId: number, optionValue: string, checked: CheckboxPrimitive.CheckedState) => {
    const currentAnswers = Array.isArray(answers.find(a => a.questionId === questionId)?.answer)
      ? answers.find(a => a.questionId === questionId)?.answer as string[]
      : [];

    if (checked === true) {
      handleAnswer(questionId, [...currentAnswers, optionValue]);
    } else {
      handleAnswer(
        questionId,
        currentAnswers.filter((a) => a !== optionValue)
      );
    }
  }

  return (
    <>
      <Dialog open={!!(open !== undefined ? open : isOpen)} onOpenChange={onOpenChange || closeContactForm}>
        <DialogTitle className="sr-only">Квиз для получения скидки</DialogTitle>
        <DialogDescription className="sr-only">Пройдите квиз, чтобы получить персональную скидку на бухгалтерские услуги</DialogDescription>
        <DialogContent className="max-w-4xl h-[90vh] max-h-[800px] p-0 overflow-hidden border-0 shadow-2xl" style={{
           backgroundImage: 'url("/quiz-background.jpg")',
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundRepeat: 'no-repeat'
         }}>
                     <div className="h-full flex flex-col relative">
             {/* Полупрозрачный overlay для читаемости */}
             <div className="absolute inset-0 bg-white/90 backdrop-blur-sm"></div>
             <div className="relative z-10 h-full flex flex-col">
            {/* Header */}
            <div className="bg-white px-12 py-8 text-center border-b border-gray-100">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Пройдите короткий опрос и получите подарок и бонусы
              </h1>
              <p className="text-gray-500">Всего 4 вопроса — 2 минуты вашего времени</p>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Left side - Questions */}
                             <div className="flex-1 px-12 py-8 flex flex-col bg-amber-50">
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
                      <h2 className="text-2xl font-bold mb-6 mt-2 text-gray-900 leading-tight">{currentQuestion.title}</h2>

                      {currentQuestion.type === "single" ? (
                        <div className="space-y-4">
                          {currentQuestion.options.map((option) => (
                            <div
                              key={option.value}
                              className="group relative bg-cyan-50 border border-gray-200 rounded-lg p-6 hover:border-cyan-300 hover:shadow-lg transition-all duration-200 cursor-pointer"
                            >
                              <div className="flex items-center space-x-4">
                                <input
                                  type="radio"
                                  id={option.value}
                                  name={`question-${currentQuestion.id}`}
                                  value={option.value}
                                  checked={!Array.isArray(currentAnswer?.answer) && currentAnswer?.answer === option.value}
                                  onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                                  className="text-cyan-500 border-2 border-gray-300 w-5 h-5"
                                />
                                                                 <Label
                                   htmlFor={option.value}
                                   className="text-lg cursor-pointer text-gray-700 flex-1 font-normal"
                                 >
                                   {option.label}
                                 </Label>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {currentQuestion.options.map((option) => (
                            <div
                              key={option.value}
                              className="group relative bg-cyan-50 border border-gray-200 rounded-lg p-6 hover:border-cyan-300 hover:shadow-lg transition-all duration-200 cursor-pointer"
                            >
                              <div className="flex items-center space-x-4">
                                <Checkbox
                                  id={option.value}
                                  checked={!!(Array.isArray(currentAnswer?.answer) && currentAnswer.answer.includes(option.value))}
                                  onCheckedChange={(checked) => handleOptionCheckedChange(currentQuestion.id, option.value, checked)}
                                  className="text-cyan-500 border-2 border-gray-300 w-5 h-5 rounded"
                                />
                                                                 <Label
                                   htmlFor={option.value}
                                   className="text-lg cursor-pointer text-gray-700 flex-1 font-normal"
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
                    </div>
                  </>
                ) : (
                  <QuizFinalStep
                    ref={finalStepRef}
                    site="main"
                    quizData={quizData}
                    uiTexts={{
                      subtitle: `Оставьте email, и мы отправим персональное коммерческое предложение со скидкой ${calculateDiscount().toLocaleString()} ₽`,
                    }}
                    defaultGiftPdfFilename="Kak_vibrat_buh_kompany.pdf"
                    onStateChange={({ canSubmit, isSubmitting }) => {
                      setCanFinalSubmit(canSubmit)
                      setIsFinalSubmitting(isSubmitting)
                    }}
                    onSuccess={({ email, phone, quizData }) => {
                      try {
                        sendYandexMetric(YANDEX_METRICS_EVENTS.QUIZ_COMPLETED, {
                          discount: quizData?.discount,
                          business_type: quizData?.businessType,
                          email,
                          phone,
                        })
                      } catch (error) {
                        console.error('Ошибка отправки в Яндекс.Метрику:', error)
                      }

                      setShowThanks(true)

                      // Reset form + закрываем квиз
                      setCurrentStep(0)
                      setAnswers([])
                      setCanFinalSubmit(false)
                      setIsFinalSubmitting(false)
                      closeContactForm()
                    }}
                  />
                )}
              </div>

              {/* Right side - Discount & Bonuses */}
              <QuizSidebar
                canProceed={canProceed}
                handleNext={handleNext}
                handleSubmit={() => finalStepRef.current?.submit()}
                isPhoneStep={isPhoneStep}
                currentQuestion={currentQuestion}
                calculateDiscount={calculateDiscount}
                getBonusCount={getBonusCount}
                bonuses={bonuses}
                canSubmit={canFinalSubmit && !showThanks}
                isSubmitting={isFinalSubmitting || showThanks}
              />
            </div>
          </div>
        </div>
        </DialogContent>
      </Dialog>

      {/* Модалка благодарности */}
      <Dialog open={showThanks} onOpenChange={setShowThanks}>
        <DialogTitle className="sr-only">Благодарность за прохождение квиза</DialogTitle>
        <DialogDescription className="sr-only">Коммерческое предложение и подарок отправлены</DialogDescription>
        <DialogContent className="max-w-md p-8 text-center flex flex-col items-center justify-center">
          <button
            onClick={() => setShowThanks(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold mb-4 text-green-700">Спасибо за уделенное время!</h2>
          <p className="text-base text-gray-700 mb-4">
            Коммерческое предложение и подарок отправлены на ваш email, проверьте почту
          </p>
          <Button onClick={() => setShowThanks(false)} className="mt-2 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-xl">
            Закрыть
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
