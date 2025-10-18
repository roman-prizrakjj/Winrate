/**
 * Скрипт для получения ВСЕХ команд с полными данными участников
 * Объединяет данные из коллекций teams и teams_participants
 */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env.local') });
const { EmdCloud, AppEnvironment, AuthType } = require('@emd-cloud/sdk');
const fs = require('fs');

// ============================================
// КОНФИГУРАЦИЯ
// ============================================
const CONFIG = {
  TEAMS_COLLECTION_ID: process.env.TEAMS_COLLECTION_ID,
  PARTICIPANTS_COLLECTION_ID: process.env.TEAMS_PARTICIPANTS_COLLECTION_ID,
  LIMIT_PER_PAGE: 100,
  USE_HUMAN_READABLE: true,
  SAVE_TO_JSON: true,
};

// Справочник ролей участников команды
const ROLE_MAPPING = {
  '36812ba6-b171-40c9-b608-f1514ef117e2': 'captain',    // Капитан
  'cb0494c5-992d-4789-aa2f-58c7fb3e120f': 'player',     // Игрок
  'c18c129d-0386-4016-a2d1-93850f5da4d4': 'substitute'  // Запасной
};

// ============================================
// ФУНКЦИИ УТИЛИТЫ
// ============================================

/**
 * Сохраняет данные в JSON файл
 */
function saveToJson(data, filename) {
  if (!CONFIG.SAVE_TO_JSON) return;
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fullFilename = `${filename}-${timestamp}.json`;
  const filepath = path.join(__dirname, fullFilename);
  
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`\n💾 Данные сохранены: ${fullFilename}`);
  return fullFilename;
}

// ============================================
// ФУНКЦИИ ЗАГРУЗКИ ДАННЫХ
// ============================================

/**
 * Получает все команды с пагинацией
 */
async function getAllTeams(client, collectionId) {
  console.log('\n📦 Загрузка команд...');
  
  const db = client.database(collectionId);
  const allTeams = [];
  let page = 0;
  let hasMore = true;
  
  while (hasMore) {
    console.log(`   Страница ${page + 1}: запрашиваем ${CONFIG.LIMIT_PER_PAGE} записей...`);
    
    try {
      const result = await db.getRows({
        limit: CONFIG.LIMIT_PER_PAGE,
        page: page,
        useHumanReadableNames: CONFIG.USE_HUMAN_READABLE,
      });
      
      console.log(`   ✅ Получено: ${result.length} записей`);
      
      if (result.length === 0) {
        hasMore = false;
      } else {
        allTeams.push(...result);
        page++;
        
        if (result.length < CONFIG.LIMIT_PER_PAGE) {
          hasMore = false;
        }
      }
      
    } catch (error) {
      console.error(`   ❌ Ошибка на странице ${page + 1}:`, error.message);
      hasMore = false;
    }
  }
  
  console.log(`✅ Всего загружено команд: ${allTeams.length}`);
  return allTeams;
}

/**
 * Получает всех участников по списку ID с пагинацией
 */
async function getAllParticipants(client, collectionId, participantIds) {
  console.log(`\n👥 Загрузка данных участников (всего ID: ${participantIds.length})...`);
  
  if (participantIds.length === 0) {
    console.log('⚠️  Нет ID участников для загрузки');
    return [];
  }
  
  const db = client.database(collectionId);
  const allParticipants = [];
  let page = 0;
  let hasMore = true;
  
  while (hasMore) {
    console.log(`   Страница ${page + 1}: запрашиваем ${CONFIG.LIMIT_PER_PAGE} записей...`);
    
    try {
      const result = await db.getRows({
        limit: CONFIG.LIMIT_PER_PAGE,
        page: page,
        useHumanReadableNames: CONFIG.USE_HUMAN_READABLE,
      });
      
      console.log(`   ✅ Получено: ${result.length} записей`);
      
      if (result.length === 0) {
        hasMore = false;
      } else {
        allParticipants.push(...result);
        page++;
        
        if (result.length < CONFIG.LIMIT_PER_PAGE) {
          hasMore = false;
        }
      }
      
    } catch (error) {
      console.error(`   ❌ Ошибка на странице ${page + 1}:`, error.message);
      hasMore = false;
    }
  }
  
  console.log(`✅ Всего загружено участников: ${allParticipants.length}`);
  return allParticipants;
}

// ============================================
// ФУНКЦИИ ТРАНСФОРМАЦИИ
// ============================================

/**
 * Трансформирует команду в упрощённый формат
 */
function transformTeam(team) {
  return {
    _id: team._id || null,
    name: team.data?.name || null,
    school: team.data?.educational_organization?.data?.shortName || null,
    discipline: team.data?.discipline?.data?.name || null,
    division: team.data?.division?.data?.name || null,
    divisionId: team.data?.division?._id || null,
    teams_participants_ids: (team.data?.teams_participants || []).map(p => p._id || p).filter(Boolean),
  };
}

/**
 * Трансформирует участника в формат для фронтенда
 */
function transformParticipant(participant) {
  const user = participant.user || {};
  const customFields = user.customFields || {};
  const roleId = participant.data?.role || null;
  
  return {
    id: participant._id,
    userId: user._id || null,
    nickname: customFields.nickname || 'Без ника',
    telegram: customFields.telegram_id || null,
    role: ROLE_MAPPING[roleId] || 'unknown',
    roleId: roleId,
  };
}

/**
 * Собирает уникальные ID участников из всех команд
 */
function getUniqueParticipantIds(teams) {
  const allIds = teams.flatMap(team => team.teams_participants_ids || []);
  const uniqueIds = [...new Set(allIds)];
  return uniqueIds;
}

/**
 * Объединяет команды с данными участников
 */
function mergeTeamsWithPlayers(teams, participants) {
  console.log('\n🔄 Объединение данных команд и участников...');
  
  // Создаём Map для быстрого поиска участников по ID
  const participantsMap = new Map();
  participants.forEach(p => {
    participantsMap.set(p._id, p);
  });
  
  console.log(`   Создан индекс участников: ${participantsMap.size} записей`);
  
  // Объединяем данные
  const result = teams.map(team => {
    const players = team.teams_participants_ids
      .map(id => participantsMap.get(id))
      .filter(Boolean)
      .map(transformParticipant);
    
    return {
      id: team._id,
      name: team.name,
      school: team.school,
      discipline: team.discipline,
      division: team.division,
      divisionId: team.divisionId,
      playersCount: players.length,
      players: players,
    };
  });
  
  console.log(`✅ Объединено: ${result.length} команд с участниками`);
  return result;
}

// ============================================
// ОСНОВНОЙ КОД
// ============================================

async function main() {
  console.log('=' .repeat(60));
  console.log('🚀 Загрузка команд с полными данными участников');
  console.log('=' .repeat(60));
  
  // Проверка переменных окружения
  if (!process.env.EMD_APP_ID || !process.env.EMD_API_TOKEN) {
    console.error('❌ Ошибка: отсутствуют EMD_APP_ID или EMD_API_TOKEN в .env.local');
    process.exit(1);
  }
  
  if (!CONFIG.TEAMS_COLLECTION_ID || !CONFIG.PARTICIPANTS_COLLECTION_ID) {
    console.error('❌ Ошибка: отсутствуют TEAMS_COLLECTION_ID или TEAMS_PARTICIPANTS_COLLECTION_ID');
    process.exit(1);
  }
  
  try {
    // Инициализация клиента
    console.log('\n🔌 Подключение к EMD Cloud SDK...');
    const client = new EmdCloud({
      environment: AppEnvironment.Server,
      appId: process.env.EMD_APP_ID,
      apiToken: process.env.EMD_API_TOKEN,
      defaultAuthType: AuthType.ApiToken
    });
    console.log('✅ Подключение установлено');
    
    // Шаг 1: Загрузка всех команд
    const startTime = Date.now();
    const allTeamsRaw = await getAllTeams(client, CONFIG.TEAMS_COLLECTION_ID);
    
    if (allTeamsRaw.length === 0) {
      console.log('\n⚠️  Коллекция команд пуста');
      return;
    }
    
    // Трансформация команд
    console.log('\n🔄 Трансформация команд...');
    const teams = allTeamsRaw.map(transformTeam);
    console.log(`✅ Трансформировано: ${teams.length} команд`);
    
    // Шаг 2: Сбор уникальных ID участников
    console.log('\n🔍 Сбор ID участников из команд...');
    const participantIds = getUniqueParticipantIds(teams);
    console.log(`✅ Найдено ${participantIds.length} уникальных ID участников`);
    
    // Статистика по командам без участников
    const teamsWithoutPlayers = teams.filter(t => t.teams_participants_ids.length === 0);
    if (teamsWithoutPlayers.length > 0) {
      console.log(`⚠️  Команд без участников: ${teamsWithoutPlayers.length}`);
    }
    
    // Шаг 3: Загрузка данных участников
    const allParticipants = await getAllParticipants(client, CONFIG.PARTICIPANTS_COLLECTION_ID, participantIds);
    
    // Шаг 4: Объединение данных
    const teamsWithPlayers = mergeTeamsWithPlayers(teams, allParticipants);
    
    // Анализ данных
    console.log('\n📊 Анализ финальных данных:');
    const totalPlayers = teamsWithPlayers.reduce((sum, t) => sum + t.playersCount, 0);
    const avgPlayers = totalPlayers / teamsWithPlayers.length;
    const teamsWithNoPlayers = teamsWithPlayers.filter(t => t.playersCount === 0).length;
    const maxPlayers = Math.max(...teamsWithPlayers.map(t => t.playersCount));
    
    console.log(`   Всего команд: ${teamsWithPlayers.length}`);
    console.log(`   Всего игроков: ${totalPlayers}`);
    console.log(`   Среднее игроков на команду: ${avgPlayers.toFixed(1)}`);
    console.log(`   Команд без игроков: ${teamsWithNoPlayers}`);
    console.log(`   Максимум игроков в команде: ${maxPlayers}`);
    
    // Пример первой команды
    console.log('\n📝 Пример первой команды с игроками:');
    const exampleTeam = teamsWithPlayers.find(t => t.playersCount > 0) || teamsWithPlayers[0];
    console.log(JSON.stringify(exampleTeam, null, 2));
    
    // Сохранение результата
    if (CONFIG.SAVE_TO_JSON) {
      const filename = saveToJson(teamsWithPlayers, 'teams-with-players-final');
      
      const fileSizeKB = (JSON.stringify(teamsWithPlayers).length / 1024).toFixed(2);
      console.log(`\n📏 Размер файла: ${fileSizeKB} KB`);
    }
    
    const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n⏱️  Время выполнения: ${totalTime}s`);
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ ГОТОВО!');
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('\n❌ Ошибка:', error);
    process.exit(1);
  }
}

// Запуск
main();
