const fs = require('fs');
const path = require('path');

const files = [
  'app/api/admin/checklists/active/route.ts',
  'app/api/admin/checklists/route.ts', 
  'app/api/admin/checklists/set-active/route.ts',
  'app/api/admin/checklists/[id]/route.ts',
  'app/api/admin/video-reviews/[id]/route.ts',
  'app/api/newsletter/scheduled/route.ts',
  'app/api/newsletter/route.ts',
  'app/api/newsletter/route-full.ts',
  'app/api/newsletter/campaigns/route.ts',
  'app/api/newsletter/campaigns/[id]/send/route.ts'
];

function fixFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Файл не найден: ${filePath}`);
    return;
  }
  
  console.log(`🔧 Исправляю: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Заменяем проблемные строки
  content = content.replace(
    /const\s+supabase\s*=\s*createClient\s*\(\s*process\.env\.([^,]+)!,\s*process\.env\.([^)]+)!\s*\)/g,
    `function getSupabaseClient() {
  const supabaseUrl = process.env.$1;
  const supabaseKey = process.env.$2;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase environment variables not configured");
  }
  
  return createClient(supabaseUrl, supabaseKey);
}`
  );
  
  // Заменяем использования supabase в функциях
  content = content.replace(
    /export async function (\w+)\([^)]*\)\s*{([^}]*?)const\s*{\s*data[^}]*error[^}]*}\s*=\s*await supabase/g,
    'export async function $1($2) {\n    const supabase = getSupabaseClient();\n    $3const { data, error } = await supabase'
  );
  
  fs.writeFileSync(filePath, content);
  console.log(`✅ Исправлен: ${filePath}`);
}

files.forEach(fixFile);
console.log('🎉 Все файлы исправлены!');
