const fs = require('fs');
const raw = fs.readFileSync('debug-checklists.json', 'utf8');
const match = raw.match(/Content\s*:\s*(\{[\s\S]+\})/);
if (match) {
  const json = JSON.parse(match[1]);
  console.dir(json, { depth: null });
} else {
  console.error('Не удалось найти JSON Content');
} 