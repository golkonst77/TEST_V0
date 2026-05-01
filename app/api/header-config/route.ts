import { NextResponse } from "next/server"
import { getHeaderConfig } from "@/lib/header-config-store"

export const dynamic = "force-dynamic"
export const revalidate = 0
export const runtime = "nodejs"

export async function GET() {
  try {
    const result = await getHeaderConfig()
    return NextResponse.json(
      {
        ...result.config,
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
    console.error("Failed to load header config:", error)
    return NextResponse.json({ error: "Failed to load header config" }, { status: 500 })
  }
}
