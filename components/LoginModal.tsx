'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginModal() {
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Сброс ошибки
    setError('');
    
    // Валидация
    if (!email || !password) {
      setError('Заполните все поля');
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(email, password);
      
      if (!result.success) {
        // Показываем конкретную ошибку от сервера
        const errorMsg = result.error || 'Ошибка авторизации';
        setError(errorMsg);
        console.log('⚠️ Ошибка входа:', errorMsg);
      }
      // Если успех - модальное окно скроется автоматически (isAuthenticated станет true)
    } catch (err: any) {
      // Обрабатываем сетевые ошибки
      const errorMsg = err.message || 'Произошла ошибка. Попробуйте позже.';
      setError(errorMsg);
      console.error('❌ Критическая ошибка при входе:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSubmit(e as any);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="
        w-full max-w-md mx-4
        bg-[#2D3748] border-2 border-[#4A5568] rounded-[16px]
        shadow-2xl
        p-8
        animate-in fade-in zoom-in duration-300
      ">
        {/* Заголовок */}
        <div className="mb-8 text-center">
          <div className="mb-2">
            <span className="text-4xl">🏆</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Winrate Dashboard
          </h1>
          <p className="text-gray-400 text-sm">
            Войдите для доступа к аналитике
          </p>
        </div>

        {/* Форма */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              autoFocus
              placeholder="admin@university.ru"
              className="
                w-full px-4 py-3
                bg-[#1A202C] border border-[#4A5568] rounded-[8px]
                text-white placeholder-gray-500
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all
              "
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Пароль
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder="••••••••"
              className="
                w-full px-4 py-3
                bg-[#1A202C] border border-[#4A5568] rounded-[8px]
                text-white placeholder-gray-500
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all
              "
            />
          </div>

          {/* Ошибка */}
          {error && (
            <div className="
              px-4 py-3 rounded-[8px]
              bg-red-500/20 border-2 border-red-500/50
              text-red-300 text-sm font-medium
              animate-in fade-in slide-in-from-top-2 duration-200
              flex items-start gap-2
            ">
              <span className="text-red-400 text-lg flex-shrink-0">⚠️</span>
              <span className="flex-1">{error}</span>
            </div>
          )}

          {/* Кнопка входа */}
          <button
            type="submit"
            disabled={isLoading}
            className="
              w-full px-4 py-3
              bg-gradient-to-r from-blue-600 to-purple-600
              hover:from-blue-700 hover:to-purple-700
              disabled:from-gray-600 disabled:to-gray-700
              text-white font-medium rounded-[8px]
              transition-all duration-200
              disabled:cursor-not-allowed
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#2D3748]
              shadow-lg hover:shadow-xl
            "
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Вход...
              </span>
            ) : (
              '🔐 Войти'
            )}
          </button>
        </form>

        {/* Подсказка */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>Используйте учетные данные EMD Cloud</p>
        </div>
      </div>
    </div>
  );
}
