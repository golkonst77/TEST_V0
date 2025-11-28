import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email-service'

/**
 * Тестовый endpoint для проверки отправки email на Yandex
 * GET /api/test-yandex-email - проверяет настройки
 * POST /api/test-yandex-email - отправляет тестовое письмо
 */
export async function GET() {
  const yandexEmail = process.env.YANDEX_EMAIL
  const yandexPassword = process.env.YANDEX_PASSWORD

  return NextResponse.json({
    success: true,
    settings: {
      yandexEmail: yandexEmail ? `${yandexEmail.substring(0, 5)}...` : 'НЕ УСТАНОВЛЕН',
      yandexPassword: yandexPassword ? `УСТАНОВЛЕН (${yandexPassword.length} символов)` : 'НЕ УСТАНОВЛЕН',
      passwordLength: yandexPassword?.length || 0,
      hasBoth: Boolean(yandexEmail && yandexPassword)
    },
    message: yandexEmail && yandexPassword 
      ? 'Настройки найдены. Используйте POST для отправки тестового письма.'
      : 'Настройки не найдены. Проверьте .env.local',
    troubleshooting: yandexEmail && yandexPassword && yandexPassword.length !== 16
      ? '⚠️ Пароль приложения должен быть 16 символов. Проверьте, что используете пароль приложения, а не основной пароль.'
      : null
  })
}

export async function POST(request: NextRequest) {
  try {
    const { to } = await request.json()
    const testEmail = to || process.env.YANDEX_EMAIL || 'golkonst@yandex.ru'

    console.log('🧪 [TEST] Начинаем тестовую отправку email...', { testEmail })

    const result = await sendEmail({
      to: testEmail,
      subject: '🧪 Тестовое письмо от квиза',
      html: `
        <h2>Тестовое письмо</h2>
        <p>Если вы видите это письмо, значит отправка на Yandex работает!</p>
        <p><strong>Время:</strong> ${new Date().toLocaleString('ru-RU')}</p>
        <p><strong>Получатель:</strong> ${testEmail}</p>
      `,
      text: `Тестовое письмо от квиза. Время: ${new Date().toLocaleString('ru-RU')}`
    })

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Тестовое письмо отправлено успешно!',
        messageId: result.messageId,
        recipient: testEmail,
        note: 'Проверьте папку "Входящие" и "Спам" в Яндекс.Почте'
      })
    } else {
      return NextResponse.json({
        success: false,
        error: result.error,
        recipient: testEmail
      }, { status: 500 })
    }
  } catch (error) {
    console.error('❌ [TEST] Ошибка тестовой отправки:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Неизвестная ошибка'
    }, { status: 500 })
  }
}

