import { type NextRequest, NextResponse } from "next/server"
import { readFileSync, writeFileSync } from "fs"
import { join } from "path"
import { getHeroConfig } from "@/lib/homepage-store"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 0

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
    console.log("API RECEIVED BODY", JSON.stringify(body, null, 2))

    const updatedConfig = (body && typeof body === "object" && "hero" in body ? (body as any).hero : body) as unknown

    if (!updatedConfig || typeof updatedConfig !== "object") {
      return NextResponse.json({ success: false, message: "Неверные данные" }, { status: 400 })
    }

    const dataDir = join(process.cwd(), "data")
    const dataFile = join(dataDir, "homepage.json")
    console.log("PROCESS CWD", process.cwd())
    console.log("DATA FILE PATH", dataFile)

    const fs = require("fs")
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })

    writeFileSync(dataFile, JSON.stringify(updatedConfig, null, 2), "utf8")
    console.log("Saved homepage config", updatedConfig)

    const savedRaw = readFileSync(dataFile, "utf8")
    console.log("SAVED RAW FILE", savedRaw)

    return NextResponse.json({
      success: true,
      message: "Настройки главной страницы сохранены",
      hero: updatedConfig,
      savedTo: dataFile,
      savedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Ошибка сохранения настроек главной страницы:", error)
    return NextResponse.json({ 
      success: false, 
      message: error instanceof Error ? error.message : "Ошибка сервера" 
    }, { status: 500 })
  }
}
