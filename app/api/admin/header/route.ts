import { type NextRequest, NextResponse } from "next/server"

// Временное хранилище настроек шапки
let headerConfig = {
  header: {
    logo: {
      text: "ПростоБюро",
      show: true,
    },
    phone: {
      number: "+7 953 330-17-77",
      show: true,
    },
    social: {
      telegram: "https://t.me/prostoburo",
      vk: "https://m.vk.com/buh_urist?from=groups",
      show: true,
    },
    ctaButton: {
      text: "Получить скидку",
      show: true,
    },
    menuItems: [
      {
        id: "services",
        title: "Услуги",
        href: "/services",
        show: true,
        type: "dropdown",
        children: [
          { id: "accounting", title: "Бухгалтерия", href: "/services/accounting", show: true, type: "link" },
          { id: "payroll", title: "Зарплата и кадры", href: "/services/payroll", show: true, type: "link" },
          { id: "legal", title: "Юридическое сопровождение", href: "/services/legal", show: true, type: "link" },
          { id: "registration", title: "Регистрация фирм", href: "/services/registration", show: true, type: "link" },
        ],
      },
      {
        id: "pricing",
        title: "Тарифы",
        href: "/pricing",
        show: true,
        type: "dropdown",
        children: [
          { id: "ip", title: "Для ИП", href: "/pricing/ip", show: true, type: "link" },
          { id: "ooo", title: "Для ООО", href: "/pricing/ooo", show: true, type: "link" },
        ],
      },
      { id: "calculator", title: "Калькулятор", href: "/calculator", show: true, type: "link" },
      { id: "about", title: "О компании", href: "/about", show: true, type: "link" },
      { id: "blog", title: "Блог", href: "/blog", show: true, type: "link" },
      { id: "contacts", title: "Контакты", href: "/contacts", show: true, type: "link" },
    ],
    layout: {
      sticky: true,
      background: "white",
      height: 64,
    },
  },
}

export async function GET() {
  try {
    return NextResponse.json(headerConfig)
  } catch (error) {
    console.error("Error fetching header config:", error)
    return NextResponse.json({ error: "Failed to fetch config" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    headerConfig = { ...headerConfig, ...body }
    return NextResponse.json({ success: true, config: headerConfig })
  } catch (error) {
    console.error("Error updating header config:", error)
    return NextResponse.json({ error: "Failed to update config" }, { status: 500 })
  }
}
