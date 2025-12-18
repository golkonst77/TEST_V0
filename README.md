# ПростоБюро - Профессиональные юридические услуги

**ПростоБюро** - современный веб-сайт юридической компании с полным функционалом для привлечения и обработки клиентов.

## 🚀 Возможности

### ✅ Реализовано
- **Cookie Consent система**: Полное соответствие ФЗ-152 и требованиям Роскомнадзора
- **Яндекс.Метрика**: Условная загрузка только после согласия пользователя
- **Квиз система**: Интерактивный квиз для сбора заявок с купонами и скидками
- **Email уведомления**: Интеграция с Yandex Mail и Supabase для отправки уведомлений
- **AmoCRM интеграция**: Автоматическое создание лидов в CRM
- **WhatsApp интеграция**: Отправка сообщений через whapi.cloud API
- **Система версионирования**: Автоматическое управление версиями проекта
- **Административная панель**: Управление настройками, контактами, видимостью секций
- **Система отзывов**: Парсинг и отображение отзывов с Яндекс.Карт
- **Калькулятор услуг**: Интерактивный расчет стоимости
- **Адаптивный дизайн**: Раздельные настройки для desktop и mobile

### 📊 Статистика

- **Текущая версия**: 1.1.0
- **API endpoints**: 15+
- **Компонентов**: 25+
- **Отзывов**: 39
- **Интеграций**: 4 (Yandex, AmoCRM, WhatsApp, Supabase)

## 🛠 Технологии

### Frontend
- **Framework**: Next.js 14.2.16 (App Router)
- **React**: 18
- **TypeScript**: 5
- **UI библиотеки**: 
  - Radix UI (компоненты)
  - Tailwind CSS 3.4 (стилизация)
  - Lucide React (иконки)
- **Анимации**: GSAP 3.13

### Backend
- **API**: Next.js API Routes
- **База данных**: Supabase (PostgreSQL)
- **Email**: 
  - Yandex Mail (nodemailer)
  - Supabase Email Service
- **Парсинг**: Python 3.8+ (BeautifulSoup, requests)

### Интеграции
- **CRM**: AmoCRM API
- **Мессенджеры**: WhatsApp (whapi.cloud)
- **Аналитика**: Яндекс.Метрика (ID: 45860892)
- **Формы**: React Hook Form + Zod валидация

### DevOps
- **Деплой**: Vercel
- **Версионирование**: Автоматическое (Git hooks)
- **Миграции**: Supabase SQL
- **Мониторинг**: Console logging + Supabase Dashboard

## 🚀 Быстрый старт

### Предварительные требования
- **Node.js** 18+ 
- **Python** 3.8+ (для парсера отзывов)
- **Git** для клонирования
- **Supabase** аккаунт (бесплатный тариф подходит)

### Установка

#### 1. Клонирование и установка зависимостей
```bash
git clone https://github.com/golkonst77/TEST_V0.git
cd TEST_V0
npm install
```

#### 2. Настройка Python окружения (для парсера)
```bash
# Windows
python -m venv .venv
.venv\Scripts\activate
pip install beautifulsoup4 lxml requests

# Linux/Mac
python3 -m venv .venv
source .venv/bin/activate
pip install beautifulsoup4 lxml requests
```

#### 3. Настройка переменных окружения
```bash
cp env.example .env.local
```

Отредактируйте `.env.local`:
```env
# Обязательные
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
ADMIN_EMAIL=your-admin@email.com

# Опциональные (для полного функционала)
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=onboarding@resend.dev
YANDEX_EMAIL=your@yandex.ru
YANDEX_PASSWORD=your_app_password
WHATSAPP_API_TOKEN=your_token
AMOCRM_ACCESS_TOKEN=your_token

# Квиз
QUIZ_SITE=prostoburo
QUIZ_GIFT_PDF=Kak_vibrat_buh_kompany.pdf
```

#### 4. Настройка базы данных
```bash
# Выполните миграции в Supabase Dashboard
# или используйте Supabase CLI
supabase db push
```

SQL миграции находятся в `supabase/migrations/`

#### 5. Запуск разработки
```bash
npm run dev
```

Приложение будет доступно: **http://localhost:3000**

### Первый запуск
1. Откройте http://localhost:3000
2. Примите cookie consent
3. Откройте админку: http://localhost:3000/admin
4. Настройте контакты и видимость секций
5. Протестируйте квиз

### Проверка работоспособности
```bash
# Проверка Supabase
curl http://localhost:3000/api/test-supabase-simple

# Проверка версии
curl http://localhost:3000/api/version

# Проверка отзывов
curl http://localhost:3000/api/local-reviews
```

## 📁 Структура проекта

```
D:\DATA\TEST_V0/
├── app/                           # Next.js App Router
│   ├── api/                       # API Routes
│   │   ├── admin/                 # Административные API
│   │   │   ├── notify-quiz-completion/  # Уведомления о квизе
│   │   │   ├── settings/          # Настройки сайта
│   │   │   └── visibility/        # Видимость секций
│   │   ├── integrations/          # Внешние интеграции
│   │   │   └── amocrm/           # AmoCRM интеграция
│   │   ├── cookie-consent/        # Cookie consent
│   │   ├── coupons/              # Управление купонами
│   │   ├── send-email/           # Email сервис
│   │   ├── version/              # Версия приложения
│   │   └── ...                   # Другие endpoints
│   ├── admin/                     # Административная панель
│   │   ├── contacts/             # Управление контактами
│   │   └── visibility/           # Настройки видимости
│   ├── pricing/                   # Страницы с ценами
│   │   ├── ip/                   # Тарифы для ИП
│   │   └── ooo/                  # Тарифы для ООО
│   ├── policy/                    # Политика конфиденциальности
│   ├── layout.tsx                 # Корневой layout
│   └── page.tsx                   # Главная страница
├── components/                    # React компоненты
│   ├── cookie-consent.tsx         # Cookie баннер
│   ├── quiz-modal.tsx             # Интерактивный квиз
│   ├── footer.tsx                 # Футер с версией
│   ├── header.tsx                 # Шапка сайта
│   ├── hero.tsx                   # Hero секция
│   ├── services.tsx               # Услуги
│   ├── pricing-section.tsx        # Цены
│   ├── faq.tsx                    # FAQ
│   ├── calculator.tsx             # Калькулятор
│   ├── reviews.tsx                # Отзывы
│   └── version-info.tsx           # Информация о версии
├── hooks/                         # React хуки
│   ├── use-homepage-sections.ts   # Управление видимостью секций
│   └── use-device-type.ts         # Определение типа устройства
├── lib/                           # Утилиты и библиотеки
│   ├── supabase.ts               # Supabase клиент
│   ├── email-service.ts          # Email сервис
│   └── amo.ts                    # AmoCRM клиент
├── scripts/                       # Скрипты
│   ├── yandex_parser.py          # Парсер отзывов
│   └── update-version.cjs        # Обновление версии
├── supabase/                      # Supabase миграции
│   └── migrations/               # SQL миграции
│       └── cookie_consents.sql   # Таблица согласий
├── public/                        # Статические файлы
│   ├── policy.md                 # Политика конфиденциальности
│   ├── reviews.json              # Отзывы (кеш)
│   └── images/                   # Изображения
└── docs/                          # Документация
    ├── changelog.md              # История изменений
    ├── cookie-consent-setup.md   # Настройка cookie consent
    ├── version-system.md         # Система версионирования
    ├── whatsapp-service.md       # WhatsApp интеграция
    └── ...                       # Другие документы
```

## 🔧 API Endpoints

### Отзывы
- `GET /api/local-reviews` - Получение локальных отзывов
- `POST /api/generate-yandex-json-remote` - Генерация JSON из Яндекс.Карт
- `POST /api/import-yandex-reviews-json` - Импорт отзывов в Supabase

### Email сервис
- `POST /api/send-email` - Отправка email через Yandex/Supabase
- `POST /api/admin/notify-quiz-completion` - Уведомление админа о завершении квиза
- `POST /api/test-yandex-email` - Тестирование Yandex SMTP

### Cookie & Privacy
- `POST /api/cookie-consent` - Сохранение согласия на обработку данных
- `GET /api/version` - Получение текущей версии приложения

### Интеграции
- `POST /api/integrations/amocrm/lead` - Создание лида в AmoCRM
- `POST /api/send-whatsapp` - Отправка сообщений в WhatsApp
- `POST /api/send-whatsapp-document` - Отправка файлов в WhatsApp

### Администрирование
- `GET /api/admin/settings` - Получение настроек сайта
- `POST /api/admin/settings` - Обновление настроек
- `GET /api/admin/visibility` - Настройки видимости секций
- `POST /api/admin/visibility` - Сохранение видимости секций

### Купоны
- `GET /api/coupons` - Получение списка купонов
- `POST /api/coupons` - Создание/обновление купонов
- `DELETE /api/coupons` - Удаление купонов

### Диагностика
- `GET /api/test-supabase-simple` - Тест подключения к Supabase
- `GET /api/debug-env` - Отладка переменных окружения

## 📧 Email сервис

### Поддерживаемые провайдеры
1. **Yandex Mail** (основной):
   - SMTP: `smtp.yandex.ru:465`
   - Требуется пароль приложения
   - Поддержка HTML писем

2. **Supabase Email** (резервный):
   - Встроенный сервис
   - Fallback при недоступности Yandex

### Настройка Yandex Mail
```bash
# .env.local
EMAIL_FROM=your-email@yandex.ru
EMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=admin@prostoburo.com
```

### Функции
- Уведомления администратору о новых заявках
- Отправка купонов клиентам
- Благодарственные письма
- Автоматическая генерация HTML шаблонов

## 🔐 Cookie Consent & ФЗ-152

### Реализовано
- ✅ Баннер согласия на обработку данных
- ✅ Модальное окно с детальными настройками
- ✅ Три типа cookies: необходимые, аналитика, маркетинг
- ✅ Сохранение в БД с IP и User-Agent
- ✅ Условная загрузка Яндекс.Метрики
- ✅ Ссылка на отзыв согласия (urist40@gmail.com)

### Компонент
```typescript
<CookieConsent ymId="45860892" />
```

### Хранение
- **localStorage**: Локальное согласие
- **Cookie**: Флаг принятия
- **БД**: Таблица `cookie_consents` (history)

## 🎯 Система версионирования

### Автоматическое управление версиями
- **Git hook**: Автоматическое обновление при коммите
- **Single Source of Truth**: `package.json` - единственный источник версии
- **API**: `/api/version` - динамическое чтение версии
- **UI**: Отображение в футере сайта

### Команды
```bash
npm run version:patch  # 1.0.0 → 1.0.1
npm run version:minor  # 1.0.0 → 1.1.0
npm run version:major  # 1.0.0 → 2.0.0
```

### Что обновляется автоматически
1. `package.json` - версия
2. `docs/changelog.md` - запись об изменении
3. Коммит сообщение - префикс версии

## 📚 Документация

- [Project.md](docs/Project.md) - Архитектура и описание проекта
- [Tasktracker.md](docs/Tasktracker.md) - Отслеживание задач
- [Diary.md](docs/Diary.md) - Технические решения
- [qa.md](docs/qa.md) - Вопросы по архитектуре
- [changelog.md](docs/changelog.md) - История изменений

## 🎯 Ключевые функции

### 🎲 Система квизов
**Компонент**: `components/quiz-modal.tsx`

**Функции**:
- 7 шагов с различными типами вопросов
- Генерация персональных купонов
- Валидация телефона
- Интеграция с AmoCRM
- Отправка уведомлений администратору
- Отправка купона клиенту в WhatsApp
- Отзывчивый дизайн

**Процесс**:
1. Пользователь проходит квиз (7 вопросов)
2. Генерируется персональный купон со скидкой
3. Создается лид в AmoCRM
4. Администратору приходит email с данными
5. Клиенту отправляется купон в WhatsApp

**Актуальный backend flow**:
1. `POST /api/quiz-lead` сохраняет лид в таблицу `quiz_leads`
2. Генерирует купон и сохраняет его в таблицу `quiz_coupons` (это отдельная таблица, не `coupons`)
3. Отправляет 2 письма:
   - клиенту: HTML + купон + (опционально) PDF чек-лист во вложении
   - администратору: подробный отчёт + купон

### ⭐ Система отзывов

**Архитектура**:
```
Яндекс.Карты → Python Parser → JSON File → Next.js API → Frontend
```

**Особенности**:
- 39 отзывов с полной информацией
- Случайное перемешивание при каждом запросе
- Клиентская пагинация (3 отзыва на страницу)
- Обработка русских дат (например, "4 марта" → ISO формат)
- Fallback система при проблемах с Supabase
- Кеширование в `public/reviews.json`

**Парсинг отзывов**:
```bash
# 1. Генерация JSON из Яндекс.Карт
curl -X POST http://localhost:3000/api/generate-yandex-json-remote \
  -H "Content-Type: application/json" \
  -d '{"companyId":"180493814174","outputJsonFile":"reviews.json"}'

# 2. Импорт в Supabase
curl -X POST http://localhost:3000/api/import-yandex-reviews-json \
  -H "Content-Type: application/json" \
  -d '{"jsonFile":"reviews.json"}'
```

### 🧮 Калькулятор услуг
**Компонент**: `components/calculator.tsx`

**Функции**:
- Выбор типа бизнеса (ИП/ООО)
- Выбор региона
- Выбор дополнительных услуг
- Автоматический расчет стоимости
- Интеграция с квизом

### 📱 Адаптивность
**Хук**: `hooks/use-device-type.ts`

**Функции**:
- Определение типа устройства (desktop/mobile)
- Граница: 1024px
- Раздельные настройки видимости секций
- Оптимизация контента под устройство

### 🎛️ Административная панель
**Путь**: `/admin`

**Разделы**:
1. **Настройки сайта** - общие настройки
2. **Управление контактами** - телефон, email, адрес
3. **Видимость секций** - отдельно для desktop/mobile
4. **Купоны** - создание и управление купонами
5. **Статистика** - просмотр заявок и конверсий

## 🔐 Переменные окружения

### Базовые настройки
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Email (Yandex)
EMAIL_FROM=your-email@yandex.ru
EMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=admin@prostoburo.com

# Яндекс.Метрика
NEXT_PUBLIC_YANDEX_METRIKA_ID=45860892

# WhatsApp (whapi.cloud)
WHATSAPP_API_TOKEN=your_whapi_token
WHATSAPP_PHONE_NUMBER=your_phone_number

# AmoCRM
AMOCRM_SUBDOMAIN=your_subdomain
AMOCRM_ACCESS_TOKEN=your_access_token
AMOCRM_PIPELINE_ID=your_pipeline_id
```

### Получение учетных данных

#### 1. Supabase
1. Создайте проект на [supabase.com](https://supabase.com)
2. Project Settings → API → Project URL и anon key
3. Service Role Key (для серверных операций)

#### 2. Yandex Mail
1. Настройте почту на [mail.yandex.ru](https://mail.yandex.ru)
2. Включите IMAP/SMTP в настройках
3. Создайте пароль приложения в безопасности

#### 3. WhatsApp API
1. Зарегистрируйтесь на [whapi.cloud](https://whapi.cloud)
2. Создайте канал WhatsApp
3. Скопируйте API токен
4. Тариф: ~600₽/месяц

#### 4. AmoCRM
1. Войдите в вашу AmoCRM
2. Настройки → Интеграции → API
3. Создайте интеграцию
4. Получите access token

## 🔌 Интеграции

### AmoCRM
**Статус**: ✅ Активна

**Функции**:
- Автоматическое создание лидов из квиза
- Передача всех данных клиента
- Пользовательские поля (купон, скидка, тип бизнеса)

**API**: `POST /api/integrations/amocrm/lead`

```typescript
{
  phone: "+79537777777",
  discount: "30%",
  businessType: "ИП",
  couponCode: "IP30",
  answers: {...}
}
```

### WhatsApp (whapi.cloud)
**Статус**: ✅ Активна (оплачено до 27.09.2025)

**Функции**:
- ✅ Отправка текстовых сообщений
- ✅ Отправка файлов (PDF чек-листы)
- ✅ Отправка купонов клиентам

**API**: 
- `POST /api/send-whatsapp` - текст
- `POST /api/send-whatsapp-document` - файлы

**Тариф**: 600₽/месяц

### Яндекс.Метрика
**Статус**: ✅ Активна (ID: 45860892)

**Особенности**:
- Условная загрузка (только после согласия)
- Соответствие ФЗ-152
- WebVisor включен
- Карта кликов активна

### Email уведомления
**Статус**: ✅ Активны

**Провайдеры**:
1. **Yandex Mail** (основной) - SMTP
2. **Supabase Email** (резервный)

**Шаблоны**:
- Уведомление администратору о новой заявке
- Отправка купона клиенту
- Благодарственное письмо

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для новой функции (`git checkout -b feature/amazing-feature`)
3. Зафиксируйте изменения (`git commit -m 'Add amazing feature'`)
4. Отправьте в ветку (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 🐛 Решение проблем

### Ошибка "Cannot find module 'next/dist/build/webpack/loaders/next-flight-loader/module-proxy'"

**Решение**:
```bash
# Windows
Remove-Item -Path ".next" -Recurse -Force
Remove-Item -Path "node_modules" -Recurse -Force
npm install
npm run dev

# Linux/Mac
rm -rf .next node_modules
npm install
npm run dev
```

### Проблемы с Python парсером
```bash
# Убедитесь что используется правильная кодировка
$env:PYTHONIOENCODING="utf-8"  # Windows PowerShell
export PYTHONIOENCODING=utf-8   # Linux/Mac

# Переустановите зависимости
pip install --upgrade beautifulsoup4 lxml requests
```

### Ошибки Supabase подключения
1. Проверьте `.env.local` на корректность URL и ключей
2. Убедитесь что IP разрешен в Supabase Dashboard
3. Проверьте статус Supabase: https://status.supabase.com

### Проблемы с Email
1. **Yandex**: Проверьте что используется пароль приложения, а не основной
2. **SMTP**: Убедитесь что порт 465 не заблокирован
3. **Проверка**: используйте `/api/test-yandex-email`

## 📚 Документация

### Основные документы
- [**changelog.md**](docs/changelog.md) - Полная история изменений с версиями
- [**version-system.md**](docs/version-system.md) - Система автоматического версионирования
- [**cookie-consent-setup.md**](docs/cookie-consent-setup.md) - Настройка Cookie Consent
- [**whatsapp-service.md**](docs/whatsapp-service.md) - Интеграция WhatsApp API

### Архитектура
- [**Project.md**](docs/Project.md) - Общее описание архитектуры проекта
- [**qa.md**](docs/qa.md) - Вопросы и ответы по архитектуре
- [**Diary.md**](docs/Diary.md) - Технические решения и обоснования

### Управление задачами
- [**Tasktracker.md**](docs/Tasktracker.md) - Отслеживание задач и планирование

## 🔄 Последние обновления

### v1.0.22 (2025-11-28)
- ✅ Исправлена ошибка с модулями Next.js
- ✅ Переустановлены зависимости
- ✅ Очищен кеш сборки

### v1.0.21 (2025-11-28)
- ✅ Улучшена читаемость Политики конфиденциальности
- ✅ Раздел "Цели обработки" преобразован в карточки

### v1.0.20 (2025-11-28)
- ✅ Рефакторинг системы версионирования
- ✅ Single Source of Truth - только package.json
- ✅ Динамическое API `/api/version`

### v1.0.19 (2025-11-28)
- ✅ Добавлен блок соответствия законодательству в футер
- ✅ Синхронизация версий в скрипте обновления

### v1.0.18 (2025-11-28)
- ✅ Cookie Consent Banner с полным соответствием ФЗ-152
- ✅ Условная загрузка Яндекс.Метрики
- ✅ API endpoint для сохранения согласий

## 🔒 Соответствие законодательству РФ

### ФЗ-152 "О персональных данных"
- ✅ Явное согласие перед обработкой данных
- ✅ Право на отзыв согласия (urist40@gmail.com)
- ✅ Хранение на территории РФ (Supabase EU region)
- ✅ Запись истории согласий с timestamp
- ✅ Детальная Политика конфиденциальности

### Требования Роскомнадзора
- ✅ Cookie Consent баннер
- ✅ Управление категориями cookies
- ✅ Ссылка на политику конфиденциальности
- ✅ Контактные данные оператора
- ✅ Уведомление об инцидентах (24/72 часа)

### Обработка персональных данных
- ✅ Только необходимые данные (телефон, email)
- ✅ Защищенное хранение (Supabase Row Level Security)
- ✅ Передача только проверенным партнерам (AmoCRM)
- ✅ Автоматическое удаление по запросу

## 🚀 Деплой

### Vercel (Production)
Проект автоматически деплоится на Vercel при пуше в `main`:

1. Пуш в `main` → автоматический deploy
2. Preview deploys для PR
3. Переменные окружения настраиваются в Vercel Dashboard

**URL**: https://prostoburo.vercel.app (или ваш домен)

### Ручной деплой
```bash
# Сборка проекта
npm run build

# Запуск production
npm start
```

### Чек-лист перед деплоем
- [ ] Все переменные окружения настроены в Vercel
- [ ] Supabase миграции выполнены
- [ ] Email сервис протестирован
- [ ] AmoCRM интеграция работает
- [ ] Cookie Consent тестирован
- [ ] Яндекс.Метрика подключена

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте feature ветку: `git checkout -b feature/amazing-feature`
3. Следуйте правилам из `.cursorrules`
4. Используйте conventional commits: `feat:`, `fix:`, `docs:`, и т.д.
5. Обновите документацию при необходимости
6. Создайте Pull Request

### Стиль коммитов
```bash
feat: добавлена новая функция
fix: исправлена ошибка
docs: обновлена документация
style: форматирование кода
refactor: рефакторинг без изменения функциональности
test: добавлены тесты
chore: обновление зависимостей
```

## 📝 Лицензия

Этот проект лицензирован под MIT License - см. файл [LICENSE](LICENSE) для деталей.

## 📞 Контакты

### ПростоБюро - Юридические услуги
- **Email (общий)**: urist40@gmail.com
- **Email (персональные данные)**: urist40@gmail.com
- **Телефон**: +7 (953) 777-77-77
- **WhatsApp**: +7 (953) 777-77-77
- **Адрес**: 248001, Калужская область, г. Калуга, ул. Дзержинского, д. 37, офис 20

### Разработка
- **GitHub**: [golkonst77/TEST_V0](https://github.com/golkonst77/TEST_V0)
- **Issues**: [github.com/golkonst77/TEST_V0/issues](https://github.com/golkonst77/TEST_V0/issues)

## 📊 Метрики проекта

- **Версия**: 1.1.0
- **Next.js**: 14.2.16
- **React**: 18
- **TypeScript**: 5
- **Компонентов**: 25+
- **API Endpoints**: 15+
- **Интеграций**: 4 (Yandex, AmoCRM, WhatsApp, Supabase)
- **Документов**: 10+ страниц документации
- **Соответствие**: ФЗ-152, Роскомнадзор

---

⭐ Если проект вам понравился, поставьте звездочку на GitHub!
