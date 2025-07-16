/**
 * @file: route.ts
 * @description: API endpoint для проверки режима технического обслуживания
 * @dependencies: Next.js, settings-store
 * @created: 2025-01-07
 */

import { NextResponse } from "next/server"
import { getSettings } from "@/lib/settings-store"

export async function GET() {
  try {
    const settings = await getSettings()
    
    if (!settings) {
      return NextResponse.json({ 
        maintenanceMode: false,
        message: "Settings not found, defaulting to normal mode" 
      })
    }

    return NextResponse.json({
      maintenanceMode: settings.maintenanceMode || false,
      settings: {
        siteName: settings.siteName,
        phone: settings.phone,
        email: settings.email,
        working_hours: settings.working_hours
      }
    })
  } catch (error) {
    console.error("Error checking maintenance mode:", error)
    return NextResponse.json({ 
      maintenanceMode: false,
      message: "Error checking maintenance mode, defaulting to normal mode" 
    })
  }
} 