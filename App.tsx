import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import FloatingNav from './components/FloatingNav';
import LoginPage from './components/auth/LoginPage';
import SignupPage from './components/auth/SignupPage';
import Home from './components/Home';
import BookingPage from './components/BookingPage';
import ConfirmationPage from './components/ConfirmationPage';
import AdminDashboard from './components/AdminDashboard';
import LandingPage from './components/LandingPage';
import AppTour from './components/AppTour';
import Grainient from './components/Grainient';
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

type Page = 'landing' | 'home' | 'booking' | 'confirmation' | 'admin' | 'login' | 'signup';

interface User {
  email: string;
  role: 'user' | 'admin';
}

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
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

  const [showTour, setShowTour] = useState(() => {
    return !localStorage.getItem('sbs-tour-completed');
  });

  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isAppLoading, setIsAppLoading] = useState(true);

  // App initialization sequence (Splash screen)
  const [isExiting, setIsExiting] = useState(false);
  const [isFullyEntered, setIsFullyEntered] = useState(false);
  const [showMainApp, setShowMainApp] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
        setIsExiting(true);
        setShowMainApp(true); // Only mount the app when fade starts
        
        // Start the focus fade slightly after exit begins
        setTimeout(() => {
            setIsFullyEntered(true);
        }, 100);
        
        setTimeout(() => {
            setIsAppLoading(false);
        }, 850); // 1.2s total transition window
    }, 5000); // 5s hold
    return () => clearTimeout(timer);
  }, []);

  const [loadingStep, setLoadingStep] = useState(0);
  useEffect(() => {
    if (isAppLoading) {
      const interval = setInterval(() => {
        setLoadingStep(prev => (prev < 4 ? prev + 1 : prev));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isAppLoading]);

  const loadingSteps = [
    "Establishing Secure Bridge",
    "Initializing Core Engine",
    "Synchronizing Data Nodes",
    "Optimizing Performance",
    "Architecture Ready"
  ];

  // Simulate data fetching on page changes
  useEffect(() => {
    if (currentPage === 'home' || currentPage === 'admin') {
        setIsDataLoading(true);
        const timer = setTimeout(() => setIsDataLoading(false), 1200);
        return () => clearTimeout(timer);
    }
  }, [currentPage]);

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

  const handleUpdateStatus = (id: string, status: 'pending' | 'approved' | 'cancelled') => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  const handleCancelBooking = (id: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' as const } : b));
  };

  const handleUpdateBooking = (updatedBooking: Booking) => {
    setBookings(prev => prev.map(b => b.id === updatedBooking.id ? updatedBooking : b));
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    setCurrentPage('login');
  };

  const handleTourComplete = () => {
    localStorage.setItem('sbs-tour-completed', 'true');
    setShowTour(false);
  };

  const handleNavigate = (page: Page | 'dashboard') => {
    // If navigating from login or signup, we need to handle user detection
    if ((currentPage === 'login' || currentPage === 'signup') && (page === 'home' || page === 'dashboard' || page === 'admin')) {
        const email = (window as any)._loginEmail || (window as any)._signupEmail || "user@example.com";
        const role = email.includes('admin') ? 'admin' : 'user';
        setCurrentUser({ email, role });
        
        // Re-check tour status on login/register
        setShowTour(!localStorage.getItem('sbs-tour-completed'));
        
        setCurrentPage(role === 'admin' ? 'admin' : 'home');
        return;
    }

    if (page === 'dashboard') {
        setCurrentPage('home');
    } else {
        setCurrentPage(page as Page);
    }
  };

  const renderContent = () => {
    let content;
    if (currentPage === 'landing') {
        content = <LandingPage onEnter={() => setCurrentPage('login')} />;
    } else if (currentPage === 'login') {
        content = <LoginPage onNavigate={handleNavigate as any} />;
    } else if (currentPage === 'signup') {
        content = <SignupPage onNavigate={handleNavigate as any} />;
    } else {
        content = (
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
                      <Home onBookNow={() => setCurrentPage('booking')} loading={isDataLoading} />
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
                          onCancelBooking={handleCancelBooking}
                          onUpdateBooking={handleUpdateBooking}
                          onBookNow={() => setCurrentPage('booking')}
                          loading={isDataLoading}
                      />
                  )}
              </main>
            </div>

            {showTour && currentUser && (
              <AppTour 
                onComplete={handleTourComplete} 
                steps={currentUser.role === 'admin' ? [
                  {
                    selector: "#tour-search",
                    title: "Neural Search",
                    description: "Instantly locate any booking in the network. Our high-performance indexer resolves queries with near-zero latency."
                  },
                  {
                    selector: "#tour-filters",
                    title: "Logic Gate Filters",
                    description: "Filter datasets by operational status. Toggle between pending and approved synchronization phases."
                  },
                  {
                    selector: "#tour-view-mode",
                    title: "Architecture Toggle",
                    description: "Switch between high-density grid layouts and focused list streams depending on your monitoring needs."
                  },
                  {
                    selector: "#tour-add-btn",
                    title: "Sequence Initialization",
                    description: "Initialize a manual booking node directly into the system architecture."
                  }
                ] : [
                  {
                    selector: "#tour-add-btn",
                    title: "Initialize Sequence",
                    description: "Launch your first booking. This bridge connects you directly to our temporal scheduling engine."
                  },
                  {
                    selector: "#tour-nav-dashboard",
                    title: "Operational Monitor",
                    description: "Track your personal data nodes. Monitor your synchronization status and approval logs in real-time."
                  },
                  {
                    selector: "#tour-nav-home",
                    title: "Main Terminal",
                    description: "Return to the central hub to synchronize your dashboard or view global system health."
                  }
                ]}
              />
            )}
          </div>
        );
    }

    if (!showMainApp) return null;

    // Apply first entrance focus-fade effect
    return (
        <div className={`transition-all duration-[2000ms] ease-out will-change-[filter,opacity] ${!isFullyEntered ? 'blur-2xl opacity-0 scale-95 translate-y-4' : 'blur-0 opacity-100 scale-100 translate-y-0'}`}>
            {content}
        </div>
    );
  };

  return (
    <>
      {/* Global High-Performance Visual Background */}
      <Grainient 
        className="fixed inset-0 z-0 pointer-events-none opacity-60" 
        color1="#001144" 
        color2="#0055ff" 
        color3="#000000"
        grainAmount={0.04}
        warpStrength={0.8}
        timeSpeed={0.4}
      />

      {isAppLoading && (
        <div className={`fixed inset-0 bg-[#020202]/90 backdrop-blur-sm flex flex-col items-center justify-center z-[10000] overflow-hidden transition-all duration-1000 ease-[cubic-bezier(0.87,0,0.13,1)] ${isExiting ? 'opacity-0 scale-110 blur-xl pointer-events-none' : 'opacity-100 scale-100 blur-0'}`}>
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
            
            <div className="relative flex flex-col items-center">
                {/* Logo Architecture */}
                <div className="w-24 h-24 mb-10 relative">
                    <div className="absolute inset-[-15px] bg-blue-600/20 rounded-[32px] blur-xl animate-pulse" />
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(37,99,235,0.4)] border border-blue-400/50">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                             <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                             <path d="M2 17l10 5 10-5"/>
                             <path d="M2 12l10 5 10-5"/>
                        </svg>
                    </div>
                </div>
                
                <div className="text-center px-6">
                    <h1 className="text-3xl font-black text-white uppercase tracking-[0.4em] mb-2 drop-shadow-sm">
                        Booking<span className="text-blue-500">.</span>App
                    </h1>
                    
                    <div className="flex flex-col items-center gap-4">
                        {/* Progress Bar Container */}
                        <div className="w-64 h-[2px] bg-zinc-900/50 rounded-full overflow-hidden border border-white/5">
                            <div className="h-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.8)] transition-all duration-1000 ease-out" style={{ width: `${(loadingStep + 1) * 20}%` }} />
                        </div>
                        
                        {/* Dynamic Status Display */}
                        <div className="h-6 flex items-center justify-center">
                            <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-[0.2em] animate-in fade-in slide-in-from-bottom-1 duration-700" key={loadingStep}>
                                {loadingSteps[loadingStep]}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Version Footer */}
            <div className={`absolute bottom-12 text-[9px] font-black text-zinc-700 uppercase tracking-[0.3em] transition-opacity duration-500 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
                System Release v1 • Secured Sequence
            </div>
        </div>
      )}

      {renderContent()}
    </>
  );
}

export default App;