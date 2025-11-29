import { type NextRequest, NextResponse } from "next/server"
import { getHeroConfig, updateHeroConfig } from "@/lib/homepage-store"

export async function GET() {
  try {
    const config = getHeroConfig()
    console.log("API: Отправка настроек главной страницы")

    return NextResponse.json({
      success: true,
      hero: config,
    })
  } catch (error) {
    console.error("Ошибка получения настроек главной страницы:", error)
    return NextResponse.json({ success: false, message: "Ошибка сервера" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("API: Получен запрос на обновление:", body)

    if (body.hero) {
      try {
        const updatedConfig = updateHeroConfig(body.hero)
        console.log("API: Настройки обновлены успешно")

        return NextResponse.json({
          success: true,
          message: "Настройки главной страницы сохранены",
          hero: updatedConfig,
        })
      } catch (saveError) {
        console.error("API: Ошибка при сохранении:", saveError)
        return NextResponse.json({ 
          success: false, 
          message: saveError instanceof Error ? saveError.message : "Ошибка сохранения файла" 
        }, { status: 500 })
      }
    }

    return NextResponse.json({ success: false, message: "Неверные данные" }, { status: 400 })
  } catch (error) {
    console.error("Ошибка сохранения настроек главной страницы:", error)
    return NextResponse.json({ 
      success: false, 
      message: error instanceof Error ? error.message : "Ошибка сервера" 
    }, { status: 500 })
  }
}
