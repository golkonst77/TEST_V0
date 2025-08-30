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
      
      const response = await fetch('/api/homepage-sections')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const config = await response.json()
      setSectionsConfig(config)
    } catch (err) {
      console.error('Error fetching sections config:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
      
      // Fallback к дефолтной конфигурации
      const defaultConfig: SectionsConfig = {
        hero: { desktop: 'published', mobile: 'published' },
        about: { desktop: 'published', mobile: 'published' },
        services: { desktop: 'published', mobile: 'published' },
        calculator: { desktop: 'published', mobile: 'published' },
        pricing: { desktop: 'published', mobile: 'published' },
        reviews: { desktop: 'published', mobile: 'published' },
        guarantees: { desktop: 'published', mobile: 'published' },
        faq: { desktop: 'published', mobile: 'published' },
        news: { desktop: 'published', mobile: 'published' },
        contacts: { desktop: 'published', mobile: 'published' },
        technologies: { desktop: 'published', mobile: 'published' },
        'ai-documents': { desktop: 'published', mobile: 'published' }
      }
      setSectionsConfig(defaultConfig)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSectionsConfig()
  }, [])

  const isSectionVisible = (sectionKey: string, deviceType: 'desktop' | 'mobile' = 'desktop'): boolean => {
    const section = sectionsConfig[sectionKey]
    if (!section) return true // Если секция не найдена, показываем по умолчанию
    
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