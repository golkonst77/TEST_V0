import { NextResponse } from "next/server"
import { getSettings } from "@/lib/settings-store"

export async function GET() {
  try {
    const settings = await getSettings()
    console.log("Public API - returning settings:", settings)
    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error fetching public settings:", error)
    return NextResponse.json({ error: "Ошибка получения настроек" }, { status: 500 })
  }
}
