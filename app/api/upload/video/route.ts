import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

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

    // Проверяем тип файла
    const allowedTypes = ['video/mp4', 'video/webm', 'video/mov', 'video/avi']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Неподдерживаемый формат видео' }, { status: 400 })
    }

    // Проверяем размер файла (максимум 100MB)
    const maxSize = 100 * 1024 * 1024 // 100MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'Файл слишком большой (максимум 100MB)' }, { status: 400 })
    }

    // Создаем директорию для видео, если она не существует
    const uploadDir = path.join(process.cwd(), 'public', 'videos')
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (error) {
      // Директория уже существует
    }

    // Генерируем уникальное имя файла
    const timestamp = Date.now()
    const fileExtension = path.extname(file.name)
    const fileName = `video_${timestamp}${fileExtension}`
    const filePath = path.join(uploadDir, fileName)

    // Сохраняем файл
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Возвращаем URL для доступа к видео
    const videoUrl = `/videos/${fileName}`
    
    return NextResponse.json({ 
      success: true, 
      videoUrl,
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