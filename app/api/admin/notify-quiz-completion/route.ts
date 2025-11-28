import { NextRequest, NextResponse } from 'next/server'
import { getSettings } from '@/lib/settings-store'
import { sendEmail } from '@/lib/email-service'

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 [API] Получен запрос на уведомление о завершении квиза')
    
    const { phone, discount, businessType, coupon, answers } = await request.json()
    console.log('📊 [API] Данные квиза:', { phone, discount, businessType, coupon, answersCount: answers?.length })

    const notificationText = `
Новый клиент завершил квиз!

📱 Телефон: ${phone}
💰 Скидка: ${discount.toLocaleString()} ₽
🏢 Тип бизнеса: ${businessType}
🎫 Купон: ${coupon}

📝 Ответы на вопросы:
${answers.map((answer: any, index: number) => {
  const questionText = getQuestionText(answer.questionId)
  return `${index + 1}. ${questionText}: ${answer.answer}`
}).join('\n')}

⏰ Время: ${new Date().toLocaleString('ru-RU')}
    `.trim()
    
    console.log('📝 [API] Текст уведомления сформирован')

    // Получаем email админа из настроек (приоритет: Яндекс)
    console.log('🔍 [API] Получаем email админа из настроек...')
    let adminEmail = 'admin@prostoburo.com' // fallback
    try {
      const settings = await getSettings()
      console.log('⚙️ [API] Настройки получены:', { admin_email: settings.admin_email, env_admin: process.env.ADMIN_EMAIL })
      adminEmail = process.env.YANDEX_EMAIL || settings.admin_email || process.env.ADMIN_EMAIL || 'admin@prostoburo.com'
      console.log('📧 [API] Email админа для отправки:', adminEmail)
    } catch (error) {
      console.error('❌ [API] Ошибка получения настроек, используем fallback email:', error)
    }

    // Отправляем email напрямую через email-service
    console.log('📤 [API] Отправляем email напрямую через email-service...')
    try {
      const emailResult = await sendEmail({
        to: adminEmail,
        subject: `📱 Квиз: ${phone} — купон ${coupon}`,
        html: notificationText.replace(/\n/g, '<br>'),
        text: notificationText
      })

      if (emailResult.success) {
        console.log('✅ [API] Email уведомление отправлено успешно:', emailResult.messageId)
      } else {
        const errorMsg = `Ошибка отправки email: ${emailResult.error}`
        console.error('❌ [API]', errorMsg)
        throw new Error(errorMsg)
      }
      
    } catch (emailError) {
      console.error('❌ [API] Ошибка отправки email (catch):', emailError)
      console.error('❌ [API] Стек ошибки:', emailError instanceof Error ? emailError.stack : 'нет стека')
      
      // Fallback: логируем в консоль
      console.log('📧 [API] УВЕДОМЛЕНИЕ АДМИНИСТРАТОРУ (консоль, email не отправлен):')
      console.log(notificationText)
    }

    // Fire-and-forget вызов интеграции с amoCRM; не блокируем ответ
    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
      await fetch(`${siteUrl}/api/integrations/amocrm/lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, discount, businessType, coupon, answers }),
        cache: 'no-store',
      })
    } catch (e) {
      console.error('Не удалось отправить данные в amoCRM (не критично):', e)
    }

    return NextResponse.json({ success: true, message: 'Уведомление отправлено' })
  } catch (error) {
    console.error('Ошибка в notify-quiz-completion:', error)
    return NextResponse.json(
      { error: 'Ошибка отправки уведомления' },
      { status: 500 }
    )
  }
}

function getQuestionText(questionId: number): string {
  const questions: { [key: number]: string } = {
    1: 'Статус бизнеса',
    2: 'Ведение бухгалтерии',
    3: 'Что беспокоит больше всего',
    4: 'Какие услуги актуальны'
  }
  return questions[questionId] || `Вопрос ${questionId}`
}
