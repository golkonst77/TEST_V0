import { NextRequest, NextResponse } from 'next/server'
import { saveHomepageSectionsConfig } from "@/lib/visibility-store"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 0

export async function POST(request: NextRequest) {
  try {
    const sectionsConfig = await request.json()
    console.log("VISIBILITY API RECEIVED", sectionsConfig)
    const saved = await saveHomepageSectionsConfig(sectionsConfig)
    console.log("VISIBILITY SAVED CONFIG", saved)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Настройки видимости сохранены',
      savedAt: saved.savedAt,
      config: saved.config,
      diagnostics: saved.diagnostics,
      savedTo: saved.path,
    })
  } catch (error) {
    console.error('Error saving visibility config:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Ошибка сохранения настроек видимости'
      },
      { status: 500 }
    )
  }
}
