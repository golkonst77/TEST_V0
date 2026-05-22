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
  const [isConfigLoaded, setIsConfigLoaded] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const { handleCruiseClick } = useCruiseClick()

  const PistolIcon = ({ className }: { className?: string }) => (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M3 10.5c0-.55.45-1 1-1h9.5c.55 0 1 .45 1 1v2.25c0 .28.22.5.5.5H17c.55 0 1 .45 1 1v2.25c0 .28.22.5.5.5H21c.55 0 1 .45 1 1v1c0 .55-.45 1-1 1h-5c-.55 0-1-.45-1-1v-1.5c0-.28-.22-.5-.5-.5H12c-.55 0-1-.45-1-1v-1.5c0-.28-.22-.5-.5-.5H7.5c-.28 0-.5.22-.5.5V18c0 .55-.45 1-1 1H4c-.55 0-1-.45-1-1v-7.5z" />
    </svg>
  )

  useEffect(() => {
    const controller = new AbortController()

    // Загружаем конфигурацию из админки
    const fetchConfig = async () => {
      try {
        const response = await fetch("/api/homepage", {
          cache: "no-store",
          signal: controller.signal,
        })
        if (!response.ok) throw new Error(`Failed to load homepage config: ${response.status}`)
        const data = await response.json()
        const heroConfig = (data?.hero ?? data) as HeroConfig
        console.log("Hero: Загружена конфигурация:", heroConfig)
        setConfig(heroConfig)
      } catch (error) {
        if (!(error instanceof Error && error.name === "AbortError")) {
          console.error("Hero: Ошибка загрузки конфигурации:", error)
          setLoadError(true)
        }
      } finally {
        setIsConfigLoaded(true)
      }
    }

    fetchConfig()
    return () => controller.abort()
  }, [])

  if (!isConfigLoaded) {
    return <section className="relative min-h-[600px] md:min-h-screen bg-gray-100" />
  }

  if (loadError || !config) {
    return (
      <section className="relative min-h-[600px] md:min-h-screen bg-gray-100 flex items-center justify-center px-4 md:px-8">
        <div className="text-center text-gray-800 font-medium">
          Ошибка загрузки данных. Обратитесь к администратору
        </div>
      </section>
    )
  }

  const bgImageUrl = config.background?.image
    ? (config.background.image.startsWith("/") ? config.background.image : `/${config.background.image}`)
    : ""

  if (!bgImageUrl || !config.title || !config.description || !config.button || !Array.isArray(config.features)) {
    return (
      <section className="relative min-h-[600px] md:min-h-screen bg-gray-100 flex items-center justify-center px-4 md:px-8">
        <div className="text-center text-gray-800 font-medium">
          Ошибка загрузки данных. Обратитесь к администратору
        </div>
      </section>
    )
  }

  const layout = config.layout ?? {
    alignment: "left",
    maxWidth: "max-w-4xl",
    marginLeft: 0,
    marginTop: 0,
    marginBottom: 0,
    paddingX: 0,
  }

  const alignment = layout.alignment === "center" || layout.alignment === "right" ? layout.alignment : "left"
  const rowJustifyClass =
    alignment === "center" ? "justify-center" : alignment === "right" ? "justify-end" : "justify-start"
  const textAlignClass =
    alignment === "center" ? "text-center" : alignment === "right" ? "text-right" : "text-left"
  const overlayOpacity = Math.min(100, Math.max(0, config.background?.overlay ?? 0)) / 100
  const contentOffset = Math.max(0, layout.marginLeft || layout.paddingX || 0)

  return (
    <section 
      className="relative min-h-[600px] md:min-h-screen flex items-center px-4 md:px-8 overflow-hidden"
      style={{
        backgroundImage: `url(${bgImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#f3f4f6',
        paddingTop: layout.marginTop,
        paddingBottom: layout.marginBottom,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-white/0 z-10" />
      {overlayOpacity > 0 ? (
        <div
          className="absolute inset-0 z-10"
          style={{ backgroundColor: `rgba(0,0,0,${overlayOpacity})` }}
        />
      ) : null}
      <div
        className={`relative z-20 flex w-full py-8 md:py-12 ${rowJustifyClass}`}
        style={contentOffset > 0 ? { paddingLeft: contentOffset } : undefined}
      >
        <div className={`w-full ${layout.maxWidth || "max-w-4xl"} ${textAlignClass}`}>
            {/* Badge */}
            {config.badge.show && (
              <div className={`mb-4 md:mb-6 ${alignment === "center" ? "flex justify-center" : alignment === "right" ? "flex justify-end" : ""}`}>
                <Badge 
                  variant="secondary" 
                  className="px-3 md:px-4 py-1 md:py-2 text-xs md:text-sm font-medium bg-sky-200 text-sky-700 border-sky-300 shadow-md hover:bg-sky-300 hover:border-sky-400"
                >
                  {config.badge.text}
                </Badge>
              </div>
            )}

            {/* Title */}
            <h1 className={`text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 md:mb-6 leading-tight text-white ${textAlignClass}`}>
              {config.title.text}{" "}
              {config.title.highlightText ? <span className="text-blue-400">{config.title.highlightText}</span> : null}
            </h1>

            {/* Description */}
            <p className={`text-sm md:text-base lg:text-lg mb-6 md:mb-8 leading-relaxed text-gray-800 font-medium w-full max-w-none md:max-w-2xl ${textAlignClass} ${alignment === "center" ? "mx-auto" : alignment === "right" ? "ml-auto" : ""}`}>
              {config.description}
            </p>

            {/* CTA Button */}
            {config.button.show && (
              <div className={`mb-8 md:mb-12 ${textAlignClass}`}>
                <Button 
                  size="lg" 
                  onClick={handleCruiseClick}
                  className={`relative overflow-hidden w-full sm:w-auto justify-center text-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-base md:text-lg px-6 md:px-8 py-3 md:py-4 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 border-2 border-blue-500 hover:border-blue-400 ${alignment === "center" ? "mx-auto flex" : alignment === "right" ? "ml-auto flex" : ""}`}
                  style={{
                    boxShadow: '0 10px 25px rgba(59, 130, 246, 0.4), 0 4px 10px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <span className="leading-tight">{config.button.text}</span>
                </Button>
              </div>
            )}

            {/* Features */}
            <div className={`w-full mt-8 md:mt-12 ${textAlignClass}`}>
              <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 w-full max-w-none md:max-w-6xl ${textAlignClass}`}>
                {config.features.filter(feature => feature.show).map((feature, idx) => {
                  const bgVariants = [
                    'bg-[#FFF8F0]', // самая светлая
                    'bg-[#F5E6D6]', // средняя
                    'bg-[#E9D8C3]', // тёмная
                  ]
                  const cardBg = bgVariants[idx % 3]
                  return (
                    <div
                      key={feature.id}
                      className={`${cardBg} rounded-xl shadow-md p-4 md:p-6 w-full flex flex-col justify-start ${textAlignClass}`}
                    >
                      <div>
                        <AnimatedContent direction="vertical" distance={40} duration={0.7} ease="power3.out" threshold={0.2} animateOpacity={true} initialOpacity={0}>
                          <div
                            className="w-full bg-white rounded-lg py-2 mb-3 text-sm md:text-lg font-bold text-gray-900 flex items-center justify-center min-h-[40px] shadow-none sm:shadow-[8px_8px_0_#000]"
                          >
                            {feature.title}
                          </div>
                        </AnimatedContent>
                        <div className={`text-gray-700 text-xs md:text-sm mb-2 ${textAlignClass}`}>{feature.description}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
        </div>
      </div>
    </section>
  )
}

export default Hero

