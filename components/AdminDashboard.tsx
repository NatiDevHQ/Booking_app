import React, { useState, useMemo } from 'react';
import { Booking } from '../types';

interface AdminDashboardProps {
  bookings: Booking[];
  currentUser: { email: string; role: 'user' | 'admin' };
  onUpdateStatus: (id: string, status: 'pending' | 'approved') => void;
  onBookNow?: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ bookings, currentUser, onUpdateStatus, onBookNow }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const filteredBookings = useMemo(() => {
    let result = bookings;

    // 1. Role-based filtering
    if (currentUser.role === 'user') {
      result = result.filter(b => b.email === currentUser.email);
    }

    // 2. Status filtering (Admin only usually, but good to have for user too)
    if (statusFilter !== 'all') {
      result = result.filter(b => b.status === statusFilter);
    }

    // 3. Search query (Admin only usually)
    if (searchQuery.trim() !== '' && currentUser.role === 'admin') {
      const query = searchQuery.toLowerCase();
      result = result.filter(b => 
        b.name.toLowerCase().includes(query) || 
        b.email.toLowerCase().includes(query) ||
        b.date.includes(query)
      );
    }

    return result;
  }, [bookings, currentUser, searchQuery, statusFilter]);

  const isAdmin = currentUser.role === 'admin';

  return (
    <div className="py-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-black dark:text-white">
            {isAdmin ? 'Admin Dashboard' : 'My Bookings'}
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-mono">
            {isAdmin 
              ? `${filteredBookings.length} bookings found` 
              : `You have ${filteredBookings.length} booking${filteredBookings.length === 1 ? '' : 's'}`}
          </p>
        </div>

        {isAdmin ? (
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {/* Search Bar */}
            <div className="relative group">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input 
                type="text"
                placeholder="Search bookings..."
                className="pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:ring-2 ring-black dark:ring-white transition-all font-mono text-sm w-full sm:w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800">
               {(['all', 'pending', 'approved'] as const).map((status) => (
                 <button
                   key={status}
                   onClick={() => setStatusFilter(status)}
                   className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                     statusFilter === status 
                       ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm' 
                       : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'
                   }`}
                 >
                   {status}
                 </button>
               ))}
            </div>

            {/* View Toggle */}
            <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 gap-1 ml-auto md:ml-0">
               <button
                 onClick={() => setViewMode('list')}
                 className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-500'}`}
               >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="8" y1="6" x2="21" y2="6"></line>
                    <line x1="8" y1="12" x2="21" y2="12"></line>
                    <line x1="8" y1="18" x2="21" y2="18"></line>
                    <line x1="3" y1="6" x2="3.01" y2="6"></line>
                    <line x1="3" y1="12" x2="3.01" y2="12"></line>
                    <line x1="3" y1="18" x2="3.01" y2="18"></line>
                  </svg>
               </button>
               <button
                 onClick={() => setViewMode('grid')}
                 className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-500'}`}
               >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
               </button>
            </div>
          </div>
        ) : (
          <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 gap-1">
             <button
               onClick={() => setViewMode('list')}
               className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-500'}`}
             >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="8" y1="6" x2="21" y2="6"></line>
                  <line x1="8" y1="12" x2="21" y2="12"></line>
                  <line x1="8" y1="18" x2="21" y2="18"></line>
                  <line x1="3" y1="6" x2="3.01" y2="6"></line>
                  <line x1="3" y1="12" x2="3.01" y2="12"></line>
                  <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
             </button>
             <button
               onClick={() => setViewMode('grid')}
               className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-500'}`}
             >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
             </button>
          </div>
        )}
      </div>

      {filteredBookings.length === 0 ? (
        <div className="text-center py-24 bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 px-4">
            <div className="flex flex-col items-center gap-4 max-w-[400px] mx-auto">
                <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                        <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                    </svg>
                </div>
                <div>
                    <p className="text-zinc-500 dark:text-zinc-400 font-bold text-lg">No bookings found</p>
                    <p className="text-zinc-400 dark:text-zinc-500 text-sm font-mono mt-1">
                        {isAdmin ? "No bookings match your current filters." : "You haven't made any bookings yet."}
                    </p>
                </div>
                {!isAdmin && onBookNow && (
                    <button 
                        onClick={onBookNow}
                        className="mt-4 px-8 py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl hover:scale-105 transition-all active:scale-95 shadow-lg flex items-center gap-2"
                    >
                        Book a Slot Now
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </button>
                )}
            </div>
        </div>
      ) : viewMode === 'list' ? (
      <div className="w-full">
        <table className="w-full text-left border-separate border-spacing-y-3 min-w-[700px] md:min-w-0">
          <thead>
            <tr className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
              <th className="px-6 py-2">Name</th>
              <th className="px-6 py-2">Email</th>
              <th className="px-6 py-2">Date</th>
              <th className="px-6 py-2">Time Slot</th>
              <th className="px-6 py-2 text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking) => (
              <tr 
                key={booking.id} 
                className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl group transition-all duration-200 shadow-sm cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                onClick={() => setSelectedBooking(booking)}
              >
                <td className="px-6 py-5 first:rounded-l-2xl border-y border-l border-gray-100 dark:border-zinc-800/50">
                  <span className="font-bold text-black dark:text-white">{booking.name}</span>
                </td>
                <td className="px-6 py-5 border-y border-gray-100 dark:border-zinc-800/50">
                  <span className="text-zinc-500 dark:text-zinc-400 font-mono text-sm">{booking.email}</span>
                </td>
                <td className="px-6 py-5 border-y border-gray-100 dark:border-zinc-800/50">
                  <span className="font-bold text-black dark:text-white">{booking.date}</span>
                </td>
                <td className="px-6 py-5 border-y border-gray-100 dark:border-zinc-800/50">
                  <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-md font-bold text-xs uppercase tracking-tighter">
                    {booking.timeSlot}
                  </span>
                </td>
                <td className="px-6 py-5 last:rounded-r-2xl border-y border-r border-gray-100 dark:border-zinc-800/50 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full ${booking.status === 'approved' ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`} />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${booking.status === 'approved' ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
                      {booking.status}
                    </span>
                    
                    {isAdmin && (
                      <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            onUpdateStatus(booking.id, booking.status === 'approved' ? 'pending' : 'approved');
                        }}
                        className="ml-2 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 opacity-0 group-hover/nav:opacity-100 transition-opacity hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black"
                        title={booking.status === 'approved' ? 'Set to Pending' : 'Approve Booking'}
                      >
                        {booking.status === 'approved' ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        )}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
            {filteredBookings.map((booking) => (
                <div 
                    key={booking.id}
                    onClick={() => setSelectedBooking(booking)}
                    className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-6 rounded-[24px] shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer group relative overflow-hidden"
                >

                    
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center font-black text-black dark:text-white text-xl uppercase shadow-inner border border-zinc-200 dark:border-zinc-700">
                            {booking.name.charAt(0)}
                        </div>
                        <div className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-[0.2em] shadow-sm border ${booking.status === 'approved' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800'}`}>
                            {booking.status}
                        </div>
                    </div>

                    <h3 className="font-black text-xl text-black dark:text-white leading-tight mb-1 truncate tracking-tight">{booking.name}</h3>
                    <p className="text-zinc-400 dark:text-zinc-500 text-xs font-mono mb-8 truncate">{booking.email}</p>

                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-300">
                             <div className="w-8 h-8 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                             </div>
                             <span className="text-[11px] font-black uppercase tracking-wider">{booking.date}</span>
                        </div>
                        <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-300">
                             <div className="w-8 h-8 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                             </div>
                             <span className="text-[11px] font-black uppercase tracking-wider">{booking.timeSlot}</span>
                        </div>
                    </div>

                    {isAdmin && (
                        <div className="mt-8 flex justify-end gap-2 border-t border-zinc-100 dark:border-zinc-800/50 pt-5">
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onUpdateStatus(booking.id, booking.status === 'approved' ? 'pending' : 'approved');
                                }}
                                className="px-4 py-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black text-[9px] font-black uppercase tracking-[0.1em] hover:bg-black dark:hover:bg-zinc-200 transition-all shadow-md active:scale-95"
                            >
                                {booking.status === 'approved' ? 'Revoke Approval' : 'Approve Booking'}
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
      )}

      {/* Booking Detail Modal */}
      {selectedBooking && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setSelectedBooking(null)}>
              <div 
                className="bg-white dark:bg-zinc-900 rounded-[40px] w-full max-w-lg shadow-[0_0_80px_rgba(0,0,0,0.5)] overflow-hidden scale-100 animate-in zoom-in-95 duration-500 border border-zinc-200 dark:border-zinc-800 relative"
                onClick={(e) => e.stopPropagation()}
              >
                  {/* Decorative Background Elements */}
                  <div className={`absolute top-0 left-0 w-full h-32 opacity-10 ${selectedBooking.status === 'approved' ? 'bg-green-500' : 'bg-amber-500'}`} />
                  
                  {/* Modal Header */}
                  <div className="relative h-40 flex items-end px-10 pb-6">
                      <button 
                        onClick={() => setSelectedBooking(null)}
                        className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full text-black dark:text-white transition-all hover:rotate-90"
                      >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      </button>
                      <div className="flex flex-col">
                        <div className={`w-fit px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 shadow-sm border ${selectedBooking.status === 'approved' ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'}`}>
                            {selectedBooking.status}
                        </div>
                        <h3 className="text-4xl font-black text-black dark:text-white uppercase tracking-tighter leading-none">Booking<br/>Details</h3>
                      </div>
                  </div>

                  <div className="p-10 pt-4 space-y-10">
                      {/* Progress Line */}
                      <div className="flex gap-1">
                          <div className={`h-1.5 flex-1 rounded-full ${selectedBooking.status === 'approved' ? 'bg-green-500' : 'bg-amber-200 dark:bg-amber-900'}`} />
                          <div className={`h-1.5 flex-1 rounded-full ${selectedBooking.status === 'approved' ? 'bg-green-500' : 'bg-zinc-100 dark:bg-zinc-800'}`} />
                          <div className={`h-1.5 flex-1 rounded-full ${selectedBooking.status === 'approved' ? 'bg-green-500' : 'bg-zinc-100 dark:bg-zinc-800'}`} />
                      </div>

                      {/* Info Sections */}
                      <div className="space-y-8">
                          <div className="flex items-start gap-6">
                              <div className="w-14 h-14 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl flex items-center justify-center text-zinc-400 shadow-inner">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                              </div>
                              <div className="flex flex-col">
                                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-1">Customer Name</p>
                                  <p className="text-2xl font-black text-black dark:text-white tracking-tight">{selectedBooking.name}</p>
                              </div>
                          </div>

                          <div className="flex items-start gap-6">
                              <div className="w-14 h-14 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl flex items-center justify-center text-zinc-400 shadow-inner">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                              </div>
                              <div className="min-w-0 flex-1">
                                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-1">Contact Email</p>
                                  <p className="text-2xl font-black text-black dark:text-white truncate font-mono tracking-tighter">{selectedBooking.email}</p>
                              </div>
                          </div>

                          <div className="grid grid-cols-2 gap-8">
                              <div className="flex items-start gap-6">
                                  <div className="w-14 h-14 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl flex items-center justify-center text-zinc-400 shadow-inner">
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                  </div>
                                  <div className="flex flex-col">
                                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-1">Date</p>
                                      <p className="text-2xl font-black text-black dark:text-white tracking-tight">{selectedBooking.date}</p>
                                  </div>
                              </div>
                              <div className="flex items-start gap-6">
                                  <div className="w-14 h-14 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl flex items-center justify-center text-zinc-400 shadow-inner">
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                  </div>
                                  <div className="flex flex-col">
                                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-1">Time</p>
                                      <p className="text-2xl font-black text-black dark:text-white tracking-tight leading-none">{selectedBooking.timeSlot}</p>
                                  </div>
                              </div>
                          </div>
                      </div>

                      <div className="pt-6">
                          <button 
                            onClick={() => setSelectedBooking(null)}
                            className="w-full py-5 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-[0.2em] text-sm rounded-[24px] hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-2xl active:scale-[0.98] border-b-4 border-black/20 dark:border-white/20"
                          >
                            Close Detail
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default AdminDashboard;
