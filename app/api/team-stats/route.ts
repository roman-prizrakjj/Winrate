// API Route для получения статистики команд из MongoDB
// GET /api/team-stats

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiToken = process.env.MONGODB_API_TOKEN;
    const appId = process.env.MONGODB_APP_ID;
    const collectionId = process.env.TEAM_STATS_COLLECTION_ID;

    if (!apiToken || !appId || !collectionId) {
      console.error('❌ Отсутствуют переменные окружения');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const url = `https://api.emd.one/api/${appId}/database/${collectionId}/row`;

    console.log('🔄 Загружаем статистику команд...');

    // Загружаем все страницы (пагинация по 100 записей)
    const allRows: any[] = [];
    let page = 0;
    let hasMore = true;

    while (hasMore) {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'apitoken': apiToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          search: "",
          limit: 100,
          page: page,
          orderBy: "",
          sort: [],
          query: {
            $or: [],
            $and: []
          },
          hasOptimiseResponse: true,  // ✅ Включаем оптимизацию
          useHumanReadableNames: true
        }),
        // Отключаем Next.js кэш из-за больших данных
        cache: 'no-store'
      });

      if (!response.ok) {
        console.error('❌ Ошибка MongoDB API:', response.statusText);
        return NextResponse.json(
          { error: 'Failed to fetch team stats' },
          { status: response.status }
        );
      }

      const result = await response.json();
      const rows = result?.data || result?.rows || [];

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
