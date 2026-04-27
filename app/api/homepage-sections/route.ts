import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  try {
    const configPath = join(process.cwd(), 'data', 'homepage-sections.json')
    console.log("READING HOMEPAGE SECTIONS FROM", configPath)
    const configContent = await readFile(configPath, 'utf-8')
    const config = JSON.parse(configContent)
    
    // Проверяем, является ли конфигурация в новом формате (с desktop/mobile)
    const isNewFormat = Object.values(config).every(value => 
      typeof value === 'object' && value !== null && 'desktop' in value && 'mobile' in value
    )
    
    if (isNewFormat) {
      return NextResponse.json(config, {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      })
    }
    
    // Преобразуем старый формат в новый
    const newConfig = {}
    Object.keys(config).forEach(key => {
      const value = config[key]
      if (typeof value === 'string') {
        newConfig[key] = { desktop: value, mobile: value }
      } else if (typeof value === 'object' && value !== null) {
        newConfig[key] = value
      }
    })
    
    return NextResponse.json(newConfig, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
  } catch (error) {
    console.error('Error reading sections config:', error)
    
    // Fallback к дефолтной конфигурации
    const defaultConfig = {
      hero: { desktop: 'published', mobile: 'published' },
      about: { desktop: 'published', mobile: 'published' },
      services: { desktop: 'published', mobile: 'published' },
      calculator: { desktop: 'published', mobile: 'published' },
      pricing: { desktop: 'published', mobile: 'published' },
      reviews: { desktop: 'published', mobile: 'published' },
      guarantees: { desktop: 'published', mobile: 'published' },
      faq: { desktop: 'published', mobile: 'published' },
      news: { desktop: 'published', mobile: 'published' },
      contacts: { desktop: 'published', mobile: 'published' },
      technologies: { desktop: 'published', mobile: 'published' },
      'ai-documents': { desktop: 'published', mobile: 'published' }
    }
    
    return NextResponse.json(defaultConfig, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
  }
} 