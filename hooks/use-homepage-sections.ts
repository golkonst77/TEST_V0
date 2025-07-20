import { useState, useEffect } from 'react'

interface SectionsConfig {
  [key: string]: 'published' | 'draft'
}

export function useHomepageSections() {
  const [sectionsConfig, setSectionsConfig] = useState<SectionsConfig>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSectionsConfig()
  }, [])

  const fetchSectionsConfig = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/homepage-sections')
      if (response.ok) {
        const config = await response.json()
        setSectionsConfig(config)
      } else {
        // Fallback к дефолтной конфигурации
        const defaultConfig: SectionsConfig = {
          hero: 'published',
          about: 'published',
          services: 'published',
          calculator: 'published',
          pricing: 'published',
          reviews: 'published',
          guarantees: 'published',
          faq: 'published',
          news: 'published',
          contacts: 'published',
          technologies: 'published'
        }
        setSectionsConfig(defaultConfig)
      }
    } catch (error) {
      console.error('Error loading sections config:', error)
      setError('Ошибка загрузки конфигурации секций')
      // Fallback к дефолтной конфигурации
      const defaultConfig: SectionsConfig = {
        hero: 'published',
        about: 'published',
        services: 'published',
        calculator: 'published',
        pricing: 'published',
        reviews: 'published',
        guarantees: 'published',
        faq: 'published',
        news: 'published',
        contacts: 'published',
        technologies: 'published'
      }
      setSectionsConfig(defaultConfig)
    } finally {
      setLoading(false)
    }
  }

  const isSectionVisible = (sectionKey: string): boolean => {
    return sectionsConfig[sectionKey] === 'published'
  }

  return {
    sectionsConfig,
    loading,
    error,
    isSectionVisible,
    refetch: fetchSectionsConfig
  }
} 