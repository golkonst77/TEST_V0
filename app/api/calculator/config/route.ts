import { NextRequest, NextResponse } from "next/server"
import { getCmsFileMeta, readCmsJsonOrInit, readCmsJsonStrict, writeCmsJson } from "@/lib/cms-storage"

export const dynamic = "force-dynamic"
export const revalidate = 0

const CALCULATOR_CONFIG_FILE = "calculator-config.json"
const DEFAULT_CALCULATOR_CONFIG = {
  services: {
    accounting: { price: 8000, description: "Бухгалтерский учет" },
    payroll: { price: 3000, description: "Зарплата и кадры" },
    legal: { price: 5000, description: "Юридическое сопровождение" },
    terminal: { price: 1850, description: "Кассовый терминал" },
  },
  multipliers: {
    taxSystems: {
      usn: 1,
      osn: 1.5,
      envd: 0.8,
      patent: 0.7,
    },
    employees: {
      "0": 1,
      "1-5": 1.2,
      "6-15": 1.5,
      "16-50": 2,
      "50+": 3,
    },
  },
}

export async function GET() {
  try {
    let data: typeof DEFAULT_CALCULATOR_CONFIG
    let source: "stored" | "initialized"
    let path: string

    if (process.env.NODE_ENV === "production") {
      const strict = await readCmsJsonStrict<typeof DEFAULT_CALCULATOR_CONFIG>(CALCULATOR_CONFIG_FILE)
      data = strict.data
      source = "stored"
      path = strict.path
    } else {
      const withInit = await readCmsJsonOrInit<typeof DEFAULT_CALCULATOR_CONFIG>(
        CALCULATOR_CONFIG_FILE,
        DEFAULT_CALCULATOR_CONFIG,
      )
      data = withInit.data
      source = withInit.source
      path = withInit.path
    }
    const meta = await getCmsFileMeta(CALCULATOR_CONFIG_FILE)
    return NextResponse.json({
      ...data,
      diagnostics: {
        source,
        path,
        mtime: meta.mtime,
      },
    }, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
  } catch (error) {
    console.error("Error fetching calculator config:", error)
    return NextResponse.json({ error: "Failed to fetch calculator config" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const newConfig = await request.json()
    
    // Валидация данных
    if (!newConfig.services || !newConfig.multipliers) {
      return NextResponse.json({ error: "Invalid config structure" }, { status: 400 })
    }

    const configToSave = {
      services: newConfig.services,
      multipliers: newConfig.multipliers,
    }
    const writeResult = await writeCmsJson(CALCULATOR_CONFIG_FILE, configToSave)
    const meta = await getCmsFileMeta(CALCULATOR_CONFIG_FILE)
    console.log("Calculator config updated:", writeResult)

    return NextResponse.json({
      success: true,
      message: "Calculator config updated successfully",
      timestamp: writeResult.savedAt,
      savedTo: writeResult.path,
      config: configToSave,
      diagnostics: {
        mtime: meta.mtime,
        size: meta.size,
      },
    })
  } catch (error) {
    console.error("Error updating calculator config:", error)
    return NextResponse.json({ error: "Failed to update calculator config" }, { status: 500 })
  }
}
