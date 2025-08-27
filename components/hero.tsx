"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCruiseClick } from "@/hooks/use-cruise-click"
import { DollarSign, AlertTriangle, CheckCircle, MessageCircle, Shield } from "lucide-react"
import AnimatedContent from './AnimatedContent'

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
      className="relative min-h-screen flex items-center justify-center px-4 md:px-8"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-white/0 z-10" />
      <div className="relative z-20 flex flex-col items-center justify-center w-full h-full py-8 md:py-12">
        <div className="relative z-10 w-full flex justify-start">
          <div className="max-w-4xl w-full text-left px-4">
            {/* Badge */}
            {badge.show && (
              <div className="mb-4 md:mb-6">
                <Badge 
                  variant="secondary" 
                  className="px-3 md:px-4 py-1 md:py-2 text-xs md:text-sm font-medium bg-sky-200 text-sky-700 border-sky-300 shadow-md hover:bg-sky-300 hover:border-sky-400"
                >
                  Мы защищаем ваш бизнес
                </Badge>
              </div>
            )}

            {/* Title */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 md:mb-6 leading-tight text-white text-left">
              {title.text}{" "}
              <span className="text-blue-400">{title.highlightText}</span>
            </h1>

            {/* Description */}
            <p className="text-sm md:text-base lg:text-lg mb-6 md:mb-8 leading-relaxed text-gray-800 font-medium max-w-2xl text-left">
              {description}
            </p>

            {/* CTA Button */}
            {button.show && (
              <div className="mb-8 md:mb-12 text-left">
                <Button 
                  size="lg" 
                  onClick={handleCruiseClick}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-base md:text-lg px-6 md:px-8 py-3 md:py-4 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 border-2 border-blue-500 hover:border-blue-400"
                  style={{
                    boxShadow: '0 10px 25px rgba(59, 130, 246, 0.4), 0 4px 10px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                  }}
                >
                  {button.text}
                </Button>
              </div>
            )}

            {/* Features */}
            <div className="w-full mt-8 md:mt-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 max-w-6xl text-left">
                {features.filter(feature => feature.show).map((feature, idx) => {
                  const bgVariants = [
                    'bg-[#FFF8F0]', // самая светлая
                    'bg-[#F5E6D6]', // средняя
                    'bg-[#E9D8C3]', // тёмная
                  ]
                  const cardBg = bgVariants[idx % 3]
                  return (
                    <div
                      key={feature.id}
                      className={`${cardBg} rounded-xl shadow-md p-4 md:p-6 w-full flex flex-col justify-start text-left`}
                    >
                      <div>
                        <AnimatedContent direction="vertical" distance={40} duration={0.7} ease="power3.out" threshold={0.2} animateOpacity={true} initialOpacity={0}>
                          <div
                            className="w-full bg-white rounded-lg py-2 mb-3 text-sm md:text-lg font-bold text-gray-900 flex items-center justify-center min-h-[40px]"
                            style={{ boxShadow: '8px 8px 0 #000' }}
                          >
                            {feature.title}
                          </div>
                        </AnimatedContent>
                        <div className="text-gray-700 text-xs md:text-sm mb-2 text-left">{feature.description}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero

