import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    const sectionsConfig = await request.json()
    
    // Путь к файлу конфигурации
    const configPath = join(process.cwd(), 'data', 'homepage-sections.json')
    
    // Сохраняем конфигурацию в файл
    await writeFile(configPath, JSON.stringify(sectionsConfig, null, 2), 'utf-8')
    
    return NextResponse.json({ 
      success: true, 
      message: 'Настройки видимости успешно сохранены' 
    })
  } catch (error) {
    console.error('Error saving visibility config:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Ошибка сохранения настроек видимости' 
      },
      { status: 500 }
    )
  }
}
