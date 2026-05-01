import { type NextRequest, NextResponse } from "next/server"
import { getCmsFileMeta, readCmsJsonOrInit, writeCmsJson } from "@/lib/cms-storage"

export const dynamic = "force-dynamic"
export const revalidate = 0

const PRICING_CONFIG_FILE = "pricing-admin.json"

interface PricingPlan {
  id: number
  group: "ip" | "ooo"
  name: string
  price: number
  period: string
  description: string
  features: string[]
  is_popular: boolean
  is_active: boolean
}

interface PricingPayload {
  plans: PricingPlan[]
}

const DEFAULT_PRICING_DATA = {
  plans: [
    {
      id: 1,
      group: "ip",
      name: "ИП Базовый",
      price: 2990,
      period: "мес",
      description: "Идеально для ИП и фрилансеров, которые хотят снять с себя базовые задачи по отчетности и налогам",
      features: [
        "Ведение КУДиР",
        "Расчет и подача деклараций",
        "Консультации по налогам",
        "Сдача отчетности в ФНС",
        "Базовая поддержка",
      ],
      is_popular: false,
      is_active: true,
    },
    {
      id: 2,
      group: "ip",
      name: "ИП Оптимальный",
      price: 4990,
      period: "мес",
      description: "Лучшее решение для растущих ИП с сотрудниками, которым нужна гибкость и поддержка в кадровых вопросах",
      features: [
        "Все из тарифа ИП Базовый",
        "Ведение учета в 1С",
        "Расчет взносов ИП",
        "Консультации по оптимизации",
        "Приоритетная поддержка",
        "Личный кабинет",
      ],
      is_popular: true,
      is_active: true,
    },
    {
      id: 3,
      group: "ip",
      name: "ИП Под ключ",
      price: 7990,
      period: "мес",
      description: "Для опытных ИП со сложным учетом, ВЭД и специфическими задачами",
      features: [
        "Все из тарифа ИП Оптимальный",
        "Ведение кадрового учета",
        "Расчет зарплаты сотрудников",
        "Юридическое сопровождение",
        "Персональный менеджер",
        "Безлимитные консультации",
      ],
      is_popular: false,
      is_active: true,
    },
    {
      id: 4,
      group: "ooo",
      name: "ООО Базовый",
      price: 8990,
      period: "мес",
      description: "Идеально для ООО, которым нужна надежная базовая бухгалтерская поддержка",
      features: [
        "Ведение бухучета",
        "Сдача всех отчетов",
        "Расчет налогов",
        "Консультации бухгалтера",
        "Документооборот",
      ],
      is_popular: false,
      is_active: true,
    },
    {
      id: 5,
      group: "ooo",
      name: "ООО Оптимальный",
      price: 14990,
      period: "мес",
      description: "Оптимальный тариф для растущих ООО с сотрудниками",
      features: [
        "Все из тарифа ООО Базовый",
        "Кадровое делопроизводство",
        "Расчет зарплаты",
        "Отчеты в ПФР и ФСС",
        "Юридические консультации",
        "Личный кабинет",
      ],
      is_popular: true,
      is_active: true,
    },
    {
      id: 6,
      group: "ooo",
      name: "ООО Под ключ",
      price: 24990,
      period: "мес",
      description: "Для компаний со сложным учетом и задачами полного сопровождения",
      features: [
        "Все из тарифа ООО Оптимальный",
        "Управленческий учет",
        "Финансовая аналитика",
        "Налоговое планирование",
        "Персональный менеджер",
        "Сопровождение проверок",
      ],
      is_popular: false,
      is_active: true,
    },
  ],
}

function normalizePlan(raw: any, fallback: PricingPlan): PricingPlan {
  return {
    id: fallback.id,
    group: fallback.group,
    name: typeof raw?.name === "string" && raw.name.trim().length > 0 ? raw.name : fallback.name,
    price: Number.isFinite(Number(raw?.price)) ? Number(raw.price) : fallback.price,
    period: typeof raw?.period === "string" && raw.period.trim().length > 0 ? raw.period : fallback.period,
    description: typeof raw?.description === "string" ? raw.description : fallback.description,
    features: Array.isArray(raw?.features)
      ? raw.features.filter((f: unknown) => typeof f === "string")
      : fallback.features,
    is_popular: typeof raw?.is_popular === "boolean" ? raw.is_popular : fallback.is_popular,
    is_active: typeof raw?.is_active === "boolean" ? raw.is_active : fallback.is_active,
  }
}

function normalizePricingPayload(raw: any): PricingPayload {
  const defaults = DEFAULT_PRICING_DATA.plans as PricingPlan[]
  const plansArray = Array.isArray(raw?.plans) ? raw.plans : []

  const legacyFirstThree = plansArray.slice(0, 3)
  const normalized: PricingPlan[] = defaults.map((fallback, index) => {
    const sourceRaw = plansArray.find((p: any) => Number(p?.id) === fallback.id)
      ?? plansArray[index]
      ?? (index < 3 ? legacyFirstThree[index] : null)
    return normalizePlan(sourceRaw, fallback)
  })

  return { plans: normalized }
}

export async function GET() {
  try {
    const { data, source, path } = await readCmsJsonOrInit<PricingPayload>(PRICING_CONFIG_FILE, DEFAULT_PRICING_DATA)
    const normalized = normalizePricingPayload(data)
    await writeCmsJson(PRICING_CONFIG_FILE, normalized)
    const meta = await getCmsFileMeta(PRICING_CONFIG_FILE)
    return NextResponse.json({
      ...normalized,
      diagnostics: {
        source,
        path,
        mtime: meta.mtime,
      },
    }, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
  } catch (error) {
    console.error("Error fetching pricing data:", error)
    return NextResponse.json({ error: "Failed to fetch pricing data" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    if (!Array.isArray(data?.plans)) {
      return NextResponse.json({ error: "Invalid payload: plans array is required" }, { status: 400 })
    }

    const normalized = normalizePricingPayload(data)
    const writeResult = await writeCmsJson(PRICING_CONFIG_FILE, normalized)
    const meta = await getCmsFileMeta(PRICING_CONFIG_FILE)
    console.log("Updating pricing data:", writeResult)

    return NextResponse.json({
      success: true,
      message: "Pricing updated successfully",
      timestamp: writeResult.savedAt,
      savedTo: writeResult.path,
      data: normalized,
      diagnostics: {
        mtime: meta.mtime,
        size: meta.size,
      },
    })
  } catch (error) {
    console.error("Error updating pricing:", error)
    return NextResponse.json({ error: "Failed to update pricing" }, { status: 500 })
  }
}
