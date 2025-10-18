# 📚 EMD Cloud SDK - Руководство по использованию

## 🚀 Установка

```bash
npm install @emd-cloud/sdk
```

## ⚙️ Настройка

### 1. Переменные окружения (`.env.local`)

```env
EMD_API_TOKEN=your-api-token
EMD_APP_ID=app-xxxxxxxx
TEAM_STATS_COLLECTION_ID=collection-id-1
TOURNAMENTS_COLLECTION_ID=collection-id-2
```

### 2. Инициализация SDK (`lib/emd-cloud.ts`)

```typescript
import { EmdCloud, AppEnvironment, AuthType } from '@emd-cloud/sdk';

const appId = process.env.EMD_APP_ID;
const apiToken = process.env.EMD_API_TOKEN;

if (!appId || !apiToken) {
  throw new Error('❌ Не установлены переменные окружения');
}

export const emdCloud = new EmdCloud({
  environment: AppEnvironment.Server,
  appId,
  apiToken,
  defaultAuthType: AuthType.ApiToken
});

export const COLLECTIONS = {
  TEAM_STATS: process.env.TEAM_STATS_COLLECTION_ID || '',
  TOURNAMENTS: process.env.TOURNAMENTS_COLLECTION_ID || '',
} as const;
```

---

## 📝 Использование в API Routes

### Пример: GET запрос с пагинацией

```typescript
import { NextResponse } from 'next/server';
import { emdCloud, COLLECTIONS } from '@/lib/emd-cloud';

// ⚠️ ВАЖНО: Отключаем Next.js кэш для больших данных (>2MB)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // Создаем экземпляр базы данных
    const db = emdCloud.database(COLLECTIONS.TOURNAMENTS);

    // Получаем данные
    const result = await db.getRows({
      limit: 100,
      page: 0,
      useHumanReadableNames: true
    });

    // Проверяем на ошибку
    if ('error' in result) {
      console.error('❌ Ошибка SDK:', result.error);
      return NextResponse.json(
        { error: 'Failed to fetch data' },
        { status: 500 }
      );
    }

    // Получаем массив данных
    const rows: any[] = Array.isArray(result) 
      ? result 
      : ('data' in result ? (result.data as any[]) : []);

    // Возвращаем с HTTP кэшированием (5 минут)
    return NextResponse.json(rows, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      }
    });

  } catch (error) {
    console.error('❌ Ошибка:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

## ⚠️ Частые ошибки и решения

### ❌ Ошибка: `Cannot convert undefined or null to object`

**Причина:** Передача пустых строк или массивов в параметрах.

**Неправильно:**
```typescript
await db.getRows({
  search: "",        // ❌ Пустая строка
  orderBy: "",       // ❌ Пустая строка
  sort: [],          // ❌ Пустой массив
  query: {           // ❌ Пустой объект
    $or: [],
    $and: []
  }
});
```

**Правильно:**
```typescript
await db.getRows({
  limit: 100,
  page: 0,
  useHumanReadableNames: true
  // Только нужные параметры!
});
```

---

### ❌ Ошибка: `Failed to set Next.js data cache, items over 2MB`

**Причина:** Next.js пытается кэшировать большие ответы (>2MB).

**Решение:** Отключить встроенный кэш Next.js:

```typescript
// В начале файла route.ts
export const dynamic = 'force-dynamic';
export const revalidate = 0;
```

---

### ❌ Ошибка: `authType не соответствует типу AuthType`

**Причина:** Передача строки вместо enum.

**Неправильно:**
```typescript
await db.getRows(options, { authType: 'api-token' }); // ❌
```

**Правильно:**
```typescript
// Вариант 1: Не передавать authType (используется defaultAuthType)
await db.getRows(options); // ✅

// Вариант 2: Использовать enum
import { AuthType } from '@emd-cloud/sdk';
await db.getRows(options, { authType: AuthType.ApiToken }); // ✅
```

---

## 📖 Все методы SDK

### 🔑 Auth методы (авторизация)

```typescript
// Проверить текущую авторизацию
await emdCloud.auth.authorization();

// Вход (email + password)
await emdCloud.auth.login({ 
  login: 'user@example.com', 
  password: 'password' 
});

// Регистрация
await emdCloud.auth.registration({
  firstName: 'John',
  lastName: 'Doe',
  login: 'user@example.com',
  password: 'password'
});

// Социальный вход (VK, Yandex)
const { url } = await emdCloud.auth.socialLogin({
  provider: SocialProvider.VK,
  redirectUrl: 'https://myapp.com/callback'
});
window.location.href = url;

// Обмен OAuth токена
await emdCloud.auth.exchangeOAuthToken('secret-from-callback');

// Восстановление пароля (шаг 1)
await emdCloud.auth.forgotPassword('user@example.com');

// Проверка кода восстановления (шаг 2)
await emdCloud.auth.forgotPasswordCheckCode({ 
  requestId: 'xxx', 
  code: '1234' 
});

// Смена пароля (шаг 3)
await emdCloud.auth.forgotPasswordChange({
  requestId: 'xxx',
  newPassword: 'newpass',
  newPasswordRepeat: 'newpass'
});

// Обновить данные пользователя
await emdCloud.auth.updateUser({
  firstName: 'Jane',
  avatarUrl: 'https://...',
  customFields: { role: 'admin' }
});

// Установить токен авторизации
emdCloud.setAuthToken('new-token');
```

---

### 👤 User методы (пользователи)

```typescript
// Получить список пользователей (для админов)
await emdCloud.user.getUserList({
  search: 'john',
  limit: 20,
  page: 0,
  orderBy: 'createdAt',
  sort: 'DESC'
});

// Получить детали пользователя
await emdCloud.user.getUserDetails('user-id');

// Привязать соцсеть (Steam, VK, Twitch)
const { url } = await emdCloud.user.attachSocialAccount({
  provider: SocialProvider.STEAM,
  redirectUrl: 'https://myapp.com/profile'
});

// Отвязать соцсеть
await emdCloud.user.detachSocialAccount(SocialProvider.STEAM);

// Обновить активность (онлайн статус)
await emdCloud.user.ping();
```

---

### 🗄️ Database методы

```typescript
const db = emdCloud.database('collection-id');

// Получить строки с пагинацией
await db.getRows({ 
  limit: 100, 
  page: 0,
  useHumanReadableNames: true 
});

// Получить одну строку
await db.getRow('row-id', { useHumanReadableNames: true });

// Создать строку
await db.createRow(
  { name: 'John', email: 'john@example.com' },
  { notice: 'Created via API' }
);

// Обновить строку
await db.updateRow(
  'row-id',
  { status: 'active' },
  { notice: 'Updated status' }
);

// Массовое обновление
await db.bulkUpdate({
  query: { "$and": [{ "data.status": { "$eq": "pending" } }] },
  data: { status: "active" },
  notice: "Bulk activation"
});

// Удалить строку
await db.deleteRow('row-id');

// Удалить несколько строк
await db.deleteRows(['row-id-1', 'row-id-2']);

// Подсчет строк
await db.countRows({ 
  query: { "$and": [{ "data.status": { "$eq": "active" } }] } 
});

// Триггер кнопки (custom workflow)
await db.triggerButton('row-id', 'button-column-id');
```

---

### 📤 Uploader методы (загрузка файлов)

```typescript
import { ReadPermission } from '@emd-cloud/sdk';

// Загрузить файл с прогрессом
const { file } = emdCloud.uploader.uploadFile(fileObject, {
  readPermission: ReadPermission.OnlyAuthUser,
  presignedUrlTTL: 120
}, {
  onProgress: (progress) => {
    console.log(`${progress.percentage}%`);
  },
  onSuccess: (fileId, fileUrl) => {
    console.log('Uploaded:', fileUrl);
  },
  onError: (error) => {
    console.error('Error:', error);
  }
});

// Получить URL файла
const url = emdCloud.uploader.getFileUrl('default', 'file-id');

// Получить метаданные файла
const metaUrl = emdCloud.uploader.getMetaUrl('default', 'file-id');

// Прервать загрузку
file.abort();
```

**ReadPermission типы:**
- `Public` - доступен всем
- `OnlyAuthUser` - только авторизованным
- `OnlyAppStaff` - только администраторам
- `OnlyPermittedUsers` - только указанным пользователям

---

### 🔗 Webhook методы

```typescript
// Вызвать webhook
await emdCloud.webhook.call(
  'webhook-id',
  {
    method: 'POST',
    body: { title: 'test', data: 123 }
  }
);
```

---

## 🔄 Пагинация (загрузка всех страниц)

```typescript
const allRows: any[] = [];
let page = 0;
let hasMore = true;

while (hasMore) {
  const result = await db.getRows({
    limit: 100,
    page: page,
    useHumanReadableNames: true
  });

  if ('error' in result) {
    break;
  }

  const rows: any[] = Array.isArray(result) 
    ? result 
    : ('data' in result ? (result.data as any[]) : []);

  allRows.push(...rows);
  console.log(`📄 Страница ${page + 1}: загружено ${rows.length} записей`);

  hasMore = rows.length === 100;
  page++;
}

console.log(`✅ Всего загружено: ${allRows.length} записей`);
```

---

## 💡 Best Practices

### 1. **Используйте `useHumanReadableNames: true`**
Получайте читаемые имена полей вместо `col_xxx`:
```typescript
{ name: "John", email: "john@example.com" }  // ✅
{ col_123: "John", col_456: "john@..." }     // ❌
```

### 2. **Кэшируйте на клиенте**
SDK не кэширует данные. Используйте свой кэш:
```typescript
let cache: any[] | null = null;
let timestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 минут

if (cache && (Date.now() - timestamp) < CACHE_DURATION) {
  return cache;
}
```

### 3. **Обрабатывайте ошибки**
Всегда проверяйте результат:
```typescript
if ('error' in result) {
  console.error('Ошибка:', result.error);
  return null;
}
```

### 4. **Не передавайте второй параметр callOptions**
SDK использует `defaultAuthType` из конфигурации:
```typescript
await db.getRows(options);  // ✅ Правильно
```

---

## 📦 Замена старого кода

### Было (fetch):
```typescript
const response = await fetch(url, {
  method: 'POST',
  headers: {
    'apitoken': apiToken,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ limit: 100, page: 0 })
});
const data = await response.json();
```

### Стало (SDK):
```typescript
const db = emdCloud.database(collectionId);
const result = await db.getRows({ limit: 100, page: 0 });
```

---

## 🔗 Полезные ссылки

- [NPM пакет](https://www.npmjs.com/package/@emd-cloud/sdk)
- [EMD Cloud Console](https://console.cloud.emd.one)
- [Документация API](https://api.emd.one)


**Версия SDK:** 1.10.3  
**Дата обновления:** 18 октября 2025
