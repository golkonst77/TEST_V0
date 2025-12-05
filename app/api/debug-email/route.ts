import { NextRequest, NextResponse } from 'next/server'

/**
 * Диагностический API для проверки настроек email
 * GET /api/debug-email - проверить настройки (без отправки)
 * POST /api/debug-email - тестовая отправка email
 */
export async function GET(request: NextRequest) {
  const yandexEmail = process.env.YANDEX_EMAIL
  const yandexPassword = process.env.YANDEX_PASSWORD

  return NextResponse.json({
    yandexEmail: yandexEmail ? `${yandexEmail.substring(0, 5)}...@${yandexEmail.split('@')[1] || 'не указан домен'}` : 'НЕ УСТАНОВЛЕН',
    yandexPasswordSet: yandexPassword ? `установлен (${yandexPassword.length} символов)` : 'НЕ УСТАНОВЛЕН',
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  })
}

export async function POST(request: NextRequest) {
  try {
    const { sendEmail } = await import('@/lib/email-service')
    
    const yandexEmail = process.env.YANDEX_EMAIL
    
    if (!yandexEmail) {
      return NextResponse.json({
        success: false,
        error: 'YANDEX_EMAIL не установлен в переменных окружения'
      }, { status: 500 })
    }

    console.log('🧪 [DEBUG] Начинаем тестовую отправку email...')
    const startTime = Date.now()

    const result = await sendEmail({
      to: yandexEmail,
      subject: '🧪 Тест email с продакшна',
      html: `<h1>Тестовое письмо</h1><p>Отправлено: ${new Date().toLocaleString('ru-RU')}</p>`,
      text: `Тестовое письмо. Отправлено: ${new Date().toLocaleString('ru-RU')}`
    })

    const duration = Date.now() - startTime

    return NextResponse.json({
      success: result.success,
      messageId: result.messageId,
      error: result.error,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ [DEBUG] Ошибка:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Неизвестная ошибка',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}

