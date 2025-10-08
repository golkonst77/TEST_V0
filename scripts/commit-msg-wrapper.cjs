#!/usr/bin/env node

// Скрипт для добавления версии в сообщение коммита
const fs = require('fs')
const path = require('path')

try {
  // Читаем версию из version.json
  const versionPath = path.join(process.cwd(), 'public', 'version.json')
  const versionData = JSON.parse(fs.readFileSync(versionPath, 'utf8'))
  const version = versionData.version

  // Читаем сообщение коммита
  const commitMsgFile = process.argv[2]
  if (!commitMsgFile) {
    console.error('Не указан файл сообщения коммита')
    process.exit(1)
  }

  let commitMsg = fs.readFileSync(commitMsgFile, 'utf8')

  // Если версия уже есть в сообщении, не добавляем
  if (commitMsg.includes('[v')) {
    process.exit(0)
  }

  // Добавляем версию в начало сообщения (только для непустых сообщений)
  const lines = commitMsg.split('\n')
  if (lines[0] && !lines[0].startsWith('#')) {
    lines[0] = `[v${version}] ${lines[0]}`
    commitMsg = lines.join('\n')
    fs.writeFileSync(commitMsgFile, commitMsg)
  }

  process.exit(0)
} catch (error) {
  console.error('Ошибка в commit-msg-wrapper:', error)
  process.exit(0) // Не блокируем коммит при ошибке
}
