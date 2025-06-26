import { type NextRequest, NextResponse } from "next/server"

// Временное хранилище настроек (в продакшене использовать базу данных)
let heroConfig = {
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

export async function GET() {
  return NextResponse.json({
    success: true,
    hero: heroConfig,
  })
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    if (body.hero) {
      heroConfig = { ...heroConfig, ...body.hero }

      return NextResponse.json({
        success: true,
        message: "Настройки сохранены",
        hero: heroConfig,
      })
    }

    return NextResponse.json({ success: false, message: "Неверные данные" }, { status: 400 })
  } catch (error) {
    console.error("Ошибка сохранения настроек:", error)
    return NextResponse.json({ success: false, message: "Ошибка сервера" }, { status: 500 })
  }
}
