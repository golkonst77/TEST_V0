import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
let supabase: any = null
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey)
}

interface ImportedReview {
  author?: string
  name?: string
  text?: string
  rating?: number
  date?: string
  source?: string
}

export async function POST(req: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase не настроен' }, { status: 500 })
  }
  const { jsonFile } = await req.json()
  if (!jsonFile) {
    return NextResponse.json({ error: 'Не указано имя файла' }, { status: 400 })
  }

  const jsonPath = path.join(process.cwd(), 'public', jsonFile)
  let content = ''
  try {
    content = fs.readFileSync(jsonPath, 'utf-8')
  } catch (e: any) {
    return NextResponse.json({ success: false, message: `Ошибка чтения файла: ${e.message}` }, { status: 500 })
  }

  let data: any
  try {
    data = JSON.parse(content)
  } catch (e: any) {
    return NextResponse.json({ success: false, message: `Некорректный JSON: ${e.message}` }, { status: 400 })
  }

  const reviews: ImportedReview[] = Array.isArray(data?.reviews) ? data.reviews : (Array.isArray(data) ? data : [])
  if (!reviews.length) {
    return NextResponse.json({ success: false, message: 'В JSON не найдено отзывов' }, { status: 400 })
  }

  let imported = 0
  let skipped = 0
  const errors: string[] = []

  for (const r of reviews) {
    const name = r.author || r.name || 'Гость'
    const text = r.text || ''
    const rating = r.rating || 5
    const source = 'yandex'

    if (!text || text.length < 3) {
      skipped++
      continue
    }

    try {
      const { data: exists, error: checkError } = await supabase
        .from('reviews')
        .select('id')
        .eq('name', name)
        .eq('text', text)
        .eq('source', source)
      if (checkError) throw checkError
      if (exists && exists.length > 0) {
        skipped++
        continue
      }

      const { error: insertError } = await supabase
        .from('reviews')
        .insert({
          name,
          text,
          rating,
          source,
          is_published: true,
          is_featured: false,
          published_at: new Date().toISOString(),
          admin_notes: `Импортировано из JSON ${jsonFile}`
        })
      if (insertError) throw insertError
      imported++
    } catch (e: any) {
      errors.push(String(e.message || e))
    }
  }

  return NextResponse.json({ success: true, imported, skipped, errors })
}


