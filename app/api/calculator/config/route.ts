import { NextResponse } from "next/server"

// Этот endpoint будет использоваться фронтенд-компонентом калькулятора
// для получения актуальных цен и множителей

async function getActiveCalculatorConfig() {
  // В реальном приложении здесь будет запрос к БД
  // const servicesQuery = 'SELECT service_name, base_price, description FROM calculator_services WHERE is_active = true'
  // const multipliersQuery = 'SELECT multiplier_type, key_name, value FROM calculator_multipliers WHERE is_active = true'

  return {
    services: {
      accounting: { price: 3000, description: "Бухгалтерский учет" },
      payroll: { price: 1500, description: "Зарплата и кадры" },
      legal: { price: 2000, description: "Юридическое сопровождение" },
      registration: { price: 5000, description: "Регистрация фирм" },
    },
    multipliers: {
      taxSystems: {
        usn: 1.0,
        osn: 1.5,
        envd: 0.8,
        patent: 0.7,
      },
      employees: {
        "0": 1.0,
        "1-5": 1.2,
        "6-15": 1.5,
        "16-50": 2.0,
        "50+": 3.0,
      },
    },
  }
}

export async function GET() {
  try {
    const config = await getActiveCalculatorConfig()

    // Кэшируем ответ на 5 минут
    return NextResponse.json(config, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    })
  } catch (error) {
    console.error("Error fetching calculator config:", error)
    return NextResponse.json({ error: "Failed to fetch calculator config" }, { status: 500 })
  }
}
