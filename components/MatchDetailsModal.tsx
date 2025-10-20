"use client";

import { useState, useEffect } from "react";
import type { MatchDetailsResponse } from "@/lib/types/match-details";

interface MatchDetailsModalProps {
  matchId: string;
  team1Name: string;
  team2Name: string;
  onClose: () => void;
}

export default function MatchDetailsModal({
  matchId,
  team1Name,
  team2Name,
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
                  {details.team1.status && (
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${
                        details.team1.status === "WIN"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {details.team1.status === "WIN" ? "Победа" : "Поражение"}
                    </span>
                  )}
                </h3>

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
                        details.team1.proofStatus === "approved"
                          ? "bg-green-500/20 text-green-400"
                          : details.team1.proofStatus === "rejected"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {details.team1.proofStatus === "approved"
                        ? "Проверено ✓"
                        : details.team1.proofStatus === "rejected"
                        ? "Отклонено ✗"
                        : "Ожидает проверки"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Команда 2 */}
              <div className="bg-[#1A1F2E] rounded-lg p-4 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  🏆 {team2Name}
                  {details.team2.status && (
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${
                        details.team2.status === "WIN"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {details.team2.status === "WIN" ? "Победа" : "Поражение"}
                    </span>
                  )}
                </h3>

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
                        details.team2.proofStatus === "approved"
                          ? "bg-green-500/20 text-green-400"
                          : details.team2.proofStatus === "rejected"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {details.team2.proofStatus === "approved"
                        ? "Проверено ✓"
                        : details.team2.proofStatus === "rejected"
                        ? "Отклонено ✗"
                        : "Ожидает проверки"}
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
