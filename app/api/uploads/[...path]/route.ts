import { type NextRequest, NextResponse } from "next/server"
import { readFile } from "fs/promises"
import { existsSync } from "fs"
import { extname } from "path"
import { resolveUploadFilePath, sanitizeUploadFileName } from "@/lib/uploads-storage"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".pdf": "application/pdf",
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { path: string[] } },
) {
  try {
    const rawName = params.path.join("/")
    const fileName = sanitizeUploadFileName(rawName)

    if (!fileName || rawName.includes("..")) {
      return new NextResponse("Not found", { status: 404 })
    }

    const filePath = resolveUploadFilePath(fileName)
    if (!existsSync(filePath)) {
      return new NextResponse("Not found", { status: 404 })
    }

    const buffer = await readFile(filePath)
    const ext = extname(fileName).toLowerCase()

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": MIME_TYPES[ext] || "application/octet-stream",
        "Cache-Control": "public, max-age=86400",
      },
    })
  } catch (error) {
    console.error("[uploads] Failed to serve file:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
