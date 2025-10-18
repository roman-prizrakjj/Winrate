// Тест EMD Cloud SDK
require('dotenv').config({ path: '.env.local' });
const { EmdCloud } = require('@emd-cloud/sdk');

async function testSDK() {
  try {
    console.log('🔄 Инициализация SDK...');
    
    const emdCloud = new EmdCloud({
      environment: 'server',
      appId: process.env.EMD_APP_ID,
      apiToken: process.env.EMD_API_TOKEN
    });

    console.log('✅ SDK инициализирован');
    console.log('App ID:', process.env.EMD_APP_ID);
    console.log('Collection ID:', process.env.TOURNAMENTS_COLLECTION_ID);

    const db = emdCloud.database(process.env.TOURNAMENTS_COLLECTION_ID);

    console.log('\n🔄 Тест 1: Без параметров...');
    try {
      const result1 = await db.getRows();
      console.log('✅ Результат:', Array.isArray(result1) ? `${result1.length} записей` : typeof result1);
    } catch (e) {
      console.error('❌ Ошибка:', e.message);
    }

    console.log('\n🔄 Тест 2: С пустым объектом...');
    try {
      const result2 = await db.getRows({});
      console.log('✅ Результат:', Array.isArray(result2) ? `${result2.length} записей` : typeof result2);
    } catch (e) {
      console.error('❌ Ошибка:', e.message);
    }

    console.log('\n🔄 Тест 3: С limit и page...');
    try {
      const result3 = await db.getRows({ limit: 10, page: 0 });
      console.log('✅ Результат:', Array.isArray(result3) ? `${result3.length} записей` : typeof result3);
    } catch (e) {
      console.error('❌ Ошибка:', e.message);
    }

    console.log('\n🔄 Тест 4: С authType...');
    try {
      const result4 = await db.getRows({ limit: 10, page: 0 }, { authType: 'api-token' });
      console.log('✅ Результат:', Array.isArray(result4) ? `${result4.length} записей` : typeof result4);
    } catch (e) {
      console.error('❌ Ошибка:', e.message);
    }

  } catch (error) {
    console.error('❌ Фатальная ошибка:', error);
  }
}

testSDK();
