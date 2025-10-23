import { NextRequest, NextResponse } from "next/server";
import { EmdCloud, AppEnvironment, AuthType } from '@emd-cloud/sdk';
import { getTeamMatchStatus } from '@/lib/team-match-statuses';
import { getProofStatus } from '@/lib/proof-statuses';

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
    const team1StatusId = teams[0].data?.status || null;
    const team2StatusId = teams[1].data?.status || null;
    const team1ProofStatusId = teams[0].data?.proof_status || null;
    const team2ProofStatusId = teams[1].data?.proof_status || null;

    const team1Status = team1StatusId ? getTeamMatchStatus(team1StatusId) : null;
    const team2Status = team2StatusId ? getTeamMatchStatus(team2StatusId) : null;
    const team1ProofStatus = getProofStatus(team1ProofStatusId);
    const team2ProofStatus = getProofStatus(team2ProofStatusId);

    const team1Data = {
      _id: teams[0]._id,
      teamId: teams[0].data?.team || "",
      statusId: team1StatusId,
      statusDisplay: team1Status?.displayName || null,
      statusColor: team1Status?.color || null,
      proof: teams[0].data?.proof || null,
      proofStatusId: team1ProofStatusId,
      proofStatusDisplay: team1ProofStatus.displayName,
      proofStatusColor: team1ProofStatus.color,
    };

    const team2Data = {
      _id: teams[1]._id,
      teamId: teams[1].data?.team || "",
      statusId: team2StatusId,
      statusDisplay: team2Status?.displayName || null,
      statusColor: team2Status?.color || null,
      proof: teams[1].data?.proof || null,
      proofStatusId: team2ProofStatusId,
      proofStatusDisplay: team2ProofStatus.displayName,
      proofStatusColor: team2ProofStatus.color,
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
