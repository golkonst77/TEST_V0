import { NextResponse } from "next/server"
import { getHeroConfig } from "@/lib/homepage-store"

export async function GET() {
  try {
    const config = getHeroConfig()
    console.log("Публичный API: Отправка настроек главной страницы")

    return NextResponse.json({
      status: "ok",
      message: "Homepage API working",
      hero: config,
    })
  } catch (error) {
    console.error("Ошибка публичного API главной страницы:", error)
    return NextResponse.json({ status: "error", message: "Ошибка сервера" }, { status: 500 })
  }
}
