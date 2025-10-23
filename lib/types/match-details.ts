/**
 * Типы для детальной информации о матче
 */

/**
 * Данные команды в матче (из MATCHES_TEAMS)
 */
export interface MatchTeamDetails {
  _id: string;              // ID записи MATCHES_TEAMS
  teamId: string;           // ID команды
  statusId: string | null;  // ID статуса команды (d2895775-3e14... и т.д.)
  statusDisplay: string | null; // Название статуса (Выиграл, Проиграл, Тех. поражение)
  statusColor: 'green' | 'red' | 'yellow' | null; // Цвет статуса
  proof: string | null;     // Ссылка на доказательства
  proofStatusId: string | null; // ID статуса проверки доказательств
  proofStatusDisplay: string; // Название статуса проверки (Согласен с результатом, Не согласен, Ожидает)
  proofStatusColor: 'green' | 'red' | 'yellow'; // Цвет статуса проверки
}

/**
 * Детальная информация о матче (ответ API)
 */
export interface MatchDetailsResponse {
  matchId: string;
  team1: MatchTeamDetails;
  team2: MatchTeamDetails;
}
