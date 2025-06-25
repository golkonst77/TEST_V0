import { type NextRequest, NextResponse } from "next/server"

// Здесь будет подключение к вашей базе данных
// Например, для PostgreSQL с библиотекой pg или для других БД
// import { Pool } from 'pg'
// const pool = new Pool({ connectionString: process.env.DATABASE_URL })

// Временная функция для симуляции работы с БД
async function getCalculatorDataFromDB() {
  // В реальном приложении здесь будет запрос к БД
  // const servicesQuery = 'SELECT * FROM calculator_services WHERE is_active = true ORDER BY id'
  // const multipliersQuery = 'SELECT * FROM calculator_multipliers WHERE is_active = true ORDER BY multiplier_type, sort_order'

  return {
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
}

async function updateCalculatorDataInDB(data: any) {
  // В реальном приложении здесь будут UPDATE запросы к БД
  // Например:
  // for (const service of data.services) {
  //   await pool.query(
  //     'UPDATE calculator_services SET base_price = $1, description = $2, is_active = $3 WHERE id = $4',
  //     [service.base_price, service.description, service.is_active, service.id]
  //   )
  // }

  console.log("Updating calculator data:", data)
  return true
}

// GET - получить настройки калькулятора
export async function GET() {
  try {
    const calculatorData = await getCalculatorDataFromDB()
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

    // Валидация данных
    if (!data.services || !data.multipliers) {
      return NextResponse.json({ error: "Invalid data structure" }, { status: 400 })
    }

    await updateCalculatorDataInDB(data)

    return NextResponse.json({
      success: true,
      message: "Calculator updated successfully",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error updating calculator:", error)
    return NextResponse.json({ error: "Failed to update calculator" }, { status: 500 })
  }
}
