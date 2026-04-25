import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

// Хранилище настроек главной страницы
interface HeroConfig {
  badge: {
    text: string
    show: boolean
  }
  title: {
    text: string
    highlightText: string
  }
  description: string
  button: {
    text: string
    show: boolean
  }
  features: Array<{
    id: string
    title: string
    description: string
    icon: string
    color: string
    show: boolean
  }>
  background: {
    image: string
    overlay: number
  }
  layout: {
    alignment: string
    maxWidth: string
    marginLeft: number
    marginTop: number
    marginBottom: number
    paddingX: number
  }
}

const DATA_FILE = join(process.cwd(), 'data', 'homepage.json')

// Настройки по умолчанию
const defaultHeroConfig: HeroConfig = {
  badge: { text: "Защищаем ваш бизнес от налоговых рисков", show: true },
  title: { text: "Бухгалтерия на аутсорсе без", highlightText: "ошибок и штрафов" },
  description:
    "Берём на себя ведение бухгалтерии, отчётность и налоги. Снижаем нагрузку на бизнес и помогаем экономить до 50%.",
  button: { text: "Получить бесплатную консультацию", show: true },
  features: [
    {
      id: "expensive",
      title: "Дорого",
      description: "Штрафы и пени съедают прибыль",
      icon: "DollarSign",
      color: "red",
      show: true,
    },
    {
      id: "scary",
      title: "Страшно",
      description: "Проверки и бумажная волокита",
      icon: "AlertTriangle",
      color: "orange",
      show: true,
    },
    {
      id: "perfect",
      title: "Идеально",
      description: "Спокойствие и рост бизнеса",
      icon: "CheckCircle",
      color: "green",
      show: true,
    },
  ],
  background: { image: "/uploads/1751554532718________.jpg", overlay: 70 },
  layout: {
    alignment: "center",
    maxWidth: "max-w-4xl",
    marginLeft: 0,
    marginTop: 0,
    marginBottom: 0,
    paddingX: 20,
  },
}

export function getHeroConfig(): HeroConfig {
  try {
    const data = readFileSync(DATA_FILE, 'utf8')
    const config = JSON.parse(data)
    console.log('Получение настроек главной страницы:', config)
    return config
  } catch (error) {
    console.error('Ошибка чтения файла настроек главной страницы:', error)
    return defaultHeroConfig
  }
}

export function updateHeroConfig(newConfig: Partial<HeroConfig>): HeroConfig {
  console.log("Обновление настроек главной страницы:", newConfig)
  
  const currentConfig = getHeroConfig()
  
  // Глубокое слияние для правильного обновления вложенных объектов
  const updatedConfig = {
    ...currentConfig,
    ...newConfig,
    badge: newConfig.badge ? { ...currentConfig.badge, ...newConfig.badge } : currentConfig.badge,
    title: newConfig.title ? { ...currentConfig.title, ...newConfig.title } : currentConfig.title,
    button: newConfig.button ? { ...currentConfig.button, ...newConfig.button } : currentConfig.button,
    background: newConfig.background ? { ...currentConfig.background, ...newConfig.background } : currentConfig.background,
    layout: newConfig.layout ? { ...currentConfig.layout, ...newConfig.layout } : currentConfig.layout,
    features: newConfig.features || currentConfig.features
  }
  
  try {
    // Проверяем что директория data существует
    const dataDir = join(process.cwd(), 'data')
    const fs = require('fs')
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
      console.log("Создана директория data/")
    }
    
    // Сохраняем конфигурацию
    writeFileSync(DATA_FILE, JSON.stringify(updatedConfig, null, 2), 'utf8')
    console.log("✅ Настройки успешно сохранены в файл:", DATA_FILE)
  } catch (error) {
    console.error("❌ Ошибка сохранения настроек в файл:", error)
    throw new Error(`Не удалось сохранить настройки: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
  
  console.log("Новые настройки:", updatedConfig)
  return updatedConfig
}

export type { HeroConfig }
