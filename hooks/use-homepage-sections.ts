import { useCallback, useEffect, useMemo, useState } from "react"
import { useSiteRuntimeBootstrap } from "@/components/site-runtime-provider"
import type { HomepageSectionsConfig } from "@/lib/visibility-store"

interface SectionConfig {
  desktop: "published" | "draft"
  mobile: "published" | "draft"
}

interface SectionsConfig {
  [key: string]: SectionConfig
}

function toClientSectionsConfig(config: HomepageSectionsConfig): SectionsConfig {
  return config as unknown as SectionsConfig
}

export function useHomepageSections() {
  const bootstrap = useSiteRuntimeBootstrap()
  const hasBootstrap = Boolean(bootstrap?.initialSectionsConfig)

  const [sectionsConfig, setSectionsConfig] = useState<SectionsConfig>(() => {
    if (bootstrap?.initialSectionsConfig) return toClientSectionsConfig(bootstrap.initialSectionsConfig)
    return {}
  })

  const [loading, setLoading] = useState(!hasBootstrap)
  const [error, setError] = useState<string | null>(null)

  const fetchSectionsConfig = useCallback(async () => {
    try {
      if (!hasBootstrap) {
        setLoading(true)
      }
      setError(null)

      const response = await fetch("/api/homepage-sections", { cache: "no-store" })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const config = (await response.json()) as HomepageSectionsConfig
      setSectionsConfig(toClientSectionsConfig(config))
    } catch (err) {
      console.error("Error fetching sections config:", err)
      setError(err instanceof Error ? err.message : "Unknown error")

      // Не маскируем ошибку дефолтами — иначе выключение секций не работает
      if (!hasBootstrap) {
        setSectionsConfig({})
      }
    } finally {
      setLoading(false)
    }
  }, [hasBootstrap])

  useEffect(() => {
    void fetchSectionsConfig()
  }, [fetchSectionsConfig])

  const isSectionVisible = useMemo(() => {
    return (sectionKey: string, deviceType: "desktop" | "mobile" = "desktop"): boolean => {
      const section = sectionsConfig[sectionKey]
      if (!section) return false

      return section[deviceType] === "published"
    }
  }, [sectionsConfig])

  return {
    sectionsConfig,
    loading,
    error,
    isSectionVisible,
    refetch: fetchSectionsConfig,
  }
}
