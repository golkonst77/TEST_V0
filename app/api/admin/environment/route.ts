import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Собираем информацию о переменных окружения
    const environmentInfo = {
      nodeEnv: process.env.NODE_ENV || "Не настроено",
      appUrl: process.env.NEXT_PUBLIC_APP_URL || "Не настроено",
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "Не настроено",
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || "Не настроено",
      supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "Не настроено",
      adminEmail: process.env.ADMIN_EMAIL || "Не настроено",
      yandexMetrikaId: process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID || "Не настроено",
      recaptchaSiteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "Не настроено",
      sendsayApiKey: process.env.SENDSAY_API_KEY || "Не настроено",
      timestamp: new Date().toISOString()
    }

    return NextResponse.json(environmentInfo, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })
  } catch (error) {
    console.error("Error fetching environment info:", error)
    return NextResponse.json(
      { 
        error: "Ошибка получения информации о среде",
        details: error instanceof Error ? error.message : "Неизвестная ошибка"
      }, 
      { status: 500 }
    )
  }
}
