import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET() {
  try {
    // Ищем файл в папке public
    const versionPath = join(process.cwd(), 'public', 'version.json')
    const versionData = readFileSync(versionPath, 'utf8')
    const version = JSON.parse(versionData)
    
    return NextResponse.json(version)
  } catch (error) {
    console.error('Ошибка чтения версии:', error)
    return NextResponse.json(
      { 
        version: '1.0.2', 
        build: '102', 
        date: '2025-09-04',
        description: 'Версия не найдена'
      },
      { status: 200 }
    )
  }
}
