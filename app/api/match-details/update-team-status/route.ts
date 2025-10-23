import { NextRequest, NextResponse } from 'next/server';
import { emdCloud } from '@/lib/emd-cloud';

// Column ID для поля статуса в коллекции MATCHES_TEAMS
const STATUS_FIELD_ID = 'col_136f81c514';

export async function PUT(request: NextRequest) {
  try {
    const { matchTeamId, newStatusId } = await request.json();

    if (!matchTeamId || !newStatusId) {
      return NextResponse.json(
        { error: 'matchTeamId и newStatusId обязательны' },
        { status: 400 }
      );
    }

    // Получаем ID коллекции MATCHES_TEAMS
    const matchesTeamsCollectionId = process.env.MATCHES_TEAMS_COLLECTION_ID;
    if (!matchesTeamsCollectionId) {
      return NextResponse.json(
        { error: 'MATCHES_TEAMS_COLLECTION_ID не настроен' },
        { status: 500 }
      );
    }

    // Обновляем статус команды через EMD Cloud SDK
    const db = emdCloud.database(matchesTeamsCollectionId);
    await db.updateRow(matchTeamId, {
      [STATUS_FIELD_ID]: newStatusId
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Ошибка обновления статуса команды:', error);
    return NextResponse.json(
      { error: 'Не удалось обновить статус' },
      { status: 500 }
    );
  }
}
