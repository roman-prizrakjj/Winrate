import { NextResponse } from 'next/server';
import { emdCloud } from '@/lib/emd-cloud';

// Отключаем кэширование для авторизации
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    // Получаем данные из запроса
    const { email, password } = await request.json();

    // Валидация входных данных
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email и пароль обязательны' },
        { status: 400 }
      );
    }

    // Проверяем формат email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Неверный формат email' },
        { status: 400 }
      );
    }

    console.log('🔐 Попытка входа:', email);

    // Вызываем SDK для авторизации с обработкой ошибок
    let result;
    try {
      result = await emdCloud.auth.login({
        login: email,
        password: password
      });
    } catch (error: any) {
      // Обрабатываем ошибки от SDK
      console.error('❌ Ошибка при вызове EMD Cloud SDK:', error.message || error);
      
      let errorMessage = 'Ошибка авторизации';
      const errorStr = String(error.message || error).toLowerCase();
      
      // Определяем тип ошибки для пользователя
      if (errorStr.includes('incorrect login') || errorStr.includes('incorrect password')) {
        errorMessage = 'Неверный email или пароль';
        console.log('⚠️ Неверные учетные данные для:', email);
      } else if (errorStr.includes('user not found')) {
        errorMessage = 'Пользователь не найден';
        console.log('⚠️ Пользователь не существует:', email);
      } else if (errorStr.includes('blocked') || errorStr.includes('disabled')) {
        errorMessage = 'Аккаунт заблокирован';
        console.log('⚠️ Аккаунт заблокирован:', email);
      } else if (errorStr.includes('network') || errorStr.includes('fetch')) {
        errorMessage = 'Нет связи с сервером авторизации';
        console.error('🌐 Проблема с сетью при подключении к EMD Cloud');
      } else if (errorStr.includes('internal server error')) {
        errorMessage = 'Внутренняя ошибка сервера авторизации';
        console.error('🔥 Internal Server Error от EMD Cloud');
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 401 }
      );
    }

    // Проверяем на ошибку в результате (дополнительная проверка)
    if (!result || 'error' in result) {
      console.error('❌ Ошибка в результате SDK:', result ? (result as any).error : 'Нет результата');
      
      let errorMessage = 'Ошибка авторизации';
      if (result && (result as any).error) {
        const errorStr = String((result as any).error).toLowerCase();
        
        if (errorStr.includes('credentials') || errorStr.includes('password')) {
          errorMessage = 'Неверный email или пароль';
        } else if (errorStr.includes('not found')) {
          errorMessage = 'Пользователь не найден';
        } else if (errorStr.includes('blocked') || errorStr.includes('disabled')) {
          errorMessage = 'Аккаунт заблокирован';
        }
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 401 }
      );
    }

    // Успешная авторизация
    console.log('✅ Успешный вход:', email);

    // Извлекаем токен и данные пользователя
    const token = (result as any).token || (result as any).accessToken;
    const user = (result as any).user || result;

    if (!token) {
      console.error('❌ Токен не получен от EMD Cloud');
      return NextResponse.json(
        { error: 'Ошибка получения токена' },
        { status: 500 }
      );
    }

    // Создаем ответ с данными пользователя
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id || user._id,
        email: user.email || user.login,
        firstName: user.firstName || user.first_name,
        lastName: user.lastName || user.last_name,
        role: user.role || 'user'
      }
    });

    // Сохраняем токен в HTTP-only cookie (безопасно от XSS)
    response.cookies.set('auth_token', token, {
      httpOnly: true, // Недоступен для JavaScript
      secure: process.env.NODE_ENV === 'production', // HTTPS только в продакшене
      sameSite: 'lax', // Защита от CSRF
      maxAge: 60 * 60 * 24 * 7, // 7 дней
      path: '/' // Доступен для всех маршрутов
    });

    return response;

  } catch (error: any) {
    // Финальный catch для неожиданных ошибок
    console.error('❌ Критическая неожиданная ошибка при авторизации:', error.message || error);
    console.error('📍 Stack trace:', error.stack);
    
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера. Попробуйте позже.' },
      { status: 500 }
    );
  }
}
