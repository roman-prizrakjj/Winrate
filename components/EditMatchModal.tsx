"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface Team {
  id: string;
  name: string;
}

interface EditMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (team1Id: string, team2Id: string) => void;
  currentTeam1: string;
  currentTeam2: string;
  availableTeams: Team[];
}

export default function EditMatchModal({
  isOpen,
  onClose,
  onSave,
  currentTeam1,
  currentTeam2,
  availableTeams,
}: EditMatchModalProps) {
  const [selectedTeam1, setSelectedTeam1] = useState(currentTeam1);
  const [selectedTeam2, setSelectedTeam2] = useState(currentTeam2);
  const [isTeam1Open, setIsTeam1Open] = useState(false);
  const [isTeam2Open, setIsTeam2Open] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [team1SearchQuery, setTeam1SearchQuery] = useState(currentTeam1);
  const [team2SearchQuery, setTeam2SearchQuery] = useState(currentTeam2);

  useEffect(() => {
    setMounted(true);
    
    // Закрытие выпадающих списков при клике вне области
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setIsTeam1Open(false);
        setIsTeam2Open(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!isOpen || !mounted) return null;

  const handleSave = () => {
    onSave(selectedTeam1, selectedTeam2);
    onClose();
  };

  const handleCancel = () => {
    setSelectedTeam1(currentTeam1);
    setSelectedTeam2(currentTeam2);
    onClose();
  };

  const handleTeam1Select = (teamName: string) => {
    setSelectedTeam1(teamName);
    setTeam1SearchQuery(teamName);
    setIsTeam1Open(false);
  };

  const handleTeam2Select = (teamName: string) => {
    setSelectedTeam2(teamName);
    setTeam2SearchQuery(teamName);
    setIsTeam2Open(false);
  };

  const handleTeam1SearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTeam1SearchQuery(value);
    setSelectedTeam1(value);
    setIsTeam1Open(true);
  };

  const handleTeam2SearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTeam2SearchQuery(value);
    setSelectedTeam2(value);
    setIsTeam2Open(true);
  };

  // Фильтрация команд для поиска
  const filteredTeams1 = availableTeams.filter(team =>
    team.name.toLowerCase().includes(team1SearchQuery.toLowerCase())
  );

  const filteredTeams2 = availableTeams.filter(team =>
    team.name.toLowerCase().includes(team2SearchQuery.toLowerCase())
  );

  const modalContent = (
    <div 
      className="
        fixed inset-0 z-[99999]
        flex items-center justify-center
        bg-black/70 backdrop-blur-sm
        p-4
      "
      onClick={handleCancel}
      style={{ zIndex: 99999 }}
    >
      <div 
        className="
          bg-[#282E3B] 
          border border-white/10
          rounded-[16px]
          p-8 
          w-full max-w-lg
          h-[700px]
          shadow-2xl
          relative
          flex flex-col
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Кнопка закрытия */}
        <button
          onClick={handleCancel}
          className="
            absolute top-4 right-4
            w-8 h-8
            flex items-center justify-center
            text-white/50 hover:text-white
            hover:bg-white/10
            rounded-full
            transition-all duration-200
          "
          title="Закрыть"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path 
              d="M18 6L6 18M6 6l12 12" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Заголовок */}
        <div className="mb-8 text-center">
          <h3 className="
            text-white font-bold text-2xl mb-3
          ">
            Редактировать матч
          </h3>
          <p className="text-white/50 text-base">
            Выберите команды для данного матча
          </p>
        </div>

        {/* Форма */}
        <div className="space-y-6 flex-1">
          {/* Команда 1 */}
          <div className="space-y-3">
            <label className="text-white font-medium text-base">
              Команда 1
            </label>
            <div className="relative dropdown-container">
              <div className="relative">
                <input
                  type="text"
                  value={team1SearchQuery}
                  onChange={handleTeam1SearchChange}
                  onFocus={() => setIsTeam1Open(true)}
                  placeholder="Введите название команды..."
                  className="
                    w-full
                    bg-[#1a1f2e] 
                    border border-white/20
                    rounded-[10px]
                    px-4 py-4 pr-12
                    text-white text-left font-medium
                    placeholder:text-white/30
                    hover:border-[#2581FF]/70 hover:bg-[#1a1f2e]/80
                    focus:border-[#2581FF] focus:outline-none
                    transition-all duration-200
                  "
                />
                <button
                  onClick={() => setIsTeam1Open(!isTeam1Open)}
                  className="
                    absolute right-4 top-1/2 -translate-y-1/2
                    text-white/50 hover:text-white
                    transition-colors duration-200
                  "
                >
                  <svg 
                    width="18" 
                    height="18" 
                    viewBox="0 0 24 24" 
                    fill="none"
                    className={`transition-transform duration-200 ${
                      isTeam1Open ? 'rotate-180' : ''
                    }`}
                  >
                    <path 
                      d="M6 9L12 15L18 9" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>

              {/* Выпадающий список команда 1 */}
              {isTeam1Open && filteredTeams1.length > 0 && (
                <div className="
                  absolute top-full left-0 right-0 mt-2 z-10
                  bg-[#1a1f2e] 
                  border border-white/20
                  rounded-[10px]
                  max-h-48 overflow-y-auto
                  shadow-xl
                  backdrop-blur-xl
                ">
                  {filteredTeams1.map((team) => (
                    <button
                      key={team.id}
                      onClick={() => handleTeam1Select(team.name)}
                      className="
                        w-full px-4 py-3 text-left
                        text-white hover:bg-[#2581FF]/20
                        transition-colors duration-200
                        first:rounded-t-[10px] last:rounded-b-[10px]
                        border-b border-white/5 last:border-b-0
                      "
                    >
                      {team.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* VS разделитель */}
          <div className="text-center py-2">
            <span className="text-white/50 font-bold text-xl">VS</span>
          </div>

          {/* Команда 2 */}
          <div className="space-y-3">
            <label className="text-white font-medium text-base">
              Команда 2
            </label>
            <div className="relative dropdown-container">
              <div className="relative">
                <input
                  type="text"
                  value={team2SearchQuery}
                  onChange={handleTeam2SearchChange}
                  onFocus={() => setIsTeam2Open(true)}
                  placeholder="Введите название команды..."
                  className="
                    w-full
                    bg-[#1a1f2e] 
                    border border-white/20
                    rounded-[10px]
                    px-4 py-4 pr-12
                    text-white text-left font-medium
                    placeholder:text-white/30
                    hover:border-[#2581FF]/70 hover:bg-[#1a1f2e]/80
                    focus:border-[#2581FF] focus:outline-none
                    transition-all duration-200
                  "
                />
                <button
                  onClick={() => setIsTeam2Open(!isTeam2Open)}
                  className="
                    absolute right-4 top-1/2 -translate-y-1/2
                    text-white/50 hover:text-white
                    transition-colors duration-200
                  "
                >
                  <svg 
                    width="18" 
                    height="18" 
                    viewBox="0 0 24 24" 
                    fill="none"
                    className={`transition-transform duration-200 ${
                      isTeam2Open ? 'rotate-180' : ''
                    }`}
                  >
                    <path 
                      d="M6 9L12 15L18 9" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>

              {/* Выпадающий список команда 2 */}
              {isTeam2Open && filteredTeams2.length > 0 && (
                <div className="
                  absolute top-full left-0 right-0 mt-2 z-10
                  bg-[#1a1f2e] 
                  border border-white/20
                  rounded-[10px]
                  max-h-48 overflow-y-auto
                  shadow-xl
                  backdrop-blur-xl
                ">
                  {filteredTeams2.map((team) => (
                    <button
                      key={team.id}
                      onClick={() => handleTeam2Select(team.name)}
                      className="
                        w-full px-4 py-3 text-left
                        text-white hover:bg-[#2581FF]/20
                        transition-colors duration-200
                        first:rounded-t-[10px] last:rounded-b-[10px]
                        border-b border-white/5 last:border-b-0
                      "
                    >
                      {team.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Кнопки */}
        <div className="flex gap-4 pt-6 border-t border-white/10 mt-auto">
          <button
            onClick={handleCancel}
            className="
              flex-1
              bg-white/10 hover:bg-white/20
              border border-white/20
              rounded-[10px]
              px-6 py-3
              text-white font-medium text-base
              transition-all duration-200
              hover:scale-[1.02]
            "
          >
            Отменить
          </button>
          <button
            onClick={handleSave}
            className="
              flex-1
              bg-[#2581FF] hover:bg-[#2581FF]/90
              border border-[#2581FF]
              rounded-[10px]
              px-6 py-3
              text-white font-bold text-base
              transition-all duration-200
              hover:scale-[1.02] hover:shadow-lg hover:shadow-[#2581FF]/25
            "
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}