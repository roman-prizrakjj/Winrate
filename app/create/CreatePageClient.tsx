"use client";

import { useState } from "react";
import StagesSection from "@/components/StagesSection";
import TournamentsSection from "@/components/TournamentsSection";
import type { Stage } from "@/lib/types/stages";
import type { Tournament } from "@/lib/types/tournaments";

interface CreatePageClientProps {
  allStages: Stage[];
  allTournaments: Tournament[];
}

type TabType = "tournaments" | "tours";

export default function CreatePageClient({ allStages, allTournaments }: CreatePageClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>("tournaments");

  return (
    <div className="space-y-8">
      {/* Табы */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setActiveTab("tournaments")}
          className={`
            px-6 py-3 rounded-lg font-medium text-lg transition-all
            ${activeTab === "tournaments"
              ? "bg-[#2581FF] text-white shadow-lg"
              : "bg-[#282E3B] text-white/60 hover:text-white hover:bg-[#3A4153]"
            }
          `}
        >
          Турниры
        </button>
        <button
          onClick={() => setActiveTab("tours")}
          className={`
            px-6 py-3 rounded-lg font-medium text-lg transition-all
            ${activeTab === "tours"
              ? "bg-[#2581FF] text-white shadow-lg"
              : "bg-[#282E3B] text-white/60 hover:text-white hover:bg-[#3A4153]"
            }
          `}
        >
          Туры
        </button>
      </div>

      {/* Контент вкладок */}
      {activeTab === "tournaments" && (
        <TournamentsSection tournaments={allTournaments} />
      )}

      {activeTab === "tours" && (
        <StagesSection allStages={allStages} />
      )}
    </div>
  );
}
