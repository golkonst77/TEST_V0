import { existsSync, readFileSync } from "fs"
import { join } from "path"
import { readCmsJsonStrict, writeCmsJson } from "@/lib/cms-storage"

export interface HeaderMenuItem {
  id: string
  title: string
  href: string
  show: boolean
  type?: "link" | "dropdown"
}

export interface HeaderConfigData {
  ctaText: string
  menuItems: HeaderMenuItem[]
}

const HEADER_CONFIG_FILE = "header-config.json"
const LEGACY_HEADER_FILE = join(process.cwd(), "data", "header-config.json")

const DEFAULT_HEADER_CONFIG: HeaderConfigData = {
  ctaText: "Получить скидку",
  menuItems: [
    { id: "services", title: "Услуги", href: "/#services", show: true, type: "link" },
    { id: "technologies", title: "Технологии", href: "/#technologies", show: true, type: "link" },
    { id: "pricing", title: "Тарифы", href: "/#pricing", show: true, type: "link" },
    { id: "faq", title: "FAQ", href: "/#faq", show: true, type: "link" },
    { id: "calculator", title: "Калькулятор", href: "/#calculator", show: true, type: "link" },
    { id: "reviews", title: "Отзывы", href: "/#reviews", show: true, type: "link" },
    { id: "contacts", title: "Контакты", href: "/#contacts", show: true, type: "link" },
  ],
}

function normalizeMenuItem(raw: any): HeaderMenuItem | null {
  if (!raw || typeof raw !== "object") return null
  if (typeof raw.id !== "string" || typeof raw.title !== "string" || typeof raw.href !== "string") return null
  return {
    id: raw.id,
    title: raw.title,
    href: raw.href,
    show: raw.show !== false,
    type: raw.type === "dropdown" ? "dropdown" : "link",
  }
}

function normalizeHeaderConfig(raw: any): HeaderConfigData {
  const menuItems = Array.isArray(raw?.menuItems) ? raw.menuItems.map(normalizeMenuItem).filter(Boolean) as HeaderMenuItem[] : []
  return {
    ctaText: typeof raw?.ctaText === "string" && raw.ctaText.trim().length > 0 ? raw.ctaText : DEFAULT_HEADER_CONFIG.ctaText,
    menuItems: menuItems.length > 0 ? menuItems : DEFAULT_HEADER_CONFIG.menuItems,
  }
}

function loadLegacyHeaderConfig(): HeaderConfigData {
  if (!existsSync(LEGACY_HEADER_FILE)) return DEFAULT_HEADER_CONFIG
  try {
    const raw = JSON.parse(readFileSync(LEGACY_HEADER_FILE, "utf8"))
    return normalizeHeaderConfig(raw)
  } catch {
    return DEFAULT_HEADER_CONFIG
  }
}

export async function getHeaderConfig() {
  try {
    const strict = await readCmsJsonStrict<HeaderConfigData>(HEADER_CONFIG_FILE)
    return {
      config: normalizeHeaderConfig(strict.data),
      source: "stored" as const,
      path: strict.path,
    }
  } catch (error) {
    if (process.env.NODE_ENV === "production") throw error
    return {
      config: loadLegacyHeaderConfig(),
      source: "default-fallback" as const,
      path: LEGACY_HEADER_FILE,
    }
  }
}

export async function saveHeaderConfig(config: HeaderConfigData) {
  const normalized = normalizeHeaderConfig(config)
  return writeCmsJson(HEADER_CONFIG_FILE, normalized)
}
