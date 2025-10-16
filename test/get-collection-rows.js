// Получение всех строк (записей) из коллекции
// Запуск: node test/get-collection-rows.js

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

async function getCollectionRows() {
  const apiToken = process.env.MONGODB_API_TOKEN;
  const appId = process.env.MONGODB_APP_ID;
  const collectionId = process.env.TEST_COLLECTION_ID;
  
  if (!apiToken || !appId || !collectionId) {
    console.error('❌ Ошибка: Не найдены переменные окружения');
    console.log('Проверьте .env.local: MONGODB_API_TOKEN, MONGODB_APP_ID, TEST_COLLECTION_ID');
    process.exit(1);
  }

  const url = `https://api.emd.one/api/${appId}/database/${collectionId}/row`;
  console.log('🔄 Получаем строки коллекции...');
  console.log(`📡 URL: ${url}`);
  console.log(`🗂️  Collection ID: ${collectionId}`);
  
  // Тело запроса
  const requestBody = {
    search: "",                           // Текстовый поиск
    limit: 100,                             // 0 = получить все записи
    page: 0,                              // Номер страницы
    orderBy: "",                          // Поле для сортировки
    sort: [],                             // Правила сортировки
    query: {                              // MQL запрос
      $or: [],                            // ИЛИ условия
      $and: []                            // И условия
    },
    hasOptimiseResponse: false,            // Оптимизация ответа
    useHumanReadableNames: true           // Читаемые имена полей
  };
  
  console.log('\n📋 Параметры запроса:');
  console.log(JSON.stringify(requestBody, null, 2));
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'apitoken': apiToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    console.log(`\n📊 Статус ответа: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Данные успешно получены!');
      
      // Определяем количество записей
      let recordCount = 'N/A';
      if (Array.isArray(data)) {
        recordCount = data.length;
      } else if (data.data && Array.isArray(data.data)) {
        recordCount = data.data.length;
      } else if (data.rows && Array.isArray(data.rows)) {
        recordCount = data.rows.length;
      }
      
      console.log(`📊 Количество записей: ${recordCount}`);
      
      // Выводим первые 3 записи для превью
      console.log('\n📋 Превью данных (первые 3 записи):');
      let previewData = [];
      if (Array.isArray(data)) {
        previewData = data.slice(0, 3);
      } else if (data.data && Array.isArray(data.data)) {
        previewData = data.data.slice(0, 3);
      } else if (data.rows && Array.isArray(data.rows)) {
        previewData = data.rows.slice(0, 3);
      }
      console.log(JSON.stringify(previewData, null, 2));
      
      // Сохраняем полный ответ в JSON файл
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `rows-${collectionId.substring(0, 8)}-${timestamp}.json`;
      const filePath = path.join(__dirname, fileName);
      
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      console.log(`\n💾 Полные данные сохранены в: test/${fileName}`);
      
      // Создаём файл со статистикой
      const statsData = {
        collectionId,
        timestamp: new Date().toISOString(),
        recordCount,
        requestParams: requestBody,
        responseStructure: Object.keys(data)
      };
      
      const statsFileName = `rows-${collectionId.substring(0, 8)}-stats.json`;
      const statsFilePath = path.join(__dirname, statsFileName);
      
      fs.writeFileSync(statsFilePath, JSON.stringify(statsData, null, 2), 'utf8');
      console.log(`💾 Статистика сохранена в: test/${statsFileName}`);
      
    } else {
      const errorText = await response.text();
      console.log('❌ Ошибка получения данных:');
      console.log(errorText);
      
      // Сохраняем ошибку
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `rows-error-${timestamp}.json`;
      const filePath = path.join(__dirname, fileName);
      
      const errorData = {
        collectionId,
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        requestBody
      };
      
      fs.writeFileSync(filePath, JSON.stringify(errorData, null, 2), 'utf8');
      console.log(`💾 Ошибка сохранена в: test/${fileName}`);
    }
    
  } catch (error) {
    console.error('❌ Ошибка при выполнении запроса:', error.message);
  }
}

// Запуск
getCollectionRows();
