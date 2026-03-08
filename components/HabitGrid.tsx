import React, { useMemo, useRef, useEffect } from 'react';
import { HabitData } from '../types';
import { generateGridDates, getMonthLabel } from '../utils/dateUtils';

interface HabitGridProps {
  data: HabitData;
  onToggle: (dateString: string) => void;
}

const HabitGrid: React.FC<HabitGridProps> = ({ data, onToggle }) => {
  const weeks = useMemo(() => generateGridDates(), []);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to "Today" or the end on mount
  useEffect(() => {
    if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        container.scrollLeft = container.scrollWidth; 
    }
  }, []); // Run once on mount

  // Visual Constants for Pixel Perfection
  const CELL_SIZE = "w-[18px] h-[18px]"; // 18px squares
  const GAP_SIZE = "gap-[6px]";         // 6px gap
  const ROUNDING = "rounded-[3px]";     // Slight rounding
  const BORDER_WIDTH = "border-[2px]";  // Thick noticeable borders

  // Row Indices for labels: Mon=0, Wed=2, Fri=4, Sun=6
  // We render a spacer for indices 1, 3, 5 to maintain alignment
  const dayLabels = [
    { label: 'Mon', index: 0 },
    { label: '', index: 1 },
    { label: 'Wed', index: 2 },
    { label: '', index: 3 },
    { label: 'Fri', index: 4 },
    { label: '', index: 5 },
    { label: 'Sun', index: 6 },
  ];

  return (
    <div className="flex flex-col relative w-full overflow-hidden select-none">
      
      {/* Container for Labels + Scrollable Grid */}
      <div className="flex w-full">
        
        {/* Fixed Day Labels Column */}
        <div className="flex flex-col justify-end pb-3 pr-3 shrink-0 text-right">
           {/* Spacer for Month Row (matches the grid's month row height + margin) */}
           <div className="h-6 mb-2"></div>

           <div className={`flex flex-col ${GAP_SIZE}`}>
            {dayLabels.map((day, i) => (
              <div 
                key={i} 
                className={`flex items-center justify-end ${CELL_SIZE}`}
              >
                {day.label && (
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-bold leading-none translate-y-[1px]">
                    {day.label}
                  </span>
                )}
              </div>
            ))}
           </div>
        </div>

        {/* Scrollable Grid Area */}
        <div 
            ref={scrollContainerRef}
            className="overflow-x-auto grid-scroll w-full pb-2"
        >
           <div className="flex flex-col min-w-min">
              
              {/* Month Labels Row */}
              <div className="flex mb-2 h-6 items-end relative">
                {weeks.map((week, i) => {
                  const label = getMonthLabel(week, i === 0);
                  return (
                    <div key={i} className={`flex-shrink-0 ${CELL_SIZE} mr-[6px] relative`}>
                      {label && (
                        <span className="absolute left-0 bottom-0 text-[10px] font-bold text-zinc-800 dark:text-zinc-300 whitespace-nowrap">
                          {label}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Grid Matrix (Weeks as Columns) */}
              <div className={`flex ${GAP_SIZE}`}>
                {weeks.map((week, wIndex) => (
                  <div key={wIndex} className={`flex flex-col ${GAP_SIZE}`}>
                    {week.map((day) => {
                      const isChecked = !!data[day.dateString];
                      
                      // Tooltip
                      let tooltipText = `${day.dateString}`;
                      if (day.isToday) tooltipText = "Today";
                      if (day.isFuture) tooltipText += " (Future)";
                      else tooltipText += isChecked ? " (Completed)" : " (Missed)";

                      // --- STYLE LOGIC ---
                      // Added hover:scale-110, hover:z-10 (to pop out), relative (for z-index)
                      let baseClass = `${CELL_SIZE} ${ROUNDING} ${BORDER_WIDTH} flex-shrink-0 transition-all duration-200 ease-out relative `;
                      
                      if (day.isFuture) {
                          // FUTURE: Light gray outline, transparent bg
                          baseClass += "border-gray-200 dark:border-zinc-800 bg-transparent opacity-50 cursor-default";
                      } else {
                          // PAST / TODAY: Interactive
                          baseClass += "cursor-pointer hover:scale-110 hover:z-10 ";

                          if (isChecked) {
                              // CHECKED (Past or Today): Solid Black
                              baseClass += "bg-black border-black dark:bg-zinc-200 dark:border-zinc-200 shadow-sm hover:shadow-md hover:bg-zinc-800 hover:border-zinc-800 dark:hover:bg-white dark:hover:border-white";
                          } else {
                              // UNCHECKED
                              if (day.isToday) {
                                  // UNCHECKED TODAY: Distinct orange border and tint
                                  baseClass += "border-orange-500 bg-orange-50 dark:bg-orange-900/20 animate-pulse-slow shadow-sm hover:bg-orange-100 dark:hover:bg-orange-900/40 hover:shadow-md";
                              } else {
                                  // UNCHECKED PAST: Dark border, white bg
                                  baseClass += "bg-white dark:bg-zinc-900 border-zinc-800 dark:border-zinc-600 hover:border-black dark:hover:border-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:shadow-sm";
                              }
                          }
                      }

                      return (
                        <button
                          key={day.dateString}
                          onClick={() => !day.isFuture && onToggle(day.dateString)}
                          disabled={day.isFuture}
                          className={baseClass}
                          title={tooltipText}
                          type="button"
                          aria-label={tooltipText}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default HabitGrid;