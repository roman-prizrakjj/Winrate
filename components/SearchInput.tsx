"use client";

import { useState } from "react";

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  className?: string;
}

export default function SearchInput({
  placeholder = "Поиск...",
  value = "",
  onChange,
  onSearch,
  className = "",
}: SearchInputProps) {
  const [searchValue, setSearchValue] = useState(value);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(searchValue);
    }
  };

  const handleSearchClick = () => {
    if (onSearch) {
      onSearch(searchValue);
    }
  };

  return (
    <div className={`
      relative flex items-center
      w-full max-w-sm
      ${className}
    `}>
      {/* Иконка поиска */}
      <div className="
        absolute left-3 top-1/2 -translate-y-1/2
        pointer-events-none
        z-10
      ">
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          className="text-white/50"
        >
          <circle 
            cx="11" 
            cy="11" 
            r="8" 
            stroke="currentColor" 
            strokeWidth="2"
          />
          <path 
            d="m21 21-4.35-4.35" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Поле ввода */}
      <input
        type="text"
        value={searchValue}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        className="
          w-full
          bg-[#282E3B] 
          border border-white/10
          rounded-[10px]
          px-10 py-3
          text-white text-[15px] font-medium
          placeholder:text-white/50
          focus:outline-none 
          focus:border-[#2581FF]/50
          focus:bg-[#282E3B]
          transition-colors duration-200
          backdrop-blur-[21px]
        "
      />

      {/* Кнопка поиска (опционально) */}
      {onSearch && searchValue.length > 0 && (
        <button
          onClick={handleSearchClick}
          className="
            absolute right-2 top-1/2 -translate-y-1/2
            w-7 h-7
            bg-[#2581FF] rounded-[6px]
            flex items-center justify-center
            transition-colors duration-200
            hover:bg-[#2581FF]/80
            z-10
          "
        >
          <svg 
            width="14" 
            height="14" 
            viewBox="0 0 24 24" 
            fill="none" 
            className="text-white"
          >
            <path 
              d="M9 18L15 12L9 6" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
}