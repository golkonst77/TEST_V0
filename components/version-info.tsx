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
        console.log('🔍 Загружаем версию из API...')
        const response = await fetch('/api/version')
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
      <div className="text-sm text-black text-center mt-2 font-medium">
        <span className="font-mono">Загрузка версии...</span>
      </div>
    )
  }

  if (!versionInfo) {
    return (
      <div className="text-sm text-black text-center mt-2 font-medium">
        <span className="font-mono">v1.1.7</span>
        <span className="mx-1">•</span>
        <span className="font-mono">build 117</span>
        <span className="mx-1">•</span>
        <span className="text-gray-600">2026-04-09</span>
      </div>
    )
  }

  return (
    <div className="text-sm text-black text-center mt-2 font-medium">
      <span className="font-mono">v{versionInfo.version}</span>
      <span className="mx-1">•</span>
      <span className="font-mono">build {versionInfo.build}</span>
      <span className="mx-1">•</span>
      <span className="text-gray-600">{versionInfo.date}</span>
    </div>
  )
}
