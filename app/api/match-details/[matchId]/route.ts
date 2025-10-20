import { NextRequest, NextResponse } from "next/server";
import { EmdCloud, AppEnvironment, AuthType } from '@emd-cloud/sdk';

/**
 * API Route для получения детальной информации о матче
 * GET /api/match-details/[matchId]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { matchId: string } }
) {
  try {
    const { matchId } = params;

    if (!matchId) {
      return NextResponse.json(
        { error: "Match ID is required" },
        { status: 400 }
      );
    }

    // Инициализация SDK клиента
    const client = new EmdCloud({
      environment: AppEnvironment.Server,
      appId: process.env.EMD_APP_ID!,
      apiToken: process.env.EMD_API_TOKEN!,
      defaultAuthType: AuthType.ApiToken,
    });

    const matchesCollectionId = process.env.MATCHES_COLLECTION_ID;
    if (!matchesCollectionId) {
      throw new Error('MATCHES_COLLECTION_ID не настроен');
    }

    const db = client.database(matchesCollectionId);

    // Загружаем конкретный матч по ID
    const matchResponse = await db.getRow(matchId, {
      useHumanReadableNames: true,
    });

    if (!matchResponse) {
      console.log(`[API] Match not found: ${matchId}`);
      return NextResponse.json(
        { error: "Match not found" },
        { status: 404 }
      );
    }

    console.log(`[API] Match loaded: ${matchId}`);

    // Приводим к нужному типу
    const match = matchResponse as any;
    const teams = match.data?.teams || [];

    if (teams.length < 2) {
      return NextResponse.json(
        { error: "Match teams data is incomplete" },
        { status: 400 }
      );
    }

    // Извлекаем данные команд
    const team1Data = {
      _id: teams[0]._id,
      teamId: teams[0].data?.team || "",
      status: teams[0].data?.status || null,
      proof: teams[0].data?.proof || null,
      proofStatus: teams[0].data?.proof_status || null,
    };

    const team2Data = {
      _id: teams[1]._id,
      teamId: teams[1].data?.team || "",
      status: teams[1].data?.status || null,
      proof: teams[1].data?.proof || null,
      proofStatus: teams[1].data?.proof_status || null,
    };

    return NextResponse.json({
      matchId,
      team1: team1Data,
      team2: team2Data,
    });
  } catch (error) {
    console.error("Error fetching match details:", error);
    return NextResponse.json(
      { error: "Failed to fetch match details" },
      { status: 500 }
    );
  }
}
