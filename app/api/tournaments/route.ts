// API Route для получения списка турниров из MongoDB через EMD Cloud SDK
// GET /api/tournaments

import { NextResponse } from 'next/server';
import { emdCloud, COLLECTIONS } from '@/lib/emd-cloud';

// Отключаем кэширование Next.js для этого route (данные >2MB)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // Проверяем наличие ID коллекции
    if (!COLLECTIONS.TOURNAMENTS) {
      console.error('❌ TOURNAMENTS_COLLECTION_ID не установлен');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    console.log('🔄 Загружаем турниры через SDK...');

    // Создаем экземпляр базы данных для коллекции турниров
    const db = emdCloud.database(COLLECTIONS.TOURNAMENTS);

    // Получаем данные через SDK
    const result = await db.getRows({
      limit: 100,
      page: 0,
      useHumanReadableNames: true
    });

    // Проверяем на ошибку сервера
    if ('error' in result) {
      console.error('❌ Ошибка SDK:', result.error);
      return NextResponse.json(
        { error: 'Failed to fetch tournaments' },
        { status: 500 }
      );
    }

    // Получаем массив данных
    const rows: any[] = Array.isArray(result) ? result : ('data' in result ? (result.data as any[]) : []);

    console.log(`✅ Получено турниров: ${rows.length}`);

    // Очистка данных - оставляем только _id и title
    const cleanRows = rows.map((item: any) => ({
      _id: item._id,
      title: item.data?.title ?? "Без названия"
    }));

    // Возвращаем с HTTP кэшированием
    return NextResponse.json(cleanRows, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      }
    });

  } catch (error) {
    console.error('❌ Ошибка при получении турниров:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
