import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET() {
  try {
    // Читаем package.json
    const packagePath = join(process.cwd(), 'package.json')
    const packageJson = JSON.parse(readFileSync(packagePath, 'utf-8'))
    
    const version = packageJson.version
    const [major, minor, patch] = version.split('.')
    const build = `${major}${minor}${patch}`
    const date = new Date().toISOString().split('T')[0]
    
    return NextResponse.json({
      version,
      build,
      date,
      description: 'Cookie Consent Banner, Политика конфиденциальности ФЗ-152, блок соответствия законодательству'
    })
  } catch (error) {
    console.error('Ошибка чтения версии:', error)
    
    // Fallback версия
    return NextResponse.json({
      version: '1.0.19',
      build: '1019',
      date: '2025-11-28',
      description: 'Fallback version'
    })
  }
}
