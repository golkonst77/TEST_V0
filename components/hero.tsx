"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, CheckCircle, DollarSign, AlertTriangle } from "lucide-react"
import { useContactForm } from "@/hooks/use-contact-form"
import { AdminQuickAccess } from "./admin-quick-access"
import { useEffect, useState } from "react"

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
    alignment: "left" | "center" | "right"
    maxWidth: string
  }
}

const defaultConfig: HeroConfig = {
  badge: {
    text: "Защищаем ваш бизнес от налоговых рисков",
    show: true,
  },
  title: {
    text: "Ваш личный",
    highlightText: "щит",
  },
  description:
    "Пока вы строите свою империю, мы защищаем её тылы от проверок, штрафов и бумажной волокиты. Спокойно занимайтесь завоеванием мира.",
  button: {
    text: "Хочу на круиз без штрафов",
    show: true,
  },
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
  background: {
    image: "/hero-bg.jpg",
    overlay: 30,
  },
  layout: {
    alignment: "left",
    maxWidth: "max-w-2xl",
  },
}

export function Hero() {
  const { openContactForm } = useContactForm()
  const [config, setConfig] = useState<HeroConfig>(defaultConfig)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch("/api/homepage")
        // если сервер вернул не-JSON (например, HTML ошибки) — используем конфиг по умолчанию
        const isJson = response.headers.get("content-type")?.includes("application/json")
        if (response.ok && isJson) {
          const data = await response.json()
          setConfig(data.hero || defaultConfig)
        } else {
          console.warn("Homepage config: non-JSON response, fallback to default")
          setConfig(defaultConfig)
        }
      } catch (error) {
        console.error("Error fetching hero config:", error)
        setConfig(defaultConfig)
      } finally {
        setLoading(false)
      }
    }

    fetchConfig()
  }, [])

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "DollarSign":
        return DollarSign
      case "AlertTriangle":
        return AlertTriangle
      case "CheckCircle":
        return CheckCircle
      default:
        return Shield
    }
  }

  const getColorClasses = (color: string) => {
    switch (color) {
      case "red":
        return { bg: "bg-red-100", text: "text-red-600" }
      case "orange":
        return { bg: "bg-orange-100", text: "text-orange-600" }
      case "green":
        return { bg: "bg-green-100", text: "text-green-600" }
      default:
        return { bg: "bg-blue-100", text: "text-blue-600" }
    }
  }

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </section>
    )
  }

  const alignmentClass = {
    left: "text-left",
    center: "text-center mx-auto",
    right: "text-right ml-auto",
  }[config.layout.alignment]

  return (
    <section className="relative overflow-hidden min-h-screen flex items-center">
      {/* Background Image */}
      {config.background.image && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${config.background.image})`,
          }}
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-white" style={{ opacity: config.background.overlay / 100 }} />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-grid-slate-200/20 [mask-image:linear-gradient(0deg,transparent,rgba(0,0,0,0.1))]" />

      <div className="container relative z-10">
        <div className={`${config.layout.maxWidth} ${alignmentClass}`}>
          {/* Badge */}
          {config.badge.show && (
            <div className="mb-8 inline-flex items-center rounded-full border border-white/50 bg-white/80 backdrop-blur-sm px-4 py-2 text-sm shadow-sm">
              <Shield className="mr-2 h-4 w-4 text-blue-600" />
              {config.badge.text}
            </div>
          )}

          {/* Title */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
            {config.title.text}{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              "{config.title.highlightText}"
            </span>{" "}
            от налоговой
          </h1>

          {/* Description */}
          <p className="mb-8 text-xl text-gray-700 sm:text-2xl font-medium">{config.description}</p>

          {/* Button */}
          {config.button.show && (
            <div className="mb-12">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6 shadow-xl"
                onClick={openContactForm}
              >
                {config.button.text}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          )}

          {/* Features */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 max-w-2xl">
            {config.features
              .filter((feature) => feature.show)
              .map((feature) => {
                const IconComponent = getIcon(feature.icon)
                const colors = getColorClasses(feature.color)

                return (
                  <div
                    key={feature.id}
                    className="flex flex-col items-center space-y-3 p-4 rounded-lg bg-white/70 backdrop-blur-sm border border-white/50 shadow-sm"
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full ${colors.bg}`}>
                      <IconComponent className={`h-6 w-6 ${colors.text}`} />
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

        <AdminQuickAccess />
      </div>
    </section>
  )
}

export default Hero
