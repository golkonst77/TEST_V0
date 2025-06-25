import { type NextRequest, NextResponse } from "next/server"

// GET - получить тарифные планы
export async function GET() {
  try {
    const pricingData = {
      ip_plans: [
        {
          id: 1,
          name: "Старт",
          price: 2990,
          period: "мес",
          description: "Для начинающих ИП",
          is_popular: false,
          is_active: true,
          features: [
            "Ведение КУДиР",
            "Расчет и подача деклараций",
            "Консультации по налогам",
            "Сдача отчетности в ФНС",
            "Базовая поддержка",
          ],
        },
        {
          id: 2,
          name: "Оптимум",
          price: 4990,
          period: "мес",
          description: "Самый популярный тариф",
          is_popular: true,
          is_active: true,
          features: [
            "Все из тарифа Старт",
            "Ведение учета в 1С",
            "Расчет взносов ИП",
            "Консультации по оптимизации",
            "Приоритетная поддержка",
            "Личный кабинет",
          ],
        },
        {
          id: 3,
          name: "Премиум",
          price: 7990,
          period: "мес",
          description: "Для активных ИП",
          is_popular: false,
          is_active: true,
          features: [
            "Все из тарифа Оптимум",
            "Ведение кадрового учета",
            "Расчет зарплаты сотрудников",
            "Юридическое сопровождение",
            "Персональный менеджер",
            "Безлимитные консультации",
          ],
        },
      ],
      ooo_plans: [
        {
          id: 4,
          name: "Базовый",
          price: 8990,
          period: "мес",
          description: "Для малых ООО",
          is_popular: false,
          is_active: true,
          features: [
            "Ведение бухучета",
            "Сдача всех отчетов",
            "Расчет налогов",
            "Консультации бухгалтера",
            "Документооборот",
          ],
        },
        {
          id: 5,
          name: "Стандарт",
          price: 14990,
          period: "мес",
          description: "Оптимальное решение",
          is_popular: true,
          is_active: true,
          features: [
            "Все из тарифа Базовый",
            "Кадровое делопроизводство",
            "Расчет зарплаты",
            "Отчеты в ПФР и ФСС",
            "Юридические консультации",
            "Личный кабинет",
          ],
        },
        {
          id: 6,
          name: "Бизнес",
          price: 24990,
          period: "мес",
          description: "Для растущих компаний",
          is_popular: false,
          is_active: true,
          features: [
            "Все из тарифа Стандарт",
            "Управленческий учет",
            "Финансовая аналитика",
            "Налоговое планирование",
            "Персональный менеджер",
            "Сопровождение проверок",
          ],
        },
      ],
      additional_services: [
        { id: 1, name: "Регистрация ИП", price: 3990, description: "Под ключ за 3 дня", is_active: true },
        { id: 2, name: "Регистрация ООО", price: 9990, description: "Полное сопровождение", is_active: true },
        { id: 3, name: "Налоговая консультация", price: 2500, description: "1 час с экспертом", is_active: true },
        { id: 4, name: "Восстановление учета", price: 15000, description: "За период", is_active: true },
      ],
    }

    return NextResponse.json(pricingData)
  } catch (error) {
    console.error("Error fetching pricing data:", error)
    return NextResponse.json({ error: "Failed to fetch pricing data" }, { status: 500 })
  }
}

// PUT - обновить тарифные планы
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()

    console.log("Updating pricing data:", data)

    return NextResponse.json({ success: true, message: "Pricing updated successfully" })
  } catch (error) {
    console.error("Error updating pricing:", error)
    return NextResponse.json({ error: "Failed to update pricing" }, { status: 500 })
  }
}
