"use client"

import Link from "next/link"
import { Phone, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useContactForm } from "@/hooks/use-contact-form"
import { useState, useEffect } from "react"

interface SiteSettings {
  siteName: string
  phone: string
  telegram: string
  vk: string
}

export const Header = () => {
  const { openContactForm } = useContactForm()
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: "ПростоБюро",
    phone: "+7 953 330-17-77",
    telegram: "https://t.me/prostoburo",
    vk: "https://m.vk.com/buh_urist?from=groups",
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings")
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error("Error fetching settings:", error)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">ПБ</span>
            </div>
            <span className="font-bold text-xl">{settings.siteName}</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-6 text-sm">
            <li>
              <Link href="/services" className="hover:text-blue-600">
                Услуги
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="hover:text-blue-600">
                Тарифы
              </Link>
            </li>
            <li>
              <Link href="/calculator" className="hover:text-blue-600">
                Калькулятор
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-blue-600">
                Блог
              </Link>
            </li>
            <li>
              <Link href="/contacts" className="hover:text-blue-600">
                Контакты
              </Link>
            </li>
          </ul>
        </nav>

        {/* Right side widgets */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 text-sm">
            <Phone className="h-4 w-4" />
            <span>{settings.phone}</span>
          </div>

          {/* Social links */}
          <div className="flex items-center space-x-2">
            <Link href={settings.telegram} className="p-2 rounded-full hover:bg-gray-100" aria-label="Telegram">
              <MessageCircle className="h-4 w-4" />
            </Link>
            <Link href={settings.vk} className="p-2 rounded-full hover:bg-gray-100" aria-label="VK">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1.01-1.49-.9-1.49.4v1.608c0 .432-.138.69-1.276.69-1.966 0-4.644-1.193-6.36-3.428C4.304 11.13 3.568 8.28 3.568 7.648c0-.414.138-.69.966-.69h1.744c.69 0 .966.276 1.241 1.172.69 2.07 1.863 3.428 2.346 3.428.276 0 .414-.138.414-.9V9.936c-.069-1.241-.725-1.345-.725-1.793 0-.345.276-.69.725-.69h2.76c.588 0 .795.276.795.966v2.898c0 .588.276.795.414.795.276 0 .588-.207 1.172-.795 1.241-1.379 2.139-3.566 2.139-3.566.138-.345.414-.69 1.103-.69h1.744c.828 0 1.01.414.828.966-.414 1.24-2.484 4.062-2.484 4.062-.276.414-.207.588 0 .966.207.276 1.103 1.103 1.655 1.793.552.69.966 1.379.69 1.793z" />
              </svg>
            </Link>
          </div>

          {/* CTA */}
          <Button
            onClick={openContactForm}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Хочу на круиз без штрафов
          </Button>
        </div>
      </div>
    </header>
  )
}

export default Header
