import { NextResponse } from "next/server"
import { readdir, stat } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function GET() {
  try {
    const uploadsDir = join(process.cwd(), "public", "uploads")

    if (!existsSync(uploadsDir)) {
      return NextResponse.json({ files: [] })
    }

    const files = await readdir(uploadsDir)
    const imageFiles = files.filter((file) => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))

    const filesWithInfo = await Promise.all(
      imageFiles.map(async (file) => {
        const filePath = join(uploadsDir, file)
        const stats = await stat(filePath)

        return {
          name: file,
          url: `/uploads/${file}`,
          size: stats.size,
          uploadDate: stats.birthtime,
          modifiedDate: stats.mtime,
        }
      }),
    )

    // Сортируем по дате загрузки (новые сначала)
    filesWithInfo.sort((a, b) => b.uploadDate.getTime() - a.uploadDate.getTime())

    return NextResponse.json({ files: filesWithInfo })
  } catch (error) {
    console.error("Ошибка получения медиафайлов:", error)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { fileName } = await request.json()

    if (!fileName) {
      return NextResponse.json({ error: "Имя файла не указано" }, { status: 400 })
    }

    const filePath = join(process.cwd(), "public", "uploads", fileName)

    if (!existsSync(filePath)) {
      return NextResponse.json({ error: "Файл не найден" }, { status: 404 })
    }

    const { unlink } = await import("fs/promises")
    await unlink(filePath)

    return NextResponse.json({ success: true, message: "Файл удален" })
  } catch (error) {
    console.error("Ошибка удаления файла:", error)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}
