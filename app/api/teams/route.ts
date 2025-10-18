/**
 * API Route для получения списка всех команд с игроками
 * Использует ISR (Incremental Static Regeneration) с ревалидацией каждые 10 минут
 */

import { NextResponse } from 'next/server';
import { getAllTeamsWithPlayers } from '@/lib/services/teams';
import type { TeamsResponse } from '@/lib/types/teams';

// ISR: кэш на 10 минут (600 секунд)
export const revalidate = 600;

/**
 * GET /api/teams
 * Возвращает список всех команд с игроками
 */
export async function GET() {
  try {
    const startTime = Date.now();
    
    // Загрузка данных через SDK
    const teams = await getAllTeamsWithPlayers();
    
    const duration = Date.now() - startTime;
    console.log(`[API /teams] Загружено команд: ${teams.length} за ${duration}ms`);
    
    // Формирование ответа
    const response: TeamsResponse = {
      teams,
      total: teams.length,
      timestamp: new Date().toISOString(),
      source: 'sdk',
    };
    
    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
      },
    });
    
  } catch (error) {
    console.error('[API /teams] Ошибка загрузки команд:', error);
    
    return NextResponse.json(
      {
        error: 'Не удалось загрузить список команд',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
