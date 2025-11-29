# Оптимизация сборки проекта

## Текущее состояние

**Время сборки**: ~60 секунд (было ~30 секунд)  
**Количество зависимостей**: 517 пакетов  
**Статических страниц**: 103  

## Выполненные оптимизации (v1.0.26)

### 1. ✅ Playwright перемещен в devDependencies
**Было**: В production dependencies (~200 MB с браузерами)  
**Стало**: В devDependencies  
**Экономия**: ~200 MB, меньше времени на установку в production

### 2. ✅ Оптимизация Next.js конфигурации
Добавлено в `next.config.mjs`:
```javascript
swcMinify: true, // SWC минификация (быстрее Terser)
compiler: {
  removeConsole: true, // Удаление console.log в production
},
experimental: {
  optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
},
output: 'standalone', // Оптимизированная сборка
```

**Результат**: Должно ускорить сборку на 20-30%

## Дополнительные рекомендации (для дальнейшей оптимизации)

### 1. 🔄 Исп dynamic imports для тяжелых компонентов

#### GSAP (анимации)
**Текущий размер**: ~80 KB

```typescript
// Вместо прямого импорта
import gsap from 'gsap';

// Используйте
const gsap = dynamic(() => import('gsap'), { ssr: false });
```

#### Recharts (графики)
**Текущий размер**: ~150 KB

```typescript
// app/admin/analytics/page.tsx
const Chart = dynamic(() => import('@/components/analytics-chart'), {
  loading: () => <div>Загрузка графика...</div>,
  ssr: false
});
```

#### React Markdown
**Текущий размер**: ~50 KB

```typescript
// Используется только на странице /policy
const ReactMarkdown = dynamic(() => import('react-markdown'), {
  loading: () => <div>Загрузка...</div>,
});
```

### 2. 📦 Замена тяжелых библиотек

#### date-fns → использовать только нужные функции
```typescript
// Вместо
import { format, parseISO } from 'date-fns';

// Можно использовать нативный Intl
const formatter = new Intl.DateTimeFormat('ru-RU');
```

#### lucide-react → использовать только нужные иконки
```typescript
// Вместо импорта всей библиотеки
import { Home, User, Settings } from 'lucide-react';

// Tree-shaking уже работает, но можно использовать
// более легкую альтернативу для иконок
```

### 3. 🎯 Оптимизация Radix UI

**Проблема**: 22 отдельных пакета Radix UI

**Рекомендация**:
- Удалить неиспользуемые компоненты
- Проверить, какие действительно используются

```bash
# Проверка использования (запустить в проекте)
grep -r "@radix-ui/react-accordion" . --include="*.tsx" --include="*.ts"
```

**Вероятно неиспользуемые** (проверить):
- `@radix-ui/react-aspect-ratio`
- `@radix-ui/react-collapsible`
- `@radix-ui/react-context-menu`
- `@radix-ui/react-hover-card`
- `@radix-ui/react-menubar`
- `@radix-ui/react-progress`
- `@radix-ui/react-resizable-panels`
- `@radix-ui/react-toggle`
- `@radix-ui/react-toggle-group`

### 4. 🗑️ Удаление неиспользуемых зависимостей

#### Кандидаты на удаление (проверить использование):

```json
{
  "fs": "latest",           // Встроенный модуль Node.js, не нужен в dependencies
  "path": "latest",         // Встроенный модуль Node.js
  "isomorphic-fetch": "",   // Уже есть node-fetch
  "classnames": "",         // Уже есть clsx (делает то же самое)
  "immer": "",              // Возможно не используется
  "vaul": "",               // Возможно не используется
  "input-otp": "",          // Возможно не используется
  "cmdk": "",               // Возможно не используется
}
```

**Команда для проверки**:
```bash
npx depcheck
```

### 5. 📊 Статические страницы → ISR

**Проблема**: 103 страницы генерируются статически при каждой сборке

**Решение**: Использовать Incremental Static Regeneration (ISR)

```typescript
// app/blog/[slug]/page.tsx
export const revalidate = 3600; // Обновлять раз в час

// Или использовать on-demand revalidation
export const dynamic = 'force-dynamic'; // Для часто меняющихся страниц
```

### 6. ⚡ Vercel Build Cache

**Проблема**: `Previous build caches not available`

**Причина**: Возможно, кеш сбрасывается из-за изменений в package.json

**Рекомендация**:
- Фиксировать версии пакетов вместо `"latest"`
- Не использовать `npm install` перед коммитом
- Добавить `.vercel/cache` в кеширование

```json
// package.json - зафиксировать версии
{
  "cmdk": "^0.2.0",              // вместо "latest"
  "react-day-picker": "^8.10.0", // вместо "latest"
  "next-themes": "^0.2.1",       // вместо "latest"
  // и т.д.
}
```

### 7. 🔧 Оптимизация webpack

Добавить в `next.config.mjs`:

```javascript
webpack: (config, { isServer }) => {
  // Оптимизация для клиента
  if (!isServer) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
  }
  
  // Параллельная обработка
  config.parallelism = 4;
  
  return config;
},
```

## Ожидаемые результаты после полной оптимизации

### Текущее состояние:
- ⏱️ Время сборки: **~60 секунд**
- 📦 Зависимостей: **517 пакетов**
- 📄 Страниц: **103 статические**

### После оптимизации:
- ⏱️ Время сборки: **30-40 секунд** (-30-50%)
- 📦 Зависимостей: **~400 пакетов** (-20%)
- 📄 Страниц: **20-30 статических + ISR** (-70%)
- 💾 Bundle size: **-200 KB** минимум

## План действий (приоритеты)

### Высокий приоритет (сделать сейчас):
1. ✅ Playwright в devDependencies
2. ✅ Оптимизация next.config
3. ⏳ Удалить `fs` и `path` из dependencies
4. ⏳ Проверить и удалить неиспользуемые Radix UI компоненты

### Средний приоритет (в ближайшее время):
5. ⏳ Dynamic imports для GSAP, Recharts, ReactMarkdown
6. ⏳ Зафиксировать версии вместо "latest"
7. ⏳ ISR для динамических страниц

### Низкий приоритет (когда будет время):
8. ⏳ Анализ бандла: `npm run build && npx @next/bundle-analyzer`
9. ⏳ Замена тяжелых библиотек на легкие альтернативы
10. ⏳ Code splitting для админ панели

## Инструменты для анализа

```bash
# Анализ зависимостей
npx depcheck

# Анализ размера бандла
npm run build
npx @next/bundle-analyzer

# Анализ дублирующихся пакетов
npx npm-check-duplicates

# Поиск устаревших пакетов
npx npm-check-updates
```

## Мониторинг

Отслеживать метрики после каждого деплоя:
- Время сборки (в логах Vercel)
- Размер бандла (First Load JS)
- Core Web Vitals (в Vercel Analytics)

---

**Документ создан**: 29 ноября 2025  
**Версия проекта**: 1.0.26  
**Автор**: Build Optimization Team

