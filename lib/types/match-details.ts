/**
 * Типы для детальной информации о матче
 */

/**
 * Данные команды в матче (из MATCHES_TEAMS)
 */
export interface MatchTeamDetails {
  _id: string;              // ID записи MATCHES_TEAMS
  teamId: string;           // ID команды
  status: string | null;    // WIN/LOSS или null
  proof: string | null;     // Ссылка на доказательства
  proofStatus: string | null; // Статус проверки доказательств
}

/**
 * Детальная информация о матче (ответ API)
 */
export interface MatchDetailsResponse {
  matchId: string;
  team1: MatchTeamDetails;
  team2: MatchTeamDetails;
}
