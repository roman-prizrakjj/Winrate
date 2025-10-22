'use client';

import { Team } from '@/lib/types/teams';
import TeamCard from './TeamCard';

interface TeamListProps {
  teams: Team[];
}

export default function TeamList({ teams }: TeamListProps) {
  return (
    <div className="space-y-6">
      {teams.map((team) => (
        <TeamCard key={team.id} team={team} />
      ))}
    </div>
  );
}