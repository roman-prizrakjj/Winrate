# 🏆 Winrate Dashboard

Аналитическая панель для турниров с тремя дашбордами на Next.js 14.

## 🚀 Стек технологий

- **Next.js 14** - App Router, SSR
- **TypeScript** - типобезопасность  
- **Tailwind CSS** - утилитарная стилизация
- **EMD Cloud SDK** - база данных и API
- **React 18** - компонентная архитектура

## ⚡ Функции

### Dashboard 1 - Матчи
- 📋 Список предстоящих матчей с бейджами команд
- 🎮 Иконки дисциплин (CS2, Dota 2, Valorant и др.)
- 🔍 Поиск по командам
- 🎯 Фильтрация по дисциплинам и турнирам
- ✏️ Редактирование матчей через модалку
- 🏟️ Турнирные бейджи с выравниванием

### Dashboard 2 - Рейтинг команд  
- 📊 Таблица команд с статистикой
- 🏅 Позиции, победы, поражения
- 📈 Winrate и метрики
- 👆 Интерактивные строки

### Dashboard 3 - Команды университетов
- 🎓 Команды с составами игроков
- 🎮 Фильтрация по дисциплинам 
- ✅ Фильтр полного состава (исключает переукомплектованных)
- � Модалки с детальным составом

## �📁 Структура проекта

```
winrate/
├── 📁 app/                    # Next.js App Router
│   ├── 📄 layout.tsx         # Корневой layout
│   ├── 📄 page.tsx           # Главная (редирект)
│   ├── 📁 dashboard-1/       # Дашборд матчей
│   ├── 📁 dashboard-2/       # Дашборд команд
│   └── 📁 dashboard-3/       # Дашборд университетов
├── 📁 components/            # React компоненты
│   ├── 📄 Header.tsx         # Навигация с 3 табами
│   ├── 📄 MatchList.tsx      # Список матчей
│   ├── 📄 MatchCard.tsx      # Карточка матча с бейджами
│   ├── 📄 TeamList.tsx       # Список университетских команд
│   ├── 📄 TeamCard.tsx       # Карточка команды с составом
│   ├── 📄 SearchInput.tsx    # Поиск
│   ├── 📄 TeamStatsTable.tsx # Таблица команд рейтинга
│   └── 📄 EditMatchModal.tsx # Модалка редактирования
├── 📁 lib/                   # Утилиты и данные
│   ├── 📄 emd-cloud.ts      # Инициализация EMD Cloud SDK
│   ├── 📄 api.ts            # API реэкспорт
│   ├── 📄 api/              # API модули (tournaments, team-stats)
│   ├── 📄 disciplines.ts    # Дисциплины и валидация составов
│   └── 📄 mockData.ts       # Генераторы mock данных
├── 📁 test/                  # Тест-скрипты
│   ├── 📄 test-sdk.js       # Тест EMD Cloud SDK
│   └── 📄 db-connection-test.js # Тест подключения
├── 📄 .env.local            # Конфиг EMD Cloud API
├── 📄 SDK-GUIDE.md          # Руководство по EMD Cloud SDK
├── 📄 package.json          # Зависимости
├── 📄 tailwind.config.ts    # Настройки Tailwind
└── 📄 tsconfig.json         # TypeScript конфиг
```



### 🗄️ EMD Cloud интеграция
- **EMD Cloud SDK** - официальный SDK для работы с базой данных
- **API Routes** - серверные эндпоинты через SDK
- **Модульная структура** - каждая сущность в отдельном файле (`lib/api/`)
- **Многоуровневое кэширование** - HTTP Cache + клиентский кэш (5 минут)
- **Типобезопасность** - TypeScript типы из SDK


### 🎨 Иконки дисциплин
- 10 игровых дисциплин с SVG иконками
- CS2, Dota 2, Valorant, Fortnite, MLBB, Standoff 2, Strinova, Warface, Калибр, Мир танков
- Автоматическая привязка через `disciplines.ts`

## 🛠️ Установка и запуск

```bash
# Установка зависимостей  
npm install

# Настройка .env.local
# EMD_API_TOKEN=your-token
# EMD_APP_ID=app-xxxxxxxx

# Тест SDK
node test/test-sdk.js

# Запуск в режиме разработки
npm run dev
```

📖 **Подробнее:** см. `SDK-GUIDE.md` - полное руководство по EMD Cloud SDK

## 🌐 Роуты

### Страницы:
- `/` → автоперенаправление на dashboard-1
- `/dashboard-1` → матчи и турниры 
- `/dashboard-2` → рейтинг команд
- `/dashboard-3` → команды университетов

### API Endpoints:
- `GET /api/tournaments` → список турниров через SDK (кэш 5 мин)
- `GET /api/team-stats` → статистика команд через SDK (кэш 5 мин)

## 🏗️ Архитектура API

### EMD Cloud SDK (`lib/emd-cloud.ts`):
```typescript
// Инициализация
import { emdCloud, COLLECTIONS } from '@/lib/emd-cloud';

// Работа с базой данных
const db = emdCloud.database(COLLECTIONS.TOURNAMENTS);
const rows = await db.getRows({ limit: 100, page: 0 });
```

### Клиентский API (`lib/api/`):
```typescript
// Импорт
import { getTournaments, getTeamStats } from '@/lib/api';

// Использование с кэшем
const tournaments = await getTournaments();
const stats = await getTeamStats();
```

### Кэширование:
1. **Клиентский кэш** (в памяти) - 5 минут
2. **HTTP Cache-Control** (браузер) - 5 минут  
3. **stale-while-revalidate** - еще 10 минут устаревших данных

### Безопасность:
- API токены EMD Cloud только на сервере
- Next.js API Routes как прокси
- SDK автоматически управляет авторизацией
- Очистка данных перед отправкой клиенту

### Переменные окружения:
```env
EMD_API_TOKEN=your-api-token
EMD_APP_ID=app-xxxxxxxx
TEAM_STATS_COLLECTION_ID=collection-id
TOURNAMENTS_COLLECTION_ID=collection-id
```

