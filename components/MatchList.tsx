"use client";

import MatchCard from "./MatchCard";
import { AdaptedMatch } from "@/lib/types/matches";

interface MatchListProps {
  matches: AdaptedMatch[];
  onMatchDetails?: (matchId: string) => void;
}

export default function MatchList({ matches, onMatchDetails }: MatchListProps) {
  const handleViewDetails = (matchId: string) => {
    if (onMatchDetails) {
      onMatchDetails(matchId);
    } else {
      console.log(`Просмотр деталей матча: ${matchId}`);
    }
  };

  return (
    <div className="
      flex flex-col
      gap-4 w-full max-w-5xl mx-auto
    ">
      {matches.map((match) => (
        <MatchCard
          key={match.id}
          matchId={match.id}
          team1={match.team1Name}
          team2={match.team2Name}
          stageName={match.stageName}
          tourName={match.tourName}
          discipline={match.discipline}
          timeDisplay={match.timeDisplay}
          statusDisplay={match.statusDisplay}
          statusColor={match.statusColor as 'gray' | 'blue' | 'yellow' | 'red' | 'green'}
          onViewDetails={() => handleViewDetails(match.id)}
        />
      ))}
    </div>
  );
}