import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "Файл не найден" }, { status: 400 })
    }

    // Проверяем тип файла
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp", "application/pdf"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Неподдерживаемый тип файла" }, { status: 400 })
    }

    // Проверяем размер файла (максимум 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Файл слишком большой (максимум 5MB)" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Создаем уникальное имя файла
    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
    const fileName = `${timestamp}_${originalName}`

    // Определяем bucket в зависимости от типа файла
    const bucket = file.type.startsWith("image/") ? "images" : "checklists"

    // Загружаем файл в Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false
      })

    if (error) {
      console.error("Ошибка загрузки в Storage:", error)
      return NextResponse.json({ error: "Ошибка загрузки файла" }, { status: 500 })
    }

    // Получаем публичный URL файла для проверки
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName)

    // Проверяем доступность файла
    try {
      const fileCheck = await fetch(publicUrl, { method: 'HEAD' })
      if (!fileCheck.ok) {
        // Если файл недоступен, удаляем его из Storage
        await supabase.storage.from(bucket).remove([fileName])
        return NextResponse.json({ error: "Ошибка загрузки файла" }, { status: 500 })
      }
    } catch (error) {
      // Если произошла ошибка, удаляем файл из Storage
      await supabase.storage.from(bucket).remove([fileName])
      return NextResponse.json({ error: "Ошибка загрузки файла" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      url: fileName, // Возвращаем только имя файла для сохранения в БД
      fileName: fileName,
      originalName: file.name,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    console.error("Ошибка загрузки файла:", error)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}
