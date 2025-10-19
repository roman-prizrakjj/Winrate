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
- 🎓 **Реальные данные** из EMD Cloud - 1164+ команд, 4387+ игроков
- 📝 **Короткие названия школ** - автоматически через `shortName` (ГБОУ №2127)
- 🎮 **Фильтрация по дисциплинам** - Counter-Strike 2, Dota 2, Valorant и др.
- ✅ **Фильтр по составу** - только полные команды (исключает переукомплектованные)
- 🔎 **Модальные окна** - детальный просмотр состава с ролями игроков
- 🔍 **Быстрый поиск** - по названию команды, школе или игрокам
- 📊 **Статистика** - счетчик полных/неполных составов в реальном времени
- ⚡ **ISR кэширование** - данные обновляются каждые 10 минут
- 🎨 **Loading индикатор** - крутящееся колесо при первой загрузке

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
│   │   ├── 📄 page.tsx         # Server Component (ISR)
│   │   ├── 📄 loading.tsx      # Loading индикатор
│   │   └── 📄 TeamsPageClient.tsx  # Client Component (фильтры)
│   ├── 📁 tournaments/         # 🎮 Турниры и матчи
│   │   └── 📄 page.tsx
│   ├── 📁 leaderboard/         # 📊 Рейтинг команд
│   │   ├── 📄 page.tsx         # Server Component (ISR)
│   │   ├── 📄 loading.tsx      # Loading индикатор
│   │   └── 📄 LeaderboardClient.tsx  # Client Component (интерактив)
│   └── 📁 api/                 # API Routes (серверная логика)
│       ├── 📁 auth/            # Авторизация
│       │   ├── 📄 login/route.ts    # POST - вход через EMD Cloud
│       │   ├── 📄 check/route.ts    # GET - проверка токена
│       │   └── 📄 logout/route.ts   # POST - выход
│       └── � tournaments/     # Турниры (единственный оставшийся)
│           └── 📄 route.ts     # GET - список турниров
├── 📁 components/              # React компоненты
│   ├── 📄 Header.tsx           # Навигация + инфо о пользователе
│   ├── 📄 LoginModal.tsx       # Модальное окно входа
│   ├── 📄 AuthGuard.tsx        # Защита маршрутов
│   ├── 📄 TeamList.tsx         # Список команд
│   ├── 📄 TeamCard.tsx         # Карточка команды с модалкой игроков
│   ├── 📄 TeamStatsTable.tsx   # Таблица лидерборда
│   ├── 📄 MatchList.tsx        # Список матчей (турниры)
│   ├── 📄 MatchCard.tsx        # Карточка матча (турниры)
│   └── 📄 SearchInput.tsx      # Поиск (турниры)
├── 📁 contexts/                # React Context
│   └── 📄 AuthContext.tsx      # Глобальное состояние авторизации
├── 📁 lib/                     # Утилиты и API
│   ├── 📄 emd-cloud.ts         # Инициализация EMD Cloud SDK
│   ├── � api/                 # Клиентские API (только турниры)
│   │   ├── � index.ts         # Реэкспорт
│   │   └── 📄 tournaments.ts   # Клиентский API турниров
│   ├── � services/            # SDK сервисы (Server-side)
│   │   └── 📄 teams.ts         # Загрузка команд/игроков через SDK
│   ├── 📁 adapters/            # Адаптеры данных
│   │   └── 📄 teams.ts         # SDK → Component формат
│   ├── 📁 types/               # TypeScript типы
│   │   └── 📄 teams.ts         # Team, Player, TeamsResponse
│   ├── 📁 utils/               # Утилиты
│   │   └── 📄 teams.ts         # Фильтрация, статусы команд
│   ├── 📄 disciplines.ts       # Дисциплины и валидация
│   └── 📄 mockData.ts          # Генераторы тестовых данных (турниры)
├── 📄 .env.local               # Переменные окружения (НЕ коммитить!)
├── 📄 .env.example             # Шаблон переменных окружения
├── 📄 README.md                # Документация проекта
├── 📄 SDK-GUIDE.md             # Полное руководство по SDK
├── 📄 package.json             # Зависимости
├── 📄 tailwind.config.ts       # Настройки Tailwind
└── 📄 tsconfig.json            # TypeScript конфиг
├── 📄 .env.local               # Переменные окружения (НЕ коммитить!)
├── 📄 SDK-GUIDE.md             # Полное руководство по SDK
├── 📄 package.json          # Зависимости
├── 📄 tailwind.config.ts    # Настройки Tailwind
└── 📄 tsconfig.json         # TypeScript конфиг
```



### 🗄️ EMD Cloud интеграция
- **EMD Cloud SDK v1.10.3** - официальный SDK для работы с базой данных
- **Server Components** - прямые запросы к SDK на сервере (без API routes)
- **ISR (Incremental Static Regeneration)** - автообновление через `REVALIDATE_TIME` (по умолчанию 10 минут)
- **useHumanReadableNames** - автоматическая подгрузка связанных данных (shortName, дисциплины)
- **Пагинация** - загрузка больших данных порциями по 100 записей
- **Модульная структура** - разделение на services, adapters, types, utils
- **Типобезопасность** - полная типизация через TypeScript


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
- **player** - игрок (по умолчанию)
- **Captain** - администратор
- **substitute** - тренер

Роль отображается в Header под email/nickname пользователя.  тут только админ и пока не реализовано

## 🛠️ Установка и запуск

### 1. Установка зависимостей:
```bash
npm install
```

### 2. Настройка переменных окружения:
Скопируйте `.env.example` в `.env.local` и заполните своими значениями:
```bash
cp .env.example .env.local
```

Или создайте вручную `.env.local` со структурой из `.env.example`.

### 3. Запуск dev сервера:
```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

### 4. Первый вход:
- При открытии сайта появится модальное окно входа
- Введите email и пароль пользователя из EMD Cloud
- После успешного входа откроется страница команд

📖 **Документация:**
- `SDK-GUIDE.md` - полное руководство по EMD Cloud SDK (27 методов)

## 🌐 Роуты

### 🔒 Защищенные страницы (требуют авторизации):
- `/` → автоперенаправление на `/teams`
- `/teams` → 🏆 команды университетов с составами (ISR)
- `/tournaments` → 🎮 турниры и матчи 
- `/leaderboard` → 📊 рейтинг команд по турнирам (ISR)

### 🔓 Публичные API Endpoints:
- `POST /api/auth/login` → вход через EMD Cloud
- `GET /api/auth/check` → проверка сессии (JWT)
- `POST /api/auth/logout` → выход из системы

### ⚙️ Устаревшие API (не используются):
- `GET /api/tournaments` → используется только на странице `/tournaments`

## 🏗️ Архитектура

### 🔄 ISR Pattern (команды + лидерборд):
```typescript
// Server Component (revalidate: REVALIDATE_TIME) → SDK Service (пагинация + useHumanReadableNames) → DB
// Кэш: первый запрос ~20 сек, последующие <50ms, обновление в фоне через env
```

### 📊 HTTP Cache (турниры):
```typescript
// Client Component → API Route (Cache-Control) → SDK → DB
// Кэш: 5 минут клиент + 5 минут браузер + 10 минут stale
```

### Переменные окружения (`.env.local`):
```env
# EMD Cloud API (обязательно)
EMD_API_TOKEN=your-api-token-here
EMD_APP_ID=app-xxxxxxxx

# ISR Cache Settings (опционально)
REVALIDATE_TIME=600  # 10 минут по умолчанию

# ID коллекций MongoDB (обязательно)
TEAM_STATS_COLLECTION_ID=10f7cfbb-xxxx-xxxx-xxxx-xxxxxxxxxxxx
TOURNAMENTS_COLLECTION_ID=b9b00030-xxxx-xxxx-xxxx-xxxxxxxxxxxx
TEAMS_COLLECTION_ID=a8013391-xxxx-xxxx-xxxx-xxxxxxxxxxxx
TEAMS_PARTICIPANTS_COLLECTION_ID=fcf579f0-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

⚠️ **Важно:** Файл `.env.local` добавлен в `.gitignore` и не должен попадать в репозиторий!

