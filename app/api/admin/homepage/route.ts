import { type NextRequest, NextResponse } from "next/server"
import { getHeroConfig, saveHeroConfig } from "@/lib/homepage-store"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  try {
    const { config, diagnostics } = await getHeroConfig()
    console.log("API: Отправка настроек главной страницы")

    return NextResponse.json({
      success: true,
      hero: config,
      diagnostics,
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
    console.log("API RECEIVED BODY", JSON.stringify(body, null, 2))

    const updatedConfig = (body && typeof body === "object" && "hero" in body ? (body as any).hero : body) as unknown

    if (!updatedConfig || typeof updatedConfig !== "object") {
      return NextResponse.json({ success: false, message: "Неверные данные" }, { status: 400 })
    }

    const saved = await saveHeroConfig(updatedConfig as any)
    console.log("Saved homepage config", saved)

    return NextResponse.json({
      success: true,
      message: "Настройки главной страницы сохранены",
      hero: updatedConfig,
      savedTo: saved.path,
      savedAt: saved.savedAt,
      diagnostics: saved.diagnostics,
    })
  } catch (error) {
    console.error("Ошибка сохранения настроек главной страницы:", error)
    return NextResponse.json({ 
      success: false, 
      message: error instanceof Error ? error.message : "Ошибка сервера" 
    }, { status: 500 })
  }
}
