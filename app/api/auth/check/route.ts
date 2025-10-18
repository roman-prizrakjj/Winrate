import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Отключаем кэширование
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Простая функция для декодирования JWT (без проверки подписи)
function parseJWT(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      Buffer.from(base64, 'base64')
        .toString()
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export async function GET() {
  try {
    // Получаем токен из cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    // Если токена нет - пользователь не авторизован
    if (!token) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    console.log('🔍 Проверка токена авторизации...');

    // Декодируем JWT токен
    const payload = parseJWT(token);
    
    if (!payload) {
      console.error('❌ Не удалось декодировать токен');
      const response = NextResponse.json(
        { authenticated: false, error: 'Невалидный токен' },
        { status: 401 }
      );
      response.cookies.delete('auth_token');
      return response;
    }

    // Проверяем срок действия токена
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      console.error('❌ Токен истек');
      const response = NextResponse.json(
        { authenticated: false, error: 'Токен истек' },
        { status: 401 }
      );
      response.cookies.delete('auth_token');
      return response;
    }

    // Токен валиден
    console.log('✅ Токен валиден');

    return NextResponse.json({
      authenticated: true,
      user: {
        id: payload.userId || payload.sub || payload.id,
        email: payload.email || payload.login,
        firstName: payload.firstName || payload.first_name || '',
        lastName: payload.lastName || payload.last_name || '',
        nickname: payload.nickname || payload.customFields?.nickname || '',
        role: payload.customFields?.role || payload.role || 'player'
      }
    });

  } catch (error: any) {
    console.error('❌ Критическая ошибка при проверке авторизации:', error.message || error);
    
    // При ошибке удаляем токен и просим войти заново
    const response = NextResponse.json(
      { authenticated: false, error: 'Ошибка проверки токена. Войдите снова.' },
      { status: 500 }
    );
    response.cookies.delete('auth_token');
    
    return response;
  }
}
