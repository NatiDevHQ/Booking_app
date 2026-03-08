import React from 'react';
import { Booking } from '../types';

interface ConfirmationPageProps {
  booking: Booking;
  onHome: () => void;
}

const ConfirmationPage: React.FC<ConfirmationPageProps> = ({ booking, onHome }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-8 shadow-inner">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>

      <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 text-black dark:text-white">
        Booking Confirmed 🎉
      </h1>
      <p className="text-gray-500 dark:text-zinc-400 mb-12 font-mono">
        Your slot has been reserved. See you soon!
      </p>

      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-8 w-full max-w-md shadow-2xl mb-12 text-left space-y-4">
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Name</label>
          <p className="text-lg font-bold text-black dark:text-white">{booking.name}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Date</label>
            <p className="text-lg font-bold text-black dark:text-white">{booking.date}</p>
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Time</label>
            <p className="text-lg font-bold text-black dark:text-white">{booking.timeSlot}</p>
          </div>
        </div>
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Email</label>
          <p className="text-sm font-mono text-zinc-500 dark:text-zinc-400">{booking.email}</p>
        </div>
      </div>

      <button
        onClick={onHome}
        className="px-8 py-3 bg-zinc-100 dark:bg-zinc-800 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black text-black dark:text-white font-bold rounded-xl transition-all duration-300"
      >
        Back to Home
      </button>
    </div>
  );
};

export default ConfirmationPage;
