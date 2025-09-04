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
import { YandexMetrica } from "@/components/yandex-metrica"

const inter = Inter({ subsets: ["latin", "cyrillic"] })

export const metadata: Metadata = {
  title: "ПростоБюро - Бухгалтерские услуги в Калуге и по всей России",
  description:
    "Ваш личный щит от налоговой. Бухгалтерские услуги, зарплата и кадры, юридическое сопровождение для ИП и ООО.",
  keywords: "бухгалтерские услуги, Калуга, налоги, отчетность, ИП, ООО",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const ymId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID || "45860892"
  
  return (
    <html lang="ru">
      <body className={inter.className}>
        <YandexMetrica ymId={ymId} />
          <Header />
          {children}
          <Footer />
          <ContactForm />
          <HiddenAdminAccess />
          <Toaster />
          <SonnerToaster position="top-right" />
      </body>
    </html>
  )
}
