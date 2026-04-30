import type React from "react"
import type { Metadata, Viewport } from "next"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ContactForm } from "@/components/contact-form"
import { HiddenAdminAccess } from "@/components/hidden-admin-access"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from "sonner"
import { CookieConsent } from "@/components/cookie-consent"
import { AusnBlobButton } from "@/components/AusnBlobButton"
import { RiskBlobButton } from "@/components/RiskBlobButton"
import { VisibilityGuard } from "@/components/visibility-guard"

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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Inline Critical CSS для мгновенной отрисовки */}
        <style dangerouslySetInnerHTML={{ __html: `
          body { margin: 0; font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
          .hero-section { min-height: 600px; position: relative; }
          @media (min-width: 768px) { .hero-section { min-height: 100vh; } }
        `}} />
        
        {/* Preload критических ресурсов для улучшения LCP и FCP */}
        <link rel="preload" href="/uploads/hero-bg.webp" as="image" fetchPriority="high" />
        <link rel="preload" href="/uploads/1751551383681________.jpg" as="image" />
        
        {/* Preconnect к внешним ресурсам для ускорения */}
        <link rel="dns-prefetch" href="https://mc.yandex.ru" />
        <link rel="dns-prefetch" href="https://qbjcdftphxredexkwsui.supabase.co" />
        <link rel="dns-prefetch" href="https://vercel.com" />
      </head>
      <body>
          {/* Критический контент (выше fold) */}
          <Header />
          <VisibilityGuard sectionKey="ausn-blob">
            <AusnBlobButton />
          </VisibilityGuard>
          <VisibilityGuard sectionKey="risk-blob">
            <RiskBlobButton />
          </VisibilityGuard>
          {children}
          
          {/* Не-критический контент (ниже fold) - загружается позже */}
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
