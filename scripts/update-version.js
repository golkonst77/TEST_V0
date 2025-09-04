#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

// Получаем аргументы командной строки
const args = process.argv.slice(2)
const versionType = args[0] || 'patch' // patch, minor, major

// Читаем текущую версию
const versionPath = path.join(process.cwd(), 'version.json')
let versionData

try {
  const versionFile = fs.readFileSync(versionPath, 'utf8')
  versionData = JSON.parse(versionFile)
} catch (error) {
  console.error('Ошибка чтения version.json:', error)
  process.exit(1)
}

// Парсим версию
const [major, minor, patch] = versionData.version.split('.').map(Number)

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

// Обновляем данные
versionData.version = newVersion
versionData.build = newBuild
versionData.date = new Date().toISOString().split('T')[0]

// Записываем обновленную версию
try {
  fs.writeFileSync(versionPath, JSON.stringify(versionData, null, 2))
  console.log(`✅ Версия обновлена: ${versionData.version} (build ${versionData.build})`)
  console.log(`📅 Дата: ${versionData.date}`)
} catch (error) {
  console.error('Ошибка записи version.json:', error)
  process.exit(1)
}
