# 🔌 API Integration Guide

Руководство по интеграции реальных данных вместо mock данных.

## 🎯 Текущее состояние

**Mock данные → Реальные API**

### Dashboard 1 - Матчи
- ❌ `mockMatches` в `dashboard-1/page.tsx`
- ✅ Готов к интеграции через `lib/api.ts`

### Dashboard 2 - Команды  
- ❌ `mockTeams` в `dashboard-2/page.tsx`
- ✅ Готов к интеграции через `lib/api.ts`

## 🚀 План интеграции

### 1️⃣ API Endpoints

```typescript
// Необходимые endpoints
GET /api/matches              // Список матчей
PUT /api/matches/:id          // Редактирование матча
GET /api/teams                // Рейтинг команд
GET /api/teams/:id            // Детали команды
```

### 2️⃣ Типы данных

```typescript
// Реальные интерфейсы
interface Match {
  id: string;
  team1: Team;
  team2: Team;
  tournament: Tournament;
  startTime: Date;
  status: 'upcoming' | 'live' | 'finished';
}

interface TeamStats {
  id: string;
  name: string;
  avatar?: string;
  wins: number;
  losses: number;
  // ... остальные поля
}
```

### 3️⃣ Замена mock данных

**Dashboard 1:**
```typescript
// Заменить в dashboard-1/page.tsx
const fetchData = async () => {
  const response = await api.getMatches();
  setData({ matches: response.data });
};
```

**Dashboard 2:**
```typescript
// Заменить в dashboard-2/page.tsx  
const fetchData = async () => {
  const response = await api.getTeams();
  setData({ teams: response.data });
};
```

## ⚡ Динамическое количество

### Матч-карты
- **Любое количество** → автоматический рендер
- **0 матчей** → сообщение "Нет данных"
- **100+ матчей** → добавить пагинацию

### Строки команд
- **Любое количество** → автоматический рендер  
- **Большие списки** → виртуализация

## 🔄 Обновления в реальном времени

### WebSocket интеграция
```typescript
// Real-time обновления
useEffect(() => {
  const ws = new WebSocket('ws://api/live');
  ws.onmessage = (event) => {
    const update = JSON.parse(event.data);
    updateMatchStatus(update);
  };
}, []);
```

### Polling обновления
```typescript
// Периодическое обновление
useEffect(() => {
  const interval = setInterval(fetchData, 30000);
  return () => clearInterval(interval);
}, []);
```

## 📊 Оптимизация

### Пагинация
```typescript
const [pagination, setPagination] = useState({
  page: 1,
  limit: 20,
  total: 0
});
```

### Кэширование
```typescript
// React Query / SWR
const { data, error, mutate } = useSWR('/api/matches', fetcher);
```

### Поиск на сервере
```typescript
// Дебаунс + API поиск
const debouncedSearch = useDebounce(searchQuery, 500);
useEffect(() => {
  if (debouncedSearch) {
    api.searchMatches(debouncedSearch);
  }
}, [debouncedSearch]);
```

## 🛠️ Готовые точки интеграции

### lib/api.ts
- ✅ Axios настроен
- ✅ Базовый URL
- ✅ Error handling
- ❌ Добавить реальные методы

### Компоненты
- ✅ MatchList → любое количество матчей
- ✅ TeamStatsTable → любое количество команд  
- ✅ Loading states готовы
- ✅ Error handling готов

### State management
- ✅ useState для данных
- ✅ Loading/Error states
- ❌ Добавить React Query (опционально)

## 🎯 Следующие шаги

1. **Создать API endpoints** на бэкенде
2. **Обновить lib/api.ts** с реальными методами
3. **Заменить mock данные** в дашбордах
4. **Добавить пагинацию** для больших списков
5. **Настроить real-time** обновления

**Код готов к интеграции** - нужно только подключить реальный API! 🚀