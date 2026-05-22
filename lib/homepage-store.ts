import { existsSync, readFileSync } from "fs"
import { join } from "path"
import { getCmsFileMeta, readCmsJsonStrict, writeCmsJson } from "@/lib/cms-storage"
import { extractUploadFileName, uploadFileExists } from "@/lib/uploads-storage"

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

export const HOMEPAGE_CONFIG_FILE = "homepage.json"
const LEGACY_DATA_FILE = join(process.cwd(), "data", "homepage.json")

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

function getDefaultHeroConfig(): HeroConfig {
  if (!existsSync(LEGACY_DATA_FILE)) {
    throw new Error(`Legacy homepage config missing: ${LEGACY_DATA_FILE}`)
  }
  const data = readFileSync(LEGACY_DATA_FILE, "utf8")
  const parsed = JSON.parse(data)
  if (!isValidHomepageConfig(parsed)) {
    throw new Error("Legacy homepage config is invalid")
  }
  return parsed
}

export async function getHeroConfig() {
  let data: HeroConfig
  let source: "stored" | "legacy-fallback"
  let path: string

  try {
    const strict = await readCmsJsonStrict<HeroConfig>(HOMEPAGE_CONFIG_FILE)
    data = strict.data
    source = "stored"
    path = strict.path
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      throw error
    }
    data = getDefaultHeroConfig()
    source = "legacy-fallback"
    path = LEGACY_DATA_FILE
  }

  if (!isValidHomepageConfig(data)) {
    throw new Error(`Homepage config invalid at ${path}`)
  }
  const meta = await getCmsFileMeta(HOMEPAGE_CONFIG_FILE)
  return {
    config: data,
    diagnostics: {
      source,
      path,
      mtime: meta.mtime,
      size: meta.size,
    },
  }
}

export async function saveHeroConfig(config: HeroConfig) {
  if (!isValidHomepageConfig(config)) {
    throw new Error("Invalid homepage config payload")
  }

  const imageUrl = config.background?.image?.trim()
  if (imageUrl) {
    const fileName = extractUploadFileName(imageUrl)
    if (fileName) {
      const exists = await uploadFileExists(fileName)
      if (!exists) {
        throw new Error(`Файл фона не найден на сервере: ${imageUrl}`)
      }
    }
  }

  const writeResult = await writeCmsJson(HOMEPAGE_CONFIG_FILE, config)
  const meta = await getCmsFileMeta(HOMEPAGE_CONFIG_FILE)
  return {
    ...writeResult,
    diagnostics: {
      mtime: meta.mtime,
      size: meta.size,
    },
  }
}

export type { HeroConfig }
