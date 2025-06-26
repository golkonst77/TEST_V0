import { NextResponse } from "next/server"

// Моковые данные конфигурации калькулятора
const calculatorConfig = {
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
