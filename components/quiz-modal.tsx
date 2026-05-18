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

interface QuizAnswer {
  questionId: number
  answer: string | string[] | Record<string, string>
}

type SidebarContext = {
  title: string
  shortSummary: string
  points: [string, string, string]
  recommendation: string
  trustLine: string
}

const questions = [
  {
    id: 1,
    title: "Расскажите о вашем бизнесе",
    subtitle: "Это поможет подобрать подходящий формат бухгалтерского сопровождения",
    type: "business" as const,
  },
  {
    id: 2,
    title: "Что сейчас вызывает сложности?",
    type: "multiple" as const,
    options: [
      { value: "self-accounting", label: "Ведём бухгалтерию самостоятельно" },
      { value: "irregular-accounting", label: "Бухгалтерия ведётся нерегулярно" },
      { value: "reporting-confidence", label: "Нет уверенности, что отчётность сдана правильно" },
      { value: "fns-requests", label: "Приходят требования или вопросы от ФНС" },
      { value: "unstable-accountant", label: "Бухгалтер долго отвечает или пропадает" },
      { value: "docs-order", label: "Нужен порядок в документах" },
      { value: "business-launch", label: "Открываем бизнес и хотим сразу сделать правильно" },
      { value: "handover", label: "Хотим перейти от другого бухгалтера без хаоса" },
      { value: "responsibility", label: "Нужна понятная стоимость и зона ответственности" },
    ],
  },
]

function getQuizSidebarContext(answers: QuizAnswer[]): SidebarContext {
  const base: SidebarContext = {
    title: "Что вы получите",
    shortSummary: "Коротко разберем вашу ситуацию и предложим подходящий формат работы.",
    points: [
      "Предварительные рекомендации",
      "Подходящий формат сопровождения",
      "Консультацию специалиста",
    ],
    recommendation: "Ответим на вопросы по учёту и налогам с учетом вашей текущей ситуации.",
    trustLine: "Для новых клиентов доступны специальные условия на первый месяц сопровождения.",
  }

  const business = answers.find((a) => a.questionId === 1)?.answer
  const complexity = answers.find((a) => a.questionId === 2)?.answer

  const companyType =
    business && typeof business === "object" && !Array.isArray(business)
      ? String(business.companyType || "")
      : ""
  const taxSystem =
    business && typeof business === "object" && !Array.isArray(business)
      ? String(business.taxSystem || "")
      : ""
  const employees =
    business && typeof business === "object" && !Array.isArray(business)
      ? String(business.employees || "")
      : ""

  const selectedComplexities = Array.isArray(complexity) ? complexity : []

  const hasFns = selectedComplexities.includes("fns-requests")
  const hasHandover =
    selectedComplexities.includes("unstable-accountant") || selectedComplexities.includes("handover")
  const hasIrregular =
    selectedComplexities.includes("reporting-confidence") || selectedComplexities.includes("irregular-accounting")
  const hasOooOsno = companyType === "ooo" || taxSystem === "osn"
  const hasEmployees =
    employees === "has" || employees === "plan" || employees === "many"
  const isStartup = companyType === "new"

  if (hasFns) {
    return {
      title: "Если есть вопросы от ФНС",
      shortSummary: "Важно спокойно разобраться в причине требования и подготовить корректный ответ.",
      points: [
        "Посмотрим суть требования",
        "Подскажем, какие документы нужны",
        "Поможем снизить риск ошибок в ответе",
      ],
      recommendation: "Лучше не отвечать формально: сначала нужно понять, что именно хочет налоговая.",
      trustLine: base.trustLine,
    }
  }

  if (hasHandover) {
    return {
      title: "Переход без хаоса",
      shortSummary: "Поможем аккуратно принять дела и понять, что происходит с учётом.",
      points: [
        "Проверим, что уже сдано",
        "Составим список недостающих документов",
        "Предложим понятный формат перехода",
      ],
      recommendation: "При смене бухгалтера важно не просто передать документы, а проверить состояние учёта.",
      trustLine: base.trustLine,
    }
  }

  if (hasIrregular) {
    return {
      title: "Если нет уверенности в учёте",
      shortSummary: "Сначала важно понять текущее состояние отчётности и документов.",
      points: [
        "Проверим основные риски",
        "Подскажем, с чего начать",
        "Предложим формат наведения порядка",
      ],
      recommendation: "Обычно в такой ситуации полезно начать с короткого разбора текущего учёта.",
      trustLine: base.trustLine,
    }
  }

  if (hasOooOsno) {
    return {
      title: "Для ООО и ОСНО",
      shortSummary: "Здесь особенно важны регулярность, документы и контроль сроков.",
      points: [
        "Проверим текущую ситуацию",
        "Подскажем подходящий формат сопровождения",
        "Обсудим отчётность, НДС и документы",
      ],
      recommendation: "Обычно для ООО и ОСНО лучше работает регулярное сопровождение с понятной зоной ответственности.",
      trustLine: base.trustLine,
    }
  }

  if (hasEmployees) {
    return {
      title: "Если есть сотрудники",
      shortSummary: "Кроме бухгалтерии важно правильно вести зарплату, кадры и отчётность по сотрудникам.",
      points: [
        "Поможем с зарплатой и кадрами",
        "Подскажем по отчётности за сотрудников",
        "Обсудим удобный формат сопровождения",
      ],
      recommendation: "При сотрудниках важно заранее выстроить понятный процесс по документам и срокам.",
      trustLine: base.trustLine,
    }
  }

  if (isStartup) {
    return {
      title: "Для старта бизнеса",
      shortSummary: "Поможем выбрать формат работы и не запутаться с налоговым режимом.",
      points: [
        "Подскажем подходящий налоговый режим",
        "Поможем настроить учёт с начала",
        "Объясним отчётность простым языком",
      ],
      recommendation: "Обычно на старте важно сразу выбрать понятную схему учёта и не откладывать документы на потом.",
      trustLine: base.trustLine,
    }
  }

  return base
}

function QuizSidebar({
  canProceed,
  handleNext,
  handleSubmit,
  isPhoneStep,
  canSubmit,
  isSubmitting,
  context,
}: {
  canProceed: boolean,
  handleNext: () => void,
  handleSubmit: () => void,
  isPhoneStep: boolean,
  canSubmit: boolean,
  isSubmitting: boolean
  context: SidebarContext
}) {
  return (
         <div className="w-80 bg-slate-100 px-6 py-6 border-l border-slate-200 flex flex-col justify-between items-center">
      <div className="w-full flex flex-col items-center gap-3">
        <div className="bg-white rounded-2xl shadow-md p-4 w-full">
          <div className="text-base font-bold mb-2 text-gray-900">{context.title}</div>
          <p className="text-sm text-gray-600 mb-3">{context.shortSummary}</p>
          <div className="space-y-2 text-sm text-gray-700">
            {context.points.map((point) => (
              <p key={point}>• {point}</p>
            ))}
          </div>
          <p className="text-xs text-gray-600 mt-3 leading-relaxed">{context.recommendation}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-4 w-full">
          <div className="text-base font-bold mb-3 text-gray-900">Почему нам доверяют</div>
          <div className="space-y-2 text-sm text-gray-700">
            <p>• Работаем по договору</p>
            <p>• Помогаем при требованиях ФНС</p>
            <p>• Поддержка в мессенджерах</p>
            <p>• Опыт с ИП и ООО</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed px-1">
          {context.trustLine}
        </p>
        {isPhoneStep ? (
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white w-full mt-4 rounded-xl font-semibold text-base shadow-lg transition-all duration-300 whitespace-normal leading-tight text-center py-4"
          >
            {isSubmitting ? "Отправляем..." : "Получить рекомендации"}
          </Button>
        ) : null}
      </div>
      {(!isPhoneStep) ? (
        <Button
          onClick={handleNext}
          disabled={!canProceed}
          className="bg-slate-800 hover:bg-slate-900 text-white w-full mt-4 py-3 rounded-xl font-medium shadow-md transition-all"
        >
          Далее
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      ) : null}
    </div>
  )
}

const getBusinessType = (answers: QuizAnswer[]): "ip" | "ooo" | "both" => {
  const businessTypeAnswer = answers.find(a => a.questionId === 1)?.answer
  if (!businessTypeAnswer || typeof businessTypeAnswer !== "object" || Array.isArray(businessTypeAnswer)) return "both"

  const type = businessTypeAnswer.companyType
  if (type === "ip") return "ip"
  if (type === "ooo") return "ooo"
  if (type === "both") return "both"
  if (type === "new") return "both"
  return "both"
}

const getBusinessStepValue = (answers: QuizAnswer[]) => {
  const answer = answers.find((a) => a.questionId === 1)?.answer
  if (!answer || typeof answer !== "object" || Array.isArray(answer)) {
    return { companyType: "", taxSystem: "", employees: "" }
  }
  return {
    companyType: String(answer.companyType || ""),
    taxSystem: String(answer.taxSystem || ""),
    employees: String(answer.employees || ""),
  }
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

  const handleAnswer = (questionId: number, answer: string | string[] | Record<string, string>) => {
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
    discount: 0,
    businessType: getBusinessType(answers),
  }

  const isPhoneStep = currentStep >= questions.length
  const currentQuestion = questions[currentStep]
  const businessStepValue = getBusinessStepValue(answers)
  const sidebarContext = getQuizSidebarContext(answers)
  const currentAnswer = answers.find((a) => a.questionId === currentQuestion?.id)
  const canProceed = isPhoneStep
    ? false
    : currentQuestion?.type === "business"
      ? Boolean(businessStepValue.companyType && businessStepValue.taxSystem && businessStepValue.employees)
      : Boolean(
          currentAnswer &&
            (Array.isArray(currentAnswer.answer) ? currentAnswer.answer.length > 0 : currentAnswer.answer)
        )

  useEffect(() => {
    if (!showThanks) return
    const t = window.setTimeout(() => {
      window.location.href = "/"
    }, 3000)
    return () => window.clearTimeout(t)
  }, [showThanks])

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
        <DialogTitle className="sr-only">Короткий опрос для подбора условий</DialogTitle>
        <DialogDescription className="sr-only">Ответьте на несколько вопросов — мы подготовим персональное предложение</DialogDescription>
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
                Короткая диагностика для подбора бухгалтерского сопровождения
              </h1>
              <p className="text-gray-500">3 шага — и мы подготовим предварительные рекомендации</p>
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
                      <h2 className="text-2xl font-bold mb-2 mt-2 text-gray-900 leading-tight">{currentQuestion.title}</h2>
                      {"subtitle" in currentQuestion && currentQuestion.subtitle ? (
                        <p className="text-gray-600 mb-6">{currentQuestion.subtitle}</p>
                      ) : null}

                      {currentQuestion.type === "business" ? (
                        <div className="space-y-5">
                          <div className="bg-cyan-50 border border-gray-200 rounded-lg p-5">
                            <Label className="text-sm font-semibold text-gray-900 mb-2 block">Форма бизнеса</Label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {[
                                { value: "ip", label: "ИП" },
                                { value: "ooo", label: "ООО" },
                                { value: "both", label: "ИП и ООО" },
                                { value: "new", label: "Пока только планирую открыть бизнес" },
                              ].map((option) => (
                                <button
                                  key={option.value}
                                  type="button"
                                  onClick={() =>
                                    handleAnswer(1, {
                                      ...businessStepValue,
                                      companyType: option.value,
                                    })
                                  }
                                  className={`text-left border rounded-lg px-4 py-3 transition-colors ${
                                    businessStepValue.companyType === option.value
                                      ? "border-cyan-500 bg-white"
                                      : "border-gray-200 bg-white/70 hover:border-cyan-300"
                                  }`}
                                >
                                  {option.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="bg-cyan-50 border border-gray-200 rounded-lg p-5">
                            <Label className="text-sm font-semibold text-gray-900 mb-2 block">Система налогообложения</Label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {[
                                { value: "usn", label: "УСН" },
                                { value: "osn", label: "ОСНО" },
                                { value: "patent", label: "Патент" },
                                { value: "not-selected", label: "Нужна консультация по выбору режима" },
                              ].map((option) => (
                                <button
                                  key={option.value}
                                  type="button"
                                  onClick={() =>
                                    handleAnswer(1, {
                                      ...businessStepValue,
                                      taxSystem: option.value,
                                    })
                                  }
                                  className={`text-left border rounded-lg px-4 py-3 transition-colors ${
                                    businessStepValue.taxSystem === option.value
                                      ? "border-cyan-500 bg-white"
                                      : "border-gray-200 bg-white/70 hover:border-cyan-300"
                                  }`}
                                >
                                  {option.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="bg-cyan-50 border border-gray-200 rounded-lg p-5">
                            <Label className="text-sm font-semibold text-gray-900 mb-2 block">Сотрудники</Label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {[
                                { value: "0", label: "Нет сотрудников" },
                                { value: "has", label: "Есть сотрудники" },
                                { value: "plan", label: "Планируем нанимать" },
                                { value: "many", label: "Есть команда более 5 человек" },
                              ].map((option) => (
                                <button
                                  key={option.value}
                                  type="button"
                                  onClick={() =>
                                    handleAnswer(1, {
                                      ...businessStepValue,
                                      employees: option.value,
                                    })
                                  }
                                  className={`text-left border rounded-lg px-4 py-3 transition-colors ${
                                    businessStepValue.employees === option.value
                                      ? "border-cyan-500 bg-white"
                                      : "border-gray-200 bg-white/70 hover:border-cyan-300"
                                  }`}
                                >
                                  {option.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : currentQuestion.type === "single" ? (
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
                      title: "Получите предварительные рекомендации",
                      subtitle: "Мы посмотрим ответы и предложим подходящий формат бухгалтерского сопровождения.",
                      giftLabel: "Материалы по теме (по желанию)",
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

                      // Reset form + закрываем опрос
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
                canSubmit={canFinalSubmit && !showThanks}
                isSubmitting={isFinalSubmitting || showThanks}
                context={sidebarContext}
              />
            </div>
          </div>
        </div>
        </DialogContent>
      </Dialog>

      {/* Модалка благодарности */}
      <Dialog open={showThanks} onOpenChange={setShowThanks}>
        <DialogTitle className="sr-only">Благодарность за заполнение опроса</DialogTitle>
        <DialogDescription className="sr-only">Рекомендации отправлены</DialogDescription>
        <DialogContent className="max-w-md p-8 text-center flex flex-col items-center justify-center">
          <button
            onClick={() => setShowThanks(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold mb-4 text-green-700">Спасибо за уделенное время!</h2>
          <p className="text-base text-gray-700 mb-4">
            Предварительные рекомендации отправлены на ваш email, проверьте почту
          </p>
          <Button onClick={() => setShowThanks(false)} className="mt-2 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-xl">
            Закрыть
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
