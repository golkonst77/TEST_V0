import { NextResponse } from "next/server"
import { getSettings } from "@/lib/settings-store"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  try {
    const settings = await getSettings()
    console.log("Public API - returning settings:", settings)
    return NextResponse.json(settings, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
  } catch (error) {
    console.error("Error fetching public settings:", error)
    
    // Возвращаем локальные настройки вместо ошибки 500
    const fallbackSettings = {
      siteName: "Просто Бюро",
      siteDescription: "Бухгалтерские услуги",
      phone: "+7 953 330-17-77",
      email: "urist40@gmail.com",
      address: "Калуга, Дзержинского 37, офис 20",
      telegram: "@prostoburo",
      vk: "vk.com/buh_urist",
      maintenanceMode: false,
      analyticsEnabled: true,
      quiz_mode: "custom",
      quiz_url: "#popup:marquiz_685a59bddc273b0019e372cd",
      working_hours: {
        monday_friday: "9:00 - 18:00",
        saturday: "По согласованию",
        sunday: "Выходной"
      },
      logoType: "text",
      logoImageUrl: "",
      logoText: "ПростоБюро",
      logoShow: true,
      header: {
        logo: {
          show: true,
          type: "text",
          imageUrl: "",
          text: "ПростоБюро"
        }
      }
    }
    
    return NextResponse.json(fallbackSettings, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
  }
}
