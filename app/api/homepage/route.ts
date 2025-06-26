import { NextResponse } from "next/server"

// Обновленная конфигурация с отступами
const defaultHeroConfig = {
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

// GET /api/homepage
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Homepage API working",
    hero: defaultHeroConfig,
  })
}
