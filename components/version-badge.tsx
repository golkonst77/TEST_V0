'use client'

import { useState, useEffect } from 'react'

interface VersionInfo {
  version: string
  build: string
  date: string
  description: string
}

export function VersionBadge() {
  const [versionInfo, setVersionInfo] = useState<VersionInfo | null>(null)

  useEffect(() => {
    const fetchVersion = async () => {
      try {
        // Пробуем сначала API endpoint, потом статический файл
        let response = await fetch('/api/version')
        if (!response.ok) {
          response = await fetch('/version.json')
        }
        
        if (response.ok) {
          const data = await response.json()
          setVersionInfo(data)
        }
      } catch (error) {
        console.error('Ошибка загрузки версии:', error)
      }
    }

    fetchVersion()
  }, [])

  if (!versionInfo) {
    return (
      <div className="text-xs text-blue-600 font-mono bg-blue-50 px-2 py-1 rounded">
        v1.0.2
      </div>
    )
  }

  return (
    <div className="text-xs text-blue-600 font-mono bg-blue-50 px-2 py-1 rounded">
      v{versionInfo.version}
    </div>
  )
}
