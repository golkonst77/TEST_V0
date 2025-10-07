# BA Copilot - MVP для бизнес-аналитиков

**BA Copilot** - это веб-приложение для бизнес-аналитиков, предоставляющее инструменты для работы с BPMN диаграммами и анализа бизнес-процессов.

## 🚀 Возможности

### ✅ Реализовано
- **Система отзывов**: Парсинг и отображение отзывов с Яндекс.Карт
- **Административная панель**: Управление контентом и настройками
- **Пагинация**: Клиентская система с случайным перемешиванием
- **Fallback система**: Стабильная работа без зависимости от базы данных

### 🔄 В разработке
- **BPMN редактор**: Интеграция bpmn-js для создания диаграмм
- **AI ассистент**: Помощь в бизнес-анализе
- **Система аутентификации**: Supabase Auth

## 📊 Статистика

- **Отзывов в системе**: 39
- **API endpoints**: 6
- **Компонентов**: 3
- **Время загрузки**: ~50ms

## 🛠 Технологии

- **Frontend**: Next.js 14, React 18, TypeScript
- **UI**: Material UI, Tailwind CSS
- **Backend**: Next.js API Routes
- **База данных**: Supabase (PostgreSQL)
- **Парсинг**: Python (BeautifulSoup, requests)
- **Деплой**: Vercel

## 🚀 Быстрый старт

### Предварительные требования
- Node.js 18+
- Python 3.8+
- Git

### Установка

1. **Клонирование репозитория**
```bash
git clone https://github.com/golkonst77/TEST_V0.git
cd TEST_V0
```

2. **Установка зависимостей**
```bash
npm install
```

3. **Настройка Python окружения**
```bash
python -m venv .venv
.venv\Scripts\activate  # Windows
pip install beautifulsoup4 lxml requests
```

4. **Настройка переменных окружения**
```bash
cp .env.example .env.local
# Отредактируйте .env.local с вашими настройками Supabase
```

5. **Запуск разработки**
```bash
npm run dev
```

Приложение будет доступно по адресу: http://localhost:3000

## 📁 Структура проекта

```
D:\DATA\TEST_V0/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API endpoints
│   │   ├── admin/             # Административная панель
│   │   └── page.tsx           # Главная страница
│   ├── components/            # React компоненты
│   │   ├── admin/            # Компоненты админки
│   │   └── reviews.tsx       # Компонент отзывов
│   └── lib/                  # Утилиты и конфигурация
├── scripts/                  # Python скрипты
│   └── yandex_parser.py      # Парсер отзывов
├── public/                   # Статические файлы
│   └── *.json               # JSON файлы с отзывами
└── docs/                    # Документация проекта
```

## 🔧 API Endpoints

### Отзывы
- `GET /api/local-reviews` - Получение локальных отзывов
- `POST /api/generate-yandex-json-remote` - Генерация JSON из Яндекс.Карт
- `POST /api/import-yandex-reviews-json` - Импорт отзывов в Supabase

### Административные уведомления
- `POST /api/admin/notify-quiz-completion` - Уведомление о завершении квиза

## 📧 Настройка Email уведомлений

Система использует встроенный email сервис Supabase для отправки уведомлений администратору при завершении квиза.

### Настройка
1. Убедитесь, что у вас настроен Supabase проект
2. Добавьте в `.env.local`:
```bash
ADMIN_EMAIL=admin@prostoburo.com
```

### Как это работает
- При завершении квиза автоматически отправляется email на `admin@prostoburo.com`
- Email содержит полную информацию о клиенте: телефон, скидку, тип бизнеса, купон, все ответы на вопросы
- Если отправка через Supabase не удается, уведомление выводится в консоль сервера для отладки

**Примечание**: Supabase email сервис уже настроен в проекте и не требует дополнительной конфигурации.

### Настройки
- `GET /api/settings` - Получение настроек сайта
- `POST /api/settings` - Обновление настроек

### Диагностика
- `GET /api/test-supabase-simple` - Тест подключения к Supabase
- `GET /api/debug-env` - Отладка переменных окружения

## 📚 Документация

- [Project.md](docs/Project.md) - Архитектура и описание проекта
- [Tasktracker.md](docs/Tasktracker.md) - Отслеживание задач
- [Diary.md](docs/Diary.md) - Технические решения
- [qa.md](docs/qa.md) - Вопросы по архитектуре
- [changelog.md](docs/changelog.md) - История изменений

## 🎯 Система отзывов

### Архитектура
```
Яндекс.Карты → Python Parser → JSON File → Next.js API → Frontend
```

### Особенности
- **39 отзывов** с полной информацией
- **Случайное перемешивание** при каждом запросе
- **Клиентская пагинация** по 3 отзыва на страницу
- **Обработка русских дат** (например, "4 марта" → ISO формат)
- **Fallback система** при проблемах с Supabase

### Использование

1. **Генерация JSON из Яндекс.Карт**
```bash
curl -X POST http://localhost:3000/api/generate-yandex-json-remote \
  -H "Content-Type: application/json" \
  -d '{"companyId":"180493814174","outputJsonFile":"reviews.json"}'
```

2. **Импорт отзывов**
```bash
curl -X POST http://localhost:3000/api/import-yandex-reviews-json \
  -H "Content-Type: application/json" \
  -d '{"jsonFile":"reviews.json"}'
```

## 🔐 Переменные окружения

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для новой функции (`git checkout -b feature/amazing-feature`)
3. Зафиксируйте изменения (`git commit -m 'Add amazing feature'`)
4. Отправьте в ветку (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📝 Лицензия

Этот проект лицензирован под MIT License - см. файл [LICENSE](LICENSE) для деталей.

## 📞 Контакты

- **Email**: urist40@gmail.com
- **Телефон**: +7953 777 77 77
- **Адрес**: Калуга, Дзержинского 37, офис 20

## 🚀 Деплой

### Схема портов на сервере

**Важно!** На сервере используется следующая схема портов:

- **hvostikalert.ru** → **порт 3001** ✅
- **prostoburo.com** → **порт 3000** ✅

### Скрипты деплоя

#### 1. Основной деплой PROSTOBURO
```bash
# Windows batch файл
D:\DATA\BAT\Запуск деплоя на сервере PROSTOBURO.bat
```

**Что делает:**
- Подключается к серверу `212.34.138.16`
- Выполняет скрипт `/home/pb001/deploy.sh`
- Обновляет код из Git репозитория
- Устанавливает зависимости
- Собирает проект
- Перезапускает PM2 процесс

#### 2. Деплой HVOSTIK-ALERT
```bash
# Windows batch файл
D:\DATA\BAT\Запуск деплоя на сервере HVOSTIK-ALERT.bat
```

**Что делает:**
- Подключается к серверу `212.34.138.16`
- Выполняет скрипт `/var/www/hvostikalert_usr/deploy.sh`
- Запускает приложение на порту 3001

### Структура деплоя на сервере

```
/var/www/
├── hvostikalert_usr/
│   ├── data/www/hvostikalert.ru/    # Код hvostik-alert
│   └── deploy.sh                    # Скрипт деплоя hvostik-alert
└── prostoburo_c_usr/
    ├── data/www/prostoburo.com/     # Код prostoburo
    └── deploy.sh                    # Скрипт деплоя prostoburo
```

### PM2 процессы

```bash
# Проверка статуса
pm2 status

# Ожидаемый результат:
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ hvastik-alert      │ fork     │ 0    │ online    │ 0%       │ 58.6mb   │
│ 1  │ prostoburo         │ fork     │ 0    │ online    │ 0%       │ 58.6mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
```

### Nginx конфигурация

#### hvostikalert.ru
```nginx
upstream hvostikalert.ru {
    server localhost:3001;
}
```

#### prostoburo.com
```nginx
upstream prostoburo.com {
    server localhost:3000;
}
```

### Переменные окружения

#### .env.local для prostoburo
```env
PORT=3000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

#### .env.local для hvostik-alert
```env
PORT=3001
# другие переменные...
```

### Команды для диагностики

```bash
# Проверка портов
netstat -tlnp | grep -E ':(3000|3001)'

# Проверка PM2
pm2 status
pm2 logs prostoburo
pm2 logs hvastik-alert

# Проверка Nginx
nginx -t
systemctl reload nginx
```

### Устранение проблем

#### Проблема: prostoburo не запускается
```bash
# Решение: пересборка
cd /var/www/prostoburo_c_usr/data/www/prostoburo.com
rm -rf .next
npm run build
PORT=3000 pm2 start npm --name prostoburo -- start
```

#### Проблема: неправильные порты
```bash
# Остановить все процессы
pm2 stop all && pm2 delete all

# Запустить hvastik-alert на 3001
cd /var/www/hvostikalert_usr/data/www/hvostikalert.ru
PORT=3001 pm2 start npm --name hvastik-alert -- start

# Запустить prostoburo на 3000
cd /var/www/prostoburo_c_usr/data/www/prostoburo.com
PORT=3000 pm2 start npm --name prostoburo -- start
```

### Автоматический деплой

Проект также автоматически деплоится на Vercel при пуше в ветку `main`.

---

⭐ Если проект вам понравился, поставьте звездочку!
