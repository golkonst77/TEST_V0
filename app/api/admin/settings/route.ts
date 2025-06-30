import { type NextRequest, NextResponse } from "next/server"
import { getSettings, updateSettings } from "@/lib/settings-store"

export async function GET() {
  try {
    const settings = await getSettings()
    console.log("GET settings:", settings)
    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json({ error: "Ошибка получения настроек" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("PUT request body:", body)

    // Валидация обязательных полей
    if (!body.siteName || !body.phone || !body.email) {
      return NextResponse.json({ error: "Заполните все обязательные поля" }, { status: 400 })
    }

    // Маппинг полей для Supabase
    const supabaseBody = {
      id: 1,
      sitename: body.siteName,
      sitedescription: body.siteDescription,
      phone: body.phone,
      email: body.email,
      address: body.address,
      telegram: body.telegram,
      vk: body.vk,
      maintenancemode: body.maintenanceMode,
      analyticsenabled: body.analyticsEnabled,
      quiz_mode: body.quiz_mode,
      quiz_url: body.quiz_url,
    }

    // Обновляем настройки
    const updatedSettings = await updateSettings(supabaseBody)
    console.log("Settings saved successfully:", updatedSettings)

    return NextResponse.json({
      success: true,
      message: "Настройки успешно сохранены",
      settings: updatedSettings,
    })
  } catch (error) {
    console.error("Error saving settings:", error)
    return NextResponse.json({ error: "Ошибка сохранения настроек" }, { status: 500 })
  }
}
