import { NextResponse } from 'next/server';

// Отключаем кэширование
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST() {
  try {
    console.log('👋 Выход из системы');

    // Создаем ответ
    const response = NextResponse.json({
      success: true,
      message: 'Выход выполнен успешно'
    });

    // Удаляем токен из cookies
    response.cookies.delete('auth_token');

    return response;

  } catch (error) {
    console.error('❌ Ошибка при выходе:', error);
    return NextResponse.json(
      { error: 'Ошибка при выходе' },
      { status: 500 }
    );
  }
}
