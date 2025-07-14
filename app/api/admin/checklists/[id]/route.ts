import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Проверяем наличие переменных окружения
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key"

const supabase = createClient(supabaseUrl, supabaseKey)

// PATCH /api/admin/checklists/[id]
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
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
    const { quiz_result, is_active } = body

    const updateData: any = {}
    
    if (quiz_result !== undefined) {
      updateData.quiz_result = quiz_result
    }
    
    if (is_active !== undefined) {
      updateData.is_active = is_active
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "Не указаны данные для обновления" },
        { status: 400 }
      )
    }

    const { data: checklist, error } = await supabase
      .from("checklists")
      .update(updateData)
      .eq("id", params.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, checklist })
  } catch (error) {
    console.error("Ошибка обновления чек-листа:", error)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}

// DELETE /api/admin/checklists/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Проверяем, что переменные окружения настроены
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.warn("Supabase environment variables not configured")
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 503 }
      )
    }

    const { error } = await supabase
      .from("checklists")
      .delete()
      .eq("id", params.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Ошибка удаления чек-листа:", error)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
} 