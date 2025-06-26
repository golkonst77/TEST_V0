"use client"

import Link from "next/link"
import { Phone, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useContactForm } from "@/hooks/use-contact-form"
import { AdminLoginButton } from "@/components/admin-login-button"

export const Header = () => {
  const { openContactForm } = useContactForm()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">ПБ</span>
            </div>
            <span className="font-bold text-xl">ПростоБюро</span>
          </Link>
        </div>

        {/* Navigation (simplified for brevity) */}
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
            <span>+7&nbsp;953&nbsp;330-17-77</span>
          </div>

          {/* Social + Admin */}
          <div className="flex items-center space-x-2">
            <Link href="https://t.me/prostoburo" className="p-2 rounded-full hover:bg-gray-100" aria-label="Telegram">
              <MessageCircle className="h-4 w-4" />
            </Link>
            <AdminLoginButton />
          </div>

          {/* CTA */}
          <Button
            onClick={openContactForm}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Получить скидку
          </Button>
        </div>
      </div>
    </header>
  )
}

export default Header
