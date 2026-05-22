import { constants, existsSync } from "fs"
import { access, mkdir } from "fs/promises"
import { basename, join } from "path"

const DEFAULT_PUBLIC_UPLOADS_DIR = join(process.cwd(), "public", "uploads")

export function sanitizeUploadFileName(fileName: string): string {
  return basename(fileName).replace(/[^a-zA-Z0-9._-]/g, "_")
}

export function getUploadsDir(): string {
  const explicitDir = process.env.UPLOADS_DIR?.trim()
  if (explicitDir) {
    return explicitDir
  }

  const cmsDir = process.env.CMS_STORAGE_DIR?.trim()
  if (cmsDir) {
    return join(cmsDir, "uploads")
  }

  return DEFAULT_PUBLIC_UPLOADS_DIR
}

export async function ensureUploadsDir(): Promise<string> {
  const dir = getUploadsDir()
  await mkdir(dir, { recursive: true })
  return dir
}

export function getUploadPublicUrl(fileName: string): string {
  return `/uploads/${sanitizeUploadFileName(fileName)}`
}

export function resolveUploadFilePath(fileName: string): string {
  const safeName = sanitizeUploadFileName(fileName)
  const primaryPath = join(getUploadsDir(), safeName)

  if (existsSync(primaryPath)) {
    return primaryPath
  }

  const publicFallbackPath = join(DEFAULT_PUBLIC_UPLOADS_DIR, safeName)
  if (existsSync(publicFallbackPath)) {
    return publicFallbackPath
  }

  return primaryPath
}

export async function uploadFileExists(fileName: string): Promise<boolean> {
  const filePath = resolveUploadFilePath(fileName)
  if (!existsSync(filePath)) {
    return false
  }

  try {
    await access(filePath, constants.R_OK)
    return true
  } catch {
    return false
  }
}

export function extractUploadFileName(url: string): string | null {
  if (!url.startsWith("/uploads/")) {
    return null
  }

  const fileName = url.slice("/uploads/".length).split("?")[0]
  if (!fileName) {
    return null
  }

  return sanitizeUploadFileName(fileName)
}
