// Скрипт для деплоя с переменными окружения
import { execSync } from 'child_process';
import fs from 'fs';

console.log('🚀 Деплой с переменными окружения...');

// Проверяем наличие .env.local
if (!fs.existsSync('.env.local')) {
  console.error('❌ Файл .env.local не найден!');
  process.exit(1);
}

console.log('✅ .env.local найден');

// Коммитим и пушим
try {
  execSync('git add .', { stdio: 'inherit' });
  execSync('git commit -m "feat: добавлены переменные окружения Supabase"', { stdio: 'inherit' });
  execSync('git push origin main', { stdio: 'inherit' });
  
  console.log('✅ Код отправлен в GitHub');
  console.log('📝 Не забудь добавить переменные в Vercel Dashboard!');
  console.log('🔗 Settings → Environment Variables');
  
} catch (error) {
  console.error('❌ Ошибка при деплое:', error.message);
}
