// Скрипт для получения участников команды по ID
const { EmdCloud, AppEnvironment, AuthType } = require('@emd-cloud/sdk');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

// ID команды (передайте как аргумент или измените здесь)
const TEAM_ID = process.argv[2] || '68f22b0ed8a472ea42c403da';

const CAPTAIN_ROLE_ID = '36812ba6-b171-40c9-b608-f1514ef117e2';

async function getTeamParticipants() {
  console.log(`\n🔍 Поиск участников команды: ${TEAM_ID}\n`);

  const client = new EmdCloud({
    environment: AppEnvironment.Server,
    appId: process.env.EMD_APP_ID,
    apiToken: process.env.EMD_API_TOKEN,
    defaultAuthType: AuthType.ApiToken,
  });

  const db = client.database(process.env.TEAMS_PARTICIPANTS_COLLECTION_ID);

  try {
    // Загружаем с техническими полями (БЕЗ query - просто все записи)
    console.log('📋 Загружаем участников с техническими полями...\n');
    
    const TEAM_FIELD = 'col_804ae65a8e';  // team
    const ROLE_FIELD = 'col_18760881ff';  // role
    const TELEGRAM_FIELD = 'col_3d293c0ccf';  // telegram
    
    // Загружаем с параллельными запросами (20 страниц за раз)
    console.log('📋 Загружаем участников с параллельными запросами...\n');
    
    const allRows = [];
    const pageSize = 100;
    const parallelRequests = 20; // Количество параллельных запросов
    let batchNumber = 0;
    let hasMore = true;
    
    while (hasMore) {
      // Создаём массив промисов для параллельных запросов
      const startPage = batchNumber * parallelRequests;
      const promises = [];
      
      for (let i = 0; i < parallelRequests; i++) {
        const page = startPage + i;
        promises.push(
          db.getRows({
            limit: pageSize,
            page: page,
            useHumanReadableNames: false
          })
        );
      }
      
      console.log(`  Батч ${batchNumber + 1}: загружаем страницы ${startPage + 1}-${startPage + parallelRequests}...`);
      
      // Выполняем все запросы параллельно
      const results = await Promise.all(promises);
      
      let batchRows = 0;
      let hasFullPage = false;
      
      // Обрабатываем результаты
      results.forEach((result, index) => {
        const rows = Array.isArray(result) ? result : (result.data || []);
        if (rows.length > 0) {
          allRows.push(...rows);
          batchRows += rows.length;
          
          // Если хотя бы одна страница полная, продолжаем
          if (rows.length === pageSize) {
            hasFullPage = true;
          }
        }
      });
      
      console.log(`    Загружено ${batchRows} записей (всего: ${allRows.length})\n`);
      
      // Если ни одна страница не полная, значит данные закончились
      hasMore = hasFullPage;
      batchNumber++;
    }
    
    console.log(`📊 Всего загружено участников: ${allRows.length}\n`);
    
    // Debug: Проверим, что в поле team у первых 3 записей
    console.log('🔍 DEBUG: Проверяем формат поля team в первых записях:\n');
    allRows.slice(0, 3).forEach((row, i) => {
      const teamValue = row.data?.[TEAM_FIELD];
      const teamType = typeof teamValue;
      const teamIsObject = teamValue && typeof teamValue === 'object';
      
      console.log(`[${i + 1}] team type: ${teamType}`);
      if (teamIsObject) {
        console.log(`    team._id: ${teamValue._id}`);
      } else {
        console.log(`    team value: ${teamValue}`);
      }
    });
    console.log('\n');
    
    // Фильтруем по ID команды из всего загруженного массива
    const rows = allRows.filter(p => {
      const teamValue = p.data?.[TEAM_FIELD];
      const teamId = typeof teamValue === 'object' ? teamValue?._id : teamValue;
      return teamId === TEAM_ID;
    });
    
    console.log(`✅ Найдено участников команды: ${rows.length}\n`);

    if (rows.length === 0) {
      console.log('❌ Участники не найдены!\n');
      return;
    }

    // Фильтруем по команде
    const teamParticipants = rows;

    // Выводим каждого участника
    teamParticipants.forEach((p, i) => {
      const roleId = p.data?.[ROLE_FIELD];
      const isCaptain = roleId === CAPTAIN_ROLE_ID;
      const roleName = isCaptain ? '👑 КАПИТАН' : (roleId === 'cb0494c5-992d-4789-aa2f-58c7fb3e120f' ? '⭐ Игрок' : '🔄 Запасной');
      
      const nickname = p.user?.customFields?.nickname || 'N/A';
      const telegram = p.data?.[TELEGRAM_FIELD] || p.user?.customFields?.telegram_id || 'N/A';
      const name = `${p.user?.firstName || ''} ${p.user?.lastName || ''}`.trim() || 'N/A';

      console.log(`${i + 1}. ${roleName}`);
      console.log(`   Ник: ${nickname}`);
      console.log(`   Имя: ${name}`);
      console.log(`   Telegram: ${telegram}`);
      console.log(`   Role ID: ${roleId}`);
      console.log('');
    });

    // Ищем капитана
    const captain = teamParticipants.find(p => p.data?.[ROLE_FIELD] === CAPTAIN_ROLE_ID);
    
    if (captain) {
      console.log('🎯 КАПИТАН КОМАНДЫ:');
      console.log(`   Ник: ${captain.user?.customFields?.nickname || 'N/A'}`);
      console.log(`   Telegram: ${captain.data?.[TELEGRAM_FIELD] || captain.user?.customFields?.telegram_id || 'N/A'}`);
    } else {
      console.log('⚠️  Капитан не найден среди участников!');
    }

  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  }
}

console.log('🚀 Запуск скрипта получения участников команды\n');
getTeamParticipants().then(() => {
  console.log('\n✅ Готово!\n');
  process.exit(0);
});
