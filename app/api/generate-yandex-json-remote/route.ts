import { NextRequest, NextResponse } from 'next/server'
import { spawn } from 'child_process'
import path from 'path'

export async function POST(req: NextRequest) {
  try {
    const { companyId, outputJsonFile } = await req.json()

    if (!companyId || !outputJsonFile) {
      return NextResponse.json(
        { success: false, message: 'Укажите companyId и имя JSON файла' },
        { status: 400 }
      )
    }

    const scriptPath = path.join(process.cwd(), 'scripts', 'yandex_parser.py')
    const jsonOutputPath = path.join(process.cwd(), 'public', String(outputJsonFile))

    return await new Promise((resolve) => {
      const args = ['-X', 'utf8', scriptPath, String(companyId), '--output', jsonOutputPath]
      const py = spawn('python', args)

      let stdout = ''
      let stderr = ''

      py.stdout.on('data', (d) => (stdout += d.toString()))
      py.stderr.on('data', (d) => (stderr += d.toString()))

      py.on('close', (code) => {
        if (code === 0) {
          resolve(
            NextResponse.json({
              success: true,
              message: `JSON сгенерирован: ${outputJsonFile}`,
              stdout,
              stderr,
            })
          )
        } else {
          resolve(
            NextResponse.json(
              {
                success: false,
                message: `Ошибка генерации JSON, код выхода: ${code}`,
                stdout,
                stderr,
              },
              { status: 500 }
            )
          )
        }
      })

      py.on('error', (err) => {
        resolve(
          NextResponse.json(
            { success: false, message: `Ошибка запуска Python: ${err.message}` },
            { status: 500 }
          )
        )
      })
    })
  } catch (e: any) {
    return NextResponse.json(
      { success: false, message: e?.message || 'Неизвестная ошибка' },
      { status: 500 }
    )
  }
}


