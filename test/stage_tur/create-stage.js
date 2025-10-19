const { EmdCloud, AppEnvironment, AuthType } = require('@emd-cloud/sdk');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env.local') });

// Инициализация SDK
const emdCloud = new EmdCloud({
  environment: AppEnvironment.Server,
  appId: process.env.EMD_APP_ID,
  apiToken: process.env.EMD_API_TOKEN,
  defaultAuthType: AuthType.ApiToken
});

const sdk = emdCloud.database();

// ============================================
// КОНФИГУРАЦИЯ ЭТАПА - ПОДСТАВЬ СВОИ ДАННЫЕ
// ============================================
const STAGE_CONFIG = {
  // ✅ ОБЯЗАТЕЛЬНЫЕ ПОЛЯ
  col_e2c5584fde: '68f541270fdfbe6a8b6cf217',  // tournament - ID турнира
  col_7ef90ab5ee: 'Капибара бара бара',      // title - название этапа
  col_9d5ca1d664: '250614e6-1142-4604-b950-fd81c7a66497', // mechanic - Швейцарская система
  col_04f88e07b9: 'd1bf2988-fba3-4cd5-b3e7-0a5bcdf22a23', // status - Ожидает запуска
  col_c4660c0e50: 1,                     // order - порядковый номер
  
  // ⚠️ НЕОБЯЗАТЕЛЬНЫЕ (можно не передавать или оставить пустыми)
  col_a9048c1624: [],                    // tours - массив туров (пустой при создании)
  col_da148c8009: [],                    // tournaments_teams_stages - команды (пустой)
  // col_00b85a3840: null,               // current_tour - текущий тур (заполняется позже)
};

/**
 * Справочники для подстановки значений
 */
const MECHANICS = {
  SWISS: '250614e6-1142-4604-b950-fd81c7a66497',      // Швейцарская система
  SINGLE: '41adb457-1fe4-4277-ad26-d53f2f2ba892',     // Single Elimination
  DOUBLE: '1a640e59-f12f-4c0f-b8a4-4e4022c9cfff',     // Double Elimination
};

const STATUSES = {
  WAITING: 'd1bf2988-fba3-4cd5-b3e7-0a5bcdf22a23',    // Ожидает запуска
  START: '71c6f9a0-35e4-4236-abe9-efe9cb79f158',      // Запустить этап
  ACTIVE: '45b4f552-7195-4f73-96db-dbad80f8c148',     // Активен
  COMPLETED: '7a81a208-f402-42a9-a0ab-92f75f3684ff',  // Завершен
};

/**
 * Создание этапа турнира
 */
async function createStage() {
  try {
    console.log('🚀 Начинаем создание этапа турнира...\n');
    
    // Проверка обязательных параметров
    if (STAGE_CONFIG.col_e2c5584fde === 'TOURNAMENT_ID_HERE') {
      console.error('❌ ОШИБКА: Укажи ID турнира в поле col_e2c5584fde!');
      console.log('💡 Пример: col_e2c5584fde: "68f3caf3e7c854b803741fc4"\n');
      return;
    }
    
    console.log('📋 Конфигурация этапа:');
    console.log(JSON.stringify(STAGE_CONFIG, null, 2));
    console.log('\n');
    
    // Создаем запись через SDK
    const db = emdCloud.database(process.env.STAGES_COLLECTION_ID);
    const result = await db.createRow(STAGE_CONFIG);
    
    console.log('✅ Этап успешно создан!');
    console.log('🆔 ID этапа:', result._id);
    console.log('\n📄 Полный ответ:');
    console.log(JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('❌ Ошибка при создании этапа:');
    console.error('Сообщение:', error.message);
    
    if (error.response?.data) {
      console.error('\nДетали ошибки:');
      console.error(JSON.stringify(error.response.data, null, 2));
    }
  }
}

// Запускаем создание
createStage();
