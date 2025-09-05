const fs = require('fs');
const path = require('path');

// Функция для исправления файла
function fixSupabaseFile(filePath) {
  console.log(`🔧 Исправляю: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Паттерн для поиска проблемного кода
  const badPattern = /const\s+supabase\s*=\s*createClient\s*\(\s*process\.env\.([^,]+),\s*process\.env\.([^)]+)\s*\)/g;
  
  if (badPattern.test(content)) {
    // Заменяем на безопасную версию
    content = content.replace(
      /const\s+supabase\s*=\s*createClient\s*\(\s*process\.env\.([^,]+),\s*process\.env\.([^)]+)\s*\)/g,
      `function getSupabaseClient() {
  const supabaseUrl = process.env.$1;
  const supabaseKey = process.env.$2;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase environment variables not configured");
  }
  
  return createClient(supabaseUrl, supabaseKey);
}`
    );
    
    // Заменяем все использования supabase на getSupabaseClient()
    content = content.replace(/await supabase\./g, 'const supabase = getSupabaseClient(); await supabase.');
    content = content.replace(/supabase\./g, 'const supabase = getSupabaseClient(); supabase.');
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Исправлен: ${filePath}`);
    return true;
  }
  
  return false;
}

// Находим все файлы с createClient
function findSupabaseFiles(dir) {
  const files = [];
  
  function walkDir(currentPath) {
    const items = fs.readdirSync(currentPath);
    
    for (const item of items) {
      const fullPath = path.join(currentPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        walkDir(fullPath);
      } else if (item.endsWith('.ts') && !item.endsWith('.d.ts')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes('createClient') && content.includes('process.env')) {
          files.push(fullPath);
        }
      }
    }
  }
  
  walkDir(dir);
  return files;
}

// Основная функция
function main() {
  console.log('🚀 Начинаю исправление всех файлов Supabase...');
  
  const apiDir = path.join(process.cwd(), 'app', 'api');
  const files = findSupabaseFiles(apiDir);
  
  console.log(`📁 Найдено ${files.length} файлов с проблемами Supabase`);
  
  let fixedCount = 0;
  for (const file of files) {
    if (fixSupabaseFile(file)) {
      fixedCount++;
    }
  }
  
  console.log(`✅ Исправлено ${fixedCount} файлов`);
  console.log('🎉 Готово! Теперь можно делать деплой.');
}

main();
