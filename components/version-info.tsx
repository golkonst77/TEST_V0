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
        console.log('🔍 Загружаем версию...')
        const response = await fetch('/version.json')
        console.log('📡 Ответ сервера:', response.status, response.ok)
        if (response.ok) {
          const data = await response.json()
          console.log('📋 Данные версии:', data)
          setVersionInfo(data)
        } else {
          console.error('❌ Ошибка загрузки версии:', response.status)
        }
      } catch (error) {
        console.error('❌ Ошибка загрузки версии:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchVersion()
  }, [])

  if (isLoading) {
    return (
      <div className="text-xs text-gray-400 text-center mt-2">
        <span className="font-mono">Загрузка версии...</span>
      </div>
    )
  }

  if (!versionInfo) {
    return (
      <div className="text-xs text-gray-400 text-center mt-2">
        <span className="font-mono">v1.0.2</span>
        <span className="mx-1">•</span>
        <span className="font-mono">build 102</span>
        <span className="mx-1">•</span>
        <span className="text-gray-500">2025-09-04</span>
      </div>
    )
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
