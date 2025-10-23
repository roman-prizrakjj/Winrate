import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

/**
 * API route для принудительной ревалидации страницы /tournaments
 * Используется кнопкой "Обновить" для обхода CDN кеша на Vercel
 */
export async function POST(request: NextRequest) {
  try {
    console.log('[Revalidate API] Принудительная ревалидация /tournaments');
    
    // Ревалидируем страницу /tournaments
    revalidatePath('/tournaments');
    
    console.log('[Revalidate API] Успешно ревалидировано');
    
    return NextResponse.json({ 
      revalidated: true, 
      now: Date.now(),
      message: 'Страница /tournaments успешно обновлена'
    });
  } catch (err) {
    console.error('[Revalidate API] Ошибка ревалидации:', err);
    
    return NextResponse.json({ 
      revalidated: false, 
      error: 'Ошибка при обновлении страницы',
      details: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 });
  }
}
