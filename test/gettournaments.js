// Получение всех строк (записей) из коллекции + очистка данных
// Запуск: node test/get-collection-rows.js

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

async function getCollectionRows() {
  const apiToken = process.env.MONGODB_API_TOKEN;
  const appId = process.env.MONGODB_APP_ID;
  const collectionId = process.env.TOURNAMENTS_COLLECTION_ID;

  if (!apiToken || !appId || !collectionId) {
    console.error('❌ Ошибка: не найдены переменные окружения (env)');
    process.exit(1);
  }

  const url = `https://api.emd.one/api/${appId}/database/${collectionId}/row`;
  console.log(`📡 Получаем строки из коллекции ${collectionId}`);

  const requestBody = {
    search: "",
    limit: 100,
    page: 0,
    orderBy: "",
    sort: [],
    query: {
      $or: [],
      $and: []
    },
    hasOptimiseResponse: false,
    useHumanReadableNames: true
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'apitoken': apiToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      console.error("❌ Ошибка API:", response.statusText);
      return;
    }

    const result = await response.json();
    const rows = result?.data || result?.rows || [];

    console.log(`✅ Получено записей: ${rows.length}`);

    // 🔥 Оставляем только _id и title
    const cleanRows = rows.map(item => ({
      _id: item._id,
      title: item.data?.title ?? null
    }));

    const outputPath = path.join(__dirname, "clean-rows.json");
    fs.writeFileSync(outputPath, JSON.stringify(cleanRows, null, 2), "utf-8");

    console.log(`💾 Файл сохранён: ${outputPath}`);
  } catch (err) {
    console.error("❌ Ошибка запроса:", err);
  }
}

getCollectionRows();
