import { useState, useEffect } from 'react'

interface SectionConfig {
  desktop: 'published' | 'draft'
  mobile: 'published' | 'draft'
}

interface SectionsConfig {
  [key: string]: SectionConfig
}

export function useHomepageSections() {
  const [sectionsConfig, setSectionsConfig] = useState<SectionsConfig>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSectionsConfig = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/homepage-sections', { cache: "no-store" })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const config = await response.json()
      console.log("HOMEPAGE SECTIONS LOADED", config)
      setSectionsConfig(config)
    } catch (err) {
      console.error('Error fetching sections config:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
      
      // Не маскируем ошибку дефолтами — иначе выключение секций не работает
      setSectionsConfig({})
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSectionsConfig()
  }, [])

  const isSectionVisible = (sectionKey: string, deviceType: 'desktop' | 'mobile' = 'desktop'): boolean => {
    const section = sectionsConfig[sectionKey]
    if (!section) return true // если ключа нет в конфиге — показываем (но это видно по логам выше)
    
    return section[deviceType] === 'published'
  }

  return {
    sectionsConfig,
    loading,
    error,
    isSectionVisible,
    refetch: fetchSectionsConfig
  }
} 