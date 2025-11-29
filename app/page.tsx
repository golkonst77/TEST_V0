import dynamic from 'next/dynamic'
import { Hero } from "@/components/hero"
import ClientHomePage from "@/components/client-home-page"

// Получаем конфигурацию hero на сервере (SSR)
async function getHeroConfig() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/homepage`, {
      cache: 'no-store', // Всегда свежие данные
    })
    if (response.ok) {
      return await response.json()
    }
  } catch (error) {
    console.error('Failed to fetch hero config:', error)
  }
  
  // Дефолт если не удалось загрузить
  return {
    badge: { text: 'Защищаем ваш бизнес', show: true },
    title: {
      text: 'ПростоБюро — бухгалтерия, с которой вы спокойно едете к своей мечте на',
      highlightText: 'круиз контроле!'
    },
    description: 'Полный аутсорсинг бухгалтерии для ИП и ООО. Всё прозрачно, вовремя и без головной боли.',
    button: { text: 'Хочу на круиз без штрафов', show: true },
    features: [],
    background: { image: '/uploads/hero-bg.webp', overlay: 0 },
    layout: {
      alignment: 'center',
      maxWidth: 'max-w-4xl',
      marginLeft: 0,
      marginTop: 0,
      marginBottom: 0,
      paddingX: 60
    }
  }
}

// Server Component - получаем данные на сервере
export default async function HomePage() {
  // Получаем конфигурацию Hero на сервере (до рендеринга!)
  const heroConfig = await getHeroConfig()
  
  return (
    <main id="home-page" className="min-h-screen">
      {/* Hero рендерится сразу с правильной конфигурацией */}
      <Hero initialConfig={heroConfig} />
      
      {/* Остальные компоненты через Client Component */}
      <ClientHomePage />
    </main>
  )
}
