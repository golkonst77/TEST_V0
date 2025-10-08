#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

// Читаем текущую версию из package.json
const packagePath = path.join(process.cwd(), 'package.json')
const versionJsonPath = path.join(process.cwd(), 'public', 'version.json')

try {
  // Читаем package.json
  const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
  const currentVersion = packageData.version
  
  // Парсим версию
  const [major, minor, patch] = currentVersion.split('.').map(Number)
  
  // Инкрементируем patch версию
  const newPatch = patch + 1
  const newVersion = `${major}.${minor}.${newPatch}`
  const newBuild = `${major}${minor}${newPatch}`
  
  // Обновляем package.json
  packageData.version = newVersion
  fs.writeFileSync(packagePath, JSON.stringify(packageData, null, 2) + '\n')
  
  // Обновляем version.json
  const versionData = {
    version: newVersion,
    build: newBuild,
    date: new Date().toISOString().split('T')[0],
    description: 'Автоматическое обновление версии'
  }
  fs.writeFileSync(versionJsonPath, JSON.stringify(versionData, null, 2) + '\n')
  
  // Выводим новую версию (для использования в скрипте)
  console.log(newVersion)
  process.exit(0)
} catch (error) {
  console.error('Ошибка обновления версии:', error.message)
  process.exit(1)
}

