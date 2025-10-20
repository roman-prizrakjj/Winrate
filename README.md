# 🏆 Winrate Dashboard

Аналитическая панель для университетских киберспортивных турниров с защищенной авторизацией через EMD Cloud.

## 🚀 Стек технологий

- **Next.js 14** - App Router, Server Actions, ISR
- **TypeScript** - полная типобезопасность  
- **Tailwind CSS** - утилитарная стилизация
- **EMD Cloud SDK v1.10.3** - база данных, API и авторизация
- **React 18** - компонентная архитектура

## 📚 Документация

- **[SDK-GUIDE.md](./SDK-GUIDE.md)** - полное руководство по EMD Cloud SDK (27 методов)
- **[API-INTEGRATION.md](./API-INTEGRATION.md)** - интеграция с EMD Cloud API
- **[docs/hardcoded-references.md](./docs/hardcoded-references.md)** - справочники (статусы турниров/этапов, механики, дивизионы, дисциплины)

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
- 🎮 **Фильтрация по дисциплинам** - Counter-Strike 2, Dota 2, Valorant и др.
- ✅ **Фильтр по составу** - только полные команды
- 🔎 **Модальные окна** - детальный просмотр состава с ролями игроков
- 🔍 **Быстрый поиск** - по названию команды, школе или игрокам
- ⚡ **ISR кэширование** - данные обновляются каждые 10 минут

### 🎮 Турниры (`/tournaments`)
- 📋 Список предстоящих матчей с бейджами команд
- 🎯 Иконки дисциплин (CS2, Dota 2, Valorant, Fortnite и др.)
- 🔍 Поиск по командам
- 🎯 Фильтрация по дисциплинам и турнирам
- ✏️ Редактирование матчей через модальное окно

### 📊 Лидерборд (`/leaderboard`)
- 📈 Таблица команд с рейтингом
- 🏅 Позиции, победы, поражения, ничьи
- 📊 Процент побед (winrate)
- ⚡ ISR кэширование

### ➕ Создание (`/create`)
- 🏆 **Создание турниров** - модальная форма через Server Actions
- 📊 **Создание этапов** - привязка к турниру, механика (Швейцарская/Single/Double)
- 🎯 **Создание туров** - каскадные селекты (турнир → этап → тур), даты начала/окончания
- 🔄 **Каскадная загрузка** - турниры → этапы → тур с динамической фильтрацией
- 📋 **Справочники** - статусы, дивизионы, дисциплины, механики (захардкожены)
- ✅ **Валидация** - обязательные поля + проверка дат (окончание > начала)
- 🎨 **Кастомные иконки** - SVG иконки для кнопок создания
- 📋 **Список этапов** - отображение всех этапов с фильтрами (ISR 60 сек)
- 🔍 **Фильтрация этапов** - по турниру, статусу, поиск по названию
- 🔄 **Кнопка обновления** - принудительное обновление списка этапов
- ✏️ **Изменение статуса** - обновление статуса этапа через dropdown (оптимистичное обновление)

## 📁 Структура проекта

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
│   ├── 📁 leaderboard/         # 📊 Рейтинг команд (ISR)
│   ├── 📁 create/              # ➕ Создание турниров/этапов/туров
│   │   ├── � page.tsx         # Server Component (ISR 60 сек)
│   │   └── 📄 CreateButtonsSection.tsx  # Кнопки создания
│   ├── �📁 actions/             # Server Actions
│   │   ├── 📄 tournament.ts    # Создание турниров
│   │   ├── 📄 stage.ts         # Создание этапов
│   │   ├── 📄 tour.ts          # Создание туров
│   │   └── � update-stage-status.ts  # Обновление статуса этапа
│   └── �📁 api/                 # API Routes
│       ├── 📁 auth/            # Авторизация (login/check/logout)
│       ├── 📁 tournaments-list/ # Список турниров для селекта
│       └── 📁 tournaments/     # Турниры (устаревшее)
├── 📁 components/              # React компоненты
│   ├── 📄 Header.tsx           # Навигация + инфо о пользователе
│   ├── 📄 LoginModal.tsx       # Модальное окно входа
│   ├── 📄 CreateTournamentModal.tsx  # Создание турниров
│   ├── 📄 CreateStageModal.tsx # Создание этапов
│   ├── 📄 CreateTourModal.tsx  # Создание туров (каскадные селекты)
│   ├── 📄 StagesSection.tsx    # Список этапов с фильтрами
│   ├── 📄 StageList.tsx        # Список карточек этапов
│   ├── 📄 StageCard.tsx        # Карточка этапа с редактированием статуса
│   ├── 📄 TeamCard.tsx         # Карточка команды с модалкой игроков
│   └── ...                     # Другие компоненты
├── 📁 contexts/                # React Context
│   └── 📄 AuthContext.tsx      # Глобальное состояние авторизации
├── 📁 lib/                     # Утилиты и API
│   ├── 📄 emd-cloud.ts         # Инициализация EMD Cloud SDK
│   ├── 📄 statuses.ts          # Статусы турниров (захардкожены)
│   ├── 📄 stage-statuses.ts    # Статусы этапов (захардкожены)
│   ├── 📄 stage-mechanics.ts   # Механики этапов (захардкожены)
│   ├── 📄 divisions.ts         # Дивизионы (захардкожены)
│   ├── 📄 disciplines.ts       # Дисциплины и валидация (захардкожены)
│   ├── 📄 tournament-fields.ts # Маппинг полей турниров (читаемые ↔ col_xxx)
│   ├── 📄 stage-fields.ts      # Маппинг полей этапов (читаемые ↔ col_xxx)
│   ├── � tour-fields.ts       # Маппинг полей туров (читаемые ↔ col_xxx)
│   ├── �📁 types/               # TypeScript типы
│   │   ├── 📄 teams.ts         # Team, Player, TeamsResponse
│   │   ├── 📄 tournament.ts    # TournamentFormData, TournamentCreatePayload
│   │   ├── 📄 stage.ts         # StageFormData, StageCreatePayload
│   │   ├── 📄 stages.ts        # Stage (для отображения списка)
│   │   └── 📄 tour.ts          # TourFormData, TourCreatePayload
│   ├── 📁 utils/               # Утилиты
│   │   ├── 📄 teams.ts         # Фильтрация, статусы команд
│   │   ├── 📄 tournament-helpers.ts  # Валидация, маппинг турниров
│   │   ├── 📄 stage-helpers.ts # Валидация, маппинг этапов
│   │   └── 📄 tour-helpers.ts  # Валидация, маппинг туров
│   ├── 📁 services/            # SDK сервисы (Server-side)
│   │   ├── 📄 teams.ts         # Загрузка команд/игроков через SDK
│   │   └── � stages.ts        # Загрузка этапов через SDK
│   └── �📁 adapters/            # Адаптеры данных
│       ├── 📄 teams.ts         # SDK → Component формат
│       └── 📄 stages.ts        # SDK → Component формат (этапы)
├── 📁 public/                  # Статические файлы
│   └── 📁 icons/               # Иконки
│       ├── 📁 disciplines/     # SVG иконки дисциплин (CS2, Dota 2 и др.)
│       └── 📁 create/          # SVG иконки для страницы создания
│           ├── 📄 tournaments.svg  # Иконка турниров
│           ├── 📄 stages.svg       # Иконка этапов
│           └── 📄 tour.svg         # Иконка туров
├── 📁 docs/                    # Документация
│   └── 📄 hardcoded-references.md  # Отчет о захардкоженных справочниках
├── 📁 test/                    # Тестовые скрипты
│   ├── 📁 turnament/           # Тесты создания турниров
│   │   ├── 📄 create-tournament.js  # Скрипт создания через SDK
│   │   └── 📄 info.md          # Справка по статусам
│   └── 📁 stage_tur/           # Тесты создания этапов
│       ├── 📄 create-stage.js  # Скрипт создания через SDK
│       ├── 📄 info.md          # Справка по полям
│       ├── 📄 status.md        # Статусы этапов
│       └── 📄 mechanic.md      # Механики этапов
├── 📄 .env.local               # Переменные окружения (НЕ коммитить!)
├── 📄 .env.example             # Шаблон переменных окружения
├── 📄 README.md                # Документация проекта
├── 📄 SDK-GUIDE.md             # Полное руководство по SDK
├── 📄 API-INTEGRATION.md       # Интеграция с EMD Cloud API
├── 📄 package.json             # Зависимости
├── 📄 tailwind.config.ts       # Настройки Tailwind
└── 📄 tsconfig.json            # TypeScript конфиг
```



### 🗄️ EMD Cloud интеграция
- **EMD Cloud SDK v1.10.3** - официальный SDK для работы с базой данных
- **Server Components** - прямые запросы к SDK на сервере (ISR)
- **Server Actions** - создание турниров через `'use server'`
- **ISR кэширование** - автообновление через `REVALIDATE_TIME` (10 минут)
- **Технические поля** - маппинг `col_xxx` ↔ читаемые имена
- **Захардкоженные справочники** - статусы, дивизионы, дисциплины
- **Типобезопасность** - полная типизация через TypeScript


### 🎨 Дисциплины
Поддерживаются 11 киберспортивных дисциплин с SVG иконками:
- **CS2** - Counter-Strike 2 (5 игроков)
- **Dota 2** (5 игроков)
- **Valorant** (5 игроков)
- **Fortnite** (3 игрока)
- **Mobile Legends** (5 игроков)
- **Standoff 2** (5 игроков)
- **Strinova** (5 игроков)
- **Warface** (5 игроков)
- **Калибр** (4 игрока)
- **Мир танков** - Стальной охотник (7 игроков)
- **Мир танков 3x3** (3 игрока)

Автоматическая валидация составов команд через `lib/disciplines.ts`.

## 🔑 Роли пользователей
- **Captain** - администратор (полный доступ)
- **player** - игрок (только просмотр)
- **substitute** - тренер (просмотр + ограниченное редактирование)

Роль отображается в Header под email/nickname пользователя.

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
- `/create` → ➕ создание турниров через Server Actions

### 🔓 Публичные API Endpoints:
- `POST /api/auth/login` → вход через EMD Cloud
- `GET /api/auth/check` → проверка сессии (JWT)
- `POST /api/auth/logout` → выход из системы

### ⚙️ Server Actions (рекомендуемый подход):
- `createTournament()` → создание турниров через `app/actions/tournament.ts`
- `createStage()` → создание этапов через `app/actions/stage.ts`
- `createTour()` → создание туров через `app/actions/tour.ts`
- `updateStageStatus()` → обновление статуса этапа через `app/actions/update-stage-status.ts`

### 🔄 Динамические API:
- `GET /api/tournaments-list` → список турниров для селекта этапов
- `GET /api/stages-list?tournamentId=xxx` → список этапов для каскадных селектов туров

### 📦 Устаревшие API (постепенно заменяются):
- `GET /api/tournaments` → используется на `/tournaments` (мигрирует на Server Components)

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
STAGES_COLLECTION_ID=52aa4e2d-xxxx-xxxx-xxxx-xxxxxxxxxxxx
TOURS_COLLECTION_ID=4afef67e-xxxx-xxxx-xxxx-xxxxxxxxxxxx
TEAMS_COLLECTION_ID=a8013391-xxxx-xxxx-xxxx-xxxxxxxxxxxx
TEAMS_PARTICIPANTS_COLLECTION_ID=fcf579f0-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

⚠️ **Важно:** Файл `.env.local` добавлен в `.gitignore` и не должен попадать в репозиторий!

