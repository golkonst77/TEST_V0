import { type NextRequest, NextResponse } from "next/server"

// GET - получить настройки калькулятора
export async function GET() {
  try {
    // Здесь будет подключение к базе данных
    // Пока возвращаем моковые данные
    const calculatorData = {
      services: [
        { id: 1, service_name: "accounting", base_price: 3000, description: "Бухгалтерский учет", is_active: true },
        { id: 2, service_name: "payroll", base_price: 1500, description: "Зарплата и кадры", is_active: true },
        { id: 3, service_name: "legal", base_price: 2000, description: "Юридическое сопровождение", is_active: true },
        { id: 4, service_name: "registration", base_price: 5000, description: "Регистрация фирм", is_active: true },
      ],
      multipliers: {
        tax_systems: [
          { id: 1, key: "usn", value: 1.0, label: "УСН", is_active: true },
          { id: 2, key: "osn", value: 1.5, label: "ОСН", is_active: true },
          { id: 3, key: "envd", value: 0.8, label: "ЕНВД", is_active: true },
          { id: 4, key: "patent", value: 0.7, label: "Патент", is_active: true },
        ],
        employees: [
          { id: 5, key: "0", value: 1.0, label: "0 сотрудников", is_active: true },
          { id: 6, key: "1-5", value: 1.2, label: "1-5 сотрудников", is_active: true },
          { id: 7, key: "6-15", value: 1.5, label: "6-15 сотрудников", is_active: true },
          { id: 8, key: "16-50", value: 2.0, label: "16-50 сотрудников", is_active: true },
          { id: 9, key: "50+", value: 3.0, label: "50+ сотрудников", is_active: true },
        ],
      },
    }

    return NextResponse.json(calculatorData)
  } catch (error) {
    console.error("Error fetching calculator data:", error)
    return NextResponse.json({ error: "Failed to fetch calculator data" }, { status: 500 })
  }
}

// PUT - обновить настройки калькулятора
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()

    // Здесь будет логика обновления в базе данных
    console.log("Updating calculator data:", data)

    // Пока просто возвращаем успех
    return NextResponse.json({ success: true, message: "Calculator updated successfully" })
  } catch (error) {
    console.error("Error updating calculator:", error)
    return NextResponse.json({ error: "Failed to update calculator" }, { status: 500 })
  }
}
