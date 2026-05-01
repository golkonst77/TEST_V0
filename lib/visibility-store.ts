import { existsSync, readFileSync } from "fs"
import { join } from "path"
import { getCmsFileMeta, readCmsJsonOrInit, writeCmsJson } from "@/lib/cms-storage"

export type SectionVisibilityState = "published" | "draft"
export interface SectionVisibilityConfig {
  desktop: SectionVisibilityState
  mobile: SectionVisibilityState
}
export type HomepageSectionsConfig = Record<string, SectionVisibilityConfig>

export const HOMEPAGE_SECTIONS_FILE = "homepage-sections.json"
const LEGACY_HOMEPAGE_SECTIONS_FILE = join(process.cwd(), "data", "homepage-sections.json")

export const DEFAULT_HOMEPAGE_SECTIONS: HomepageSectionsConfig = {
  hero: { desktop: "published", mobile: "published" },
  about: { desktop: "published", mobile: "published" },
  services: { desktop: "published", mobile: "published" },
  calculator: { desktop: "published", mobile: "published" },
  pricing: { desktop: "published", mobile: "published" },
  reviews: { desktop: "published", mobile: "published" },
  guarantees: { desktop: "published", mobile: "published" },
  faq: { desktop: "published", mobile: "published" },
  news: { desktop: "published", mobile: "published" },
  contacts: { desktop: "published", mobile: "published" },
  technologies: { desktop: "published", mobile: "published" },
  "ai-documents": { desktop: "published", mobile: "published" },
  "ausn-blob": { desktop: "published", mobile: "published" },
  "risk-blob": { desktop: "published", mobile: "published" },
}

function normalizeSectionsConfig(raw: Record<string, unknown>): HomepageSectionsConfig {
  const normalized: HomepageSectionsConfig = {}
  for (const [key, value] of Object.entries(raw)) {
    if (typeof value === "string") {
      normalized[key] = {
        desktop: value === "draft" ? "draft" : "published",
        mobile: value === "draft" ? "draft" : "published",
      }
      continue
    }
    if (typeof value === "object" && value !== null) {
      const val = value as Partial<SectionVisibilityConfig>
      normalized[key] = {
        desktop: val.desktop === "draft" ? "draft" : "published",
        mobile: val.mobile === "draft" ? "draft" : "published",
      }
    }
  }
  return normalized
}

function getLegacySectionsConfig(): HomepageSectionsConfig {
  if (!existsSync(LEGACY_HOMEPAGE_SECTIONS_FILE)) {
    return DEFAULT_HOMEPAGE_SECTIONS
  }
  const parsed = JSON.parse(readFileSync(LEGACY_HOMEPAGE_SECTIONS_FILE, "utf8")) as Record<string, unknown>
  const normalized = normalizeSectionsConfig(parsed)
  return Object.keys(normalized).length ? normalized : DEFAULT_HOMEPAGE_SECTIONS
}

export async function getHomepageSectionsConfig() {
  const { data, source, path } = await readCmsJsonOrInit<HomepageSectionsConfig>(
    HOMEPAGE_SECTIONS_FILE,
    getLegacySectionsConfig(),
  )
  const normalized = normalizeSectionsConfig(data as unknown as Record<string, unknown>)
  const merged: HomepageSectionsConfig = { ...DEFAULT_HOMEPAGE_SECTIONS, ...normalized }
  const meta = await getCmsFileMeta(HOMEPAGE_SECTIONS_FILE)
  return {
    config: merged,
    diagnostics: {
      source,
      path,
      mtime: meta.mtime,
      size: meta.size,
    },
  }
}

export async function saveHomepageSectionsConfig(config: HomepageSectionsConfig) {
  const normalized = normalizeSectionsConfig(config as unknown as Record<string, unknown>)
  const merged: HomepageSectionsConfig = { ...DEFAULT_HOMEPAGE_SECTIONS, ...normalized }
  const writeResult = await writeCmsJson(HOMEPAGE_SECTIONS_FILE, merged)
  const meta = await getCmsFileMeta(HOMEPAGE_SECTIONS_FILE)
  return {
    ...writeResult,
    config: merged,
    diagnostics: {
      mtime: meta.mtime,
      size: meta.size,
    },
  }
}
