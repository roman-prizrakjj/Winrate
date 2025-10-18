// Конфигурация и инициализация EMD Cloud SDK
import { EmdCloud, AppEnvironment, AuthType } from '@emd-cloud/sdk';

// Проверяем наличие обязательных переменных окружения
const appId = process.env.EMD_APP_ID;
const apiToken = process.env.EMD_API_TOKEN;

if (!appId) {
  throw new Error('❌ EMD_APP_ID не установлен в переменных окружения');
}

if (!apiToken) {
  throw new Error('❌ EMD_API_TOKEN не установлен в переменных окружения');
}

// Создаем и экспортируем единственный экземпляр SDK
export const emdCloud = new EmdCloud({
  environment: AppEnvironment.Server,
  appId,
  apiToken,
  defaultAuthType: AuthType.ApiToken
});

// Экспортируем типы для удобства
export { AuthType } from '@emd-cloud/sdk';

// Константы ID коллекций
export const COLLECTIONS = {
  TEAM_STATS: process.env.TEAM_STATS_COLLECTION_ID || '',
  TOURNAMENTS: process.env.TOURNAMENTS_COLLECTION_ID || '',
} as const;

// Проверяем наличие ID коллекций
if (!COLLECTIONS.TEAM_STATS) {
  console.warn('⚠️ TEAM_STATS_COLLECTION_ID не установлен');
}

if (!COLLECTIONS.TOURNAMENTS) {
  console.warn('⚠️ TOURNAMENTS_COLLECTION_ID не установлен');
}

console.log('✅ EMD Cloud SDK инициализирован');
