'use client'

import { useState, useEffect } from 'react'

interface VersionInfo {
  version: string
  build: string
  date: string
  description: string
}

interface VersionInfoProps {
  className?: string
}

export function VersionInfo({ className }: VersionInfoProps) {
  const [versionInfo, setVersionInfo] = useState<VersionInfo | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const fetchVersion = async () => {
      try {
        const response = await fetch('/api/version', {
          cache: 'no-store',
          signal: controller.signal,
        })
        if (response.ok) {
          const data = await response.json()
          setVersionInfo(data)
        }
      } catch (error) {
        if (!(error instanceof Error && error.name === "AbortError")) {
          console.error('Ошибка загрузки версии:', error)
        }
      }
    }

    fetchVersion()
    return () => controller.abort()
  }, [])

  if (!versionInfo) return null

  return (
    <div className={`text-[11px] md:text-xs text-gray-400 font-normal text-center ${className ?? ""}`}>
      <span>v{versionInfo.version}</span>
      <span className="mx-1">·</span>
      <span>build {versionInfo.build}</span>
      <span className="mx-1">·</span>
      <span>{versionInfo.date}</span>
    </div>
  )
}
