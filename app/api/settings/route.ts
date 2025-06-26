import { NextResponse } from "next/server"

// Импортируем настройки из админского API
const siteSettings = {
  siteName: "ПростоБюро",
  siteDescription: "Профессиональные бухгалтерские услуги",
  phone: "+7 953 330-17-77",
  email: "info@prostoburo.ru",
  address: "г. Москва, ул. Примерная, д. 1",
  telegram: "https://t.me/prostoburo",
  vk: "https://m.vk.com/buh_urist?from=groups",
  maintenanceMode: false,
  analyticsEnabled: true,
}

export async function GET() {
  try {
    // В продакшене здесь будет запрос к базе данных
    return NextResponse.json(siteSettings)
  } catch (error) {
    console.error("Error fetching public settings:", error)
    return NextResponse.json({ error: "Ошибка получения настроек" }, { status: 500 })
  }
}
