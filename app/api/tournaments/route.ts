// API Route для получения списка турниров из MongoDB
// GET /api/tournaments

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiToken = process.env.MONGODB_API_TOKEN;
    const appId = process.env.MONGODB_APP_ID;
    const collectionId = process.env.TOURNAMENTS_COLLECTION_ID;

    if (!apiToken || !appId || !collectionId) {
      console.error('❌ Отсутствуют переменные окружения');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const url = `https://api.emd.one/api/${appId}/database/${collectionId}/row`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'apitoken': apiToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        search: "",
        limit: 100,
        page: 0,
        orderBy: "",
        sort: [],
        query: {
          $or: [],
          $and: []
        },
        hasOptimiseResponse: true,  // ✅ Включаем оптимизацию
        useHumanReadableNames: true
      }),
      // Отключаем Next.js кэш из-за больших данных (>2MB)
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error('❌ Ошибка MongoDB API:', response.statusText);
      return NextResponse.json(
        { error: 'Failed to fetch tournaments' },
        { status: response.status }
      );
    }

    const result = await response.json();
    const rows = result?.data || result?.rows || [];

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
