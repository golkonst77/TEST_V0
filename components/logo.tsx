"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"

interface LogoConfig {
  text: string
  show: boolean
  type: "text" | "image"
  imageUrl?: string
}

interface LogoProps {
  siteName?: string
  className?: string
}

export function Logo({ siteName = "ПростоБюро", className = "" }: LogoProps) {
  const [logoConfig, setLogoConfig] = useState<LogoConfig>({
    text: "ПростоБюро",
    show: true,
    type: "text",
    imageUrl: "",
  })

  const fetchLogoConfig = async () => {
    try {
      // Проверяем, есть ли уже данные в localStorage
      const cachedData = localStorage.getItem('logo-config')
      if (cachedData) {
        const parsed = JSON.parse(cachedData)
        const cacheTime = parsed.timestamp || 0
        const now = Date.now()
        // Если данные свежие (менее 5 минут), используем кэш
        if (now - cacheTime < 300000) {
          console.log("Logo: Using cached config")
          setLogoConfig(parsed.config)
          return
        }
      }

      console.log("Logo: Fetching logo config...")
      const response = await fetch("/api/settings", {
        cache: 'force-cache', // Включаем кэширование
        headers: {
          'Cache-Control': 'max-age=300' // Кэш на 5 минут
        }
      })
      if (response.ok) {
        const data = await response.json()
        console.log("Logo: Received data:", data)
        if (data.header?.logo) {
          console.log("Logo: Updating config:", data.header.logo)
          setLogoConfig(data.header.logo)
          // Сохраняем в localStorage для кэширования
          localStorage.setItem('logo-config', JSON.stringify({
            config: data.header.logo,
            timestamp: Date.now()
          }))
        }
      } else {
        console.error("Logo: Failed to fetch config, status:", response.status)
      }
    } catch (error) {
      console.error("Logo: Error fetching config:", error)
    }
  }

  useEffect(() => {
    fetchLogoConfig()
    
    // Обновляем настройки каждые 2 секунды
    const interval = setInterval(fetchLogoConfig, 2000)
    return () => clearInterval(interval)
  }, [])

  if (!logoConfig.show) {
    return null
  }

  // Добавляем timestamp для избежания кэширования изображений
  const imageUrl = logoConfig.imageUrl ? `${logoConfig.imageUrl}?t=${Date.now()}` : ""

  return (
    <Link href="/" className={`flex items-center space-x-2 ${className}`}>
      {logoConfig.type === "image" && logoConfig.imageUrl ? (
        <>
          <div className="relative h-12 w-12">
            <Image
              src={imageUrl}
              alt={logoConfig.text || siteName}
              fill
              className="object-contain rounded-lg"
              unoptimized={true} // Отключаем оптимизацию Next.js для избежания кэширования
              onError={(e) => {
                console.error("Logo: Image failed to load:", logoConfig.imageUrl)
                // Fallback to text logo if image fails
                setLogoConfig(prev => ({ ...prev, type: "text" }))
              }}
            />
          </div>
          {logoConfig.text && (
            <span className="font-bold text-xl">{logoConfig.text}</span>
          )}
        </>
      ) : (
        <>
          <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">ПБ</span>
          </div>
          <span className="font-bold text-xl">{logoConfig.text || siteName}</span>
        </>
      )}
    </Link>
  )
} 