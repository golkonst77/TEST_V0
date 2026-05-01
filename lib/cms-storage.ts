import { mkdir, readFile, rename, stat, writeFile } from "fs/promises"
import { existsSync } from "fs"
import { dirname, join } from "path"

const DEFAULT_STORAGE_DIR = join(process.cwd(), "data", "storage")

export function getCmsStorageDir() {
  return process.env.CMS_STORAGE_DIR || DEFAULT_STORAGE_DIR
}

export function getCmsStoragePath(fileName: string) {
  return join(getCmsStorageDir(), fileName)
}

export async function ensureCmsStorageDir() {
  await mkdir(getCmsStorageDir(), { recursive: true })
}

export async function writeCmsJson<T>(fileName: string, payload: T): Promise<{ path: string; savedAt: string }> {
  const targetPath = getCmsStoragePath(fileName)
  await mkdir(dirname(targetPath), { recursive: true })
  const tmpPath = `${targetPath}.tmp`
  const body = JSON.stringify(payload, null, 2)
  await writeFile(tmpPath, body, "utf8")
  await rename(tmpPath, targetPath)
  return { path: targetPath, savedAt: new Date().toISOString() }
}

export async function readCmsJson<T>(fileName: string): Promise<T> {
  const targetPath = getCmsStoragePath(fileName)
  const content = await readFile(targetPath, "utf8")
  return JSON.parse(content) as T
}

export async function readCmsJsonOrInit<T>(fileName: string, initialValue: T): Promise<{ data: T; source: "stored" | "initialized"; path: string }> {
  const targetPath = getCmsStoragePath(fileName)
  if (existsSync(targetPath)) {
    const data = await readCmsJson<T>(fileName)
    return { data, source: "stored", path: targetPath }
  }
  await ensureCmsStorageDir()
  await writeCmsJson(fileName, initialValue)
  return { data: initialValue, source: "initialized", path: targetPath }
}

export async function getCmsFileMeta(fileName: string) {
  const targetPath = getCmsStoragePath(fileName)
  try {
    const info = await stat(targetPath)
    return {
      path: targetPath,
      exists: true,
      size: info.size,
      mtime: info.mtime.toISOString(),
    }
  } catch {
    return {
      path: targetPath,
      exists: false,
      size: 0,
      mtime: null,
    }
  }
}
