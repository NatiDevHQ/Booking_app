import React from 'react';

interface HomeProps {
  onBookNow: () => void;
}

const Home: React.FC<HomeProps> = ({ onBookNow }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter mb-6 bg-transparent text-black dark:text-white transition-colors duration-300">
        Simple Booking System
      </h1>
      <p className="text-gray-500 dark:text-gray-400 text-lg sm:text-xl max-w-[600px] mb-12 font-mono">
        The most efficient way to manage your time and book slots instantly with our premium experience.
      </p>
      
      <button 
        onClick={onBookNow}
        className="group relative px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-bold rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl"
      >
        <span className="relative z-10 flex items-center gap-2 text-lg">
          Book a Slot
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-800 to-black dark:from-zinc-200 dark:to-white opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>
    </div>
  );
};

export default Home;
