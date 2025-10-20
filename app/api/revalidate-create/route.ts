import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

/**
 * API route для принудительной ревалидации страницы /create
 * Используется кнопкой "Обновить" для обхода CDN кеша на Vercel
 */
export async function POST(request: NextRequest) {
  try {
    console.log('[Revalidate API] Принудительная ревалидация /create');
    
    // Ревалидируем страницу /create
    revalidatePath('/create');
    
    console.log('[Revalidate API] Успешно ревалидировано');
    
    return NextResponse.json({ 
      revalidated: true, 
      now: Date.now(),
      message: 'Страница /create успешно обновлена'
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
