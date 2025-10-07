# 🚀 Руководство по деплою

## Схема портов на сервере

**Критически важно!** На сервере используется следующая схема портов:

- **hvostikalert.ru** → **порт 3001** ✅
- **prostoburo.com** → **порт 3000** ✅

## Скрипты деплоя

### 1. Основной деплой PROSTOBURO

**Файл:** `D:\DATA\BAT\Запуск деплоя на сервере PROSTOBURO.bat`

**Что делает:**
- Подключается к серверу `212.34.138.16` по SSH
- Выполняет скрипт `/home/pb001/deploy.sh` на сервере
- Обновляет код из Git репозитория
- Устанавливает зависимости (`npm install`)
- Собирает проект (`npm run build`)
- Перезапускает PM2 процесс

**Использование:**
```bash
# Просто запустите batch файл
D:\DATA\BAT\Запуск деплоя на сервере PROSTOBURO.bat
```

### 2. Деплой HVOSTIK-ALERT

**Файл:** `D:\DATA\BAT\Запуск деплоя на сервере HVOSTIK-ALERT.bat`

**Что делает:**
- Подключается к серверу `212.34.138.16` по SSH
- Выполняет скрипт `/var/www/hvostikalert_usr/deploy.sh` на сервере
- Запускает приложение на порту 3001

**Использование:**
```bash
# Просто запустите batch файл
D:\DATA\BAT\Запуск деплоя на сервере HVOSTIK-ALERT.bat
```

## Структура деплоя на сервере

```
/var/www/
├── hvostikalert_usr/
│   ├── data/www/hvostikalert.ru/    # Код hvostik-alert
│   └── deploy.sh                    # Скрипт деплоя hvostik-alert
└── prostoburo_c_usr/
    ├── data/www/prostoburo.com/     # Код prostoburo
    └── deploy.sh                    # Скрипт деплоя prostoburo
```

## PM2 процессы

### Проверка статуса
```bash
pm2 status
```

### Ожидаемый результат:
```
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ hvastik-alert      │ fork     │ 0    │ online    │ 0%       │ 58.6mb   │
│ 1  │ prostoburo         │ fork     │ 0    │ online    │ 0%       │ 58.6mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
```

### Управление процессами
```bash
# Остановить процесс
pm2 stop prostoburo
pm2 stop hvastik-alert

# Удалить процесс
pm2 delete prostoburo
pm2 delete hvastik-alert

# Перезапустить процесс
pm2 restart prostoburo
pm2 restart hvastik-alert

# Просмотр логов
pm2 logs prostoburo
pm2 logs hvastik-alert
```

## Nginx конфигурация

### hvostikalert.ru
```nginx
upstream hvostikalert.ru {
    server localhost:3001;
}

server {
    server_name hvostikalert.ru www.hvostikalert.ru;
    listen 212.34.138.16:80;
    listen 212.34.138.16:443 ssl;
    
    location / {
        proxy_pass http://hvostikalert.ru;
        include /etc/nginx/proxy_params;
    }
}
```

### prostoburo.com
```nginx
upstream prostoburo.com {
    server localhost:3000;
}

server {
    server_name prostoburo.com www.prostoburo.com;
    listen 212.34.138.16:80;
    listen 212.34.138.16:443 ssl;
    
    location / {
        proxy_pass http://prostoburo.com;
        include /etc/nginx/proxy_params;
    }
}
```

## Переменные окружения

### .env.local для prostoburo
```env
PORT=3000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### .env.local для hvostik-alert
```env
PORT=3001
# другие переменные...
```

## Команды для диагностики

### Проверка портов
```bash
netstat -tlnp | grep -E ':(3000|3001)'
```

### Проверка PM2
```bash
pm2 status
pm2 logs prostoburo --lines 20
pm2 logs hvastik-alert --lines 20
```

### Проверка Nginx
```bash
nginx -t
systemctl reload nginx
```

### Проверка процессов
```bash
ps aux | grep next-server
```

## Устранение проблем

### Проблема: prostoburo не запускается

**Симптомы:**
- PM2 показывает "online", но порт 3000 не слушается
- В логах: "Could not find a production build in the '.next' directory"

**Решение:**
```bash
# 1. Остановить процесс
pm2 stop prostoburo
pm2 delete prostoburo

# 2. Перейти в директорию
cd /var/www/prostoburo_c_usr/data/www/prostoburo.com

# 3. Удалить старую сборку
rm -rf .next

# 4. Собрать проект
npm run build

# 5. Запустить на правильном порту
PORT=3000 pm2 start npm --name prostoburo -- start

# 6. Сохранить конфигурацию
pm2 save
```

### Проблема: неправильные порты

**Симптомы:**
- Оба сайта показывают одинаковый контент
- Конфликт портов

**Решение:**
```bash
# 1. Остановить все процессы
pm2 stop all && pm2 delete all

# 2. Запустить hvastik-alert на 3001
cd /var/www/hvostikalert_usr/data/www/hvostikalert.ru
PORT=3001 pm2 start npm --name hvastik-alert -- start

# 3. Запустить prostoburo на 3000
cd /var/www/prostoburo_c_usr/data/www/prostoburo.com
PORT=3000 pm2 start npm --name prostoburo -- start

# 4. Сохранить конфигурацию
pm2 save
```

### Проблема: Nginx не проксирует правильно

**Симптомы:**
- 502 Bad Gateway
- Сайт не загружается

**Решение:**
```bash
# 1. Проверить конфигурацию Nginx
nginx -t

# 2. Проверить upstream блоки
grep -A2 -B2 "upstream" /etc/nginx/fastpanel2-sites/*/prostoburo.com.conf
grep -A2 -B2 "upstream" /etc/nginx/fastpanel2-sites/*/hvostikalert.ru.conf

# 3. Перезагрузить Nginx
systemctl reload nginx
```

## Автоматизация деплоя

### Создание скрипта деплоя на сервере

**Для prostoburo** (`/home/pb001/deploy.sh`):
```bash
#!/bin/bash
set -e

echo "=== ДЕПЛОЙ PROSTOBURO НАЧАЛСЯ ==="
echo "Время: $(date)"

# Переходим в директорию
cd /var/www/prostoburo_c_usr/data/www/prostoburo.com

# Обновляем код
echo "🔄 Обновляем код из Git..."
git pull origin main

# Устанавливаем зависимости
echo "📦 Устанавливаем зависимости..."
npm install --no-optional --no-audit --no-fund

# Собираем проект
echo "🔨 Собираем проект..."
npm run build

# Перезапускаем PM2
echo "🔄 Перезапускаем PM2..."
pm2 stop prostoburo 2>/dev/null || true
pm2 delete prostoburo 2>/dev/null || true
PORT=3000 pm2 start npm --name prostoburo -- start

# Сохраняем конфигурацию
pm2 save

echo "✅ Деплой завершен!"
echo "Время: $(date)"
```

**Для hvastik-alert** (`/var/www/hvostikalert_usr/deploy.sh`):
```bash
#!/bin/bash
set -e

echo "=== ДЕПЛОЙ HVASTIK-ALERT НАЧАЛСЯ ==="
echo "Время: $(date)"

# Переходим в директорию
cd /var/www/hvostikalert_usr/data/www/hvostikalert.ru

# Обновляем код
echo "🔄 Обновляем код из Git..."
git pull origin main

# Устанавливаем зависимости
echo "📦 Устанавливаем зависимости..."
npm install --no-optional --no-audit --no-fund

# Собираем проект
echo "🔨 Собираем проект..."
npm run build

# Перезапускаем PM2
echo "🔄 Перезапускаем PM2..."
pm2 stop hvastik-alert 2>/dev/null || true
pm2 delete hvastik-alert 2>/dev/null || true
PORT=3001 pm2 start npm --name hvastik-alert -- start

# Сохраняем конфигурацию
pm2 save

echo "✅ Деплой завершен!"
echo "Время: $(date)"
```

## Мониторинг

### Проверка работоспособности
```bash
# Проверка портов
netstat -tlnp | grep -E ':(3000|3001)'

# Проверка PM2
pm2 status

# Проверка логов
pm2 logs --lines 10

# Проверка сайтов
curl -I https://prostoburo.com
curl -I https://hvostikalert.ru
```

### Автоматический мониторинг
```bash
# Создать скрипт мониторинга
cat > /home/monitor.sh << 'EOF'
#!/bin/bash
echo "=== МОНИТОРИНГ $(date) ==="
echo "Порты:"
netstat -tlnp | grep -E ':(3000|3001)'
echo "PM2 статус:"
pm2 status
echo "Проверка сайтов:"
curl -s -o /dev/null -w "prostoburo.com: %{http_code}\n" https://prostoburo.com
curl -s -o /dev/null -w "hvostikalert.ru: %{http_code}\n" https://hvostikalert.ru
EOF

chmod +x /home/monitor.sh

# Добавить в crontab для проверки каждые 5 минут
echo "*/5 * * * * /home/monitor.sh >> /var/log/monitor.log" | crontab -
```

## Резервное копирование

### Создание бэкапа
```bash
# Создать скрипт бэкапа
cat > /home/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/home/backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Бэкап prostoburo
cp -r /var/www/prostoburo_c_usr/data/www/prostoburo.com "$BACKUP_DIR/"

# Бэкап hvastik-alert
cp -r /var/www/hvostikalert_usr/data/www/hvostikalert.ru "$BACKUP_DIR/"

# Бэкап PM2 конфигурации
pm2 save
cp /root/.pm2/dump.pm2 "$BACKUP_DIR/"

echo "Бэкап создан: $BACKUP_DIR"
EOF

chmod +x /home/backup.sh
```

---

**Важно:** Всегда проверяйте порты после деплоя и убеждайтесь, что каждый сайт работает на своем порту!

