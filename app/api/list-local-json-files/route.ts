import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

export async function GET(req: NextRequest) {
  const publicDir = path.join(process.cwd(), 'public')
  let files: string[] = []
  try {
    files = fs.readdirSync(publicDir)
      .filter(f => f.toLowerCase().endsWith('.json'))
  } catch (e) {
    return NextResponse.json({ error: 'Ошибка чтения папки public', details: String(e) }, { status: 500 })
  }
  return NextResponse.json({ files })
}


