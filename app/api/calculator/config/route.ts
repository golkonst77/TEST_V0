import { NextRequest, NextResponse } from "next/server"

// Моковые данные конфигурации калькулятора
let calculatorConfig = {
  services: {
    accounting: { price: 3000, description: "Бухгалтерский учет" },
    payroll: { price: 1500, description: "Зарплата и кадры" },
    legal: { price: 2000, description: "Юридическое сопровождение" },
    registration: { price: 5000, description: "Регистрация фирм" },
  },
  multipliers: {
    taxSystems: {
      usn: 1,
      osn: 1.5,
      envd: 0.8,
      patent: 0.7,
    },
    employees: {
      "0": 1,
      "1-5": 1.2,
      "6-15": 1.5,
      "16-50": 2,
      "50+": 3,
    },
  },
}

export async function GET() {
  try {
    return NextResponse.json(calculatorConfig)
  } catch (error) {
    console.error("Error fetching calculator config:", error)
    return NextResponse.json({ error: "Failed to fetch calculator config" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const newConfig = await request.json()
    
    // Валидация данных
    if (!newConfig.services || !newConfig.multipliers) {
      return NextResponse.json({ error: "Invalid config structure" }, { status: 400 })
    }

    // Обновляем конфигурацию
    calculatorConfig = {
      services: newConfig.services,
      multipliers: newConfig.multipliers,
    }

    console.log("Calculator config updated:", calculatorConfig)

    return NextResponse.json({
      success: true,
      message: "Calculator config updated successfully",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error updating calculator config:", error)
    return NextResponse.json({ error: "Failed to update calculator config" }, { status: 500 })
  }
}
