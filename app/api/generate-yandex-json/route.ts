import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'
import { spawn } from 'child_process'

export async function POST(req: NextRequest) {
  try {
    const { htmlFile, outputFile } = await req.json()
    if (!htmlFile) {
      return NextResponse.json({ success: false, message: 'Не указан htmlFile' }, { status: 400 })
    }

    const publicDir = path.join(process.cwd(), 'public')
    const htmlPath = path.join(publicDir, htmlFile)
    if (!fs.existsSync(htmlPath)) {
      return NextResponse.json({ success: false, message: `Файл не найден: ${htmlFile}` }, { status: 400 })
    }

    const outFile = outputFile && typeof outputFile === 'string' && outputFile.trim().length > 0
      ? outputFile.trim()
      : `${path.parse(htmlFile).name}.json`
    const outPath = path.join(publicDir, outFile)

    const scriptPath = path.join(process.cwd(), 'scripts', 'yandex_parser.py')

    const args = ['-X', 'utf8', scriptPath, '--html', htmlPath, '--output', outPath]
    const python = spawn('python', args, { cwd: process.cwd(), env: { ...process.env } })

    let stdoutData = ''
    let stderrData = ''
    python.stdout.on('data', (d) => { stdoutData += d.toString('utf8') })
    python.stderr.on('data', (d) => { stderrData += d.toString('utf8') })

    const exitCode: number = await new Promise((resolve) => {
      python.on('close', resolve)
    })

    if (exitCode !== 0) {
      return NextResponse.json({ success: false, message: 'Python завершился с ошибкой', stderr: stderrData, stdout: stdoutData }, { status: 500 })
    }

    const exists = fs.existsSync(outPath)
    const size = exists ? fs.statSync(outPath).size : 0

    return NextResponse.json({ success: true, message: 'JSON сгенерирован', file: outFile, size, stdout: safeTail(stdoutData), stderr: safeTail(stderrData) })
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message || String(e) }, { status: 500 })
  }
}

function safeTail(text: string, max = 2000) {
  if (!text) return ''
  return text.length > max ? text.slice(-max) : text
}


