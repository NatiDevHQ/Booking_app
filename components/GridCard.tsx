import React, { useState, useMemo } from 'react';
import HabitGrid from './HabitGrid';
import StatsBar from './StatsBar';
import { Grid } from '../types';
import { formatDate, generateGridDates } from '../utils/dateUtils';

interface GridCardProps {
  grid: Grid;
  onUpdate: (field: keyof Grid, value: any) => void;
  onDelete: () => void;
}

const AlertIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
    <line x1="12" y1="9" x2="12" y2="13"></line>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

// Helper to parse YYYY-MM-DD to local Date object (00:00:00)
const parseLocal = (str: string) => {
    const [y, m, d] = str.split('-').map(Number);
    return new Date(y, m - 1, d);
};

const GridCard: React.FC<GridCardProps> = ({ grid, onUpdate, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const toggleDate = (dateString: string) => {
    const newData = { ...grid.data, [dateString]: !grid.data[dateString] };
    onUpdate('data', newData);
  };

  const markToday = () => {
    const today = formatDate(new Date());
    const newData = { ...grid.data, [today]: true };
    onUpdate('data', newData);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdate('title', e.target.value);
  };

  // Complex Streak Calculation Logic
  const { totalDays, currentStreak, bestStreak } = useMemo(() => {
    const habitData = grid.data || {};
    const frequency = grid.frequency || "Every day";
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = formatDate(today);

    // 1. Total Days (simple count of checks)
    const totalDays = Object.values(habitData).filter(Boolean).length;

    let current = 0;
    let best = 0;

    // Detect Mode
    let isWeeklyMode = false;
    let targetPerWeek = 7;
    if (frequency.includes("x")) {
        isWeeklyMode = true;
        const match = frequency.match(/(\d+)x/);
        if (match) targetPerWeek = parseInt(match[1]);
    }

    if (!isWeeklyMode) {
        // --- DAILY STREAK LOGIC (Every day) ---
        
        // A. Best Streak
        const sortedDates = Object.keys(habitData)
            .filter(d => habitData[d])
            .sort(); // String sort YYYY-MM-DD works for ISO dates

        let tempBest = 0;
        let currentRun = 0;
        let prevTime = 0;

        sortedDates.forEach((dateStr) => {
            const d = parseLocal(dateStr);
            const t = d.getTime();

            if (currentRun === 0) {
                currentRun = 1;
            } else {
                // Check diff in days
                const diffDays = Math.round((t - prevTime) / (1000 * 60 * 60 * 24));
                if (diffDays === 1) {
                    currentRun++;
                } else if (diffDays > 1) {
                    // Gap detected, reset run
                    if (currentRun > tempBest) tempBest = currentRun;
                    currentRun = 1;
                }
            }
            prevTime = t;
        });
        if (currentRun > tempBest) tempBest = currentRun;
        best = tempBest;

        // B. Current Streak
        // Strategy: Check if today is done. If not, check yesterday.
        // If neither, streak is 0. If either is done, count backwards day by day.
        
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        const isTodayDone = !!habitData[formatDate(today)];
        const isYesterdayDone = !!habitData[formatDate(yesterday)];
        
        let streakAnchor: Date | null = null;
        
        if (isTodayDone) {
            streakAnchor = today;
        } else if (isYesterdayDone) {
            streakAnchor = yesterday;
        }

        if (streakAnchor) {
            current = 0;
            const pointer = new Date(streakAnchor);
            // Count the anchor itself and go back
            while (true) {
                if (habitData[formatDate(pointer)]) {
                    current++;
                    pointer.setDate(pointer.getDate() - 1);
                } else {
                    break;
                }
            }
        } else {
            current = 0;
        }

    } else {
        // --- WEEKLY STREAK LOGIC (Nx per week) ---
        
        const allWeeks = generateGridDates();
        
        // 1. Calculate success for every week
        const weekSuccess = allWeeks.map(week => {
            const count = week.filter(d => habitData[d.dateString]).length;
            return count >= targetPerWeek;
        });

        // 2. Determine Current Week Index based on today
        let currentWeekIndex = allWeeks.findIndex(week => week.some(d => d.dateString === todayStr));
        if (currentWeekIndex === -1) currentWeekIndex = allWeeks.length - 1;

        // 3. Best Streak (Consecutive successful weeks)
        let tempBest = 0;
        let run = 0;
        // Iterate up to current week (inclusive) to find best historical streak
        for (let i = 0; i <= currentWeekIndex; i++) {
            if (weekSuccess[i]) {
                run++;
            } else {
                if (run > tempBest) tempBest = run;
                run = 0;
            }
        }
        if (run > tempBest) tempBest = run;
        best = tempBest;

        // 4. Current Streak
        // If current week is successful, streak includes it.
        // If current week is NOT successful (yet), we look at previous week.
        // If previous week was successful, streak is carried over (pending current week).
        // If previous week failed, streak is 0.
        
        if (weekSuccess[currentWeekIndex]) {
             // Current week met goal. Count backwards from here.
             current = 0;
             let i = currentWeekIndex;
             while(i >= 0 && weekSuccess[i]) {
                 current++;
                 i--;
             }
        } else {
            // Current week not met. Check previous.
            const prevIndex = currentWeekIndex - 1;
            if (prevIndex >= 0 && weekSuccess[prevIndex]) {
                current = 0;
                let i = prevIndex;
                while(i >= 0 && weekSuccess[i]) {
                    current++;
                    i--;
                }
            } else {
                current = 0;
            }
        }
    }

    return { totalDays, currentStreak: current, bestStreak: best };
  }, [grid.data, grid.frequency]);

  return (
    <div className="relative w-full max-w-[1000px] border border-black dark:border-zinc-700 rounded-[24px] p-6 sm:p-8 bg-white dark:bg-zinc-900 shadow-sm transition-shadow hover:shadow-md">
      {/* Card Header */}
      <div className="flex justify-between items-center mb-6 gap-3">
        <input
          type="text"
          value={grid.title}
          onChange={handleTitleChange}
          className="text-xl sm:text-2xl font-bold tracking-tight bg-transparent outline-none border-none p-0 flex-1 min-w-0 placeholder-gray-300 dark:placeholder-zinc-600 text-black dark:text-white focus:ring-0"
          spellCheck={false}
          placeholder="Habit Name"
        />
        <button 
          onClick={markToday}
          className="bg-black dark:bg-zinc-100 text-white dark:text-black text-[10px] sm:text-xs font-bold py-2.5 px-3 sm:py-3 sm:px-6 rounded-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors tracking-widest uppercase shrink-0 whitespace-nowrap shadow-sm"
        >
          Mark Today
        </button>
      </div>

      {/* Grid */}
      <HabitGrid data={grid.data} onToggle={toggleDate} />

      {/* Stats */}
      <StatsBar 
        totalDays={totalDays} 
        currentStreak={currentStreak} 
        bestStreak={bestStreak} 
        selectedFrequency={grid.frequency || "Every day"}
        onFrequencyChange={(freq) => onUpdate('frequency', freq)}
      />

      {/* Delete Button */}
      <div className="absolute bottom-[-40px] right-0">
          <button 
            onClick={() => setShowDeleteConfirm(true)}
            className="group flex items-center gap-2 border border-black dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 rounded-[6px] text-xs font-bold transition-all duration-200 hover:scale-110 hover:shadow-md hover:border-red-600 hover:text-red-600 dark:text-zinc-300 dark:hover:text-red-400"
          >
              <span>Delete</span>
              <span className="text-red-500 group-hover:text-red-600 transition-colors">
                <TrashIcon />
              </span>
          </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border-2 border-red-500 p-6 w-full max-w-sm shadow-2xl scale-100 animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4 text-red-600">
                <AlertIcon />
                <h3 className="text-xl font-bold text-black dark:text-white">Delete Grid</h3>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
              Are you sure you want to delete <span className="font-bold text-black dark:text-white">"{grid.title}"</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-200 dark:border-zinc-700 text-sm font-bold rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 hover:border-gray-300 transition-colors text-black dark:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  if (onDelete) onDelete();
                }}
                className="px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 transition-colors shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GridCard;