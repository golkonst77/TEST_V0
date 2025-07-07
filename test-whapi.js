import fetch from 'node-fetch';

const url = 'https://gate.whapi.cloud/messages/text';
const token = 'QlZ00L1DXVAv17SfAoTtarbseCNIKaIo';
const phone = '79106000612'; // <-- Тестовый номер
const message = 'Тестовое сообщение от WHAPI';

fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    to: phone,
    body: message
  })
})
  .then(res => res.json())
  .then(console.log)
  .catch(console.error); 