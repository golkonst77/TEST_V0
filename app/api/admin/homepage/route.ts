import { type NextRequest, NextResponse } from "next/server"

// Временное хранилище настроек (в реальном проекте используйте базу данных)
let homepageConfig = {
  hero: {
    badge: {
      text: "Защищаем ваш бизнес от налоговых рисков",
      show: true,
    },
    title: {
      text: "Ваш личный",
      highlightText: "щит",
    },
    description:
      "Пока вы строите свою империю, мы защищаем её тылы от проверок, штрафов и бумажной волокиты. Спокойно занимайтесь завоеванием мира.",
    button: {
      text: "Хочу на круиз без штрафов",
      show: true,
    },
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
    background: {
      image: "/hero-bg.jpg",
      overlay: 30,
    },
    layout: {
      alignment: "left" as const,
      maxWidth: "max-w-2xl",
    },
  },
}

export async function GET() {
  try {
    return NextResponse.json(homepageConfig)
  } catch (error) {
    console.error("Error fetching homepage config:", error)
    return NextResponse.json({ error: "Failed to fetch config" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    // Простая проверка авторизации (в реальном проекте используйте JWT)
    const authHeader = request.headers.get("authorization")
    // Для демо пропускаем проверку авторизации

    // Обновляем конфигурацию
    homepageConfig = { ...homepageConfig, ...body }

    return NextResponse.json({ success: true, config: homepageConfig })
  } catch (error) {
    console.error("Error updating homepage config:", error)
    return NextResponse.json({ error: "Failed to update config" }, { status: 500 })
  }
}
