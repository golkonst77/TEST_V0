# Локальная разработка (prostoburo.com)

Проект: Next.js 14, App Router. Production использует PM2/Nginx и **внешний** `CMS_STORAGE_DIR`. Локально всё хранится в `./data/storage` внутри репозитория.

## Быстрый старт

```bash
npm install
npm run storage:seed
npm run dev
```

Открыть: [http://localhost:3000](http://localhost:3000)

Windows: двойной клик по `start-dev.bat` в корне проекта.

## Скрипты

| Команда | Назначение |
|---------|------------|
| `npm run dev` | Dev-сервер с hot reload (порт 3000) |
| `npm run dev:3001` | Dev на порту 3001, если 3000 занят |
| `npm run build` | Production-сборка |
| `npm run start` | Запуск собранного приложения |
| `npm run storage:seed` | Скопировать шаблоны JSON в `data/storage` (не перезаписывает существующие) |
| `npm run dev:setup` | `storage:seed` + `dev` одной командой |

## Переменные окружения

1. Скопировать `.env.local.example` → `.env.local`
2. Обязательно для локального CMS:

```env
CMS_STORAGE_DIR=./data/storage
```

**Не указывайте** пути production (`/var/www/.../storage`) — иначе dev будет читать/писать боевые данные.

Без `CMS_STORAGE_DIR` в development по умолчанию используется `data/storage` (см. `lib/cms-storage.ts`). Явная переменная нужна, чтобы не перепутать с prod при копировании `.env`.

## Где что хранится

| Файл | Локально | Production |
|------|----------|------------|
| `homepage-sections.json` | `data/storage/` | внешний `CMS_STORAGE_DIR` |
| `homepage.json` | `data/storage/` | то же |
| `header-config.json` | `data/storage/` | то же |
| `calculator-config.json` | `data/storage/` | то же |

Шаблоны в репозитории: `data/homepage.json`, `data/homepage-sections.json`.  
Если в `data/storage` файла нет, в **dev** visibility может подхватить legacy из `data/homepage-sections.json`; после `storage:seed` админка и API пишут только в storage.

## Проверка visibility / админки

1. `npm run dev`
2. Админка → Видимость секций → сохранить
3. Убедиться, что обновился `data/storage/homepage-sections.json` (не production path)
4. Главная — секции включаются/выключаются без деплоя

Диагностика (если есть доступ): `GET /api/admin/storage-debug` (под админ-сессией).

## Production build локально

```bash
npm run build
npm run start
```

Откроется [http://localhost:3000](http://localhost:3000) в режиме production (без hot reload).

## Что не нужно локально

- PM2
- Nginx
- Production domain
- Путь `/var/www/prostoburo_c_usr/data/storage`

## Типичные проблемы

**Порт 3000 занят**

```bash
npm run dev:3001
```

**Секции не сохраняются**

- Проверить `CMS_STORAGE_DIR` в `.env.local`
- Запустить `npm run storage:seed`
- Перезапустить `npm run dev`

**Изменения в `.tsx` не видны**

- Убедиться, что запущен `npm run dev`, а не `npm run start` без пересборки
