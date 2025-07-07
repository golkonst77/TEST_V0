import { NextRequest } from "next/server"
import { spawn } from "child_process"
import path from "path"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  console.log('🔍 Начинаю загрузку отзывов с Яндекс.Карт через Python-парсер...')
  
  const companyId = 180493814174 // ID компании ПростоБюро
  
  try {
    // Запускаем Python-скрипт
    const scriptPath = path.join(process.cwd(), 'scripts', 'yandex_parser.py')
    
    console.log(`📝 Запускаю Python-скрипт: ${scriptPath}`)
    console.log(`🏢 ID компании: ${companyId}`)
    
    const pythonProcess = spawn('python', ['-X', 'utf8', scriptPath, companyId.toString()], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { 
        ...process.env, 
        PYTHONIOENCODING: 'utf-8',
        PYTHONUTF8: '1',
        PYTHONLEGACYWINDOWSSTDIO: 'utf-8'
      }
    })
    
    let stdoutBuffers: Buffer[] = []
    let stderrBuffers: Buffer[] = []
    
    pythonProcess.stdout.on('data', (data) => {
      stdoutBuffers.push(Buffer.isBuffer(data) ? data : Buffer.from(data))
    })
    
    pythonProcess.stderr.on('data', (data) => {
      stderrBuffers.push(Buffer.isBuffer(data) ? data : Buffer.from(data))
    })
    
    // Ждем завершения
    return new Promise((resolve) => {
      pythonProcess.on('close', (code) => {
        const stdoutBuffer = Buffer.concat(stdoutBuffers)
        // Принудительно декодируем как UTF-8
        const stdout = stdoutBuffer.toString('utf8')
        const stderr = Buffer.concat(stderrBuffers).toString('utf8')
        console.log(`📊 Python-скрипт завершен с кодом: ${code}`)
        // Логируем сырые данные
        console.log('🐍 [RAW BUFFER]', stdoutBuffer)
        console.log('🐍 [AS STRING]', stdout)
        
        if (code !== 0) {
          console.error(`❌ Ошибка Python-скрипта: ${stderr}`)
          resolve(Response.json({
            reviews: [],
            source: "yandex-maps-python",
            error: stderr || "Python script failed",
            debug_stdout: stdout,
            debug_stderr: stderr,
            totalPages: 0
          }, {
            headers: {
              'Content-Type': 'application/json; charset=utf-8'
            }
          }))
          return
        }
        
        try {
          // Ищем JSON в выводе
          const jsonMatch = stdout.match(/\{[\s\S]*\}/)
          if (!jsonMatch) {
            console.error('❌ Не найден JSON в выводе Python-скрипта')
            resolve(Response.json({
              reviews: [],
              source: "yandex-maps-python",
              error: "No JSON found in Python output",
              totalPages: 0
            }, {
              headers: {
                'Content-Type': 'application/json; charset=utf-8'
              }
            }))
            return
          }
          
          const result = JSON.parse(jsonMatch[0])
          console.log(`✅ Python-парсер вернул ${result.total_reviews || 0} отзывов`)
          
          if (result.success) {
            resolve(Response.json({
              reviews: result.reviews || [],
              source: result.source || "yandex-maps-python",
              company_info: result.company_info,
              totalPages: Math.ceil((result.total_reviews || 0) / 10)
            }, {
              headers: {
                'Content-Type': 'application/json; charset=utf-8'
              }
            }))
          } else {
            console.error(`❌ Python-парсер вернул ошибку: ${result.error}`)
            resolve(Response.json({
              reviews: [],
              source: result.source || "yandex-maps-python",
              error: result.error,
              totalPages: 0
            }, {
              headers: {
                'Content-Type': 'application/json; charset=utf-8'
              }
            }))
          }
          
        } catch (parseError) {
          console.error(`❌ Ошибка парсинга JSON: ${parseError}`)
          console.error(`📄 Вывод Python: ${stdout}`)
          resolve(Response.json({
            reviews: [],
            source: "yandex-maps-python",
            error: "Failed to parse Python output",
            totalPages: 0
          }, {
            headers: {
              'Content-Type': 'application/json; charset=utf-8'
            }
          }))
        }
      })
    })
    
  } catch (error) {
    console.error(`❌ Ошибка запуска Python-скрипта: ${error}`)
    return Response.json({
      reviews: [],
      source: "yandex-maps-python",
      error: error instanceof Error ? error.message : "Unknown error",
      totalPages: 0
    }, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
  }
} 