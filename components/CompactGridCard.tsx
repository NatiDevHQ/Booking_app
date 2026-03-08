import React, { useState } from 'react';
import { Grid } from '../types';

interface CompactGridCardProps {
    grid: Grid;
    onDelete: () => void;
    onEdit: () => void;
    onView?: () => void;
}

const AlertIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
    <line x1="12" y1="9" x2="12" y2="13"></line>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

const CompactGridCard: React.FC<CompactGridCardProps> = ({ grid, onDelete, onEdit, onView }) => {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Calculate stats
    const daysMarked = Object.values(grid.data).filter(Boolean).length;
    
    // Format frequency display (e.g. "Every day" -> "Daily")
    const freqDisplay = grid.frequency === 'Every day' ? 'Daily' : grid.frequency.replace('per week', 'Week');

    // Calculate "Updated" date (last checked date or today)
    // We sort the keys to find the latest date marked true
    const lastChecked = Object.keys(grid.data)
        .filter(k => grid.data[k])
        .sort()
        .pop();
    
    // Parse the date string YYYY-MM-DD to a Date object, handling timezone roughly by appending time
    const dateObj = lastChecked ? new Date(`${lastChecked}T00:00:00`) : new Date();
    
    // Format: "Nov 12, 2025"
    const dateStr = dateObj.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    });

    return (
        <>
            <div 
                onClick={onView}
                className="border-[2px] border-black dark:border-zinc-700 rounded-[20px] p-7 bg-white dark:bg-zinc-900 flex flex-col h-full shadow-sm hover:shadow-md transition-shadow relative cursor-pointer group"
            >
                {/* Title */}
                <h3 className="text-2xl font-black tracking-tight mb-2 truncate text-black dark:text-white" title={grid.title}>
                    {grid.title}
                </h3>
                
                {/* Subtitle Stats */}
                <div className="text-gray-500 dark:text-gray-400 text-sm font-bold mb-6 flex items-center gap-2">
                    <span>{daysMarked} days marked</span>
                    <span className="text-gray-300 dark:text-zinc-700">•</span>
                    <span>{freqDisplay}</span>
                </div>
                
                {/* Updated Date */}
                <div className="text-gray-300 dark:text-zinc-600 text-xs font-bold mb-6 uppercase tracking-wider">
                    Updated {dateStr}
                </div>

                {/* Divider */}
                <div className="w-full h-[1px] bg-gray-100 dark:bg-zinc-800 mb-6"></div>

                {/* Actions */}
                <div className="flex gap-3 mt-auto" onClick={(e) => e.stopPropagation()}>
                    <button 
                        onClick={onEdit}
                        className="flex-1 bg-black dark:bg-zinc-100 text-white dark:text-black font-bold py-3 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-sm"
                    >
                        Edit
                    </button>
                    <button 
                        onClick={() => setShowDeleteConfirm(true)}
                        className="px-6 py-3 border-[2px] border-black dark:border-zinc-600 text-black dark:text-zinc-300 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={(e) => e.stopPropagation()}>
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
                                onDelete();
                            }}
                            className="px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                        >
                            Delete
                        </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CompactGridCard;