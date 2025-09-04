"use client"

// ✅ WhatsApp отправка включена обратно
// Дата включения: 2025-09-04

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { useContactForm } from "@/hooks/use-contact-form"
import { useToast } from "@/hooks/use-toast"
import { ArrowRight, ArrowLeft, Gift, Phone, X } from "lucide-react"
import InputMask from 'react-input-mask'
import { sendYandexMetric, YANDEX_METRICS_EVENTS } from "@/utils/yandex-metrics"

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
        {/* Вместо блока 'Ваша экономия' — кнопка 'Получить предложение' на последнем шаге */}
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

// Добавим функцию отправки WhatsApp с улучшенной обработкой ошибок
async function sendWhatsAppMessage(phone: string, message: string) {
  try {
    // phone теперь вся маска, извлекаем только цифры
    const cleanPhone = '7' + phone.replace(/\D/g, '').slice(1, 11);
    if (cleanPhone.length !== 11) {
      console.error('[WHATSAPP] Неверный формат номера:', phone);
      throw new Error('Неверный формат номера телефона');
    }
    
    console.log('[WHATSAPP] Отправляем сообщение на номер:', cleanPhone);
    
    const response = await fetch('https://gate.whapi.cloud/messages/text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer K9edm63ZcOVma3QQQZy4vQM7JQOSI1RF',
      },
      body: JSON.stringify({
        to: cleanPhone,
        body: message,
      }),
    });
    
    const responseText = await response.text();
    console.log('[WHATSAPP] Ответ от сервера:', responseText);
    console.log('[WHATSAPP] Статус:', response.status);
    
    if (!response.ok) {
      console.error('[WHATSAPP] Ошибка отправки:', response.status, responseText);
      throw new Error(`Ошибка отправки WhatsApp: ${response.status}`);
    }
    
    try {
      const result = JSON.parse(responseText);
      if (!result.sent) {
        console.error('[WHATSAPP] Сообщение не отправлено:', result);
        throw new Error('Сообщение не было отправлено');
      }
      console.log('[WHATSAPP] Сообщение успешно отправлено:', result);
    } catch (parseError) {
      console.error('[WHATSAPP] Ошибка парсинга ответа:', parseError);
      throw new Error('Ошибка обработки ответа сервера');
    }
  } catch (error) {
    console.error('[WHATSAPP] Ошибка при отправке сообщения:', error);
    throw error;
  }
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

// Обновляем функцию отправки документа с улучшенной обработкой ошибок
async function sendWhatsAppDocument(phone: string, quiz_result: "ip" | "ooo" | "both", caption: string) {
  console.log('[QUIZ] Начинаем отправку PDF:', { phone, quiz_result, caption });
  
  // phone теперь вся маска, извлекаем только цифры
  const cleanPhone = '7' + phone.replace(/\D/g, '').slice(1, 11);
  if (cleanPhone.length !== 11) {
    console.error('[QUIZ] Неверный формат номера:', phone);
    throw new Error('Неверный формат номера телефона');
  }
  
  try {
    // Получаем подходящий чек-лист
    const checklistResponse = await fetch('/api/get-checklist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quiz_result }),
    });
    
    if (!checklistResponse.ok) {
      const errorText = await checklistResponse.text();
      console.error('[QUIZ] Ошибка получения чек-листа:', errorText);
      throw new Error(`Ошибка получения чек-листа: ${checklistResponse.status}`);
    }
    
    const { checklist } = await checklistResponse.json();
    
    if (!checklist) {
      console.error('[QUIZ] Чек-лист не найден для результата:', quiz_result);
      throw new Error('Чек-лист не найден');
    }
    
    console.log('[QUIZ] Получен чек-лист:', checklist);
    
    // Отправляем чек-лист через WhatsApp
    const response = await fetch('/api/send-whatsapp-document', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: cleanPhone,
        filePath: checklist.file_url,
        caption: caption,
      }),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      console.error('[QUIZ] Ошибка отправки файла:', result);
      throw new Error(`Ошибка отправки файла: ${response.status}`);
    }

    console.log('[QUIZ] Файл успешно отправлен:', result);
  } catch (error) {
    console.error('[QUIZ] Ошибка при отправке файла:', error);
    throw error;
  }
}

export function QuizModal({ open, onOpenChange }: { open?: boolean, onOpenChange?: (open: boolean) => void } = {}) {
  const { isOpen, closeContactForm } = useContactForm()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswer[]>([])
  const [phone, setPhone] = useState("")
  const [wantChecklist, setWantChecklist] = useState<boolean>(true)
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

    console.log('🚀 [QUIZ] Начинаем отправку квиза...')
    console.log('📱 [QUIZ] Телефон:', phone.trim())
    console.log('📝 [QUIZ] Ответы:', answers)
    
    setIsSubmitting(true)
    let couponSaved = false
    let whatsappSent = false
    let documentSent = false
    
    try {
      const discount = calculateDiscount()
      const code = `PROSTOBURO-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
      const fullCoupon = `${code}-${discount}`
      
      // Определяем тип бизнеса
      const businessType = getBusinessType(answers)
      
      // Сохраняем купон в базу данных
      try {
        const response = await fetch('/api/coupons', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: fullCoupon,
            phone: phone.trim(),
            discount: discount,
            business_type: businessType
          })
        })
        
        if (!response.ok) {
          throw new Error(`Ошибка при сохранении купона: ${response.status}`)
        }
        
        const result = await response.json()
        console.log('Купон сохранен:', result)
        couponSaved = true
      } catch (error) {
        console.error('Ошибка сохранения купона:', error)
        const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка'
        throw new Error(`Не удалось сохранить купон: ${errorMessage}`)
      }

      // ✅ ВКЛЮЧЕНО: Отправка WhatsApp-сообщения клиенту
      try {
        await sendWhatsAppMessage(phone, `Здравствуйте, спасибо за интерес к нашей компании. Вам купон на скидку ${fullCoupon}. Также Вам бесплатная консультация 30 минут и СКИДКА 50% на первый месяц обслуживания! Если есть вопросы — пишите прямо здесь, ответим оперативно.`)
        whatsappSent = true
        console.log('✅ WhatsApp сообщение отправлено успешно')
      } catch (error) {
        console.error('❌ Ошибка отправки WhatsApp сообщения:', error)
        // Создаем ссылку для ручной отправки
        const cleanPhone = '7' + phone.replace(/\D/g, '').slice(1, 11);
        const message = `Здравствуйте, спасибо за интерес к нашей компании. Вам купон на скидку ${fullCoupon}. Также Вам бесплатная консультация 30 минут и СКИДКА 50% на первый месяц обслуживания! Если есть вопросы — пишите прямо здесь, ответим оперативно.`;
        const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
        
        // Открываем WhatsApp в новой вкладке
        window.open(whatsappUrl, '_blank');
        whatsappSent = true;
        console.log('🔗 Открыта ссылка WhatsApp для ручной отправки:', whatsappUrl);
      }
      
      // ✅ ВКЛЮЧЕНО: Отправка PDF-файла с чек-листом
      if (wantChecklist) {
        try {
          await sendWhatsAppDocument(phone, businessType, `Ваш чек-лист. Спасибо за интерес к ПростоБюро!`)
          documentSent = true
          console.log('✅ WhatsApp документ отправлен успешно')
        } catch (error) {
          console.error('❌ Ошибка отправки WhatsApp документа:', error)
          // Не прерываем выполнение
        }
      }
      
      // Отправляем событие в Яндекс.Метрику
      try {
        sendYandexMetric(YANDEX_METRICS_EVENTS.QUIZ_COMPLETED, {
          discount: discount,
          business_type: businessType,
          phone: phone.trim(),
          coupon: fullCoupon
        })
      } catch (error) {
        console.error('Ошибка отправки в Яндекс.Метрику:', error)
        // Не критично
      }

      // Отправляем уведомление администратору
      console.log('🚀 [QUIZ] Начинаем отправку уведомления администратору...', {
        phone: phone.trim(),
        discount: discount,
        businessType: businessType,
        coupon: fullCoupon,
        answersCount: answers.length
      })
      
      try {
        console.log('📡 [QUIZ] Вызываем API /api/admin/notify-quiz-completion...')
        const notifyResponse = await fetch('/api/admin/notify-quiz-completion', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone: phone.trim(),
            discount: discount,
            businessType: businessType,
            coupon: fullCoupon,
            answers: answers
          }),
        })
        
        console.log('📡 [QUIZ] Получен ответ от API:', notifyResponse.status, notifyResponse.statusText)
        
        if (!notifyResponse.ok) {
          const errorData = await notifyResponse.json()
          throw new Error(`API ответил с ошибкой: ${notifyResponse.status} - ${JSON.stringify(errorData)}`)
        }
        
        const notifyResult = await notifyResponse.json()
        console.log('✅ [QUIZ] Уведомление администратору отправлено успешно:', notifyResult)
      } catch (error) {
        console.error('❌ [QUIZ] Ошибка отправки уведомления администратору:', error)
        // Не критично для основного функционала
      }
      
      setCoupon(fullCoupon)
      setShowThanks(true)
      
      // Отправляем цель в Яндекс.Метрику
      if (typeof window !== 'undefined' && (window as any).ym) {
        try {
          (window as any).ym(45860892, 'reachGoal', 'quiz_completed', {
            phone: phone.trim(),
            discount: discount,
            businessType: businessType,
            coupon: fullCoupon
          })
          console.log('✅ [METRIKA] Цель "quiz_completed" отправлена в Яндекс.Метрику')
        } catch (error) {
          console.error('❌ [METRIKA] Ошибка отправки цели в Яндекс.Метрику:', error)
        }
      }
      
      // Reset form
      setCurrentStep(0)
      setAnswers([])
      setPhone("")
      setWantChecklist(true)
      closeContactForm()
      
                   // Показываем соответствующее сообщение в зависимости от успешности операций
      if (couponSaved && whatsappSent) {
        toast({
          title: "Успешно!",
          description: "Ваш купон сохранен! WhatsApp временно отключен для тестирования. Мы свяжемся с вами по телефону.",
        })
      } else if (couponSaved) {
        toast({
          title: "Купон сохранен!",
          description: "Купон сохранен, но возникли проблемы с отправкой. Мы свяжемся с вами по телефону.",
          variant: "default",
        })
      } else {
        toast({
          title: "Ошибка",
          description: "Не удалось сохранить купон. Попробуйте еще раз или свяжитесь с нами по телефону.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Критическая ошибка при отправке:', error)
      const errorMessage = error instanceof Error ? error.message : "Попробуйте еще раз или свяжитесь с нами по телефону."
      toast({
        title: "Ошибка отправки",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
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

  const handleCheckedChange = (checked: CheckboxPrimitive.CheckedState) => {
    setWantChecklist(checked === true || checked === 'indeterminate')
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
                  <div className="flex flex-col h-[600px] min-h-0">
                    <div className="flex-1 min-h-0 overflow-y-auto px-0 pt-2 pb-0 text-center max-w-lg mx-auto w-full flex flex-col items-stretch justify-start">
                                             <h2 className="text-2xl font-bold mb-2 text-gray-900">Последний шаг!</h2>
                       <p className="text-base text-gray-600 mb-4 leading-relaxed">
                         Оставьте номер телефона и мы отправим персональное предложение со скидкой {" "}
                         <span className="font-bold text-cyan-500">{calculateDiscount().toLocaleString()} ₽</span>
                         <br />
                         <span className="text-sm font-medium text-green-600">Сообщение отправлено в WhatsApp!</span>
                         <br />
                         <span className="text-sm font-medium text-green-600">Мы свяжемся с вами в ближайшее время!</span>
                       </p>
                      <InputMask
                        mask="+7 (999) 999-99-99"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                      >
                        {(inputProps) => (
                          <Input
                            {...inputProps}
                            id="phone"
                            type="tel"
                            placeholder="+7 (___) ___-__-__"
                            className="text-center text-base py-3 border-2 border-gray-200 focus:border-cyan-400 rounded-2xl shadow-sm w-full"
                          />
                        )}
                      </InputMask>
                      <div className="mb-4">
                        <div className="flex items-center space-x-2 mt-4">
                          <Checkbox
                            id="checklist"
                            checked={wantChecklist}
                            onCheckedChange={handleCheckedChange}
                            className="mt-1 text-green-600 border-2 border-green-300 w-5 h-5"
                          />
                          <Label htmlFor="checklist" className="cursor-pointer leading-relaxed text-gray-700">
                            <span className="text-lg mr-3">🎁</span>
                            <span className="font-bold text-green-700">Ваш подарок:</span> Чек-лист с полезной информацией для вашего бизнеса
                          </Label>
                        </div>
                      </div>
                    </div>
                                         <div className="shrink-0 bg-white pt-2 pb-2">
                       <div className="bg-gray-50 rounded-2xl p-4 text-center mt-2">
                         <p className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                           БЕЗОПАСНО И КОНФИДЕНЦИАЛЬНО
                         </p>
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
                handleSubmit={handleSubmit}
                phone={phone}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
        </div>
        </DialogContent>
      </Dialog>
      {/* Модалка благодарности */}
      <Dialog open={showThanks} onOpenChange={setShowThanks}>
        <DialogTitle className="sr-only">Благодарность за прохождение квиза</DialogTitle>
        <DialogDescription className="sr-only">Ваш купон сохранен, мы свяжемся с вами</DialogDescription>
        <DialogContent className="max-w-md p-8 text-center flex flex-col items-center justify-center">
          <button onClick={() => setShowThanks(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"><X className="w-6 h-6" /></button>
          <h2 className="text-2xl font-bold mb-4 text-green-700">Спасибо за уделенное время!</h2>
          <p className="text-base text-gray-700 mb-4">Ваш купон сохранен! Сообщение отправлено в WhatsApp.<br/>Мы свяжемся с вами в ближайшее время!<br/>Хорошего дня!</p>
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
