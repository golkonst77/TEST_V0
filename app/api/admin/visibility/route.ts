import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 0

export async function POST(request: NextRequest) {
  try {
    const sectionsConfig = await request.json()
    console.log("VISIBILITY API RECEIVED", sectionsConfig)
    
    // Путь к файлу конфигурации
    const configPath = join(process.cwd(), 'data', 'homepage-sections.json')
    
    // Сохраняем конфигурацию в файл
    await writeFile(configPath, JSON.stringify(sectionsConfig, null, 2), 'utf-8')
    console.log("VISIBILITY SAVED CONFIG", sectionsConfig)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Настройки видимости сохранены',
      savedAt: new Date().toISOString(),
      config: sectionsConfig
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
