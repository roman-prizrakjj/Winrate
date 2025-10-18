'use client';

import { useAuth } from '@/contexts/AuthContext';
import LoginModal from './LoginModal';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  // Показываем загрузку пока проверяем авторизацию
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#1A202C]">
        <div className="text-center">
          <div className="mb-4">
            <svg 
              className="animate-spin h-12 w-12 text-blue-500 mx-auto" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              ></circle>
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
          <p className="text-gray-400 text-sm">Загрузка...</p>
        </div>
      </div>
    );
  }

  // Если не авторизован - показываем модальное окно входа
  if (!isAuthenticated) {
    return <LoginModal />;
  }

  // Если авторизован - показываем контент
  return <>{children}</>;
}
