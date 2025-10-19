// API Route для получения списка этапов по турниру
// Используется в форме создания тура для каскадного выбора этапов

import { NextResponse } from 'next/server';
import { emdCloud } from '@/lib/emd-cloud';

// 🔥 Отключаем кэширование для горячих данных (см. docs/caching-guide.md)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tournamentId = searchParams.get('tournamentId');

    if (!tournamentId) {
      return NextResponse.json(
        { error: 'Параметр tournamentId обязателен' },
        { status: 400 }
      );
    }

    const stagesCollectionId = process.env.STAGES_COLLECTION_ID;
    
    if (!stagesCollectionId) {
      return NextResponse.json(
        { error: 'STAGES_COLLECTION_ID не настроен' },
        { status: 500 }
      );
    }

    // Получаем ВСЕ этапы (SDK не поддерживает фильтрацию по вложенным полям)
    const db = emdCloud.database(stagesCollectionId);
    const result: any = await db.getRows({
      limit: 100,
      page: 0,
      useHumanReadableNames: true
    });

    // Извлекаем массив данных
    const rows: any[] = Array.isArray(result) 
      ? result 
      : ('data' in result ? result.data : []);

    // Фильтруем этапы по турниру на стороне сервера
    const filteredRows = rows.filter((row: any) => {
      const rowTournamentId = row.data?.tournament?._id || row.data?.tournament;
      return rowTournamentId === tournamentId;
    });

    // Формируем список для селекта с сортировкой по order
    const stages = filteredRows
      .map((row: any) => ({
        id: row._id,
        title: row.data?.title || 'Без названия',
        order: row.data?.order || 0
      }))
      .sort((a, b) => a.order - b.order); // Сортируем по порядковому номеру

    return NextResponse.json(stages, {
      headers: {
        // 🔥 Запрещаем кэширование на всех уровнях (см. docs/caching-guide.md)
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
      }
    });

  } catch (error) {
    console.error('Ошибка при загрузке этапов:', error);
    return NextResponse.json(
      { error: 'Не удалось загрузить список этапов' },
      { status: 500 }
    );
  }
}
