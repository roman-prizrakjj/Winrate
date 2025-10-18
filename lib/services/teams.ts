/**
 * Сервис для работы с командами через @emd-cloud/sdk
 */

import { EmdCloud, AppEnvironment, AuthType } from '@emd-cloud/sdk';
import type { Team, Player, PlayerRole } from '@/lib/types/teams';

// Маппинг ID ролей на читаемые названия
const ROLE_MAPPING: Record<string, PlayerRole> = {
  '36812ba6-b171-40c9-b608-f1514ef117e2': 'captain',
  'cb0494c5-992d-4789-aa2f-58c7fb3e120f': 'player',
  'c18c129d-0386-4016-a2d1-93850f5da4d4': 'substitute',
};

// ID коллекций из .env.local
const TEAMS_COLLECTION_ID = process.env.TEAMS_COLLECTION_ID!;
const TEAMS_PARTICIPANTS_COLLECTION_ID = process.env.TEAMS_PARTICIPANTS_COLLECTION_ID!;

/**
 * Инициализация SDK клиента
 */
function createSDKClient() {
  return new EmdCloud({
    environment: AppEnvironment.Server,
    appId: process.env.EMD_APP_ID!,
    apiToken: process.env.EMD_API_TOKEN!,
    defaultAuthType: AuthType.ApiToken,
  });
}

/**
 * Загрузка всех команд с пагинацией
 */
async function getAllTeams(client: EmdCloud): Promise<any[]> {
  const db = client.database(TEAMS_COLLECTION_ID);
  const teams: any[] = [];
  let page = 0;
  const limit = 100;
  let hasMore = true;

  while (hasMore) {
    const result = await db.getRows({
      limit,
      page,
      useHumanReadableNames: true,
      // @ts-ignore - Отключаем Next.js fetch cache для больших ответов
      cache: 'no-store',
    });

    // Проверка на ошибку или пустой массив
    if (!Array.isArray(result) || result.length === 0) {
      hasMore = false;
    } else {
      teams.push(...result);
      page++;
      
      // Если получили меньше чем limit, значит это последняя страница
      if (result.length < limit) {
        hasMore = false;
      }
    }
  }

  return teams;
}

/**
 * Загрузка всех участников команд с пагинацией
 */
async function getAllParticipants(client: EmdCloud): Promise<any[]> {
  const db = client.database(TEAMS_PARTICIPANTS_COLLECTION_ID);
  const participants: any[] = [];
  let page = 0;
  const limit = 100;
  let hasMore = true;

  while (hasMore) {
    const result = await db.getRows({
      limit,
      page,
      useHumanReadableNames: true,
      // @ts-ignore - Отключаем Next.js fetch cache для больших ответов
      cache: 'no-store',
    });

    // Проверка на ошибку или пустой массив
    if (!Array.isArray(result) || result.length === 0) {
      hasMore = false;
    } else {
      participants.push(...result);
      page++;
      
      // Если получили меньше чем limit, значит это последняя страница
      if (result.length < limit) {
        hasMore = false;
      }
    }
  }

  return participants;
}

/**
 * Преобразование данных команды
 */
function transformTeam(team: any): Partial<Team> & { participantIds: string[] } {
  const division = team.data?.division?.data;
  const educationalOrg = team.data?.educational_organization?.data;
  const discipline = team.data?.discipline?.data;
  
  // Извлекаем ID участников из массива teams_participants
  const participantIds = (team.data?.teams_participants || [])
    .map((p: any) => p._id || p)
    .filter(Boolean);

  return {
    id: team._id,
    name: team.data?.name || 'Без названия',
    school: educationalOrg?.shortName || educationalOrg?.name || null,
    discipline: discipline?.name || null,
    division: division?.name || null,
    divisionId: division?._id || null,
    playersCount: 0,
    players: [],
    participantIds, // Добавляем ID участников
  };
}

/**
 * Преобразование данных участника
 */
function transformParticipant(participant: any): Player {
  // Структура как в тестовом скрипте
  const user = participant.user || {};
  const customFields = user.customFields || {};
  const roleId = participant.data?.role || null;

  return {
    id: participant._id,
    userId: user._id || 'unknown',
    nickname: customFields.nickname || 'Без ника',
    telegram: customFields.telegram_id || null,
    role: ROLE_MAPPING[roleId] || 'unknown',
    roleId: roleId || 'unknown',
  };
}

/**
 * Объединение команд с участниками
 */
function mergeTeamsWithPlayers(teams: any[], participants: any[]): Team[] {
  console.log('[SDK Service] Создание индекса участников...');
  
  // Создаем Map для быстрого поиска участников по ID (как в тестовом скрипте)
  const participantsMap = new Map<string, any>();
  participants.forEach((participant) => {
    participantsMap.set(participant._id, participant);
  });
  
  console.log(`[SDK Service] Индекс участников создан: ${participantsMap.size} записей`);

  // Объединяем команды с участниками (как в тестовом скрипте)
  const result = teams.map((team) => {
    const transformed = transformTeam(team);
    
    // Находим участников по ID из массива participantIds команды
    const players = transformed.participantIds
      ?.map(id => participantsMap.get(id))
      .filter(Boolean)
      .map(transformParticipant) || [];

    return {
      id: transformed.id,
      name: transformed.name,
      school: transformed.school,
      discipline: transformed.discipline,
      division: transformed.division,
      divisionId: transformed.divisionId,
      playersCount: players.length,
      players,
    } as Team;
  });

  // Статистика по командам с игроками
  const teamsWithPlayers = result.filter(t => t.players.length > 0);
  console.log(`[SDK Service] Команд с игроками: ${teamsWithPlayers.length}/${result.length}`);

  return result;
}

/**
 * Основная функция: загрузка всех команд с игроками
 */
export async function getAllTeamsWithPlayers(): Promise<Team[]> {
  try {
    const client = createSDKClient();

    console.log('[SDK Service] Загрузка команд...');
    const teams = await getAllTeams(client);
    console.log(`[SDK Service] Загружено команд: ${teams.length}`);

    console.log('[SDK Service] Загрузка участников...');
    const participants = await getAllParticipants(client);
    console.log(`[SDK Service] Загружено участников: ${participants.length}`);

    console.log('[SDK Service] Объединение данных...');
    const result = mergeTeamsWithPlayers(teams, participants);
    console.log(`[SDK Service] Готово. Команд с игроками: ${result.length}`);

    return result;
  } catch (error) {
    console.error('[SDK Service] Ошибка загрузки данных:', error);
    throw error;
  }
}
