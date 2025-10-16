"use client";

import MatchCard, { MatchCardProps } from "./MatchCard";

export interface Match extends Omit<MatchCardProps, 'onViewDetails'> {
  id: string;
  gameIcon?: string; // URL для иконки игры (deprecated, используйте discipline)
  discipline: string; // Название дисциплины из disciplines.ts
}

interface MatchListProps {
  matches: Match[];
  onMatchDetails?: (matchId: string) => void;
  onUpdateMatch?: (matchId: string, newTeam1: string, newTeam2: string) => void;
}

export default function MatchList({ matches, onMatchDetails, onUpdateMatch }: MatchListProps) {
  const handleViewDetails = (matchId: string) => {
    if (onMatchDetails) {
      onMatchDetails(matchId);
    } else {
      console.log(`Просмотр деталей матча: ${matchId}`);
    }
  };

  const handleUpdateMatch = (matchId: string, newTeam1: string, newTeam2: string) => {
    if (onUpdateMatch) {
      onUpdateMatch(matchId, newTeam1, newTeam2);
    } else {
      console.log(`Обновление матча ${matchId}: ${newTeam1} vs ${newTeam2}`);
    }
  };

  return (
    <div className="
      grid grid-cols-1 md:grid-cols-2 
      gap-5 w-full
    ">
      {matches.map((match) => (
        <MatchCard
          key={match.id}
          team1={match.team1}
          team2={match.team2}
          tournament={match.tournament}
          datetime={match.datetime}
          discipline={match.discipline}
          gameIcon={match.gameIcon}
          onViewDetails={() => handleViewDetails(match.id)}
          onUpdateMatch={(newTeam1, newTeam2) => handleUpdateMatch(match.id, newTeam1, newTeam2)}
        />
      ))}
    </div>
  );
}