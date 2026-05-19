/**
 * Seeds ./data/storage from repo templates (data/*.json, data/storage/*).
 * Skips files that already exist — safe to run before every dev session.
 */
const fs = require("fs")
const path = require("path")

const root = path.join(__dirname, "..")
const storageDir = process.env.CMS_STORAGE_DIR
  ? path.resolve(root, process.env.CMS_STORAGE_DIR)
  : path.join(root, "data", "storage")

const seeds = [
  { target: "homepage.json", sources: ["data/homepage.json", "data/storage/homepage.json"] },
  {
    target: "homepage-sections.json",
    sources: ["data/homepage-sections.json", "data/storage/homepage-sections.json"],
  },
  {
    target: "calculator-config.json",
    sources: ["data/storage/calculator-config.json"],
  },
  {
    target: "header-config.json",
    sources: ["data/storage/header-config.json"],
  },
  {
    target: "pricing-admin.json",
    sources: ["data/storage/pricing-admin.json"],
  },
  {
    target: "site-settings.json",
    sources: ["data/storage/site-settings.json"],
  },
]

function resolveSource(sources) {
  for (const rel of sources) {
    const full = path.join(root, rel)
    if (fs.existsSync(full)) return full
  }
  return null
}

fs.mkdirSync(storageDir, { recursive: true })

let copied = 0
let skipped = 0

for (const { target, sources } of seeds) {
  const dest = path.join(storageDir, target)
  if (fs.existsSync(dest)) {
    skipped += 1
    console.log(`[skip] ${target} (already exists)`)
    continue
  }
  const src = resolveSource(sources)
  if (!src) {
    console.warn(`[warn] no seed for ${target}`)
    continue
  }
  fs.copyFileSync(src, dest)
  copied += 1
  console.log(`[copy] ${path.relative(root, src)} -> ${path.relative(root, dest)}`)
}

console.log("")
console.log(`Local CMS storage: ${storageDir}`)
console.log(`Copied: ${copied}, skipped: ${skipped}`)
