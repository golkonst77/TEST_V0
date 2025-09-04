import { NextRequest, NextResponse } from 'next/server'
import { getSettings } from '@/lib/settings-store'

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

    // Получаем email админа из настроек
    console.log('🔍 [API] Получаем email админа из настроек...')
    let adminEmail = 'admin@prostoburo.com' // fallback
    try {
      const settings = await getSettings()
      console.log('⚙️ [API] Настройки получены:', { admin_email: settings.admin_email, env_admin: process.env.ADMIN_EMAIL })
      adminEmail = settings.admin_email || process.env.ADMIN_EMAIL || 'admin@prostoburo.com'
      console.log('📧 [API] Email админа для отправки:', adminEmail)
    } catch (error) {
      console.error('❌ [API] Ошибка получения настроек, используем fallback email:', error)
    }

    // Отправляем email через nodemailer API
    console.log('📤 [API] Отправляем email через nodemailer API...')
    try {
      const emailData = {
        to: adminEmail,
        subject: `🎯 Новый клиент завершил квиз - ${phone}`,
        html: notificationText.replace(/\n/g, '<br>'),
        text: notificationText
      }
      console.log('📧 [API] Данные для отправки email:', emailData)
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      })

      console.log('📡 [API] Ответ от email API:', response.status, response.statusText)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Email API error: ${response.status} - ${JSON.stringify(errorData)}`)
      }

      const result = await response.json()
      console.log('✅ [API] Email уведомление отправлено через nodemailer:', result)
      
    } catch (emailError) {
      console.error('❌ [API] Ошибка отправки email, используем fallback в консоль:', emailError)
      
      // Fallback: логируем в консоль
      console.log('📧 [API] УВЕДОМЛЕНИЕ АДМИНИСТРАТОРУ (консоль):')
      console.log(notificationText)
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
