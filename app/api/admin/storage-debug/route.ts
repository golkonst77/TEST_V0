import { NextResponse } from "next/server"
import { getCmsStorageDiagnostics, readCmsJson } from "@/lib/cms-storage"
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
    const [sections, hero, calcData, pricingData, diagnostics] = await Promise.all([
      getHomepageSectionsConfig(),
      getHeroConfig(),
      safeRead("calculator-config.json"),
      safeRead("pricing-admin.json"),
      getCmsStorageDiagnostics([
        "homepage.json",
        "homepage-sections.json",
        "pricing-admin.json",
        "calculator-config.json",
        "header-config.json",
      ]),
    ])

    return NextResponse.json(
      {
        success: true,
        nodeEnv: diagnostics.nodeEnv,
        cmsStorageDirEnv: diagnostics.cmsStorageDirEnv,
        storageDir: diagnostics.resolvedStorageDir,
        storageDirExists: diagnostics.storageDirExists,
        storageDirWritable: diagnostics.storageDirWritable,
        processCwd: diagnostics.processCwd,
        processPid: process.pid,
        processPmId: process.env.pm_id || null,
        processPm2Home: process.env.PM2_HOME || null,
        now: new Date().toISOString(),
        files: diagnostics.files,
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
        cwd: process.cwd(),
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
