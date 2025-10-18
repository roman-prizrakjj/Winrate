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
function transformTeam(team: any): Partial<Team> {
  const division = team.data?.division?.data;
  const educationalOrg = team.data?.educational_organization?.data;
  const discipline = team.data?.discipline?.data;

  return {
    id: team._id,
    name: team.data?.name || 'Без названия',
    school: educationalOrg?.shortName || educationalOrg?.name || null,
    discipline: discipline?.name || null,
    division: division?.name || null,
    divisionId: division?._id || null,
    playersCount: 0,
    players: [],
  };
}

/**
 * Преобразование данных участника
 */
function transformParticipant(participant: any): Player {
  const role = participant.data?.role?.data;
  const user = participant.data?.user?.data;

  return {
    id: participant._id,
    userId: user?._id || 'unknown',
    nickname: user?.customFields?.nickname || user?.email || 'Без имени',
    telegram: user?.customFields?.telegram || null,
    role: ROLE_MAPPING[role?._id] || 'unknown',
    roleId: role?._id || 'unknown',
  };
}

/**
 * Объединение команд с участниками
 */
function mergeTeamsWithPlayers(teams: any[], participants: any[]): Team[] {
  // Создаем Map для быстрого поиска участников по team_id
  const participantsByTeam = new Map<string, Player[]>();

  participants.forEach((participant) => {
    const teamId = participant.data?.team?.data?._id;
    if (!teamId) return;

    if (!participantsByTeam.has(teamId)) {
      participantsByTeam.set(teamId, []);
    }
    participantsByTeam.get(teamId)!.push(transformParticipant(participant));
  });

  // Объединяем команды с участниками
  return teams.map((team) => {
    const transformed = transformTeam(team);
    const players = participantsByTeam.get(team._id) || [];

    return {
      ...transformed,
      playersCount: players.length,
      players,
    } as Team;
  });
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
