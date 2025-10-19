// API Route для получения списка турниров
// Используется в форме создания этапа для выбора турнира

import { NextResponse } from 'next/server';
import { emdCloud } from '@/lib/emd-cloud';

// Отключаем кэширование Next.js для этого route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const tournamentsCollectionId = process.env.TOURNAMENTS_COLLECTION_ID;
    
    if (!tournamentsCollectionId) {
      return NextResponse.json(
        { error: 'TOURNAMENTS_COLLECTION_ID не настроен' },
        { status: 500 }
      );
    }

    // Получаем список турниров
    const db = emdCloud.database(tournamentsCollectionId);
    const result: any = await db.getRows({
      limit: 100,
      page: 0,
      useHumanReadableNames: true
    });

    // Извлекаем массив данных
    const rows: any[] = Array.isArray(result) 
      ? result 
      : ('data' in result ? result.data : []);

    // Формируем минимальный список для селекта
    const tournaments = rows.map((row: any) => ({
      id: row._id,
      title: row.data?.title || 'Без названия'
    }));

    return NextResponse.json(tournaments, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
      }
    });

  } catch (error) {
    console.error('Ошибка при загрузке турниров:', error);
    return NextResponse.json(
      { error: 'Не удалось загрузить список турниров' },
      { status: 500 }
    );
  }
}
