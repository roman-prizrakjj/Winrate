import axios from 'axios';

// Настройте базовый URL вашего API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://your-api-url.com';

// Создаем экземпляр axios с базовой конфигурацией
const apiClient = axios.create({
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

// DEPRECATED: Этот файл оставлен для обратной совместимости
// Используйте новую структуру: import { ... } from '@/lib/api'
// или напрямую: import { ... } from '@/lib/api/tournaments'

// Реэкспорт из новой структуры для обратной совместимости
export { getTournaments, clearTournamentsCache } from './api/tournaments';
export type { Tournament } from './api/tournaments';

// Примеры API функций (старый код)
export const api = {
  // Получить данные для Dashboard 1
  getDashboard1Data: async () => {
    try {
      const response = await apiClient.get('/dashboard-1');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard 1 data:', error);
      throw error;
    }
  },

  // Получить данные для Dashboard 2
  getDashboard2Data: async () => {
    try {
      const response = await apiClient.get('/dashboard-2');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard 2 data:', error);
      throw error;
    }
  },

  // Пример POST запроса
  postData: async (endpoint: string, data: any) => {
    try {
      const response = await apiClient.post(endpoint, data);
      return response.data;
    } catch (error) {
      console.error(`Error posting data to ${endpoint}:`, error);
      throw error;
    }
  },
};

export default apiClient;
