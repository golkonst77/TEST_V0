import { readCmsJsonStrict, writeCmsJson } from "@/lib/cms-storage"

export interface HeaderMenuItem {
  id: string
  title: string
  href: string
  show: boolean
  type?: "link" | "dropdown"
  children?: HeaderMenuItem[]
}

export interface HeaderConfigData {
  ctaText: string
  menuItems: HeaderMenuItem[]
}

const HEADER_CONFIG_FILE = "header-config.json"

const DEFAULT_HEADER_CONFIG: HeaderConfigData = {
  ctaText: "Получить консультацию",
  menuItems: [
    { id: "pricing", title: "Тарифы", href: "/#pricing", show: true, type: "link" },
    { id: "faq", title: "FAQ", href: "/#faq", show: true, type: "link" },
    { id: "calculator", title: "Калькулятор", href: "/#calculator", show: true, type: "link" },
    { id: "reviews", title: "Отзывы", href: "/#reviews", show: true, type: "link" },
    {
      id: "ausn-risk",
      title: "АУСН / Риски",
      href: "#",
      show: true,
      type: "dropdown",
      children: [
        { id: "ausn", title: "АУСН", href: "/ausn", show: true, type: "link" },
        { id: "risk", title: "Риски", href: "/risk", show: true, type: "link" },
      ],
    },
    { id: "contacts", title: "Контакты", href: "/#contacts", show: true, type: "link" },
  ],
}

function normalizeMenuItem(raw: any): HeaderMenuItem | null {
  if (!raw || typeof raw !== "object") return null
  if (typeof raw.id !== "string" || typeof raw.title !== "string" || typeof raw.href !== "string") return null
  const children = Array.isArray(raw.children)
    ? raw.children.map(normalizeMenuItem).filter(Boolean) as HeaderMenuItem[]
    : undefined
  return {
    id: raw.id,
    title: raw.title,
    href: raw.href,
    show: raw.show !== false,
    type: raw.type === "dropdown" ? "dropdown" : "link",
    children: children && children.length > 0 ? children : undefined,
  }
}

function normalizeHeaderConfig(raw: any): HeaderConfigData {
  const menuItems = Array.isArray(raw?.menuItems) ? raw.menuItems.map(normalizeMenuItem).filter(Boolean) as HeaderMenuItem[] : []
  return {
    ctaText: typeof raw?.ctaText === "string" && raw.ctaText.trim().length > 0 ? raw.ctaText : DEFAULT_HEADER_CONFIG.ctaText,
    menuItems: menuItems.length > 0 ? menuItems : DEFAULT_HEADER_CONFIG.menuItems,
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
    const writeResult = await writeCmsJson(HEADER_CONFIG_FILE, DEFAULT_HEADER_CONFIG)
    console.warn("Header config was missing, initialized with defaults", writeResult)
    return {
      config: DEFAULT_HEADER_CONFIG,
      source: "initialized" as const,
      path: writeResult.path,
    }
  }
}

export async function saveHeaderConfig(config: HeaderConfigData) {
  const normalized = normalizeHeaderConfig(config)
  return writeCmsJson(HEADER_CONFIG_FILE, normalized)
}
