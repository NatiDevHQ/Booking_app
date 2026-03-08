import React, { useEffect } from 'react';
import { Booking } from '../types';
import confetti from 'canvas-confetti';

interface ConfirmationPageProps {
  booking: Booking;
  onHome: () => void;
}

const ConfirmationPage: React.FC<ConfirmationPageProps> = ({ booking }) => {
  useEffect(() => {
    // Fire confetti on mount
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

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
    </div>
  );
};

export default ConfirmationPage;
