"use client";

import { useState, useEffect } from "react";
import type { MatchDetailsResponse } from "@/lib/types/match-details";
import type { CaptainInfo } from "@/lib/types/captains";
import { TEAM_MATCH_STATUS_COLORS, TEAM_MATCH_STATUSES } from "@/lib/team-match-statuses";
import { PROOF_STATUS_COLORS } from "@/lib/proof-statuses";

interface MatchDetailsModalProps {
  matchId: string;
  team1Name: string;
  team2Name: string;
  captains: Record<string, CaptainInfo>;
  onClose: () => void;
}

export default function MatchDetailsModal({
  matchId,
  team1Name,
  team2Name,
  captains,
  onClose,
}: MatchDetailsModalProps) {
  const [details, setDetails] = useState<MatchDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMatchDetails() {
      try {
        setLoading(true);
        const response = await fetch(`/api/match-details/${matchId}`);
        
        if (!response.ok) {
          throw new Error("Не удалось загрузить данные матча");
        }

        const data: MatchDetailsResponse = await response.json();
        setDetails(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Произошла ошибка");
      } finally {
        setLoading(false);
      }
    }

    fetchMatchDetails();
  }, [matchId]);

  // Обработчик изменения статуса команды с оптимистичным обновлением
  const handleStatusChange = async (matchTeamId: string, newStatusId: string, isTeam1: boolean) => {
    if (!details) return;

    // Сохраняем старые данные для отката
    const previousDetails = { ...details };
    
    // Получаем новый статус из справочника
    const newStatus = Object.values(TEAM_MATCH_STATUSES).find(s => s.id === newStatusId);
    
    // Оптимистично обновляем UI сразу
    setDetails(prev => {
      if (!prev) return prev;
      
      if (isTeam1) {
        return {
          ...prev,
          team1: {
            ...prev.team1,
            statusId: newStatusId,
            statusDisplay: newStatus?.displayName || 'Статуса нет',
            statusColor: (newStatus?.color || null) as "green" | "red" | "yellow" | null
          }
        };
      } else {
        return {
          ...prev,
          team2: {
            ...prev.team2,
            statusId: newStatusId,
            statusDisplay: newStatus?.displayName || 'Статуса нет',
            statusColor: (newStatus?.color || null) as "green" | "red" | "yellow" | null
          }
        };
      }
    });

    // Отправляем запрос в фоне
    try {
      const response = await fetch('/api/match-details/update-team-status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ matchTeamId, newStatusId }),
      });

      if (!response.ok) {
        throw new Error('Не удалось обновить статус');
      }
    } catch (err) {
      console.error('Ошибка обновления статуса:', err);
      // Откатываем изменения при ошибке
      setDetails(previousDetails);
      alert('Не удалось обновить статус команды. Изменения отменены.');
    }
  };

  // Закрытие по клику на backdrop
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Закрытие по Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-[#282E3B] rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        {/* Заголовок */}
        <div className="sticky top-0 bg-[#282E3B] border-b border-white/10 p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">
            {team1Name} <span className="text-white/60">VS</span> {team2Name}
          </h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Контент */}
        <div className="p-6">
          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="text-white/60 mt-4">Загрузка данных...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {details && !loading && !error && (
            <div className="space-y-6">
              {/* Команда 1 */}
              <div className="bg-[#1A1F2E] rounded-lg p-4 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  🏆 {team1Name}
                  {/* Дропдаун выбора статуса */}
                  <select
                    key={details.team1.statusId}
                    value={details.team1.statusId || ''}
                    onChange={(e) => handleStatusChange(details.team1._id, e.target.value, true)}
                    className={`px-3 py-1 rounded text-sm font-medium border-0 cursor-pointer ${
                      details.team1.statusColor 
                        ? `${TEAM_MATCH_STATUS_COLORS[details.team1.statusColor].bg} ${TEAM_MATCH_STATUS_COLORS[details.team1.statusColor].text}`
                        : "bg-gray-500/20 text-gray-400"
                    }`}
                    style={{ backgroundColor: 'inherit' }}
                  >
                    <option value="" className="bg-[#282E3B] text-gray-300">Статуса нет</option>
                    {Object.values(TEAM_MATCH_STATUSES).map((status) => (
                      <option key={status.id} value={status.id} className="bg-[#282E3B] text-white">
                        {status.displayName}
                      </option>
                    ))}
                  </select>
                </h3>

                {/* Информация о капитане */}
                {(() => {
                  const captain = captains[details.team1.teamId];
                  return captain?.nickname ? (
                    <div className="text-white/60 text-sm mb-3">
                      👑 Капитан: <span className="text-white font-medium">{captain.nickname}</span>
                      {captain.telegram && (
                        <a
                          href={`https://t.me/${captain.telegram.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 ml-2 transition-colors"
                        >
                          📱 Telegram
                        </a>
                      )}
                    </div>
                  ) : null;
                })()}

                <div className="space-y-3">
                  <div>
                    <p className="text-white/60 text-sm mb-1">Доказательства:</p>
                    {details.team1.proof ? (
                      <a
                        href={details.team1.proof}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 underline break-all"
                      >
                        {details.team1.proof}
                      </a>
                    ) : (
                      <p className="text-white/40 italic">Не предоставлены</p>
                    )}
                  </div>

                  <div>
                    <p className="text-white/60 text-sm mb-1">Статус проверки:</p>
                    <span
                      className={`inline-block px-3 py-1 rounded text-sm ${
                        PROOF_STATUS_COLORS[details.team2.proofStatusColor].bg
                      } ${
                        PROOF_STATUS_COLORS[details.team2.proofStatusColor].text
                      }`}
                    >
                      {details.team2.proofStatusDisplay}
                    </span>
                  </div>
                </div>
              </div>

              {/* Команда 2 */}
              <div className="bg-[#1A1F2E] rounded-lg p-4 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  🏆 {team2Name}
                  {/* Дропдаун выбора статуса */}
                  <select
                    key={details.team2.statusId}
                    value={details.team2.statusId || ''}
                    onChange={(e) => handleStatusChange(details.team2._id, e.target.value, false)}
                    className={`px-3 py-1 rounded text-sm font-medium border-0 cursor-pointer ${
                      details.team2.statusColor 
                        ? `${TEAM_MATCH_STATUS_COLORS[details.team2.statusColor].bg} ${TEAM_MATCH_STATUS_COLORS[details.team2.statusColor].text}`
                        : "bg-gray-500/20 text-gray-400"
                    }`}
                    style={{ backgroundColor: 'inherit' }}
                  >
                    <option value="" className="bg-[#282E3B] text-gray-300">Статуса нет</option>
                    {Object.values(TEAM_MATCH_STATUSES).map((status) => (
                      <option key={status.id} value={status.id} className="bg-[#282E3B] text-white">
                        {status.displayName}
                      </option>
                    ))}
                  </select>
                </h3>

                {/* Информация о капитане */}
                {(() => {
                  const captain = captains[details.team2.teamId];
                  return captain?.nickname ? (
                    <div className="text-white/60 text-sm mb-3">
                      👑 Капитан: <span className="text-white font-medium">{captain.nickname}</span>
                      {captain.telegram && (
                        <a
                          href={`https://t.me/${captain.telegram.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 ml-2 transition-colors"
                        >
                          📱 Telegram
                        </a>
                      )}
                    </div>
                  ) : null;
                })()}

                <div className="space-y-3">
                  <div>
                    <p className="text-white/60 text-sm mb-1">Доказательства:</p>
                    {details.team2.proof ? (
                      <a
                        href={details.team2.proof}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 underline break-all"
                      >
                        {details.team2.proof}
                      </a>
                    ) : (
                      <p className="text-white/40 italic">Не предоставлены</p>
                    )}
                  </div>

                  <div>
                    <p className="text-white/60 text-sm mb-1">Статус проверки:</p>
                    <span
                      className={`inline-block px-3 py-1 rounded text-sm ${
                        PROOF_STATUS_COLORS[details.team1.proofStatusColor].bg
                      } ${
                        PROOF_STATUS_COLORS[details.team1.proofStatusColor].text
                      }`}
                    >
                      {details.team1.proofStatusDisplay}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Футер */}
        <div className="sticky bottom-0 bg-[#282E3B] border-t border-white/10 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}
