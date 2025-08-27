import { useState, useEffect } from 'react'

interface SectionsConfig {
  [key: string]: 'published' | 'draft'
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
        technologies: 'published',
        'ai-documents': 'published'
      }
      setSectionsConfig(defaultConfig)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSectionsConfig()
  }, [])

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