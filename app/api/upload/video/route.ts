import { NextRequest, NextResponse } from "next/server"
import { existsSync, mkdirSync, writeFileSync } from "fs"
import { join, extname } from "path"

export async function POST(request: NextRequest) {
  console.log('=== VIDEO UPLOAD API CALLED ===')
  try {
    console.log('Parsing form data...')
    const formData = await request.formData()
    console.log('Form data parsed, getting video file...')
    const file = formData.get('video') as File
    console.log('File from form data:', file ? `${file.name} (${file.size} bytes, ${file.type})` : 'null')
    
    if (!file) {
      return NextResponse.json({ error: 'Файл не найден' }, { status: 400 })
    }

    // Проверяем тип файла (учитываем что на некоторых системах type может быть пустым/octet-stream)
    const nameLower = (file.name || "").toLowerCase()
    const ext = extname(nameLower)
    const allowedMime = new Set(["video/mp4", "video/webm", "video/quicktime"])
    const allowedExt = new Set([".mp4", ".webm", ".mov"])

    const mimeOk = file.type && allowedMime.has(file.type)
    const extOk = allowedExt.has(ext)

    if (!mimeOk) {
      if (file.type === '' || file.type === 'application/octet-stream') {
        if (!extOk) {
          return NextResponse.json({ error: 'Неподдерживаемый формат видео' }, { status: 400 })
        }
      } else {
        return NextResponse.json({ error: 'Неподдерживаемый формат видео' }, { status: 400 })
      }
    }

    // Проверяем размер файла (максимум 100MB)
    const maxSize = 100 * 1024 * 1024 // 100MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'Файл слишком большой (максимум 100MB)' }, { status: 400 })
    }

    // Строго: сохраняем в /public/videos
    const uploadDir = join(process.cwd(), "public", "videos")
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true })
    }

    // Генерируем уникальное имя файла
    const timestamp = Date.now()
    const fileExtension = ext || ".mp4"
    const fileName = `video_${timestamp}${fileExtension}`
    const savePath = join(uploadDir, fileName)

    // Сохраняем файл
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    writeFileSync(savePath, buffer)

    // Возвращаем URL для доступа к видео
    const publicUrl = `/videos/${fileName}`

    console.log("VIDEO SAVE PATH:", savePath)
    console.log("VIDEO PUBLIC URL:", publicUrl)
    
    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      videoUrl: publicUrl,
      fileName,
      size: file.size 
    })

  } catch (error) {
    console.error('Ошибка загрузки видео:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
} 