// Тест подключения к MongoDB API
// Запуск: node test/db-connection-test.js

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

async function testDatabaseConnection() {
  const apiToken = process.env.MONGODB_API_TOKEN;
  const appId = process.env.MONGODB_APP_ID;
  
  if (!apiToken || !appId) {
    console.error('❌ Ошибка: API токен или App ID не найдены в .env.local');
    process.exit(1);
  }

  const baseUrl = `https://api.emd.one/api/${appId}`;
  console.log('🔄 Тестируем подключение к MongoDB...');
  
  try {
    const response = await fetch(`${baseUrl}/database`, {
      method: 'GET',
      headers: {
        'apitoken': apiToken,
        'Content-Type': 'application/json'
      }
    });

    console.log(`📊 Статус ответа: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      console.error('❌ Ошибка подключения:', await response.text());
      return;
    }

    const data = await response.json();
    console.log('✅ Подключение успешно!');

    // ➤ Вытаскиваем только имена коллекций и их ID
    const collections = data.data.map(col => ({
      id: col.id,
      _id: col._id
    }));

    console.log('📦 Коллекции:');
    console.table(collections);

    // ➤ Сохраняем результат в файл collections.json
    const filePath = path.join(__dirname, 'collections.json');
    fs.writeFileSync(filePath, JSON.stringify(collections, null, 2), 'utf8');
    console.log(`💾 Коллекции сохранены в: test/collections.json`);

  } catch (error) {
    console.error('❌ Ошибка при выполнении запроса:', error.message);
  }
}

testDatabaseConnection();
