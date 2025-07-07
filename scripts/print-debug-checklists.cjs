const fs = require('fs');
const raw = fs.readFileSync('debug-checklists.json', 'utf8');
const contentLine = raw.split('\n').find(line => line.trim().startsWith('Content'));
if (contentLine) {
  const jsonStart = contentLine.indexOf('{');
  if (jsonStart !== -1) {
    const jsonStr = contentLine.slice(jsonStart);
    try {
      const json = JSON.parse(jsonStr);
      console.dir(json, { depth: null });
    } catch (e) {
      console.error('Ошибка парсинга JSON:', e);
    }
  } else {
    console.error('Не найден JSON-объект в Content');
  }
} else {
  console.error('Не найдена строка Content');
} 