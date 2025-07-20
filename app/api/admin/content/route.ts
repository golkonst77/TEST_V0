import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile } from 'fs/promises'
import { join } from 'path'

// Секции главной страницы
const homepageSections = [
  { 
    id: 1, 
    title: "Главный баннер (Hero)", 
    key: "hero", 
    status: "published", 
    updated: "2024-01-15", 
    description: "Главный баннер с заголовком и призывом к действию",
    icon: "🎯"
  },
  { 
    id: 2, 
    title: "О компании", 
    key: "about", 
    status: "published", 
    updated: "2024-01-10", 
    description: "Информация о компании и преимуществах",
    icon: "🏢"
  },
  { 
    id: 3, 
    title: "Услуги", 
    key: "services", 
    status: "published", 
    updated: "2024-01-12", 
    description: "Список предоставляемых услуг",
    icon: "⚙️"
  },
  { 
    id: 4, 
    title: "Калькулятор", 
    key: "calculator", 
    status: "published", 
    updated: "2024-01-14", 
    description: "Калькулятор стоимости услуг",
    icon: "🧮"
  },
  { 
    id: 5, 
    title: "Тарифы", 
    key: "pricing", 
    status: "published", 
    updated: "2024-01-13", 
    description: "Тарифные планы и цены",
    icon: "💰"
  },
  { 
    id: 6, 
    title: "Отзывы", 
    key: "reviews", 
    status: "published", 
    updated: "2024-01-11", 
    description: "Отзывы клиентов",
    icon: "⭐"
  },
  { 
    id: 7, 
    title: "Гарантии", 
    key: "guarantees", 
    status: "published", 
    updated: "2024-01-09", 
    description: "Гарантии и обязательства",
    icon: "🛡️"
  },
  { 
    id: 8, 
    title: "FAQ", 
    key: "faq", 
    status: "published", 
    updated: "2024-01-16", 
    description: "Часто задаваемые вопросы",
    icon: "❓"
  },
  { 
    id: 9, 
    title: "Новости", 
    key: "news", 
    status: "published", 
    updated: "2024-01-16", 
    description: "Новости и статьи",
    icon: "📰"
  },
  { 
    id: 10, 
    title: "Контакты", 
    key: "contacts", 
    status: "published", 
    updated: "2024-01-16", 
    description: "Контактная информация",
    icon: "📞"
  },
  { 
    id: 11, 
    title: "Технологии", 
    key: "technologies", 
    status: "published", 
    updated: "2024-01-16", 
    description: "Используемые технологии",
    icon: "🔧"
  }
]

// Функция для сохранения настроек секций в файл
async function saveSectionsConfig() {
  try {
    const configPath = join(process.cwd(), 'data', 'homepage-sections.json')
    
    // Создаем объект статусов секций
    const sectionsConfig = homepageSections.reduce((acc, section) => {
      acc[section.key] = section.status as 'published' | 'draft'
      return acc
    }, {} as Record<string, 'published' | 'draft'>)
    
    // Сохраняем конфигурацию в файл
    await writeFile(configPath, JSON.stringify(sectionsConfig, null, 2), 'utf-8')
    
    console.log('Homepage sections config saved')
  } catch (error) {
    console.error('Error saving sections config:', error)
  }
}

export async function GET() {
  try {
    return NextResponse.json(homepageSections)
  } catch (error) {
    console.error('Error fetching sections:', error)
    return NextResponse.json({ error: 'Failed to fetch sections' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, sectionId } = body

    if (action === 'toggle-status') {
      const section = homepageSections.find(s => s.id === sectionId)
      if (!section) {
        return NextResponse.json({ error: 'Section not found' }, { status: 404 })
      }

      // Переключаем статус
      section.status = section.status === 'published' ? 'draft' : 'published'
      section.updated = new Date().toISOString().split('T')[0]

      // Сохраняем конфигурацию
      await saveSectionsConfig()

      return NextResponse.json({ 
        success: true, 
        section,
        message: `Секция "${section.title}" ${section.status === 'published' ? 'включена' : 'отключена'}`
      })
    }

    if (action === 'update-order') {
      const { sections } = body
      
      // Обновляем порядок секций
      sections.forEach((sectionData: any) => {
        const section = homepageSections.find(s => s.id === sectionData.id)
        if (section) {
          section.updated = new Date().toISOString().split('T')[0]
        }
      })

      // Сохраняем конфигурацию
      await saveSectionsConfig()

      return NextResponse.json({ 
        success: true, 
        message: 'Порядок секций обновлен'
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error updating section:', error)
    return NextResponse.json({ error: 'Failed to update section' }, { status: 500 })
  }
} 