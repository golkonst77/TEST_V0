import { NextRequest, NextResponse } from "next/server"
import { getHeaderConfig, saveHeaderConfig } from "@/lib/header-config-store"

export const dynamic = "force-dynamic"
export const revalidate = 0
export const runtime = "nodejs"

export async function GET() {
  try {
    const result = await getHeaderConfig()
    return NextResponse.json(
      {
        success: true,
        config: result.config,
        diagnostics: {
          source: result.source,
          path: result.path,
        },
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    )
  } catch (error) {
    console.error("Failed to load admin header config:", error)
    return NextResponse.json({ success: false, error: "Failed to load header config" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const saved = await saveHeaderConfig({
      ctaText: body?.ctaText,
      menuItems: body?.menuItems,
    })
    return NextResponse.json({
      success: true,
      savedAt: saved.savedAt,
      savedTo: saved.path,
      backupPath: saved.backupPath,
    })
  } catch (error) {
    console.error("Failed to save admin header config:", error)
    return NextResponse.json({ success: false, error: "Failed to save header config" }, { status: 500 })
  }
}
