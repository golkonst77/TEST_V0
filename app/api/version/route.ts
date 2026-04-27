import { NextResponse } from "next/server"
import { readFileSync } from "fs"
import { join } from "path"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  try {
    const cwd = process.cwd()

    // Читаем package.json
    const packagePath = join(cwd, "package.json")
    const packageJson = JSON.parse(readFileSync(packagePath, "utf-8"))

    const version: string = packageJson.version
    const [major, minor, patch] = String(version).split(".")
    const build = `${major}${minor}${patch}`

    // Главное: buildId меняется на каждом next build/deploy
    // (в .next/BUILD_ID создаётся новый id при сборке)
    let buildId: string | null = null
    try {
      buildId = readFileSync(join(cwd, ".next", "BUILD_ID"), "utf-8").trim()
    } catch {
      buildId = null
    }

    const gitSha =
      process.env.VERCEL_GIT_COMMIT_SHA ||
      process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ||
      process.env.GIT_COMMIT_SHA ||
      null

    return NextResponse.json(
      {
        version,
        build,
        buildId,
        gitSha,
        date: new Date().toISOString().split("T")[0],
        description:
          "Cookie Consent Banner, Политика конфиденциальности ФЗ-152, блок соответствия законодательству",
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    )
  } catch (error) {
    console.error("Ошибка чтения версии:", error)

    return NextResponse.json(
      {
        error: "Version not loaded",
      },
      { status: 500 },
    )
  }
}
