import React, { useState, useRef, useEffect } from 'react';

interface HeaderProps {
  onSignOut: () => void;
  currentUser: { email: string; role: 'user' | 'admin' } | null;
}

const Header: React.FC<HeaderProps> = ({ onSignOut, currentUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check system preference or localStorage on mount
    const isDarkMode = localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#09090b');
    } else {
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#ffffff');
    }
  }, []);

  const toggleDarkMode = async (event: React.MouseEvent<any>) => {
    const nextMode = !isDark;
    
    // Core theme switching logic
    const applyTheme = () => {
        setIsDark(nextMode);
        if (nextMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#09090b');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#ffffff');
        }
    };

    // Cast document to any to access startViewTransition in TS without types
    const doc = document as any;

    // Fallback if View Transition API is not supported
    if (!doc.startViewTransition) {
        applyTheme();
        return;
    }

    const x = event.nativeEvent.clientX;
    const y = event.nativeEvent.clientY;
    
    // Calculate distance to furthest corner to ensure full coverage
    const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
    );

    const transition = doc.startViewTransition(() => {
        applyTheme();
    });

    await transition.ready;

    // Animate the circular clip path
    document.documentElement.animate(
        {
            clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${endRadius}px at ${x}px ${y}px)`
            ],
        },
        {
            duration: 500,
            easing: 'ease-in-out',
            pseudoElement: '::view-transition-new(root)',
        }
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 flex justify-between items-center py-4 sm:py-5 border-b border-gray-200/60 dark:border-zinc-800/60 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl mb-6 sm:mb-8 -mx-4 sm:-mx-6 md:-mx-12 px-4 sm:px-6 md:px-12 transition-all duration-300">
      <div className="text-lg sm:text-xl font-bold tracking-tight text-black dark:text-white">Simple Booking</div>
      
      <div className="relative" ref={menuRef}>
        <button 
            onClick={() => setIsOpen(!isOpen)}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-gray-700 to-black dark:from-zinc-700 dark:to-zinc-900 text-white flex items-center justify-center font-bold hover:shadow-lg transition-all duration-200 active:scale-95"
            aria-label="User menu"
        >
            {/* Simple User Initial - Dynamic based on email or name */}
            <span className="text-sm sm:text-base uppercase">
                {currentUser?.email?.charAt(0) || 'U'}
            </span>
        </button>

        {isOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100 origin-top-right ring-1 ring-black/5">
                <div className="px-5 py-3 border-b border-gray-100 dark:border-zinc-800/50">
                    <p className="text-sm font-bold text-black dark:text-white">
                        {currentUser?.role === 'admin' ? 'Admin Account' : 'User Account'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-zinc-400 truncate mt-0.5">
                        {currentUser?.email || 'user@example.com'}
                    </p>
                </div>

                {/* Toggle Section - Enhanced */}
                <div 
                    className="px-5 py-3 border-b border-gray-100 dark:border-zinc-800/50 flex items-center justify-between cursor-pointer group hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors"
                    onClick={(e) => toggleDarkMode(e)}
                >
                    <div className="flex items-center gap-3">
                         <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${isDark ? 'bg-indigo-900/30 text-indigo-300' : 'bg-amber-100 text-amber-600'}`}>
                             {isDark ? (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                                </svg>
                             ) : (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="4"></circle>
                                    <path d="M12 2v2"></path>
                                    <path d="M12 20v2"></path>
                                    <path d="M4.93 4.93l1.41 1.41"></path>
                                    <path d="M17.66 17.66l1.41 1.41"></path>
                                    <path d="M2 12h2"></path>
                                    <path d="M20 12h2"></path>
                                    <path d="M6.34 17.66l-1.41 1.41"></path>
                                    <path d="M19.07 4.93l-1.41 1.41"></path>
                                </svg>
                             )}
                         </div>
                         <div className="flex flex-col">
                            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Appearance</span>
                            <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors">
                                {isDark ? 'Dark Mode' : 'Light Mode'}
                            </span>
                         </div>
                    </div>
                    
                    {/* iOS Style Switch */}
                    <div className={`relative w-11 h-6 rounded-full transition-colors duration-300 ease-in-out ${isDark ? 'bg-zinc-700' : 'bg-zinc-200'}`}>
                        <div 
                            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 cubic-bezier(0.4, 0.0, 0.2, 1) ${isDark ? 'translate-x-5' : 'translate-x-0'}`} 
                        />
                    </div>
                </div>
                
                <div className="p-1.5">
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsOpen(false);
                            onSignOut();
                        }}
                        className="w-full flex items-center gap-2 text-left px-3.5 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg font-bold transition-colors group"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        Sign Out
                    </button>
                </div>
            </div>
        )}
      </div>
    </header>
  );
};

export default Header;