const fs = require('fs');

console.log('🔍 Отладка загрузки .env.local...\n');

try {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  console.log('📄 Содержимое .env.local:');
  console.log(envContent);
  console.log('\n' + '='.repeat(50) + '\n');
  
  const lines = envContent.split('\n');
  console.log('📝 Обработка строк:');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    console.log(`Строка ${i + 1}: "${line}"`);
    console.log(`  Обрезанная: "${trimmed}"`);
    console.log(`  Комментарий: ${trimmed.startsWith('#')}`);
    console.log(`  Пустая: ${!trimmed}`);
    
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      const value = valueParts.join('=');
      console.log(`  Ключ: "${key}"`);
      console.log(`  Значение: "${value}"`);
      
      if (key === 'SENDSAY_API_KEY') {
        console.log(`  ✅ Найден SENDSAY_API_KEY: ${value.substring(0, 20)}...`);
        process.env[key] = value;
      }
    }
    console.log('');
  }
  
  console.log('🔑 Итоговое значение SENDSAY_API_KEY:');
  console.log(process.env.SENDSAY_API_KEY || 'НЕ НАЙДЕН');
  
} catch (error) {
  console.error('❌ Ошибка:', error.message);
} 