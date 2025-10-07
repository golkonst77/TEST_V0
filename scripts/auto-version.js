#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Путь к package.json
const packageJsonPath = path.join(__dirname, '..', 'package.json');

try {
  // Читаем package.json
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Разбираем текущую версию
  const versionParts = packageJson.version.split('.');
  const major = parseInt(versionParts[0]);
  const minor = parseInt(versionParts[1]);
  const patch = parseInt(versionParts[2]);
  
  // Увеличиваем patch версию
  const newPatch = patch + 1;
  const newVersion = `${major}.${minor}.${newPatch}`;
  
  // Обновляем версию в package.json
  packageJson.version = newVersion;
  
  // Сохраняем обновленный package.json
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
  
  console.log(`✅ Версия обновлена: ${packageJson.version} → ${newVersion}`);
  
  // Возвращаем новую версию для использования в git hook
  process.stdout.write(newVersion);
  
} catch (error) {
  console.error('❌ Ошибка при обновлении версии:', error.message);
  process.exit(1);
}
