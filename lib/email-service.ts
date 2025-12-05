import nodemailer from 'nodemailer'

/**
 * Отправляет email через Yandex.Mail или Gmail (fallback)
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

    // Получаем настройки Yandex
    const yandexEmail = process.env.YANDEX_EMAIL
    const yandexPassword = process.env.YANDEX_PASSWORD

    const usingYandex = Boolean(yandexEmail && yandexPassword)

    console.log('🔧 [EMAIL] Настройки SMTP:', {
      usingYandex,
      yandexEmail: yandexEmail ? `${yandexEmail.substring(0, 5)}...` : 'не установлен',
      yandexPassword: yandexPassword ? '***' : 'не установлен'
    })

    // Создаем транспортер
    // Используем порт 587 (STARTTLS) - чаще открыт на серверах чем 465
    const transporter = usingYandex
      ? nodemailer.createTransport({
          host: 'smtp.yandex.ru',
          port: 587,
          secure: false, // STARTTLS
          auth: {
            user: yandexEmail as string,
            pass: yandexPassword as string
          },
          tls: {
            // Игнорируем ошибки самоподписанных сертификатов
            rejectUnauthorized: false
          },
          // Таймауты для предотвращения зависания на продакшне
          connectionTimeout: 10000, // 10 секунд на подключение
          greetingTimeout: 10000,   // 10 секунд на приветствие
          socketTimeout: 15000      // 15 секунд на операции
        })
      : nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER || 'your-email@gmail.com',
            pass: process.env.EMAIL_PASS || 'your-app-password'
          },
          tls: {
            rejectUnauthorized: false
          }
        })

    // Настройки письма
    const mailOptions = {
      from: usingYandex ? (yandexEmail as string) : (process.env.EMAIL_USER || 'your-email@gmail.com'),
      to: to,
      subject: subject,
      html: html,
      text: text || html.replace(/<[^>]*>/g, '') // Убираем HTML теги для текстовой версии
    }

    console.log('📤 [EMAIL] Отправляем письмо...', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    })

    // Отправляем email
    const info = await transporter.sendMail(mailOptions)

    console.log('✅ [EMAIL] Email отправлен успешно:', {
      messageId: info.messageId,
      response: info.response
    })

    return {
      success: true,
      messageId: info.messageId
    }
  } catch (error) {
    console.error('❌ [EMAIL] Ошибка отправки email:', error)
    
    // Детальная информация об ошибке
    let errorMessage = 'Неизвестная ошибка'
    if (error instanceof Error) {
      errorMessage = error.message
      console.error('❌ [EMAIL] Детали ошибки:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      })
    }
    
    // Если это ошибка nodemailer, выводим больше информации
    if (error && typeof error === 'object' && 'code' in error) {
      console.error('❌ [EMAIL] Код ошибки nodemailer:', (error as any).code)
      console.error('❌ [EMAIL] Ответ сервера:', (error as any).response)
      console.error('❌ [EMAIL] Команда:', (error as any).command)
    }
    
    return {
      success: false,
      error: errorMessage
    }
  }
}

