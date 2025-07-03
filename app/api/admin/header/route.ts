import { type NextRequest, NextResponse } from "next/server"
import fs from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'header.json')

// Дефолтная конфигурация
const defaultHeaderConfig = {
  header: {
    logo: {
      text: "ПростоБюро",
      show: true,
      type: "text",
      imageUrl: "",
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
      { id: "contacts", title: "Контакты", href: "#contacts", show: true, type: "link" },
    ],
    layout: {
      sticky: true,
      background: "white",
      height: 64,
    },
  },
}

// Функция для чтения данных из файла
function readHeaderConfig() {
  try {
    // Создаем директорию data если её нет
    const dataDir = path.dirname(DATA_FILE)
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8')
      return JSON.parse(data)
    } else {
      // Если файла нет, создаем его с дефолтными данными
      fs.writeFileSync(DATA_FILE, JSON.stringify(defaultHeaderConfig, null, 2))
      return defaultHeaderConfig
    }
  } catch (error) {
    console.error('Error reading header config:', error)
    return defaultHeaderConfig
  }
}

// Функция для записи данных в файл
function writeHeaderConfig(config: any) {
  try {
    const dataDir = path.dirname(DATA_FILE)
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
    
    fs.writeFileSync(DATA_FILE, JSON.stringify(config, null, 2))
    return true
  } catch (error) {
    console.error('Error writing header config:', error)
    return false
  }
}

export async function GET() {
  try {
    const headerConfig = readHeaderConfig()
    console.log("Header API GET: Returning config:", JSON.stringify(headerConfig, null, 2))
    return NextResponse.json(headerConfig)
  } catch (error) {
    console.error("Error fetching header config:", error)
    return NextResponse.json({ error: "Failed to fetch config" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("Header API PUT: Received body:", JSON.stringify(body, null, 2))
    
    // Читаем текущую конфигурацию
    const currentConfig = readHeaderConfig()
    
    // Обновляем конфигурацию
    const updatedConfig = { ...currentConfig, ...body }
    
    // Сохраняем в файл
    const success = writeHeaderConfig(updatedConfig)
    
    if (success) {
      console.log("Header API PUT: Successfully saved config")
      console.log("Header API PUT: Logo config specifically:", JSON.stringify(updatedConfig.header.logo, null, 2))
      return NextResponse.json({ success: true, config: updatedConfig })
    } else {
      return NextResponse.json({ error: "Failed to save config" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error updating header config:", error)
    return NextResponse.json({ error: "Failed to update config" }, { status: 500 })
  }
}
