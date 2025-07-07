import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// GET /api/admin/checklists/active
export async function GET() {
  try {
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