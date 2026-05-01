import { access, copyFile, mkdir, readFile, rename, stat, writeFile } from "fs/promises"
import { createHash } from "crypto"
import { constants, existsSync } from "fs"
import { dirname, join } from "path"

const DEFAULT_STORAGE_DIR = join(process.cwd(), "data", "storage")
const isProduction = process.env.NODE_ENV === "production"

function logStorage(action: string, payload: Record<string, unknown>) {
  console.log(`[cms-storage] ${action}`, {
    nodeEnv: process.env.NODE_ENV,
    cmsStorageDirEnv: process.env.CMS_STORAGE_DIR || null,
    ...payload,
  })
}

export function getCmsStorageDir() {
  const envDir = process.env.CMS_STORAGE_DIR
  if (isProduction && (!envDir || envDir.trim().length === 0)) {
    const message = "CMS_STORAGE_DIR is required in production. Refusing project-local fallback."
    console.error(`[cms-storage] ${message}`, {
      nodeEnv: process.env.NODE_ENV,
      processCwd: process.cwd(),
      defaultStorageDir: DEFAULT_STORAGE_DIR,
    })
    throw new Error(message)
  }
  return envDir || DEFAULT_STORAGE_DIR
}

export function getCmsStoragePath(fileName: string) {
  return join(getCmsStorageDir(), fileName)
}

export async function ensureCmsStorageDir() {
  await mkdir(getCmsStorageDir(), { recursive: true })
}

export async function writeCmsJson<T>(fileName: string, payload: T): Promise<{ path: string; savedAt: string; backupPath: string | null }> {
  const targetPath = getCmsStoragePath(fileName)
  await mkdir(dirname(targetPath), { recursive: true })
  const backupPath = existsSync(targetPath) ? `${targetPath}.bak` : null
  if (backupPath) {
    await copyFile(targetPath, backupPath)
  }
  const tmpPath = `${targetPath}.tmp`
  const body = JSON.stringify(payload, null, 2)
  await writeFile(tmpPath, body, "utf8")
  await rename(tmpPath, targetPath)
  const meta = await getCmsFileMeta(fileName)
  logStorage("WRITE", {
    fileName,
    path: targetPath,
    backupPath,
    exists: meta.exists,
    size: meta.size,
    mtime: meta.mtime,
  })
  return { path: targetPath, savedAt: new Date().toISOString(), backupPath }
}

export async function readCmsJson<T>(fileName: string): Promise<T> {
  const targetPath = getCmsStoragePath(fileName)
  const content = await readFile(targetPath, "utf8")
  const meta = await getCmsFileMeta(fileName)
  logStorage("READ", {
    fileName,
    path: targetPath,
    exists: meta.exists,
    size: meta.size,
    mtime: meta.mtime,
  })
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

export async function readCmsJsonStrict<T>(fileName: string): Promise<{ data: T; path: string }> {
  const targetPath = getCmsStoragePath(fileName)
  if (!existsSync(targetPath)) {
    const message = `CMS file missing: ${targetPath}`
    console.error("[cms-storage] READ_STRICT_MISSING", { fileName, path: targetPath, nodeEnv: process.env.NODE_ENV })
    throw new Error(message)
  }
  const data = await readCmsJson<T>(fileName)
  return { data, path: targetPath }
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

export async function getCmsStorageDiagnostics(fileNames: string[]) {
  const storageDir = getCmsStorageDir()
  const exists = existsSync(storageDir)
  let writable = false
  try {
    await access(storageDir, constants.W_OK)
    writable = true
  } catch {
    writable = false
  }

  const files = await Promise.all(
    fileNames.map(async (fileName) => {
      const meta = await getCmsFileMeta(fileName)
      let preview: string | null = null
      let hash: string | null = null
      if (meta.exists) {
        try {
          const content = await readFile(meta.path, "utf8")
          preview = content.slice(0, 200)
          hash = createHash("sha256").update(content).digest("hex")
        } catch {
          preview = null
          hash = null
        }
      }
      return [fileName, { ...meta, preview, hash }] as const
    }),
  )

  return {
    nodeEnv: process.env.NODE_ENV || null,
    cmsStorageDirEnv: process.env.CMS_STORAGE_DIR || null,
    resolvedStorageDir: storageDir,
    storageDirExists: exists,
    storageDirWritable: writable,
    processCwd: process.cwd(),
    files: Object.fromEntries(files),
  }
}
