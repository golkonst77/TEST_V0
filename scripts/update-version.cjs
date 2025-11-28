#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

// Получаем аргументы командной строки
const args = process.argv.slice(2)
const versionType = args[0] || 'patch' // patch, minor, major

// Читаем package.json (единственный источник истины)
const packagePath = path.join(process.cwd(), 'package.json')
let packageData

try {
  const packageFile = fs.readFileSync(packagePath, 'utf8')
  packageData = JSON.parse(packageFile)
} catch (error) {
  console.error('Ошибка чтения package.json:', error)
  process.exit(1)
}

// Парсим текущую версию
const [major, minor, patch] = packageData.version.split('.').map(Number)

// Обновляем версию
let newMajor = major
let newMinor = minor
let newPatch = patch

switch (versionType) {
  case 'major':
    newMajor++
    newMinor = 0
    newPatch = 0
    break
  case 'minor':
    newMinor++
    newPatch = 0
    break
  case 'patch':
  default:
    newPatch++
    break
}

const newVersion = `${newMajor}.${newMinor}.${newPatch}`
const newBuild = `${newMajor}${newMinor}${newPatch}`
const date = new Date().toISOString().split('T')[0]

// Обновляем версию в package.json
packageData.version = newVersion

try {
  fs.writeFileSync(packagePath, JSON.stringify(packageData, null, 2) + '\n')
  console.log(`✅ package.json обновлен: ${newVersion}`)
  console.log(`📦 Build: ${newBuild}`)
  console.log(`📅 Дата: ${date}`)
  console.log(`\n💡 Теперь версия хранится только в package.json`)
  console.log(`   API /api/version автоматически вернет актуальную версию`)
} catch (error) {
  console.error('Ошибка обновления package.json:', error)
  process.exit(1)
}
