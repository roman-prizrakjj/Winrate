import { EmdCloud, AppEnvironment, AuthType } from '@emd-cloud/sdk';
import { CaptainInfo } from '@/lib/types/captains';

const CAPTAIN_ROLE_ID = '36812ba6-b171-40c9-b608-f1514ef117e2';
const TEAM_FIELD = 'col_804ae65a8e';  // team
const ROLE_FIELD = 'col_18760881ff';  // role
const TELEGRAM_FIELD = 'col_3d293c0ccf';  // telegram

/**
 * Задержка выполнения
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry с экспоненциальной задержкой
 */
async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const isLastAttempt = attempt === retries - 1;
      
      if (isLastAttempt) {
        console.error(`[Captains Retry] Все попытки исчерпаны (${retries})`);
        throw error;
      }
      
      const delay = baseDelay * Math.pow(2, attempt);
      console.warn(`[Captains Retry] Попытка ${attempt + 1}/${retries} не удалась. Повтор через ${delay}ms...`);
      await sleep(delay);
    }
  }
  
  throw new Error('Unreachable');
}

/**
 * Загрузить всех капитанов команд
 */
export async function getAllCaptains(): Promise<Record<string, CaptainInfo>> {
  const client = new EmdCloud({
    environment: AppEnvironment.Server,
    appId: process.env.EMD_APP_ID!,
    apiToken: process.env.EMD_API_TOKEN!,
    defaultAuthType: AuthType.ApiToken,
  });

  const db = client.database(process.env.TEAMS_PARTICIPANTS_COLLECTION_ID!);
  
  const pageSize = parseInt(process.env.PAGE_SIZE || '100');
  const parallelRequests = parseInt(process.env.PARALLEL_REQUESTS_LIMIT || '10');
  
  const allRows: any[] = [];
  let batchNumber = 0;
  let hasMore = true;
  
  // Загружаем всех участников с параллельными запросами
  while (hasMore) {
    const startPage = batchNumber * parallelRequests;
    const promises = [];
    
    for (let i = 0; i < parallelRequests; i++) {
      const page = startPage + i;
      promises.push(
        fetchWithRetry(() => db.getRows({
          limit: pageSize,
          page: page,
          useHumanReadableNames: false
        }))
      );
    }
    
    const results = await Promise.allSettled(promises);
    
    // Пауза между батчами
    await sleep(500);
    
    let hasFullPage = false;
    let failedCount = 0;
    
    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        const rows = Array.isArray(result.value) ? result.value : ((result.value as any).data || []);
        if (rows.length > 0) {
          allRows.push(...rows);
          
          if (rows.length === pageSize) {
            hasFullPage = true;
          }
        }
      } else {
        failedCount++;
        console.error(`[Captains] Ошибка загрузки страницы:`, result.reason);
      }
    });
    
    // Если больше 50% запросов упали - останавливаемся
    if (failedCount > parallelRequests / 2) {
      console.error(`[Captains] Слишком много ошибок (${failedCount}/${parallelRequests}). Остановка.`);
      hasMore = false;
    } else {
      hasMore = hasFullPage;
    }
    
    batchNumber++;
  }
  
  // Создаём Map капитанов по teamId
  const captainsMap: Record<string, CaptainInfo> = {};
  
  allRows.forEach((participant) => {
    const roleId = participant.data?.[ROLE_FIELD];
    
    // Проверяем, является ли участник капитаном
    if (roleId === CAPTAIN_ROLE_ID) {
      const teamValue = participant.data?.[TEAM_FIELD];
      const teamId = typeof teamValue === 'object' ? teamValue?._id : teamValue;
      
      if (teamId) {
        captainsMap[teamId] = {
          nickname: participant.user?.customFields?.nickname || null,
          telegram: participant.data?.[TELEGRAM_FIELD] || participant.user?.customFields?.telegram_id || null,
        };
      }
    }
  });
  
  return captainsMap;
}
