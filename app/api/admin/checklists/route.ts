import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// GET /api/admin/checklists
export async function GET() {
  try {
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

// PUT /api/admin/checklists/set-active
export async function PUT(request: Request) {
  try {
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