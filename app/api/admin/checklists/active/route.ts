import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Проверяем наличие переменных окружения
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key"

const supabase = createClient(supabaseUrl, supabaseKey)

// GET /api/admin/checklists/active
export async function GET() {
  try {
    // Проверяем, что переменные окружения настроены
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.warn("Supabase environment variables not configured")
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 503 }
      )
    }

    const { data: checklist, error } = await supabase
      .from("checklists")
      .select("*")
      .eq("is_active", true)
      .single()

    if (error) {
      console.error("Ошибка получения активного чек-листа:", error)
      return NextResponse.json(
        { error: "Активный чек-лист не найден" },
        { status: 404 }
      )
    }

    return NextResponse.json({ checklist })
  } catch (error) {
    console.error("Ошибка сервера:", error)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
} 