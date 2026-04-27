import { readFileSync } from "fs"
import { join } from "path"

// Хранилище настроек главной страницы
interface HeroConfig {
  badge: {
    text: string
    show: boolean
  }
  title: {
    text: string
    highlightText: string
  }
  description: string
  button: {
    text: string
    show: boolean
  }
  features: Array<{
    id: string
    title: string
    description: string
    icon: string
    color: string
    show: boolean
  }>
  background: {
    image: string
    overlay: number
  }
  layout: {
    alignment: string
    maxWidth: string
    marginLeft: number
    marginTop: number
    marginBottom: number
    paddingX: number
  }
}

const DATA_FILE = join(process.cwd(), 'data', 'homepage.json')

function isValidHomepageConfig(value: unknown): value is HeroConfig {
  if (!value || typeof value !== "object") return false
  const v = value as any

  const hasBadge = v.badge && typeof v.badge.text === "string" && typeof v.badge.show === "boolean"
  const hasTitle = v.title && typeof v.title.text === "string" && typeof v.title.highlightText === "string"
  const hasDescription = typeof v.description === "string"
  const hasButton = v.button && typeof v.button.text === "string" && typeof v.button.show === "boolean"
  const hasBackground = v.background && typeof v.background.image === "string" && typeof v.background.overlay === "number"
  const hasLayout =
    v.layout &&
    typeof v.layout.alignment === "string" &&
    typeof v.layout.maxWidth === "string" &&
    typeof v.layout.marginLeft === "number" &&
    typeof v.layout.marginTop === "number" &&
    typeof v.layout.marginBottom === "number" &&
    typeof v.layout.paddingX === "number"
  const hasFeatures =
    Array.isArray(v.features) &&
    v.features.every(
      (f: any) =>
        f &&
        typeof f.id === "string" &&
        typeof f.title === "string" &&
        typeof f.description === "string" &&
        typeof f.icon === "string" &&
        typeof f.color === "string" &&
        typeof f.show === "boolean",
    )

  return Boolean(hasBadge && hasTitle && hasDescription && hasButton && hasFeatures && hasBackground && hasLayout)
}

export function getHeroConfig(): HeroConfig {
  const data = readFileSync(DATA_FILE, "utf8")
  const parsed = JSON.parse(data)

  if (!isValidHomepageConfig(parsed)) {
    throw new Error("Homepage config not found or invalid")
  }

  return parsed
}

export type { HeroConfig }
