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
import { MaintenanceWrapper } from "@/components/maintenance-wrapper"
import Script from 'next/script'

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
  const ymId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID || "103085667"
  
  return (
    <html lang="ru">
      <head>
        <Script id="marquiz" strategy="afterInteractive">
          {`
            (function(w, d, s, o){
              var j = d.createElement(s); j.async = true; j.src = '//script.marquiz.ru/v2.js';j.onload = function() {
                if (document.readyState !== 'loading') Marquiz.init(o);
                else document.addEventListener("DOMContentLoaded", function() {
                  Marquiz.init(o);
                });
              };
              d.head.insertBefore(j, d.head.firstElementChild);
            })(window, document, 'script', {
                host: '//quiz.marquiz.ru',
                region: 'ru',
                id: '685a59bddc273b0019e372cd',
                autoOpen: false,
                autoOpenFreq: 'once',
                openOnExit: false,
                disableOnMobile: false
              }
            );
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <YandexMetrica ymId={ymId} />
        <MaintenanceWrapper>
          <Header />

          {children}
          <Footer />
          <ContactForm />
          <HiddenAdminAccess />

          <Toaster />
          <SonnerToaster position="top-right" />
        </MaintenanceWrapper>
      </body>
    </html>
  )
}
