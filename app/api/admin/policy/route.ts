import { NextRequest, NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

const POLICY_PATH = path.join(process.cwd(), "public", "policy.md")

export async function GET() {
  try {
    const text = await fs.readFile(POLICY_PATH, "utf8")
    return NextResponse.json({ text })
  } catch (e) {
    return NextResponse.json({ error: "Не удалось прочитать политику." }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { text } = await req.json()
    await fs.writeFile(POLICY_PATH, text, "utf8")
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: "Не удалось сохранить политику." }, { status: 500 })
  }
} 