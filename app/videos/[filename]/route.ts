import { NextRequest, NextResponse } from "next/server"
import { createReadStream, existsSync, statSync } from "fs"
import { join, extname, basename } from "path"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 0

const MIME_BY_EXT: Record<string, string> = {
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
}

function getSafeFilename(input: string) {
  // remove any path traversal and keep only last segment
  return basename(input)
}

export async function GET(request: NextRequest, { params }: { params: { filename: string } }) {
  const filename = getSafeFilename(params.filename)
  const filePath = join(process.cwd(), "public", "videos", filename)

  if (!existsSync(filePath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 })
  }

  const stat = statSync(filePath)
  const totalSize = stat.size
  const range = request.headers.get("range")
  const ext = extname(filename).toLowerCase()
  const contentType = MIME_BY_EXT[ext] || "application/octet-stream"

  // Support byte ranges for video seeking
  if (range) {
    const match = /^bytes=(\d+)-(\d*)$/i.exec(range)
    if (!match) {
      return new NextResponse(null, { status: 416 })
    }

    const start = Number(match[1])
    const end = match[2] ? Number(match[2]) : totalSize - 1

    if (Number.isNaN(start) || Number.isNaN(end) || start >= totalSize || end >= totalSize || start > end) {
      return new NextResponse(null, { status: 416 })
    }

    const chunkSize = end - start + 1
    const stream = createReadStream(filePath, { start, end })

    return new NextResponse(stream as any, {
      status: 206,
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(chunkSize),
        "Content-Range": `bytes ${start}-${end}/${totalSize}`,
        "Accept-Ranges": "bytes",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  }

  const stream = createReadStream(filePath)
  return new NextResponse(stream as any, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Length": String(totalSize),
      "Accept-Ranges": "bytes",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  })
}

