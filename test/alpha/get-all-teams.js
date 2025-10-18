/**
 * Скрипт для получения ВСЕХ команд из коллекции teams с пагинацией
 * и трансформацией в упрощённый формат
 */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env.local') });
const { EmdCloud, AppEnvironment, AuthType } = require('@emd-cloud/sdk');
const fs = require('fs');

// ============================================
// КОНФИГУРАЦИЯ
// ============================================
const CONFIG = {
  COLLECTION_ID: 'a8013391-320e-4fc7-9437-453cbc46d493', // teams
  LIMIT_PER_PAGE: 100, // Количество записей за один запрос
  USE_HUMAN_READABLE: true, // ВАЖНО: включаем для получения вложенных данных
  SAVE_TO_JSON: true,
};

// ============================================
// ФУНКЦИИ
// ============================================

/**
 * Трансформирует полную структуру команды в упрощённую
 */
function transformTeam(team) {
  return {
    _id: team._id || null,
    name: team.data?.name || null,
    educational_organization_shortName: team.data?.educational_organization?.data?.shortName || null,
    teams_participants_ids: (team.data?.teams_participants || []).map(p => p._id).filter(Boolean),
    discipline_name: team.data?.discipline?.data?.name || null,
    division_id: team.data?.division?._id || null,
    division_name: team.data?.division?.data?.name || null,
  };
}

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

/**
 * Получает все команды с пагинацией
 */
async function getAllTeams(client, collectionId) {
  console.log('\n🚀 Начинаем получение всех команд с пагинацией...\n');
  
  const db = client.database(collectionId);
  const allTeams = [];
  let page = 0; // Начинаем с 0, как в рабочем скрипте
  let hasMore = true;
  
  while (hasMore) {
    console.log(`📄 Страница ${page + 1}: запрашиваем ${CONFIG.LIMIT_PER_PAGE} записей...`);
    
    try {
      const result = await db.getRows({
        limit: CONFIG.LIMIT_PER_PAGE,
        page: page,
        useHumanReadableNames: CONFIG.USE_HUMAN_READABLE,
        // hasOptimiseResponse НЕ используем - конфликтует с useHumanReadableNames
      });
      
      console.log(`   ✅ Получено: ${result.length} записей`);
      
      if (result.length === 0) {
        hasMore = false;
        console.log('   ⚠️  Пустой результат - достигнут конец коллекции');
      } else {
        allTeams.push(...result);
        page++;
        
        // Если получили меньше чем лимит - это последняя страница
        if (result.length < CONFIG.LIMIT_PER_PAGE) {
          hasMore = false;
          console.log(`   ℹ️  Получено ${result.length} < ${CONFIG.LIMIT_PER_PAGE} - последняя страница`);
        }
      }
      
    } catch (error) {
      console.error(`   ❌ Ошибка на странице ${page}:`, error.message);
      hasMore = false;
    }
  }
  
  console.log(`\n✅ Всего получено команд: ${allTeams.length}`);
  return allTeams;
}

// ============================================
// ОСНОВНОЙ КОД
// ============================================

async function main() {
  console.log('=' .repeat(60));
  console.log('📦 Получение всех команд из коллекции teams');
  console.log('=' .repeat(60));
  
  // Проверка переменных окружения
  if (!process.env.EMD_APP_ID || !process.env.EMD_API_TOKEN) {
    console.error('❌ Ошибка: отсутствуют EMD_APP_ID или EMD_API_TOKEN в .env.local');
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
    
    // Параметры запроса
    console.log('\n⚙️  Конфигурация:');
    console.log(`   Collection ID: ${CONFIG.COLLECTION_ID}`);
    console.log(`   Записей за запрос: ${CONFIG.LIMIT_PER_PAGE}`);
    console.log(`   useHumanReadableNames: ${CONFIG.USE_HUMAN_READABLE}`);
    console.log(`   Сохранение в JSON: ${CONFIG.SAVE_TO_JSON}`);
    
    // Получение всех команд
    const allTeams = await getAllTeams(client, CONFIG.COLLECTION_ID);
    
    if (allTeams.length === 0) {
      console.log('\n⚠️  Коллекция пуста или произошла ошибка');
      return;
    }
    
    // Трансформация данных
    console.log('\n🔄 Трансформация данных...');
    const transformedTeams = allTeams.map(transformTeam);
    console.log(`✅ Трансформировано: ${transformedTeams.length} команд`);
    
    // Анализ данных
    console.log('\n📊 Анализ данных:');
    const withOrg = transformedTeams.filter(t => t.educational_organization_shortName).length;
    const withDiscipline = transformedTeams.filter(t => t.discipline_name).length;
    const withDivision = transformedTeams.filter(t => t.division_name).length;
    const avgParticipants = transformedTeams.reduce((sum, t) => sum + t.teams_participants_ids.length, 0) / transformedTeams.length;
    
    console.log(`   С организацией: ${withOrg} (${(withOrg/transformedTeams.length*100).toFixed(1)}%)`);
    console.log(`   С дисциплиной: ${withDiscipline} (${(withDiscipline/transformedTeams.length*100).toFixed(1)}%)`);
    console.log(`   С дивизионом: ${withDivision} (${(withDivision/transformedTeams.length*100).toFixed(1)}%)`);
    console.log(`   Среднее участников: ${avgParticipants.toFixed(1)}`);
    
    // Пример первой записи
    console.log('\n📝 Пример первой записи:');
    console.log(JSON.stringify(transformedTeams[0], null, 2));
    
    // Сохранение в файл
    if (CONFIG.SAVE_TO_JSON) {
      const filename = saveToJson(transformedTeams, 'teams-all-transformed');
      console.log(`\n📁 Файл сохранён: ${filename}`);
    }
    
    // Размер данных
    const transformedSize = JSON.stringify(transformedTeams).length;
    const originalSize = JSON.stringify(allTeams).length;
    console.log('\n📏 Размер данных:');
    console.log(`   Оригинал: ${(originalSize / 1024).toFixed(2)} KB`);
    console.log(`   Трансформированные: ${(transformedSize / 1024).toFixed(2)} KB`);
    console.log(`   Сжатие: ${((1 - transformedSize/originalSize) * 100).toFixed(1)}%`);
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ Готово!');
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('\n❌ Ошибка:', error);
    process.exit(1);
  }
}

// Запуск
main();
