import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: Request) {
  try {
    // Получаем активный чек-лист (только один может быть активным)
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

    // Получаем публичный URL файла из Storage
    const { data: { publicUrl } } = supabase.storage
      .from("checklists")
      .getPublicUrl(checklist.file_url)

    // Возвращаем чек-лист с полным URL файла
    return NextResponse.json({ 
      checklist: {
        ...checklist,
        file_url: publicUrl
      }
    })
  } catch (error) {
    console.error("Ошибка сервера:", error)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
} 