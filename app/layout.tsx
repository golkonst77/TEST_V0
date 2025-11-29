import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ContactForm } from "@/components/contact-form"
import { HiddenAdminAccess } from "@/components/hidden-admin-access"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from "sonner"
import { CookieConsent } from "@/components/cookie-consent"

const inter = Inter({ 
  subsets: ["latin", "cyrillic"],
  display: 'swap', // Оптимизация загрузки шрифта
  preload: true,
})

export const metadata: Metadata = {
  title: "ПростоБюро - Бухгалтерские услуги в Калуге и по всей России",
  description:
    "Ваш личный щит от налоговой. Бухгалтерские услуги, зарплата и кадры, юридическое сопровождение для ИП и ООО.",
  keywords: "бухгалтерские услуги, Калуга, налоги, отчетность, ИП, ООО",
  generator: "v0.dev",
  // Оптимизация для соцсетей
  openGraph: {
    title: "ПростоБюро - Бухгалтерские услуги",
    description: "Ваш личный щит от налоговой",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const ymId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID || "45860892"
  
  return (
    <html lang="ru">
      <head>
        {/* Preconnect к внешним ресурсам для ускорения */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://mc.yandex.ru" />
        <link rel="dns-prefetch" href="https://qbjcdftphxredexkwsui.supabase.co" />
      </head>
      <body className={inter.className}>
          <Header />
          {children}
          <Footer />
          <ContactForm />
          <HiddenAdminAccess />
          <CookieConsent ymId={ymId} />
          <Toaster />
          <SonnerToaster position="top-right" />
      </body>
    </html>
  )
}
