import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Проверяем наличие переменных окружения
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key"

const supabase = createClient(supabaseUrl, supabaseKey)

// GET /api/admin/checklists
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

    const { data: checklists, error } = await supabase
      .from("checklists")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ checklists })
  } catch (error) {
    console.error("Ошибка получения чек-листов:", error)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}

// POST /api/admin/checklists
export async function POST(request: Request) {
  try {
    // Проверяем, что переменные окружения настроены
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.warn("Supabase environment variables not configured")
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { name, file_url, quiz_result } = body

    if (!name || !file_url || !quiz_result) {
      return NextResponse.json(
        { error: "Не все обязательные поля заполнены" },
        { status: 400 }
      )
    }

    const { data: checklist, error } = await supabase
      .from("checklists")
      .insert([{ name, file_url, quiz_result }])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, checklist })
  } catch (error) {
    console.error("Ошибка создания чек-листа:", error)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
} 