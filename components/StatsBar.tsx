import React, { useState, useRef, useEffect } from 'react';

interface StatsBarProps {
  totalDays: number;
  currentStreak: number;
  bestStreak: number;
  selectedFrequency: string;
  onFrequencyChange: (freq: string) => void;
}

const FREQUENCY_OPTIONS = [
  "Every day",
  "1x per week",
  "2x per week",
  "3x per week",
  "4x per week",
  "5x per week"
];

const StatsBar: React.FC<StatsBarProps> = ({ 
  totalDays, 
  currentStreak, 
  bestStreak,
  selectedFrequency,
  onFrequencyChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between w-full mt-8 px-1 relative text-black dark:text-white">
      <div className="flex space-x-12 mb-4 sm:mb-0 w-full sm:w-auto justify-start">
        <div className="flex flex-col items-start">
          <span className="text-3xl font-bold leading-none mb-2">{totalDays}</span>
          <span className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold tracking-[0.2em] uppercase">Total Days</span>
        </div>
        <div className="flex flex-col items-start">
          <span className="text-3xl font-bold leading-none mb-2">{currentStreak}</span>
          <span className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold tracking-[0.2em] uppercase">Current Streak</span>
        </div>
        <div className="flex flex-col items-start">
          <span className="text-3xl font-bold leading-none mb-2">{bestStreak}</span>
          <span className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold tracking-[0.2em] uppercase">Best Streak</span>
        </div>
      </div>

      <div className="relative group w-full sm:w-auto z-50" ref={dropdownRef}>
         {/* Dropdown Menu - Positioned bottom-full to pop UP like screenshot */}
        {isOpen && (
            <div className="absolute bottom-full right-0 mb-2 w-[220px] bg-white dark:bg-zinc-900 border border-black dark:border-zinc-700 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] py-2 overflow-hidden z-50">
                {FREQUENCY_OPTIONS.map((option) => (
                    <button
                        key={option}
                        onClick={() => {
                            onFrequencyChange(option);
                            setIsOpen(false);
                        }}
                        className={`w-full text-left px-5 py-3 text-sm font-bold transition-colors ${
                            selectedFrequency === option ? 'bg-gray-100 dark:bg-zinc-800 text-black dark:text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-black dark:hover:text-white'
                        }`}
                    >
                        {option}
                    </button>
                ))}
            </div>
        )}

        <button 
             onClick={() => setIsOpen(!isOpen)}
             className="flex items-center justify-between w-full sm:w-auto space-x-4 border border-black dark:border-zinc-600 rounded-lg px-4 py-3 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors select-none"
        >
          <span className="text-sm font-bold whitespace-nowrap text-black dark:text-white">Streak: {selectedFrequency}</span>
          <svg 
            width="10" 
            height="10" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="4" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default StatsBar;