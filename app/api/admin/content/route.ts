import { NextRequest, NextResponse } from 'next/server'
import { getHomepageSectionsConfig, saveHomepageSectionsConfig } from "@/lib/visibility-store"

const SECTIONS_INFO = [
  { id: 1, title: "Главный баннер (Hero)", key: "hero", description: "Главный баннер с заголовком и призывом к действию", icon: "🎯" },
  { id: 2, title: "О компании", key: "about", description: "Информация о компании и преимуществах", icon: "🏢" },
  { id: 3, title: "Услуги", key: "services", description: "Список предоставляемых услуг", icon: "⚙️" },
  { id: 4, title: "Калькулятор", key: "calculator", description: "Калькулятор стоимости услуг", icon: "🧮" },
  { id: 5, title: "Тарифы", key: "pricing", description: "Тарифные планы и цены", icon: "💰" },
  { id: 6, title: "Отзывы", key: "reviews", description: "Отзывы клиентов", icon: "⭐" },
  { id: 7, title: "Гарантии", key: "guarantees", description: "Гарантии и обязательства", icon: "🛡️" },
  { id: 8, title: "FAQ", key: "faq", description: "Часто задаваемые вопросы", icon: "❓" },
  { id: 9, title: "Новости", key: "news", description: "Новости и статьи", icon: "📰" },
  { id: 10, title: "Контакты", key: "contacts", description: "Контактная информация", icon: "📞" },
  { id: 11, title: "Технологии", key: "technologies", description: "Используемые технологии", icon: "🔧" },
  { id: 12, title: "AI Документы", key: "ai-documents", description: "Блок AI документов", icon: "🤖" },
  { id: 13, title: "Плашка АУСН", key: "ausn-blob", description: "Плавающая кнопка АУСН", icon: "🟣" },
  { id: 14, title: "Плашка Риски", key: "risk-blob", description: "Плавающая кнопка Риски", icon: "🟪" },
]

async function buildSectionsResponse() {
  const { config } = await getHomepageSectionsConfig()
  const now = new Date().toISOString().split("T")[0]
  return SECTIONS_INFO.map((section) => ({
    ...section,
    status: config[section.key]?.desktop === "draft" ? "draft" : "published",
    updated: now,
  }))
}

export async function GET() {
  try {
    const sections = await buildSectionsResponse()
    return NextResponse.json(sections)
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
      const section = SECTIONS_INFO.find(s => s.id === sectionId)
      if (!section) {
        return NextResponse.json({ error: 'Section not found' }, { status: 404 })
      }

      const { config } = await getHomepageSectionsConfig()
      const current = config[section.key] || { desktop: "published", mobile: "published" }
      const nextStatus = current.desktop === "published" ? "draft" : "published"
      const nextConfig = {
        ...config,
        [section.key]: { desktop: nextStatus, mobile: nextStatus },
      }
      await saveHomepageSectionsConfig(nextConfig)

      const updatedSection = {
        ...section,
        status: nextStatus,
        updated: new Date().toISOString().split("T")[0],
      }

      return NextResponse.json({ 
        success: true, 
        section: updatedSection,
        message: `Секция "${section.title}" ${nextStatus === 'published' ? 'включена' : 'отключена'}`
      })
    }

    if (action === 'update-order') {
      return NextResponse.json({ 
        success: true, 
        message: 'Порядок секций сохраняется в текущем UI и не влияет на visibility'
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error updating section:', error)
    return NextResponse.json({ error: 'Failed to update section' }, { status: 500 })
  }
} 