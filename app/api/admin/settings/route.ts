import { type NextRequest, NextResponse } from "next/server"
import { getSettings, updateSettings } from "@/lib/settings-store"

export async function GET() {
  try {
    const settings = await getSettings()
    console.log("GET settings:", settings)
    return NextResponse.json(settings, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    })
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json({ error: "Ошибка получения настроек" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("PUT request body:", body)

    // Маппинг полей для интерфейса SiteSettings
    const settingsToUpdate = {
      siteName: body.siteName,
      siteDescription: body.siteDescription,
      phone: body.phone,
      email: body.email,
      address: body.address,
      telegram: body.telegram,
      vk: body.vk,
      maintenanceMode: body.maintenanceMode,
      analyticsEnabled: body.analyticsEnabled,
      quiz_mode: body.quiz_mode,
      quiz_url: body.quiz_url,
      working_hours: body.working_hours,
      logoType: body.logoType,
      logoImageUrl: body.logoImageUrl,
      logoText: body.logoText,
      logoShow: body.logoShow,
      admin_email: body.adminEmail
    }

    console.log("Settings to update:", settingsToUpdate)

    // Обновляем настройки
    const updatedSettings = await updateSettings(settingsToUpdate)
    console.log("Settings saved successfully:", updatedSettings)

    if (!updatedSettings) {
      console.error("updateSettings returned null or undefined")
      return NextResponse.json({ 
        error: "Не удалось сохранить настройки в базе данных",
        details: "updateSettings returned null"
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Настройки успешно сохранены",
      settings: updatedSettings,
    }, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    })
  } catch (error) {
    console.error("Error saving settings:", error)
    const errorMessage = error instanceof Error ? error.message : "Неизвестная ошибка"
    return NextResponse.json({ 
      error: "Ошибка сохранения настроек",
      details: errorMessage
    }, { status: 500 })
  }
}

// Некоторые прокси/фаерволы могут блокировать PUT. Дублируем логику на POST.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("POST request body (settings):", body)

    const settingsToUpdate = {
      siteName: body.siteName,
      siteDescription: body.siteDescription,
      phone: body.phone,
      email: body.email,
      address: body.address,
      telegram: body.telegram,
      vk: body.vk,
      maintenanceMode: body.maintenanceMode,
      analyticsEnabled: body.analyticsEnabled,
      quiz_mode: body.quiz_mode,
      quiz_url: body.quiz_url,
      working_hours: body.working_hours,
      logoType: body.logoType,
      logoImageUrl: body.logoImageUrl,
      logoText: body.logoText,
      logoShow: body.logoShow,
      admin_email: body.adminEmail
    }

    console.log("Settings to update (POST):", settingsToUpdate)

    const updatedSettings = await updateSettings(settingsToUpdate)

    if (!updatedSettings) {
      return NextResponse.json({ error: "Не удалось сохранить настройки в базе данных" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Настройки успешно сохранены",
      settings: updatedSettings,
    })
  } catch (error) {
    console.error("Error saving settings (POST):", error)
    const errorMessage = error instanceof Error ? error.message : "Неизвестная ошибка"
    return NextResponse.json({ error: "Ошибка сохранения настроек", details: errorMessage }, { status: 500 })
  }
}
