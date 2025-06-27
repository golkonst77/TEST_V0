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

// Настройки по умолчанию
let heroConfig: HeroConfig = {
  badge: { text: "Защищаем ваш бизнес от налоговых рисков", show: true },
  title: { text: "Ваш личный", highlightText: "щит" },
  description:
    "Пока вы строите свою империю, мы защищаем её тылы от проверок, штрафов и бумажной волокиты. Спокойно занимайтесь завоеванием мира.",
  button: { text: "Хочу на круиз без штрафов", show: true },
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
  background: { image: "/hero-bg.jpg", overlay: 30 },
  layout: {
    alignment: "left",
    maxWidth: "max-w-2xl",
    marginLeft: 80,
    marginTop: 0,
    marginBottom: 0,
    paddingX: 20,
  },
}

export function getHeroConfig(): HeroConfig {
  console.log("Получение настроек главной страницы:", heroConfig)
  return heroConfig
}

export function updateHeroConfig(newConfig: Partial<HeroConfig>): HeroConfig {
  console.log("Обновление настроек главной страницы:", newConfig)
  heroConfig = { ...heroConfig, ...newConfig }
  console.log("Новые настройки:", heroConfig)
  return heroConfig
}

export type { HeroConfig }
