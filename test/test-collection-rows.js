// Тест получения строк из коллекции EMD Cloud
// Показывает структуру данных, пагинацию и различные параметры запроса

const { EmdCloud, AppEnvironment, AuthType } = require('@emd-cloud/sdk');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// ========== НАСТРОЙКИ ТЕСТА ==========
// Измените эти параметры для настройки теста
const TEST_CONFIG = {
  // Лимиты для запросов
  FIRST_REQUEST_LIMIT: 1,        // Сколько строк загрузить в первом запросе (для анализа структуры)
  BIG_REQUEST_LIMIT: 0,         // Сколько строк загрузить во втором запросе (для проверки объема данных)

  // Параметры отображения
  SHOW_FULL_FIRST_ROW: true,      // Показывать полную структуру первой строки в JSON
  SHOW_ALL_ROWS_PREVIEW: true,    // Показывать краткий обзор всех полученных строк
  MAX_PREVIEW_FIELDS: 5,          // Максимум полей для отображения в кратком обзоре
  
  // Параметры SDK
  USE_HUMAN_READABLE_NAMES: false, // Использовать человекочитаемые имена полей
  USE_OPTIMISE_RESPONSE: true,   // Оптимизировать размер ответа (уменьшает размер данных)
  // ⚠️ ВНИМАНИЕ: Комбинация обоих = true вызывает ошибку SDK! Автоматически отключается hasOptimiseResponse
  
  // Сохранение результатов
  SAVE_TO_JSON: true,             // Сохранять результаты запросов в JSON файлы
};

// 💡 Поддерживаемые параметры getRows:
// - limit, page, useHumanReadableNames, hasOptimiseResponse
// - query (MongoDB-style), sort, search

// ========================================

// Инициализация SDK
const emdCloud = new EmdCloud({
  environment: AppEnvironment.Server,
  appId: process.env.EMD_APP_ID,
  apiToken: process.env.EMD_API_TOKEN,
  defaultAuthType: AuthType.ApiToken
});

// Функция для красивого вывода
function printSection(title, char = '=') {
  console.log('\n' + char.repeat(80));
  console.log(`  ${title}`);
  console.log(char.repeat(80));
}

function printSubSection(title) {
  console.log('\n' + '-'.repeat(80));
  console.log(`  ${title}`);
  console.log('-'.repeat(80));
}

// Функция для сохранения результатов в JSON
function saveToJson(data, collectionId, suffix = '') {
  if (!TEST_CONFIG.SAVE_TO_JSON) return;
  
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const collectionShort = collectionId.substring(0, 8);
    const filename = `rows-${collectionShort}${suffix ? '-' + suffix : ''}-${timestamp}.json`;
    const filepath = path.join(__dirname, filename);
    
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`💾 Результаты сохранены: ${filename}`);
    return filepath;
  } catch (error) {
    console.error(`⚠️  Ошибка сохранения в файл: ${error.message}`);
    return null;
  }
}

// Главная функция теста
async function testCollectionRows() {
  printSection('📦 ТЕСТ ПОЛУЧЕНИЯ СТРОК ИЗ КОЛЛЕКЦИИ EMD CLOUD', '=');
  
  // ⚠️ ВЫБЕРИТЕ КОЛЛЕКЦИЮ ДЛЯ ТЕСТА
  const collectionId = process.env.TEST_COLLECTION_ID || process.env.TEAM_STATS_COLLECTION_ID || process.env.TOURNAMENTS_COLLECTION_ID;
  const collectionName = process.env.TEST_COLLECTION_ID === collectionId 
    ? 'TEST_COLLECTION' 
    : (process.env.TEAM_STATS_COLLECTION_ID === collectionId ? 'TEAM_STATS' : 'TOURNAMENTS');
  
  if (!collectionId) {
    console.error('❌ Ошибка: Collection ID не найден!');
    console.error('Установите TEST_COLLECTION_ID, TEAM_STATS_COLLECTION_ID или TOURNAMENTS_COLLECTION_ID в .env.local');
    process.exit(1);
  }
  
  console.log(`\n📁 Collection ID: ${collectionId}`);
  console.log(`📝 Collection Name: ${collectionName}`);
  console.log(`🌐 EMD APP ID: ${process.env.EMD_APP_ID}`);
  
  // Показываем настройки теста
  console.log(`\n⚙️ Настройки теста:`);
  console.log(`  - Первый запрос: ${TEST_CONFIG.FIRST_REQUEST_LIMIT} строк`);
  console.log(`  - Второй запрос: ${TEST_CONFIG.BIG_REQUEST_LIMIT} строк`);
  console.log(`  - useHumanReadableNames: ${TEST_CONFIG.USE_HUMAN_READABLE_NAMES}`);
  console.log(`  - hasOptimiseResponse: ${TEST_CONFIG.USE_OPTIMISE_RESPONSE}`);
  
  try {
    // ========== БАЗОВЫЙ ЗАПРОС ==========
    printSection(`1️⃣ БАЗОВЫЙ ЗАПРОС (первые ${TEST_CONFIG.FIRST_REQUEST_LIMIT} строк)`);
    
    const db = emdCloud.database(collectionId);
    console.log('⏳ Загрузка данных...');
    
    // ⚠️ ВАЖНО: SDK имеет баг - не работает комбинация useHumanReadableNames + hasOptimiseResponse
    // Если оба true, отключаем hasOptimiseResponse
    let useOptimise = TEST_CONFIG.USE_OPTIMISE_RESPONSE;
    if (TEST_CONFIG.USE_HUMAN_READABLE_NAMES && TEST_CONFIG.USE_OPTIMISE_RESPONSE) {
      console.log('⚠️  Внимание: useHumanReadableNames + hasOptimiseResponse несовместимы!');
      console.log('   Отключаем hasOptimiseResponse для корректной работы...');
      useOptimise = false;
    }
    
    // Показываем параметры запроса
    const requestParams = {
      limit: TEST_CONFIG.FIRST_REQUEST_LIMIT,
      page: 0,
      useHumanReadableNames: TEST_CONFIG.USE_HUMAN_READABLE_NAMES,
      hasOptimiseResponse: useOptimise
    };
    console.log('📋 Параметры запроса:', JSON.stringify(requestParams, null, 2));
    
    const startTime = Date.now();
    
    const result = await db.getRows(requestParams);
    
    const duration = Date.now() - startTime;
    console.log(`✅ Данные получены! (${duration}ms)`);
    console.log('📦 Тип результата:', Array.isArray(result) ? 'Array' : typeof result);
    console.log('📦 Ключи результата:', Object.keys(result || {}).join(', '));
    
    // Сохраняем результат первого запроса
    saveToJson(result, collectionId, 'first');
    
    // Проверка на ошибку
    if ('error' in result) {
      console.error('❌ Ошибка SDK:', result.error);
      process.exit(1);
    }
    
    // Получаем массив данных
    const rows = Array.isArray(result) 
      ? result 
      : ('data' in result ? result.data : []);
    
    console.log(`\n📊 Получено строк: ${rows.length}`);
    
    if (rows.length === 0) {
      console.log('⚠️ Коллекция пуста!');
      process.exit(0);
    }
    
    // ========== АНАЛИЗ СТРУКТУРЫ ==========
    printSection('🔍 АНАЛИЗ СТРУКТУРЫ ПЕРВОЙ СТРОКИ');
    
    const firstRow = rows[0];
    
    if (TEST_CONFIG.SHOW_FULL_FIRST_ROW) {
      console.log('\n📋 Полная структура первой строки:');
      console.log(JSON.stringify(firstRow, null, 2));
    }
    
    printSubSection('Ключи верхнего уровня');
    Object.keys(firstRow).forEach(key => {
      const value = firstRow[key];
      const type = typeof value;
      const isObject = type === 'object' && value !== null;
      const isArray = Array.isArray(value);
      
      if (isArray) {
        console.log(`  ✓ ${key}: Array[${value.length}]`);
      } else if (isObject) {
        const objKeys = Object.keys(value);
        console.log(`  ✓ ${key}: Object {${objKeys.length} keys: ${objKeys.slice(0, 3).join(', ')}${objKeys.length > 3 ? '...' : ''}}`);
      } else {
        const preview = type === 'string' && value.length > 50 
          ? value.substring(0, 50) + '...' 
          : value;
        console.log(`  ✓ ${key}: ${type} = ${preview}`);
      }
    });
    
    // Анализ поля data
    if (firstRow.data) {
      printSubSection('Структура firstRow.data');
      Object.keys(firstRow.data).forEach(key => {
        const value = firstRow.data[key];
        const type = typeof value;
        
        if (type === 'object' && value !== null) {
          if (Array.isArray(value)) {
            console.log(`  ✓ data.${key}: Array[${value.length}]`);
          } else {
            const subKeys = Object.keys(value);
            console.log(`  ✓ data.${key}: Object {${subKeys.join(', ')}}`);
          }
        } else {
          console.log(`  ✓ data.${key}: ${type} = ${value}`);
        }
      });
    }
    
    // ========== ВСЕ СТРОКИ (КРАТКИЙ ОБЗОР) ==========
    if (TEST_CONFIG.SHOW_ALL_ROWS_PREVIEW) {
      printSection('📜 КРАТКИЙ ОБЗОР ВСЕХ ПОЛУЧЕННЫХ СТРОК');
      
      rows.forEach((row, index) => {
        console.log(`\n[${index + 1}] ID: ${row._id || row.id || 'unknown'}`);
        
        // Показываем основные поля
        if (row.data) {
          const data = row.data;
          const previewFields = Object.keys(data).slice(0, TEST_CONFIG.MAX_PREVIEW_FIELDS);
          
          previewFields.forEach(field => {
            const value = data[field];
            
            if (typeof value === 'object' && value !== null) {
              if (value.data) {
                console.log(`  - ${field}: ${JSON.stringify(value.data).substring(0, 60)}...`);
              } else {
                console.log(`  - ${field}: ${JSON.stringify(value).substring(0, 60)}...`);
              }
            } else {
              console.log(`  - ${field}: ${value}`);
            }
          });
          
          if (Object.keys(data).length > TEST_CONFIG.MAX_PREVIEW_FIELDS) {
            console.log(`  ... и ещё ${Object.keys(data).length - TEST_CONFIG.MAX_PREVIEW_FIELDS} полей`);
          }
        }
      });
    }
    
    // ========== ТЕСТ С БОЛЬШИМ ЛИМИТОМ ==========
    printSection(`2️⃣ ТЕСТ С БОЛЬШИМ ЛИМИТОМ (${TEST_CONFIG.BIG_REQUEST_LIMIT} строк)`);
    
    console.log(`⏳ Загрузка первых ${TEST_CONFIG.BIG_REQUEST_LIMIT} строк...`);
    const bigStart = Date.now();
    
    const bigResult = await db.getRows({
      limit: TEST_CONFIG.BIG_REQUEST_LIMIT,
      page: 0,
      useHumanReadableNames: TEST_CONFIG.USE_HUMAN_READABLE_NAMES,
      hasOptimiseResponse: useOptimise  // Используем скорректированное значение
    });
    
    const bigDuration = Date.now() - bigStart;
    const bigRows = Array.isArray(bigResult) 
      ? bigResult 
      : ('data' in bigResult ? bigResult.data : []);
    
    console.log(`✅ Данные получены! (${bigDuration}ms)`);
    console.log(`📊 Всего строк получено: ${bigRows.length}`);
    
    // Сохраняем результат большого запроса
    saveToJson(bigResult, collectionId, 'big');
    
    if (bigRows.length === TEST_CONFIG.BIG_REQUEST_LIMIT) {
      console.log(`⚠️ Достигнут лимит! Возможно, в коллекции больше ${TEST_CONFIG.BIG_REQUEST_LIMIT} строк.`);
      console.log('💡 Используйте пагинацию для получения всех данных.');
    } else if (bigRows.length > 0) {
      console.log(`✅ Все строки коллекции получены (${bigRows.length} шт.)`);
    }
    
    // ========== АНАЛИЗ РАЗМЕРА ДАННЫХ ==========
    printSection('📏 АНАЛИЗ РАЗМЕРА ДАННЫХ');
    
    const dataSize = JSON.stringify(bigResult).length;
    const dataSizeKB = (dataSize / 1024).toFixed(2);
    const dataSizeMB = (dataSize / (1024 * 1024)).toFixed(2);
    
    console.log(`\n📦 Размер JSON ответа (${TEST_CONFIG.BIG_REQUEST_LIMIT} строк):`);
    console.log(`  - Байт: ${dataSize.toLocaleString()}`);
    console.log(`  - KB: ${dataSizeKB}`);
    console.log(`  - MB: ${dataSizeMB}`);
    
    if (parseFloat(dataSizeMB) > 2) {
      console.log('\n⚠️ ВНИМАНИЕ: Размер данных превышает 2MB!');
      console.log('💡 Рекомендация: Используйте пагинацию и добавьте в route.ts:');
      console.log('   export const dynamic = "force-dynamic";');
      console.log('   export const revalidate = 0;');
    } else {
      console.log('\n✅ Размер данных в пределах нормы (<2MB)');
    }
    
    // ========== РЕКОМЕНДАЦИИ ДЛЯ КОДА ==========
    printSection('💡 РЕКОМЕНДАЦИИ ДЛЯ ИСПОЛЬЗОВАНИЯ В API ROUTES');
    
    console.log('\n📝 Базовый пример (route.ts):');
    console.log(`
import { NextResponse } from 'next/server';
import { emdCloud } from '@/lib/emd-cloud';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const db = emdCloud.database('${collectionId}');
    
    const result = await db.getRows({
      limit: 100,
      page: 0,
      useHumanReadableNames: true,
      hasOptimiseResponse: true  // Уменьшает размер ответа
    });
    
    if ('error' in result) {
      return NextResponse.json(
        { error: 'Failed to fetch data' },
        { status: 500 }
      );
    }
    
    const rows = Array.isArray(result) ? result : result.data || [];
    
    return NextResponse.json(rows, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      }
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
    `);
    
    console.log('\n📝 С пагинацией (когда строк больше 100):');
    console.log(`
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '0');
  const limit = parseInt(searchParams.get('limit') || '20');
  
  const db = emdCloud.database('${collectionId}');
  const result = await db.getRows({
    limit,
    page,
    useHumanReadableNames: true,
    hasOptimiseResponse: true  // Рекомендуется для больших данных
  });
  
  const rows = Array.isArray(result) ? result : result.data || [];
  
  return NextResponse.json({
    data: rows,
    page,
    limit,
    hasMore: rows.length === limit
  });
}
    `);
    
    // ========== ИТОГИ ==========
    printSection('✅ ТЕСТ ЗАВЕРШЕН УСПЕШНО');
    
    const summary = {
      'Collection ID': collectionId,
      'Collection Name': collectionName,
      'Всего строк (в первых 100)': bigRows.length,
      'Размер данных': `${dataSizeKB} KB`,
      'Время загрузки (1 строка)': `${duration}ms`,
      'Время загрузки (100 строк)': `${bigDuration}ms`,
      'useHumanReadableNames': TEST_CONFIG.USE_HUMAN_READABLE_NAMES ? 'true ✅' : 'false',
      'hasOptimiseResponse': TEST_CONFIG.USE_OPTIMISE_RESPONSE ? 'true ✅' : 'false',
      'Сохранение в JSON': TEST_CONFIG.SAVE_TO_JSON ? 'включено ✅' : 'отключено'
    };
    
    console.log('\n📊 Сводка:');
    Object.entries(summary).forEach(([key, value]) => {
      console.log(`  • ${key}: ${value}`);
    });
    
    if (TEST_CONFIG.SAVE_TO_JSON) {
      console.log('\n💾 Файлы с результатами сохранены в папке test/');
      console.log('   • rows-XXXXXXXX-first-TIMESTAMP.json - первый запрос');
      console.log('   • rows-XXXXXXXX-big-TIMESTAMP.json - большой запрос');
    }
    
    console.log('\n🎉 Коллекция работает корректно!');
    console.log('📋 Используйте данные выше для настройки ваших API routes.\n');
    
  } catch (error) {
    printSection('❌ ОШИБКА ПРИ ПОЛУЧЕНИИ ДАННЫХ', '!');
    
    console.log(`\n💥 Тип ошибки: ${error.constructor.name}`);
    console.log(`📝 Сообщение: ${error.message}`);
    
    if (error.response) {
      console.log('\n📡 Ответ сервера:');
      console.log(JSON.stringify(error.response, null, 2));
    }
    
    if (error.stack) {
      console.log('\n📚 Stack trace:');
      console.log(error.stack);
    }
    
    console.log('\n💡 Возможные причины:');
    console.log('  1. Неверный Collection ID');
    console.log('  2. Проблемы с API токеном или правами доступа');
    console.log('  3. Коллекция не существует в EMD Cloud');
    console.log('  4. Проблемы с сетевым подключением');
    console.log('  5. Неверные EMD_APP_ID или EMD_API_TOKEN');
    
    console.log('\n🔧 Проверьте:');
    console.log('  • Файл .env.local содержит правильные значения');
    console.log('  • Collection ID существует в вашем EMD Cloud приложении');
    console.log('  • API токен имеет права на чтение коллекции\n');
    
    process.exit(1);
  }
}

// Запуск теста
console.log('🚀 Запуск теста получения строк из коллекции EMD Cloud');
console.log('📂 Загрузка переменных окружения из .env.local...\n');

if (!process.env.EMD_APP_ID || !process.env.EMD_API_TOKEN) {
  console.error('❌ Ошибка: Не найдены переменные окружения!');
  console.error('Убедитесь что файл .env.local содержит:');
  console.error('  - EMD_APP_ID');
  console.error('  - EMD_API_TOKEN');
  console.error('  - TEST_COLLECTION_ID (приоритетная) или TEAM_STATS_COLLECTION_ID или TOURNAMENTS_COLLECTION_ID\n');
  process.exit(1);
}

testCollectionRows()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('\n💥 Критическая ошибка:', err);
    process.exit(1);
  });
