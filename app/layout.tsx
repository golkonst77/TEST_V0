import type React from "react"
import type { Metadata, Viewport } from "next"
import { headers } from "next/headers"
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
import { SiteRuntimeProvider } from "@/components/site-runtime-provider"
import { getHomepageSectionsConfig } from "@/lib/visibility-store"
import { getRequestDeviceHint } from "@/lib/request-device"

export const metadata: Metadata = {
  title: "ПростоБюро - Бухгалтерские услуги в Калуге и по всей России",
  description:
    "Ваш личный щит от налоговой. Бухгалтерские услуги, зарплата и кадры, юридическое сопровождение для ИП и ООО.",
  keywords: "бухгалтерские услуги, Калуга, налоги, отчетность, ИП, ООО",
  generator: "v0.dev",
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

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const ymId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID || "45860892"
  const headerList = headers()

  const [homeSections, initialDeviceHint] = await Promise.all([
    getHomepageSectionsConfig(),
    Promise.resolve(getRequestDeviceHint(headerList)),
  ])
  const initialSectionsConfig = homeSections.config

  return (
    <html lang="ru">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style dangerouslySetInnerHTML={{ __html: `
          body { margin: 0; font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
          .hero-section { min-height: 600px; position: relative; }
          @media (min-width: 768px) { .hero-section { min-height: 100vh; } }
        `}} />

        <link rel="preload" href="/uploads/hero-bg.webp" as="image" fetchPriority="high" />
        <link rel="preload" href="/uploads/1751551383681________.jpg" as="image" />

        <link rel="dns-prefetch" href="https://mc.yandex.ru" />
        <link rel="dns-prefetch" href="https://qbjcdftphxredexkwsui.supabase.co" />
        <link rel="dns-prefetch" href="https://vercel.com" />
      </head>
      <body>
        <SiteRuntimeProvider initialSectionsConfig={initialSectionsConfig} initialDeviceHint={initialDeviceHint}>
          <Header />
          <VisibilityGuard sectionKey="ausn-blob">
            <AusnBlobButton />
          </VisibilityGuard>
          <VisibilityGuard sectionKey="risk-blob">
            <RiskBlobButton />
          </VisibilityGuard>
          {children}

          <Footer />
          <ContactForm />
          <HiddenAdminAccess />
          <CookieConsent ymId={ymId} />
          <Toaster />
          <SonnerToaster position="top-right" />
        </SiteRuntimeProvider>
      </body>
    </html>
  )
}
