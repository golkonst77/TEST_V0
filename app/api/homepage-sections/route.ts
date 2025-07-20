import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

export async function GET() {
  try {
    const configPath = join(process.cwd(), 'data', 'homepage-sections.json')
    const configContent = await readFile(configPath, 'utf-8')
    const config = JSON.parse(configContent)
    
    return NextResponse.json(config)
  } catch (error) {
    console.error('Error reading sections config:', error)
    
    // Fallback к дефолтной конфигурации
    const defaultConfig = {
      hero: 'published',
      about: 'published',
      services: 'published',
      calculator: 'published',
      pricing: 'published',
      reviews: 'published',
      guarantees: 'published',
      faq: 'published',
      news: 'published',
      contacts: 'published',
      technologies: 'published'
    }
    
    return NextResponse.json(defaultConfig)
  }
} 