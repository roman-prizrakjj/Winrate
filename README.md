# 🏆 Winrate Dashboard

Аналитическая панель для университетских киберспортивных турниров с защищенной авторизацией через EMD Cloud.

## 🚀 Стек технологий

- **Next.js 14** - App Router, SSR, API Routes
- **TypeScript** - полная типобезопасность  
- **Tailwind CSS** - утилитарная стилизация
- **EMD Cloud SDK v1.10.3** - база данных, API и авторизация
- **React 18** - компонентная архитектура
- **JWT** - безопасное хранение сессий

## 🔐 Авторизация

### Система входа:
- 🔑 **Модальное окно авторизации** - появляется при первом заходе
- 👤 **EMD Cloud Authentication** - проверка пользователей через SDK
- 🍪 **HTTP-only Cookies** - безопасное хранение токенов (защита от XSS)
- 🔄 **Автоматическая проверка сессии** - при перезагрузке страницы
- 🚪 **Кнопка выхода** - в Header с информацией о пользователе
- ⚠️ **Обработка ошибок** - понятные сообщения при неверном логине/пароле

### Как работает:
1. При открытии сайта проверяется наличие токена в cookies
2. Если токена нет или он истек → показывается LoginModal
3. После успешного входа токен сохраняется на 7 дней
4. В Header отображается email (или nickname) и роль пользователя
5. Кнопка "Выход" удаляет токен и возвращает к форме входа

## ⚡ Функции

### 🏆 Команды (`/teams`)
- 🎓 Команды университетов с полными составами игроков
- 🎮 Фильтрация по дисциплинам 
- ✅ Фильтр по полному составу (исключает переукомплектованные)
- � Модальные окна с детальным составом
- 🔍 Поиск по названию команды или университету
- 📊 Статистика полных/неполных команд

### 🎮 Турниры (`/tournaments`)
- �📋 Список предстоящих матчей с бейджами команд
- � Иконки дисциплин (CS2, Dota 2, Valorant, Fortnite и др.)
- 🔍 Поиск по командам
- 🎯 Фильтрация по дисциплинам и турнирам
- ✏️ Редактирование матчей через модальное окно
- 🏟️ Турнирные бейджи

### 📊 Лидерборд (`/leaderboard`)
- � Таблица команд с рейтингом
- 🏅 Позиции, победы, поражения, ничьи
- � Процент побед (winrate)
- 👆 Интерактивные строки
- 🔄 Данные из EMD Cloud в реальном времени

## �📁 Структура проекта

```
winrate/
├── 📁 app/                      # Next.js App Router
│   ├── 📄 layout.tsx           # Root layout с AuthProvider
│   ├── 📄 page.tsx             # Главная (редирект на /teams)
│   ├── 📁 teams/               # 🏆 Команды университетов
│   │   └── 📄 page.tsx
│   ├── 📁 tournaments/         # 🎮 Турниры и матчи
│   │   └── 📄 page.tsx
│   ├── 📁 leaderboard/         # 📊 Рейтинг команд
│   │   └── � page.tsx
│   └── �📁 api/                 # API Routes (серверная логика)
│       ├── 📁 auth/            # Авторизация
│       │   ├── 📄 login/route.ts    # POST - вход через EMD Cloud
│       │   ├── 📄 check/route.ts    # GET - проверка токена
│       │   └── 📄 logout/route.ts   # POST - выход
│       ├── 📄 tournaments/route.ts  # GET - список турниров
│       └── 📄 team-stats/route.ts   # GET - статистика команд
├── 📁 components/              # React компоненты
│   ├── 📄 Header.tsx           # Навигация + инфо о пользователе
│   ├── 📄 LoginModal.tsx       # Модальное окно входа
│   ├── 📄 AuthGuard.tsx        # Защита маршрутов
│   ├── 📄 MatchList.tsx        # Список матчей
│   ├── 📄 MatchCard.tsx        # Карточка матча
│   ├── 📄 TeamList.tsx         # Список команд
│   ├── 📄 TeamCard.tsx         # Карточка команды (компактная)
│   ├── 📄 SearchInput.tsx      # Поиск
│   ├── 📄 TeamStatsTable.tsx   # Таблица лидерборда
│   └── 📄 EditMatchModal.tsx   # Редактирование матча
├── 📁 contexts/                # React Context
│   └── 📄 AuthContext.tsx      # Глобальное состояние авторизации
├── 📁 lib/                     # Утилиты и API
│   ├── 📄 emd-cloud.ts         # Инициализация EMD Cloud SDK
│   ├── 📄 api.ts               # API реэкспорт
│   ├── � api/                 # Модульная структура API
│   │   ├── 📄 tournaments.ts   # Клиентский API турниров
│   │   └── 📄 team-stats.ts    # Клиентский API статистики
│   ├── 📄 disciplines.ts       # Дисциплины и валидация
│   └── 📄 mockData.ts          # Генераторы тестовых данных
├── 📁 test/                    # Тест-скрипты
│   ├── 📄 test-sdk.js          # Тест EMD Cloud SDK
│   ├── 📄 test-login.js        # Тест авторизации
│   └── 📄 db-connection-test.js # Тест подключения к БД
├── 📄 .env.local               # Переменные окружения (НЕ коммитить!)
├── 📄 SDK-GUIDE.md             # Полное руководство по SDK
├── 📄 API-INTEGRATION.md       # Документация API интеграции
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


### 🎨 Дисциплины
Поддерживаются 10 киберспортивных дисциплин с SVG иконками:
- **CS2** - Counter-Strike 2 (5 игроков)
- **Dota 2** (5 игроков)
- **Valorant** (5 игроков)
- **Fortnite** (3 игрока)
- **Mobile Legends** (5 игроков)
- **Standoff 2** (5 игроков)
- **Strinova** (5 игроков)
- **Warface** (5 игроков)
- **Калибр** (4 игрока)
- **Мир танков** (7 игроков)

Автоматическая валидация составов команд через `lib/disciplines.ts`.

## 🔑 Роли пользователей

Система поддерживает роли из `customFields.role` в EMD Cloud:
- **player** - игрок (по умолчанию)
- **admin** - администратор
- **coach** - тренер
- **organizer** - организатор

Роль отображается в Header под email/nickname пользователя.

## 🛠️ Установка и запуск

### 1. Установка зависимостей:
```bash
npm install
```

### 2. Настройка переменных окружения:
Создайте файл `.env.local` в корне проекта:
```env
EMD_API_TOKEN=your-api-token
EMD_APP_ID=app-xxxxxxxx
TEAM_STATS_COLLECTION_ID=collection-id-1
TOURNAMENTS_COLLECTION_ID=collection-id-2
```


### 4. Запуск dev сервера:
```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

### 5. Первый вход:
- При открытии сайта появится модальное окно входа
- Введите email и пароль пользователя из EMD Cloud
- После успешного входа откроется страница команд

📖 **Документация:**
- `SDK-GUIDE.md` - полное руководство по EMD Cloud SDK (27 методов)

## 🌐 Роуты

### 🔒 Защищенные страницы (требуют авторизации):
- `/` → автоперенаправление на `/teams`
- `/teams` → 🏆 команды университетов с составами
- `/tournaments` → 🎮 турниры и матчи 
- `/leaderboard` → 📊 рейтинг команд

### 🔓 Публичные API Endpoints:
- `POST /api/auth/login` → вход через EMD Cloud
- `GET /api/auth/check` → проверка сессии (JWT)
- `POST /api/auth/logout` → выход из системы

### 🔐 Защищенные API Endpoints:
- `GET /api/tournaments` → список турниров (кэш 5 мин)
- `GET /api/team-stats` → статистика команд (кэш 5 мин)

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

### Переменные окружения (`.env.local`):
```env
# EMD Cloud API (обязательно)
EMD_API_TOKEN=your-api-token-here
EMD_APP_ID=app-xxxxxxxx

# ID коллекций MongoDB (обязательно)
TEAM_STATS_COLLECTION_ID=10f7cfbb-xxxx-xxxx-xxxx-xxxxxxxxxxxx
TOURNAMENTS_COLLECTION_ID=b9b00030-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

⚠️ **Важно:** Файл `.env.local` добавлен в `.gitignore` и не должен попадать в репозиторий!

