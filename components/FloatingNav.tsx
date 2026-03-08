import React from 'react';

interface FloatingNavProps {
  onListView: () => void;
  onAdd: () => void;
  onGridView: () => void;
  activeView: 'list' | 'grid';
  userRole: 'user' | 'admin';
}

const FloatingNav: React.FC<FloatingNavProps> = ({ onListView, onAdd, onGridView, activeView, userRole }) => {
  return (
    <div className="fixed bottom-2 left-1/2 -translate-x-1/2 w-[90%] max-w-[340px] h-[80px] z-[100] pointer-events-none drop-shadow-2xl scale-[0.85] origin-bottom sm:scale-100">
       <div className="relative w-full h-full pointer-events-auto">
          {/* Background Shape - SVG */}
          <svg 
            viewBox="0 0 340 80" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 w-full h-full text-[#EFEFEF] dark:text-zinc-900 transition-colors duration-300"
            preserveAspectRatio="none"
          >
            <path 
              d="M30 25 H120 C140 25 145 5 170 5 C195 5 200 25 220 25 H310 A25 25 0 0 1 335 50 V50 A25 25 0 0 1 310 75 H30 A25 25 0 0 1 5 50 V50 A25 25 0 0 1 30 25 Z" 
              fill="currentColor"
            />
          </svg>

          {/* Buttons Container */}
          <div className="absolute inset-0 flex items-end justify-between px-10 pb-[18px]">
              {/* Home Button */}
              <div className="relative group/nav">
                <button 
                  id="tour-nav-home"
                  onClick={onListView} 
                  className={`flex flex-col items-center justify-center gap-1 w-12 h-12 transition-colors relative ${activeView === 'list' ? 'text-black dark:text-white' : 'text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300'}`}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover/nav:scale-110 transition-transform">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                    <span className="text-[10px] font-bold">Home</span>
                </button>
                {/* Tooltip */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-black dark:bg-zinc-800 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover/nav:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
                   Home
                </div>
              </div>
              
              {/* Role-Specific Button (Admin or My Bookings) */}
              <div className="relative group/nav">
                <button 
                  id="tour-nav-dashboard"
                  onClick={onGridView} 
                  className={`flex flex-col items-center justify-center gap-1 w-12 h-12 transition-colors relative ${activeView === 'grid' ? 'text-black dark:text-white' : 'text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300'}`}
                >
                    {userRole === 'admin' ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover/nav:scale-110 transition-transform">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                          <line x1="3" y1="14" x2="21" y2="14"></line>
                          <line x1="3" y1="18" x2="21" y2="18"></line>
                          <line x1="7" y1="10" x2="7" y2="22"></line>
                        </svg>
                    ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover/nav:scale-110 transition-transform">
                          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                          <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                          <path d="M9 14l2 2 4-4"></path>
                        </svg>
                    )}
                    <span className="text-[10px] font-bold whitespace-nowrap">
                      {userRole === 'admin' ? 'Admin' : 'Bookings'}
                    </span>
                </button>
                {/* Tooltip */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-black dark:bg-zinc-800 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover/nav:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
                   {userRole === 'admin' ? 'Dashboard' : 'My Bookings'}
                </div>
              </div>
          </div>

          {/* Center Floating Action Button */}
          <div className="absolute top-[5px] left-1/2 -translate-x-1/2 -translate-y-[20%]">
             <button 
                id="tour-add-btn"
                onClick={onAdd}
                className="w-[56px] h-[56px] bg-[#2D2D2D] dark:bg-zinc-100 rounded-full flex items-center justify-center text-white dark:text-black shadow-lg hover:bg-black dark:hover:bg-white hover:scale-105 active:scale-95 transition-all"
             >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
             </button>
          </div>
       </div>
    </div>
  );
};


export default FloatingNav;