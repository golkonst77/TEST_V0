import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Проверяем наличие переменных окружения
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key"

const supabase = createClient(supabaseUrl, supabaseKey)

// PUT /api/admin/checklists/set-active
export async function PUT(request: Request) {
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
    const { checklistId } = body

    if (!checklistId) {
      return NextResponse.json(
        { error: "Не указан ID чек-листа" },
        { status: 400 }
      )
    }

    // Сначала сбрасываем is_active для всех чек-листов
    const { error: resetError } = await supabase
      .from("checklists")
      .update({ is_active: false })
      .neq("is_active", true) // просто чтобы был WHERE, иначе PostgREST ругается

    if (resetError) throw resetError

    // Затем устанавливаем is_active = true для выбранного чек-листа
    const { data: checklist, error } = await supabase
      .from("checklists")
      .update({ is_active: true })
      .eq("id", checklistId)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, checklist })
  } catch (error) {
    console.error("Ошибка установки активного чек-листа:", error)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
} 