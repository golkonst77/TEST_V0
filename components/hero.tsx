"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCruiseClick } from "@/hooks/use-cruise-click"
import { DollarSign, AlertTriangle, CheckCircle, MessageCircle, Shield } from "lucide-react"

interface HeroConfig {
  badge: {
    text: string
    show: boolean
  }
  title: {
    text: string
    highlightText: string
  }
  description: string
  button: {
    text: string
    show: boolean
  }
  features: Array<{
    id: string
    title: string
    description: string
    icon: string
    color: string
    show: boolean
  }>
  background: {
    image: string
    overlay: number
  }
  layout: {
    alignment: string
    maxWidth: string
    marginLeft: number
    marginTop: number
    marginBottom: number
    paddingX: number
  }
}

const iconMap = {
  DollarSign,
  AlertTriangle,
  CheckCircle,
  MessageCircle,
  Shield,
}

export function Hero() {
  const [config, setConfig] = useState<HeroConfig | null>(null)
  const { handleCruiseClick } = useCruiseClick()

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        console.log("Hero: Fetching homepage config...")
        const response = await fetch("/api/homepage")
        if (response.ok) {
          const data = await response.json()
          console.log("Hero: Loaded config:", data)
          setConfig(data)
        } else {
          console.error("Hero: Failed to fetch config")
        }
      } catch (error) {
        console.error("Hero: Error fetching config:", error)
      }
    }

    fetchConfig()
  }, [])

  if (!config) {
    return (
      <section className="relative min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Загрузка...</p>
        </div>
      </section>
    )
  }

  // Значения по умолчанию для безопасности
  const backgroundImage = config.background?.image || ''
  const overlayOpacity = (config.background?.overlay || 10) / 100
  const badge = config.badge || { text: 'Защищаем ваш бизнес', show: true }
  const title = config.title || { text: 'Ваш личный', highlightText: 'щит' }
  const description = config.description || 'Профессиональные бухгалтерские услуги'
  const button = config.button || { text: 'Получить консультацию', show: true }
  const features = config.features || []
  const layout = config.layout || {
    alignment: 'left',
    maxWidth: 'max-w-2xl',
    marginLeft: 80,
    marginTop: 0,
    marginBottom: 0,
    paddingX: 20
  }

  return (
    <section 
      className={`relative min-h-screen flex items-center justify-center ${backgroundImage ? '' : 'bg-white'}`}
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay только если есть фоновое изображение */}
      {backgroundImage && (
        <div 
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
        />
      )}

      <div className="relative z-10 w-full">
        <div 
          className={`${layout.maxWidth} px-4 ${layout.alignment === 'left' ? 'text-left ml-0' : 'text-center mx-auto'} rounded-2xl shadow-xl p-8 border border-gray-200`}
          style={{
            marginLeft: layout.alignment === 'left' ? `${layout.marginLeft}px` : 'auto',
            marginRight: layout.alignment === 'left' ? 'auto' : 'auto',
            marginTop: `${layout.marginTop}px`,
            marginBottom: `${layout.marginBottom}px`,
            paddingLeft: `${layout.paddingX}px`,
            paddingRight: `${layout.paddingX}px`,
            backgroundColor: '#f3f4f6', // Более темный серый
          }}
        >
          {/* Badge */}
          {badge.show && (
            <div className="mb-6">
              <Badge 
                variant="secondary" 
                className="px-4 py-2 text-sm font-medium bg-blue-700 text-white border-blue-700 shadow-md"
              >
                {badge.text}
              </Badge>
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-900">
            {title.text}{" "}
            <span className="text-blue-800">{title.highlightText}</span>
          </h1>

          {/* Description */}
          <p className={`text-lg md:text-xl mb-8 leading-relaxed ${layout.alignment === 'left' ? 'max-w-4xl' : 'max-w-4xl mx-auto'} text-gray-800 font-medium`}>
            {description}
          </p>

          {/* CTA Button */}
          {button.show && (
            <div className="mb-12">
              <Button 
                size="lg" 
                onClick={handleCruiseClick}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg hover:scale-105 transition-all duration-200"
              >
                {button.text}
              </Button>
            </div>
          )}

          {/* Features */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${layout.alignment === 'left' ? 'max-w-5xl' : 'max-w-5xl mx-auto'}`}>
            {features.filter(feature => feature.show).map((feature) => {
              const IconComponent = iconMap[feature.icon as keyof typeof iconMap]
              
              const colorClasses = {
                blue: "bg-blue-100 text-blue-800 border-blue-300",
                green: "bg-green-100 text-green-800 border-green-300", 
                orange: "bg-orange-100 text-orange-800 border-orange-300",
              }

              return (
                <div
                  key={feature.id}
                  className={`p-6 rounded-xl border bg-white shadow-sm ${
                    colorClasses[feature.color as keyof typeof colorClasses] || colorClasses.blue
                  }`}
                >
                  <div className="flex items-center justify-center mb-4">
                    {IconComponent && <IconComponent className="h-8 w-8" />}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">{feature.title}</h3>
                  <p className="text-sm text-gray-700 font-medium">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
