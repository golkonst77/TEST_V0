import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET() {
  try {
    const versionPath = join(process.cwd(), 'version.json')
    const versionData = readFileSync(versionPath, 'utf8')
    const version = JSON.parse(versionData)
    
    return NextResponse.json(version)
  } catch (error) {
    console.error('Ошибка чтения версии:', error)
    return NextResponse.json(
      { 
        version: '1.0.0', 
        build: 'unknown', 
        date: new Date().toISOString().split('T')[0],
        description: 'Версия не найдена'
      },
      { status: 200 }
    )
  }
}
