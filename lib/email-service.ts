import nodemailer from 'nodemailer'

/**
 * Отправляет email через Resend API (приоритет) или Yandex SMTP (fallback)
 * Resend работает через HTTP API — не требует открытых SMTP портов
 * @param to - Email получателя
 * @param subject - Тема письма
 * @param html - HTML содержимое
 * @param text - Текстовая версия (опционально)
 * @returns Promise с результатом отправки
 */
export async function sendEmail({
  to,
  subject,
  html,
  text
}: {
  to: string
  subject: string
  html: string
  text?: string
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    console.log('📧 [EMAIL] Начинаем отправку email...', { to, subject })

    // Проверяем наличие обязательных полей
    if (!to || !subject) {
      throw new Error('Отсутствуют обязательные поля: to, subject')
    }

    // Приоритет 1: Resend API (работает через HTTP, не требует SMTP)
    const resendApiKey = process.env.RESEND_API_KEY
    if (resendApiKey) {
      console.log('🚀 [EMAIL] Используем Resend API (HTTP)...')
      return await sendViaResend({ to, subject, html, text, apiKey: resendApiKey })
    }

    // Приоритет 2: Yandex SMTP
    const yandexEmail = process.env.YANDEX_EMAIL
    const yandexPassword = process.env.YANDEX_PASSWORD
    if (yandexEmail && yandexPassword) {
      console.log('📮 [EMAIL] Используем Yandex SMTP...')
      return await sendViaYandex({ to, subject, html, text, email: yandexEmail, password: yandexPassword })
    }

    // Нет настроенных провайдеров
    throw new Error('Не настроен ни один email провайдер. Добавьте RESEND_API_KEY или YANDEX_EMAIL/YANDEX_PASSWORD')

  } catch (error) {
    console.error('❌ [EMAIL] Ошибка отправки email:', error)
    
    let errorMessage = 'Неизвестная ошибка'
    if (error instanceof Error) {
      errorMessage = error.message
    }
    
    return {
      success: false,
      error: errorMessage
    }
  }
}

/**
 * Отправка через Resend API (HTTP, без SMTP)
 */
async function sendViaResend({
  to,
  subject,
  html,
  text,
  apiKey
}: {
  to: string
  subject: string
  html: string
  text?: string
  apiKey: string
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
    
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [to],
        subject: subject,
        html: html,
        text: text || html.replace(/<[^>]*>/g, '')
      })
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('❌ [RESEND] Ошибка:', data)
      throw new Error(data.message || `HTTP ${response.status}`)
    }

    console.log('✅ [RESEND] Email отправлен:', data)
    return {
      success: true,
      messageId: data.id
    }
  } catch (error) {
    console.error('❌ [RESEND] Ошибка:', error)
    throw error
  }
}

/**
 * Отправка через Yandex SMTP
 */
async function sendViaYandex({
  to,
  subject,
  html,
  text,
  email,
  password
}: {
  to: string
  subject: string
  html: string
  text?: string
  email: string
  password: string
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const transporter = nodemailer.createTransport({
    host: 'smtp.yandex.ru',
    port: 587,
    secure: false,
    auth: {
      user: email,
      pass: password
    },
    tls: {
      rejectUnauthorized: false
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000
  })

  const mailOptions = {
    from: email,
    to: to,
    subject: subject,
    html: html,
    text: text || html.replace(/<[^>]*>/g, '')
  }

  console.log('📤 [YANDEX] Отправляем письмо...', {
    from: mailOptions.from,
    to: mailOptions.to,
    subject: mailOptions.subject
  })

  const info = await transporter.sendMail(mailOptions)

  console.log('✅ [YANDEX] Email отправлен:', {
    messageId: info.messageId,
    response: info.response
  })

  return {
    success: true,
    messageId: info.messageId
  }
}
