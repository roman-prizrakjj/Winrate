// Детальный тест авторизации EMD Cloud с анализом возвращаемых данных
// Показывает всю структуру ответа при успешном логине

const { EmdCloud, AppEnvironment, AuthType } = require('@emd-cloud/sdk');
require('dotenv').config({ path: '.env.local' });

// Инициализация SDK
const emdCloud = new EmdCloud({
  environment: AppEnvironment.Server,
  appId: process.env.EMD_APP_ID,
  apiToken: process.env.EMD_API_TOKEN,
  defaultAuthType: AuthType.ApiToken
});

// Функция для красивого вывода
function printSection(title, char = '=') {
  console.log('\n' + char.repeat(70));
  console.log(`  ${title}`);
  console.log(char.repeat(70));
}

function printSubSection(title) {
  console.log('\n' + '-'.repeat(70));
  console.log(`  ${title}`);
  console.log('-'.repeat(70));
}

// Функция для парсинга JWT токена
function parseJWT(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = Buffer.from(parts[1], 'base64').toString('utf-8');
    return JSON.parse(payload);
  } catch (e) {
    return null;
  }
}

// Главная функция теста
async function testLogin() {
  printSection('🔐 ТЕСТ АВТОРИЗАЦИИ EMD CLOUD', '=');
  
  // ⚠️ ВСТАВЬТЕ СВОИ УЧЕТНЫЕ ДАННЫЕ ЗДЕСЬ!
  const testEmail = 'rslahta@emd.one';
  const testPassword = 'Romka1914';
  
  console.log(`\n📧 Email: ${testEmail}`);
  console.log(`🔑 Password: ${'*'.repeat(testPassword.length)}`);
  console.log(`🌐 EMD APP ID: ${process.env.EMD_APP_ID}`);
  
  try {
    console.log('\n⏳ Отправка запроса авторизации...');
    const startTime = Date.now();
    
    const result = await emdCloud.auth.login({
      login: testEmail,
      password: testPassword
    });
    
    const duration = Date.now() - startTime;
    console.log(`✅ Авторизация успешна! (${duration}ms)`);
    
    // ========== ПОЛНЫЙ ОТВЕТ ==========
    printSection('📦 ПОЛНЫЙ ОТВЕТ ОТ EMD CLOUD SDK');
    console.log(JSON.stringify(result, null, 2));
    
    // ========== АНАЛИЗ СТРУКТУРЫ ==========
    printSection('🔍 АНАЛИЗ СТРУКТУРЫ ОТВЕТА');
    
    // Ключи верхнего уровня
    printSubSection('Ключи в корне объекта');
    Object.keys(result).forEach(key => {
      const value = result[key];
      const type = typeof value;
      const isObject = type === 'object' && value !== null;
      const isArray = Array.isArray(value);
      
      if (isArray) {
        console.log(`  ✓ ${key}: Array[${value.length}]`);
      } else if (isObject) {
        console.log(`  ✓ ${key}: Object {${Object.keys(value).length} keys}`);
      } else {
        const preview = type === 'string' && value.length > 50 
          ? value.substring(0, 50) + '...' 
          : value;
        console.log(`  ✓ ${key}: ${type} = ${preview}`);
      }
    });
    
    // ========== ТОКЕН ==========
    printSection('🎫 ИНФОРМАЦИЯ О ТОКЕНЕ');
    
    const token = result.token || result.accessToken || result.authToken;
    
    if (token) {
      console.log(`\n✅ Токен найден!`);
      console.log(`  Ключ: ${result.token ? 'token' : result.accessToken ? 'accessToken' : 'authToken'}`);
      console.log(`  Длина: ${token.length} символов`);
      console.log(`  Тип: ${typeof token}`);
      console.log(`  Начало: ${token.substring(0, 40)}...`);
      console.log(`  Конец: ...${token.substring(token.length - 20)}`);
      
      // Парсим JWT
      const payload = parseJWT(token);
      if (payload) {
        printSubSection('📋 Декодированный JWT Payload');
        console.log(JSON.stringify(payload, null, 2));
        
        // Анализ срока действия
        if (payload.exp) {
          const expiryDate = new Date(payload.exp * 1000);
          const now = new Date();
          const daysValid = Math.floor((expiryDate - now) / (1000 * 60 * 60 * 24));
          
          console.log(`\n⏰ Срок действия токена:`);
          console.log(`  Истекает: ${expiryDate.toLocaleString('ru-RU')}`);
          console.log(`  Действителен: ${daysValid} дней`);
        }
        
        if (payload.iat) {
          const issuedDate = new Date(payload.iat * 1000);
          console.log(`  Выдан: ${issuedDate.toLocaleString('ru-RU')}`);
        }
      } else {
        console.log('\n⚠️ Не удалось декодировать JWT токен');
      }
    } else {
      console.log('\n❌ Токен НЕ найден в ответе!');
      console.log('Проверьте структуру ответа выше.');
    }
    
    // ========== ДАННЫЕ ПОЛЬЗОВАТЕЛЯ ==========
    printSection('👤 ДАННЫЕ ПОЛЬЗОВАТЕЛЯ');
    
    const user = result.user || result;
    
    if (result.user) {
      console.log('\n✅ Объект "user" найден в ответе');
      printSubSection('Структура объекта user');
      console.log(JSON.stringify(result.user, null, 2));
    } else {
      console.log('\n⚠️ Отдельного объекта "user" нет, данные в корне ответа');
    }
    
    printSubSection('Извлеченные поля пользователя');
    
    const userInfo = {
      id: user._id || user.id,
      email: user.login || user.email,
      firstName: user.firstName || user.first_name || '',
      lastName: user.lastName || user.last_name || '',
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      accountStatus: user.accountStatus,
      accountVerified: user.accountVerified,
      space: user.space,
      level: user.level,
      points: user.points
    };
    
    Object.entries(userInfo).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        console.log(`  ✓ ${key}: ${value}`);
      } else {
        console.log(`  ✗ ${key}: (нет данных)`);
      }
    });
    
    // ========== CUSTOM FIELDS ==========
    if (user.customFields) {
      printSection('🎨 CUSTOM FIELDS (Пользовательские поля)');
      console.log(JSON.stringify(user.customFields, null, 2));
      
      printSubSection('Анализ customFields');
      Object.entries(user.customFields).forEach(([key, value]) => {
        const display = typeof value === 'string' && value 
          ? `"${value}"` 
          : value || '(пусто)';
        console.log(`  • ${key}: ${display}`);
      });
      
      // Специальная проверка роли
      if (user.customFields.role) {
        console.log(`\n🎭 Роль пользователя: ${user.customFields.role}`);
      }
      
      if (user.customFields.nickname) {
        console.log(`🏷️  Никнейм: ${user.customFields.nickname}`);
      }
    } else {
      printSection('🎨 CUSTOM FIELDS');
      console.log('  ❌ customFields не найдены');
    }
    
    // ========== LINKED ACCOUNTS ==========
    if (user.linkedAccounts && Object.keys(user.linkedAccounts).length > 0) {
      printSection('🔗 СВЯЗАННЫЕ АККАУНТЫ');
      console.log(JSON.stringify(user.linkedAccounts, null, 2));
    }
    
    // ========== GET USER DETAILS ==========
    printSection('🔍 ПОЛУЧЕНИЕ ДЕТАЛЕЙ ПОЛЬЗОВАТЕЛЯ (getUserDetails)');
    
    try {
      // Извлекаем ID пользователя
      const userId = user._id || user.id;
      console.log(`\n📌 ID пользователя: ${userId}`);
      console.log('⏳ Запрашиваем детальную информацию...');
      
      // Устанавливаем токен для авторизованных запросов
      if (token) {
        emdCloud.setAuthToken(token);
        console.log('✅ Токен установлен для SDK');
      }
      
      // Получаем детали пользователя
      const userDetailsStart = Date.now();
      const userDetails = await emdCloud.user.getUserDetails(userId);
      const userDetailsDuration = Date.now() - userDetailsStart;
      
      console.log(`✅ Детали получены! (${userDetailsDuration}ms)\n`);
      
      printSubSection('Полный ответ getUserDetails');
      console.log(JSON.stringify(userDetails, null, 2));
      
      // ========== СРАВНЕНИЕ ДАННЫХ ==========
      printSubSection('📊 Сравнение: login() vs getUserDetails()');
      
      console.log('\n🔹 Из login():');
      console.log(`  ID: ${user._id || user.id}`);
      console.log(`  Email: ${user.login || user.email}`);
      console.log(`  Имя: ${user.firstName || ''} ${user.lastName || ''}`);
      console.log(`  Никнейм: ${user.customFields?.nickname || '(не указан)'}`);
      console.log(`  Роль: ${user.customFields?.role || '(не указана)'}`);
      
      console.log('\n🔹 Из getUserDetails():');
      console.log(`  ID: ${userDetails._id || userDetails.id}`);
      console.log(`  Email: ${userDetails.login || userDetails.email}`);
      console.log(`  Имя: ${userDetails.firstName || ''} ${userDetails.lastName || ''}`);
      console.log(`  Никнейм: ${userDetails.customFields?.nickname || '(не указан)'}`);
      console.log(`  Роль: ${userDetails.customFields?.role || '(не указана)'}`);
      
      // Проверяем, есть ли разница в данных
      const hasUserObject = !!result.user;
      console.log(`\n📝 Примечание: login() возвращает ${hasUserObject ? 'объект user отдельно' : 'данные в корне ответа'}`);
      console.log(`📝 getUserDetails() возвращает тот же формат данных`);
      
      // Проверяем наличие дополнительных полей в getUserDetails
      const loginFields = Object.keys(user);
      const detailsFields = Object.keys(userDetails);
      const extraFields = detailsFields.filter(f => !loginFields.includes(f));
      
      if (extraFields.length > 0) {
        console.log(`\n🆕 Дополнительные поля в getUserDetails:`);
        extraFields.forEach(field => {
          console.log(`  • ${field}: ${userDetails[field]}`);
        });
      } else {
        console.log(`\n✅ Оба метода возвращают одинаковый набор полей`);
      }
      
      // Анализ customFields
      if (userDetails.customFields) {
        const loginCustomKeys = Object.keys(user.customFields || {});
        const detailsCustomKeys = Object.keys(userDetails.customFields);
        const extraCustomFields = detailsCustomKeys.filter(k => !loginCustomKeys.includes(k));
        
        if (extraCustomFields.length > 0) {
          console.log(`\n🆕 Дополнительные customFields в getUserDetails:`);
          extraCustomFields.forEach(key => {
            console.log(`  • ${key}: ${userDetails.customFields[key]}`);
          });
        }
      }
      
    } catch (userDetailsError) {
      console.log('\n❌ Ошибка при получении деталей пользователя:');
      console.log(`  Тип: ${userDetailsError.constructor.name}`);
      console.log(`  Сообщение: ${userDetailsError.message}`);
      
      if (userDetailsError.response) {
        console.log('  Статус:', userDetailsError.response.status);
        console.log('  Данные:', JSON.stringify(userDetailsError.response.data, null, 2));
      }
      
      console.log('\n💡 Возможные причины:');
      console.log('  • Токен не был установлен правильно');
      console.log('  • ID пользователя некорректный');
      console.log('  • Недостаточно прав доступа');
    }
    
    // ========== РЕКОМЕНДАЦИИ ДЛЯ КОДА ==========
    printSection('💡 РЕКОМЕНДАЦИИ ДЛЯ ИСПОЛЬЗОВАНИЯ В КОДЕ');
    
    console.log('\n📝 Извлечение данных при логине:');
    console.log(`
const result = await emdCloud.auth.login({ login, password });

// Токен
const token = result.token || result.accessToken;

// Данные пользователя
const user = result.user || result;
const userId = user._id || user.id;
const email = user.login || user.email;
const firstName = user.firstName || '';
const lastName = user.lastName || '';

// Роль и nickname
const role = user.customFields?.role || 'player';
const nickname = user.customFields?.nickname || '';
    `);
    
    console.log('\n📝 Сохранение для AuthContext:');
    console.log(`
const userForContext = {
  id: user._id || user.id,
  email: user.login || user.email,
  firstName: user.firstName || '',
  lastName: user.lastName || '',
  nickname: user.customFields?.nickname || '',
  role: user.customFields?.role || 'player'
};
    `);
    
    // ========== ИТОГИ ==========
    printSection('✅ ТЕСТ ЗАВЕРШЕН УСПЕШНО');
    
    const summary = {
      'Токен получен': !!token,
      'Данные пользователя': !!(user._id || user.id),
      'Email найден': !!(user.login || user.email),
      'customFields найдены': !!user.customFields,
      'Роль определена': !!(user.customFields?.role),
      'Nickname найден': !!(user.customFields?.nickname),
    };
    
    console.log('\n📊 Сводка:');
    Object.entries(summary).forEach(([key, value]) => {
      const icon = value ? '✅' : '⚠️';
      console.log(`  ${icon} ${key}`);
    });
    
    console.log('\n🎉 Авторизация работает корректно!');
    console.log('📋 Используйте данные выше для настройки вашего приложения.\n');
    
  } catch (error) {
    printSection('❌ ОШИБКА ПРИ АВТОРИЗАЦИИ', '!');
    
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
    console.log('  1. Неверный email или пароль');
    console.log('  2. Пользователь не существует в EMD Cloud');
    console.log('  3. Аккаунт заблокирован или не активирован');
    console.log('  4. Проблемы с сетевым подключением');
    console.log('  5. Неверные EMD_APP_ID или EMD_API_TOKEN');
    
    console.log('\n🔧 Проверьте:');
    console.log('  • Файл .env.local содержит правильные значения');
    console.log('  • Email и пароль в этом скрипте (строки 22-23)');
    console.log('  • Доступность api.emd.one\n');
    
    process.exit(1);
  }
}

// Запуск теста
console.log('🚀 Запуск детального теста авторизации EMD Cloud');
console.log('📂 Загрузка переменных окружения из .env.local...\n');

if (!process.env.EMD_APP_ID || !process.env.EMD_API_TOKEN) {
  console.error('❌ Ошибка: Не найдены переменные окружения!');
  console.error('Убедитесь что файл .env.local содержит:');
  console.error('  - EMD_APP_ID');
  console.error('  - EMD_API_TOKEN\n');
  process.exit(1);
}

testLogin()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('\n💥 Критическая ошибка:', err);
    process.exit(1);
  });
