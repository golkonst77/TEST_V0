"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, CheckCircle, DollarSign, AlertTriangle } from "lucide-react"
import { useContactForm } from "@/hooks/use-contact-form"

// Типы для Marquiz API
declare global {
  interface Window {
    MARQUIZ?: {
      popup?: (url: string) => void
    }
  }
}

const iconMap = {
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Shield,
}

const colorMap = {
  red: "bg-red-100 text-red-600",
  orange: "bg-orange-100 text-orange-600",
  green: "bg-green-100 text-green-600",
  blue: "bg-blue-100 text-blue-600",
  purple: "bg-purple-100 text-purple-600",
}

export function Hero() {
  const { openContactForm } = useContactForm()
  const [config, setConfig] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchConfig()
    // Обновляем настройки каждые 10 секунд для отражения изменений
    const interval = setInterval(fetchConfig, 10000)
    return () => clearInterval(interval)
  }, [])

  const fetchConfig = async () => {
    try {
      console.log("Hero: Загрузка настроек...")
      const response = await fetch("/api/homepage")

      if (response.ok) {
        const data = await response.json()
        console.log("Hero: Настройки загружены:", data.hero)
        setConfig(data.hero)
      } else {
        console.error("Hero: Ошибка загрузки настроек:", response.status)
      }
    } catch (error) {
      console.error("Hero: Ошибка загрузки конфигурации:", error)
    } finally {
      setLoading(false)
    }
  }

  // Новый обработчик для кнопки круиза
  const handleCruiseClick = async () => {
    try {
      const res = await fetch("/api/settings")
      const settings = await res.json()
      console.log("[CRUISE] settings:", settings)
      if (settings.quiz_mode === "custom") {
        console.log("[CRUISE] mode: custom → openContactForm")
        openContactForm()
      } else if (settings.quiz_mode === "external" && settings.quiz_url) {
        console.log("[CRUISE] mode: external, url:", settings.quiz_url)
        if (settings.quiz_url.startsWith("#popup:marquiz_")) {
          const quizId = settings.quiz_url.split("_")[1]
          console.log("[CRUISE] Detected Marquiz popup, quizId:", quizId)
          // Создаем popup окно с агрессивными параметрами
          console.log("[CRUISE] Creating aggressive popup window:", settings.quiz_url)
          
          const directUrl = `https://quiz.marquiz.ru/${quizId}`
          
          // Более агрессивные параметры для принуждения popup
          const width = 1200
          const height = 800
          const left = Math.round((screen.width - width) / 2)
          const top = Math.round((screen.height - height) / 2)
          
          const features = [
            `width=${width}`,
            `height=${height}`,
            `left=${left}`,
            `top=${top}`,
            'resizable=yes',
            'scrollbars=yes',
            'toolbar=no',
            'menubar=no',
            'location=no',
            'directories=no',
            'status=no',
            'titlebar=no',
            'fullscreen=no',
            'channelmode=no'
          ].join(',')
          
          console.log("[CRUISE] Opening with features:", features)
          
          const popup = window.open(directUrl, 'marquiz_quiz_window', features)
          
          if (popup) {
            popup.focus()
            console.log("[CRUISE] Popup window opened and focused")
            
            // Принудительно фокусируем окно через небольшую задержку
            setTimeout(() => {
              if (popup && !popup.closed) {
                popup.focus()
                console.log("[CRUISE] Popup refocused")
              }
            }, 100)
          } else {
            console.log("[CRUISE] Failed to open popup")
            window.open(directUrl, "_blank")
          }
        } else {
          // Обычная внешняя ссылка
          console.log("[CRUISE] Opening external link:", settings.quiz_url)
          window.open(settings.quiz_url, "_blank")
        }
      } else {
        console.log("[CRUISE] No valid quiz configuration, fallback to contact form")
        openContactForm()
      }
    } catch (error) {
      console.error("[CRUISE] Error:", error)
      openContactForm()
    }
  }

  // Значения по умолчанию
  const defaultConfig = {
    badge: { text: "Защищаем ваш бизнес от налоговых рисков", show: true },
    title: { text: "Ваш личный", highlightText: "щит" },
    description:
      "Пока вы строите свою империю, мы защищаем её тылы от проверок, штрафов и бумажной волокиты. Спокойно занимайтесь завоеванием мира.",
    button: { text: "Хочу на круиз без штрафов", show: true },
    features: [
      {
        id: "expensive",
        title: "Дорого",
        description: "Штрафы и пени съедают прибыль",
        icon: "DollarSign",
        color: "red",
        show: true,
      },
      {
        id: "scary",
        title: "Страшно",
        description: "Проверки и бумажная волокита",
        icon: "AlertTriangle",
        color: "orange",
        show: true,
      },
      {
        id: "perfect",
        title: "Идеально",
        description: "Спокойствие и рост бизнеса",
        icon: "CheckCircle",
        color: "green",
        show: true,
      },
    ],
    background: { image: "/hero-bg.jpg", overlay: 30 },
    layout: { alignment: "center", maxWidth: "max-w-4xl", marginLeft: 0, marginTop: 0, marginBottom: 0, paddingX: 20 },
  }

  const activeConfig = config || defaultConfig

  if (loading) {
    return (
      <section className="relative overflow-hidden min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Загрузка...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="relative overflow-hidden min-h-screen flex items-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${activeConfig.background.image})`,
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-white" style={{ opacity: activeConfig.background.overlay / 100 }} />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-grid-slate-200/20 [mask-image:linear-gradient(0deg,transparent,rgba(0,0,0,0.1))]" />

      <div
        className="container relative z-10 mx-auto"
        style={{
          paddingLeft: `${activeConfig.layout.marginLeft}px`,
          paddingTop: `${activeConfig.layout.marginTop}px`,
          paddingBottom: `${activeConfig.layout.marginBottom}px`,
        }}
      >
        <div
          className={`${activeConfig.layout.maxWidth} mx-auto text-${activeConfig.layout.alignment}`}
          style={{
            paddingLeft: `${activeConfig.layout.paddingX}px`,
            paddingRight: `${activeConfig.layout.paddingX}px`,
          }}
        >
          {/* Badge */}
          {activeConfig.badge.show && (
            <div className="mb-8 inline-flex items-center rounded-full border border-white/50 bg-white/80 backdrop-blur-sm px-4 py-2 text-sm shadow-sm">
              <Shield className="mr-2 h-4 w-4 text-blue-600" />
              {activeConfig.badge.text}
            </div>
          )}

          {/* Title */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
            {activeConfig.title.text}{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              "{activeConfig.title.highlightText}"
            </span>{" "}
            от налоговой
          </h1>

          {/* Description */}
          <p className="mb-8 text-xl text-gray-700 sm:text-2xl font-medium">{activeConfig.description}</p>

          {/* Button */}
          {activeConfig.button.show && (
            <div className="mb-12">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6 shadow-xl"
                onClick={handleCruiseClick}
              >
                {activeConfig.button.text}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          )}

          {/* Features */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 max-w-3xl mx-auto">
            {activeConfig.features
              .filter((feature: any) => feature.show)
              .map((feature: any) => {
                const IconComponent = iconMap[feature.icon as keyof typeof iconMap] || DollarSign
                const colorClass = colorMap[feature.color as keyof typeof colorMap] || "bg-gray-100 text-gray-600"

                return (
                  <div
                    key={feature.id}
                    className="flex flex-col items-center space-y-3 p-4 rounded-lg bg-white/70 backdrop-blur-sm border border-white/50 shadow-sm"
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full ${colorClass}`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div className="text-center">
                      <h3 className="font-semibold text-gray-900 text-sm">{feature.title}</h3>
                      <p className="text-xs text-gray-700">{feature.description}</p>
                    </div>
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
