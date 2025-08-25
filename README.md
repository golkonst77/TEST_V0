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

Проект автоматически деплоится на Vercel при пуше в ветку `main`.

---

⭐ Если проект вам понравился, поставьте звездочку!
