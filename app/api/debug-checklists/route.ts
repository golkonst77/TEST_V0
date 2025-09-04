import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  try {
    // Проверяем наличие переменных окружения
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.log("Supabase environment variables not found - using fallback")
      return NextResponse.json({ 
        checklists: [],
        storageChecks: [],
        total: 0,
        message: "Supabase не настроен - используем fallback"
      })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Получаем все чек-листы
    const { data: checklists, error } = await supabase
      .from("checklists")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Ошибка получения чек-листов:", error)
      return NextResponse.json({ error: "Ошибка получения данных" }, { status: 500 })
    }

    // Проверяем каждый файл в Storage
    const storageChecks = []
    for (const checklist of checklists || []) {
      try {
        const { data: { publicUrl } } = supabase.storage
          .from("checklists")
          .getPublicUrl(checklist.file_url)

        const fileCheck = await fetch(publicUrl, { method: 'HEAD' })
        
        storageChecks.push({
          id: checklist.id,
          name: checklist.name,
          file_url: checklist.file_url,
          public_url: publicUrl,
          accessible: fileCheck.ok,
          status: fileCheck.status
        })
      } catch (error) {
        storageChecks.push({
          id: checklist.id,
          name: checklist.name,
          file_url: checklist.file_url,
          error: (error as Error).message
        })
      }
    }

    return NextResponse.json({ 
      checklists,
      storageChecks,
      total: checklists?.length || 0
    })
  } catch (error) {
    console.error("Ошибка сервера:", error)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
} 