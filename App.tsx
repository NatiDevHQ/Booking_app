import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import FloatingNav from './components/FloatingNav';
import LoginPage from './components/auth/LoginPage';
import SignupPage from './components/auth/SignupPage';
import Home from './components/Home';
import BookingPage from './components/BookingPage';
import ConfirmationPage from './components/ConfirmationPage';
import AdminDashboard from './components/AdminDashboard';
import { Booking } from './types';

const DEMO_BOOKINGS: Booking[] = [
  {
    id: 'demo-1',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    date: '2026-03-10',
    timeSlot: '09:00 AM',
    status: 'approved'
  },
  {
    id: 'demo-2',
    name: 'Michael Chen',
    email: 'michael@example.com',
    date: '2026-03-11',
    timeSlot: '11:00 AM',
    status: 'pending'
  },
  {
    id: 'demo-3',
    name: 'Emma Wilson',
    email: 'emma@example.com',
    date: '2026-03-12',
    timeSlot: '02:00 PM',
    status: 'approved'
  },
  {
    id: 'demo-4',
    name: 'Admin Demo',
    email: 'admin@example.com',
    date: '2026-03-15',
    timeSlot: '10:00 AM',
    status: 'approved'
  }
];

type Page = 'home' | 'booking' | 'confirmation' | 'admin' | 'login' | 'signup';

interface User {
  email: string;
  role: 'user' | 'admin';
}

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [lastBooking, setLastBooking] = useState<Booking | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
        const saved = localStorage.getItem('sbs-user');
        return saved ? JSON.parse(saved) : null;
    } catch (e) {
        return null;
    }
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
        const saved = localStorage.getItem('sbs-bookings');
        return saved ? JSON.parse(saved) : DEMO_BOOKINGS;
    } catch (e) {
        return DEMO_BOOKINGS;
    }
  });

  useEffect(() => {
    if (currentUser) {
        localStorage.setItem('sbs-user', JSON.stringify(currentUser));
        // Auto-navigate if already logged in and at login page
        if (currentPage === 'login') {
            setCurrentPage('home');
        }
    } else {
        localStorage.removeItem('sbs-user');
    }
  }, [currentUser]);

  // Save to LocalStorage whenever bookings change
  useEffect(() => {
    localStorage.setItem('sbs-bookings', JSON.stringify(bookings));
  }, [bookings]);

  const handleBookingConfirm = (booking: Booking) => {
    const freshBooking = { ...booking, status: 'pending' as const };
    setBookings(prev => [...prev, freshBooking]);
    setLastBooking(freshBooking);
    setCurrentPage('confirmation');
  };

  const handleUpdateStatus = (id: string, status: 'pending' | 'approved') => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    setCurrentPage('login');
  };

  const handleNavigate = (page: Page | 'dashboard') => {
    // If navigating from login or signup, we need to handle user detection
    if ((currentPage === 'login' || currentPage === 'signup') && (page === 'home' || page === 'dashboard' || page === 'admin')) {
        const email = (window as any)._loginEmail || (window as any)._signupEmail || "user@example.com";
        const role = email.includes('admin') ? 'admin' : 'user';
        setCurrentUser({ email, role });
        setCurrentPage(role === 'admin' ? 'admin' : 'home');
        return;
    }

    if (page === 'dashboard') {
        setCurrentPage('home');
    } else {
        setCurrentPage(page as Page);
    }
  };

  // Simple Router
  if (currentPage === 'login') return <LoginPage onNavigate={handleNavigate as any} />;
  if (currentPage === 'signup') return <SignupPage onNavigate={handleNavigate as any} />;

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-black dark:text-white px-4 sm:px-6 md:px-12 pb-32 font-mono transition-colors duration-300 overflow-x-hidden">
      
      {/* Floating Navigation Bar */}
      <FloatingNav 
        onListView={() => {
            setCurrentPage('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onAdd={() => {
            setCurrentPage('booking');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onGridView={() => {
            setCurrentPage('admin');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        activeView={currentPage === 'admin' ? 'grid' : 'list'}
        userRole={currentUser?.role || 'user'}
      />

      <div className="max-w-[1100px] mx-auto">
        <Header onSignOut={handleSignOut} currentUser={currentUser} />

        <main className="animate-in fade-in duration-700">
            {currentPage === 'home' && (
                <Home onBookNow={() => setCurrentPage('booking')} />
            )}

            {currentPage === 'booking' && (
                <BookingPage 
                    onBack={() => setCurrentPage('home')} 
                    onConfirm={handleBookingConfirm} 
                    currentUser={currentUser}
                />
            )}

            {currentPage === 'confirmation' && lastBooking && (
                <ConfirmationPage 
                    booking={lastBooking} 
                    onHome={() => setCurrentPage('home')} 
                />
            )}

            {currentPage === 'admin' && currentUser && (
                <AdminDashboard 
                    bookings={bookings} 
                    currentUser={currentUser}
                    onUpdateStatus={handleUpdateStatus}
                    onBookNow={() => setCurrentPage('booking')}
                />
            )}
        </main>
      </div>
    </div>
  );
}

export default App;