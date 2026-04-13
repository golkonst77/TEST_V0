import { NextResponse } from "next/server"
import { getHeroConfig } from "@/lib/homepage-store"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  try {
    const config = getHeroConfig()
    console.log("Публичный API: Отправка настроек главной страницы")

    return NextResponse.json(config, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
  } catch (error) {
    console.error("Ошибка публичного API главной страницы:", error)
    return NextResponse.json({ status: "error", message: "Ошибка сервера" }, { status: 500 })
  }
}
