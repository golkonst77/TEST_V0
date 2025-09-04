'use client'

import { useState, useEffect } from 'react'

interface VersionInfo {
  version: string
  build: string
  date: string
  description: string
}

export function VersionInfo() {
  const [versionInfo, setVersionInfo] = useState<VersionInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchVersion = async () => {
      try {
        const response = await fetch('/version.json')
        if (response.ok) {
          const data = await response.json()
          setVersionInfo(data)
        }
      } catch (error) {
        console.error('Ошибка загрузки версии:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchVersion()
  }, [])

  if (isLoading || !versionInfo) {
    return null
  }

  return (
    <div className="text-xs text-gray-400 text-center mt-2">
      <span className="font-mono">v{versionInfo.version}</span>
      <span className="mx-1">•</span>
      <span className="font-mono">build {versionInfo.build}</span>
      <span className="mx-1">•</span>
      <span className="text-gray-500">{versionInfo.date}</span>
    </div>
  )
}
