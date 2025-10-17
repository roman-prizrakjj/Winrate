// Базовый HTTP клиент для API запросов
// В будущем можно использовать вместо прямых fetch запросов

import axios from 'axios';

// Настройка базового URL (если нужен внешний API)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

// Создаем экземпляр axios с базовой конфигурацией
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 секунд
});

// Интерцептор для добавления токена авторизации (если нужен)
apiClient.interceptors.request.use(
  (config) => {
    // Добавьте токен из localStorage или cookies, если требуется
    // const token = localStorage.getItem('auth_token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Интерцептор для обработки ошибок
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Обработка ошибки авторизации
      console.error('Unauthorized access');
    }
    return Promise.reject(error);
  }
);
