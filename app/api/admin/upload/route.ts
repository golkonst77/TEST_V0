import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"

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

    // Путь к папке uploads
    const uploadsDir = join(process.cwd(), "public", "uploads")
    
    // Создаем папку uploads, если её нет
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (error) {
      console.error("Ошибка создания папки uploads:", error)
    }

    // Путь к файлу
    const filePath = join(uploadsDir, fileName)

    try {
      // Сохраняем файл локально
      await writeFile(filePath, buffer)
      
      // Возвращаем URL для доступа к файлу
      const fileUrl = `/uploads/${fileName}`

      return NextResponse.json({
        success: true,
        url: fileUrl,
        fileName: fileName,
        originalName: file.name,
        size: file.size,
        type: file.type,
      })
    } catch (error) {
      console.error("Ошибка сохранения файла:", error)
      return NextResponse.json({ error: "Ошибка сохранения файла" }, { status: 500 })
    }
  } catch (error) {
    console.error("Ошибка загрузки файла:", error)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}
