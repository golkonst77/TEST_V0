import { type NextRequest, NextResponse } from "next/server"

// Временное хранилище настроек (в продакшене использовать базу данных)
let siteSettings = {
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
    return NextResponse.json(siteSettings)
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json({ error: "Ошибка получения настроек" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    // Валидация обязательных полей
    if (!body.siteName || !body.phone || !body.email) {
      return NextResponse.json({ error: "Заполните все обязательные поля" }, { status: 400 })
    }

    // Обновляем настройки
    siteSettings = {
      ...siteSettings,
      ...body,
    }

    console.log("Settings updated:", siteSettings)

    return NextResponse.json({
      success: true,
      message: "Настройки успешно сохранены",
      settings: siteSettings,
    })
  } catch (error) {
    console.error("Error saving settings:", error)
    return NextResponse.json({ error: "Ошибка сохранения настроек" }, { status: 500 })
  }
}
