import { NextResponse } from "next/server"
import { getCmsFileMeta, getCmsStorageDir, readCmsJson } from "@/lib/cms-storage"
import { getHomepageSectionsConfig } from "@/lib/visibility-store"
import { getHeroConfig } from "@/lib/homepage-store"

export const dynamic = "force-dynamic"
export const revalidate = 0
export const runtime = "nodejs"

async function safeRead(fileName: string) {
  try {
    return await readCmsJson<any>(fileName)
  } catch {
    return null
  }
}

export async function GET() {
  try {
    const [sections, hero, sectionsMeta, homepageMeta, calcMeta, pricingMeta, calcData, pricingData] = await Promise.all([
      getHomepageSectionsConfig(),
      getHeroConfig(),
      getCmsFileMeta("homepage-sections.json"),
      getCmsFileMeta("homepage.json"),
      getCmsFileMeta("calculator-config.json"),
      getCmsFileMeta("pricing-admin.json"),
      safeRead("calculator-config.json"),
      safeRead("pricing-admin.json"),
    ])

    return NextResponse.json(
      {
        success: true,
        storageDir: getCmsStorageDir(),
        now: new Date().toISOString(),
        files: {
          "homepage-sections.json": sectionsMeta,
          "homepage.json": homepageMeta,
          "calculator-config.json": calcMeta,
          "pricing-admin.json": pricingMeta,
        },
        sources: {
          visibility: sections.diagnostics,
          homepage: hero.diagnostics,
          settingsPersistence: {
            supabaseUrlConfigured: Boolean(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL),
            supabaseServiceKeyConfigured: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY),
          },
        },
        visibility: sections.config,
        calculator: calcData,
        pricing: pricingData,
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
    console.error("Storage debug endpoint error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown storage debug error",
      },
      { status: 500 },
    )
  }
}
