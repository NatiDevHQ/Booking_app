import React, { useState } from 'react';
import { Booking } from '../types';

interface BookingPageProps {
  onBack: () => void;
  onConfirm: (booking: Booking) => void;
  currentUser: { email: string; role: 'user' | 'admin' } | null;
}

const TIME_SLOTS = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM"
];

const BookingPage: React.FC<BookingPageProps> = ({ onBack, onConfirm, currentUser }) => {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: currentUser?.email || '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;

    const newBooking: Booking = {
      id: Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      name: formData.name,
      email: currentUser?.email || formData.email,
      date: formData.date,
      timeSlot: selectedSlot,
      status: 'pending'
    };

    onConfirm(newBooking);
  };

  return (
    <div className="max-w-[800px] mx-auto py-10">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 hover:text-black dark:hover:text-white mb-8 font-bold transition-colors"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Back to Home
      </button>

      <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-8 text-black dark:text-white">
        Select a Time Slot
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-12">
        {TIME_SLOTS.map((slot) => (
          <button
            key={slot}
            onClick={() => setSelectedSlot(slot)}
            className={`py-4 px-6 rounded-xl border-2 font-bold transition-all duration-200 ${
              selectedSlot === slot
                ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black scale-[1.02] shadow-lg'
                : 'border-gray-200 dark:border-zinc-800 text-gray-500 dark:text-zinc-500 hover:border-gray-400 dark:hover:border-zinc-600'
            }`}
          >
            {slot}
          </button>
        ))}
      </div>

      {selectedSlot && (
        <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400">Your Name</label>
              <input
                required
                type="text"
                placeholder="John Doe"
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-black dark:ring-white transition-all text-black dark:text-white font-mono"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400">Email Address</label>
              <input
                required
                type="email"
                placeholder="john@example.com"
                className="w-full bg-zinc-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-3 outline-none text-zinc-500 font-mono cursor-not-allowed"
                value={formData.email}
                readOnly
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400">Date</label>
              <input
                required
                type="date"
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-black dark:ring-white transition-all text-black dark:text-white font-mono"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Selected Time</label>
                <div className="w-full bg-gray-100 dark:bg-zinc-800 rounded-xl px-4 py-3 font-bold text-black dark:text-white font-mono">
                    {selectedSlot}
                </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-black dark:bg-white text-white dark:text-black font-black text-lg rounded-xl hover:opacity-90 transition-all active:scale-[0.98] shadow-xl"
          >
            Confirm Booking
          </button>
        </form>
      )}
    </div>
  );
};

export default BookingPage;
