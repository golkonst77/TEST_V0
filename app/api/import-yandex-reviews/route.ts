import { NextRequest, NextResponse } from 'next/server'
import { spawn } from 'child_process'
import path from 'path'
import fs from 'fs'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
let supabase: any = null
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey)
}

export async function POST(req: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase не настроен' }, { status: 500 })
  }
  const { htmlFile } = await req.json()
  if (!htmlFile) {
    return NextResponse.json({ error: 'Не указано имя файла' }, { status: 400 })
  }
  const htmlPath = path.join(process.cwd(), 'public', htmlFile)
  const scriptPath = path.join(process.cwd(), 'scripts', 'yandex_parser.py')
  let htmlContent = ''
  try {
    htmlContent = fs.readFileSync(htmlPath, { encoding: 'utf-8' })
  } catch (e) {
    return NextResponse.json({ error: 'Не удалось прочитать HTML-файл', details: String(e), htmlPath }, { status: 400 })
  }
  const pythonProcess = spawn('python', ['-X', 'utf8', scriptPath, '--stdin'], {
    stdio: ['pipe', 'pipe', 'pipe'],
    env: { ...process.env, PYTHONIOENCODING: 'utf-8', PYTHONUTF8: '1', PYTHONLEGACYWINDOWSSTDIO: 'utf-8' }
  })
  let stdoutBuffers: Buffer[] = []
  let stderrBuffers: Buffer[] = []
  pythonProcess.stdout.on('data', (data) => { stdoutBuffers.push(Buffer.isBuffer(data) ? data : Buffer.from(data)) })
  pythonProcess.stderr.on('data', (data) => { stderrBuffers.push(Buffer.isBuffer(data) ? data : Buffer.from(data)) })
  return new Promise((resolve) => {
    // Подаём HTML в stdin и закрываем поток
    try {
      pythonProcess.stdin.write(htmlContent, 'utf8')
      pythonProcess.stdin.end()
    } catch (e) {
      resolve(NextResponse.json({ error: 'Не удалось передать HTML в Python', details: String(e) }, { status: 500 }))
      return
    }
    pythonProcess.on('close', async (code) => {
      const stdout = Buffer.concat(stdoutBuffers).toString('utf8')
      const stderr = Buffer.concat(stderrBuffers).toString('utf8')
      if (code !== 0) {
        resolve(NextResponse.json({ error: stderr || 'Python script failed', debug: stdout }, { status: 500 }))
        return
      }
      let result
      try {
        const jsonMatch = stdout.match(/\{[\s\S]*\}/)
        if (!jsonMatch) throw new Error('No JSON found in Python output')
        result = JSON.parse(jsonMatch[0])
      } catch (e) {
        resolve(NextResponse.json({ error: 'Ошибка парсинга JSON', details: String(e), debug: stdout }, { status: 500 }))
        return
      }
      if (!result.success || !result.reviews) {
        resolve(NextResponse.json({ error: result.error || 'Нет отзывов', debug: result }, { status: 400 }))
        return
      }
      // Импорт в Supabase, избегая дублей (по author+text)
      let imported = 0, skipped = 0, errors = []
      for (const review of result.reviews) {
        try {
          const { data: exists, error: checkError } = await supabase
            .from('reviews')
            .select('id')
            .eq('name', review.author)
            .eq('text', review.text)
            .eq('source', 'yandex')
          if (checkError) throw checkError
          if (exists && exists.length > 0) {
            skipped++
            continue
          }
          const { error: insertError } = await supabase
            .from('reviews')
            .insert({
              name: review.author || 'Гость',
              rating: review.rating || 5,
              text: review.text || '',
              source: 'yandex',
              is_published: true,
              is_featured: false,
              published_at: new Date().toISOString(),
              admin_notes: `Импортировано из файла ${htmlFile}`
            })
          if (insertError) throw insertError
          imported++
        } catch (e) {
          errors.push(String(e))
        }
      }
      resolve(NextResponse.json({ success: true, imported, skipped, errors }))
    })
  })
} 