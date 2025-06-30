import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ContactForm } from "@/components/contact-form"
import { FloatingAdminButton } from "@/components/floating-admin-button"
import { Toaster } from "@/components/ui/toaster"
import { YandexMetrica } from "@/components/yandex-metrica"
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
        <Header />
        {/* ВРЕМЕННАЯ КНОПКА ДЛЯ ОТЛАДКИ */}
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 10000, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
          <a
            href="/admin"
            style={{
              margin: 8,
              padding: '8px 24px',
              background: 'linear-gradient(90deg, #6366f1 0%, #a21caf 100%)',
              color: '#fff',
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 18,
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              border: 'none',
              pointerEvents: 'auto',
              textDecoration: 'none',
              transition: 'filter 0.2s',
              filter: 'drop-shadow(0 2px 8px rgba(99,102,241,0.2))',
            }}
          >
            Админка (отладка)
          </a>
        </div>
        {children}
        <Footer />
        <ContactForm />
        <FloatingAdminButton />
        <Toaster />
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
      </body>
    </html>
  )
}
