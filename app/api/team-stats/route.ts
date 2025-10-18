// API Route для получения статистики команд из MongoDB через EMD Cloud SDK
// GET /api/team-stats

import { NextResponse } from 'next/server';
import { emdCloud, COLLECTIONS } from '@/lib/emd-cloud';

// Отключаем кэширование Next.js для этого route (данные >2MB)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // Проверяем наличие ID коллекции
    if (!COLLECTIONS.TEAM_STATS) {
      console.error('❌ TEAM_STATS_COLLECTION_ID не установлен');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    console.log('🔄 Загружаем статистику команд через SDK...');

    // Создаем экземпляр базы данных для коллекции статистики
    const db = emdCloud.database(COLLECTIONS.TEAM_STATS);

    // Загружаем все страницы (пагинация по 100 записей)
    const allRows: any[] = [];
    let page = 0;
    let hasMore = true;

    while (hasMore) {
      const result = await db.getRows({
        limit: 100,
        page: page,
        useHumanReadableNames: true
      });

      // Проверяем на ошибку сервера
      if ('error' in result) {
        console.error('❌ Ошибка SDK:', result.error);
        return NextResponse.json(
          { error: 'Failed to fetch team stats' },
          { status: 500 }
        );
      }

      // Получаем массив данных
      const rows: any[] = Array.isArray(result) ? result : ('data' in result ? (result.data as any[]) : []);

      allRows.push(...rows);
      console.log(`📄 Страница ${page + 1}: загружено ${rows.length} записей`);

      // Если получили меньше 100 - это последняя страница
      hasMore = rows.length === 100;
      page++;
    }

    console.log(`✅ Всего загружено записей: ${allRows.length}`);

    // Очистка и маппинг данных
    const cleanRows = allRows.map((item: any) => ({
      id: item.data?.team?._id || item._id,
      name: item.data?.team?.data?.name || "Неизвестная команда",
      wins: item.data?.win || 0,
      losses: item.data?.loss || 0,
      draws: 0,  // В MongoDB нет draws пока
      i: 0,      // Пока не используется
      cb: item.data?.buchholz || 0,
      s: item.data?.score || 0,
      // Дополнительные данные для фильтрации (не отображаем, но доступны)
      stage: item.data?.stage?.data?.title || "",
      tournamentTeamId: item.data?.tournament_team?._id || ""
    }));

    // Возвращаем с HTTP кэшированием (5 минут)
    return NextResponse.json(cleanRows, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      }
    });

  } catch (error) {
    console.error('❌ Ошибка при получении статистики команд:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
