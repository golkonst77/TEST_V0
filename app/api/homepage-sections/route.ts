import { NextResponse } from 'next/server'
import { getHomepageSectionsConfig } from "@/lib/visibility-store"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  try {
    const { config, diagnostics } = await getHomepageSectionsConfig()
    console.log("HOMEPAGE SECTIONS LOADED", diagnostics)

    return NextResponse.json(config, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
  } catch (error) {
    console.error('Error reading sections config:', error)
    return NextResponse.json(
      { error: "Failed to load homepage sections config" },
      { status: 500 },
    )
  }
} 