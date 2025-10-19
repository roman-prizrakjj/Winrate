# Руководство по кэшированию

## 🔥 Для "горячих" данных (всегда актуальные)

### API Routes (Server-side)

```typescript
// app/api/your-route/route.ts

// 1. Отключить автоматическую оптимизацию Next.js
export const dynamic = 'force-dynamic';

// 2. Отключить revalidation кэш
export const revalidate = 0;

export async function GET() {
  // ... ваш код

  return NextResponse.json(data, {
    headers: {
      // 3. Запретить кэширование на всех уровнях
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
    }
  });
}
```

### Fetch на клиенте

```typescript
// В компоненте
const response = await fetch('/api/your-route', {
  cache: 'no-store' // Отключить кэш браузера
});
```

---

## ❄️ Для "холодных" данных (можно кэшировать)

### API Routes

```typescript
// Кэш на 5 минут
export const revalidate = 300;

return NextResponse.json(data, {
  headers: {
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
  }
});
```

### Fetch на клиенте

```typescript
// Кэшировать на 5 минут
const response = await fetch('/api/your-route', {
  next: { revalidate: 300 }
});
```

---

## 📋 Примеры из проекта

### 🔥 Горячие данные (без кэша):
- ✅ `/api/tournaments-list` - список турниров для создания этапов
- ✅ `/api/auth/*` - авторизация, проверка сессии

### ❄️ Холодные данные (с кэшем):
- `/api/tournaments` - список матчей (обновляется редко)
- Server Components с ISR (команды, лидерборд)

---

## ⚠️ Важно!

**Без этих настроек Next.js 14+ будет кэшировать всё автоматически!**

Даже если добавить `cache: 'no-store'` на клиенте, серверный кэш останется активным.

---

## 🔍 Как проверить:

1. Создайте запись в БД
2. Обновите страницу/откройте модалку
3. Если новая запись НЕ видна → добавьте настройки выше
