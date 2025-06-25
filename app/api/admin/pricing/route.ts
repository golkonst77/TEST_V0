import { type NextRequest, NextResponse } from "next/server"

// Моковые данные для тарифов
const mockPricingData = {
  plans: [
    {
      id: 1,
      name: "Базовый",
      price: 3000,
      description: "Подходит для малого бизнеса",
      features: [
        "Ведение бухгалтерского учета",
        "Подготовка отчетности",
        "Консультации по телефону",
        "1С: Бухгалтерия",
      ],
      is_popular: false,
      is_active: true,
    },
    {
      id: 2,
      name: "Стандарт",
      price: 5000,
      description: "Оптимальный выбор для среднего бизнеса",
      features: [
        "Все из тарифа Базовый",
        "Кадровое делопроизводство",
        "Расчет заработной платы",
        "Персональный менеджер",
        "Юридические консультации",
      ],
      is_popular: true,
      is_active: true,
    },
    {
      id: 3,
      name: "Премиум",
      price: 8000,
      description: "Полный спектр услуг для крупного бизнеса",
      features: [
        "Все из тарифа Стандарт",
        "Налоговое планирование",
        "Представительство в налоговой",
        "Финансовый анализ",
        "Управленческая отчетность",
        "24/7 поддержка",
      ],
      is_popular: false,
      is_active: true,
    },
  ],
}

export async function GET() {
  try {
    return NextResponse.json(mockPricingData)
  } catch (error) {
    console.error("Error fetching pricing data:", error)
    return NextResponse.json({ error: "Failed to fetch pricing data" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()

    // Здесь будет логика обновления в базе данных
    console.log("Updating pricing data:", data)

    return NextResponse.json({
      success: true,
      message: "Pricing updated successfully",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error updating pricing:", error)
    return NextResponse.json({ error: "Failed to update pricing" }, { status: 500 })
  }
}
